import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import CONTACT_FIRST_NAME_FIELD from '@salesforce/schema/Contact.FirstName';
import CONTACT_LAST_NAME_FIELD from '@salesforce/schema/Contact.LastName';
import CONTACT_EMAIL_NAME_FIELD from '@salesforce/schema/Contact.Email';

export default class ContactCreator extends LightningElement {
    objectApiName = CONTACT_OBJECT;
    fields = [
        CONTACT_FIRST_NAME_FIELD,
        CONTACT_LAST_NAME_FIELD,
        CONTACT_EMAIL_NAME_FIELD,
    ]

    handleSuccess(event) {
        const toastEvent = new ShowToastEvent({
            title: "Contact created",
            message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(toastEvent);
    }
}