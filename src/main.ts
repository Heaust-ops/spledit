import "@babylonjs/loaders/SPLAT";
import { GModder } from "./gMods";
import { makeGUI } from "./gui/gui";
import { Engine } from "@babylonjs/core/Engines/engine";
import { GaussianSplattingMesh } from "@babylonjs/core/Meshes/GaussianSplatting/gaussianSplattingMesh";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader.js";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import "@babylonjs/core/Loading/loadingScreen";

let canvas: HTMLCanvasElement;
let engine: Engine;

const gMod = new GModder();

(GaussianSplattingMesh.prototype as any)._originalUpdateData =
  GaussianSplattingMesh.prototype.updateData;
GaussianSplattingMesh.prototype.updateData = function (data) {
  (this as any)._originalUpdateData(data);
  gMod.setData(data, this);
};

const loadGS = async function (url: string, scene: Scene) {
  gMod.acceptingSet = true;
  if (gMod.mesh) gMod.mesh.dispose();

  await SceneLoader.ImportMeshAsync(null, url, undefined, scene);

  const camera = scene.activeCamera! as ArcRotateCamera;

  camera.radius = 5;
  camera.alpha = -0.8;
  gMod.acceptingSet = false;
};

const createScene = async () => {
  if (engine) engine.dispose();

  canvas = document.getElementById("blon")! as HTMLCanvasElement;
  engine = new Engine(canvas);

  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.1, 0.1, 0.1, 1);

  const camera = new ArcRotateCamera(
    "camera1",
    -0.8,
    1.2,
    10,
    new Vector3(0, 0, 0),
    scene,
  );
  camera.wheelPrecision = 100;
  camera.inertia = 0.97;

  camera.attachControl(canvas, true);

  await loadGS(
    "https://assets.babylonjs.com/splats/gs_Sqwakers_trimed.splat",
    scene,
  );

  makeGUI(scene, gMod);
  (window as any).mod = gMod;

  engine.displayLoadingUI();
  scene.executeWhenReady(function () {
    engine.hideLoadingUI();
  });
  scene.onBeforeRenderObservable.add(() => {
    camera.beta = Math.min(camera.beta, 1.45);
    camera.radius = Math.max(camera.radius, 3);
    camera.radius = Math.min(camera.radius, 6);
  });

  engine.runRenderLoop(() => {
    scene.render();
  });

  return scene;
};

createScene().then((scene) => {
  const form = document.getElementById("loadSplat") as HTMLFormElement;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const url = formData.get("url") as string;
    loadGS(url, scene).then(() => {
      gMod.modifyDbounced();
    });
  });
});
