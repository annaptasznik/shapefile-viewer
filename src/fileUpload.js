import { loadShapefile } from './shapefileLoader.js';

export function setupFileUpload(layerManager) {
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('fileInput');
  
  // Click to browse
  uploadArea.addEventListener('click', () => {
    fileInput.click();
  });
  
  // File input change
  fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files, layerManager);
  });
  
  // Drag and drop
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });
  
  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
  });
  
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files, layerManager);
  });
}

async function handleFiles(files, layerManager) {
  // Filter for zip files or shapefile components
  const shapefileFiles = files.filter(file => {
    const ext = file.name.toLowerCase().split('.').pop();
    return ext === 'zip' || ['shp', 'shx', 'dbf', 'prj'].includes(ext);
  });
  
  if (shapefileFiles.length === 0) {
    alert('Please select a shapefile (.zip) or shapefile components (.shp, .shx, .dbf)');
    return;
  }
  
  // Show loading indicator
  const loadingIndicator = document.getElementById('loadingIndicator');
  loadingIndicator.style.display = 'block';
  
  try {
    // Check if it's a zip file
    const zipFile = shapefileFiles.find(f => f.name.toLowerCase().endsWith('.zip'));
    
    if (zipFile) {
      // Handle zip file
      const geojson = await loadShapefile(zipFile);
      layerManager.addLayer(geojson, zipFile.name);
    } else {
      // Handle separate files
      const shpFile = shapefileFiles.find(f => f.name.toLowerCase().endsWith('.shp'));
      const shxFile = shapefileFiles.find(f => f.name.toLowerCase().endsWith('.shx'));
      const dbfFile = shapefileFiles.find(f => f.name.toLowerCase().endsWith('.dbf'));
      const prjFile = shapefileFiles.find(f => f.name.toLowerCase().endsWith('.prj'));
      
      if (!shpFile || !shxFile || !dbfFile) {
        throw new Error('Missing required files. Need at least .shp, .shx, and .dbf');
      }
      
      const geojson = await loadShapefile(shpFile, shxFile, dbfFile, prjFile);
      layerManager.addLayer(geojson, shpFile.name);
    }
  } catch (error) {
    console.error('Error loading shapefile:', error);
    alert(`Error loading shapefile: ${error.message}`);
  } finally {
    loadingIndicator.style.display = 'none';
  }
}

