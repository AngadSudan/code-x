import { Palette } from "./Palette";

/* ================= DARK ================= */
export const DarkSemantic = {
  background: {
    primary: Palette.custom_black_dark,
    secondary: Palette.custom_black_light,
    accent: Palette.custom_gray,
    special: Palette.custom_green,
  },

  hero: {
    primary: Palette.custom_green,
    primaryFaded: Palette.custom_green_faded,
  },

  text: {
    primary: Palette.custom_white,
    secondary: Palette.custom_gray,
    special: Palette.custom_green,
    inverted: Palette.custom_black,
  },

  border: {
    default: Palette.custom_gray,
    faded: Palette.custom_gray_faded,
    special: Palette.custom_green,
    specialFaded: Palette.custom_green_faded,
  },

  icon: {
    primary: Palette.custom_white,
    secondary: Palette.custom_black,
    special: Palette.custom_green,
    inverted: Palette.custom_black,
  },

  accent: {
    primary: Palette.custom_black_dark,
    secondary: Palette.custom_black_light,
    special: Palette.custom_green,
  },
  hover: {
    special: Palette.custom_green_faded,
    textSpecial: Palette.custom_green_faded,
  },
};

/* ================= LIGHT ================= */
export const LightSemantic = {
  background: {
    primary: Palette.custom_surface,
    secondary: Palette.custom_light,
    accent: Palette.custom_gray,
    special: Palette.custom_dark_green,
  },

  hero: {
    primary: Palette.custom_green,
    primaryFaded: Palette.custom_green_faded,
  },

  text: {
    primary: Palette.custom_black,
    secondary: Palette.custom_gray,
    special: Palette.custom_green,
    inverted: Palette.custom_white,
  },

  border: {
    default: Palette.custom_gray,
    faded: Palette.custom_gray_faded,
    special: Palette.custom_green,
    specialFaded: Palette.custom_green_faded,
  },

  icon: {
    primary: Palette.custom_black,
    secondary: Palette.custom_gray,
    special: Palette.custom_green,
    inverted: Palette.custom_white,
  },

  accent: {
    primary: Palette.custom_surface,
    secondary: Palette.custom_light,
    special: Palette.custom_green,
  },
  hover: {
    special: Palette.custom_green_faded,
    textSpecial: Palette.custom_green_faded,
  },
};
