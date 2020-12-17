/* eslint-disable no-console */
import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ACCOUNT_FIELD from '@salesforce/schema/Contact.AccountId';
import NAME_FIELD from '@salesforce/schema/Contact.Name';
import TITLE_FIELD from '@salesforce/schema/Contact.Title';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';

export default class recordForm extends LightningElement {

   // Flexipage provides recordId and objectApiName
    @api recordId;
    @api objectApiName;

    // Confirm modal variables: Starts
    showConfirmModal = false; // sets the visibility of the confirm modal
    modalMessage = 'are you Sure?'; // stores the message to be displayed on the confirm modal
    modalConfirmLabel = 'Yes'; // stores the label of the confirm button on the modal
    modalCancelLabel = 'No'; // stores the label of the cancel button on the modal
    // Confirm modal variables: Ends

    

    fields = [ACCOUNT_FIELD, NAME_FIELD, TITLE_FIELD, PHONE_FIELD, EMAIL_FIELD];

    handleSubmit(event)
    {
        this.showConfirmModal = true;
        event.preventDefault();
        console.log('handleSubmit called');

       

    }

    handleModalClick(event){

        if(event.detail.status==='confirm'){
            
            
            this.template.querySelector('lightning-record-form').submit(this.fields);
        }
        

        this.showConfirmModal = false;
       
    } 
    
    handleSuccess(event) {
        const evt = new ShowToastEvent({
            title: "Contact Updated",
            message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(evt);
    }

}