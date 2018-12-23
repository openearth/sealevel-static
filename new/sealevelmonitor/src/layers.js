const layers = [
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
      range: '-0.03 [m/year] +0.03'
    },
    serviceUrl: 'http://hydro-engine.appspot.com/get_sea_surface_height_trend_image',
    data: []
  },
  {
    id: 'tidestations',
    layerType: 'symbol',
    name: 'Tide stations',
    icon: 'images/marker-40.png',
    opacity: 100,
    active: true,
    info: '<i>source: <a href="http://www.psmsl.org" target="_blank">PSMSL</a></i>',
    data: [{
      'id': 'stations',
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
export default layers
