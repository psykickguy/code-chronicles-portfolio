import kaboom from "kaboom";
// import { scaleFactor } from "./constants";

export const kaboomContext = kaboom({
  global: false,
  touchToMouse: true,
  canvas: document.getElementById("game"),
  //debug: false // set to false once ready for production
});
