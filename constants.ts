import { Step } from './types';

export const BAT_CONTENT = `@echo off
:: Central de Restauro - Script Hibrido (v6.0 - Selectable Mode)
:: Objetivo: Processamento inteligente baseado na fonte (Analógico vs Digital)

if "%~1" == "" (
    cls
    color 0E
    echo.
    echo ========================================================
    echo   MODO DE ESPERA (v6.0)
    echo ========================================================
    echo.
    echo   Para processar, ARRASTE o video sobre este arquivo.
    echo.
    pause
    exit
)

color 0B
cls
echo ========================================================
echo   DIAGNOSTICO DE FONTE
echo ========================================================
echo.
echo   Arquivo detectado: %~nx1
echo.
echo   Identifique a origem do material para definir a engenharia:
echo.
echo   [1] ANALOGICO / ENTRELACADO (VHS, MiniDV, TV Antiga)
echo       - Acao: Aplica filtro "bwdif" (Desentrelaçar 60fps)
echo       - Use se ver "riscas horizontais" (combing) na imagem.
echo.
echo   [2] DIGITAL / PROGRESSIVO (Internet, Celular, Rips)
echo       - Acao: Pass-through (Mantem pixels originais)
echo       - Apenas padroniza o codec para CRF 16 (Alta Qualidade).
echo       - RECOMENDADO PARA SEU ARQUIVO "SANTA CATARINA.mp4"
echo.
set /p mode="> Digite 1 ou 2 e pressione ENTER (Padrao=2): " || set mode=2

if "%mode%"=="1" goto MODE_INTERLACED
if "%mode%"=="2" goto MODE_PROGRESSIVE
goto MODE_PROGRESSIVE

:MODE_INTERLACED
set "filters=-vf bwdif=mode=1,scale=iw*sar:ih"
set "tag=_fixed_analog"
goto PROCESS

:MODE_PROGRESSIVE
:: Apenas garante Pixel Quadrado se necessario, sem desentrelaçar
set "filters=-vf scale=iw*sar:ih"
set "tag=_optimized_digital"
goto PROCESS

:PROCESS
cd /d "%~dp0"
if not exist "pronto_para_ai" mkdir "pronto_para_ai"

cls
echo.
echo   ENGENHARIA EM ANDAMENTO...
echo   Modo: %mode% | Filtros: %filters%
echo.

ffmpeg -i "%~1" %filters% -c:v libx264 -preset slow -crf 16 -c:a copy "pronto_para_ai\%~n1%tag%.mp4"

if %errorlevel% neq 0 (
    color 0C
    echo [ERRO] Falha no FFMPEG.
    pause
    exit
)

color 0A
echo.
echo   [SUCESSO] Arquivo gerado em "pronto_para_ai"
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
        title: 'Passo 1: Padronização Híbrida',
        description: 'Seletor inteligente: Analógico (Desentrelaça) vs Digital (Otimiza).',
        icon: 'cpu',
        color: 'bg-blue-600', 
        textColor: 'text-blue-300',
        badge: 'ATUALIZADO v6.0',
        tasks: [
            {
                id: 'dl_script',
                text: '1. Descarregar "Engenheiro de Video v6.0"',
                location: 'Pasta do Projeto',
                locationColor: 'bg-blue-600',
                detail: 'Script atualizado. Ao executar, digite "2" para o seu arquivo "SANTA CATARINA.mp4" (Progressivo).',
                actionType: 'download',
                actionLabel: 'BAIXAR SCRIPT HÍBRIDO v6.0',
                technicalNote: 'v6.0: Adicionado menu de seleção. Modo 2 evita filtros destrutivos em mídia digital.',
                done: false
            },
            {
                id: 'run_script',
                text: '2. Processar Arquivo',
                location: 'CMD / Explorer',
                locationColor: 'bg-slate-600',
                detail: 'Arraste o vídeo para o .bat e escolha a opção correta no menu preto que abrir.',
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
                detail: 'Estrutura de nós otimizada para Upscale 4x.',
                actionType: 'download',
                actionLabel: 'DESCARREGAR JSON',
                technicalNote: 'Workflow padrão (UpscaleModelLoader -> ImageUpscaleWithModel).',
                done: false
            },
            {
                id: 'load_json',
                text: '2. Importar no ComfyUI',
                location: 'Janela do ComfyUI',
                locationColor: 'bg-purple-500',
                detail: 'Arraste o JSON para a interface.',
                done: false
            },
            {
                id: 'install_missing',
                text: '3. Instalar Dependências',
                location: 'ComfyUI Manager',
                locationColor: 'bg-red-500',
                detail: 'Use o Manager para instalar nós faltantes (VHS Video Helper, etc).',
                done: false
            }
        ]
    },
    {
        id: 'step3',
        title: 'Passo 3: Renderização Final',
        description: 'Upscale 4x (Resultante: ~1440p)',
        icon: 'play',
        color: 'bg-emerald-500',
        textColor: 'text-emerald-400',
        visualType: 'workflow_diagram',
        tasks: [
            {
                id: 'select_video',
                text: '1. Carregar Vídeo Otimizado',
                location: 'Nó VHS Load Video',
                locationColor: 'bg-orange-500',
                detail: 'Selecione o arquivo da pasta "pronto_para_ai" (terminado em _optimized_progressive.mp4).',
                done: false
            },
            {
                id: 'queue',
                text: '2. Iniciar Processamento',
                location: 'Queue Prompt',
                locationColor: 'bg-emerald-600',
                detail: 'O modelo Remacri vai multiplicar sua resolução de 490x360 por 4x (1960x1440).',
                done: false
            }
        ]
    }
];