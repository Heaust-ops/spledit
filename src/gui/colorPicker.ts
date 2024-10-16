import { GModder } from "../gMods";
import { GUI } from "dat.gui";
import { clamp } from "lodash";
import { modifierColors } from "../modifiers/colorModifier";

export const createColorPicker = (gMod: GModder, gui: GUI) => {
  const props = {
    Hue: 0,
    Saturation: 0,
    Luma: 0,
    Alpha: 1,
    Brightness: 0,
    Contrast: 1,
    Exposure: 1,
    Gamma: 1,
  };

  gMod.modifiers.add((u) => {
    return modifierColors(
      u,
      (h, s, l, a) => {
        const { Hue, Saturation, Luma, Alpha } = props;

        let nHue = h + Hue / 360;
        let nSat = s + Math.sign(Saturation) * Math.pow(Saturation / 100, 2);
        let nLum = l + Math.sign(Luma) * Math.pow(Luma / 100, 2);

        nSat = clamp(nSat, 0, 1);
        nHue = clamp(nHue, 0, 1);
        nLum = clamp(nLum, 0, 1);

        return [nHue, nSat, nLum, a * Math.pow(Alpha, 2)];
      },
      "okhsl",
    );
  });

  gMod.modifiers.add((u) => {
    return modifierColors(
      u,
      (r, g, b, a) => {
        const e = props.Exposure;
        const p = 1 / props.Gamma;
        const br = props.Brightness;
        const c = props.Contrast;
        let nr = Math.pow(((r / 255 - 0.5) * c + 0.5 + br) * e, p);
        let ng = Math.pow(((g / 255 - 0.5) * c + 0.5 + br) * e, p);
        let nb = Math.pow(((b / 255 - 0.5) * c + 0.5 + br) * e, p);

        return [nr * 255, ng * 255, nb * 255, a];
      },
      "rgb",
    );
  });

  const HueControl = gui
    .add(props, "Hue", 0, 360, 0.01)
    .onChange(gMod.modifyDbounced);
  const SaturationControl = gui
    .add(props, "Saturation", -100, 100, 0.01)
    .onChange(gMod.modifyDbounced);
  const LumaControl = gui
    .add(props, "Luma", -100, 100, 0.01)
    .onChange(gMod.modifyDbounced);
  const AlphaControl = gui
    .add(props, "Alpha", 0, 1, 1e-5)
    .onChange(gMod.modifyDbounced);
  const BrightnessControl = gui
    .add(props, "Brightness", -1, 1, 1e-5)
    .onChange(gMod.modifyDbounced);
  const ContrastControl = gui
    .add(props, "Contrast", 0, 2, 1e-5)
    .onChange(gMod.modifyDbounced);
  const ExposureControl = gui
    .add(props, "Exposure", 0, 2, 1e-5)
    .onChange(gMod.modifyDbounced);
  const GammaControl = gui
    .add(props, "Gamma", 0, 2, 1e-5)
    .onChange(gMod.modifyDbounced);

  gMod.onResetObservable.add(() => {
    props.Hue = 0;
    props.Saturation = 0;
    props.Luma = 0;
    props.Alpha = 1;
    props.Brightness = 0;
    props.Contrast = 1;
    props.Exposure = 1;
    props.Gamma = 1;

    HueControl.setValue(props.Hue);
    SaturationControl.setValue(props.Saturation);
    LumaControl.setValue(props.Luma);
    AlphaControl.setValue(props.Alpha);
    BrightnessControl.setValue(props.Brightness);
    ContrastControl.setValue(props.Contrast);
    ExposureControl.setValue(props.Exposure);
    GammaControl.setValue(props.Gamma);
  });
};
