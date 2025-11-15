import { GoogleGenAI, GenerateContentResponse, Type, Part } from "@google/genai";
import { DocumentTemplateKey, UploadedFiles, ExtractedData, UploadedFile, LandPrice, PartyData, LandData } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY is not defined in environment variables");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

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


// =================================================================
// Prompt and Schema Generation for each stage
// =================================================================

const getPromptAndSchemaForStage = (stage: string, templateKey: DocumentTemplateKey): { prompt: string, schema: any } => {
    let prompt = `Bạn là một trợ lý pháp lý chuyên nghiệp tại Việt Nam. Nhiệm vụ của bạn là trích xuất thông tin chính xác từ các tệp hình ảnh hoặc PDF được cung cấp.
QUAN TRỌNG: Nếu có nhiều tệp được cung cấp, hãy trích xuất thông tin từ TẤT CẢ các tệp đó và tổng hợp lại vào một danh sách duy nhất. Một tệp PDF duy nhất có thể chứa nhiều trang và thông tin của nhiều người khác nhau; hãy đảm bảo bạn quét toàn bộ tệp và trích xuất tất cả các cá nhân có liên quan.

Vui lòng trả về kết quả dưới dạng một đối tượng JSON duy nhất, không có giải thích hay định dạng markdown.
Lưu ý: "Họ và tên" phải được viết IN HOA. Tất cả các trường ngày tháng phải theo định dạng DD/MM/YYYY. Nếu không tìm thấy thông tin, hãy để trường đó là chuỗi rỗng "".

`;
    let schema: any = {};
    const partyArraySchema = { type: Type.ARRAY, items: partySchema };
    const landArraySchema = { type: Type.ARRAY, items: landSchema };
    
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
            schema = { type: Type.OBJECT, properties: {} }; // Fallback schema
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
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }, ...imageParts] },
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        
        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as Partial<ExtractedData>;

    } catch (error) {
        console.error("Lỗi khi gọi Gemini API:", error);
        throw new Error("Không thể phân tích tài liệu. Vui lòng kiểm tra lại hình ảnh và thử lại.");
    }
};


export const analyzeAndSummarizeDocument = async (file: UploadedFile): Promise<string> => {
    const prompt = `Bạn là một trợ lý pháp lý AI chuyên nghiệp tại Việt Nam. Nhiệm vụ của bạn là phân tích một văn bản pháp lý (hợp đồng, quyết định, đơn từ, v.v.) được cung cấp dưới dạng hình ảnh hoặc PDF và đưa ra một bản tóm tắt súc tích, có cấu trúc rõ ràng.

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

**4. Lưu ý pháp lý:**
(Nêu bật những điểm quan trọng cần chú ý từ góc độ pháp lý. Ví dụ: Các nghĩa vụ về thuế, thời hạn cần tuân thủ, điều khoản phạt, những điểm bất thường hoặc có thể gây rủi ro.)

Hãy đảm bảo câu trả lời ngắn gọn, chính xác, và dễ hiểu cho người không chuyên về luật.`;

    const filePart: Part = {
        inlineData: {
            mimeType: file.mimeType,
            data: file.base64,
        },
    };

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }, filePart] },
        });

        return response.text;
    } catch (error) {
        console.error("Lỗi khi gọi Gemini API để phân tích văn bản:", error);
        throw new Error("Không thể phân tích văn bản. Vui lòng thử lại với hình ảnh rõ nét hơn hoặc một file khác.");
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
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }, filePart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
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
    const prompt = `Bạn là một trợ lý pháp lý AI chuyên nghiệp và là chuyên gia về cú pháp mẫu văn bản tại Việt Nam.
Nhiệm vụ của bạn là phân tích mẫu văn bản sau đây, được sử dụng cho việc soạn thảo "${templateTypeTitle}".

Hãy kiểm tra các yếu tố sau:
1.  **Cú pháp Placeholder:** Xác minh rằng tất cả các placeholder (biến giữ chỗ) có dạng \`{{...}}\` là hợp lệ. Các placeholder hợp lệ bao gồm: {{documentDate.day}}, {{partyA_list}}, {{landInfo[0].address}}, v.v. Tìm kiếm các lỗi cú pháp như dấu ngoặc nhọn bị thiếu, sai tên placeholder.
2.  **Nội dung pháp lý:** Đánh giá ngôn ngữ pháp lý. Mẫu có chứa các điều khoản thiết yếu cho một "${templateTypeTitle}" không? (ví dụ: đối tượng hợp đồng, quyền và nghĩa vụ các bên, điều khoản thanh toán, giải quyết tranh chấp, cam đoan của các bên, hiệu lực hợp đồng). Ngôn từ có rõ ràng, chặt chẽ không?
3.  **Cấu trúc:** Mẫu có cấu trúc logic, dễ đọc không? Nếu là HTML, cấu trúc có hợp lệ không?

**Định dạng đầu ra:**
- Bắt đầu bằng một đánh giá tổng quan: "MẪU TỐT", "CẦN CẢI THIỆN", hoặc "CÓ LỖI NGHIÊM TRỌNG".
- Sau đó, liệt kê các điểm cần chú ý hoặc đề xuất cải thiện dưới dạng gạch đầu dòng.
- Nếu không tìm thấy vấn đề gì, hãy trả về một câu xác nhận tích cực.
- Giữ câu trả lời súc tích và tập trung vào các đề xuất hữu ích.

Dưới đây là nội dung mẫu cần phân tích:\n\n---\n\n${templateContent}`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }] },
        });
        return response.text;
    } catch (error) {
        console.error("Lỗi khi gọi Gemini API để phân tích mẫu:", error);
        throw new Error("Không thể phân tích mẫu. Vui lòng thử lại.");
    }
};

export const fixTemplateContent = async (templateContent: string, analysisResult: string, templateTypeTitle: string): Promise<string> => {
    const prompt = `Bạn là một trợ lý pháp lý AI chuyên nghiệp và là chuyên gia về cú pháp mẫu văn bản HTML tại Việt Nam.
Nhiệm vụ của bạn là sửa đổi và cải thiện mẫu văn bản được cung cấp, dựa trên kết quả phân tích trước đó.

Dưới đây là nội dung mẫu gốc cho văn bản "${templateTypeTitle}":
--- TEMPLATE GỐC ---
${templateContent}
--- KẾT THÚC TEMPLATE GỐC ---

Và đây là kết quả phân tích cùng với các đề xuất cải thiện:
--- PHÂN TÍCH & ĐỀ XUẤT ---
${analysisResult}
--- KẾT THÚC PHÂN TÍCH & ĐỀ XUẤT ---

Dựa vào những phân tích và đề xuất trên, hãy viết lại TOÀN BỘ nội dung mẫu để sửa tất cả các lỗi đã được xác định và áp dụng các cải tiến.

**QUY TẮC QUAN TRỌNG:**
-   Đầu ra của bạn PHẢI CHỈ LÀ nội dung mẫu đã được sửa đổi hoàn chỉnh.
-   KHÔNG được thêm bất kỳ lời giải thích, bình luận, hay định dạng markdown nào xung quanh nội dung mẫu.
-   Đầu ra phải sẵn sàng để sử dụng ngay lập tức.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts: [{ text: prompt }] },
        });

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
