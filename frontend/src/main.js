import { kaboomContext as k } from "./kaboomCtx.js";
import { scaleFactor, dialogueData } from "./constants.js";
import { displayDialogue, setCamScale } from "./utils.js";

// Load assets
k.loadSprite("Player", "/characters/Player/Player.png", {
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

k.loadSprite("map", "/maps/map.png");

k.setBackground(k.Color.fromHex("#3e8948"));

k.scene("main", async () => {
  const mapData = await (await fetch("/maps/map.json")).json();
  const layers = mapData.layers;

  const map = k.add([k.sprite("map"), k.pos(0), k.scale(scaleFactor)]);

  const player = k.make([
    k.sprite("Player", { anim: "idleDown" }),
    k.area({ shape: new k.Rect(k.vec2(0, 3), 10, 10) }),
    k.body(),
    k.anchor("center"),
    k.pos(),
    k.scale(scaleFactor),
    {
      speed: 256,
      direction: "down",
      isInDialogue: false,
    },
    "player",
  ]);

  for (const layer of layers) {
    if (layer.name === "boundaries") {
      for (const boundary of layer.objects) {
        k.add([
          k.area({
            shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
          }),
          k.body({ isStatic: true }),
          k.pos(boundary.x * scaleFactor, boundary.y * scaleFactor),
          boundary.name,
        ]);

        if (boundary.name) {
          player.onCollide(boundary.name, () => {
            player.isInDialogue = true;
            displayDialogue(dialogueData[boundary.name], () => {
              player.isInDialogue = false;
            });
          });
        }
      }
    }

    // if (layer.name === "spawnpoint") {
    //   for (const entity of layer.objects) {
    //     if (entity.name === "player") {
    //       player.pos = k.vec2(entity.x * scaleFactor, entity.y * scaleFactor);
    //     }
    //   }
    //   k.add(player);
    // }
    if (layer.name === "spawnpoints") {
      for (const entity of layer.objects) {
        if (entity.name === "player") {
          player.pos = k.vec2(
            (map.pos.x + entity.x) * scaleFactor,
            (map.pos.y + entity.y) * scaleFactor
          );
        }
        k.add(player);
        continue;
      }
    }
  }

  setCamScale(k);
  k.onResize(() => setCamScale(k));

  k.onUpdate(() => {
    k.camPos(player.worldPos().x, player.worldPos().y - 100);
  });

  // === Player Movement by Mouse ===
  k.onMouseDown((mouseBtn) => {
    if (mouseBtn !== "left" || player.isInDialogue) return;

    const worldMousePos = k.toWorld(k.mousePos());
    player.moveTo(worldMousePos, player.speed);

    const angle = player.pos.angle(worldMousePos);
    const lower = 50;
    const upper = 125;

    if (angle > lower && angle < upper && player.curAnim() !== "walkUp") {
      player.play("walkUp");
      player.direction = "up";
      return;
    }

    if (angle < -lower && angle > -upper && player.curAnim() !== "walkDown") {
      player.play("walkDown");
      player.direction = "down";
      return;
    }

    if (Math.abs(angle) > upper) {
      player.flipX = false;
      if (player.curAnim() !== "walkRight") player.play("walkRight");
      player.direction = "right";
      return;
    }

    if (Math.abs(angle) < lower) {
      player.flipX = true;
      if (player.curAnim() !== "walkLeft") player.play("walkLeft");
      player.direction = "left";
      return;
    }
  });

  function stopAnims() {
    const dir = player.direction;
    if (dir === "down") return player.play("idleDown");
    if (dir === "up") return player.play("idleUp");
    if (dir === "left") return player.play("idleLeft");
    return player.play("idleRight");
  }

  k.onMouseRelease(stopAnims);
  k.onKeyRelease(stopAnims);

  k.onKeyDown(() => {
    const keys = [
      k.isKeyDown("right"),
      k.isKeyDown("left"),
      k.isKeyDown("up"),
      k.isKeyDown("down"),
    ];

    if (player.isInDialogue || keys.filter(Boolean).length > 1) return;

    if (keys[0]) {
      player.flipX = false;
      if (player.curAnim() !== "walkRight") player.play("walkRight");
      player.direction = "right";
      player.move(player.speed, 0);
      return;
    }

    if (keys[1]) {
      player.flipX = true;
      if (player.curAnim() !== "walkLeft") player.play("walkLeft");
      player.direction = "left";
      player.move(-player.speed, 0);
      return;
    }

    if (keys[2]) {
      if (player.curAnim() !== "walkUp") player.play("walkUp");
      player.direction = "up";
      player.move(0, -player.speed);
      return;
    }

    if (keys[3]) {
      if (player.curAnim() !== "walkDown") player.play("walkDown");
      player.direction = "down";
      player.move(0, player.speed);
    }
  });
});

k.go("main");
