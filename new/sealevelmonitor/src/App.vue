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
  </v-app>

</template>

<script>
import { mapState } from 'vuex'
import LayerControl from 'vue-mapboxgl-layercontrol'
import { layers, sources } from './layers'
import _ from 'lodash'

export default {
  name: 'App',
  components: {
    'layer-control': LayerControl
  },
  methods: {
    fillInLayers (layers) {
      console.log('layers', layers)
      return Promise.all(
        _.map(layers, (layer) => {
          if (layer.hydroEngine) {
            // Load GEE url's
            return new Promise((resolve, reject) => {
              fetch(layer.hydroEngine)
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
    this.fillInLayers(layers).then(layers => {
      this.$store.commit('setLayers', layers)
    })
    this.$store.commit('setSources', sources)
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
    // arrow functions can make the code very succinct!
      map: state => state.map
    })
  },
  data () {
    return {
      layerActive: false,
      drawer: false
    }
  }
}
</script>
