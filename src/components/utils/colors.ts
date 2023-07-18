import { randInRange } from '.';

type ColorValue = {
  h: number,
  s: number,
  l: number,
  a: number
};

const convertToPercentage = (num: number) => (num * 100).toFixed(0) + '%';

class Color {
  value: ColorValue;

  constructor(color?: Color, hueRotation = 0) {
    if (!color) {
      this.value = this.generatePastel();
    } else {
      this.value = color.value;
      if (hueRotation) {
        this.value = this.rotate(hueRotation);
      }
    }
  }

  generatePastel = () => {
    const h = Math.round(Math.random() * 360);
    const s = randInRange(0.5, 0.9);
    const l = randInRange(0.7, 0.8);
    return { h, s, l, a: 1 };
  };

  toHsla = (color: ColorValue = this.value) => {
    const { h, s, l, a } = color;
    return `hsla(${h}, ${convertToPercentage(s)}, ${convertToPercentage(l)}, ${a})`;
  };

  rotate = (hueRotation: number, color: ColorValue = this.value) => {
    const { h, ...rest } = color;
    let newHue = (color.h + hueRotation) % 360;
    if (newHue < 0) newHue = 360 + newHue;

    return { h: newHue, ...rest };
  };
}

export const generateRadialBackground = () => {
  const mainColor = new Color();
  const secondaryColor = new Color();

  const centerX = Math.random() > 0.5 ? '80%' : '20%';
  const centerY = Math.random() > 0.5 ? '80%' : '20%';

  return `radial-gradient(farthest-side at ${centerX} ${centerY}, ${mainColor.toHsla()}, ${secondaryColor.toHsla()})`;
};
