export interface RoomWalkLabels {
  /** Texto del botón mientras se está dentro del paseo. */
  exit?: string;
  /** Texto del botón cuando se ha salido al modo lista. */
  enter?: string;
}

export interface RoomWalkOptions {
  /** Píxeles por metro. Sube para que todo se vea más grande. */
  unit?: number;
  /** Altura de los ojos sobre el suelo, en metros. */
  eyeHeight?: number;
  /** Altura de las paredes por defecto, en metros. */
  wallHeight?: number;
  /** Ancho por defecto de una habitación, en metros. */
  roomWidth?: number;
  /** Fondo por defecto de una habitación, en metros. */
  roomDepth?: number;
  doorWidth?: number;
  doorHeight?: number;
  /** Píxeles de scroll por metro andado: el ritmo del paseo. */
  scrollPerMetre?: number;
  /** 0–1. Cuánto persigue la cámara al scroll; bajo = más deslizante. */
  smoothing?: number;
  /** Metros que mira por delante: cuánto se anticipa el giro a la esquina. */
  lookahead?: number;
  /** Metros por zancada, para el balanceo. */
  stride?: number;
  /** Balanceo de la cabeza al andar. */
  bob?: boolean;
  /** Cuántas celdas a cada lado se siguen pintando. 0 lo desactiva. */
  cullCells?: number;
  /** Entrar solo al paseo al arrancar (salvo prefers-reduced-motion). */
  autoEnter?: boolean;
  labels?: RoomWalkLabels;
}

export interface RoomWalkHandle {
  /** Monta el paseo 3D sobre las secciones. */
  enter(): void;
  /** Devuelve la página a una pila de secciones normal. */
  exit(): void;
  isActive(): boolean;
  /** Deshace todo y suelta los escuchadores. */
  destroy(): void;
}

export function createRoomWalk(
  root: HTMLElement,
  options?: RoomWalkOptions,
): RoomWalkHandle;

export default createRoomWalk;
