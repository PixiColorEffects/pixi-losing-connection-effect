import "./index.css";
import { Application, Texture, Container, Sprite } from "pixi.js";
import { LosingConnection } from "../src";

const app = new Application({
  view: document.getElementById("canvasOutput") as HTMLCanvasElement,
  width: 400,
  height: 240,
  autoStart: true,
});

const texture = Texture.from("/video.mp4");
/**@type {HTMLVideoElement}*/
//  @ts-ignore
const videoEl = texture.baseTexture.resource.source;

videoEl.autoplay = true;
videoEl.loop = true;
videoEl.muted = true;

const videoSprite = new Sprite(texture);
videoSprite.anchor.set(0, 0);
videoSprite.width = 400;
videoSprite.height = 240;

let container = new Container();
container.addChild(videoSprite);

app.stage.addChild(container);

//  use losing connection effect
const LC = new LosingConnection(app);

setTimeout(() => {
  LC.start();
}, 500);

//  controls
document.getElementById("delayLevel").addEventListener("change", (ev) => {
  let target = ev.target as HTMLInputElement;
  LC.delay = parseInt(target.value)
});

document.getElementById("on").addEventListener("click", () => {
  LC.start();
});

document.getElementById("off").addEventListener("click", () => {
  LC.stop();
});

document.getElementById("destroy").addEventListener("click", () => {
  LC.destroy();
});
