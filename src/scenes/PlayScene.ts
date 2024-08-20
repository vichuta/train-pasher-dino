import Phaser from 'phaser'
import { PRELOAD_CONFIG } from '..'
import { Player } from '../entities/Player'
import { SpriteWithDynamicBody } from '../types'
import { GameScene } from './GameScene'

class PlayScene extends GameScene {
  // --- กำหนด Type ตัวแปร ---
  // player: SpriteWithDynamicBody เปลี่ยน Type เป็น Player
  player: Player
  ground: Phaser.GameObjects.TileSprite
  obstacles: Phaser.Physics.Arcade.Group
  startTrigger: SpriteWithDynamicBody

  gameOverText: Phaser.GameObjects.Image
  restartText: Phaser.GameObjects.Image
  gameOverContainer: Phaser.GameObjects.Container

  spawnInterval: number = 1500
  spawnTime: number = 0
  gameSpeed: number = 5

  constructor() {
    super('PlayScene')
  }

  create() {
    this.createEnvironment() // add ground
    this.createPlayer() // add Dino
    this.createObstacles()
    this.createGameOver()

    this.handleGameStart()
    this.handleObstacleCollisions()
    this.handleGameRestart()
  }

  createPlayer() {
    //ย้าย setting ต่างๆ ไปที่ class Player
    this.player = new Player(this, 0, this.gameHeight)
  }

  createEnvironment() {
    // add ground
    this.ground = this.add
      .tileSprite(0, this.gameHeight as number, 88, 26, 'ground')
      .setOrigin(0, 1)
  }

  update(time: number, delta: number): void {
    //ถ้าเกมยังไม่เริ่ม อย่าพึ่งทำอะไร
    if (!this.isGameRunning) {
      return
    }

    //ถ้าเกมเริ่มแล้ว ให้ทำ function ต่อไปนี้
    this.spawnTime += delta

    if (this.spawnTime >= this.spawnInterval) {
      this.spawnObstacle()
      this.spawnTime = 0
    }

    // เพิ่ม action ในเพิ่ม/ลดการเคลื่อนที่ในแนวแกน x
    Phaser.Actions.IncX(this.obstacles.getChildren(), -this.gameSpeed)

    // ถ้า obstacle ไหนวิ่งเลยจน x ติดลบ (วิ่งเลยขอบ) แล้ว --> ลบ objeect ทิ้ง
    this.obstacles.getChildren().forEach((obstacle: SpriteWithDynamicBody) => {
      if (obstacle.getBounds().right < 0) {
        this.obstacles.remove(obstacle)
      }
    })

    // ทำให้พื้นวิ่งตาม obstacle (ใช้ความเร็วแกน x เท่ากัน)
    this.ground.tilePositionX += this.gameSpeed
  }

  createObstacles() {
    this.obstacles = this.physics.add.group()
  }
  createGameOver() {
    // -- container : Game Over --
    this.gameOverText = this.add.image(0, 0, 'game-over')
    this.restartText = this.add.image(0, 80, 'restart').setInteractive()

    this.gameOverContainer = this.add
      .container(this.gameWidth / 2, this.gameHeight / 2 - 50)
      .add([this.gameOverText, this.restartText])
      .setAlpha(0)
  }

  spawnObstacle() {
    // สุ่มตัวเอง 1-7 (ใส่ค่า default ไว้ที่ index.ts)
    const obstaclesCount =
      PRELOAD_CONFIG.cactusesCount + PRELOAD_CONFIG.birdsCount
    const obstacleNum = Math.floor(Math.random() * obstaclesCount) + 1

    // สุ่มค่า x ระยะห่างในการ spawn obstacle
    const distance = Phaser.Math.Between(600, 900)

    let obstacle

    // ถ้าสุ่มได้เลข 7 ให้เป็น enemy-bird แต่ถ้าไม่เป็น obstacle (กระบองเพชร)
    if (obstacleNum > PRELOAD_CONFIG.cactusesCount) {
      // enemy-bird --> สุ่มค่า y เพื่อ spawn ในระยะความสูงที่แตกต่างกัน
      const enemyPossibleHeight = [20, 70]
      const enemyHeight = enemyPossibleHeight[Math.floor(Math.random() * 2)] // สุ่ม index เพื่อเลือกค่าใน enemyPossibleHeight array
      obstacle = this.obstacles
        .create(distance, this.gameHeight - enemyHeight, 'enemy-bird')
        .setOrigin(0, 1)
        .setImmovable()
    } else {
      // obstacle (กระบองเพชร)
      obstacle = this.obstacles
        .create(distance, this.gameHeight, `obstacle-${obstacleNum}`)
        .setOrigin(0, 1)
        .setImmovable()
    }
  }

  handleGameStart() {
    // startTrigger ใช้ตรวจจับ Dino กระโดด = เล่นเกม
    this.startTrigger = this.physics.add
      .sprite(0, 10, null)
      .setAlpha(0)
      .setOrigin(0, 1)

    // ถ้า object startTrigger ทับกับ Dino ให้ทำ function ต่อไปนี้
    this.physics.add.overlap(this.startTrigger, this.player, () => {
      // ถ้าตำแหน่ง y ของ startTrigger = 10 --> ให้ ย้ายไปอยู่ขอบซ้ายล่าง .body.reset(0,y)
      if (this.startTrigger.y === 10) {
        this.startTrigger.body.reset(0, this.gameHeight)
        console.log('Triggering upper Trigger!')
        return
      }

      // -- startTrigger ไม่อยู่มุมบนขวาแล้ว ให้ function ต่อไปนี้ --
      this.startTrigger.body.reset(9999, 9999) //ทำให้ startTrigger หายไป

      const rollOutEvent = this.time.addEvent({
        delay: 1000 / 60,
        loop: true,
        callback: () => {
          console.log('rolling')
          this.player.playRunAnimation()
          this.player.setVelocityX(80) // ทำให้ Dino เคลื่อนไปข้าวหน้านิดนึง
          this.ground.width += 17 * 2 // ทำให้ ground ยาวขึ้น

          // ถ้า ground ยาวเท่า gameWidth แล้ว
          if (this.ground.width >= this.gameWidth) {
            console.log('stop')
            this.ground.width = this.gameWidth
            this.player.setVelocityX(0) // Dino ค่อยหยุดเดิน
            rollOutEvent.remove() //ลบ function นี้ = หยุดทำฟังชั่นนี้ (ถ้าไม่ใส่ = function นี้จะทำงานต่อเรื่อยๆ)
            this.isGameRunning = true
          }
        }
      })
    })
  }
  handleObstacleCollisions() {
    // ตรวจสถานะการชนของ obstacle กับ Dino
    this.physics.add.collider(this.obstacles, this.player, () => {
      // --> ถ้าชนให้หยุดเกม
      this.isGameRunning = false
      this.physics.pause()

      // --> เปลี่ยนรูป Dino เป็นท่าตาย
      this.player.die()
      // --> show container Game Over
      this.gameOverContainer.setAlpha(1)

      // --> reset ค่า
      this.spawnTime = 0
      this.gameSpeed = 5
    })
  }
  handleGameRestart() {
    // restart button
    this.restartText.on('pointerdown', () => {
      this.physics.resume()
      this.player.setVelocityY(0)

      this.obstacles.clear(true, true)
      this.gameOverContainer.setAlpha(0)
      this.anims.resumeAll()

      this.isGameRunning = true
    })
  }
}

export default PlayScene
