import React, { useState } from 'react';
import { AuditSession, UnitId, CategoryWeightConfig, User } from '../types';
import { INSTRUMENT_ITEMS, getPredicateInfo } from '../data/instruments';
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Award, 
  Filter, 
  PlusCircle, 
  FileText, 
  Building2, 
  Eye, 
  Download,
  Calendar,
  Users,
  ShieldCheck,
  ChevronRight,
  Lock,
  Globe2,
  Sparkles
} from 'lucide-react';

interface DashboardViewProps {
  sessions: AuditSession[];
  weights: CategoryWeightConfig;
  currentUser: User;
  onNewAudit: () => void;
  onOpenAuditDetail: (session: AuditSession) => void;
  onNavigateToApproval: () => void;
  selectedUnitFilter: string;
  onSelectUnitFilter: (unit: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  sessions,
  weights,
  currentUser,
  onNewAudit,
  onOpenAuditDetail,
  onNavigateToApproval,
  selectedUnitFilter,
  onSelectUnitFilter,
}) => {
  // Check access permissions
  const isUnitManager = currentUser.role === 'unit_manager';
  const canViewAllUnits = 
    currentUser.role === 'director' || 
    currentUser.role === 'lpm_manager' || 
    currentUser.role === 'admin';

  // For Unit Manager, strictly force filter to their own unit_id
  const effectiveUnit = isUnitManager ? currentUser.unit_id : selectedUnitFilter;

  const filteredSessions = effectiveUnit === 'ALL'
    ? sessions
    : sessions.filter((s) => s.unit_id === effectiveUnit);

  const totalAudits = filteredSessions.length;
  const approvedAudits = filteredSessions.filter((s) => s.status === 'approved').length;
  const pendingAudits = filteredSessions.filter((s) => s.status === 'waiting_approval').length;
  const draftAudits = filteredSessions.filter((s) => s.status === 'draft').length;

  const avgScore = totalAudits > 0
    ? filteredSessions.reduce((acc, curr) => acc + (curr.final_percentage || 0), 0) / totalAudits
    : 0;

  const predicateInfo = getPredicateInfo(avgScore);

  // Category average scores
  const avgPersiapan = totalAudits > 0
    ? filteredSessions.reduce((acc, curr) => acc + (curr.persiapanPercentage || 0), 0) / totalAudits
    : 0;
  const avgPelaksanaan = totalAudits > 0
    ? filteredSessions.reduce((acc, curr) => acc + (curr.pelaksanaanPercentage || 0), 0) / totalAudits
    : 0;
  const avgPasca = totalAudits > 0
    ? filteredSessions.reduce((acc, curr) => acc + (curr.pascaPercentage || 0), 0) / totalAudits
    : 0;

  const units: { id: string; label: string; full: string }[] = [
    { id: 'ALL', label: 'Semua Unit SIT', full: 'Seluruh Unit SIT (SD, SMP, SMA, IBS)' },
    { id: 'SD', label: 'SDIT', full: 'Unit SDIT' },
    { id: 'SMP', label: 'SMPIT', full: 'Unit SMPIT' },
    { id: 'SMA', label: 'SMAIT', full: 'Unit SMAIT' },
    { id: 'IBS', label: 'IBS (Boarding)', full: 'Unit Islamic Boarding School (IBS)' },
  ];

  // Pending items for review
  const pendingItemsToReview = (isUnitManager 
    ? sessions.filter((s) => s.unit_id === currentUser.unit_id && s.status === 'waiting_approval')
    : sessions.filter((s) => s.status === 'waiting_approval')
  ).slice(0, 3);

  const getUnitDisplayName = (unitId: string) => {
    if (unitId === 'ALL') return 'Seluruh Yayasan SIT';
    if (unitId === 'SD') return 'Unit SDIT';
    if (unitId === 'SMP') return 'Unit SMPIT';
    if (unitId === 'SMA') return 'Unit SMAIT';
    if (unitId === 'IBS') return 'Unit IBS (Boarding)';
    return `Unit ${unitId}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* RBAC Scope Notification Banner */}
      {isUnitManager ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                  Dashboard Khusus Manajer {getUnitDisplayName(currentUser.unit_id)}
                </h4>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-200/70 text-emerald-900 text-[10px] font-bold">
                  <Lock className="w-3 h-3" />
                  Akses Terisolasi
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-0.5">
                Sesuai hak akses Anda sebagai <b>Manajer Unit {currentUser.unit_id}</b> ({currentUser.name}), sistem hanya menampilkan data dan metrik evaluasi kegiatan kesiswaan untuk unit Anda.
              </p>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <span className="text-[11px] font-mono text-emerald-700 font-bold bg-white px-2.5 py-1 rounded-md border border-emerald-200">
              Unit: {currentUser.unit_id}
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 font-black shadow-xs">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                  {currentUser.role === 'director' ? 'Executive Dashboard Direktur Kesiswaan' : 
                   currentUser.role === 'lpm_manager' ? 'Master Dashboard Manajer Penjaminan Mutu (LPM)' : 
                   'Master Dashboard Admin Sistem'}
                </h4>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  <Sparkles className="w-3 h-3" />
                  Akses Menyeluruh 4 Unit
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Anda memiliki wewenang untuk memantau, memfilter, dan menganalisis rekapitulasi audit mutu kesiswaan lintas seluruh unit SIT (SD, SMP, SMA, IBS).
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[11px] font-mono text-emerald-400 font-bold bg-slate-800 px-3 py-1 rounded-md border border-slate-700">
              Scope: Multi-Unit
            </span>
          </div>
        </div>
      )}

      {/* Top Bento Grid Section (Geometric Balance Pattern) */}
      <div className="grid grid-cols-12 gap-6">
        {/* 8-column Hero Metric & Geometric Progress Bars */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Skor Rata-Rata Mutu Kesiswaan • {getUnitDisplayName(effectiveUnit)}
              </p>
              <div className="flex items-baseline gap-3 mt-1">
                <h3 className="text-4xl font-black text-slate-800">{avgScore.toFixed(2)}%</h3>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${predicateInfo.bg} ${predicateInfo.color}`}>
                  {predicateInfo.predicate} ({predicateInfo.grade})
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Berdasarkan 27 item instrumen supervisi dengan evaluasi kolaboratif 2 auditor dan verifikasi LPM.
              </p>
            </div>

            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-xs font-semibold text-slate-400">Total Terverifikasi</span>
              <span className="text-lg font-bold text-emerald-700">{approvedAudits} / {totalAudits} Kegiatan</span>
            </div>
          </div>

          {/* Geometric Stepped Bars Visualizer */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase mb-2">
              <span>Distribusi Mutu Kegiatan ({getUnitDisplayName(effectiveUnit)})</span>
              <span className="text-emerald-700 font-mono">Standar SIT: ≥ 80.0%</span>
            </div>
            <div className="flex gap-2 items-end h-24">
              <div className="flex-1 bg-emerald-50 border-t-2 border-emerald-500 h-[76%] relative rounded-t-sm group">
                <div className="absolute bottom-full left-0 mb-1 text-[9px] font-mono text-slate-400 group-hover:text-emerald-700">76%</div>
                <div className="absolute top-full left-0 mt-1 text-[9px] font-mono text-slate-500 font-bold">JUL</div>
              </div>
              <div className="flex-1 bg-emerald-100 border-t-2 border-emerald-500 h-[80%] relative rounded-t-sm group">
                <div className="absolute bottom-full left-0 mb-1 text-[9px] font-mono text-slate-400 group-hover:text-emerald-700">80%</div>
                <div className="absolute top-full left-0 mt-1 text-[9px] font-mono text-slate-500 font-bold">AGU</div>
              </div>
              <div className="flex-1 bg-emerald-200 border-t-2 border-emerald-500 h-[92%] relative rounded-t-sm group">
                <div className="absolute bottom-full left-0 mb-1 text-[9px] font-mono text-slate-400 group-hover:text-emerald-700">92%</div>
                <div className="absolute top-full left-0 mt-1 text-[9px] font-mono text-slate-500 font-bold">SEP</div>
              </div>
              <div className="flex-1 bg-emerald-400 border-t-2 border-emerald-500 h-[78%] relative rounded-t-sm group">
                <div className="absolute bottom-full left-0 mb-1 text-[9px] font-mono text-slate-400 group-hover:text-emerald-700">78%</div>
                <div className="absolute top-full left-0 mt-1 text-[9px] font-mono text-slate-500 font-bold">OKT</div>
              </div>
              <div className="flex-1 bg-emerald-600 border-t-2 border-emerald-500 h-[88%] relative rounded-t-sm group">
                <div className="absolute bottom-full left-0 mb-1 text-[9px] font-mono text-slate-400 group-hover:text-emerald-700">88%</div>
                <div className="absolute top-full left-0 mt-1 text-[9px] font-mono text-slate-500 font-bold">NOV</div>
              </div>
              <div className="flex-1 bg-emerald-800 border-t-2 border-emerald-500 h-[96%] relative rounded-t-sm group">
                <div className="absolute bottom-full left-0 mb-1 text-[9px] font-mono text-slate-400 group-hover:text-emerald-700">96%</div>
                <div className="absolute top-full left-0 mt-1 text-[9px] font-mono text-slate-500 font-bold">DES</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-column Dark Highlight Card (Approval Pending LPM / Status Unit) */}
        <div className="col-span-12 lg:col-span-4 bg-slate-800 rounded-xl shadow-md p-6 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {isUnitManager ? `Status Pengajuan Unit ${currentUser.unit_id}` : 'Approval Pending (LPM)'}
              </h4>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            {pendingItemsToReview.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs bg-slate-700/30 rounded-lg border border-slate-700">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="font-bold text-slate-200">Semua Audit Telah Diverifikasi</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isUnitManager 
                    ? `Tidak ada audit Unit ${currentUser.unit_id} yang menunggu verifikasi.`
                    : 'Tidak ada antrean approval baru saat ini.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingItemsToReview.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-slate-500 transition"
                  >
                    <div className="text-xs min-w-0 pr-2">
                      <p className="font-bold text-white truncate">{item.unit_id} • {item.activity_name}</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">Skor: {item.final_percentage?.toFixed(1)}% • {item.audit_date}</p>
                    </div>
                    {canViewAllUnits ? (
                      <button
                        onClick={onNavigateToApproval}
                        className="text-[10px] bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1.5 rounded font-bold uppercase tracking-wider shrink-0 cursor-pointer shadow-xs transition"
                      >
                        Review
                      </button>
                    ) : (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-1 rounded font-bold uppercase tracking-wider shrink-0">
                        Proses LPM
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">
              {isUnitManager ? `Total Unit ${currentUser.unit_id}: ` : 'Total: '} 
              <b className="text-slate-200">{pendingAudits} Menunggu Tindakan</b>
            </span>
            {canViewAllUnits && (
              <button
                onClick={onNavigateToApproval}
                className="text-emerald-400 hover:text-emerald-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <span>Buka Panel Approval</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Unit Filter Bar (Controlled by RBAC) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span>{isUnitManager ? 'Penugasan Unit Kerja:' : 'Filter Unit Sekolah:'}</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {isUnitManager ? (
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 text-white shadow-xs flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Unit Terkunci: {getUnitDisplayName(currentUser.unit_id)}</span>
              </span>
              <span className="text-[11px] text-slate-400 hidden md:inline">
                (Akses dibatasi sesuai wewenang manajer unit)
              </span>
            </div>
          ) : (
            units.map((u) => {
              const isSelected = effectiveUnit === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => onSelectUnitFilter(u.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {u.label}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 3 Category Breakdown Cards (Geometric Balance) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Category A */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-md bg-emerald-900 text-white text-xs font-black flex items-center justify-center">A</span>
              <span className="text-xs font-bold text-slate-900">Persiapan Pelaksanaan</span>
            </div>
            <span className="text-xs font-black text-emerald-800 font-mono">{avgPersiapan.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-emerald-700 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(avgPersiapan, 100)}%` }} 
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
            <b>11 Indikator</b>: Proposal kegiatan, timeline, pembagian tupoksi panitia, dan mitigasi risiko.
          </p>
        </div>

        {/* Category B */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-md bg-emerald-700 text-white text-xs font-black flex items-center justify-center">B</span>
              <span className="text-xs font-bold text-slate-900">Pelaksanaan Kegiatan</span>
            </div>
            <span className="text-xs font-black text-emerald-700 font-mono">{avgPelaksanaan.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(avgPelaksanaan, 100)}%` }} 
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
            <b>10 Indikator</b>: Ketepatan jadwal, adab & SOP islami di lapangan, komunikasi, dan dokumentasi.
          </p>
        </div>

        {/* Category C */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-md bg-emerald-500 text-slate-900 text-xs font-black flex items-center justify-center">C</span>
              <span className="text-xs font-bold text-slate-900">Pasca Pelaksanaan</span>
            </div>
            <span className="text-xs font-black text-emerald-900 font-mono">{avgPasca.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(avgPasca, 100)}%` }} 
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
            <b>6 Indikator</b>: Rapat evaluasi tertulis, pencapaian target, penyerahan LPJ keuangan & RTL mutu.
          </p>
        </div>
      </div>

      {/* Main Audit List: Responsive Table for Desktop & Card List for Mobile */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Rekapitulasi Audit Supervisi Kesiswaan {getUnitDisplayName(effectiveUnit)}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Menampilkan {filteredSessions.length} sesi audit untuk {effectiveUnit === 'ALL' ? 'seluruh unit SIT' : `Unit ${effectiveUnit}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNewAudit}
              className="w-full sm:w-auto justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tambah Audit Baru</span>
            </button>
          </div>
        </div>

        {/* Mobile View: Cards Layout (Visible on screens < md) */}
        <div className="block md:hidden divide-y divide-slate-100">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-10 px-4 text-slate-400">
              <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-600 text-xs">Belum ada data audit untuk {getUnitDisplayName(effectiveUnit)}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Silakan tambahkan data supervisi baru melalui tombol di atas.</p>
            </div>
          ) : (
            filteredSessions.map((session) => {
              const pred = getPredicateInfo(session.final_percentage || 0);
              return (
                <div key={session.id} className="p-4 space-y-3 hover:bg-slate-50/80 transition">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-900 text-white font-mono">
                          {session.unit_id}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {session.id}
                        </span>
                      </div>
                      <h5 className="font-bold text-slate-900 text-xs leading-snug line-clamp-2">
                        {session.activity_name}
                      </h5>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-black text-slate-900 font-mono block leading-none">
                        {(session.final_percentage || 0).toFixed(1)}%
                      </span>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[9px] font-bold border uppercase tracking-wider ${pred.bg} ${pred.color}`}>
                        {session.final_predicate || pred.predicate} ({pred.grade})
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
                    <div className="flex items-center gap-1 text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{session.audit_date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {session.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Approved
                        </span>
                      )}
                      {session.status === 'waiting_approval' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Waiting
                        </span>
                      )}
                      {session.status === 'draft' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          Draft
                        </span>
                      )}
                      {session.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          Revisi
                        </span>
                      )}

                      <button
                        onClick={() => onOpenAuditDetail(session)}
                        className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-emerald-800 hover:text-white text-slate-700 text-xs font-bold transition flex items-center gap-1 border border-slate-200"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop & Tablet View: Full Table (Visible on md:) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase text-slate-500 font-bold border-b border-slate-200 tracking-wider">
                <th className="px-6 py-3">ID & Tanggal</th>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3">Nama Kegiatan</th>
                <th className="px-4 py-3">Auditor (Komite Mutu)</th>
                <th className="px-4 py-3 text-center">Capaian Mutu</th>
                <th className="px-4 py-3 text-center">Predikat</th>
                <th className="px-4 py-3 text-center">Status LPM</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-600">Belum ada data audit untuk {getUnitDisplayName(effectiveUnit)}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Silakan tambahkan data supervisi baru melalui menu Input Audit.</p>
                  </td>
                </tr>
              ) : (
                filteredSessions.map((session) => {
                  const pred = getPredicateInfo(session.final_percentage || 0);
                  return (
                    <tr key={session.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900 font-mono">{session.id}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{session.audit_date}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {session.unit_id}
                        </span>
                      </td>
                      <td className="px-4 py-4 max-w-xs">
                        <div className="font-bold text-slate-900 line-clamp-2">
                          {session.activity_name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {session.attachments?.length || 0} berkas dokumen dilampirkan
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-[11px] text-slate-700">1. {session.auditor1_name}</div>
                        <div className="text-[11px] text-slate-500">2. {session.auditor2_name}</div>
                      </td>
                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <span className="font-black text-sm text-slate-800 font-mono">
                          {(session.final_percentage || 0).toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${pred.bg} ${pred.color}`}>
                          {session.final_predicate || pred.predicate} ({pred.grade})
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        {session.status === 'approved' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Approved
                          </span>
                        )}
                        {session.status === 'waiting_approval' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Waiting Approval
                          </span>
                        )}
                        {session.status === 'draft' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            Draft
                          </span>
                        )}
                        {session.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                            Minta Revisi
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onOpenAuditDetail(session)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-800 hover:text-white text-slate-700 text-xs font-bold transition cursor-pointer border border-slate-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

