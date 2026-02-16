import { 
  Company, User, Opportunity, Application, PublicRequirement, 
  Session, Notification, UserRole, PipelineStatus, OpportunityStatus, EmailLog, CompanyCategory, ContactType 
} from '../types';
import { SEED_COMPANIES, SEED_USERS, SEED_OPPORTUNITIES } from './demoSeed';

class MockDB {
  companies: Company[] = [];
  users: User[] = [];
  opportunities: Opportunity[] = [];
  applications: Application[] = [];
  sessions: Session[] = [];
  publicRequirements: PublicRequirement[] = [];
  notifications: Notification[] = [];
  emailLogs: EmailLog[] = [];

  constructor() {
    this.init();
  }

  init() {
    // Changed to v4 to force a hard reset on client browsers for this update with REAL CATALOG
    const stored = localStorage.getItem('claut_demo_db_v4');
    if (stored) {
      const parsed = JSON.parse(stored);
      this.companies = parsed.companies || [];
      this.users = parsed.users || [];
      this.opportunities = parsed.opportunities || [];
      this.applications = parsed.applications || [];
      this.sessions = parsed.sessions || [];
      this.publicRequirements = parsed.publicRequirements || [];
      this.notifications = parsed.notifications || [];
      this.emailLogs = parsed.emailLogs || [];
    } else {
      this.resetDemoData();
    }
  }

  save() {
    localStorage.setItem('claut_demo_db_v4', JSON.stringify({
      companies: this.companies,
      users: this.users,
      opportunities: this.opportunities,
      applications: this.applications,
      sessions: this.sessions,
      publicRequirements: this.publicRequirements,
      notifications: this.notifications,
      emailLogs: this.emailLogs
    }));
  }

  resetDemoData() {
    this.companies = [...SEED_COMPANIES];
    this.users = [...SEED_USERS];
    this.opportunities = [...SEED_OPPORTUNITIES];
    this.applications = [];
    this.sessions = [];
    this.publicRequirements = [];
    this.notifications = [];
    this.emailLogs = [];
    
    // Create some dummy applications for demo
    const opp = this.opportunities[0];
    const supplier = this.companies.find(c => c.tradeName === 'Plastec');
    if (opp && supplier) {
        this.applications.push({
            id: 'APP-DEMO-1',
            opportunityId: opp.id,
            providerCompanyId: supplier.id,
            status: PipelineStatus.INTERESTED,
            matchScorePercent: 85,
            messageToBuyer: 'Tenemos capacidad disponible para este proyecto.',
            createdAt: new Date().toISOString(),
            lastUpdatedAt: new Date().toISOString()
        });
    }
    
    // Create a dummy public request
    this.publicRequirements.push({
        id: 'PR-DEMO-001',
        requesterName: 'Ing. Externo',
        requesterEmail: 'externo@gmail.com',
        requesterCompany: 'Taller Mecánico del Norte',
        targetCompanyId: 'c-tier1-1', // Metalsa
        title: 'Cotización de sobrantes de acero',
        description: 'Me interesa comprar scrap de acero de sus procesos de estampado.',
        status: 'NEW',
        createdAt: new Date().toISOString()
    });

    this.save();
  }

  // --- Auth & Users ---
  login(email: string, password?: string) {
    // Case insensitive email check
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
        console.error(`Login failed: User ${email} not found in DB.`);
        return { user: null, error: 'Usuario no encontrado. Verifica las credenciales demo.' };
    }
    
    // Demo: simple check
    if (user.passwordHash && password && user.passwordHash !== password) {
       return { user: null, error: 'Contraseña incorrecta (Demo: usa 123456).' };
    }
    user.lastLoginAt = new Date().toISOString();
    this.save();
    return { user, error: undefined };
  }

  register(userData: Partial<User>, companyData: Partial<Company>) {
    if (this.users.find(u => u.email === userData.email)) {
        throw new Error('El usuario ya existe.');
    }
    
    const companyId = `c-${Date.now()}`;
    const newCompany: Company = {
        id: companyId,
        legalName: companyData.legalName || '',
        tradeName: companyData.tradeName || '',
        category: companyData.category || CompanyCategory.TIER_II,
        country: 'México',
        state: companyData.state || '',
        city: companyData.city || '',
        contacts: [],
        publicCapabilities: [],
        publicCertifications: [],
        isActive: false, // Pending approval
        isMemberClaut: false,
        profileCompletenessPercent: 50,
        createdAt: new Date().toISOString()
    };
    
    const newUser: User = {
        id: `u-${Date.now()}`,
        name: userData.name || 'Nuevo Usuario',
        email: userData.email || '',
        role: UserRole.PROVEEDOR, // Default
        companyId: companyId,
        passwordHash: userData.passwordHash || '123456'
    };
    
    this.companies.push(newCompany);
    this.users.push(newUser);
    this.save();
    return { user: newUser, company: newCompany };
  }

  // --- Companies ---
  getCompanies() { return this.companies; }
  getCompanyById(id: string) { return this.companies.find(c => c.id === id); }
  updateCompany(id: string, data: Partial<Company>) {
    const idx = this.companies.findIndex(c => c.id === id);
    if (idx !== -1) {
        this.companies[idx] = { ...this.companies[idx], ...data };
        this.save();
    }
  }

  // --- Opportunities ---
  getOpportunities() { return this.opportunities; }
  getOpportunityById(id: string) { return this.opportunities.find(o => o.id === id); }
  createOpportunity(opp: Opportunity) {
    this.opportunities.unshift(opp);
    this.save();
    
    // Simulate Notification to Suppliers
    const buyer = this.getCompanyById(opp.buyerCompanyId);
    this.logEmail({
        to: ['proveedores_match@claut.demo'],
        cc: ['claudia@claut.com.mx'],
        subject: `[Nueva Oportunidad] ${opp.title}`,
        bodyPreview: `Empresa ${buyer?.tradeName || 'Confidencial'} busca proveedores para: ${opp.summary}`,
        relatedEntityId: opp.id,
        relatedEntityType: 'OPPORTUNITY'
    });
  }

  // --- Applications ---
  getApplicationsByOpportunity(oppId: string) { return this.applications.filter(a => a.opportunityId === oppId); }
  getApplicationsByProvider(companyId: string) { return this.applications.filter(a => a.providerCompanyId === companyId); }
  
  createApplication(app: Application) {
    this.applications.push(app);
    this.save();
    // Simulate Notification to Buyer
    const opp = this.getOpportunityById(app.opportunityId);
    if (opp) {
        const buyerUser = this.users.find(u => u.id === opp.createdByUserId);
        if(buyerUser) {
            this.createNotification(buyerUser.id, 'Nueva Aplicación', `Un proveedor aplicó a: ${opp.title}`, `/opportunities/${opp.id}`);
            this.logEmail({
                to: [buyerUser.email],
                cc: [],
                subject: `Aplicación recibida: ${opp.title}`,
                bodyPreview: `Un proveedor ha mostrado interés. Revisa el portal.`,
                relatedEntityId: app.id,
                relatedEntityType: 'APPLICATION'
            });
        }
    }
  }
  updateApplicationStatus(appId: string, status: PipelineStatus, reason?: string) {
      const app = this.applications.find(a => a.id === appId);
      if (app) {
          app.status = status;
          app.rejectionReason = reason;
          app.lastUpdatedAt = new Date().toISOString();
          this.save();
          
          // Notify Provider if status changes significantly
          const providerSales = this.companies.find(c => c.id === app.providerCompanyId)?.contacts.find(c => c.type === ContactType.SALES);
          if (providerSales && (status === PipelineStatus.PENDING_CONFIRMATION || status === PipelineStatus.CANCELED)) {
             this.logEmail({
                 to: [providerSales.email],
                 cc: [],
                 subject: `Actualización de Estatus: ${status}`,
                 bodyPreview: `El estatus de tu aplicación cambió a ${status}.`,
                 relatedEntityId: appId,
                 relatedEntityType: 'APPLICATION'
             });
          }
      }
  }

  // --- Public Requirements ---
  createPublicRequirement(req: Omit<PublicRequirement, 'id' | 'createdAt' | 'status'>) {
      const newReq: PublicRequirement = {
          ...req,
          id: `PR-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*1000)}`,
          status: 'NEW',
          createdAt: new Date().toISOString()
      };
      this.publicRequirements.unshift(newReq);
      
      // Simulate Email to Target + Admin
      const target = this.getCompanyById(req.targetCompanyId);
      const targetContact = target?.contacts.find(c => c.type === ContactType.ORG_REPRESENTATIVE) || target?.contacts[0];
      
      this.logEmail({
          to: [targetContact?.email || 'contacto@empresa.demo'],
          cc: ['claudia@claut.com.mx', req.requesterEmail],
          subject: `[CLAUT Link] Nuevo Requerimiento Público: ${req.title}`,
          bodyPreview: `Hola ${target?.tradeName}, ${req.requesterName} de ${req.requesterCompany} tiene un requerimiento: ${req.description}`,
          relatedEntityId: newReq.id,
          relatedEntityType: 'PUBLIC_REQ'
      });

      // Notify Claudia internally
      const claudia = this.users.find(u => u.role === UserRole.COORDINADOR_CLAUT);
      if(claudia) {
          this.createNotification(claudia.id, 'Nuevo Requerimiento Público', `De: ${req.requesterCompany} Para: ${target?.tradeName}`, '/public-requests');
      }

      this.save();
      return newReq;
  }

  updatePublicRequirementStatus(id: string, status: 'NEW' | 'PROCESSED' | 'CLOSED') {
      const req = this.publicRequirements.find(r => r.id === id);
      if (req) {
          req.status = status;
          this.save();
      }
  }

  getPublicRequirements() { return this.publicRequirements; }

  // --- Sessions ---
  createSession(session: Session) {
      this.sessions.push(session);
      this.save();
      
      this.logEmail({
          to: session.attendeesEmails,
          cc: ['claudia@claut.com.mx'],
          subject: `Invitación a Sesión CLAUT - Seguimiento`,
          bodyPreview: `Se ha programado una sesión para el: ${new Date(session.scheduledAt).toLocaleString()}. Link: ${session.zoomJoinUrl}`,
          relatedEntityId: session.opportunityId,
          relatedEntityType: 'OPPORTUNITY'
      });
  }
  getSessionsByOpportunity(oppId: string) { return this.sessions.filter(s => s.opportunityId === oppId); }


  // --- Logs & Notifications ---
  createNotification(userId: string, title: string, body: string, link?: string) {
      this.notifications.unshift({
          id: Math.random().toString(36).substr(2,9),
          userId, title, body, linkUrl: link,
          isRead: false,
          createdAt: new Date().toISOString()
      });
      this.save();
  }
  getUserNotifications(userId: string) { return this.notifications.filter(n => n.userId === userId); }
  markNotificationAsRead(notifId: string) {
      const notif = this.notifications.find(n => n.id === notifId);
      if(notif) {
          notif.isRead = true;
          this.save();
      }
  }
  
  logEmail(log: Omit<EmailLog, 'id' | 'sentAt'>) {
      this.emailLogs.unshift({
          ...log,
          id: `email-${Date.now()}`,
          sentAt: new Date().toISOString()
      });
      this.save();
  }
  getEmailLogs() { return this.emailLogs; }
}

export const db = new MockDB();
