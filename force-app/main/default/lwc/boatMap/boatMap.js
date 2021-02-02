import { LightningElement, wire, api } from "lwc";
import {
  MessageContext,
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE
} from "lightning/messageService";
import { getRecord } from "lightning/uiRecordApi";

import BOATMC from "@salesforce/messageChannel/BoatMessageChannel__c";

const LATITUDE_FIELD = "Boat__c.Geolocation__Latitude__s";
const LONGITUDE_FIELD = "Boat__c.Geolocation__Longitude__s";
const BOAT_FIELDS = [LONGITUDE_FIELD, LATITUDE_FIELD];

export default class BoatMap extends LightningElement {
  // private
  subscription = null;
  boatId;

  error = undefined;
  mapMarkers = [];

  @api
  get recordId() {
    return this.boatId;
  }
  set recordId(value) {
    this.boatId = value;
  }

  get showMap() {
    return this.mapMarkers.length > 0;
  }

  @wire(MessageContext)
  messageContext;

  @wire(getRecord, { recordId: "$recordId", fields: BOAT_FIELDS })
  wiredRecord({ error, data }) {
    if (data) {
      this.error = undefined;

      const longitude = data.fields.Geolocation__Longitude__s.value;
      const latitude = data.fields.Geolocation__Latitude__s.value;

      this.updateMap(longitude, latitude);
    } else if (error) {
      this.error = error;
      this.boatId = undefined;
      this.mapMarkers = [];
    }
  }

  connectedCallback() {
    this.subscribeMC();
  }

  disconnectedCallback() {
    unsubscribe(this.subscription);

    this.subscription = null;
  }

  subscribeMC() {
    if (this.subscription || this.recordId) {
      return;
    }
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        BOATMC,
        (message) => {
          this.boatId = message.recordId;
        },
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  // Creates the map markers array with the current boat's location for the map.
  updateMap(Longitude, Latitude) {
    this.mapMarkers = [
      {
        location: {
          Latitude: Latitude,
          Longitude: Longitude
        }
      }
    ];
  }
}
