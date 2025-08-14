<script lang="ts">

  // Svelte
  import { onMount } from 'svelte';

  // Map Components
  import "@arcgis/map-components/components/arcgis-map";
  import "@arcgis/map-components/components/arcgis-zoom";
  import "@arcgis/map-components/components/arcgis-locate";
  import "@arcgis/map-components/components/arcgis-expand";
  import "@arcgis/map-components/components/arcgis-placement";
  import "@arcgis/map-components/components/arcgis-basemap-gallery";
  import "@arcgis/map-components/components/arcgis-home";
  import "@arcgis/map-components/components/arcgis-features";
  import type { ArcgisMapCustomEvent } from "@arcgis/map-components";
  import type { ArcgisMap } from '@arcgis/map-components/components/arcgis-map'; 
  import type { ArcgisHome } from '@arcgis/map-components/components/arcgis-home';
  import type { ArcgisLocate } from '@arcgis/map-components/components/arcgis-locate';
  import "@arcgis/map-components/components/arcgis-layer-list";

  // ArcGIS JS Components
  import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

  // Calcite
  import { Button } from '@esri/calcite-components/components/calcite-button';

  // App Components
  import { config, view, actionBarState, appState, layers, analytics, results } from "../../store.svelte";
  import { navigationBoundary, homeViewpoint, setHome, BasemapGallery } from "../sco-components";
  import { mapClickHandler } from './map-click.svelte.ts';


  let home:ArcgisHome;
  let locate:ArcgisLocate;
  let basemapGalleryElement:HTMLArcgisBasemapGalleryElement;
  let basemapGallery:BasemapGallery;
  let mapLoading:boolean = $state(false);
  let expandButton:Button;


  function setupMap(event: ArcgisMapCustomEvent<ArcgisMap>) {
    
    // Store the view
    $view = event.target.view;

    // Add expand button
    $view.ui.add(expandButton, "bottom-left");

    // Disable popups
    $view.popupEnabled = false;

    // Set navigation boundaries
    const extent = navigationBoundary($view, { maxScale:500 });

    // Set home
    setHome(extent, $view);
    home.viewpoint = homeViewpoint;

    // Set viewpoint if not already set
    if (!appState.viewpoint) appState.viewpoint = homeViewpoint;
    
    // Set initial view
    $view.goTo({
      target: appState.viewpoint,
    },{animate: false})

    // Record when home button clicked
    reactiveUtils.watch(
      () => home.state==='going-home',
      () => {
        analytics.send('Home Button Clicked', 'User clicked the home button.', 'Map');
      }
    );

    // Record when locate button clicked
    reactiveUtils.watch(
      () => locate.state==='locating',
      () => {
        analytics.send('Locate Button Clicked', 'User clicked the locate button.', 'Map');
      }
    );
    
    // Basemap Gallery
    basemapGallery.loadFromAppState();
    basemapGallery.basemapChangeListener();

    // Map click event
    $view.on("click", async (event:__esri.ViewClickEvent) => {
      // Send event to click handler
      mapClickHandler(event);
    });

    $view.when().then(()=>{

      // Set query point if in appState
      if (appState.query.latitude && appState.query.longitude) {
        
        // Simiulate map click
        const event = {
          mapPoint: appState.query
        } as __esri.ViewClickEvent;
        mapClickHandler(event);

      }

      // Viewpoint watch handler to update URL path
      appState.viewpointWatchHandler($view);

    });
    
    // Ensure map is not null
    if ($view.map==null) { 
      throw("map is null");
    }

    // Layers
    $view.map.allLayers.forEach((layer) => {
      const featureLayer = layer as __esri.FeatureLayer;
      switch (featureLayer.customParameters?.layer) {
        case "twp":
          featureLayer.outFields = ['dir','twp','rng'];
          layers.featureLayers.townships = featureLayer;
          layers.featureLayerViews.townships = $view.whenLayerView(featureLayer);
          break;
        case "sec":
          featureLayer.outFields = ['sec'];
          layers.featureLayers.sections = featureLayer;
          layers.featureLayerViews.sections = $view.whenLayerView(featureLayer);
          break;
        case "qsec":
          featureLayer.outFields = ['q'];
          layers.featureLayers.quarterSections = featureLayer;
          layers.featureLayerViews.quarterSections = $view.whenLayerView(featureLayer);
          break;
        case "qqsec":
          featureLayer.outFields = ['qq'];
          layers.featureLayers.quarterQuarterSections = featureLayer;
          layers.featureLayerViews.quarterQuarterSections = $view.whenLayerView(featureLayer);
          break;
      }
    });
    
    // Add results layer to map
    $view.map.add(results.layer);

    mapLoading = false;
  }

  onMount(() => {
    mapLoading = true;
  });
  
</script>


<arcgis-map id="map" item-id={config.mapPortalId} onarcgisViewReadyChange={setupMap}>  
  {#if mapLoading}
    <calcite-loader active="true" label="Loading map..." style="height: 100%; padding: 0;"></calcite-loader>
  {/if}

  <!-- Zoom Buttons -->
  <arcgis-zoom position="top-right"></arcgis-zoom>

  <!-- Home Button -->
  <arcgis-home position="top-left" bind:this={home}></arcgis-home>
  
  <!-- Basemap Gallery -->
  <arcgis-expand 
    auto-collapse 
    close-on-esc 
    position="top-left" 
    mode="floating" 
    expand-icon="basemap" 
    expand-tooltip="Open basemap gallery"
    collapse-tooltip="Close basemap gallery"
  >
    <arcgis-basemap-gallery 
      bind:this={basemapGalleryElement} 
      position="top-left" 
      mode="floating"
      onarcgisReady={()=>{basemapGallery = new BasemapGallery(basemapGalleryElement)}}
    ></arcgis-basemap-gallery>
  </arcgis-expand>

  <!-- Locate Button -->
  <arcgis-locate position="top-left" bind:this={locate} scale="5000"></arcgis-locate>

  <!-- Expand Toggle -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <calcite-button 
    bind:this={expandButton}
    class="view-ui-button"
    onclick={() => {
      actionBarState.closed=!actionBarState.closed;
      if (!actionBarState.closed && !actionBarState.activeAction) {
        actionBarState.activeAction = actionBarState.lastActiveAction;
      }
    }}
    kind="neutral"
    iconEnd={actionBarState.closed?"contract":"expand"}
    hidden={!actionBarState.closable}
  ></calcite-button>

</arcgis-map>

<style>
</style>
