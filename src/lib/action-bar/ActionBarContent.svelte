<script lang="ts">
  // Calcite Components
  import "@esri/calcite-components/components/calcite-panel";

  // App Components
  import { view, searchState, actionBarState, analytics } from "../../store.svelte";
  import Search from "../sco-components/search/Search.svelte"
  import Results from "./Results.svelte";
  import Info from "./info/Info.svelte";
</script>

{#if !actionBarState?.closed}
  <calcite-panel>
    <!-- Results -->
    <Results hidden={actionBarState?.activeAction!=='results'} />
    {#if actionBarState?.activeAction=='results'}
      <style>
        :root {
          --calcite-shell-panel-width: 10em;
        }
      </style>
    {/if}

    <!-- Search -->
    {#if actionBarState?.activeAction=='search'}
      <Search view={view} searchState={searchState} analytics={analytics} />
      <style>
        :root {
          --calcite-shell-panel-width: 40em;
        }
      </style>
    {/if}

    <!-- Info -->
    {#if actionBarState?.activeAction=='info'}
      <Info />
    {/if}
    
  </calcite-panel>
{/if}

<style>
  calcite-panel {
    padding-right: 10px;
  }
</style>
