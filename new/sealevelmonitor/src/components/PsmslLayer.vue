<script>
export default {
  name: 'psmsl-layer',
  data () {
    return {
      map: null
    }
  },
  render () {
    return ''
  },
  methods: {
    deferredMountedTo (map) {
      this.map = map
    }
  }
}
</script>
