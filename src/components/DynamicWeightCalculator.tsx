import React, { useState } from 'react';
import { CategoryWeightConfig } from '../types';
import { PREDICATE_THRESHOLDS, getPredicateInfo } from '../data/instruments';
import { 
  Sliders, 
  Calculator, 
  RotateCcw, 
  Save, 
  Check, 
  Sparkles, 
  HelpCircle,
  Award,
  Layers
} from 'lucide-react';

interface DynamicWeightCalculatorProps {
  weights: CategoryWeightConfig;
  onUpdateWeights: (newWeights: CategoryWeightConfig) => void;
}

export const DynamicWeightCalculator: React.FC<DynamicWeightCalculatorProps> = ({
  weights,
  onUpdateWeights,
}) => {
  const [localWeights, setLocalWeights] = useState<CategoryWeightConfig>({ ...weights });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Interactive sandbox simulation states
  const [simPersiapan, setSimPersiapan] = useState<number>(3.5); // 0 - 4
  const [simPelaksanaan, setSimPelaksanaan] = useState<number>(3.8); // 0 - 4
  const [simPasca, setSimPasca] = useState<number>(3.2); // 0 - 4

  const handleSave = () => {
    onUpdateWeights(localWeights);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    const defaults: CategoryWeightConfig = { persiapan: 1.0, pelaksanaan: 1.0, pasca: 1.0 };
    setLocalWeights(defaults);
    onUpdateWeights(defaults);
  };

  // Calculate sandbox simulation
  // Total Earned = (11 * simPersiapan * wP) + (10 * simPelaksanaan * wL) + (6 * simPasca * wK)
  // Total Max = (11 * 4 * wP) + (10 * 4 * wL) + (6 * 4 * wK)
  const earnedPersiapan = 11 * simPersiapan * localWeights.persiapan;
  const maxPersiapan = 11 * 4 * localWeights.persiapan;

  const earnedPelaksanaan = 10 * simPelaksanaan * localWeights.pelaksanaan;
  const maxPelaksanaan = 10 * 4 * localWeights.pelaksanaan;

  const earnedPasca = 6 * simPasca * localWeights.pasca;
  const maxPasca = 6 * 4 * localWeights.pasca;

  const totalEarned = earnedPersiapan + earnedPelaksanaan + earnedPasca;
  const totalMax = maxPersiapan + maxPelaksanaan + maxPasca;
  const simPercentage = totalMax > 0 ? (totalEarned / totalMax) * 100 : 0;
  const simPredicate = getPredicateInfo(simPercentage);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              <Sliders className="w-4 h-4 text-emerald-700" />
              <span>Modul Konfigurasi Bobot Dinamis & Formula Mutu</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Pengaturan Bobot Instrumen & Predikat Mutu
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Fleksibilitas pembobotan kategori instrumen untuk menyesuaikan prioritas supervisi mutu yayasan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default (1.0)</span>
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Terapkan Bobot</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Weight Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-emerald-700" />
                <h2 className="text-sm font-bold text-slate-900">Konfigurasi Bobot per Kategori</h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">Rentang: 0.5x - 3.0x</span>
            </div>

            {/* Slider 1: Persiapan */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">A. Persiapan Pelaksanaan (11 Item)</span>
                  <span className="text-[11px] text-slate-500">Kelengkapan proposal, anggaran, timeline & mitigasi risiko.</span>
                </div>
                <span className="text-sm font-black font-mono text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-300">
                  {localWeights.persiapan.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={localWeights.persiapan}
                onChange={(e) => setLocalWeights({ ...localWeights, persiapan: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-800"
              />
            </div>

            {/* Slider 2: Pelaksanaan */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">B. Pelaksanaan Kegiatan (10 Item)</span>
                  <span className="text-[11px] text-slate-500">Kesesuaian jadwal, kepatuhan adab & SOP, kinerja panitia di lapangan.</span>
                </div>
                <span className="text-sm font-black font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-300">
                  {localWeights.pelaksanaan.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={localWeights.pelaksanaan}
                onChange={(e) => setLocalWeights({ ...localWeights, pelaksanaan: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
              />
            </div>

            {/* Slider 3: Pasca */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">C. Pasca Pelaksanaan (6 Item)</span>
                  <span className="text-[11px] text-slate-500">Rapat evaluasi, laporan LPJ keuangan & continuous improvement.</span>
                </div>
                <span className="text-sm font-black font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-300">
                  {localWeights.pasca.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={localWeights.pasca}
                onChange={(e) => setLocalWeights({ ...localWeights, pasca: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Formula Explanation Box */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1.5">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-emerald-700" />
                <span>Formula Matematis Perhitungan:</span>
              </div>
              <div className="p-2.5 bg-white rounded-md border border-slate-200 font-mono text-[11px] text-slate-800 overflow-x-auto">
                Nilai (%) = [ Σ (Skor Rata-Rata Item × Bobot) / Σ (4 × Bobot) ] × 100%
              </div>
              <p className="text-[11px] text-slate-500">
                Skor Rata-Rata Item diperoleh dari penjumlahan nilai Auditor 1 dan Auditor 2 dibagi 2.
              </p>
            </div>
          </div>

          {/* Predicate Thresholds Reference Table */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center space-x-2 mb-3">
              <Award className="w-4 h-4 text-emerald-700" />
              <h2 className="text-sm font-bold text-slate-900">Tabel Standar Predikat Mutu Sekolah Islam Terpadu</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {PREDICATE_THRESHOLDS.map((p) => (
                <div key={p.grade} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <span className={`w-7 h-7 rounded-md font-bold flex items-center justify-center border uppercase text-xs ${p.bg} ${p.color}`}>
                      {p.grade}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900">{p.predicate}</span>
                      <span className="text-[11px] text-slate-500 block">{p.desc}</span>
                    </div>
                  </div>
                  <span className="font-bold text-slate-700 font-mono">
                    {p.min}% - {p.max === 100 ? '100%' : `${p.max}%`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Sandbox Simulation (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-slate-800 text-white rounded-xl p-6 shadow-md border border-slate-700 space-y-6 sticky top-20">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold">Simulator Predikat Real-Time</h2>
              </div>
              <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded-md text-emerald-300 font-bold uppercase tracking-wider border border-slate-600">
                Sandbox
              </span>
            </div>

            {/* Simulated Score Card */}
            <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-widest">Hasil Konversi Skor Simulasi</span>
              <div className="text-4xl font-black text-white mt-1 font-mono">
                {simPercentage.toFixed(1)}%
              </div>
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-emerald-950 shadow-xs uppercase">
                <Award className="w-3.5 h-3.5 text-emerald-950" />
                <span>{simPredicate.predicate} (Grade {simPredicate.grade})</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {simPredicate.desc}
              </p>
            </div>

            {/* Simulation Sliders */}
            <div className="space-y-4 text-xs">
              <span className="font-bold text-slate-300 block uppercase tracking-wider text-[10px]">
                Uji Coba Rata-Rata Skor per Kategori:
              </span>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Rata-Rata Persiapan:</span>
                  <span className="font-bold text-white font-mono">{simPersiapan.toFixed(1)} / 4.0</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="0.1"
                  value={simPersiapan}
                  onChange={(e) => setSimPersiapan(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Rata-Rata Pelaksanaan:</span>
                  <span className="font-bold text-white font-mono">{simPelaksanaan.toFixed(1)} / 4.0</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="0.1"
                  value={simPelaksanaan}
                  onChange={(e) => setSimPelaksanaan(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Rata-Rata Pasca:</span>
                  <span className="font-bold text-white font-mono">{simPasca.toFixed(1)} / 4.0</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="0.1"
                  value={simPasca}
                  onChange={(e) => setSimPasca(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-700">
              💡 Perubahan bobot dinamis akan secara otomatis memperbarui nilai persentase seluruh kegiatan yang diaudit.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
