import React from 'react';
import {
  LayoutDashboard,
  FileText,
  DollarSign,
  Settings,
  Menu,
  ChevronLeft,
  User,
  LogOut } from
'lucide-react';
interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}
interface MobileBottomNavProps {
  activeItem: string;
  onItemClick: (id: string) => void;
  userType: 'contractor' | 'homeowner';
  onLogout?: () => void;
}
export function MobileBottomNav({
  activeItem,
  onItemClick,
  userType,
  onLogout
}: MobileBottomNavProps) {
  const items: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-6 h-6" />
  },
  {
    id: 'contracts',
    label: userType === 'contractor' ? 'Contracts' : 'Project',
    icon: <FileText className="w-6 h-6" />
  },
  {
    id: 'draws',
    label: userType === 'contractor' ? 'Draws' : 'Payments',
    icon: <DollarSign className="w-6 h-6" />
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-6 h-6" />
  }];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around px-2 z-50">
      {items.map((item) => {
        const isActive = activeItem === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-[#1e3a5f]' : 'text-gray-400'}`}>

            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>);

      })}
      {onLogout &&
      <button
        onClick={onLogout}
        className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-400 hover:text-red-500 transition-colors">

          <LogOut className="w-6 h-6" />
          <span className="text-[10px] font-medium">Sign Out</span>
        </button>
      }
    </nav>);

}
interface DesktopSidebarProps {
  activeItem: string;
  onItemClick: (id: string) => void;
  user: {
    name: string;
    role: string;
    avatar?: string;
  };
}
export function DesktopSidebar({
  activeItem,
  onItemClick,
  user
}: DesktopSidebarProps) {
  const items: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />
  },
  {
    id: 'contracts',
    label: 'Contracts',
    icon: <FileText className="w-5 h-5" />
  },
  {
    id: 'draws',
    label: 'Draw Requests',
    icon: <DollarSign className="w-5 h-5" />
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />
  }];

  return (
    <aside className="w-60 h-screen bg-navy-900 text-white flex flex-col flex-shrink-0">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight">ContractPay</h1>
      </div>

      <div className="flex-1 px-3 space-y-1">
        {items.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-white text-navy-900' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>

              {item.icon}
              {item.label}
            </button>);

        })}
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            {user.avatar ?
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full rounded-full object-cover" /> :


            <User className="w-5 h-5 text-white" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user.name}
            </p>
            <p className="text-xs text-white/60 truncate">{user.role}</p>
          </div>
          <button className="text-white/60 hover:text-white">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>);

}
interface HeaderBarProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}
export function HeaderBar({
  title,
  showBack,
  onBack,
  rightAction
}: HeaderBarProps) {
  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        {showBack ?
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg">

            <ChevronLeft className="w-6 h-6" />
          </button> :

        <button className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden">
            <Menu className="w-6 h-6" />
          </button>
        }
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>

      <div>{rightAction}</div>
    </header>);

}