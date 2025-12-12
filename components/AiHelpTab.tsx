import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { GetIcon } from './Icons';

interface Message {
    role: 'user' | 'model';
    text: string;
}

export const AiHelpTab: React.FC = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { 
            role: 'model', 
            text: 'Sistema Online. Sou o seu Assistente de Engenharia. Posso ajudar com configurações do FFmpeg, nós do ComfyUI ou diagnósticos de vídeo MiniDV. Em que posso ser útil?' 
        }
    ]);
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !process.env.API_KEY) return;

        const userMsg = input;
        setInput('');
        
        // Optimistic update
        const newHistory: Message[] = [...messages, { role: 'user', text: userMsg }];
        setMessages(newHistory);
        setIsThinking(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // OPTIMIZATION: Context Window Management
            // 1. Filter out the static initial greeting to strictly follow API protocol (User first).
            // 2. Slice to take only the last 10 messages. This keeps the prompt lean and fast (Flash Lite).
            const contextHistory = newHistory
                .filter((_, index) => index > 0) // Remove the initial "System Online" greeting (index 0)
                .slice(-10) // Keep only last 10 turns for low latency
                .map(m => ({
                    role: m.role,
                    parts: [{ text: m.text }]
                }));

            const stream = await ai.models.generateContentStream({
                model: 'gemini-2.5-flash-lite',
                contents: contextHistory,
                config: {
                    systemInstruction: "Tu és um Engenheiro de Vídeo Sênior e Especialista em ComfyUI. Responde de forma técnica, direta e pragmática (Estilo 'Hard Tech'). Foca-te em FFmpeg, Upscaling, Deinterlacing (bwdif), e hardware Nvidia (RTX 3060). Evita floreados. Dá exemplos de código ou JSON quando relevante.",
                }
            });

            let fullResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of stream) {
                const chunkText = chunk.text;
                if (chunkText) {
                    fullResponse += chunkText;
                    setMessages(prev => {
                        const updated = [...prev];
                        updated[updated.length - 1].text = fullResponse;
                        return updated;
                    });
                }
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', text: 'ERRO CRÍTICO: Falha na conexão com o núcleo neural (API Error). Verifique a chave de acesso.' }]);
        } finally {
            setIsThinking(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-0 animate-fade-in flex flex-col h-[600px] overflow-hidden">
            {/* Header */}
            <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center gap-3">
                <div className="bg-cyan-900/30 p-2 rounded-lg text-cyan-400 animate-pulse">
                    {GetIcon('cpu', "w-5 h-5")}
                </div>
                <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Engenharia Assistida (Flash-Lite)</h2>
                    <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        LATENCY: OPTIMIZED
                    </p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm bg-slate-900/80">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-lg border ${
                            msg.role === 'user' 
                                ? 'bg-slate-800 border-slate-700 text-slate-200 rounded-tr-none' 
                                : 'bg-slate-950/80 border-cyan-900/30 text-cyan-100 rounded-tl-none shadow-[0_0_10px_rgba(8,145,178,0.1)]'
                        }`}>
                            <div className="whitespace-pre-wrap">{msg.text}</div>
                        </div>
                    </div>
                ))}
                {isThinking && (
                    <div className="flex justify-start animate-pulse">
                        <div className="bg-slate-950/80 border border-cyan-900/30 text-cyan-500 p-2 rounded-lg text-xs font-mono">
                            > PROCESSANDO_DADOS...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-950 border-t border-slate-800">
                <div className="relative flex items-center gap-2">
                    <div className="absolute left-3 text-slate-500">
                        {GetIcon('messageSquare', "w-4 h-4")}
                    </div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Digite um comando ou dúvida técnica..."
                        className="w-full bg-slate-900 border border-slate-700 text-white pl-10 pr-12 py-3 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm placeholder:text-slate-600"
                        autoFocus
                    />
                    <button 
                        onClick={handleSend}
                        disabled={isThinking || !input.trim()}
                        className="absolute right-2 p-1.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {GetIcon('play', "w-4 h-4")}
                    </button>
                </div>
                <div className="text-[10px] text-slate-600 mt-2 text-center font-mono">
                    MODEL: gemini-2.5-flash-lite • WINDOW: 10 TURNS
                </div>
            </div>
        </div>
    );
};