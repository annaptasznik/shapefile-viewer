import L from 'leaflet';

export function initializeMap() {
  // Create map with absolute minimal configuration
  const map = L.map('map');
  
  // Use OpenStreetMap standard - most basic and reliable
  // Using the main OSM server with minimal configuration
  const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abc',
    maxZoom: 19,
    minZoom: 1,
    // Minimal settings - let Leaflet handle everything
    updateWhenZooming: false,
    updateWhenIdle: true,
    reuseTiles: false
  });
  
  // Add to map
  tileLayer.addTo(map);
  
  // Set initial view
  map.setView([39.8283, -98.5795], 4);
  
  // Ensure proper sizing
  setTimeout(() => {
    map.invalidateSize();
  }, 100);
  
  // Fix Leaflet icon issue
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
  
  return map;
}
