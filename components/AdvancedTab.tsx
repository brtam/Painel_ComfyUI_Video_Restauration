import React from 'react';
import { GetIcon } from './Icons';

export const AdvancedTab: React.FC = () => (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="bg-orange-500/10 p-2 rounded-lg">
                {GetIcon('sliders', "w-6 h-6 text-orange-400")}
            </div>
            <div>
                <h2 className="text-xl font-bold text-white">Ajustes Finos (RTX 3060)</h2>
                <p className="text-xs text-slate-400 uppercase">Configurações para utilizadores experientes</p>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    {GetIcon('cpu', "w-4 h-4")} Upscale & Memória
                </h3>
                <ul className="space-y-2 text-sm text-slate-300 bg-slate-950/30 p-4 rounded-lg border border-slate-800">
                    <li className="flex justify-between border-b border-slate-800/50 pb-2">
                        <span>Scale</span>
                        <span className="font-mono text-white">2.0x (Mini DV)</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-800/50 pb-2">
                        <span>Tile Size</span>
                        <span className="font-mono text-white">128 - 192</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-800/50 pb-2">
                        <span>Tile Overlap</span>
                        <span className="font-mono text-white">16 - 24</span>
                    </li>
                    <li className="flex justify-between pt-1">
                        <span>Half Precision</span>
                        <span className="font-mono text-emerald-400 font-bold">Ativado (True)</span>
                    </li>
                </ul>
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                    {GetIcon('fileCode', "w-4 h-4")} Exportação
                </h3>
                <ul className="space-y-2 text-sm text-slate-300 bg-slate-950/30 p-4 rounded-lg border border-slate-800">
                    <li className="flex justify-between border-b border-slate-800/50 pb-2">
                        <span>CRF (Qualidade)</span>
                        <span className="font-mono text-white">18 - 20</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-800/50 pb-2">
                        <span>Frames/Iteração</span>
                        <span className="font-mono text-white">60 - 120</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-800/50 pb-2">
                        <span>Overlap Frames</span>
                        <span className="font-mono text-white">8 - 16</span>
                    </li>
                    <li className="flex justify-between pt-1">
                        <span>Codec</span>
                        <span className="font-mono text-white">H.264 / mp4</span>
                    </li>
                </ul>
            </div>
        </div>

        <div className="pt-6 border-t border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                {GetIcon('book', "w-4 h-4 text-blue-400")} Guia de Modelos (Mini DV)
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                    <strong className="text-cyan-300 block mb-2 text-sm">RealESR General x4v3</strong>
                    <p className="text-slate-400 leading-relaxed">O padrão ouro para vídeo real. Equilibra limpeza e detalhe sem parecer desenho animado. Bom para uso geral.</p>
                </div>
                <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors ring-1 ring-purple-500/20">
                    <strong className="text-purple-300 block mb-2 text-sm">4x-Remacri</strong>
                    <p className="text-slate-400 leading-relaxed">Excelente para pele humana e cenas naturais. É mais suave que o UltraSharp, ideal para casamentos e festas.</p>
                </div>
                <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                    <strong className="text-orange-300 block mb-2 text-sm">4x UltraSharp</strong>
                    <p className="text-slate-400 leading-relaxed">Muito agressivo. Use apenas para vídeos com muito texto ou detalhes arquitetónicos (prédios, carros).</p>
                </div>
            </div>
        </div>
    </div>
);