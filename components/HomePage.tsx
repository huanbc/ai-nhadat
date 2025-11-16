
import React from 'react';

interface HomePageProps {
  onStart: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 flex flex-col">
        <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                    Trợ lý Nhà đất AI
                </h1>
                <p className="mt-6 text-lg leading-8 text-slate-600">
                    Ứng dụng giúp soạn thảo văn bản và hợp đồng nhà đất một cách nhanh chóng. Tự động trích xuất thông tin từ các tài liệu như CCCD, Giấy chứng nhận quyền sử dụng đất và điền vào mẫu có sẵn, sau đó cho phép người dùng xem lại, chỉnh sửa và sao chép nội dung hoàn chỉnh.
                </p>
                <div className="mt-10">
                    <button
                        onClick={onStart}
                        className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
                    >
                        Truy cập Ứng dụng
                    </button>
                </div>
            </div>
        </main>
        <footer className="text-center py-4 text-slate-500 text-sm">
            <p>Lưu ý: Luôn kiểm tra kỹ thông tin do AI trích xuất. Ứng dụng này chỉ mang tính chất tham khảo.</p>
            <p>&copy; 2024. Phát triển bởi Lê Minh Huấn - 0912041201. Powered by Gemini.</p>
        </footer>
    </div>
  );
};
