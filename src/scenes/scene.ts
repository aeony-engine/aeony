import { Camera } from '../view/camera';
import { Entity } from './entity';

export class Scene {
  isSubScene = false;

  cameras: Camera[] = [];

  layers: Entity[][] = [];

  entities: Entity[] = [];

  private entitiesToRemove: Entity[] = [];

  private layerTracking: Record<number, number> = {};

  constructor() {
    for (let i = 0; i < 32; i++) {
      this.layers.push([]);
    }
    this.cameras.push(new Camera());
  }

  addEntity(entity: Entity): void {
    this.entities.push(entity);
    this.layers[entity.layer].push(entity);
    this.layerTracking[entity.id] = entity.layer;
  }

  removeEntity(entity: Entity): void {
    this.entitiesToRemove.push(entity);
  }

  preUpdate(dt: number): void {
    this.removeEntities();

    for (const entity of this.entities) {
      if (entity.active && entity.preUpdate) {
        entity.preUpdate(dt);
      }
    }
  }

  update(dt: number): void {
    for (const entity of this.entities) {
      if (entity.active && entity.update) {
        entity.update(dt);
      }
    }
  }

  postUpdate(dt: number): void {
    for (const entity of this.entities) {
      if (entity.active && entity.postUpdate) {
        entity.postUpdate(dt);
      }
    }
  }

  draw(): void {
    for (const entity of this.entities) {
      if (entity.active) {
        this.updateLayer(entity);
      }
    }

    const currentCanvas = love.graphics.getCanvas();

    for (const camera of this.cameras) {
      if (camera.active) {
        camera.updateTransform();

        love.graphics.setCanvas(camera.canvas!);
        const [r, g, b, a] = camera.bgColor.parts();
        love.graphics.clear(r, g, b, a);

        love.graphics.push();
        love.graphics.applyTransform(camera.transform);

        this.drawWithCamera(camera);

        love.graphics.pop();
      }
    }

    love.graphics.setCanvas(currentCanvas);
    love.graphics.origin();
    love.graphics.setColor(1, 1, 1, 1);

    for (const camera of this.cameras) {
      if (camera.active) {
        love.graphics.draw(camera.canvas!, camera.screenBounds.x, camera.screenBounds.y);
      }
    }
  }

  drawWithCamera(camera: Camera): void {
    for (let i = 0; i < this.layers.length; i++) {
      const entities = this.layers[i];
      if (entities.length > 0 && !camera.ignoredLayers.includes(i)) {
        for (const entity of entities) {
          if (entity.active && entity.draw) {
            entity.draw();
          }
        }
      }
    }
  }

  pause(): void {
    // Pause when a new scene is pushed.
  }

  resume(): void {
    // Resume when the scene above scene is popped.
  }

  toForeground(): void {
    // Called when the scene is brought to the foreground.
  }

  toBackground(): void {
    // Called when the scene is sent to the background.
  }

  resize(_width: number, _height: number): void {
    for (const camera of this.cameras) {
      camera.resize();
    }
  }

  destroy(): void {
    for (const camera of this.cameras) {
      camera.destroy();
    }

    for (const entity of this.entities) {
      entity.destroy();
    }
  }

  private updateLayer(entity: Entity): void {
    if (entity.layerUpdated) {
      const currentLayer = this.layerTracking[entity.id];

      if (currentLayer !== entity.layer) {
        const index = this.layers[currentLayer].indexOf(entity);
        if (index !== -1) {
          this.layers[currentLayer].splice(index, 1);
        }

        this.layers[entity.layer].push(entity);
        this.layerTracking[entity.id] = entity.layer;
      }
      entity.layerUpdated = false;
    }
  }

  private removeEntities(): void {
    while (this.entitiesToRemove.length > 0) {
      const entity = this.entitiesToRemove.pop()!;
      entity.destroy();

      const index = this.entities.indexOf(entity);
      if (index !== -1) {
        this.entities.splice(index, 1);
      }

      const layer = this.layerTracking[entity.id];
      const layerIndex = this.layers[layer].indexOf(entity);
      if (layerIndex !== -1) {
        this.layers[layer].splice(layerIndex, 1);
      }
    }
  }
}
