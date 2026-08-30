import React, { useState } from 'react';
import { AuditSession, User } from '../types';
import { getPredicateInfo, INSTRUMENT_ITEMS } from '../data/instruments';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Calendar, 
  Paperclip, 
  AlertCircle, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Award,
  Send,
  Eye
} from 'lucide-react';

interface ApprovalPanelProps {
  sessions: AuditSession[];
  currentUser: User;
  onApproveSession: (sessionId: string, notes: string) => void;
  onRejectSession: (sessionId: string, reason: string) => void;
  onOpenAuditDetail: (session: AuditSession) => void;
}

export const ApprovalPanel: React.FC<ApprovalPanelProps> = ({
  sessions,
  currentUser,
  onApproveSession,
  onRejectSession,
  onOpenAuditDetail,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [approvalNotes, setApprovalNotes] = useState<Record<string, string>>({});
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [rejectReasonText, setRejectReasonText] = useState('');

  const canApprove = currentUser.role === 'lpm_manager' || currentUser.role === 'director' || currentUser.role === 'admin';

  // For Unit Manager, filter to their unit; otherwise show all
  const relevantSessions = currentUser.role === 'unit_manager'
    ? sessions.filter((s) => s.unit_id === currentUser.unit_id)
    : sessions;

  const pendingSessions = relevantSessions.filter((s) => s.status === 'waiting_approval');
  const historySessions = relevantSessions.filter((s) => s.status === 'approved' || s.status === 'rejected');

  const handleApprove = (sessionId: string) => {
    const notes = approvalNotes[sessionId] || 'Hasil audit telah diverifikasi dan disetujui sesuai standar mutu LPM SIT.';
    onApproveSession(sessionId, notes);
  };

  const handleOpenReject = (sessionId: string) => {
    setShowRejectModal(sessionId);
    setRejectReasonText('Mohon lengkapi berkas LPJ keuangan dan perjelas mitigasi risiko di lapangan.');
  };

  const handleConfirmReject = () => {
    if (showRejectModal && rejectReasonText.trim()) {
      onRejectSession(showRejectModal, rejectReasonText.trim());
      setShowRejectModal(null);
      setRejectReasonText('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Panel Khusus Lembaga Penjaminan Mutu (LPM)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Verifikasi & Pengesahan Audit Supervisi
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Data yang di-submit oleh 2 auditor harus diverifikasi oleh Manajer Mutu Pusat sebelum sah masuk ke rekapitulasi nilai akhir.
            </p>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Menunggu Approval ({pendingSessions.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Riwayat Keputusan ({historySessions.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'pending' ? (
        <div className="space-y-4">
          {pendingSessions.length === 0 ? (
            <div className="bg-white rounded-xl p-12 border border-slate-200 text-center shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3 border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-slate-800">Semua Audit Telah Diverifikasi</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Tidak ada pengajuan audit kesiswaan yang sedang menunggu persetujuan Manajer Mutu LPM.
              </p>
            </div>
          ) : (
            pendingSessions.map((session) => {
              const isExpanded = selectedSessionId === session.id;
              const pred = getPredicateInfo(session.final_percentage || 0);

              return (
                <div 
                  key={session.id} 
                  className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition"
                >
                  {/* Card Top Summary */}
                  <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start space-x-3">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 shrink-0">
                        {session.unit_id}
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-slate-400">{session.id}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {session.audit_date}
                          </span>
                        </div>
                        <h2 className="text-base font-bold text-slate-900 mt-0.5">
                          {session.activity_name}
                        </h2>
                        <div className="text-xs text-slate-600 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                          <span>Auditor 1: <b className="text-slate-800">{session.auditor1_name}</b></span>
                          <span>Auditor 2: <b className="text-slate-800">{session.auditor2_name}</b></span>
                        </div>
                      </div>
                    </div>

                    {/* Score summary & expand toggle */}
                    <div className="flex items-center space-x-4 shrink-0 justify-between md:justify-end">
                      <div className="text-right">
                        <div className="text-2xl font-black text-slate-800 font-mono">
                          {(session.final_percentage || 0).toFixed(1)}%
                        </div>
                        <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${pred.bg} ${pred.color}`}>
                          {pred.predicate} ({pred.grade})
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedSessionId(isExpanded ? null : session.id)}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer border border-slate-200"
                        title={isExpanded ? 'Tutup Rincian' : 'Buka Rincian'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Verification Details */}
                  {isExpanded && (
                    <div className="p-5 bg-slate-50/70 space-y-5 animate-in fade-in duration-200 border-t border-slate-100">
                      {/* Breakdown 3 Kategori */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                          <span className="text-[11px] font-medium text-slate-500 block">Persiapan (11 Item)</span>
                          <span className="text-base font-black text-slate-900 font-mono">{(session.persiapanPercentage || 0).toFixed(1)}%</span>
                        </div>
                        <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                          <span className="text-[11px] font-medium text-slate-500 block">Pelaksanaan (10 Item)</span>
                          <span className="text-base font-black text-slate-900 font-mono">{(session.pelaksanaanPercentage || 0).toFixed(1)}%</span>
                        </div>
                        <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                          <span className="text-[11px] font-medium text-slate-500 block">Pasca Pelaksanaan (6 Item)</span>
                          <span className="text-base font-black text-slate-900 font-mono">{(session.pascaPercentage || 0).toFixed(1)}%</span>
                        </div>
                      </div>

                      {/* RTL & Attachments Check */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <h3 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            Rencana Tindak Lanjut (RTL) yang Diajukan:
                          </h3>
                          <p className="text-xs text-slate-700 whitespace-pre-line bg-slate-50 p-2.5 rounded-md border border-slate-200">
                            {session.followUpPlan || 'Tidak ada catatan tindak lanjut.'}
                          </p>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <h3 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                            <Paperclip className="w-4 h-4 text-emerald-700" />
                            Dokumen Pendukung Terlampir ({session.attachments?.length || 0}):
                          </h3>
                          <div className="space-y-1.5 mt-2">
                            {session.attachments && session.attachments.length > 0 ? (
                              session.attachments.map((att) => (
                                <div key={att.id} className="flex items-center justify-between p-2 rounded-md bg-slate-50 text-xs border border-slate-200">
                                  <div className="flex items-center space-x-2 truncate">
                                    <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                    <span className="font-semibold text-slate-800 truncate">{att.fileName}</span>
                                  </div>
                                  <span className="text-[10px] text-slate-500 uppercase font-medium">{att.category}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-amber-700 italic">⚠️ Belum ada dokumen pendukung yang diunggah.</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Decision Panel */}
                      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                        <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                          Catatan / Rekomendasi Manajer Mutu LPM:
                        </label>
                        <input
                          type="text"
                          value={approvalNotes[session.id] || ''}
                          onChange={(e) => setApprovalNotes({ ...approvalNotes, [session.id]: e.target.value })}
                          placeholder="Tuliskan catatan verifikasi resmi LPM..."
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 mb-3"
                        />

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => onOpenAuditDetail(session)}
                            className="text-xs text-emerald-700 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Lihat Skor Lengkap 27 Item</span>
                          </button>

                          {canApprove ? (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenReject(session.id)}
                                className="px-4 py-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                              >
                                <XCircle className="w-4 h-4" />
                                <span>Minta Revisi (Tolak)</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleApprove(session.id)}
                                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                              >
                                <CheckCircle2 className="w-4 h-4 text-white" />
                                <span>Setujui (Approve) Audit</span>
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                              <ShieldCheck className="w-4 h-4 text-amber-600" />
                              <span>Hanya Manajer LPM / Direktur / Admin yang memiliki hak verifikasi approval.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* History Decisions Tab */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Riwayat Pengesahan Audit LPM</h2>
            <p className="text-xs text-slate-500">Daftar audit yang telah disetujui (Approved) atau dikembalikan untuk revisi.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">ID & Tanggal</th>
                  <th className="px-4 py-3">Unit</th>
                  <th className="px-4 py-3">Nama Kegiatan</th>
                  <th className="px-4 py-3 text-center">Skor Akhir</th>
                  <th className="px-4 py-3 text-center">Predikat</th>
                  <th className="px-4 py-3">Status & Pengesah</th>
                  <th className="px-4 py-3">Catatan Approval</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {historySessions.map((s) => {
                  const pred = getPredicateInfo(s.final_percentage || 0);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{s.id}</div>
                        <div className="text-[11px] text-slate-400">{s.audit_date}</div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold text-[11px] border border-slate-200">
                          {s.unit_id}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 max-w-xs font-semibold text-slate-900">
                        {s.activity_name}
                      </td>
                      <td className="px-4 py-3.5 text-center font-black font-mono text-slate-800">
                        {(s.final_percentage || 0).toFixed(1)}%
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${pred.bg} ${pred.color}`}>
                          {s.final_predicate || pred.predicate}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {s.status === 'approved' ? (
                          <div>
                            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Approved
                            </span>
                            <div className="text-[10px] text-slate-400 mt-0.5">{s.approved_by || 'Manajer LPM'}</div>
                          </div>
                        ) : (
                          <span className="text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Minta Revisi
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-600 max-w-xs truncate">
                        {s.approval_notes || s.rejection_reason || '-'}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => onOpenAuditDetail(s)}
                          className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-emerald-800 hover:text-white text-slate-700 text-xs font-semibold transition cursor-pointer border border-slate-200"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center space-x-2 text-rose-700 font-bold mb-2">
              <AlertCircle className="w-5 h-5" />
              <span>Kembalikan Audit untuk Revisi</span>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Berikan alasan dan catatan instruksi perbaikan yang harus dipenuhi oleh auditor sebelum dapat diajukan kembali.
            </p>
            <textarea
              rows={4}
              value={rejectReasonText}
              onChange={(e) => setRejectReasonText(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              placeholder="Tuliskan alasan permintaan revisi..."
            />
            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowRejectModal(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition cursor-pointer shadow-xs"
              >
                Kirim Permintaan Revisi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
