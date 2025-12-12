import React, { useState, useEffect, useMemo } from 'react';
import { StepCard } from './components/StepCard';
import { AdvancedTab } from './components/AdvancedTab';
import { AiHelpTab } from './components/AiHelpTab';
import { ToolsTab } from './components/ToolsTab';
import { PrereqModal } from './components/PrereqModal';
import { GetIcon } from './components/Icons';
import { INITIAL_WORKFLOW } from './constants';
import { Step, Task, TabType } from './types';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('workflow');
    const [showModal, setShowModal] = useState(true);
    const [workflowData, setWorkflowData] = useState<Step[]>(INITIAL_WORKFLOW);
    const [isLoaded, setIsLoaded] = useState(false);

    // Smart Persistence Logic (Hydration & Fail-Safe)
    useEffect(() => {
        try {
            const saved = localStorage.getItem('central_v4');
            if (saved) {
                const parsed = JSON.parse(saved);
                
                // Robustness check: Ensure parsed data is actually an array
                if (Array.isArray(parsed) && parsed.length > 0) {
                    const mergedData = INITIAL_WORKFLOW.map(freshStep => {
                        const savedStep = parsed.find((s: Step) => s.id === freshStep.id);
                        if (!savedStep) return freshStep;

                        return {
                            ...freshStep,
                            tasks: freshStep.tasks.map(freshTask => {
                                const savedTask = savedStep.tasks.find((t: Task) => t.id === freshTask.id);
                                return savedTask ? { ...freshTask, done: savedTask.done } : freshTask;
                            })
                        };
                    });
                    setWorkflowData(mergedData);
                } else {
                    // Start fresh if data structure doesn't match expected array
                    throw new Error("Invalid storage structure detected");
                }
            }
        } catch (e) {
            console.warn("Storage corruption detected. Resetting to default state.", e);
            // Fallback: Clear corrupted data to prevent future boot loops
            localStorage.removeItem('central_v4');
            setWorkflowData(INITIAL_WORKFLOW);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('central_v4', JSON.stringify(workflowData));
        }
    }, [workflowData, isLoaded]);

    const toggleTask = (stepId: string, taskId: string) => {
        setWorkflowData(prev => prev.map(step => {
            if (step.id !== stepId) return step;
            return {
                ...step,
                tasks: step.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t)
            };
        }));
    };

    // UX Improvement: Soft Reset without page reload
    const resetProgress = () => {
        if(confirm("Reiniciar todo o progresso?")) {
            localStorage.removeItem('central_v4');
            setWorkflowData(INITIAL_WORKFLOW);
            setActiveTab('workflow'); // Reset view to start
            setShowModal(true); // Optional: Show welcome modal again
        }
    };

    // Performance Optimization: Memoize progress calculation
    const { totalTasks, completedTasks, progress } = useMemo(() => {
        const total = workflowData.reduce((acc, s) => acc + s.tasks.length, 0);
        const completed = workflowData.reduce((acc, s) => acc + s.tasks.filter(t => t.done).length, 0);
        const prog = total === 0 ? 0 : Math.round((completed / total) * 100);
        
        return { totalTasks: total, completedTasks: completed, progress: prog };
    }, [workflowData]);

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-screen font-sans text-slate-200">
            {showModal && <PrereqModal onClose={() => setShowModal(false)} />}

            {/* Header */}
            <header className="mb-8 flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-6 gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-cyan-600 to-blue-700 p-3 rounded-xl shadow-lg shadow-cyan-900/30 ring-1 ring-cyan-500/50">
                        {GetIcon('cpu', "w-8 h-8 text-white")}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Central de Restauro <span className="text-cyan-400">v4.0</span></h1>
                        <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mt-1 flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                             Engenharia Híbrida • RTX 3060
                        </p>
                    </div>
                </div>
                
                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                    <div className="flex justify-between items-center w-full md:w-64">
                         <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Status Global</div>
                         <div className={`font-mono font-bold text-sm ${progress === 100 ? 'text-emerald-400' : 'text-cyan-400'}`}>{progress}%</div>
                    </div>
                    
                    {/* Segmented Progress Bar */}
                    <div className="flex gap-1 w-full md:w-64 h-2">
                        {Array.from({ length: totalTasks }).map((_, i) => (
                            <div 
                                key={i}
                                className={`flex-1 rounded-full transition-all duration-500 ${i < completedTasks ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]' : 'bg-slate-800'}`}
                            ></div>
                        ))}
                    </div>

                    <button 
                        onClick={resetProgress} 
                        className="text-[10px] text-slate-600 hover:text-red-400 flex items-center gap-1 mt-1 transition-colors" 
                        title="Reiniciar Painel"
                    >
                        {GetIcon('rotateCcw', "w-3 h-3")} Reiniciar
                    </button>
                </div>
            </header>

            {/* Navigation */}
            <nav className="flex gap-2 mb-8 bg-slate-900/50 p-1 rounded-lg border border-slate-800 w-fit mx-auto md:mx-0 shadow-sm flex-wrap">
                <button 
                    onClick={() => setActiveTab('workflow')}
                    className={`px-6 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'workflow' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
                >
                    Passo a Passo
                </button>
                <button 
                    onClick={() => setActiveTab('tools')}
                    className={`px-6 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'tools' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
                >
                    {GetIcon('tool', "w-4 h-4")}
                    Toolbox (Eng)
                </button>
                <button 
                    onClick={() => setActiveTab('advanced')}
                    className={`px-6 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'advanced' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
                >
                    Avançado
                </button>
                <button 
                    onClick={() => setActiveTab('ai_help')}
                    className={`px-6 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'ai_help' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
                >
                    {GetIcon('messageSquare', "w-4 h-4")}
                    Ajuda IA
                </button>
            </nav>

            {/* Main Content */}
            <main className="animate-fade-in">
                {activeTab === 'workflow' ? (
                    <React.Fragment>
                        {workflowData.map(step => (
                            <StepCard 
                                key={step.id} 
                                step={step} 
                                onToggleTask={toggleTask} 
                            />
                        ))}
                    </React.Fragment>
                ) : activeTab === 'advanced' ? (
                    <AdvancedTab />
                ) : activeTab === 'tools' ? (
                    <ToolsTab />
                ) : (
                    <AiHelpTab />
                )}
            </main>

            {/* Footer */}
            <footer className="mt-12 text-center text-slate-600 text-[10px] border-t border-slate-800/50 pt-6">
                <p className="uppercase tracking-widest font-bold mb-2">3D Creative • Engenharia Local • v4.0</p>
                <p className="opacity-50">Sistema otimizado para operação offline e gestão de processos de alta performance.</p>
            </footer>
        </div>
    );
};

export default App;