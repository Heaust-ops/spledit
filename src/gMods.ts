import { Observable } from "@babylonjs/core/Misc/observable";
import { GaussianSplattingMesh } from "@babylonjs/core/Meshes/GaussianSplatting/gaussianSplattingMesh";
import { cloneArrayBuffer, debounce } from "./utils";
import { Modifiers } from "./modifiers/modifier";

export class GModder {
  uBak = new Uint8Array([] as number[]);
  u = new Uint8Array([] as number[]);
  cat = Date.now();
  mesh: GaussianSplattingMesh | null = null;
  vertexCount = 0;
  acceptingSet = true;

  modifiers = new Modifiers();
  onResetObservable = new Observable();

  reset() {
    this.onResetObservable.notifyObservers(undefined);
    this.modifyDbounced();
  }

  modify() {
    const uClone = new Uint8Array(cloneArrayBuffer(this.uBak));
    this.u = this.modifiers.cascade(uClone);
    this.sync();
  }

  modifyDbounced = debounce(() => this.modify(), 300);

  sync(applyToBackup = false) {
    this.mesh?.updateData(this.u);

    if (!applyToBackup) return;

    this.uBak = new Uint8Array(this.u);
  }

  setData(data: ArrayBuffer, mesh: GaussianSplattingMesh) {
    if (!this.acceptingSet) return;
    console.log("setting modding data");

    this.u = new Uint8Array(data);
    this.uBak = new Uint8Array(cloneArrayBuffer(data));

    this.cat = Date.now();

    const rowLength = 3 * 4 + 3 * 4 + 4 + 4;
    this.vertexCount = this.u.length / rowLength;

    this.mesh = mesh;
  }
}
