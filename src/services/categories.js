/**
 * ALL CATEGORIES LIVE HERE (used by the Shop sidebar and the dashboard form).
 * CATEGORIES  = the list shown under "Shop by Category".
 * SUBCATS     = categories that get a "+" button, with their sub-categories.
 * Each product's category/sub-category is set in `productCategories` in src/services/api.js and must match these names exactly.
 */
export const CATEGORIES = [
  "Electronics",
  "Accessories",
  "Home & Living",
  "Bags",
  "Furniture",
];
export const SUBCATS = {
  Electronics: ["Audio", "Watches & Clocks"],
  "Home & Living": ["Kitchen", "Storage", "Decor"],
};
