import React from 'react';
import { 
  LayoutDashboard, 
  FileEdit, 
  CheckSquare, 
  Sliders, 
  FolderUp, 
  Building2,
  ChevronDown,
  CheckCircle2,
  User as UserIcon,
  X
} from 'lucide-react';
import { Role, User } from '../types';

export type TabKey = 
  | 'dashboard'
  | 'audit-input'
  | 'approval-panel'
  | 'dynamic-weights'
  | 'attachments';

interface SidebarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  pendingCount: number;
  userRole: Role;
  currentUser: User;
  onUserChange: (user: User) => void;
  users: User[];
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingCount,
  userRole,
  currentUser,
  onUserChange,
  users,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'dashboard' as TabKey,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      desc: 'Metrik & Capaian Mutu'
    },
    {
      id: 'audit-input' as TabKey,
      label: 'Input Audit',
      icon: FileEdit,
      badge: '2 Auditor',
      badgeColor: 'bg-emerald-700/80 text-emerald-200 border-emerald-600',
      desc: 'Formulir 27 Item Paralel'
    },
    {
      id: 'approval-panel' as TabKey,
      label: 'Approval LPM',
      icon: CheckSquare,
      badge: pendingCount > 0 ? `${pendingCount} Baru` : null,
      badgeColor: 'bg-amber-500 text-slate-900 border-amber-400 font-black',
      desc: 'Verifikasi Manajer Mutu'
    },
    {
      id: 'dynamic-weights' as TabKey,
      label: 'Bobot Dinamis',
      icon: Sliders,
      badge: null,
      desc: 'Konfigurasi Pembobotan'
    },
    {
      id: 'attachments' as TabKey,
      label: 'Unggah Berkas',
      icon: FolderUp,
      badge: null,
      desc: 'Proposal, Foto & LPJ'
    },
  ];

  const getRoleLabel = (role: Role, unitId: string) => {
    switch (role) {
      case 'director':
        return 'Direktur Kesiswaan';
      case 'lpm_manager':
        return 'Manajer Mutu LPM';
      case 'unit_manager':
        return `Manajer Unit ${unitId}`;
      case 'auditor':
        return `Auditor (${unitId})`;
      case 'admin':
        return 'Admin Sistem IT';
      default:
        return role;
    }
  };

  const handleItemClick = (id: TabKey) => {
    onSelectTab(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Aside */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 lg:w-64 bg-emerald-950 text-white flex flex-col border-r border-emerald-800 shrink-0 select-none transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 sm:p-6 pb-4">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md shrink-0">
                <div className="w-6 h-6 bg-emerald-800 rounded-md flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-xs"></div>
                </div>
              </div>
              <div className="leading-tight">
                <h1 className="font-black text-lg tracking-tight text-white flex items-center gap-1.5">
                  <span>SIAS</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-300 border border-emerald-700">v2.4</span>
                </h1>
                <p className="text-emerald-300 text-[11px] uppercase tracking-wider font-bold">
                  Kesiswaan SIT
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-2 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/80 transition cursor-pointer"
              aria-label="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation List */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs border border-emerald-700/50'
                      : 'text-emerald-100/80 hover:bg-emerald-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-300' : 'text-emerald-400/70'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold whitespace-nowrap border ${item.badgeColor || 'bg-emerald-900 text-emerald-200 border-emerald-700'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Card in Sidebar */}
        <div className="mt-auto p-4 sm:p-5 border-t border-emerald-800/70 bg-emerald-950/80">
          <div className="relative group">
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-emerald-900/80 transition cursor-pointer border border-transparent hover:border-emerald-800">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-emerald-700 border border-emerald-500 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-inner">
                  {currentUser.avatar || 'MM'}
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-emerald-300 font-mono truncate">
                    {getRoleLabel(currentUser.role, currentUser.unit_id)}
                  </p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-emerald-300 shrink-0" />
            </div>

            {/* User Role Switcher Dropdown */}
            <div className="absolute bottom-full left-0 mb-2 w-72 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-2 hidden group-hover:block z-50 animate-in fade-in slide-in-from-bottom-2">
              <div className="px-3.5 py-1.5 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Simulasi 5 Role & Unit:
                </span>
                <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono font-bold">RBAC</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                {users.map((u) => {
                  const isSelected = currentUser.id === u.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => onUserChange(u)}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition hover:bg-emerald-50 cursor-pointer ${
                        isSelected ? 'bg-emerald-50/80 font-bold text-emerald-950' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <div className={`w-6 h-6 rounded-full text-white text-[10px] flex items-center justify-center font-bold shrink-0 ${
                          u.role === 'director' ? 'bg-indigo-700' :
                          u.role === 'lpm_manager' ? 'bg-emerald-800' :
                          u.role === 'unit_manager' ? 'bg-teal-700' :
                          u.role === 'admin' ? 'bg-slate-800' : 'bg-slate-600'
                        }`}>
                          {u.avatar}
                        </div>
                        <div className="truncate min-w-0">
                          <div className="text-slate-800 text-xs truncate font-semibold">{u.name}</div>
                          <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                            <span className="capitalize">{getRoleLabel(u.role, u.unit_id)}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-emerald-700 font-mono font-medium">{u.unit_id}</span>
                          </div>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

