<script lang="ts">
  // ArcGIS Components
  import "@arcgis/map-components/components/arcgis-layer-list";

  // Calcite Components
  import "@esri/calcite-components/components/calcite-panel";
  import "@esri/calcite-components/components/calcite-loader";
  import "@esri/calcite-components/components/calcite-list";
  import "@esri/calcite-components/components/calcite-list-item";
  import "@esri/calcite-components/components/calcite-action";


  let props = $props();
</script>

<calcite-panel heading="Layers" hidden={props.hidden}>
  <arcgis-layer-list reference-element="map"></arcgis-layer-list>
</calcite-panel>

<style>
</style>