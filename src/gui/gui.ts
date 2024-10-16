import { Scene } from "@babylonjs/core/scene";
import { GModder } from "../gMods";
import { createColorPicker } from "./colorPicker";
import { GUI } from "dat.gui";

export const makeGUI = (_: Scene, gMods: GModder) => {
  const gui = new GUI();
  gui.domElement.style.marginTop = "100px";
  gui.domElement.id = "datGUI";

  gui.add(
    {
      reset: () => gMods.reset(),
    },
    "reset",
  );
  createColorPicker(gMods, gui);
};
