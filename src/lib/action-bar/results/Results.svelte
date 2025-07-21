<script lang="ts">
  // ArcGIS Components

  // Calcite Components
  import "@esri/calcite-components/components/calcite-panel";
  import "@esri/calcite-components/components/calcite-loader";
  import "@esri/calcite-components/components/calcite-notice";
  import "@esri/calcite-components/components/calcite-list";
  import "@esri/calcite-components/components/calcite-list-item";
  import "@esri/calcite-components/components/calcite-action";
  import "@esri/calcite-components/components/calcite-tooltip";
  import "@esri/calcite-components/components/calcite-link";

  // App Components
  import { results } from "../../../store.svelte";
  import NoResultsMessage from "./NoResultsMessage.svelte";
    import { NavigationUser } from "@esri/calcite-components/components/calcite-navigation-user";

  const verbose = new Map([
    ['W','west'],
    ['E','east'],
    ['NW','northwest'],
    ['NE','northeast'],
    ['SW','southwest'],
    ['SE','southeast']
  ])

  let clearSelectionDisabled = false;

  let props = $props();
</script>

<calcite-panel heading="Results" hidden={props.hidden}>

  <!-- Clear Selection Button -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <calcite-action icon="clear-selection" text="clear selection" slot="header-actions-end" onclick={()=>{results.clearAll()}} disabled={clearSelectionDisabled || null}>
    <calcite-tooltip slot="tooltip" placement="bottom"><span>Clear Selection</span></calcite-tooltip>
  </calcite-action>

  {#if results.latitude==undefined}
    <NoResultsMessage />
  {:else}
    <!-- Lat/Long -->
    <calcite-block heading="Lat/Long" expanded>
      <calcite-notice open>
        <div slot="message">{results.latitude?.toFixed(4)}, {results.longitude?.toFixed(4)}</div>
      </calcite-notice>
      
    </calcite-block>
    <!-- PLSS -->
    <calcite-block heading="PLSS Info" expanded>

      <!-- Main -->
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

      <!-- Nearby -->
      {#if results.nearby.length>1}
        <br>
        <i>
          <calcite-notice kind="info" icon="exclamation-mark-circle" scale="s" open>
            <div slot="message">
              The clicked point may be in:<br>
              {#each results.nearby.slice(1) as feature}
                {feature}<br>
              {/each}
            </div>
            <calcite-link slot="link" title="More Info">
                More info
            </calcite-link>
          </calcite-notice>
        </i>
      {:else if results.nearby.length>0}
        <!-- If the query is complete but there are no nearby features -->
      {:else}
        <br>
        <calcite-loader inline scale="m"></calcite-loader>
      {/if}
    </calcite-block>
  {/if}
</calcite-panel>

<style>
  /* calcite-loader {
    margin-left: auto;
    margin-right: auto;
  } */
</style>