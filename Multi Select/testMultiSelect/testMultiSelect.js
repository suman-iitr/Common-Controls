/* eslint-disable no-console */
import { LightningElement,track } from 'lwc';

export default class TestMultiSelect extends LightningElement {

    @track simpleMultiSelectList = [];
    @track objectInfo = [];
   
    connectedCallback()
    {
        this.simpleMultiSelectList.push({label: 'Jiten',value: 'Jiten', selected : false});
        this.simpleMultiSelectList.push({label: 'Animesh',value: 'Animesh', selected : false});
        this.simpleMultiSelectList.push({label: 'Santanu Boral',value: 'Santanu Boral', selected : true});
        this.simpleMultiSelectList.push({label: 'Santanu Pal',value: 'Santanu Pal', selected : false});
        this.simpleMultiSelectList.push({label: 'Suman',value: 'Suman', selected : false});
        this.simpleMultiSelectList.push({label: 'Option 6',value: 'Option 6', selected : false});
        this.simpleMultiSelectList.push({label: 'Option 8',value: 'Option 8', selected : false});
        this.simpleMultiSelectList.push({label: 'Option 9',value: 'Option 9', selected : false});
        this.simpleMultiSelectList.push({label: 'Option 10',value: 'Option 10', selected : false});
        this.simpleMultiSelectList.push({label: 'Option 11',value: 'Option 11', selected : false});
        this.simpleMultiSelectList.push({label: 'Option 12',value: 'Option 12', selected : false});
    }

    Displayitems(event)
    {
        console.log(event.detail);

        this.objectInfo = event.detail;
    }   
}