import React, { useState, useEffect } from 'react';
import { GetIcon } from './Icons';

export const ToolsTab: React.FC = () => {
    // --- VRAM Calculator State ---
    const [resolution, setResolution] = useState<{w: number, h: number}>({w: 1440, h: 1080});
    const [batchSize, setBatchSize] = useState(1);
    const [vramUsage, setVramUsage] = useState(0);

    // --- Bitrate Calculator State ---
    const [durationMin, setDurationMin] = useState(60);
    const [targetSizeGB, setTargetSizeGB] = useState(4);
    const [calcBitrate, setCalcBitrate] = useState(0);

    // VRAM Logic (Heuristic for Wan2.1/SD on FP16)
    useEffect(() => {
        // Base OS + ComfyUI overhead ~2GB
        const base = 2.2;
        // Model weights loaded ~4GB (Optimized) to ~8GB depending on quant
        const model = 5.5; 
        // Resolution impact: (W * H * Batch * Precision Factor) / 1024^3
        // Factor 0.000015 is a rough empirical multiplier for attention layers
        const processing = (resolution.w * resolution.h * batchSize * 0.0000018);
        
        setVramUsage(parseFloat((base + model + processing).toFixed(2)));
    }, [resolution, batchSize]);

    // Bitrate Logic
    useEffect(() => {
        // (Size in GB * 1024 * 8) / (Time in seconds) = Mbps
        const seconds = durationMin * 60;
        if (seconds > 0) {
            const mbps = (targetSizeGB * 8192) / seconds;
            setCalcBitrate(parseFloat(mbps.toFixed(2)));
        }
    }, [durationMin, targetSizeGB]);

    const vramColor = vramUsage > 11.5 ? 'text-red-500' : vramUsage > 10 ? 'text-yellow-500' : 'text-emerald-500';
    const vramBarColor = vramUsage > 11.5 ? 'bg-red-500' : vramUsage > 10 ? 'bg-yellow-500' : 'bg-emerald-500';
    const vramPercent = Math.min((vramUsage / 12) * 100, 100);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-cyan-900/30 p-2 rounded-lg text-cyan-400">
                        {GetIcon('tool', "w-6 h-6")}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Toolbox de Engenharia</h2>
                        <p className="text-xs text-slate-400 uppercase">Cálculos de Hardware & Compressão</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Hardware Detectado (Contexto)</div>
                    <div className="text-sm font-mono text-white">NVIDIA RTX 3060 • 12GB VRAM</div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                
                {/* VRAM Estimator */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        {GetIcon('cpu', "w-4 h-4 text-purple-400")} Estimador de VRAM (ComfyUI)
                    </h3>
                    
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Resolução de Saída</label>
                            <select 
                                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none"
                                onChange={(e) => {
                                    const [w, h] = e.target.value.split('x').map(Number);
                                    setResolution({w, h});
                                }}
                                value={`${resolution.w}x${resolution.h}`}
                            >
                                <option value="720x576">SD Original (720x576)</option>
                                <option value="960x720">HD 720p (960x720)</option>
                                <option value="1440x1080">FHD 1080p (1440x1080) - Recomendado</option>
                                <option value="1920x1440">2K (1920x1440)</option>
                                <option value="2880x2160">4K (2880x2160) - Arriscado</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Batch Size (Latent Frames)</label>
                            <input 
                                type="range" min="1" max="16" step="1"
                                value={batchSize}
                                onChange={(e) => setBatchSize(Number(e.target.value))}
                                className="w-full accent-cyan-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1 font-mono">
                                <span>1</span>
                                <span className="text-cyan-400 font-bold">{batchSize} frames</span>
                                <span>16</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/50">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs text-slate-400 uppercase font-bold">Uso Estimado</span>
                            <span className={`text-xl font-mono font-bold ${vramColor}`}>{vramUsage.toFixed(1)} GB <span className="text-xs text-slate-600">/ 12 GB</span></span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-500 ${vramBarColor}`} style={{width: `${vramPercent}%`}}></div>
                        </div>
                        {vramUsage > 11.5 && (
                            <div className="mt-2 text-[10px] text-red-400 flex items-center gap-1 font-bold animate-pulse">
                                {GetIcon('alertTriangle', "w-3 h-3")} PERIGO DE OOM (Out Of Memory)
                            </div>
                        )}
                    </div>
                </div>

                {/* Bitrate Calculator */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        {GetIcon('calculator', "w-4 h-4 text-orange-400")} Calculadora de Bitrate
                    </h3>

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Duração do Vídeo (Minutos)</label>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="number" 
                                    value={durationMin}
                                    onChange={(e) => setDurationMin(Number(e.target.value))}
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none font-mono"
                                />
                                <span className="text-xs text-slate-500 font-bold">MIN</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Tamanho Alvo (GB)</label>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="number" 
                                    value={targetSizeGB}
                                    step="0.5"
                                    onChange={(e) => setTargetSizeGB(Number(e.target.value))}
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none font-mono"
                                />
                                <span className="text-xs text-slate-500 font-bold">GB</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/50 flex flex-col items-center justify-center text-center">
                        <span className="text-xs text-slate-400 uppercase font-bold mb-1">Bitrate Necessário</span>
                        <span className="text-2xl font-mono font-bold text-orange-400">{calcBitrate} <span className="text-sm text-slate-600">Mbps</span></span>
                        <div className="mt-2 text-[10px] text-slate-500 border-t border-slate-800 pt-2 w-full">
                            Use este valor no campo <span className="text-slate-300 font-mono">--bitrate</span> do FFmpeg ou no nó de exportação.
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Reference */}
            <div className="bg-slate-800/30 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 flex justify-between items-center">
                <span><strong>Dica Pro:</strong> Para arquivos master (Arquivo), use CRF 16-18. Para distribuição (YouTube/Cliente), use VBR 15-25 Mbps.</span>
                <div className="flex gap-2">
                    <span className="bg-slate-700 px-2 py-1 rounded text-white font-mono">CRF 16</span>
                    <span className="bg-slate-700 px-2 py-1 rounded text-white font-mono">Preset Slow</span>
                </div>
            </div>
        </div>
    );
};