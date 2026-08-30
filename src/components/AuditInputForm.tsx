import React, { useState, useMemo } from 'react';
import { 
  InstrumentItem, 
  AuditSession, 
  UnitId, 
  CategoryWeightConfig, 
  AuditAttachment,
  CategoryKey 
} from '../types';
import { INSTRUMENT_ITEMS, SCORE_CRITERIA, calculateAuditScores, getPredicateInfo } from '../data/instruments';
import { 
  Users, 
  Save, 
  Send, 
  Paperclip, 
  Info, 
  Check, 
  Plus, 
  Trash2, 
  FileText, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  Calculator,
  ChevronRight
} from 'lucide-react';

interface AuditInputFormProps {
  weights: CategoryWeightConfig;
  onSaveSession: (session: AuditSession) => void;
  onCancel: () => void;
  existingSession?: AuditSession | null;
}

export const AuditInputForm: React.FC<AuditInputFormProps> = ({
  weights,
  onSaveSession,
  onCancel,
  existingSession,
}) => {
  // Header state
  const [unitId, setUnitId] = useState<UnitId>(existingSession?.unit_id || 'SMA');
  const [activityName, setActivityName] = useState(
    existingSession?.activity_name || 'Latihan Dasar Kepemimpinan Santri (LDKS) 2026'
  );
  const [auditDate, setAuditDate] = useState(
    existingSession?.audit_date || new Date().toISOString().split('T')[0]
  );
  const [auditor1Name, setAuditor1Name] = useState(
    existingSession?.auditor1_name || 'Ust. Ahmad Fauzan, M.Pd.'
  );
  const [auditor2Name, setAuditor2Name] = useState(
    existingSession?.auditor2_name || 'Usth. Siti Nurhaliza, S.Si.'
  );
  const [followUpPlan, setFollowUpPlan] = useState(
    existingSession?.followUpPlan || 
    '1. Memastikan seluruh surat perizinan & proposal selesai H-10 sebelum kegiatan.\n2. Melakukan evaluasi tertulis bersama perwakilan peserta pasca kegiatan.'
  );

  // Active Category Tab: 'persiapan' | 'pelaksanaan' | 'pasca'
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('persiapan');

  // Input Mode: 'dual' (Side-by-Side) | 'auditor1' | 'auditor2'
  const [scoringMode, setScoringMode] = useState<'dual' | 'auditor1' | 'auditor2'>('dual');

  // Item Scores map: { [itemId]: { auditor1Score: number, auditor2Score: number, auditor1Notes: string, auditor2Notes: string } }
  const [scores, setScores] = useState<Record<string, { auditor1Score: number; auditor2Score: number; auditor1Notes?: string; auditor2Notes?: string }>>(() => {
    if (existingSession?.scores) {
      return existingSession.scores;
    }
    const initial: Record<string, { auditor1Score: number; auditor2Score: number; auditor1Notes?: string; auditor2Notes?: string }> = {};
    INSTRUMENT_ITEMS.forEach((item) => {
      initial[item.id] = { auditor1Score: 3, auditor2Score: 3 };
    });
    return initial;
  });

  // Attachments
  const [attachments, setAttachments] = useState<AuditAttachment[]>(() => {
    return existingSession?.attachments || [
      {
        id: 'att-init-1',
        sessionId: '',
        fileName: 'Proposal_Kegiatan_LDKS_2026.pdf',
        fileType: 'application/pdf',
        fileSize: '2.4 MB',
        uploadDate: new Date().toISOString().split('T')[0],
        category: 'proposal'
      }
    ];
  });

  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'proposal' | 'dokumentasi' | 'lpj' | 'lainnya'>('proposal');

  // Real-time calculation
  const calculated = useMemo(() => {
    return calculateAuditScores(INSTRUMENT_ITEMS, scores, weights);
  }, [scores, weights]);

  const handleScoreChange = (itemId: string, auditor: 'auditor1' | 'auditor2', val: number) => {
    setScores((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [auditor === 'auditor1' ? 'auditor1Score' : 'auditor2Score']: val,
      },
    }));
  };

  const handleNoteChange = (itemId: string, auditor: 'auditor1' | 'auditor2', note: string) => {
    setScores((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [auditor === 'auditor1' ? 'auditor1Notes' : 'auditor2Notes']: note,
      },
    }));
  };

  const handleApplyPreset = (scoreVal: number) => {
    const updated: Record<string, { auditor1Score: number; auditor2Score: number }> = {};
    INSTRUMENT_ITEMS.forEach((item) => {
      updated[item.id] = { auditor1Score: scoreVal, auditor2Score: scoreVal };
    });
    setScores((prev) => ({ ...prev, ...updated }));
  };

  const handleAddAttachment = () => {
    if (!newFileName.trim()) return;
    const newAtt: AuditAttachment = {
      id: `att-${Date.now()}`,
      sessionId: existingSession?.id || '',
      fileName: newFileName.trim(),
      fileType: newFileName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
      fileSize: '1.8 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      category: newFileType
    };
    setAttachments((prev) => [...prev, newAtt]);
    setNewFileName('');
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = (status: 'draft' | 'waiting_approval') => {
    if (!activityName.trim()) {
      alert('Mohon masukkan Nama Kegiatan');
      return;
    }

    const session: AuditSession = {
      id: existingSession?.id || `AUD-${new Date().getFullYear()}-00${Math.floor(Math.random() * 900 + 100)}`,
      unit_id: unitId,
      activity_name: activityName,
      audit_date: auditDate,
      auditor1_id: 'u1',
      auditor1_name: auditor1Name,
      auditor2_id: 'u2',
      auditor2_name: auditor2Name,
      status: status,
      scores: scores as any,
      followUpPlan: followUpPlan,
      attachments: attachments,
      persiapanPercentage: calculated.persiapanPercentage,
      pelaksanaanPercentage: calculated.pelaksanaanPercentage,
      pascaPercentage: calculated.pascaPercentage,
      final_percentage: calculated.finalPercentage,
      final_predicate: calculated.predicate,
      submitted_at: status === 'waiting_approval' ? `${auditDate} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB` : undefined,
    };

    onSaveSession(session);
  };

  const currentCategoryItems = INSTRUMENT_ITEMS.filter((i) => i.category === activeCategory);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>Modul Input Audit Bersama (Multi-Auditor Paralel)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Formulir Audit Supervisi Kesiswaan SIT
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Penilaian independen 2 orang Komite Mutu dengan kalkulasi rata-rata skor per item secara otomatis (27 Indikator Instrumen).
            </p>
          </div>

          {/* Real-time Dynamic Score Card */}
          <div className="bg-slate-800 text-white p-4 rounded-xl shadow-md border border-slate-700 flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-widest">Estimasi Nilai Akhir</span>
              <div className="flex items-baseline justify-end gap-2 mt-0.5">
                <span className="text-3xl font-black font-mono text-white">{calculated.finalPercentage.toFixed(1)}%</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${calculated.predicateInfo.bg} ${calculated.predicateInfo.color}`}>
                  {calculated.predicate} ({calculated.grade})
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Skor: {calculated.totalEarned.toFixed(1)} / {calculated.totalMax}</span>
            </div>
            <div className="w-11 h-11 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Section 1: Header Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Unit Sekolah Target</label>
            <select
              value={unitId}
              onChange={(e) => setUnitId(e.target.value as UnitId)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            >
              <option value="SD">SDIT</option>
              <option value="SMP">SMPIT</option>
              <option value="SMA">SMAIT</option>
              <option value="IBS">IBS (Islamic Boarding School)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kegiatan Kesiswaan</label>
            <input
              type="text"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              placeholder="Contoh: Mukhoyyam Al-Qur'an 2026"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Auditor 1 (Komite Mutu 1)</label>
            <input
              type="text"
              value={auditor1Name}
              onChange={(e) => setAuditor1Name(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Auditor 2 (Komite Mutu 2)</label>
            <input
              type="text"
              value={auditor2Name}
              onChange={(e) => setAuditor2Name(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Instrument Categories Tabs & Quick Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Category Selector Tabs with smooth horizontal scroll */}
        <div className="bg-slate-50 p-2 sm:p-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {[
              { key: 'persiapan' as CategoryKey, label: 'A. Persiapan', count: '11 Item', pct: calculated.persiapanPercentage },
              { key: 'pelaksanaan' as CategoryKey, label: 'B. Pelaksanaan', count: '10 Item', pct: calculated.pelaksanaanPercentage },
              { key: 'pasca' as CategoryKey, label: 'C. Pasca', count: '6 Item', pct: calculated.pascaPercentage },
            ].map((tab) => {
              const isActive = activeCategory === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveCategory(tab.key)}
                  className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 shrink-0 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${isActive ? 'bg-emerald-900 text-emerald-200 border border-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {tab.count} • {tab.pct.toFixed(0)}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
              <span className="font-bold text-[11px] uppercase text-slate-400">Preset:</span>
              <button
                type="button"
                onClick={() => handleApplyPreset(4)}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-[11px] font-bold border border-emerald-300 cursor-pointer whitespace-nowrap"
              >
                Semua 4 (Baik Sekali)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(3)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 text-[11px] font-bold border border-slate-300 cursor-pointer whitespace-nowrap"
              >
                Semua 3 (Baik)
              </button>
            </div>
          </div>
        </div>

        {/* Rubric Guide Banner */}
        <div className="bg-emerald-50/80 border-b border-emerald-200/60 px-4 py-2 text-xs text-emerald-950 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="font-bold flex items-center gap-1 text-emerald-900">
            <Info className="w-3.5 h-3.5 text-emerald-700" />
            Rubrik Penilaian Standar SIT:
          </span>
          <span className="text-slate-700"><b>0</b>: Tidak Ada</span>
          <span className="text-slate-700"><b>1</b>: Kurang</span>
          <span className="text-slate-700"><b>2</b>: Cukup</span>
          <span className="text-slate-700"><b>3</b>: Baik</span>
          <span className="text-slate-700"><b>4</b>: Baik Sekali</span>
        </div>

        {/* 27 Item Scoring List */}
        <div className="divide-y divide-slate-100 p-4 sm:p-6 space-y-6">
          {currentCategoryItems.map((item) => {
            const itemScore = scores[item.id] || { auditor1Score: 0, auditor2Score: 0 };
            const avg = (Number(itemScore.auditor1Score || 0) + Number(itemScore.auditor2Score || 0)) / 2;
            const criteria = SCORE_CRITERIA[Math.round(avg)] || SCORE_CRITERIA[0];

            return (
              <div key={item.id} className="pt-5 first:pt-0">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Question & Guideline */}
                  <div className="flex-1">
                    <div className="flex items-start space-x-3">
                      <span className="w-7 h-7 rounded-lg bg-emerald-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                        {item.number}
                      </span>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {item.question_text}
                        </h3>
                        {item.guideline && (
                          <p className="text-[11px] text-slate-500 mt-1 italic">
                            💡 Panduan Evaluasi: {item.guideline}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Calculated Average Result Badge */}
                  <div className="shrink-0 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center space-x-3 text-right">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Rata-Rata Item</div>
                      <div className="text-base font-black text-slate-800 font-mono">{avg.toFixed(1)} <span className="text-xs text-slate-400 font-normal">/ 4.0</span></div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${criteria.badgeBg}`}>
                      {criteria.label}
                    </span>
                  </div>
                </div>

                {/* Multi-Auditor Inputs Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 bg-slate-50/70 p-3 sm:p-4 rounded-xl border border-slate-200">
                  {/* Auditor 1 Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 truncate">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                        <span className="truncate">Auditor 1 ({auditor1Name}):</span>
                      </span>
                      <span className="text-xs font-bold text-slate-800 font-mono shrink-0">Skor: {itemScore.auditor1Score}</span>
                    </div>
                    {/* Score Buttons 0-4 */}
                    <div className="grid grid-cols-5 gap-1.5">
                      {[0, 1, 2, 3, 4].map((val) => {
                        const isSelected = itemScore.auditor1Score === val;
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleScoreChange(item.id, 'auditor1', val)}
                            className={`min-h-[42px] py-2 rounded-xl text-xs sm:text-sm font-bold transition flex flex-col items-center justify-center cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-800 text-white shadow-xs'
                                : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50'
                            }`}
                          >
                            <span>{val}</span>
                          </button>
                        );
                      })}
                    </div>
                    {/* Auditor 1 Optional Note */}
                    <input
                      type="text"
                      placeholder="Catatan Auditor 1 (opsional)..."
                      value={itemScore.auditor1Notes || ''}
                      onChange={(e) => handleNoteChange(item.id, 'auditor1', e.target.value)}
                      className="mt-2 w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  {/* Auditor 2 Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 truncate">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <span className="truncate">Auditor 2 ({auditor2Name}):</span>
                      </span>
                      <span className="text-xs font-bold text-slate-800 font-mono shrink-0">Skor: {itemScore.auditor2Score}</span>
                    </div>
                    {/* Score Buttons 0-4 */}
                    <div className="grid grid-cols-5 gap-1.5">
                      {[0, 1, 2, 3, 4].map((val) => {
                        const isSelected = itemScore.auditor2Score === val;
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleScoreChange(item.id, 'auditor2', val)}
                            className={`min-h-[42px] py-2 rounded-xl text-xs sm:text-sm font-bold transition flex flex-col items-center justify-center cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-700 text-white shadow-xs'
                                : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50'
                            }`}
                          >
                            <span>{val}</span>
                          </button>
                        );
                      })}
                    </div>
                    {/* Auditor 2 Optional Note */}
                    <input
                      type="text"
                      placeholder="Catatan Auditor 2 (opsional)..."
                      value={itemScore.auditor2Notes || ''}
                      onChange={(e) => handleNoteChange(item.id, 'auditor2', e.target.value)}
                      className="mt-2 w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Rencana Tindak Lanjut (RTL) & Dokumen Pendukung */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RTL */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-slate-900">Rencana Tindak Lanjut (RTL) Supervisi</h2>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Rekomendasi perbaikan mutu berkala untuk panitia pelaksana kegiatan kesiswaan.
          </p>
          <textarea
            rows={5}
            value={followUpPlan}
            onChange={(e) => setFollowUpPlan(e.target.value)}
            placeholder="Tuliskan butir rekomendasi tindak lanjut..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>

        {/* Upload Dokumen Pendukung */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Paperclip className="w-4 h-4 text-emerald-700" />
              <h2 className="text-sm font-bold text-slate-900">Dokumen Pendukung (Wajib Dilampirkan)</h2>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Unggah proposal bertandatangan, foto dokumentasi kegiatan, dan lembar evaluasi (PDF/Gambar).
            </p>

            {/* Attached files list */}
            <div className="space-y-2 mb-4">
              {attachments.map((att) => (
                <div key={att.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center space-x-2.5 truncate">
                    <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div className="truncate">
                      <span className="font-semibold text-slate-800 block truncate">{att.fileName}</span>
                      <span className="text-[10px] text-slate-400 uppercase">{att.category} • {att.fileSize}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(att.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add simulated attachment input */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="Nama berkas (misal: LPJ_Keuangan.pdf)..."
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-emerald-600"
            />
            <select
              value={newFileType}
              onChange={(e) => setNewFileType(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-2 text-xs text-slate-700"
            >
              <option value="proposal">Proposal</option>
              <option value="dokumentasi">Foto</option>
              <option value="lpj">LPJ</option>
              <option value="lainnya">Lainnya</option>
            </select>
            <button
              type="button"
              onClick={handleAddAttachment}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Submit Buttons Footer */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
        >
          Batalkan
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
          >
            <Save className="w-4 h-4 text-slate-600" />
            <span>Simpan Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('waiting_approval')}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4 text-emerald-200" />
            <span>Ajukan ke LPM (Waiting Approval)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
