# UML Diagram Tool

A particle-based UML diagram generator with an interactive layout editor. Create UML class diagrams with procedural noise effects and animated particle visualizations.

## Features

- **Visual Layout Editor**: Drag-and-drop UML nodes on a grid
- **Multiple Design Patterns**: Factory, Observer, Strategy, Decorator, Builder (or create your own)
- **Layout Variations**: Save up to 3 layout variations per pattern
- **Noise Generator**: Configure Perlin noise for particle displacement effects
- **Three.js Preview**: Real-time animated particle visualization
- **Auto-Save**: All changes are automatically saved to JSON files

## Quick Start

```bash
cd umlDiagramTool
npm install
npm start
```

Then open **http://localhost:3456** in your browser.

## Project Structure

```
umlDiagramTool/
├── particle-uml.html      # Main editor (frontend)
├── server.js              # Node.js backend for file operations
├── package.json           # Dependencies
├── patterns-index.json    # List of available patterns
├── pattern-factory.json   # Factory Method pattern
├── pattern-observer.json  # Observer pattern
├── pattern-strategy.json  # Strategy pattern
├── pattern-decorator.json # Decorator pattern
├── pattern-builder.json   # Builder pattern
├── values.json            # Editor settings (noise, particles, etc.)
└── README.md
```

## How It Works

### Editor Tabs

1. **UML Tab**: Layout editor
   - Select a design pattern from the dropdown
   - Drag nodes to position them on the grid
   - Use +/- buttons to add/delete nodes
   - Switch between layout variations (1, 2, 3)
   - All changes auto-save

2. **Noise Tab**: Configure particle effects
   - Density, size, opacity
   - Noise type (Perlin, Ridged, Cellular)
   - Turbulence, displacement settings

3. **Preview Tab**: Full animated visualization
   - See the final result with particles and activators
   - Configure activation radius and speed

### JSON File Format

#### Pattern File (`pattern-{name}.json`)

```json
{
  "name": "Factory Method",
  "description": "Defines an interface for creating objects...",
  "nodes": [
    {
      "id": "node-0",
      "name": "IProduct",
      "type": "interface",        // "interface", "class", or "abstract"
      "stereotype": "«interface»", // null for classes
      "methods": ["+ operation(): void"],
      "properties": [],
      "row": 0,                   // Grid row (for initial layout)
      "col": 0,                   // Grid column (for initial layout)
      "x": 3,                     // X position in grid units
      "y": 3                      // Y position in grid units
    }
  ],
  "layouts": {
    "1": [{ "id": "node-0", "x": 3, "y": 3 }],
    "2": [{ "id": "node-0", "x": 10, "y": 5 }],
    "3": []
  }
}
```

#### Pattern Index (`patterns-index.json`)

```json
{
  "patterns": ["factory", "observer", "strategy", "decorator", "builder"]
}
```

#### Settings (`values.json`)

```json
{
  "density": 0.5,
  "particleSize": 1,
  "particleOpacity": 0.5,
  "noiseScale": 0.05,
  "noiseType": "square",
  "selectedPattern": "factory"
}
```

## API Endpoints

The Node.js server provides these endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patterns` | Get pattern index |
| POST | `/api/patterns` | Save pattern index |
| GET | `/api/pattern/:id` | Get a specific pattern |
| POST | `/api/pattern/:id` | Save a specific pattern |
| DELETE | `/api/pattern/:id` | Delete a pattern |
| GET | `/api/values` | Get editor settings |
| POST | `/api/values` | Save editor settings |

## Creating New Patterns

1. Click the **+** button next to the pattern dropdown
2. Enter a name (e.g., "Singleton")
3. The tool creates a new pattern file (`pattern-singleton.json`)
4. Add nodes and arrange them as needed
5. Everything auto-saves

## Using Output on Your Website

The pattern JSON files can be loaded directly by your main website's Three.js visualization. The key data for rendering:

1. **Node positions**: `pattern.nodes[].x` and `pattern.nodes[].y`
2. **Node content**: `name`, `stereotype`, `methods`, `properties`
3. **Noise settings**: From `values.json`

Example usage in your website:

```javascript
// Load pattern
const pattern = await fetch('/umlDiagramTool/pattern-factory.json').then(r => r.json());

// Load settings
const settings = await fetch('/umlDiagramTool/values.json').then(r => r.json());

// Use for Three.js particle generation
pattern.nodes.forEach(node => {
  createParticlesForNode(node, settings);
});
```

## Development

To modify the editor:

1. Edit `particle-uml.html` for frontend changes
2. Edit `server.js` for backend API changes
3. Restart the server after backend changes

The frontend uses:
- Vanilla JavaScript (no framework)
- SVG for the layout editor
- Three.js for particle visualization
- OrbitControls for camera

## Port Configuration

Default port is **3456**. To change:

```bash
PORT=8080 npm start
```

Or edit `server.js`:

```javascript
const PORT = process.env.PORT || 3456;
```
