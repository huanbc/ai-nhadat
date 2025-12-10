import { ExtractedData, PartyData } from '../types';

// Cached map to avoid re-fetching and re-processing the JSON file on every call.
let cachedReverseMap: { [key: string]: string } | null = null;

// Async function to fetch, process, and cache the address mapping.
async function getReverseAddressMap(): Promise<{ [key: string]: string }> {
    if (cachedReverseMap) {
        return cachedReverseMap;
    }

    const response = await fetch('/data/dv-hanh-chinh.json');
    if (!response.ok) {
        console.error('Failed to load address mapping data');
        return {};
    }
    const mappingData: { newName: string; oldNames: string[] }[] = await response.json();

    const reverseMap: { [key: string]: string | string[] } = {};
    for (const item of mappingData) {
        for (const oldName of item.oldNames) {
            const normalizedOldName = oldName.replace(/^(xã|phường|thị trấn)\s/i, '').trim();
            if (reverseMap[normalizedOldName]) {
                if (!Array.isArray(reverseMap[normalizedOldName])) {
                    reverseMap[normalizedOldName] = [reverseMap[normalizedOldName] as string];
                }
                (reverseMap[normalizedOldName] as string[]).push(item.newName);
            } else {
                reverseMap[normalizedOldName] = item.newName;
            }
        }
    }

    const finalMap: { [key: string]: string } = {};
    for (const oldName in reverseMap) {
        const value = reverseMap[oldName];
        if (Array.isArray(value)) {
            const uniqueNewNames = [...new Set(value)].sort();
            finalMap[oldName] = uniqueNewNames.join(' / ');
        } else {
            finalMap[oldName] = value as string;
        }
    }

    cachedReverseMap = finalMap;
    return finalMap;
}


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

const normalizeQuangNinhAddress = async (address: string): Promise<string> => {
    if (!address || !address.toLowerCase().includes('quảng ninh')) {
        return address;
    }

    const REVERSE_ADDRESS_MAP = await getReverseAddressMap();
    if (Object.keys(REVERSE_ADDRESS_MAP).length === 0) {
        return address; // Return original if map failed to load
    }

    let normalizedAddress = address;

    const sortedOldNames = Object.keys(REVERSE_ADDRESS_MAP).sort((a, b) => b.length - a.length);

    for (const oldName of sortedOldNames) {
        const regex = new RegExp(`(?:xã|phường|thị trấn)?\\s*\\b${oldName.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")}\\b`, 'i');
        
        if (regex.test(normalizedAddress)) {
            const newName = REVERSE_ADDRESS_MAP[oldName];
            normalizedAddress = normalizedAddress.replace(regex, newName);
            break; 
        }
    }
    
    return formatAddress(normalizedAddress);
};

export const normalizeAllAddressesInExtractedData = async (data: ExtractedData): Promise<ExtractedData> => {
    const normalizedData = JSON.parse(JSON.stringify(data));

    const nonHeirParties: PartyData[] = [
        ...(normalizedData.partyA || []),
        ...(normalizedData.partyB || []),
        ...(normalizedData.deceasedPersons || [])
    ];

    for (const party of nonHeirParties) {
        if (party?.permanentAddress) {
            party.permanentAddress = await normalizeQuangNinhAddress(party.permanentAddress);
        }
    }

    if (normalizedData.heirs) {
        for (const heir of normalizedData.heirs) {
            if (heir?.permanentAddress) {
                heir.newPermanentAddress = await normalizeQuangNinhAddress(heir.permanentAddress);
            }
        }
    }

    if (normalizedData.landInfo) {
        for (const land of normalizedData.landInfo) {
            if (land?.address) {
                land.address = await normalizeQuangNinhAddress(land.address);
            }
        }
    }

    return normalizedData;
};