import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Truck, Navigation, Settings, BarChart, 
  Menu, Bell, Sun, Moon, LogOut, Search, ChevronLeft, User as UserIcon
} from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import { CommandPalette } from '../components/shared/CommandPalette';
import { NotificationPanel } from '../components/shared/NotificationPanel';

export const DashboardLayout = () => {
  const { 
    theme, setTheme, 
    sidebarOpen, toggleSidebar,
    openCommandPalette, toggleNotificationsPanel 
  } = useUIStore();
  
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebar, setMobileSidebar] = useState(false);

  // Sync dark theme class on document level
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: Sparkles },
    { label: 'Vehicles', path: '/vehicles', icon: Truck },
    { label: 'Transit Requests', path: '/requests', icon: Navigation },
    { label: 'Analytics', path: '/reports', icon: BarChart },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 flex overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside 
        animate={{ width: sidebarOpen ? 240 : 80 }}
        transition={{ duration: 0.2 }}
        className="hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 z-30"
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="h-9 w-9 rounded-xl bg-brand-blue flex items-center justify-center flex-shrink-0 text-white font-extrabold text-lg">
              R
            </div>
            {sidebarOpen && (
              <span className="font-extrabold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                RouteIQ
              </span>
            )}
          </div>
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-500 hover:text-slate-800 dark:hover:text-white"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform duration-200 ${!sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive 
                    ? 'bg-brand-blue/10 text-brand-blue dark:bg-blue-900/20 dark:text-blue-400' 
                    : 'text-gray-500 hover:text-slate-800 hover:bg-slate-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-800/30'
                }`}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 transition-colors ${
                  isActive ? 'text-brand-blue dark:text-blue-400' : 'text-gray-400 group-hover:text-slate-600 dark:group-hover:text-gray-300'
                }`} />
                {sidebarOpen ? (
                  <span className="ml-3 font-semibold tracking-wide transition-opacity duration-200">{item.label}</span>
                ) : (
                  <span className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info / Logout */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          {sidebarOpen ? (
            <div className="flex items-center space-x-3 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl mb-2">
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"} 
                alt="user" 
                className="h-9 w-9 rounded-full ring-2 ring-brand-blue/20"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{user?.name}</p>
                <p className="text-[10px] text-gray-500 capitalize">{user?.role}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-1 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                title="Logout"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 group relative"
            >
              <LogOut className="h-5 w-5" />
              <span className="absolute left-full ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                Logout
              </span>
            </button>
          )}
        </div>
      </motion.aside>

      {/* Mobile Slide-Over Sidebar */}
      <AnimatePresence>
        {mobileSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebar(false)}
              className="fixed inset-0 z-40 bg-black md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed top-0 bottom-0 left-0 w-64 z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col md:hidden"
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-xl bg-brand-blue flex items-center justify-center text-white font-extrabold text-lg">
                    R
                  </div>
                  <span className="font-extrabold text-lg tracking-tight">RouteIQ</span>
                </div>
                <button 
                  onClick={() => setMobileSidebar(false)}
                  className="text-gray-400 p-1 hover:text-gray-600 dark:hover:text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>
              
              <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = currentPath === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileSidebar(false)}
                      className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive 
                          ? 'bg-brand-blue/10 text-brand-blue dark:bg-blue-900/20 dark:text-blue-400' 
                          : 'text-gray-500 hover:text-slate-800 hover:bg-slate-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-800/30'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-3">
                <img 
                  src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"} 
                  alt="user" 
                  className="h-10 w-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{user?.name}</p>
                  <p className="text-[10px] text-gray-500 capitalize">{user?.role}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-1 rounded-md text-red-500"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Page Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Main Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
          {/* Left search/menu section */}
          <div className="flex items-center space-x-3 md:space-x-0">
            <button 
              onClick={() => setMobileSidebar(true)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden text-gray-500"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Clickable Search Omnibar to trigger Command Palette */}
            <button
              onClick={openCommandPalette}
              className="flex items-center text-left text-xs bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900/60 text-gray-400 border border-slate-200 dark:border-slate-800 px-3 py-1.5 md:py-2 rounded-xl w-36 md:w-64 transition-all"
            >
              <Search className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
              <span className="flex-1 truncate hidden sm:inline">Search (Ctrl+K)</span>
              <span className="flex-1 truncate sm:hidden">Search...</span>
              <kbd className="hidden md:inline px-1.5 py-0.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded font-semibold text-[8px]">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Right settings/action section */}
          <div className="flex items-center space-x-2.5">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-gray-500 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-800/80 transition-all"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-indigo-500" />
              )}
            </button>

            {/* Notifications Toggle */}
            <button
              onClick={toggleNotificationsPanel}
              className="p-2 text-gray-500 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-800/80 transition-all relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-blue" />
            </button>
          </div>
        </header>

        {/* Dynamic Route View */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-slate-950">
          <Outlet />
        </main>
      </div>

      {/* Global Utilities */}
      <CommandPalette />
      <NotificationPanel />
    </div>
  );
};

export default DashboardLayout;
