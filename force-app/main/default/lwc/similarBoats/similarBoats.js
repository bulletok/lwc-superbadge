import { LightningElement, wire, api } from "lwc";
import getSimilarBoats from "@salesforce/apex/BoatDataService.getSimilarBoats";
import { NavigationMixin } from "lightning/navigation";

export default class SimilarBoats extends NavigationMixin(LightningElement) {
  currentBoat;
  relatedBoats;
  boatId;
  error;

  @api
  get recordId() {
    return this.boatId;
  }
  set recordId(value) {
    this.setAttribute("boatId", value);
    this.boatId = value;
  }

  @api
  similarBy;

  // Wire custom Apex call, using the import named getSimilarBoats
  // Populates the relatedBoats list
  @wire(getSimilarBoats, { boatId: "$boatId", similarBy: "$similarBy" })
  similarBoats({ error, data }) {
    if (data) {
      this.relatedBoats = data;
    } else if (error) {
      this.error = error;
    }
  }

  get getTitle() {
    return "Similar boats by " + this.similarBy;
  }
  get noBoats() {
    return !(this.relatedBoats && this.relatedBoats.length > 0);
  }

  openBoatDetailPage(event) {
    let boatId = event.detail.boatId;

    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: boatId,
        objectApiName: "Boat__c",
        actionName: "view"
      }
    });
  }
}
