import { useCallback } from "react";
import type { Container, Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

interface ParticlesBackgroundProps {
  className?: string;
  variant?: "hero" | "features" | "products" | "services" | "cta";
}

const PARTICLE_PRESETS = {
  hero: {
    particles: {
      color: { value: "#ffffff" },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.2,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: { default: "bounce" },
        random: false,
        speed: 2,
        straight: false,
      },
      number: { density: { enable: true, area: 800 }, value: 80 },
      opacity: { value: 0.2 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 5 } },
    },
  },
  features: {
    particles: {
      color: { value: "#0077CC" },
      links: {
        enable: false,
      },
      move: {
        direction: "top",
        enable: true,
        outModes: { default: "out" },
        random: true,
        speed: 1,
        straight: false,
      },
      number: { density: { enable: true, area: 800 }, value: 40 },
      opacity: { value: 0.1 },
      shape: { type: "square" },
      size: { value: { min: 2, max: 8 } },
    },
  },
  products: {
    particles: {
      color: { value: ["#0077CC", "#3399EE", "#FF7A00"] },
      links: {
        enable: true,
        distance: 150,
        color: "#0077CC",
        opacity: 0.1,
        width: 1,
      },
      move: {
        enable: true,
        direction: "none",
        outModes: { default: "out" },
        random: true,
        speed: 1.5,
        straight: false,
      },
      number: { density: { enable: true, area: 900 }, value: 50 },
      opacity: { value: 0.3 },
      shape: { type: ["circle", "triangle"] },
      size: { value: { min: 1, max: 3 } },
    },
  },
  services: {
    particles: {
      color: { value: "#333333" },
      links: {
        enable: true,
        distance: 200,
        color: "#333333",
        opacity: 0.1,
        width: 1,
      },
      move: {
        enable: true,
        direction: "none",
        outModes: { default: "bounce" },
        random: false,
        speed: 1,
        straight: false,
      },
      number: { density: { enable: true, area: 1000 }, value: 30 },
      opacity: { value: 0.1 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 4 } },
    },
  },
  cta: {
    particles: {
      color: { value: "#ffffff" },
      links: {
        enable: true,
        distance: 100,
        color: "#ffffff",
        opacity: 0.2,
        width: 1,
      },
      move: {
        enable: true,
        direction: "none",
        outModes: { default: "out" },
        random: true,
        speed: 2,
        straight: false,
      },
      number: { density: { enable: true, area: 800 }, value: 60 },
      opacity: { value: 0.3 },
      shape: { type: ["star", "circle"] },
      size: { value: { min: 1, max: 4 } },
    },
  },
};

export function ParticlesBackground({ className = "", variant = "hero" }: ParticlesBackgroundProps) {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // Optional: Add any initialization after particles are loaded
  }, []);

  return (
    <Particles
      className={`absolute inset-0 -z-10 ${className}`}
      id={`tsparticles-${variant}`}
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        ...PARTICLE_PRESETS[variant],
        detectRetina: true,
      }}
    />
  );
} 