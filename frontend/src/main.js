import { kaboomContext } from "./scripts/kaboomCtx.js";
import { scaleFactor } from "./scripts/constants.js";

// load assets
kaboomContext.loadSprite("Player", "../characters/Player/Player.png", {
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

// create player
const player = kaboomContext.add([
  kaboomContext.sprite("Player", { anim: "idleDown" }),
  kaboomContext.pos(kaboomContext.center()),
  kaboomContext.scale(4),
  kaboomContext.area(),
  "player",
]);

let lastDirection = "idleDown";

// movement controls
kaboomContext.onKeyDown("left", () => {
  player.move(-SPEED, 0);
  player.flipX = true;
  if (player.curAnim() !== "walkLeft") {
    player.play("walkLeft");
  }
  lastDirection = "idleLeft";
});

kaboomContext.onKeyDown("right", () => {
  player.flipX = false;
  player.move(SPEED, 0);
  if (player.curAnim() !== "walkRight") {
    player.play("walkRight");
  }
  lastDirection = "idleRight";
});

kaboomContext.onKeyDown("up", () => {
  player.move(0, -SPEED);
  if (player.curAnim() !== "walkUp") {
    player.play("walkUp");
  }
  lastDirection = "idleUp";
});

kaboomContext.onKeyDown("down", () => {
  player.move(0, SPEED);
  if (player.curAnim() !== "walkDown") {
    player.play("walkDown");
  }
  lastDirection = "idleDown";
});

kaboomContext.onKeyRelease(() => {
  if (
    !kaboomContext.isKeyDown("left") &&
    !kaboomContext.isKeyDown("right") &&
    !kaboomContext.isKeyDown("up") &&
    !kaboomContext.isKeyDown("down")
  ) {
    player.play(lastDirection);
  }
});

// map loading and background
kaboomContext.loadSprite("map", "../public/maps/map.png");

kaboomContext.setBackground(kaboomContext.rgb(62, 137, 72));

kaboomContext.scene("main", async () => {
  const mapData = await (await fetch("public/maps/map.json")).json();
  const layers = mapData.layers;

  const map = kaboomContext.add([
    kaboomContext.sprite("map"),
    kaboomContext.pos(0),
    kaboomContext.scale(scaleFactor),
  ]);

  const player = kaboomContext.make([
    kaboomContext.sprite("spritesheet", { anim: "idle-down" }),
    kaboomContext.area({
      shape: new kaboomContext.Rect(kaboomContext.vec2(0, 3), 10, 10),
    }),
    kaboomContext.body(),
    kaboomContext.anchor("center"),
    kaboomContext.pos(),
    kaboomContext.scale(scaleFactor),
    {
      speed: 256,
      direction: "down",
      isInDialogue: false,
    },
    "player",
  ]);

  for (const layer of layers) {
    if (layer.name === "boundaries" || layer.name === "object-boundaries") {
      for (const boundary of layer.objects) {
        map.add([
          kaboomContext.area({
            shape: new kaboomContext.Rect(
              kaboomContext.vec2(0),
              boundary.width,
              boundary.height
            ),
          }),
          kaboomContext.body({ isStatic: true }),
          kaboomContext.pos(boundary.x, boundary.y),
          boundary.name,
        ]);

        if (boundary.name) {
          player.onCollide(boundary.name, () => {
            player.isInDialogue = true;
          });
        }
      }
    }
  }
});

kaboomContext.go("main");
