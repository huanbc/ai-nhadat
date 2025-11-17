

export enum Step {
  SELECT_TEMPLATE,
  SELECT_SUB_TEMPLATE,
  UPLOAD_DOCUMENTS,
  REVIEW_EXTRACTED_DATA,
  UPLOAD_CUSTOM_TEMPLATE, // Thêm bước mới
  GENERATE_DOCUMENT,
}

export enum DocumentTemplateKey {
  TRANSFER = 'transfer',
  GIFT = 'gift',
  INHERITANCE = 'inheritance',
  INHERITANCE_GIFT = 'inheritance_gift',
  INHERITANCE_DECLARATION = 'inheritance_declaration',
  TAX_DECLARATION_COMBO = 'tax_declaration_combo',
  TAX_DECLARATION_NEW = 'tax_declaration_new',
  CERTIFICATE_APPLICATION = 'certificate_application',
  LAND_CHANGE_REGISTRATION = 'land_change_registration',
  LAND_USE_CHANGE = 'land_use_change',
  TAX_EXEMPTION_REQUEST = 'tax_exemption_request',
  PERSONAL_INFO_CONFIRMATION = 'personal_info_confirmation',
  MATRIMONIAL_PROPERTY = 'matrimonial_property',
}

// Định nghĩa các loại mẫu con
export type SubTemplateKey = 'vpcc' | 'ubnd' | 'simplified';

export interface DocumentTemplate {
  key: DocumentTemplateKey;
  title: string;
  description: string;
  requiredParties: ('partyA' | 'partyB' | 'heir')[];
  requiresLandCertificate: boolean;
  requiresDeathCertificate?: boolean;
  acceptsHeirsConfirmation?: boolean;
  acceptsContract?: boolean;
  hasSubTemplates?: boolean; // Thêm thuộc tính để xác định mẫu nào có biến thể
}

export interface PartyData {
  fullName?: string;
  dateOfBirth?: string;
  sex?: string;
  nationality?: string;
  idNumber?: string;
  idIssueDate?: string;
  idIssuePlace?: string;
  placeOfOrigin?: string;
  permanentAddress?: string;
  newPermanentAddress?: string; // Địa chỉ thường trú mới (sau khi chuẩn hóa)
  currentAddress?: string;
  phoneNumber?: string;
  maritalStatus?: string;
  spouseName?: string;
  spouseIdNumber?: string;
  dateOfDeath?: string;
  deathCertificateNumber?: string;
  deathCertificateIssueDate?: string;
  deathCertificateIssuer?: string;
  taxCode?: string; // Mã số thuế
}

export interface LandData {
  parcelNumber?: string;
  mapSheetNumber?: string;
  address?: string;
  area?: string;
  commonArea?: string; // Diện tích sử dụng chung
  privateArea?: string; // Diện tích sử dụng riêng
  usagePurpose?: string;
  usageTerm?: string;
  usageSource?: string;
  usageForm?: string;
  certificateNumber?: string;
  certificateBookNumber?: string; // Số vào sổ cấp GCN
  certificateIssuer?: string;
  certificateIssueDate?: string;
  certificateType?: string; // Loại Giấy chứng nhận
  // Agricultural land types
  riceLandArea?: string; // Đất trồng lúa (LUC + LUK)
  annualCropLandArea?: string; // Đất trồng cây hàng năm khác (BHK, HNK)
  perennialTreeLandArea?: string; // Đất trồng cây lâu năm (CLN)
  aquacultureLandArea?: string; // Đất nuôi trồng thủy sản (NTS)
}

export interface HouseData {
  houseType?: string;
  constructionArea?: string;
  floorArea?: string;
  commonOwnershipArea?: string;
  privateOwnershipArea?: string;
  floors?: string;
  aboveGroundFloors?: string;
  constructionOrigin?: string;
  completionYear?: string;
  ownershipExpiry?: string;
}

export interface AdditionalTaxInfo {
    propertyOrigin?: string; // Nguồn gốc nhà đất
    actualTransferValue?: string; // Giá trị đất thực tế chuyển giao
    coOwners?: PartyData[]; // Đồng sở hữu
    landLocationType?: string; // Vị trí thửa đất (mặt tiền, ngõ...)
    landUsePurposeDetails?: string; // Chi tiết mục đích sử dụng
    // Add other specific tax fields if needed
}

export interface RegistrationApplicationInfo {
  ubndName?: string;
  houseInfo?: HouseData[];
  requests?: {
      registerLand?: boolean;
      issueCertificate?: boolean;
      deferPayment?: boolean;
      otherRequest?: string;
  };
}


export interface ExtractedData {
  partyA?: PartyData[];
  partyB?: PartyData[];
  heirs?: PartyData[];
  deceasedPersons?: PartyData[]; 
  landInfo?: LandData[];
  additionalInfo?: AdditionalTaxInfo & RegistrationApplicationInfo & { 
    newUsagePurpose?: string;
    newUsageTerm?: string;
    [key: string]: any; 
  };
  documentDate?: string;
  transactionAmount?: string;
  transactionAmountInWords?: string;
  ubndName?: string;
  subTemplateKey?: SubTemplateKey; // Thêm để lưu lựa chọn mẫu con
}

export interface UploadedFile {
    name: string;
    base64: string;
    mimeType: string;
}

export interface UploadedFiles {
  partyA_id?: UploadedFile[];
  partyB_id?: UploadedFile[];
  landCertificate?: UploadedFile[];
  heir_ids?: UploadedFile[];
  deathCertificates?: UploadedFile[];
  heirsConfirmation?: UploadedFile;
  contract?: UploadedFile[];
}

export interface StoredDocument {
  id: string;
  createdAt: string;
  updatedAt: string;
  templateKey: DocumentTemplateKey;
  templateTitle: string;
  data: ExtractedData;
}

export interface StoredAnalyzedDocument {
  id: string;
  createdAt: string;
  fileName: string;
  analysisContent: string;
}

export interface StoredLegalDocument {
  id: string;
  createdAt: string;
  fileName: string;
  base64: string;
  mimeType: string;
  contentHash: string; // To check for duplicates
}

export interface StoredOfficialDocument {
  id: string;
  createdAt: string;
  title: string;
  directiveFiles: { name: string; mimeType: string }[];
  responseContent: string;
  userNotes: string;
  directiveAnalysis: string;
}

export interface Procedure {
  id: string;
  category: string;
  title: string;
  description: string;
  applicableTo: string;
  duration: string;
  documents: string[];
  steps: string[];
  authority: 'cấp tỉnh' | 'cấp xã';
}

export interface LandPrice {
  id?: string;
  streetName: string;
  section: string;
  position: string;
  price: number;
  commune?: string;
  sectionCode?: string;
  adjustmentFactor?: number;
  vhmFactor?: number;
  notes?: string;
}
