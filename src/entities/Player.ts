export class Player extends Phaser.Physics.Arcade.Sprite {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys // CursorKeys เป็น type Object ที่เก็บ keyborad ขึ้น-ลง-ซ้าย-ขวา-spacebar
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'dino-idle')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.init()
    // this.registerPlayerControl()

    // เมื่อเกิด event update ให้ทำ function "this.update" โดยใช้ update เฉพาะใน class นี้
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
  }

  init() {
    this.cursors = this.scene.input.keyboard.createCursorKeys()
    this.setOrigin(0, 1)
      .setGravityY(5000)
      .setCollideWorldBounds(true)
      .setBodySize(44, 92)

    this.registerAnimations()
  }

  // registerPlayerControl() {
  //   // ถ้ากด spacebar ให้ dino กระโดด *แต่กดค้าง = กระโดดครั้งเดียว
  //   const spaceBar = this.scene.input.keyboard.addKey(
  //     Phaser.Input.Keyboard.KeyCodes.SPACE
  //   )

  //   spaceBar.on('down', () => {
  //     this.setVelocityY(-1600)
  //   })
  // }
  update() {
    const { space } = this.cursors
    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space)

    const onFloor = (this.body as Phaser.Physics.Arcade.Body).onFloor() //เช็คว่า Player ยืนบนพื้นไหม
    // console.log(onFloor)

    // space.isDown = ถ้าปุ่ม spacebar ถูกกดอยู่ / กด spacebar ค้าง = โดดดดดดดดด ลอยเลย
    // isSpaceJustDown = ถ้าปุ่ม spacebar ถูกกดแล้ว = กระโดด (กดค้างไม่ลอย)
    if (isSpaceJustDown) {
      this.setVelocityY(-1600)
    }
  }

  playRunAnimation() {
    this.play('dino-run', true)
  }

  registerAnimations() {
    this.anims.create({
      key: 'dino-run',
      frames: this.anims.generateFrameNames('dino-run', { start: 2, end: 3 }),
      frameRate: 10,
      repeat: -1
    })
  }
}
