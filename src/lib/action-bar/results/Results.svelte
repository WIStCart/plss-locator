<script lang="ts">
  // ArcGIS Components

  // Calcite Components
  import "@esri/calcite-components/components/calcite-panel";
  import "@esri/calcite-components/components/calcite-loader";
  import "@esri/calcite-components/components/calcite-notice";
  import "@esri/calcite-components/components/calcite-list";
  import "@esri/calcite-components/components/calcite-list-item";
  import "@esri/calcite-components/components/calcite-action";

  // App Components
  import { results } from "../../../store.svelte";

  const verbose = new Map([
    ['W','west'],
    ['E','east'],
    ['NW','northwest'],
    ['NE','northeast'],
    ['SW','southwest'],
    ['SE','southeast']
  ])


  let props = $props();
</script>

<calcite-panel heading="Results" hidden={props.hidden}>
  <!-- Lat/Long -->
  <calcite-block heading="Lat/Long" open={results.latitude&&results.longitude}>
    <calcite-notice open>
      <div slot="message">{results.latitude?.toFixed(4)}, {results.longitude?.toFixed(4)}</div>
    </calcite-notice>
    
  </calcite-block>
  <!-- PLSS -->
  <calcite-block heading="PLSS Info" open={results.latitude&&results.longitude}>
    {#if results.rangeDirection && results.township && results.section && results.quarterSection && results.quarterQuarterSection}
      <calcite-notice open>
        <div slot="message">
          Township: {results.township}N<br>
          Range: {results.range}{results.rangeDirection}<br>
          Section: {results.section}<br>
          Quarter Section: {results.quarterSection}<br>
          Quarter Quarter Section: {results.quarterQuarterSection}<br>
        </div>
      </calcite-notice>
      <calcite-notice open>
        <div slot="message">
          The {verbose.get(results.quarterQuarterSection)} quarter of the {verbose.get(results.quarterSection)} quarter of Section {results.section}, Township {results.township} north, Range {results.range} {verbose.get(results.rangeDirection)}, fourth Principal Meridian.
        </div>
      </calcite-notice>
    {:else}
      <calcite-loader inline scale="m"></calcite-loader>
    {/if}
  </calcite-block>
</calcite-panel>

<style>
  /* calcite-loader {
    margin-left: auto;
    margin-right: auto;
  } */
</style>