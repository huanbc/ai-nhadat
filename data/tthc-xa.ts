import { Procedure } from '../types';

export const TTHC_XA_DATA: Procedure[] = [
  {
    "id": "giao-dat-khong-dau-gia-cap-xa",
    "category": "Giao đất, Cho thuê đất",
    "title": "Giao đất, cho thuê đất, chuyển mục đích sử dụng đất (không đấu giá)",
    "description": "Thực hiện thủ tục giao đất, cho thuê đất đối với trường hợp không qua đấu giá QSDĐ, không đấu thầu lựa chọn nhà đầu tư; trường hợp giao đất, cho thuê đất thông qua đấu thầu; giao đất, giao rừng; gia hạn sử dụng đất.",
    "applicableTo": "Hộ gia đình, cá nhân.",
    "duration": "Không quá 20 ngày làm việc.",
    "documents": [
      "Đơn xin giao đất, cho thuê đất.",
      "Trích lục bản đồ địa chính thửa đất hoặc trích đo địa chính thửa đất.",
      "Văn bản thẩm định nhu cầu sử dụng đất; thẩm định điều kiện giao đất, cho thuê đất."
    ],
    "steps": [
      "Nộp hồ sơ tại UBND cấp xã.",
      "UBND cấp xã thẩm tra, xác minh thực địa.",
      "Hoàn thiện hồ sơ trình UBND cấp huyện quyết định.",
      "Sau khi có quyết định, UBND cấp xã tổ chức bàn giao đất trên thực địa và lập biên bản."
    ],
    "authority": "cấp xã"
  },
  {
    "id": "chuyen-hinh-thuc-giao-dat-cap-xa",
    "category": "Giao đất, Cho thuê đất",
    "title": "Chuyển hình thức giao đất, cho thuê đất",
    "description": "Thực hiện thủ tục chuyển đổi giữa các hình thức giao đất, cho thuê đất theo quy định đối với hộ gia đình, cá nhân.",
    "applicableTo": "Hộ gia đình, cá nhân.",
    "duration": "Không quá 15 ngày làm việc.",
    "documents": [
      "Đơn đề nghị chuyển hình thức sử dụng đất.",
      "Giấy chứng nhận quyền sử dụng đất đã cấp.",
      "Hồ sơ pháp lý liên quan đến việc thay đổi hình thức."
    ],
    "steps": [
      "Nộp hồ sơ tại UBND cấp xã.",
      "UBND cấp xã kiểm tra, xác nhận vào đơn.",
      "Chuyển hồ sơ lên cơ quan cấp huyện để ra quyết định điều chỉnh.",
      "Cập nhật biến động trên GCN và hồ sơ địa chính."
    ],
    "authority": "cấp xã"
  },
  {
    "id": "dieu-chinh-quyet-dinh-giao-dat-cap-xa",
    "category": "Giao đất, Cho thuê đất",
    "title": "Điều chỉnh quyết định giao đất, cho thuê đất, cho phép chuyển mục đích sử dụng đất",
    "description": "Điều chỉnh quyết định giao đất, cho thuê đất do thay đổi căn cứ, sai sót về ranh giới, vị trí, diện tích, mục đích sử dụng hoặc điều chỉnh thời hạn sử dụng đất.",
    "applicableTo": "Hộ gia đình, cá nhân.",
    "duration": "Không quá 15 ngày làm việc.",
    "documents": [
      "Đơn đề nghị điều chỉnh quyết định.",
      "Bản gốc quyết định giao đất, cho thuê đất cần điều chỉnh.",
      "Tài liệu chứng minh lý do cần điều chỉnh (ví dụ: kết quả đo đạc lại, văn bản pháp luật mới...)."
    ],
    "steps": [
      "Nộp hồ sơ tại UBND cấp xã.",
      "UBND cấp xã xác minh, lập tờ trình.",
      "Gửi hồ sơ lên UBND cấp huyện để xem xét, ban hành quyết định điều chỉnh.",
      "Cập nhật hồ sơ địa chính theo quyết định mới."
    ],
    "authority": "cấp xã"
  },
  {
    "id": "giao-dat-o-khong-dau-gia-cap-xa",
    "category": "Giao đất, Cho thuê đất",
    "title": "Giao đất ở có thu tiền sử dụng đất không qua đấu giá",
    "description": "Thực hiện giao đất ở có thu tiền sử dụng đất không qua đấu giá cho các đối tượng chính sách như cán bộ, công chức, viên chức, sĩ quan, người làm công tác cơ yếu, người có công...",
    "applicableTo": "Các đối tượng chính sách theo quy định.",
    "duration": "Không quá 25 ngày làm việc.",
    "documents": [
      "Đơn xin giao đất ở.",
      "Giấy tờ xác nhận thuộc đối tượng được hưởng chính sách.",
      "Xác nhận của cơ quan, đơn vị về thực trạng nhà ở.",
      "Trích lục bản đồ địa chính thửa đất."
    ],
    "steps": [
      "Nộp hồ sơ tại UBND cấp xã.",
      "UBND cấp xã thẩm tra, niêm yết công khai danh sách tại trụ sở.",
      "Sau khi niêm yết, tổng hợp và gửi hồ sơ lên cấp huyện.",
      "UBND cấp huyện ra quyết định giao đất và xác định nghĩa vụ tài chính.",
      "Bàn giao đất trên thực địa."
    ],
    "authority": "cấp xã"
  },
  {
    "id": "xac-dinh-lai-dien-tich-o-cap-xa",
    "category": "Đăng ký, Cấp GCN",
    "title": "Xác định lại diện tích đất ở (đối với GCN cấp trước 01/7/2004)",
    "description": "Thủ tục xác định lại diện tích đất ở cho thửa đất có vườn, ao gắn liền với nhà ở đã được cấp Giấy chứng nhận quyền sử dụng đất trước ngày 01/7/2004.",
    "applicableTo": "Hộ gia đình, cá nhân đã được cấp GCN trước 01/7/2004.",
    "duration": "Không quá 20 ngày làm việc.",
    "documents": [
      "Đơn đăng ký biến động đất đai, tài sản gắn liền với đất (Mẫu số 18).",
      "Bản gốc Giấy chứng nhận đã cấp.",
      "Giấy tờ chứng minh thời điểm xây dựng nhà ở, công trình (nếu có)."
    ],
    "steps": [
      "Người sử dụng đất nộp hồ sơ tại UBND cấp xã.",
      "UBND cấp xã kiểm tra hồ sơ, xác nhận vào đơn về hiện trạng, thời điểm sử dụng đất, sự phù hợp với quy hoạch.",
      "Chuyển hồ sơ lên Chi nhánh Văn phòng đăng ký đất đai để thực hiện các bước tiếp theo.",
      "Chi nhánh VPĐKĐĐ cập nhật, chỉnh lý GCN và hồ sơ địa chính."
    ],
    "authority": "cấp xã"
  },
  {
    "id": "dinh-chinh-gcn-lan-dau-cap-xa",
    "category": "Đăng ký, Cấp GCN",
    "title": "Đính chính Giấy chứng nhận đã cấp lần đầu có sai sót",
    "description": "Thực hiện đính chính các sai sót trên Giấy chứng nhận do Hộ gia đình, cá nhân được cấp lần đầu phát hiện, có sự tham gia xác nhận của UBND cấp xã.",
    "applicableTo": "Hộ gia đình, cá nhân có GCN cấp lần đầu bị sai sót.",
    "duration": "Không quá 15 ngày làm việc.",
    "documents": [
      "Đơn đăng ký biến động đất đai (Mẫu số 18).",
      "Bản gốc Giấy chứng nhận đã cấp.",
      "Giấy tờ chứng minh nội dung sai sót."
    ],
    "steps": [
      "Nộp hồ sơ tại UBND cấp xã để xin xác nhận về nội dung sai sót (nếu cần).",
      "UBND cấp xã kiểm tra, xác nhận vào đơn.",
      "Người dân nộp hồ sơ đã có xác nhận của xã lên Chi nhánh Văn phòng đăng ký đất đai.",
      "Chi nhánh VPĐKĐĐ kiểm tra, thực hiện đính chính và trả kết quả."
    ],
    "authority": "cấp xã"
  },
  {
    "id": "thu-hoi-gcn-lan-dau-cap-xa",
    "category": "Đăng ký, Cấp GCN",
    "title": "Thu hồi Giấy chứng nhận đã cấp lần đầu không đúng quy định",
    "description": "Thực hiện thủ tục thu hồi GCN do người sử dụng đất, chủ sở hữu tài sản phát hiện có sai sót, không đúng quy định và đề nghị cấp lại. UBND cấp xã có vai trò xác minh ban đầu.",
    "applicableTo": "Hộ gia đình, cá nhân.",
    "duration": "Không quá 30 ngày làm việc.",
    "documents": [
      "Đơn đề nghị thu hồi Giấy chứng nhận.",
      "Bản gốc Giấy chứng nhận đã cấp.",
      "Tài liệu chứng minh GCN đã cấp không đúng quy định."
    ],
    "steps": [
      "Người sử dụng đất nộp đơn tại UBND cấp xã.",
      "UBND cấp xã kiểm tra, xác minh, có văn bản gửi cơ quan có thẩm quyền thu hồi GCN.",
      "Cơ quan có thẩm quyền thực hiện thu hồi và cấp lại GCN theo quy định."
    ],
    "authority": "cấp xã"
  },
  {
    "id": "dang-ky-cap-gcn-lan-dau-hgd-cn-cap-xa",
    "category": "Đăng ký, Cấp GCN",
    "title": "Đăng ký, cấp GCN lần đầu đối với hộ gia đình, cá nhân",
    "description": "UBND cấp xã tiếp nhận, kiểm tra, xác nhận và niêm yết công khai hồ sơ đăng ký đất đai, cấp Giấy chứng nhận lần đầu của hộ gia đình, cá nhân tại địa phương.",
    "applicableTo": "Hộ gia đình, cá nhân.",
    "duration": "UBND xã thực hiện trong tổng thời gian không quá 20 ngày làm việc (bao gồm xác minh, niêm yết và chuyển hồ sơ).",
    "documents": [
      "Đơn đăng ký, cấp Giấy chứng nhận (Mẫu số 15).",
      "Một trong các loại giấy tờ về quyền sử dụng đất theo quy định (nếu có).",
      "Chứng từ thực hiện nghĩa vụ tài chính; giấy tờ liên quan đến việc miễn, giảm nghĩa vụ tài chính (nếu có).",
      "Sơ đồ về tài sản gắn liền với đất (trừ trường hợp trong giấy tờ đã có sơ đồ)."
    ],
    "steps": [
      "Nộp hồ sơ tại UBND cấp xã nơi có đất.",
      "UBND cấp xã kiểm tra hồ sơ, xác nhận hiện trạng sử dụng đất, nguồn gốc, thời điểm sử dụng, tình trạng tranh chấp.",
      "Niêm yết công khai kết quả kiểm tra hồ sơ tại trụ sở UBND cấp xã trong 15 ngày.",
      "Sau thời gian niêm yết, UBND cấp xã xác nhận vào đơn đăng ký và chuyển hồ sơ lên Chi nhánh Văn phòng đăng ký đất đai."
    ],
    "authority": "cấp xã"
  },
  {
    "id": "tang-cho-qsd-nha-nuoc-cong-dong-cap-xa",
    "category": "Đăng ký, Cấp GCN",
    "title": "Tặng cho QSDĐ cho Nhà nước, cộng đồng dân cư hoặc mở rộng đường",
    "description": "Thủ tục đăng ký biến động đất đai đối với trường hợp người sử dụng đất tự nguyện tặng cho một phần hoặc toàn bộ thửa đất cho Nhà nước, cộng đồng dân cư hoặc để mở rộng đường giao thông.",
    "applicableTo": "Hộ gia đình, cá nhân.",
    "duration": "Không quá 10 ngày làm việc.",
    "documents": [
      "Văn bản tặng cho quyền sử dụng đất.",
      "Bản gốc Giấy chứng nhận đã cấp.",
      "Biên bản họp giữa đại diện cộng đồng dân cư và người sử dụng đất (nếu tặng cho cộng đồng)."
    ],
    "steps": [
      "Người sử dụng đất nộp văn bản tặng cho và GCN tại UBND cấp xã.",
      "UBND cấp xã tiếp nhận, xác nhận và gửi hồ sơ đến Chi nhánh VPĐKĐĐ.",
      "Chi nhánh VPĐKĐĐ thực hiện chỉnh lý GCN hoặc thu hồi GCN (nếu tặng cho toàn bộ thửa đất).",
      "Cập nhật, chỉnh lý hồ sơ địa chính."
    ],
    "authority": "cấp xã"
  },
  {
    "id": "TTHC-XA-01",
    "category": "Dự án đầu tư",
    "title": "Tổ chức kinh tế nhận chuyển nhượng, thuê QSDĐ thực hiện dự án (Cấp xã)",
    "description": "Thủ tục nhận góp vốn bằng quyền sử dụng đất để thực hiện dự án đầu tư tại cấp xã.",
    "applicableTo": "Tổ chức kinh tế.",
    "duration": "23 ngày (33 ngày đối với vùng khó khăn).",
    "documents": [
        "Văn bản đề nghị chấp thuận cho tổ chức kinh tế nhận chuyển nhượng, thuê quyền sử dụng đất, nhận góp vốn bằng quyền sử dụng đất để thực hiện dự án đầu tư theo Mẫu số 49 ban hành kèm theo Nghị định 151/2025/NĐ-CP được sửa đổi, bổ sung tại Nghị định 226/2025/NĐ-CP.",
        "Trích lục vị trí khu đất mà nhà đầu tư đề xuất thực hiện dự án."
    ],
    "steps": [
        "Bước 1: Tổ chức kinh tế gửi hồ sơ đến Trung tâm Phục vụ hành chính công. Trung tâm chuyển hồ sơ đến Chủ tịch UBND cấp xã nơi có đất. Cán bộ tiếp nhận hồ sơ kiểm tra, đối chiếu bản chính hoặc số hóa hồ sơ trực tuyến.",
        "Bước 2: Chủ tịch UBND cấp xã giao cơ quan quản lý đất đai cấp xã chủ trì, phối hợp các cơ quan liên quan thực hiện thẩm định.",
        "Bước 3: Cơ quan quản lý đất đai cấp xã thẩm định hồ sơ. Văn bản thẩm định gồm: Điều kiện phù hợp quy hoạch, đáp ứng điều kiện Luật Đất đai 2024 (Điều 122, 127), thông tin địa chính, kết luận đủ/không đủ điều kiện, đề xuất chấp thuận/không chấp thuận.",
        "Bước 4: Chủ tịch UBND cấp xã ban hành văn bản chấp thuận hoặc không chấp thuận tổ chức kinh tế nhận chuyển nhượng, thuê quyền sử dụng đất, nhận góp vốn.",
        "Bước 5: Tổ chức kinh tế thực hiện việc nhận chuyển nhượng, thuê quyền sử dụng đất, nhận góp vốn bằng quyền sử dụng đất để thực hiện dự án đầu tư."
    ],
    "internalSteps": [
        { "step": "Bước 1", "task": "Tổ chức kinh tế gửi hồ sơ đến Trung tâm Phục vụ hành chính công. Trung tâm chuyển hồ sơ đến Chủ tịch UBND cấp xã nơi có đất. Cán bộ tiếp nhận hồ sơ kiểm tra, đối chiếu bản chính hoặc số hóa hồ sơ trực tuyến.", "unit": "Trung tâm Phục vụ HCC, Cán bộ tiếp nhận", "time": "01 ngày" },
        { "step": "Bước 2", "task": "Chủ tịch UBND cấp xã giao cơ quan quản lý đất đai cấp xã chủ trì, phối hợp các cơ quan liên quan thực hiện thẩm định.", "unit": "Chủ tịch UBND cấp xã, Cơ quan quản lý đất đai cấp xã", "time": "03 ngày làm việc" },
        { "step": "Bước 3", "task": "Cơ quan quản lý đất đai cấp xã thẩm định hồ sơ. Văn bản thẩm định gồm: Điều kiện phù hợp quy hoạch, đáp ứng điều kiện Luật Đất đai 2024 (Điều 122, 127), thông tin địa chính, kết luận đủ/không đủ điều kiện, đề xuất chấp thuận/không chấp thuận.", "unit": "Cơ quan quản lý đất đai cấp xã", "time": "15 ngày" },
        { "step": "Bước 4", "task": "Chủ tịch UBND cấp xã ban hành văn bản chấp thuận hoặc không chấp thuận tổ chức kinh tế nhận chuyển nhượng, thuê quyền sử dụng đất, nhận góp vốn.", "unit": "Chủ tịch UBND cấp xã", "time": "05 ngày làm việc" },
        { "step": "Bước 5", "task": "Tổ chức kinh tế thực hiện việc nhận chuyển nhượng, thuê quyền sử dụng đất, nhận góp vốn bằng quyền sử dụng đất để thực hiện dự án đầu tư.", "unit": "Tổ chức kinh tế", "time": "Không nêu rõ" }
    ],
    "legalBasis": [
        "Luật Đất đai số 31/2024/QH15 ngày 18/01/2024 được sửa đổi, bổ sung một số điều bởi Luật số 43/2024/QH15, Luật số 47/2024/QH15 và Luật số 58/2024/QH15.",
        "Nghị định số 102/2024/NĐ-CP ngày 30/7/2024 của Chính phủ quy định chi tiết thi hành một số điều của Luật Đất đai.",
        "Nghị định số 118/2025/NĐ-CP ngày 09/6/2025 của Chính phủ quy định về việc thực hiện thủ tục hành chính theo cơ chế một cửa, một cửa liên thông tại Bộ phận Một cửa và Cổng Dịch vụ công quốc gia.",
        "Nghị định số 151/2025/NĐ-CP ngày 12/6/2025 của Chính phủ quy định về phân định thẩm quyền của chính quyền địa phương 02 cấp, phân quyền, phân cấp trong lĩnh vực đất đai.",
        "Nghị định số 226/2025/NĐ-CP ngày 15/8/2025 của Chính phủ sửa đổi, bổ sung một số điều của các nghị định quy định chi tiết thi hành Luật Đất đai.",
        "Quyết định số 2418/QĐ-BTNMT ngày 28/6/2025 của Bộ trưởng Bộ Nông nghiệp và Môi trường về việc đính chính Nghị định số 151/2025/NĐ-CP."
    ],
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
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm Phục vụ HCC, Trung tâm Phục vụ HCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.25 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Đề nghị cung cấp thông tin", "unit": "Cơ quan chuyên môn về nông nghiệp và môi trường cấp xã", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Lãnh đạo Cơ quan chuyên môn về nông nghiệp và môi trường cấp xã", "unit": "Lãnh đạo CQ chuyên môn", "time": "0.25 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Cung cấp thông tin về cơ sở dữ liệu đất đai, lập trích lục bản đồ địa chính thửa đất", "unit": "Chi nhánh Văn phòng Đăng ký đất đai", "time": "01 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Lãnh đạo Chi nhánh Văn phòng Đăng ký đất đai", "unit": "Lãnh đạo Chi nhánh", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 6", "task": "Thẩm định hồ sơ, kiểm tra thực địa", "unit": "Cơ quan chuyên môn về nông nghiệp và môi trường cấp xã", "time": "1.5 ngày" },
        { "step": "GĐ1 - Bước 7", "task": "Trình Lãnh đạo", "unit": "Lãnh đạo Cơ quan chuyên môn về nông nghiệp và môi trường cấp xã", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 8", "task": "Thông báo hướng dẫn hoàn thiện hồ sơ", "unit": "Lãnh đạo UBND cấp xã", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm Phục vụ HCC, Trung tâm Phục vụ HCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 2", "task": "Thẩm định hồ sơ sau hoàn thiện", "unit": "Cơ quan chuyên môn về nông nghiệp và môi trường cấp xã", "time": "3.5 ngày" },
        { "step": "GĐ2 - Bước 3", "task": "Trình phê duyệt", "unit": "Lãnh đạo Cơ quan chuyên môn về nông nghiệp và môi trường cấp xã", "time": "01 ngày" },
        { "step": "GĐ2 - Bước 4", "task": "Phê duyệt Quyết định", "unit": "Chủ tịch UBND cấp xã", "time": "01 ngày" },
        { "step": "GĐ2 - Bước 5", "task": "Chuyển thông tin địa chính đến Cơ quan thuế", "unit": "Cơ quan chuyên môn về nông nghiệp và môi trường cấp xã", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 6", "task": "Lãnh đạo phòng chuyên môn về nông nghiệp và môi trường cấp xã", "unit": "Lãnh đạo phòng chuyên môn", "time": "0.5 ngày" },
        { "step": "GĐ2 - Bước 7", "task": "Trả kết quả", "unit": "Trung tâm Phục vụ HCC, Trung tâm Phục vụ HCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
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
        { "step": "GĐ1 - Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm Phục vụ HCC, Trung tâm Phục vụ HCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 2", "task": "Thẩm định hồ sơ", "unit": "Cơ quan chuyên môn về nông nghiệp và môi trường cấp xã phối hợp Chi nhánh VPĐKĐĐ", "time": "1.5 ngày" },
        { "step": "GĐ1 - Bước 3", "task": "Trình phê duyệt", "unit": "Lãnh đạo Cơ quan chuyên môn về nông nghiệp và môi trường cấp xã", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 4", "task": "Phê duyệt điều chỉnh Quyết định", "unit": "Chủ tịch UBND cấp xã", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 5", "task": "Chuyển thông tin địa chính đến Cơ quan thuế", "unit": "Cơ quan chuyên môn về nông nghiệp và môi trường cấp xã", "time": "0.5 ngày" },
        { "step": "GĐ1 - Bước 6", "task": "Gửi thông báo kết quả cho Cơ quan chuyên môn", "unit": "Cơ quan thuế", "time": "Không nêu rõ" },
        { "step": "GĐ1 - Bước 7", "task": "Trả kết quả", "unit": "Trung tâm Phục vụ HCC, Trung tâm Phục vụ HCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": ["Luật Đất đai 2024"],
    "authority": "cấp xã"
  },
  {
    "id": "TTHC-XA-04",
    "category": "Giao đất, Cho thuê đất",
    "title": "Tặng cho QSDĐ cho Nhà nước, cộng đồng dân cư hoặc mở rộng đường",
    "description": "Tặng cho để xây dựng công trình công cộng, mở rộng đường giao thông.",
    "applicableTo": "Hộ gia đình, cá nhân.",
    "duration": "10 ngày làm việc (20 ngày đối với vùng khó khăn).",
    "documents": ["Văn bản tặng cho", "Giấy chứng nhận QSDĐ"],
    "steps": ["Tiếp nhận", "Đo đạc/Chỉnh lý", "Trả kết quả"],
    "internalSteps": [
        { "step": "Bước 1", "task": "Tiếp nhận và kiểm tra hồ sơ", "unit": "Trung tâm Phục vụ HCC, Trung tâm Phục vụ HCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "01 ngày" },
        { "step": "Bước 2", "task": "Đo đạc, chỉnh lý bản đồ địa chính", "unit": "Cơ quan chuyên môn về nông nghiệp và môi trường cấp xã", "time": "06 ngày" },
        { "step": "Bước 3", "task": "Trình Lãnh đạo", "unit": "Lãnh đạo Cơ quan chuyên môn về nông nghiệp và môi trường cấp xã", "time": "01 ngày" },
        { "step": "Bước 4", "task": "Phê duyệt", "unit": "Lãnh đạo UBND cấp xã", "time": "02 ngày" },
        { "step": "Bước 5", "task": "Trả kết quả", "unit": "Trung tâm Phục vụ HCC, Trung tâm Phục vụ HCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
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
        { "step": "Bước 1", "task": "Tiếp nhận hồ sơ", "unit": "Trung tâm Phục vụ HCC cấp xã hoặc Uỷ ban nhân dân xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "01 ngày" },
        { "step": "Bước 2", "task": "Tham mưu Thông báo bằng văn bản cho các bên liên quan", "unit": "Văn phòng HĐND-UBND cấp xã", "time": "02 ngày" },
        { "step": "Bước 3", "task": "Ban hành thông báo", "unit": "Chủ tịch Uỷ ban nhân dân cấp xã", "time": "01 ngày" },
        { "step": "Bước 4", "task": "Thẩm tra xác minh; thành lập Hội đồng hòa giải tranh chấp đất đai; Tổ chức họp hòa giải", "unit": "Cơ quan chuyên môn về nông nghiệp và môi trường cấp xã", "time": "22 ngày" },
        { "step": "Bước 5", "task": "Trình Lãnh đạo", "unit": "Lãnh đạo Cơ quan chuyên môn về nông nghiệp và môi trường cấp xã", "time": "02 ngày" },
        { "step": "Bước 6", "task": "Ban hành Quyết định giải quyết tranh chấp", "unit": "Chủ tịch Uỷ ban nhân dân cấp xã", "time": "05 ngày" },
        { "step": "Bước 7", "task": "Trả kết quả", "unit": "Trung tâm Phục vụ HCC/ Bưu chính chuyển cho tổ chức, công dân; Trung tâm Phục vụ HCC xã, phường, đặc khu và các Điểm Tiếp nhận và Trả kết quả", "time": "0 ngày" }
    ],
    "legalBasis": ["Luật Đất đai 2024", "Nghị định 102/2024/NĐ-CP"],
    "authority": "cấp xã"
  }
];
