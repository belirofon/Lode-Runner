import { Game } from './game';
import { TileType, LevelLayout, LevelConfig } from './types';

export class Level {
  private holes: Map<string, number> = new Map();
  private layout: LevelLayout;
  private readonly config: LevelConfig = {
    width: 26,
    height: 20,
    tileSize: 30,
    groundDensity: 0.4,
    ladderDensity: 0.1,
    goldDensity: 0.05
  };

  public spawnPoint: { x: number; y: number };

  constructor(private game: Game) {
    this.layout = this.generateLevel();
    this.spawnPoint = this.findSpawnPoint();
  }

  private generateLevel(): LevelLayout {
    const layout: LevelLayout = Array(this.config.height).fill(null)
      .map(() => Array(this.config.width).fill(' '));

    // Add borders
    for (let x = 0; x < this.config.width; x++) {
      layout[0][x] = 'B';
      layout[this.config.height - 1][x] = 'B';
    }
    for (let y = 0; y < this.config.height; y++) {
      layout[y][0] = 'B';
      layout[y][this.config.width - 1] = 'B';
    }

    // Generate platforms
    for (let y = 2; y < this.config.height - 1; y += 2) {
      let platformLength = 0;
      for (let x = 1; x < this.config.width - 1; x++) {
        if (Math.random() < this.config.groundDensity || platformLength > 0) {
          layout[y][x] = 'B';
          platformLength = Math.max(0, platformLength - 1);
          if (platformLength === 0 && Math.random() < 0.3) {
            platformLength = Math.floor(Math.random() * 4) + 2;
          }
        }
      }
    }

    // Add ladders
    for (let x = 1; x < this.config.width - 1; x++) {
      for (let y = 1; y < this.config.height - 1; y++) {
        if (layout[y][x] === ' ' && layout[y + 1][x] === 'B' && Math.random() < this.config.ladderDensity) {
          // Create vertical ladder
          let ladderHeight = Math.floor(Math.random() * 3) + 2;
          for (let h = 0; h < ladderHeight && y - h > 0; h++) {
            if (layout[y - h][x] === ' ') {
              layout[y - h][x] = 'L';
            }
          }
        }
      }
    }

    // Add gold
    for (let y = 1; y < this.config.height - 1; y++) {
      for (let x = 1; x < this.config.width - 1; x++) {
        if (layout[y][x] === ' ' && layout[y + 1][x] === 'B' && Math.random() < this.config.goldDensity) {
          layout[y][x] = 'G';
        }
      }
    }

    return layout;
  }

  private findSpawnPoint(): { x: number; y: number } {
    // Start from bottom-left, excluding the border
    for (let x = 1; x < this.config.width - 1; x++) {
      for (let y = this.config.height - 2; y > 0; y--) {
        if (this.layout[y][x] === ' ' && this.layout[y + 1][x] === 'B') {
          return {
            x: x * this.config.tileSize,
            y: y * this.config.tileSize
          };
        }
      }
    }
    // Fallback spawn point
    return {
      x: this.config.tileSize,
      y: (this.config.height - 2) * this.config.tileSize
    };
  }

  isGround(x: number, y: number): boolean {
    const tileX = Math.floor(x / this.config.tileSize);
    const tileY = Math.floor(y / this.config.tileSize);
    
    if (tileY >= this.layout.length || tileX >= this.layout[0].length) return false;
    return this.layout[tileY][tileX] === 'B';
  }

  isLadder(x: number, y: number): boolean {
    const tileX = Math.floor(x / this.config.tileSize);
    const tileY = Math.floor(y / this.config.tileSize);
    
    if (tileY >= this.layout.length || tileX >= this.layout[0].length) return false;
    return this.layout[tileY][tileX] === 'L';
  }

  canDig(x: number, y: number): boolean {
    return this.isGround(x, y) && !this.holes.has(`${x},${y}`);
  }

  dig(x: number, y: number): void {
    const key = `${x},${y}`;
    if (!this.holes.has(key)) {
      this.holes.set(key, 180);
    }
  }

  isHole(x: number, y: number): boolean {
    return this.holes.has(`${x},${y}`);
  }

  update(): void {
    for (const [key, timer] of this.holes.entries()) {
      if (timer <= 0) {
        this.holes.delete(key);
      } else {
        this.holes.set(key, timer - 1);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    for (let y = 0; y < this.layout.length; y++) {
      for (let x = 0; x < this.layout[y].length; x++) {
        const tile = this.layout[y][x];
        const tileX = x * this.config.tileSize;
        const tileY = y * this.config.tileSize;

        switch (tile) {
          case 'B':
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(tileX, tileY, this.config.tileSize, this.config.tileSize);
            break;
          case 'L':
            ctx.fillStyle = '#FFF';
            ctx.fillRect(tileX + 5, tileY, 5, this.config.tileSize);
            ctx.fillRect(tileX + 20, tileY, 5, this.config.tileSize);
            for (let i = 0; i < 3; i++) {
              ctx.fillRect(tileX + 5, tileY + (i * 10) + 5, 20, 3);
            }
            break;
          case 'G':
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(tileX + this.config.tileSize / 2, tileY + this.config.tileSize / 2, 8, 0, Math.PI * 2);
            ctx.fill();
            break;
        }
      }
    }

    // Draw holes
    ctx.fillStyle = '#000';
    for (const [key] of this.holes) {
      const [x, y] = key.split(',').map(Number);
      ctx.fillRect(x, y, this.config.tileSize, this.config.tileSize);
    }
  }
}
