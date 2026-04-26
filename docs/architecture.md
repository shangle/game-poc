# System Architecture

The Retro Engine is driven by a single state object: `gameData`. This object is fully serializable, meaning it can be saved as a JSON file or encoded into a URL.

## The `gameData` Schema

The engine expects the following structure. Understanding this is key to generating levels via AI or scripts.

### Full Example
```json
{
  "title": "Operation: Neon Dust",
  "startBg": "https://example.com/skybox.jpg",
  "assets": {
    "wall_neon": "data:image/png;base64,...",
    "enemy_grunt": "https://shangle.me/assets/grunt.png"
  },
  "palette": {
    "walls": [
      { "id": 1, "name": "Neon Brick", "tex": "wall_neon", "color": "#3b82f6" }
    ],
    "enemies": [
      { "id": 10, "name": "Cyber Sentry", "tex": "enemy_grunt", "hp": 100, "speed": 0.05 }
    ]
  },
  "map": {
    "floors": [
      [101, 101, 101],
      [101, 101, 101]
    ],
    "entities": [
      [1, 99, 1],
      [1, 10, 1]
    ]
  }
}
```

---

## 🗺️ The Map System
The engine uses a 14x14 grid for each layer.

### Layers
- **floors:** IDs for the floor tiles (z-axis = 0).
- **ceils:** IDs for the ceiling tiles (z-axis = height).
- **entities:** IDs for interactive objects (walls, enemies, player, goal).

### Reserved Constants
These IDs have hard-coded logic in `engine.js`:

| ID | Description | Logic |
| :--- | :--- | :--- |
| `0` | **Empty** | No collision, no rendering. |
| `99` | **Player Spawn** | Sets camera position and orientation. |
| `98` | **Level Goal** | Triggers the 'Win' state upon proximity. |

---

## 🎨 Asset Palette
The palette translates Grid IDs into renderable 3D objects.

### Wall Definition
Walls are rendered as 3D cubes with collision.
```json
{ 
  "id": 1, 
  "name": "Steel Wall", 
  "tex": "asset_key", 
  "color": "#475569" 
}
```

### Enemy Definition
Enemies are rendered as sprites that track the player.
```json
{ 
  "id": 10, 
  "name": "Grunt", 
  "tex": "enemy_tex", 
  "hp": 100, 
  "speed": 0.05 
}
```
