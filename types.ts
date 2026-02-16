// Enums
export enum CompanyCategory {
  OEM = 'OEM',
  TIER_I = 'TIER_I',
  TIER_II = 'TIER_II',
  ACADEMIA = 'ACADEMIA',
  RESEARCH_CENTER = 'RESEARCH_CENTER',
  COMMERCIAL_ALLY = 'COMMERCIAL_ALLY',
  SPONSOR = 'SPONSOR'
}

export enum UserRole {
  SUPERADMIN_CLAUT = 'SUPERADMIN_CLAUT',
  COORDINADOR_CLAUT = 'COORDINADOR_CLAUT',
  COMPRADOR = 'COMPRADOR',
  PROVEEDOR = 'PROVEEDOR',
  ADMIN_EMPRESA = 'ADMIN_EMPRESA'
}

export enum OpportunityStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  CANCELED = 'CANCELED'
}

export enum PipelineStatus {
  INTERESTED = 'INTERESTED',
  PENDING_CONFIRMATION = 'PENDING_CONFIRMATION',
  IN_PROPOSAL = 'IN_PROPOSAL',
  WITH_RFQ = 'WITH_RFQ',
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  CANCELED = 'CANCELED'
}

export enum ContactType {
  SALES = 'SALES',
  PROCUREMENT = 'PROCUREMENT',
  GENERAL = 'GENERAL',
  ORG_REPRESENTATIVE = 'ORG_REPRESENTATIVE'
}

export enum ConfidentialityMode {
  SHOW_COMPANY = 'SHOW_COMPANY',
  ANONYMOUS_TO_PROVIDERS = 'ANONYMOUS_TO_PROVIDERS'
}

// Interfaces

export interface Contact {
  id: string;
  companyId: string;
  type: ContactType;
  name: string;
  email: string;
  phone?: string;
  position?: string;
}

export interface Company {
  id: string;
  legalName: string;
  tradeName: string;
  category: CompanyCategory;
  country: string;
  state: string;
  city: string;
  websiteUrl?: string | null;
  linkedinUrl?: string | null;
  logoUrl?: string;
  
  // Public Profile
  publicCoreSummary?: string | null;
  publicProductsServicesSummary?: string | null;
  publicCapabilities: string[];
  publicCertifications: string[];
  
  // Internal Status
  isActive: boolean; 
  isMemberClaut: boolean;
  profileCompletenessPercent: number;
  
  // Relationships
  contacts: Contact[];
  
  // Technical Profile (Private)
  employeesRange?: string;
  machineryEquipment?: string;
  exportMarkets?: string[];
  processes?: string;
  industriesServed?: string[];
  
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId?: string | null;
  passwordHash?: string; // Demo purposes
  lastLoginAt?: string;
}

export interface Opportunity {
  id: string;
  createdByUserId: string;
  buyerCompanyId: string;
  title: string;
  summary: string;
  quantity: string;
  specifications: string;
  requiredCertifications: string[];
  otherRequirements: string;
  confidentialityMode: ConfidentialityMode;
  applicationDeadlineAt: string;
  status: OpportunityStatus;
  aiDetectedCapabilities: string[];
  createdAt: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  providerCompanyId: string;
  providerSalesContactId?: string; // Who applied
  status: PipelineStatus;
  matchScorePercent: number; // 0-100
  messageToBuyer?: string;
  rejectionReason?: string;
  createdAt: string;
  lastUpdatedAt: string;
}

export interface PublicRequirement {
  id: string; // PR-YYYYMMDD-####
  requesterName: string;
  requesterEmail: string;
  requesterCompany: string; // Text if not registered, or Company Name
  requesterCompanyId?: string; // If registered
  targetCompanyId: string; // The company from catalog
  title: string;
  description: string;
  status: 'NEW' | 'PROCESSED' | 'CLOSED';
  createdAt: string;
}

export interface Session {
  id: string;
  opportunityId: string;
  scheduledAt: string;
  zoomJoinUrl?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELED';
  attendeesEmails: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface EmailLog {
  id: string;
  to: string[];
  cc: string[];
  subject: string;
  bodyPreview: string; // Short version for display
  sentAt: string;
  relatedEntityId?: string;
  relatedEntityType?: 'OPPORTUNITY' | 'APPLICATION' | 'PUBLIC_REQ';
}
