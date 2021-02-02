import { LightningElement, wire } from "lwc";

import FIRST_FIELD from "@salesforce/schema/Contact.FirstName";
import LAST_FIELD from "@salesforce/schema/Contact.LastName";
import EMAIL_FIELD from "@salesforce/schema/Contact.Email";

import getContacts from "@salesforce/apex/ContactController.getContacts";

import { reduceErrors } from "c/ldsUtils";

const COLUMNS = [
  {
    label: "Contact First Name",
    fieldName: FIRST_FIELD.fieldApiName,
    type: "text"
  },
  {
    label: "Contact Last Name",
    fieldName: LAST_FIELD.fieldApiName,
    type: "text"
  },
  { label: "Contact Email", fieldName: EMAIL_FIELD.fieldApiName, type: "email" }
];
export default class ContactList extends LightningElement {
  columns = COLUMNS;

  @wire(getContacts)
  contacts;

  get errors() {
    return this.contacts.error ? reduceErrors(this.contacts.error) : [];
  }
}
