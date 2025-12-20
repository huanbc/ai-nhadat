
import { PublicServicePrice } from '../types';

export const PUBLIC_SERVICE_PRICES_DATA: PublicServicePrice[] = [
    // 1. Đăng ký, cấp đổi GCN đồng loạt (Phân loại riêng biệt)
    { id: "PS-01-KK1", category: "Đăng ký, cấp đổi giấy chứng nhận đồng loạt tại xã, phường, đặc khu", unit: "Hồ sơ", classification: "KK1", price: 720745 },
    { id: "PS-01-KK2", category: "Đăng ký, cấp đổi giấy chứng nhận đồng loạt tại xã, phường, đặc khu", unit: "Hồ sơ", classification: "KK2", price: 721280 },
    { id: "PS-01-KK3", category: "Đăng ký, cấp đổi giấy chứng nhận đồng loạt tại xã, phường, đặc khu", unit: "Hồ sơ", classification: "KK3", price: 721814 },

    // 2. Đăng ký, cấp đổi, cấp lại GCN riêng lẻ (KK1-KK3 áp dụng chung)
    { id: "PS-02-D-KK1-3", category: "Đăng ký, cấp đổi, cấp lại GCN riêng lẻ đối với hộ gia đình, cá nhân", subCategory: "Đăng ký cấp GCN đối với đất", unit: "Hồ sơ", classification: "KK1-KK3", price: 825897 },
    { id: "PS-02-TS-KK1-3", category: "Đăng ký, cấp đổi, cấp lại GCN riêng lẻ đối với hộ gia đình, cá nhân", subCategory: "Đăng ký cấp GCN đối với tài sản", unit: "Hồ sơ", classification: "KK1-KK3", price: 752678 },
    { id: "PS-02-BOTH-KK1-3", category: "Đăng ký, cấp đổi, cấp lại GCN riêng lẻ đối với hộ gia đình, cá nhân", subCategory: "Đăng ký cấp GCN đối với đất và tài sản", unit: "Hồ sơ", classification: "KK1-KK3", price: 1087015 },

    // 3. Đăng ký, cấp đổi, cấp lại GCN riêng lẻ cho tổ chức, tôn giáo... (KK1-KK3 áp dụng chung)
    { id: "PS-03-D-KK1-3", category: "Đăng ký, cấp đổi, cấp lại GCN riêng lẻ đối với tổ chức, tôn giáo...", subCategory: "Đăng ký cấp GCN đối với đất", unit: "Hồ sơ", classification: "KK1-KK3", price: 1243201 },
    { id: "PS-03-TS-KK1-3", category: "Đăng ký, cấp đổi, cấp lại GCN riêng lẻ đối với tổ chức, tôn giáo...", subCategory: "Đăng ký cấp GCN đối với tài sản", unit: "Hồ sơ", classification: "KK1-KK3", price: 1170281 },
    { id: "PS-03-BOTH-KK1-3", category: "Đăng ký, cấp đổi, cấp lại GCN riêng lẻ đối với tổ chức, tôn giáo...", subCategory: "Đăng ký cấp GCN đối với đất và tài sản", unit: "Hồ sơ", classification: "KK1-KK3", price: 1739988 },

    // 4. Đăng ký biến động đất đai cho hộ gia đình, cá nhân (KK1-KK3 áp dụng chung)
    { id: "PS-04-D-KK1-3", category: "Đăng ký biến động đất đai đối với hộ gia đình, cá nhân", subCategory: "Đăng ký cấp GCN đối với đất", unit: "Hồ sơ", classification: "KK1-KK3", price: 1357588 },
    { id: "PS-04-TS-KK1-3", category: "Đăng ký biến động đất đai đối với hộ gia đình, cá nhân", subCategory: "Đăng ký cấp GCN đối với tài sản", unit: "Hồ sơ", classification: "KK1-KK3", price: 1546768 },
    { id: "PS-04-BOTH-KK1-3", category: "Đăng ký biến động đất đai đối với hộ gia đình, cá nhân", subCategory: "Đăng ký cấp GCN đối với đất và tài sản", unit: "Hồ sơ", classification: "KK1-KK3", price: 1975338 },

    // 5. Đăng ký biến động đất đai cho tổ chức, tôn giáo... (KK1-KK3 áp dụng chung)
    { id: "PS-05-D-KK1-3", category: "Đăng ký biến động đất đai đối với tổ chức, tôn giáo...", subCategory: "Đăng ký cấp GCN đối với đất", unit: "Hồ sơ", classification: "KK1-KK3", price: 2379134 },
    { id: "PS-05-TS-KK1-3", category: "Đăng ký biến động đất đai đối với tổ chức, tôn giáo...", subCategory: "Đăng ký cấp GCN đối với tài sản", unit: "Hồ sơ", classification: "KK1-KK3", price: 2368719 },
    { id: "PS-05-BOTH-KK1-3", category: "Đăng ký biến động đất đai đối với tổ chức, tôn giáo...", subCategory: "Đăng ký cấp GCN đối với đất và tài sản", unit: "Hồ sơ", classification: "KK1-KK3", price: 3050478 },

    // 6. Trích lục hồ sơ địa chính (KK1-KK3 áp dụng chung)
    { id: "PS-06-KK1-3", category: "Trích lục hồ sơ địa chính", unit: "Hồ sơ", classification: "KK1-KK3", price: 99174 }
];
