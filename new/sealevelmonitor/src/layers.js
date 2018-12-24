const sources = [
  {
    id: 'psmsl',
    type: 'geojson',
    data: 'https://storage.googleapis.com/slr/psmsl/locations.geojson'
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
    source: {
      type: 'hydroEngine',
      url: 'https://hydro-engine.appspot.com/get_sea_surface_height_trend_image'
    },
    data: [],
    paint: {
      'raster-opacity': 0.5
    }
  },
  {
    id: 'tidestations',
    type: 'layerGroup',
    name: 'Tide gauges',
    active: true,
    icon: 'images/psmsl.png',
    layers: [
      {
        id: 'tideheatmap',
        type: 'heatmap',
        source: 'psmsl',
        paint: {
          'heatmap-intensity': 0.005
        }
      },
      {
        id: 'psmsl-points',
        type: 'circle',
        source: 'psmsl',
        paint: {
          // TODO: color based on trend
          'circle-color': '#fff',
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            2, 2,
            15, 14
          ],
          'circle-opacity': [
            'interpolate', ['linear'], ['zoom'],
            2, 0.5,
            8, 0.8
          ],
          'circle-stroke-width': 0,
          'circle-stroke-opacity': 0
        }
      }
    ]
  }
]

export { layers, sources }
