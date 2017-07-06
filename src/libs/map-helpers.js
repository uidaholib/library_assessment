import L from 'leaflet'
import esri from 'esri-leaflet'
import router from '../router'
import store from '../vuex/store'
import moment from 'moment'
import query from '../libs/EsriLeafletRelated.js'
import tableHelpers from '../libs/table-helpers.js'
import chartHelpers from '../libs/chart-helpers.js'
import 'heatmap.js'
import * as choropleth from 'leaflet-choropleth'
import math from 'mathjs'

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

let overlay = null;

let div = null;

function removeOverlay(map) {
  if (overlay) {
    map.removeLayer(overlay);
  }
}

async function addOverlay(map, featureLayer, selectedLayer, dateRange, building, buildingTitle, floor, dialog) {
  let where
  if (floor.charAt() === '3' && building === 'College of Education') {
    where = "SpaceID LIKE '3%1'"
  } else if (floor.charAt() === '3' && building === 'Library') {
    where = "SpaceID LIKE '3A'"
  } else {
    where = "Floor = '" + floor.charAt() + "'"
  }
  // const where = "Floor = '" + floor.charAt() + "'"
  const expr = "EditDate between '" + moment(dateRange[0])
    .utc()
    .format() + "' AND '" + moment(dateRange[1])
    .utc()
    .format() + "'"
  const getLayers = () => new Promise(resolve => {
    featureLayer
      .query()
      .where(where)
      .run((error, response, raw) => {
        resolve(response)
      })
  })
  const getUsers = (response) => {
    let results = []
    const promises = response
      .features
      .map(feature => {
        return new Promise(resolve => {
          query(featureLayer)
            .objectIds([feature.id])
            .relationshipId('0')
            .definitionExpression(expr)
            .run((errorMsg, data, rawData) => {
              const numberOfUsers = data
                .features
                .map(item => item.properties.NUMBER_OF_USERS)
                .reduce((x, y) => x + y, 0)
              results.push({id: feature.id, users: numberOfUsers})
              resolve({id: feature.id, users: numberOfUsers})
            })
        })
      })
    const resolved = promises.reduce((chain, promise) => {
      return chain.then(() => {
        return promise
      })
    }, Promise.resolve())
    return Promise
      .all([resolved])
      .then(() => {
        return Promise.resolve(results)
      })
  }
  const response = await getLayers()
  const users = await getUsers(response);
  let collection = {
    crs: response.crs,
    type: response.type,
    features: []
  }
  response
    .features
    .forEach(item => {
      collection
        .features
        .push({
          id: item.id,
          geometry: item.geometry,
          type: item.type,
          properties: {
            BldgName: item.properties.BldgName,
            CreationDate: item.properties.CreationDate,
            Creator: item.properties.Creator,
            EditDate: item.properties.EditDate,
            Editor: item.properties.Editor,
            Floor: item.properties.Floor,
            OBJECTID: item.properties.OBJECTID,
            GlobalID: item.properties.GlobalID,
            GlobalID_2: item.properties.GlobalID_2,
            NUMBER_OF_USERS: users
              .find(x => x.id === item.id)
              .users,
            SpaceID: item.properties.SpaceID
          }
        })
    })
  const NUMBER_OF_USERS = collection
    .features
    .map(item => item.properties.NUMBER_OF_USERS);
  const std = math.std(NUMBER_OF_USERS);
  const options = {
    valueProperty: 'NUMBER_OF_USERS', // which property in the features to use
    scale: [
      'blue', 'red'
    ], // chroma.js scale - include as many as you like
    steps: await users.length, // number of breaks or steps in range
    mode: 'q', // q for quantile, e for equidistant, k for k-means
    style: { //
      color: '#fff', // border color
      weight: 2,
      fillOpacity: 0.8
    }
  }
  if (overlay) {
    map.removeLayer(overlay)
  }
  overlay = choropleth(collection, options)
  overlay.addTo(map)
  overlay.on('click', e => {
    // map, selectedLayer, event, period, featureLayer, buildingTitle
    queryRelatedField(map, selectedLayer, e, dateRange, featureLayer, building).then(response => {
      dialog.dataAvailable = response
      dialog.model = true
      selectedLayer = e.layer
    })
  })
  // Add legend (don't forget to add the CSS from index.html)
  var legend = L.control({position: 'bottomright'})
  legend.onAdd = function (map) {
    if (div) {
      L
        .DomUtil
        .remove(div)
    }
    div = L
      .DomUtil
      .create('div', 'info legend')
    let limits = overlay.options.limits
    let colors = overlay.options.colors
    let labels = []

    if (limits.every(item => item === limits[0] || isNaN(item))) {
      labels.push('<li class="pa-0 ma-0 white--text" style="background-color: ' + colors[0] + '">' + Math.ceil(limits[0]) + '</li>')
    } else {
      limits
        .forEach(function (limit, index) {
          labels.push('<li class="pa-0 ma-0 white--text" style="background-color: ' + colors[index] + '">' + Math.ceil(limit) + '</li>')
        })
    }

    div.innerHTML += '<div class="card pt-2 grey darken-1"><span class="pa-2 white--text">Number of Us' +
        'ers:</span><ul class="list pa-0 ma-0">' + labels.join('') + '</ul></div>'
    return div
  }
  legend.addTo(map)
}

function queryRelatedField(map, selectedLayer, event, period, featureLayer, buildingTitle) {
  const styles = {
    weight: 4,
    // color: 'red',
    dashArray: '',
    // fillOpacity: 0.3
  }
  if (selectedLayer) {
    const selectedStyle = {
      weight: 0,
      // color: 'red',
      dashArray: ''
      // color: '#3388ff', strokeOpacity: 0.5, strokeWidth: 0.2, strokeLinecap:
      // 'round', strokeLinejoin: 'round', fill: '#3388ff', fillOpacity: 0.2,
      // fillRule: 'evenodd'
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
  queryRelatedField,
  addOverlay,
  removeOverlay,
  overlay
}
