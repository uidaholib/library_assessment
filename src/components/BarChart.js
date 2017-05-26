import { HorizontalBar, mixins } from 'vue-chartjs'

const { reactiveProp } = mixins

const options = {
  responsive: true,
  maintainAspectRatio: true,
  spanGaps: false,
  elements: {
    line: {
      tension: 0.000001
    }
  },
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
          beginAtZero: true,
          min: 0,
          suggestedMin: 0,
          autoSkip: false,
          maxRotation: 0
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          min: 0,
          suggestedMin: 0
        }
      }
    ]
  }
}


export default HorizontalBar.extend({
  mixins: [reactiveProp],
  mounted() {
    this.renderChart(this.chartData, options)
  }
})