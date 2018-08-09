<template>
  <v-expansion-panel class="panel">
    <draggable class="draggable" v-model="reverseLayers" @start="drag=true" @end="drag=false" :options="{handle:'.v-icon'}">
      <v-expansion-panel-content v-for="layer in reverseLayers" :key="layer.id" focusable>
        <div class="header" slot="header">
          <v-list dense>
            <v-list-tile title="Click to open / close layer properties">
              <v-icon class="draghandle mr-2" @click.stop=";" title="Drag to change map layer drawing order">dehaze</v-icon>
              <v-list-tile-action @click.stop=";">
                <v-switch v-model="layer.active" title="Click to change layer visibility"></v-switch>
              </v-list-tile-action>
              <v-list-tile-title>{{layer.name}}</v-list-tile-title>
              <v-list-tile-avatar class="" v-if="layer.icon">
                <img :src="layer.icon" />
              </v-list-tile-avatar>
            </v-list-tile>
          </v-list>
        </div>
        <div class="ma-0 pl-5 pr-5">
          <v-slider v-if="layer.opacity" hide-details title="Change layer opacity" :min="1" :max="100" v-model="layer.opacity"></v-slider>
          <v-select v-if="layer.visualisations" :items="layer.visualisations" item-text="name" item-value="name" v-model="falseColor" item></v-select>
          <div v-if="layer.legend">
            <template v-if="layer.legend.range">
              <div class="color-ramp mt-1" v-if="layer.legend.colors" :style="colorRamp(layer.legend)" ></div>
              <div class='range-ramp'>{{layer.legend.range}}</div>
            </template>
            <template v-if="layer.legend.colors && layer.legend.labels">
              <div class="color-label" v-for="i in layer.legend.colors.length" :key="i">
                <span class="colored-span" :style="'background-color: ' + layer.legend.colors[i-1]"></span>
                <label class="ma-1" >{{layer.legend.labels[i-1]}}</label>
              </div>
            </template>
          </div>
          <div v-if="layer.info" class="pb-2 pt-2" v-html="layer.info"></div>
        </div>
      </v-expansion-panel-content>
    </draggable>
  </v-expansion-panel>
</template>

<script src="./v-layer-control.js"></script>

<style scoped>

.v-expansion-panel__container >>> .v-expansion-panel__header {
  padding-top: 0px;
  padding-left: 0px;
  padding-right: 8px;
  padding-bottom: 0px;
}

.v-list__tile__avatar {
  min-width: 40px;
}

.draghandle {
  cursor: grab !important;
}
.draggable {
  width: 100%;
}

.color-ramp {
  height: 10px;
}

.range-ramp {
  text-align: justify;
  text-align-last: justify;
  width: 100%;
}

.color-label {
  display: flex;
}

.colored-span {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  margin: 4px;
}
</style>
