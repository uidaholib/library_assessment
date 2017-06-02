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
        <v-switch label="Calendar" class="pr-4" v-model="enableCalendar" light></v-switch>
        <v-layout class="ml-4" v-if="enableCalendar">
          <v-menu lazy :close-on-content-click="false" v-model="startDatePicker" transition="v-scale-transition" class="ml-4" light>
            <v-text-field slot="activator" label="Start Date" v-model="startDateEntry" :hint="startDateEntryFormatted" prepend-icon="event" class="white--text" light readonly persistent-hint></v-text-field>
            <v-date-picker v-model="startDateEntry" :date-format="date => new Date(date).toDateString()" :formatted-value.sync="startDateEntryFormatted" no-title scrollable actions>
              <template scope="{ save, cancel }">
                <v-card-row actions>
                  <v-btn flat primary @click.native="cancel()">Cancel</v-btn>
                  <v-btn flat primary @click.native="save()">Save</v-btn>
                </v-card-row>
              </template>
            </v-date-picker>
          </v-menu>
          <v-menu lazy :close-on-content-click="false" v-model="endDatePicker" transition="v-scale-transition" class="pa-0 ma-0" light>
            <v-text-field slot="activator" label="End Date" :hint="endDateEntryFormatted" v-model="endDateEntry" prepend-icon="event" class="white--text" light readonly persistent-hint></v-text-field>
            <v-date-picker v-model="endDateEntry" :date-format="date => new Date(date).toDateString()" :formatted-value.sync="endDateEntryFormatted" no-title scrollable actions>
              <template scope="{ save, cancel }">
                <v-card-row actions>
                  <v-btn flat primary @click.native="cancel()">Cancel</v-btn>
                  <v-btn flat primary @click.native="save()">Save</v-btn>
                </v-card-row>
              </template>
            </v-date-picker>
          </v-menu>
        </v-layout>
        <v-select v-else class="white--text" v-bind:items="timePeriods" v-model="timePeriod" label="Time Period" light single-line auto></v-select>
        <v-select class="white--text" v-bind:items="buildings" v-model="selectedBuilding" label="Building" light single-line auto></v-select>
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
          <v-card-text class="text-xs-left" v-text="dialog.text"></v-card-text>
        </v-card-row>
        <v-card-row>
          <a class="btn" href="#building-table" @click="dialog.model = false">Table</a>
          <a class="btn" href="#building-table" @click="dialog.model = false">Chart</a>
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

export default {
  name: 'map',
  data() {
    let map
    return {
      map: null,
      mapToggled: false,
      selectedFloor: null,
      period: tableHelpers.durationFormatter('Today'),
      dataAvailable: false,
      enableCalendar: false,
      startDateEntry: null,
      startDateEntryFormatted: null,
      endDateEntry: null,
      endDateEntryFormatted: null,
      startDatePicker: false,
      endDatePicker: false,
      timePeriod: null,
      dialog: {
        model: false,
        title: 'Area Selected',
        text: 'Visualize Data With Chart/Table',
        error: 'No data available for this selection',
        actions: ['Chart', 'Table']
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
      timePeriods: [
        'Today',
        'Yesterday',
        'This Week',
        'Last Week',
        'This Month',
        'Last Month',
        'This Year',
        'Last Year',
        'All'
      ],
      floorPlansBasemap: null,
      spaceAssessmentFeatureLayer: null,
      libraryLocation: [46.7274, -117.0144],
      collEdLocation: [46.72585122069073, -117.01240709420746],
      location: null,
    }
  },
  watch: {
    '$route'(to, from, next) {
      console.log('router: ', { to, from, next })
      this.startDateEntry = this.calendar.startDateEntry
      this.startDateEntryFormatted = this.calendar.startDateEntryFormatted
      this.endDateEntry = this.calendar.endDateEntry
      this.endDateEntryFormatted = this.calendar.endDateEntryFormatted
      this.timePeriod = this.calendar.timePeriod
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
            this.map.on('moveend', e => {
              console.log('event: ', e)
              console.log('map center: ', this.map.getCenter())
            })
          }
          const floor = (this.selectedFloor) ? (this.selectedFloor.substring(0, 3)) : '1st'
          const floorLvl = (this.selectedFloor) ? (this.selectedFloor.charAt()) : 1
          esri.basemapLayer('Topographic').addTo(this.map)
          this.setFloorPlansBasemap(this.token, 19, 16, floor)
          this.setSpaceAssessmentFeatureLayer(this.token, floorLvl)
        }, 100)
      }
      else {
        this.setMapLayers(this.token, value)
      }
    },
    timePeriod(value) {
      this.period = tableHelpers.durationFormatter(value)
      this.setCalendar({ timePeriod: value })
    },
    startDateEntry(value) {
      this.period.start = moment.utc(value).format()
      this.setCalendar({ startDateEntry: value })
    },
    endDateEntry(value) {
      this.period.end = moment.utc(value).format()
      this.setCalendar({ endDateEntry: value })
    },
    startDateEntryFormatted(value) {
      this.setCalendar({ startDateEntryFormatted: value })
    },
    endDateEntryFormatted(value) {
      this.setCalendar({ endDateEntryFormatted: value })
    },
    selectedBuilding(value) {
      this.location = (value === 'Library') ? this.libraryLocation : this.collEdLocation
      if (this.map) {
        this.map.setView(this.location, 19)
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
      return floor + ' Library'
    }
  },
  methods: {
    ...mapMutations({
      setDataTable: 'setDataTable',
      setRoomLocation: 'setRoomLocation',
      setChartData: 'setChartData',
      setCalendar: 'setCalendar'
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
      }).addTo(this.map)
      this.spaceAssessmentFeatureLayer.on('click', e => {
        const response = mapHelpers.queryRelatedField(e, this.period, this.spaceAssessmentFeatureLayer, this.building)
        // this.dialog.model = true
        this.dataAvailable = (response !== null)
        if (response === null) {
          alert('No data availabale for this selection!')
        }
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
    // this.map = null
    // const floor = '1st'
    // const floorLvl = 1
    // this.map = L.map('map').setView([46.7274, -117.0144], 19)
    // esri.basemapLayer('Topographic').addTo(this.map)
    // this.setFloorPlansBasemap(this.token, 19, 16, floor)
    // this.setSpaceAssessmentFeatureLayer(this.token, floorLvl)
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
