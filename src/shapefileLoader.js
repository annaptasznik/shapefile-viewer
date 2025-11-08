import * as shp from 'shapefile';
import JSZip from 'jszip';

// Helper function to convert File to ArrayBuffer
async function fileToArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// Helper function to find file in zip by extension
function findFileInZip(zip, extension) {
  const files = Object.keys(zip.files);
  return files.find(name => name.toLowerCase().endsWith(extension));
}

export async function loadShapefile(shpFile, shxFile = null, dbfFile = null, prjFile = null) {
  try {
    let shpBuffer, dbfBuffer;
    
    // If it's a zip file, extract it first
    if (shpFile.name.toLowerCase().endsWith('.zip')) {
      const zipData = await fileToArrayBuffer(shpFile);
      const zip = await JSZip.loadAsync(zipData);
      
      // Find the required files in the zip
      const shpFileName = findFileInZip(zip, '.shp');
      const dbfFileName = findFileInZip(zip, '.dbf');
      
      if (!shpFileName || !dbfFileName) {
        throw new Error('Missing required files in zip. Need at least .shp and .dbf');
      }
      
      // Extract files as ArrayBuffers (shapefile.js accepts ArrayBuffers directly)
      shpBuffer = await zip.file(shpFileName).async('arraybuffer');
      dbfBuffer = await zip.file(dbfFileName).async('arraybuffer');
    } else {
      // For separate files, convert to ArrayBuffers
      shpBuffer = await fileToArrayBuffer(shpFile);
      dbfBuffer = dbfFile ? await fileToArrayBuffer(dbfFile) : null;
      
      if (!dbfBuffer) {
        throw new Error('Missing required .dbf file');
      }
    }
    
    // Open shapefile with ArrayBuffers (shapefile.js accepts ArrayBuffer or Uint8Array)
    // Note: shx file is automatically handled by the library when reading the shp file
    const source = await shp.open(shpBuffer, dbfBuffer);
    
    // Read all features from the shapefile
    const features = [];
    let result;
    
    while (!(result = await source.read()).done) {
      features.push(result.value);
    }
    
    // Convert to GeoJSON
    const geojson = {
      type: 'FeatureCollection',
      features: features
    };
    
    return geojson;
  } catch (error) {
    throw new Error(`Failed to parse shapefile: ${error.message}`);
  }
}
