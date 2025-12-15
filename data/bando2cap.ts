import { MapRecord } from '../types';

// Hàm hỗ trợ tạo dữ liệu cho Ba Chẽ (ID không có số 0 ở đầu: BC_1)
const genBC = (start: number, end: number, oldUnit: string, oldSheetStart: number, scale: string, note: string = "") => {
  return Array.from({length: end - start + 1}, (_, i) => {
    const idNum = start + i;
    const oldNum = oldSheetStart + i;
    return {
      id: `BC_${idNum}`,
      newUnit: "Xã Ba Chẽ",
      oldUnit: oldUnit,
      oldSheet: `DC${oldNum}`,
      newSheet: `DC${idNum}`,
      scale: scale,
      notes: note
    };
  });
};

// Hàm hỗ trợ tạo dữ liệu cho Kỳ Thượng và Lương Minh (ID có 3 chữ số: KT_001)
const genPad = (prefix: string, start: number, end: number, oldUnit: string, oldSheetStart: number, scale: string, newUnit: string) => {
  return Array.from({length: end - start + 1}, (_, i) => {
    const idNum = start + i;
    const oldNum = oldSheetStart + i;
    return {
      id: `${prefix}_${String(idNum).padStart(3, '0')}`,
      newUnit: newUnit,
      oldUnit: oldUnit,
      oldSheet: `DC${oldNum}`,
      newSheet: `DC${idNum}`,
      scale: scale,
      notes: ""
    };
  });
};

export const BANDO2CAP_DATA: MapRecord[] = [
  // --- DỮ LIỆU XÃ BA CHẼ ---
  ...genBC(1, 4, "Xã Thanh Sơn", 1, "1/10000"),
  ...genBC(5, 11, "Xã Thanh Sơn", 5, "1/5000"),
  ...genBC(12, 20, "Xã Thanh Sơn", 12, "1/2000"),
  ...genBC(21, 140, "Xã Thanh Sơn", 21, "1/1000"),
  ...genBC(141, 142, "Xã Nam Sơn", 1, "1/10000"),
  { id: "BC_143", newUnit: "Xã Ba Chẽ", oldUnit: "Xã Nam Sơn", oldSheet: "DC3", newSheet: "DC143", scale: "1/10000", notes: "Sáp nhập ranh 1 phần tờ số 4 đất lâm nghiệp" },
  ...genBC(144, 151, "Xã Nam Sơn", 4, "1/5000"),
  ...genBC(152, 294, "Xã Nam Sơn", 12, "1/1000"),
  { id: "BC_295", newUnit: "Xã Ba Chẽ", oldUnit: "Xã Hải Lạng", oldSheet: "DC146", newSheet: "DC295", scale: "1/1000", notes: "sáp nhập 1 phần diện tích" },
  ...genBC(296, 296, "Thị trấn Ba Chẽ", 1, "1/10.000"),
  ...genBC(297, 299, "Thị trấn Ba Chẽ", 2, "1/5000"),
  ...genBC(300, 495, "Thị trấn Ba Chẽ", 5, "1/500"),

  // --- DỮ LIỆU XÃ LƯƠNG MINH (266 tờ) ---
  ...genPad("LM", 1, 3, "Xã Lương Mông", 1, "1/10.000", "Xã Lương Minh"),
  ...genPad("LM", 4, 6, "Xã Lương Mông", 4, "1/5.000", "Xã Lương Minh"),
  ...genPad("LM", 7, 9, "Xã Lương Mông", 7, "1/2.000", "Xã Lương Minh"),
  ...genPad("LM", 10, 69, "Xã Lương Mông", 10, "1/1.000", "Xã Lương Minh"),
  ...genPad("LM", 70, 71, "Xã Minh Cầm", 1, "1/10.000", "Xã Lương Minh"),
  ...genPad("LM", 72, 74, "Xã Minh Cầm", 3, "1/5.000", "Xã Lương Minh"),
  ...genPad("LM", 75, 76, "Xã Minh Cầm", 6, "1/2.000", "Xã Lương Minh"),
  ...genPad("LM", 77, 102, "Xã Minh Cầm", 8, "1/1.000", "Xã Lương Minh"),
  ...genPad("LM", 103, 107, "Xã Đồng Sơn", 1, "1/10.000", "Xã Lương Minh"),
  ...genPad("LM", 108, 266, "Xã Đồng Sơn", 6, "1/1.000", "Xã Lương Minh"),

  // --- DỮ LIỆU XÃ KỲ THƯỢNG (324 tờ) ---
  ...genPad("KT", 1, 3, "Xã Thanh Lâm", 1, "1/10.000", "Xã Kỳ Thượng"),
  ...genPad("KT", 4, 106, "Xã Thanh Lâm", 4, "1/1.000", "Xã Kỳ Thượng"),
  ...genPad("KT", 107, 110, "Xã Đạp Thanh", 1, "1/10.000", "Xã Kỳ Thượng"),
  ...genPad("KT", 111, 115, "Xã Đạp Thanh", 5, "1/5.000", "Xã Kỳ Thượng"),
  ...genPad("KT", 116, 133, "Xã Đạp Thanh", 10, "1/2.000", "Xã Kỳ Thượng"),
  ...genPad("KT", 134, 261, "Xã Đạp Thanh", 28, "1/1.000", "Xã Kỳ Thượng"),
  ...genPad("KT", 262, 265, "Xã Kỳ Thượng", 1, "1/10.000", "Xã Kỳ Thượng"),
  ...genPad("KT", 266, 324, "Xã Kỳ Thượng", 5, "1/1.000", "Xã Kỳ Thượng"),
];
