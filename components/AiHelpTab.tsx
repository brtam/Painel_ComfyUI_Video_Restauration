import React, { useEffect, useRef, useState } from 'react';
import { GetIcon } from './Icons';

interface Message {
    role: 'user' | 'model';
    text: string;
}

const OFFLINE_GUIDES = [
    {
        keywords: ['ffmpeg', 'bitrate', 'encode', 'h264', 'h.264'],
        response: `Fluxo de encode FFmpeg enxuto:
- Remux rápido: ffmpeg -i input.mov -c copy output.mkv
- H.264 equilibrado: ffmpeg -i input.mov -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a copy out.mp4
- Forçar bitrate alvo: use -maxrate e -bufsize (ex.: -maxrate 12M -bufsize 24M) para segurar picos em upload.`
    },
    {
        keywords: ['bwdif', 'deinterlace', 'interlaced', 'entrelaçado'],
        response: `Deinterlacing seguro (bwdif):
- Com detecção automática: ffmpeg -i input.mov -vf bwdif=mode=send_field:parity=auto:deint=all -c:a copy out.mp4
- Se o material for sempre entrelaçado, fixe parity=top ou bottom.
- Ao exportar para upscaling, mantenha -preset medium e -crf 17 para preservar detalhes.`
    },
    {
        keywords: ['upscale', 'upscaling', 'superscale', 'topaz', '4k'],
        response: `Pipeline de upscale sugerido:
1) Limpe e deinterlace primeiro (bwdif) para evitar duplicar artefatos.
2) Gere intermediário de alta qualidade (ProRes 422 HQ ou H.264 crf 16).
3) Use o modelo de upscale com redução de ruído moderada (denoise médio) para MiniDV.
4) Finalize em H.265 (crf 18, preset slow) ou entregue ProRes se houver edição posterior.`
    },
    {
        keywords: ['gpu', 'vram', 'rtx', '3060', 'placa'],
        response: `Gerenciamento de VRAM (referência RTX 3060 12 GB):
- Carga segura para AI: lotes pequenos (1–2) e latente máx. 12 para evitar swap.
- Em vídeo: prefira codificar via CPU (libx264) quando o pipeline de IA estiver ativo.
- Monitore memórias: evite abrir múltiplas pré-visualizações 4K simultâneas.`
    },
    {
        keywords: ['comfyui', 'workflow', 'nó', 'nodes', 'comfy'],
        response: `Boas práticas no ComfyUI:
- Padronize resoluções de entrada e saída para evitar reescalações internas.
- Agrupe nós em blocos lógicos (preprocessamento, inferência, pós) e salve presets.
- Use checkpointers e VAE compatíveis; carregue VAE apenas uma vez por sessão para economizar VRAM.
- Logue parâmetros chave (seed, steps, sampler) junto do output final para reprodutibilidade.`
    }
];

const FALLBACK_RESPONSE = `Assistente offline ativo.
Posso ajudar com:
- FFmpeg (bitrate, CRF, deinterlace bwdif)
- Sequência de restauração (limpeza, upscale, encode)
- Regras rápidas para ComfyUI e gestão de VRAM
Envie termos-chave para receber um roteiro curto.`;

const QUICK_PROMPTS = [
    'Comando FFmpeg para exportar em 1080p com qualidade alta',
    'Como evitar estouro de VRAM na RTX 3060 enquanto processo IA',
    'Passo a passo para restaurar fita VHS no ComfyUI',
    'Qual preset de encode usar para subir vídeo no YouTube',
    'Fluxo de limpeza + upscale antes de exportar em H.265'
];

const buildOfflineAnswer = (prompt: string) => {
    const normalized = prompt.toLowerCase();
    const matched = OFFLINE_GUIDES.find(item => item.keywords.some(key => normalized.includes(key)));

    if (matched) {
        return matched.response;
    }

    return `${FALLBACK_RESPONSE}\n\nDica imediata: especifique se precisa de comando (ex.: \"ffmpeg 1080p\") ou otimização de hardware.`;
};

export const AiHelpTab: React.FC = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'model',
            text: 'Assistente offline carregado. Clique em um atalho ou escreva em linguagem simples; nenhuma API é necessária.'
        }
    ]);
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');

        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsThinking(true);

        setTimeout(() => {
            const answer = buildOfflineAnswer(userMsg);
            setMessages(prev => [...prev, { role: 'model', text: answer }]);
            setIsThinking(false);
        }, 150);
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
                    {GetIcon('cpu', 'w-5 h-5')}
                </div>
                <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Assistência Técnica Offline</h2>
                    <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Modo local • Sem chamadas externas
                    </p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm bg-slate-900/80">
                <div className="bg-slate-800/60 border border-slate-700/70 rounded-lg p-3 text-[11px] text-slate-200 space-y-2">
                    <p className="font-semibold text-white">Atalhos rápidos</p>
                    <p className="text-slate-300">Escolha um atalho ou escreva com suas próprias palavras. Tudo roda localmente e você verá um roteiro curto.</p>
                    <div className="flex flex-wrap gap-2">
                        {QUICK_PROMPTS.map(prompt => (
                            <button
                                key={prompt}
                                type="button"
                                onClick={() => setInput(prompt)}
                                className="text-left bg-slate-900/70 border border-slate-700 text-slate-100 px-3 py-2 rounded-lg hover:border-cyan-600 hover:text-white transition text-[11px]"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                </div>

                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-[85%] p-3 rounded-lg border ${
                                msg.role === 'user'
                                    ? 'bg-slate-800 border-slate-700 text-slate-200 rounded-tr-none'
                                    : 'bg-slate-950/80 border-cyan-900/30 text-cyan-100 rounded-tl-none shadow-[0_0_10px_rgba(8,145,178,0.1)]'
                            }`}
                        >
                            <div className="whitespace-pre-wrap">{msg.text}</div>
                        </div>
                    </div>
                ))}
                {isThinking && (
                    <div className="flex justify-start animate-pulse">
                        <div className="bg-slate-950/80 border border-cyan-900/30 text-cyan-500 p-2 rounded-lg text-xs font-mono">
                            &gt; COMPILANDO RESPOSTA LOCAL...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-950 border-t border-slate-800">
                <div className="relative flex items-center gap-2">
                    <div className="absolute left-3 text-slate-500">
                        {GetIcon('messageSquare', 'w-4 h-4')}
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
                        {GetIcon('play', 'w-4 h-4')}
                    </button>
                </div>
                <div className="text-[10px] text-slate-600 mt-2 text-center font-mono">
                    MODELO: Heurística local • Base de roteiros offline
                </div>
            </div>
        </div>
    );
};
