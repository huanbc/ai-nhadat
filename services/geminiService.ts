
import { GoogleGenAI, GenerateContentResponse, Type, Part } from "@google/genai";
import { DocumentTemplateKey, UploadedFiles, ExtractedData, UploadedFile, LandPrice, PartyData, LandData, Procedure } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY is not defined in environment variables");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// =================================================================
// Helper: Retry Logic
// =================================================================

async function callGeminiWithRetry(
    callFn: () => Promise<GenerateContentResponse>,
    retries = 3,
    baseDelay = 3000
): Promise<GenerateContentResponse> {
    let lastError;
    for (let i = 0; i < retries; i++) {
        try {
            return await callFn();
        } catch (error: any) {
            lastError = error;
            
            // Deep inspection of error object to catch 500s regardless of nesting
            const errorCode = error?.status || error?.code || error?.error?.code || error?.error?.status;
            const errorMessage = error?.message || error?.error?.message || JSON.stringify(error);
            
            const isInternalError = 
                errorMessage.includes("Internal error") || 
                errorMessage.includes("An internal error has occurred") ||
                errorCode === 500 || 
                errorCode === 503 || 
                errorCode === 429;

            if (isInternalError && i < retries - 1) {
                const delay = baseDelay * Math.pow(2, i);
                console.warn(`Gemini API Error (${errorCode || 'Unknown'}). Retrying attempt ${i + 1}/${retries} in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay)); // Exponential backoff
                continue;
            }
            
            // Treat 400 errors as fatal (Bad Request), do not retry
            if (errorCode === 400) {
                 throw error;
            }

            throw error; // Throw other errors immediately or if retries exhausted
        }
    }
    throw lastError;
}

// =================================================================
// Reusable Schemas for data extraction
// =================================================================

const partySchema = {
    type: Type.OBJECT,
    properties: {
        fullName: { type: Type.STRING, description: "Họ và tên đầy đủ, viết IN HOA." },
        dateOfBirth: { type: Type.STRING, description: "Ngày tháng năm sinh, định dạng DD/MM/YYYY." },
        sex: { type: Type.STRING, description: "Giới tính (Nam hoặc Nữ)." },
        nationality: { type: Type.STRING, description: "Quốc tịch, ví dụ: Việt Nam." },
        idNumber: { type: Type.STRING, description: "Số Căn cước công dân (CCCD)." },
        idIssueDate: { type: Type.STRING, description: "Ngày cấp CCCD, định dạng DD/MM/YYYY." },
        idIssuePlace: { type: Type.STRING, description: "Nơi cấp CCCD, ví dụ: Cục Cảnh sát quản lý hành chính về trật tự xã hội." },
        placeOfOrigin: { type: Type.STRING, description: "Quê quán." },
        permanentAddress: { type: Type.STRING, description: "Nơi thường trú." },
        phoneNumber: { type: Type.STRING, description: "Số điện thoại liên hệ (nếu có)." },
        taxCode: { type: Type.STRING, description: "Mã số thuế cá nhân (nếu có)." },
        dateOfDeath: { type: Type.STRING, description: "Ngày mất, định dạng DD/MM/YYYY. Chỉ điền cho người để lại di sản." },
        deathCertificateNumber: { type: Type.STRING, description: "Số giấy chứng tử. Chỉ điền cho người để lại di sản." },
        deathCertificateIssueDate: { type: Type.STRING, description: "Ngày cấp giấy chứng tử, định dạng DD/MM/YYYY. Chỉ điền cho người để lại di sản." },
        deathCertificateIssuer: { type: Type.STRING, description: "Nơi cấp giấy chứng tử. Chỉ điền cho người để lại di sản." },
        relationship: { type: Type.STRING, description: "Quan hệ với người để lại di sản (Bố đẻ, Mẹ đẻ, Vợ, Chồng, Con đẻ, Con nuôi...). Chỉ điền nếu xác định được." }
    },
};

const landSchema = {
    type: Type.OBJECT,
    properties: {
        certificateType: { type: Type.STRING, description: "Loại Giấy chứng nhận. Phải là một trong ba loại sau: 'Giấy chứng nhận quyền sử dụng đất', 'Giấy chứng nhận quyền sử dụng đất, quyền sở hữu nhà ở và tài sản khác gắn liền với đất', hoặc 'Giấy chứng nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất'." },
        certificateNumber: { type: Type.STRING, description: "Số Giấy chứng nhận" },
        certificateBookNumber: { type: Type.STRING, description: "Số vào sổ cấp Giấy chứng nhận" },
        certificateIssuer: { type: Type.STRING, description: "Nơi cấp Giấy chứng nhận" },
        certificateIssueDate: { type: Type.STRING, description: "Ngày cấp Giấy chứng nhận" },
        parcelNumber: { type: Type.STRING, description: "Số thửa đất" },
        mapSheetNumber: { type: Type.STRING, description: "Số tờ bản đồ" },
        address: { type: Type.STRING, description: "Địa chỉ thửa đất" },
        area: { type: Type.STRING, description: "Tổng diện tích đất (m2)" },
        commonArea: { type: Type.STRING, description: "Diện tích sử dụng chung (m2)" },
        privateArea: { type: Type.STRING, description: "Diện tích sử dụng riêng (m2)" },
        usagePurpose: { type: Type.STRING, description: "Mục đích sử dụng đất" },
        usageTerm: { type: Type.STRING, description: "Thời hạn sử dụng" },
        usageForm: { type: Type.STRING, description: "Hình thức sử dụng, ví dụ: Sử dụng riêng hoặc Sử dụng chung." },
        usageSource: { type: Type.STRING, description: "Nguồn gốc sử dụng. Ví dụ: 'Công nhận QSDĐ như giao đất có thu tiền sử dụng đất', 'Nhà nước giao đất không thu tiền sử dụng đất', v.v." },
        riceLandArea: { type: Type.STRING, description: "Tổng diện tích đất trồng lúa (LUC + LUK)." },
        annualCropLandArea: { type: Type.STRING, description: "Tổng diện tích đất trồng cây hàng năm khác (BHK, HNK)." },
        perennialTreeLandArea: { type: Type.STRING, description: "Tổng diện tích đất trồng cây lâu năm (CLN)." },
        aquacultureLandArea: { type: Type.STRING, description: "Tổng diện tích đất nuôi trồng thủy sản (NTS)." },
    },
};

const vehicleSchema = {
    type: Type.OBJECT,
    properties: {
        type: { type: Type.STRING, description: "Loại phương tiện (xe máy, ô tô, mô tô hai bánh, ...)." },
        brand: { type: Type.STRING, description: "Nhãn hiệu (Honda, Yamaha, Toyota...)." },
        color: { type: Type.STRING, description: "Màu sơn." },
        chassisNumber: { type: Type.STRING, description: "Số khung." },
        engineNumber: { type: Type.STRING, description: "Số máy." },
        licensePlate: { type: Type.STRING, description: "Biển số đăng ký (nếu có)." },
        manufactureYear: { type: Type.STRING, description: "Năm sản xuất." },
        registeredOwner: { type: Type.STRING, description: "Tên chủ xe trên giấy tờ." },
    }
}


// =================================================================
// Prompt and Schema Generation for each stage
// =================================================================

const getPromptAndSchemaForStage = (stage: string, templateKey: DocumentTemplateKey): { prompt: string, schema: any } => {
    let prompt = `Bạn là một trợ lý pháp lý chuyên nghiệp tại Việt Nam. Nhiệm vụ của bạn là trích xuất thông tin chính xác từ các tệp hình ảnh hoặc PDF được cung cấp để phục vụ việc soạn thảo văn bản theo **Luật Đất đai 2024**.
QUAN TRỌNG: Nếu có nhiều tệp được cung cấp, hãy trích xuất thông tin từ TẤT CẢ các tệp đó và tổng hợp lại vào một danh sách duy nhất. Một tệp PDF duy nhất có thể chứa nhiều trang và thông tin của nhiều người khác nhau; hãy đảm bảo bạn quét toàn bộ tệp và trích xuất tất cả các cá nhân có liên quan.

Vui lòng trả về kết quả dưới dạng một đối tượng JSON duy nhất, không có giải thích hay định dạng markdown.
Lưu ý: "Họ và tên" phải được viết IN HOA. Tất cả các trường ngày tháng phải theo định dạng DD/MM/YYYY. Nếu không tìm thấy thông tin, hãy để trường đó là chuỗi rỗng "".

`;
    let schema: any = {};
    const partyArraySchema = { type: Type.ARRAY, items: partySchema };
    const landArraySchema = { type: Type.ARRAY, items: landSchema };
    const vehicleArraySchema = { type: Type.ARRAY, items: vehicleSchema };
    
    switch (stage) {
        case 'partyA_id':
            prompt += `Bây giờ, hãy trích xuất thông tin từ (các) Căn cước công dân (CCCD) của Bên A (Bên bán/tặng cho/làm đơn).`;
            if (templateKey === DocumentTemplateKey.MATRIMONIAL_PROPERTY) {
                prompt += ` Đối với văn bản tài sản vợ chồng, Bên A bao gồm cả vợ và chồng. Hãy trích xuất thông tin của cả hai người.`;
            }
            schema = { type: Type.OBJECT, properties: { partyA: partyArraySchema } };
            break;

        case 'partyB_id':
            prompt += `Bây giờ, hãy trích xuất thông tin từ (các) Căn cước công dân (CCCD) của Bên B (Bên mua/nhận tặng cho).`;
            schema = { type: Type.OBJECT, properties: { partyB: partyArraySchema } };
            break;

        case 'heir_ids':
            prompt += `Bây giờ, hãy trích xuất thông tin từ (các) Căn cước công dân (CCCD) của tất cả những người thừa kế.`;
            if (templateKey === DocumentTemplateKey.HEIRS_CONFIRMATION) {
                prompt += ` Đối với đơn xác nhận hàng thừa kế, hãy cố gắng xác định mối quan hệ (Bố đẻ, Mẹ đẻ, Vợ, Chồng, Con đẻ) dựa trên tuổi tác và ngữ cảnh nếu có thể (nhưng ưu tiên trích xuất chính xác thông tin cá nhân).`;
            }
            schema = { type: Type.OBJECT, properties: { heirs: partyArraySchema } };
            break;

        case 'deathCertificates':
            prompt += `Bây giờ, hãy trích xuất thông tin từ (các) Giấy chứng tử của người để lại di sản. Các thông tin cần trích xuất bao gồm: Họ tên, ngày sinh, ngày mất, số giấy chứng tử, ngày cấp và nơi cấp.`;
            schema = { type: Type.OBJECT, properties: { deceasedPersons: partyArraySchema } };
            break;
        
        case 'landCertificate':
            prompt += `Bây giờ, hãy trích xuất thông tin chi tiết từ (các) Giấy chứng nhận quyền sử dụng đất (GCNQSDĐ). Đặc biệt chú ý đến:
- Tên gọi chính xác của Giấy chứng nhận (certificateType)
- Thông tin thửa đất (số thửa, tờ bản đồ, địa chỉ, diện tích, v.v.)
- Hình thức sử dụng, mục đích, thời hạn, và nguồn gốc sử dụng.
- Nếu có đất nông nghiệp, hãy trích xuất diện tích các loại đất (đất lúa, cây hàng năm, v.v.).`;
            schema = { type: Type.OBJECT, properties: { landInfo: landArraySchema } };
            break;

        case 'vehicleRegistration':
            prompt += `Bây giờ, hãy trích xuất thông tin chi tiết từ (các) Giấy đăng ký xe, hóa đơn mua xe hoặc sổ bảo hành. Hãy lấy chính xác:
            - Loại phương tiện (xe máy, ô tô...)
            - Nhãn hiệu, Màu sơn
            - Số khung, Số máy (quan trọng, hãy đọc kỹ)
            - Biển số xe (nếu có)
            - Năm sản xuất
            - Tên chủ xe đứng tên trên giấy tờ`;
            schema = { type: Type.OBJECT, properties: { vehicleInfo: vehicleArraySchema } };
            break;
            
        case 'contract':
             prompt += `Bây giờ, hãy trích xuất thông tin từ (các) Hợp đồng chuyển quyền được cung cấp. Ưu tiên lấy thông tin các bên và thông tin đất từ đây. Chỉ trích xuất thông tin của MỘT người đại diện cho mỗi bên (Bên A và Bên B).`;
             schema = { 
                 type: Type.OBJECT, 
                 properties: { 
                     partyA: partyArraySchema, 
                     partyB: partyArraySchema, 
                     landInfo: landArraySchema 
                 } 
             };
             break;

        default:
            prompt += `Hãy trích xuất thông tin liên quan từ các tài liệu được cung cấp.`;
            // FIX: Define schema even for default to prevent 500 errors
            schema = { type: Type.OBJECT, properties: { additionalInfo: { type: Type.STRING } } };
            break;
    }

    return { prompt, schema };
};

// =================================================================
// Main Extraction Function
// =================================================================

export const extractDataForStage = async (
    stage: string,
    files: UploadedFiles,
    templateKey: DocumentTemplateKey
): Promise<Partial<ExtractedData>> => {
    
    const { prompt, schema } = getPromptAndSchemaForStage(stage, templateKey);
    const imageParts: Part[] = [];

    const filesForStage = files[stage as keyof UploadedFiles];
    if (!filesForStage) {
        throw new Error(`Không tìm thấy file cho giai đoạn: ${stage}`);
    }

    const fileArray = Array.isArray(filesForStage) ? filesForStage : [filesForStage];

    for (const file of fileArray) {
        if (file) {
            imageParts.push({
                inlineData: {
                    mimeType: file.mimeType,
                    data: file.base64,
                },
            });
        }
    }

    if (imageParts.length === 0) {
        throw new Error("Không có tài liệu nào được tải lên cho giai đoạn này.");
    }

    try {
        const response = await callGeminiWithRetry(() => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }, ...imageParts] },
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        }));
        
        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as Partial<ExtractedData>;

    } catch (error) {
        console.error("Lỗi khi gọi Gemini API:", error);
        throw new Error("Không thể phân tích tài liệu. Vui lòng kiểm tra lại hình ảnh, đường truyền mạng và thử lại. (Lỗi máy chủ hoặc tài liệu quá mờ)");
    }
};

export const checkAndAnalyzeDocuments = async (
    files: UploadedFile[], 
    procedure: Procedure, 
    taxCheckOptions: { enabled: boolean; source: 'public' | 'internal' },
    additionalRequest: string,
    legalDocs: UploadedFile[],
    internalLandPrices: LandPrice[]
): Promise<string> => {
    
    const citizenFileNames = files.map(f => f.name).join(', ');
    const legalDocFileNames = legalDocs.map(f => f.name).join(', ');

    const initialPrompt = `Bạn là một trợ lý pháp lý AI chuyên nghiệp tại Việt Nam, chuyên thẩm định hồ sơ nhà đất dựa trên **LUẬT ĐẤT ĐAI 2024** và các văn bản hướng dẫn thi hành mới nhất.

**NGUYÊN TẮC CỐT LÕI:**
1. Mọi đánh giá về tính hợp lệ, đầy đủ phải dựa trên quy định của **Luật Đất đai 2024** (có hiệu lực từ 01/08/2024).
2. TUYỆT ĐỐI KHÔNG tham chiếu đến Luật Đất đai 2013 trừ khi người dùng yêu cầu so sánh.
3. Nếu thủ tục liên quan đến các nghị định, thông tư mới, hãy trích dẫn chính xác.

**Ngữ cảnh:** Người dùng đang chuẩn bị một bộ hồ sơ cho thủ tục sau: "${procedure.title}".

**Yêu cầu:** Hãy thực hiện các bước phân tích sau đây một cách cẩn thận và trả về kết quả dưới dạng một báo cáo có cấu trúc Markdown.`;

    const allParts: Part[] = [];

    // Add initial prompt part
    allParts.push({ text: initialPrompt });

    // Add citizen files description and parts
    allParts.push({ text: `\n\n**Hồ sơ của công dân cần thẩm định:**\n- ${citizenFileNames}\n` });
    files.forEach(file => {
        allParts.push({
            inlineData: {
                mimeType: file.mimeType,
                data: file.base64,
            }
        });
    });

    // Add legal docs description and parts if they exist
    if (legalDocs.length > 0) {
        allParts.push({ text: `\n\n**Tài liệu pháp lý tham chiếu (Dùng làm căn cứ chính):**\n- ${legalDocFileNames}\n` });
        legalDocs.forEach(file => {
            allParts.push({
                inlineData: {
                    mimeType: file.mimeType,
                    data: file.base64,
                }
            });
        });
    }

    let stepCounter = 3;
    let finalInstructions = `
**Bước 1: KIỂM TRA TÍNH NHẤT QUÁN CỦA THÔNG TIN (Trong hồ sơ công dân)**
- So sánh chéo thông tin cá nhân (Họ và tên, Ngày sinh, Số CCCD/CMND, Địa chỉ thường trú) và thông tin tài sản (Số thửa, Tờ bản đồ, Địa chỉ thửa đất, Diện tích) trên TẤT CẢ các tài liệu trong **Hồ sơ của công dân**.
- Liệt kê TẤT CẢ những điểm không nhất quán, dù là nhỏ nhất. Nêu rõ thông tin khác nhau ở tài liệu nào.
- Nếu tất cả thông tin đều khớp, hãy ghi rõ: "Thông tin trên các tài liệu nhất quán."

**Bước 2: KIỂM TRA TÍNH ĐẦY ĐỦ VÀ HỢP LỆ (THEO LUẬT ĐẤT ĐAI 2024)**
- **Nếu có "Tài liệu pháp lý tham chiếu" được cung cấp:** Hãy sử dụng các tài liệu này làm **NGUỒN THAM CHIẾU CHÍNH** để đánh giá hồ sơ của công dân.
- **Nếu không có "Tài liệu pháp lý tham chiếu":** Hãy sử dụng kiến thức về **Luật Đất đai 2024** và các văn bản hướng dẫn mới nhất.
- Dựa vào căn cứ trên, hãy đánh giá:
  a. **Tính đầy đủ:** Bộ hồ sơ của công dân đã có đủ các loại giấy tờ cần thiết cho thủ tục "${procedure.title}" chưa? Các giấy tờ yêu cầu theo quy định là: ${procedure.documents.map(d => `"${d}"`).join(', ')}. Nếu thiếu, hãy liệt kê những giấy tờ cần bổ sung.
  b. **Tính hợp lệ:** Xem xét nội dung các tài liệu trong hồ sơ công dân. Có điều khoản nào bất thường, mâu thuẫn, hoặc không tuân thủ theo quy định mới không? Ví dụ: Thời hạn sử dụng đất, điều kiện chuyển nhượng theo Luật 2024.

**Bước 3: KẾT LUẬN VÀ ĐỀ XUẤT**
- Đưa ra một kết luận tổng quan về tình trạng của bộ hồ sơ.
- Đề xuất các bước hành động cụ thể cho người dùng, ví dụ: "Cần làm thủ tục đính chính thông tin trên GCN QSDĐ tại Văn phòng Đăng ký đất đai", "Cần yêu cầu bên Bổ sung giấy xác nhận tình trạng hôn nhân", v.v.`;

    if (taxCheckOptions.enabled) {
        stepCounter++;
        let taxInstruction = '';
        if (taxCheckOptions.source === 'public') {
            taxInstruction = `
**Bước ${stepCounter}: KIỂM TRA TỜ KHAI THUẾ (SỬ DỤNG GOOGLE SEARCH)**
- **Chỉ thực hiện bước này nếu trong "Hồ sơ của công dân" có các tờ khai thuế (Tờ khai Lệ phí trước bạ, Tờ khai Thuế TNCN).**
- **Nếu có tờ khai thuế:**
    1. Trích xuất địa chỉ thửa đất (xã/phường, tên đường/khu vực) từ các tài liệu khác (ví dụ: GCN QSDĐ).
    2. Sử dụng công cụ tìm kiếm (Google Search) để tra cứu "Bảng giá đất tỉnh Quảng Ninh giai đoạn 2020-2024" cho địa chỉ đã trích xuất.
    3. So sánh đơn giá đất tra cứu được với giá trị được kê khai trên tờ khai thuế.
    4. Đưa ra nhận xét về tính hợp lý của số liệu kê khai. Nếu có chênh lệch đáng kể, hãy chỉ ra và lưu ý rằng đây là giá tham khảo theo bảng giá nhà nước, giá thực tế chuyển nhượng có thể khác.
- **Nếu không có tờ khai thuế:** Hãy ghi rõ "Bỏ qua Bước ${stepCounter} do không tìm thấy tờ khai thuế trong hồ sơ."`;
        } else { // 'internal'
            const priceDataContext = `
\n\n**Cơ sở dữ liệu giá đất nội bộ (để đối chiếu):**
Dưới đây là Bảng giá đất được cung cấp từ cơ sở dữ liệu của ứng dụng. Hãy chỉ sử dụng dữ liệu này để đối chiếu.
\`\`\`json
${JSON.stringify(internalLandPrices, null, 2)}
\`\`\`
`;
            allParts.push({ text: priceDataContext });

            taxInstruction = `
**Bước ${stepCounter}: KIỂM TRA TỜ KHAI THUẾ (SỬ DỤNG DỮ LIỆU CUNG CẤP)**
- **Chỉ thực hiện bước này nếu trong "Hồ sơ của công dân" có các tờ khai thuế.**
- **Nếu có tờ khai thuế:**
    1. Trích xuất địa chỉ thửa đất từ các tài liệu.
    2. **Tra cứu trong Bảng giá đất được cung cấp ở trên** để tìm đơn giá đất tương ứng.
    3. So sánh đơn giá đất tra cứu được với giá trị được kê khai trên tờ khai thuế.
    4. Đưa ra nhận xét về tính hợp lý của số liệu kê khai.
- **Nếu không có tờ khai thuế:** Hãy ghi rõ "Bỏ qua Bước ${stepCounter} do không tìm thấy tờ khai thuế trong hồ sơ."`;
        }
        finalInstructions += taxInstruction;
    }

    if (additionalRequest.trim()) {
        stepCounter++;
        const additionalRequestInstruction = `
**Bước ${stepCounter}: YÊU CẦU KIỂM TRA BỔ SUNG**
- Phân tích và đưa ra nhận xét về yêu cầu sau của người dùng: "${additionalRequest.trim()}"`;
        finalInstructions += additionalRequestInstruction;
    }

    const closingRemarks = `
**QUAN TRỌNG:**
- Trình bày câu trả lời hoàn toàn bằng tiếng Việt.
- Sử dụng định dạng Markdown rõ ràng với các tiêu đề đậm (ví dụ: **1. KIỂM TRA TÍNH NHẤT QUÁN**).
- Đưa ra những nhận xét chính xác, cụ thể và hữu ích dựa trên Luật Đất đai 2024.`;

    finalInstructions += closingRemarks;

    if (files.length === 0) {
        throw new Error("Không có tài liệu nào được cung cấp để kiểm tra.");
    }
    
    try {
        const config: any = {};
        if (taxCheckOptions.enabled && taxCheckOptions.source === 'public') {
            config.tools = [{ googleSearch: {} }];
        }
        
        const response = await callGeminiWithRetry(() => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: allParts },
            config: config,
        }));

        return response.text;
    } catch (error) {
        console.error("Lỗi khi gọi Gemini API để kiểm tra hồ sơ:", error);
        throw new Error("Không thể kiểm tra bộ hồ sơ. Vui lòng thử lại.");
    }
};


export const analyzeAndSummarizeDocument = async (file: UploadedFile): Promise<string> => {
    const prompt = `Bạn là một trợ lý pháp lý AI chuyên nghiệp tại Việt Nam, cập nhật đầy đủ **Luật Đất đai 2024**. Nhiệm vụ của bạn là phân tích một văn bản pháp lý (hợp đồng, quyết định, đơn từ, v.v.) được cung cấp dưới dạng hình ảnh hoặc PDF và đưa ra một bản tóm tắt súc tích, có cấu trúc rõ ràng.

Phân tích kỹ lưỡng tài liệu và trình bày kết quả theo định dạng Markdown sau:

**1. Loại văn bản:**
(Xác định rõ đây là loại văn bản gì, ví dụ: Hợp đồng chuyển nhượng QSDĐ, Quyết định thu hồi đất, Giấy triệu tập, Di chúc, v.v.)

**2. Các bên liên quan:**
(Liệt kê tất cả các cá nhân, tổ chức được đề cập trong văn bản cùng vai trò của họ, nếu có. Ví dụ:
- Bên A (Bên bán): Nguyễn Văn A
- Bên B (Bên mua): Trần Thị B
- Cơ quan ban hành: UBND huyện X)

**3. Nội dung chính:**
(Tóm tắt những điểm cốt lõi của văn bản. Trả lời các câu hỏi: Văn bản này nói về việc gì? Có những thỏa thuận, quyết định, hoặc yêu cầu chính nào? Bao gồm các thông tin quan trọng như giá trị, diện tích, địa chỉ, ngày tháng quan trọng.)

**4. Lưu ý pháp lý (Dựa trên Luật Đất đai 2024):**
(Nêu bật những điểm quan trọng cần chú ý từ góc độ pháp lý hiện hành. Ví dụ: Các nghĩa vụ về thuế, thời hạn cần tuân thủ, điều khoản phạt, những điểm bất thường hoặc có thể gây rủi ro theo quy định mới.)

Hãy đảm bảo câu trả lời ngắn gọn, chính xác, và dễ hiểu cho người không chuyên về luật.`;

    const filePart: Part = {
        inlineData: {
            mimeType: file.mimeType,
            data: file.base64,
        },
    };

    try {
        const response = await callGeminiWithRetry(() => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }, filePart] },
        }));

        return response.text;
    } catch (error) {
        console.error("Lỗi khi gọi Gemini API để phân tích văn bản:", error);
        throw new Error("Không thể phân tích văn bản. Vui lòng thử lại.");
    }
};


export const extractPriceDataFromDocument = async (file: UploadedFile): Promise<LandPrice[]> => {
    const prompt = `Bạn là một trợ lý AI chuyên trích xuất dữ liệu. Nhiệm vụ của bạn là phân tích tài liệu được cung cấp (hình ảnh hoặc PDF) chứa bảng giá đất và trích xuất thông tin một cách chính xác. Tài liệu này chứa các cột như 'Năm', 'Tỉnh/TP', 'Xã/Phường/Đặc khu', 'Mã loại đất', 'Loại đất', 'Mã đường', 'Đường', 'Mã đoạn', 'Đoạn đường', 'Mã vị trí', 'Vị trí', 'Giá đất', 'Hệ số điều chỉnh', 'Hệ số VHM', 'Ghi chú'.

Hãy trích xuất thông tin từ mỗi hàng của bảng và định dạng nó theo cấu trúc JSON sau cho mỗi mục:
- "streetName": Nối cột "Đường" và "Loại đất" để tạo tên chung, giúp dễ tìm kiếm. Ví dụ: 'Đất ở nông thôn - Xã Kỳ Thượng (xã Đạp Thanh cũ)'.
- "section": Lấy từ cột "Đoạn đường".
- "position": Lấy từ cột "Vị trí".
- "price": Lấy từ cột "Giá đất". Đây phải là một số, loại bỏ dấu phẩy hoặc ký hiệu tiền tệ.
- "commune": Lấy từ cột "Xã/Phường/Đặc khu".
- "sectionCode": Lấy từ cột "Mã đoạn".
- "adjustmentFactor": Lấy từ cột "Hệ số điều chỉnh". Đây là một số.
- "vhmFactor": Lấy từ cột "Hệ số VHM". Đây là một số.
- "notes": Lấy từ cột "Ghi chú".

Trả về một mảng các đối tượng JSON này. Nếu không tìm thấy dữ liệu, trả về một mảng rỗng.`;

    const priceSchema = {
        type: Type.OBJECT,
        properties: {
            streetName: { type: Type.STRING, description: "Tên đường hoặc khu vực chung." },
            section: { type: Type.STRING, description: "Mô tả đoạn đường hoặc khu vực cụ thể." },
            position: { type: Type.STRING, description: "Vị trí của thửa đất (ví dụ: Toàn đường/đoạn)." },
            price: { type: Type.NUMBER, description: "Đơn giá đất, chỉ lấy số." },
            commune: { type: Type.STRING, description: "Lấy từ cột 'Xã/Phường/Đặc khu'." },
            sectionCode: { type: Type.STRING, description: "Lấy từ cột 'Mã đoạn'." },
            adjustmentFactor: { type: Type.NUMBER, description: "Lấy từ cột 'Hệ số điều chỉnh'." },
            vhmFactor: { type: Type.NUMBER, description: "Lấy từ cột 'Hệ số VHM'." },
            notes: { type: Type.STRING, description: "Lấy từ cột 'Ghi chú'." }
        }
    };

    const responseSchema = {
        type: Type.ARRAY,
        items: priceSchema
    };

    const filePart: Part = {
        inlineData: {
            mimeType: file.mimeType,
            data: file.base64,
        },
    };

    try {
        const response = await callGeminiWithRetry(() => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }, filePart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        }));
        
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        
        if (Array.isArray(result)) {
            return result as LandPrice[];
        }
        console.error("Extracted data is not an array:", result);
        return [];

    } catch (error) {
        console.error("Lỗi khi gọi Gemini API để trích xuất giá đất:", error);
        throw new Error("Không thể phân tích tài liệu giá đất. Vui lòng thử lại.");
    }
};

export const analyzeTemplateContent = async (templateContent: string, templateTypeTitle: string): Promise<string> => {
    const prompt = `Bạn là một trợ lý pháp lý AI chuyên nghiệp và là chuyên gia về cú pháp mẫu văn bản tại Việt Nam, am hiểu **Luật Đất đai 2024**.
Nhiệm vụ của bạn là phân tích mẫu văn bản sau đây, được sử dụng cho việc soạn thảo "${templateTypeTitle}".

Hãy kiểm tra các yếu tố sau:
1.  **Cú pháp Placeholder:** Xác minh rằng tất cả các placeholder (biến giữ chỗ) có dạng \`{{...}}\` là hợp lệ. Các placeholder hợp lệ bao gồm: {{documentDate.day}}, {{partyA_list}}, {{landInfo[0].address}}, v.v. Tìm kiếm các lỗi cú pháp như dấu ngoặc nhọn bị thiếu, sai tên placeholder.
2.  **Nội dung pháp lý (Theo Luật Đất đai 2024):** Đánh giá ngôn ngữ và các điều khoản pháp lý. Mẫu có phù hợp với quy định hiện hành của Luật Đất đai 2024 không? (ví dụ: thuật ngữ, căn cứ pháp lý, quyền và nghĩa vụ). Ngôn từ có rõ ràng, chặt chẽ không?
3.  **Cấu trúc:** Mẫu có cấu trúc logic, dễ đọc không? Nếu là HTML, cấu trúc có hợp lệ không?

**Định dạng đầu ra:**
- Bắt đầu bằng một đánh giá tổng quan: "MẪU TỐT", "CẦN CẢI THIỆN", hoặc "CÓ LỖI NGHIÊM TRỌNG".
- Sau đó, liệt kê các điểm cần chú ý hoặc đề xuất cải thiện dưới dạng gạch đầu dòng.
- Nếu không tìm thấy vấn đề gì, hãy trả về một câu xác nhận tích cực.
- Giữ câu trả lời súc tích và tập trung vào các đề xuất hữu ích.

Dưới đây là nội dung mẫu cần phân tích:\n\n---\n\n${templateContent}`;

    try {
        const response = await callGeminiWithRetry(() => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }] },
        }));
        return response.text;
    } catch (error) {
        console.error("Lỗi khi gọi Gemini API để phân tích mẫu:", error);
        throw new Error("Không thể phân tích mẫu. Vui lòng thử lại.");
    }
};

export const fixTemplateContent = async (templateContent: string, analysisResult: string, templateTypeTitle: string): Promise<string> => {
    const prompt = `Bạn là một trợ lý pháp lý AI chuyên nghiệp, chuyên gia về cú pháp mẫu văn bản HTML và **Luật Đất đai 2024**.
Nhiệm vụ của bạn là sửa đổi và cải thiện mẫu văn bản được cung cấp, dựa trên kết quả phân tích trước đó và đảm bảo tuân thủ luật mới nhất.

Dưới đây là nội dung mẫu gốc cho văn bản "${templateTypeTitle}":
--- TEMPLATE GỐC ---
${templateContent}
--- KẾT THÚC TEMPLATE GỐC ---

Và đây là kết quả phân tích cùng với các đề xuất cải thiện:
--- PHÂN TÍCH & ĐỀ XUẤT ---
${analysisResult}
--- KẾT THÚC PHÂN TÍCH & ĐỀ XUẤT ---

Dựa vào những phân tích và đề xuất trên, hãy viết lại TOÀN BỘ nội dung mẫu để sửa tất cả các lỗi đã được xác định và áp dụng các cải tiến phù hợp với Luật Đất đai 2024.

**QUY TẮC QUAN TRỌNG:**
-   Đầu ra của bạn PHẢI CHỈ LÀ nội dung mẫu đã được sửa đổi hoàn chỉnh.
-   Cập nhật các căn cứ pháp lý (nếu có trong mẫu) sang Luật Đất đai 2024, Luật Kinh doanh Bất động sản 2023, Luật Nhà ở 2023.
-   KHÔNG được thêm bất kỳ lời giải thích, bình luận, hay định dạng markdown nào xung quanh nội dung mẫu.
-   Đầu ra phải sẵn sàng để sử dụng ngay lập tức.`;

    try {
        const response = await callGeminiWithRetry(() => ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts: [{ text: prompt }] },
        }));

        let fixedContent = response.text.trim();
        // Clean potential markdown code blocks from the response
        if (fixedContent.startsWith('```html')) {
            fixedContent = fixedContent.substring(7, fixedContent.length - 3).trim();
        } else if (fixedContent.startsWith('```')) {
             fixedContent = fixedContent.substring(3, fixedContent.length - 3).trim();
        }
        
        return fixedContent;
    } catch (error) {
        console.error("Lỗi khi gọi Gemini API để sửa mẫu:", error);
        throw new Error("Không thể tự động sửa mẫu. Vui lòng thử lại.");
    }
};

export const extractTextFromPdf = async (file: UploadedFile): Promise<string> => {
    const prompt = `Bạn là một trợ lý AI chuyên trích xuất văn bản. Nhiệm vụ của bạn là trích xuất TOÀN BỘ nội dung văn bản từ tệp PDF được cung cấp.
Hãy cố gắng giữ lại định dạng gốc càng nhiều càng tốt, bao gồm cả dấu ngắt dòng và đoạn văn.
QUAN TRỌNG: Chỉ trả về nội dung văn bản thuần túy. KHÔNG thêm bất kỳ lời giải thích, bình luận hay định dạng markdown nào.`;

    const filePart: Part = {
        inlineData: {
            mimeType: file.mimeType,
            data: file.base64,
        },
    };

    try {
        const response = await callGeminiWithRetry(() => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }, filePart] },
        }));

        return response.text;
    } catch (error) {
        console.error("Lỗi khi gọi Gemini API để trích xuất văn bản từ PDF:", error);
        throw new Error("Không thể trích xuất văn bản từ tệp PDF. Vui lòng thử lại với tệp khác hoặc đảm bảo tệp có nội dung văn bản.");
    }
};

export const analyzeDirectiveDocuments = async (files: UploadedFile[]): Promise<string> => {
    const prompt = `Bạn là một trợ lý hành chính AI chuyên nghiệp tại Việt-Nam. Nhiệm vụ của bạn là phân tích và tóm tắt (các) văn bản chỉ đạo được cung cấp (công văn, quyết định, thông báo, ...).
Hãy đọc kỹ TẤT CẢ các tài liệu và đưa ra một bản tóm tắt có cấu trúc Markdown rõ ràng như sau:

**1. Thông tin chung:**
- **Số/Ký hiệu:** (Trích xuất số và ký hiệu của văn bản, ví dụ: 123/CV-UBND)
- **Ngày ban hành:** (Trích xuất ngày tháng năm ban hành)
- **Cơ quan ban hành/Người chỉ đạo:** (Trích xuất tên cơ quan hoặc người có thẩm quyền ký/chỉ đạo)

**2. Nội dung chỉ đạo chính:**
(Tóm tắt súc tích yêu cầu cốt lõi, mục tiêu chính của văn bản)

**3. Nhiệm vụ cụ thể được giao:**
(Liệt kê các đầu việc, yêu cầu cụ thể mà người nhận văn bản phải thực hiện)

**4. Thời hạn hoàn thành:**
(Ghi rõ thời hạn/deadline được nêu trong văn bản. Nếu không có, ghi "Không nêu rõ")

**QUAN TRỌNG:** Nếu có nhiều văn bản, hãy tổng hợp thông tin từ tất cả chúng vào một bản phân tích duy nhất.`;

    const parts: Part[] = [{ text: prompt }];
    for (const file of files) {
        parts.push({
            inlineData: {
                mimeType: file.mimeType,
                data: file.base64,
            },
        });
    }

    try {
        const response = await callGeminiWithRetry(() => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: parts },
        }));
        return response.text;
    } catch (error) {
        console.error("Lỗi khi gọi Gemini API để phân tích văn bản chỉ đạo:", error);
        throw new Error("Không thể phân tích văn bản chỉ đạo. Vui lòng thử lại.");
    }
};

export const generateDirectiveResponse = async (
    directiveFiles: UploadedFile[],
    templateFile: UploadedFile | null,
    userNotes: string
): Promise<string> => {
    const parts: Part[] = [];

    const prompt = `Bạn là một trợ lý hành chính chuyên nghiệp tại Việt Nam. Nhiệm vụ của bạn là soạn thảo một văn bản phản hồi/báo cáo chính thức dựa trên (các) văn bản chỉ đạo và các ghi chú thực hiện công việc.

**Phân tích các tài liệu sau:**
1.  **Văn bản chỉ đạo:** Đây là (các) văn bản từ cấp trên yêu cầu thực hiện công việc. Hãy tổng hợp thông tin từ tất cả các văn bản chỉ đạo được cung cấp.
2.  **Văn bản mẫu (nếu có):** Đây là mẫu định dạng cho văn bản phản hồi. Nếu không có, hãy sử dụng thể thức văn bản hành chính chuẩn của Việt Nam (Quốc hiệu, Tiêu ngữ, Tên cơ quan, Số/Ký hiệu, Địa danh, ngày tháng, Tên loại văn bản, Trích yếu, Kính gửi, nội dung, nơi nhận, chữ ký).
3.  **Ghi chú của người dùng:** Đây là thông tin về kết quả và quá trình thực hiện công việc.

**Yêu cầu:**
-   **Tuân thủ mẫu:** Soạn thảo văn bản phản hồi theo đúng mẫu được cung cấp (nếu có).
-   **Trích xuất thông tin:** Lấy các thông tin cần thiết từ (các) văn bản chỉ đạo (như "Kính gửi", số, ký hiệu, ngày tháng, trích yếu) để đưa vào văn bản phản hồi một cách hợp lý.
-   **Tổng hợp nội dung:** Chuyển đổi các ghi chú của người dùng thành ngôn ngữ hành chính, trang trọng và đưa vào phần nội dung chính của văn bản phản hồi.
-   **Định dạng Quốc hiệu:** QUAN TRỌNG: Khi tạo Quốc hiệu, hãy đảm bảo dòng "CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM" được in đậm bằng thẻ <strong>.
-   **Hoàn chỉnh:** Tạo ra một văn bản hoàn chỉnh, sẵn sàng để trình ký.

**ĐẦU RA CHỈ LÀ NỘI DUNG VĂN BẢN PHẢN HỒI HOÀN CHỈNH. KHÔNG THÊM BẤT KỲ LỜI GIẢI THÍCH NÀO.**`;
    
    parts.push({ text: prompt });

    // Add directive files
    parts.push({ text: `\n\n--- VĂN BẢN CHỈ ĐẠO (${directiveFiles.length} tệp) ---` });
    for (const file of directiveFiles) {
        parts.push({ inlineData: { mimeType: file.mimeType, data: file.base64 } });
    }

    // Add template file if exists
    if (templateFile) {
        parts.push({ text: "\n\n--- VĂN BẢN MẪU ĐỂ SỬ DỤNG ---" });
        parts.push({ inlineData: { mimeType: templateFile.mimeType, data: templateFile.base64 } });
    }

    // Add user notes
    parts.push({ text: `\n\n--- GHI CHÚ CỦA NGƯỜI DÙNG VỀ KẾT QUẢ CÔNG VIỆC --- \n${userNotes}` });

    try {
        const response = await callGeminiWithRetry(() => ai.models.generateContent({
            model: 'gemini-2.5-pro', // Use a more powerful model for this complex task
            contents: { parts: parts },
        }));

        return response.text;
    } catch (error) {
        console.error("Lỗi khi gọi Gemini API để tạo văn bản phản hồi:", error);
        throw new Error("Không thể tạo văn bản phản hồi. Vui lòng thử lại.");
    }
};

export const quickExtractPersonalInfo = async (file: UploadedFile): Promise<string> => {
    const prompt = `🌟 Prompt Đề xuất: Trích xuất và Định dạng Thông tin Cá nhân
Tôi sẽ cung cấp cho bạn một tài liệu dưới dạng [HÌNHẢNH HOẶC TỆP PDF] chứa danh sách thông tin cá nhân (thông tin trên Căn cước công dân, căn cước hoặc giấy tờ tùy thân).

**YÊU CẦU TRÍCH XUẤT DỮ LIỆU:**
Hãy đóng vai trò là công cụ trích xuất dữ liệu và nhập liệu.
1.  **Trích xuất** đầy đủ các trường thông tin sau cho MỖI cá nhân có trong tài liệu:
    * Họ và tên
    * Năm sinh
    * Số CCCD (hoặc CMND/ID)
    * Ngày cấp
    * Nơi cấp
2.  **Xác định** xưng hô phù hợp (Ông/Bà) dựa trên tên (ví dụ: Thị -> Bà; Văn -> Ông).
3.  **Lưu ý:** Nếu có bất kỳ trường thông tin nào bị thiếu hoặc không rõ ràng, hãy ghi rõ là "(không rõ chi tiết)" cho trường đó.

**ĐỊNH DẠNG ĐẦU RA MONG MUỐN:**
Sắp xếp dữ liệu thành một danh sách được đánh số thứ tự liên tục. Mỗi mục (mỗi người) phải được trình bày trên một dòng duy nhất và các trường thông tin được ngăn cách bằng dấu phẩy (\`,\`).

**Định dạng chuẩn phải là:**
[STT]. [Xưng hô]: [Họ và tên], năm sinh: [Năm sinh], Số CCCD: [Số CCCD], ngày cấp: [Ngày cấp], nơi cấp: [Nơi cấp].`;

    const filePart: Part = {
        inlineData: {
            mimeType: file.mimeType,
            data: file.base64,
        },
    };

    try {
        const response = await callGeminiWithRetry(() => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }, filePart] },
        }));

        return response.text;
    } catch (error) {
        console.error("Lỗi khi gọi Gemini API để trích xuất thông tin nhanh:", error);
        throw new Error("Không thể trích xuất thông tin. Vui lòng thử lại.");
    }
};

export const consultWithAI = async (
    query: string,
    field: 'land2024' | 'other' | 'general',
    file: UploadedFile | null
): Promise<string> => {
    let systemInstruction = `Bạn là một trợ lý pháp lý chuyên nghiệp tại Việt Nam.`;
    const tools: any[] = [];

    if (field === 'land2024') {
        systemInstruction += `
QUY TẮC QUAN TRỌNG (Lĩnh vực A - Luật Đất đai 2024):
1. Chỉ sử dụng Luật Đất đai số 31/2024/QH15 (có hiệu lực từ 01/08/2024) và các Nghị định/Thông tư hướng dẫn mới nhất.
2. TUYỆT ĐỐI KHÔNG sử dụng, trích dẫn Luật Đất đai 2013 đã hết hiệu lực.
3. Trích dẫn cụ thể điều khoản (Ví dụ: Khoản 1 Điều 24 Luật Đất đai 2024).`;
    } else {
        systemInstruction += `
QUY TẮC QUAN TRỌNG (Lĩnh vực B/C - Pháp luật khác/Tổng hợp):
1. Tự tìm kiếm và sử dụng tài liệu pháp luật liên quan mới nhất có hiệu lực tại thời điểm hiện tại (năm 2024/2025).
2. Ví dụ: Luật Xây dựng 2020, Luật Kinh doanh Bất động sản 2023, Luật Nhà ở 2023.
3. Tuyệt đối không trả lời bằng các văn bản đã hết hiệu lực.`;
        tools.push({ googleSearch: {} });
    }

    systemInstruction += `
CẤU TRÚC CÂU TRẢ LỜI:
1. Tóm tắt Vấn đề: Nhắc lại vấn đề cốt lõi.
2. Cơ sở Pháp lý: Tên văn bản, số, năm ban hành, điều khoản.
3. Tư vấn Giải pháp: Trình bày rõ ràng, từng bước.
4. Khuyến nghị/Lưu ý: Lời khuyên về rủi ro hoặc bước tiếp theo.`;

    let requestContents;
    const textPart = `Người hỏi (Lĩnh vực: ${field}): ${query}`;

    if (file) {
        requestContents = {
            parts: [
                { text: textPart },
                {
                    inlineData: {
                        mimeType: file.mimeType,
                        data: file.base64,
                    },
                },
            ],
        };
    } else {
        requestContents = { parts: [{ text: textPart }] };
    }

    try {
        const response = await callGeminiWithRetry(() => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: requestContents,
            config: {
                systemInstruction,
                tools: tools.length > 0 ? tools : undefined,
                // Note: responseMimeType cannot be JSON when using googleSearch
            },
        }));
        return response.text;
    } catch (error: any) {
        console.error("Lỗi khi gọi Gemini API để tham vấn:", error);
        throw new Error(`Không thể trả lời câu hỏi. Lỗi: ${error.message || 'Lỗi không xác định'}`);
    }
};
