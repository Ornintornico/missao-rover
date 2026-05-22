import ambientMusic from "./assets/AmbienteOficina.mp3";
import introMusic from "./assets/TemaInicio.mp3";
import padImg from "./assets/P.A.D.png";
import React, { memo, useEffect, useRef, useState } from "react";
import { useMissionAudio } from "./audio/useMissionAudio";

import falhaTempoImg from "./assets/falha-tempo.png";
import falhaPlanetaImg from "./assets/falha-planeta.png";
import vitoriaImg from "./assets/vitoria.png";
import backgroundImg from "./assets/background.png";

const EXPERIMENTS = [
  {
    phase: "FASE 1",
    code: "EXP-01",
    title: "Análise de Estrutura",
    description:
      "P.A.D enviou amostras de uma rocha lisa.",
    science:
      "Os sensores detectaram um matérial sólido de origem vulcânica, talvez seja da superfície do Planeta. O material deve ser analisado cuidadosamente com o auxílio do super foco tecnológico.",
  },
  {
    phase: "FASE 2",
    code: "EXP-02",
    title: "Camaleão da Escala",
    description:
      "P.A.D enviou uma amostra que reage com nosso indicador.",
    science:
      "A substância reage estranhamente com nosso indicador, talvez P.A.D esteja tentando dar instruções sobre as condições de Ph do Planeta.",
  },
  {
    phase: "FASE 3",
    code: "EXP-03",
    title: "Teste Pirognóstico",
    description:
      "P.A.D enviou análises geológicas.",
    science:
      "As amostras de P.A.D emitem uma luz estranhamente chamativa, talvez nosso amigo esteja tentando nos mostrar a composição Química do Planeta.",
  },
];

const PLANETS = [
  {
    name: "Mercúrio",
    type: "Rochoso",
    colors: "Vermelho queimado, marrom escuro e tons metálicos, sugeridos pela superfície aquecida e pela exosfera rarefeita.",
    acidBase: "Sem atmosfera significativa; os gases ao redor são muito raros para indicar acidez/basicidade atmosférica relevante.",
    img: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg",
    facts: [
      "Possui superfície com marcas de antigas atividades vulcânicas.",
      "Atualmente é considerado vulcanicamente inativo.",
      "Possui apenas uma exosfera extremamente rarefeita, não uma atmosfera densa.",
      "Possui temperaturas extremas.",
    ],
  },
  {
    name: "Vênus",
    type: "Rochoso",
    colors: "Verde amarelado, amarelo-pálido e branco, destacando a acidez das nuvens densas.",
    acidBase: "Atmosfera muito ácida, com nuvens de ácido sulfúrico.",
    img: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg",
    facts: [
      "2º planeta do Sistema Solar.",
      "Atmosfera rica em CO₂.",
      "Planeta mais quente do Sistema Solar.",
      "Não possui luas.",
    ],
  },
  {
    name: "Marte",
    type: "Rochoso",
    colors: "Vermelho, laranja e marrom por óxidos de ferro.",
    acidBase: "Atmosfera fina de CO2; sem pista principal de acidez/basicidade para a missão.",
    img: "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg",
    facts: [
      "Conhecido como Planeta Vermelho.",
      "Possui duas luas: Fobos e Deimos.",
      "Possui sinais de água no passado.",
      "Temperatura muito baixa.",
      "Já foi um planeta vulcânico."
    ],
  },
  {
    name: "Júpiter",
    type: "Gasoso",
    colors: "Faixas amareladas, laranjas, brancas e marrons.",
    acidBase: "Nuvens com amônia; regiões superiores tendem a comportamento básico.",
    img: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg",
    facts: [
      "Maior planeta do Sistema Solar.",
      "Possui a Grande Mancha Vermelha.",
      "Tem dezenas de luas.",
    ],
  },
  {
    name: "Netuno",
    type: "Gasoso",
    colors: "Azul intenso devido ao metano na atmosfera.",
    acidBase: "Atmosfera rica em hidrogênio, hélio e metano; sem indicação simples de acidez ou basicidade.",
    img: "https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg",
    facts: [
      "8º planeta do Sistema Solar.",
      "Possui coloração azul devido ao metano.",
      "Tem ventos muito fortes.",
    ],
  },
];

const INDICATOR_EXPLANATION = [
  "Indicador natural produzido a partir do repolho roxo. Esse extrato é rico em antocianinas, pigmentos naturais pertencentes ao grupo dos flavonoides, capazes de mudar de cor conforme o pH da solução analisada.",
  "Um indicador é uma substância capaz de mostrar, através de mudanças de cor, se um meio é ácido, neutro ou básico. Essas substâncias funcionam porque suas moléculas sofrem alterações químicas quando entram em contato com diferentes concentrações de íons H⁺ presentes na solução. Ao mudar sua estrutura química, o indicador também muda a forma como absorve e reflete a luz, fazendo com que diferentes cores sejam observadas.",
  "O pH indica se uma substância é ácida, neutra ou básica. Em meios ácidos, as antocianinas apresentam tons avermelhados ou rosados. Em soluções neutras, mantêm a coloração roxa característica. Já em meios básicos, podem adquirir tons azulados, esverdeados ou amarelados.",
  "Essas mudanças acontecem porque a estrutura química das antocianinas se altera de acordo com a concentração de íons H⁺ presentes na solução, modificando a forma como a luz é absorvida pela molécula.",
];

const PYROGNOSTIC_EXPLANATION = [
  "Nesse procedimento, pequenas quantidades da amostra são aquecidas em alta temperatura. Quando certos elementos químicos presentes no material recebem energia térmica, seus elétrons passam para níveis mais energéticos. Ao retornarem ao estado original, liberam energia na forma de luz visível, produzindo cores características.",
  "Cada elemento químico emite uma coloração diferente durante a queima. O sódio, por exemplo, produz tons amarelados; o cobre pode gerar coloração esverdeada ou azulada; já o potássio tende a apresentar tons lilases.",
];

const FONT = {
  base: { fontFamily: "Orbitron, Rajdhani, Inter, sans-serif" },
  mono: { fontFamily: "Share Tech Mono, monospace" },
  narrative: { fontFamily: "Inter, sans-serif" },
  panel: { fontFamily: "Rajdhani, sans-serif" },
};

const LOCKED_PLANET_CURSOR = "var(--cursor-locked)";

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function createBackgroundStyle(darkness = 0.82) {
  return {
    ...FONT.base,
    backgroundImage: `linear-gradient(rgba(0,0,0,${darkness}), rgba(0,0,0,0.9)), url(${backgroundImg})`,
  };
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || "Erro inesperado no site.",
    };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-2xl rounded-3xl border border-red-700 bg-red-950/30 p-6 text-center">
          <h1 className="text-3xl font-bold text-red-300 mb-4">Falha no terminal</h1>
          <p className="text-gray-200 mb-4">
            O site encontrou um erro de renderização. Recarregue a página após revisar o código.
          </p>
          <pre className="text-left text-red-200 bg-black/60 rounded-2xl p-4 overflow-auto text-sm">
            {this.state.message}
          </pre>
        </div>
      </div>
    );
  }
}

const DustLayer = memo(function DustLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-35">
      {Array.from({ length: 28 }).map((_, index) => (
        <span
          key={index}
          className="absolute rounded-full bg-orange-200/60 animate-pulse"
          style={{
            width: `${(index % 3) + 1}px`,
            height: `${(index % 3) + 1}px`,
            left: `${(index * 17) % 100}%`,
            top: `${(index * 11) % 100}%`,
            animationDuration: `${2 + (index % 5)}s`,
            animationDelay: `${(index % 8) * 0.4}s`,
            boxShadow: "0 0 8px rgba(255,180,120,0.35)",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,120,0,0.08),transparent_60%)]" />
    </div>
  );
});

const CinematicIntroScreen = memo(function CinematicIntroScreen({ onStart }) {
  const INTRO_DURATION_MS = 72000;
  const [showButton, setShowButton] = useState(false);
  const [introStarted, setIntroStarted] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const musicRef = useRef(null);

  const startMusic = () => {
    if (musicStarted) return;

    if (musicRef.current) {
      musicRef.current.volume = 0.45;
      musicRef.current.play().catch((error) => {
        console.log("Erro ao tocar música:", error);
      });
      setMusicStarted(true);
    }
  };

  const handleStart = () => {
    onStart();
  };

  const handleIntroStart = () => {
    setIntroStarted(true);
    startMusic();
  };

  useEffect(() => {
    if (!introStarted) return undefined;

    const timer = setTimeout(() => {
      setShowButton(true);
    }, INTRO_DURATION_MS);

    return () => clearTimeout(timer);
  }, [introStarted]);

  return (
    <div
      className="min-h-screen overflow-hidden relative bg-black text-yellow-200 flex items-center justify-center"
      style={createBackgroundStyle(0.92)}
    >
      <DustLayer />

<div className="absolute inset-0 bg-black/75 z-0" />

<div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
  <img
  src={padImg}
  alt="P.A.D"
  className="
    absolute
    inset-0
    w-full
    h-full
    object-contain
    opacity-[0.55]
    scale-[1]
    animate-[padPulse_4s_ease-in-out_infinite]
  "
  style={{
    filter:
      "sepia(0.15) brightness(0.9) contrast(1.05)",
  }}
/>

  <div
    className="
      absolute
      inset-0
      bg-gradient-to-r
      from-black/75
      via-black/45
      to-black/80
    "
  />
</div>

      <style>
        {`
        @keyframes padPulse {
  0% {
    opacity: 0.8;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.8;
  }
}
          @keyframes crawl {
  0% {
    transform: translateX(-50%) rotateX(26deg) translateY(62vh);
    opacity: 1;
  }

  92% {
    opacity: 1;
  }

  100% {
    transform: translateX(-50%) rotateX(26deg) translateY(-300vh);
    opacity: 1;
  }
}

.starwars-container {
  perspective: 520px;
  perspective-origin: center bottom;
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.starwars-crawl {
  position: absolute;
  top: 0;
  left: 50%;
  width: min(88vw, 1320px);
  transform-origin: 50% 100%;
  animation: crawl 72s linear forwards;
  color: #facc15;
  font-family: "Orbitron", sans-serif;
  font-weight: 800;
  text-align: justify;
  line-height: 2.15;
  font-size: clamp(1.35rem, 2.6vw, 3rem);
  letter-spacing: 0;
  text-shadow:
    0 0 8px rgba(250, 204, 21, 0.45),
    0 0 22px rgba(250, 204, 21, 0.25);
}

@media (max-width: 640px) {
  .starwars-container {
    perspective: 380px;
  }

  .starwars-crawl {
    width: 92vw;
    line-height: 1.9;
    font-size: clamp(1.05rem, 5.2vw, 1.65rem);
    animation-duration: 82s;
  }
}

          .crawl-title {
            text-align: center;
            margin-bottom: 4rem;
          }

          .crawl-title h1 {
            font-size: clamp(4rem, 9vw, 8rem);
            font-weight: 900;
            color: #facc15;
            text-shadow: 0 0 20px rgba(250,204,21,0.45);
          }

          .crawl-title p {
            font-size: clamp(1rem, 2vw, 1.8rem);
            letter-spacing: 0;
            margin-bottom: 1rem;
          }

          @keyframes fadeButton {
            from {
              opacity: 0;
              transform: translateY(20px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .intro-button {
            animation: fadeButton 1.4s ease forwards;
          }
        `}
      </style>
<audio ref={musicRef} src={introMusic} />

      {!introStarted && (
        <div className="relative z-20 w-full max-w-3xl mx-auto px-6 text-center">
          <p className="uppercase tracking-[0.45em] text-yellow-300 text-xs sm:text-sm mb-5" style={FONT.mono}>
            Transmissão orbital em espera
          </p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-yellow-200 mb-6 drop-shadow-[0_0_22px_rgba(250,204,21,0.35)]">
            Missão P.A.D.
          </h1>
          <p className="text-yellow-100/85 text-lg sm:text-xl leading-relaxed mb-9 max-w-2xl mx-auto" style={FONT.narrative}>
            Inicie a sequência cinematográfica da missão ou avance direto para a transmissão técnica.
          </p>
          <div className="flex justify-center">
            <button
              onClick={handleIntroStart}
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-4 rounded-2xl text-lg font-black shadow-[0_0_40px_rgba(250,204,21,0.42)] transition border border-yellow-100"
            >
              COMEÇAR INTRODUÇÃO
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleStart}
        className="absolute top-5 right-5 z-30 bg-black/65 hover:bg-black/85 text-yellow-100 px-4 py-3 rounded-xl text-sm font-bold transition border border-yellow-300/40 shadow-[0_0_22px_rgba(250,204,21,0.14)]"
      >
        PULAR INTRODUÇÃO
      </button>

      {introStarted && (
      <div className="starwars-container z-10">
        <div className="starwars-crawl">
          <div className="crawl-title">
            <p>MISSÃO P.A.D-01</p>

            <h1>SPORT</h1>
          </div>

          <p>
            Ano 2084.
          </p>

          <p>
            Após décadas de exploração espacial, a Agência Orbital Sul-Americana
            iniciou o programa SPORT para investigar os mistérios químicos dos
            planetas do Sistema Solar.
          </p>

          <p>
            A unidade autônoma P.A.D-01 foi enviada em uma missão experimental
            para coletar amostras atmosféricas e geológicas em regiões
            desconhecidas.
          </p>

          <p>
            Porém, durante uma tempestade gravitacional, a comunicação foi
            severamente comprometida.
          </p>

          <p>
            Apenas pequenos pacotes de dados científicos conseguiram retornar à
            Terra.
          </p>

          <p>
            Agora, a equipe científica deve interpretar os sinais enviados por
            P.A.D para descobrir em qual planeta o rover está preso antes que a
            janela orbital de resgate seja encerrada.
          </p>

          <p>
            O futuro da missão depende da capacidade da equipe em analisar as
            evidências químicas e reconstruir a localização do rover.
          </p>
        </div>
      </div>
      )}

      {introStarted && showButton && (
        <div className="absolute bottom-8 sm:bottom-16 left-1/2 -translate-x-1/2 z-30 intro-button px-4 w-full flex justify-center">
          <button
            onClick={handleStart}
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-black shadow-[0_0_40px_rgba(250,204,21,0.45)] transition border border-yellow-100"
          >
            INICIAR TRANSMISSÃO
          </button>
        </div>
      )}
    </div>
  );
});

const IntroScreen = memo(function IntroScreen({ bootText, timeLeft, onSetMissionTime, onStart }) {
  const missionTimeOptions = [
    { label: "15 min", seconds: 900 },
    { label: "20 min", seconds: 1200 },
    { label: "30 min", seconds: 1800 },
    { label: "45 min", seconds: 2700 },
  ];
  const selectedMinutes = Math.round(timeLeft / 60);
  const applyMinuteDelta = (minutes) => {
    onSetMissionTime(Math.min(120, Math.max(1, selectedMinutes + minutes)) * 60);
  };

  return (
    <div
      className="min-h-screen text-white flex items-center justify-center p-6 relative overflow-hidden bg-cover bg-center"
      style={createBackgroundStyle(0.76)}
    >
      <DustLayer />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:100%_7px] opacity-20" />

      <div className="relative z-10 w-full max-w-5xl bg-black/75 border border-cyan-500/70 rounded-[2rem] p-5 sm:p-8 md:p-12 text-center shadow-[0_0_55px_rgba(34,211,238,0.22)] backdrop-blur-md">
        <h1 className="text-4xl sm:text-5xl md:text-8xl font-extrabold text-cyan-200 leading-tight mb-10 drop-shadow-[0_0_20px_rgba(34,211,238,0.35)] px-2">
          Missão P.A.D.
          <span className="block text-2xl md:text-4xl mt-4 text-cyan-100/90">
            Localização Planetária Desconhecida
          </span>
        </h1>

        <div className="mb-8 text-left bg-black/55 border border-cyan-800/70 rounded-3xl p-5 md:p-7 shadow-[0_0_35px_rgba(34,211,238,0.12)]">
          <p className="uppercase tracking-[0.45em] text-cyan-300 text-xs mb-4" style={FONT.mono}>
            TRANSMISSÃO RECEBIDA
          </p>

          <p className="uppercase tracking-[0.35em] text-cyan-200 text-sm min-h-[24px] mb-6" style={FONT.mono}>
            {bootText}
          </p>

          <div className="space-y-4 text-gray-300 leading-relaxed" style={FONT.narrative}>
            <div>
              <p className="text-orange-300 font-bold mb-1" style={FONT.panel}>
                AGÊNCIA ORBITAL SUL-AMERICANA
              </p>
              <p>Divisão de Exploração Exoplanetária • Programa SPORT</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm" style={FONT.mono}>
              <div className="bg-cyan-950/20 border border-cyan-900/60 rounded-2xl p-4">
                <p>PROTOCOLO: P.A.D-01</p>
                <p>UNIDADE: Pathfinder Autonomous Droid</p>
                <p>SETOR: COMANDO DE CIÊNCIA ORBITAL</p>
                <p>ANO: 2084</p>
              </div>

              <div className="bg-red-950/20 border border-red-900/60 rounded-2xl p-4 text-red-200">
                <p>STATUS: SINAL INSTÁVEL</p>
                <p>PACOTES RECUPERADOS: 12%</p>
                <p>INTEGRIDADE: CRÍTICA</p>
                <p>JANELA ORBITAL LIMITADA</p>
              </div>
            </div>

            <div className="bg-black/45 border border-cyan-900/60 rounded-2xl p-5">
              <p className="text-cyan-300 uppercase tracking-[0.25em] text-xs mb-3" style={FONT.mono}>
                RELATÓRIO AUTOMÁTICO
              </p>
              <p>
                Durante a missão SPORT, a unidade de exploração P.A.D-01 perdeu comunicação após uma falha de navegação gravitacional.
              </p>
              <p className="mt-3">
                Os sistemas automáticos identificaram um pouso não programado em um planeta desconhecido do Sistema Solar.
              </p>
              <p className="mt-3">
                Sem identificação correta do planeta, a missão de resgate poderá falhar.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 overflow-hidden rounded-3xl border border-cyan-500/70 bg-black/65 text-left shadow-[0_0_38px_rgba(34,211,238,0.16)]">
          <div className="border-b border-cyan-800/70 bg-cyan-950/20 px-5 py-4 text-center">
            <div>
              <p className="uppercase tracking-[0.35em] text-cyan-300 text-xs mb-2" style={FONT.mono}>
                Configuração da missão
              </p>
              <h2 className="text-3xl font-black text-cyan-100" style={FONT.panel}>
                {formatTime(timeLeft)}
              </h2>
            </div>
          </div>

          <div className="grid gap-4 p-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-cyan-800/70 bg-cyan-950/15 p-4">
          <p className="mb-4 text-center text-xs uppercase tracking-[0.25em] text-cyan-300" style={FONT.mono}>
            Protocolos rápidos
          </p>
          <div className="grid grid-cols-2 gap-3">
            {missionTimeOptions.map((option) => {
              const active = timeLeft === option.seconds;

              return (
                <button
                  key={option.seconds}
                  type="button"
                  onClick={() => onSetMissionTime(option.seconds)}
                  className={`min-h-14 rounded-2xl border px-4 py-3 font-black transition ${
                    active
                      ? "border-cyan-200 bg-cyan-400 text-black shadow-[0_0_26px_rgba(34,211,238,0.32)]"
                      : "border-cyan-700/70 bg-cyan-950/25 text-cyan-100 hover:border-cyan-300 hover:bg-cyan-900/40"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          </div>

          <div className="rounded-2xl border border-cyan-800/70 bg-cyan-950/15 p-4">
            <p className="mb-4 text-center text-xs uppercase tracking-[0.25em] text-cyan-300" style={FONT.mono}>
              Ajuste manual
            </p>

            <div className="grid gap-3">
              <div className="grid grid-cols-3 gap-2">
                {[-10, -5, -1, 1, 5, 10].map((minutes) => (
                  <button
                    key={minutes}
                    type="button"
                    onClick={() => applyMinuteDelta(minutes)}
                    className={`min-h-11 rounded-xl border px-3 py-2 font-bold transition ${
                      minutes > 0
                        ? "border-emerald-300/50 bg-emerald-950/70 text-emerald-100 hover:bg-emerald-800/80"
                        : "border-red-300/50 bg-red-950/70 text-red-100 hover:bg-red-800/80"
                    }`}
                  >
                    {minutes > 0 ? `+${minutes}` : minutes}
                  </button>
                ))}
              </div>

              <label className="mt-1 grid gap-2 text-sm text-gray-300" style={FONT.narrative}>
                <span className="text-center uppercase tracking-[0.18em] text-cyan-300" style={FONT.mono}>
                  Minutos
                </span>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={selectedMinutes}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    if (Number.isNaN(value)) return;
                    onSetMissionTime(Math.min(120, Math.max(1, value)) * 60);
                  }}
                  className="w-full rounded-2xl border border-cyan-700/70 bg-black/60 px-4 py-3 text-center text-xl font-black text-cyan-100 outline-none focus:border-cyan-300"
                />
              </label>
            </div>
          </div>
        </div>
        </div>

        <button
          onClick={onStart}
          className="bg-cyan-600 hover:bg-cyan-500 border border-cyan-300/70 px-8 py-4 rounded-2xl font-bold transition shadow-[0_0_28px_rgba(34,211,238,0.28)]"
        >
          Iniciar transmissão
        </button>
      </div>
    </div>
  );
});

const MissionTimer = memo(function MissionTimer({ timeLeft, missionStarted, onStart }) {
  return (
    <section className="fixed right-3 top-3 z-[70] w-[min(92vw,310px)] overflow-hidden rounded-[1.25rem] border border-cyan-400/70 bg-black/82 backdrop-blur-xl shadow-[0_0_45px_rgba(34,211,238,0.22)]">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(90deg,rgba(34,211,238,0.12),transparent_24%,rgba(34,211,238,0.08)_50%,transparent_76%,rgba(34,211,238,0.12))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-cyan-200/80 shadow-[0_0_18px_rgba(103,232,249,0.75)]" />
      <div className="absolute inset-x-6 bottom-0 h-px bg-cyan-700/70" />

      <div className="relative z-10 p-3 sm:p-4" style={FONT.panel}>
        <div className="rounded-2xl border border-cyan-800/70 bg-cyan-950/15 p-3">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.32em] text-cyan-300 mb-1" style={FONT.mono}>
            Tempo operacional
          </p>
          <p className="text-4xl sm:text-5xl font-black text-white leading-none tracking-normal drop-shadow-[0_0_18px_rgba(34,211,238,0.28)]" style={FONT.mono}>
            {formatTime(timeLeft)}
          </p>
          <div className="mt-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em]" style={FONT.mono}>
            <span className={`h-2.5 w-2.5 rounded-full ${missionStarted ? "bg-green-300 animate-pulse" : "bg-cyan-300"}`} />
            <span className={missionStarted ? "text-green-300" : "text-cyan-200"}>
              {missionStarted ? "Missão ativa" : "Aguardando início"}
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-col items-stretch justify-center gap-3">
          {!missionStarted ? (
            <button onClick={onStart} className="bg-cyan-600 hover:bg-cyan-500 border border-cyan-200/80 px-5 py-3 rounded-2xl font-black transition shadow-[0_0_28px_rgba(34,211,238,0.28)]">
              Iniciar Missão
            </button>
          ) : (
            <div className="text-green-300 font-semibold bg-green-950/25 border border-green-500/70 rounded-2xl px-4 py-3 text-center text-xs shadow-[0_0_22px_rgba(74,222,128,0.12)]" style={FONT.mono}>
              [MISSÃO EM ANDAMENTO]
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

const Timeline = memo(function Timeline({ revealed }) {
  const steps = [
    [true, "FASE 1", "Recebimento dos sinais do rover."],
    [revealed[0], "FASE 2", "Análise estrutural concluída."],
    [revealed[1], "FASE 3", "Análise química atmosférica concluída."],
    [revealed[2], "FASE 4", "P.A.D parou de enviar material. Temos que descobrir o Planeta antes que seja tarde demais."],
  ];

  return (
    <section className="relative z-10 px-6 mb-10">
      <div className="bg-black/65 backdrop-blur-md border border-cyan-700/80 rounded-3xl p-6 shadow-xl max-w-5xl mx-auto" style={FONT.panel}>
        <h2 className="text-3xl text-cyan-300 font-bold mb-6">Linha do Tempo da Missão</h2>
        <div className="grid md:grid-cols-4 gap-4 text-gray-300">
          {steps.map(([visible, phase, text]) => (
            <div
              key={phase}
              className={`rounded-2xl border p-4 min-h-[120px] transition ${
                visible ? "bg-gray-950/80 border-cyan-700/70 opacity-100" : "bg-gray-950/40 border-gray-700/70 opacity-40"
              }`}
            >
              <p className={`font-bold mb-2 ${visible ? "text-cyan-300" : "text-gray-500"}`}>{phase}</p>
              <p>{visible ? text : "Dados bloqueados."}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

const ExperimentCard = memo(function ExperimentCard({ experiment, index, missionStarted, note, onNoteChange, onSave }) {
  const [showIndicatorInfo, setShowIndicatorInfo] = useState(false);
  const [showPyrognosticInfo, setShowPyrognosticInfo] = useState(false);
  const hasIndicatorLink = experiment.code === "EXP-02";
  const hasPyrognosticLink = experiment.code === "EXP-03";
  const descriptionParts = hasIndicatorLink ? experiment.description.split("indicador") : null;
  const pyrognosticDescriptionParts = hasPyrognosticLink ? experiment.description.split("análises geológicas") : null;
  const hasNote = Boolean(note?.trim());

  return (
    <div className="group bg-gray-950/75 backdrop-blur-md border border-gray-700/80 rounded-3xl p-6 shadow-xl relative overflow-hidden hover:border-cyan-500/70 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition" style={FONT.panel}>
      <p className="text-xs tracking-[0.25em] text-orange-300 font-bold mb-4">{experiment.code}</p>
      <p className="text-xs tracking-[0.2em] text-gray-400 mb-2">{experiment.phase}</p>
      <h3 className="text-cyan-300 text-3xl font-bold mb-4 leading-tight">{experiment.title}</h3>
      <p className="text-gray-300 leading-relaxed mb-4" style={FONT.narrative}>
        {hasIndicatorLink ? (
          <>
            {descriptionParts[0]}
            <button
              type="button"
              onClick={() => setShowIndicatorInfo(true)}
              className="text-cyan-200 underline decoration-cyan-300/70 underline-offset-4 transition hover:text-cyan-50"
            >
              indicador
            </button>
            {descriptionParts.slice(1).join("indicador")}
          </>
        ) : hasPyrognosticLink ? (
          <>
            {pyrognosticDescriptionParts[0]}
            <button
              type="button"
              onClick={() => setShowPyrognosticInfo(true)}
              className="text-cyan-200 underline decoration-cyan-300/70 underline-offset-4 transition hover:text-cyan-50"
            >
              análises geológicas
            </button>
            {pyrognosticDescriptionParts.slice(1).join("análises geológicas")}
          </>
        ) : (
          experiment.description
        )}
      </p>
      <div className="bg-black/45 border border-gray-700 rounded-2xl p-4 text-sm text-gray-400 mb-4" style={FONT.mono}>{experiment.science}</div>

      <button
        onClick={() => onSave(index)}
        disabled={!missionStarted || !hasNote}
        className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:text-gray-400 px-4 py-2 rounded-xl transition border border-cyan-300/40 font-bold"
      >
        Salvar anotações do experimento
      </button>

      <textarea
        value={note || ""}
        onChange={(event) => onNoteChange(index, event.target.value)}
        placeholder="Escreva aqui as observações e conclusões do experimento..."
        className="w-full mt-4 bg-black/45 border border-gray-700 rounded-2xl p-4 text-gray-300 min-h-[120px] resize-none focus:outline-none focus:border-cyan-500"
        style={FONT.narrative}
      />

      {showIndicatorInfo && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-[2rem] border border-cyan-400/80 bg-gray-950/95 shadow-[0_0_55px_rgba(34,211,238,0.22)]">
            <div className="border-b border-cyan-800/70 bg-cyan-950/25 px-5 py-4 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300" style={FONT.mono}>
                Banco químico
              </p>
              <h2 className="mt-2 text-3xl font-black text-cyan-100" style={FONT.panel}>
                Indicador natural
              </h2>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-5 sm:p-7">
              <div className="space-y-4 text-gray-200 leading-relaxed" style={FONT.narrative}>
                {INDICATOR_EXPLANATION.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowIndicatorInfo(false)}
                  className="rounded-2xl border border-cyan-200/80 bg-cyan-600 px-7 py-3 font-black text-white shadow-[0_0_28px_rgba(34,211,238,0.28)] transition hover:bg-cyan-500"
                >
                  Fechar análise
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPyrognosticInfo && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-[2rem] border border-orange-400/80 bg-gray-950/95 shadow-[0_0_55px_rgba(249,115,22,0.22)]">
            <div className="border-b border-orange-800/70 bg-orange-950/25 px-5 py-4 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-orange-300" style={FONT.mono}>
                Banco químico
              </p>
              <h2 className="mt-2 text-3xl font-black text-orange-100" style={FONT.panel}>
                Teste pirognóstico
              </h2>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-5 sm:p-7">
              <div className="space-y-4 text-gray-200 leading-relaxed" style={FONT.narrative}>
                {PYROGNOSTIC_EXPLANATION.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowPyrognosticInfo(false)}
                  className="rounded-2xl border border-orange-200/80 bg-orange-600 px-7 py-3 font-black text-white shadow-[0_0_28px_rgba(249,115,22,0.28)] transition hover:bg-orange-500"
                >
                  Fechar análise
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

const ExperimentSection = memo(function ExperimentSection({ revealed, missionStarted, notes, onNoteChange, onSave }) {
  return (
    <section className="relative z-10 px-6 mb-10">
      <div className={`grid gap-6 transition-all duration-700 ${Object.keys(revealed).length === 0 ? "max-w-2xl mx-auto grid-cols-1" : Object.keys(revealed).length === 1 ? "md:grid-cols-2 max-w-5xl mx-auto" : "md:grid-cols-3"}`}>
        {EXPERIMENTS.map((experiment, index) => {
          const canShow = index === 0 || revealed[index - 1];
          if (!canShow) return null;

          return (
            <ExperimentCard
              key={experiment.title}
              experiment={experiment}
              index={index}
              missionStarted={missionStarted}
              note={notes[index]}
              onNoteChange={onNoteChange}
              onSave={onSave}
            />
          );
        })}
      </div>
    </section>
  );
});

const PlanetCard = memo(function PlanetCard({ planet, canChoose, selectedPlanet, onChoose }) {
  const isSelected = selectedPlanet === planet.name;

  return (
    <div
      className={`group relative overflow-hidden rounded-[2rem] border bg-black/70 backdrop-blur-md shadow-[0_0_28px_rgba(34,211,238,0.12)] transition duration-300 ${
        isSelected
          ? "border-green-300 shadow-[0_0_42px_rgba(74,222,128,0.22)]"
          : "border-cyan-700/60 hover:shadow-[0_0_38px_rgba(34,211,238,0.22)] hover:border-cyan-400/70"
      }`}
      style={!canChoose ? { cursor: LOCKED_PLANET_CURSOR } : undefined}
    >
      <button
        type="button"
        onClick={() => onChoose(planet.name)}
        aria-disabled={!canChoose}
        className="relative block w-full overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
        style={!canChoose ? { cursor: LOCKED_PLANET_CURSOR } : undefined}
        aria-label={`Selecionar ${planet.name}`}
      >
        <img src={planet.img} alt={planet.name} className="w-full h-72 object-cover group-hover:scale-105 transition duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        {!canChoose && <div className="absolute inset-0 bg-black/45" />}
        {canChoose && (
          <div className="absolute top-4 right-4 bg-green-500/90 border border-green-100 rounded-full px-4 py-1 text-black text-xs font-black tracking-[0.18em]" style={FONT.mono}>
            SELECIONAR
          </div>
        )}
        <div className="absolute bottom-5 left-5 right-5">
          <h3 className="text-4xl font-black text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={FONT.panel}>{planet.name}</h3>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-cyan-300 animate-pulse" />
            <p className="uppercase tracking-[0.25em] text-cyan-200 text-xs" style={FONT.mono}>{planet.type}</p>
          </div>
        </div>
      </button>

      <div className="p-6">
        <div className="grid gap-3 mb-4" style={FONT.narrative}>
          <div className="rounded-2xl border border-cyan-800/60 bg-black/35 p-4">
            <p className="mb-1 text-xs uppercase tracking-[0.2em] text-cyan-300" style={FONT.mono}>
              Cores observadas
            </p>
            <p className="text-gray-200">{planet.colors}</p>
          </div>

          <div className="grid gap-3">
            <div className="rounded-2xl border border-cyan-800/60 bg-black/35 p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.2em] text-cyan-300" style={FONT.mono}>
                pH atmosférico
              </p>
              <p className="text-gray-200">{planet.acidBase}</p>
            </div>
          </div>
        </div>

        <div className="bg-cyan-950/20 border border-cyan-800/60 rounded-2xl p-4">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300 mb-3" style={FONT.mono}>Análise atmosférica</p>
          <ul className="text-gray-300 leading-relaxed space-y-2 list-disc pl-5" style={FONT.narrative}>
            {(planet.facts || []).map((fact) => (
              <li key={fact} className="text-base leading-relaxed text-gray-200">
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
});

const PlanetSection = memo(function PlanetSection({ revealed, selectedPlanet, missionStarted, timeLeft, onChoosePlanet }) {
  const allExperimentsDone = EXPERIMENTS.every((_, index) => Boolean(revealed[index]));
  const canChoose = allExperimentsDone && missionStarted && timeLeft > 0;

  return (
    <section className="relative z-10 px-6 mb-14">
      <div className="mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.45em] text-cyan-300 mb-3" style={FONT.mono}>Banco orbital de reconhecimento</p>
        <h2 className="text-4xl md:text-5xl font-black text-cyan-200 drop-shadow-[0_0_18px_rgba(34,211,238,0.25)]" style={FONT.panel}>Perfis Planetários</h2>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {PLANETS.map((planet) => (
          <PlanetCard
            key={planet.name}
            planet={planet}
            canChoose={canChoose}
            selectedPlanet={selectedPlanet}
            onChoose={onChoosePlanet}
          />
        ))}
      </div>
    </section>
  );
});

const DecisionSection = memo(function DecisionSection({ revealed, result }) {
  const allExperimentsDone = EXPERIMENTS.every((_, index) => Boolean(revealed[index]));

  return (
    <section className="relative z-10 bg-black/75 backdrop-blur-md border border-green-700/80 rounded-3xl p-6 mx-6 mb-10 shadow-xl">
      <div className="bg-gray-950/80 border border-green-700 rounded-3xl p-6 text-center" style={FONT.panel}>
        <h2 className="text-3xl text-green-300 font-bold mb-6">Decisão Final</h2>

        {allExperimentsDone ? (
          <div className="bg-green-950/20 border border-green-700/70 rounded-2xl p-5 text-green-100 max-w-2xl mx-auto" style={FONT.narrative}>
            As evidências estão completas. Escolha o planeta clicando diretamente na imagem correspondente nos perfis planetários.
          </div>
        ) : (
          <div className="bg-gray-950 border border-green-800 rounded-2xl p-5 text-gray-300 max-w-2xl mx-auto" style={FONT.narrative}>
            Complete todos os experimentos e salve as anotações para liberar a escolha do planeta.
          </div>
        )}

        {result && <p className="mt-6 text-cyan-300 text-lg font-semibold">{result}</p>}
      </div>
    </section>
  );
});

const PlanetConfirmDialog = memo(function PlanetConfirmDialog({ planetName, onCancel, onConfirm }) {
  if (!planetName) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-[2rem] border border-green-400/80 bg-gray-950/95 text-center shadow-[0_0_55px_rgba(74,222,128,0.25)]" style={FONT.panel}>
        <div className="border-b border-green-800/70 bg-green-950/25 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.35em] text-green-300" style={FONT.mono}>
            Confirmação orbital
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="mb-4 text-3xl font-black text-green-300">
            Confirmar {planetName}?
          </h2>
          <p className="mx-auto mb-7 max-w-md text-gray-200 leading-relaxed" style={FONT.narrative}>
            A equipe deseja registrar {planetName} como o planeta onde P.A.D. está preso?
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-2xl border border-gray-500/70 bg-black/70 px-6 py-3 font-bold text-gray-200 transition hover:bg-gray-900"
            >
              Revisar evidências
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-2xl border border-green-200/80 bg-green-500 px-6 py-3 font-black text-black shadow-[0_0_28px_rgba(74,222,128,0.35)] transition hover:bg-green-400"
            >
              Confirmar planeta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

const FinalTransmissionImage = memo(function FinalTransmissionImage({ src, alt, tone = "emerald", status }) {
  const isSuccess = tone === "emerald";
  const borderClass = isSuccess ? "border-emerald-400/70" : "border-red-500/70";
  const headerClass = isSuccess ? "border-emerald-800/70 bg-emerald-950/25" : "border-red-800/70 bg-red-950/25";
  const labelClass = isSuccess ? "text-emerald-300" : "text-red-300";
  const statusClass = isSuccess ? "text-emerald-100" : "text-red-100";
  const glowClass = isSuccess ? "shadow-[0_0_35px_rgba(16,185,129,0.25)]" : "shadow-[0_0_35px_rgba(185,28,28,0.3)]";
  const bodyClass = isSuccess
    ? "bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.18),rgba(0,0,0,0.9)_62%)]"
    : "bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.18),rgba(0,0,0,0.9)_62%)]";
  const scanlineClass = isSuccess
    ? "bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px)]"
    : "bg-[linear-gradient(rgba(248,113,113,0.1)_1px,transparent_1px)]";
  const insetClass = isSuccess
    ? "shadow-[inset_0_0_55px_rgba(16,185,129,0.32)]"
    : "shadow-[inset_0_0_55px_rgba(185,28,28,0.34)]";
  const washClass = isSuccess ? "to-emerald-300/10" : "to-red-300/10";
  const imageGlowClass = isSuccess
    ? "drop-shadow-[0_0_24px_rgba(52,211,153,0.22)]"
    : "drop-shadow-[0_0_24px_rgba(248,113,113,0.22)]";

  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-black/70 ${borderClass} ${glowClass}`}>
      <div className={`flex items-center justify-between border-b px-4 py-2 ${headerClass}`} style={FONT.mono}>
        <span className={`text-[10px] uppercase tracking-[0.28em] ${labelClass}`}>
          Transmissão recuperada
        </span>
        <span className={`text-[10px] uppercase tracking-[0.2em] ${statusClass}`}>
          {status}
        </span>
      </div>
      <div className={`relative overflow-hidden p-2 ${bodyClass}`}>
        <div className={`absolute inset-0 pointer-events-none bg-[size:100%_7px] mix-blend-screen ${scanlineClass}`} />
        <div className={`absolute inset-0 pointer-events-none ${insetClass}`} />
        <div className={`absolute inset-0 pointer-events-none bg-gradient-to-t from-black/35 via-transparent ${washClass}`} />
        <div className={`relative rounded-xl border ${borderClass} bg-black/35 p-1`}>
          <img
            src={src}
            alt={alt}
            className={`relative mx-auto h-[34vh] max-h-[22rem] w-full object-contain opacity-95 mix-blend-lighten md:h-[58vh] md:max-h-[34rem] ${imageGlowClass}`}
          />
        </div>
      </div>
    </div>
  );
});

const FailureScreen = memo(function FailureScreen({ missionFailed, onReset }) {
  const failureTitle =
    missionFailed === "wrongPlanet"
      ? "O rover não foi localizado"
      : "O rover sucumbiu às condições do planeta";

  const failureText =
    missionFailed === "wrongPlanet"
      ? "A equipe selecionou um planeta incompatível com as evidências coletadas. A Central Espacial perdeu a janela de localização e o rover permanece desaparecido."
      : "O tempo da missão acabou antes da conclusão da análise. Sem orientação da equipe, o rover não resistiu às condições extremas do planeta desconhecido.";

  return (
    <div className="h-screen text-white flex items-center justify-center p-3 sm:p-4 relative overflow-hidden bg-cover bg-center" style={createBackgroundStyle(0.84)}>
      <DustLayer />
      <div className="relative z-10 grid w-full max-w-6xl mx-auto gap-4 bg-black/80 border border-red-600/80 rounded-[1.5rem] p-3 sm:p-4 text-center shadow-[0_0_45px_rgba(185,28,28,0.35)] backdrop-blur-md md:grid-cols-[1.35fr_0.85fr] md:items-center md:text-left">
        <FinalTransmissionImage
          src={missionFailed === "timeExpired" ? falhaTempoImg : falhaPlanetaImg}
          alt="Falha da missão"
          tone="red"
          status="Sinal crítico"
        />
        <div className="flex min-h-0 flex-col justify-center">
          <p className="uppercase tracking-[0.35em] text-red-400 text-xs font-bold mb-2" style={FONT.mono}>Falha na missão</p>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight leading-none text-red-300 mb-3 drop-shadow-[0_0_18px_rgba(248,113,113,0.45)]">{failureTitle}</h1>
          <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-4 font-light tracking-wide" style={FONT.narrative}>{failureText}</p>
          <button onClick={onReset} className="self-center md:self-start bg-red-700 hover:bg-red-600 border border-red-400/60 px-5 py-2.5 rounded-2xl font-semibold transition shadow-[0_0_20px_rgba(185,28,28,0.35)]">
            Reiniciar missão
          </button>
        </div>
      </div>
    </div>
  );
});

const VictoryScreen = memo(function VictoryScreen({ notes, onReset }) {
  return (
    <div className="h-screen text-white flex items-center justify-center p-3 sm:p-4 relative overflow-hidden bg-cover bg-center" style={createBackgroundStyle(0.72)}>
      <DustLayer />
      <div className="relative z-10 grid w-full max-w-7xl mx-auto gap-4 bg-black/78 border border-emerald-400/80 rounded-[1.5rem] p-3 sm:p-4 text-center shadow-[0_0_55px_rgba(16,185,129,0.25)] backdrop-blur-md md:grid-cols-[1.25fr_0.95fr] md:items-center md:text-left">
        <FinalTransmissionImage src={vitoriaImg} alt="Vitória da missão" status="Sinal estável" />
        <div className="flex min-h-0 flex-col justify-center">
          <p className="uppercase tracking-[0.35em] text-emerald-300 text-xs font-bold mb-2" style={FONT.mono}>Missão concluída</p>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight leading-none text-emerald-300 mb-3 drop-shadow-[0_0_18px_rgba(52,211,153,0.45)]">Rover localizado em Mercúrio</h1>
          <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-3 font-light tracking-wide" style={FONT.narrative}>
            A análise das amostras, da atmosfera e da assinatura mineral confirmou que o rover pousou em Mercúrio. A comunicação foi estabilizada e os dados científicos foram enviados para a Central Espacial.
          </p>

          <div className="grid gap-2 text-left mb-4 max-h-[26vh] overflow-y-auto pr-1" style={FONT.panel}>
            {EXPERIMENTS.map((experiment, index) => (
              <div key={experiment.title} className="bg-emerald-950/20 border border-emerald-700/80 rounded-xl p-2.5 shadow-[0_0_18px_rgba(16,185,129,0.12)]">
                <p className="text-emerald-300 text-sm font-bold mb-1">{experiment.title}</p>
                <p className="text-gray-300 text-xs sm:text-sm whitespace-pre-wrap" style={FONT.narrative}>
                  {notes[index]?.trim() || "Nenhuma anotação registrada pela equipe."}
                </p>
              </div>
            ))}
          </div>

          <button onClick={onReset} className="self-center md:self-start bg-gray-800 hover:bg-gray-700 border border-gray-500/60 px-5 py-2.5 rounded-2xl font-semibold transition">
            Reiniciar missão
          </button>
        </div>
      </div>
    </div>
  );
});

function RoverWorkshopMissionContent() {
  const [introOpen, setIntroOpen] = useState(true);
  const [cinematicOpen, setCinematicOpen] = useState(true);
  const [missionStarted, setMissionStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [revealed, setRevealed] = useState({});
  const [notes, setNotes] = useState({});
  const [selectedPlanet, setSelectedPlanet] = useState("");
  const [pendingPlanet, setPendingPlanet] = useState("");
  const [result, setResult] = useState("");
  const [missionFinished, setMissionFinished] = useState(false);
  const [missionFailed, setMissionFailed] = useState(null);
  const [bootText, setBootText] = useState("");
  const { ambientRef, playAmbient, playTone } = useMissionAudio();

  const withAudio = (screen) => (
    <>
      <audio ref={ambientRef} src={ambientMusic} preload="auto" />
      {screen}
    </>
  );

  useEffect(() => {
    document.title = "Missão Rover — Investigação Planetária";

    [backgroundImg, falhaTempoImg, falhaPlanetaImg, vitoriaImg, ...PLANETS.map((planet) => planet.img)].forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, []);

  useEffect(() => {
    const introMessage = "ANO 2084 • MISSÃO P.A.D-01 • TRANSMISSÃO INTERPLANETÁRIA INICIADA";
    let index = 0;

    const interval = setInterval(() => {
      setBootText(introMessage.slice(0, index));
      index += 1;
      if (index > introMessage.length) clearInterval(interval);
    }, 38);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!missionStarted || missionFinished || missionFailed) return;

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          playTone("error");
          setMissionStarted(false);
          setMissionFailed("timeExpired");
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [missionStarted, missionFinished, missionFailed, playTone]);

  const startMission = () => {
    window.scrollTo({
    top: 0,
    behavior: "instant",
  });
  playTone("success");
  playAmbient();

  setMissionStarted(true);
  setIntroOpen(false);
};

  const setMissionDuration = (seconds) => {
    playTone("click");
    setTimeLeft(seconds);
  };

  const saveExperimentProgress = (index) => {
    if (!missionStarted) return;
    if (!notes[index]?.trim()) return;

    playTone("success");
    setRevealed((prev) => ({ ...prev, [index]: true }));
  };

  const updateNote = (index, value) => {
    setNotes((prev) => ({ ...prev, [index]: value }));
  };

  const checkAnswer = (planetChoice = selectedPlanet) => {
    if (planetChoice === "Mercúrio") {
      playTone("success");
      setResult("Missão concluída com sucesso. O rover foi localizado em Mercúrio.");
      setMissionFinished(true);
      setMissionStarted(false);
      return;
    }

    playTone("error");
    setResult("Conclusão incorreta. O rover não foi localizado.");
    setMissionStarted(false);
    setMissionFailed("wrongPlanet");
  };

  const choosePlanetFromCard = (planetName) => {
    const allExperimentsDone = EXPERIMENTS.every((_, index) => Boolean(revealed[index]));

    if (!allExperimentsDone || !missionStarted || timeLeft <= 0) return;

    setSelectedPlanet(planetName);
    setPendingPlanet(planetName);
  };

  const cancelPlanetChoice = () => {
    playTone("click");
    setPendingPlanet("");
  };

  const confirmPlanetChoice = () => {
    if (!pendingPlanet) return;

    checkAnswer(pendingPlanet);
    setPendingPlanet("");
  };

  const resetMission = () => {
    playTone("click");
    setMissionStarted(false);
    setMissionFinished(false);
    setMissionFailed(null);
    setIntroOpen(true);
    setTimeLeft(1800);
    setRevealed({});
    setNotes({});
    setSelectedPlanet("");
    setPendingPlanet("");
    setResult("");
  };

  if (cinematicOpen) {
  return withAudio(
    <CinematicIntroScreen
      onStart={() => {
        playAmbient();
        setCinematicOpen(false);
      }}
    />
  );
}

if (introOpen) {
  return withAudio(
    <IntroScreen
      bootText={bootText}
      timeLeft={timeLeft}
      onSetMissionTime={setMissionDuration}
      onStart={startMission}
    />
  );
}

  if (missionFailed) {
    return withAudio(<FailureScreen missionFailed={missionFailed} onReset={resetMission} />);
  }

  if (missionFinished) {
    return withAudio(<VictoryScreen notes={notes} onReset={resetMission} />);
  }

  return withAudio(
  <div
    className="min-h-screen text-white relative overflow-x-hidden bg-cover bg-center bg-scroll md:bg-fixed"
    style={createBackgroundStyle(0.78)}
  >
      <DustLayer />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(white_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:100%_7px] opacity-20" />

      <header className="relative z-10 text-center px-6 py-10 md:py-14">
        <div className="inline-flex items-center justify-center gap-4 mb-6 rounded-full border border-cyan-400/50 bg-black/45 px-5 py-2 text-cyan-200 shadow-[0_0_25px_rgba(34,211,238,0.18)]" style={FONT.mono}>
          <span className="h-2 w-2 rounded-full bg-cyan-300 animate-pulse" />
          <span className="uppercase tracking-[0.35em] text-xs md:text-sm">Central de Missão</span>
        </div>
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-none text-cyan-300 drop-shadow-[0_0_18px_rgba(34,211,238,0.35)]">
          Missão Rover
          <span className="block text-2xl md:text-4xl mt-3 text-cyan-100/90">Investigação Planetária</span>
        </h1>
      </header>

      <MissionTimer
        timeLeft={timeLeft}
        missionStarted={missionStarted}
        onStart={startMission}
      />
      <Timeline revealed={revealed} />
      <ExperimentSection
        revealed={revealed}
        missionStarted={missionStarted}
        notes={notes}
        onNoteChange={updateNote}
        onSave={saveExperimentProgress}
      />
      <PlanetSection
        revealed={revealed}
        selectedPlanet={selectedPlanet}
        missionStarted={missionStarted}
        timeLeft={timeLeft}
        onChoosePlanet={choosePlanetFromCard}
      />
      <DecisionSection
        revealed={revealed}
        result={result}
      />
      <PlanetConfirmDialog
        planetName={pendingPlanet}
        onCancel={cancelPlanetChoice}
        onConfirm={confirmPlanetChoice}
      />
    </div>
  );
}

export default function RoverWorkshopMission() {
  return (
    <ErrorBoundary>
      <RoverWorkshopMissionContent />
    </ErrorBoundary>
  );
}
