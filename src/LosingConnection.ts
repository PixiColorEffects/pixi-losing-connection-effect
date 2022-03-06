import { Application, Container, SCALE_MODES, Sprite, Texture } from "pixi.js";

class LosingConnection {
  app: Application;
  stuckAt: number;
  stuckDuration: number = 100;
  container: Container;
  imageSprite: Sprite;
  blobUrlCache: string;
  delayValue: number; // 0 - 100
  isOn: boolean = false;

  constructor(app: Application, delay: number = 75) {
    this.app = app;
    this.container = new Container();
    this.container.zIndex = 9999;
    this.delay = delay;

    this.app.stage.addChild(this.container);
    this._bindEvent();
  }

  get delay(): number {
    return this.delayValue;
  }
  set delay(val: number) {
    this.delayValue = val;
  }

  public start() {
    if (this.isOn) return;
    this.container.visible = true;
    this.isOn = true;
  }

  public stop() {
    if (!this.isOn) return;
    this.container.visible = false;
    this.isOn = false;
  }

  public destroy() {
    this.app.ticker.remove(this._tinkerCallback, this);
    this.container.destroy();
  }

  private _bindEvent(): void {
    this.app.ticker.add(this._tinkerCallback, this);

    this.app.stage.on("childAdded", (child, container, index) => {
      console.log(this.app.stage.children);
    });
  }

  private _tinkerCallback() {
    this._update();
  }

  private _getTimestamp(): number {
    return new Date().getTime();
  }

  private _update(): void {
    if (!this.isOn) return;

    let timestamp = this._getTimestamp();
    if (this.stuckAt && this.stuckAt + this.stuckDuration > timestamp) {
      return;
    }

    this.stuckAt = timestamp;
    this.stuckDuration = this._getRandomValue("stuckDuration");
    this._renderImage();
  }

  private _renderImage() {
    this.container.visible = false;
    this.app.renderer.plugins.extract.canvas(this.app.stage).toBlob(
      (b: Blob) => {
        this.container.visible = true;

        //  释放缓存
        URL.revokeObjectURL(this.blobUrlCache);
        const blobUrl = URL.createObjectURL(b);
        b = null;

        this.blobUrlCache = blobUrl;

        if (!this.imageSprite) {
          this.imageSprite = Sprite.from(
            Texture.from(blobUrl, {
              width: this.app.stage.width,
              height: this.app.stage.height,
              scaleMode: SCALE_MODES.NEAREST,
            })
          );
          this.container.addChild(this.imageSprite);
          return;
        } else {
          // prettier-ignore
          //  @ts-ignore
          let source = this.imageSprite.texture.baseTexture.resource.source as HTMLImageElement
          source.src = blobUrl;
          this.imageSprite.texture.baseTexture.resource.update();
        }
      },
      "image/jpeg",
      this._getRandomValue("quality")
    );
  }

  /**
   * 获取随机数
   * @param type
   * @private
   */
  private _getRandomValue(type: "stuckDuration" | "quality") {
    let value = Math.min(Math.max(this.delayValue, 1), 100);
    if (type === "quality") {
      return (Math.random() * (100 - value) + 2) / 100;
    }

    if (type === "stuckDuration") {
      return Math.ceil(Math.random() * (value * 20) + 500);
    }
  }
}

export { LosingConnection };
