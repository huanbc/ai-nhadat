
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

        // Lấy dữ liệu từ tất cả các key
        Object.values(STORAGE_KEYS).forEach(key => {
            const rawData = localStorage.getItem(key);
            if (rawData) {
                try {
                    backupData.data[key] = JSON.parse(rawData);
                } catch (e) {
                    backupData.data[key] = rawData;
                }
            }
        });

        // Tạo file blob
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Tạo link tải xuống ảo
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_nha_dat_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        
        // Dọn dẹp
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return true;
    } catch (error) {
        console.error("Lỗi khi tạo sao lưu:", error);
        alert("Không thể tạo file sao lưu. Vui lòng thử lại.");
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
                    if (typeof value === 'object') {
                        localStorage.setItem(key, JSON.stringify(value));
                    } else {
                        localStorage.setItem(key, String(value));
                    }
                }
            });

            alert("Khôi phục dữ liệu thành công! Ứng dụng sẽ tự động tải lại.");
            onSuccess();
            window.location.reload(); // Tải lại trang để cập nhật state

        } catch (error) {
            console.error("Lỗi khi khôi phục:", error);
            alert("Lỗi: File sao lưu bị hỏng hoặc không đúng định dạng.");
        }
    };
    reader.readAsText(file);
};
