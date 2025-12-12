import React from 'react';
import { GetIcon } from './Icons';

interface PrereqModalProps {
    onClose: () => void;
}

export const PrereqModal: React.FC<PrereqModalProps> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 animate-fade-in backdrop-blur-sm">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 relative z-10">
                {GetIcon('alertTriangle', "w-6 h-6 text-yellow-500")}
                Pré-Requisitos do Sistema
            </h3>
            
            <div className="space-y-4 mb-6 text-sm text-slate-300 relative z-10">
                <label className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-750 border border-slate-700/50 hover:border-slate-600 transition-all group">
                    <input type="checkbox" className="mt-1 w-4 h-4 accent-cyan-500" />
                    <div>
                        <strong className="text-white block group-hover:text-cyan-300 transition-colors">FFmpeg Instalado</strong>
                        <span className="text-xs text-slate-400">Necessário para o script .bat funcionar no Windows.</span>
                    </div>
                </label>
                <label className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-750 border border-slate-700/50 hover:border-slate-600 transition-all group">
                    <input type="checkbox" className="mt-1 w-4 h-4 accent-cyan-500" />
                    <div>
                        <strong className="text-white block group-hover:text-cyan-300 transition-colors">ComfyUI Operacional</strong>
                        <span className="text-xs text-slate-400">Instalado e a abrir sem erros no localhost.</span>
                    </div>
                </label>
            </div>
            
            <button 
                onClick={onClose}
                className="w-full py-3 bg-gradient-to-r from-cyan-700 to-blue-700 hover:from-cyan-600 hover:to-blue-600 text-white rounded font-bold transition-all shadow-lg active:scale-[0.98] relative z-10"
            >
                CONFIRMAR E INICIAR
            </button>
        </div>
    </div>
);