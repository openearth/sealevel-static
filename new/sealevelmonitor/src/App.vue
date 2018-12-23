<template>
  <v-app id="inspire" dark>
    <v-navigation-drawer
      v-model="drawer"
      clipped
      fixed
      app
      >
      <v-list dense>
        <v-list-group
          v-model="layerActive"
          no-action
          >
          <v-list-tile to="/" slot="activator">
            <v-list-tile-action>
              <v-icon>dashboard</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Map</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-content>
              <layer-control :map="map" :layers="layers"></layer-control>
            </v-list-tile-content>

          </v-list-tile>
        </v-list-group>
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
import LayerControl from 'vue-mapboxgl-layercontrol'
import layers from './layers'

export default {
  name: 'App',
  components: {
    'layer-control': LayerControl
  },
  data () {
    return {
      layerActive: false,
      drawer: false,
      map: null,
      layers: layers
    }
  }
}
</script>
