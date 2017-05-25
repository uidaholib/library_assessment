<template>
  <v-card v-if="display" class="mt-4 pa-2">
    <v-card-title>Charts</v-card-title>
    <v-card-row>
      <v-card-text>
        <bar-chart :chart-data="chartData.dataCollection" :options="options"></bar-chart>
      </v-card-text>
    </v-card-row>
  </v-card>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import BarChart from './BarChart.js'
import chartHelpers from '../libs/chart-helpers.js'
import tableHelpers from '../libs/table-helpers.js'

export default {
  data() {
    return {
      display: true,
      dataCollection: {},
      data: {
        labels: ['January', 'February', 'March', 'April'],
        datasets: [
          {
            label: 'Studying',
            backgroundColor: '#f87900',
            data: [10, 20, 40, 20]
          },
          {
            label: 'Browsing',
            backgroundColor: '#f87979',
            data: [12, 15, 50, 120]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        legend: {
          display: true,
          position: 'top',
          labels: {
            fontSize: 14
          }
        },
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true,
              min: 0,
              suggestedMin: 0
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              min: 0,
              suggestedMin: 0
            }
          }]
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      chartData: 'getChartData'
    }),
    items() {
      console.log('chart items: ', this.datatable.items)
      return this.datatable.items
    }
  },
  watch: {
    chartData(value) {
      console.log('chartData: ', this.chartData)
    }
  },
  mounted() {
  },
  components: {
    'bar-chart': BarChart
  }
}
</script>

<style>

</style>
