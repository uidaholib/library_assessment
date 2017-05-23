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
      <v-card-row height="400px" width="100%" id="map" class="pa-0 ma-0">
      </v-card-row>
      <v-card-row height="50px" class="grey pa-1">
        <h6 class="indigo--text" v-text="selectedFloor ? selectedFloor : '1st Floor'"></h6>
        <h6 class="indigo--text pl-1" v-text="building"></h6>
        <v-spacer></v-spacer>
        <v-btn class="indigo--text">See Data Table</v-btn>
        <v-btn class="indigo--text">See Chart</v-btn>
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
import L from 'leaflet'
import esri from 'esri-leaflet'
import moment from 'moment'
import { mapGetters } from 'vuex'
import query from '../libs/EsriLeafletRelated.js'
import tableHelpers from '../libs/table-helpers.js'

export default {
  name: 'map',
  data() {
    let map
    return {
      map: null,
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
      timePeriod: null,
      building: 'Library',
      floorPlansBasemap: null,
      spaceAssessmentFeatureLayer: null
    }
  },
  watch: {
    token(value) {
      this.setMapLayers(value, this.selelectedFloor)
    },
    selectedFloor(value) {
      this.setMapLayers(this.token, value)
    }
  },
  computed: {
    ...mapGetters({
      token: 'getToken'
    }),
    floor() {
      return this.selectedFloor.substring(0, 3)
    }
  },
  methods: {
    setFloorPlansBasemap(token, maxZoom, minZoom, floor) {
      this.floorPlansBasemap = esri.tiledMapLayer({
        url: '//tiles.arcgis.com/tiles/WLhB60Nqwp4NnHz3/arcgis/rest/services/library_' + floor + '_floor_floor_plans_basemap_web_app/MapServer',
        maxZoom: maxZoom,
        minZoom: minZoom,
        token: token
      }).addTo(this.map)
    },
    setSpaceAssessmentFeatureLayer(token, floorLvl) {
      this.spaceAssessmentFeatureLayer = esri.featureLayer({
        url: '//services.arcgis.com/WLhB60Nqwp4NnHz3/arcgis/rest/services/library_space_assess' +
        'ment_areas/FeatureServer/0',
        //where: 'Floor = 1',
        token: token,
        where: 'Floor = ' + floorLvl
      }).addTo(this.map)
      this.spaceAssessmentFeatureLayer.on('click', e => this.queryRelatedField(e))
    },
    setMapLayers(tokenValue, floorValue) {
      const floor = floorValue.substring(0, 3)
      const floorLvl = floorValue.charAt()
      this.map.removeLayer(this.floorPlansBasemap)
      this.map.removeLayer(this.spaceAssessmentFeatureLayer)
      this.setSpaceAssessmentFeatureLayer(tokenValue, floorLvl)
      this.setFloorPlansBasemap(tokenValue, 19, 16, floor)
    },
    queryRelatedField(event) {
      const building = tableHelpers.buildingNameFormatter(event.layer.feature.properties.BldgName)
      console.log('event: ', event)
      console.log('building: ', building)
      const dStart = moment.utc().subtract(1, 'months').startOf('month').format()
      const dEnd = moment.utc().subtract(1, 'months').endOf('month').format()
      const expr = "EditDate between '" + dStart + "' AND '" + dEnd + "'"
      query(this.spaceAssessmentFeatureLayer).objectIds([event.layer.feature.id]).relationshipId('0').definitionExpression(expr).run((error, response, raw) => {
        const items = tableHelpers.getItemsFromQuery(response)
        const title = building + ' Building Usage Data'
        const headers = [
          {
            text: 'Collection Date',
            left: true,
            sortable: true,
            value: 'date'
          },
          { text: 'Type of Use', value: 'use' },
          { text: 'Number of Users', value: 'numberOfUsers' }
        ]
        this.$store.commit('setDataTable', { title, headers, items })
      })
    }
  },
  created() {
  },
  mounted() {
    const floor = '1st'
    const floorLvl = 1
    this.map = L.map('map').setView([46.7274, -117.0144], 19)
    esri.basemapLayer('Topographic').addTo(this.map)
    this.setFloorPlansBasemap(this.token, 19, 16, floor)
    this.setSpaceAssessmentFeatureLayer(this.token, floorLvl)
  }
}
</script>

<style scoped>
#map {
  /*height: 100%;*/
  /*width: 100%;*/
  z-index: 1!important;
}
</style>
