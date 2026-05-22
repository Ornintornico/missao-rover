import React, { memo, useEffect, useMemo, useRef, useState } from "react";

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
      "P.A.D enviou amostras de rochas.",
    science:
      "Os sensores detectaram um matérial sólido, talvez seja da superfície do Planeta. O material deve ser analisado cuidadosamente com o auxílio do super foco tecnológico.",
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
      "As amostras de P.A.D emitem uma luz estranhamente chamativa. Talvez nosso amigo esteja tentando nos mostrar a composição Química do Planeta.",
  },
];

const PLANETS = [
  {
    name: "Mercúrio",
    type: "Rochoso",
    img: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg",
    facts: [
      "Possui superfície com marcas de antigas atividades vulcânicas.",
      "Atualmente é considerado vulcanicamente inativo.",
      "Quase não possui atmosfera.",
      "Possui temperaturas extremas.",
    ],
  },
  {
    name: "Vênus",
    type: "Rochoso",
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
    img: "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg",
    facts: [
      "Conhecido como Planeta Vermelho.",
      "Possui duas luas: Fobos e Deimos.",
      "Possui sinais de água no passado.",
      "Temperatura muito baixa.",
    ],
  },
  {
    name: "Júpiter",
    type: "Gasoso",
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
    img: "https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg",
    facts: [
      "8º planeta do Sistema Solar.",
      "Possui coloração azul devido ao metano.",
      "Tem ventos muito fortes.",
    ],
  },
];

const FONT = {
  base: { fontFamily: "Orbitron, Rajdhani, Inter, sans-serif" },
  mono: { fontFamily: "Share Tech Mono, monospace" },
  narrative: { fontFamily: "Inter, sans-serif" },
  panel: { fontFamily: "Rajdhani, sans-serif" },
};

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

const IntroScreen = memo(function IntroScreen({ bootText, onStart }) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 34000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="min-h-screen overflow-hidden relative bg-black text-yellow-200 flex items-center justify-center"
      style={createBackgroundStyle(0.92)}
    >
      <DustLayer />

      <div className="absolute inset-0 bg-black/70 z-0" />

      <style>
        {`
          @keyframes crawl {
            0% {
              transform: rotateX(25deg) translateY(100vh) translateZ(0);
              opacity: 1;
            }

            100% {
              transform: rotateX(25deg) translateY(-320vh) translateZ(-300px);
              opacity: 0;
            }
          }

          .starwars-container {
            perspective: 450px;
            perspective-origin: center bottom;
            position: absolute;
            inset: 0;
            overflow: hidden;
          }

          .starwars-crawl {
            position: absolute;
            width: 90%;
            max-width: 900px;
            left: 50%;
            transform: translateX(-50%) rotateX(25deg);
            transform-origin: 50% 100%;
            animation: crawl 40s linear forwards;
            font-family: "Orbitron", sans-serif;
            color: #fde68a;
            text-align: justify;
            line-height: 1.9;
            font-size: clamp(1rem, 2vw, 2rem);
            font-weight: 700;
            letter-spacing: 0.04em;
          }

          .crawl-title {
            text-align: center;
            margin-bottom: 4rem;
          }

          .crawl-title h1 {
            font-size: clamp(2.5rem, 6vw, 6rem);
            font-weight: 900;
            color: #facc15;
            text-shadow: 0 0 20px rgba(250,204,21,0.45);
          }

          .crawl-title p {
            font-size: clamp(1rem, 2vw, 1.8rem);
            letter-spacing: 0.4em;
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

      {showButton && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 intro-button">
          <button
            onClick={onStart}
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-10 py-5 rounded-2xl text-xl font-black shadow-[0_0_40px_rgba(250,204,21,0.45)] transition border border-yellow-100"
          >
            INICIAR TRANSMISSÃO
          </button>
        </div>
      )}
    </div>
  );
});

const MissionTimer = memo(function MissionTimer({ timeLeft, missionStarted, onStart, onAddTime, onRemoveTime }) {
  return (
    <section className="sticky top-3 z-50 mx-3 sm:mx-6 mb-10 overflow-hidden rounded-[1.5rem] border border-cyan-500/70 bg-black/85 backdrop-blur-xl shadow-[0_0_35px_rgba(8,145,178,0.22)]">
      <div className="relative z-10 grid lg:grid-cols-[1fr_auto] gap-4 items-center p-3 sm:p-4 md:p-5" style={FONT.panel}>
        <div>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.32em] text-cyan-300 mb-1" style={FONT.mono}>
            Tempo operacional
          </p>
          <p className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-none" style={FONT.mono}>
            {formatTime(timeLeft)}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={() => onAddTime(60)} className="bg-emerald-700/90 hover:bg-emerald-600 border border-emerald-300/50 px-5 py-3 rounded-2xl transition font-bold">
              +1 min
            </button>
            <button onClick={() => onRemoveTime(60)} className="bg-red-700/90 hover:bg-red-600 border border-red-300/50 px-5 py-3 rounded-2xl transition font-bold">
              -1 min
            </button>
          </div>
        </div>

        <div className="flex flex-col items-stretch md:items-end gap-3">
          {!missionStarted ? (
            <button onClick={onStart} className="bg-cyan-600 hover:bg-cyan-500 border border-cyan-300/70 px-8 py-4 rounded-2xl font-bold transition shadow-[0_0_28px_rgba(34,211,238,0.28)]">
              Iniciar Missão
            </button>
          ) : (
            <div className="text-green-300 font-semibold bg-green-950/30 border border-green-700 rounded-2xl px-6 py-4" style={FONT.mono}>
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
    [revealed[2], "FASE 4", "Assinatura espectral compatível com Mercúrio."],
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
  return (
    <div className="group bg-gray-950/75 backdrop-blur-md border border-gray-700/80 rounded-3xl p-6 shadow-xl relative overflow-hidden hover:border-cyan-500/70 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition" style={FONT.panel}>
      <p className="text-xs tracking-[0.25em] text-orange-300 font-bold mb-4">{experiment.code}</p>
      <p className="text-xs tracking-[0.2em] text-gray-400 mb-2">{experiment.phase}</p>
      <h3 className="text-cyan-300 text-3xl font-bold mb-4 leading-tight">{experiment.title}</h3>
      <p className="text-gray-300 leading-relaxed mb-4" style={FONT.narrative}>{experiment.description}</p>
      <div className="bg-black/45 border border-gray-700 rounded-2xl p-4 text-sm text-gray-400 mb-4" style={FONT.mono}>{experiment.science}</div>

      <button
        onClick={() => onSave(index)}
        disabled={!missionStarted}
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

const PlanetCard = memo(function PlanetCard({ planet, index }) {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-cyan-700/60 bg-black/70 backdrop-blur-md shadow-[0_0_28px_rgba(34,211,238,0.12)] hover:shadow-[0_0_38px_rgba(34,211,238,0.22)] hover:border-cyan-400/70 transition duration-300">
      <div className="relative overflow-hidden">
        <img src={planet.img} alt={planet.name} className="w-full h-72 object-cover group-hover:scale-105 transition duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute top-4 left-4">
          <div className="bg-black/70 border border-cyan-500/40 rounded-full px-4 py-1 text-cyan-300 text-xs tracking-[0.25em]" style={FONT.mono}>
            PX-0{index + 1}
          </div>
        </div>
        <div className="absolute bottom-5 left-5 right-5">
          <h3 className="text-4xl font-black text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={FONT.panel}>{planet.name}</h3>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-cyan-300 animate-pulse" />
            <p className="uppercase tracking-[0.25em] text-cyan-200 text-xs" style={FONT.mono}>{planet.type}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
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

const PlanetSection = memo(function PlanetSection() {
  return (
    <section className="relative z-10 px-6 mb-14">
      <div className="mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.45em] text-cyan-300 mb-3" style={FONT.mono}>Banco orbital de reconhecimento</p>
        <h2 className="text-4xl md:text-5xl font-black text-cyan-200 drop-shadow-[0_0_18px_rgba(34,211,238,0.25)]" style={FONT.panel}>Perfis Planetários</h2>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {PLANETS.map((planet, index) => (
          <PlanetCard key={planet.name} planet={planet} index={index} />
        ))}
      </div>
    </section>
  );
});

const DecisionSection = memo(function DecisionSection({ revealed, selectedPlanet, setSelectedPlanet, missionStarted, timeLeft, onCheck, result }) {
  const allExperimentsDone = EXPERIMENTS.every((_, index) => Boolean(revealed[index]));

  return (
    <section className="relative z-10 bg-black/75 backdrop-blur-md border border-green-700/80 rounded-3xl p-6 mx-6 mb-10 shadow-xl">
      <div className="bg-gray-950/80 border border-green-700 rounded-3xl p-6 text-center" style={FONT.panel}>
        <h2 className="text-3xl text-green-300 font-bold mb-6">Decisão Final</h2>

        {allExperimentsDone ? (
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="relative w-full md:w-80">
              <select
                value={selectedPlanet}
                onChange={(event) => setSelectedPlanet(event.target.value)}
                className="w-full appearance-none bg-gray-950 border border-green-500 text-green-200 p-4 pr-12 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-300 cursor-pointer"
              >
                <option value="">Selecionar planeta</option>
                <option>Mercúrio</option>
                <option>Vênus</option>
                <option>Marte</option>
                <option>Júpiter</option>
                <option>Netuno</option>
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-green-300 text-xl">▾</div>
            </div>

            <button
              onClick={onCheck}
              disabled={!missionStarted || selectedPlanet === "" || timeLeft <= 0}
              className="bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-400 transition px-8 py-4 rounded-2xl font-bold shadow-lg border border-green-400/40"
            >
              Confirmar
            </button>
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
    <div className="min-h-screen text-white flex items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden bg-cover bg-center" style={createBackgroundStyle(0.84)}>
      <DustLayer />
      <div className="relative z-10 w-full max-w-5xl mx-auto bg-black/80 border border-red-600/80 rounded-[2rem] p-5 sm:p-6 md:p-10 text-center shadow-[0_0_45px_rgba(185,28,28,0.35)] backdrop-blur-md">
        <p className="uppercase tracking-[0.45em] text-red-400 text-sm font-bold mb-6" style={FONT.mono}>Falha na missão</p>
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-none text-red-300 mb-8 drop-shadow-[0_0_18px_rgba(248,113,113,0.45)]">{failureTitle}</h1>
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-red-800 shadow-[0_0_35px_rgba(127,29,29,0.45)]">
          <img src={missionFailed === "timeExpired" ? falhaTempoImg : falhaPlanetaImg} alt="Falha da missão" className="w-full max-h-[520px] object-cover" />
        </div>
        <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-8 max-w-4xl mx-auto font-light tracking-wide" style={FONT.narrative}>{failureText}</p>
        <button onClick={onReset} className="bg-red-700 hover:bg-red-600 border border-red-400/60 px-6 py-3 rounded-2xl font-semibold transition shadow-[0_0_20px_rgba(185,28,28,0.35)]">
          Reiniciar missão
        </button>
      </div>
    </div>
  );
});

const VictoryScreen = memo(function VictoryScreen({ notes, onReset }) {
  return (
    <div className="min-h-screen text-white flex items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden bg-cover bg-center" style={createBackgroundStyle(0.72)}>
      <DustLayer />
      <div className="relative z-10 w-full max-w-6xl mx-auto bg-black/78 border border-emerald-400/80 rounded-[2rem] p-5 sm:p-6 md:p-10 text-center shadow-[0_0_55px_rgba(16,185,129,0.25)] backdrop-blur-md">
        <p className="uppercase tracking-[0.45em] text-emerald-300 text-sm font-bold mb-6" style={FONT.mono}>Missão concluída</p>
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-none text-emerald-300 mb-8 drop-shadow-[0_0_18px_rgba(52,211,153,0.45)]">Rover localizado em Mercúrio</h1>
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-emerald-700 shadow-[0_0_35px_rgba(16,185,129,0.25)]">
          <img src={vitoriaImg} alt="Vitória da missão" className="w-full max-h-[520px] object-cover" />
        </div>
        <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-8 max-w-4xl mx-auto font-light tracking-wide" style={FONT.narrative}>
          A análise das amostras, da atmosfera e da assinatura mineral confirmou que o rover pousou em Mercúrio. A comunicação foi estabilizada e os dados científicos foram enviados para a Central Espacial.
        </p>

        <div className="grid md:grid-cols-3 gap-4 text-left mb-8" style={FONT.panel}>
          {EXPERIMENTS.map((experiment, index) => (
            <div key={experiment.title} className="bg-emerald-950/20 border border-emerald-700/80 rounded-2xl p-5 shadow-[0_0_18px_rgba(16,185,129,0.12)]">
              <p className="text-emerald-300 text-xl font-bold mb-2">{experiment.title}</p>
              <p className="text-gray-300 whitespace-pre-wrap" style={FONT.narrative}>
                {notes[index]?.trim() || "Nenhuma anotação registrada pela equipe."}
              </p>
            </div>
          ))}
        </div>

        <button onClick={onReset} className="bg-gray-800 hover:bg-gray-700 border border-gray-500/60 px-6 py-3 rounded-2xl font-semibold transition">
          Reiniciar missão
        </button>
      </div>
    </div>
  );
});

function RoverWorkshopMissionContent() {
  const [introOpen, setIntroOpen] = useState(true);
  const [missionStarted, setMissionStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [revealed, setRevealed] = useState({});
  const [notes, setNotes] = useState({});
  const [selectedPlanet, setSelectedPlanet] = useState("");
  const [result, setResult] = useState("");
  const [missionFinished, setMissionFinished] = useState(false);
  const [missionFailed, setMissionFailed] = useState(null);
  const [bootText, setBootText] = useState("");
  const audioRef = useRef(null);

  const playTone = (type = "click") => {
    try {
      if (!audioRef.current) {
        audioRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const audioCtx = audioRef.current;
      const oscillator = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      oscillator.connect(gain);
      gain.connect(audioCtx.destination);
      oscillator.type = "sine";
      oscillator.frequency.value = type === "error" ? 160 : type === "success" ? 720 : 460;
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.18);
    } catch {
      return;
    }
  };

  useEffect(() => {
    document.title = "Missão P.A.D — Investigação Planetária";

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
    if (missionStarted && !missionFinished && !missionFailed && timeLeft <= 0) {
      playTone("error");
      setMissionStarted(false);
      setMissionFailed("timeExpired");
      return;
    }

    if (!missionStarted || missionFinished || missionFailed || timeLeft <= 0) return;

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [missionStarted, missionFinished, missionFailed, timeLeft]);

  const startMission = () => {
    playTone("success");
    setMissionStarted(true);
    setIntroOpen(false);
  };

  const addTime = (seconds) => {
    playTone("click");
    setTimeLeft((prev) => prev + seconds);
  };

  const removeTime = (seconds) => {
    playTone("click");
    setTimeLeft((prev) => Math.max(0, prev - seconds));
  };

  const saveExperimentProgress = (index) => {
    if (!missionStarted) return;

    playTone("success");
    setRevealed((prev) => ({ ...prev, [index]: true }));
  };

  const updateNote = (index, value) => {
    setNotes((prev) => ({ ...prev, [index]: value }));
  };

  const checkAnswer = () => {
    if (selectedPlanet === "Mercúrio") {
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
    setResult("");
  };

  if (introOpen) {
    return <IntroScreen bootText={bootText} onStart={startMission} />;
  }

  if (missionFailed) {
    return <FailureScreen missionFailed={missionFailed} onReset={resetMission} />;
  }

  if (missionFinished) {
    return <VictoryScreen notes={notes} onReset={resetMission} />;
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-cover bg-center bg-scroll md:bg-fixed" style={createBackgroundStyle(0.78)}>
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
        onAddTime={addTime}
        onRemoveTime={removeTime}
      />
      <Timeline revealed={revealed} />
      <ExperimentSection
        revealed={revealed}
        missionStarted={missionStarted}
        notes={notes}
        onNoteChange={updateNote}
        onSave={saveExperimentProgress}
      />
      <PlanetSection />
      <DecisionSection
        revealed={revealed}
        selectedPlanet={selectedPlanet}
        setSelectedPlanet={setSelectedPlanet}
        missionStarted={missionStarted}
        timeLeft={timeLeft}
        onCheck={checkAnswer}
        result={result}
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
