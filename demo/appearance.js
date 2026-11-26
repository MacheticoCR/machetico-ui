import { InjectionToken, signal } from '@angular/core';
/**
 * Application-owned visual choice, isolated per SSR injector and shared across demo SPA navigation.
 * The distributed library has no dependency on this token or any demo design.
 * @property DEMO_APPEARANCE
 */
export const DEMO_APPEARANCE = new InjectionToken('Documentation consumer appearance', {
  providedIn: 'root',
  factory: () => signal('flat-material'),
});

/**
 * Abstract design examples owned by the documentation consumer, not by the distributed library.
 * @property DEMO_DESIGNS
 */
export const DEMO_DESIGNS = [
  {
    value: 'liquid-glass',
    label: 'Liquid Glass',
    description: 'Capas translúcidas, reflejos y bordes suaves.',
  },
  { value: 'aero', label: 'Aero', description: 'Cristal azul, brillo y controles con relieve.' },
  {
    value: 'glassmorphism',
    label: 'Glassmorphism',
    description: 'Paneles esmerilados sobre fondos de color.',
  },
  {
    value: 'neumorphism',
    label: 'Neumorphism',
    description: 'Superficies suaves, luces y sombras sobre una misma base.',
  },
  {
    value: 'flat-material',
    label: 'Flat / Material',
    description: 'Superficies claras, jerarquía y controles de color sólido.',
  },
  {
    value: 'material',
    label: 'Material Design',
    description:
      'Inspirado en Material clásico: elevación, índigo y superficies de bordes discretos.',
  },
  {
    value: 'brutalism',
    label: 'Neo Brutalism',
    description: 'Bordes gruesos, sombras duras y superficies de alto carácter.',
  },
  {
    value: 'editorial',
    label: 'Editorial',
    description: 'Tipografía serif, papel cálido y detalles sobrios.',
  },
  {
    value: 'swiss',
    label: 'Swiss / International',
    description: 'Grillas claras, contraste tipográfico y acentos precisos.',
  },
  {
    value: 'retro-terminal',
    label: 'Retro Terminal',
    description: 'Monoespaciado, verde sobre fondo oscuro y contornos nítidos.',
  },
  {
    value: 'blueprint',
    label: 'Blueprint',
    description: 'Retícula técnica, azules profundos y líneas de plano.',
  },
  {
    value: 'high-contrast',
    label: 'High Contrast',
    description: 'Contraste blanco y negro con acentos amarillos.',
  },
  {
    value: 'one-ui',
    label: 'Samsung / One UI',
    description: 'Inspirado en One UI: cabeceras amplias y grupos de tarjetas redondeadas.',
  },
  {
    value: 'android-material',
    label: 'Android / Material You',
    description: 'Inspirado en Android: superficies tonales y controles de formas suaves.',
  },
];
