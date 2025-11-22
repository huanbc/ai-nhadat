
import { DocumentTemplate, ExtractedData, PartyData, LandData, DocumentTemplateKey } from '../types';
import { generateLPTBForm, generateTNCNForm, generateSDDPNNForm, generateAgriculturalTaxForm } from './taxFormGenerator';
import { getDefaultTemplate } from '../data/defaultTemplates';

// =================================================================
// HELPERS - Các hàm trợ giúp (được giữ lại để sử dụng cho placeholder)
// =================================================================
const fill = (value?: string | number, placeholder: string = '.........................') => value || placeholder;

const toTitleCase = (str?: string): string => {
    if (!str) return '';
    const acronyms = ['UBND', 'CCCD', 'GCN', 'QSDĐ'];
    return str
        .toLowerCase()
        .split(' ')
        .map(word => {
            if (acronyms.includes(word.toUpperCase())) {
                return word.toUpperCase();
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
};

const getDocumentDateParts = (dateString?: string): { day: string; month: string; year: string } => {
    if (dateString && /^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
        const [day, month, year] = dateString.split('/');
        return { day, month, year };
    }
    return { day: '.....', month: '.....', year: '...........' };
};

const getYearFromDate = (dateString?: string): string => {
    if (!dateString) return '...........';
    const parts = dateString.split(/[\/-]/);
    if (parts.length > 0) {
        const yearPart = parts[parts.length - 1];
        if (/^\d{4}$/.test(yearPart)) return yearPart;
    }
    return '...........';
};

// =================================================================
// HTML GENERATION HELPERS - Các hàm tạo khối HTML cho placeholder
// =================================================================

const generateCompactPartyHtml = (party?: PartyData, isDeceased?: boolean): string => {
    if (!party) return '';
    let title = 'Ông (bà)';
    if (party.sex) {
        if (party.sex.toLowerCase().includes('nam')) title = 'Ông';
        if (party.sex.toLowerCase().includes('nữ')) title = 'Bà';
    }
    const deathInfo = isDeceased
        ? `<br>Mất ngày: ${fill(party.dateOfDeath)} (Giấy chứng tử số: ${fill(party.deathCertificateNumber)})`
        : '';
    return `
        <p style="margin: 0; padding: 0;">
            <strong>${title}: ${fill(party.fullName)}</strong>&nbsp;&nbsp;&nbsp;&nbsp;Sinh năm: ${fill(getYearFromDate(party.dateOfBirth))}<br>
            CCCD số: ${fill(party.idNumber)}&nbsp;&nbsp;&nbsp;&nbsp;Cấp ngày: ${fill(party.idIssueDate)}&nbsp;&nbsp;&nbsp;&nbsp;Nơi cấp: ${toTitleCase(String(fill(party.idIssuePlace)))}<br>
            Nơi thường trú: ${fill(party.permanentAddress)}
            ${deathInfo}
        </p>
    `;
};

const generateDetailHeirHtml = (party?: PartyData): string => {
    if (!party) return '<p>.........................</p>';
    let deathInfo = '';
    if (party.dateOfDeath || party.deathCertificateNumber) {
        deathInfo = `<br>- Tình trạng: Đã chết ngày ${fill(party.dateOfDeath)} (Số trích lục khai tử: ${fill(party.deathCertificateNumber)}, cấp ngày ${fill(party.deathCertificateIssueDate)})`;
    } else {
        deathInfo = '<br>- Tình trạng: Còn sống';
    }

    return `
        <div style="margin-left: 1cm; margin-bottom: 0.5em;">
            - Họ và tên: <strong>${fill(party.fullName)}</strong>, sinh năm: ${fill(getYearFromDate(party.dateOfBirth))}<br>
            - CCCD số: ${fill(party.idNumber)}, cấp ngày: ${fill(party.idIssueDate)}
            ${deathInfo}
        </div>
    `;
};

const generateMultiplePartiesHtml = (parties?: PartyData[], isDeceasedList?: boolean): string => {
    if (!parties || parties.length === 0) return '<p>.........................</p>';
    return parties.map(p => generateCompactPartyHtml(p, isDeceasedList)).join('<br>');
};

const generateLandInfoHtml = (land?: LandData): string => {
    if (!land) return '';
    return `
        <p style="margin: 0; padding: 0;">
            - Thửa đất số: ${fill(land.parcelNumber)}<br>
            - Tờ bản đồ số: ${fill(land.mapSheetNumber)}<br>
            - Địa chỉ: ${fill(land.address)}<br>
            - Diện tích: ${fill(land.area)} m²<br>
            - Hình thức sử dụng: ${fill(land.usageForm)}<br>
            - Mục đích sử dụng: ${fill(land.usagePurpose)}<br>
            - Thời hạn sử dụng: ${fill(land.usageTerm)}<br>
            - Nguồn gốc sử dụng: ${fill(land.usageSource)}<br>
            - Theo ${fill(land.certificateType, 'Giấy chứng nhận')} số ${fill(land.certificateNumber)}, số vào sổ cấp GCN: ${fill(land.certificateBookNumber)}, do ${toTitleCase(String(fill(land.certificateIssuer)))} cấp ngày ${fill(land.certificateIssueDate)}.
        </p>
    `;
};

const generateSignaturesHtml = (partyA?: PartyData[], partyB?: PartyData[], labelA?: string, labelB?: string): string => {
    const namesA = partyA?.map(p => `<strong>${fill(p.fullName)}</strong>`).join('<br><br><br>') || '';
    const namesB = partyB?.map(p => `<strong>${fill(p.fullName)}</strong>`).join('<br><br><br>') || '';

    return `
    <table style="width: 100%; border: none; margin-top: 3em; page-break-inside: avoid;">
        <tr>
            <td style="width: 50%; text-align: center; vertical-align: top;">
                <p style="font-weight: bold; margin:0;">${labelA || 'BÊN A'}</p>
                <p style="font-style: italic; margin:0;">(Ký, ghi rõ họ tên)</p>
                <br><br><br><br>
                ${namesA}
            </td>
            <td style="width: 50%; text-align: center; vertical-align: top;">
                 <p style="font-weight: bold; margin:0;">${labelB || 'BÊN B'}</p>
                 <p style="font-style: italic; margin:0;">(Ký, ghi rõ họ tên)</p>
                 <br><br><br><br>
                 ${namesB}
            </td>
        </tr>
    </table>
    `;
};

const generateHeirSignaturesHtml = (heirs?: PartyData[]): string => {
    if (!heirs || heirs.length === 0) return '';
    const heirNames = heirs.map(h => `<div style="margin-top: 4em;"><strong>${fill(h.fullName)}</strong></div>`).join('');
    return `
        <div style="text-align: center; page-break-inside: avoid;">
            <div style="font-weight: bold; margin-top: 2em;">NHỮNG NGƯỜI THỪA KẾ</div>
            <div style="font-style: italic;">(Ký và ghi rõ họ tên)</div>
            ${heirNames}
        </div>
    `;
};

// =================================================================
// NEW DOCUMENT GENERATOR from Custom Template
// =================================================================

const resolvePath = (obj: any, path: string): any => {
    return path.split(/[\.\[\]]/).filter(p => p).reduce((acc, part) => {
        // Check if part is an array index
        if (acc && /^\d+$/.test(part)) {
            return acc[parseInt(part)];
        }
        return (acc && acc[part] !== undefined) ? acc[part] : undefined;
    }, obj);
};


export const getDocumentContent = (template: DocumentTemplate, data: ExtractedData, templateString: string): string => {
    // Handle non-customizable templates first
    switch (template.key) {
        case 'tax_declaration_combo': {
            const forms = [];
            forms.push(generateLPTBForm(data));
            forms.push(generateTNCNForm(data));
            forms.push(generateSDDPNNForm(data));
            if (data.landInfo?.some(l => l.riceLandArea || l.annualCropLandArea || l.perennialTreeLandArea || l.aquacultureLandArea)) {
                forms.push(generateAgriculturalTaxForm(data));
            }
            return forms.join('<div style="page-break-after: always;"></div>');
        }
        case 'tax_declaration_new': {
            const forms = [];
            forms.push(generateLPTBForm(data));
            forms.push(generateSDDPNNForm(data));
             if (data.landInfo?.some(l => l.riceLandArea || l.annualCropLandArea || l.perennialTreeLandArea || l.aquacultureLandArea)) {
                forms.push(generateAgriculturalTaxForm(data));
            }
            return forms.join('<div style="page-break-after: always;"></div>');
        }
    }

    // Handle customizable templates
    if (!templateString) {
        return "Lỗi: Không có nội dung mẫu để tạo văn bản.";
    }

    const dateInfo = getDocumentDateParts(data.documentDate);
    const formattedAmount = data.transactionAmount ? new Intl.NumberFormat('vi-VN').format(Number(data.transactionAmount)) : '';

    let sigLabelA = 'BÊN A';
    let sigLabelB = 'BÊN B';
     switch (template.key) {
        case DocumentTemplateKey.GIFT:
        case DocumentTemplateKey.INHERITANCE_GIFT:
            sigLabelA = 'BÊN TẶNG CHO';
            sigLabelB = 'BÊN ĐƯỢC TẶNG CHO';
            break;
        case DocumentTemplateKey.TRANSFER:
            sigLabelA = 'BÊN CHUYỂN NHƯỢNG';
            sigLabelB = 'BÊN NHẬN CHUYỂN NHƯỢNG';
            break;
        case DocumentTemplateKey.MATRIMONIAL_PROPERTY:
            const husband = data.partyA?.find(p => p.sex?.toLowerCase().includes('nam'));
            const wife = data.partyA?.find(p => p.sex?.toLowerCase().includes('nữ'));
            sigLabelA = husband ? 'BÊN CHỒNG' : 'BÊN THỎA THUẬN 1';
            sigLabelB = wife ? 'BÊN VỢ' : 'BÊN THỎA THUẬN 2';
            break;
    }

    // Specific Logic for Heirs Confirmation Template
    let heirsFather = '';
    let heirsMother = '';
    let heirsSpouse = '';
    let heirsChildren = '';
    let childrenCount = 0;

    if (template.key === DocumentTemplateKey.HEIRS_CONFIRMATION && data.heirs) {
        const fathers = data.heirs.filter(h => h.relationship === 'Bố đẻ');
        const mothers = data.heirs.filter(h => h.relationship === 'Mẹ đẻ');
        const spouses = data.heirs.filter(h => h.relationship === 'Vợ/Chồng' || h.relationship === 'Vợ' || h.relationship === 'Chồng');
        const children = data.heirs.filter(h => h.relationship === 'Con đẻ' || h.relationship === 'Con nuôi');
        
        heirsFather = fathers.map(generateDetailHeirHtml).join('') || '<p style="margin-left: 1cm;">(Không có thông tin)</p>';
        heirsMother = mothers.map(generateDetailHeirHtml).join('') || '<p style="margin-left: 1cm;">(Không có thông tin)</p>';
        heirsSpouse = spouses.map(generateDetailHeirHtml).join('') || '<p style="margin-left: 1cm;">(Không có thông tin)</p>';
        heirsChildren = children.map((child, index) => {
            const detail = generateDetailHeirHtml(child);
            // Inject index manually since generateDetailHeirHtml is generic
            return detail.replace('- Họ và tên:', `${index + 1}. Họ và tên:`);
        }).join('') || '<p style="margin-left: 1cm;">(Không có con)</p>';
        
        childrenCount = children.length;
    }

    const preRenderedPlaceholders: { [key: string]: string } = {
        'partyA_list': generateMultiplePartiesHtml(data.partyA),
        'partyB_list': generateMultiplePartiesHtml(data.partyB),
        'heirs_list': generateMultiplePartiesHtml(data.heirs),
        'deceasedPersons_list': generateMultiplePartiesHtml(data.deceasedPersons, true),
        'landInfo_list': data.landInfo?.map(land => generateLandInfoHtml(land)).join('<br><hr style="border: none; border-top: 1px dashed #ccc; margin: 1em 0;"><br>') || '',
        'signature_block': generateSignaturesHtml(data.partyA, data.partyB, sigLabelA, sigLabelB),
        'heir_signature_block': generateHeirSignaturesHtml(data.heirs),
        
        // New blocks for Heirs Confirmation
        'heirs_father_block': heirsFather,
        'heirs_mother_block': heirsMother,
        'heirs_spouse_block': heirsSpouse,
        'heirs_children_block': heirsChildren,
        'heirs_children_count': childrenCount.toString(),
    };

    const combinedData = {
        ...data,
        documentDate: dateInfo,
        transactionAmount: formattedAmount
    };

    const processedTemplate = templateString.replace(/\{\{(.*?)\}\}/g, (match, key) => {
        const placeholderKey = key.trim();
        
        if (preRenderedPlaceholders.hasOwnProperty(placeholderKey)) {
            return preRenderedPlaceholders[placeholderKey];
        }

        const resolvedValue = resolvePath(combinedData, placeholderKey);
        
        if (resolvedValue !== undefined && resolvedValue !== null) {
             if (Array.isArray(resolvedValue) && resolvedValue.length > 0 && typeof resolvedValue[0] === 'object') {
                return resolvedValue.map(item => item.fullName || JSON.stringify(item)).join(', ');
            }
            return String(resolvedValue);
        }

        return `<span style="color: red; background-color: #ffeb3b;">{{${placeholderKey}}}</span>`;
    });

    return processedTemplate;
};
