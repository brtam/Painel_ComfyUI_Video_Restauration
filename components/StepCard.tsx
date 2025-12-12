import React, { useState } from 'react';
import { Step } from '../types';
import { GetIcon } from './Icons';
import { downloadFile } from '../utils/fileUtils';
import { BAT_CONTENT, WORKFLOW_JSON } from '../constants';
import { WorkflowVisualizer } from './WorkflowVisualizer';

interface StepCardProps {
    step: Step;
    onToggleTask: (stepId: string, taskId: string) => void;
}

export const StepCard: React.FC<StepCardProps> = ({ step, onToggleTask }) => {
    const [expandedDetail, setExpandedDetail] = useState<string | null>(null);
    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    const handleAction = (taskId: string, actionType?: string) => {
        if (!actionType) return;
        
        // Immediate visual feedback start
        setLoadingAction(taskId);
        
        // Simulate processing time for better UX (System Feedback)
        setTimeout(() => {
            if (taskId === 'dl_script') {
                downloadFile('prepara_minidv.bat', BAT_CONTENT);
            } else if (taskId === 'dl_json') {
                downloadFile('Workflow_Wan21_v4.json', JSON.stringify(WORKFLOW_JSON, null, 2));
            }
            // Reset state
            setLoadingAction(null);
        }, 800);
    };

    return (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden mb-6 animate-fade-in shadow-lg hover:border-slate-600 transition-colors group">
            <div className="p-5 bg-slate-900/60 border-b border-slate-700/50 flex items-center gap-4">
                <div className={`p-3 rounded-lg ${step.color} bg-opacity-20`}>
                    {GetIcon(step.icon, `w-6 h-6 ${step.textColor}`)}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-slate-100">{step.title}</h3>
                        {step.badge && <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-700 text-slate-300 px-2 py-0.5 rounded ml-2 shadow-sm">{step.badge}</span>}
                    </div>
                    <p className="text-sm text-slate-400">{step.description}</p>
                </div>
            </div>

            {step.visualType === 'workflow_diagram' && (
                <WorkflowVisualizer />
            )}
            
            <div className="divide-y divide-slate-700/30">
                {step.tasks.map(task => (
                    <div key={task.id} className={`p-5 transition-all ${task.done ? 'bg-emerald-900/10' : 'hover:bg-slate-800/40'}`}>
                        <div className="flex items-start gap-4">
                            <button 
                                onClick={() => onToggleTask(step.id, task.id)}
                                className="mt-1 transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 rounded-full"
                                aria-label={task.done ? "Marcar como não feito" : "Marcar como feito"}
                                aria-pressed={task.done}
                            >
                                {task.done 
                                    ? GetIcon('check', "w-6 h-6 text-emerald-500") 
                                    : GetIcon('circle', "w-6 h-6 text-slate-600 hover:text-slate-400")
                                }
                            </button>
                            
                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                    <span 
                                        onClick={() => onToggleTask(step.id, task.id)}
                                        className={`font-medium cursor-pointer select-none transition-colors ${task.done ? 'text-slate-500 line-through' : 'text-slate-200 hover:text-white'}`}
                                    >
                                        {task.text}
                                    </span>
                                    
                                    {task.actionType && !task.done && (
                                        <button 
                                            onClick={() => handleAction(task.id, task.actionType)}
                                            disabled={loadingAction === task.id}
                                            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white rounded shadow-lg transition-all transform border whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-400
                                                ${loadingAction === task.id 
                                                    ? 'bg-cyan-700 border-cyan-500 scale-95 cursor-wait opacity-90 shadow-inner' 
                                                    : 'bg-blue-600 hover:bg-blue-500 hover:-translate-y-0.5 border-blue-400/30'
                                                }`}
                                        >
                                            {loadingAction === task.id ? (
                                                <React.Fragment>
                                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>PROCESSANDO...</span>
                                                </React.Fragment>
                                            ) : (
                                                <React.Fragment>
                                                    {GetIcon('download', "w-3 h-3")}
                                                    {task.actionLabel}
                                                </React.Fragment>
                                            )}
                                        </button>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                     <div className="text-xs text-slate-400 font-mono bg-slate-950/50 p-1.5 px-2.5 rounded border border-slate-800 flex gap-2 items-center w-fit">
                                        <div className={`w-2 h-2 rounded-full ${task.locationColor || 'bg-slate-500'}`}></div>
                                        <strong className="text-slate-500 uppercase tracking-wide text-[10px]">ONDE:</strong>
                                        <span className="text-cyan-100">{task.location}</span>
                                    </div>
                                </div>

                                <div>
                                    <button 
                                        onClick={() => setExpandedDetail(expandedDetail === task.id ? null : task.id)}
                                        className="text-xs text-cyan-500 hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors mt-1 focus:outline-none focus:underline"
                                    >
                                        {GetIcon('info', "w-3 h-3")}
                                        {expandedDetail === task.id ? "Ocultar Detalhes" : "Como fazer?"}
                                    </button>
                                    
                                    {expandedDetail === task.id && (
                                        <div className="mt-3 p-3 bg-slate-900/80 border border-slate-700/50 rounded-lg text-sm text-slate-300 leading-relaxed animate-fade-in shadow-inner">
                                            <p>{task.detail}</p>
                                            {task.technicalNote && (
                                                <div className="mt-2 text-xs text-slate-500 border-t border-slate-700 pt-2 flex gap-1">
                                                    <strong className="text-slate-400">Nota Técnica:</strong> <span className="font-mono">{task.technicalNote}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};