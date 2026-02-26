import React, { useState } from 'react';
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  DollarSign,
  Receipt,
  MessageSquare,
  Star,
  Shield,
  Settings,
  User,
  LogOut,
  Bell,
  Briefcase,
  ScrollText,
  Copy } from
'lucide-react';
import { ToastContainer } from './components/Modals';
import { MobileBottomNav } from './components/Navigation';
import { currentUserContractor, currentUserHomeowner } from './data/mockData';
// Pages
import { ContractorDashboard } from './pages/ContractorDashboard';
import { HomeownerDashboard } from './pages/HomeownerDashboard';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { DrawRequestPage } from './pages/DrawRequestPage';
import { MessagingPage } from './pages/MessagingPage';
import { ReceiptsPage } from './pages/ReceiptsPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { VerificationPage } from './pages/VerificationPage';
import { SettingsPage } from './pages/SettingsPage';
import { NewProjectPage } from './pages/NewProjectPage';
import { ContractPage } from './pages/ContractPage';
import { SchedulePage } from './pages/SchedulePage';
import { ChangeOrderPage } from './pages/ChangeOrderPage';
import { DailyLogPage } from './pages/DailyLogPage';
import { ContractsListPage } from './pages/ContractsListPage';
import { HomeownerContractReviewPage } from './pages/HomeownerContractReviewPage';
import { ContractTemplatesPage } from './pages/ContractTemplatesPage';
import { TransactionHistoryPage } from './pages/TransactionHistoryPage';
import { LoginPage } from './pages/LoginPage';
import { DrawsListPage } from './pages/DrawsListPage';
import { DisputePage } from './pages/DisputePage';
const contractorNavItems = [
{
  id: 'dashboard',
  label: 'Dashboard',
  icon: <LayoutDashboard className="w-5 h-5" />
},
{
  id: 'projects',
  label: 'Projects',
  icon: <Briefcase className="w-5 h-5" />
},
{
  id: 'contracts',
  label: 'Contracts',
  icon: <ScrollText className="w-5 h-5" />
},
{
  id: 'contract-templates',
  label: 'Templates',
  icon: <Copy className="w-5 h-5" />
},
{
  id: 'draws',
  label: 'Draw Requests',
  icon: <DollarSign className="w-5 h-5" />
},
{
  id: 'receipts',
  label: 'Receipts',
  icon: <Receipt className="w-5 h-5" />
},
{
  id: 'messages',
  label: 'Messages',
  icon: <MessageSquare className="w-5 h-5" />
},
{
  id: 'reviews',
  label: 'Reviews',
  icon: <Star className="w-5 h-5" />
},
{
  id: 'verification',
  label: 'Verification',
  icon: <Shield className="w-5 h-5" />
},
{
  id: 'settings',
  label: 'Settings',
  icon: <Settings className="w-5 h-5" />
}];

const homeownerNavItems = [
{
  id: 'dashboard',
  label: 'Dashboard',
  icon: <LayoutDashboard className="w-5 h-5" />
},
{
  id: 'projects',
  label: 'My Project',
  icon: <FileText className="w-5 h-5" />
},
{
  id: 'draws',
  label: 'Payments',
  icon: <DollarSign className="w-5 h-5" />
},
{
  id: 'messages',
  label: 'Messages',
  icon: <MessageSquare className="w-5 h-5" />
},
{
  id: 'settings',
  label: 'Settings',
  icon: <Settings className="w-5 h-5" />
}];

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'contractor' | 'homeowner'>(
    'contractor'
  );
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);
  const currentUser =
  userRole === 'contractor' ? currentUserContractor : currentUserHomeowner;
  const navItems =
  userRole === 'contractor' ? contractorNavItems : homeownerNavItems;
  const addToast = (
  variant: 'success' | 'error' | 'warning' | 'info',
  title?: string,
  message?: string) =>
  {
    const id = Math.random().toString(36).substr(2, 9);
    const defaultTitles: Record<string, string> = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info'
    };
    const defaultMessages: Record<string, string> = {
      success: 'Action completed successfully.',
      error: 'Something went wrong. Please try again.',
      warning: 'Please review before continuing.',
      info: 'Here is some useful information.'
    };
    setToasts((prev) => [
    ...prev,
    {
      id,
      variant,
      title: title || defaultTitles[variant],
      message: message || defaultMessages[variant]
    }]
    );
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  const handleLogin = (role: 'contractor' | 'homeowner') => {
    setUserRole(role);
    setActivePage('dashboard');
    setIsAuthenticated(true);
  };
  const handleLogout = () => {
    setIsAuthenticated(false);
    setActivePage('dashboard');
    setSelectedId(undefined);
  };
  const handleNavigate = (page: string, id?: string) => {
    setActivePage(page);
    if (id !== undefined) setSelectedId(id);
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  };
  const handleRoleSwitch = (role: 'contractor' | 'homeowner') => {
    setUserRole(role);
    setActivePage('dashboard');
    setSelectedId(undefined);
  };
  const getPageTitle = () => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      projects: userRole === 'contractor' ? 'Projects' : 'My Project',
      contracts: 'Contracts',
      'contract-templates': 'Contract Templates',
      draws: userRole === 'contractor' ? 'Draw Requests' : 'Payments',
      'draw-detail': 'Draw Request',
      'project-detail': 'Project Details',
      messages: 'Messages',
      receipts: 'Receipts',
      reviews: 'Reviews',
      verification: 'Verification',
      settings: 'Settings'
    };
    return titles[activePage] || 'ContractPay';
  };
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return userRole === 'contractor' ?
        <ContractorDashboard onNavigate={handleNavigate} /> :

        <HomeownerDashboard onNavigate={handleNavigate} addToast={addToast} />;

      case 'projects':
        return <ProjectsPage onNavigate={handleNavigate} userRole={userRole} />;
      case 'contracts':
        return <ContractsListPage onNavigate={handleNavigate} />;
      case 'contract-templates':
        return <ContractTemplatesPage onNavigate={handleNavigate} />;
      case 'new-project':
        return (
          <NewProjectPage onNavigate={handleNavigate} addToast={addToast} />);

      case 'homeowner-contract-review':
        return (
          <HomeownerContractReviewPage
            projectId={selectedId}
            onNavigate={handleNavigate}
            addToast={addToast} />);


      case 'transaction-history':
        return <TransactionHistoryPage onNavigate={handleNavigate} />;
      case 'project-detail':
        return (
          <ProjectDetailPage
            projectId={selectedId}
            onNavigate={handleNavigate}
            userRole={userRole} />);


      case 'contract':
        return (
          <ContractPage
            projectId={selectedId}
            onNavigate={handleNavigate}
            userRole={userRole}
            addToast={addToast} />);


      case 'schedule':
        return (
          <SchedulePage projectId={selectedId} onNavigate={handleNavigate} />);

      case 'change-orders':
        return (
          <ChangeOrderPage projectId={selectedId} onNavigate={handleNavigate} />);

      case 'daily-log':
        return (
          <DailyLogPage projectId={selectedId} onNavigate={handleNavigate} />);

      case 'draws':
        return <DrawsListPage onNavigate={handleNavigate} userRole={userRole} />;
      case 'draw-detail':
        return (
          <DrawRequestPage
            drawId={selectedId}
            onNavigate={handleNavigate}
            userRole={userRole}
            addToast={addToast} />);


      case 'dispute':
        return (
          <DisputePage
            drawId={selectedId}
            onNavigate={handleNavigate}
            userRole={userRole}
            addToast={addToast} />);


      case 'messages':
        return <MessagingPage userRole={userRole} onNavigate={handleNavigate} />;
      case 'receipts':
        return <ReceiptsPage />;
      case 'reviews':
        return <ReviewsPage />;
      case 'verification':
        return <VerificationPage />;
      case 'settings':
        return <SettingsPage addToast={addToast} userRole={userRole} />;
      default:
        return null;
    }
  };
  // Determine which nav item is "active" (handle sub-pages)
  const activeNavItem =
  activePage === 'project-detail' ?
  'projects' :
  activePage === 'draw-detail' ?
  'draws' :
  activePage;
  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <LoginPage onLogin={handleLogin} />
      </>);

  }
  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Mobile sidebar overlay */}
      {sidebarOpen &&
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={() => setSidebarOpen(false)} />

      }

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1e3a5f] text-white flex flex-col transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto`}>

        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <h1 className="text-xl font-bold tracking-tight">ContractPay</h1>
            <p className="text-xs text-white/50 mt-0.5">Construction Escrow</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white">

            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeNavItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive ? 'bg-white text-[#1e3a5f] shadow-sm' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>

                {item.icon}
                {item.label}
              </button>);

          })}
        </nav>

        {/* User Footer */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-white/50 truncate capitalize">
                {userRole}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-white/40 hover:text-white transition-colors"
              title="Sign out">

              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700 p-1">

              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-base font-semibold text-gray-900 lg:hidden">
              {getPageTitle()}
            </h2>
            <h2 className="text-base font-semibold text-gray-900 hidden lg:block">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="p-4 lg:p-8 max-w-6xl mx-auto">{renderPage()}</div>
        </div>

        {/* Mobile Bottom Nav */}
        <div className="lg:hidden">
          <MobileBottomNav
            activeItem={activeNavItem}
            onItemClick={handleNavigate}
            userType={userRole}
            onLogout={handleLogout} />

        </div>
      </main>
    </div>);

}