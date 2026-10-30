export * from "./mock";
export function levelBandName(n: number): "Inicial" | "Intermedio" | "Avanzado" {
  return n <= 3 ? "Inicial" : n <= 6 ? "Intermedio" : "Avanzado";
}
