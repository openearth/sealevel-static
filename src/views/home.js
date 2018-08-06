import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'mapbox-gl/dist/mapbox-gl.css'

import Vue from 'vue'
import Vuetify from 'vuetify'
import Vue2Mapbox from 'vue2mapbox-gl'
import MapLayers from '../components/VMapLayers'

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
    'v-map-layers': MapLayers
  }
}
