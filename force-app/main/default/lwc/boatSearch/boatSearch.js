import { LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class BoatSearch extends NavigationMixin(LightningElement) {
  isLoading = false;

  handleLoading() {
    this.isLoading = true;
  }

  handleDoneLoading() {
    this.isLoading = false;
  }

  searchBoats(evt) {
    this.callSearchBoatsApiMethod(evt.detail.boatTypeId);
  }

  createNewBoat() {
    this[NavigationMixin.Navigate]({
      type: "standard__objectPage",
      attributes: {
        objectApiName: "Boat__c",
        actionName: "new"
      }
    });
  }

  callSearchBoatsApiMethod(boatTypeId) {
    this.template
      .querySelector("c-boat-search-results")
      .searchBoats(boatTypeId);
  }
}
