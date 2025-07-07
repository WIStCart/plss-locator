<script lang="ts">
  import { onMount, mount, type Component } from "svelte";

  // Calcite Components
  import "@esri/calcite-components/components/calcite-flow";
  import "@esri/calcite-components/components/calcite-flow-item";
  import "@esri/calcite-components/components/calcite-block";
  import "@esri/calcite-components/components/calcite-list";
  import "@esri/calcite-components/components/calcite-list-item";
  import type { ListItem } from "@esri/calcite-components/components/calcite-list-item";
  import type { FlowItem } from "@esri/calcite-components/components/calcite-flow-item";

  // App Components
  import About from "./About.svelte";
  import type { Flow } from "@esri/calcite-components/components/calcite-flow";
  import type { CalciteListItemCustomEvent } from "@esri/calcite-components";
  import { config, analytics } from "../../../store.svelte";


  const helpURL = config.info.helpLink;
  const contactURL = `mailto:help@sco.wisc.edu?subject=${encodeURIComponent(config.appName.full)}`;

  let flow:Flow;
  let infoFlowItem:FlowItem;
  let help:ListItem;
  let contact:ListItem;


  function createFlowItem(event:Event, title:string, description:string, component:Component) {
    // Create new flow item
    const newFlowItem = document.createElement("calcite-flow-item");

    // Flow back event
    newFlowItem.addEventListener("calciteFlowItemBack", () => {
      newFlowItem.remove();
      infoFlowItem.selected = true;
    });

    // Set title and description
    newFlowItem.heading = title;
    newFlowItem.description = description;

    // Add flow item to flow
    flow.append(newFlowItem);

    // Mount the component to the flow item
    mount(component, {
      target: newFlowItem
    });

    // Change item selection
    infoFlowItem.selected = false;
    newFlowItem.selected = true;
  }

  onMount(()=>{
    // Add link to help list item
    help.onclick = ()=> {
        window.open(helpURL, '_blank')?.focus();
        analytics.send("Help Clicked", "User clicked on the help button in info panel.", "Info", {action: "help"});
    }

    // Contact
    contact.onclick = ()=> {
        window.open(contactURL, '_blank');
        analytics.send("Contact Clicked", "User clicked on the contact button in info panel.", "Info", {action: "contact"});
    }
  })
  

</script>

<calcite-flow bind:this={flow}>
  <calcite-flow-item bind:this={infoFlowItem} heading="Information">
    <About />
    <calcite-list>
      <calcite-list-item bind:this={help} label="Help" description="Go to help document"></calcite-list-item>
      <calcite-list-item bind:this={contact} label="Contact" description="Reach out to us with a question or feedback"></calcite-list-item>
    </calcite-list>
  </calcite-flow-item>
</calcite-flow>