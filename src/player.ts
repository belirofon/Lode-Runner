import { Game } from './game';
import { Entity, GameObject } from './types';

export class Player implements Entity, GameObject {
  public x: number;
  public y: number;
  public width: number = 30;
  public height: number = 30;
  public velocityX: number = 0;
  public velocityY: number = 0;

  private speed: number = 5;
  private gravity: number = 0.5;

  constructor(private game: Game) {
    this.reset();
  }

  reset(): void {
    const spawnPoint = this.game.level.spawnPoint;
    this.x = spawnPoint.x;
    this.y = spawnPoint.y;
    this.velocityX = 0;
    this.velocityY = 0;
  }

  update(): void {
    this.handleInput();
    this.applyPhysics();
  }

  private handleInput(): void {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowLeft':
          this.velocityX = -this.speed;
          break;
        case 'ArrowRight':
          this.velocityX = this.speed;
          break;
        case 'ArrowUp':
          if (this.game.level.isLadder(this.x, this.y)) {
            this.velocityY = -this.speed;
          }
          break;
        case 'ArrowDown':
          if (this.game.level.isLadder(this.x, this.y)) {
            this.velocityY = this.speed;
          }
          break;
        case 'z':
          this.digLeft();
          break;
        case 'x':
          this.digRight();
          break;
      }
    });

    document.addEventListener('keyup', (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
          this.velocityX = 0;
          break;
        case 'ArrowUp':
        case 'ArrowDown':
          if (this.game.level.isLadder(this.x, this.y)) {
            this.velocityY = 0;
          }
          break;
      }
    });
  }

  private applyPhysics(): void {
    if (!this.game.level.isGround(this.x, this.y + this.height) && 
        !this.game.level.isLadder(this.x, this.y)) {
      this.velocityY += this.gravity;
    }

    this.x += this.velocityX;
    this.y += this.velocityY;

    // Collision with ground
    if (this.game.level.isGround(this.x, this.y + this.height)) {
      this.y = Math.floor(this.y / 30) * 30;
      this.velocityY = 0;
    }

    // Screen boundaries
    this.x = Math.max(0, Math.min(this.x, this.game.canvas.width - this.width));
    this.y = Math.max(0, Math.min(this.y, this.game.canvas.height - this.height));
  }

  private digLeft(): void {
    if (this.game.level.canDig(this.x - this.width, this.y + this.height)) {
      this.game.level.dig(this.x - this.width, this.y + this.height);
    }
  }

  private digRight(): void {
    if (this.game.level.canDig(this.x + this.width, this.y + this.height)) {
      this.game.level.dig(this.x + this.width, this.y + this.height);
    }
  }

  collidesWith(entity: Entity): boolean {
    return this.x < entity.x + entity.width &&
           this.x + this.width > entity.x &&
           this.y < entity.y + entity.height &&
           this.y + this.height > entity.y;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#4B0082';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}