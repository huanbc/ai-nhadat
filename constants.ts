
import { DocumentTemplate, DocumentTemplateKey, SubTemplateKey } from './types';

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    key: DocumentTemplateKey.TRANSFER,
    title: 'Hợp đồng Chuyển nhượng QSDĐ',
    description: 'Soạn thảo hợp đồng chuyển nhượng quyền sử dụng đất và tài sản gắn liền với đất.',
    requiredParties: ['partyA', 'partyB'],
    requiresLandCertificate: true,
    hasSubTemplates: true,
  },
  {
    key: DocumentTemplateKey.GIFT,
    title: 'Hợp đồng Tặng cho QSDĐ',
    description: 'Soạn thảo hợp đồng tặng cho quyền sử dụng đất cho người thân hoặc người khác.',
    requiredParties: ['partyA', 'partyB'],
    requiresLandCertificate: true,
    hasSubTemplates: true,
  },
  {
    key: DocumentTemplateKey.INHERITANCE,
    title: 'Văn bản Phân chia Di sản Thừa kế',
    description: 'Lập văn bản thỏa thuận phân chia di sản thừa kế là quyền sử dụng đất.',
    requiredParties: ['heir'],
    requiresLandCertificate: true,
    requiresDeathCertificate: true,
    acceptsHeirsConfirmation: true,
    hasSubTemplates: true,
  },
  {
    key: DocumentTemplateKey.INHERITANCE_DECLARATION,
    title: 'Văn bản Khai nhận Di sản Thừa kế',
    description: 'Lập văn bản khai nhận di sản thừa kế là quyền sử dụng đất khi các đồng thừa kế cùng nhận di sản.',
    requiredParties: ['heir'],
    requiresLandCertificate: true,
    requiresDeathCertificate: true,
    hasSubTemplates: true,
  },
  {
    key: DocumentTemplateKey.INHERITANCE_GIFT,
    title: 'Văn bản Phân chia Di sản và Tặng cho QSDĐ',
    description: 'Phân chia di sản cho các đồng thừa kế và tặng toàn bộ cho một người.',
    requiredParties: ['heir', 'partyB'],
    requiresLandCertificate: true,
    requiresDeathCertificate: true,
    acceptsHeirsConfirmation: true,
    hasSubTemplates: true,
  },
    {
    key: DocumentTemplateKey.TAX_DECLARATION_COMBO,
    title: 'Kê khai thuế nhà, đất (chuyển quyền)',
    description: 'Tự động điền Tờ khai Lệ phí trước bạ, Thuế TNCN, Thuế SDĐ PNN, và Thuế SDĐ Nông nghiệp (nếu có) cho việc chuyển nhượng, tặng cho.',
    requiredParties: ['partyA', 'partyB'],
    requiresLandCertificate: true,
    acceptsContract: true,
  },
  {
    key: DocumentTemplateKey.TAX_DECLARATION_NEW,
    title: 'Kê khai thuế nhà, đất (cấp lần đầu, chuyển mục đích)',
    description: 'Tự động điền Tờ khai Lệ phí trước bạ và Thuế SDĐ PNN/Nông nghiệp cho việc cấp GCN lần đầu hoặc chuyển mục đích sử dụng đất.',
    requiredParties: ['partyA'],
    requiresLandCertificate: true,
  },
  {
    key: DocumentTemplateKey.CERTIFICATE_APPLICATION,
    title: 'Đơn Đăng ký Đất đai, Tài sản gắn liền với đất',
    description: 'Soạn đơn đăng ký, cấp Giấy chứng nhận (sổ đỏ, sổ hồng) lần đầu cho đất đai và tài sản trên đất.',
    requiredParties: ['partyA'],
    requiresLandCertificate: false, // Can be used for first time registration
  },
  {
    key: DocumentTemplateKey.LAND_CHANGE_REGISTRATION,
    title: 'Đơn Đăng ký Biến động Đất đai',
    description: 'Soạn đơn đăng ký biến động về sử dụng đất, nhà ở (chuyển nhượng, tặng cho, thừa kế).',
    requiredParties: ['partyA'],
    requiresLandCertificate: true,
  },
   {
    key: DocumentTemplateKey.LAND_USE_CHANGE,
    title: 'Đơn đề nghị Chuyển mục đích sử dụng đất',
    description: 'Soạn đơn đề nghị chuyển mục đích sử dụng đất (ví dụ: từ đất vườn sang đất ở).',
    requiredParties: ['partyA'],
    requiresLandCertificate: true,
  },
  {
    key: DocumentTemplateKey.TAX_EXEMPTION_REQUEST,
    title: 'Văn bản Đề nghị Miễn, giảm thuế',
    description: 'Soạn thảo văn bản đề nghị miễn hoặc giảm tiền sử dụng đất khi chuyển mục đích.',
    requiredParties: ['partyA'],
    requiresLandCertificate: true,
  },
  {
    key: DocumentTemplateKey.PERSONAL_INFO_CONFIRMATION,
    title: 'Đơn xin Xác nhận Thông tin Nhân thân',
    description: 'Soạn đơn xác nhận thông tin trên CCCD và trên GCN QSDĐ là của cùng một người.',
    requiredParties: ['partyA'],
    requiresLandCertificate: true,
  },
  {
    key: DocumentTemplateKey.MATRIMONIAL_PROPERTY,
    title: 'Văn bản Thỏa thuận Tài sản Chung Vợ chồng',
    description: 'Lập văn bản thỏa thuận xác lập tài sản chung của vợ chồng là quyền sử dụng đất.',
    requiredParties: ['partyA'], // 'partyA' will contain both spouses
    requiresLandCertificate: true,
    hasSubTemplates: true,
  },
  {
    key: DocumentTemplateKey.VEHICLE_ORIGIN_CONFIRMATION,
    title: 'Đơn xin Xác nhận Nguồn gốc Phương tiện',
    description: 'Soạn đơn đề nghị UBND xác nhận nguồn gốc xe (xe máy, ô tô...) để làm thủ tục đăng ký.',
    requiredParties: ['partyA'], // partyA is the applicant
    requiresLandCertificate: false,
    requiresVehicleRegistration: true,
  },
  {
    key: DocumentTemplateKey.HEIRS_CONFIRMATION,
    title: 'Đơn xin Xác nhận Hàng thừa kế thứ nhất',
    description: 'Soạn đơn trình UBND xã xác nhận danh sách những người thuộc hàng thừa kế thứ nhất (Bố, Mẹ, Vợ/Chồng, Con).',
    requiredParties: ['partyA', 'heir'], // partyA: Applicant, heir: All heirs including deceased's parents/spouse
    requiresDeathCertificate: true,
    requiresLandCertificate: false,
  },
];


export const PLACEHOLDER_GUIDE: { category: string; placeholders: { key: string; description: string }[] }[] = [
    {
        category: 'Thông tin Chung',
        placeholders: [
            { key: '{{documentDate.day}}', description: 'Ngày lập văn bản' },
            { key: '{{documentDate.month}}', description: 'Tháng lập văn bản' },
            { key: '{{documentDate.year}}', description: 'Năm lập văn bản' },
            { key: '{{transactionAmount}}', description: 'Giá chuyển nhượng (dạng số, đã định dạng)' },
            { key: '{{transactionAmountInWords}}', description: 'Giá chuyển nhượng (dạng chữ)' },
        ],
    },
    {
        category: 'Thông tin Các Bên (Khối)',
        placeholders: [
            { key: '{{partyA_list}}', description: 'Hiển thị danh sách đầy đủ thông tin của tất cả người trong Bên A.' },
            { key: '{{partyB_list}}', description: 'Hiển thị danh sách đầy đủ thông tin của tất cả người trong Bên B.' },
            { key: '{{heirs_list}}', description: 'Hiển thị danh sách đầy đủ thông tin của tất cả người thừa kế.' },
            { key: '{{deceasedPersons_list}}', description: 'Hiển thị danh sách người để lại di sản (kèm thông tin ngày mất).' },
        ],
    },
    {
        category: 'Thông tin Các Bên (Chi tiết)',
        placeholders: [
            { key: '{{partyA[0].fullName}}', description: 'Họ tên của người đầu tiên trong Bên A.' },
            { key: '{{partyA[0].idNumber}}', description: 'Số CCCD của người đầu tiên trong Bên A.' },
            { key: '{{partyB[0].permanentAddress}}', description: 'Địa chỉ thường trú của người đầu tiên trong Bên B.' },
            { key: '{{heirs[1].dateOfBirth}}', description: 'Ngày sinh của người thừa kế thứ hai.' },
        ],
    },
    {
        category: 'Thông tin Đất đai',
        placeholders: [
            { key: '{{landInfo_list}}', description: 'Hiển thị thông tin chi tiết của TẤT CẢ các thửa đất.' },
            { key: '{{landInfo[0].parcelNumber}}', description: 'Số thửa của thửa đất đầu tiên.' },
            { key: '{{landInfo[0].mapSheetNumber}}', description: 'Tờ bản đồ của thửa đất đầu tiên.' },
            { key: '{{landInfo[0].address}}', description: 'Địa chỉ của thửa đất đầu tiên.' },
            { key: '{{landInfo[0].area}}', description: 'Diện tích của thửa đất đầu tiên.' },
            { key: '{{landInfo[0].certificateNumber}}', description: 'Số GCN của thửa đất đầu tiên.' },
        ],
    },
    {
        category: 'Thông tin Xe',
        placeholders: [
             { key: '{{vehicleInfo[0].type}}', description: 'Loại phương tiện' },
             { key: '{{vehicleInfo[0].brand}}', description: 'Nhãn hiệu' },
             { key: '{{vehicleInfo[0].chassisNumber}}', description: 'Số khung' },
             { key: '{{vehicleInfo[0].engineNumber}}', description: 'Số máy' },
             { key: '{{vehicleInfo[0].licensePlate}}', description: 'Biển số' },
        ]
    },
    {
        category: 'Chữ ký',
        placeholders: [
            { key: '{{signature_block}}', description: 'Khối chữ ký cho Bên A và Bên B (tự động đổi tên theo loại văn bản).' },
            { key: '{{heir_signature_block}}', description: 'Khối chữ ký cho tất cả những người thừa kế.' },
        ],
    },
];
