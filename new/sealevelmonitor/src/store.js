import Vue from 'vue'
import Vuex from 'vuex'

import _ from 'lodash'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    map: null,
    sources: [],
    layers: []
  },
  mutations: {
    setMap (state, map) {
      // set the map to the state
      Vue.set(state, 'map', map)
      _.each(state.layers, (layer) => {
        if (map.getLayer(layer.id)) {
          // move to top
          map.moveLayer(layer.id)
        } else {
          // add it
          map.addLayer(layer)
        }
      })
      // add sources to the map and sort them
      _.each(state.sources, (source) => {
        if (state.map.getLayer(source.id)) {
        } else {
          // add it
          state.map.addSource(source.id, _.omit(source, ['id']))
        }
      })
    },
    setSources (state, sources) {
      Vue.set(state, 'sources', sources)
      if (state.map) {
        // add sources to the map and sort them
        _.each(sources, (source) => {
          if (state.map.getLayer(source.id)) {
          } else {
            // add it
            state.map.addSource(source.id, _.omit(source, ['id']))
          }
        })
      }
    },
    setLayers (state, layers) {
      // set the layers to the state
      Vue.set(state, 'layers', layers)
      if (state.map) {
        // add layers to the map and sort them
        _.each(layers, (layer) => {
          if (state.map.getLayer(layer.id)) {
            // move to top
            state.map.moveLayer(layer.id)
          } else {
            // add it
            state.map.addLayer(layer)
          }
        })
      }
    }
  },
  actions: {

  }
})
