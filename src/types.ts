export interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  draw(ctx: CanvasRenderingContext2D): void;
}

export interface GameObject {
  update(): void;
}

export type TileType = 'B' | 'L' | 'G' | ' ';
export type LevelLayout = TileType[][];

export interface LevelConfig {
  width: number;
  height: number;
  tileSize: number;
  groundDensity: number;
  ladderDensity: number;
  goldDensity: number;
}