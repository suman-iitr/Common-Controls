import { LightningElement, api } from 'lwc';

export default class ConfirmationModal extends LightningElement {   
    
    @api visible;    //used to hide/show Modal
    @api title;        //modal title : NOTE: if you don't want a header, do not pass this in
    @api name;    //reference name of the component.  Will be passed back in the onmodalclick event
    @api message;      //modal message
    @api confirmLabel; //confirm button label 
    @api cancelLabel;  //cancel button label  NOTE: If you only want one button do not pass this in
    @api confirmVariant='brand'; //can change variant of the confirm button, default is brand
    @api cancelVariant='brand-outline'; //can change variant of the cancel button, default is brand-outline
    
    //handles button clicks
    handleClick(event){

        //creates object which will be published to the parent component
        let modalEvent = {
            modalName: this.name,
            status: event.target.name // will be confirm or cancel
        };

        //dispatch a 'modalclick' event so the parent component can handle it
        this.dispatchEvent(new CustomEvent('modalclick', {detail: modalEvent}));
    }
}