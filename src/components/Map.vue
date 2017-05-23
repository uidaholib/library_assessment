<template>
  <v-card>
    <v-card-row class="blue-grey darken-1">
      <v-card-title>
        <v-icon light class="pa-1">map</v-icon>
        <span class="white--text" v-text="title"></span>
        <v-spacer></v-spacer>
        <div>
  
          <v-menu id="card-more" bottom left origin="top right">
            <v-btn icon="icon" slot="activator" class="white--text">
              <v-icon>more_vert</v-icon>
            </v-btn>
            <v-list>
              <v-list-item>
                <v-list-tile>
                  <v-list-tile-title>Send Feedback</v-list-tile-title>
                </v-list-tile>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-card-title>
    </v-card-row>
    <v-card-text class="pa-0">
      <v-card-row height="400px" id="map" class="pa-0 ma-0">
      </v-card-row>
    </v-card-text>
    <!--<v-divider></v-divider>-->
    <v-card-row actions class="blue-grey darken-1">
      <v-menu lazy :close-on-content-click="false" v-model="startDatePicker" transition="v-scale-transition" class="pa-0 ma-0" light>
        <v-text-field slot="activator" label="Start Date" v-model="startDateEntry" prepend-icon="event" class="white--text" light readonly></v-text-field>
        <v-date-picker v-model="startDateEntry" no-title scrollable actions>
          <template scope="{ save, cancel }">
            <v-card-row actions>
              <v-btn flat primary @click.native="cancel()">Cancel</v-btn>
              <v-btn flat primary @click.native="save()">Save</v-btn>
            </v-card-row>
          </template>
        </v-date-picker>
      </v-menu>
      <v-menu lazy :close-on-content-click="false" v-model="endDatePicker" transition="v-scale-transition" class="pa-0 ma-0" light>
        <v-text-field slot="activator" label="End Date" v-model="endDateEntry" prepend-icon="event" class="white--text" light readonly></v-text-field>
        <v-date-picker v-model="endDateEntry" no-title scrollable actions>
          <template scope="{ save, cancel }">
            <v-card-row actions>
              <v-btn flat primary @click.native="cancel()">Cancel</v-btn>
              <v-btn flat primary @click.native="save()">Save</v-btn>
            </v-card-row>
          </template>
        </v-date-picker>
      </v-menu>
      <v-select class="white--text" v-bind:items="timePeriods" v-model="timePeriod" label="Time Period" light single-line auto></v-select>
      <v-select class="white--text" v-bind:items="floors" v-model="selectedFloor" label="Floor" light single-line auto></v-select>
    </v-card-row>
  </v-card>
</template>

<script>
import L from 'leaflet';
import esri from 'esri-leaflet';
import mapLayers from '../services/map-layers.js'
import { mapGetters } from 'vuex'

export default {
  name: 'map',
  data() {
    let map
    let token
    return {
      map: null,
      token: '',
      selectedFloor: null,
      floors: [
        '1st Floor',
        '2nd Floor',
        '3rd Floor',
        '4th Floor'
      ],
      title: 'Map',
      startDateEntry: null,
      endDateEntry: null,
      startDatePicker: false,
      endDatePicker: false,
      timePeriods: [
        'This Week',
        'Last Week',
        'This Month',
        'Last Month',
        'This Year',
        'Last Year',
        'All'
      ],
      timePeriod: null
    }
  },
  watch: {
    // token(value) {
    //   mapLayers.spaceAssessmentFeatureLayer(value, this.selectedFloor, this.map)
    //   mapLayers.floorPlansBasemap(value, this.selectedFloor, this.map)
    // },
    selectedFloor(value) {
      console.log('selectedFloor:', value);
      this.floorPlanBasemap.url =
        this.$store.commit('setFloor', parseInt(value.charAt()))
      // this.$store.commit('addBasemap', this.floorPlanBasemap)
      this.$store.commit('addFeatureLayer', this.spaceAssessmentFL)
      esri.tiledMapLayer({
          url: '//tiles.arcgis.com/tiles/WLhB60Nqwp4NnHz3/arcgis/rest/services/library_' + this.floor + '_floor_floor_plans_basemap_web_app/MapServer',
          maxZoom: 19,
          minZoom: 16,
          token: this.token
        })
        .addTo(this.map);
    }
  },
  computed: {
    ...mapGetters({
      getToken: 'getToken',
      floor: 'getFloor'
    }),
    spaceAssessmentFL() {
      const featureLayerUrl = '//services.arcgis.com/WLhB60Nqwp4NnHz3/arcgis/rest/services/library_space_assessment_areas/FeatureServer/0'
      const payload = {
        title: 'spaceAssessmentFL',
        url: featureLayerUrl,
        token: this.getToken,
        where: 'Floor = ' + this.floor,
        map: this.map
      }
      return payload
    },
    floorPlanBasemap() {
      const basemapUrl = '//tiles.arcgis.com/tiles/WLhB60Nqwp4NnHz3/arcgis/rest/services/library_' + this.floor + '_floor_floor_plans_basemap_web_app/MapServer'
      const payload = {
        title: 'floorPlanBasemap',
        url: basemapUrl,
        maxZoom: 19,
        minZoom: 16,
        token: this.token,
        map: this.map
      }
      return payload
    }
  },
  methods: {
  },
  created() {
    this.token = this.getToken
    const featureLayerUrl = '//services.arcgis.com/WLhB60Nqwp4NnHz3/arcgis/rest/services/library_space_assessment_areas/FeatureServer/0'
    const basemapUrl = '//tiles.arcgis.com/tiles/WLhB60Nqwp4NnHz3/arcgis/rest/services/library_' + this.floor + '_floor_floor_plans_basemap_web_app/MapServer'
    this.spaceAssessmentFL = {
      title: 'spaceAssessmentFL',
      url: featureLayerUrl,
      token: this.getToken,
      where: 'Floor = ' + this.floor,
      map: this.map
    }
    this.floorPlanBasemap = {
      title: 'floorPlanBasemap',
      url: basemapUrl,
      maxZoom: 19,
      minZoom: 16,
      token: this.token,
      map: this.map
    }
  },
  mounted() {
    this.map = L.map('map').setView([46.7274, -117.0144], 19);
    esri.basemapLayer('Topographic').addTo(this.map);
    // this.$store.commit('addBasemap', this.floorPlanBasemap)
    this.$store.commit('addFeatureLayer', this.spaceAssessmentFL)
  }
}
</script>

<style scoped>
#map {
  /*height: 400pt;*/
  width: 100%;
  z-index: 1!important;
}
</style>
