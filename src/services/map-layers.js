import esri from 'esri-leaflet'
import store from '../vuex/store'
import moment from 'moment'

let spaceAssessmentFL = esri.featureLayer({
  url: '//services.arcgis.com/WLhB60Nqwp4NnHz3/arcgis/rest/services/library_space_assess' +
      'ment_areas/FeatureServer/0',
  //where: 'Floor = 1',
  token: store.getters.getToken,
  where: 'Floor = ' + 1
})

spaceAssessmentFL.on('click', (e) => {
  console.log(spaceAssessmentFL);
  let dStart = moment
    .utc()
    .startOf('month')
    .format()
  let dEnd = moment
    .utc()
    .endOf('month')
    .format()
  // esri
  //   .Related
  //   .query(spaceAssessmentFL)
  //   .objectIds([e.layer.feature.id])
  //   .relationshipId('0')
  //   .definitionExpression("EditDate between '" + dStart + "' AND '" + dEnd + "'")
  //   .run(function (error, response, raw) {
  //     console.log('response: ', response);
  //   });
})

export default {
  spaceAssessmentFeatureLayer(token, floorLevel, map) {
    spaceAssessmentFL.addTo(map)
  },
  floorPlansBasemap(token, floorLevel, map) {
    esri
      .tiledMapLayer({
      url: '//tiles.arcgis.com/tiles/WLhB60Nqwp4NnHz3/arcgis/rest/services/library_' + floorLevel + '_floor_floor_plans_basemap_web_app/MapServer',
      maxZoom: 19,
      minZoom: 16,
      token: token
    })
      .addTo(map);
  }
}