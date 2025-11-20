


import { DocumentTemplateKey, SubTemplateKey } from '../types';

const transferTemplate = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Hợp đồng Chuyển nhượng Quyền sử dụng đất</title>
    <style>
        body { font-family: 'Times New Roman', Times, serif; font-size: 14pt; line-height: 1.8; color: black; }
        p { text-align: justify; margin: 0 0 1em 0; }
        .no-indent { text-indent: 0; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .header { text-align: center; font-weight: bold; }
        h2, h3 { font-weight: bold; text-align: center; margin: 1em 0; }
    </style>
</head>
<body>
    <div class="header">
        <p class="no-indent">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
        <p class="no-indent"><strong>Độc lập - Tự do - Hạnh phúc</strong></p>
        <p class="no-indent">-----------</p>
    </div>

    <p class="no-indent" style="text-align: right; font-style: italic;">Lương Minh, ngày {{documentDate.day}} tháng {{documentDate.month}} năm {{documentDate.year}}</p>
    
    <h2>HỢP ĐỒNG CHUYỂN NHƯỢNG QUYỀN SỬ DỤNG ĐẤT</h2>
    <p class="center no-indent">Số: ......../...........</p>

    <p class="no-indent" style="text-indent: 1.5cm;">Căn cứ Bộ luật Dân sự ngày 24 tháng 11 năm 2015;</p>
    <p class="no-indent" style="text-indent: 1.5cm;">Căn cứ Luật Kinh doanh bất động sản ngày 28 tháng 11 năm 2023;</p>
    <p class="no-indent" style="text-indent: 1.5cm;">Căn cứ Luật Đất đai số 31/2024/QH15 ngày 18 tháng 01 năm 2024;</p>
    <p class="no-indent" style="text-indent: 1.5cm;">Các căn cứ pháp lý khác.</p>
    <p class="no-indent" style="text-indent: 1.5cm;">Hai bên chúng tôi gồm:</p>
    
    <p class="bold no-indent">I. BÊN CHUYỂN NHƯỢNG (BÊN A)</p>
    <div style="padding-left: 1.5cm;">
        {{partyA_list}}
    </div>
    
    <p class="bold no-indent">II. BÊN NHẬN CHUYỂN NHƯỢNG (BÊN B)</p>
    <div style="padding-left: 1.5cm;">
        {{partyB_list}}
    </div>

    <p class="no-indent" style="text-indent: 1.5cm;">Hai bên đồng ý thực hiện việc chuyển nhượng quyền sử dụng đất theo các thỏa thuận sau đây:</p>

    <h3>Điều 1. Thông tin về diện tích đất chuyển nhượng</h3>
    <p>Quyền sử dụng đất của bên A đối với thửa đất theo {{landInfo[0].certificateType}} số {{landInfo[0].certificateNumber}}, số vào sổ cấp GCN {{landInfo[0].certificateBookNumber}}, do {{landInfo[0].certificateIssuer}} cấp ngày {{landInfo[0].certificateIssueDate}}, cụ thể như sau:</p>
    <div style="padding-left: 1.5cm;">
        {{landInfo_list}}
    </div>
    <p>Những hạn chế về quyền sử dụng đất (nếu có): không.</p>
    
    <h3>Điều 2. Giá chuyển nhượng</h3>
    <p>1. Giá chuyển nhượng quyền sử dụng thửa đất nêu tại Điều 1 của Hợp đồng này là: <strong>{{transactionAmount}} đồng</strong> (Bằng chữ: <strong>{{transactionAmountInWords}}</strong>).</p>
    <p>2. Giá chuyển nhượng quy định tại khoản 1 Điều này không bao gồm các khoản sau:</p>
    <p>- Các khoản lệ phí trước bạ, phí và lệ phí theo quy định của pháp luật liên quan đến việc thực hiện các thủ tục cấp Giấy chứng nhận cho Bên nhận chuyển nhượng. Các khoản lệ phí trước bạ, phí và lệ phí này do Bên B chịu trách nhiệm thanh toán;</p>
    <p>- Kinh phí quản lý vận hành hàng tháng (nếu có); kể từ ngày bàn giao đất cho Bên B theo thỏa thuận tại Điều 4 của hợp đồng này, Bên B có trách nhiệm thanh toán kinh phí quản lý vận hành theo thỏa thuận tại hợp đồng này;</p>
    <p>3. Hai bên thống nhất kể từ ngày bàn giao quyền sử dụng đất và trong suốt thời hạn sử dụng quyền sử dụng đất đã nhận chuyển nhượng thì Bên B phải nộp các nghĩa vụ tài chính theo quy định hiện hành, thanh toán kinh phí quản lý vận hành và các loại phí dịch vụ khác do việc sử dụng các tiện ích như: khí đốt, điện, nước, điện thoại, truyền hình cáp, ... cho nhà cung cấp dịch vụ.</p>
    <p>4. Các nội dung thỏa thuận khác (nếu có): Không.</p>

    <h3>Điều 3. Phương thức thanh toán, thời hạn thanh toán</h3>
    <p>1. Phương thức thanh toán: thanh toán bằng tiền mặt.</p>
    <p>2. Thời hạn thanh toán: Thanh toán ngày sau khi hợp đồng được chứng thực.</p>
    <p>3. Các nội dung thỏa thuận khác (nếu có): Không.</p>
    
    <h3>Điều 4. Bàn giao đất và đăng ký quyền sử dụng</h3>
    <p>1. Bàn giao quyền sử dụng đất</p>
    <p>a) Việc bàn giao quyền sử dụng đất phải được các bên lập thành biên bản, tuân thủ đúng quy định của pháp luật về đất đai.</p>
    <p>b) Bên A có trách nhiệm bàn giao cho Bên B các giấy tờ pháp lý về quyền sử dụng đất kèm theo quyền sử dụng đất:</p>
    <p>- Bản gốc của Giấy chứng nhận quyền sử dụng đất (đối với trường hợp bắt buộc phải có giấy chứng nhận theo quy định của pháp luật);</p>
    <p>- Bản sao các các giấy tờ khác theo thỏa thuận: Không.</p>
    <p>c) Bàn giao trên thực địa: (các bên thỏa thuận về thời điểm, trình tự, thủ tục bàn giao đất trên thực địa) Sau khi hoàn thiện các thủ tục theo quy định.</p>
    <p>2. Đăng ký quyền sử dụng đất</p>
    <p>Bên A có nghĩa vụ thực hiện các thủ tục theo quy định của pháp luật để đăng ký quyền sử dụng đất cho Bên B tại cơ quan có thẩm quyền theo quy định của pháp luật về đất đai (trường hợp chuyển nhượng quyền sử dụng đất trong dự án), trừ trường hợp B tự nguyện làm thủ tục đăng ký quyền sử dụng đất.</p>
    <p>Trong thời hạn hai mươi ngày kể từ ngày hợp đồng này được ký kết, Bên A có trách nhiệm thực hiện đăng ký quyền sử dụng đất cho Bên B tại cơ quan có thẩm quyền theo quy định của pháp luật về đất đai.</p>
    <p>Bên B có trách nhiệm phối hợp với Bên A thực hiện đăng ký quyền sử dụng đất tại cơ quan có thẩm quyền theo quy định của pháp luật.</p>
    <p>3. Các thỏa thuận khác (nếu có): Không.</p>

    <h3>Điều 5. Trách nhiệm nộp thuế, lệ phí</h3>
    <p>1. Về trách nhiệm nộp thuế theo quy định: Do bên B nộp.</p>
    <p>2. Về trách nhiệm nộp phí, lệ phí theo quy định: Do bên B nộp.</p>
    <p>3. Các thỏa thuận khác: Không.</p>

    <h3>Điều 6. Quyền và nghĩa vụ của các bên</h3>
    <p>1. Quyền và nghĩa vụ của bên chuyển nhượng</p>
    <p>1.1. Quyền của Bên A (theo Điều 38 Luật Kinh doanh bất động sản):</p>
    <p>a) Yêu cầu Bên B quyền sử dụng đất thanh toán tiền theo thời hạn và phương thức đã thỏa thuận trong hợp đồng;</p>
    <p>b) Yêu cầu Bên B quyền sử dụng đất nhận đất theo đúng thời hạn đã thỏa thuận trong hợp đồng;</p>
    <p>c) Yêu cầu Bên B quyền sử dụng đất bồi thường thiệt hại do lỗi của Bên B gây ra;</p>
    <p>d) Không bàn giao đất khi chưa nhận đủ tiền, trừ trường hợp các bên có thỏa thuận khác;</p>
    <p>đ) Các quyền khác do các bên thỏa thuận (nếu có): Không.</p>
    <p>1.2. Nghĩa vụ của Bên A (theo Điều 39 Luật Kinh doanh bất động sản):</p>
    <p>a) Cung cấp thông tin đầy đủ, trung thực về quyền sử dụng đất và chịu trách nhiệm về thông tin do mình cung cấp;</p>
    <p>b) Chuyển giao đất cho Bên B quyền sử dụng đất đủ diện tích, đúng vị trí và tình trạng đất theo thỏa thuận trong hợp đồng;</p>
    <p>c) Làm thủ tục đăng ký đất đai theo quy định của pháp luật về đất đai và giao Giấy chứng nhận cho bên nhận chuyển nhượng, trừ trường hợp Bên B có văn bản đề nghị tự làm thủ tục cấp Giấy chứng nhận;</p>
    <p>d) Bồi thường thiệt hại do lỗi của mình gây ra;</p>
    <p>đ) Thực hiện nghĩa vụ tài chính với Nhà nước theo quy định của pháp luật;</p>
    <p>e) Các nghĩa vụ khác do các bên thỏa thuận (nếu có): Không.</p>
    <p>2. Quyền và nghĩa vụ của bên nhận chuyển nhượng:</p>
    <p>2.1. Quyền của Bên B (theo Điều 40 Luật Kinh doanh bất động sản):</p>
    <p>a) Yêu cầu Bên A cung cấp thông tin đầy đủ, trung thực về quyền sử dụng đất chuyển nhượng;</p>
    <p>b) Yêu cầu Bên A giao đất đủ diện tích, đúng vị trí và tình trạng đất theo thỏa thuận trong hợp đồng;</p>
    <p>c) Yêu cầu Bên A làm thủ tục đăng ký đất đai theo quy định của pháp luật về đất đai và giao Giấy chứng nhận cho bên nhận chuyển nhượng;</p>
    <p>d) Yêu cầu Bên A bồi thường thiệt hại do lỗi của Bên A gây ra;</p>
    <p>đ) Có quyền sử dụng đất kể từ thời điểm nhận bàn giao đất từ bên chuyển nhượng;</p>
    <p>e) Các quyền khác do các bên thỏa thuận (nếu có): Không.</p>
    <p>2.2. Nghĩa vụ của Bên B (theo Điều 41 Luật Kinh doanh bất động sản):</p>
    <p>a) Thanh toán tiền cho Bên A theo thời hạn và phương thức thỏa thuận trong hợp đồng;</p>
    <p>b) Bồi thường thiệt hại do lỗi của mình gây ra;</p>
    <p>c) Xây dựng nhà, công trình xây dựng tuân thủ đúng các quy định của pháp luật và quy hoạch được duyệt;</p>
    <p>d) Thực hiện nghĩa vụ tài chính với Nhà nước theo quy định của pháp luật;</p>
    <p>đ) Các nghĩa vụ khác do các bên thỏa thuận (nếu có): Không.</p>

    <h3>Điều 7. Trách nhiệm do vi phạm hợp đồng</h3>
    <p>1. Bên A phải chịu trách nhiệm khi vi phạm các quy định sau: Tự ý đơn phương chấm dứt Hợp đồng; vi phạm các thỏa thuận trong hợp đồng, phải có trách nhiệm bồi thường về thiệt hại theo hợp đồng đã ký kết cho bên nhận chuyển nhượng.</p>
    <p>2. Bên B phải chịu trách nhiệm khi vi phạm các quy định sau: Tự ý đơn phương chấm dứt Hợp đồng; Thực hiện không đúng các điều khoản trong Hợp đồng, phải có trách nhiệm bồi thường về thiệt hại theo hợp đồng đã ký kết cho bên chuyển nhượng.</p>
    <p>3. Sau khi Hợp đồng có hiệu lực, nếu một bên vi phạm hợp đồng, thì bên tuân thủ hợp đồng có quyền đòi bên vi phạm hợp đồng bồi thường tất cả mọi tổn thất bao gồm các chi phí như chi phí kiện tụng, chi phí đi lại, chi phí giám định,… và những chi phí khác nếu có.</p>

    <h3>Điều 8. Cam kết của các bên</h3>
    <p>1. Bên A cam kết:</p>
    <p>a) Quyền sử dụng đất nêu tại Điều 1 của hợp đồng này không thuộc diện đã chuyển nhượng cho người khác, không thuộc diện bị cấm chuyển nhượng theo quy định của pháp luật;</p>
    <p>b) Quyền sử dụng đất nêu tại Điều 1 của hợp đồng này được tạo lập theo đúng quy hoạch, đúng thiết kế và các bản vẽ được duyệt đã cung cấp cho Bên nhận chuyển nhượng;</p>
    <p>c) Các cam kết khác do các bên thỏa thuận (nếu có): Không.</p>
    <p>2. Bên B cam kết:</p>
    <p>a) Đã tìm hiểu, xem xét kỹ thông tin về Quyền sử dụng đất chuyển nhượng;</p>
    <p>b) Đã được Bên A cung cấp bản sao các giấy tờ, tài liệu và thông tin cần thiết liên quan đến quyền sử dụng đất, Bên B đã đọc cẩn thận và hiểu các quy định của hợp đồng này cũng như các phụ lục đính kèm. Bên B đã tìm hiểu mọi vấn đề mà Bên B cho là cần thiết để kiểm tra mức độ chính xác của các giấy tờ, tài liệu và thông tin đó;</p>
    <p>c) Số tiền Bên B quyền sử dụng đất trả cho Bên A theo hợp đồng này là hợp pháp, không có tranh chấp với bên thứ ba. Bên A sẽ không phải chịu trách nhiệm đối với việc tranh chấp khoản tiền mà Bên B đã thanh toán cho Bên A theo hợp đồng này. Trong trường hợp có tranh chấp về khoản tiền chuyển nhượng quyền sử dụng đất này thì hợp đồng này vẫn có hiệu lực đối với hai bên;</p>
    <p>d) Cung cấp các giấy tờ cần thiết khi Bên A yêu cầu theo quy định của pháp luật để làm thủ tục cấp Giấy chứng nhận cho Bên nhận chuyển nhượng;</p>
    <p>đ) Các cam kết khác do các bên thỏa thuận (nếu có): Không.</p>
    <p>3. Việc ký kết hợp đồng này giữa các bên là hoàn toàn tự nguyện, không bị ép buộc, lừa dối.</p>
    <p>4. Trong trường hợp một hoặc nhiều điều, khoản, điểm trong hợp đồng này bị cơ quan nhà nước có thẩm quyền tuyên là vô hiệu, không có giá trị pháp lý hoặc không thể thi hành theo quy định hiện hành của pháp luật thì các điều, khoản, điểm khác của hợp đồng này vẫn có hiệu lực thi hành đối với hai bên. Hai bên sẽ thống nhất sửa đổi các điều, khoản, điểm bị tuyên vô hiệu hoặc không có giá trị pháp lý hoặc không thể thi hành theo quy định của pháp luật và phù hợp với ý chí của hai bên.</p>
    <p>5. Hai bên cam kết thực hiện đúng các thỏa thuận đã quy định trong hợp đồng này.</p>
    <p>6. Các thỏa thuận khác do các bên thỏa thuận (nếu có): Không.</p>

    <h3>Điều 9. Chấm dứt hợp đồng</h3>
    <p>1. Các trường hợp chấm dứt hợp đồng:</p>
    <p>a) Hai bên đồng ý chấm dứt hợp đồng. Trong trường hợp này, hai bên lập văn bản thỏa thuận cụ thể các điều kiện và thời hạn chấm dứt hợp đồng;</p>
    <p>b) Bên B chậm thanh toán tiền nhận chuyển nhượng theo thỏa thuận tại điểm a khoản 2.2 Điều 6 của hợp đồng này;</p>
    <p>c) Bên A chậm bàn giao đất theo thỏa thuận tại Điều 4 của hợp đồng này;</p>
    <p>d) Trong trường hợp bên bị tác động bởi sự kiện bất khả kháng không thể khắc phục được để tiếp tục thực hiện nghĩa vụ của mình trong thời hạn ... ngày, kể từ ngày xảy ra sự kiện bất khả kháng và hai bên cũng không có thỏa thuận khác thì một trong hai bên có quyền đơn phương chấm dứt hợp đồng này và việc chấm dứt hợp đồng này không được coi là vi phạm hợp đồng.</p>
    <p>2. Việc xử lý hậu quả do chấm dứt hợp đồng theo quy định tại khoản 1 Điều này như: hoàn trả lại tiền nhận chuyển nhượng, tính lãi, các khoản phạt và bồi thường ...do hai bên thỏa thuận cụ thể.</p>
    <p>3. Các thỏa thuận khác do các bên thỏa thuận (nếu có): Không.</p>
    
    <h3>Điều 10. Sự kiện bất khả kháng</h3>
    <p>1. Các bên nhất trí thỏa thuận một trong các trường hợp sau đây được coi là sự kiện bất khả kháng:</p>
    <p>a) Do chiến tranh hoặc do thiên tai hoặc do thay đổi chính sách pháp luật của Nhà nước;</p>
    <p>b) Do phải thực hiện quyết định của cơ quan nhà nước có thẩm quyền hoặc các trường hợp khác do pháp luật quy định;</p>
    <p>c) Do tai nạn, ốm đau thuộc diện phải đi cấp cứu tại cơ sở y tế;</p>
    <p>d) Các thỏa thuận khác do các bên thỏa thuận (nếu có): Không.</p>
    <p>2. Mọi trường hợp khó khăn về tài chính đơn thuần sẽ không được coi là trường hợp bất khả kháng.</p>
    <p>3. Khi xuất hiện một trong các trường hợp bất khả kháng theo thỏa thuận tại khoản 1 Điều này thì bên bị tác động bởi trường hợp bất khả kháng phải thông báo bằng văn bản hoặc thông báo trực tiếp cho bên còn lại biết trong thời hạn mười ngày, kể từ ngày xảy ra trường hợp bất khả kháng (nếu có giấy tờ chứng minh về lý do bất khả kháng thì bên bị tác động phải xuất trình giấy tờ này). Việc bên bị tác động bởi trường hợp bất khả kháng không thực hiện được nghĩa vụ của mình sẽ không bị coi là vi phạm nghĩa vụ theo hợp đồng và cũng không phải là cơ sở để bên còn lại có quyền chấm dứt hợp đồng này.</p>
    <p>4. Việc thực hiện nghĩa vụ theo hợp đồng của các bên sẽ được tạm dừng trong thời gian xảy ra sự kiện bất khả kháng. Các bên sẽ tiếp tục thực hiện các nghĩa vụ của mình sau khi sự kiện bất khả kháng chấm dứt, trừ trường hợp quy định tại điểm d khoản 1 Điều 10 của hợp đồng này.</p>
    <p>5. Các thỏa thuận khác do các bên thỏa thuận (nếu có): Không.</p>

    <h3>Điều 11. Thông báo</h3>
    <p>1. Địa chỉ để các bên nhận thông báo của bên kia (ghi rõ đối với)</p>
    <p>Bên A: {{partyA[0].permanentAddress}};</p>
    <p>Bên B: {{partyB[0].permanentAddress}};</p>
    <p>2. Hình thức thông báo giữa các bên : thông qua đường bưu điện.</p>
    <p>3. Bên nhận thông báo (nếu Bên B có nhiều người thì Bên B thỏa thuận cử 01 người đại diện để nhận thông báo) là: {{partyB[0].fullName}}</p>
    <p>4. Bất kỳ thông báo, yêu cầu, thông tin, khiếu nại phát sinh liên quan đến hợp đồng này phải được lập thành văn bản. Hai bên thống nhất rằng, các thông báo, yêu cầu, khiếu nại được coi là đã nhận nếu gửi đến đúng địa chỉ, đúng tên người nhận thông báo, đúng hình thức thông báo theo thỏa thuận tại khoản 1, khoản 2 và khoản 3 Điều này và trong thời gian như sau:</p>
    <p>a) Vào ngày gửi trong trường hợp thư giao tận tay và có chữ ký của người nhận thông báo;</p>
    <p>b) Vào ngày bên gửi nhận được thông báo chuyển fax thành công trong trường hợp gửi thông báo bằng fax;</p>
    <p>c) Vào ngày kể từ ngày đóng dấu bưu điện trong trường hợp gửi thông báo bằng thư chuyển phát nhanh;</p>
    <p>d) Các thỏa thuận khác do các bên thỏa thuận (nếu có): Không.</p>
    <p>5. Các bên phải thông báo bằng văn bản cho nhau biết nếu có đề nghị thay đổi về địa chỉ, hình thức và tên người nhận thông báo; nếu khi đã có thay đổi về (địa chỉ, hình thức, tên người nhận thông báo do các bên thỏa thuận...............) mà bên có thay đổi không thông báo lại cho bên kia biết thì bên gửi thông báo không chịu trách nhiệm về việc bên có thay đổi không nhận được các văn bản thông báo.</p>

    <h3>Điều 12. Các thỏa thuận khác</h3>
    <p>Ngoài các thỏa thuận đã nêu tại các điều, khoản, điểm trong hợp đồng này thì hai bên không có thỏa thuận thêm các nội dung khác.</p>

    <h3>Điều 13. Giải quyết tranh chấp</h3>
    <p>Các bên có trách nhiệm thỏa thuận cụ thể cách thức, hình thức giải quyết tranh chấp về các nội dung của hợp đồng khi có tranh chấp phát sinh và lựa chọn Tòa án nhân dân huyện Bình Liêu để giải quyết theo quy định pháp luật khi hai bên không tự thỏa thuận giải quyết được.</p>

    <h3>Điều 14. Thời điểm có hiệu lực của hợp đồng</h3>
    <p>1. Hợp đồng này có hiệu lực kể từ ngày ký chứng thực hợp đồng.</p>
    <p>2. Hợp đồng này có 14 điều, với ... trang, được lập thành 05 bản và có giá trị pháp lý như nhau, Bên B giữ 01 bản, Bên A giữ 01 bản, UBND xã 01 bản, chi nhánh VPĐKDĐ 02 bản để lưu trữ, làm thủ tục nộp thuế, phí, lệ phí và thủ tục cấp Giấy chứng nhận cho Bên nhận chuyển nhượng.</p>
    <p>3. Kèm theo hợp đồng này là các giấy tờ liên quan về đất đai.</p>
    <p>Các phụ lục đính kèm hợp đồng này và các sửa đổi, bổ sung theo thỏa thuận của hai bên là nội dung không tách rời hợp đồng này và có hiệu lực thi hành đối với hai bên.</p>
    <p>4. Trong trường hợp các bên thỏa thuận thay đổi nội dung của hợp đồng này thì phải lập bằng văn bản có chữ ký của cả hai bên.</p>
    
    {{signature_block}}

</body>
</html>
`;

const inheritanceGiftTemplate = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Văn bản Phân chia Di sản Thừa kế và Tặng cho Quyền sử dụng đất</title>
    <style>
        body { font-family: 'Times New Roman', Times, serif; font-size: 14pt; line-height: 1.8; }
        p { text-align: justify; margin: 0 0 1em 0; text-indent: 1.5cm; }
        .no-indent { text-indent: 0; }
        .heading { text-align: center; font-weight: bold; }
        .section-title { text-align: center; font-weight: bold; }
        .signature-section { page-break-inside: avoid; margin-top: 3em; }
    </style>
</head>
<body>
    <p class="heading no-indent">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>Độc lập - Tự do - Hạnh phúc</p>
    <br>
    <h2 class="heading no-indent" style="font-size: 16pt;">VĂN BẢN PHÂN CHIA DI SẢN THỪA KẾ<br>VÀ TẶNG CHO QUYỀN SỬ DỤNG ĐẤT</h2>
    <br>
    <p>Hôm nay, ngày {{documentDate.day}} tháng {{documentDate.month}} năm {{documentDate.year}}, tại Trung tâm hành chính công xã .........................</p>
    <p>Chúng tôi gồm có:</p>
    <div style="text-indent: 0; padding-left: 1.5cm;">
        <p class="no-indent" style="font-weight: bold;">NHỮNG NGƯỜI THỪA KẾ (Bên A):</p>
        {{heirs_list}}
        <br>
        <p class="no-indent" style="font-weight: bold;">BÊN NHẬN TẶNG CHO (Bên B):</p>
        {{partyB_list}}
    </div>
    
    <p>Chúng tôi là những người thừa kế theo quy định Pháp luật của:</p>
    <div style="text-indent: 0; padding-left: 1.5cm;">
        {{deceasedPersons_list}}
    </div>
    <br>

    <h3 class="section-title no-indent">I. VỀ QUAN HỆ THỪA KẾ</h3>
    <p>Bằng văn bản này, chúng tôi khai đúng sự thật rằng:</p>
    <p class="no-indent" style="font-weight: bold;">Về quan hệ với người để lại di sản:</p>
    <p class="no-indent" style="padding-left: 1.5cm;">- Bố đẻ của người để lại di sản: .....................................................</p>
    <p class="no-indent" style="padding-left: 1.5cm;">- Mẹ đẻ của người để lại di sản: .....................................................</p>
    <p class="no-indent" style="padding-left: 1.5cm;">- Vợ/chồng của người để lại di sản: .....................................................</p>
    <p class="no-indent" style="padding-left: 1.5cm;">- Các con đẻ của người để lại di sản gồm:</p>
    <div style="padding-left: 3cm;">
        {{heirs_list}}
    </div>
    <p>Ngoài ra những người nêu trên, người để lại di sản không có Bố nuôi, Mẹ nuôi, con nuôi và người thừa kế nào khác.</p>
    <p>Người để lại di sản không có để lại di chúc thừa kế tài sản.</p>

    <h3 class="section-title no-indent">II. VỀ PHÂN CHIA DI SẢN THỪA KẾ</h3>
    <p class="no-indent" style="font-weight: bold;">2.1. Di sản thừa kế.</p>
    <p>Di sản mà người để lại di sản để lại là phần quyền sử dụng đất theo quy định của Pháp Luật đối với thửa đất có giấy chứng nhận:</p>
    <div style="text-indent: 0; padding-left: 1.5cm;">
        {{landInfo_list}}
    </div>
    <p class="no-indent" style="font-weight: bold;">2.2 Thoả thuận phân chia di sản thừa kế.</p>
    <p>Chúng tôi gồm những người thừa kế nêu trên cùng bàn bạc thống nhất, tự nguyện phân chia và tặng cho di sản thừa kế là phần quyền sử dụng đất mà mỗi người chúng tôi được hưởng theo quy định của pháp luật đối với di sản đã nêu tại mục 2.1 cho Bên B toàn quyền sử dụng và là tài sản riêng của Bên B.</p>
    
    <h3 class="section-title no-indent">III. TẶNG CHO QUYỀN SỬ DỤNG ĐẤT</h3>
    <p>Cũng tại văn bản này, Bên B đồng ý nhận phần di sản từ các đồng thừa kế (Bên A) và gộp phần quyền sử dụng đất của mình theo qui định của pháp luật. Như vậy, toàn bộ tài sản là quyền sử dụng đất nêu tại phần di sản thừa kế là tài sản riêng của Bên B được toàn quyền quản lý, sử dụng, định đoạt đối với tài sản trên và có trách nhiệm đăng ký biến động về quyền sử dụng đất tại cơ quan có thẩm quyền.</p>

    <h3 class="section-title no-indent">IV. QUYỀN VÀ NGHĨA VỤ CỦA NGƯỜI ĐƯỢC HƯỞNG DI SẢN VÀ NHẬN TẶNG CHO</h3>
    <p>1. Nhận toàn bộ di sản cùng toàn bộ hồ sơ, giấy tờ có liên quan tới di sản nêu tại mục II của văn bản này;</p>
    <p>2. Nhận toàn bộ phần tài sản cùng toàn bộ hồ sơ, giấy tờ có liên quan tới tài sản nêu tại mục III của văn bản này;</p>
    <p>3. Hoàn thành thủ tục đăng ký quyền sử dụng di sản theo quy định của pháp luật; đồng thời nộp các khoản thuế, phí có liên quan.</p>
    <p>4. Thực hiện các nghĩa vụ tài sản của người để lại di sản (nếu có).</p>

    <h3 class="section-title no-indent">V. CHÚNG TÔI XIN CAM ĐOAN</h3>
    <p>Những thông tin về nhân thân, di sản, giấy tờ và nội dung đã ghi trong văn bản thỏa thuận phân chia di sản này là đúng sự thật và xin hoàn toàn chịu trách nhiệm trước pháp luật;</p>
    <p>Trước khi chết người để lại di sản không để lại di chúc. Ngoài chúng tôi ra, người để lại di sản không còn người thừa kế nào khác.</p>
    <p>Chúng tôi cam đoan không giấu người được thừa kế theo quy định của pháp luật. Nếu sau này, ngoài chúng tôi mà có cá nhân, tổ chức nào được hưởng di sản của người để lại di sản thì chúng tôi xin liên đới thanh toán phần tài sản mà cá nhân, tổ chức đó được hưởng theo quy định của pháp luật.</p>
    <p>Khối tài sản đem thoả thuận phân chia không có tranh chấp, không đảm bảo hay hứa đảm bảo cho việc phải thực hiện bất kỳ nghĩa vụ nào khác theo quy định của pháp luật.</p>

    <h3 class="section-title no-indent">VI. ĐIỀU KHOẢN CUỐI CÙNG</h3>
    <p>Chúng tôi đã đọc văn bản thỏa thuận phân chia di sản, đã nghe được Người có thẩm quyền chứng thực đọc lại nội dung văn bản và giải thích rõ về quyền và nghĩa vụ của người thừa kế và cam đoan chịu trách nhiệm trước pháp luật về những lời cam đoan trên. Mọi sai trái, gian dối chúng tôi xin hoàn toàn chịu trách nhiệm trước pháp luật;</p>
    <p>Chúng tôi đồng ý toàn bộ nội dung văn bản cùng nhau thống nhất ký hoặc điểm chỉ vào văn bản này trước mặt của Người có thẩm quyền chứng thực./.</p>

    <div class="signature-section">
        {{heir_signature_block}}
    </div>
    
    <div class="signature-section">
        <div style="text-align: center;">
            <div style="font-weight: bold; margin-top: 2em;">BÊN NHẬN TẶNG CHO</div>
            <div style="font-style: italic;">(Ký và ghi rõ họ tên)</div>
            <div style="margin-top: 4em;"><strong>{{partyB[0].fullName}}</strong></div>
            <div style="margin-top: 4em;"><strong>{{partyB[1].fullName}}</strong></div>
            <div style="margin-top: 4em;"><strong>{{partyB[2].fullName}}</strong></div>
        </div>
    </div>
    
</body>
</html>
`;


const landUseChangeTemplate = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Đơn đề nghị chuyển mục đích sử dụng đất</title>
    <style>
        body { font-family: 'Times New Roman', Times, serif; font-size: 14pt; line-height: 1.8; }
        p { text-align: justify; margin: 0 0 1em 0; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .header { text-align: center; font-weight: bold; }
        .signature { text-align: center; margin-top: 2em; }
    </style>
</head>
<body>
    <div class="header">
        <p>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>Độc lập - Tự do - Hạnh phúc</p>
        <p>-----------</p>
    </div>
    <p class="center" style="text-align: right;">.................., ngày {{documentDate.day}} tháng {{documentDate.month}} năm {{documentDate.year}}</p>
    <br>
    <h2 class="header">ĐƠN ĐỀ NGHỊ CHUYỂN MỤC ĐÍCH SỬ DỤNG ĐẤT</h2>
    <p class="center bold">Kính gửi: Ủy ban nhân dân {{additionalInfo.communeName}}</p>
    <br>
    
    <p><span class="bold">1. Người đề nghị:</span> Ông (Bà) {{partyA[0].fullName}}, sinh năm: {{partyA[0].dateOfBirth}}</p>
    <p>CCCD số: {{partyA[0].idNumber}} cấp ngày: {{partyA[0].idIssueDate}}, nơi cấp: {{partyA[0].idIssuePlace}}</p>
    <p><span class="bold">2. Địa chỉ/trụ sở chính:</span> {{partyA[0].permanentAddress}}</p>
    <p><span class="bold">3. Địa chỉ liên hệ (điện thoại, email...):</span> {{partyA[0].phoneNumber}}</p>
    <p><span class="bold">4. Địa điểm thửa đất/khu đất:</span> {{landInfo[0].address}}</p>
    <p><span class="bold">5. Diện tích đất (m²):</span> {{landInfo[0].area}} (Hiện trạng sử dụng: {{landInfo[0].usagePurpose}})</p>
    <p style="padding-left: 1.5cm;">a) Diện tích đất chuyên trồng lúa phải nộp tiền (nếu có): ............ m²</p>
    <p style="padding-left: 1.5cm;">b) Diện tích đất phải bóc tách tầng đất mặt (nếu có): ............ m²</p>
    <p><span class="bold">6. Diện tích rừng (m²) (nếu có):</span> ............</p>
    <p><span class="bold">7. Để sử dụng vào mục đích:</span> {{additionalInfo.newUsagePurpose}}</p>
    <p><span class="bold">8. Thời hạn sử dụng đất:</span> {{additionalInfo.newUsageTerm}}</p>
    <p><span class="bold">9. Xác định nhu cầu sử dụng đất thuộc trường hợp được miễn, giảm tiền sử dụng đất, tiền thuê đất (nếu có):</span> {{additionalInfo.exemptionReason}}</p>
    
    <p><span class="bold">10. Cam kết:</span></p>
    <p style="text-indent: 1.5cm;">Sử dụng đất, sử dụng rừng đúng mục đích, chấp hành đúng các quy định của pháp luật đất đai, pháp luật lâm nghiệp, pháp luật về đất trồng lúa; nộp tiền sử dụng đất/tiền để nhà nước bổ sung diện tích đất bị mất hoặc tăng hiệu quả sử dụng đất trồng lúa (nếu có); bóc tách tầng và sử dụng đất mặt đầy đủ, đúng hạn.</p>
    
    <p><span class="bold">11. Tài liệu gửi kèm:</span></p>
    <p style="text-indent: 1.5cm;">- {{landInfo[0].certificateType}} số {{landInfo[0].certificateNumber}} do {{landInfo[0].certificateIssuer}} cấp ngày {{landInfo[0].certificateIssueDate}} số vào sổ {{landInfo[0].certificateBookNumber}}.</p>
    <p style="text-indent: 1.5cm;">- Các giấy tờ khác (nếu có): ............................................</p>

    <div class="signature">
        <p class="bold">Người làm đơn</p>
        <p class="italic">(Ký và ghi rõ họ tên, đóng dấu nếu có)</p>
        <br><br><br><br>
        <p class="bold">{{partyA[0].fullName}}</p>
    </div>
</body>
</html>
`;

const taxExemptionTemplate = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Văn bản đề nghị Miễn (Giảm) thuế</title>
    <style>
        body { font-family: 'Times New Roman', Times, serif; font-size: 14pt; line-height: 1.8; }
        p { text-align: justify; margin: 0 0 1em 0; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .italic { font-style: italic; }
        .header { text-align: center; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin: 1em 0; }
        th, td { border: 1px solid black; padding: 8px; text-align: center; }
        .no-border-table td { border: none; padding: 0; }
    </style>
</head>
<body>
    <div class="header">
        <p>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>Độc lập - Tự do - Hạnh phúc</p>
        <p>-----------</p>
    </div>
    <p class="center" style="text-align: right;">{{additionalInfo.communeName}}, ngày {{documentDate.day}} tháng {{documentDate.month}} năm {{documentDate.year}}</p>
    <br>
    <h2 class="header">VĂN BẢN ĐỀ NGHỊ MIỄN (GIẢM) THUẾ</h2>
    <p class="center bold">Kính gửi: Chi cục Thuế ...............</p>
    <br>
    <p><span class="bold">Tên người nộp thuế:</span> Hộ ông (bà) {{partyA[0].fullName}}</p>
    <p><span class="bold">Mã số thuế:</span> {{partyA[0].taxCode}}</p>
    <p><span class="bold">Địa chỉ:</span> {{partyA[0].permanentAddress}}</p>
    <p><span class="bold">Điện thoại:</span> {{partyA[0].phoneNumber}}</p>
    <p>Đề nghị được miễn (giảm) thuế với lý do và số thuế miễn (giảm) cụ thể như sau:</p>
    
    <p class="bold">1. Lý do đề nghị miễn (giảm) thuế:</p>
    <p style="text-indent: 1.5cm;">Hộ gia đình chúng tôi đang sử dụng thửa đất tại {{landInfo[0].address}}, được cấp {{landInfo[0].certificateType}} số {{landInfo[0].certificateNumber}}, số vào sổ {{landInfo[0].certificateBookNumber}} do {{landInfo[0].certificateIssuer}} cấp ngày {{landInfo[0].certificateIssueDate}}.</p>
    <p style="text-indent: 1.5cm;">Nay gia đình tôi được phép chuyển mục đích sử dụng đất theo {{additionalInfo.legalBasis}} từ {{landInfo[0].usagePurpose}} sang {{additionalInfo.newUsagePurpose}}. Hộ gia đình chúng tôi thuộc đối tượng {{additionalInfo.exemptionCategory}}, đề nghị được xét miễn (giảm) tiền sử dụng đất theo {{additionalInfo.exemptionReason}}.</p>
    <p style="text-indent: 1.5cm;">Gia đình tôi cam kết chưa được miễn giảm tiền sử dụng đất lần nào.</p>
    
    <p class="bold">2. Xác định số thuế được miễn:</p>
    <p class="center italic">Đơn vị tiền: Đồng Việt Nam</p>
    <table>
        <thead>
            <tr>
                <th>STT</th>
                <th>Loại thuế đề nghị miễn (giảm)</th>
                <th>Kỳ tính thuế</th>
                <th>Số tiền thuế đề nghị miễn (giảm)</th>
                <th>Số tiền thuế đã nộp (nếu có)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>Tiền sử dụng đất</td>
                <td>{{documentDate.year}}</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td colspan="3" class="bold">Cộng</td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
    </table>

    <p class="bold">3. Tài liệu gửi kèm:</p>
    <p style="text-indent: 1.5cm;">- Quyết định cho phép chuyển mục đích sử dụng đất;</p>
    <p style="text-indent: 1.5cm;">- Căn cước công dân;</p>
    <p style="text-indent: 1.5cm;">- Giấy tờ chứng minh thuộc đối tượng miễn, giảm.</p>
    
    <p>Tôi cam đoan số liệu khai trên là đúng và chịu trách nhiệm trước pháp luật về những số liệu đã khai./.</p>
    <br>
    
    <table class="no-border-table">
        <tr>
            <td style="width: 50%;"></td>
            <td style="width: 50%;" class="center">
                <p class="bold">NGƯỜI NỘP THUẾ</p>
                <p class="italic">(Ký, ghi rõ họ tên)</p>
                <br><br><br><br>
                <p class="bold">{{partyA[0].fullName}}</p>
            </td>
        </tr>
    </table>
    
    <br><br>
    <p class="bold center">XÁC NHẬN CỦA UBND XÃ/PHƯỜỜNG/THỊ TRẤN</p>
    <p>UBND xã/phường/thị trấn ............................ xác nhận:</p>
    <p>Ông (bà) {{partyA[0].fullName}} và vợ/chồng là bà/ông {{partyA[0].spouseName}} là {{additionalInfo.exemptionCategory}}, có hộ khẩu thường trú tại ............................</p>
    <p>Nay UBND xã/phường/thị trấn cho phép chuyển mục đích sử dụng đất theo {{additionalInfo.legalBasis}} từ {{landInfo[0].usagePurpose}} sang {{additionalInfo.newUsagePurpose}} và chưa được miễn giảm tiền sử dụng đất, đủ điều kiện được miễn/giảm tiền sử dụng đất theo {{additionalInfo.exemptionReason}}./.</p>
    <br>
    
    <table class="no-border-table">
        <tr>
            <td style="width: 50%;"></td>
            <td style="width: 50%;" class="center">
                <p class="bold">CHỦ TỊCH</p>
                <p class="italic">(Ký, ghi rõ họ tên, đóng dấu)</p>
                <br><br><br><br>
                <p class="bold">..............................</p>
            </td>
        </tr>
    </table>
</body>
</html>
`;

const vehicleOriginTemplate = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Đơn xin xác nhận nguồn gốc phương tiện</title>
    <style>
        body { font-family: 'Times New Roman', Times, serif; font-size: 14pt; line-height: 1.5; margin: 2cm 2cm 2cm 3cm; }
        p { text-align: justify; margin: 0 0 1em 0; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .italic { font-style: italic; }
        .header { text-align: center; font-weight: bold; margin-bottom: 1.5em;}
        h2 { font-size: 16pt; font-weight: bold; text-align: center; margin: 1em 0; }
    </style>
</head>
<body>
    <div class="header">
        <p class="bold" style="margin: 0;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
        <p class="bold" style="margin: 0;">Độc lập - Tự do - Hạnh phúc</p>
    </div>

    <h2>ĐƠN XIN XÁC NHẬN NGUỒN GỐC PHƯƠNG TIỆN</h2>

    <p class="center">Kính gửi: UBND xã/phường ..............................................................</p>
    <br>

    <p>Tôi tên là: <span class="bold">{{partyA[0].fullName}}</span></p>
    <p>Sinh ngày: {{partyA[0].dateOfBirth}}</p>
    <p>CMND/CCCD số: {{partyA[0].idNumber}} &nbsp;&nbsp;&nbsp;&nbsp; Cấp ngày: {{partyA[0].idIssueDate}} &nbsp;&nbsp;&nbsp;&nbsp; Nơi cấp: {{partyA[0].idIssuePlace}}</p>
    <p>Hộ khẩu thường trú: {{partyA[0].permanentAddress}}</p>
    <p>Chỗ ở hiện tại: {{partyA[0].currentAddress}}</p>

    <p>Nay tôi làm đơn này xin UBND xã/phường ............................................... xác nhận nguồn gốc phương tiện sau:</p>

    <div style="margin-left: 1cm;">
        <p>- Loại phương tiện: {{vehicleInfo[0].type}}</p>
        <p>- Nhãn hiệu: {{vehicleInfo[0].brand}}</p>
        <p>- Màu sơn: {{vehicleInfo[0].color}}</p>
        <p>- Số khung: {{vehicleInfo[0].chassisNumber}}</p>
        <p>- Số máy: {{vehicleInfo[0].engineNumber}}</p>
        <p>- Biển số: {{vehicleInfo[0].licensePlate}}</p>
    </div>

    <p><span class="bold">Lý do xin xác nhận:</span></p>
    <p>Tôi xin xác nhận nguồn gốc phương tiện để hoàn thiện thủ tục đăng ký theo quy định.</p>

    <p>Tôi xin cam đoan phương tiện không phải tài sản trộm cắp, không tranh chấp và tôi hoàn toàn chịu trách nhiệm trước pháp luật.</p>
    <br>

    <div style="text-align: right;">
        <p class="italic">............., ngày {{documentDate.day}} tháng {{documentDate.month}} năm {{documentDate.year}}</p>
        <div style="text-align: center; display: inline-block; width: 50%;">
             <p class="bold">Người làm đơn</p>
             <p class="italic">(Ký và ghi rõ họ tên)</p>
             <br><br><br><br>
             <p class="bold">{{partyA[0].fullName}}</p>
        </div>
    </div>
</body>
</html>
`;


const defaultTemplates: { [key in DocumentTemplateKey]?: { [key in SubTemplateKey]?: string } | string } = {
    [DocumentTemplateKey.TRANSFER]: {
        vpcc: transferTemplate,
        ubnd: transferTemplate,
        simplified: transferTemplate
    },
     [DocumentTemplateKey.INHERITANCE_GIFT]: {
        vpcc: inheritanceGiftTemplate,
        ubnd: inheritanceGiftTemplate,
        simplified: inheritanceGiftTemplate,
    },
    [DocumentTemplateKey.LAND_USE_CHANGE]: landUseChangeTemplate,
    [DocumentTemplateKey.TAX_EXEMPTION_REQUEST]: taxExemptionTemplate,
    [DocumentTemplateKey.VEHICLE_ORIGIN_CONFIRMATION]: vehicleOriginTemplate,
    // Add other default templates here
};


export const getDefaultTemplate = (templateKey: DocumentTemplateKey, subTemplateKey?: SubTemplateKey | null): string | null => {
    const templateData = defaultTemplates[templateKey];
    if (typeof templateData === 'string') {
        return templateData;
    }
    if (typeof templateData === 'object' && subTemplateKey && templateData[subTemplateKey]) {
        return templateData[subTemplateKey] || null;
    }
    // Fallback if no subTemplateKey is provided for a template that has them
    if(typeof templateData === 'object') {
        return templateData.vpcc || null;
    }
    return null;
}