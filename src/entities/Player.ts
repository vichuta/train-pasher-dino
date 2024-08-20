import { GameScene } from '../scenes/GameScene'

export class Player extends Phaser.Physics.Arcade.Sprite {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys // CursorKeys เป็น type Object ที่เก็บ keyborad ขึ้น-ลง-ซ้าย-ขวา-spacebar
  scene: GameScene

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, 'dino-run')

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
      .setOffset(20, 0)

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
    const { space, down } = this.cursors
    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space)
    const isDownJustDown = Phaser.Input.Keyboard.JustDown(down)
    const isDownJustUp = Phaser.Input.Keyboard.JustUp(down)

    const onFloor = (this.body as Phaser.Physics.Arcade.Body).onFloor() //เช็คว่า Player ยืนบนพื้นไหม
    // console.log(onFloor)

    // space.isDown = ถ้าปุ่ม spacebar ถูกกดอยู่ / กด spacebar ค้าง = โดดดดดดดดด ลอยเลย
    // isSpaceJustDown = ถ้าปุ่ม spacebar ถูกกดแล้ว = กระโดด (กดค้างไม่ลอย)
    // เพิ่ม && onFloor ทำให้กระโดดกลางอากาศไม่ได้
    if (isSpaceJustDown && onFloor) {
      this.setVelocityY(-1600)
    }

    // -- ถ้ากดปุ่ม down ขยับ hit-box ให้ต่ำลง แต่ไม่ได้กดปุ่มให้กลับมาตำแหน่งเดิม --
    if (isDownJustDown && onFloor) {
      this.body.setSize(this.body.width, 58)
      this.setOffset(60, 34)
    }
    if (isDownJustUp && onFloor) {
      this.body.setSize(44, 92)
      this.setOffset(20, 0)
    }
    // if (!(this.scene as any).isGameRunning) {
    //   return
    // }
    if (!this.scene.isGameRunning) {
      return
    }

    if (this.body.deltaAbsY() > 0) {
      this.anims.stop()
      this.setTexture('dino-run', 0)
    } else {
      this.playRunAnimation()
    }
  }

  playRunAnimation() {
    //ถ้าความสูงน้อยกว่า 58 ให้ทำท่าก้ม
    this.body.height <= 58
      ? this.play('dino-down', true)
      : this.play('dino-run', true)
  }

  registerAnimations() {
    //animation ท่าย้ำเท้า
    this.anims.create({
      key: 'dino-run',
      frames: this.anims.generateFrameNames('dino-run', { start: 2, end: 3 }),
      frameRate: 10,
      repeat: -1
    })

    //animation ท่าก้ม + ย่ำเท้า
    this.anims.create({
      key: 'dino-down',
      frames: this.anims.generateFrameNames('dino-down'),
      frameRate: 10,
      repeat: -1
    })
  }

  die() {
    this.anims.pause() //หยุดย่ำท้า
    this.setTexture('dino-hurt') // เปลี่ยนเป็นรูป Dino ท่าตาย
  }
}
