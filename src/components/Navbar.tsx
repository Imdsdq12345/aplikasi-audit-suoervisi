import React from 'react';
import { User, Role, UnitId } from '../types';
import { Bell, Plus, ShieldCheck, CheckCircle2, Award, Clock, Menu } from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onUserChange: (user: User) => void;
  users: User[];
  pendingCount: number;
  onNewAudit?: () => void;
  onOpenMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onUserChange,
  users,
  pendingCount,
  onNewAudit,
  onOpenMobileMenu,
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 z-30">
      {/* Left: Mobile Menu Toggle & System Status */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Mobile Hamburger Toggle Button */}
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
            aria-label="Buka Menu Navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <div className="leading-none">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Status: <span className="text-emerald-700 font-bold">Aktif 2026/2027</span>
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-2 border-l border-slate-200 pl-3">
          <span className="text-[11px] font-semibold text-slate-400">
            Penjaminan Mutu Terpadu: <b className="text-slate-700">SD, SMP, SMA, IBS</b>
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {pendingCount > 0 && (
          <div className="hidden md:flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{pendingCount} Verifikasi Pending</span>
          </div>
        )}

        {onNewAudit && (
          <button
            onClick={onNewAudit}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Audit Baru</span>
            <span className="xs:hidden">Tambah</span>
          </button>
        )}

        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer relative shrink-0">
          <Bell className="w-4 h-4" />
          {pendingCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
          )}
        </div>
      </div>
    </header>
  );
};

