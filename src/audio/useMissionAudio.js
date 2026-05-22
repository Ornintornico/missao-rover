import { useCallback, useEffect, useRef } from "react";

const FADE_STEP_MS = 80;

function fadeTo(audio, targetVolume, duration = 900) {
  if (!audio) return;

  const startVolume = audio.volume;
  const steps = Math.max(1, Math.ceil(duration / FADE_STEP_MS));
  let currentStep = 0;

  window.clearInterval(audio.dataset.fadeTimer);

  const timer = window.setInterval(() => {
    currentStep += 1;
    const progress = currentStep / steps;
    audio.volume = startVolume + (targetVolume - startVolume) * progress;

    if (currentStep >= steps) {
      audio.volume = targetVolume;
      window.clearInterval(timer);
      audio.dataset.fadeTimer = "";
    }
  }, FADE_STEP_MS);

  audio.dataset.fadeTimer = String(timer);
}

export function useMissionAudio() {
  const ambientRef = useRef(null);
  const synthRef = useRef(null);

  const playAmbient = useCallback((targetVolume = 0.22) => {
    const audio = ambientRef.current;
    if (!audio) return Promise.resolve(false);

    audio.loop = true;
    audio.volume = 0;

    return audio
      .play()
      .then(() => {
        fadeTo(audio, targetVolume);
        return true;
      })
      .catch(() => false);
  }, []);

  const stopAmbient = useCallback(() => {
    const audio = ambientRef.current;
    if (!audio) return;

    fadeTo(audio, 0, 500);
    window.setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 560);
  }, []);

  const playTone = useCallback((type = "click") => {
    try {
      if (!synthRef.current) {
        synthRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const audioCtx = synthRef.current;
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
  }, []);

  useEffect(() => {
    playAmbient();
  }, [playAmbient]);

  return {
    ambientRef,
    playAmbient,
    stopAmbient,
    playTone,
  };
}
