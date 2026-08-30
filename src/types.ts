export type Role = 'auditor' | 'unit_manager' | 'lpm_manager' | 'director' | 'admin';

export type UnitId = 'SD' | 'SMP' | 'SMA' | 'IBS' | 'Pusat';

export type AuditStatus = 'draft' | 'waiting_approval' | 'approved' | 'rejected';

export type CategoryKey = 'persiapan' | 'pelaksanaan' | 'pasca';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  unit_id: UnitId;
  avatar?: string;
}

export interface InstrumentItem {
  id: string;
  category: CategoryKey;
  number: number;
  question_text: string;
  weight: number; // default 1.0
  guideline?: string;
}

export interface ItemScore {
  itemId: string;
  auditor1Score: number; // 0-4
  auditor2Score: number; // 0-4
  auditor1Notes?: string;
  auditor2Notes?: string;
}

export interface AuditAttachment {
  id: string;
  sessionId: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  category: 'proposal' | 'dokumentasi' | 'lpj' | 'lainnya';
  url?: string;
}

export interface AuditSession {
  id: string;
  unit_id: UnitId;
  activity_name: string;
  audit_date: string;
  auditor1_id: string;
  auditor1_name: string;
  auditor2_id: string;
  auditor2_name: string;
  status: AuditStatus;
  scores: Record<string, ItemScore>; // key is itemId
  followUpPlan: string; // Rencana Tindak Lanjut
  attachments: AuditAttachment[];
  
  // Computed scores
  persiapanPercentage?: number;
  pelaksanaanPercentage?: number;
  pascaPercentage?: number;
  final_percentage?: number;
  final_predicate?: string;
  
  // Approval metadata
  submitted_at?: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  approval_notes?: string;
}

export interface CategoryWeightConfig {
  persiapan: number; // e.g. 1.0
  pelaksanaan: number; // e.g. 1.0
  pasca: number; // e.g. 1.0
}
