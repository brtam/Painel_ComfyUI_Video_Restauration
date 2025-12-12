import React from 'react';
import { GetIcon } from './Icons';

export const WorkflowVisualizer: React.FC = () => {
    return (
        <div className="mx-5 mb-5 p-4 bg-slate-950/60 rounded-xl border border-slate-700/50 shadow-inner">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                {GetIcon('cpu', 'w-3 h-3 text-emerald-500')}
                Pipeline de Renderização (Fluxo de Sinais)
            </h4>
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-0 relative">
                {/* Node 1: Input */}
                <div className="flex-1 w-full relative group">
                    <div className="flex items-center gap-3 p-3 bg-slate-800 border border-slate-700 rounded-lg relative z-10 hover:border-orange-500/50 transition-colors">
                        <div className="bg-orange-500/20 p-2 rounded text-orange-400">
                            {GetIcon('film', 'w-5 h-5')}
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 font-mono">VHS_LoadVideo</div>
                            <div className="text-xs font-bold text-white">Input Source</div>
                        </div>
                    </div>
                    {/* Arrow */}
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-slate-700 -translate-y-1/2 z-0"></div>
                    <div className="hidden md:block absolute top-1/2 -right-1 w-2 h-2 border-t-2 border-r-2 border-slate-700 rotate-45 -translate-y-1/2 z-0"></div>
                </div>

                {/* Node 2: Logic */}
                <div className="flex-1 w-full pl-0 md:pl-6 relative group">
                    <div className="flex items-center gap-3 p-3 bg-slate-800 border border-slate-700 rounded-lg relative z-10 hover:border-purple-500/50 transition-colors">
                        <div className="bg-purple-500/20 p-2 rounded text-purple-400">
                            {GetIcon('sliders', 'w-5 h-5')}
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 font-mono">UpscaleModel</div>
                            <div className="text-xs font-bold text-white">4x-Remacri</div>
                        </div>
                    </div>
                    {/* Arrow */}
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-slate-700 -translate-y-1/2 z-0"></div>
                    <div className="hidden md:block absolute top-1/2 -right-1 w-2 h-2 border-t-2 border-r-2 border-slate-700 rotate-45 -translate-y-1/2 z-0"></div>
                </div>

                {/* Node 3: Processing */}
                <div className="flex-1 w-full pl-0 md:pl-6 relative group">
                    <div className="flex items-center gap-3 p-3 bg-slate-800 border-2 border-cyan-500/30 rounded-lg relative z-10 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                        <div className="bg-cyan-500/20 p-2 rounded text-cyan-400 animate-pulse">
                            {GetIcon('cpu', 'w-5 h-5')}
                        </div>
                        <div>
                            <div className="text-[10px] text-cyan-400 font-mono font-bold">ImageUpscale</div>
                            <div className="text-xs font-bold text-white">RTX Process</div>
                        </div>
                    </div>
                    {/* Arrow */}
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-slate-700 -translate-y-1/2 z-0"></div>
                    <div className="hidden md:block absolute top-1/2 -right-1 w-2 h-2 border-t-2 border-r-2 border-slate-700 rotate-45 -translate-y-1/2 z-0"></div>
                </div>

                {/* Node 4: Output */}
                <div className="flex-1 w-full pl-0 md:pl-6 relative group">
                    <div className="flex items-center gap-3 p-3 bg-slate-800 border border-slate-700 rounded-lg relative z-10 hover:border-emerald-500/50 transition-colors">
                        <div className="bg-emerald-500/20 p-2 rounded text-emerald-400">
                            {GetIcon('download', 'w-5 h-5')}
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 font-mono">VideoCombine</div>
                            <div className="text-xs font-bold text-white">H.264 Save</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex gap-4 text-[10px] text-slate-500 font-mono border-t border-slate-800 pt-3">
                <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                    CPU: Decode/Encode
                </span>
                <span className="flex items-center gap-1.5 text-cyan-500/80 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                    GPU: Tensor Ops (VRAM)
                </span>
            </div>
        </div>
    );
};