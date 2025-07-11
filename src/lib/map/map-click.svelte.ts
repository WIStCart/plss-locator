import { get } from "svelte/store";

// ArcGIS Core
import Collection from "@arcgis/core/core/Collection";
import Graphic from "@arcgis/core/Graphic";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol.js";

// App Components
import { results, view, layers } from "../../store.svelte";


export class Results {
  public latitude:number|undefined = $state();
  public longitude:number|undefined = $state();
  public township:string|undefined = $state();
  public range:string|undefined = $state();
  public rangeDirection:string|undefined = $state();
  public section:string|undefined = $state();
  public quarterSection:string|undefined = $state();
  public quarterQuarterSection:string|undefined = $state();

  clear() {
    this.township = undefined;
    this.range = undefined;
    this.rangeDirection = undefined;
    this.section = undefined;
    this.quarterSection = undefined;
    this.quarterQuarterSection = undefined;
  }
}

const dirChar = new Map([
  [2, 'W'],
  [4, 'E']
]);

const quadDir = new Map([
  [1,'NE'],
  [2,'NW'],
  [3,'SW'],
  [4,'SE']
]);

const featureSymbology = new SimpleFillSymbol({
  color: [240, 140, 25, 0.15],
  outline: {
    color: "orange",
    width: 2
  }
});

async function queryLayer(queryGeometry:__esri.Point, featureLayer:__esri.FeatureLayer, fields:string[]) {
  
  // Create query
  const query:__esri.QueryProperties = {
    geometry: queryGeometry,
    outFields: fields,
    returnGeometry: true
  }

  // Run query
  const queryResult = await featureLayer.queryFeatures(query);

  // Check if more that one feature is returned
  if (queryResult.features.length > 1) throw(queryResult.features.length, "features returned!");
  
  // Get first feature
  const feature = queryResult.features[0];

  return feature
}


export async function mapClickHandler(event:__esri.ViewClickEvent) {

  // Store click coordinates
  results.latitude = event.mapPoint.latitude!;
  results.longitude = event.mapPoint.longitude!;

  // Clear graphics
  get(view).graphics.removeAll();

  // Clear results
  results.clear();

  // For each feature layer
  Object.values(layers.featureLayers).forEach(async (featureLayer) => {
    let feature!:__esri.Graphic;

    // Query the layer
    switch (featureLayer.customParameters?.layer) {
      case "qqsec":
        // Get feature
        feature = await queryLayer(event.mapPoint, featureLayer, ['d','t','r','s','q','qq']);

        // Store PLSS info
        results.rangeDirection = dirChar.get(feature.attributes['d']);
        results.township = feature.attributes['t'].toString();
        results.range = feature.attributes['r'].toString();
        results.section = feature.attributes['s'].toString();
        results.quarterSection = quadDir.get(feature.attributes['q']);
        results.quarterQuarterSection = quadDir.get(feature.attributes['qq']);

        break;

      default:
        feature = await queryLayer(event.mapPoint, featureLayer, []);
    }

    // Add feature to graphics
    feature.symbol = featureSymbology;
    get(view).graphics.add(feature);
  });

}