import { Player } from './player';
import { Enemy } from './enemy';
import { Level } from './level';
import { GameObject } from './types';

export class Game {
  public score: number = 0;
  public lives: number = 3;
  public gameOver: boolean = false;

  private ctx: CanvasRenderingContext2D;
  private enemies: Enemy[];

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.canvas.width = 800;
    this.canvas.height = 600;

    this.level = new Level(this);
    this.player = new Player(this);
    this.enemies = [
      new Enemy(this, 100, 100),
      new Enemy(this, 700, 100)
    ];
  }

  start(): void {
    this.gameLoop();
  }

  private gameLoop = (): void => {
    this.update();
    this.draw();
    requestAnimationFrame(this.gameLoop);
  }

  private update(): void {
    if (this.gameOver) return;

    this.player.update();
    this.enemies.forEach(enemy => enemy.update());
    this.checkCollisions();
  }

  private draw(): void {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.level.draw(this.ctx);
    this.player.draw(this.ctx);
    this.enemies.forEach(enemy => enemy.draw(this.ctx));
    this.drawUI();
  }

  private drawUI(): void {
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    this.ctx.fillText(`Lives: ${this.lives}`, 10, 60);
  }

  private checkCollisions(): void {
    this.enemies.forEach(enemy => {
      if (this.player.collidesWith(enemy) && !enemy.isTrapped) {
        this.playerDied();
      }
    });
  }

  private playerDied(): void {
    this.lives--;
    if (this.lives <= 0) {
      this.gameOver = true;
    } else {
      this.resetLevel();
    }
  }

  public resetLevel(): void {
    this.player.reset();
    this.enemies.forEach(enemy => enemy.reset());
  }
}
