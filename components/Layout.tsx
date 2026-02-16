import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LOGO_URL } from '../constants';
import { 
  LayoutDashboard, Building2, Briefcase, FileText, Settings, 
  LogOut, Menu, X, Bell, User as UserIcon, Inbox
} from 'lucide-react';
import { UserRole } from '../types';
import { db } from '../services/mockDb';

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const notifications = user ? db.getUserNotifications(user.id).filter(n => !n.isRead) : [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationClick = (notif: any) => {
      db.markNotificationAsRead(notif.id);
      setShowNotifications(false);
      if (notif.linkUrl) {
          navigate(notif.linkUrl);
      }
  };

  const navItemClass = (path: string) => 
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      location.pathname === path 
        ? 'bg-claut-700 text-white' 
        : 'text-claut-100 hover:bg-claut-700 hover:text-white'
    }`;

  if (!user) {
    // Public Layout
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <header className="bg-claut-900 text-white shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/">
              <img src={LOGO_URL} alt="CLAUT Link" className="h-10 object-contain" />
            </Link>
            <nav className="hidden md:flex space-x-6 items-center">
              <Link to="/catalog" className="hover:text-claut-100 transition">Catálogo Público</Link>
              <Link to="/login" className="bg-white text-claut-900 px-4 py-2 rounded font-medium hover:bg-gray-100 transition">
                Acceso Socios
              </Link>
            </nav>
            <button className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>
        <main className="flex-grow">{children}</main>
        <footer className="bg-claut-900 text-claut-100 py-8 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">© 2024 Cluster Automotriz de Nuevo León A.C.</p>
            <p className="text-xs mt-2 text-slate-400">Powered by CLAUT Link (Demo)</p>
          </div>
        </footer>
      </div>
    );
  }

  // Private Layout (CMS)
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-claut-900 text-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-auto`}>
        <div className="p-6 flex justify-between items-center">
          <img src={LOGO_URL} alt="CLAUT" className="h-8 object-contain" />
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="px-4 space-y-2 mt-4">
          <div className="px-4 py-2 text-xs text-claut-100 uppercase tracking-wider font-semibold">
            {user.role.replace(/_/g, ' ')}
          </div>

          <Link to="/dashboard" className={navItemClass('/dashboard')}>
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          
          {(user.role === UserRole.COMPRADOR || user.role === UserRole.COORDINADOR_CLAUT) && (
             <Link to="/opportunities" className={navItemClass('/opportunities')}>
                <Briefcase className="w-5 h-5" />
                <span>Gestión Oportunidades</span>
             </Link>
          )}

          {user.role === UserRole.PROVEEDOR && (
            <Link to="/opportunities" className={navItemClass('/opportunities')}>
              <Briefcase className="w-5 h-5" />
              <span>Oportunidades</span>
            </Link>
          )}

          {user.role === UserRole.COORDINADOR_CLAUT && (
            <Link to="/public-requests" className={navItemClass('/public-requests')}>
              <Inbox className="w-5 h-5" />
              <span>Req. Públicos</span>
            </Link>
          )}

          {user.role !== UserRole.SUPERADMIN_CLAUT && (
            <Link to="/profile" className={navItemClass('/profile')}>
              <Building2 className="w-5 h-5" />
              <span>Mi Empresa</span>
            </Link>
          )}

          {(user.role === UserRole.SUPERADMIN_CLAUT || user.role === UserRole.COORDINADOR_CLAUT) && (
            <Link to="/admin" className={navItemClass('/admin')}>
              <Settings className="w-5 h-5" />
              <span>Admin Demo</span>
            </Link>
          )}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-claut-700">
          <button onClick={handleLogout} className="flex items-center space-x-3 text-claut-100 hover:text-white w-full">
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-20 h-16 flex items-center justify-between px-6 relative">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex ml-auto items-center space-x-6">
            {/* Notifications */}
            <div className="relative">
               <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1 rounded-full hover:bg-gray-100 transition"
               >
                   <Bell className="w-6 h-6 text-gray-500 hover:text-claut-900" />
                   {notifications.length > 0 && (
                     <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                       {notifications.length}
                     </span>
                   )}
               </button>

               {showNotifications && (
                   <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                       <div className="px-4 py-2 border-b font-bold text-gray-700 flex justify-between items-center">
                           Notificaciones
                           <button onClick={() => setShowNotifications(false)}><X className="w-4 h-4"/></button>
                       </div>
                       <div className="max-h-64 overflow-y-auto">
                           {notifications.length === 0 ? (
                               <div className="px-4 py-6 text-center text-gray-500 text-sm">No tienes notificaciones nuevas.</div>
                           ) : (
                               notifications.map(n => (
                                   <div 
                                    key={n.id} 
                                    onClick={() => handleNotificationClick(n)}
                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-0"
                                   >
                                       <p className="font-bold text-sm text-gray-800">{n.title}</p>
                                       <p className="text-xs text-gray-600 mt-1">{n.body}</p>
                                       <p className="text-[10px] text-gray-400 mt-2 text-right">{new Date(n.createdAt).toLocaleTimeString()}</p>
                                   </div>
                               ))
                           )}
                       </div>
                   </div>
               )}
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-claut-100 rounded-full flex items-center justify-center text-claut-700">
                <UserIcon className="w-5 h-5" />
              </div>
              <div className="text-sm hidden sm:block">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-gray-500 text-xs">{user.companyId ? db.getCompanyById(user.companyId)?.tradeName : 'Admin'}</p>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;