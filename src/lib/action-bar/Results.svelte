<script lang="ts">
  // ArcGIS Components

  // Calcite Components
  import "@esri/calcite-components/components/calcite-panel";
  import "@esri/calcite-components/components/calcite-loader";
  import "@esri/calcite-components/components/calcite-list";
  import "@esri/calcite-components/components/calcite-list-item";
  import "@esri/calcite-components/components/calcite-action";

  // App Components
  import { results } from "../../store.svelte";


  let props = $props();
</script>

<calcite-panel heading="Results" hidden={props.hidden}>
  <!-- Lat/Long -->
  <calcite-block heading="Lat/Long" open={results.latitude&&results.longitude}>
    {results.latitude?.toFixed(4)}, {results.longitude?.toFixed(4)}
  </calcite-block>
</calcite-panel>

<style>
</style>