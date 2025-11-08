import L from 'leaflet';

export class LayerManager {
  constructor(map) {
    this.map = map;
    this.layers = [];
    this.layerIdCounter = 0;
  }
  
  addLayer(geojson, fileName) {
    const layerId = `layer-${this.layerIdCounter++}`;
    const layerName = fileName.replace(/\.(zip|shp|shx|dbf|prj)$/i, '');
    
    // Create Leaflet GeoJSON layer with default styling
    const geoJsonLayer = L.geoJSON(geojson, {
      style: this.getDefaultStyle(geojson),
      onEachFeature: (feature, layer) => {
        // Add popup with feature properties
        if (feature.properties) {
          const props = Object.entries(feature.properties)
            .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
            .join('<br>');
          layer.bindPopup(props);
        }
      }
    });
    
    // Add to map
    geoJsonLayer.addTo(this.map);
    
    // Fit map to layer bounds
    this.map.fitBounds(geoJsonLayer.getBounds(), { padding: [50, 50] });
    
    // Store layer info
    const layerInfo = {
      id: layerId,
      name: layerName,
      layer: geoJsonLayer,
      visible: true,
      featureCount: geojson.features.length
    };
    
    this.layers.push(layerInfo);
    this.updateLayersList();
    
    return layerInfo;
  }
  
  removeLayer(layerId) {
    const index = this.layers.findIndex(l => l.id === layerId);
    if (index === -1) return;
    
    const layerInfo = this.layers[index];
    this.map.removeLayer(layerInfo.layer);
    this.layers.splice(index, 1);
    this.updateLayersList();
  }
  
  toggleLayerVisibility(layerId) {
    const layerInfo = this.layers.find(l => l.id === layerId);
    if (!layerInfo) return;
    
    if (layerInfo.visible) {
      this.map.removeLayer(layerInfo.layer);
      layerInfo.visible = false;
    } else {
      layerInfo.layer.addTo(this.map);
      layerInfo.visible = true;
    }
    
    this.updateLayersList();
  }
  
  getDefaultStyle(geojson) {
    // Determine geometry type
    const firstFeature = geojson.features[0];
    if (!firstFeature) return {};
    
    const geomType = firstFeature.geometry.type;
    
    // Style based on geometry type
    if (geomType === 'Point' || geomType === 'MultiPoint') {
      return {
        radius: 6,
        fillColor: '#667eea',
        color: '#764ba2',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7
      };
    } else if (geomType === 'LineString' || geomType === 'MultiLineString') {
      return {
        color: '#667eea',
        weight: 3,
        opacity: 0.8
      };
    } else {
      // Polygon or MultiPolygon
      return {
        fillColor: '#667eea',
        color: '#764ba2',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.4
      };
    }
  }
  
  updateLayersList() {
    const layersList = document.getElementById('layersList');
    
    if (this.layers.length === 0) {
      layersList.innerHTML = '<p class="empty-state">No layers loaded</p>';
      return;
    }
    
    layersList.innerHTML = this.layers.map(layer => {
      const visibilityClass = layer.visible ? '' : 'hidden';
      const checked = layer.visible ? 'checked' : '';
      
      return `
        <div class="layer-item ${visibilityClass}" data-layer-id="${layer.id}">
          <input type="checkbox" class="layer-checkbox" ${checked} 
                 data-layer-id="${layer.id}">
          <div class="layer-info">
            <div class="layer-name" title="${layer.name}">${layer.name}</div>
            <div class="layer-meta">${layer.featureCount} feature${layer.featureCount !== 1 ? 's' : ''}</div>
          </div>
          <div class="layer-actions">
            <button class="btn-icon remove-layer-btn" data-layer-id="${layer.id}" 
                    title="Remove layer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      `;
    }).join('');
    
    // Attach event listeners
    layersList.querySelectorAll('.layer-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const layerId = e.target.dataset.layerId;
        this.toggleLayerVisibility(layerId);
      });
    });
    
    layersList.querySelectorAll('.remove-layer-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const layerId = e.target.closest('.remove-layer-btn').dataset.layerId;
        this.removeLayer(layerId);
      });
    });
  }
}
