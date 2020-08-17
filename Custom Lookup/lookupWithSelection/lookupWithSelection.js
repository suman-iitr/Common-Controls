/* eslint-disable no-console */
import { LightningElement, track } from 'lwc';

export default class LookupWithSelection extends LightningElement {

    @track initialValue = [{Id: '1122', Name: 'suman1'},{Id: '2233', Name: 'suman2'}];
    @track selectedItem;
    
    handleClick()
    {
        //console.log(JSON.stringify(this.template.querySelector("c-pill-poc").selectedItems));

         this.template.querySelector("c-custom-lookup").checkValidity();
         //console.log(JSON.stringify(x));

        
    }

    handleSelect(event)
    {
        this.selectedItem = event.detail.selectedRecordName;
    }

}