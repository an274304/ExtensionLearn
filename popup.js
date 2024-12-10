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
                // Store the station code for later use
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

    // Function to save data to chrome.storage
    function saveData() {
        const irctcLogin = document.getElementById('irctc-login').value;
        const irctcPassword = document.getElementById('irctc-password').value;

        const fromStation = document.getElementById('from').value;
        const fromStationCode = document.getElementById('from').getAttribute('data-station-code'); // Get station code

        const toStation = document.getElementById('to').value;
        const toStationCode = document.getElementById('to').getAttribute('data-station-code'); // Get station code

        const journeyDate = document.getElementById('journey-date').value;

        const journeyClassCode = document.getElementById('journey-class-input').value;
        const journeyClass = document.getElementById('journey-class-input').options[document.getElementById('journey-class-input').selectedIndex].text;

        const quotaCode = document.getElementById('quota-input').value;
        const quota = document.getElementById('quota-input').options[document.getElementById('quota-input').selectedIndex].text;

        const trainNo = document.getElementById('train-no').value;

        // Time values
        const clicktime1 = document.getElementById('click-time1').value;
        const clicktime2 = document.getElementById('click-time2').value;

        const passengers = [];
        for (let i = 1; i <= 6; i++) {
            const passengerName = document.getElementById(`passenger-name-${i}`).value;
            const passengerAge = document.getElementById(`age-${i}`).value;
            const passengerGender = document.getElementById(`passenger-gender-${i}`).value;
            const passengerBerth = document.getElementById(`passenger-berth-${i}`).value;
            if (passengerName) { // Save only if passenger's name is filled in
                passengers.push({
                    name: passengerName,
                    age: passengerAge,
                    gender: passengerGender,
                    berth: passengerBerth
                });
            }
        }

        const mobileNumber = document.getElementById('mobileNumber').value;
        const autoUpgradation = document.getElementById('autoUpgradation').checked;
        const confirmBerths = document.getElementById('confirmberths').checked;
        const travelInsuranceOpted = document.querySelector('input[name="travelInsuranceOpted"]:checked')?.value;

        // Save login details
        chrome.storage.sync.set({
            loginDetails: {
                irctcLogin,
                irctcPassword
            }
        }, function () {
            console.log('Login details saved');
        });

        // Save times
        chrome.storage.sync.set({
            times: {
                clicktime1,
                clicktime2
            }
        }, function () {
            console.log('Time details saved');
        });

        // Save journey details
        chrome.storage.sync.set({
            journeyDetails: {
                fromStation,
                fromStationCode,  // Save the from station code
                toStation,
                toStationCode,    // Save the to station code
                journeyDate,
                journeyClass,
                journeyClassCode,  // Save the to Class code
                quota,
                quotaCode, // Save the to Quota code
                trainNo
            }
        }, function () {
            console.log('Journey details saved');
        });

        // Save passenger and additional details in one variable
        chrome.storage.sync.set({
            passengerAndAdditionalDetails: {
                passengers,
                mobileNumber,
                autoUpgradation,
                confirmBerths,
                travelInsuranceOpted
            }
        }, function () {
            console.log('Passenger and Additional details saved');
        });

        alert('Data Saved!');
    }

    // Function to load data from chrome.storage
    function loadData() {
        chrome.storage.sync.get(['loginDetails', 'times', 'journeyDetails', 'passengerAndAdditionalDetails'], function (result) {
            const { loginDetails, times, journeyDetails, passengerAndAdditionalDetails } = result;

            if (loginDetails) {
                document.getElementById('irctc-login').value = loginDetails.irctcLogin || '';
                document.getElementById('irctc-password').value = loginDetails.irctcPassword || '';
            }

            if (times) {
                document.getElementById('click-time1').value = times.clicktime1 || '';
                document.getElementById('click-time2').value = times.clicktime2 || '';
            }

            if (journeyDetails) {
                document.getElementById('from').value = journeyDetails.fromStation || '';
                document.getElementById('from').setAttribute('data-station-code', journeyDetails.fromStationCode ?? '');

                document.getElementById('to').value = journeyDetails.toStation || '';
                document.getElementById('to').setAttribute('data-station-code', journeyDetails.toStationCode ?? '');

                document.getElementById('journey-date').value = journeyDetails.journeyDate || '';

                document.getElementById('journey-class-input').value = journeyDetails.journeyClassCode || '';
                document.getElementById('quota-input').value = journeyDetails.quotaCode || '';

                document.getElementById('train-no').value = journeyDetails.trainNo || '';
            }

            if (passengerAndAdditionalDetails) {
                const { passengers, mobileNumber, autoUpgradation, confirmBerths, travelInsuranceOpted } = passengerAndAdditionalDetails;

                passengers.forEach((passenger, index) => {
                    if (index < 6) {
                        document.getElementById(`passenger-name-${index + 1}`).value = passenger.name || '';
                        document.getElementById(`age-${index + 1}`).value = passenger.age || '';
                        document.getElementById(`passenger-gender-${index + 1}`).value = passenger.gender || '';
                        document.getElementById(`passenger-berth-${index + 1}`).value = passenger.berth || '';
                    }
                });

                document.getElementById('mobileNumber').value = mobileNumber || '';
                document.getElementById('autoUpgradation').checked = autoUpgradation || false;
                document.getElementById('confirmberths').checked = confirmBerths || false;
                document.querySelector(`input[name="travelInsuranceOpted"][value="${travelInsuranceOpted}"]`).checked = true;
            }
        });
    }

    // Function to reset form fields
    function resetForm() {
        const formElements = document.querySelectorAll('input, select');
        formElements.forEach(el => {
            if (el.type === 'checkbox' || el.type === 'radio') {
                el.checked = false;
            } else {
                el.value = '';
            }
        });
    }

    // Event listener for Save button
    document.getElementById('save-btn').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent form submission
        saveData();
    });

    // Event listener for Load button
    document.getElementById('load-btn').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent form submission
        loadData();
    });

    // Event listener for Reset button
    document.getElementById('reset-btn').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent form submission
        resetForm();
    });

    // Event listener for Proceed button (example action)
    document.getElementById('proceed-btn').addEventListener('click', function (event) {
        // Log the action (you can also add additional action like preventing the default form submission if needed)
        console.log("Proceeding with booking!");

        // Step 1: Send a message to the background to open the new tab and automate the process
        chrome.runtime.sendMessage({ action: "openAndAutomate" }, (response) => {
            console.log(response.message); // Logs "Automation triggered" when successful
        });

        // Step 2: Query the active tab in the current window to inject the content script
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            // Inject the content script that will handle the autofill on the IRCTC pages
            chrome.scripting.executeScript(
                {
                    target: { tabId: tabs[0].id },
                    files: ['content.js'], // This will automate the actions on IRCTC pages
                },
                () => {
                    console.log('Content script injected successfully');
                }
            );
        });

        // Optional: Additional code for proceeding with the action (form submission, etc.) can go here
    });


});
