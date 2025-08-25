<script lang="ts">
  // Calcite Components
  import "@esri/calcite-components/components/calcite-shell";

  // Map Components
  import "@arcgis/map-components/components/arcgis-map";

  // App Components
  import { config, actionBarState } from "../store.svelte";
  import Navigation from "./Navigation.svelte";
  import Map from "./map/Map.svelte"
  import ActionBar from "./action-bar/ActionBar.svelte";
  import ActionBarContent from "./action-bar/ActionBarContent.svelte";
</script>

<calcite-shell bind:clientWidth={actionBarState.shellWidth}>
  <Map />
  {#if actionBarState.mobile}

    <!-- Mobile View -->
    <Navigation slot="header" class="calcite-mode-dark" />
    
    <ActionBar slot="panel-bottom" layout="horizontal" position="end" class="calcite-mode-dark" collapsed={actionBarState.closed}>
      <ActionBarContent />
    </ActionBar>

  {:else}

    <!-- Desktop View -->
    <calcite-shell-panel slot="panel-start" width-scale="l" resizable class="calcite-mode-dark" bind:clientWidth={config.interface.panelWidth}>
      <calcite-panel>
        <calcite-shell>
          <Navigation slot="header" />
          <ActionBar slot="panel-start" collapsed />
          <ActionBarContent />
        </calcite-shell>
      </calcite-panel>
    </calcite-shell-panel>
    
  {/if}
</calcite-shell>

<style>
  :root {
    --calcite-shell-panel-width: 40em;
    --calcite-shell-panel-max-width: 55vw;
    --calcite-shell-panel-max-height: 45vh;
  }
</style>