import React, { useState } from 'react';
import { AuditSession } from '../types';
import { INSTRUMENT_ITEMS, SCORE_CRITERIA, getPredicateInfo } from '../data/instruments';
import { 
  X, 
  Calendar, 
  Building2, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Paperclip, 
  FileText, 
  Printer, 
  Download,
  Award
} from 'lucide-react';

interface AuditDetailModalProps {
  session: AuditSession | null;
  onClose: () => void;
}

export const AuditDetailModal: React.FC<AuditDetailModalProps> = ({
  session,
  onClose,
}) => {
  if (!session) return null;

  const [activeTab, setActiveTab] = useState<'persiapan' | 'pelaksanaan' | 'pasca'>('persiapan');
  const pred = getPredicateInfo(session.final_percentage || 0);

  const persiapanItems = INSTRUMENT_ITEMS.filter((i) => i.category === 'persiapan');
  const pelaksanaanItems = INSTRUMENT_ITEMS.filter((i) => i.category === 'pelaksanaan');
  const pascaItems = INSTRUMENT_ITEMS.filter((i) => i.category === 'pasca');

  const currentItems = activeTab === 'persiapan' 
    ? persiapanItems 
    : activeTab === 'pelaksanaan' 
    ? pelaksanaanItems 
    : pascaItems;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-emerald-900 text-white p-5 sm:p-6 shrink-0 border-b border-emerald-800">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-200 mb-1">
                <span className="px-2 py-0.5 rounded-md bg-emerald-800 border border-emerald-700 font-mono text-[11px]">{session.unit_id}</span>
                <span className="font-mono text-[11px]">ID: {session.id}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-300" />
                  {session.audit_date}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                {session.activity_name}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-emerald-100/90 mt-2">
                <span>Auditor 1: <b className="text-white">{session.auditor1_name}</b></span>
                <span>Auditor 2: <b className="text-white">{session.auditor2_name}</b></span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-white transition cursor-pointer border border-emerald-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-emerald-800 text-xs">
            <div>
              <span className="text-emerald-300 block text-[10px] uppercase font-bold tracking-wider">Nilai Akhir Mutu</span>
              <div className="text-2xl font-black text-white font-mono">{(session.final_percentage || 0).toFixed(1)}%</div>
            </div>
            <div>
              <span className="text-emerald-300 block text-[10px] uppercase font-bold tracking-wider">Predikat Mutu</span>
              <div className="text-sm font-bold text-emerald-100">{session.final_predicate || pred.predicate} (Grade {pred.grade})</div>
            </div>
            <div>
              <span className="text-emerald-300 block text-[10px] uppercase font-bold tracking-wider">Status Approval</span>
              <div className="text-xs font-bold capitalize mt-0.5 text-emerald-100">{session.status.replace('_', ' ')}</div>
            </div>
            <div>
              <span className="text-emerald-300 block text-[10px] uppercase font-bold tracking-wider">Total Berkas</span>
              <div className="text-xs font-bold text-white mt-0.5 font-mono">{session.attachments?.length || 0} Terlampir</div>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-slate-50 px-5 py-2.5 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex space-x-1.5">
            {[
              { key: 'persiapan' as const, label: 'A. Persiapan', score: session.persiapanPercentage },
              { key: 'pelaksanaan' as const, label: 'B. Pelaksanaan', score: session.pelaksanaanPercentage },
              { key: 'pasca' as const, label: 'C. Pasca Pelaksanaan', score: session.pascaPercentage },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === t.key
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>{t.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${activeTab === t.key ? 'bg-emerald-900 text-emerald-100' : 'bg-slate-100 text-slate-600'}`}>
                  {(t.score || 0).toFixed(0)}%
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Cetak</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Items breakdown list */}
          <div className="divide-y divide-slate-100">
            {currentItems.map((item) => {
              const itemScore = session.scores?.[item.id] || { auditor1Score: 0, auditor2Score: 0 };
              const avg = (Number(itemScore.auditor1Score || 0) + Number(itemScore.auditor2Score || 0)) / 2;
              const criteria = SCORE_CRITERIA[Math.round(avg)] || SCORE_CRITERIA[0];

              return (
                <div key={item.id} className="py-3.5 first:pt-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-2.5">
                      <span className="w-5 h-5 rounded-md bg-slate-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200 font-mono">
                        {item.number}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {item.question_text}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 mt-1">
                          <span>Auditor 1: <b className="text-slate-800 font-mono">{itemScore.auditor1Score} / 4</b></span>
                          <span>Auditor 2: <b className="text-slate-800 font-mono">{itemScore.auditor2Score} / 4</b></span>
                          {(itemScore.auditor1Notes || itemScore.auditor2Notes) && (
                            <span className="text-slate-600 italic">
                              Catatan: {itemScore.auditor1Notes || itemScore.auditor2Notes}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="text-sm font-black text-emerald-800 font-mono">{avg.toFixed(1)}</div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border uppercase ${criteria.badgeBg}`}>
                        {criteria.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RTL & Approval Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-emerald-800 mb-1">Rencana Tindak Lanjut (RTL):</h4>
              <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                {session.followUpPlan || 'Belum ada catatan RTL.'}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-emerald-800 mb-1">Informasi Approval LPM:</h4>
              <div className="text-xs text-slate-700 space-y-1 mt-1">
                <div>Status: <b className="capitalize">{session.status.replace('_', ' ')}</b></div>
                {session.approved_by && <div>Disetujui Oleh: <b>{session.approved_by}</b></div>}
                {session.approved_at && <div>Waktu: <b>{session.approved_at}</b></div>}
                {session.approval_notes && <div className="text-emerald-800 italic font-medium">"{session.approval_notes}"</div>}
                {session.rejection_reason && <div className="text-rose-800 italic font-medium">"{session.rejection_reason}"</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
          >
            Tutup Rincian
          </button>
        </div>
      </div>
    </div>
  );
};
