import L from 'leaflet'
import esri from 'esri-leaflet'
import router from '../router'
import store from '../vuex/store'
import moment from 'moment'
import query from '../libs/EsriLeafletRelated.js'
import tableHelpers from '../libs/table-helpers.js'
import chartHelpers from '../libs/chart-helpers.js'

const headers = [
  {
    text: 'Collection Date',
    left: true,
    sortable: true,
    value: 'date'
  }, {
    text: 'Type of Use',
    value: 'use'
  }, {
    text: 'Number of Users',
    value: 'numberOfUsers'
  }
]
const filter = {
  name: 'Individual Studying',
  field: 'use',
  value: 'numberOfUsers'
}
const label = 'Number of Users'
const backgroundColor = '#f87979'
const options = {
  responsive: true,
  maintainAspectRatio: false
}

function queryRelatedField(map, selectedLayer, event, period, featureLayer, buildingTitle) {
  const styles = {
    weight: 4,
    color: 'red',
    dashArray: '',
    fillOpacity: 0.3
  }
  if (selectedLayer) {
    const selectedStyle = {
      color: '#3388ff',
      strokeOpacity: 0.5,
      strokeWidth: 0.2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      fill: '#3388ff',
      fillOpacity: 0.2,
      fillRule: 'evenodd'
    }
    selectedLayer.setStyle(selectedStyle)
  }
  event
    .layer
    .setStyle(styles)
  if (period === null) {
    return new Promise((resolve, reject) => {
      resolve(false)
    })
  } else if ((period[0] === null) && (period[1] === null)) {
    return new Promise((resolve, reject) => {
      resolve(false)
    })
  }

  const building = tableHelpers.buildingNameFormatter(event.layer.feature.properties.BldgName)
  const expr = "EditDate between '" + moment(period[0])
    .utc()
    .format() + "' AND '" + moment(period[1])
    .utc()
    .format() + "'"

  return new Promise((resolve, reject) => {
    query(featureLayer)
      .objectIds([event.layer.feature.id])
      .relationshipId('0')
      .definitionExpression(expr)
      .run((error, response, raw) => {
        if (response.features.length !== 0) {
          const items = tableHelpers.getItemsFromQuery(response)
          const space = tableHelpers.getRoomLocationFromQuery(response)
          const tableTitle = {
            title: buildingTitle,
            subtitle: space + ' Space Usage'
          }
          const aggregated = chartHelpers.aggregateFields(items, filter)
          let filters = []
          tableHelpers
            .BUILDING_USES
            .forEach(b => {
              filters.push({name: b.use, field: 'use', value: 'numberOfUsers'})
            })
          const dataCollection = chartHelpers.toChartData(items, filters, label, backgroundColor)
          store.commit('setChartData', {dataCollection, options})
          store.commit('setDataTable', {tableTitle, headers, items})
          resolve(true)
        } else {
          store.commit('setChartData', {
            dataCollection: null,
            options
          })
          store.commit('setDataTable', {
            tableTitle: 'No data available for this selection',
            headers,
            items: null
          })
          resolve(false)
        }
      })
  })
}

export default {
  queryRelatedField
}
