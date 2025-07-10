# Pass Through Portals - Static Website

A 3D web application demonstrating portal rendering effects using Three.js. This is a static HTML/CSS/JavaScript version that can be served on any web server.

## Features

- **3D Portal Effect**: View a 3D scene through a framed portal with different perspective
- **Interactive Controls**: Mouse/touch controls to orbit around the scene
- **Clipping Planes**: Advanced 3D effect where the main model is "clipped" by the portal
- **Responsive Design**: Works on desktop and mobile devices
- **Static Deployment**: No build process required - just serve the files

## Files Required

```
/
├── index.html                          # Main HTML file (ES6 modules)
├── index-legacy.html                   # Legacy version (UMD builds)
├── low_poly_mccree-transformed.glb     # 3D model file
├── serve.py                            # Python development server
├── serve.js                            # Node.js development server
└── README.md                           # This file
```

## Which Version to Use?

- **`index.html`** - Modern ES6 modules version (recommended for new projects)
  - Cleaner code structure
  - Better for modern browsers
  - Requires browsers that support ES6 modules and import maps

- **`index-legacy.html`** - Legacy UMD builds version (for maximum compatibility)
  - Uses traditional script tags
  - Works with older browsers
  - Fallback for browsers without ES6 module support

## How to Run

### Option 1: Local Development Server

If you have Python installed:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

If you have Node.js installed:
```bash
# Install a simple server
npm install -g http-server

# Run the server
http-server -p 8000
```

### Option 2: Static Web Hosting

Upload the files to any static web hosting service:
- **Netlify**: Drag and drop the files
- **Vercel**: Deploy via GitHub or direct upload
- **GitHub Pages**: Push to a repository and enable Pages
- **Apache/Nginx**: Copy files to web root directory

### Option 3: Local File (Limited)

You can open `index.html` directly in a browser, but some features may not work due to CORS restrictions when loading the 3D model.

## Technical Details

### Dependencies
- **Three.js**: 3D graphics library (loaded via CDN)
- **OrbitControls**: Camera controls for Three.js
- **GLTFLoader**: For loading 3D models

### Browser Support
- Chrome/Edge: Full support (ES6 modules)
- Firefox: Full support (ES6 modules)
- Safari: Full support (ES6 modules)
- Mobile browsers: Full support (modern versions)

**Note**: This version uses ES6 modules which require a modern browser. For older browser support, the scripts would need to be bundled differently.

### Performance
- Optimized for 60 FPS on modern devices
- Automatic quality scaling based on device capabilities
- Efficient portal rendering using render targets

## Customization

### Changing the 3D Model
Replace `low_poly_mccree-transformed.glb` with your own GLTF/GLB file and update the filename in `index.html`:

```javascript
loader.load(
    'your-model-file.glb',
    // ... rest of the code
);
```

### Modifying Text Labels
Edit the text in the `createTextLabels()` function:

```javascript
const titleTexture = createTextTexture('Your Title', '500 24px Inter', 'black');
const idTexture = createTextTexture('/02', '400 12px Inter', 'black');
const authorTexture = createTextTexture('Your Name', '400 8px Inter', 'black');
```

### Adjusting Colors
Modify the background color and other colors in the `init()` function:

```javascript
scene.background = new THREE.Color(0xf0f0f0); // Light gray background
```

## Troubleshooting

### "THREE.OrbitControls is not a constructor" Error
- Try the legacy version: `index-legacy.html`
- Ensure you're using a modern browser that supports ES6 modules
- Check if import maps are supported in your browser

### Model Not Loading
- Ensure the GLB file is in the same directory as the HTML file
- Check browser console for error messages
- Verify the model file isn't corrupted

### Performance Issues
- Try reducing the portal render target size in `createPortalScene()`
- Reduce the sky sphere geometry segments
- Check if hardware acceleration is enabled in your browser

### CORS Errors
- Serve the files through a web server (not file://)
- Ensure your server allows loading of GLB files
- Use the provided `serve.py` or `serve.js` scripts for local development

### Browser Compatibility Issues
- Use `index-legacy.html` for older browsers
- Modern version requires ES6 modules support (Chrome 61+, Firefox 60+, Safari 10.1+)

## Original Project

This is a static conversion of the React Three Fiber demo from the pmnd.rs collective. The original used React and specialized R3F components, while this version uses vanilla Three.js for broader compatibility.

## License

The McCree 3D model is licensed under CC-BY-4.0 by Seafoam from Sketchfab. 