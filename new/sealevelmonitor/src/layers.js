const sources = [
  {
    'id': 'psmsl',
    'type': 'geojson',
    'data': 'https://storage.googleapis.com/slr/psmsl/locations.geojson',
    'cluster': true
  }
]
const layers = [
  {
    id: 'sshtrend',
    type: 'raster',
    name: 'SSH Trend',
    icon: 'images/sshtrend.png',
    opacity: 50,
    active: true,
    info: '<i>source: <a href="https://podaac.jpl.nasa.gov/" target="_blank">NASA poodaac</a></i>',
    legend: {
      colors: ['#151d44', '#156c72', '#7eb390', '#fdf5f4', '#db8d77', '#9c3060', '#340d35'],
      range: '-0.03 [m/year] +0.03'
    },
    hydroEngine: 'http://hydro-engine.appspot.com/get_sea_surface_height_trend_image',
    data: [],
    paint: {
      'raster-opacity': 0.5
    }
  },
  {
    id: 'tidestations',
    type: 'circle',
    name: 'Tide stations',
    active: true,
    info: '<i>source: <a href="http://www.psmsl.org" target="_blank">PSMSL</a></i>',
    source: 'psmsl',
    paint: {
      'circle-opacity': 0.5,
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6',
        100,
        '#f1f075',
        750,
        '#f28cb1'
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        100,
        30,
        750,
        40
      ]
    }
  },
  {
    id: 'cluster-count',
    type: 'symbol',
    source: 'psmsl',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12
    }
  },
  {
    id: 'unclustered-point',
    type: 'circle',
    source: 'psmsl',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#11b4da',
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  }
]

export { layers, sources }
