import { InstrumentItem, User, AuditSession, CategoryWeightConfig } from '../types';

export const SCORE_CRITERIA: Record<number, { label: string; description: string; color: string; badgeBg: string }> = {
  0: { label: 'Tidak Ada', description: 'Belum ada bukti atau pelaksanaan sama sekali (0%)', color: 'text-red-700', badgeBg: 'bg-red-50 border-red-200 text-red-700' },
  1: { label: 'Ada, Kurang', description: 'Ada sebagian kecil tapi belum memadai (<50%)', color: 'text-amber-700', badgeBg: 'bg-amber-50 border-amber-200 text-amber-700' },
  2: { label: 'Ada, Cukup', description: 'Memenuhi standar dasar minimal (50-74%)', color: 'text-yellow-700', badgeBg: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  3: { label: 'Ada, Baik', description: 'Memenuhi standar dengan baik dan tertata (75-94%)', color: 'text-emerald-700', badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  4: { label: 'Ada, Baik Sekali', description: 'Sangat lengkap, sistematis, dan melampaui standar (95-100%)', color: 'text-green-800', badgeBg: 'bg-green-100 border-green-300 text-green-900' },
};

export const INSTRUMENT_ITEMS: InstrumentItem[] = [
  // A. Persiapan Pelaksanaan (11 Items)
  {
    id: 'P1',
    category: 'persiapan',
    number: 1,
    question_text: 'Panitia sudah mempersiapkan proposal kegiatan secara keseluruhan',
    weight: 1.0,
    guideline: 'Cek kelengkapan latar belakang, tujuan, sasaran, susunan panitia, dan rincian anggaran.'
  },
  {
    id: 'P2',
    category: 'persiapan',
    number: 2,
    question_text: 'Panitia sudah melakukan proses pengajuan dana kegiatan sesuai prosedur yang ada',
    weight: 1.0,
    guideline: 'Cek tanda tangan persetujuan keuangan, formulir pengajuan, dan kesesuaian SOP unit.'
  },
  {
    id: 'P3',
    category: 'persiapan',
    number: 3,
    question_text: 'Panitia telah menyelesaikan langkah-langkah dalam persiapan kegiatan sesuai jadwal atau rencana kerja',
    weight: 1.0,
    guideline: 'Cek timeline / rundown persiapan pra-acara dan ketercapaian milestone.'
  },
  {
    id: 'P4',
    category: 'persiapan',
    number: 4,
    question_text: 'Panitia telah mengidentifikasi semua langkah yang diperlukan untuk menyelesaikan persiapan kegiatan dengan sukses',
    weight: 1.0,
    guideline: 'Cek checklist kesiapan logistik, tempat, narasumber, dan perizinan.'
  },
  {
    id: 'P5',
    category: 'persiapan',
    number: 5,
    question_text: 'Panitia melakukan progres persiapan kegiatan sesuai target waktu yang ditetapkan',
    weight: 1.0,
    guideline: 'Evaluasi ketepatan waktu rapat koordinasi dan kesiapan H-3 serta H-1.'
  },
  {
    id: 'P6',
    category: 'persiapan',
    number: 6,
    question_text: 'Panitia menyiapkan daftar secara tertulis tugas pokok dan fungsi setiap kepanitiaan',
    weight: 1.0,
    guideline: 'Cek dokumen job description (Tupoksi) per divisi/seksi kepanitiaan.'
  },
  {
    id: 'P7',
    category: 'persiapan',
    number: 7,
    question_text: 'Panitia sudah menyiapkan sumber daya manusia (SDM) kepanitiaan kegiatan dengan baik',
    weight: 1.0,
    guideline: 'Kesiapan personil guru/pembina/santri panitia serta pembekalan teknis.'
  },
  {
    id: 'P8',
    category: 'persiapan',
    number: 8,
    question_text: 'Panitia mengetahui dan menuliskan secara tertulis indikator keberhasilan dan ketercapaian kegiatan',
    weight: 1.0,
    guideline: 'Cek target kuantitatif (jumlah peserta, % kepuasan) dan kualitatif di proposal.'
  },
  {
    id: 'P9',
    category: 'persiapan',
    number: 9,
    question_text: 'Panitia telah melakukan tinjauan kembali semua detil penting dan memastikan tidak ada yang terlewat dalam proses persiapan kegiatan',
    weight: 1.0,
    guideline: 'Cek hasil gladi bersih / final check meeting sebelum hari H.'
  },
  {
    id: 'P10',
    category: 'persiapan',
    number: 10,
    question_text: 'Panitia memiliki daftar resiko (acara, keuangan, keamanan, keselamatan) secara tertulis dalam kegiatan',
    weight: 1.0,
    guideline: 'Cek dokumen identifikasi risiko cuaca, kecelakaan, medis, dan krisis acara.'
  },
  {
    id: 'P11',
    category: 'persiapan',
    number: 11,
    question_text: 'Panitia memiliki langkah mitigasi secara tertulis dalam mengurangi resiko dalam kegiatan',
    weight: 1.0,
    guideline: 'Cek contingency plan / rencana cadangan tertulis (Rencana B).'
  },

  // B. Pelaksanaan (10 Items)
  {
    id: 'L1',
    category: 'pelaksanaan',
    number: 1,
    question_text: 'Persiapan panitia pra pelaksanaan berpengaruh positif pada pelaksanaan kegiatan',
    weight: 1.0,
    guideline: 'Observasi kelancaran awal acara sebagai dampak persiapan yang matang.'
  },
  {
    id: 'L2',
    category: 'pelaksanaan',
    number: 2,
    question_text: 'Kegiatan berjalan sesuai jadwal atau rencana yang sudah ditetapkan',
    weight: 1.0,
    guideline: 'Kesesuaian durasi pembukaan, sesi inti, istirahat sholat/makan, dan penutupan.'
  },
  {
    id: 'L3',
    category: 'pelaksanaan',
    number: 3,
    question_text: 'SDM panitia memahami dengan baik arahan dan instruksi yang sudah diberikan sebelum kegiatan',
    weight: 1.0,
    guideline: 'Panitia di lapangan tanggap dan tidak bingung saat menjalankan peran.'
  },
  {
    id: 'L4',
    category: 'pelaksanaan',
    number: 4,
    question_text: 'SDM panitia mematuhi semua instruksi atau prosedur yang sudah diberikan dalam kegiatan',
    weight: 1.0,
    guideline: 'Kepatuhan terhadap kode etik, adab islami, dan SOP keselamatan sekolah.'
  },
  {
    id: 'L5',
    category: 'pelaksanaan',
    number: 5,
    question_text: 'SDM panitia memiliki tingkat pengetahuan dan keterampilan dalam menjalankan tugas kepanitian dengan baik',
    weight: 1.0,
    guideline: 'Ketrampilan MC, operator sound/multimedia, konsumsi, keamanan, dan medis.'
  },
  {
    id: 'L6',
    category: 'pelaksanaan',
    number: 6,
    question_text: 'SDM panitia menjalankan tugas pokok dan fungsi kepanitiaan dengan baik',
    weight: 1.0,
    guideline: 'Seluruh divisi aktif berkontribusi sesuai pos tanggung jawab masing-masing.'
  },
  {
    id: 'L7',
    category: 'pelaksanaan',
    number: 7,
    question_text: 'SDM panitia mampu mempertahankan fokus dan konsentrasi selama pelaksanaan kegiatan',
    weight: 1.0,
    guideline: 'Panitia tetap siaga mendampingi siswa/santri hingga akhir agenda.'
  },
  {
    id: 'L8',
    category: 'pelaksanaan',
    number: 8,
    question_text: 'SDM panitia sudah melakukan komunikasi efektif antar anggota panitia atau pihak terkait',
    weight: 1.0,
    guideline: 'Penggunaan HT/grup koordinasi lancar dan tidak terjadi miskomunikasi fatal.'
  },
  {
    id: 'L9',
    category: 'pelaksanaan',
    number: 9,
    question_text: 'SDM panitia mematuhi langkah mitigasi secara tepat sesuai daftar resiko dan langkah mitigasi (tertulis) yang sudah dipersiapkan sebelumnya',
    weight: 1.0,
    guideline: 'Respon cepat saat terjadi kendala teknis atau insiden di lapangan.'
  },
  {
    id: 'L10',
    category: 'pelaksanaan',
    number: 10,
    question_text: 'SDM panitia mendokumentasikan segala proses kegiatan dengan baik sesuai tugas pokok dan fungsi kepanitiaan (tim dokumentasi, tim bendahara, tim acara, dsb)',
    weight: 1.0,
    guideline: 'Dokumentasi foto/video, absensi peserta, dan nota pengeluaran real-time.'
  },

  // C. Pasca Pelaksanaan (6 Items)
  {
    id: 'K1',
    category: 'pasca',
    number: 1,
    question_text: 'Panitia memiliki proses evaluasi kegiatan',
    weight: 1.0,
    guideline: 'Adanya agenda rapat evaluasi pembubaran panitia bersama pembina/manajemen.'
  },
  {
    id: 'K2',
    category: 'pasca',
    number: 2,
    question_text: 'Panitia melakukan evaluasi kegiatan tertulis sesuai prosedur yang ada',
    weight: 1.0,
    guideline: 'Adanya notulensi rapat evaluasi, form umpan balik siswa/wali santri.'
  },
  {
    id: 'K3',
    category: 'pasca',
    number: 3,
    question_text: 'Kegiatan berhasil mencapai keberhasilan dan ketercapaian kegiatan sesuai yang sudah ditetapkan',
    weight: 1.0,
    guideline: 'Pencapaian output/outcome dibandingkan target indikator di proposal.'
  },
  {
    id: 'K4',
    category: 'pasca',
    number: 4,
    question_text: 'Panitia sudah menyelesaikan kegiatan ini dengan baik',
    weight: 1.0,
    guideline: 'Seluruh rangkaian penutupan dan pengembalian sarana prasarana selesai.'
  },
  {
    id: 'K5',
    category: 'pasca',
    number: 5,
    question_text: 'Panitia sudah menyelesaikan semua tugas administratif seperti laporan kegiatan, laporan keuangan, dokumentasi, dan rencana tindak lanjut kedepan',
    weight: 1.0,
    guideline: 'Cek kelengkapan LPJ final (Laporan Pertanggungjawaban) dan rekapitulasi nota.'
  },
  {
    id: 'K6',
    category: 'pasca',
    number: 6,
    question_text: 'Terdapat wahana/proses pembelajaran dari kegiatan sebagai proses dari continuous improvement untuk kegiatan kedepannya',
    weight: 1.0,
    guideline: 'Adanya catatan lesson learned dan rekomendasi perbaikan untuk edisi berikutnya.'
  }
];

export const DEFAULT_USERS: User[] = [
  {
    id: 'u4',
    name: 'Dr. Muhammad Imaduddin, M.Ed.',
    email: 'lpm.mutu@sit.sch.id',
    role: 'lpm_manager',
    unit_id: 'Pusat',
    avatar: 'MI'
  },
  {
    id: 'u6',
    name: 'Dr. H. Salman Faris, M.A.',
    email: 'direktur.kesiswaan@sit.sch.id',
    role: 'director',
    unit_id: 'Pusat',
    avatar: 'SF'
  },
  {
    id: 'u3-sd',
    name: 'Usth. Nurul Aini, S.Pd.',
    email: 'manajer.sd@sit.sch.id',
    role: 'unit_manager',
    unit_id: 'SD',
    avatar: 'NA'
  },
  {
    id: 'u3-smp',
    name: 'Ust. Syarifuddin, S.Pd.',
    email: 'manajer.smp@sit.sch.id',
    role: 'unit_manager',
    unit_id: 'SMP',
    avatar: 'SY'
  },
  {
    id: 'u3-sma',
    name: 'Drs. H. Mulyadi, M.M.',
    email: 'manajer.sma@sit.sch.id',
    role: 'unit_manager',
    unit_id: 'SMA',
    avatar: 'MY'
  },
  {
    id: 'u3-ibs',
    name: 'Ust. Abdullah Azzam, Lc.',
    email: 'manajer.ibs@sit.sch.id',
    role: 'unit_manager',
    unit_id: 'IBS',
    avatar: 'AA'
  },
  {
    id: 'u1',
    name: 'Ust. Ahmad Fauzan, M.Pd.',
    email: 'auditor1@sit.sch.id',
    role: 'auditor',
    unit_id: 'SMP',
    avatar: 'AF'
  },
  {
    id: 'u2',
    name: 'Usth. Siti Nurhaliza, S.Si.',
    email: 'auditor2@sit.sch.id',
    role: 'auditor',
    unit_id: 'SMA',
    avatar: 'SN'
  },
  {
    id: 'u5',
    name: 'Administrator IT Yayasan',
    email: 'admin.it@sit.sch.id',
    role: 'admin',
    unit_id: 'Pusat',
    avatar: 'IT'
  }
];

export const PREDICATE_THRESHOLDS = [
  { min: 95.0, max: 100.0, predicate: 'Baik Sekali', grade: 'A', color: 'text-emerald-800', bg: 'bg-emerald-100 border-emerald-300', desc: 'Melampaui Standar Mutu SIT' },
  { min: 79.0, max: 94.99, predicate: 'Baik', grade: 'B', color: 'text-teal-800', bg: 'bg-teal-100 border-teal-300', desc: 'Memenuhi Standar Mutu SIT' },
  { min: 70.0, max: 78.99, predicate: 'Cukup', grade: 'C', color: 'text-amber-800', bg: 'bg-amber-100 border-amber-300', desc: 'Perlu Pendampingan & Perbaikan Terbatas' },
  { min: 0.0, max: 69.99, predicate: 'Kurang', grade: 'D', color: 'text-rose-800', bg: 'bg-rose-100 border-rose-300', desc: 'Perlu Audit Ulang & Perbaikan Menyeluruh' },
];

export function getPredicateInfo(percentage: number) {
  const rounded = Math.round(percentage * 10) / 10;
  for (const t of PREDICATE_THRESHOLDS) {
    if (rounded >= t.min && rounded <= t.max) {
      return { ...t, percentage: rounded };
    }
  }
  return { ...PREDICATE_THRESHOLDS[PREDICATE_THRESHOLDS.length - 1], percentage: rounded };
}

export function calculateAuditScores(
  items: InstrumentItem[],
  scores: Record<string, { auditor1Score: number; auditor2Score: number }>,
  categoryWeights: CategoryWeightConfig = { persiapan: 1.0, pelaksanaan: 1.0, pasca: 1.0 }
) {
  const categories: Record<string, { totalEarned: number; maxPossible: number; count: number }> = {
    persiapan: { totalEarned: 0, maxPossible: 0, count: 0 },
    pelaksanaan: { totalEarned: 0, maxPossible: 0, count: 0 },
    pasca: { totalEarned: 0, maxPossible: 0, count: 0 },
  };

  let totalWeightedEarned = 0;
  let totalWeightedMax = 0;

  items.forEach((item) => {
    const scoreData = scores[item.id] || { auditor1Score: 0, auditor2Score: 0 };
    const avgScore = (Number(scoreData.auditor1Score || 0) + Number(scoreData.auditor2Score || 0)) / 2;
    const itemWeight = (item.weight || 1.0) * (categoryWeights[item.category] || 1.0);

    categories[item.category].totalEarned += avgScore;
    categories[item.category].maxPossible += 4;
    categories[item.category].count += 1;

    totalWeightedEarned += avgScore * itemWeight;
    totalWeightedMax += 4 * itemWeight;
  });

  const persiapanPercentage = categories.persiapan.maxPossible > 0
    ? (categories.persiapan.totalEarned / categories.persiapan.maxPossible) * 100
    : 0;

  const pelaksanaanPercentage = categories.pelaksanaan.maxPossible > 0
    ? (categories.pelaksanaan.totalEarned / categories.pelaksanaan.maxPossible) * 100
    : 0;

  const pascaPercentage = categories.pasca.maxPossible > 0
    ? (categories.pasca.totalEarned / categories.pasca.maxPossible) * 100
    : 0;

  const finalPercentage = totalWeightedMax > 0
    ? (totalWeightedEarned / totalWeightedMax) * 100
    : 0;

  const predicateInfo = getPredicateInfo(finalPercentage);

  return {
    categories,
    persiapanPercentage: Math.round(persiapanPercentage * 10) / 10,
    pelaksanaanPercentage: Math.round(pelaksanaanPercentage * 10) / 10,
    pascaPercentage: Math.round(pascaPercentage * 10) / 10,
    finalPercentage: Math.round(finalPercentage * 10) / 10,
    predicate: predicateInfo.predicate,
    grade: predicateInfo.grade,
    predicateInfo,
    totalEarned: totalWeightedEarned,
    totalMax: totalWeightedMax
  };
}

export const INITIAL_AUDIT_SESSIONS: AuditSession[] = [
  {
    id: 'AUD-2026-001',
    unit_id: 'SMA',
    activity_name: 'Mukhoyyam Al-Qur\'an & Tarbiyah Camp SMAIT 2026',
    audit_date: '2026-08-25',
    auditor1_id: 'u1',
    auditor1_name: 'Ust. Ahmad Fauzan, M.Pd.',
    auditor2_id: 'u2',
    auditor2_name: 'Usth. Siti Nurhaliza, S.Si.',
    status: 'approved',
    followUpPlan: '1. Mempercepat pengesahan proposal H-14 sebelum kegiatan.\n2. Menyediakan genset cadangan untuk lokasi perkemahan.\n3. Mengirimkan sertifikat digital hafalan santri maksimal H+3.',
    scores: {
      P1: { itemId: 'P1', auditor1Score: 4, auditor2Score: 4, auditor1Notes: 'Proposal sangat rapi dan lengkap dengan RAB terinci', auditor2Notes: 'Lengkap dan sesuai format SIT' },
      P2: { itemId: 'P2', auditor1Score: 4, auditor2Score: 4, auditor1Notes: 'Acc yayasan lengkap', auditor2Notes: 'Sudah disetujui' },
      P3: { itemId: 'P3', auditor1Score: 4, auditor2Score: 3, auditor1Notes: 'Sesuai timeline', auditor2Notes: 'Ada pergeseran 1 hari di gladi' },
      P4: { itemId: 'P4', auditor1Score: 4, auditor2Score: 4 },
      P5: { itemId: 'P5', auditor1Score: 3, auditor2Score: 4 },
      P6: { itemId: 'P6', auditor1Score: 4, auditor2Score: 4 },
      P7: { itemId: 'P7', auditor1Score: 4, auditor2Score: 4 },
      P8: { itemId: 'P8', auditor1Score: 4, auditor2Score: 4 },
      P9: { itemId: 'P9', auditor1Score: 4, auditor2Score: 3 },
      P10: { itemId: 'P10', auditor1Score: 4, auditor2Score: 4, auditor1Notes: 'SOP darurat medis tersedia' },
      P11: { itemId: 'P11', auditor1Score: 4, auditor2Score: 4 },

      L1: { itemId: 'L1', auditor1Score: 4, auditor2Score: 4 },
      L2: { itemId: 'L2', auditor1Score: 4, auditor2Score: 4 },
      L3: { itemId: 'L3', auditor1Score: 4, auditor2Score: 3 },
      L4: { itemId: 'L4', auditor1Score: 4, auditor2Score: 4 },
      L5: { itemId: 'L5', auditor1Score: 4, auditor2Score: 4 },
      L6: { itemId: 'L6', auditor1Score: 4, auditor2Score: 4 },
      L7: { itemId: 'L7', auditor1Score: 4, auditor2Score: 4 },
      L8: { itemId: 'L8', auditor1Score: 4, auditor2Score: 3 },
      L9: { itemId: 'L9', auditor1Score: 4, auditor2Score: 4 },
      L10: { itemId: 'L10', auditor1Score: 4, auditor2Score: 4 },

      K1: { itemId: 'K1', auditor1Score: 4, auditor2Score: 4 },
      K2: { itemId: 'K2', auditor1Score: 4, auditor2Score: 4 },
      K3: { itemId: 'K3', auditor1Score: 4, auditor2Score: 4 },
      K4: { itemId: 'K4', auditor1Score: 4, auditor2Score: 4 },
      K5: { itemId: 'K5', auditor1Score: 4, auditor2Score: 3 },
      K6: { itemId: 'K6', auditor1Score: 4, auditor2Score: 4 }
    },
    attachments: [
      {
        id: 'att-1',
        sessionId: 'AUD-2026-001',
        fileName: 'Proposal_Mukhoyyam_SMAIT_2026_Approved.pdf',
        fileType: 'application/pdf',
        fileSize: '3.4 MB',
        uploadDate: '2026-08-20',
        category: 'proposal'
      },
      {
        id: 'att-2',
        sessionId: 'AUD-2026-001',
        fileName: 'Dokumentasi_Pelaksanaan_Camp.jpg',
        fileType: 'image/jpeg',
        fileSize: '4.1 MB',
        uploadDate: '2026-08-26',
        category: 'dokumentasi'
      },
      {
        id: 'att-3',
        sessionId: 'AUD-2026-001',
        fileName: 'LPJ_Keuangan_dan_Evaluasi_Mukhoyyam.pdf',
        fileType: 'application/pdf',
        fileSize: '2.8 MB',
        uploadDate: '2026-08-27',
        category: 'lpj'
      }
    ],
    persiapanPercentage: 96.6,
    pelaksanaanPercentage: 96.3,
    pascaPercentage: 97.9,
    final_percentage: 96.8,
    final_predicate: 'Baik Sekali',
    submitted_at: '2026-08-28 10:15 WIB',
    approved_by: 'Dr. Muhammad Imaduddin, M.Ed. (Manajer LPM)',
    approved_at: '2026-08-29 14:30 WIB',
    approval_notes: 'Kegiatan terselenggara sangat prima, dokumentasi & mitigasi risiko sangat teladan.'
  },
  {
    id: 'AUD-2026-002',
    unit_id: 'SMP',
    activity_name: 'Peringatan Hari Besar Islam (PHBI) & Bakti Sosial Ramadhan SMPIT',
    audit_date: '2026-08-28',
    auditor1_id: 'u1',
    auditor1_name: 'Ust. Ahmad Fauzan, M.Pd.',
    auditor2_id: 'u2',
    auditor2_name: 'Usth. Siti Nurhaliza, S.Si.',
    status: 'waiting_approval',
    followUpPlan: '1. Pengarsipan bukti tanda terima sembako dari warga perlu diperjelas dengan stempel RT.\n2. Koordinasi waktu sesi ceramah agar tidak melebihi jadwal sholat Ashar.',
    scores: {
      P1: { itemId: 'P1', auditor1Score: 4, auditor2Score: 3 },
      P2: { itemId: 'P2', auditor1Score: 3, auditor2Score: 3 },
      P3: { itemId: 'P3', auditor1Score: 3, auditor2Score: 4 },
      P4: { itemId: 'P4', auditor1Score: 3, auditor2Score: 3 },
      P5: { itemId: 'P5', auditor1Score: 3, auditor2Score: 3 },
      P6: { itemId: 'P6', auditor1Score: 4, auditor2Score: 4 },
      P7: { itemId: 'P7', auditor1Score: 3, auditor2Score: 3 },
      P8: { itemId: 'P8', auditor1Score: 3, auditor2Score: 3 },
      P9: { itemId: 'P9', auditor1Score: 3, auditor2Score: 3 },
      P10: { itemId: 'P10', auditor1Score: 3, auditor2Score: 2, auditor2Notes: 'Daftar resiko keamanan area parkir belum terinci' },
      P11: { itemId: 'P11', auditor1Score: 3, auditor2Score: 3 },

      L1: { itemId: 'L1', auditor1Score: 4, auditor2Score: 4 },
      L2: { itemId: 'L2', auditor1Score: 3, auditor2Score: 3 },
      L3: { itemId: 'L3', auditor1Score: 3, auditor2Score: 3 },
      L4: { itemId: 'L4', auditor1Score: 4, auditor2Score: 4 },
      L5: { itemId: 'L5', auditor1Score: 3, auditor2Score: 4 },
      L6: { itemId: 'L6', auditor1Score: 4, auditor2Score: 3 },
      L7: { itemId: 'L7', auditor1Score: 4, auditor2Score: 4 },
      L8: { itemId: 'L8', auditor1Score: 3, auditor2Score: 3 },
      L9: { itemId: 'L9', auditor1Score: 3, auditor2Score: 3 },
      L10: { itemId: 'L10', auditor1Score: 4, auditor2Score: 4 },

      K1: { itemId: 'K1', auditor1Score: 3, auditor2Score: 3 },
      K2: { itemId: 'K2', auditor1Score: 3, auditor2Score: 3 },
      K3: { itemId: 'K3', auditor1Score: 4, auditor2Score: 4 },
      K4: { itemId: 'K4', auditor1Score: 4, auditor2Score: 4 },
      K5: { itemId: 'K5', auditor1Score: 3, auditor2Score: 3 },
      K6: { itemId: 'K6', auditor1Score: 4, auditor2Score: 3 }
    },
    attachments: [
      {
        id: 'att-4',
        sessionId: 'AUD-2026-002',
        fileName: 'Proposal_Baksos_Ramadhan_SMPIT.pdf',
        fileType: 'application/pdf',
        fileSize: '1.9 MB',
        uploadDate: '2026-08-24',
        category: 'proposal'
      },
      {
        id: 'att-5',
        sessionId: 'AUD-2026-002',
        fileName: 'Dokumentasi_Penyaluran_Sembako.jpg',
        fileType: 'image/jpeg',
        fileSize: '3.2 MB',
        uploadDate: '2026-08-28',
        category: 'dokumentasi'
      }
    ],
    persiapanPercentage: 80.7,
    pelaksanaanPercentage: 86.3,
    pascaPercentage: 83.3,
    final_percentage: 83.3,
    final_predicate: 'Baik',
    submitted_at: '2026-08-29 09:00 WIB'
  },
  {
    id: 'AUD-2026-003',
    unit_id: 'IBS',
    activity_name: 'Supervisi Daurah Bahasa Arab & Khitobah Santri IBS',
    audit_date: '2026-08-29',
    auditor1_id: 'u1',
    auditor1_name: 'Ust. Ahmad Fauzan, M.Pd.',
    auditor2_id: 'u2',
    auditor2_name: 'Usth. Siti Nurhaliza, S.Si.',
    status: 'draft',
    followUpPlan: 'Masih dalam proses penyusunan tindak lanjut oleh panitia asrama.',
    scores: {
      P1: { itemId: 'P1', auditor1Score: 4, auditor2Score: 4 },
      P2: { itemId: 'P2', auditor1Score: 4, auditor2Score: 3 },
      P3: { itemId: 'P3', auditor1Score: 3, auditor2Score: 3 },
      P4: { itemId: 'P4', auditor1Score: 4, auditor2Score: 4 },
      P5: { itemId: 'P5', auditor1Score: 3, auditor2Score: 3 },
      P6: { itemId: 'P6', auditor1Score: 4, auditor2Score: 4 },
      P7: { itemId: 'P7', auditor1Score: 4, auditor2Score: 3 },
      P8: { itemId: 'P8', auditor1Score: 3, auditor2Score: 3 },
      P9: { itemId: 'P9', auditor1Score: 3, auditor2Score: 4 },
      P10: { itemId: 'P10', auditor1Score: 2, auditor2Score: 2, auditor1Notes: 'Perlu mitigasi santri izin sakit mendadak' },
      P11: { itemId: 'P11', auditor1Score: 3, auditor2Score: 2 },

      L1: { itemId: 'L1', auditor1Score: 4, auditor2Score: 4 },
      L2: { itemId: 'L2', auditor1Score: 3, auditor2Score: 3 },
      L3: { itemId: 'L3', auditor1Score: 3, auditor2Score: 3 },
      L4: { itemId: 'L4', auditor1Score: 4, auditor2Score: 4 },
      L5: { itemId: 'L5', auditor1Score: 4, auditor2Score: 4 },
      L6: { itemId: 'L6', auditor1Score: 3, auditor2Score: 3 },
      L7: { itemId: 'L7', auditor1Score: 4, auditor2Score: 4 },
      L8: { itemId: 'L8', auditor1Score: 3, auditor2Score: 3 },
      L9: { itemId: 'L9', auditor1Score: 3, auditor2Score: 3 },
      L10: { itemId: 'L10', auditor1Score: 3, auditor2Score: 4 },

      K1: { itemId: 'K1', auditor1Score: 3, auditor2Score: 3 },
      K2: { itemId: 'K2', auditor1Score: 2, auditor2Score: 3 },
      K3: { itemId: 'K3', auditor1Score: 3, auditor2Score: 3 },
      K4: { itemId: 'K4', auditor1Score: 4, auditor2Score: 4 },
      K5: { itemId: 'K5', auditor1Score: 2, auditor2Score: 2, auditor1Notes: 'LPJ belum disetorkan' },
      K6: { itemId: 'K6', auditor1Score: 3, auditor2Score: 3 }
    },
    attachments: [
      {
        id: 'att-6',
        sessionId: 'AUD-2026-003',
        fileName: 'Jadwal_Daurah_Bahasa_Arab_IBS.pdf',
        fileType: 'application/pdf',
        fileSize: '1.1 MB',
        uploadDate: '2026-08-28',
        category: 'proposal'
      }
    ],
    persiapanPercentage: 79.5,
    pelaksanaanPercentage: 85.0,
    pascaPercentage: 70.8,
    final_percentage: 79.6,
    final_predicate: 'Baik'
  },
  {
    id: 'AUD-2026-004',
    unit_id: 'SD',
    activity_name: 'Kemah Ukhuwah & Outbound Ceria Pramuka SIT SDIT',
    audit_date: '2026-08-22',
    auditor1_id: 'u1',
    auditor1_name: 'Ust. Ahmad Fauzan, M.Pd.',
    auditor2_id: 'u2',
    auditor2_name: 'Usth. Siti Nurhaliza, S.Si.',
    status: 'approved',
    followUpPlan: '1. Rasio guru pendamping outbound diperbanyak 1 guru per 8 siswa SD.\n2. Menu konsumsi anak dijaga higienitasnya.',
    scores: {
      P1: { itemId: 'P1', auditor1Score: 4, auditor2Score: 4 },
      P2: { itemId: 'P2', auditor1Score: 4, auditor2Score: 4 },
      P3: { itemId: 'P3', auditor1Score: 4, auditor2Score: 4 },
      P4: { itemId: 'P4', auditor1Score: 4, auditor2Score: 3 },
      P5: { itemId: 'P5', auditor1Score: 4, auditor2Score: 4 },
      P6: { itemId: 'P6', auditor1Score: 4, auditor2Score: 4 },
      P7: { itemId: 'P7', auditor1Score: 4, auditor2Score: 4 },
      P8: { itemId: 'P8', auditor1Score: 4, auditor2Score: 4 },
      P9: { itemId: 'P9', auditor1Score: 4, auditor2Score: 4 },
      P10: { itemId: 'P10', auditor1Score: 4, auditor2Score: 4 },
      P11: { itemId: 'P11', auditor1Score: 4, auditor2Score: 4 },

      L1: { itemId: 'L1', auditor1Score: 4, auditor2Score: 4 },
      L2: { itemId: 'L2', auditor1Score: 4, auditor2Score: 4 },
      L3: { itemId: 'L3', auditor1Score: 4, auditor2Score: 4 },
      L4: { itemId: 'L4', auditor1Score: 4, auditor2Score: 4 },
      L5: { itemId: 'L5', auditor1Score: 4, auditor2Score: 4 },
      L6: { itemId: 'L6', auditor1Score: 4, auditor2Score: 4 },
      L7: { itemId: 'L7', auditor1Score: 4, auditor2Score: 4 },
      L8: { itemId: 'L8', auditor1Score: 4, auditor2Score: 4 },
      L9: { itemId: 'L9', auditor1Score: 4, auditor2Score: 4 },
      L10: { itemId: 'L10', auditor1Score: 4, auditor2Score: 4 },

      K1: { itemId: 'K1', auditor1Score: 4, auditor2Score: 4 },
      K2: { itemId: 'K2', auditor1Score: 4, auditor2Score: 4 },
      K3: { itemId: 'K3', auditor1Score: 4, auditor2Score: 4 },
      K4: { itemId: 'K4', auditor1Score: 4, auditor2Score: 4 },
      K5: { itemId: 'K5', auditor1Score: 4, auditor2Score: 4 },
      K6: { itemId: 'K6', auditor1Score: 4, auditor2Score: 4 }
    },
    attachments: [
      {
        id: 'att-7',
        sessionId: 'AUD-2026-004',
        fileName: 'Proposal_Kemah_SDIT.pdf',
        fileType: 'application/pdf',
        fileSize: '2.5 MB',
        uploadDate: '2026-08-15',
        category: 'proposal'
      },
      {
        id: 'att-8',
        sessionId: 'AUD-2026-004',
        fileName: 'LPJ_Lengkap_Kemah_SDIT.pdf',
        fileType: 'application/pdf',
        fileSize: '4.8 MB',
        uploadDate: '2026-08-24',
        category: 'lpj'
      }
    ],
    persiapanPercentage: 98.9,
    pelaksanaanPercentage: 100.0,
    pascaPercentage: 100.0,
    final_percentage: 99.5,
    final_predicate: 'Baik Sekali',
    submitted_at: '2026-08-25 08:00 WIB',
    approved_by: 'Dr. Muhammad Imaduddin, M.Ed. (Manajer LPM)',
    approved_at: '2026-08-26 11:00 WIB',
    approval_notes: 'Luar biasa, pelaksanaan sangat terorganisir dan dokumentasi lengkap.'
  },
  {
    id: 'AUD-2026-005',
    unit_id: 'SD',
    activity_name: 'Pentas Seni Islami & Muhadharah Akbar Siswa SDIT',
    audit_date: '2026-08-27',
    auditor1_id: 'u1',
    auditor1_name: 'Ust. Ahmad Fauzan, M.Pd.',
    auditor2_id: 'u2',
    auditor2_name: 'Usth. Siti Nurhaliza, S.Si.',
    status: 'waiting_approval',
    followUpPlan: '1. Pengaturan sound system panggung utama diperbaiki.\n2. Waktu pergantian penampilan santri dipercepat.',
    scores: {
      P1: { itemId: 'P1', auditor1Score: 4, auditor2Score: 4 },
      P2: { itemId: 'P2', auditor1Score: 4, auditor2Score: 3 },
      P3: { itemId: 'P3', auditor1Score: 4, auditor2Score: 4 },
      P4: { itemId: 'P4', auditor1Score: 3, auditor2Score: 3 },
      P5: { itemId: 'P5', auditor1Score: 4, auditor2Score: 3 },
      P6: { itemId: 'P6', auditor1Score: 4, auditor2Score: 4 },
      P7: { itemId: 'P7', auditor1Score: 4, auditor2Score: 4 },
      P8: { itemId: 'P8', auditor1Score: 4, auditor2Score: 4 },
      P9: { itemId: 'P9', auditor1Score: 4, auditor2Score: 3 },
      P10: { itemId: 'P10', auditor1Score: 3, auditor2Score: 3 },
      P11: { itemId: 'P11', auditor1Score: 4, auditor2Score: 4 },

      L1: { itemId: 'L1', auditor1Score: 4, auditor2Score: 4 },
      L2: { itemId: 'L2', auditor1Score: 3, auditor2Score: 4 },
      L3: { itemId: 'L3', auditor1Score: 4, auditor2Score: 4 },
      L4: { itemId: 'L4', auditor1Score: 4, auditor2Score: 4 },
      L5: { itemId: 'L5', auditor1Score: 4, auditor2Score: 4 },
      L6: { itemId: 'L6', auditor1Score: 4, auditor2Score: 4 },
      L7: { itemId: 'L7', auditor1Score: 4, auditor2Score: 3 },
      L8: { itemId: 'L8', auditor1Score: 4, auditor2Score: 4 },
      L9: { itemId: 'L9', auditor1Score: 4, auditor2Score: 4 },
      L10: { itemId: 'L10', auditor1Score: 4, auditor2Score: 4 },

      K1: { itemId: 'K1', auditor1Score: 4, auditor2Score: 3 },
      K2: { itemId: 'K2', auditor1Score: 4, auditor2Score: 4 },
      K3: { itemId: 'K3', auditor1Score: 4, auditor2Score: 4 },
      K4: { itemId: 'K4', auditor1Score: 4, auditor2Score: 4 },
      K5: { itemId: 'K5', auditor1Score: 3, auditor2Score: 4 },
      K6: { itemId: 'K6', auditor1Score: 4, auditor2Score: 4 }
    },
    attachments: [
      {
        id: 'att-9',
        sessionId: 'AUD-2026-005',
        fileName: 'Proposal_Pensi_Muhadharah_SDIT.pdf',
        fileType: 'application/pdf',
        fileSize: '3.1 MB',
        uploadDate: '2026-08-20',
        category: 'proposal'
      }
    ],
    persiapanPercentage: 90.9,
    pelaksanaanPercentage: 96.3,
    pascaPercentage: 93.8,
    final_percentage: 93.5,
    final_predicate: 'Baik',
    submitted_at: '2026-08-29 13:20 WIB'
  },
  {
    id: 'AUD-2026-006',
    unit_id: 'IBS',
    activity_name: 'Musabaqah Hifzhil Qur\'an (MHQ) & Tahfidz Camp Santri IBS',
    audit_date: '2026-08-18',
    auditor1_id: 'u1',
    auditor1_name: 'Ust. Ahmad Fauzan, M.Pd.',
    auditor2_id: 'u2',
    auditor2_name: 'Usth. Siti Nurhaliza, S.Si.',
    status: 'approved',
    followUpPlan: 'Pemberian apresiasi piala bergilir untuk halaqah terbaik santri IBS.',
    scores: {
      P1: { itemId: 'P1', auditor1Score: 4, auditor2Score: 4 },
      P2: { itemId: 'P2', auditor1Score: 4, auditor2Score: 4 },
      P3: { itemId: 'P3', auditor1Score: 4, auditor2Score: 4 },
      P4: { itemId: 'P4', auditor1Score: 4, auditor2Score: 4 },
      P5: { itemId: 'P5', auditor1Score: 4, auditor2Score: 4 },
      P6: { itemId: 'P6', auditor1Score: 4, auditor2Score: 4 },
      P7: { itemId: 'P7', auditor1Score: 4, auditor2Score: 4 },
      P8: { itemId: 'P8', auditor1Score: 4, auditor2Score: 4 },
      P9: { itemId: 'P9', auditor1Score: 4, auditor2Score: 4 },
      P10: { itemId: 'P10', auditor1Score: 3, auditor2Score: 4 },
      P11: { itemId: 'P11', auditor1Score: 4, auditor2Score: 4 },

      L1: { itemId: 'L1', auditor1Score: 4, auditor2Score: 4 },
      L2: { itemId: 'L2', auditor1Score: 4, auditor2Score: 4 },
      L3: { itemId: 'L3', auditor1Score: 4, auditor2Score: 4 },
      L4: { itemId: 'L4', auditor1Score: 4, auditor2Score: 4 },
      L5: { itemId: 'L5', auditor1Score: 4, auditor2Score: 4 },
      L6: { itemId: 'L6', auditor1Score: 4, auditor2Score: 4 },
      L7: { itemId: 'L7', auditor1Score: 4, auditor2Score: 4 },
      L8: { itemId: 'L8', auditor1Score: 4, auditor2Score: 4 },
      L9: { itemId: 'L9', auditor1Score: 4, auditor2Score: 4 },
      L10: { itemId: 'L10', auditor1Score: 4, auditor2Score: 4 },

      K1: { itemId: 'K1', auditor1Score: 4, auditor2Score: 4 },
      K2: { itemId: 'K2', auditor1Score: 4, auditor2Score: 4 },
      K3: { itemId: 'K3', auditor1Score: 4, auditor2Score: 4 },
      K4: { itemId: 'K4', auditor1Score: 4, auditor2Score: 4 },
      K5: { itemId: 'K5', auditor1Score: 4, auditor2Score: 4 },
      K6: { itemId: 'K6', auditor1Score: 4, auditor2Score: 4 }
    },
    attachments: [
      {
        id: 'att-10',
        sessionId: 'AUD-2026-006',
        fileName: 'LPJ_MHQ_IBS_2026.pdf',
        fileType: 'application/pdf',
        fileSize: '3.6 MB',
        uploadDate: '2026-08-20',
        category: 'lpj'
      }
    ],
    persiapanPercentage: 97.7,
    pelaksanaanPercentage: 100.0,
    pascaPercentage: 100.0,
    final_percentage: 99.1,
    final_predicate: 'Baik Sekali',
    submitted_at: '2026-08-21 15:00 WIB',
    approved_by: 'Dr. Muhammad Imaduddin, M.Ed. (Manajer LPM)',
    approved_at: '2026-08-22 09:30 WIB',
    approval_notes: 'Sangat baik dan khidmat, ketercapaian target hafalan melampaui standar.'
  }
];
