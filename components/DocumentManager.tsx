
import React from 'react';
import { StoredDocument } from '../types';
import { ManagerProcedures } from './ManagerProcedures';
import { ManagerLegalDocs } from './ManagerLegalDocs';
import { ManagerMap } from './ManagerMap';
import { ManagerAdminUnits } from './ManagerAdminUnits';
import { ManagerOfficialDocs } from './ManagerOfficialDocs';
import { ManagerStoredDocs } from './ManagerStoredDocs';
import { ManagerLandPrices } from './ManagerLandPrices';

interface DocumentManagerProps {
  onEdit: (doc: StoredDocument) => void;
  onGoHome: () => void;
  activeTab: 'documents' | 'procedures' | 'prices' | 'officialDocs' | 'adminUnits' | 'mapLookup' | 'legalRef';
  onTabChange: (tab: 'documents' | 'procedures' | 'prices' | 'officialDocs' | 'adminUnits' | 'mapLookup' | 'legalRef') => void;
  onBack?: () => void;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({ onEdit, onGoHome, activeTab, onTabChange, onBack }) => {
  
  const TabButton: React.FC<{ tabId: DocumentManagerProps['activeTab'], label: string }> = ({ tabId, label }) => (
     <button
        onClick={() => onTabChange(tabId)}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
          activeTab === tabId
            ? 'border-blue-600 text-blue-700 bg-white'
            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
        }`}
      >
        {label}
    </button>
  );

  return (
    <div className="max-w-full mx-auto space-y-8">
      
      {onBack && (
         <div className="-mb-4">
            <button onClick={onBack} className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Quay lại Văn bản đã Soạn thảo
            </button>
        </div>
      )}

      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Trung tâm Tra cứu & Quản lý</h2>
          <p className="mt-2 text-lg text-slate-600">
            Phân tích, tra cứu thủ tục, quản lý văn bản, giá đất và các mẫu soạn thảo.
          </p>
        </div>
        <button
          onClick={onGoHome}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Module
        </button>
      </div>

       <div className="border-b border-slate-200 overflow-x-auto">
          <nav className="-mb-px flex space-x-4 min-w-max" aria-label="Tabs">
            <TabButton tabId="procedures" label="Thủ tục Hành chính" />
            <TabButton tabId="legalRef" label="Văn bản Pháp luật" />
            <TabButton tabId="mapLookup" label="Bản đồ 2 cấp" />
            <TabButton tabId="adminUnits" label="ĐV Hành chính" />
            <TabButton tabId="officialDocs" label="VB Trình ký" />
            <TabButton tabId="documents" label="Tra cứu Hồ sơ" />
            <TabButton tabId="prices" label="Giá đất" />
          </nav>
       </div>
      
       {activeTab === 'procedures' && <ManagerProcedures />}
       {activeTab === 'legalRef' && <ManagerLegalDocs />}
       {activeTab === 'mapLookup' && <ManagerMap />}
       {activeTab === 'adminUnits' && <ManagerAdminUnits />}
       {activeTab === 'officialDocs' && <ManagerOfficialDocs />}
       {activeTab === 'documents' && <ManagerStoredDocs onEdit={onEdit} />}
       {activeTab === 'prices' && <ManagerLandPrices />}
    </div>
  );
};
