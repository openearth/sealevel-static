
const mapLayers = [
  {
    layertype: 'mapbox-layer',
    name: '12 miles zone',
    icon: '',
    opacity: 100,
    active: true,
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
        'fill-outline-color': 'rgba(255, 255, 255, 0.5)'
      }
    }]
  },
  {
    layertype: 'mapbox-layer',
    name: '24 miles zone',
    icon: '',
    opacity: 100,
    active: true,
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
        'fill-outline-color': 'rgba(255, 255, 255, 0.5)'
      }
    }]
  },
  {
    layertype: 'mapbox-layer',
    name: 'Exclusive economic zone',
    icon: '',
    opacity: 100,
    active: true,
    data: [{
      'id': 'eez',
      'type': 'line',
      'source': {
        'type': 'vector',
        'url': 'mapbox://adriaanse.di3mnmez'
      },
      'source-layer': 'EEZ_boundary-8t9rn6',
      'layout': {
        'visibility': 'invisible'
      },
      'paint': {
        'line-color': 'rgba(256, 0, 0, 0.5)'
      }
    }]
  },

]

export {
  mapLayers
}
