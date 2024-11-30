// Step 1: Trigger the click event to open the dropdown
const seatTypeDropdownTrigger = document.querySelector('#journeyClass .ui-dropdown-trigger');
seatTypeDropdownTrigger.click();  // This will open the dropdown

// Step 2: Find the option with the text 'Second Sitting (2S)'
const seatTypeDropdownOption = Array.from(document.querySelectorAll('#journeyClass .ui-dropdown-item'))
    .find(item => item.textContent.trim() === 'Second Sitting (2S)');

// Step 3: Select the option if it exists
if (seatTypeDropdownOption) {
    seatTypeDropdownOption.click();  // Click the option to select it
}


// Step 1: Trigger the click event to open the dropdown
const ticketTypeDropdownTrigger = document.querySelector('#journeyQuota .ui-dropdown-trigger');
ticketTypeDropdownTrigger.click();  // This will open the dropdown

// Step 2: Find the option with the text 'GENERAL'
const ticketTypeDropdownOption = Array.from(document.querySelectorAll('#journeyQuota .ui-dropdown-item'))
    .find(item => item.textContent.trim() === 'GENERAL');

// Step 3: Select the option if it exists
if (ticketTypeDropdownOption) {
    ticketTypeDropdownOption.click();  // Click the option to select it
}


try {
    // Select the input field using the `aria-controls` attribute
    const inputField = document.querySelector('input[aria-controls="pr_id_2_list"]');
    if (!inputField) {
        console.error("Input field not found.");
        return;
    }

    // Set the value of the input field
    inputField.value = "GWL";

    // Trigger the input event to notify the autocomplete component of the change
    const inputEvent = new Event('input', { bubbles: true });
    inputField.dispatchEvent(inputEvent);

    // Simulate typing to trigger dropdown if necessary
    const keyUpEvent = new KeyboardEvent('keyup', { bubbles: true, key: inputField.value.slice(-1) });
    inputField.dispatchEvent(keyUpEvent);

    // Wait for the dropdown to populate
    setTimeout(() => {
        // Get the dropdown list by its ID
        const dropdownList = document.getElementById('pr_id_2_list');
        if (!dropdownList) {
            console.error("Dropdown list not found.");
            return;
        }

        // Get the first list item in the dropdown
        const firstItem = dropdownList.querySelector('li[role="option"]');
        if (!firstItem) {
            console.error("No items found in the dropdown list.");
            return;
        }

        // Simulate a click on the first list item
        firstItem.click();
        console.log("First item selected:", firstItem.textContent.trim());
    }, 1000); // Adjust timeout based on the autocomplete delay
} catch (error) {
    console.error("Error handling autocomplete:", error.message);
}


 // "host_permissions": [
    //   "https://www.irctc.co.in/nget/train-search",
    //   "https://www.irctc.co.in/nget/booking/psgninput"
    // ],