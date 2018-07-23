<template>
  <div class="home">
    <v-app
      >
      <v-navigation-drawer
        v-model="drawer"
        fixed
        clipped
        app
        >
        <v-list dense>
          <v-list-tile v-for="item in items" :key="item.text" @click="$router.push({'name': item.route})">
            <v-list-tile-action>
              <v-icon :disabled="!item.public">{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title :class="{'grey--text': !item.public}">
                {{ item.text }} <v-icon small v-if="!item.public">attach_money</v-icon>
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar
        dense
        fixed
        clipped-left
        app
        >
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-icon class="mx-3">fab fa-youtube</v-icon>
        <v-toolbar-title class="mr-5 align-center">
          <span class="title">Sea-level and subsidence monitor</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-content>
        <v-container fluid fill-height pa-0>
          <v-layout>
            <v-flex>
              <v-mapbox
                access-token="pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA"
                map-style="mapbox://styles/mapbox/satellite-streets-v10"
                id="map"></v-mapbox>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'mapbox-gl/dist/mapbox-gl.css'

import Vue from 'vue'
import Vuetify from 'vuetify'

import Vue2Mapbox from 'vue2mapbox-gl'

Vue.use(Vuetify)
Vue.use(Vue2Mapbox)
// @ is an alias to /src
export default {
  name: 'home',
  data () {
    return {
      drawer: false,
      items: [
        { icon: 'trending_up', text: 'Trends', public: true, route: 'trends' },
        { icon: 'subscriptions', text: 'Animations', public: true, route: 'animations' },
        { icon: 'featured_play_list', text: 'Reports', public: false, route: 'reports' },
        { icon: 'alarm', text: 'Signals', public: false, route: 'signals' },
        { icon: 'business', text: 'Cost estimates', public: false, route: 'cost' }
      ]
    }
  },
  components: {
  }
}
</script>
<style>
  #map {
  width: 100%;
  height: 100%;
  }
</style>
