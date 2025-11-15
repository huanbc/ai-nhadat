
import { ExtractedData, PartyData } from '../types';

// Ánh xạ thô từ đơn vị hành chính mới sang danh sách các đơn vị cũ.
const QUANG_NINH_ADDRESS_MAPPING: { [key: string]: string[] } = {
    'xã Quảng La': ['xã Bằng Cả', 'xã Dân Chủ', 'xã Tân Dân', 'xã Quảng La'],
    'xã Thống Nhất': ['xã Vũ Oai', 'xã Hòa Bình', 'xã Thống Nhất', 'xã Đồng Lâm'],
    'xã Hải Hòa': ['xã Hải Lạng', 'xã Hải Hòa'],
    'xã Tiên Yên': ['thị trấn Tiên Yên', 'xã Phong Dụ', 'xã Tiên Lãng', 'xã Yên Than', 'xã Đại Dực', 'xã Đông Ngũ', 'xã Vô Ngại'],
    'xã Điền Xá': ['xã Hà Lâu', 'xã Điền Xá', 'xã Yên Than'],
    'xã Đông Ngũ': ['xã Đông Hải', 'xã Đại Dực', 'xã Đông Ngũ'],
    'xã Hải Lạng': ['xã Đồng Rui', 'xã Hải Lạng', 'xã Hải Hòa'],
    'xã Lương Minh': ['xã Đồng Sơn', 'xã Lương Minh'],
    'xã Kỳ Thượng': ['xã Thanh Lâm', 'xã Đạp Thanh', 'xã Kỳ Thượng'],
    'xã Ba Chẽ': ['thị trấn Ba Chẽ', 'xã Thanh Sơn', 'xã Nam Sơn', 'xã Đồn Đạc', 'xã Hải Lạng'],
    'xã Quảng Tân': ['xã Quảng An', 'xã Dực Yên', 'xã Quảng Lâm', 'xã Quảng Tân'],
    'xã Đầm Hà': ['thị trấn Đầm Hà', 'xã Tân Bình', 'xã Đại Bình', 'xã Tân Lập', 'xã Đầm Hà'],
    'xã Quảng Hà': ['thị trấn Quảng Hà', 'xã Quảng Minh', 'xã Quảng Chính', 'xã Quảng Phong', 'xã Quảng Long'],
    'xã Đường Hoa': ['xã Quảng Sơn', 'xã Đường Hoa', 'xã Quảng Long'],
    'xã Quảng Đức': ['xã Quảng Thành', 'xã Quảng Thịnh', 'xã Quảng Đức'],
    'xã Hoành Mô': ['xã Đồng Văn', 'xã Hoành Mô'],
    'xã Lục Hồn': ['xã Đồng Tâm', 'xã Lục Hồn'],
    'xã Bình Liêu': ['thị trấn Bình Liêu', 'xã Húc Động', 'xã Vô Ngại'],
    'xã Hải Sơn': ['xã Bắc Sơn', 'xã Hải Sơn'],
    'xã Hải Ninh': ['xã Quảng Nghĩa', 'xã Hải Tiến'],
    'xã Vĩnh Thực': ['xã Vĩnh Trung', 'xã Vĩnh Thực'],
    'phường An Sinh': ['phường Bình Dương', 'xã An Sinh', 'xã Việt Dân', 'phường Đức Chính'],
    'phường Đông Triều': ['phường Thủy An', 'phường Hưng Đạo', 'phường Hồng Phong', 'xã Nguyễn Huệ', 'phường Đức Chính'],
    'phường Bình Khê': ['phường Tràng An', 'phường Bình Khê', 'xã Tràng Lương'],
    'phường Mạo Khê': ['phường Xuân Sơn', 'phường Kim Sơn', 'phường Yên Thọ', 'phường Mạo Khê'],
    'phường Hoàng Quế': ['phường Yên Đức', 'phường Hoàng Quế', 'xã Hồng Thái Tây', 'xã Hồng Thái Đông'],
    'phường Yên Tử': ['phường Phương Đông', 'phường Phương Nam', 'xã Thượng Yên Công'],
    'phường Vàng Danh': ['phường Bắc Sơn', 'phường Nam Khê', 'phường Vàng Danh', 'phường Trưng Vương'],
    'phường Uông Bí': ['phường Quang Trung', 'phường Thanh Sơn', 'phường Yên Thanh', 'phường Trưng Vương'],
    'phường Đông Mai': ['phường Minh Thành', 'phường Đông Mai'],
    'phường Hiệp Hòa': ['phường Cộng Hòa', 'xã Sông Khoai', 'xã Hiệp Hòa'],
    'phường Quảng Yên': ['phường Yên Giang', 'phường Quảng Yên', 'xã Tiên An'],
    'phường Hà An': ['phường Tân An', 'phường Hà An', 'xã Hoàng Tân', 'xã Liên Hòa'],
    'phường Phong Cốc': ['phường Nam Hòa', 'phường Yên Hải', 'phường Phong Cốc', 'xã Cẩm La'],
    'phường Liên Hòa': ['phường Phong Hải', 'xã Liên Vị', 'xã Tiền Phong', 'xã Liên Hòa'],
    'phường Tuần Châu': ['phường Đại Yên', 'phường Tuần Châu', 'phường Hà Khẩu'],
    'phường Việt Hưng': ['phường Giếng Đáy', 'phường Việt Hưng', 'phường Hà Khẩu'],
    'phường Bãi Cháy': ['phường Hùng Thắng', 'phường Bãi Cháy'],
    'phường Hà Tu': ['phường Hà Phong', 'phường Hà Tu'],
    'phường Hà Lầm': ['phường Cao Thắng', 'phường Hà Trung', 'phường Hà Lầm'],
    'phường Cao Xanh': ['phường Hà Khánh', 'phường Cao Xanh'],
    'phường Hồng Gai': ['phường Bạch Đằng', 'phường Trần Hưng Đạo', 'phường Hồng Gai'],
    'phường Hạ Long': ['phường Hồng Hà', 'phường Hồng Hải'],
    'phường Hoành Bồ': ['phường Hoành Bồ', 'xã Sơn Dương', 'xã Lê Lợi', 'xã Đồng Lâm'],
    'phường Mông Dương': ['phường Mông Dương', 'xã Dương Huy'],
    'phường Quang Hanh': ['phường Cẩm Thạch', 'phường Cẩm Thủy', 'phường Quang Hanh'],
    'phường Cẩm Phả': ['phường Cẩm Trung', 'phường Cẩm Thành', 'phường Cẩm Bình', 'phường Cẩm Tây', 'phường Cẩm Đông'],
    'phường Cửa Ông': ['phường Cẩm Phú', 'phường Cẩm Thịnh', 'phường Cẩm Sơn', 'phường Cửa Ông'],
    'phường Móng Cái 1': ['phường Trần Phú', 'phường Hải Hòa', 'phường Bình Ngọc', 'phường Trà Cổ', 'xã Hải Xuân'],
    'phường Móng Cái 2': ['phường Ninh Dương', 'phường Ka Long', 'xã Vạn Ninh'],
    'phường Móng Cái 3': ['phường Hải Yên', 'xã Hải Đông'],
};

// Xây dựng bản đồ đảo ngược để tra cứu hiệu quả (Tên cũ -> Tên mới).
const buildReverseMap = (): { [key: string]: string } => {
    const reverseMap: { [key: string]: string | string[] } = {};
    for (const newName in QUANG_NINH_ADDRESS_MAPPING) {
        for (const oldName of QUANG_NINH_ADDRESS_MAPPING[newName]) {
            // Chuẩn hóa tên cũ bằng cách loại bỏ tiền tố "xã", "phường", "thị trấn"
            const normalizedOldName = oldName.replace(/^(xã|phường|thị trấn)\s/i, '').trim();
            if (reverseMap[normalizedOldName]) {
                // Nếu tên cũ đã tồn tại, đây là trường hợp không rõ ràng (1 xã cũ được chia vào nhiều xã mới)
                if (!Array.isArray(reverseMap[normalizedOldName])) {
                    reverseMap[normalizedOldName] = [reverseMap[normalizedOldName] as string];
                }
                (reverseMap[normalizedOldName] as string[]).push(newName);
            } else {
                reverseMap[normalizedOldName] = newName;
            }
        }
    }
    
    const finalMap: { [key: string]: string } = {};
    for (const oldName in reverseMap) {
        const value = reverseMap[oldName];
        if (Array.isArray(value)) {
            // Xử lý các trường hợp không rõ ràng bằng cách nối các tên mới duy nhất.
            const uniqueNewNames = [...new Set(value)].sort();
            finalMap[oldName] = uniqueNewNames.join(' / ');
        } else {
            finalMap[oldName] = value as string;
        }
    }
    return finalMap;
};

const REVERSE_ADDRESS_MAP = buildReverseMap();

const formatAddress = (address: string): string => {
    let parts = address.split(',').map(p => p.trim());

    // Ánh xạ tên quận/huyện/thành phố sang loại hình đơn vị hành chính
    const districtTypeMap: { [key: string]: string } = {
        'hạ long': 'Thành phố',
        'móng cái': 'Thành phố',
        'cẩm phả': 'Thành phố',
        'uông bí': 'Thành phố',
        'bình liêu': 'Huyện',
        'tiên yên': 'Huyện',
        'đầm hà': 'Huyện',
        'hải hà': 'Huyện',
        'ba chẽ': 'Huyện',
        'vân đồn': 'Huyện',
        'cô tô': 'Huyện',
        'đông triều': 'Thị xã',
        'quảng yên': 'Thị xã',
    };

    // Chuẩn hóa và thêm tiền tố cho các phần của địa chỉ
    parts = parts.map(part => {
        const partLower = part.toLowerCase();
        if (districtTypeMap[partLower]) {
            const capitalized = part.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
            return `${districtTypeMap[partLower]} ${capitalized}`;
        }
        return part.charAt(0).toUpperCase() + part.slice(1); // Viết hoa chữ cái đầu mỗi phần
    });

    if (parts.length > 0) {
        // Xử lý tiền tố cho thôn/làng/khu ở phần đầu tiên
        const firstPart = parts[0];
        const firstPartLower = firstPart.toLowerCase();
        const villagePrefixes = ['thôn', 'làng', 'khu', 'xóm', 'bản', 'tổ', 'số', 'đường', 'phố', 'ngõ'];
        
        if (firstPartLower.startsWith('làng ')) {
            parts[0] = 'Thôn ' + firstPart;
        } else if (!villagePrefixes.some(prefix => firstPartLower.startsWith(prefix + ' '))) {
             if (!/\d/.test(firstPartLower)) {
                  parts[0] = 'Thôn ' + firstPart;
             }
        }
    }

    // Thêm tiền tố "Tỉnh" cho Quảng Ninh
    if (parts[parts.length - 1].toLowerCase() === 'quảng ninh') {
        parts[parts.length - 1] = 'Tỉnh Quảng Ninh';
    }

    return parts.join(', ');
};

const normalizeQuangNinhAddress = (address: string): string => {
    if (!address || !address.toLowerCase().includes('quảng ninh')) {
        return address;
    }

    let normalizedAddress = address;

    // Sắp xếp các khóa theo độ dài giảm dần để khớp các tên dài hơn trước
    const sortedOldNames = Object.keys(REVERSE_ADDRESS_MAP).sort((a, b) => b.length - a.length);

    for (const oldName of sortedOldNames) {
        // Tạo regex để khớp với tên cũ, có hoặc không có tiền tố, và là một từ hoàn chỉnh
        const regex = new RegExp(`(?:xã|phường|thị trấn)?\\s*\\b${oldName.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")}\\b`, 'i');
        
        if (regex.test(normalizedAddress)) {
            const newName = REVERSE_ADDRESS_MAP[oldName];
            // Thay thế tên cũ bằng tên mới (đã bao gồm tiền tố)
            normalizedAddress = normalizedAddress.replace(regex, newName);
            // Dừng lại sau lần khớp đầu tiên để ngăn chặn nhiều lần thay thế
            break; 
        }
    }
    
    // Áp dụng định dạng chuẩn cho địa chỉ đã được cập nhật
    return formatAddress(normalizedAddress);
};

export const normalizeAllAddressesInExtractedData = (data: ExtractedData): ExtractedData => {
    const normalizedData = JSON.parse(JSON.stringify(data)); // Sao chép sâu

    const nonHeirParties: PartyData[] = [
        ...(normalizedData.partyA || []),
        ...(normalizedData.partyB || []),
        ...(normalizedData.deceasedPersons || [])
    ];

    nonHeirParties.forEach(party => {
        if (party?.permanentAddress) {
            party.permanentAddress = normalizeQuangNinhAddress(party.permanentAddress);
        }
    });

    // Đối với người thừa kế, điền địa chỉ mới vào trường 'newPermanentAddress'
    if (normalizedData.heirs) {
        normalizedData.heirs.forEach(heir => {
            if (heir?.permanentAddress) {
                heir.newPermanentAddress = normalizeQuangNinhAddress(heir.permanentAddress);
            }
        });
    }

    // Chuẩn hóa địa chỉ của thửa đất
    if (normalizedData.landInfo) {
        normalizedData.landInfo.forEach(land => {
            if (land?.address) {
                land.address = normalizeQuangNinhAddress(land.address);
            }
        });
    }

    return normalizedData;
};