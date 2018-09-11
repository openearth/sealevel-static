const mapLayers = [
  {
    id: 'sshtrend',
    layerType: 'gee',
    name: 'SSH Trend',
    icon: 'images/sshtrend.png',
    opacity: 100,
    active: true,
    info: '<i>source: <a href="https://podaac.jpl.nasa.gov/" target="_blank">NASA poodaac</a></i>',
    legend: {
      colors: ['#151d44', '#156c72', '#7eb390', '#fdf5f4', '#db8d77', '#9c3060', '#340d35'],
      range: '-0.03 [m] +0.03'
    },
    serviceUrl: 'http://hydro-engine.appspot.com/get_sea_surface_height_trend_image',
    data: []
  },
  {
    id: '12mileszone',
    layerType: 'mapbox',
    name: '12 miles zone',
    icon: 'images/12miles.png',
    opacity: 100,
    active: false,
    info: '<i>source: <a href="http://marineregions.org/sources.php#marbound" target="_blank">marineregions.org</a></i>',
    legend: {
      colors: ['#404040', '#c8c8c8'],
      range: '0 1'
    },
    data: [{
      'id': '12miles',
      'type': 'fill',
      'source': {
        'type': 'vector',
        'url': 'mapbox://adriaanse.9f199gkd'
      },
      'source-layer': '12_miles_zone-d5cbg5',
      'paint': {
        'fill-color': 'rgba(64, 64, 64, 0.5)',
        'fill-outline-color': 'rgba(200, 200, 200, 1.0)'
      }
    }]
  },
  {
    id: '24mileszone',
    layerType: 'mapbox',
    name: '24 miles zone',
    icon: 'images/24miles.png',
    opacity: 100,
    active: false,
    info: '<i>source: <a href="http://marineregions.org/sources.php#marbound" target="_blank">marineregions.org</a></i>',
    legend: {
      colors: ['#404040', '#c8c8c8'],
      labels: ['zone', 'boundary']
    },
    data: [{
      'id': '24miles',
      'type': 'fill',
      'source': {
        'type': 'vector',
        'url': 'mapbox://adriaanse.7z3o0vxj'
      },
      'source-layer': '24_miles_zone-9d814s',
      'paint': {
        'fill-color': 'rgba(64, 64, 64, 0.5)',
        'fill-outline-color': 'rgba(200, 200, 200, 1.0)'
      }
    }]
  },
  {
    id: 'eezone',
    layerType: 'mapbox',
    name: 'Economic zone',
    icon: 'images/eez.png',
    opacity: 100,
    active: false,
    info: '<i>source: <a href="http://marineregions.org/sources.php#marbound" target="_blank">marineregions.org</a></i>',
    legend: {
      colors: ['#ff0000'],
      labels: ['EEZ boundary']
    },
    data: [{
      'id': 'eez',
      'type': 'line',
      'source': {
        'type': 'vector',
        'url': 'mapbox://adriaanse.di3mnmez'
      },
      'source-layer': 'EEZ_boundary-8t9rn6',
      'paint': {
        'line-color': 'rgba(256, 0, 0, 1.0)'
      }
    }]
  },
  {
    id: 'gaugingstations',
    layerType: 'geojson',
    name: 'Gauging stations',
    icon: 'images/marker-40.png',
    opacity: 100,
    active: true,
    info: '<i>source: <a href="http://www.psmsl.org" target="_blank">PSMSL</a></i>',
    data: [{
      'id': 'gauging',
      'type': 'symbol',
      'source': {
        'type': 'geojson',
        'data': 'https://storage.googleapis.com/slr/psmsl/locations.geojson'
      },
      'layout': {
        'icon-image': 'marker',
        'icon-size': 1.5
      }
    }]
  }
]

export {
  mapLayers
}
