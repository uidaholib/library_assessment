<template>
  <v-layout row wrap justify-space-around>
    <v-flex xs12 sm10 md8 lg6 xl6>
      <v-card class="mt-4 pa-2" v-if="dataAvailable">
        <v-card-title>
          <h5>{{chartTitle.title}}</h5>
        </v-card-title>
        <v-card-row class="pl-4">
          <h6>{{chartTitle.subtitle}}</h6>
        </v-card-row>
        <v-card-row>
          <v-card-text>
            <bar-chart :chart-data="chartData.dataCollection"></bar-chart>
          </v-card-text>
        </v-card-row>
      </v-card>
    </v-flex>
    <v-flex xs12 sm10 md8 lg6 xl6>
      <v-card class="mt-4 pa-2" v-if="dataAvailable">
        <v-card-title>
          <h5>{{chartTitle.title}}</h5>
        </v-card-title>
        <v-card-row class="pl-4">
          <h6>{{chartTitle.subtitle}}</h6>
        </v-card-row>
        <v-card-row>
          <v-card-text>
            <line-chart :chart-data="chartData.dataCollection | truncateLabels(15)"></line-chart>
          </v-card-text>
        </v-card-row>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import BarChart from './BarChart.js'
import LineChart from './LineChart.js'
import chartHelpers from '../libs/chart-helpers.js'
import tableHelpers from '../libs/table-helpers.js'

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters({
      chartData: 'getChartData',
      datatable: 'getDataTable'
    }),
    items() {
      return this.datatable.items
    },
    chartTitle() {
      return this.datatable.tableTitle
    },
    dataAvailable() {
      if (this.datatable) {
        return this.datatable.items.length !== 0
      }
      return false
    }
  },
  methods: {
    formatLabel(label, maxWidth) {
      const index = label.indexOf('(')
      const subLabel = label.substring(0, index)
      const words = subLabel.split(' ')
      const filtered = words.filter(s => s !== '/')
      console.log('filtered: ', filtered);
    }
  },
  watch: {
  },
  mounted() {
  },
  filters: {
    truncateLabels(obj, size) {
      const formatLabel = (label, maxWidth) => {
        const index = label.indexOf('(')
        const subLabel = (index === -1) ? label : label.substring(0, index)
        const words = subLabel.split(' ')
        const filtered = words.filter(s => s !== '/' && s !== '')
        return filtered
      }
      if (obj && obj.labels && obj.datasets) {
        console.log('object: ', obj)
        console.log('size: ', size)
        const labels = obj.labels.map(label => {
          const filtered = formatLabel(label)
          console.log('filtered: ', filtered)
          return filtered
        })
        const datasets = obj.datasets
        console.log('datasets: ', datasets)
        console.log(labels)
        let newObject = { datasets, labels }
        return newObject
      }
      else {
        return null
      }
    }
  },
  components: {
    'bar-chart': BarChart,
    'line-chart': LineChart
  }
}
</script>

<style>

</style>
