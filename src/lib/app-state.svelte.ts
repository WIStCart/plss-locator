import * as urlUtils from "@arcgis/core/core/urlUtils.js";
import * as distanceOperator from "@arcgis/core/geometry/operators/distanceOperator.js";

import Point from "@arcgis/core/geometry/Point";

import { results } from "../store.svelte";
import { mapClickHandler } from "./map/map-click.svelte";
import { AppState, homeViewpoint } from "./sco-components";


export class CustomAppState extends AppState {
  public query:__esri.Point = $derived(
    new Point({
      latitude: results.latitude,
      longitude: results.longitude
    })
  );

  // Override urlParams
  public urlParams = $derived({
    center: this.center,
    level: this.level,
    basemap: this.basemap,
    query: this.query
  });

  // Override url
  public url = $derived.by(()=>{
    let urlParts = [];
    let newUrl = this.path;

    // If center and level present
    if (this.center && this.level && Number(this.level) >= 0) {
      // If at initial view
      if (this.viewpoint && homeViewpoint &&
        this.viewpoint.scale==homeViewpoint.scale &&
        distanceOperator.execute(this.viewpoint.targetGeometry!,homeViewpoint.targetGeometry!) < 0.01
      ) {
        // Do nothing
      } else {
        // Add center and level to URL
        urlParts.push(`center=${this.center.x},${this.center.y}`);
        urlParts.push(`level=${this.level}`);
      }
    }

    // If there is a basemap
    if (this.basemap != 0) {
      urlParts.push(`basemap=${this.basemap}`);
    }

    // If there is a query
    if (this.query.latitude && this.query.longitude) {
      urlParts.push(`query=${this.query.latitude.toFixed(4)},${this.query.longitude.toFixed(4)}`);
    }

    // If there are URL parameters to add
    if (urlParts.length) {
      newUrl += `?${urlParts.join("&")}`
    } 
    return newUrl
  });

  constructor() {
    super();

    // Get URL path and parameters
    const { path, query } = urlUtils.urlToObject(window.location.href)  

    // If the basemap is specified in the URL
    if (query?.basemap && parseInt(decodeURIComponent(query?.basemap))>=0) {
      // Grab basemap from URL
      this.basemap = parseInt(decodeURIComponent(query.basemap));
    } else {
      this.basemap = 0;
    }

    // If a query is specified in the URL
    if (query?.query) {
      // Grab lat and lon from URL
      const [lat,lon] = decodeURIComponent(query.query).split(',').map(value => value);
      
      // Set query
      this.query = new Point({
        latitude: Number(lat),
        longitude: Number(lon)
      });
    }
  }
}