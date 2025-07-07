import { writable } from "svelte/store";

import appConfig from "./app-config.json"
import { type Config, GA, SearchState } from "./lib/sco-components";
import { AppState } from "./lib/sco-components";


// Config
export const config = $state(appConfig as Config);

// View
export const view = writable<__esri.MapView>();

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
  public activeAction:String|undefined = $state('layers');
  public lastActiveAction:String|undefined = $state('layers');
  
  // Action active getters
  get search() {
    return this.activeAction == 'search';
  }
  get layers() {
    return this.activeAction == 'layers';
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
