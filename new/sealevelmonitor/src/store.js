import Vue from 'vue'
import Vuex from 'vuex'

import _ from 'lodash'
import moment from 'moment'

Vue.use(Vuex)

const psmslUrl = 'https://storage.googleapis.com/slr/psmsl/'
const nasaUrl = 'https://hydro-engine.appspot.com/get_sea_surface_height_time_series'

function addLayers (state) {
  if (_.isNil(state.map)) {
    return
  }

  // walk through the layer tree
  function recursiveAdd (layers, map) {
    _.each(layers, (layer) => {
      // if layer has more layers, add or sort them
      if (layer.type === 'layerGroup') {
        recursiveAdd(layer.layers, map)
      } else {
        if (map.getLayer(layer.id)) {
          // sort if existing
          map.moveLayer(layer.id)
        } else {
          // add if new
          map.addLayer(layer)
        }
      }
    })
  }
  recursiveAdd(state.layers, state.map)
}

function addSources (state) {
  if (_.isNil(state.map)) {
    return
  }
  // add sources to the map and sort them
  _.each(state.sources, (source) => {
    if (state.map.getSource(source.id)) {
    } else {
      // add it
      state.map.addSource(source.id, _.omit(source, ['id']))
    }
  })
}

export default new Vuex.Store({
  state: {
    map: null,
    sources: [],
    station: null,
    layers: []
  },
  mutations: {
    setMap (state, map) {
      // set the map to the state
      Vue.set(state, 'map', map)
      addSources(state)
      addLayers(state)
    },
    setSources (state, sources) {
      Vue.set(state, 'sources', sources)
      addSources(state)
    },
    setLayers (state, layers) {
      // set the layers to the state
      Vue.set(state, 'layers', layers)
      addLayers(state)
    },
    setStation (state, station) {
      Vue.set(state, 'station', station)
    }

  },
  actions: {
    async fetchStation ({ state, commit }, { station }) {
      commit('setStation', null)
      let nasaResp = await fetch(nasaUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          region: station.geometry
        })
      })
      let nasaJson = await nasaResp.json()
      station.properties.gmsl = nasaJson
      let psmslResp = await fetch(psmslUrl + station.properties.rlr_monthly_url)
      let json = await psmslResp.json()
      station.properties.series = json

      const gmslMean = _.meanBy(
        _.filter(station.properties.gmsl, 'v'),
        'v'
      )

      _.each(station.properties.gmsl, (event) => {
        event.t = moment(event.t).toDate()
        event.value = _.isNil(event.v) ? event.v : (event.v - gmslMean) * 1000
      })

      const psmslMean = _.meanBy(
        _.filter(station.properties.series.events, 'value'),
        'value'
      )
      _.each(station.properties.series.events, (event) => {
        event.t = moment(event.timeStamp).toDate()
        event.value = _.isNil(event.value) ? event.value : event.value - psmslMean
      })

      commit('setStation', station)
    }
  }
})
