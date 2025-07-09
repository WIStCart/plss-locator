import { writable } from "svelte/store";

import Collection from "@arcgis/core/core/Collection.js";

import appConfig from "./app-config.json"
import { type Config, GA, SearchState } from "./lib/sco-components";
import { AppState } from "./lib/sco-components";
import { Results } from "./lib/map/map-click.svelte";

// Config
export const config = $state(appConfig as Config);

// View
export const view = writable<__esri.MapView>();

// Layers
class FeatureLayers {
  townships:__esri.FeatureLayer|undefined;
  sections:__esri.FeatureLayer|undefined;
  quarterSections:__esri.FeatureLayer|undefined;
  quarterQuarterSections:__esri.FeatureLayer|undefined;
}
class FeatureLayerViews {
  townships:__esri.FeatureLayerView|undefined;
  sections:__esri.FeatureLayerView|undefined;
  quarterSections:__esri.FeatureLayerView|undefined;
  quarterQuarterSections:__esri.FeatureLayerView|undefined;
}
export class Layers {
  featureLayers = $state(new FeatureLayers());
  featureLayerViews = $state(new FeatureLayerViews());
};
export let layers = $state(new Layers());

// Results
export const results = $state(new Results());

// App State
export const appState = new AppState();
$effect.root(()=>{
  $effect(()=>{
    appState.updateUrl();
  })
})

// Analytics
export const analytics = new GA(
  config.gaMeasurementId,
  'SCO App Template'
);

// Action Bar State
class ActionBarState {
  public shellWidth:number = $state(0);
  public closed:boolean = $state(false);
  public mobile:boolean = $derived(this.shellWidth>config.interface.shellBreakpoint ? false:true);
  public get closable() {  // Alias for mobile
    return this.mobile;
  }
  public activeAction:String|undefined = $state('results');
  public lastActiveAction:String|undefined = $state('results');
  
  // Action active getters
  get search() {
    return this.activeAction == 'search';
  }
  get results() {
    return this.activeAction == 'results';
  }
  get info() {
    return this.activeAction == 'info';
  }
}
export const actionBarState = $state(new ActionBarState())
$effect.root(()=>{
  $effect(()=>{
    // console.log(actionBarState.activeAction)
    if (!actionBarState.closable && !actionBarState.activeAction) {
      actionBarState.activeAction = actionBarState.lastActiveAction;
    }
    if (!actionBarState.closable && actionBarState.closed) {
      actionBarState.closed = false;
    }
  })
})

// Search State
export const searchState = $state(new SearchState());
