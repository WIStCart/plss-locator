<script lang="ts">
  import "@esri/calcite-components/components/calcite-navigation";

  import { config, analytics } from "../store.svelte"

  function appTitle(width:number) {
    if (width>config.interface.titleBreakpoint) return config.appName.full;
    else return config.appName.short
  }

  const recordHomeClick = ()=>{
    analytics.send('Logo Clicked','App state was reset because logo was clicked.','Navigation')
  }
</script>

<calcite-navigation {...$$restProps}>
  <a id="logo" slot="logo" href="./" onclick={recordHomeClick}><img alt="UW-Madison Crest Logo" src="sco-logo.png" /></a>
  <div id="title" class="heading" slot="logo">{appTitle(config.interface.panelWidth)}</div>
</calcite-navigation>

<style>
  #logo {
    display: flex;
    align-items: center;
  }
  #logo img {
    margin: 0.5em 1em 0.5em 1em;
    block-size: 3rem;
  }

  #title {
    font-size: var(--calcite-font-size-1);
    font-weight: var(--calcite-font-weight-medium);
    color: var(--calcite-color-text-1);
    font-family: 'Red Hat Display';
    line-height: 1.3rem;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    padding-inline: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>