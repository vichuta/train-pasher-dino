import Phaser from 'phaser'
import { Player } from '../entities/Player'
import { SpriteWithDynamicBody } from '../types'

class PlayScene extends Phaser.Scene {
  // player: SpriteWithDynamicBody เปลี่ยน Type เป็น Player
  player: Player
  startTrigger: SpriteWithDynamicBody

  // get ค่าความสูงของเกม
  get gameHeight() {
    return this.game.config.height as number
  }

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

    // ถ้า object startTrigger ทับกับ Dino ให้ทำ function ต่อไปนี้
    this.physics.add.overlap(this.startTrigger, this.player, () => {
      // ถ้าตำแหน่ง y ของ startTrigger = 10 --> ให้ ย้ายไปอยู่ขอบซ้ายล่าง .body.reset(0,y)
      if (this.startTrigger.y === 10) {
        this.startTrigger.body.reset(0, this.gameHeight)
        console.log('Triggering upper Trigger!')
        return
      }

      this.startTrigger.body.reset(9999, 9999) //ทำให้ startTrigger หายไป
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
    this.add
      .tileSprite(0, this.gameHeight as number, 88, 26, 'ground')
      .setOrigin(0, 1)
  }

  update(time: number, delta: number): void {
    this.player.update()
  }
}

export default PlayScene
