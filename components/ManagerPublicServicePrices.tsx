
import React, { useState, useMemo } from 'react';
import { PUBLIC_SERVICE_PRICES_DATA } from '../data/Giadichvucong';
import { PublicServicePrice } from '../types';

export const ManagerPublicServicePrices: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClassification, setSelectedClassification] = useState<string>('');

    const filteredPrices = useMemo(() => {
        return PUBLIC_SERVICE_PRICES_DATA.filter(item => {
            const matchesSearch = item.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                (item.subCategory?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
            
            // Logic lọc:
            // 1. Nếu không chọn lọc phân loại -> Hiện tất cả
            // 2. Nếu chọn KK1 -> Hiện các mục có classification là "KK1" HOẶC "KK1-KK3"
            const matchesClass = selectedClassification === '' || 
                               item.classification === selectedClassification || 
                               item.classification === 'KK1-KK3';

            return matchesSearch && matchesClass;
        });
    }, [searchTerm, selectedClassification]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(Math.round(price));
    };

    const VAT_RATE = 0.08; // 8%

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Đơn giá Sản phẩm Dịch vụ công (QĐ 4788/QĐ-UBND)</h3>
                <p className="text-slate-600 text-sm">
                    Tra cứu đơn giá dịch vụ sự nghiệp công không sử dụng ngân sách nhà nước về đăng ký, cấp GCN QSDĐ trên địa bàn tỉnh Quảng Ninh (Áp dụng từ 16/12/2025).
                </p>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md text-xs text-blue-800">
                    <strong>Ghi chú Phân loại:</strong><br/>
                    - <strong>KK1:</strong> Các xã vùng đồng bằng, trung du.<br/>
                    - <strong>KK2:</strong> Các xã miền núi, biên giới.<br/>
                    - <strong>KK3:</strong> Các phường, đặc khu, các xã đặc biệt khó khăn.<br/>
                    - <strong>KK1-KK3:</strong> Áp dụng chung cho tất cả các địa bàn trên.
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Tìm kiếm danh mục sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </div>
                <div className="w-full md:w-64">
                    <select
                        value={selectedClassification}
                        onChange={(e) => setSelectedClassification(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                    >
                        <option value="">-- Tất cả phân loại --</option>
                        <option value="KK1">Vùng đồng bằng, trung du (KK1)</option>
                        <option value="KK2">Vùng miền núi, biên giới (KK2)</option>
                        <option value="KK3">Phường, đặc khu, xã đặc biệt khó khăn (KK3)</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 border border-slate-200 rounded-md">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Danh mục sản phẩm</th>
                            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">ĐVT</th>
                            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Phân loại</th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Đơn giá (Gốc)</th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">VAT (8%)</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider bg-blue-50/50">Tổng tiền</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {filteredPrices.length > 0 ? (
                            filteredPrices.map((item) => {
                                const vatAmount = item.price * VAT_RATE;
                                const totalPrice = item.price + vatAmount;
                                
                                return (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-slate-900">
                                            <div className="font-medium">{item.category}</div>
                                            {item.subCategory && <div className="text-xs text-slate-500 mt-1 italic">{item.subCategory}</div>}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-slate-600">{item.unit}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                item.classification === 'KK1' ? 'bg-blue-100 text-blue-800' :
                                                item.classification === 'KK2' ? 'bg-green-100 text-green-800' :
                                                item.classification === 'KK3' ? 'bg-amber-100 text-amber-800' :
                                                'bg-slate-100 text-slate-800'
                                            }`}>
                                                {item.classification}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-slate-700">
                                            {formatPrice(item.price)}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-slate-500 italic">
                                            {formatPrice(vatAmount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-blue-700 bg-blue-50/20">
                                            {formatPrice(totalPrice)}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    Không tìm thấy dịch vụ phù hợp với từ khóa.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 text-xs text-slate-500 italic space-y-1">
                <p>* Đơn giá gốc chưa bao gồm thuế VAT (Theo Ghi chú Phụ lục QĐ 4788).</p>
                <p>* Cột <strong>VAT (8%)</strong> và <strong>Tổng tiền</strong> được hệ thống tự động tính toán để tham khảo.</p>
            </div>
        </div>
    );
};
