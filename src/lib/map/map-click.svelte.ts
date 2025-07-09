import { get } from "svelte/store";

// ArcGIS Core

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

async function getPlssInfo(geometry:__esri.Point) {
  console.log('need to query')
  // Create query
  const query:__esri.QueryProperties = {
    geometry: geometry,
    outFields: ['d','t','r','s','q','qq']
  }

  // Run query
  const queryResult = await layers.featureLayers.quarterQuarterSections!.queryFeatures(query);

  // Check if more that one feature is returned
  if (queryResult.features.length > 1) console.log(queryResult.features.length, "features returned");
  
  // Get first feature
  const feature = queryResult.features[0];

  return [feature.attributes['d'],feature.attributes['t'],feature.attributes['r'],feature.attributes['s'],feature.attributes['q'],feature.attributes['qq']]
}


export async function mapClickHandler(event:__esri.ViewClickEvent) {

  // Store click coordinates
  results.latitude = event.mapPoint.latitude!;
  results.longitude = event.mapPoint.longitude!;

  // Initialize variables
  let d:number|undefined;
  let t:number|undefined;
  let r:number|undefined;
  let s:number|undefined;
  let q:number|undefined;
  let qq:number|undefined;

  // Clear results
  results.clear();

  // Get hit test results
  const hitTestResult = await get(view).hitTest(event);

  // First try to get PLSS info from hit test
  if (hitTestResult.results.length > 0) {

    // Get graphic hits
    const graphicHits = hitTestResult.results?.filter(hitResult => hitResult.type === "graphic" && hitResult.graphic.layer).map(graphicHit => graphicHit as __esri.GraphicHit);

    // If there are hits returned
    if (graphicHits?.length) {
    }

    // For each returned graphic
    graphicHits.forEach((graphicHit:__esri.GraphicHit) =>{
      const attributes = graphicHit.graphic.attributes;
      const featureLayer = graphicHit.layer as __esri.FeatureLayer;
      switch (featureLayer.customParameters?.layer) {
        case "twp":
          t = attributes['twp'];
          r = attributes['rng'];
          d = attributes['dir'];
          break;
        case "sec":
          s = attributes['sec'];
          break;
        case "qsec":
          q = attributes['q'];
          break;
        case "qqsec":
          qq = attributes['qq'];
          break;
      }
    });
  } 

  // Query feature layers if hit test result does not have the needed info (propbably zoomed too far out)
  if (!d||!t||!r||!s||!q||!qq) {
    [d,t,r,s,q,qq] = await getPlssInfo(event.mapPoint);
  }

  // Check if there is still and undefined value; there shouldn't be
  if (!d||!t||!r||!s||!q||!qq) { throw("Something when wrong. A PLSS value wasn't found.")}

  // Store results
  results.rangeDirection = dirChar.get(d);
  results.township = t.toString().padStart(2, '0');
  results.range = r.toString().padStart(2, '0');
  results.section = s.toString().padStart(2, '0');
  results.quarterSection = quadDir.get(q);
  results.quarterQuarterSection = quadDir.get(qq);


  // debug
  console.log(`T${results.township}N R${results.range}${results.rangeDirection} S${results.section} ${results.quarterSection} ${results.quarterQuarterSection}`)

  
}