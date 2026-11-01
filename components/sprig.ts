// Tooth Fairy brand shapes (64 x 64 coordinate space), shared by the logo and the mascot.
export const TOOTH =
  "M32 23.2c-4.6-3.2-15.8-3.4-16.4 8.4-.3 6.2 2.6 9.6 4 16.2 1.4 6.6 2.2 12.6 6 12.6 3.6 0 3.5-9.8 6.4-9.8s2.8 9.8 6.4 9.8c3.8 0 4.6-6 6-12.6 1.4-6.6 4.3-10 4-16.2-.6-11.8-11.8-11.6-16.4-8.4Z";
// left wings; the right pair is the same paths mirrored around x = 32
export const WING_UP = "M20.5 29.5C16.5 21 8.6 15.4 5.2 18.6 2 21.6 6.4 31 19.4 33.4Z";
export const WING_LOW = "M19.6 34.6C13.4 34.2 7.2 37 7.8 40.6c.6 3.8 7.2 2.6 12.6-3.4Z";
/** wing hinge point, used as the flap rotation origin */
export const HINGE = { x: 20, y: 32 };
/** four-point sparkle centred on (cx, cy) with radius r */
export function sparkle(cx: number, cy: number, r: number) {
  const k = r * 0.22;
  return `M${cx} ${cy - r}C${cx + k} ${cy - k} ${cx + k} ${cy - k} ${cx + r} ${cy}C${cx + k} ${cy + k} ${cx + k} ${cy + k} ${cx} ${cy + r}C${cx - k} ${cy + k} ${cx - k} ${cy + k} ${cx - r} ${cy}C${cx - k} ${cy - k} ${cx - k} ${cy - k} ${cx} ${cy - r}Z`;
}
export const SPARKLES: [number, number, number][] = [
  [32, 12.6, 8.4],
  [43.6, 6.4, 3.2],
  [21.6, 7.6, 2.2],
];
