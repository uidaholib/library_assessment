import esri from 'esri-leaflet'
import store from '../vuex/store'
import moment from 'moment'

let spaceAssessmentFL = esri.featureLayer({
  url: '//services.arcgis.com/WLhB60Nqwp4NnHz3/arcgis/rest/services/library_space_assess' +
      'ment_areas/FeatureServer/0',
  //where: 'Floor = 1',
  token: store.getters.getToken,
  where: 'Floor = ' + store.getters.getFloor
})

spaceAssessmentFL.on('click', (e) => {
  console.log(spaceAssessmentFL);
  console.log('event: ', e);
  let dStart = moment
    .utc()
    .startOf('month')
    .format()
  let dEnd = moment
    .utc()
    .endOf('month')
    .format()
    const features = spaceAssessmentFL.getFeature(e.layer.feature.id)
  console.log('features: ', features);
})

export default {
  spaceAssessmentFeatureLayer(token, floorLevel, map) {
    spaceAssessmentFL.where = 'Floor = ' + floorLevel
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