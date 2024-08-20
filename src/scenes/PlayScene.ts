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
  spawnInterval: number = 1500
  spawnTime: number = 0
  obstacleSpeed: number = 10

  constructor() {
    super('PlayScene')
  }

  create() {
    this.createEnvironment() // add ground
    this.createPlayer() // add Dino

    // startTrigger ใช้ตรวจจับ Dino กระโดด = เล่นเกม
    this.startTrigger = this.physics.add
      .sprite(0, 10, null)
      .setAlpha(0)
      .setOrigin(0, 1)

    this.obstacles = this.physics.add.group()
    // ถ้า object startTrigger ทับกับ Dino ให้ทำ function ต่อไปนี้
    this.physics.add.overlap(this.startTrigger, this.player, () => {
      // ถ้าตำแหน่ง y ของ startTrigger = 10 --> ให้ ย้ายไปอยู่ขอบซ้ายล่าง .body.reset(0,y)
      if (this.startTrigger.y === 10) {
        this.startTrigger.body.reset(0, this.gameHeight)
        console.log('Triggering upper Trigger!')
        return
      }

      // startTrigger ไม่อยู่มุมบนขวาแล้ว ให้ function ต่อไปนี้

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

  createPlayer() {
    // add Dino by create sprite object
    // this.player = this.physics.add
    //   .sprite(0, this.gameHeight, 'dino-idle')
    //   .setOrigin(0, 1)

    // this.player
    //   .setGravityY(5000)
    //   .setCollideWorldBounds(true) //ชนขอบจอ
    //   .setBodySize(44, 92) //fix hit-box dino

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
    Phaser.Actions.IncX(this.obstacles.getChildren(), -this.obstacleSpeed)
  }

  spawnObstacle() {
    const obstacleNum =
      Math.floor(Math.random() * PRELOAD_CONFIG.cactusesCount) + 1
    const distance = Phaser.Math.Between(600, 900)

    this.obstacles
      .create(distance, this.gameHeight, `obstacle-${obstacleNum}`)
      .setOrigin(0, 1)
  }
}

export default PlayScene
