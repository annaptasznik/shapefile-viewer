# Shapefile Viewer

A browser-based shapefile viewer built with Leaflet and shapefile.js. Upload shapefiles and view them on an interactive map.

## Features

- Upload shapefiles via drag & drop or file browser
- Interactive map using Leaflet
- Multiple layer support
- Toggle layer visibility
- Remove layers
- Click features to view attributes
- Automatic styling based on geometry type

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. Click the upload area or drag & drop a shapefile (.zip) onto it
2. The shapefile will be parsed and displayed on the map
3. The map will automatically zoom to fit your shapefile
4. Click on features to view their attributes
5. Use the layer controls in the sidebar to toggle visibility or remove layers

## Supported Formats

- Shapefile (.zip) - All components (shp, shx, dbf, prj) should be in a zip file
- Individual shapefile components (.shp, .shx, .dbf, .prj) - Upload all required files together

## Technologies

- [Leaflet](https://leafletjs.com/) - Interactive maps
- [shapefile.js](https://github.com/mbostock/shapefile) - Shapefile parsing
- [Vite](https://vitejs.dev/) - Build tool and dev server

