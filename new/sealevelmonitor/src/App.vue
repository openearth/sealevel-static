<template>
<v-app id="inspire" dark>
  <v-navigation-drawer
    v-model="drawer"
    clipped
    fixed
    app
    >
    <v-subheader>
      Layers
    </v-subheader>
    <layer-control :map="map" :layers.sync="layers"></layer-control>
    <v-subheader>
      Pages
    </v-subheader>
    <v-list dense>
      <v-list-tile to="/">
        <v-list-tile-action>
          <v-icon>dashboard</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Map</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile to="about">
        <v-list-tile-action>
          <v-icon>settings</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Animations</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

  </v-navigation-drawer>
  <v-toolbar app fixed clipped-left>
    <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
    <v-toolbar-title>Application</v-toolbar-title>
  </v-toolbar>
  <v-content>
    <v-container fluid fill-height>
      <v-layout justify-center align-center>
        <v-flex fluid fill-height>
          <router-view></router-view>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
  <v-footer app fixed>
    <span>&copy; 2018</span>
  </v-footer>
  <v-dialog
    v-model="dialog"
    transition="dialog-bottom-transition"
    scrollable
    full-width
    >
    <v-card>
      <v-toolbar card>
        <v-btn icon  @click="dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Chart</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text >
        <div class="chart">
          <time-series-chart :station="station"></time-series-chart>
        </div>

      </v-card-text>
    </v-card>

  </v-dialog>

</v-app>

</template>
<style scoped>
  .chart {
  height: 300px;
  }
</style>
<script>
import { mapState } from 'vuex'
import LayerControl from 'vue-mapboxgl-layercontrol'
import { layers, sources } from './layers'
import _ from 'lodash'

import TimeSeriesChart from '@/components/TimeSeriesChart'

export default {
  name: 'App',
  components: {
    'layer-control': LayerControl,
    'time-series-chart': TimeSeriesChart
  },
  methods: {
    // TODO: move to an action in the store
    fillInLayers (layers) {
      return Promise.all(
        _.map(layers, (layer) => {
          // replace the source if hydroEngine
          if (_.get(layer, 'source.type') === 'hydroEngine') {
            // Load GEE url's
            return new Promise((resolve, reject) => {
              fetch(layer.source.url)
                .then(x => x.json())
                .then(x => {
                  let result = {
                    ...layer,
                    source: {
                      type: 'raster',
                      tiles: [
                        x.url
                      ],
                      tileSize: 256
                    }
                  }
                  resolve(result)
                })
                .catch(x => reject(x))
            })
          } else {
            return layer
          }
        })
      )
    }
  },
  mounted () {
    this.$store.commit('setSources', sources)
    this.fillInLayers(layers).then(layers => {
      this.$store.commit('setLayers', layers)
    })
  },
  watch: {
    map (map) {
      map.on('click', 'psmsl-points', (evt) => {
        const feature = evt.features[0]
        this.dialog = true
        this.$store.dispatch('fetchStation', { station: feature })
      })
      // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
      map.on('mouseenter', 'psmsl-points', function () {
        map.getCanvas().style.cursor = 'pointer'
      })

      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'psmsl-points', function () {
        map.getCanvas().style.cursor = ''
      })
    }
  },
  computed: {
    layers: {
      get () {
        return this.$store.state.layers
      },
      set (layers) {
        this.$store.commit('setLayers', layers)
      }
    },
    ...mapState({
      map: state => state.map,
      station: state => state.station
    })
  },
  data () {
    return {
      layerActive: false,
      drawer: false,
      dialog: false,
      chart: null
    }
  }
}
</script>
