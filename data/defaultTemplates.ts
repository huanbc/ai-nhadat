
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


const defaultTemplates: { [key in DocumentTemplateKey]?: { [key in SubTemplateKey]?: string } } = {
    [DocumentTemplateKey.TRANSFER]: {
        vpcc: transferTemplate,
        ubnd: transferTemplate,
        simplified: transferTemplate
    },
    // Add other default templates here
};


export const getDefaultTemplate = (templateKey: DocumentTemplateKey, subTemplateKey?: SubTemplateKey | null): string | null => {
    if (!subTemplateKey) return null;
    return defaultTemplates[templateKey]?.[subTemplateKey] || null;
}
