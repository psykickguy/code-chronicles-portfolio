import kaboom from "kaboom";

// initialize context
kaboom({
  font: "sink",
  background: [210, 210, 210], // light gray background`
});

// load assets
loadSprite("Player", "../characters/Player/Player.png", {
  sliceX: 6,
  sliceY: 10,
  anims: {
    idleDown: 5,
    walkDown: { from: 18, to: 23, loop: true, speed: 8 },

    idleLeft: 11,
    walkLeft: { from: 24, to: 29, loop: true, speed: 8 },

    idleRight: 11,
    walkRight: { from: 24, to: 29, loop: true, speed: 8 },

    idleUp: 17,
    walkUp: { from: 30, to: 35, loop: true, speed: 8 },
  },
});

// define constants
const SPEED = 180;

//variables
const player = add([
  sprite("Player", { anim: "idleDown" }),
  pos(center()),
  scale(4),
  area(),
  "player",
]);

let lastDirection = "idleDown";

onKeyDown("left", () => {
  player.move(-SPEED, 0);
  player.flipX = true;
  if (player.curAnim() !== "walkLeft") {
    player.play("walkLeft");
  }
  lastDirection = "idleLeft";

  // player.scale.x = -Math.abs(player.scale.x); // Flip horizontally by setting scale.x negative
});

onKeyDown("right", () => {
  player.flipX = false;
  player.move(SPEED, 0);
  if (player.curAnim() !== "walkRight") {
    player.play("walkRight");
  }
  lastDirection = "idleRight";
});

onKeyDown("up", () => {
  player.move(0, -SPEED);
  if (player.curAnim() !== "walkUp") {
    player.play("walkUp");
  }
  lastDirection = "idleUp";
});

onKeyDown("down", () => {
  player.move(0, SPEED);
  if (player.curAnim() !== "walkDown") {
    player.play("walkDown");
  }
  lastDirection = "idleDown";
});

onKeyRelease(() => {
  if (
    !isKeyDown("left") &&
    !isKeyDown("right") &&
    !isKeyDown("up") &&
    !isKeyDown("down")
  ) {
    player.play(lastDirection);
  }
});
