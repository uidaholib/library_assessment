import esri from 'esri-leaflet'

export default {
  spaceAssessmentFeatureLayer(token, map) {
    esri.featureLayer({
      url: '//services.arcgis.com/WLhB60Nqwp4NnHz3/arcgis/rest/services/library_space_assessment_areas/FeatureServer/0',
      //where: 'Floor = 1',
      token: token,
      where: 1
    }).addTo(map);
  },
  floorPlansBasemap(token, floorLevel, map) {
    esri.tiledMapLayer({
      url: '//tiles.arcgis.com/tiles/WLhB60Nqwp4NnHz3/arcgis/rest/services/library_' + floorLevel + '_floor_floor_plans_basemap_web_app/MapServer',
      maxZoom: 19,
      //        minZoom: 16,
      // do this because to address known bug in esri-leaflet.  Can probably remove in future version of API.
      token: token,
    }).addTo(map);
  }
}