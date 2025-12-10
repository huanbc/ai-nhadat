
import { Procedure } from '../types';

export const PROCEDURES_DATA: Procedure[] = [
  // --- CẤP TỈNH (Phụ lục I) ---
  {
    "id": "TTHC-TINH-01",
    "category": "Dự án đầu tư",
    "title": "Công bố Danh mục khu đất dự kiến thực hiện dự án thí điểm thực hiện dự án nhà ở thương mại",
    "description": "Thông qua thỏa thuận về nhận quyền sử dụng đất hoặc đang có quyền sử dụng đất.",
    "applicableTo": "Tổ chức, cá nhân thực hiện dự án.",
    "duration": "23 ngày (33 ngày đối với vùng khó khăn).",
    "documents": [
        "Văn bản đề nghị của nhà đầu tư.",
        "Hồ sơ dự án đầu tư.",
        "Trích lục bản đồ hoặc trích đo địa chính."
    ],
    "steps": [
        "Giai đoạn 1: Thẩm định hồ sơ (15 ngày)",
        "Giai đoạn 2: Công bố danh mục (08 ngày)"
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm Phục vụ HCC", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thẩm định hồ sơ", "unit": "Phòng Quy hoạch, KH đất đai & QL đo đạc", "time": "12 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Trình Lãnh đạo Sở phê duyệt", "unit": "Lãnh đạo Phòng QH, KH", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Trình UBND Danh mục khu đất", "unit": "Lãnh đạo Sở NN&MT", "time": "01 ngày" },
        { "step": "GĐ2 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm Phục vụ HCC", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 2", "task": "Công bố danh mục khu đất dự kiến", "unit": "UBND tỉnh", "time": "2.5 ngày" },
        { "step": "GĐ2 - Bước 3", "task": "Ban hành thông báo chấp thuận", "unit": "UBND tỉnh", "time": "05 ngày" },
        { "step": "GĐ2 - Bước 4", "task": "Trả kết quả", "unit": "Trung tâm Phục vụ HCC", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai 2024",
        "Nghị quyết số 171/2024/QH15",
        "Quyết định số 918/QĐ-TTPVHCC ngày 10/11/2025"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-02",
    "category": "Giao đất, Cho thuê đất",
    "title": "Giao đất, cho thuê đất, chuyển mục đích sử dụng đất (Cấp tỉnh)",
    "description": "Áp dụng cho trường hợp giao đất, cho thuê đất không đấu giá, không đấu thầu; hoặc thông qua đấu thầu; giao đất, giao rừng.",
    "applicableTo": "Tổ chức, doanh nghiệp.",
    "duration": "15 ngày (25 ngày đối với vùng khó khăn).",
    "documents": [
        "Đơn xin giao đất, cho thuê đất, chuyển mục đích sử dụng đất.",
        "Văn bản thẩm định nhu cầu sử dụng đất.",
        "Trích lục bản đồ địa chính."
    ],
    "steps": [
        "Giai đoạn 1: Thẩm định và Phê duyệt (05 ngày)",
        "Giai đoạn 2: Tính tiền sử dụng đất (Tùy trường hợp)"
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm Phục vụ HCC", "time": "0.25 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Đề nghị cung cấp thông tin", "unit": "Phòng QH, KH đất đai", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Cung cấp thông tin CSDL đất đai", "unit": "Văn phòng Đăng ký Đất đai", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Thẩm định hồ sơ, kiểm tra thực địa", "unit": "Phòng QH, KH đất đai", "time": "1.5 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Trình Lãnh đạo Sở phê duyệt", "unit": "Lãnh đạo Phòng", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 6", "task": "Thông báo hướng dẫn hoàn thiện hồ sơ", "unit": "Lãnh đạo Sở NN&MT", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 1", "task": "Tiếp nhận hồ sơ tính giá đất/thuế", "unit": "Trung tâm PVHCC", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 2", "task": "Thẩm định hồ sơ sau hoàn thiện", "unit": "Phòng QH, KH đất đai", "time": "03 ngày" },
        { "step": "GĐ2 - Bước 3", "task": "Trình Lãnh đạo Sở", "unit": "Lãnh đạo Phòng", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 4", "task": "Trình phê duyệt", "unit": "Lãnh đạo Sở NN&MT", "time": "01 ngày" },
        { "step": "GĐ2 - Bước 5", "task": "Phê duyệt Quyết định", "unit": "Chủ tịch UBND tỉnh", "time": "02 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai 2024",
        "Nghị định 102/2024/NĐ-CP",
        "Quyết định số 918/QĐ-TTPVHCC"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-03",
    "category": "Giao đất, Cho thuê đất",
    "title": "Chuyển hình thức giao đất, cho thuê đất (Cấp tỉnh)",
    "description": "Chuyển từ thuê đất sang giao đất có thu tiền hoặc ngược lại.",
    "applicableTo": "Tổ chức, doanh nghiệp.",
    "duration": "15 ngày (25 ngày đối với vùng khó khăn).",
    "documents": [
        "Đơn đăng ký biến động đất đai.",
        "Giấy chứng nhận QSDĐ gốc."
    ],
    "steps": ["Giai đoạn 1: Thẩm định (05 ngày)", "Giai đoạn 2: Quyết định và Nghĩa vụ tài chính (07-10 ngày)"],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC", "time": "0.25 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Cung cấp thông tin địa chính", "unit": "VP Đăng ký Đất đai", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 7", "task": "Thẩm định hồ sơ, kiểm tra thực địa", "unit": "Phòng QH, KH đất đai", "time": "1.5 ngày" },
        { "step": "GĐ1 - Bước 9", "task": "Thông báo hoàn thiện hồ sơ", "unit": "Lãnh đạo Sở NN&MT", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 5", "task": "Phê duyệt Quyết định", "unit": "Chủ tịch UBND tỉnh", "time": "02 ngày" }
    ],
    "legalBasis": ["Luật Đất đai 2024", "Quyết định 918/QĐ-TTPVHCC"],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-08",
    "category": "Đăng ký, Cấp GCN",
    "title": "Đăng ký, cấp GCN cho trường hợp thực hiện dự án chưa được cấp GCN (Cấp tỉnh)",
    "description": "Đăng ký, cấp Giấy chứng nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất lần đầu đối với tài sản gắn liền với đất mà chủ sở hữu không đồng thời là người sử dụng đất.",
    "applicableTo": "Tổ chức trong nước, nước ngoài, cá nhân nước ngoài.",
    "duration": "10 ngày làm việc (20 ngày cho vùng khó khăn).",
    "documents": ["Đơn đăng ký", "Hợp đồng thuê đất", "Chứng từ nghĩa vụ tài chính"],
    "steps": ["Tiếp nhận", "Thẩm định", "Trình ký", "Trả kết quả"],
     "internalSteps": [
        { "step": "Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC", "time": "01 ngày" },
        { "step": "Bước 2", "task": "Thẩm định hồ sơ", "unit": "Chi nhánh VPĐKĐĐ", "time": "7.5 ngày" },
        { "step": "Bước 3", "task": "Phê duyệt Giấy chứng nhận", "unit": "Lãnh đạo Chi nhánh", "time": "01 ngày" },
        { "step": "Bước 4", "task": "Chuyển trả kết quả", "unit": "Chi nhánh VPĐKĐĐ", "time": "0.5 ngày" },
        { "step": "Bước 5", "task": "Trả kết quả", "unit": "Trung tâm PVHCC", "time": "0 ngày" }
    ],
    "legalBasis": ["Luật Đất đai 2024", "Nghị định 101/2024/NĐ-CP"],
    "authority": "cấp tỉnh"
  },
   {
    "id": "TTHC-TINH-09",
    "category": "Đăng ký, Cấp GCN",
    "title": "Cấp đổi Giấy chứng nhận quyền sử dụng đất (Cấp tỉnh)",
    "description": "Cấp đổi đồng loạt hoặc riêng lẻ do đo đạc lập bản đồ địa chính, hoặc Giấy chứng nhận bị ố, nhòe, rách, hư hỏng.",
    "applicableTo": "Tổ chức, cơ sở tôn giáo, người Việt Nam định cư ở nước ngoài.",
    "duration": "10 ngày làm việc (20 ngày đối với vùng khó khăn).",
    "documents": ["Đơn đề nghị cấp đổi", "Bản gốc Giấy chứng nhận cũ"],
    "steps": ["Tiếp nhận", "Thẩm định", "Phê duyệt", "Trả kết quả"],
    "internalSteps": [
        { "step": "Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC", "time": "0.5 ngày" },
        { "step": "Bước 2", "task": "Thẩm định hồ sơ", "unit": "Phòng Đăng ký đất đai", "time": "1.5 ngày" },
        { "step": "Bước 3", "task": "Trình phê duyệt", "unit": "Lãnh đạo Phòng", "time": "0.5 ngày" },
        { "step": "Bước 4", "task": "Phê duyệt GCN", "unit": "Lãnh đạo Văn phòng ĐKĐĐ", "time": "01 ngày" },
        { "step": "Bước 5", "task": "Chuyển trả kết quả", "unit": "Văn phòng ĐKĐĐ", "time": "0.5 ngày" }
    ],
    "legalBasis": ["Luật Đất đai 2024", "Quyết định 918/QĐ-TTPVHCC"],
    "authority": "cấp tỉnh"
  },

  // --- CẤP XÃ (Phụ lục II) ---
  {
    "id": "TTHC-XA-01",
    "category": "Dự án đầu tư",
    "title": "Tổ chức kinh tế nhận chuyển nhượng, thuê QSDĐ thực hiện dự án (Cấp xã)",
    "description": "Thủ tục nhận góp vốn bằng quyền sử dụng đất để thực hiện dự án đầu tư tại cấp xã.",
    "applicableTo": "Tổ chức kinh tế.",
    "duration": "23 ngày (33 ngày đối với vùng khó khăn).",
    "documents": [
        "Văn bản thỏa thuận",
        "Giấy chứng nhận QSDĐ",
        "Hồ sơ dự án"
    ],
    "steps": ["Tiếp nhận", "Thẩm định", "Trình phê duyệt", "Trả kết quả"],
    "internalSteps": [
        { "step": "Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Bộ phận Một cửa cấp xã", "time": "01 ngày" },
        { "step": "Bước 2", "task": "Tham mưu Giao thẩm định", "unit": "Văn phòng HĐND-UBND xã", "time": "01 ngày" },
        { "step": "Bước 3", "task": "Giao thẩm định", "unit": "Chủ tịch UBND xã", "time": "01 ngày" },
        { "step": "Bước 4", "task": "Thẩm định hồ sơ", "unit": "Công chức Địa chính - Xây dựng", "time": "14 ngày" },
        { "step": "Bước 5", "task": "Trình UBND phê duyệt", "unit": "Lãnh đạo UBND xã", "time": "01 ngày" },
        { "step": "Bước 6", "task": "Phê duyệt", "unit": "Chủ tịch UBND xã", "time": "05 ngày" },
        { "step": "Bước 7", "task": "Trả kết quả", "unit": "Bộ phận Một cửa", "time": "0 ngày" }
    ],
    "legalBasis": ["Luật Đất đai 2024", "Quyết định 918/QĐ-TTPVHCC"],
    "authority": "cấp xã"
  },
  {
    "id": "TTHC-XA-02",
    "category": "Giao đất, Cho thuê đất",
    "title": "Giao đất, cho thuê đất, giao khu vực biển để lấn biển (Cấp xã)",
    "description": "Thủ tục giao đất, cho thuê đất, giao khu vực biển để thực hiện hoạt động lấn biển.",
    "applicableTo": "Tổ chức, cá nhân.",
    "duration": "15 ngày (25 ngày đối với vùng khó khăn).",
    "documents": ["Đơn xin giao đất/lấn biển", "Dự án đầu tư lấn biển"],
    "steps": ["Giai đoạn 1: Thẩm định (05 ngày)", "Giai đoạn 2: Nghĩa vụ tài chính (07-10 ngày)"],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận hồ sơ", "unit": "Bộ phận Một cửa", "time": "0.25 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Thẩm định, kiểm tra thực địa", "unit": "Công chức Địa chính", "time": "1.5 ngày" },
        { "step": "GĐ1 - Bước 6", "task": "Thông báo hoàn thiện hồ sơ", "unit": "Lãnh đạo UBND xã", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 2", "task": "Thẩm định sau hoàn thiện", "unit": "Công chức Địa chính", "time": "04 ngày" },
        { "step": "GĐ2 - Bước 4", "task": "Phê duyệt Quyết định", "unit": "Chủ tịch UBND xã", "time": "02 ngày" }
    ],
    "legalBasis": ["Luật Đất đai 2024", "Nghị định 102/2024/NĐ-CP"],
    "authority": "cấp xã"
  },
  {
    "id": "TTHC-XA-03",
    "category": "Giao đất, Cho thuê đất",
    "title": "Điều chỉnh quyết định giao đất, cho thuê đất (Cấp xã)",
    "description": "Điều chỉnh do thay đổi căn cứ, mục đích, thời hạn hoặc sai sót.",
    "applicableTo": "Hộ gia đình, cá nhân.",
    "duration": "05 ngày (15 ngày đối với vùng khó khăn).",
    "documents": ["Đơn đề nghị", "Quyết định cũ", "Giấy tờ chứng minh"],
    "steps": ["Giai đoạn 1: Thẩm định (03 ngày)"],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận hồ sơ", "unit": "Bộ phận Một cửa", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thẩm định hồ sơ", "unit": "Công chức Địa chính phối hợp Chi nhánh VPĐKĐĐ", "time": "1.5 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Phê duyệt điều chỉnh", "unit": "Chủ tịch UBND xã", "time": "0.5 ngày" }
    ],
    "legalBasis": ["Luật Đất đai 2024"],
    "authority": "cấp xã"
  },
  {
    "id": "TTHC-XA-04",
    "category": "Giao đất, Cho thuê đất",
    "title": "Tặng cho QSDĐ cho Nhà nước, cộng đồng dân cư (Cấp xã)",
    "description": "Tặng cho để xây dựng công trình công cộng, mở rộng đường giao thông.",
    "applicableTo": "Hộ gia đình, cá nhân.",
    "duration": "10 ngày làm việc (20 ngày đối với vùng khó khăn).",
    "documents": ["Văn bản tặng cho", "Giấy chứng nhận QSDĐ"],
    "steps": ["Tiếp nhận", "Đo đạc/Chỉnh lý", "Trả kết quả"],
    "internalSteps": [
        { "step": "Bước 1", "task": "Tiếp nhận hồ sơ", "unit": "Bộ phận Một cửa", "time": "01 ngày" },
        { "step": "Bước 2", "task": "Đo đạc, chỉnh lý bản đồ", "unit": "Công chức Địa chính", "time": "06 ngày" },
        { "step": "Bước 4", "task": "Phê duyệt", "unit": "Lãnh đạo UBND xã", "time": "02 ngày" },
        { "step": "Bước 5", "task": "Trả kết quả", "unit": "Bộ phận Một cửa", "time": "0 ngày" }
    ],
    "legalBasis": ["Luật Đất đai 2024"],
    "authority": "cấp xã"
  },
  {
    "id": "TTHC-XA-06",
    "category": "Giải quyết tranh chấp",
    "title": "Hòa giải tranh chấp đất đai (Cấp xã)",
    "description": "Thủ tục hòa giải tranh chấp đất đai thuộc thẩm quyền cấp xã.",
    "applicableTo": "Hộ gia đình, cá nhân, tổ chức.",
    "duration": "30 ngày (không quá 45 ngày đối với vùng sâu, xa).",
    "documents": ["Đơn yêu cầu hòa giải", "Giấy tờ về quyền sử dụng đất"],
    "steps": ["Tiếp nhận", "Thẩm tra", "Tổ chức hòa giải", "Lập biên bản"],
    "internalSteps": [
        { "step": "Bước 1", "task": "Tiếp nhận hồ sơ", "unit": "Bộ phận Một cửa", "time": "01 ngày" },
        { "step": "Bước 2", "task": "Tham mưu Thông báo", "unit": "Văn phòng UBND", "time": "02 ngày" },
        { "step": "Bước 4", "task": "Thẩm tra, thành lập Hội đồng, Tổ chức họp", "unit": "Công chức Địa chính & Hội đồng hòa giải", "time": "22 ngày" },
        { "step": "Bước 6", "task": "Ban hành Quyết định/Biên bản", "unit": "Chủ tịch UBND xã", "time": "05 ngày" },
        { "step": "Bước 7", "task": "Trả kết quả", "unit": "Bộ phận Một cửa", "time": "0 ngày" }
    ],
    "legalBasis": ["Luật Đất đai 2024", "Nghị định 102/2024/NĐ-CP"],
    "authority": "cấp xã"
  }
];
