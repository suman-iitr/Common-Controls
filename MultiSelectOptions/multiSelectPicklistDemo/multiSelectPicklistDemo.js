import { LightningElement,track, wire } from 'lwc';
import STAGE_NAME from '@salesforce/schema/Opportunity.StageName';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

export default class MultiSelectPicklistDemo extends LightningElement {

    @track stageOptions = [];
    @track selectedSatgeRecords;
    @track stagevaluedefault = [];

//recordTypeId: '$mmOptyRecordTypeId'
    /*@wire(getPicklistValues, { fieldApiName: STAGE_NAME})
    getStageNames({ data }) { 
        if (data){
            let result = data.values;
            for (let key in data.values){
                if (result.hasOwnProperty(key)){
                    
                 this.stageOptions.push({ value: result[key].value, label: result[key].label});
                  }
            }
           this.stageOptions.push({label:STAGE_VAL,value:STAGE_VAL})
         }
        
    }*/
    connectedCallback() {

        this.stageOptions.push({ value: 'System Closed', label: 'System Closed'});
        this.stageOptions.push({ value: 'Declined', label: 'Declined'});
        this.stageOptions.push({ value: 'Not Quoted', label: 'Not Quoted'});
        this.stageOptions.push({ value: 'Not Submitted', label: 'Not Submitted'});
        this.stageOptions.push({ value: 'Open', label: 'Open'});
        this.stageOptions.push({ value: 'Closed', label: 'Closed'});

        this.stagevaluedefault.push({value: 'Closed', label: 'Closed',selected:true});
    }

    handleSelectedSatgeRecords(event){
        this.selectedSatgeRecords = event.detail;
        console.log('event>>>'+JSON.stringify(event));
    }

}