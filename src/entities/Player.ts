export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'dino-idle')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.init()
    // this.registerPlayerControl()
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
  }

  init() {
    this.setOrigin(0, 1)
      .setGravityY(5000)
      .setCollideWorldBounds(true)
      .setBodySize(44, 92)
  }

  // registerPlayerControl() {
  //   // ถ้ากด spacebar ให้ dino กระโดด
  //   const spaceBar = this.scene.input.keyboard.addKey(
  //     Phaser.Input.Keyboard.KeyCodes.SPACE
  //   )

  //   spaceBar.on('down', () => {
  //     this.setVelocityY(-1600)
  //   })
  // }
  update() {
    console.log('Player update!')
  }
}
