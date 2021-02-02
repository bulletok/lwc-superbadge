import { LightningElement, track, wire } from "lwc";

import getBoatTypes from "@salesforce/apex/BoatDataService.getBoatTypes";

export default class BoatSearchForm extends LightningElement {
  @track searchOptions;

  selectedBoatTypeId = "";

  isLoading = true;
  error = undefined;

  @wire(getBoatTypes)
  boatTypes({ error, data }) {
    if (data) {
      this.searchOptions = data.map((type) => {
        return {
          label: type.Name,
          value: type.Id
        };
      });

      this.searchOptions.unshift({ label: "All Types", value: "" });

      this.isLoading = false;
    } else if (error) {
      this.searchOptions = undefined;
      this.error = error;

      console.log(error);
    }
  }

  handleSearchOptionChange(event) {
    this.selectedBoatTypeId = event.detail.value;

    const searchEvent = new CustomEvent("search", {
      detail: {
        boatTypeId: this.selectedBoatTypeId
      }
    });

    this.dispatchEvent(searchEvent);
  }
}
