import { initializeMap } from './map.js';
import { setupFileUpload } from './fileUpload.js';
import { LayerManager } from './layerManager.js';

// Initialize the application
function init() {
  // Wait for map container to be ready with dimensions
  const mapContainer = document.getElementById('map');
  
  function initializeApp() {
    if (mapContainer && mapContainer.offsetWidth > 0 && mapContainer.offsetHeight > 0) {
      // Container is ready - initialize map
      const map = initializeMap();
      
      // Initialize layer manager
      const layerManager = new LayerManager(map);
      
      // Setup file upload
      setupFileUpload(layerManager);
    } else {
      // Wait a bit more and try again
      setTimeout(initializeApp, 50);
    }
  }
  
  // Start initialization
  initializeApp();
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM already ready, but wait a tick to ensure container is sized
  setTimeout(init, 0);
}
