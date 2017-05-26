import {Line, mixins} from 'vue-chartjs'

const {reactiveProp} = mixins

const options = {
  responsive: true,
  maintainAspectRatio: true,
  spanGaps: false,
  backgroundColor: '#f87900',
  plugins: {
    filler: {
      propagate: false
    }
  },
  legend: {
    display: true,
    position: 'top',
    labels: {
      fontSize: 14
    }
  },
  scales: {
    xAxes: [
      {
        ticks: {
          autoSkip: false,
          maxRotation: 0
        }
      }
    ]
  }
}

export default Line.extend({
  mixins: [reactiveProp],

  mounted() {
    this.renderChart(this.chartData, options)
  }
})