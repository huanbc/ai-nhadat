


import React, { useState, useEffect } from 'react';
import { DocumentTemplate, ExtractedData, PartyData, LandData, DocumentTemplateKey, VehicleData } from '../types';
import { numberToWords } from '../utils/numberToWords';

interface DocumentEditorProps {
    template: DocumentTemplate;
    initialData: ExtractedData;
    onComplete: (editedData: ExtractedData) => void;
    onBack: () => void;
}

const getUbndNameFromAddress = (address?: string): string => {
    if (!address) return '';
    const parts = address.split(',').map(p => p.trim());
    for (const part of parts) {
        const match = part.match(/^(Xã|Phường|Thị trấn)\s(.+)/i);
        if (match) {
            return `UBND ${match[1]} ${match[2]}`;
        }
    }
     for (const part of parts) {
        const match = part.match(/^(Huyện|Quận|Thị xã|Thành phố)\s(.+)/i);
         if (match) {
            return `UBND ${match[1]} ${match[2]}`;
        }
    }
    return '';
};


const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        <input
            type="text"
            value={value}
            onChange={onChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <h3 className="text-xl font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-2">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children}
        </div>
    </div>
);

const PartyEditor: React.FC<{ party: PartyData; onChange: (updatedParty: PartyData) => void; }> = ({ party, onChange }) => {
    const handleChange = (field: keyof PartyData, value: string) => {
        onChange({ ...party, [field]: value });
    };

    return (
        <div className="space-y-4 p-4 border border-slate-200 rounded-md bg-slate-50 col-span-1 md:col-span-2 lg:col-span-3">
            <h4 className="font-semibold text-lg text-slate-700">{party.fullName || 'Chưa có tên'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField label="Họ và tên" value={party.fullName || ''} onChange={(e) => handleChange('fullName', e.target.value)} />
                <InputField label="Ngày sinh (DD/MM/YYYY)" value={party.dateOfBirth || ''} onChange={(e) => handleChange('dateOfBirth', e.target.value)} />
                <InputField label="Giới tính" value={party.sex || ''} onChange={(e) => handleChange('sex', e.target.value)} />
                <InputField label="Số CCCD" value={party.idNumber || ''} onChange={(e) => handleChange('idNumber', e.target.value)} />
                <InputField label="Ngày cấp CCCD" value={party.idIssueDate || ''} onChange={(e) => handleChange('idIssueDate', e.target.value)} />
                <InputField label="Nơi cấp CCCD" value={party.idIssuePlace || ''} onChange={(e) => handleChange('idIssuePlace', e.target.value)} />
                <InputField label="Quê quán" value={party.placeOfOrigin || ''} onChange={(e) => handleChange('placeOfOrigin', e.target.value)} />
                <InputField label="Nơi thường trú" value={party.permanentAddress || ''} onChange={(e) => handleChange('permanentAddress', e.target.value)} />
                <InputField label="Số điện thoại" value={party.phoneNumber || ''} onChange={(e) => handleChange('phoneNumber', e.target.value)} />
                 {party.dateOfDeath !== undefined && <InputField label="Ngày mất" value={party.dateOfDeath || ''} onChange={(e) => handleChange('dateOfDeath', e.target.value)} />}
            </div>
        </div>
    );
};


export const DocumentEditor: React.FC<DocumentEditorProps> = ({ template, initialData, onComplete, onBack }) => {
    const [editedData, setEditedData] = useState<ExtractedData>(initialData);

    useEffect(() => {
        if (template.key === DocumentTemplateKey.LAND_USE_CHANGE || template.key === DocumentTemplateKey.CERTIFICATE_APPLICATION || template.key === DocumentTemplateKey.PERSONAL_INFO_CONFIRMATION) {
            const firstLandAddress = initialData.landInfo?.[0]?.address;
            const derivedUbndName = getUbndNameFromAddress(firstLandAddress);
            if (derivedUbndName && !editedData.ubndName) {
                setEditedData(prev => ({
                    ...prev,
                    ubndName: derivedUbndName
                }));
            }
        }
    }, [template.key, initialData.landInfo, editedData.ubndName]);

    const handlePartyChange = (partyType: 'partyA' | 'partyB' | 'heirs' | 'deceasedPersons', index: number, updatedParty: PartyData) => {
        setEditedData(prev => {
            const newParties = [...(prev[partyType] || [])];
            newParties[index] = updatedParty;
            return { ...prev, [partyType]: newParties };
        });
    };
    
    const handleLandChange = (index: number, updatedLand: LandData) => {
        setEditedData(prev => {
            const newLandInfo = [...(prev.landInfo || [])];
            newLandInfo[index] = updatedLand;
            return { ...prev, landInfo: newLandInfo };
        });
    };

    const handleVehicleChange = (index: number, updatedVehicle: VehicleData) => {
        setEditedData(prev => {
            const newVehicleInfo = [...(prev.vehicleInfo || [])];
            newVehicleInfo[index] = updatedVehicle;
            return { ...prev, vehicleInfo: newVehicleInfo };
        });
    };

    const handleGeneralInfoChange = (field: 'transactionAmount' | 'documentDate' | 'ubndName', value: string) => {
        let updatedValue: Partial<ExtractedData> = { [field]: value };
        if (field === 'transactionAmount') {
             updatedValue.transactionAmountInWords = numberToWords(value);
        }
        setEditedData(prev => ({ ...prev, ...updatedValue }));
    };

    const handleAdditionalInfoChange = (field: string, value: string | boolean) => {
        setEditedData(prev => ({
            ...prev,
            additionalInfo: {
                ...prev.additionalInfo,
                [field]: value,
            }
        }))
    };
    
    const isTransfer = template.key === 'transfer';

    const renderPartySection = (title: string, partyType: 'partyA' | 'partyB' | 'heirs' | 'deceasedPersons') => {
        const parties = editedData[partyType];
        if (!parties || parties.length === 0) return null;
        return (
            <Section title={title}>
                {parties.map((party, index) => (
                    <PartyEditor key={index} party={party} onChange={(updated) => handlePartyChange(partyType, index, updated)} />
                ))}
            </Section>
        );
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-left mb-8">
                <button onClick={onBack} className="text-sm font-medium text-blue-600 hover:text-blue-800 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                    Quay lại Tải lên
                </button>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Kiểm tra & Chỉnh sửa Dữ liệu</h2>
                <p className="mt-2 text-lg text-slate-600">
                    AI đã trích xuất các thông tin dưới đây. Vui lòng kiểm tra kỹ và chỉnh sửa nếu cần thiết.
                </p>
            </div>
            
            {renderPartySection('Bên A (Bên Bán/Tặng cho/Thừa kế/Làm đơn)', 'partyA')}
            {renderPartySection('Bên B (Bên Mua/Nhận tặng cho)', 'partyB')}
            {renderPartySection('Người Thừa kế', 'heirs')}
            {renderPartySection('Người để lại Di sản', 'deceasedPersons')}
            
            {(editedData.landInfo && editedData.landInfo.length > 0) && (
                <Section title="Thông tin Thửa đất">
                    {editedData.landInfo.map((land, index) => (
                        <div key={index} className="space-y-4 p-4 border border-slate-200 rounded-md bg-slate-50 col-span-1 md:col-span-2 lg:col-span-3">
                             <h4 className="font-semibold text-lg text-slate-700">Thửa đất {index + 1}</h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <InputField label="Số thửa" value={land.parcelNumber || ''} onChange={e => handleLandChange(index, {...land, parcelNumber: e.target.value})} />
                                <InputField label="Tờ bản đồ số" value={land.mapSheetNumber || ''} onChange={e => handleLandChange(index, {...land, mapSheetNumber: e.target.value})} />
                                <InputField label="Địa chỉ thửa đất" value={land.address || ''} onChange={e => handleLandChange(index, {...land, address: e.target.value})} />
                                <InputField label="Diện tích (m²)" value={land.area || ''} onChange={e => handleLandChange(index, {...land, area: e.target.value})} />
                                <InputField label="Mục đích sử dụng" value={land.usagePurpose || ''} onChange={e => handleLandChange(index, {...land, usagePurpose: e.target.value})} />
                                <InputField label="Thời hạn sử dụng" value={land.usageTerm || ''} onChange={e => handleLandChange(index, {...land, usageTerm: e.target.value})} />
                                <InputField label="Nguồn gốc sử dụng" value={land.usageSource || ''} onChange={e => handleLandChange(index, {...land, usageSource: e.target.value})} />
                                <InputField label="Số GCN" value={land.certificateNumber || ''} onChange={e => handleLandChange(index, {...land, certificateNumber: e.target.value})} />
                                <InputField label="Ngày cấp GCN" value={land.certificateIssueDate || ''} onChange={e => handleLandChange(index, {...land, certificateIssueDate: e.target.value})} />
                                <InputField label="Nơi cấp GCN" value={land.certificateIssuer || ''} onChange={e => handleLandChange(index, {...land, certificateIssuer: e.target.value})} />
                             </div>
                        </div>
                    ))}
                </Section>
            )}

            {(editedData.vehicleInfo && editedData.vehicleInfo.length > 0) && (
                <Section title="Thông tin Phương tiện">
                    {editedData.vehicleInfo.map((vehicle, index) => (
                        <div key={index} className="space-y-4 p-4 border border-slate-200 rounded-md bg-slate-50 col-span-1 md:col-span-2 lg:col-span-3">
                             <h4 className="font-semibold text-lg text-slate-700">Phương tiện {index + 1}</h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <InputField label="Loại phương tiện" value={vehicle.type || ''} onChange={e => handleVehicleChange(index, {...vehicle, type: e.target.value})} />
                                <InputField label="Nhãn hiệu" value={vehicle.brand || ''} onChange={e => handleVehicleChange(index, {...vehicle, brand: e.target.value})} />
                                <InputField label="Màu sơn" value={vehicle.color || ''} onChange={e => handleVehicleChange(index, {...vehicle, color: e.target.value})} />
                                <InputField label="Số khung" value={vehicle.chassisNumber || ''} onChange={e => handleVehicleChange(index, {...vehicle, chassisNumber: e.target.value})} />
                                <InputField label="Số máy" value={vehicle.engineNumber || ''} onChange={e => handleVehicleChange(index, {...vehicle, engineNumber: e.target.value})} />
                                <InputField label="Biển số" value={vehicle.licensePlate || ''} onChange={e => handleVehicleChange(index, {...vehicle, licensePlate: e.target.value})} />
                                <InputField label="Năm sản xuất" value={vehicle.manufactureYear || ''} onChange={e => handleVehicleChange(index, {...vehicle, manufactureYear: e.target.value})} />
                                <InputField label="Chủ xe trên giấy tờ" value={vehicle.registeredOwner || ''} onChange={e => handleVehicleChange(index, {...vehicle, registeredOwner: e.target.value})} />
                             </div>
                        </div>
                    ))}
                </Section>
            )}

            <Section title="Thông tin Chung">
                 <InputField label="Ngày lập văn bản (DD/MM/YYYY)" value={editedData.documentDate || ''} onChange={e => handleGeneralInfoChange('documentDate', e.target.value)} />
                 {isTransfer && (
                    <>
                        <InputField label="Giá chuyển nhượng (VNĐ)" value={editedData.transactionAmount || ''} onChange={e => handleGeneralInfoChange('transactionAmount', e.target.value)} />
                        <div className="col-span-1 md:col-span-2">
                             <label className="block text-sm font-medium text-slate-700">Giá trị bằng chữ</label>
                             <p className="mt-1 p-2 bg-slate-100 rounded-md text-slate-800 min-h-[40px]">{editedData.transactionAmountInWords}</p>
                        </div>
                    </>
                 )}
                 {(template.key === DocumentTemplateKey.LAND_USE_CHANGE || template.key === DocumentTemplateKey.PERSONAL_INFO_CONFIRMATION) && (
                     <InputField label="Tên UBND nhận đơn" value={editedData.ubndName || ''} onChange={e => handleGeneralInfoChange('ubndName', e.target.value)} />
                 )}
            </Section>
            
             {(template.key === DocumentTemplateKey.LAND_USE_CHANGE || template.key === DocumentTemplateKey.TAX_EXEMPTION_REQUEST) && (
                <Section title="Thông tin Bổ sung cho Đơn">
                    <InputField label="Tên xã/phường nhận đơn" value={editedData.additionalInfo?.communeName || ''} onChange={e => handleAdditionalInfoChange('communeName', e.target.value)} />
                    
                    {template.key === DocumentTemplateKey.TAX_EXEMPTION_REQUEST && (
                         <InputField label="Tên vợ/chồng người làm đơn" value={editedData.partyA?.[0]?.spouseName || ''} onChange={e => {
                            const newPartyA = [...(editedData.partyA || [])];
                            if (newPartyA[0]) {
                                newPartyA[0] = {...newPartyA[0], spouseName: e.target.value };
                                setEditedData(prev => ({...prev, partyA: newPartyA}));
                            }
                        }} />
                    )}

                    <InputField label="Mục đích sử dụng mới" value={editedData.additionalInfo?.newUsagePurpose || ''} onChange={e => handleAdditionalInfoChange('newUsagePurpose', e.target.value)} />
                     
                     {template.key === DocumentTemplateKey.LAND_USE_CHANGE && (
                         <InputField label="Thời hạn sử dụng mới" value={editedData.additionalInfo?.newUsageTerm || ''} onChange={e => handleAdditionalInfoChange('newUsageTerm', e.target.value)} />
                     )}

                    <InputField label="Căn cứ pháp lý (VD: Quyết định số...)" value={editedData.additionalInfo?.legalBasis || ''} onChange={e => handleAdditionalInfoChange('legalBasis', e.target.value)} />
                    <InputField label="Đối tượng miễn giảm (nếu có)" value={editedData.additionalInfo?.exemptionCategory || ''} onChange={e => handleAdditionalInfoChange('exemptionCategory', e.target.value)} />
                    <InputField label="Căn cứ miễn giảm (nếu có)" value={editedData.additionalInfo?.exemptionReason || ''} onChange={e => handleAdditionalInfoChange('exemptionReason', e.target.value)} />
                </Section>
            )}

            <div className="pt-6 text-center">
                <button
                    onClick={() => onComplete(editedData)}
                    className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Hoàn tất & Soạn thảo Văn bản
                </button>
            </div>
        </div>
    );
};