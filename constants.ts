import { Step } from './types';

export const BAT_CONTENT = `@echo off
:: Central de Restauro - Script de Pre-Processamento (v4.0)
:: Objetivo: Preparar Mini DV para IA (Desentrelaçar + Pixel Quadrado)

if "%~1" == "" (
    echo.
    echo ========================================================
    echo   ERRO: NENHUM FICHEIRO DE VIDEO ENCONTRADO
    echo ========================================================
    echo   Por favor, ARRASTE E SOLTE o seu ficheiro de video (.mp4)
    echo   diretamente sobre este icone do script.
    echo ========================================================
    echo.
    pause
    exit
)

if not exist "pronto_para_ai" mkdir "pronto_para_ai"

echo.
echo [1/3] A detetar ficheiro: %~n1
echo [2/3] A aplicar correcoes (bwdif=1 + square pixel)...
echo.

:: COMANDO FFMPEG OTIMIZADO PARA MINI DV:
:: - bwdif=mode=1: 60fps progressivo (fluidez total)
:: - scale=iw*sar:ih: Corrige distorcao de aspeto
:: - crf 16: Qualidade de arquivo (quase lossless)

ffmpeg -i "%~1" -vf "bwdif=mode=1,scale=iw*sar:ih" -c:v libx264 -preset slow -crf 16 -c:a copy "pronto_para_ai\%~n1_fixed.mp4"

echo.
echo [3/3] CONCLUIDO! 
echo.
echo O video corrigido esta na pasta: "pronto_para_ai"
echo Utilize ESTE ficheiro no ComfyUI.
echo.
pause`;

export const WORKFLOW_JSON = {
  "last_node_id": 100,
  "last_link_id": 100,
  "nodes": [
    {
      "id": 12,
      "type": "VHS_LoadVideo",
      "pos": [50, 50],
      "size": {"0": 315, "1": 214},
      "flags": {},
      "order": 0,
      "mode": 0,
      "inputs": [],
      "outputs": [
        {"name": "IMAGE", "type": "IMAGE", "links": [15], "slot_index": 0},
        {"name": "frame_count", "type": "INT", "links": null},
        {"name": "audio", "type": "AUDIO", "links": [28]},
        {"name": "video_info", "type": "VHS_VIDEOINFO", "links": null}
      ],
      "widgets_values": ["video_corrigido.mp4", 0, 0, 50, "video", null]
    },
    {
      "id": 15,
      "type": "UpscaleModelLoader",
      "pos": [50, 350],
      "size": {"0": 315, "1": 58},
      "flags": {},
      "order": 1,
      "mode": 0,
      "outputs": [{"name": "UPSCALE_MODEL", "type": "UPSCALE_MODEL", "links": [16]}],
      "widgets_values": ["4x-Remacri.pth"]
    },
    {
      "id": 149,
      "type": "UnetLoaderGGUF",
      "pos": [450, 350],
      "size": [380, 58],
      "widgets_values": ["wan2.1_t2v_14B_q4_k_m.gguf"]
    },
    {
      "id": 16,
      "type": "ImageUpscaleWithModel",
      "pos": [450, 50],
      "size": {"0": 242, "1": 46},
      "flags": {},
      "order": 2,
      "mode": 0,
      "inputs": [
        {"name": "upscale_model", "type": "UPSCALE_MODEL", "link": 16},
        {"name": "image", "type": "IMAGE", "link": 15}
      ],
      "outputs": [{"name": "IMAGE", "type": "IMAGE", "links": [19]}]
    },
    {
      "id": 25,
      "type": "VHS_VideoCombine",
      "pos": [1200, 50],
      "size": {"0": 315, "1": 250},
      "flags": {},
      "order": 6,
      "mode": 0,
      "inputs": [
        {"name": "images", "type": "IMAGE", "link": 19},
        {"name": "audio", "type": "AUDIO", "link": 28}
      ],
      "outputs": [],
      "widgets_values": [{"frame_rate": 60, "loop_count": 0, "filename_prefix": "Wan21_Restauro", "format": "video/h264-mp4", "crf": 18, "save_output": true}]
    }
  ],
  "links": [
    [15, 12, 0, 16, 1, "IMAGE"],
    [16, 15, 0, 16, 0, "UPSCALE_MODEL"],
    [28, 12, 2, 25, 1, "AUDIO"],
    [19, 16, 0, 25, 0, "IMAGE"]
  ],
  "groups": [],
  "version": 0.4
};

export const INITIAL_WORKFLOW: Step[] = [
    {
        id: 'step1',
        title: 'Passo 1: Preparar o Vídeo',
        description: 'Correção física do sinal (Entrelaçamento & Pixel).',
        icon: 'film',
        color: 'bg-cyan-500',
        textColor: 'text-cyan-400',
        badge: 'OBRIGATÓRIO',
        tasks: [
            {
                id: 'check_ffmpeg',
                text: '1. Verificar se o FFmpeg está instalado',
                location: 'Prompt de Comando (Windows)',
                locationColor: 'bg-slate-600',
                detail: 'Abra o menu Iniciar, digite "cmd", abra-o e escreva "ffmpeg -version". Se der erro, precisa instalar o FFmpeg primeiro.',
                done: false
            },
            {
                id: 'dl_script',
                text: '2. Descarregar Script de Correção (.bat)',
                location: 'Mesma pasta do vídeo original',
                locationColor: 'bg-blue-500',
                detail: 'Clique no botão para descarregar o "prepara_minidv.bat". Este script contém os comandos exatos para transformar o vídeo de TV antiga em vídeo de PC (60fps).',
                actionType: 'download',
                actionLabel: 'DESCARREGAR SCRIPT',
                technicalNote: 'Usa filtro bwdif=mode=1 para 60fps progressivo e scale=iw*sar:ih para pixels quadrados.',
                done: false
            },
            {
                id: 'run_script',
                text: '3. Executar a Correção',
                location: 'Explorador de Ficheiros',
                locationColor: 'bg-orange-500',
                detail: 'Pegue no ficheiro do seu vídeo (ex: "natal_98.mp4") e ARRASTE-O para cima do ícone do "prepara_minidv.bat". Uma janela preta vai abrir e criar uma pasta "pronto_para_ai".',
                done: false
            }
        ]
    },
    {
        id: 'step2',
        title: 'Passo 2: Configurar ComfyUI',
        description: 'Instalação do Workflow Wan2.1 base.',
        icon: 'settings',
        color: 'bg-purple-500',
        textColor: 'text-purple-400',
        tasks: [
            {
                id: 'dl_json',
                text: '1. Descarregar Workflow (.json)',
                location: 'Pasta de Transferências',
                locationColor: 'bg-blue-500',
                detail: 'Descarregue o ficheiro de estrutura do workflow. Este é o cérebro da operação.',
                actionType: 'download',
                actionLabel: 'DESCARREGAR JSON',
                technicalNote: 'Contém nós VHS, UpscaleModelLoader e ImageUpscaleWithModel pré-conectados com Remacri.',
                done: false
            },
            {
                id: 'load_json',
                text: '2. Importar no ComfyUI',
                location: 'Janela do ComfyUI',
                locationColor: 'bg-purple-500',
                detail: 'Arraste o ficheiro .json que acabou de descarregar para dentro da janela do ComfyUI. Os nós vão aparecer.',
                done: false
            },
            {
                id: 'install_missing',
                text: '3. Instalar Nós em Falta',
                location: 'ComfyUI Manager',
                locationColor: 'bg-red-500',
                detail: 'Se vir caixas vermelhas, clique em "Manager" > "Install Missing Custom Nodes". Instale tudo e reinicie.',
                done: false
            }
        ]
    },
    {
        id: 'step3',
        title: 'Passo 3: Executar (Render)',
        description: 'Configuração final e início.',
        icon: 'play',
        color: 'bg-emerald-500',
        textColor: 'text-emerald-400',
        visualType: 'workflow_diagram',
        tasks: [
            {
                id: 'select_video',
                text: '1. Carregar Vídeo Corrigido',
                location: 'Nó "VHS Load Video" (Laranja)',
                locationColor: 'bg-orange-500',
                detail: 'Clique em "Upload Video" e navegue até à pasta "pronto_para_ai". Selecione o ficheiro que termina em "_fixed.mp4". NÃO use o original.',
                done: false
            },
            {
                id: 'check_res',
                text: '2. Validar Resolução (1440x1080)',
                location: 'Nós de Configuração',
                locationColor: 'bg-slate-500',
                detail: 'Certifique-se de que a saída não está em 4K. Use 1440x1080 (4:3) para evitar sobrecarga.',
                done: false
            },
            {
                id: 'queue',
                text: '3. Iniciar (Queue Prompt)',
                location: 'Barra lateral direita',
                locationColor: 'bg-emerald-600',
                detail: 'Clique em Queue Prompt. O processamento vai começar. Acompanhe a barra verde.',
                done: false
            }
        ]
    }
];