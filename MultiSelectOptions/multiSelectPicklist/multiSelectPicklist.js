/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable no-console */
/* eslint-disable no-alert */

import {
    LightningElement,
    api,
    track
} from "lwc";

const SELECTALLVAL = 'SELECT_ALL';
const SELECTALLLBL = 'Select All';

export default class MultiSelectPicklist extends LightningElement {

    @api allList = []; // Receive the full list from calling component
    @api placeHolder = ''; // Display place holder Text in the input box
    isLabelPresent = false; // Boolean to specify if labelName variable is blank or not
    @api labelName; // Stores the label name which is passed on from the parent component
    @track displayList = []; // List to show the values in the drop down
    // List to store the selected drop down values
    // Ths list stores object as it's values
    @track selectedList = []; 
    @api hidePill = false;
    @track textTitle = '';
    @api isrequired = false;
    @api rqrdErrMessage = 'Complete this field.';
    @api parentLabel;    // List received from the parent component having the selected drop down values
    // The list stores strings as i'ts values
    @api receivedList = []; 
    @api includeSelectAll = false; //US10102 - defaulted to false, if true then Select All option will be added
    @track isSelectAllChecked = false;  //US10102 - defaulted to false
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
                }
                inputCmp.reportValidity();
            }
        }
        return retVal;
    }
    @api 
    get selectedItems()
    {
         return this.selectedList;
    }
    set selectedItems(value)
    {
         if(value != null)
         {
            this.selectedList = [];
            
             value.map(allListElement => {
                this.selectedList = [
                             ...this.selectedList,
                             {
                                 value: allListElement.value,
                                 label: allListElement.label,
                                 selected: true
                             }
                         ]
             });
             let resultArray = [];
             for (let key in this.selectedList){
                 if (this.selectedList.hasOwnProperty(key)){
                     resultArray.push(this.selectedList[key].value);
                 }
             }
             
             const dropDownValueChangeEvent = new CustomEvent("valueselect", { detail: resultArray });
             this.dispatchEvent(dropDownValueChangeEvent);
             this.SelectTextDisplayLogic()
         }
 
    } 
 

    @track listOpened = false; // Boolean to denote if drop down is opened/closed
    @track comboClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';

    @track searchInput = '';
    @track _initializationCompleted = false;

    
    connectedCallback(){
        for (let key in this.receivedList){
            if (this.receivedList.hasOwnProperty(key)){
                this.selectedList.push({
                    label: this.receivedList[key],
                    value: this.receivedList[key],
                    selected: true
                })
            }
        }
        if(this.labelName){
            this.isLabelPresent = true;
        }
        console.log('selected List :'+JSON.stringify(this.selectedList));
        this.SelectTextDisplayLogic();
    }
    
    renderedCallback () {
        if (!this._initializationCompleted) {
            let self = this; 
            this.template.querySelector ('[data-id=comboMultiSelect]').addEventListener ('click', function (event) {
                event.stopPropagation();
            });
            document.addEventListener ('click', function (event) {
                self.closePickList();
            });
            this._initializationCompleted = true;
        }
    }

    closePickList() {
        this.SelectTextDisplayLogic();
        this.listOpened = false;
        this.comboClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
    }

    SearchClick() {
        if (!this.listOpened) {
            this.listOpened = true;
            this.comboClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open'; 
            this.displayList = []; 
            //Added for US10102 - add select all option into list
            if(this.includeSelectAll){
                this.setSelectAllOption();
            } // End US10102
            this.allList.map(allListElement => {
                if (allListElement.selected) {
                    if (this.selectedList.find(element => element.value == allListElement.value) == null) {
                        this.selectedList = [...this.selectedList, {
                            label: allListElement.label,
                            value: allListElement.value,
                            selected: allListElement.selected
                        }];
                    }
                }
                this.displayList = [...this.displayList,{
                    label: allListElement.label,
                    value: allListElement.value,
                    selected: (this.selectedList.find(element => element.value == allListElement.value) != null) 
                }];

            });
        }
        else if (this.listOpened){
            this.searchInput = ''; //clearing the text
            this.listOpened = false;
            this.comboClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
        }
    }

    ChangeSearchInput(event) { 
        //let searchInput = event.target.value;
        this.searchInput = event.target.value.toLowerCase();
        this.displayList = [];
        let filterList = this.allList.filter(
            item => ((item.label.toLowerCase().includes(this.searchInput.trim()) == true ||
             item.value.toLowerCase().includes(this.searchInput.trim()) == true))
        );

        filterList.map(allListElement => {
            this.displayList = [...this.displayList, {
                label: allListElement.label,
                value: allListElement.value,
                selected: this.selectedList.find(element => element.value == allListElement.value) != null
            }];           
        });
        if(this.displayList && this.displayList.length > 0)
        {
            this.listOpened = true;
            this.comboClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open'; 

        }
        else
        {
            this.listOpened = false;
            this.comboClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
        }

    }

    handleCheckboxChange(e) {
        /* US10102 - added Select All */
        let selVal = e.target.value;
        if(selVal === SELECTALLVAL){ //if Select All selected
            this.isSelectAllChecked = e.detail.checked;
            this.displayList = [];
            this.allList.forEach(element => {
                this.displayList.push({
                    label: element.label,
                    value: element.value,
                    selected: e.detail.checked
                })
            })
            this.selectedList = [];
            if(e.detail.checked){
                this.displayList.forEach(element => {
                    this.selectedList.push({
                        label: element.label,
                        value: element.value,
                        selected: e.detail.checked
                    })
                })
            }
        }
        else{
            if (e.detail.checked) {
                if (this.selectedList.find(element => element.value == e.target.value) == null) {
                    this.selectedList = [...this.selectedList,{
                        label: e.target.label,
                        value: e.target.value,
                        selected: e.detail.checked
                    }             ]
                }
            } else{ // unchecked 
                this.selectedList = this.selectedList.filter(
                    item => item.value != e.target.value
                );
            }
            this.displayList.map(element => {
                if (element.value == e.target.value) {
                    element.selected = e.detail.checked;
                }
            });
        }
        //US10102 - if already select all checked and one different item unchecked by user, remove select all
        if(!e.detail.checked && e.detail.value !== SELECTALLVAL){
            this.displayList.map(element => {
                if(element.value === SELECTALLVAL){
                    element.selected = false;
                    this.isSelectAllChecked = false;
                }
            });
            this.selectedList = this.selectedList.filter(
                item => item.value !== SELECTALLVAL
            );
        }
        
        let resultArray = [];
        for (let key in this.selectedList){
            if (this.selectedList.hasOwnProperty(key)){
                if(this.selectedList[key].value !== SELECTALLVAL){ //US10102 - Send list with out select all
                    resultArray.push(this.selectedList[key].value);
                }
            }
        }
        this.SelectTextDisplayLogic();

        const dropDownValueChangeEvent = new CustomEvent("valueselect", { detail: resultArray });
        this.dispatchEvent(dropDownValueChangeEvent);  
    }

    handleRemoveRecord(e) {
        const removeItem = e.target.dataset.item;
        this.selectedList = this.selectedList.filter(item => item.value != removeItem);
        this.displayList.map(element => {
            if (element.value == removeItem) {
                element.selected = false;
            }
        });
        let resultArray = [];
        for (let key in this.selectedList){
            if (this.selectedList.hasOwnProperty(key)){
                resultArray.push(this.selectedList[key].value);
            }
        }
       this.SelectTextDisplayLogic()
        const dropDownValueChangeEvent = new CustomEvent("valueselect", { detail: resultArray });
        this.dispatchEvent(dropDownValueChangeEvent);
    }

    SelectTextDisplayLogic()
    {
       if(this.hidePill)
       {
            if(this.selectedList)
            {
                this.textTitle = '';
                this.selectedList.map(selectedListItem => {
                
                    this.textTitle +=  selectedListItem.label + ', ';
                });
                
                this.textTitle = this.textTitle.slice(0, -2);
               
                if(this.selectedList.length === 1)
                {
                    this.searchInput  = this.selectedList[0].label;
                }
                else if(this.selectedList.length > 1)
                {
                    //US10102 - if Select All is checked then remove from count of total number of option checked
                    if(this.isSelectAllChecked){
                        let noOfSelValue = this.selectedList.length - 1;
                        this.searchInput  = noOfSelValue +' '+this.parentLabel+'s Selected';
                    }else{
                        this.searchInput  = this.selectedList.length +' '+this.parentLabel+'s Selected';
                    }
                }
                else{
                    this.searchInput  = '';
                }
            }
       }
    }

    //Added for US10102

    setSelectAllOption(){
        let allListWithSelAll = [{label: SELECTALLLBL,value: SELECTALLVAL}];
        this.allList.map(allListElement => {
            if (allListWithSelAll.find(element => element.value == allListElement.value) == null) {
                allListWithSelAll.push({label: allListElement.label,
                value: allListElement.value}) 
            }
        })
        this.allList = allListWithSelAll;
    }

}