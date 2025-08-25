# PLSS Locator
PLSS Locator is a free tool created by the Wisconsin State Cartographer's Office to help users identify within which Public Land Survey System (PLSS) subdivisions a location resides.


## Resources
- [Analytics](docs/analytics.md)
- [Development](docs/development.md)


## Config

1. `app-config.json`
    | Setting | Type | Description |
    | :-- | :-: | :-- |
    | `appName` | string | The name of the application. |
    | `mapPortalId` | string | The portal ID of the web map used by the application. |
    | `gaMeasurementId` | string | Google Analytics measurement ID |
    | `titleBreakpoint` | number | Viewport width at which the application title switches to short form. |
    | `shellBreakpoint` | number | Viewport width at which shell changes to mobile view. |

2. SCO Components: `v2.1.1`


## URL Parameters

| Parameter | Format | Description |
| :-- | :-: | :-- |
| `center` | `center=<x>,<y>`<br>`center=<x>,<y>,<wkid>` | MapView center: x coordinate, y coordinate, and optionally the well known ID of the spatial reference system. If no WKID is provided, 4326 is assumed.<br><br>Examples:<br>`center=-89.8506,45.8167`<br>`center=-9908677.16,5434226.91,102100`|
| `level` | `level=<zoom>` | MapView zoom level. Normally, zoom level depends on they type of layers are used in an application ([vector versus image tiles](https://developers.arcgis.com/documentation/mapping-and-location-services/reference/zoom-levels-and-scale/)) but this value is standardized to the vector scale where zoom level `0` has a scale of `295828763.795777`.<br><br>Example: `level=10` |
| `basemap` | `basemap=<index>` | Index of basemap in basemap gallery.<br><br>Example: `basemap=1` |
| `query` | `qeury=<lat>,<lon>` | Latitude and longitude of click location to query for PLSS info.<br><br>Example: `query=43.6819,-89.8571` |
