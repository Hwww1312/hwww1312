# Replacing the placeholder 3D hero

The homepage currently uses a **procedural placeholder** (`src/components/three/HeroModel.tsx`):

- Ceramic plate + food disc
- Textures from `/public/assets/*.jpg` (restaurant photography)
- Separate lid meshes for the chapter 04 “steamboat” reveal

This is **not** finished product design. Swap it for a production GLB when ready.

## Blender preparation

1. Model a single hero object (plate / bowl / steamboat) with clear mesh names:
   - `Plate`
   - `Food`
   - `Lid` (optional, for the transformation chapter)
   - `LidKnob` (optional)
2. Apply transforms (Ctrl/Cmd+A → All Transforms).
3. Keep polycount reasonable for web (aim under ~50k triangles for mobile).
4. Use PBR materials (Principled BSDF). Bake or pack textures ≤ 2K unless detail close-ups need more.
5. Export **glTF Binary (`.glb`)** with:
   - Mesh compression ( Draco optional)
   - Embedded textures
   - +Y up
6. Place the file at `public/models/hero-plate.glb`.

## Code swap

1. Add a loader component, e.g. `HeroModelGLB.tsx`:

```tsx
import { useGLTF } from "@react-three/drei";

export function HeroModelGLB() {
  const { scene } = useGLTF("/models/hero-plate.glb");
  // Clone scene, bind refs to named meshes, drive transforms from storyRuntime.state
  return <primitive object={scene} />;
}
```

2. In `StoryCanvas.tsx`, render `HeroModelGLB` instead of `HeroModel`.
3. Map `storyRuntime.state.lidOpen` to the `Lid` mesh position/rotation.
4. Keep driving camera / lights from `storyConfig.ts` — do not add a second animation system on the same transforms.

## Texture-only refresh

To change which dish appears in each chapter without a new model, edit `dishIndex` in `src/data/storyConfig.ts` (indexes into `DISHES` in `siteContent.ts`).
