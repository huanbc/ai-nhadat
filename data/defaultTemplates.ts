
import { DocumentTemplateKey, SubTemplateKey } from '../types';

const transferTemplate = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Hợp đồng Chuyển nhượng Quyền sử dụng đất</title>
    <style>
        body { font-family: 'Times New Roman', Times, serif; font-size: 14pt; line-height: 1.8; }
        p { text-align: justify; margin: 0 0 1em 0; text-indent: 1.5cm; }
        .heading { text-align: center; font-weight: bold; }
        .section-title { text-align: center; font-weight: bold; }
    </style>
</head>
<body>

<p class="heading">CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>Độc lập - Tự do - Hạnh phúc<br>-----------</p>
<br>
<h2 class="heading" style="font-size: 16pt;">HỢP ĐỒNG CHUYỂN NHƯỢNG<br>QUYỀN SỬ DỤNG ĐẤT</h2>
<br>
<p>Hôm nay, ngày {{documentDate.day}} tháng {{documentDate.month}} năm {{documentDate.year}}, tại .....................................................</p>
<p>Chúng tôi gồm có:</p>

<p style="font-weight: bold; text-indent: 0;">Bên chuyển nhượng (gọi là Bên A):</p>
<div style="text-indent: 0; padding-left: 1.5cm;">
    {{partyA_list}}
</div>
<br>
<p style="font-weight: bold; text-indent: 0;">Bên nhận chuyển nhượng (gọi là Bên B):</p>
<div style="text-indent: 0; padding-left: 1.5cm;">
    {{partyB_list}}
</div>

<p>Hai bên đồng ý thực hiện việc chuyển nhượng quyền sử dụng đất theo các thoả thuận sau đây:</p>

<h3 class="section-title">ĐIỀU 1<br>QUYỀN SỬ DỤNG ĐẤT CHUYỂN NHƯỢNG</h3>
<p>Quyền sử dụng đất của Bên A đối với thửa đất theo các thông tin chi tiết sau:</p>
<div style="text-indent: 0; padding-left: 1.5cm;">
    {{landInfo_list}}
</div>
<p>Thông tin thửa đất được ghi cụ thể tại giấy chứng nhận nêu trên.</p>

<h3 class="section-title">ĐIỀU 2<br>GIÁ CHUYỂN NHƯỢNG VÀ PHƯƠNG THỨC THANH TOÁN</h3>
<p>1. Giá chuyển nhượng quyền sử dụng thửa đất nêu tại Điều 1 của Hợp đồng này là: <strong>{{transactionAmount}} đồng</strong> (Bằng chữ: <strong>{{transactionAmountInWords}}</strong>).</p>
<p>2. Phương thức thanh toán: Tiền mặt.</p>
<p>3. Việc thanh toán số tiền nêu tại khoản 1 Điều này do hai bên tự thực hiện và chịu trách nhiệm trước pháp luật.</p>

<h3 class="section-title">ĐIỀU 3<br>VIỆC GIAO VÀ ĐĂNG KÝ QUYỀN SỬ DỤNG ĐẤT</h3>
<p>1. Bên A có nghĩa vụ giao thửa đất nêu tại Điều 1 của Hợp đồng này cùng giấy tờ về quyền sử dụng đất cho Bên B vào thời điểm hợp đồng được ký kết và chứng thực.</p>
<p>2. Bên B có nghĩa vụ đăng ký quyền sử dụng đất tại cơ quan có thẩm quyền theo quy định của pháp luật.</p>

<h3 class="section-title">ĐIỀU 4<br>TRÁCH NHIỆM NỘP THUẾ, LỆ PHÍ</h3>
<p>Thuế, lệ phí liên quan đến việc chuyển nhượng quyền sử dụng đất theo Hợp đồng này do <strong>Bên B</strong> chịu trách nhiệm nộp.</p>

<h3 class="section-title">ĐIỀU 5<br>PHƯƠNG THỨC GIẢI QUYẾT TRANH CHẤP HỢP ĐỒNG</h3>
<p>Trong quá trình thực hiện Hợp đồng này, nếu phát sinh tranh chấp, các bên cùng nhau thương lượng giải quyết trên nguyên tắc tôn trọng quyền lợi của nhau; trong trường hợp không giải quyết được thì một trong hai bên có quyền khởi kiện để yêu cầu toà án có thẩm quyền giải quyết theo quy định của pháp luật.</p>

<h3 class="section-title">ĐIỀU 6<br>CAM ĐOAN CỦA CÁC BÊN</h3>
<p>Bên A và Bên B chịu trách nhiệm trước pháp luật về những lời cam đoan sau đây:</p>
<p><strong>1. Bên A cam đoan:</strong></p>
<p style="text-indent: 2.5cm;">1.1. Những thông tin về nhân thân, về thửa đất đã ghi trong Hợp đồng này là đúng sự thật;</p>
<p style="text-indent: 2.5cm;">1.2. Thửa đất thuộc trường hợp được chuyển nhượng quyền sử dụng đất theo quy định của pháp luật;</p>
<p style="text-indent: 2.5cm;">1.3. Tại thời điểm giao kết Hợp đồng này:</p>
<p style="text-indent: 3.5cm;">a) Thửa đất không có tranh chấp;</p>
<p style="text-indent: 3.5cm;">b) Quyền sử dụng đất không bị kê biên để bảo đảm thi hành án;</p>
<p style="text-indent: 2.5cm;">1.4. Việc giao kết Hợp đồng này hoàn toàn tự nguyện, không bị lừa dối, không bị ép buộc;</p>
<p style="text-indent: 2.5cm;">1.5. Thực hiện đúng và đầy đủ các thoả thuận đã ghi trong Hợp đồng này.</p>
<p><strong>2. Bên B cam đoan:</strong></p>
<p style="text-indent: 2.5cm;">2.1. Những thông tin về nhân thân đã ghi trong Hợp đồng này là đúng sự thật;</p>
<p style="text-indent: 2.5cm;">2.2. Đã xem xét kỹ, biết rõ về thửa đất nêu tại Điều 1 của Hợp đồng này và các giấy tờ về quyền sử dụng đất;</p>
<p style="text-indent: 2.5cm;">2.3. Việc giao kết Hợp đồng này hoàn toàn tự nguyện, không bị lừa dối, không bị ép buộc;</p>
<p style="text-indent: 2.5cm;">2.4. Thực hiện đúng và đầy đủ các thoả thuận đã ghi trong Hợp đồng này.</p>

<h3 class="section-title">ĐIỀU 7<br>ĐIỀU KHOẢN CUỐI CÙNG</h3>
<p>Hai bên đã hiểu rõ quyền, nghĩa vụ, lợi ích hợp pháp của mình và hậu quả pháp lý của việc giao kết Hợp đồng này.</p>

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
