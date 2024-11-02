import { Game } from './game';
import { Entity, GameObject } from './types';

export class Enemy implements Entity, GameObject {
  private trapTimer: number = 0;
  
  public x: number;
  public y: number;
  public width: number = 30;
  public height: number = 30;
  public velocityX: number = 2;
  public isTrapped: boolean = false;

  constructor(private game: Game, private startX: number, private startY: number) {
    this.reset();
  }

  reset(): void {
    this.x = this.startX;
    this.y = this.startY;
    this.isTrapped = false;
    this.trapTimer = 0;
  }

  update(): void {
    if (this.isTrapped) {
      if (--this.trapTimer <= 0) this.isTrapped = false;
      return;
    }

    const player = this.game.player;
    if (Math.abs(this.x - player.x) > 10) {
      this.velocityX = this.x < player.x ? 2 : -2;
    }
    this.x += this.velocityX;

    if (this.game.level.isHole(this.x, this.y + this.height)) {
      this.fall();
    }
  }

  private fall(): void {
    this.isTrapped = true;
    this.trapTimer = 150;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.isTrapped ? '#666' : '#0F0';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
