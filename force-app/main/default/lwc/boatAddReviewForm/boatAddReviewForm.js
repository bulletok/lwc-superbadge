import { LightningElement, wire, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import BOAT_REVIEW_OBJECT from "@salesforce/schema/BoatReview__c";
import NAME_FIELD from "@salesforce/schema/BoatReview__c.Name";
import COMMENT_FIELD from "@salesforce/schema/BoatReview__c.Comment__c";

const SUCCESS_TITLE = "Review Created!";
const SUCCESS_VARIANT = "success";

export default class BoatAddReviewForm extends LightningElement {
  OBJECT_NAME = {
    BR_API_NAME: BOAT_REVIEW_OBJECT.objectApiName
  };

  FIELD = {
    NAME_FIELD,
    COMMENT_FIELD
  };

  boatId;
  rating = 0;
  isReadOnly = false;

  // Public Getter and Setter to allow for logic to run on recordId change
  @api
  get recordId() {
    return this.boatId;
  }
  set recordId(value) {
    this.setAttribute("boatId", value);
    this.boatId = value;
  }

  // Gets user rating input from stars component
  handleRatingChanged(event) {
    this.rating = event.detail.rating;
  }

  // Custom submission handler to properly set Rating
  // This function must prevent the anchor element from navigating to a URL.
  // form to be submitted: lightning-record-edit-form
  handleSubmit(event) {
    event.preventDefault();

    const fields = event.detail.fields;

    fields.Rating__c = this.rating;
    fields.Boat__c = this.boatId;

    this.template.querySelector("lightning-record-edit-form").submit(fields);
  }

  // Shows a toast message once form is submitted successfully
  // Dispatches event when a review is created
  handleSuccess(event) {
    this.dispatchEvent(
      new ShowToastEvent({
        title: SUCCESS_TITLE,
        message: "Id: " + event.detail.id,
        variant: SUCCESS_VARIANT
      })
    );

    this.dispatchEvent(
      new CustomEvent("createreview", {
        detail: {}
      })
    );

    this.handleReset();
  }

  // Clears form data upon submission
  handleReset() {
    const inputFields = this.template.querySelectorAll("lightning-input-field");

    if (inputFields) {
      inputFields.forEach((field) => {
        field.reset();
      });
    }

    this.rating = 0;
  }
}
