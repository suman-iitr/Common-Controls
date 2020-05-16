/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable no-console */
/* eslint-disable no-alert */

import {
    LightningElement,
    api,
    track
} from "lwc";

export default class SimpleMultiSelect extends LightningElement {
    @api allList = []; //receive the full list from calling component
    @api placeHolder = 'Search...'; // Display place holder Text in the input box
    @api labelName = ''; //Label the Component

    //contains list to be displayed 
    @track displayList = [];

    //contains the selected list  
    @api selectedList = [];

    //search letters input by the user
    @track searchInput = '';

    //toggle between the list opened and Closed, default is false
    @track listOpened = false;

    //style of the div
    @track comboClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
   
    //initialization of the list
    connectedCallback()
    {
        this.allList.map(allListElement => {
                
            if (allListElement.selected) {

                    this.selectedList = [
                        ...this.selectedList,
                        {
                            label: allListElement.label,
                            value: allListElement.value,
                            selected: allListElement.selected
                        }
                    ]
                
            }
            
        });
    }
    
    //fires when the list expands or collapsed 
    SearchClick() {
        
        if (!this.listOpened) {

           this.listOpened = true;
           this.comboClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open'; 

            this.displayList = []; //initialize the array before assigning values coming from apex
            
            this.allList.map(allListElement => {
                
                if (allListElement.selected) {
                    
                    //Add item to selectedList of not already present 
                    if (this.selectedList.find(element => element.value == allListElement.value) == null) {
                        this.selectedList = [
                            ...this.selectedList,
                            {
                                label: allListElement.label,
                                value: allListElement.value,
                                selected: allListElement.selected
                            }
                        ]
                    }
                }
                
                //Add item to displayList of not already present 
                this.displayList = [
                    ...this.displayList,
                    {
                        label: allListElement.label,
                        value: allListElement.value,
                        selected: (this.selectedList.find(element => element.value == allListElement.value) != null) 
                    }
                ];

            });
        }
        else if (this.listOpened)
        {
            this.searchInput = ''; //clearing the text
            this.listOpened = false;
            this.comboClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
           
            //Pulishing Selected items through Event After closeing the dropdown list

            this.publishEvent();
        }
    }

    //filter the display options based on user's search input
    ChangeSearchInput(event) {
        
       
       this.listOpened = true;
       this.comboClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open'; 


        this.searchInput = event.target.value.toLowerCase();
        
        this.displayList = []; //initialize the array before assigning values coming from apex
        
        //filter the global list and repolulating the display options
        let filterList = this.allList.filter(
            item => item.value.toLowerCase().includes(this.searchInput.trim()) == true
        );
             
        filterList.map(allListElement => {
            this.displayList = [
                ...this.displayList,
                {
                    label: allListElement.label,
                    value: allListElement.value,
                    selected: this.selectedList.find(element => element.value == allListElement.value) != null
                }
            ];

            
        });
    }

    //handle check box changes to re-evaluate the display option and selected list
    handleCheckboxChange(e) {


        if (e.detail.checked) {

            if (this.selectedList.find(element => element.value == e.target.value) == null) {
                this.selectedList = [
                    ...this.selectedList,
                    {
                        label: e.target.label,
                        value: e.target.value,
                        selected: e.detail.checked
                    }
                ]
            }
        } else // unchecked 
        {
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
    //handle pill action. re-evaluate display option and selected list
    handleRemoveRecord(e) {
        const removeItem = e.target.dataset.item;

        this.selectedList = this.selectedList.filter(item => item.value != removeItem);

        this.displayList.map(element => {

            if (element.value == removeItem) {

                element.selected = false;

            }

        });

        
    }
    //Publishning the selected list
    publishEvent()
    {
        // Creates the event with selected items.
        const selectedEvent = new CustomEvent('selected', { detail: this.selectedList });
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }
}