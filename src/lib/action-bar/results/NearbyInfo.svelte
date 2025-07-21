<script lang="ts">
   import "@esri/calcite-components/components/calcite-dialog";
</script>

<calcite-dialog id="nearby-info" modal heading="Why might my selected point be in a different PLSS polygon?">
  <p>The location you clicked is close to a PLSS boundary and due to accuracy limitations of the PLSS dataset used in this application (<calcite-link href="https://data-wi-dnr.opendata.arcgis.com/datasets/4c81d81ceb444aec8b4ac5b74768d4c5" target="_blank">WI DNR’s 24k Landnet</calcite-link>), your location may actually be in another polygon.</p>
  <p>For more information, <calcite-link href="https://www.sco.wisc.edu/sco/contact/" target="_blank">contact us</calcite-link> or visit our website at: <calcite-link href="https://www.sco.wisc.edu/" target="_blank">sco.wisc.edu</calcite-link>.</p>
</calcite-dialog>