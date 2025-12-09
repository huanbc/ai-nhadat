
// Các Key lưu trữ trong LocalStorage
export const STORAGE_KEYS = {
    DOCUMENTS: 'AI_CONTRACT_DRAFTER_DOCUMENTS',
    ANALYZED_DOCS: 'AI_ANALYZED_DOCUMENTS',
    LAND_PRICES: 'AI_CONTRACT_DRAFTER_CUSTOM_LAND_PRICES',
    LEGAL_LIBRARY: 'AI_LEGAL_DOCUMENTS_LIBRARY',
    OFFICIAL_DOCS: 'AI_OFFICIAL_DOCUMENTS',
    DRAFT_PROGRESS: 'documentDraftProgress'
};

export const createBackup = () => {
    try {
        const backupData: Record<string, any> = {
            version: 1,
            timestamp: new Date().toISOString(),
            data: {}
        };

        let hasData = false;

        // Lấy dữ liệu từ tất cả các key
        Object.values(STORAGE_KEYS).forEach(key => {
            const rawData = localStorage.getItem(key);
            if (rawData) {
                hasData = true;
                try {
                    backupData.data[key] = JSON.parse(rawData);
                } catch (e) {
                    backupData.data[key] = rawData;
                }
            }
        });

        if (!hasData) {
            alert("Không có dữ liệu nào để sao lưu. Hãy soạn thảo một số văn bản trước!");
            return false;
        }

        // Serialize data safely
        let jsonString = '';
        try {
            jsonString = JSON.stringify(backupData, null, 2);
        } catch (e) {
            console.error("Lỗi khi chuyển đổi dữ liệu sang JSON:", e);
            alert("Lỗi sao lưu: Dữ liệu quá lớn (thường do chứa nhiều ảnh/PDF). Vui lòng xóa bớt các tài liệu trong thư viện và thử lại.");
            return false;
        }

        // Tạo file blob
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Tạo link tải xuống ảo
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_nha_dat_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        
        // Dọn dẹp
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url); 
        }, 0);
        
        return true;
    } catch (error) {
        console.error("Lỗi khi tạo sao lưu:", error);
        alert(`Không thể tạo file sao lưu. Lỗi: ${error instanceof Error ? error.message : 'Không xác định'}`);
        return false;
    }
};

export const restoreBackup = (file: File, onSuccess: () => void) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const content = event.target?.result as string;
            const backupData = JSON.parse(content);

            // Kiểm tra cấu trúc file cơ bản
            if (!backupData.data && !backupData.timestamp) {
                throw new Error("File không hợp lệ hoặc không đúng định dạng.");
            }

            // Khôi phục dữ liệu
            const dataToRestore = backupData.data || backupData; // Hỗ trợ cả cấu trúc cũ nếu có

            Object.entries(dataToRestore).forEach(([key, value]) => {
                // Chỉ khôi phục các key thuộc hệ thống của app (để tránh ghi đè rác)
                if (Object.values(STORAGE_KEYS).includes(key)) {
                    try {
                        if (typeof value === 'object') {
                            localStorage.setItem(key, JSON.stringify(value));
                        } else {
                            localStorage.setItem(key, String(value));
                        }
                    } catch (e) {
                        if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
                            alert('Lỗi: Bộ nhớ trình duyệt đã đầy khi đang khôi phục. Một phần dữ liệu có thể bị thiếu. Vui lòng dọn dẹp bộ nhớ trước khi thử lại.');
                            throw e;
                        }
                    }
                }
            });

            alert("Khôi phục dữ liệu thành công! Ứng dụng sẽ tự động tải lại.");
            onSuccess();
            window.location.reload(); // Tải lại trang để cập nhật state

        } catch (error) {
            console.error("Lỗi khi khôi phục:", error);
            alert("Lỗi: File sao lưu bị hỏng, không đúng định dạng hoặc bộ nhớ đầy.");
        }
    };
    reader.readAsText(file);
};
