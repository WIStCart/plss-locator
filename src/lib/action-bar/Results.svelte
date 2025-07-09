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
  {#if results.rangeDirection && results.township && results.section && results.quarterSection && results.quarterQuarterSection}
    {`T${results.township}N R${results.range}${results.rangeDirection} S${results.section} ${results.quarterSection} ${results.quarterQuarterSection}`}
  {/if}
</calcite-panel>

<style>
</style>