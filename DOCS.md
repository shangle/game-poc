# 📚 Retro Engine Studio Documentation

> **REMINDER:** Always update this documentation whenever you change core features, the state structure, or the UI layout.

## 🚀 Overview
Retro Engine Studio is a browser-based 3D game engine and visual level editor inspired by classic raycasting and sprite-based FPS games.

## 🕹 Features
- **Visual Grid Editor:** 14x14 top-down builder for entities, floors, and ceilings.
- **Three.js Renderer:** Real-time 3D preview of your levels.
- **Asset Wizard:** Guided creation of walls, enemies, and items.
- **PixUrl Integration:** Native pixel art generation directly in the editor.
- **Base64 Sharing:** Levels are encoded into the URL, making them instantly shareable.

## 🏗 JSON Level Structure (`gameData`)
The core of the engine is the `gameData` object. Here is how it is structured:

```json
{
  "title": "My Level",
  "startBg": "URL_TO_SKYBOX",
  "assets": {
    "tex_key_1": "data:image/png;base64...",
    "tex_key_2": "https://..."
  },
  "palette": {
    "floors":  [{ "id": 101, "name": "Tile", "tex": "tex_key_1", "color": "#hex" }],
    "ceils":   [{ "id": 201, "name": "Sky", "tex": "tex_key_2", "color": "#hex" }],
    "walls":   [{ "id": 1,   "name": "Brick", "tex": "wall_tex", "color": "#hex" }],
    "enemies": [{ "id": 10,  "name": "Grunt", "tex": "enemy_tex", "hp": 100, "speed": 0.05 }],
    "objects": [{ "id": 20,  "name": "Barrel", "tex": "obj_tex" }],
    "items":   [{ "id": 30,  "name": "Potion", "tex": "item_tex", "type": "hp", "value": 50 }]
  },
  "map": {
    "floors":   [[101, ...], ...],
    "ceils":    [[201, ...], ...],
    "entities": [[99, ...], ...]
  }
}
```

### Key ID Constants:
- `0`: Empty
- `99`: Player Spawn
- `98`: Goal/Exit

## 🎨 Asset Creation with PixUrl
When you use the "CREATE WITH PIXURL" tool, the engine listens for the `image-processed` event. The resulting base64 string is automatically added to `gameData.assets` and mapped to your new asset's `tex` key.

## 🧪 Testing
Run `npm test` for unit tests and `npm run test:e2e` for UI tests.
