if (window.location.href.includes("/train-search")) {
  autofillJourneyDetails();

  // Click Search After Captch Fill
  document.querySelector('app-login button[type="submit"]').addEventListener('click', function () {

    setTimeout(() => {
      const searchButton = document.querySelector('button.search_btn.train_Search');
      if (searchButton) {
        searchButton.click();
      }
    }, 1000);
  });

}
else if (window.location.href.includes("/train-list")) {

  const modifySearchBtn = document.querySelector('app-train-list app-modify-search button.hidden-xs.search_btn');
  
  if (!modifySearchBtn) {
    alert("Modify search button not found!");
   // return; // Exit early if button is missing
  }

  // Get journey details from storage
  chrome.storage.sync.get('journeyDetails', function (result) {
    if (!result.journeyDetails) {
      alert('Journey details not found');
     // return; // Exit early if journey details are missing
    }

    const journeyClassCode = result.journeyDetails.journeyClassCode;
    console.log('Journey Class Code:', journeyClassCode);

    // Ensure journeyClassCode is not undefined before using it
    if (!journeyClassCode) {
      alert('Journey class code is missing.');
     // return; // Exit early if class code is missing
    }

    let currentDate = new Date();
    let requiredDate = new Date();

    // Set the required time based on the journey class code
    if (["1A", "2A", "3A", "CC", "EC", "3E"].includes(journeyClassCode.toUpperCase())) {
      requiredDate.setHours(10, 4, 0, 0); // Set to 10:00 AM
    } else {
      requiredDate.setHours(17, 32, 0, 0); // Set to 14:38 PM (example)
    }

    console.log('Required Date:', requiredDate);
    console.log('Current Date:', currentDate);

    // Function to click the modify search button
    const clickModifySearchButton = () => {
      modifySearchBtn.click();
      console.log("Clicking Modify Search Button...");
    };

    // Calculate the time difference and set a timeout to trigger at the exact time
    const timeDifference = requiredDate - currentDate;

    // If the required date is already passed, call selectJourney immediately
    if (currentDate >= requiredDate) {
      selectJourney();
      return; // Exit after calling selectJourney to avoid unnecessary further checks
    }

    // Start the continuous button clicking interval (every 3 seconds)
    const clickInterval = setInterval(() => {
      clickModifySearchButton();
    }, 3000); // Click every 3 seconds

    // Set a timeout to trigger selectJourney at the exact required time
    console.log("Setting timeout to trigger selectJourney at:", requiredDate);
    setTimeout(() => {
      clearInterval(clickInterval); // Stop the interval once the required time is reached
      console.log("Required time reached, calling selectJourney.");
      selectJourney(); // Call selectJourney at the exact time
    }, timeDifference); // Timeout will trigger when requiredDate is reached
  });

}
else if (window.location.href.includes("/psgninput")) {
  fillPassengerDetails();
}
else if (window.location.href.includes("/bkgPaymentOptions")) {
  PayViaIrctcWallet();
}


// Autofill journey details
function autofillJourneyDetails() {
  chrome.storage.sync.get('journeyDetails', ({ journeyDetails }) => {
    if (journeyDetails) {
      ClickLogInButton();
      loadJourneyDetails();
      fillUserNameAndPassword();
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
  const logInBtn = loginModal.querySelector("button[type='submit']");
  const captchaElement = loginModal.querySelector("img.captcha-img");
  const captchaInput = loginModal.querySelector("#captcha");

  const userNameInput = loginModal.querySelector(
    "input[type='text'][formcontrolname='userid']"
  );
  const passwordInput = loginModal.querySelector(
    "input[type='password'][formcontrolname='password']"
  );

  chrome.storage.sync.get('loginDetails', ({ loginDetails }) => {
    if (loginDetails) {
      userNameInput.value = loginDetails['irctcLogin'];
      userNameInput.dispatchEvent(new Event("input"));
      userNameInput.dispatchEvent(new Event("change"));

      passwordInput.value = loginDetails['irctcPassword'];
      passwordInput.dispatchEvent(new Event("input"));
      passwordInput.dispatchEvent(new Event("change"));
    }
  });
}

function loadJourneyDetails() {

  chrome.storage.sync.get('journeyDetails', ({ journeyDetails }) => {
    if (journeyDetails) {
      const form = document.querySelector("app-jp-input form");
      const fromInputField = form.querySelector("#origin > span > input");
      fromInputField.value = journeyDetails['fromStation'] ? `${journeyDetails['fromStation']} - ${journeyDetails['fromStationCode']}` : "";
      fromInputField.dispatchEvent(new Event("keydown"));
      fromInputField.dispatchEvent(new Event("input"));

      const destinationInputField = form.querySelector(
        "#destination > span > input"
      );
      destinationInputField.value = journeyDetails['toStation'] ? `${journeyDetails['toStation']} - ${journeyDetails['toStationCode']}` : "";
      destinationInputField.dispatchEvent(new Event("keydown"));
      destinationInputField.dispatchEvent(new Event("input"));

      const dateInputField = form.querySelector("#jDate > span > input");
      dateInputField.value = journeyDetails['journeyDate'].split('-').reverse().join('/');
      dateInputField.dispatchEvent(new Event("keydown"));
      dateInputField.dispatchEvent(new Event("input"));


      const jClassField = form.querySelector("#journeyClass");
      const jClassArrowBtn = jClassField.querySelector("div > div[role='button']");
      jClassArrowBtn.click();
      addDelay(300);
      [...jClassField.querySelectorAll("ul li")]
        .filter(
          (e) =>
            e.innerText === journeyDetails['journeyClass'] ?? ""
        )[0]
        ?.click(); //handle error here
      addDelay(300);

      const quotaField = form.querySelector("#journeyQuota");
      const quotaArrowBtn = quotaField.querySelector("div > div[role='button']");
      quotaArrowBtn.click();
      [...quotaField.querySelectorAll("ul li")]
        .filter(
          (e) =>
            e.innerText === journeyDetails['quota'] ?? ""
        )[0]
        ?.click(); //handle error here

      //  addDelay(300);
      const searchBtn = form.querySelector(
        "button.search_btn.train_Search[type='submit']"
      );
    }
  });
}


// Function to select a journey
function selectJourney() {
  chrome.storage.sync.get('journeyDetails', ({ journeyDetails }) => {
    if (journeyDetails) {
      if (!journeyDetails["trainNo"]) return;

      const train_list_parent = document.querySelector("#divMain > div > app-train-list");
      const train_list = [...train_list_parent.querySelectorAll(".tbis-div app-train-avl-enq")];

      // Get the train based on the journey number
      const myTrain = train_list.filter((train) =>
        train.querySelector("div.train-heading").innerText.trim().includes(journeyDetails["trainNo"])
      )[0];

      if (!myTrain) {
        statusUpdate("journey_selection_stopped.no_train");
        return;
      }

      const jClass = journeyDetails["journeyClass"];
      const tempDate = new Date(journeyDetails["journeyDate"]).toString().split(" ");

      const myClassToClick = [...myTrain.querySelectorAll("table tr td div.pre-avl")]
        .filter((c) => c.querySelector("div").innerText === jClass)[0];

      const config = { attributes: false, childList: true, subtree: true };

      // Click the class div if found
      if (myClassToClick) {
        myClassToClick.click();
      }

      const fetchAvailableSeatsCallback = (mutationList, observer) => {
        //console.log("fetchAvailableSeatsCallback -1", Date.now());
        addDelay(800);
       // console.log("fetchAvailableSeatsCallback -2", Date.now());

        const myClassToClick = [...myTrain.querySelectorAll("table tr td div.pre-avl")]
          .filter((c) => c.querySelector("div").innerText === jClass)[0];

        const myClassTabToClick = [...myTrain.querySelectorAll("div p-tabmenu ul[role='tablist'] li[role='tab']")]
          .filter((c) => c.querySelector("div").innerText === jClass)[0];

        const myClassTabToSelect = [...myTrain.querySelectorAll("div div table td div.pre-avl")]
          .filter((c) =>
            c.querySelector("div").innerText === `${tempDate[0]}, ${tempDate[2]} ${tempDate[1]}`
          )[0];

        const bookBtn = myTrain.querySelector("button.btnDefault.train_Search.ng-star-inserted");

        if (myClassToClick) {
          if (myClassToClick.classList.contains("selected-class")) {
            addDelay(300);
            bookBtn.click();
            observer.disconnect();
          } else {
            addDelay(300);
            myClassToClick.click();
          }
        } else if (myClassTabToClick) {
          if (!myClassTabToClick.classList.contains("ui-state-active")) {
            addDelay(300);
            myClassTabToClick.click();
            return;
          } else if (myClassTabToSelect) {
            if (myClassTabToSelect.classList.contains("selected-class")) {
              addDelay(500);
              bookBtn.click();
              observer.disconnect();
            } else {
              addDelay(500);
              myClassTabToSelect.click();
            }
          }
        }
      };

      // Observe the changes in the train class
      const observer = new MutationObserver(fetchAvailableSeatsCallback);
      observer.observe(myTrain, config);
    }
  });
}

// function fillPassengerDetails() {
//   chrome.storage.sync.get('passengerAndAdditionalDetails', ({ passengerAndAdditionalDetails }) => {
//     if (passengerAndAdditionalDetails) {
//       const parentElement = document.querySelector("app-passenger-input");
//       let count = 1;

//       // Loop through passenger data and simulate clicks for UI panel to expand if necessary
//       while (count < passengerAndAdditionalDetails.passengers.length) {
//         addDelay(200);
//         parentElement
//           .querySelector(
//             "#ui-panel-13-content div.zeroPadding.pull-left.ng-star-inserted a span.prenext"
//           )
//           ?.click();
//         count++;
//       }


//       const passengerList = [...parentElement.querySelectorAll("app-passenger")];

//       // Fill passenger details
//       passengerAndAdditionalDetails.passengers.forEach((passenger, index) => {
//         if (index < passengerList.length) {
//           let name_input_field = passengerList[index].querySelector(
//             "p-autocomplete[formcontrolname='passengerName'] input[placeholder='Passenger Name']"
//           );
//           if (name_input_field) {
//             name_input_field.value = passenger.name;
//             name_input_field.dispatchEvent(new Event("input"));
//           }

//           let age_input_field = passengerList[index].querySelector(
//             "input[type='number'][formcontrolname='passengerAge']"
//           );
//           if (age_input_field) {
//             age_input_field.value = passenger.age;
//             age_input_field.dispatchEvent(new Event("input"));
//           }

//           let gender_select_field = passengerList[index].querySelector(
//             "select[formcontrolname='passengerGender']"
//           );
//           if (gender_select_field) {
//             gender_select_field.value = passenger.gender;
//             gender_select_field.dispatchEvent(new Event("change"));
//           }

//           let berth_select_field = passengerList[index].querySelector(
//             "select[formcontrolname='passengerBerthChoice']"
//           );
//           if (berth_select_field) {
//             berth_select_field.value = passenger.berth;
//             berth_select_field.dispatchEvent(new Event("change"));
//           }
//         }
//       });

//       // Fill contact details
//       let number_input_field = parentElement.querySelector(
//         "input#mobileNumber[formcontrolname='mobileNumber'][name='mobileNumber']"
//       );
//       if (number_input_field) {
//         number_input_field.value = passengerAndAdditionalDetails["mobileNumber"];
//         number_input_field.dispatchEvent(new Event("input"));
//       }

//       // Fill other preferences
//       let autoUpgradationInput = parentElement.querySelector(
//         "input#autoUpgradation[type='checkbox'][formcontrolname='autoUpgradationSelected']"
//       );
//       if (autoUpgradationInput)
//         autoUpgradationInput.checked =
//           passengerAndAdditionalDetails["autoUpgradation"] ?? false;

//       let confirmberthsInput = parentElement.querySelector(
//         "input#confirmberths[type='checkbox'][formcontrolname='bookOnlyIfCnf']"
//       );
//       if (confirmberthsInput)
//         confirmberthsInput.checked =
//           passengerAndAdditionalDetails["confirmBerths"] ?? false;

//       // Fill insurance details
//       let insuranceOptionsRadios = [
//         ...parentElement.querySelectorAll(
//           `p-radiobutton[formcontrolname='travelInsuranceOpted'] input[type='radio'][name='travelInsuranceOpted-0']`
//         ),
//       ];
//       addDelay(400); // Simulate delay
//       insuranceOptionsRadios
//         .filter(
//           (r) =>
//             r.value ===
//             (passengerAndAdditionalDetails["travelInsuranceOpted"] === "yes"
//               ? "true"
//               : "false")
//         )[0]
//         ?.click();

//       // Fill payment details
//       let paymentOptionsRadios = [
//         ...parentElement.querySelectorAll(
//           `p-radiobutton[formcontrolname='paymentType'][name='paymentType'] input[type='radio']`
//         ),
//       ];
//       addDelay(300); // Simulate delay
//       paymentOptionsRadios
//         .filter(
//           // (r) => r.value === user_data["payment_preferences"].paymentType.toString()
//           (r) => r.value === "3"
//         )[0]
//         ?.click();

//       // submit form
//       addDelay(300);
//       console.log("submitting", Date.now());
//       parentElement
//         .querySelector(
//           "#psgn-form > form div > button.train_Search.btnDefault[type='submit']"
//         )
//         ?.click();
//     }
//     else {
//       alert('Passenger Deatils Not Found');
//     }
//   });
// }


function fillPassengerDetails() {
  chrome.storage.sync.get('passengerAndAdditionalDetails', ({ passengerAndAdditionalDetails }) => {
    try {
      if (passengerAndAdditionalDetails) {
        // Assign values to local variables
        const passengers = passengerAndAdditionalDetails.passengers;
        const mobileNumber = passengerAndAdditionalDetails["mobileNumber"];
        const autoUpgradation = passengerAndAdditionalDetails["autoUpgradation"] ?? false;
        const confirmBerths = passengerAndAdditionalDetails["confirmBerths"] ?? false;
        const travelInsuranceOpted = passengerAndAdditionalDetails["travelInsuranceOpted"];
        const selectedPaymentType = "3"; // Assuming this is the payment option you want

        const parentElement = document.querySelector("app-passenger-input");
        if (!parentElement) {
          alert("Parent element not found.");
          return;
        }

        let count = 1;
        // Loop through passenger data and simulate clicks for UI panel to expand if necessary
        while (count < passengers.length) {
          addDelay(300);
          const nextButton = parentElement.querySelector("#ui-panel-13-content div.zeroPadding.pull-left.ng-star-inserted a span.prenext");
          if (nextButton) {
            nextButton.click();
          } else {
            alert("Failed to find next button to expand passenger details.");
            return;
          }
          count++;
        }

        const passengerList = [...parentElement.querySelectorAll("app-passenger")];
        addDelay(300);
        // Fill passenger details
        passengers.forEach((passenger, index) => {
          if (index < passengerList.length) {
            let name_input_field = passengerList[index].querySelector("p-autocomplete[formcontrolname='passengerName'] input[placeholder='Name']");
            if (name_input_field) {
              name_input_field.value = passenger.name;
              name_input_field.dispatchEvent(new Event("input"));
            } else {
              console.error(`Passenger ${index + 1}: Name input field not found.`);
            }

            let age_input_field = passengerList[index].querySelector("input[type='number'][formcontrolname='passengerAge']");
            if (age_input_field) {
              age_input_field.value = passenger.age;
              age_input_field.dispatchEvent(new Event("input"));
            } else {
              console.error(`Passenger ${index + 1}: Age input field not found.`);
            }

            let gender_select_field = passengerList[index].querySelector("select[formcontrolname='passengerGender']");
            if (gender_select_field) {
              gender_select_field.value = passenger.gender;
              gender_select_field.dispatchEvent(new Event("change"));
            } else {
              console.error(`Passenger ${index + 1}: Gender select field not found.`);
            }

            let berth_select_field = passengerList[index].querySelector("select[formcontrolname='passengerBerthChoice']");
            if (berth_select_field) {
              berth_select_field.value = passenger.berth;
              berth_select_field.dispatchEvent(new Event("change"));
            } else {
              console.error(`Passenger ${index + 1}: Berth select field not found.`);
            }
          }
        });

        // Fill contact details
        let number_input_field = parentElement.querySelector("input#mobileNumber[formcontrolname='mobileNumber'][name='mobileNumber']");
        if (number_input_field) {
          number_input_field.value = mobileNumber;
          number_input_field.dispatchEvent(new Event("input"));
        } else {
          console.error("Contact number input field not found.");
        }

        // Fill other preferences
        let autoUpgradationInput = parentElement.querySelector("input#autoUpgradation[type='checkbox'][formcontrolname='autoUpgradationSelected']");
        if (autoUpgradationInput) {
          autoUpgradationInput.checked = autoUpgradation;
        }

        let confirmberthsInput = parentElement.querySelector("input#confirmberths[type='checkbox'][formcontrolname='bookOnlyIfCnf']");
        if (confirmberthsInput) {
          confirmberthsInput.checked = confirmBerths;
        }

        // Fill insurance details
        let insuranceOptionsRadios = [...parentElement.querySelectorAll("p-radiobutton[formcontrolname='travelInsuranceOpted'] input[type='radio'][name='travelInsuranceOpted-0']")];
        addDelay(400); // Simulate delay
        const selectedInsurance = insuranceOptionsRadios.filter(r => r.value === (travelInsuranceOpted === "yes" ? "true" : "false"))[0];
        if (selectedInsurance) {
          selectedInsurance.click();
        } else {
          console.error("Travel insurance option not found.");
        }

        // Fill payment details
        let paymentOptionsRadios = [...parentElement.querySelectorAll("p-radiobutton[formcontrolname='paymentType'][name='paymentType'] input[type='radio']")];
        addDelay(300); // Simulate delay
        const selectedPaymentOption = paymentOptionsRadios.filter(r => r.value === selectedPaymentType)[0];
        if (selectedPaymentOption) {
          selectedPaymentOption.click();
        } else {
          console.error("Payment option not found.");
        }

        // Submit form
        addDelay(300);
        console.log("Submitting form", Date.now());
        const submitButton = parentElement.querySelector("#psgn-form > form div > button.train_Search.btnDefault[type='submit']");
        if (submitButton) {
          submitButton.click();
        } else {
          console.error("Submit button not found.");
        }
      } else {
        alert("Passenger details not found in storage.");
      }
    } catch (error) {
      console.error("Error in fillPassengerDetails:", error.message);
      alert(`Error: ${error.message}`);
    }
  });
}



function PayViaIrctcWallet() {
  const payment_parent_div = document.querySelector("app-payment-options  app-payment");
  const bankTypeDivs = payment_parent_div.querySelectorAll("div.bank-type");
  const payButton = payment_parent_div.querySelector("button.btn-primary");

  bankTypeDivs.forEach(div => {
    const span = div.querySelector("span.col-pad");
    if (span && span.textContent.trim() === "IRCTC eWallet") {
      div.click();
      addDelay(300);
      console.log(payButton);
      //payButton.click();
    }
  });
}

function addDelay(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}