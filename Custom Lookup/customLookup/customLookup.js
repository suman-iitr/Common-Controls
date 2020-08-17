/* eslint-disable no-alert */
/* eslint-disable no-undef */
/* eslint-disable no-console */
import { LightningElement, api, track } from 'lwc';
import searchRecords from '@salesforce/apex/CustomLookupController.searchRecords';
export default class CustomLookup extends LightningElement {

    /* public property */
    /* these public property will be used when using this component inside other component for the lookup functionality */
    /* objectName is the name of the Object which is parent either master-detail or lookup */
    /* fieldName is the field of parent object in which text needs to be searched */
    /* iconname - icon to display in the list and after selection of the record */
    /* label - to show the label for the lookup */
    /* isrequired - To indicate if the field is required or not*/
    /* rqrdErrMessage - Error message to display for required fields*/
    /* defaultRecordName - Default selected value in the field*/

    @api label      = '';
    @api objectName = '';
    @api fieldName  = '';
    @api recordtypeDevName = '';
    @api filterCriteria = ''
    @api iconname   = '';
    @api isrequired = false;
    @api rqrdErrMessage = 'Complete this field.';
    @api placeHolder = 'Search...'; // Display place holder Text in the input box
    @api selectedRecord;
    @api displayList;

    @track searckKeyword = '';
    @track records;

    @api handleValueChange() {
        this.handleRemove();
       
      }
    
      @api checkValidity() {
        
        let retVal = true;
        let inputCmp = this.template.querySelector(".searchInput");
        if(inputCmp != null){
            let value = inputCmp.value;
            
            if(this.isrequired){
                if (!value) {
                    inputCmp.setCustomValidity(this.rqrdErrMessage);
                    retVal = false;
                } else {
                    inputCmp.setCustomValidity("");
                    retVal = true;
                    console.log('retVal> ' + retVal)
                }
                inputCmp.reportValidity();
            }
        }
        
        return retVal;
      }

    hanldeSearch(event)
    {
        this.searckKeyword = event.detail.value;
        if(this.displayList && this.searckKeyword.length === 0){
            this.displayList = false;
        }
        if(this.searckKeyword.length>2){

            this.checkValidity();
            
            searchRecords({
                objName   : this.objectName,
                fieldName : this.fieldName,
                searchKey : this.searckKeyword,
                recTypeDevName : this.recordtypeDevName,
                filterCriteria : this.filterCriteria
            })
            .then( data => {
                if ( data ) {
                    let parsedResponse = JSON.parse(data);
                    let searchRecordList = parsedResponse[0];
                    for ( let i=0; i < searchRecordList.length; i++ ) {
                        let record = searchRecordList[i];
                        record.Name = record[this.fieldName];
                    }
                    this.records = searchRecordList;
                    this.displayList = true;
                }
            })
            .catch( error => {
                console.log(' error ', error);
            });
        }
    }
    
    handleSelect(event) {
        let selectedId = event.currentTarget.dataset.id;
        let selectedName = event.currentTarget.dataset.name;
        this.selectedRecord =  selectedName;
        this.searckKeyword = '';

            let finalRecEvent = new CustomEvent('select',{
            detail : { selectedRecordId : selectedId, selectedRecordName : this.selectedRecord }
        });
        this.dispatchEvent(finalRecEvent);
    } 

    handleRemove() {
        this.selectedRecord =  undefined;
        this.records = undefined;
        this.displayList = false;
        let finalRecEvent = new CustomEvent('remove',{
            detail : { selectedRecordId : undefined, selectedRecordName : undefined }
        });
        this.dispatchEvent(finalRecEvent);
    }
    
}