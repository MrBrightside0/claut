import { Company, User, UserRole, CompanyCategory, ContactType } from './types';

export const LOGO_URL = "https://static.wixstatic.com/media/83920e_8c578f01bcb74323af746019509e5f2e~mv2.png/v1/fill/w_190,h_55,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/CLAUT%20Blanco%20Horizontal.png";

export const SEED_COMPANIES: Company[] = [
  {
    id: 'c1',
    legalName: 'Cluster Automotriz de Nuevo León A.C.',
    tradeName: 'CLAUT',
    category: CompanyCategory.ACADEMIA,
    country: 'México',
    state: 'Nuevo León',
    city: 'Monterrey',
    publicCoreSummary: 'Organización que impulsa la competitividad del sector automotriz.',
    publicProductsServicesSummary: 'Vinculación, capacitación, eventos, networking.',
    publicCertifications: [],
    publicCapabilities: ['Vinculación', 'Consultoría'],
    isActive: true,
    contacts: [],
    profileCompletenessPercent: 100,
    isMemberClaut: true,
    createdAt: '2023-01-01T00:00:00.000Z'
  },
  {
    id: 'c2',
    legalName: 'Metalmecanica Avanzada S.A. de C.V.',
    tradeName: 'Metalsa',
    category: CompanyCategory.TIER_I,
    country: 'México',
    state: 'Nuevo León',
    city: 'Apodaca',
    publicCoreSummary: 'Líderes en manufactura de chasis para vehículos ligeros y comerciales.',
    publicProductsServicesSummary: 'Chasis, largueros, estampados estructurales, soldadura robotizada.',
    publicCertifications: ['IATF 16949', 'ISO 14001', 'ISO 9001'],
    publicCapabilities: ['Estampado', 'Soldadura', 'Pintura E-coat'],
    isActive: true,
    contacts: [
      { id: 'cc1', companyId: 'c2', type: ContactType.PROCUREMENT, name: 'Juan Perez', email: 'compras@metalsa.com' },
      { id: 'cc2', companyId: 'c2', type: ContactType.SALES, name: 'Ana Gomez', email: 'ventas@metalsa.com' }
    ],
    employeesRange: '1000+',
    profileCompletenessPercent: 90,
    isMemberClaut: true,
    createdAt: '2023-01-01T00:00:00.000Z'
  },
  {
    id: 'c3',
    legalName: 'Plásticos Técnicos del Norte',
    tradeName: 'Plastec',
    category: CompanyCategory.TIER_II,
    country: 'México',
    state: 'Coahuila',
    city: 'Saltillo',
    publicCoreSummary: 'Inyección de plásticos de alta ingeniería para interiores automotrices.',
    publicProductsServicesSummary: 'Consolas centrales, paneles de puerta, componentes HVAC.',
    publicCertifications: ['ISO 9001', 'IATF 16949'],
    publicCapabilities: ['Inyección de Plástico', 'Ensamble', 'Moldeo'],
    isActive: true,
    contacts: [
      { id: 'cc3', companyId: 'c3', type: ContactType.SALES, name: 'Roberto Diaz', email: 'ventas@plastec.mx' }
    ],
    employeesRange: '201-500',
    profileCompletenessPercent: 85,
    isMemberClaut: true,
    createdAt: '2023-01-01T00:00:00.000Z'
  },
  {
    id: 'c4',
    legalName: 'Nemak S.A.',
    tradeName: 'Nemak',
    category: CompanyCategory.TIER_I,
    country: 'México',
    state: 'Nuevo León',
    city: 'García',
    publicCoreSummary: 'Soluciones de aligeramiento para la industria automotriz global.',
    publicProductsServicesSummary: 'Cabezas de motor, monobloques, componentes de transmisión, estructuras.',
    publicCertifications: ['IATF 16949', 'ISO 14001', 'ISO 50001'],
    publicCapabilities: ['Fundición Aluminio', 'Maquinado', 'Tratamiento Térmico'],
    isActive: true,
    contacts: [
       { id: 'cc4', companyId: 'c4', type: ContactType.PROCUREMENT, name: 'Laura Sanchez', email: 'compras@nemak.com' }
    ],
    employeesRange: '1000+',
    profileCompletenessPercent: 95,
    isMemberClaut: true,
    createdAt: '2023-01-01T00:00:00.000Z'
  },
  {
    id: 'c5',
    legalName: 'TechSolutions Automation',
    tradeName: 'TechAuto',
    category: CompanyCategory.TIER_II,
    country: 'México',
    state: 'Querétaro',
    city: 'Querétaro',
    publicCoreSummary: 'Automatización y control para líneas de ensamble.',
    publicProductsServicesSummary: 'PLC, Robótica, Visión Artificial, Celdas de manufactura.',
    publicCertifications: ['ISO 9001', 'UL Certified'],
    publicCapabilities: ['Automatización', 'Integración de Sistemas', 'Programación'],
    isActive: true,
    contacts: [
      { id: 'cc5', companyId: 'c5', type: ContactType.SALES, name: 'Carlos Ruiz', email: 'cruiz@techauto.com' }
    ],
    employeesRange: '51-200',
    profileCompletenessPercent: 70,
    isMemberClaut: false,
    createdAt: '2023-01-01T00:00:00.000Z'
  }
];

export const SEED_USERS: User[] = [
  {
    id: 'u1',
    companyId: 'c1',
    name: 'Claudia Coordinadora',
    email: 'claudia@claut.com.mx',
    role: UserRole.COORDINADOR_CLAUT
  },
  {
    id: 'u2',
    companyId: 'c2',
    name: 'Juan Comprador (Metalsa)',
    email: 'compras@metalsa.com',
    role: UserRole.COMPRADOR
  },
  {
    id: 'u3',
    companyId: 'c3',
    name: 'Roberto Ventas (Plastec)',
    email: 'ventas@plastec.mx',
    role: UserRole.PROVEEDOR
  },
  {
    id: 'u4',
    companyId: 'c4',
    name: 'Laura Comprador (Nemak)',
    email: 'compras@nemak.com',
    role: UserRole.COMPRADOR
  }
];

export const AVAILABLE_CERTIFICATIONS = [
  "IATF 16949", "ISO 9001", "ISO 14001", "ISO 45001", "VDA 6.3", "BIQS", "Q1", "ISO 27001", "TISAX"
];

export const AVAILABLE_CAPABILITIES = [
  "Inyección de Plástico", "Estampado", "Fundición", "Maquinado CNC", "Forja", 
  "Extrusión", "Electrónica", "Software", "Logística", "Recubrimientos", "Moldes y Troqueles"
];