import Phaser from 'phaser'
import { SpriteWithDynamicBody } from '../types'

class PlayScene extends Phaser.Scene {
  player: SpriteWithDynamicBody
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
    this.registerPlayerControl()
  }

  createPlayer() {
    // add Dino by create sprite object
    this.player = this.physics.add
      .sprite(0, this.gameHeight, 'dino-idle')
      .setOrigin(0, 1)

    this.player
      .setGravityY(5000)
      .setCollideWorldBounds(true) //ชนขอบจอ
      .setBodySize(44, 92) //fix hit-box dino
  }

  createEnvironment() {
    // add ground
    this.add
      .tileSprite(0, this.gameHeight as number, 88, 26, 'ground')
      .setOrigin(0, 1)
  }

  registerPlayerControl() {
    // ถ้ากด spacebar ให้ dino กระโดด
    const spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    )

    spaceBar.on('down', () => {
      this.player.setVelocityY(-1600)
    })
  }
}

export default PlayScene
