/**
 * Synthetic reference table columns; their values are read from the actual public metadata.
 * @property apiColumns
 */
export const apiColumns = [
  { key: 'name', label: 'Nombre', value: (row) => row.name },
  { key: 'kind', label: 'Contrato', value: (row) => row.kind },
  { key: 'type', label: 'Tipo', value: (row) => row.type },
  { key: 'default', label: 'Valor inicial', value: (row) => row.default },
  { key: 'description', label: 'Descripción', value: (row) => row.description },
];
/**
 * Stable row key for public input/output documentation.
 * @property apiKey
 */
export const apiKey = (row) => row.name;
/**
 * Generates a small local SVG illustration without remote requests or private media.
 * @function sampleSvg
 * @param color - Example fill color.
 * @param label - Static sample caption.
 * @returns A deterministic browser-loadable data URL.
 */
export function sampleSvg(color, label) {
  return (
    'data:image/svg+xml,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="240" viewBox="0 0 480 240"><rect width="480" height="240" fill="${color}"/><circle cx="360" cy="55" r="25" fill="#ffffff80"/><path d="M0 240 140 70 280 240M180 240 330 110 480 240" fill="#ffffff50"/><text x="24" y="210" font-family="sans-serif" font-size="24" fill="#123">${label}</text></svg>`,
    )
  );
}

/**
 * Creates a portrait illustration that fills the Taurus-style carousel frame without remote assets.
 * @function samplePortrait
 * @param color - Synthetic background fill.
 * @param label - Static example title.
 * @returns A deterministic SVG data URL with a four-to-five aspect ratio.
 */
export function samplePortrait(color, label) {
  return (
    'data:image/svg+xml,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1120" height="1400" viewBox="0 0 1120 1400"><rect width="1120" height="1400" fill="${color}"/><circle cx="830" cy="280" r="130" fill="#ffffff99"/><path d="M0 1050 320 450 760 1240M350 1400 790 680 1120 1170V1400" fill="#ffffff66"/><path d="M0 1280Q500 1000 1120 1290V1400H0Z" fill="#0f172a15"/><text x="80" y="1180" font-family="sans-serif" font-size="60" font-weight="700" fill="#123">${label}</text><text x="80" y="1260" font-family="sans-serif" font-size="32" fill="#345">Machetico UI · Galería de ejemplo</text></svg>`,
    )
  );
}
