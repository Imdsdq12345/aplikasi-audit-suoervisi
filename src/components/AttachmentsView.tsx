import React, { useState } from 'react';
import { AuditSession, AuditAttachment, UnitId } from '../types';
import { 
  FolderUp, 
  FileText, 
  Image as ImageIcon, 
  Download, 
  Eye, 
  Filter, 
  Plus, 
  Calendar, 
  Building2, 
  CheckCircle2,
  Trash2
} from 'lucide-react';

interface AttachmentsViewProps {
  sessions: AuditSession[];
  onAddAttachmentToSession: (sessionId: string, attachment: AuditAttachment) => void;
}

export const AttachmentsView: React.FC<AttachmentsViewProps> = ({
  sessions,
  onAddAttachmentToSession,
}) => {
  const [selectedUnit, setSelectedUnit] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [targetSessionId, setTargetSessionId] = useState<string>(sessions[0]?.id || '');
  const [fileName, setFileName] = useState('');
  const [fileCat, setFileCat] = useState<'proposal' | 'dokumentasi' | 'lpj' | 'lainnya'>('proposal');
  const [previewAttachment, setPreviewAttachment] = useState<AuditAttachment | null>(null);

  // Flatten all attachments with session context
  const allAttachments: (AuditAttachment & { sessionActivity: string; sessionUnit: UnitId; sessionStatus: string })[] = [];
  sessions.forEach((s) => {
    (s.attachments || []).forEach((att) => {
      allAttachments.push({
        ...att,
        sessionActivity: s.activity_name,
        sessionUnit: s.unit_id,
        sessionStatus: s.status,
      });
    });
  });

  const filteredAttachments = allAttachments.filter((att) => {
    const matchUnit = selectedUnit === 'ALL' || att.sessionUnit === selectedUnit;
    const matchCat = selectedCategory === 'ALL' || att.category === selectedCategory;
    return matchUnit && matchCat;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim() || !targetSessionId) return;

    const newAtt: AuditAttachment = {
      id: `att-${Date.now()}`,
      sessionId: targetSessionId,
      fileName: fileName.trim(),
      fileType: fileName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
      fileSize: '3.1 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      category: fileCat,
    };

    onAddAttachmentToSession(targetSessionId, newAtt);
    setFileName('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              <FolderUp className="w-4 h-4 text-emerald-700" />
              <span>Modul Repositori & Verifikasi Bukti Fisik</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Dokumen Pendukung Audit Supervisi
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Arsip berkas proposal, LPJ keuangan, lembar disposisi, dan foto dokumentasi kegiatan kesiswaan.
            </p>
          </div>

          <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3.5 py-2 rounded-lg flex items-center gap-2 border border-slate-200">
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>Total Berkas: <b className="text-slate-900">{allAttachments.length} Dokumen</b></span>
          </div>
        </div>
      </div>

      {/* Upload New Document Box */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-700" />
          <span>Unggah Berkas Baru ke Sesi Kegiatan</span>
        </h2>
        <form onSubmit={handleUpload} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Pilih Kegiatan Audit Target</label>
            <select
              value={targetSessionId}
              onChange={(e) => setTargetSessionId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  [{s.unit_id}] {s.activity_name.substring(0, 32)}...
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama File (PDF / Gambar)</label>
            <input
              type="text"
              placeholder="Contoh: Nota_LPJ_Keuangan_2026.pdf"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Kategori Berkas</label>
            <select
              value={fileCat}
              onChange={(e) => setFileCat(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
            >
              <option value="proposal">Proposal Kegiatan</option>
              <option value="dokumentasi">Foto / Video Dokumentasi</option>
              <option value="lpj">Laporan Pertanggungjawaban (LPJ)</option>
              <option value="lainnya">Dokumen Lainnya</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer h-[38px]"
            >
              <FolderUp className="w-4 h-4 text-emerald-200" />
              <span>Unggah Dokumen</span>
            </button>
          </div>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-600 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-emerald-700" />
            Unit:
          </span>
          {['ALL', 'SD', 'SMP', 'SMA', 'IBS'].map((u) => (
            <button
              key={u}
              onClick={() => setSelectedUnit(u)}
              className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer transition ${
                selectedUnit === u
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {u === 'ALL' ? 'Semua Unit' : u}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-600">Kategori:</span>
          {['ALL', 'proposal', 'dokumentasi', 'lpj', 'lainnya'].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1 rounded-md text-xs font-bold uppercase cursor-pointer transition ${
                selectedCategory === c
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {c === 'ALL' ? 'Semua' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Attachments Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAttachments.map((att) => {
          const isPdf = att.fileName.toLowerCase().endsWith('.pdf');
          return (
            <div 
              key={att.id} 
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-emerald-600 transition group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                    {att.sessionUnit} • {att.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono font-medium">{att.fileSize}</span>
                </div>

                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isPdf ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-blue-50 text-blue-600 border border-blue-200'
                  }`}>
                    {isPdf ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold text-slate-900 truncate" title={att.fileName}>
                      {att.fileName}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5" title={att.sessionActivity}>
                      {att.sessionActivity}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {att.uploadDate}
                </span>

                <button
                  onClick={() => setPreviewAttachment(att)}
                  className="text-xs font-bold text-emerald-800 group-hover:text-emerald-600 flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Berkas</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {previewAttachment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-bold text-slate-900 truncate max-w-xs">{previewAttachment.fileName}</h3>
              </div>
              <button
                onClick={() => setPreviewAttachment(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold px-2 py-1 rounded-md bg-slate-100 border border-slate-200 cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-200 my-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3 border border-emerald-200">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-xs font-bold text-slate-800">Berkas Terverifikasi & Sah</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Dokumen telah diunggah dan terenkripsi dalam sistem repositori internal LPM SIT.
              </p>
              <div className="mt-4 inline-flex text-xs bg-white px-3 py-1.5 rounded-md border border-slate-200 text-slate-700 font-mono">
                Ukuran: {previewAttachment.fileSize} • Kategori: {previewAttachment.category}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  alert(`Memulai unduhan berkas: ${previewAttachment.fileName}`);
                  setPreviewAttachment(null);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4 text-emerald-200" />
                <span>Unduh Berkas</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
