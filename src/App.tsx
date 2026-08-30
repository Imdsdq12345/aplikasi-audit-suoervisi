import React, { useState } from 'react';
import { 
  User, 
  AuditSession, 
  CategoryWeightConfig, 
  AuditAttachment,
  Role,
  UnitId
} from './types';
import { 
  DEFAULT_USERS, 
  INITIAL_AUDIT_SESSIONS, 
  calculateAuditScores, 
  INSTRUMENT_ITEMS 
} from './data/instruments';
import { Navbar } from './components/Navbar';
import { Sidebar, TabKey } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { AuditInputForm } from './components/AuditInputForm';
import { ApprovalPanel } from './components/ApprovalPanel';
import { DynamicWeightCalculator } from './components/DynamicWeightCalculator';
import { AttachmentsView } from './components/AttachmentsView';
import { AuditDetailModal } from './components/AuditDetailModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Global Users & Current active user (defaults to Manajer LPM Dr. Muhammad Imaduddin)
  const [users] = useState<User[]>(DEFAULT_USERS);
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USERS[3]); // LPM Manager

  // Global Audit Sessions state
  const [sessions, setSessions] = useState<AuditSession[]>(INITIAL_AUDIT_SESSIONS);

  // Dynamic Category Weights config
  const [weights, setWeights] = useState<CategoryWeightConfig>({
    persiapan: 1.0,
    pelaksanaan: 1.0,
    pasca: 1.0,
  });

  // Active Tab navigation
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  // Filter unit state
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('ALL');

  // Mobile menu drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Audit Detail Modal
  const [detailModalSession, setDetailModalSession] = useState<AuditSession | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Recalculate sessions when weights change
  const handleUpdateWeights = (newWeights: CategoryWeightConfig) => {
    setWeights(newWeights);
    setSessions((prev) =>
      prev.map((s) => {
        const recalc = calculateAuditScores(INSTRUMENT_ITEMS, s.scores as any, newWeights);
        return {
          ...s,
          persiapanPercentage: recalc.persiapanPercentage,
          pelaksanaanPercentage: recalc.pelaksanaanPercentage,
          pascaPercentage: recalc.pascaPercentage,
          final_percentage: recalc.finalPercentage,
          final_predicate: recalc.predicate,
        };
      })
    );
    showToast('Bobot dinamis berhasil diperbarui dan diterapkan ke seluruh audit!');
  };

  // Handle Saving New / Updated Audit Session
  const handleSaveSession = (newSession: AuditSession) => {
    setSessions((prev) => {
      const existsIndex = prev.findIndex((s) => s.id === newSession.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = newSession;
        return updated;
      }
      return [newSession, ...prev];
    });

    if (newSession.status === 'waiting_approval') {
      showToast(`Audit "${newSession.activity_name}" berhasil diajukan ke Manajer Mutu LPM!`);
      setActiveTab('dashboard');
    } else {
      showToast(`Draft audit "${newSession.activity_name}" berhasil disimpan!`);
      setActiveTab('dashboard');
    }
  };

  // LPM Approval Handler
  const handleApproveSession = (sessionId: string, notes: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          return {
            ...s,
            status: 'approved',
            approved_by: `${currentUser.name} (Manajer Mutu LPM)`,
            approved_at: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
            approval_notes: notes,
          };
        }
        return s;
      })
    );
    showToast(`Audit ${sessionId} telah DISETUJUI dan sah masuk rekapitulasi mutu!`);
  };

  // LPM Rejection Handler
  const handleRejectSession = (sessionId: string, reason: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          return {
            ...s,
            status: 'rejected',
            rejection_reason: reason,
          };
        }
        return s;
      })
    );
    showToast(`Audit ${sessionId} dikembalikan ke auditor untuk revisi.`, 'info');
  };

  // Attachment added handler
  const handleAddAttachmentToSession = (sessionId: string, attachment: AuditAttachment) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          return {
            ...s,
            attachments: [...(s.attachments || []), attachment],
          };
        }
        return s;
      })
    );
    showToast(`Berkas "${attachment.fileName}" berhasil diunggah!`);
  };

  const handleUserChange = (u: User) => {
    setCurrentUser(u);
    if (u.role === 'unit_manager') {
      setSelectedUnitFilter(u.unit_id);
      showToast(`Beralih ke Manajer Unit ${u.unit_id}: ${u.name} (Data dibatasi hanya Unit ${u.unit_id})`, 'info');
    } else {
      showToast(`Beralih ke ${u.name} (${u.role === 'director' ? 'Direktur Kesiswaan' : u.role === 'lpm_manager' ? 'Manajer Mutu LPM' : u.role === 'admin' ? 'Admin IT' : 'Auditor'}) - Akses Seluruh Unit`, 'info');
    }
  };

  const pendingCount = sessions.filter((s) => s.status === 'waiting_approval').length;

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {/* Left Emerald Sidebar with responsive drawer */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        pendingCount={pendingCount}
        userRole={currentUser.role}
        currentUser={currentUser}
        onUserChange={handleUserChange}
        users={users}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Right Content Section */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        {/* Top Header */}
        <Navbar
          currentUser={currentUser}
          onUserChange={handleUserChange}
          users={users}
          pendingCount={pendingCount}
          onNewAudit={() => setActiveTab('audit-input')}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Scrollable Main View Area with fluid responsive max-width */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 min-w-0">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            {activeTab === 'dashboard' && (
              <DashboardView
                sessions={sessions}
                weights={weights}
                currentUser={currentUser}
                onNewAudit={() => setActiveTab('audit-input')}
                onOpenAuditDetail={(s) => setDetailModalSession(s)}
                onNavigateToApproval={() => setActiveTab('approval-panel')}
                selectedUnitFilter={selectedUnitFilter}
                onSelectUnitFilter={(u) => setSelectedUnitFilter(u)}
              />
            )}

            {activeTab === 'audit-input' && (
              <AuditInputForm
                weights={weights}
                onSaveSession={handleSaveSession}
                onCancel={() => setActiveTab('dashboard')}
              />
            )}

            {activeTab === 'approval-panel' && (
              <ApprovalPanel
                sessions={sessions}
                currentUser={currentUser}
                onApproveSession={handleApproveSession}
                onRejectSession={handleRejectSession}
                onOpenAuditDetail={(s) => setDetailModalSession(s)}
              />
            )}

            {activeTab === 'dynamic-weights' && (
              <DynamicWeightCalculator
                weights={weights}
                onUpdateWeights={handleUpdateWeights}
              />
            )}

            {activeTab === 'attachments' && (
              <AttachmentsView
                sessions={sessions}
                onAddAttachmentToSession={handleAddAttachmentToSession}
              />
            )}
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      <AuditDetailModal
        session={detailModalSession}
        onClose={() => setDetailModalSession(null)}
      />

      {/* Toast Floating Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-3 duration-300">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-3 text-xs font-semibold">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );

}
