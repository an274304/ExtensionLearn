document.addEventListener("DOMContentLoaded", function () {
    // Function to format time with colons
    function formatTime(input) {
        input.addEventListener("input", function () {
            // Remove any non-digit characters (optional if you want to ensure only digits and colons)
            let value = input.value.replace(/[^\d]/g, "");

            // Insert a colon after every two characters
            if (value.length > 2) {
                value = value.slice(0, 2) + ":" + value.slice(2);
            }
            if (value.length > 5) {
                value = value.slice(0, 5) + ":" + value.slice(5);
            }

            // Set the formatted value back to the input field
            input.value = value;
        });
    }

    // Apply the formatTime function to both input fields
    const timeInputs = document.querySelectorAll("#click-time1, #click-time2");
    timeInputs.forEach(formatTime);

    // Load station data from external JSON file
    let stationData = [];

    fetch('stationDB.json')  // The path to the JSON file
        .then(response => response.json())
        .then(data => {
            stationData = data;
        })
        .catch(error => console.error('Error loading station data:', error));

    // Function to filter stations based on input (name or code)
    function filterStations(inputValue) {
        return stationData.filter(station =>
            station.station_name.toLowerCase().includes(inputValue.toLowerCase()) ||
            station.station_code.toLowerCase().includes(inputValue.toLowerCase())
        );
    }

    // Function to update the dropdown list with filtered stations
    function updateDropdown(inputId, listId) {
        const inputField = document.getElementById(inputId);
        const dropdownList = document.getElementById(listId);

        // Check if the inputField and dropdownList exist before proceeding
        if (!inputField || !dropdownList) return;

        // Clear previous suggestions
        dropdownList.innerHTML = '';

        // Get the filtered stations based on the input
        const filteredStations = filterStations(inputField.value);

        // Display suggestions in the dropdown
        filteredStations.forEach(station => {
            const listItem = document.createElement('li');
            listItem.textContent = `${station.station_name} (${station.station_code})`; // Show name with code
            listItem.onclick = function () {
                // Update the input field with the selected station name
                inputField.value = station.station_name;
                // Store the station code for later use (you can save it in a hidden field or variable)
                inputField.setAttribute('data-station-code', station.station_code);
                dropdownList.innerHTML = ''; // Clear the list after selection
            };
            dropdownList.appendChild(listItem);
        });
    }

    // Event listener for "from" station input
    const fromInput = document.getElementById('from');
    if (fromInput) {
        fromInput.addEventListener('input', function () {
            updateDropdown('from', 'from-station-list');
        });
    }

    // Event listener for "to" station input
    const toInput = document.getElementById('to');
    if (toInput) {
        toInput.addEventListener('input', function () {
            updateDropdown('to', 'destination-station-list');
        });
    }


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
});
