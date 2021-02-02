import { LightningElement, track, api, wire } from "lwc";
import { MessageContext, publish } from "lightning/messageService";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";

import BOATMC from "@salesforce/messageChannel/BoatMessageChannel__c";

import getBoats from "@salesforce/apex/BoatDataService.getBoats";
import updateBoatList from "@salesforce/apex/BoatDataService.updateBoatList";

const SUCCESS_TITLE = "Success";
const MESSAGE_SHIP_IT = "Ship it!";
const SUCCESS_VARIANT = "success";
const ERROR_TITLE = "Error";
const ERROR_VARIANT = "error";

export default class BoatSearchResults extends LightningElement {
  columns = [
    { label: "Name", fieldName: "Name", type: "text", editable: true },
    { label: "Length", fieldName: "Length__c", type: "number", editable: true },
    {
      label: "Price",
      fieldName: "Price__c",
      type: "currency",
      editable: true,
      typeAttributes: { maximumFractionDigits: 2 }
    },
    {
      label: "Description",
      fieldName: "Description__c",
      type: "text",
      editable: true
    }
  ];

  boatTypeId = "";
  selectedBoatId = "";
  isLoading = false;

  @track boats;
  @track draftValues = [];

  @api
  searchBoats(boatTypeId) {
    this.notifyLoading(true);

    this.boatTypeId = boatTypeId;
  }

  @api
  async refresh() {
    this.notifyLoading(true);

    return refreshApex(this.boats);
  }

  @wire(MessageContext)
  messageContext;

  @wire(getBoats, { boatTypeId: "$boatTypeId" })
  wiredBoats(result) {
    this.boats = result;

    if (result.error) {
      this.error = result.error;
      this.boats = undefined;
    }

    this.notifyLoading(false);
  }

  updateSelectedTile(event) {
    this.selectedBoatId = event.detail.boatId;

    this.sendMessageService(this.selectedBoatId);
  }

  sendMessageService(boatId) {
    const payload = { recordId: boatId };

    publish(this.messageContext, BOATMC, payload);
  }

  handleSave(event) {
    this.notifyLoading(true);

    const updatedFields = event.detail.draftValues;

    this.draftValues = updatedFields;

    updateBoatList({ data: updatedFields })
      .then(() => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: SUCCESS_TITLE,
            message: MESSAGE_SHIP_IT,
            variant: SUCCESS_VARIANT
          })
        );

        this.draftValues = [];

        this.refresh();
      })
      .catch((error) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: ERROR_TITLE,
            message: error,
            variant: ERROR_VARIANT
          })
        );
      })
      .finally(() => {});

    this.notifyLoading(false);
  }

  notifyLoading(isLoading) {
    this.isLoading = isLoading;

    if (this.isLoading) {
      this.dispatchEvent(new CustomEvent("loading", {}));
    } else {
      this.dispatchEvent(new CustomEvent("doneloading", {}));
    }
  }
}
