<script lang="ts">
  import "@arcgis/map-components/components/arcgis-map";
  import "@arcgis/map-components/components/arcgis-zoom";
  import "@arcgis/map-components/components/arcgis-home";
  import "@arcgis/map-components/components/arcgis-locate";
  import "@arcgis/map-components/components/arcgis-basemap-toggle";
  import "@arcgis/map-components/components/arcgis-search";
  import "@arcgis/map-components/components/arcgis-scale-bar";
  import "@arcgis/map-components/components/arcgis-features";

  import "@esri/calcite-components/components/calcite-navigation";
  import "@esri/calcite-components/dist/components/calcite-action";
  import "@esri/calcite-components/components/calcite-shell";
  import "@esri/calcite-components/dist/components/calcite-dialog";
  import "@esri/calcite-components/dist/components/calcite-button";
  
  let aboutDialog: HTMLCalciteDialogElement;

  function openDialog() {
    aboutDialog.open = true;
  }

  function closeDialog() {
    aboutDialog.open = false;
  }

  let mapEl: HTMLElement & { view: __esri.MapView };

  // Handle map click and perform hit test
  async function handleMapClick(event: CustomEvent) {
    if (!mapEl?.view || !mapEl.view.ready || !mapEl.view.map) {
      console.warn("Map view not initialized or not ready", {
        view: mapEl?.view,
        ready: mapEl?.view?.ready,
        map: mapEl?.view?.map,
      });
      return;
    }

    const view = mapEl.view;
    const { mapPoint, screenPoint } = event.detail;

    if (!mapPoint || !screenPoint) {
      console.warn("Missing mapPoint or screenPoint", { mapPoint, screenPoint });
      return;
    }

    try {

      // Perform hit test, limited to feature layers
      const layers = view.map.layers?.toArray() || [];
      const featureLayers = layers.filter((layer) => layer.type === "feature");
      console.log("Feature Layers:", featureLayers.map((layer) => layer.title));

      const hitTestResult = await view.hitTest(screenPoint, {
        include: featureLayers.length ? featureLayers : undefined,
      });

      // Debug: Log hit test results
      console.log("Hit Test Results:", JSON.stringify(hitTestResult.results.map((r) => ({
        layerTitle: r.layer?.title,
        attributes: r.graphic?.attributes,
      })), null, 2));

      hitTestResult.results
        .filter((result) => result.graphic && result.layer && result.layer.type === "feature")
        .forEach((result) => {
          const graphic = result.graphic as __esri.Graphic;
          const layer = result.layer as __esri.FeatureLayer;
          const layerTitle = layer?.title || "Unknown Layer";

          // Debug: Log layer and attributes
          console.log(`Layer: ${layerTitle}`, JSON.stringify(layer, null, 2));
          
        });
      
      
    } catch (error) {
      console.error("Error during hit test:", error);
    }
  }
</script>

<main>
  <!--About Popup-->
  <calcite-dialog
    bind:this={aboutDialog}
    heading="About"
    width="m"
    modal
    closable
    on:calciteDialogClose={closeDialog}
  >
    <p>
      The <strong>PLSS Locator</strong> is a free tool to help users identify
      within which Public Land Survey System (PLSS) subdivisions a location
      resides. The PLSS data source for this tool is the
      <a
        href="https://data-wi-dnr.opendata.arcgis.com/datasets/4c81d81ceb444aec8b4ac5b74768d4c5"
        target="_blank">WiDNR’s 24k Landnet</a
      >.
    </p>
    <p>
      The <strong>Wisconsin State Cartographer’s Office (SCO)</strong> is a unit
      within the Department of Geography at the University of Wisconsin–Madison.
      With an outreach mission, the SCO gathers, maintains, and disseminates information
      about mapping and geospatial data in the state.
    </p>
    <p>
      For more information, <a
        href="https://www.sco.wisc.edu/sco/contact/"
        target="_blank">contact us</a
      >
      or visit our website at
      <a href="https://www.sco.wisc.edu/" target="_blank">sco.wisc.edu</a>.
    </p>
  </calcite-dialog>

  <calcite-shell>
    <!--Header-->
    <calcite-navigation slot="header" class="calcite-mode-dark">
      <div id="logo" slot="logo">
        <a href="https://www.sco.wisc.edu/" target="_blank">
          <img
            src="https://maps.sco.wisc.edu/sco-header/assets/img/logoTransparent2016.png"
            alt="SCO Logo"
          />
        </a>
      </div>
      <div id="title" class="heading" slot="logo">PLSS Locator</div>
      <calcite-action
        slot="content-end"
        text="About"
        text-enabled
        scale="l"
        on:click={openDialog}
      >
        About
      </calcite-action>
    </calcite-navigation>
    <!--Map-->
    <arcgis-map item-id="2b520d5b0ef14d12a7eec1dfd72ce61d" bind:this={mapEl} on:arcgisViewClick={handleMapClick}>
      <arcgis-zoom position="top-left"></arcgis-zoom>
      <arcgis-home position="top-left"></arcgis-home>
      <arcgis-locate position="top-left" scale="5000"></arcgis-locate>
      <arcgis-search position="top-right"></arcgis-search>
      <arcgis-basemap-toggle position="bottom-right"></arcgis-basemap-toggle>
      <arcgis-scale-bar position="bottom-left" bar-style="line" unit="imperial"></arcgis-scale-bar>
      <arcgis-features></arcgis-features>
    </arcgis-map>
  </calcite-shell>
</main>

<style>
</style>
