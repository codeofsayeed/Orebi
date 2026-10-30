/**
 * ALL COLOURS LIVE HERE.
 * name = the text shown (Shop filter, product cards, dashboard) and must match a product's `color` in api.js exactly.
 * dot  = the circle colour (hex). Add, remove or change a line and every place updates.
 */
export const COLORS = [
  { name: "Black", dot: "#262626" },
  { name: "Gray", dot: "#b6b6b6" },
  { name: "White", dot: "#ffffff" },
  { name: "Brown", dot: "#7b4b36" },
  { name: "Burgundy", dot: "#8e1f55" },
  { name: "Beige", dot: "#d9cdb5" },
];
export const colorDot = (name) =>
  COLORS.find((c) => c.name === name)?.dot || "#262626";
