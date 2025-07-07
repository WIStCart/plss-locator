<script lang="ts">
  // Calcite Components
  import "@esri/calcite-components/components/calcite-shell-panel";
  import "@esri/calcite-components/components/calcite-action-bar";
  import "@esri/calcite-components/components/calcite-action";
  import type { CalciteActionBarCustomEvent } from "@esri/calcite-components";
  import type { Action } from "@esri/calcite-components/components/calcite-action";

  // App Components
  import { actionBarState, analytics } from "../../store.svelte";


  const handleActionBarClick = (event:CalciteActionBarCustomEvent<Action>) => {

    // Before making any changes store the previous active action
    if (actionBarState.activeAction) actionBarState.lastActiveAction = actionBarState.activeAction;

    // Close action panel for clicks on bar that are not actions
    if (event.target.tagName !== "CALCITE-ACTION" && actionBarState.closable) {
      actionBarState.closed = true;
      actionBarState.activeAction = undefined;

      // Record event
      analytics.send('Action Panel Closed', 'Action panel was closed because the action bar was clicked.', 'Action Bar', {'action':'none', 'panelClosed':actionBarState.closed, 'panelClosable':actionBarState.closable});

      return
    }

    const clickedAction = event.target.dataset.actionId;
    

    // Toggle action if event target has an action ID
    if (clickedAction) {
      
      // If clicked action is already active and action bar is closable
      if (clickedAction==actionBarState.activeAction && actionBarState.closable) {
        // Close bar
        actionBarState.closed = true;
        actionBarState.activeAction = undefined;

        analytics.send('Action Panel Closed', 'The active action was clicked closing the action panel.', 'Action Bar', {'action':clickedAction, 'panelClosed':actionBarState.closed, 'panelClosable':actionBarState.closable});
      }
      // If clicked action is not already closed
      else {
        // Verify panel is open
        actionBarState.closed = false;

        // Activate action
        actionBarState.activeAction = clickedAction;

        analytics.send('Action Toggled', 'An action was toggled, opening the action panel.', 'Action Bar', {'action':clickedAction, 'panelClosed':actionBarState.closed, 'panelClosable':actionBarState.closable});
      }
    } else {
      analytics.send('Action Bar Expand Toggled', 'Action bar expand was toggled.', 'Action Bar', {'action':clickedAction, 'panelClosed':actionBarState.closed, 'panelClosable':actionBarState.closable});
    }
    
  };
</script>

<calcite-shell-panel {...$$restProps}>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions-->
  <calcite-action-bar slot="action-bar" on:click={handleActionBarClick} expand-disabled={actionBarState.closable}>
    <calcite-action 
      text="Search" 
      icon="search"
      data-action-id="search" 
      active={actionBarState?.search}
    ></calcite-action>
    <calcite-action 
      text="Layers" 
      icon="layers"
      data-action-id="layers" 
      active={actionBarState?.layers}
    ></calcite-action>
    <calcite-action 
      text="Information" 
      icon="information"
      data-action-id="info" 
      active={actionBarState?.info}
    ></calcite-action>
  </calcite-action-bar>
</calcite-shell-panel>

<style>
  :root {
    --calcite-shell-panel-min-height: 22em;
  }
</style>