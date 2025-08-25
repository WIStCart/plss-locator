<script lang="ts">
  // Styling
  import "@arcgis/core/assets/esri/themes/dark/main.css";
  import "@esri/calcite-components/dist/calcite/calcite.css";
  import "./lib/sco-components/sco-calcite-theme.css"

  // Calcite components
  import { setAssetPath } from "@esri/calcite-components";
  setAssetPath("https://js.arcgis.com/calcite-components/3.2.1/assets");  // CDN hosted assets

  // App components
  import AppShell from "./lib/AppShell.svelte";
  import Analytics from "./lib/sco-components/analytics/Analytics.svelte";
  import { config, analytics } from "./store.svelte";

  
  var calciteConfig = {
    // logLevel: "off"
  };
</script>

<Analytics measurementId={config.measurementId} analytics={analytics} />
<AppShell />