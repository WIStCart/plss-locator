# SCO Application Template
This repository is a template for making Svelte/ArcGIS JS SDK web applications.



## Getting Started
1. Start by [creating a new repository from template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template)

2. [Install packages and SCO components](docs/development.md#install) `v2.1.1`



## Resources
- [Analytics](docs/analytics.md)
- [Development](docs/development.md)



## Config

1. `app-config.json`
    | Setting | Type | Description |
    | :-- | :-: | :-- |
    | `appName` | string | The name of the application. |
    | `aboutText` | string | The text that appears at the top of the info panel. |
    | `helpLink` | string | Link used for the help button, links to help document. |
    | `mapPortalId` | string | The portal ID of the web map used by the application. |
    | `gaMeasurementId` | string | Google Analytics measurement ID |
    | `titleBreakpoint` | number | Viewport width at which the application title switches to short form. |
    | `shellBreakpoint` | number | Viewport width at which shell changes to mobile view. |

2. `index.html`
    Change the `<title>` to your app's title.


## URL Parameters

| Parameter | Format | Description |
| :-- | :-: | :-- |
| `center` | `center=<x>,<y>`<br>`center=<x>,<y>,<wkid>` | MapView center: x coordinate, y coordinate, and optionally the well known ID of the spatial reference system. If no WKID is provided, 4326 is assumed.<br><br>Examples:<br>`center=-89.8506,45.8167`<br>`center=-9908677.16,5434226.91,102100`|
| `level` | `level=<zoom>` | MapView zoom level. Normally, zoom level depends on they type of layers are used in an application ([vector versus image tiles](https://developers.arcgis.com/documentation/mapping-and-location-services/reference/zoom-levels-and-scale/)) but this value is standardized to the vector scale where zoom level `0` has a scale of `295828763.795777`.<br><br>Example: `level=10` |
| `basemap` | `basemap=<index>` | Index of basemap in basemap gallery.<br><br>Example: `basemap=1` |
| `layers` | `layers=<layer>[,<layer>...]` | Comma seperated list of layer titles.<br><br>Example: `layers=NGS,HMP,County` |