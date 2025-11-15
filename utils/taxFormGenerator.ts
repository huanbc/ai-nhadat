import { ExtractedData, PartyData, LandData } from '../types';

// =================================================================
// HELPERS
// =================================================================
const docStyle = `font-family: 'Times New Roman', Times, serif; font-size: 13pt; color: black; line-height: 1.5;`;
const tableStyle = `width: 100%; border-collapse: collapse; margin-top: 5px; border: 1px solid black;`;
const tdStyle = `border: 1px solid black; padding: 5px; vertical-align: top;`;
const tdNoBorderStyle = `border: none; padding: 5px; vertical-align: top;`;
const tdBoldStyle = `${tdStyle} font-weight: bold;`;
const tdCenterStyle = `${tdStyle} text-align: center;`;
const headerStyle = `text-align: center; font-weight: bold;`;
const checkbox = (checked: boolean) => `<span style="font-family: DejaVu Sans, sans-serif; font-size: 16pt;">${checked ? '☒' : '☐'}</span>`;
const fill = (value?: string | number, placeholder: string = '.........................') => value || placeholder;
const getYear = (dateString?: string): string => {
    if (!dateString) return '...........';
    const year = dateString.split(/[\/-]/).pop();
    return /^\d{4}$/.test(year || '') ? year! : '...........';
};
const getDateParts = (dateString?: string): { day: string, month: string, year: string } => {
    if (dateString && /^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
        const [day, month, year] = dateString.split('/');
        return { day, month, year };
    }
    return { day: '.....', month: '.....', year: '...........' };
};

const splitAddress = (fullAddress?: string): { district: string; province: string; rest: string } => {
    if (!fullAddress) return { district: '', province: '', rest: '' };
    const parts = fullAddress.split(',').map(p => p.trim());
    const province = parts.pop() || '';
    const district = parts.pop() || '';
    const rest = parts.join(', ');
    return { district, province, rest };
};


// =================================================================
// Tờ khai Lệ phí trước bạ (Mẫu 01/LPTB)
// =================================================================
export const generateLPTBForm = (data: ExtractedData): string => {
    const isTransfer = !!(data.partyB?.[0]);
    const taxPayer = isTransfer ? data.partyB?.[0] : data.partyA?.[0]; // NNT: Bên B (nếu chuyển quyền), hoặc Bên A (nếu cấp lần đầu)
    const transferor = isTransfer ? data.partyA?.[0] : undefined; // Bên chuyển giao: Chỉ có khi chuyển quyền
    const land = data.landInfo?.[0];
    const { day, month, year } = getDateParts(data.documentDate);
    const { district, province, rest: taxPayerAddress } = splitAddress(taxPayer?.permanentAddress);
    const { district: landDistrict, province: landProvince } = splitAddress(land?.address);

    return `
<div style="${docStyle}">
    <div style="display: flex; justify-content: space-between; font-size: 11pt;">
        <div></div>
        <div style="text-align: right;">
            <strong>Mẫu số: 01/LPTB</strong><br>
            <em>(Ban hành kèm theo Thông tư số<br>80/2021/TT-BTC ngày 29 tháng 9 năm 2021<br>của Bộ trưởng Bộ Tài chính)</em>
        </div>
    </div>
    <div style="${headerStyle}">
        CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
        <strong>Độc lập - Tự do - Hạnh phúc</strong><br>
        -----------
    </div>
    <div style="${headerStyle}; margin-top: 1em;">
        <h2 style="font-size: 16pt; margin: 0;">TỜ KHAI LỆ PHÍ TRƯỚC BẠ</h2>
        <strong>(Áp dụng đối với nhà, đất)</strong>
    </div>

    <p><strong>[01]</strong> Kỳ tính thuế: Theo từng lần phát sinh ngày ${fill(day, '...')} tháng ${fill(month, '...')} năm ${fill(year, '...')}</p>
    <p>${checkbox(true)} <strong>[02]</strong> Lần đầu &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${checkbox(false)} <strong>[03]</strong> Bổ sung lần thứ:...</p>
    <p>${checkbox(false)} Tổ chức, cá nhân được ủy quyền khai thay cho người nộp thuế</p>

    <p style="font-weight: bold;">[04] Người nộp thuế: ${fill(taxPayer?.fullName)}</p>
    <p>
        <strong>[05]</strong> Mã số thuế: ${fill(taxPayer?.taxCode, '')} &nbsp;&nbsp;&nbsp;&nbsp;
        <strong>[06]</strong> Số CMND/CCCD/Hộ chiếu (trường hợp chưa có mã số thuế): ${fill(taxPayer?.idNumber)}
    </p>
    <p><strong>[07]</strong> Địa chỉ: ${fill(taxPayer?.permanentAddress)}</p>
    <p><strong>[08]</strong> Quận/huyện: ${fill(district)} &nbsp;&nbsp;&nbsp;&nbsp; <strong>[09]</strong> Tỉnh/Thành phố: ${fill(province)}</p>
    <p><strong>[10]</strong> Điện thoại: ${fill(taxPayer?.phoneNumber)} &nbsp;&nbsp;&nbsp;&nbsp; <strong>[11]</strong> Fax: .......................... &nbsp;&nbsp;&nbsp;&nbsp; <strong>[12]</strong> Email: ..........................</p>
    <p><strong>[13]</strong> Đại lý thuế; hoặc Tổ chức, cá nhân được ủy quyền khai thay (nếu có): ..........................</p>
    <p><strong>[14]</strong> Mã số thuế: .......................... &nbsp;&nbsp;&nbsp;&nbsp; <strong>[15]</strong> Hợp đồng đại lý thuế: Số:.......................... ngày ..........................</p>
    
    <p style="font-weight: bold; margin-top: 1em;">ĐẶC ĐIỂM NHÀ ĐẤT:</p>
    <p><strong>1. Đất:</strong></p>
    <p>1.1. Thửa đất số (Số hiệu thửa đất): ${fill(land?.parcelNumber)}; Tờ bản đồ số: ${fill(land?.mapSheetNumber)}</p>
    <p>1.2. Địa chỉ thửa đất:</p>
    <p style="padding-left: 1em;">1.2.1. Số nhà: ............. Tòa nhà: ............. Ngõ/Hẻm: ............. Đường/Phố: ............. Thôn/xóm/ấp: .............</p>
    <p style="padding-left: 1em;">1.2.2. Phường/xã: ..........................</p>
    <p style="padding-left: 1em;">1.2.3. Quận/huyện: ${fill(landDistrict)}</p>
    <p style="padding-left: 1em;">1.2.4. Tỉnh/thành phố: ${fill(landProvince)}</p>
    <p>1.3. Vị trí thửa đất (mặt tiền đường phố hay ngõ, hẻm): ..........................</p>
    <p>1.4. Mục đích sử dụng đất: ${fill(land?.usagePurpose)}</p>
    <p>1.5. Diện tích (m²): ${fill(land?.area)}</p>
    <p>1.6. Nguồn gốc nhà đất: (đất được Nhà nước giao, cho thuê; đất nhận chuyển nhượng; nhận thừa kế, hoặc nhận tặng cho): ${fill(data.additionalInfo?.propertyOrigin || land?.usageSource)}</p>
    ${transferor ? `
    <p>a) Tên tổ chức, cá nhân chuyển giao QSDĐ:</p>
    <p>- Tên tổ chức/cá nhân chuyển giao QSDĐ: ${fill(transferor.fullName)}</p>
    <p>- Mã số thuế:${fill(transferor.taxCode)}</p>
    <p>- Số CMND/CCCD/Hộ chiếu (trường hợp chưa có mã số thuế): ${fill(transferor.idNumber)}</p>
    <p>- Địa chỉ người giao QSDĐ: ${fill(transferor.permanentAddress)}</p>
    ` : ''}
    <p>b) Thời điểm làm giấy tờ chuyển giao QSDĐ ngày ${fill(day)}/${fill(month)}/${fill(year)}</p>
    <p>1.7. Giá trị đất thực tế chuyển giao (nếu có): .......................... đồng</p>
    <p><strong>2. Nhà:</strong></p>
    <p>2.1. Thông tin về nhà ở, nhà làm việc, nhà sử dụng cho mục đích khác:</p>
    <p>Cấp nhà: .................. Loại nhà: .................. Hạng nhà: ..................</p>
    <p>Trường hợp là nhà ở chung cư:</p>
    <p>Chủ dự án:.......................... Địa chỉ dự án, công trình..........................</p>
    <p>Kết cấu:.......................... Số tầng nổi:............ Số tầng hầm:.......</p>
    <p>Diện tích sở hữu chung (m²):.......................... Diện tích sở hữu riêng (m²):..........................</p>
    <p>2.2. Diện tích nhà (m²):</p>
    <p>Diện tích xây dựng (m²): .......................... m²</p>
    <p>Diện tích sàn xây dựng (m²): .......................... m²</p>
    <p>2.3. Nguồn gốc nhà:</p>
    <p>a) Tự xây dựng: - Năm hoàn công (hoặc năm bắt đầu sử dụng nhà): ..........................</p>
    <p>b) Mua, thừa kế, tặng cho: - Thời điểm làm giấy tờ chuyển giao nhà: ..........................</p>
    <p>2.4. Giá trị nhà (đồng):..........................</p>
    <p>3. Giá trị nhà, đất thực tế nhận chuyển nhượng ${checkbox(isTransfer)}, nhận thừa kế ${checkbox(false)}, nhận tặng cho ${checkbox(!isTransfer)} (đồng):..........................</p>
    <p>4. Tài sản thuộc diện được miễn lệ phí trước bạ (lý do): ..........................</p>
    <p><strong>5. Thông tin đồng chủ sở hữu nhà, đất (nếu có):</strong></p>
    <table style="${tableStyle}">
        <tr>
            <td style="${tdCenterStyle}"><strong>STT</strong></td>
            <td style="${tdCenterStyle}"><strong>Tên tổ chức/cá nhân đồng sở hữu</strong></td>
            <td style="${tdCenterStyle}"><strong>Mã số thuế</strong></td>
            <td style="${tdCenterStyle}"><strong>Số CMND/CCCD/Hộ chiếu (trường hợp chưa có mã số thuế)</strong></td>
            <td style="${tdCenterStyle}"><strong>Tỷ lệ sở hữu (%)</strong></td>
        </tr>
        ${(data.additionalInfo?.coOwners || []).map((owner, index) => `
        <tr>
            <td style="${tdCenterStyle}">${index + 1}</td>
            <td style="${tdStyle}">${fill(owner.fullName)}</td>
            <td style="${tdStyle}">${fill(owner.taxCode)}</td>
            <td style="${tdStyle}">${fill(owner.idNumber)}</td>
            <td style="${tdStyle}"></td>
        </tr>
        `).join('') || `<tr><td style="${tdStyle}">&nbsp;</td><td style="${tdStyle}"></td><td style="${tdStyle}"></td><td style="${tdStyle}"></td><td style="${tdStyle}"></td></tr>`}
    </table>
    <p><strong>6. Giấy tờ có liên quan, gồm:</strong></p>
    <ul style="list-style-type: '- '; padding-left: 2em; margin: 0; font-size: 12pt;">
        <li>Hợp đồng chuyển nhượng/tặng cho/thừa kế;</li>
        <li>Giấy tờ trong hồ sơ xác định nghĩa vụ tài chính;</li>
        <li>Giấy tờ liên quan hồ sơ miễn giảm nghĩa vụ tài chính (nếu có);</li>
    </ul>
    <p>Tôi cam đoan số liệu khai trên là đúng và chịu trách nhiệm trước pháp luật về số liệu đã khai./.</p>
    
    <div style="display: flex; justify-content: space-between; margin-top: 2em; text-align: center;">
        <div style="width: 45%;">
            <strong>NHÂN VIÊN ĐẠI LÝ THUẾ</strong><br>
            Họ và tên:...............................<br>
            Chứng chỉ hành nghề số:........<br>
            ..., ngày....... tháng....... năm.......
        </div>
        <div style="width: 50%;">
            <em>..., ngày ${fill(day, '...')} tháng ${fill(month, '...')} năm ${fill(year, '...')}</em><br>
            <strong>NGƯỜI NỘP THUẾ hoặc ĐẠI DIỆN HỢP PHÁP <br>CỦA NGƯỜI NỘP THUẾ hoặc TỔ CHỨC, CÁ NHÂN <br>ĐƯỢC ỦY QUYỀN KHAI THAY</strong><br>
            <em>(Chữ ký, ghi rõ họ tên; chức vụ và đóng dấu (nếu có)/Ký điện tử)</em>
            <br><br><br><br>
            <strong>${fill(taxPayer?.fullName)}</strong>
        </div>
    </div>
</div>
    `;
};

// =================================================================
// Tờ khai Thuế TNCN (Mẫu 03/BĐS-TNCN)
// =================================================================
export const generateTNCNForm = (data: ExtractedData): string => {
    // LOGIC UPDATE: Determine the taxpayer based on the transaction type.
    // A transaction with a price is a transfer; otherwise, it's a gift.
    const isTransfer = data.transactionAmount && Number(data.transactionAmount) > 0;

    // Section I: For the TAXPAYER.
    // - Transfer: Taxpayer is the seller (Party A).
    // - Gift: Taxpayer is the recipient (Party B).
    const taxPayer = isTransfer ? data.partyA?.[0] : data.partyB?.[0];

    // Section II: For the PROPERTY RECIPIENT.
    // This is always Party B in both transfer and gift scenarios.
    const propertyRecipient = data.partyB?.[0];

    // The property owners for the co-owner table ([51]) are always Party A and their partners.
    const primaryOwner = data.partyA?.[0];
    
    const land = data.landInfo?.[0];
    const { day, month, year } = getDateParts(data.documentDate);
    const { district: taxPayerDistrict, province: taxPayerProvince } = splitAddress(taxPayer?.permanentAddress);
    
    // Logic to safely format the amount string.
    const cleanAmountString = (data.transactionAmount || '').replace(/\D/g, '');
    const formattedAmount = cleanAmountString
        ? new Intl.NumberFormat('vi-VN').format(Number(cleanAmountString))
        : '.........................';
    
    const coOwners = data.additionalInfo?.coOwners || [];

    return `
<div style="${docStyle}; font-size: 11pt; line-height: 1.4;">
    <div style="display: flex; justify-content: space-between;">
        <div></div>
        <div style="text-align: right;">
            <strong>Mẫu số: 03/BĐS-TNCN</strong><br>
            <em>(Ban hành kèm theo Thông tư số 80/2021/TT-BTC<br>ngày 29 tháng 9 năm 2021 của Bộ trưởng Bộ Tài chính)</em>
        </div>
    </div>
    <div style="${headerStyle}">
        CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
        <strong>Độc lập - Tự do - Hạnh phúc</strong><br>
        -----------
    </div>
    <div style="${headerStyle}; margin-top: 1em;">
        <h2 style="font-size: 14pt; margin: 0; text-transform: uppercase;">TỜ KHAI THUẾ THU NHẬP CÁ NHÂN</h2>
        <strong>(Áp dụng đối với cá nhân có thu nhập từ chuyển nhượng bất động sản; <br> 
        thu nhập từ nhận thừa kế và nhận quà tặng là bất động sản)</strong>
    </div>

    <p style="margin-top: 1em;"><strong>[01] Kỳ tính thuế:</strong> Lần phát sinh: Ngày ${fill(day, '...')} tháng ${fill(month, '...')} năm ${fill(year, '...')}</p>
    <p>${checkbox(true)} <strong>[02] Lần đầu</strong> &nbsp;&nbsp;&nbsp;&nbsp; ${checkbox(false)} <strong>[03] Bổ sung lần thứ:</strong>…</p>
    
    <p style="font-weight: bold; margin-top: 1em;">I. THÔNG TIN NGƯỜI CHUYỂN NHƯỢNG, NHẬN THỪA KẾ, QUÀ TẶNG</p>
    <p><strong>[04] Tên người nộp thuế:</strong> ${fill(taxPayer?.fullName)}</p>
    <p><strong>[05] Mã số thuế (nếu có):</strong> ${fill(taxPayer?.taxCode)}</p>
    <p><strong>[06] Số CMND/CCCD/Hộ chiếu (trường hợp cá nhân quốc tịch Việt Nam):</strong> ${fill(taxPayer?.idNumber)}</p>
    <p style="padding-left: 2em;"><strong>[06.1] Ngày cấp:</strong> ${fill(taxPayer?.idIssueDate)}; <strong>[06.2] Nơi cấp:</strong> ${fill(taxPayer?.idIssuePlace)}</p>
    <p><strong>[07] Hộ chiếu (trường hợp cá nhân không có quốc tịch Việt Nam):</strong> .........................</p>
    <p style="padding-left: 2em;"><strong>[07.1] Ngày cấp:</strong>…………………… <strong>[07.2] Nơi cấp:</strong>…………………………....</p>
    <p><strong>[08] Địa chỉ chỗ ở hiện tại:</strong> ${fill(taxPayer?.permanentAddress)}</p>
    <p><strong>[09] Quận/huyện:</strong> ${fill(taxPayerDistrict)} &nbsp;&nbsp; <strong>[10] Tỉnh/Thành phố:</strong> ${fill(taxPayerProvince)}</p>
    <p><strong>[11] Điện thoại:</strong> ${fill(taxPayer?.phoneNumber)} &nbsp;&nbsp; <strong>[12] Email:</strong> .........................................</p>
    <p><strong>[13] Tên tổ chức, cá nhân khai thay (nếu  có):</strong> .........................................................................</p>
    <p><strong>[14] Mã số thuế (nếu có):</strong> ..........................</p>
    <p><strong>[15] Địa chỉ:</strong> .........................................................................</p>
    <p><strong>[16] Quận/huyện:</strong> .......................... <strong>[17] Tỉnh/Thành phố:</strong> ..........................</p>
    <p><strong>[20] Tên đại lý thuế (nếu có):</strong>..................................................................................</p>
    <p><strong>[21] Mã số thuế (nếu có):</strong> ..........................</p>
    <p><strong>[22] Địa chỉ:</strong> ……………………..………………..………………………………….</p>
    <p><strong>[23] Quận/huyện:</strong> ................... <strong>[24] Tỉnh/Thành phố:</strong> ..................................................</p>
    <p><strong>[25] Điện thoại:</strong> ............................................... <strong>[26] Email:</strong> .......................................</p>
    <p><strong>[27] Hợp đồng đại lý thuế: [28] Số:</strong> .......................... <strong>[29] Ngày:</strong>................................</p>
    <p><strong>[30] Giấy tờ về quyền sử dụng đất, quyền sở hữu nhà ở và tài sản gắn liền với đất:</strong> ${fill(land?.certificateType)}</p>
    <p style="padding-left: 2em;"><strong>[30.1] Số:</strong> ${fill(land?.certificateNumber)} <strong>[30.2] Do cơ quan:</strong> ${fill(land?.certificateIssuer)} <strong>[30.3] Cấp ngày:</strong> ${fill(land?.certificateIssueDate)}</p>
    <p><strong>[31] Hợp đồng mua bán nhà ở, công trình xây dựng hình thành trong tương lai ký với chủ dự án cấp 1, cấp 2 hoặc Sàn giao dịch của chủ dự án:</strong>………..……………………</p>
    <p style="padding-left: 2em;"><strong>[31.1] Số</strong>……………………..<strong>[31.2] Ngày:</strong>…………………………………</p>
    <p><strong>[32] Hợp đồng chuyển nhượng trao đổi bất động sản:</strong></p>
    <p style="padding-left: 2em;"><strong>[32.1] Số:</strong> ................... <strong>[32.2] Nơi lập:</strong> ................... <strong>[32.3] Ngày lập:</strong> ...................</p>
    <p style="padding-left: 2em;"><strong>[32.4] Cơ quan chứng thực:</strong> ................... <strong>[32.5] Ngày chứng thực:</strong> ...................</p>

    <p style="font-weight: bold; margin-top: 1em;">II. THÔNG TIN NGƯỜI NHẬN CHUYỂN NHƯỢNG, NHẬN THỪA KẾ, QUÀ TẶNG</p>
    <p><strong>[33] Họ và tên đại diện:</strong> ${fill(propertyRecipient?.fullName)}</p>
    <p><strong>[34] Mã số thuế (nếu có):</strong> ${fill(propertyRecipient?.taxCode)}</p>
    <p><strong>[35] Số CMND/CCCD/Hộ chiếu (trường hợp chưa có mã số thuế):</strong> ${fill(propertyRecipient?.idNumber)}</p>
    <p style="padding-left: 2em;"><strong>[35.1] Ngày cấp:</strong> ${fill(propertyRecipient?.idIssueDate)}; <strong>[35.2] Nơi cấp:</strong> ${fill(propertyRecipient?.idIssuePlace)}</p>
    <p><strong>[36] Văn bản Phân chia di sản thừa kế, quà tặng là Bất động sản</strong></p>
    <p style="padding-left: 2em;"><strong>[36.1] Nơi lập hồ sơ nhận thừa kế, quà tặng:</strong> ...................</p>
    <p style="padding-left: 2em;"><strong>[36.2] Ngày lập:</strong> ................... <strong>[36.3] Cơ quan chứng thực:</strong> ................... <strong>[36.4] Ngày chứng thực:</strong> ...................</p>

    <p style="font-weight: bold; margin-top: 1em;">III. LOẠI BẤT ĐỘNG SẢN CHUYỂN NHƯỢNG, NHẬN THỪA KẾ, QUÀ TẶNG</p>
    <p>${checkbox(true)} <strong>[37]</strong> Quyền sử dụng đất và tài sản gắn liền trên đất</p>
    <p>${checkbox(false)} <strong>[38]</strong> Quyền sở hữu hoặc sử dụng nhà ở</p>
    <p>${checkbox(false)} <strong>[39]</strong> Quyền thuê đất, thuê mặt nước</p>
    <p>${checkbox(false)} <strong>[40]</strong> Bất động sản khác</p>

    <p style="font-weight: bold; margin-top: 1em;">IV. ĐẶC ĐIỂM BẤT ĐỘNG SẢN CHUYỂN NHƯỢNG, NHẬN THỪA KẾ, QUÀ TẶNG</p>
    <p><strong>[41] Thông tin về đất:</strong></p>
    <p style="padding-left: 2em;"><strong>[41.1] Thửa đất số (Số hiệu thửa đất)</strong> ${fill(land?.parcelNumber)}; <strong>Tờ bản đồ số (số hiệu):</strong> ${fill(land?.mapSheetNumber)}</p>
    <p style="padding-left: 2em;"><strong>[41.2] Địa chỉ:</strong> ${fill(land?.address)}</p>
    <p style="padding-left: 2em;"><strong>[41.7] Loại đất, vị trí thửa đất (1,2,3,4…):</strong> ${fill(land?.usagePurpose)}</p>
    <p style="padding-left: 2em;"><strong>[41.8] Hệ số (nếu có):</strong>…………………………………………………………. </p>
    <p style="padding-left: 2em;"><strong>[41.9] Nguồn gốc đất:</strong> (Đất được nhà nước giao, cho thuê; Đất nhận chuyển nhượng; nhận thừa kế, hoặc nhận tặng, cho…): ${fill(data.additionalInfo?.propertyOrigin || land?.usageSource)}</p>
    <p style="padding-left: 2em;"><strong>[41.10] Giá trị đất thực tế chuyển giao (nếu có):</strong> ……………………….đồng</p>
    <p><strong>[42] Thông tin về nhà ở, công trình xây dựng:</strong> .....................................................</p>
    <p><strong>[43] Tài sản gắn liền với đất:</strong> .....................................................</p>
    
    <p style="font-weight: bold; margin-top: 1em;">V. THU NHẬP TỪ CHUYỂN NHƯỢNG BẤT ĐỘNG SẢN; TỪ NHẬN THỪA KẾ, QUÀ TẶNG LÀ BẤT ĐỘNG SẢN</p>
    <p><strong>[44] Loại thu nhập</strong></p>
    <p style="padding-left: 2em;">${checkbox(isTransfer)} <strong>[44.1]</strong> Thu nhập từ chuyển nhượng bất động sản</p>
    <p style="padding-left: 2em;">${checkbox(!isTransfer)} <strong>[44.2]</strong> Thu nhập từ nhận thừa kế, quà tặng </p>
    <p><strong>[45] Giá trị chuyển nhượng bất động sản và tài sản khác gắn liền với đất hoặc giá trị bất động sản nhận thừa kế, quà tặng:</strong> ${fill(formattedAmount)} đồng</p>
    <p><strong>[46] Thuế thu nhập cá nhân phát sinh đối với chuyển nhượng bất động sản ([46]=[45]x2%):</strong>....................................đồng</p>
    <p><strong>[47] Thu nhập miễn thuế:</strong>....................................đồng</p>
    <p><strong>[48] Thuế thu nhập cá nhân được miễn ([48] = [47] x 2%):</strong> ………………........đồng</p>
    <p><strong>[49] Thuế thu nhập cá nhân phải nộp đối với chuyển nhượng bất động sản:{[49]=([46]-[48])}:</strong> …………………………đồng</p>
    <p><strong>[50] Thuế thu nhập cá nhân phải nộp đối với nhận thừa kế, quà tặng là bất động sản: {[50]=([45]-[47]-10.000.000) x 10%}:</strong>………………..…….......đồng</p>
    
    <p><strong>[51] Số thuế phải nộp, được miễn của chủ sở hữu (chỉ khai trong trường hợp có đồng sở hữu hoặc chủ sở hữu, đồng sở hữu được miễn thuế theo quy định):</strong></p>
    <p style="text-align: right;"><em>Đơn vị tiền: Đồng Việt Nam</em></p>
    <table style="${tableStyle}; font-size: 10pt;">
        <thead>
            <tr>
                <td style="${tdCenterStyle}"><strong>STT</strong><br><strong>[51.1]</strong></td>
                <td style="${tdCenterStyle}"><strong>Họ và tên</strong><br><strong>[51.2]</strong></td>
                <td style="${tdCenterStyle}"><strong>Mã số thuế</strong><br><strong>[51.3]</strong></td>
                <td style="${tdCenterStyle}"><strong>Tỷ lệ sở hữu (%)</strong><br><strong>[51.4]</strong></td>
                <td style="${tdCenterStyle}"><strong>Số thuế phải nộp</strong><br><strong>[51.5]</strong></td>
                <td style="${tdCenterStyle}"><strong>Số thuế được miễn</strong><br><strong>[51.6]</strong></td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="${tdCenterStyle}">1</td>
                <td style="${tdStyle}">${fill(primaryOwner?.fullName)}</td>
                <td style="${tdStyle}">${fill(primaryOwner?.taxCode)}</td>
                <td style="${tdStyle}"></td>
                <td style="${tdStyle}"></td>
                <td style="${tdStyle}"></td>
            </tr>
            ${coOwners.map((owner, index) => `
            <tr>
                <td style="${tdCenterStyle}">${index + 2}</td>
                <td style="${tdStyle}">${fill(owner.fullName)}</td>
                <td style="${tdStyle}">${fill(owner.taxCode)}</td>
                <td style="${tdStyle}"></td>
                <td style="${tdStyle}"></td>
                <td style="${tdStyle}"></td>
            </tr>`).join('')}
             ${!primaryOwner && coOwners.length === 0 ? `<tr><td style="${tdStyle}">&nbsp;</td><td style="${tdStyle}"></td><td style="${tdStyle}"></td><td style="${tdStyle}"></td><td style="${tdStyle}"></td><td style="${tdStyle}"></td></tr>` : ''}
        </tbody>
    </table>

    <p style="margin-top: 1em;">Tôi cam đoan số liệu khai trên là đúng sự thật và chịu trách nhiệm trước pháp luật về những số liệu đã khai./.</p>
     <div style="display: flex; justify-content: space-between; margin-top: 2em; text-align: center;">
        <div style="width: 45%;">
            <strong>NHÂN VIÊN ĐẠI LÝ THUẾ</strong><br>
            <em>(Ký, ghi rõ họ tên)</em><br>
            Họ và tên:...............................<br>
            Chứng chỉ hành nghề số:........
        </div>
        <div style="width: 50%;">
            <em>..., ngày ${fill(day, '...')} tháng ${fill(month, '...')} năm ${fill(year, '...')}</em><br>
            <strong>NGƯỜI NỘP THUẾ hoặc<br>ĐẠI DIỆN HỢP PHÁP CỦA NGƯỜI NỘP THUẾ</strong><br>
            <em>(Chữ ký, ghi rõ họ tên; chức vụ và đóng dấu (nếu có))</em>
             <br><br><br><br>
            <strong>${fill(taxPayer?.fullName)}</strong>
        </div>
    </div>
</div>
    `;
};


// =================================================================
// Tờ khai Thuế SDĐ Phi Nông nghiệp (Mẫu 04/TK-SDDPNN)
// =================================================================
export const generateSDDPNNForm = (data: ExtractedData): string => {
    // For transfers/gifts, the recipient (Party B) is the new taxpayer.
    const taxPayer = data.partyB?.[0] || data.partyA?.[0]; 
    const transferor = data.partyA?.[0];
    const land = data.landInfo?.[0];
    const year = getYear(data.documentDate);
    const documentDate = getDateParts(data.documentDate);

    const taxPayerAddr = splitAddress(taxPayer?.permanentAddress);

    const allOwners = [...(data.partyB || []), ...(data.partyA || [])];
    
    return `
<div style="${docStyle}; font-size: 12pt;">
    <div style="display: flex; justify-content: space-between; font-size: 11pt;">
        <div></div>
        <div style="text-align: right;">
            <strong>Mẫu số: 04/TK-SDDPNN</strong><br>
            <em>(Ban hành kèm theo Thông tư số<br>80/2021/TT-BTC ngày 29 tháng 9 năm 2021<br>của Bộ trưởng Bộ Tài chính)</em>
        </div>
    </div>
    <div style="${headerStyle}">
        CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
        <strong>Độc lập - Tự do - Hạnh phúc</strong><br>
        -----------
    </div>
    <div style="${headerStyle}; margin-top: 1em;">
        <h2 style="font-size: 14pt; margin: 0; text-transform: uppercase;">TỜ KHAI THUẾ SỬ DỤNG ĐẤT PHI NÔNG NGHIỆP</h2>
        <strong>(Áp dụng đối với hộ gia đình, cá nhân trong trường hợp chuyển nhượng, thừa kế, tặng cho quyền sử dụng đất)</strong>
    </div>

    <p><strong>[01] Kỳ tính thuế:</strong> Năm ${fill(year)}</p>
    <p>${checkbox(true)} <strong>[02] Lần đầu:</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${checkbox(false)} <strong>[03] Bổ sung lần thứ:</strong> ......</p>
    
    <div style="font-weight: bold; margin-top: 1em;">I. PHẦN NGƯỜI NỘP THUẾ TỰ KHAI</div>
    <p><strong>1. Người nộp thuế:</strong></p>
    <p style="padding-left: 1em;"><strong>[04] Họ và tên:</strong> ${fill(taxPayer?.fullName)}</p>
    <p style="padding-left: 1em;"><strong>[05] Ngày/tháng/năm sinh:</strong> ${fill(taxPayer?.dateOfBirth)}</p>
    <p style="padding-left: 1em;"><strong>[06] Mã số thuế:</strong> ${fill(taxPayer?.taxCode)}</p>
    <p style="padding-left: 1em;"><strong>[07] Số CMND/Hộ chiếu/CCCD (trường hợp cá nhân chưa có MST):</strong> ${fill(taxPayer?.idNumber)}</p>
    <p style="padding-left: 2em;"><strong>[08] Ngày cấp:</strong> ${fill(taxPayer?.idIssueDate)} &nbsp;&nbsp; <strong>[09] Nơi cấp:</strong> ${fill(taxPayer?.idIssuePlace)}</p>
    <p style="padding-left: 1em;"><strong>[10] Địa chỉ cư trú:</strong></p>
    <table style="width: 100%; border: none; border-collapse: collapse; margin-left: 2em; font-size: 12pt;">
        <tr>
            <td style="${tdNoBorderStyle} width: 50%;"><strong>[10.1] Số nhà:</strong> ..........................</td>
            <td style="${tdNoBorderStyle} width: 50%;"><strong>[10.2] Đường/phố:</strong> ..........................</td>
        </tr>
        <tr>
            <td style="${tdNoBorderStyle}"><strong>[10.3] Tổ/thôn:</strong> ${fill(taxPayerAddr.rest)}</td>
            <td style="${tdNoBorderStyle}"><strong>[10.4] Phường/xã/thị trấn:</strong> ..........................</td>
        </tr>
        <tr>
            <td style="${tdNoBorderStyle}"><strong>[10.5] Quận/huyện:</strong> ${fill(taxPayerAddr.district)}</td>
            <td style="${tdNoBorderStyle}"><strong>[10.6] Tỉnh/Thành phố:</strong> ${fill(taxPayerAddr.province)}</td>
        </tr>
    </table>
    <p style="padding-left: 1em;"><strong>[11] Địa chỉ nhận thông báo thuế:</strong> ${fill(taxPayer?.permanentAddress)}</p>
    <p style="padding-left: 1em;"><strong>[12] Điện thoại:</strong> ${fill(taxPayer?.phoneNumber)}</p>
    <p><strong>2. Đại lý thuế (nếu có):</strong></p>
    <p style="padding-left: 1em;"><strong>[13] Tên đại lý thuế:</strong> ...............................................................................................................</p>
    <p style="padding-left: 1em;"><strong>[14] Mã số thuế:</strong> ..........................</p>
    <p style="padding-left: 1em;"><strong>[15] Hợp đồng đại lý thuế:</strong> Số: ...................................... Ngày: ............................................</p>
    <p><strong>3. Thửa đất chịu thuế:</strong></p>
    <p style="padding-left: 1em;"><strong>[16] Thông tin người sử dụng đất:</strong></p>
    <table style="${tableStyle} margin-left: 1em; width: 95%; font-size: 11pt;">
        <thead>
            <tr>
                <td style="${tdCenterStyle}"><strong>STT</strong></td>
                <td style="${tdCenterStyle}"><strong>Họ và tên</strong></td>
                <td style="${tdCenterStyle}"><strong>MST</strong></td>
                <td style="${tdCenterStyle}"><strong>CMND/CCCD/Hộ chiếu (trường hợp cá nhân chưa có MST)</strong></td>
                <td style="${tdCenterStyle}"><strong>Tỷ lệ</strong></td>
            </tr>
        </thead>
        <tbody>
             ${allOwners.map((owner, index) => `
            <tr>
                <td style="${tdCenterStyle}">${index + 1}</td>
                <td style="${tdStyle}">${fill(owner?.fullName)}</td>
                <td style="${tdStyle}">${fill(owner?.taxCode)}</td>
                <td style="${tdStyle}">${fill(owner?.idNumber)}</td>
                <td style="${tdStyle}"></td>
            </tr>
            `).join('')}
             ${allOwners.length === 0 ? `<tr><td style="${tdStyle}">&nbsp;</td><td style="${tdStyle}"></td><td style="${tdStyle}"></td><td style="${tdStyle}"></td><td style="${tdStyle}"></td></tr>` : ''}
        </tbody>
    </table>
    <p style="padding-left: 1em;"><strong>[17] Địa chỉ thửa đất:</strong> ${fill(land?.address)}</p>
    <p style="padding-left: 1em;"><strong>[18] Là thửa đất duy nhất:</strong> ${checkbox(false)}</p>
    <p style="padding-left: 1em;"><strong>[19] Đăng ký kê khai tổng hợp tại (Quận/Huyện):</strong> ......................</p>
    <p style="padding-left: 1em;"><strong>[20] Đã có giấy chứng nhận:</strong> ${checkbox(true)}</p>
    <p style="padding-left: 2em;"><strong>[20.1] Số giấy chứng nhận:</strong> ${fill(land?.certificateNumber)} &nbsp;&nbsp; <strong>[20.2] Ngày cấp:</strong> ${fill(land?.certificateIssueDate)}</p>
    <p style="padding-left: 2em;"><strong>[20.3] Thửa đất số:</strong> ${fill(land?.parcelNumber)} &nbsp;&nbsp; <strong>[20.4] Tờ bản đồ số:</strong> ${fill(land?.mapSheetNumber)}</p>
    <p style="padding-left: 2em;"><strong>[20.5] Diện tích:</strong> ${fill(land?.area)} m² ; &nbsp;&nbsp; <strong>[20.6] Loại đất/ Mục đích sử dụng:</strong> ${fill(land?.usagePurpose)}</p>
    <p style="padding-left: 1em;"><strong>[21] Tổng diện tích thực tế sử dụng cho mục đích phi nông nghiệp:</strong> ${fill(land?.area)} m²</p>
    <p style="padding-left: 2em;"><strong>[21.1] Diện tích đất sử dụng đúng mục đích:</strong> ${fill(land?.area)} m²</p>
    <p style="padding-left: 2em;"><strong>[21.2] Diện tích đất sử dụng sai mục đích/chưa sử dụng theo đúng quy định:</strong> ..............</p>
    <p style="padding-left: 2em;"><strong>[21.3] Hạn mức (nếu có):</strong> ....................................................................................................</p>
    <p style="padding-left: 2em;"><strong>[21.4] Diện tích đất lấn, chiếm:</strong> ....................................................................................</p>
    <p style="padding-left: 1em;"><strong>[22] Chưa có giấy chứng nhận:</strong> ${checkbox(false)}</p>
    <p style="padding-left: 2em;"><strong>[22.1] Diện tích:</strong> ................. &nbsp;&nbsp; <strong>[22.2] Loại đất/ Mục đích đang sử dụng:</strong> ...........................</p>
    <p style="padding-left: 1em;"><strong>[23] Thời điểm bắt đầu sử dụng đất:</strong> ${fill(data.documentDate)}</p>
    <p style="padding-left: 1em;"><strong>[24] Thời điểm thay đổi thông tin của thửa đất:</strong> .........................................</p>
    <p><strong>4. Đối với đất ở nhà nhiều tầng nhiều hộ ở, nhà chung cư [25] (tính trên diện tích sàn thực tế sử dụng):</strong></p>
    <p style="padding-left: 1em;"><strong>[25.1] Loại nhà:</strong> .................. &nbsp;&nbsp; <strong>[25.2] Diện tích:</strong> ................ &nbsp;&nbsp; <strong>[25.3] Hệ số phân bổ:</strong> ..........</p>
    <p><strong>5. Trường hợp miễn, giảm thuế [26]</strong> (ghi rõ trường hợp thuộc diện được miễn, giảm thuế như: thương binh, gia đình thương binh liệt sỹ, đối tượng chính sách, ...): ............................................................................</p>
    <p>Tôi cam đoan số liệu khai trên là đúng và chịu trách nhiệm trước pháp luật về số liệu đã khai./.</p>
    
    <div style="display: flex; justify-content: space-between; margin-top: 2em; text-align: center;">
        <div style="width: 45%;">
            <strong>NHÂN VIÊN ĐẠI LÝ THUẾ</strong><br>
            Họ và tên:...............................<br>
            Chứng chỉ hành nghề số:......
        </div>
        <div style="width: 50%;">
            <em>..., ngày ${fill(documentDate.day)} tháng ${fill(documentDate.month)} năm ${fill(documentDate.year)}</em><br>
            <strong>NGƯỜI NỘP THUẾ hoặc<br>ĐẠI DIỆN HỢP PHÁP CỦA NGƯỜI NỘP THUẾ</strong><br>
            <em>(Chữ ký, ghi rõ họ tên; chức vụ và đóng dấu (nếu có)/Ký<br>điện tử)</em>
            <br><br><br><br>
            <strong>${fill(taxPayer?.fullName)}</strong>
        </div>
    </div>
    
    <div style="page-break-after: always; margin-top: 2em;"></div>

    <div style="font-weight: bold; margin-top: 1em;">II. PHẦN XÁC ĐỊNH CỦA CƠ QUAN CHỨC NĂNG (Đơn vị tiền: Đồng Việt Nam)</div>
    <p><strong>1. Người nộp thuế</strong></p>
    <p style="padding-left: 1em;"><strong>[27] Họ và tên:</strong> ${fill(taxPayer?.fullName)}</p>
    <p style="padding-left: 1em;"><strong>[28] Ngày/ tháng/ năm sinh:</strong> ${fill(taxPayer?.dateOfBirth)}</p>
    <p style="padding-left: 1em;"><strong>[29] Mã số thuế:</strong> ${fill(taxPayer?.taxCode)}</p>
    <p style="padding-left: 1em;"><strong>[30] Số CMND/Hộ chiếu/CCCD:</strong> ${fill(taxPayer?.idNumber)}</p>
    <p style="padding-left: 2em;"><strong>[31] Ngày cấp:</strong> ${fill(taxPayer?.idIssueDate)} &nbsp;&nbsp; <strong>[32] Nơi cấp:</strong> ${fill(taxPayer?.idIssuePlace)}</p>
    <p><strong>2. Thửa đất chịu thuế</strong></p>
    <p style="padding-left: 1em;"><strong>[33] Địa chỉ:</strong> ${fill(land?.address)}</p>
    <p style="padding-left: 1em;"><strong>[34] Đã có giấy chứng nhận:</strong> ${checkbox(true)}</p>
    <p style="padding-left: 2em;"><strong>[34.1] Số giấy chứng nhận:</strong> ${fill(land?.certificateNumber)} &nbsp;&nbsp; <strong>[34.2] Ngày cấp:</strong> ${fill(land?.certificateIssueDate)}</p>
    <p style="padding-left: 2em;"><strong>[34.3] Thửa đất số:</strong> ${fill(land?.parcelNumber)} &nbsp;&nbsp; <strong>[34.4] Tờ bản đồ số:</strong> ${fill(land?.mapSheetNumber)}</p>
    <p style="padding-left: 2em;"><strong>[34.5] Diện tích đất phi nông nghiệp ghi trên GCN:</strong> ${fill(land?.area)} m²</p>
    <p style="padding-left: 2em;"><strong>[34.6] Diện tích thực tế sử dụng cho mục đích phi nông nghiệp:</strong> 0</p>
    <p style="padding-left: 2em;"><strong>[34.7] Loại đất/ Mục đích sử dụng:</strong> ${fill(land?.usagePurpose)}</p>
    <p style="padding-left: 2em;"><strong>[34.8] Hạn mức (Hạn mức tại thời điểm cấp GCN):</strong> ..........................</p>
    <p style="padding-left: 1em;"><strong>[35] Chưa có giấy chứng nhận:</strong> ${checkbox(false)}</p>
    <p style="padding-left: 2em;"><strong>[35.1] Diện tích:</strong> ................... &nbsp;&nbsp; <strong>[35.2] Loại đất/ Mục đích đang sử dụng:</strong> ........................</p>
    <p style="padding-left: 1em;"><strong>[36] Thời điểm bắt đầu sử dụng đất:</strong> ${fill(data.documentDate)}</p>
    <p style="padding-left: 1em;"><strong>[37] Thời điểm thay đổi thông tin của thửa đất:</strong> .........................................</p>
    <p><strong>3. Trường hợp miễn, giảm thuế [38]</strong> (ghi rõ trường hợp thuộc diện được miễn, giảm thuế như: thương binh, gia đình thương binh liệt sỹ, đối tượng chính sách ...): .................................</p>
    <p><strong>4. Căn cứ tính thuế</strong></p>
    <p style="padding-left: 1em;"><strong>[39] Diện tích đất thực tế sử dụng:</strong> ${fill(land?.area)} m²; &nbsp;&nbsp; <strong>[40] Hạn mức tính thuế:</strong> .......................... m²</p>
    <p style="padding-left: 1em;"><strong>[41] Thông tin xác định giá đất:</strong></p>
    <p style="padding-left: 2em;"><strong>[41.1] Loại đất/ mục đích sử dụng:</strong> ${fill(land?.usagePurpose)} &nbsp;&nbsp; <strong>[41.2] Tên đường/vùng:</strong> ..........................</p>
    <p style="padding-left: 2em;"><strong>[41.3] Đoạn đường/khu vực:</strong> .......................... &nbsp;&nbsp; <strong>[41.4] Loại đường:</strong> .............................</p>
    <p style="padding-left: 2em;"><strong>[41.5] Vị trí/hạng:</strong> .......................... &nbsp;&nbsp; <strong>[41.6] Giá đất:</strong> .......................... &nbsp;&nbsp; <strong>[41.7] Hệ số (đường/hẻm…):</strong> .............</p>
    <p style="padding-left: 2em;"><strong>[41.8] Giá 1 m² đất (Giá đất theo mục đích sử dụng):</strong> ..........................</p>
    <p><strong>5. Diện tích đất tính thuế</strong></p>
    <p style="padding-left: 1em;"><strong>5.1. Đất ở (Tính cho đất ở, bao gồm cả trường hợp sử dụng đất ở để kinh doanh)</strong></p>
    <p style="padding-left: 1em;">Tính trên diện tích có quyền sử dụng</p>
    <table style="${tableStyle} margin-left: 1em; width: 95%;">
        <thead>
            <tr>
                <td style="${tdCenterStyle}"><strong>[42] Diện tích trong hạn mức<br>(thuế suất: 0,03%)</strong></td>
                <td style="${tdCenterStyle}"><strong>[43] Diện tích vượt không quá<br>3 lần hạn mức<br>(thuế suất: 0,07%)</strong></td>
                <td style="${tdCenterStyle}"><strong>[44] Diện tích vượt trên 3<br>lần hạn mức<br>(thuế suất 0,15%)</strong></td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="${tdStyle}">&nbsp;</td>
                <td style="${tdStyle}">&nbsp;</td>
                <td style="${tdStyle}">&nbsp;</td>
            </tr>
        </tbody>
    </table>
    <p style="padding-left: 1em;"><strong>5.2. Đất ở nhà nhiều tầng nhiều hộ ở, nhà chung cư (tính trên diện tích sàn thực tế sử dụng):</strong></p>
    <p style="padding-left: 2em;"><strong>[45] Diện tích:</strong> ......................... &nbsp;&nbsp; <strong>[46] Hệ số phân bổ:</strong> ...........................................................</p>
    <p style="padding-left: 1em;"><strong>5.3. Diện tích đất sản xuất kinh doanh – Tính trên diện tích sử dụng đúng mục đích:</strong></p>
    <p style="padding-left: 2em;"><strong>[47] Diện tích:</strong> ......................... &nbsp;&nbsp; <strong>[48] Hệ số phân bổ (đối với nhà nhiều tầng nhiều hộ ở, nhà chung cư):</strong> ....................</p>
    <p style="padding-left: 1em;"><strong>5.4. Đất sử dụng không đúng mục đích hoặc chưa sử dụng theo đúng quy định:</strong></p>
    <p style="padding-left: 2em;"><strong>[49] Diện tích:</strong> ......................... &nbsp;&nbsp; <strong>[50] Mục đích thực tế đang sử dụng:</strong> .................................</p>
    <p style="padding-left: 2em;"><strong>[51] Hệ số phân bổ (đối với nhà nhiều tầng nhiều hộ ở, nhà chung cư):</strong> ............................</p>
    <p style="padding-left: 1em;"><strong>5.5. Đất lấn chiếm:</strong></p>
    <p style="padding-left: 2em;"><strong>[52] Diện tích:</strong> ......................... &nbsp;&nbsp; <strong>[53] Mục đích thực tế đang sử dụng:</strong> .................................</p>
    <p style="padding-left: 2em;"><strong>[54] Hệ số phân bổ (đối với nhà nhiều tầng nhiều hộ ở, nhà chung cư):</strong> .............................</p>

    <div style="display: flex; justify-content: space-around; text-align: center; margin-top: 2em;">
        <div style="width: 45%;">
            <em>..., ngày....... tháng....... năm.......</em><br>
            <strong>CÁN BỘ VĂN PHÒNG ĐĂNG KÝ<br>ĐẤT ĐAI</strong><br>
            <em>(Ký tên, ghi rõ họ tên)</em>
        </div>
        <div style="width: 45%;">
            <em>..., ngày....... tháng....... năm.......</em><br>
            <strong>KT. GIÁM ĐỐC<br>PHÓ GIÁM ĐỐC</strong><br>
            <em>(Ký tên, ghi rõ họ tên, đóng dấu)</em>
        </div>
    </div>
</div>
    `;
};


// =================================================================
// Tờ khai Thuế sử dụng đất nông nghiệp (Mẫu 02/SDDNN)
// =================================================================
export const generateAgriculturalTaxForm = (data: ExtractedData): string => {
    const isTransfer = !!data.partyB?.[0];
    const taxPayer = isTransfer ? data.partyB?.[0] : data.partyA?.[0];
    const land = data.landInfo?.[0];
    const { year } = getDateParts(data.documentDate);
    const { rest: address, district, province } = splitAddress(taxPayer?.permanentAddress);

    // Tính toán tổng diện tích và thuế (giả định)
    const riceArea = parseFloat(land?.riceLandArea || '0');
    const annualCropArea = parseFloat(land?.annualCropLandArea || '0');
    const perennialArea = parseFloat(land?.perennialTreeLandArea || '0');
    const aquacultureArea = parseFloat(land?.aquacultureLandArea || '0');
    const totalArea = riceArea + annualCropArea + perennialArea + aquacultureArea;

    return `
<div style="${docStyle}; font-size: 11pt; line-height: 1.4;">
    <div style="display: flex; justify-content: space-between;">
        <div style="text-align: center;">
            <strong>UBND XÃ (PHƯỜNG, THỊ TRẤN):</strong> ..........................<br>
            <strong>.............................................</strong>
        </div>
        <div style="text-align: right;">
            <strong>Mẫu số: 02/SDDNN</strong><br>
            <em>(Ban hành kèm theo Thông tư số 80/2021/TT-BTC<br>ngày 29/9/2021 của Bộ Tài chính)</em>
        </div>
    </div>
    <div style="${headerStyle}">
        CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
        <strong>Độc lập - Tự do - Hạnh phúc</strong><br>
        -----------
    </div>
    <div style="${headerStyle}; margin-top: 1em;">
        <h2 style="font-size: 14pt; margin: 0; text-transform: uppercase;">TỜ KHAI THUẾ SỬ DỤNG ĐẤT NÔNG NGHIỆP</h2>
        <strong>(Dùng cho hộ gia đình, cá nhân)</strong>
    </div>
    <p style="text-align: center;"><strong>Năm ${fill(year)}</strong></p>
    
    <p><strong>[01] Lần đầu: ${checkbox(true)} &nbsp;&nbsp;&nbsp; [02] Bổ sung lần thứ: ${checkbox(false)}</strong></p>

    <p style="font-weight: bold;">PHẦN I: HỘ GIA ĐÌNH, CÁ NHÂN TỰ KÊ KHAI</p>
    <p><strong>[03] Tên người nộp thuế (chủ hộ):</strong> ${fill(taxPayer?.fullName)}</p>
    <p><strong>[04] Mã số thuế:</strong> ${fill(taxPayer?.taxCode)}</p>
    <p><strong>[05] Số CCCD/CMND:</strong> ${fill(taxPayer?.idNumber)}</p>
    <p><strong>[06] Địa chỉ:</strong> ${fill(taxPayer?.permanentAddress)}</p>
    <p><strong>[07] Quận/Huyện:</strong> ${fill(district)} &nbsp;&nbsp;&nbsp; <strong>[08] Tỉnh/Thành phố:</strong> ${fill(province)}</p>
    <p><strong>[09] Địa chỉ nhận thông báo thuế:</strong> ${fill(taxPayer?.permanentAddress)}</p>
    <p><strong>[10] Điện thoại liên hệ:</strong> ${fill(taxPayer?.phoneNumber)}</p>

    <p style="margin-top: 1em;"><strong>BẢNG KÊ CÁC LOẠI ĐẤT NÔNG NGHIỆP CHỊU THUẾ</strong></p>
    <table style="${tableStyle}">
        <thead>
            <tr>
                <td style="${tdCenterStyle}" rowspan="2"><strong>Thứ tự</strong><br>[11]</td>
                <td style="${tdCenterStyle}" rowspan="2"><strong>Loại đất</strong><br>[12]</td>
                <td style="${tdCenterStyle}" colspan="3"><strong>Diện tích (m²)</strong><br>[13]</td>
                <td style="${tdCenterStyle}" rowspan="2"><strong>Hạng đất</strong><br>[14]</td>
                <td style="${tdCenterStyle}" rowspan="2"><strong>Số thuế phát sinh (kg thóc)</strong><br>[15]</td>
            </tr>
            <tr>
                <td style="${tdCenterStyle}"><strong>Tờ bản đồ số</strong></td>
                <td style="${tdCenterStyle}"><strong>Số thửa đất</strong></td>
                <td style="${tdCenterStyle}"><strong>Diện tích</strong></td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="${tdCenterStyle}">1</td>
                <td style="${tdStyle}">Đất trồng lúa (LUC+LUK)</td>
                <td style="${tdStyle}">${fill(land?.mapSheetNumber)}</td>
                <td style="${tdStyle}">${fill(land?.parcelNumber)}</td>
                <td style="${tdStyle}">${land?.riceLandArea || ''}</td>
                <td style="${tdStyle}"></td>
                <td style="${tdStyle}"></td>
            </tr>
            <tr>
                <td style="${tdCenterStyle}">2</td>
                <td style="${tdStyle}">Đất trồng cây hàng năm khác (BHK, HNK)</td>
                <td style="${tdStyle}"></td>
                <td style="${tdStyle}"></td>
                <td style="${tdStyle}">${land?.annualCropLandArea || ''}</td>
                <td style="${tdStyle}"></td>
                <td style="${tdStyle}"></td>
            </tr>
             <tr>
                <td style="${tdCenterStyle}">3</td>
                <td style="${tdStyle}">Đất trồng cây lâu năm (CLN)</td>
                <td style="${tdStyle}"></td>
                <td style="${tdStyle}"></td>
                <td style="${tdStyle}">${land?.perennialTreeLandArea || ''}</td>
                <td style="${tdStyle}"></td>
                <td style="${tdStyle}"></td>
            </tr>
             <tr>
                <td style="${tdCenterStyle}">4</td>
                <td style="${tdStyle}">Đất nuôi trồng thủy sản (NTS)</td>
                <td style="border: 1px solid black; padding: 5px;"></td>
                <td style="border: 1px solid black; padding: 5px;"></td>
                <td style="border: 1px solid black; padding: 5px;">${land?.aquacultureLandArea || ''}</td>
                <td style="border: 1px solid black; padding: 5px;"></td>
                <td style="border: 1px solid black; padding: 5px;"></td>
            </tr>
            <tr>
                <td style="${tdBoldStyle}" colspan="4">Tổng cộng</td>
                <td style="${tdBoldStyle}">${totalArea > 0 ? totalArea.toFixed(2) : ''}</td>
                <td style="${tdBoldStyle}"></td>
                <td style="${tdBoldStyle}"></td>
            </tr>
        </tbody>
    </table>

    <p><strong>[16] Tổng số thuế sử dụng đất nông nghiệp phát sinh trong năm:</strong> .......................... kg thóc</p>
    <p><strong>[17] Tổng số thuế được miễn, giảm trong năm:</strong> .......................... kg thóc</p>
    <p><strong>[18] Tổng số thuế phải nộp trong năm ([18]=[16]-[17]):</strong> .......................... kg thóc</p>

    <p style="margin-top: 1em;">Tôi cam đoan số liệu khai trên là đúng sự thật và chịu trách nhiệm trước pháp luật về số liệu đã khai./.</p>

     <div style="display: flex; justify-content: space-between; margin-top: 2em; text-align: center;">
        <div style="width: 45%;">
             <strong>XÁC NHẬN CỦA UBND<br>XÃ, PHƯỜNG, THỊ TRẤN</strong><br>
            <em>(Ký, ghi rõ họ tên, chức vụ và đóng dấu)</em>
        </div>
        <div style="width: 50%;">
            <em>..., ngày ... tháng ... năm ...</em><br>
            <strong>CHỦ HỘ GIA ĐÌNH HOẶC<br>NGƯỜI ĐẠI DIỆN</strong><br>
            <em>(Ký, ghi rõ họ tên)</em>
             <br><br><br><br>
            <strong>${fill(taxPayer?.fullName)}</strong>
        </div>
    </div>
    <hr style="border: 0; border-top: 1px solid black; margin: 1em 0;">
    <p style="font-size: 10pt; font-style: italic;">Ghi chú: Mẫu này được ban hành kèm theo Thông tư số 153/2011/TT-BTC ngày 11/11/2011 của Bộ Tài chính hướng dẫn về thuế sử dụng đất nông nghiệp.</p>
</div>
`;
};