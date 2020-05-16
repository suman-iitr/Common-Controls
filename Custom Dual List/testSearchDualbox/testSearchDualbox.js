/* eslint-disable no-console */
import { LightningElement,track } from 'lwc';

export default class TestSearchDualbox extends LightningElement {

    @track globalList = [];
    @track objectInfo = [];
    @track outputText = '';
   
    connectedCallback()
    {
        this.globalList.push({label: 'Bhaskar Ganguly',value: 'Bhaskar Ganguly', selected : false});
        this.globalList.push({label: 'Kuntal Ganguly',value: 'Kuntal Ganguly', selected : false});
        this.globalList.push({label: 'Manish Deb',value: 'Manish Deb', selected : true});
        this.globalList.push({label: 'Suman Halder',value: 'Suman Halder', selected : false});
       
    }

    Displayitems(event)
    {
        console.log(event.detail);

        this.outputText = JSON.stringify(event.detail);
    }   

}