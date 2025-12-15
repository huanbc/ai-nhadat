import { Procedure } from '../types';

export const TTHC_TINH_DATA: Procedure[] = [
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
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm Phục vụ HCC, Trung tâm Phục vụ HCC xã, phường, đặc khu", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thẩm định hồ sơ", "unit": "Phòng Quy hoạch, kế hoạch đất đai và Quản lý đo đạc, bản đồ, viễn thám", "time": "12 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Trình Lãnh đạo Sở phê duyệt", "unit": "Lãnh đạo Phòng Quy hoạch, kế hoạch đất đai và Quản lý đo đạc, bản đồ, viễn thám", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Trình UBND Danh mục khu đất dự kiến thực hiện dự án", "unit": "Lãnh đạo Sở Nông nghiệp và Môi trường", "time": "01 ngày" },
        { "step": "GĐ2 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm Phục vụ HCC, Trung tâm Phục vụ HCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả Công bố Danh mục", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 2", "task": "Công bố danh mục khu đất dự kiến thực hiện dự án", "unit": "UBND tỉnh", "time": "2.5 ngày" },
        { "step": "GĐ2 - Bước 3", "task": "Ban hành thông báo chấp thuận", "unit": "UBND tỉnh", "time": "05 ngày" },
        { "step": "GĐ2 - Bước 4", "task": "Trả kết quả", "unit": "Trung tâm Phục vụ HCC/ Bưu chính chuyển cho tổ chức, công dân; Trung tâm Phục vụ HCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Tổ chức chính quyền địa phương ngày 16/6/2025",
        "Nghị định số 63/2010/NĐ-CP ngày 08/6/2010",
        "Nghị định số 118/2025/NĐ-CP ngày 09/6/2025",
        "Quyết định số 1180/QĐ-UBND ngày 18/04/2025",
        "Quyết định số 2111/QĐ-UBND ngày 23/6/2025",
        "Quyết định số 2178/QĐ-UBND ngày 23/6/2025",
        "Quyết định số 768/QĐ-TTPVHCC ngày 11/09/2025",
        "Quyết định số 917/QĐ-TTPVHCC ngày 10/11//2025"
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
    "steps": ["Giai đoạn 1: Thẩm định và Phê duyệt (05 ngày)", "Giai đoạn 2: Tính tiền sử dụng đất (Tùy trường hợp)"],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm Phục vụ HCC, Trung tâm Phục vụ HCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.25 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Đề nghị cung cấp thông tin", "unit": "Phòng Quy hoạch, kế hoạch đất đai và Quản lý đo đạc, bản đồ, viễn thám", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Cung cấp thông tin về cơ sở dữ liệu đất đai, lập trích lục bản đồ địa chính thửa đất", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Thẩm định hồ sơ, kiểm tra thực địa", "unit": "Phòng Quy hoạch, kế hoạch đất đai và Quản lý đo đạc, bản đồ, viễn thám", "time": "1.5 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Trình Lãnh đạo Sở phê duyệt", "unit": "Lãnh đạo Phòng Quy hoạch, kế hoạch đất đai và Quản lý đo đạc, bản đồ, viễn thám", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 6", "task": "Thông báo hướng dẫn hoàn thiện hồ sơ", "unit": "Lãnh đạo Sở Nông nghiệp và Môi trường", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm Phục vụ HCC, Trung tâm Phục vụ HCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 2", "task": "Thẩm định hồ sơ sau hoàn thiện", "unit": "Phòng Quy hoạch, kế hoạch đất đai và Quản lý đo đạc, bản đồ, viễn thám", "time": "03 ngày" },
        { "step": "GĐ2 - Bước 3", "task": "Trình lãnh đạo Sở", "unit": "Lãnh đạo Phòng Quy hoạch, kế hoạch đất đai và Quản lý đo đạc, bản đồ, viễn thám", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 4", "task": "Trình phê duyệt", "unit": "Lãnh đạo Sở Nông nghiệp và Môi trường", "time": "01 ngày" },
        { "step": "GĐ2 - Bước 5", "task": "Phê duyệt Chủ tịch UBND tỉnh", "unit": "Chủ tịch UBND tỉnh", "time": "02 ngày" }
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
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm Phục vụ HCC, Trung tâm Phục vụ HCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.25 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Đề nghị cung cấp thông tin", "unit": "Phòng Quy hoạch, kế hoạch đất đai và Quản lý đo đạc, bản đồ, viễn thám", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Lãnh đạo Phòng Quy hoạch, kế hoạch đất đai và Quản lý đo đạc, bản đồ, viễn thám", "unit": "Lãnh đạo Phòng QH, KH đất đai", "time": "0.25 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Cung cấp thông tin về cơ sở dữ liệu đất đai, lập trích lục bản đồ địa chính thửa đất", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Lãnh đạo phòng Đăng ký và Cấp giấy chứng nhận", "unit": "Lãnh đạo Phòng ĐK", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 6", "task": "Lãnh đạo Văn Phòng Đăng ký Đất đai tỉnh", "unit": "Lãnh đạo VPĐKĐĐ", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 7", "task": "Thẩm định hồ sơ, kiểm tra thực địa", "unit": "Phòng Quy hoạch, kế hoạch đất đai và Quản lý đo đạc, bản đồ, viễn thám", "time": "1.5 ngày" },
        { "step": "GĐ1 - Bước 8", "task": "Trình Lãnh đạo phê duyệt", "unit": "Lãnh đạo Phòng Quy hoạch, kế hoạch đất đai và Quản lý đo đạc, bản đồ, viễn thám", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 9", "task": "Thông báo hướng dẫn hoàn thiện hồ sơ", "unit": "Lãnh đạo Sở Nông nghiệp và Môi trường", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ sau thực hiện nghĩa vụ tài chính", "unit": "Trung tâm Phục vụ HCC, Trung tâm Phục vụ HCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.25 ngày" },
        { "step": "GĐ2 - Bước 2", "task": "Thẩm định, lập tờ trình cấp giấy", "unit": "Phòng Khoa học công nghệ và Đăng ký đất đai", "time": "1.5 ngày" },
        { "step": "GĐ2 - Bước 3", "task": "Trình lãnh đạo cấp giấy", "unit": "Lãnh đạo Phòng Khoa học công nghệ và Đăng ký đất đai", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 4", "task": "Phê duyệt Giấy chứng nhận", "unit": "Lãnh đạo Sở Nông nghiệp và Môi trường", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 5", "task": "Trả kết quả", "unit": "Trung tâm Phục vụ HCC/ Bưu chính chuyển cho tổ chức, công dân; Trung tâm Phục vụ HCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
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
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thẩm định hồ sơ", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "02 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Phê duyệt hồ sơ", "unit": "Lãnh đạo Chi nhánh Văn phòng Đăng ký Đất đai", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Chuyển thông tin xác định nghĩa vụ tài chính đến Cơ quan thuế", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 2", "task": "Thẩm định, lập tờ trình cấp giấy", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "02 ngày" },
        { "step": "GĐ2 - Bước 3", "task": "Trình duyệt", "unit": "Lãnh đạo Chi nhánh Văn phòng Đăng ký Đất đai", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 4", "task": "Phê duyệt Giấy chứng nhận", "unit": "Lãnh đạo Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 5", "task": "Chuyển trả kết quả cho TTHCC", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 6", "task": "Trả kết quả", "unit": "Trung tâm PVHCC/ Bưu chính chuyển cho tổ chức, công dân; Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
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
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thẩm định hồ sơ", "unit": "Văn phòng Đăng ký Đất đai", "time": "09 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Phê duyệt", "unit": "Lãnh đạo Chi nhánh Văn phòng Đăng ký Đất đai", "time": "02 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Chuyển trả kết quả cho TTHCC", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Trả kết quả", "unit": "Trung tâm PVHCC/ Bưu chính chuyển cho tổ chức, công dân; Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": ["Luật Đất đai 2024", "Quyết định 918/QĐ-TTPVHCC"],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-04",
    "category": "Điều chỉnh",
    "title": "Điều chỉnh quyết định giao đất, cho thuê đất, cho phép chuyển mục đích sử dụng đất do thay đổi căn cứ, sai sót về ranh giới, vị trí, diện tích, mục đích sử dụng đất và số liệu bàn giao đất trên thực địa",
    "description": "Thủ tục điều chỉnh quyết định giao đất, cho thuê đất, cho phép chuyển mục đích sử dụng đất do có sai sót về ranh giới, vị trí, diện tích, mục đích sử dụng giữa bản đồ quy hoạch, bản đồ địa chính, quyết định giao đất, cho thuê đất, cho phép chuyển mục đích sử dụng đất và số liệu bàn giao đất trên thực địa.",
    "applicableTo": "Tổ chức, cá nhân, hộ gia đình.",
    "duration": "07 ngày (17 ngày đối với vùng khó khăn).",
    "documents": [
        "Đơn đề nghị điều chỉnh quyết định giao đất, cho thuê đất, cho phép chuyển mục đích sử dụng đất (Mẫu số 03 tại Phụ lục ban hành kèm theo Nghị định số 151/2025/NĐ-CP).",
        "Văn bản của cơ quan nhà nước có thẩm quyền có nội dung làm thay đổi căn cứ quyết định giao đất, cho thuê đất, cho phép chuyển mục đích sử dụng đất quy định tại các khoản 1, 2, 3, 4 và 5 Điều 116 Luật Đất đai."
    ],
    "steps": [
        "Giai đoạn 1: Tiếp nhận và thẩm định (4.5 ngày)",
        "Giai đoạn 2: Quyết định (02 ngày)"
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm Phục vụ HCC tỉnh; Trung tâm Phục vụ HCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thẩm định hồ sơ", "unit": "Phòng Quy hoạch, kế hoạch đất đai và Quản lý đo đạc, bản đồ, viễn thám phối hợp Văn phòng ĐKĐĐ tỉnh", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Trình Lãnh đạo phê duyệt", "unit": "Lãnh đạo Phòng Quy hoạch, kế hoạch đất đai và Quản lý đo đạc, bản đồ, viễn thám", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Trình phê duyệt", "unit": "Lãnh đạo Sở Nông nghiệp và Môi trường", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Phê duyệt điều chỉnh Quyết định", "unit": "Chủ tịch UBND tỉnh", "time": "02 ngày" },
        { "step": "GĐ2 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm Phục vụ HCC tỉnh; Trung tâm Phục vụ HCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 2", "task": "Thẩm định hồ sơ trình phê duyệt", "unit": "Chi nhánh Văn phòng Đăng ký đất đai", "time": "02 ngày" },
        { "step": "GĐ2 - Bước 3", "task": "Phê duyệt", "unit": "Lãnh đạo Chi nhánh Văn phòng Đăng ký đất đai", "time": "01 ngày" },
        { "step": "GĐ2 - Bước 4", "task": "Chuyển trả kết quả cho TTHCC", "unit": "Chi nhánh Văn phòng Đăng ký đất đai", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 5", "task": "Trả kết quả", "unit": "Trung tâm Phục vụ HCC tỉnh/ Bưu chính chuyển cho tổ chức, công dân; Trung tâm Phục vụ HCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai số 31/2024/QH15 ngày 18/01/2024",
        "Nghị định số 102/2024/NĐ-CP ngày 30/7/2024",
        "Nghị định 118/2025/NĐ-CP ngày 09/6/2025",
        "Nghị định số 151/2025/NĐ-CP ngày 12/6/2025",
        "Nghị định số 226/2025/NĐ-CP ngày 15/8/2025"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-05",
    "category": "Điều chỉnh",
    "title": "Điều chỉnh quyết định giao đất, cho thuê đất, cho phép chuyển mục đích sử dụng đất do sai sót về ranh giới, vị trí, diện tích, mục đích sử dụng giữa bản đồ quy hoạch, bản đồ địa chính, quyết định giao đất, cho thuê đất, cho phép chuyển mục đích sử dụng đất và số liệu bàn giao đất trên thực địa",
    "description": "Điều chỉnh quyết định giao đất, cho thuê đất, cho phép chuyển mục đích sử dụng đất do có sai sót về ranh giới, vị trí, diện tích, mục đích sử dụng giữa bản đồ quy hoạch, bản đồ địa chính, quyết định giao đất, cho thuê đất, cho phép chuyển mục đích sử dụng đất và số liệu bàn giao đất trên thực địa.",
    "applicableTo": "Tổ chức, cá nhân, hộ gia đình.",
    "duration": "07 ngày (17 ngày đối với vùng khó khăn).",
    "documents": [
        "Đơn đề nghị điều chỉnh quyết định giao đất, cho thuê đất, cho phép chuyển mục đích sử dụng đất (Mẫu số 03 tại Phụ lục ban hành kèm theo Nghị định số 151/2025/NĐ-CP).",
        "Văn bản của cơ quan nhà nước có thẩm quyền có nội dung làm thay đổi căn cứ quyết định giao đất, cho thuê đất, cho phép chuyển mục đích sử dụng đất quy định tại các khoản 1, 2, 3, 4 và 5 Điều 116 Luật Đất đai."
    ],
    "steps": [
        "Giai đoạn 1: Tiếp nhận và thẩm định (4.5 ngày)",
        "Giai đoạn 2: Quyết định (02 ngày)"
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm Phục vụ HCC tỉnh; Trung tâm Phục vụ HCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thẩm định hồ sơ", "unit": "Phòng Quy hoạch, kế hoạch đất đai và Quản lý đo đạc, bản đồ, viễn thám phối hợp Văn phòng ĐKĐĐ tỉnh", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Trình Lãnh đạo phê duyệt", "unit": "Lãnh đạo Phòng Quy hoạch, kế hoạch đất đai và Quản lý đo đạc, bản đồ, viễn thám", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Trình phê duyệt", "unit": "Lãnh đạo Sở Nông nghiệp và Môi trường", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Phê duyệt điều chỉnh Quyết định", "unit": "Chủ tịch UBND tỉnh", "time": "02 ngày" },
        { "step": "GĐ2 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm Phục vụ HCC tỉnh; Trung tâm Phục vụ HCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 2", "task": "Thẩm định hồ sơ trình phê duyệt", "unit": "Chi nhánh Văn phòng Đăng ký đất đai", "time": "02 ngày" },
        { "step": "GĐ2 - Bước 3", "task": "Phê duyệt", "unit": "Lãnh đạo Chi nhánh Văn phòng Đăng ký đất đai", "time": "01 ngày" },
        { "step": "GĐ2 - Bước 4", "task": "Chuyển trả kết quả cho TTHCC", "unit": "Chi nhánh Văn phòng Đăng ký đất đai", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 5", "task": "Trả kết quả", "unit": "Trung tâm Phục vụ HCC tỉnh/ Bưu chính chuyển cho tổ chức, công dân; Trung tâm Phục vụ HCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai số 31/2024/QH15",
        "Nghị định số 102/2024/NĐ-CP",
        "Nghị định 118/2025/NĐ-CP ngày 09/6/2025",
        "Nghị định số 151/2025/NĐ-CP ngày 12/6/2025",
        "Nghị định số 226/2025/NĐ-CP ngày 15/8/2025"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-06",
    "category": "Đăng ký, Cấp GCN",
    "title": "Đăng ký, cấp GCN lần đầu đối với trường hợp được Nhà nước giao đất để quản lý",
    "description": "Thủ tục đăng ký đất đai lần đầu đối với trường hợp được Nhà nước giao đất để quản lý.",
    "applicableTo": "Tổ chức được giao đất để quản lý, cộng đồng dân cư.",
    "duration": "Không quá 17 ngày làm việc.",
    "documents": [
      "Đơn đăng ký đất đai, tài sản gắn liền với đất (Mẫu số 15).",
      "Báo cáo kết quả rà soát hiện trạng sử dụng đất (Mẫu số 15đ)."
    ],
    "steps": [
      "Nộp hồ sơ tại Trung tâm Phục vụ hành chính công hoặc Văn phòng đăng ký đất đai.",
      "Văn phòng đăng ký đất đai kiểm tra hồ sơ, lập, cập nhật, chỉnh lý hồ sơ địa chính, cơ sở dữ liệu đất đai.",
      "Trả kết quả cho người sử dụng đất."
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Kiểm tra thông tin", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "04 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Trình Lãnh đạo", "unit": "Lãnh đạo phòng Đăng ký và Cấp giấy chứng nhận", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Phê duyệt hồ sơ", "unit": "Lãnh đạo Văn phòng Đăng ký Đất đai tỉnh", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Chuyển thông tin xác định nghĩa vụ tài chính đến Cơ quan thuế", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "01 ngày" },
        { "step": "GĐ2 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 2", "task": "Thẩm định hồ sơ", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "02 ngày" },
        { "step": "GĐ2 - Bước 3", "task": "Trình phê duyệt", "unit": "Lãnh đạo phòng Đăng ký và Cấp giấy chứng nhận", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 4", "task": "Phê duyệt Giấy chứng nhận", "unit": "Lãnh đạo Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 5", "task": "Chuyển trả kết quả cho TTHCC", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 6", "task": "Trả kết quả", "unit": "Trung tâm PVHCC/ Bưu chính chuyển cho tổ chức, công dân; Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": [
      "Luật Đất đai số 31/2024/QH15",
      "Nghị định số 101/2024/NĐ-CP",
      "Nghị định số 118/2025/NĐ-CP",
      "Nghị định số 151/2025/NĐ-CP",
      "Nghị định số 226/2025/NĐ-CP"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-07",
    "category": "Đăng ký, Cấp GCN",
    "title": "Xóa đăng ký thuê, cho thuê lại quyền sử dụng đất trong dự án xây dựng kinh doanh kết cấu hạ tầng",
    "description": "Thủ tục xóa đăng ký cho thuê, cho thuê lại quyền sử dụng đất trong dự án xây dựng kinh doanh kết cấu hạ tầng.",
    "applicableTo": "Tổ chức, cá nhân tham gia dự án xây dựng kinh doanh kết cấu hạ tầng.",
    "duration": "Không quá 03 ngày làm việc (vùng sâu, xa không quá 13 ngày).",
    "documents": [
      "Đơn đăng ký biến động đất đai, tài sản gắn liền với đất (Mẫu số 18).",
      "Giấy chứng nhận đã cấp (bản gốc).",
      "Văn bản về việc xóa cho thuê, cho thuê lại quyền sử dụng đất.",
      "Văn bản về việc đại diện theo quy định của pháp luật (nếu có)."
    ],
    "steps": [
      "Nộp hồ sơ tại Trung tâm Phục vụ hành chính công hoặc Văn phòng đăng ký đất đai.",
      "Văn phòng đăng ký đất đai xác nhận việc xóa cho thuê, cho thuê lại vào Giấy chứng nhận.",
      "Chỉnh lý, cập nhật biến động vào hồ sơ địa chính, cơ sở dữ liệu đất đai.",
      "Trả Giấy chứng nhận cho người sử dụng đất."
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thẩm định hồ sơ, lập tờ trình cấp giấy", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "1.5 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Phê duyệt Giấy chứng nhận", "unit": "Lãnh đạo Chi nhánh Văn phòng Đăng ký Đất đai", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Chuyển trả kết quả cho TTHCC", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Trả kết quả", "unit": "Trung tâm PVHCC/ Bưu chính chuyển cho tổ chức, công dân; Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai số 31/2024/QH15",
        "Nghị định số 101/2024/NĐ-CP",
        "Nghị định số 118/2025/NĐ-CP",
        "Nghị định số 151/2025/NĐ-CP",
        "Nghị định số 226/2025/NĐ-CP"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-10",
    "category": "Đăng ký, Cấp GCN",
    "title": "Đăng ký biến động do thành lập doanh nghiệp tư nhân và sử dụng đất vào hoạt động sản xuất kinh doanh",
    "description": "Đăng ký biến động đối với trường hợp thành viên hộ gia đình hoặc cá nhân thành lập doanh nghiệp tư nhân và sử dụng đất vào hoạt động sản xuất kinh doanh.",
    "applicableTo": "Hộ gia đình, cá nhân thành lập doanh nghiệp tư nhân.",
    "duration": "Không quá 08 ngày làm việc (vùng sâu, xa không quá 18 ngày).",
    "documents": [
      "Đơn đăng ký biến động đất đai, tài sản gắn liền với đất (Mẫu số 18).",
      "Giấy chứng nhận đã cấp (bản gốc).",
      "Giấy chứng nhận đăng ký doanh nghiệp.",
      "Văn bản thỏa thuận của các thành viên trong hộ gia đình (nếu là đất của hộ gia đình, có công chứng/chứng thực).",
      "Bản vẽ tách thửa, hợp thửa đất (nếu phải tách/hợp thửa).",
      "Văn bản về việc đại diện theo quy định (nếu có)."
    ],
    "steps": [
      "Nộp hồ sơ tại Trung tâm Phục vụ hành chính công hoặc Văn phòng đăng ký đất đai.",
      "Văn phòng đăng ký đất đai kiểm tra, xác nhận thay đổi vào Giấy chứng nhận đã cấp hoặc cấp mới Giấy chứng nhận.",
      "Chỉnh lý, cập nhật biến động vào hồ sơ địa chính, cơ sở dữ liệu đất đai.",
      "Trao Giấy chứng nhận cho người sử dụng đất."
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thẩm định hồ sơ", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "4.5 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Trình phê duyệt", "unit": "Lãnh đạo phòng Đăng ký và Cấp giấy chứng nhận", "time": "1.5 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Phê duyệt Giấy chứng nhận", "unit": "Lãnh đạo Văn phòng Đăng ký Đất đai tỉnh", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Chuyển trả kết quả cho TTHCC", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 6", "task": "Trả kết quả", "unit": "Trung tâm PVHCC/ Bưu chính chuyển cho tổ chức, công dân; Trung tâm PVHCC xã, phường, đặc khu", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai số 31/2024/QH15",
        "Nghị định số 101/2024/NĐ-CP",
        "Nghị định số 118/2025/NĐ-CP",
        "Nghị định số 151/2025/NĐ-CP",
        "Nghị định số 226/2025/NĐ-CP"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-11",
    "category": "Đăng ký, Cấp GCN",
    "title": "Đăng ký, cấp GCN với thửa đất có diện tích tăng thêm do thay đổi ranh giới",
    "description": "Thủ tục đăng ký và cấp Giấy chứng nhận cho phần diện tích đất tăng thêm do thay đổi ranh giới so với Giấy chứng nhận đã cấp.",
    "applicableTo": "Tổ chức, cá nhân, hộ gia đình có diện tích đất tăng thêm.",
    "duration": "Không quá 20 ngày làm việc (vùng sâu, xa không quá 30 ngày).",
    "documents": [
      "Đơn đăng ký biến động đất đai, tài sản gắn liền với đất (Mẫu số 18).",
      "Giấy chứng nhận đã cấp (bản gốc).",
      "Giấy tờ về việc nhận chuyển quyền sử dụng đất hoặc giấy tờ chứng minh phần diện tích tăng thêm.",
      "Mảnh trích đo bản đồ địa chính của thửa đất sau khi thay đổi.",
      "Văn bản về việc đại diện theo quy định (nếu có)."
    ],
    "steps": [
      "Nộp hồ sơ tại Trung tâm Phục vụ hành chính công hoặc Văn phòng đăng ký đất đai.",
      "Cơ quan có thẩm quyền kiểm tra, xác nhận, gửi thông tin địa chính đến cơ quan thuế.",
      "Sau khi người sử dụng đất hoàn thành nghĩa vụ tài chính, Văn phòng ĐKĐĐ cấp mới hoặc xác nhận thay đổi trên GCN.",
      "Chỉnh lý, cập nhật hồ sơ địa chính và trao GCN cho người sử dụng đất."
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.25 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thẩm định hồ sơ, lập tờ trình cấp giấy", "unit": "Phòng QHCN và ĐKĐĐ", "time": "1.5 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Trình lãnh đạo cấp giấy", "unit": "Lãnh đạo Phòng KHCN và ĐKĐĐ", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Phê duyệt Giấy chứng nhận", "unit": "Lãnh đạo VP ĐKĐĐ tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Chuyển hồ sơ cấp giấy", "unit": "Phòng QHCN và ĐKĐĐ", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 6", "task": "Thẩm định, lập tờ trình cấp giấy", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "1.5 ngày" },
        { "step": "GĐ1 - Bước 7", "task": "Trình lãnh đạo cấp giấy", "unit": "Lãnh đạo phòng Đăng ký và Cấp giấy chứng nhận", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 8", "task": "Phê duyệt Giấy chứng nhận", "unit": "Lãnh đạo Văn phòng Đăng ký Đất đai tỉnh", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 9", "task": "Trả kết quả", "unit": "Trung tâm PVHCC/ Bưu chính chuyển cho tổ chức, công dân; Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai số 31/2024/QH15",
        "Nghị định số 101/2024/NĐ-CP",
        "Nghị định số 118/2025/NĐ-CP",
        "Nghị định số 151/2025/NĐ-CP",
        "Nghị định số 226/2025/NĐ-CP"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-12",
    "category": "Đăng ký, Cấp GCN",
    "title": "Đăng ký, cấp GCN cho phần diện tích còn lại của thửa đất ở trước 01/7/2004",
    "description": "Thủ tục cấp GCN cho phần diện tích còn lại của thửa đất đã được cấp một phần diện tích là đất ở trước ngày 01/7/2004.",
    "applicableTo": "Cá nhân, hộ gia đình.",
    "duration": "Không quá 20 ngày làm việc (vùng sâu, xa không quá 30 ngày).",
    "documents": [
      "Đơn đăng ký biến động đất đai, tài sản gắn liền với đất (Mẫu số 18).",
      "Giấy chứng nhận đã cấp (bản gốc).",
      "Sơ đồ thửa đất thể hiện rõ vị trí, kích thước toàn bộ thửa đất.",
      "Giấy xác nhận của UBND cấp xã về hiện trạng sử dụng đất (nếu cần)."
    ],
    "steps": [
      "Nộp hồ sơ tại Trung tâm Phục vụ hành chính công hoặc Chi nhánh Văn phòng đăng ký đất đai.",
      "Chi nhánh Văn phòng ĐKĐĐ kiểm tra hồ sơ, lấy ý kiến UBND cấp xã.",
      "Gửi thông tin địa chính đến cơ quan thuế để xác định nghĩa vụ tài chính.",
      "Sau khi người sử dụng đất hoàn thành nghĩa vụ tài chính, thực hiện cấp Giấy chứng nhận cho toàn bộ diện tích thửa đất.",
      "Cập nhật hồ sơ địa chính và trả kết quả."
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thẩm định hồ sơ", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "1.5 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Trình Lãnh đạo", "unit": "Lãnh đạo phòng Đăng ký và Cấp giấy chứng nhận", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Phê duyệt hồ sơ", "unit": "Lãnh đạo Văn phòng Đăng ký Đất đai tỉnh", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Chuyển thông tin xác định nghĩa vụ tài chính đến Cơ quan thuế", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 2", "task": "Thẩm định, lập tờ trình cấp giấy", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "02 ngày" },
        { "step": "GĐ2 - Bước 3", "task": "Trình duyệt", "unit": "Lãnh đạo phòng Đăng ký và Cấp giấy chứng nhận", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 4", "task": "Phê duyệt Giấy chứng nhận", "unit": "Lãnh đạo Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 5", "task": "Chuyển trả kết quả cho TTHCC", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 6", "task": "Trả kết quả", "unit": "Trung tâm PVHCC/ Bưu chính chuyển cho tổ chức, công dân; Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai số 31/2024/QH15",
        "Nghị định số 101/2024/NĐ-CP",
        "Nghị định số 118/2025/NĐ-CP",
        "Nghị định số 151/2025/NĐ-CP",
        "Nghị định số 226/2025/NĐ-CP"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-13",
    "category": "Đăng ký, Cấp GCN",
    "title": "Cấp đổi Giấy chứng nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất",
    "description": "Thủ tục cấp đổi GCN bị ố, nhòe, rách, hư hỏng; do đo đạc lại; do thay đổi thông tin; hoặc có nhu cầu đổi sang mẫu GCN mới.",
    "applicableTo": "Tổ chức, cá nhân, cộng đồng dân cư.",
    "duration": "Không quá 05 ngày làm việc; (vùng sâu, vùng xa không quá 10 ngày).",
    "documents": [
      "Đơn đăng ký biến động đất đai, tài sản gắn liền với đất (Mẫu số 18).",
      "Bản gốc Giấy chứng nhận đã cấp.",
      "Bản sao hợp đồng thế chấp (trường hợp đất đang thế chấp tại tổ chức tín dụng).",
      "Giấy tờ chứng minh thay đổi thông tin (nếu có)."
    ],
    "steps": [
      "Người yêu cầu nộp hồ sơ tại Trung tâm Phục vụ hành chính công hoặc Văn phòng đăng ký đất đai.",
      "Văn phòng đăng ký đất đai kiểm tra hồ sơ, lập hồ sơ trình cơ quan có thẩm quyền cấp Giấy chứng nhận mới.",
      "Văn phòng đăng ký đất đai cập nhật, chỉnh lý hồ sơ địa chính và trao Giấy chứng nhận cho người được cấp."
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Văn phòng ĐKĐĐ hoặc Chi nhánh VPĐKĐĐ", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thẩm định hồ sơ", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "06 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Phê duyệt Giấy chứng nhận", "unit": "Lãnh đạo Chi nhánh Văn phòng Đăng ký Đất đai", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Chuyển trả kết quả cho TTHCC", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Trả kết quả", "unit": "Trung tâm PVHCC/ Bưu chính chuyển cho tổ chức, công dân; Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai số 31/2024/QH15",
        "Nghị định số 101/2024/NĐ-CP",
        "Nghị định số 118/2025/NĐ-CP",
        "Nghị định số 151/2025/NĐ-CP",
        "Nghị định số 226/2025/NĐ-CP"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-14",
    "category": "Đăng ký, Cấp GCN",
    "title": "Tách thửa hoặc hợp thửa đất",
    "description": "Thủ tục chia một thửa đất thành nhiều thửa đất mới (tách thửa) hoặc gộp nhiều thửa đất thành một thửa đất mới (hợp thửa).",
    "applicableTo": "Tổ chức, cá nhân, cộng đồng dân cư.",
    "duration": "Không quá 12 ngày làm việc (vùng sâu, vùng xa không quá 22 ngày).",
    "documents": [
      "Đơn đề nghị tách thửa đất, hợp thửa đất (Mẫu số 21).",
      "Bản vẽ tách thửa đất, hợp thửa đất (Mẫu số 22).",
      "Bản gốc Giấy chứng nhận đã cấp."
    ],
    "steps": [
      "Người sử dụng đất nộp hồ sơ tại Trung tâm Phục vụ hành chính công hoặc Văn phòng đăng ký đất đai.",
      "Văn phòng đăng ký đất đai kiểm tra hồ sơ và xác nhận đủ điều kiện tách, hợp thửa.",
      "Thực hiện đo đạc địa chính, lập hồ sơ trình cơ quan có thẩm quyền cấp Giấy chứng nhận cho thửa đất mới.",
      "Chỉnh lý, cập nhật biến động vào hồ sơ địa chính và trao Giấy chứng nhận cho người sử dụng đất."
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thẩm định hồ sơ", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "09 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Phê duyệt", "unit": "Lãnh đạo Chi nhánh Văn phòng Đăng ký Đất đai", "time": "02 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Chuyển trả kết quả cho TTHCC", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Trả kết quả", "unit": "Trung tâm PVHCC/ Bưu chính chuyển cho tổ chức, công dân; Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai số 31/2024/QH15",
        "Nghị định số 101/2024/NĐ-CP",
        "Nghị định số 118/2025/NĐ-CP",
        "Nghị định số 151/2025/NĐ-CP",
        "Nghị định số 226/2025/NĐ-CP"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-15",
    "category": "Đăng ký, Cấp GCN",
    "title": "Cấp lại Giấy chứng nhận do bị mất",
    "description": "Thủ tục đề nghị cấp lại Giấy chứng nhận do bị mất.",
    "applicableTo": "Tổ chức, cá nhân, cộng đồng dân cư.",
    "duration": "Không quá 10 ngày làm việc (vùng sâu, xa không quá 20 ngày).",
    "documents": [
      "Đơn đăng ký biến động đất đai, tài sản gắn liền với đất (Mẫu số 18).",
      "Giấy xác nhận của UBND cấp xã về việc đã niêm yết thông báo mất giấy trong 15 ngày."
    ],
    "steps": [
      "Người sử dụng đất khai báo với UBND cấp xã nơi có đất về việc bị mất GCN.",
      "Sau 15 ngày niêm yết, người sử dụng đất nộp hồ sơ xin cấp lại GCN tại Văn phòng Đăng ký đất đai.",
      "Văn phòng ĐKĐĐ kiểm tra, lập hồ sơ trình cơ quan có thẩm quyền ký quyết định hủy GCN bị mất và cấp lại GCN mới.",
      "Cập nhật, chỉnh lý hồ sơ địa chính và trao Giấy chứng nhận cho người được cấp lại."
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Văn phòng ĐKĐĐ hoặc Chi nhánh VPĐKĐĐ", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Kiểm tra thông tin, chuyển hồ sơ đến UBND xã nơi có đất", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Lãnh đạo Chi nhánh Văn phòng Đăng ký Đất đai", "unit": "Lãnh đạo Chi nhánh", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Kiểm tra hồ sơ, niêm yết công khai", "unit": "Cơ quan chuyên môn về nông nghiệp và môi trường cấp xã", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Lãnh đạo Cơ quan chuyên môn về nông nghiệp và môi trường cấp xã", "unit": "Lãnh đạo CQ chuyên môn", "time": "0.25 ngày" },
        { "step": "GĐ1 - Bước 6", "task": "Lãnh đạo UBND cấp xã nơi có đất", "unit": "Lãnh đạo UBND cấp xã", "time": "0.25 ngày" },
        { "step": "GĐ1 - Bước 7", "task": "Lập biên bản và gửi đến Chi nhánh Văn phòng Đăng ký Đất đai", "unit": "Cơ quan chuyên môn về nông nghiệp và môi trường cấp xã", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 8", "task": "Lãnh đạo Cơ quan chuyên môn về nông nghiệp và môi trường cấp xã", "unit": "Lãnh đạo CQ chuyên môn", "time": "0.25 ngày" },
        { "step": "GĐ1 - Bước 9", "task": "Lãnh đạo UBND cấp xã nơi có đất", "unit": "Lãnh đạo UBND cấp xã", "time": "0.25 ngày" },
        { "step": "GĐ1 - Bước 10", "task": "Thẩm định hồ sơ", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "1.5 ngày" },
        { "step": "GĐ1 - Bước 11", "task": "Phê duyệt hồ sơ", "unit": "Lãnh đạo Chi nhánh Văn phòng Đăng ký Đất đai", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 12", "task": "Chuyển thông tin xác định nghĩa vụ tài chính đến Cơ quan thuế", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 2", "task": "Thẩm định, lập tờ trình cấp giấy", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "02 ngày" },
        { "step": "GĐ2 - Bước 3", "task": "Phê duyệt Giấy chứng nhận", "unit": "Lãnh đạo Chi nhánh Văn phòng Đăng ký Đất đai", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 4", "task": "Chuyển trả kết quả cho TTHCC", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 5", "task": "Trả kết quả", "unit": "Trung tâm PVHCC/ Bưu chính chuyển cho tổ chức, công dân; Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai số 31/2024/QH15",
        "Nghị định số 101/2024/NĐ-CP",
        "Nghị định số 118/2025/NĐ-CP",
        "Nghị định số 151/2025/NĐ-CP",
        "Nghị định số 226/2025/NĐ-CP"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-16",
    "category": "Đăng ký, Cấp GCN",
    "title": "Đính chính Giấy chứng nhận đã cấp",
    "description": "Thủ tục đính chính các thông tin bị sai sót trên Giấy chứng nhận đã cấp.",
    "applicableTo": "Tổ chức, cá nhân, cộng đồng dân cư.",
    "duration": "Không quá 08 ngày làm việc (vùng sâu, xa không quá 18 ngày).",
    "documents": [
      "Đơn đăng ký biến động đất đai (Mẫu số 18).",
      "Bản gốc Giấy chứng nhận đã cấp.",
      "Giấy tờ chứng minh nội dung sai sót so với thông tin tại thời điểm cấp GCN."
    ],
    "steps": [
      "Nộp hồ sơ tại Văn phòng đăng ký đất đai hoặc Trung tâm Phục vụ hành chính công.",
      "Văn phòng đăng ký đất đai kiểm tra, lập biên bản kết luận về nội dung và nguyên nhân sai sót.",
      "Thực hiện đính chính bằng cách ghi nội dung thay đổi vào GCN hoặc cấp GCN mới nếu có yêu cầu.",
      "Cập nhật, chỉnh lý hồ sơ địa chính và trả kết quả."
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thẩm định hồ sơ", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "06 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Phê duyệt", "unit": "Lãnh đạo Chi nhánh Văn phòng Đăng ký Đất đai", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Chuyển trả kết quả cho TTHCC", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Trả kết quả", "unit": "Trung tâm PVHCC/ Bưu chính chuyển cho tổ chức, công dân; Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai số 31/2024/QH15",
        "Nghị định số 101/2024/NĐ-CP",
        "Nghị định số 118/2025/NĐ-CP",
        "Nghị định số 151/2025/NĐ-CP",
        "Nghị định số 226/2025/NĐ-CP"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-17",
    "category": "Đăng ký, Cấp GCN",
    "title": "Thu hồi và cấp lại GCN đã cấp không đúng quy định do người sử dụng đất phát hiện",
    "description": "Thủ tục thu hồi GCN đã cấp không đúng quy định do người sử dụng đất phát hiện và đề nghị cấp lại.",
    "applicableTo": "Người sử dụng đất, chủ sở hữu tài sản.",
    "duration": "Thu hồi: không quá 25 ngày. Cấp lại: không quá 20 ngày (vùng sâu, xa không quá 30-35 ngày).",
    "documents": [
      "Văn bản kiến nghị của người sử dụng đất về việc cấp GCN không đúng quy định (bản chính).",
      "Bản gốc Giấy chứng nhận đã cấp."
    ],
    "steps": [
      "Nộp hồ sơ tại Trung tâm Phục vụ hành chính công hoặc Văn phòng đăng ký đất đai.",
      "Cơ quan có thẩm quyền kiểm tra, xem xét, quyết định thu hồi Giấy chứng nhận.",
      "Sau khi thu hồi, cơ quan có thẩm quyền thực hiện việc cấp lại Giấy chứng nhận theo đúng quy định.",
      "Văn phòng ĐKĐĐ chỉnh lý hồ sơ địa chính và trao GCN mới cho người sử dụng đất."
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thẩm định hồ sơ", "unit": "Văn phòng Đăng ký đất đai tỉnh", "time": "19 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Trình thu hồi Giấy chứng nhận", "unit": "Lãnh đạo phòng Đăng ký và Cấp giấy chứng nhận", "time": "02 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Phê duyệt Quyết định thu hồi Giấy chứng nhận", "unit": "Lãnh đạo Văn phòng Đăng ký Đất đai tỉnh", "time": "03 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Thẩm định hồ sơ cấp giấy", "unit": "Văn phòng Đăng ký đất đai tỉnh", "time": "Theo quy định tại mục 2,3,4,5,6,7 và 8 Phần II" },
        { "step": "GĐ1 - Bước 6", "task": "Trình cấp Giấy chứng nhận", "unit": "Lãnh đạo phòng Đăng ký và Cấp giấy chứng nhận", "time": "Theo quy định tại mục 2,3,4,5,6,7 và 8 Phần II" },
        { "step": "GĐ1 - Bước 7", "task": "Phê duyệt", "unit": "Lãnh đạo Văn phòng Đăng ký Đất đai tỉnh", "time": "Theo quy định tại mục 2,3,4,5,6,7 và 8 Phần II" },
        { "step": "GĐ1 - Bước 8", "task": "Chuyển trả kết quả cho TTHCC", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "Theo quy định tại mục 2,3,4,5,6,7 và 8 Phần II" },
        { "step": "GĐ1 - Bước 9", "task": "Trả kết quả", "unit": "Trung tâm PVHCC/ Bưu chính chuyển cho tổ chức, công dân; Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai số 31/2024/QH15",
        "Nghị định số 101/2024/NĐ-CP",
        "Nghị định số 118/2025/NĐ-CP",
        "Nghị định số 151/2025/NĐ-CP",
        "Nghị định số 226/2025/NĐ-CP"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-18",
    "category": "Đăng ký, Cấp GCN",
    "title": "Đăng ký, cấp GCN cho trường hợp đã chuyển quyền trước 01/8/2024 nhưng chưa làm thủ tục",
    "description": "Thủ tục cấp GCN cho người nhận chuyển quyền sử dụng đất trước ngày 01/8/2024 nhưng chưa thực hiện thủ tục chuyển quyền.",
    "applicableTo": "Người nhận chuyển quyền sử dụng đất.",
    "duration": "Không quá 08 ngày làm việc (vùng sâu, xa không quá 18 ngày).",
    "documents": [
      "Đơn đăng ký biến động đất đai (Mẫu số 18).",
      "Hợp đồng, văn bản về chuyển quyền sử dụng đất đã lập theo quy định.",
      "Hoặc: Bản gốc Giấy chứng nhận của bên chuyển quyền và Giấy tờ về việc chuyển quyền có đủ chữ ký các bên."
    ],
    "steps": [
      "Nộp hồ sơ tại Trung tâm Phục vụ hành chính công hoặc Văn phòng ĐKĐĐ.",
      "Văn phòng ĐKĐĐ thông báo bằng văn bản cho bên chuyển quyền và niêm yết tại UBND cấp xã trong 15 ngày.",
      "Sau 30 ngày kể từ ngày thông báo mà không có tranh chấp, Văn phòng ĐKĐĐ gửi thông tin đến cơ quan thuế.",
      "Sau khi người sử dụng đất hoàn thành nghĩa vụ tài chính, thực hiện cấp Giấy chứng nhận.",
      "Cập nhật hồ sơ địa chính và trả kết quả."
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Kiểm tra thông tin", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "04 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Trình Lãnh đạo", "unit": "Lãnh đạo phòng Đăng ký và Cấp giấy chứng nhận", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Đăng tin trên phương tiện thông tin đại chúng", "unit": "Lãnh đạo Văn phòng Đăng ký Đất đai tỉnh", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Thẩm định hồ sơ", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "02 ngày" },
        { "step": "GĐ1 - Bước 6", "task": "Trình duyệt", "unit": "Lãnh đạo phòng Đăng ký và Cấp giấy chứng nhận", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 7", "task": "Phê duyệt Giấy chứng nhận", "unit": "Lãnh đạo Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 8", "task": "Chuyển trả kết quả cho TTHCC", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 9", "task": "Trả kết quả", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai số 31/2024/QH15",
        "Nghị định số 101/2024/NĐ-CP",
        "Nghị định số 118/2025/NĐ-CP",
        "Nghị định số 151/2025/NĐ-CP",
        "Nghị định số 226/2025/NĐ-CP"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-19",
    "category": "Đăng ký, Cấp GCN",
    "title": "Đăng ký, cấp GCN cho người nhận chuyển nhượng QSDĐ, nhà ở trong dự án bất động sản",
    "description": "Thủ tục đăng ký và cấp GCN cho người nhận chuyển nhượng quyền sử dụng đất, quyền sở hữu nhà ở, công trình xây dựng trong dự án bất động sản.",
    "applicableTo": "Chủ đầu tư dự án hoặc người nhận chuyển nhượng.",
    "duration": "Không quá 08 ngày làm việc (vùng sâu, xa không quá 18 ngày).",
    "documents": [
      "Đơn đăng ký biến động đất đai (Mẫu số 18).",
      "Hợp đồng chuyển nhượng quyền sử dụng đất, quyền sở hữu nhà ở.",
      "Biên bản bàn giao nhà, đất, công trình xây dựng."
    ],
    "steps": [
      "Chủ đầu tư hoặc người nhận chuyển nhượng nộp hồ sơ tại Văn phòng ĐKĐĐ.",
      "Văn phòng ĐKĐĐ kiểm tra hồ sơ, gửi thông tin đến cơ quan thuế.",
      "Sau khi người nhận chuyển nhượng hoàn thành nghĩa vụ tài chính, Văn phòng ĐKĐĐ cấp Giấy chứng nhận.",
      "Cập nhật hồ sơ địa chính và trao Giấy chứng nhận cho người được cấp."
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thẩm định hồ sơ", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "1.5 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Trình Lãnh đạo", "unit": "Lãnh đạo phòng Đăng ký và Cấp giấy chứng nhận", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Phê duyệt hồ sơ", "unit": "Lãnh đạo Văn phòng Đăng ký Đất đai tỉnh", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Chuyển thông tin xác định nghĩa vụ tài chính đến Cơ quan thuế", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 2", "task": "Thẩm định, lập tờ trình cấp giấy", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "02 ngày" },
        { "step": "GĐ2 - Bước 3", "task": "Trình duyệt", "unit": "Lãnh đạo phòng Đăng ký và Cấp giấy chứng nhận", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 4", "task": "Phê duyệt Giấy chứng nhận", "unit": "Lãnh đạo Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 5", "task": "Chuyển trả kết quả cho TTHCC", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 6", "task": "Trả kết quả", "unit": "Trung tâm PVHCC/ Bưu chính chuyển cho tổ chức, công dân; Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai ngày 18/01/2024",
        "Nghị định số 101/2024/NĐ-CP",
        "Nghị định số 118/2025/NĐ-CP",
        "Nghị định số 151/2025/NĐ-CP",
        "Nghị định số 226/2025/NĐ-CP"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-20",
    "category": "Đăng ký, Cấp GCN",
    "title": "Đăng ký biến động (Chuyển đổi, chuyển nhượng, thừa kế, tặng cho, góp vốn...)",
    "description": "Thực hiện đăng ký các thay đổi về người sử dụng đất do chuyển đổi, chuyển nhượng, thừa kế, tặng cho, góp vốn bằng quyền sử dụng đất.",
    "applicableTo": "Tổ chức, cá nhân, hộ gia đình có thay đổi về quyền sử dụng đất.",
    "duration": "Không quá 08 ngày làm việc (vùng sâu, xa không quá 18 ngày).",
    "documents": [
      "Đơn đăng ký biến động đất đai, tài sản gắn liền với đất (Mẫu số 18).",
      "Bản gốc Giấy chứng nhận đã cấp.",
      "Hợp đồng hoặc văn bản về việc chuyển quyền sử dụng đất (chuyển đổi, chuyển nhượng, thừa kế, tặng cho, góp vốn...)."
    ],
    "steps": [
      "Nộp hồ sơ tại Trung tâm phục vụ hành chính công hoặc Văn phòng ĐKĐĐ.",
      "Văn phòng ĐKĐĐ kiểm tra hồ sơ, gửi thông tin địa chính đến cơ quan thuế.",
      "Sau khi người sử dụng đất hoàn thành nghĩa vụ tài chính, Văn phòng ĐKĐĐ xác nhận thay đổi vào GCN đã cấp hoặc cấp GCN mới.",
      "Chỉnh lý hồ sơ địa chính và trao GCN cho người sử dụng đất."
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thẩm định hồ sơ", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "1.5 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Trình Lãnh đạo", "unit": "Lãnh đạo phòng Đăng ký và Cấp giấy chứng nhận", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Phê duyệt hồ sơ", "unit": "Lãnh đạo Văn phòng Đăng ký Đất đai tỉnh", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Chuyển thông tin xác định nghĩa vụ tài chính đến Cơ quan thuế", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 2", "task": "Thẩm định, lập tờ trình cấp giấy", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "02 ngày" },
        { "step": "GĐ2 - Bước 3", "task": "Trình duyệt", "unit": "Lãnh đạo phòng Đăng ký và Cấp giấy chứng nhận", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 4", "task": "Phê duyệt Giấy chứng nhận", "unit": "Lãnh đạo Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 5", "task": "Chuyển trả kết quả cho TTHCC", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 6", "task": "Trả kết quả", "unit": "Trung tâm PVHCC/ Bưu chính chuyển cho tổ chức, công dân; Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai số 31/2024/QH15",
        "Nghị định số 101/2024/NĐ-CP",
        "Nghị định số 118/2025/NĐ-CP",
        "Nghị định số 151/2025/NĐ-CP",
        "Nghị định số 226/2025/NĐ-CP"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-21",
    "category": "Đăng ký, Cấp GCN",
    "title": "Đăng ký biến động (Đổi tên, thay đổi thông tin, hạn chế quyền, sạt lở)",
    "description": "Đăng ký các thay đổi về thông tin người sử dụng đất, thông tin thửa đất, hạn chế quyền sử dụng đất hoặc giảm diện tích do sạt lở tự nhiên.",
    "applicableTo": "Người sử dụng đất, chủ sở hữu tài sản có thay đổi thông tin.",
    "duration": "Không quá 10 ngày làm việc.",
    "documents": [
      "Đơn đăng ký biến động đất đai (Mẫu số 18).",
      "Bản gốc Giấy chứng nhận đã cấp.",
      "Bản sao hoặc bản chính giấy tờ chứng minh việc thay đổi thông tin (ví dụ: CCCD mới, quyết định của tòa án...).",
      "Văn bản của cơ quan có thẩm quyền cho phép hoặc công nhận việc đổi tên (đối với tổ chức)."
    ],
    "steps": [
      "Nộp hồ sơ tại Văn phòng Đăng ký đất đai.",
      "Văn phòng ĐKĐĐ kiểm tra hồ sơ, xác nhận thay đổi vào GCN đã cấp.",
      "Cập nhật, chỉnh lý hồ sơ địa chính, cơ sở dữ liệu đất đai.",
      "Trao Giấy chứng nhận đã được xác nhận thay đổi cho người sử dụng đất."
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thụ lý hồ sơ", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "2.5 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Phê duyệt hồ sơ", "unit": "Lãnh đạo Chi nhánh Văn phòng Đăng ký Đất đai", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Chuyển trả kết quả cho TTHCC", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Trả kết quả", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai số 31/2024/QH15",
        "Nghị định số 101/2024/NĐ-CP",
        "Nghị định số 118/2025/NĐ-CP",
        "Nghị định số 151/2025/NĐ-CP",
        "Nghị định số 226/2025/NĐ-CP"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-22",
    "category": "Đăng ký, Cấp GCN",
    "title": "Đăng ký biến động do chia, tách, hợp nhất, sáp nhập, chuyển đổi mô hình tổ chức",
    "description": "Thủ tục đăng ký thay đổi người sử dụng đất do tổ chức thực hiện chia, tách, sáp nhập, hợp nhất hoặc chuyển đổi mô hình doanh nghiệp.",
    "applicableTo": "Tổ chức, doanh nghiệp.",
    "duration": "Không quá 10 ngày làm việc.",
    "documents": [
      "Đơn đăng ký biến động đất đai (Mẫu số 18).",
      "Bản gốc Giấy chứng nhận đã cấp.",
      "Văn bản về việc chia, tách, hợp nhất, sáp nhập, chuyển đổi của tổ chức.",
      "Bản sao Giấy chứng nhận đăng ký doanh nghiệp mới."
    ],
    "steps": [
      "Nộp hồ sơ tại Văn phòng Đăng ký đất đai.",
      "Văn phòng ĐKĐĐ kiểm tra hồ sơ.",
      "Xác nhận thay đổi vào Giấy chứng nhận đã cấp.",
      "Cập nhật, chỉnh lý hồ sơ địa chính, cơ sở dữ liệu đất đai.",
      "Trả kết quả cho tổ chức."
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thẩm định hồ sơ", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "1.5 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Trình Lãnh đạo", "unit": "Lãnh đạo phòng Đăng ký và Cấp giấy chứng nhận", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Phê duyệt hồ sơ", "unit": "Lãnh đạo Văn phòng Đăng ký Đất đai tỉnh", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Chuyển thông tin xác định nghĩa vụ tài chính đến Cơ quan thuế", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 2", "task": "Thẩm định, lập tờ trình cấp giấy", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "02 ngày" },
        { "step": "GĐ2 - Bước 3", "task": "Trình duyệt", "unit": "Lãnh đạo phòng Đăng ký và Cấp giấy chứng nhận", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 4", "task": "Phê duyệt Giấy chứng nhận", "unit": "Lãnh đạo Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 5", "task": "Chuyển trả kết quả cho TTHCC", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 6", "task": "Trả kết quả", "unit": "Trung tâm PVHCC/ Bưu chính chuyển cho tổ chức, công dân; Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai số 31/2024/QH15",
        "Nghị định số 101/2024/NĐ-CP",
        "Nghị định số 118/2025/NĐ-CP",
        "Nghị định số 151/2025/NĐ-CP",
        "Nghị định số 226/2025/NĐ-CP"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-23",
    "category": "Đăng ký, Cấp GCN",
    "title": "Đăng ký biến động do thỏa thuận trong hộ gia đình, xử lý nợ, giải quyết tranh chấp, quyết định của Tòa án",
    "description": "Đăng ký thay đổi người sử dụng đất do thỏa thuận phân chia tài sản trong hộ gia đình; xử lý nợ theo hợp đồng thế chấp; kết quả hòa giải thành; quyết định của Tòa án, cơ quan thi hành án; hoặc quyết định giải quyết tranh chấp của cơ quan nhà nước.",
    "applicableTo": "Tổ chức, cá nhân, hộ gia đình.",
    "duration": "Không quá 10 ngày làm việc.",
    "documents": [
      "Đơn đăng ký biến động đất đai (Mẫu số 18).",
      "Bản gốc Giấy chứng nhận đã cấp.",
      "Một trong các giấy tờ: Văn bản thỏa thuận của hộ gia đình (có công chứng), Hợp đồng thế chấp và văn bản xử lý tài sản, Biên bản hòa giải thành, Bản án hoặc quyết định của Tòa án/Thi hành án, Quyết định giải quyết tranh chấp."
    ],
    "steps": [
      "Nộp hồ sơ tại Văn phòng Đăng ký đất đai.",
      "Văn phòng ĐKĐĐ kiểm tra hồ sơ, thực hiện các thủ tục đăng ký biến động theo quy định.",
      "Xác nhận thay đổi vào Giấy chứng nhận.",
      "Trả kết quả cho người sử dụng đất."
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thẩm định hồ sơ", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "03 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Phê duyệt hồ sơ", "unit": "Lãnh đạo Văn phòng Đăng ký Đất đai tỉnh", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Chuyển thông tin xác định nghĩa vụ tài chính đến Cơ quan thuế", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 2", "task": "Thẩm định, lập tờ trình cấp giấy", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "2.5 ngày" },
        { "step": "GĐ2 - Bước 3", "task": "Phê duyệt Giấy chứng nhận", "unit": "Lãnh đạo Chi nhánh Văn phòng Đăng ký Đất đai", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 4", "task": "Chuyển trả kết quả cho TTHCC", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 5", "task": "Trả kết quả", "unit": "Trung tâm PVHCC/ Bưu chính chuyển cho tổ chức, công dân; Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai số 31/2024/QH15",
        "Nghị định số 101/2024/NĐ-CP",
        "Nghị định số 118/2025/NĐ-CP",
        "Nghị định số 151/2025/NĐ-CP",
        "Nghị định số 226/2025/NĐ-CP"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-24",
    "category": "Thủ tục khác",
    "title": "Xóa ghi nợ tiền sử dụng đất, lệ phí trước bạ",
    "description": "Thủ tục xóa ghi nợ tiền sử dụng đất, lệ phí trước bạ trên Giấy chứng nhận sau khi đã hoàn thành nghĩa vụ tài chính.",
    "applicableTo": "Tổ chức, cá nhân đã hoàn thành việc nộp tiền sử dụng đất, lệ phí trước bạ.",
    "duration": "Trong ngày làm việc.",
    "documents": [
      "Đơn đăng ký biến động đất đai (Mẫu số 18).",
      "Bản gốc Giấy chứng nhận đã cấp.",
      "Giấy tờ chứng minh đã hoàn thành việc thanh toán nợ tiền sử dụng đất, lệ phí trước bạ."
    ],
    "steps": [
      "Nộp hồ sơ tại Văn phòng Đăng ký đất đai.",
      "Văn phòng ĐKĐĐ kiểm tra chứng từ nộp tiền, thực hiện xác nhận 'Đã hoàn thành nghĩa vụ tài chính' vào GCN.",
      "Chỉnh lý hồ sơ địa chính.",
      "Trả kết quả cho người sử dụng đất."
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.25 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thụ lý hồ sơ", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Phê duyệt hồ sơ", "unit": "Lãnh đạo Chi nhánh Văn phòng Đăng ký Đất đai", "time": "0.25 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Trả kết quả", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai số 31/2024/QH15",
        "Nghị định số 101/2024/NĐ-CP",
        "Nghị định số 118/2025/NĐ-CP",
        "Nghị định số 151/2025/NĐ-CP",
        "Nghị định số 226/2025/NĐ-CP"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-25",
    "category": "Đăng ký, Cấp GCN",
    "title": "Đăng ký biến động đất đai (chuyển mục đích không phải xin phép)",
    "description": "Thủ tục đăng ký biến động đối với các trường hợp chuyển mục đích sử dụng đất không phải xin phép cơ quan nhà nước có thẩm quyền.",
    "applicableTo": "Người sử dụng đất thực hiện chuyển mục đích không phải xin phép.",
    "duration": "Không quá 07 ngày làm việc (vùng sâu, xa không quá 17 ngày).",
    "documents": [
      "Đơn đăng ký biến động đất đai (Mẫu số 18).",
      "Bản gốc Giấy chứng nhận đã cấp."
    ],
    "steps": [
      "Nộp hồ sơ tại Văn phòng Đăng ký đất đai.",
      "Văn phòng ĐKĐĐ kiểm tra, xác nhận mục đích sử dụng đất mới vào GCN.",
      "Chỉnh lý hồ sơ địa chính, cơ sở dữ liệu đất đai.",
      "Trao GCN cho người sử dụng đất."
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thẩm định hồ sơ", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "05 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Phê duyệt", "unit": "Lãnh đạo Chi nhánh Văn phòng Đăng ký Đất đai", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Chuyển trả kết quả cho TTHCC", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Trả kết quả", "unit": "Trung tâm PVHCC/ Bưu chính chuyển cho tổ chức, công dân; Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai số 31/2024/QH15",
        "Nghị định số 101/2024/NĐ-CP",
        "Nghị định số 118/2025/NĐ-CP",
        "Nghị định số 151/2025/NĐ-CP",
        "Nghị định số 226/2025/NĐ-CP"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-26",
    "category": "Đăng ký, Cấp GCN",
    "title": "Đăng ký, cấp GCN cho hộ gia đình, cá nhân sử dụng đất không đúng mục đích trước 01/7/2014",
    "description": "Thủ tục đăng ký và cấp Giấy chứng nhận cho trường hợp hộ gia đình, cá nhân đang sử dụng đất không đúng mục đích đã được Nhà nước công nhận trước ngày 01/7/2014.",
    "applicableTo": "Hộ gia đình, cá nhân.",
    "duration": "Không quá 20 ngày làm việc.",
    "documents": [
      "Đơn đăng ký, cấp GCN (Mẫu số 15).",
      "Giấy chứng nhận cũ (nếu có).",
      "Giấy tờ chứng minh việc sử dụng đất ổn định trước ngày 01/7/2014.",
      "Chứng từ thực hiện nghĩa vụ tài chính (nếu có)."
    ],
    "steps": [
      "Nộp hồ sơ tại Văn phòng Đăng ký đất đai.",
      "Văn phòng ĐKĐĐ kiểm tra, xác minh, lấy ý kiến UBND cấp xã.",
      "Gửi thông tin đến cơ quan thuế để xác định nghĩa vụ tài chính.",
      "Sau khi hoàn thành nghĩa vụ tài chính, cấp Giấy chứng nhận.",
      "Cập nhật hồ sơ, trả kết quả."
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thẩm định hồ sơ", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "3.5 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Phê duyệt hồ sơ", "unit": "Lãnh đạo Chi nhánh Văn phòng Đăng ký Đất đai", "time": "02 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Chuyển thông tin xác định nghĩa vụ tài chính đến Cơ quan thuế", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "01 ngày" },
        { "step": "GĐ2 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 2", "task": "Thẩm định, lập tờ trình cấp giấy", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "03 ngày" },
        { "step": "GĐ2 - Bước 3", "task": "Phê duyệt Giấy chứng nhận", "unit": "Lãnh đạo Chi nhánh Văn phòng Đăng ký Đất đai", "time": "01 ngày" },
        { "step": "GĐ2 - Bước 4", "task": "Chuyển trả kết quả cho TTHCC", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 5", "task": "Trả kết quả", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai số 31/2024/QH15",
        "Nghị định số 101/2024/NĐ-CP",
        "Nghị định số 118/2025/NĐ-CP",
        "Nghị định số 151/2025/NĐ-CP",
        "Nghị định số 226/2025/NĐ-CP"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-27",
    "category": "Đăng ký, Cấp GCN",
    "title": "Đăng ký, cấp GCN khi chuyển nhượng dự án đầu tư có sử dụng đất",
    "description": "Thủ tục đăng ký và cấp GCN cho bên nhận chuyển nhượng toàn bộ hoặc một phần dự án đầu tư có sử dụng đất.",
    "applicableTo": "Tổ chức, doanh nghiệp.",
    "duration": "Không quá 15 ngày làm việc.",
    "documents": [
      "Đơn đăng ký biến động (Mẫu số 18).",
      "Bản gốc Giấy chứng nhận của bên chuyển nhượng.",
      "Hợp đồng chuyển nhượng dự án đã được công chứng.",
      "Bản sao Giấy chứng nhận đầu tư của bên nhận chuyển nhượng."
    ],
    "steps": [
      "Nộp hồ sơ tại Văn phòng Đăng ký đất đai.",
      "Văn phòng ĐKĐĐ kiểm tra, xác nhận thay đổi vào GCN hoặc cấp GCN mới.",
      "Cập nhật hồ sơ địa chính.",
      "Trả kết quả."
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thẩm định hồ sơ", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "1.5 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Trình Lãnh đạo", "unit": "Lãnh đạo phòng Đăng ký và Cấp giấy chứng nhận", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Phê duyệt hồ sơ", "unit": "Lãnh đạo Văn phòng Đăng ký Đất đai tỉnh", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Chuyển thông tin xác định nghĩa vụ tài chính đến Cơ quan thuế", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 2", "task": "Thẩm định, lập tờ trình cấp giấy", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "02 ngày" },
        { "step": "GĐ2 - Bước 3", "task": "Trình duyệt", "unit": "Lãnh đạo phòng Đăng ký và Cấp giấy chứng nhận", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 4", "task": "Phê duyệt Giấy chứng nhận", "unit": "Lãnh đạo Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 5", "task": "Chuyển trả kết quả cho TTHCC", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 6", "task": "Trả kết quả", "unit": "Trung tâm PVHCC/ Bưu chính chuyển cho tổ chức, công dân; Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai ngày 18/01/2024",
        "Nghị định số 101/2024/NĐ-CP",
        "Nghị định số 118/2025/NĐ-CP",
        "Nghị định số 151/2025/NĐ-CP",
        "Nghị định số 226/2025/NĐ-CP"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-28",
    "category": "Đăng ký, Cấp GCN",
    "title": "Đăng ký biến động khi tổ chức kinh tế nhận chuyển nhượng, thuê QSDĐ, nhận góp vốn để thực hiện dự án",
    "description": "Thủ tục đăng ký biến động đất đai đối với tổ chức kinh tế nhận quyền sử dụng đất để thực hiện dự án đầu tư.",
    "applicableTo": "Tổ chức kinh tế.",
    "duration": "Không quá 10 ngày làm việc.",
    "documents": [
      "Đơn đăng ký biến động (Mẫu số 18).",
      "Bản gốc Giấy chứng nhận đã cấp.",
      "Hợp đồng chuyển nhượng/thuê/góp vốn.",
      "Bản sao Giấy chứng nhận đầu tư/đăng ký kinh doanh."
    ],
    "steps": [
      "Nộp hồ sơ tại Văn phòng Đăng ký đất đai.",
      "Văn phòng ĐKĐĐ kiểm tra hồ sơ, xác nhận biến động.",
      "Cập nhật hồ sơ địa chính, cơ sở dữ liệu đất đai.",
      "Trao Giấy chứng nhận cho tổ chức."
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thẩm định hồ sơ", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "04 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Trình Lãnh đạo", "unit": "Lãnh đạo phòng Đăng ký và Cấp giấy chứng nhận", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Phê duyệt hồ sơ", "unit": "Lãnh đạo Văn phòng Đăng ký Đất đai tỉnh", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Chuyển thông tin xác định nghĩa vụ tài chính đến Cơ quan thuế", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 2", "task": "Thẩm định, lập tờ trình cấp giấy", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "02 ngày" },
        { "step": "GĐ2 - Bước 3", "task": "Trình phê duyệt", "unit": "Lãnh đạo phòng Đăng ký và Cấp giấy chứng nhận", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 4", "task": "Phê duyệt Giấy chứng nhận", "unit": "Lãnh đạo Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 5", "task": "Chuyển trả kết quả cho TTHCC", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 6", "task": "Trả kết quả", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai số 31/2024/QH15",
        "Nghị định số 101/2024/NĐ-CP",
        "Nghị định số 118/2025/NĐ-CP",
        "Nghị định số 151/2025/NĐ-CP",
        "Nghị định số 226/2025/NĐ-CP"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-29",
    "category": "Đăng ký, Cấp GCN",
    "title": "Đăng ký biến động do sử dụng đất kết hợp đa mục đích",
    "description": "Thủ tục đăng ký thay đổi thông tin trên GCN khi người sử dụng đất có nhu cầu sử dụng kết hợp đa mục đích (ví dụ: đất ở kết hợp thương mại, dịch vụ).",
    "applicableTo": "Tổ chức, cá nhân, hộ gia đình.",
    "duration": "Không quá 15 ngày làm việc.",
    "documents": [
      "Đơn đăng ký biến động (Mẫu số 18).",
      "Bản gốc Giấy chứng nhận đã cấp.",
      "Văn bản chấp thuận của cơ quan có thẩm quyền về việc sử dụng đa mục đích (nếu cần)."
    ],
    "steps": [
      "Nộp hồ sơ tại Văn phòng Đăng ký đất đai.",
      "Văn phòng ĐKĐĐ kiểm tra, xác nhận mục đích sử dụng mới vào GCN.",
      "Cập nhật hồ sơ địa chính, cơ sở dữ liệu đất đai.",
      "Trả kết quả."
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thẩm định, lập tờ trình cấp giấy", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "2.5 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Trình duyệt", "unit": "Lãnh đạo phòng Đăng ký và Cấp giấy chứng nhận", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Phê duyệt Giấy chứng nhận", "unit": "Lãnh đạo Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Chuyển trả kết quả cho TTHCC", "unit": "Văn phòng Đăng ký Đất đai tỉnh", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 6", "task": "Trả kết quả", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai số 31/2024/QH15",
        "Nghị định số 101/2024/NĐ-CP",
        "Nghị định số 118/2025/NĐ-CP",
        "Nghị định số 151/2025/NĐ-CP",
        "Nghị định số 226/2025/NĐ-CP"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-30",
    "category": "Đăng ký, Cấp GCN",
    "title": "Đăng ký tài sản gắn liền với thửa đất đã được cấp GCN hoặc đăng ký thay đổi về tài sản đã đăng ký",
    "description": "Thủ tục đăng ký tài sản gắn liền với đất (nhà ở, công trình) vào Giấy chứng nhận đã được cấp, hoặc đăng ký thay đổi về tài sản đã đăng ký.",
    "applicableTo": "Chủ sở hữu tài sản gắn liền với đất.",
    "duration": "Không quá 08 ngày làm việc (đăng ký tài sản), không quá 05 ngày (thay đổi tài sản).",
    "documents": [
      "Đơn đăng ký biến động đất đai (Mẫu số 18).",
      "Bản gốc Giấy chứng nhận đã cấp.",
      "Một trong các loại giấy tờ về quyền sở hữu tài sản (ví dụ: Giấy phép xây dựng, hợp đồng mua bán nhà ở).",
      "Sơ đồ nhà ở, công trình xây dựng (trừ trường hợp giấy tờ đã có sơ đồ phù hợp)."
    ],
    "steps": [
      "Nộp hồ sơ tại Trung tâm Phục vụ hành chính công hoặc Văn phòng ĐKĐĐ.",
      "Văn phòng ĐKĐĐ kiểm tra hồ sơ, gửi thông tin đến cơ quan thuế (nếu có phát sinh nghĩa vụ tài chính).",
      "Sau khi có thông tin xác nhận hoàn thành nghĩa vụ tài chính (nếu có), Văn phòng ĐKĐĐ xác nhận việc đăng ký tài sản vào GCN.",
      "Cập nhật hồ sơ địa chính và trả kết quả."
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thẩm định hồ sơ", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "06 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Phê duyệt Giấy chứng nhận", "unit": "Lãnh đạo Chi nhánh Văn phòng Đăng ký Đất đai", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Chuyển trả kết quả cho TTHCC", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Trả kết quả", "unit": "Trung tâm PVHCC/ Bưu chính chuyển cho tổ chức, công dân; Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai số 31/2024/QH15",
        "Nghị định số 101/2024/NĐ-CP",
        "Nghị định số 118/2025/NĐ-CP",
        "Nghị định số 151/2025/NĐ-CP",
        "Nghị định số 226/2025/NĐ-CP"
    ],
    "authority": "cấp tỉnh"
  },
  {
    "id": "TTHC-TINH-31",
    "category": "Đăng ký, Cấp GCN",
    "title": "Xác nhận tiếp tục sử dụng đất nông nghiệp",
    "description": "Thủ tục xác nhận lại thời hạn sử dụng đất trên Giấy chứng nhận đã cấp đối với đất nông nghiệp của hộ gia đình, cá nhân khi hết hạn.",
    "applicableTo": "Hộ gia đình, cá nhân sử dụng đất nông nghiệp.",
    "duration": "Không quá 07 ngày làm việc (vùng sâu, xa không quá 10 ngày).",
    "documents": [
      "Văn bản đề nghị xác nhận lại thời hạn sử dụng đất.",
      "Bản gốc Giấy chứng nhận đã cấp."
    ],
    "steps": [
      "Nộp hồ sơ tại Trung tâm Phục vụ hành chính công hoặc Văn phòng ĐKĐĐ.",
      "Văn phòng ĐKĐĐ kiểm tra hồ sơ.",
      "Xác nhận thời hạn được tiếp tục sử dụng đất vào Giấy chứng nhận đã cấp.",
      "Trao Giấy chứng nhận cho người sử dụng đất."
    ],
    "internalSteps": [
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thụ lý hồ sơ", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "4.5 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Phê duyệt hồ sơ", "unit": "Lãnh đạo Chi nhánh Văn phòng ĐKĐĐ", "time": "1.5 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Chuyển trả kết quả cho TTHCC", "unit": "Chi nhánh Văn phòng Đăng ký Đất đai", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Trả kết quả", "unit": "Trung tâm PVHCC, Trung tâm PVHCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": [
        "Luật Đất đai số 31/2024/QH15",
        "Nghị định số 101/2024/NĐ-CP",
        "Nghị định số 118/2025/NĐ-CP",
        "Nghị định số 151/2025/NĐ-CP",
        "Nghị định số 226/2025/NĐ-CP"
    ],
    "authority": "cấp tỉnh"
  }
];
