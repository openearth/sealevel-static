<template>

    <v-mapbox
      access-token="pk.eyJ1IjoiYWRyaWFhbnNlIiwiYSI6ImNqYXd4YnZ5dzc4dzMycW53b3lhMXZ6eDkifQ.bbG-PKhVspm-Mkh9zhO8hQ"
      map-style="mapbox://styles/mapbox/satellite-streets-v10"
      @mb-load="mbload"
      >
    </v-mapbox>

</template>

<script>
import Vue from 'vue'
import Vue2MapboxGL from 'vue2mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

Vue.use(Vue2MapboxGL)

export default {
  methods: {
    mbload (evt) {
      this.$store.commit('setMap', evt.target)
    }
  },
  components: {
  }
}
</script>
<style>
.mapboxgl-map {
  height: 100%;
}
</style>
