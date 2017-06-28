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

function getResponse(featureLayer, where, expr, map) {
  let data
  let results = {
    crs: null,
    features: [],
    type: null
  }
  let spaceData = [];
  let promises = []
  let promise = new Promise(resolve => {
    featureLayer
      .query()
      .where(where)
      .run((error, response, raw) => {
        console.log('att: ', response);
        results.crs = response.crs
        results.type = response.type
        response
          .features
          .forEach(function (item) {
            results
              .features
              .push({
                geometry: item.geometry,
                id: item.id,
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
                  NUMBER_OF_USERS: 0,
                  SpaceID: item.properties.SpaceID
                }
              })
          })
        response
          .features
          .forEach(feature => {
            query(featureLayer)
              .objectIds([feature.id])
              .relationshipId('0')
              .definitionExpression(expr)
              .run((errorMsg, data, rawData) => {
                const numberOfUsers = data
                  .features
                  .map(item => item.properties.NUMBER_OF_USERS)
                  .reduce((x, y) => x + y)

                // response   .features   .filter(item => item.id === feature.id)[0]
                // .properties['NUMBER_OF_USERS'] = numberOfUsers response   .features
                // .forEach(item => {     if (item.id === feature.id) {
                // item.properties.NUMBER_OF_USERS = numberOfUsers;     }   })

                results
                  .features
                  .forEach(item => {
                    if (item.id === feature.id) {
                      item.properties.NUMBER_OF_USERS = numberOfUsers;
                      spaceData.push({id: item.id, NUMBER_OF_USERS: item.properties.NUMBER_OF_USERS})
                    }
                  })
                promises.push(new Promise(resolve => resolve(results)));
              })
          })
      })
    Promise
      .all(promises)
      .then((res) => {
        console.log('promises resolved', results);
        resolve(spaceData)
      })
    // resolve(spaceData)
  })

  promise.then(res => {
    console.log('spaceData: ', res[0]);
    res.forEach(item => console.log('item: ', [item.id, item.NUMBER_OF_USERS]))
  })

  // promises.push(promise) Promise.all(promises).then((res) => {   const response
  //  = res[0]   console.log('res: ', response);   console.log('crs: ',
  // response.crs);   console.log('final results: ', results);    const options =
  // {   valueProperty: 'NUMBER_OF_USERS', // which property in the features to
  // use   scale: [     'yellow', 'red'   ], // chroma.js scale - include as many
  // as you like   steps: 1000, // number of breaks or steps in range   mode: 'q',
  // // q for quantile, e for equidistant, k for k-means   style: {     // color:
  // '#fff', // border color     weight: 2,     fillOpacity: 0.8   } } //
  // console.log('options: ', options); // choropleth(response,
  // options).addTo(map) })
}

async function addHeatMap(map, featureLayer, dateRange, building, floor) {
  console.log('map: ', map);
  const where = "Floor = '" + floor.charAt() + "'"
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
                .reduce((x, y) => x + y)
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
  console.log('found: ', response);
  const users = await getUsers(response);
  console.log('users: ', users.sort((a, b) => a.users - b.users));
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
  console.log('collection: ', collection.features[0].properties.NUMBER_OF_USERS);
  const NUMBER_OF_USERS = collection
    .features
    .map(item => item.properties.NUMBER_OF_USERS);
  console.log('NUMBER OF USERS: ', NUMBER_OF_USERS);
  const std = math.std(NUMBER_OF_USERS);
  console.log('std: ', std);
  const options = {
    valueProperty: 'NUMBER_OF_USERS', // which property in the features to use
    scale: [
      'blue', 'red'
    ], // chroma.js scale - include as many as you like
    steps: std, // number of breaks or steps in range
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
  queryRelatedField,
  addHeatMap
}
