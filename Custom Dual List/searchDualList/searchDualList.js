/* eslint-disable array-callback-return */
/* eslint-disable no-alert */
/* eslint-disable no-return-assign */
/* eslint-disable no-console */
import { LightningElement, track,api } from 'lwc';

export default class SearchDualList extends LightningElement {

@api allItems = []; //receive the full list from calling component

@api labelName = ''; //Label the Component            

@track SelectedOptions = [];  //contains list to be displayed in Option
@track SelectedValues = []; //contains list to be displayed in values

//initialization of the list
connectedCallback()
{ 
   this.allItems.map(allListElement => {
        
        if (allListElement.selected) 
        {
            this.SelectedValues.push(allListElement.value)
            
        }

        this.SelectedOptions = [
            ...this.SelectedOptions,
            {
                label: allListElement.label,
                value: allListElement.value
            }
        ]
         
    });
 
}

//filter the display options based on user's search input
ChangeSearchInput(event)
{
    let searchInput = event.target.value.toLowerCase();

    //filter the global list and repolulating the display options and Values
    let filterList = this.allItems.filter(
        item => item.value.toLowerCase().includes(searchInput.trim()) === true);
    
        this.SelectedOptions = filterList;

        this.SelectedValues.forEach(element => this.SelectedOptions = [...this.SelectedOptions,{label: element, value: element}]);
}

//handle  changes to re-evaluate the display option and selected list
handleChange(e)
{
    this.SelectedValues = e.detail.value;

    // remove duplicate https://medium.com/dailyjs/how-to-remove-array-duplicates-in-es6-5daa8789641c
   
    this.SelectedOptions = this.SelectedOptions.filter((item, index) => this.SelectedOptions.indexOf(item) === index)

    // Creates the event with selected items.
    const selectedEvent = new CustomEvent('selected', { detail: this.SelectedValues });
    // Dispatches the event.
    this.dispatchEvent(selectedEvent);
}

}