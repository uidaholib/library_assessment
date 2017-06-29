<template>
  <div id="app-map">
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
      <v-card-row actions class="blue-grey darken-1">
        <span class="pa-1 mb-3 mr-3">
          <daterange-picker :dateRange="dateRange"></daterange-picker>
        </span>
        <v-select class="white--text mr-3" v-bind:items="buildings" v-model="selectedBuilding" label="Building" light single-line auto></v-select>
        <v-select class="white--text" v-if="selectedBuilding" v-bind:items="floors" v-model="selectedFloor" label="Floor" light single-line auto></v-select>
      </v-card-row>
      <v-card-text class="pa-0" v-show="mapToggled">
        <v-card-row height="400px" width="100%" id="map" class="pa-0 ma-0" v-if="mapToggled">
        </v-card-row>
        <v-card-row height="50px" class="grey pa-1">
          <span class="white--text pl-1" v-text="building"></span>
          <v-spacer></v-spacer>
          <v-btn class="indigo--text" @click.native="navigateTo('building-table')">See Data Tables</v-btn>
          <v-btn class="indigo--text" @click.native="navigateTo('building-chart')">See Charts</v-btn>
        </v-card-row>
      </v-card-text>
      <!--<v-divider></v-divider>-->
  
    </v-card>
    <v-dialog v-model="dialog.model" persistent>
      <v-card>
        <v-card-row>
          <v-card-title v-text="dialog.title"></v-card-title>
        </v-card-row>
        <v-card-row>
          <v-card-text class="text-xs-left" v-if="dialog.dataAvailable" v-text="dialog.text"></v-card-text>
          <v-card-text class="text-xs-left" v-else v-text="dialog.error"></v-card-text>
        </v-card-row>
        <v-card-row>
          <div v-if="dialog.dataAvailable">
            <a class="btn primary white--text" href="#building-table" @click="dialog.model = false">TABLE</a>
            <a class="btn primary white--text" href="#building-chart" @click="dialog.model = false">CHART</a>
          </div>
          <div v-else>
            <v-btn primary light @click.native="dialog.model = false">CLOSE</v-btn>
          </div>
        </v-card-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import L from 'leaflet'
import esri from 'esri-leaflet'
import router from '../router'
import moment from 'moment'
import { mapGetters, mapMutations } from 'vuex'
import query from '../libs/EsriLeafletRelated.js'
import mapHelpers from '../libs/map-helpers.js'
import tableHelpers from '../libs/table-helpers.js'
import DaterangePicker from './DaterangePicker'

export default {
  name: 'map',
  data() {
    let map
    return {
      map: null,
      mapToggled: false,
      selectedFloor: null,
      dataAvailable: false,
      dateRange: null,
      selectedLayer: null,
      dialog: {
        model: false,
        title: 'Area Selected',
        text: 'Visualize Data With Chart/Table',
        error: 'No data available for this selection',
        actions: ['Chart', 'Table'],
        dataAvailable: false
      },
      buildings: [
        'Library',
        'College of Education'
      ],
      selectedBuilding: null,
      floors: [
        '1st Floor',
        '2nd Floor',
        '3rd Floor',
        '4th Floor'
      ],
      title: 'Map',
      floorPlansBasemap: null,
      spaceAssessmentFeatureLayer: null,
      libraryLocation: [46.7274, -117.0144],
      collEdLocation: [46.72585122069073, -117.01240709420746],
      location: null
    }
  },
  watch: {
    '$route'(to, from, next) {
    },
    datatable(value) {
      this.dataAvailable = value
    },
    token(value) {
      this.setMapLayers(value, this.selelectedFloor)
    },
    authentication(value) {
      this.setMapLayers(this.token, this.selelectedFloor)
    },
    selectedFloor(value) {
      if (!this.mapToggled) {
        this.mapToggled = true
        setTimeout(() => {
          if (!this.map) {
            this.map = L.map('map').setView(this.location, 19)
            // this.map.createPane('overlay');
            // this.map.getPane('overlay').style.zIndex = 650
          }
          const floor = (this.selectedFloor) ? (this.selectedFloor.substring(0, 3)) : '1st'
          const floorLvl = (this.selectedFloor) ? (this.selectedFloor.charAt()) : 1
          esri.basemapLayer('Topographic').addTo(this.map)
          this.setFloorPlansBasemap(this.token, 19, 16, floor)
          this.setSpaceAssessmentFeatureLayer(this.token, floorLvl)
          mapHelpers.addOverlay(this.map, this.spaceAssessmentFeatureLayer, this.selectedLayer, this.calendar.dateRange, this.selectedBuilding, this.building, this.selectedFloor, this.dialog)
        }, 100)
      }
      else {
        this.setMapLayers(this.token, value)
        mapHelpers.addOverlay(this.map, this.spaceAssessmentFeatureLayer, this.selectedLayer, this.calendar.dateRange, this.selectedBuilding, this.building, this.selectedFloor, this.dialog)
      }
    },
    selectedBuilding(value) {
      this.location = (value === 'Library') ? this.libraryLocation : this.collEdLocation
      if (this.map) {
        this.map.setView(this.location, 19)
      }
      if (value === 'College of Education') {
        this.selectedFloor = '3rd Floor'
      }
    }
  },
  computed: {
    ...mapGetters({
      token: 'getToken',
      calendar: 'getCalendar',
      authentication: 'getAuthentication'
    }),
    floor() {
      return this.selectedFloor.substring(0, 3)
    },
    building() {
      const floor = (this.selectedFloor) ? this.selectedFloor : '1st Floor'
      return floor + ' ' + this.selectedBuilding
    }
  },
  methods: {
    ...mapMutations({
      setDataTable: 'setDataTable',
      setRoomLocation: 'setRoomLocation',
      setChartData: 'setChartData',
      setCalendar: 'setCalendar',
      datatable: 'getDataTable'
    }),
    navigateTo(to) {
      router.push('#' + to)
    },
    see(link) {
      this.dialog.model = false
      router.push('/home#' + link.toLowerCase())
    },
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
      })
      this.spaceAssessmentFeatureLayer.pane = 'overlay'
      this.spaceAssessmentFeatureLayer.addTo(this.map)
      this.spaceAssessmentFeatureLayer.on('click', e => {
        mapHelpers.queryRelatedField(this.map, this.selectedLayer, e, this.calendar.dateRange, this.spaceAssessmentFeatureLayer, this.building)
          .then(response => {
            this.dialog.dataAvailable = response
            this.dialog.model = true
            this.selectedLayer = e.layer
          })
      })
    },
    setMapLayers(tokenValue, floorValue) {
      const floor = (floorValue) ? floorValue.substring(0, 3) : '1st'
      const floorLvl = (floorValue) ? floorValue.charAt() : 1
      this.map.removeLayer(this.floorPlansBasemap)
      this.map.removeLayer(this.spaceAssessmentFeatureLayer)
      this.setSpaceAssessmentFeatureLayer(tokenValue, floorLvl)
      this.setFloorPlansBasemap(tokenValue, 19, 16, floor)
    }
  },
  created() {
  },
  mounted() {

  },
  components: {
    'daterange-picker': DaterangePicker
  }
}
</script>

<style scoped>
#map {
  /*height: 100%;*/
  /*width: 100%;*/
  z-index: 1!important;
}

.info {
  padding: 6px 8px;
  font: 14px/16px Arial, Helvetica, sans-serif;
  background: white;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}

.info h4 {
  margin: 0 0 5px;
  color: #777;
}

.legend {
  text-align: left;
  line-height: 18px;
  color: #555;
}

.legend i {
  width: 18px;
  height: 18px;
  float: left;
  margin-right: 8px;
  opacity: 0.7;
}
</style>

</style>
