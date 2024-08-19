import Phaser from 'phaser'

class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayScene')
  }

  create() {
    this.game.config.height
    this.add.tileSprite(0, 340, 1000, 26, 'ground').setOrigin(0, 1)
  }
}

export default PlayScene
