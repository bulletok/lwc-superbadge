import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getAllReviews from "@salesforce/apex/BoatDataService.getAllReviews";

const TOAST_TITLE = "Error getting reviews";
const TOAST_ERROR_VARIANT = "error";
export default class BoatReviews extends NavigationMixin(LightningElement) {
  // Private
  boatId;
  error;
  boatReviews;
  isLoading = false;

  isReadOnly = true;

  // Getter and Setter to allow for logic to run on recordId change
  @api
  get recordId() {
    return this.boatId;
  }
  set recordId(value) {
    this.setAttribute("boatId", value);
    this.boatId = value;
    this.getReviews();
  }

  // Getter to determine if there are reviews to display
  get reviewsToShow() {
    return this.boatReviews && this.boatReviews.length > 0 ? true : false;
  }

  // Public method to force a refresh of the reviews invoking getReviews
  @api
  refresh() {
    this.getReviews();
  }

  // Imperative Apex call to get reviews for given boat
  // returns immediately if boatId is empty or null
  // sets isLoading to true during the process and false when it’s completed
  // Gets all the boatReviews from the result, checking for errors.
  getReviews() {
    if (!this.boatId) {
      return;
    }
    this.isLoading = true;
    getAllReviews({
      boatId: this.recordId
    })
      .then((result) => {
        this.boatReviews = result;
        this.isLoading = false;
      })
      .catch((error) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: TOAST_TITLE,
            message: error.body ? error.body.message : error.message,
            variant: TOAST_ERROR_VARIANT
          })
        );
        this.isLoading = false;
      });
  }

  // Helper method to use NavigationMixin to navigate to a given record on click
  navigateToRecord(event) {
    let recordId = event.target.dataset.recordId;
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: recordId,
        objectApiName: "User",
        actionName: "view"
      }
    });
  }
}
