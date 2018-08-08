const mapLayers = [
  {
    layertype: 'mapbox-layer',
    name: 'Economic zone',
    icon: '/images/eez.png',
    opacity: 100,
    active: false,
    info: 'source: marineregions.org',
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
    layertype: 'mapbox-layer',
    name: '24 miles zone',
    icon: '/images/24miles.png',
    opacity: 100,
    active: true,
    info: 'source: marineregions.org',
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
        'fill-color': 'rgba(64, 64, 64, 1.0)',
        'fill-outline-color': 'rgba(200, 200, 200, 1.0)'
      }
    }]
  },
  {
    layertype: 'mapbox-layer',
    name: '12 miles zone',
    icon: '/images/12miles.png',
    opacity: 100,
    active: true,
    info: 'source: marineregions.org',
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
  }
]

export {
  mapLayers
}
