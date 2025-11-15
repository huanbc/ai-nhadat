
const defaultNumbers: { [key: number]: string } = {
    0: 'không', 1: 'một', 2: 'hai', 3: 'ba', 4: 'bốn', 5: 'năm', 6: 'sáu', 7: 'bảy', 8: 'tám', 9: 'chín',
};
const units = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ', 'tỷ tỷ'];

function readThree(n: string, full: boolean): string {
    const a = n.split('').map(Number);
    if (a.length === 0) return '';
    let r = '';
    const [tram, chuc, donvi] = a.length === 3 ? a : a.length === 2 ? [0, ...a] : [0, 0, ...a];

    if (tram > 0 || (full && (chuc > 0 || donvi > 0))) {
        r += defaultNumbers[tram] + ' trăm ';
    }

    if (chuc > 0 || donvi > 0) {
        if (chuc > 1) {
            r += defaultNumbers[chuc] + ' mươi ';
            if (donvi === 1) r += 'mốt';
            else if (donvi === 4) r += 'tư';
            else if (donvi === 5) r += 'lăm';
            else if (donvi > 0) r += defaultNumbers[donvi];
        } else if (chuc === 1) {
            r += 'mười ';
            if (donvi === 5) r += 'lăm';
            else if (donvi > 0) r += defaultNumbers[donvi];
        } else { // chuc === 0
            if (tram > 0 || full) r += 'linh ';
            if (donvi > 0) r += defaultNumbers[donvi];
        }
    }
    return r.trim();
}

export function numberToWords(number: string | number): string {
    const numStr = String(number).replace(/[,.]/g, '');
    if (!numStr || isNaN(Number(numStr))) return '';
    if (Number(numStr) === 0) return 'Không đồng Việt Nam';

    let s = numStr;
    let rs = '';

    const chunks = [];
    while (s.length > 3) {
        chunks.unshift(s.slice(-3));
        s = s.slice(0, -3);
    }
    if(s.length > 0) chunks.unshift(s);

    for (let i = 0; i < chunks.length; i++) {
        const isFull = i > 0 && chunks[i] !== '000';
        const text = readThree(chunks[i], isFull);
        if (text) {
            rs += text + ' ' + units[chunks.length - 1 - i] + ' ';
        }
    }
    
    rs = rs.replace(/\s+/g, ' ').trim();
    if (!rs) return '';

    return rs.charAt(0).toUpperCase() + rs.slice(1) + ' đồng Việt Nam';
}
