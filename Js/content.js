// Execute autofill based on URL
if (window.location.href.includes("/train-search")) {
    autofillJourneyDetails();
} else if (window.location.href.includes("/psgninput")) {
    autofillPassengerDetails();
}



// Autofill journey details
function autofillJourneyDetails() {
    chrome.storage.sync.get("journeyDetails", ({ journeyDetails }) => {
        if (journeyDetails) {
            ClickLogInButton();
            fillUserNameAndPassword();
            processCaptchaAndLoginButton();
            // SelectSource();
            // SelectJourneyDate();
            // SelectSeatType();
            // SelectQuotaType();


            // // Example function that runs after a 2-second delay
            // setTimeout(() => {
            //     console.log("Entered In Destination After Delay");
            //     SelectDestination();
            // }, 5000); // 2000 milliseconds = 2 seconds

        }
    });
}

// Autofill passenger details
function autofillPassengerDetails() {
    chrome.storage.sync.get("passengerAndAdditionalDetails", ({ passengerAndAdditionalDetails }) => {
        if (passengerAndAdditionalDetails) {
            const passengers = passengerAndAdditionalDetails.passengers;
            passengers.forEach((passenger, index) => {
                document.querySelector(`#passengerName${index + 1}`).value = passenger.name;
                document.querySelector(`#passengerAge${index + 1}`).value = passenger.age;
                document.querySelector(`#passengerGender${index + 1}`).value = passenger.gender;
            });

            document.querySelector("#mobileNumber").value = passengerAndAdditionalDetails.mobileNumber;
            document.querySelector("#autoUpgradation").checked = passengerAndAdditionalDetails.autoUpgradation;
            document.querySelector("#confirmBerths").checked = passengerAndAdditionalDetails.confirmBerths;
            document.querySelector("#travelInsuranceOpted").checked = passengerAndAdditionalDetails.travelInsuranceOpted;
            console.log("Passenger details autofilled");
        }
    });
}

function ClickLogInButton() {
    const loginButton = document.querySelector('a.search_btn.loginText');

    if (loginButton) {
        loginButton.click();
        console.log("Login button clicked.");
    } else {
        alert("Login button not found.");
    }
}

// Function to autofill UserName and Password
function fillUserNameAndPassword() {

    const loginModal = document.querySelector("#divMain > app-login");
    const userNameInput = loginModal.querySelector(
        "input[type='text'][formcontrolname='userid']"
    );
    const passwordInput = loginModal.querySelector(
        "input[type='password'][formcontrolname='password']"
    );

    const submitBtn = loginModal.querySelector("button[type='submit']");

    userNameInput.value = "an274304";
    userNameInput.dispatchEvent(new Event("input"));
    userNameInput.dispatchEvent(new Event("change"));

    passwordInput.value = "Anand@02";
    passwordInput.dispatchEvent(new Event("input"));
    passwordInput.dispatchEvent(new Event("change"));
}

// Function to process CAPTCHA and return a promise
function processCaptchaAndLoginButton() {
    let api = "https://script.google.com/macros/s/AKfycbz5tXQnhmXd0kcGR0GYaC2Y6lk1rMCS5uerAk8xmXrAauiNJB1n9mN__RvTnprO61sNdA/exec";
    const signInButton = document.querySelector("#divMain > app-login > button[type='submit']");

    // Function to check if captcha image exists and process it

        const captchaComponent = document.querySelector('app-captcha');
        const imgElement = captchaComponent ? captchaComponent.querySelector('.captcha-img') : null;

        if (imgElement) {
            // Extract the src attribute value (Base64)
            const srcValue = imgElement.src;
            let b64 = srcValue.split("base64,")[1];
            let fileType = "image/jpg"; // The MIME type of the file
            let fileName = "example.jpg"; // The file name

            // Make API call to process the CAPTCHA
            fetch(api, {
                method: "POST",
                body: JSON.stringify({
                    file: b64,
                    type: fileType,
                    name: fileName
                })
            })
            .then(res => res.text())
            .then(data => {

                // Autofill Captcha Input with human-like typing
                const captchaInput = captchaComponent ? captchaComponent.querySelector('#captcha') : null;
                if (captchaInput) {

                    const captchaValue = setCaptchaValue(data); // Assuming 'data' contains the CAPTCHA result
                    captchaInput.value = captchaValue;
                    captchaInput.dispatchEvent(new Event("input"));
                    captchaInput.dispatchEvent(new Event("change"));

                    // Add a delay to simulate human-like behavior
                    addDelay(500);

                    // Click the Sign In button after the delay
                    signInButton.click();
                }
            })
            .catch(error => {
                // Handle errors, set error message in captcha input
                console.log(error);
                if (captchaComponent) {
                    const captchaInput = captchaComponent.querySelector('#captcha');
                    if (captchaInput) {
                        captchaInput.value = "An_error_Captcha_Process";
                    }
                }
            });


        }
        else {
            console.log("Captcha Not  found");
        }
  
}


function SelectSource() {
    try {
        // Select the input field using the `aria-controls` attribute
        const inputField = document.querySelector('input[aria-controls="pr_id_1_list"]');
        if (!inputField) {
            console.error("Input field not found.");
            return;
        }

        // Set the value of the input field
        inputField.value = "GKP";

        // Trigger the input event to notify the autocomplete component of the change
        const inputEvent = new Event('input', { bubbles: true });
        inputField.dispatchEvent(inputEvent);

        // Simulate typing to trigger dropdown if necessary
        const keyUpEvent = new KeyboardEvent('keyup', { bubbles: true, key: inputField.value.slice(-1) });
        inputField.dispatchEvent(keyUpEvent);

        // Wait for the dropdown to populate
        setTimeout(() => {
            // Get the dropdown list by its ID
            const dropdownList = document.getElementById('pr_id_1_list');
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
            console.log("Source item selected:", firstItem.textContent.trim());
        }, 1000); // Adjust timeout based on the autocomplete delay
    } catch (error) {
        console.error("Error handling autocomplete:", error.message);
    }
}

function SelectDestination() {
    try {
        // Select the input field using the `aria-controls` attribute
        const inputField2 = document.querySelector('input[aria-controls="pr_id_2_list"]');
        if (!inputField2) {
            console.error("Destinstion Input field not found.");
            return;
        }

        // Focus on the input field to activate the autocomplete
        inputField2.focus();

        // Set the value of the input field to trigger autocomplete
        const destination = "GWL";
        inputField2.value = destination;

        // Trigger input event to notify Angular's change detection
        const inputEvent = new Event('input', { bubbles: true });
        inputField2.dispatchEvent(inputEvent);

        // Trigger keyup event to simulate typing
        const keyUpEvent = new KeyboardEvent('keyup', { bubbles: true, key: destination.slice(-1) });
        inputField2.dispatchEvent(keyUpEvent);

        // Retry logic to wait for the dropdown to populate
        const maxRetries = 10; // Maximum number of retries
        let retries = 0;

        function attemptSelect() {
            // Get the dropdown list by its ID
            const dropdownList = document.getElementById('pr_id_2_list');
            if (dropdownList) {
                const firstItem = dropdownList.querySelector('li[role="option"]');
                if (firstItem) {
                    // Simulate a click on the first list item
                    firstItem.click();
                    console.log("Destination selected:", firstItem.textContent.trim());
                    return;
                }
            }

            retries++;
            if (retries < maxRetries) {
                console.log("Retrying to populate destination dropdown...");
                setTimeout(attemptSelect, 200); // Retry after 200ms
            } else {
                console.error("Failed to populate and select destination after retries.");
            }
        }

        // Start the retry mechanism
        attemptSelect();
    } catch (error) {
        console.error("Error in SelectDestination:", error.message);
    }
}

function SelectJourneyDate() {
    try {
        // Select the calendar input field by its `formcontrolname` attribute
        const calendarInput = document.querySelector('p-calendar[formcontrolname="journeyDate"] input[type="text"]');
        if (!calendarInput) {
            console.error("Calendar input field not found.");
            return;
        }

        // Set the desired date in the `dd/mm/yyyy` format
        const desiredDate = "27/12/2024"; // Example: today's date

        // Assign the date value to the input field
        calendarInput.value = desiredDate;

        // Trigger the 'input' event to notify the Angular component of the change
        const inputEvent = new Event('input', { bubbles: true });
        calendarInput.dispatchEvent(inputEvent);

        // Optionally, trigger a 'change' event if required by the component
        const changeEvent = new Event('change', { bubbles: true });
        calendarInput.dispatchEvent(changeEvent);

        console.log("Date set successfully:", desiredDate);
    } catch (error) {
        console.error("Error setting date:", error.message);
    }
}

function SelectSeatType() {
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
}

function SelectQuotaType() {
    // Step 1: Trigger the click event to open the dropdown
    const ticketTypeDropdownTrigger = document.querySelector('#journeyQuota .ui-dropdown-trigger');
    ticketTypeDropdownTrigger.click();  // This will open the dropdown

    // Step 2: Find the option with the text 'TATKAL'
    const ticketTypeDropdownOption = Array.from(document.querySelectorAll('#journeyQuota .ui-dropdown-item'))
        .find(item => item.textContent.trim() === 'TATKAL');

    // Step 3: Select the option if it exists
    if (ticketTypeDropdownOption) {
        ticketTypeDropdownOption.click();  // Click the option to select it
    }
}

// Function to filter and return the CAPTCHA value
function setCaptchaValue(data) {
    // Allow alphanumeric characters and special characters (retain them as is)
    const filteredData = data.replace(/[^a-zA-Z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?/|\\`~\-]/g, '');

    return filteredData;  // Return the filtered CAPTCHA value
}

// Add Delay in ms
function addDelay(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
