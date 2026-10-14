// Downloads every image from the Figma design into public/images.
// Run once on your own computer:  npm run images
// NOTE: Figma's temporary links expire 7 days after they were generated (about Oct 21, 2026).
import { mkdir, writeFile, access } from "node:fs/promises";

const A = "https://www.figma.com/api/mcp/asset/";
const files = {
  "bowl.png": A + "1f0bf714-ae4e-41b6-9fd4-86bb003d1392/36549.png",
  "headphones.png": A + "1f0bf714-ae4e-41b6-9fd4-86bb003d1392/69faf.png",
  "table.png": A + "1f0bf714-ae4e-41b6-9fd4-86bb003d1392/d5b57.png",
  "cap.png": A + "1f0bf714-ae4e-41b6-9fd4-86bb003d1392/f3bd1.png",
  "clock.png": A + "1f0bf714-ae4e-41b6-9fd4-86bb003d1392/18ddd.png",
  "backpack.png": A + "1f0bf714-ae4e-41b6-9fd4-86bb003d1392/89d80.png",
  "sunglasses.png": A + "1f0bf714-ae4e-41b6-9fd4-86bb003d1392/ed4b1.png",
  "basket.png": A + "1f0bf714-ae4e-41b6-9fd4-86bb003d1392/ac525.png",
  "desk-clock.png": A + "1f0bf714-ae4e-41b6-9fd4-86bb003d1392/44f15.png",
  "product-31.png": A + "a8c66f81-e07c-4aa1-ada1-9ce9e32114e6/4dee2.png",
  "product-16.png": A + "a8c66f81-e07c-4aa1-ada1-9ce9e32114e6/9fbeb.png",
  "product-19.png": A + "a8c66f81-e07c-4aa1-ada1-9ce9e32114e6/57220.png",
  "product-12.png": A + "8b8e9bce-38b5-4721-b504-e253435202bd/36cac.png",
  "product-27.png": A + "8b8e9bce-38b5-4721-b504-e253435202bd/a5e6d.png",
  "ad-1.png": A + "ec7c3544-9b26-4b16-999b-179789abefe8/9cfc7.png",
  "ad-2.png": A + "ec7c3544-9b26-4b16-999b-179789abefe8/0abb7.png",
  "ad-3.png": A + "ec7c3544-9b26-4b16-999b-179789abefe8/a5bb3.png",
  "hero.png": A + "e1b2c950-47c0-4a90-a301-ff39ebc22935/62f75.png",
  "map.png": A + "cdda3602-6ccc-4e75-9823-2a09c0cd345b/99a70.png",
};

await mkdir("public/images", { recursive: true });
let ok = 0;
for (const [name, url] of Object.entries(files)) {
  try {
    if (
      await access(`public/images/${name}`).then(
        () => true,
        () => false,
      )
    ) {
      ok++;
      continue;
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await writeFile(
      `public/images/${name}`,
      Buffer.from(await res.arrayBuffer()),
    );
    ok++;
    console.log("saved", name);
  } catch (e) {
    console.log("FAILED", name, e.message);
  }
}
console.log(
  `\n${ok}/${Object.keys(files).length} images saved to public/images`,
);
if (ok < Object.keys(files).length)
  console.log(
    "Some links may have expired. Ask Claude to refresh the image links.",
  );
