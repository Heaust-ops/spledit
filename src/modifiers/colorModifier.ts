import { clamp } from "lodash";
import {
  rgb_to_hsl,
  hsl_to_rgb,
  srgb_to_okhsl,
  okhsl_to_srgb,
} from "../colorConversion";
import { uIntArrayVertexCount } from "../utils";

const colorConvertors = {
  rgb: [(...args: number[]) => args, (...args: number[]) => args],
  hsl: [rgb_to_hsl, hsl_to_rgb],
  okhsl: [srgb_to_okhsl, okhsl_to_srgb],
} as Record<string, ((...args: number[]) => number[])[]>;

export const modifierColors = (
  uRead: Uint8Array,
  fn: (r: number, g: number, b: number, a: number) => number[],
  colorMode = "rgb" as keyof typeof colorConvertors,
) => {
  const vertexCount = uIntArrayVertexCount(uRead);

  for (let i = 0; i < vertexCount; ++i) {
    const r = uRead[32 * i + 24 + 0];
    const g = uRead[32 * i + 24 + 1];
    const b = uRead[32 * i + 24 + 2];
    const a = uRead[32 * i + 24 + 3];

    const convertors = colorConvertors[colorMode];

    const converted = convertors[0](r, g, b);
    const res = fn(converted[0], converted[1], converted[2], a);
    const na = Math.round(res[3]);
    const reverted = convertors[1](res[0], res[1], res[2]);

    let [nr, ng, nb] = reverted;

    nr = clamp(Math.round(nr), 0, 255);
    ng = clamp(Math.round(ng), 0, 255);
    nb = clamp(Math.round(nb), 0, 255);

    uRead[32 * i + 24 + 0] = nr;
    uRead[32 * i + 24 + 1] = ng;
    uRead[32 * i + 24 + 2] = nb;
    uRead[32 * i + 24 + 3] = na;
  }

  return uRead;
};
