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

function queryRelatedField(event, period, featureLayer, buildingTitle) {
  const building = tableHelpers.buildingNameFormatter(event.layer.feature.properties.BldgName)
  const dStart = moment
    .utc()
    .subtract(1, 'months')
    .startOf('month')
    .format()
  const dEnd = moment
    .utc()
    .subtract(1, 'months')
    .endOf('month')
    .format()
  const expr = "EditDate between '" + period.start + "' AND '" + period.end + "'"
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
        return response
      } else {
        return null
      }
    })
}

export default {
  queryRelatedField
}
