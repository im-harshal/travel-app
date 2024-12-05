// Check if user is logged in
function checkLoginStatus() {
  $.ajax({
    url: "php/check_session.php",
    type: "GET",
    dataType: "json",
    success: function (response) {
      if (!response.loggedIn) {
        // Redirect to login page if not logged in
        window.location.href = "index.html";
      } else {
        $("#user-name").text(response.firstname + " " + response.lastname);

        // Toggle divs based on phone value
        if (response.phone === "222-222-2222") {
          $("#div-admin").show();
          $("#div-user").hide();
        } else {
          $("#div-admin").hide();
          $("#div-user").show();
        }
      }
    },
    error: function () {
      window.location.href = "index.html";
    },
  });
}

// Update datetime
function updateDateTime() {
  const now = new Date();
  $("#datetime").text(now.toLocaleString());
}

/**
 * Background color and font change common for all html pages
 */
// Color options configuration
const colors = [
  { label: "Light Beige", value: "#F5E6D3" },
  { label: "Light Blue", value: "#D8E5F7" },
  { label: "Soft White", value: "#FAF9F6" },
  { label: "Light Green", value: "#E0F0E3" },
  { label: "Beige", value: "#f5f5dc" },
];

// Initialize color options
function initColorOptions() {
  const colorOptionsContainer = document.getElementById("colorOptions");
  if (colorOptionsContainer) {
    colors.forEach((color) => {
      const button = document.createElement("button");
      button.className = "color-btn";
      button.style.backgroundColor = color.value;
      button.textContent = color.label;
      button.onclick = () => changeBackgroundColor(color.value);
      colorOptionsContainer.appendChild(button);
    });
  }
}

// Font size control
let currentFontSize = 16;

function initFontSizeControl() {
  const fontSizeSlider = document.getElementById("fontSizeSlider");
  const fontSizeDisplay = document.getElementById("fontSizeDisplay");

  if (fontSizeSlider) {
    fontSizeSlider.addEventListener("input", (e) => {
      const newSize = parseInt(e.target.value);
      updateFontSize(newSize);
    });
  }
}

function changeFontSize(delta) {
  const newSize = Math.min(Math.max(currentFontSize + delta, 12), 24);
  const slider = document.getElementById("fontSizeSlider");
  if (slider) {
    slider.value = newSize;
    updateFontSize(newSize);
  }
}

function updateFontSize(size) {
  currentFontSize = size;
  const display = document.getElementById("fontSizeDisplay");
  if (display) {
    display.textContent = size;
  }
  const mainDiv = document.querySelector(".main-content");
  if (mainDiv) {
    mainDiv.style.fontSize = `${size}px`;
  }
}

// Background color control
function changeBackgroundColor(color) {
  const mainContent = document.querySelector(".main-content");
  if (mainContent) {
    mainContent.style.backgroundColor = color;

    // Update selected state of color buttons
    const buttons = document.querySelectorAll(".color-btn");
    buttons.forEach((button) => {
      if (button.style.backgroundColor === color) {
        button.classList.add("selected");
      } else {
        button.classList.remove("selected");
      }
    });
  }
}
//--------------------------------------User Functions----------------------------------------
function searchByBookingId() {
  const bookingId = $("#booking-id").val();
  $.ajax({
    url: "php/user_booking_search.php",
    type: "POST",
    data: { bookingId: bookingId },
    success: function (response) {
      displaySearchResults(response, "user");
    },
    error: function () {
      $("#search-results").html(
        '<p class="text-red-500">Error searching booking</p>'
      );
    },
  });
}

function searchFlightsBySSN() {
  const ssn = $("#passenger-ssn").val();
  $.ajax({
    url: "php/user_flights_ssn_search.php",
    type: "POST",
    data: { ssn: ssn },
    success: function (response) {
      displaySearchResults(response, "user");
    },
    error: function () {
      $("#search-results").html(
        '<p class="text-red-500">Error searching flights</p>'
      );
    },
  });
}

function searchSeptemberBookings() {
  $.ajax({
    url: "php/user_sept_booking_search.php",
    type: "GET",
    success: function (response) {
      displaySearchResults(response, "user");
    },
    error: function () {
      $("#search-results").html(
        '<p class="text-red-500">Error fetching September bookings</p>'
      );
    },
  });
}

function searchFlightPassengers() {
  const flightBookingId = $("#flight-booking-id").val();
  $.ajax({
    url: "php/user_flight_pass_search.php",
    type: "POST",
    data: { flightBookingId: flightBookingId },
    success: function (response) {
      displaySearchResults(response, "user");
    },
    error: function () {
      $("#search-results").html(
        '<p class="text-red-500">Error searching passengers</p>'
      );
    },
  });
}

//---------------------------------------------Admin Functions------------------------------------------
function searchTexasHotels() {
  const city = $("#texas-hotel-city").val();
  $.ajax({
    url: "php/admin_texas_hotel_search.php",
    type: "POST",
    data: { city: city },
    success: function (response) {
      displaySearchResults(response, "admin");
    },
    error: function () {
      $("#admin-search-results").html(
        '<p class="text-red-500">Error searching Texas hotels</p>'
      );
    },
  });
}

function searchTexasFlights() {
  const city = $("#texas-city").val();
  $.ajax({
    url: "php/admin_texas_flight_search.php",
    type: "POST",
    data: { city: city },
    success: function (response) {
      displaySearchResults(response, "admin");
    },
    error: function () {
      $("#admin-search-results").html(
        '<p class="text-red-500">Error searching Texas flights</p>'
      );
    },
  });
}

function countCaliforniaFlights() {
  console.log("inside function");
  const city = $("#california-city").val();
  $.ajax({
    url: "php/admin_count_cali_flights_search.php",
    type: "POST",
    data: { city: city },
    success: function (response) {
      displaySearchResults(response, "admin");
    },
    error: function () {
      $("#admin-search-results").html(
        '<p class="text-red-500">Error counting California flights</p>'
      );
    },
  });
}

function searchExpensiveHotels() {
  $.ajax({
    url: "php/admin_exp_hotel_search.php",
    type: "GET",
    success: function (response) {
      displaySearchResults(response, "admin");
    },
    error: function () {
      $("#admin-search-results").html(
        '<p class="text-red-500">Error searching expensive hotels</p>'
      );
    },
  });
}

function searchExpensiveFlights() {
  $.ajax({
    url: "php/admin_exp_flight_search.php",
    type: "GET",
    success: function (response) {
      displaySearchResults(response, "admin");
    },
    error: function () {
      $("#admin-search-results").html(
        '<p class="text-red-500">Error searching expensive flights</p>'
      );
    },
  });
}

function searchInfantFlights() {
  $.ajax({
    url: "php/admin_infant_flight_search.php",
    type: "GET",
    success: function (response) {
      displaySearchResults(response, "admin");
    },
    error: function () {
      $("#admin-search-results").html(
        '<p class="text-red-500">Error searching flights with infants</p>'
      );
    },
  });
}

function searchInfantChildrenFlights() {
  $.ajax({
    url: "php/admin_infant_child_flight_search.php",
    type: "GET",
    success: function (response) {
      displaySearchResults(response, "admin");
    },
    error: function () {
      $("#admin-search-results").html(
        '<p class="text-red-500">Error searching flights with infants and children</p>'
      );
    },
  });
}

function searchTexasNoInfantFlights() {
  const city = $("#texas-city").val();
  $.ajax({
    url: "php/admin_noinfant_flight_search.php",
    type: "POST",
    data: { city: city },
    success: function (response) {
      displaySearchResults(response, "admin");
    },
    error: function () {
      $("#admin-search-results").html(
        '<p class="text-red-500">Error searching Texas flights without infants</p>'
      );
    },
  });
}

$(document).ready(function () {
  // Check login status immediately
  checkLoginStatus();
  initColorOptions();
  initFontSizeControl();
  // Update datetime every second
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // Check if the button should be disabled
  if (localStorage.getItem("flightsLoaded") === "true") {
    $("#load-flights-button")
      .prop("disabled", true)
      .text("Flight Data Loaded")
      .css("background-color", "#ccc");
  }
  // Add event listener for the "Load Flights" button
  $("#load-flights-button").on("click", function () {
    $.ajax({
      url: "php/load_flights.php",
      type: "POST",
      success: function (response) {
        alert(response); // Show success or error message
        if (response.trim() === "Flights loaded successfully!") {
          $("#load-flights-button")
            .prop("disabled", true)
            .text("Flight Data Loaded")
            .css("background-color", "#ccc");
          localStorage.setItem("flightsLoaded", "true"); // Persist state
        }
      },
      error: function () {
        alert("An error occurred while loading flights.");
      },
    });
  });

  // Check if the button should be disabled
  if (localStorage.getItem("hotelsLoaded") === "true") {
    $("#load-hotels-button")
      .prop("disabled", true)
      .text("Hotel Data Loaded")
      .css("background-color", "#ccc");
  }

  // Add event listener for the "Load Hotels" button
  $("#load-hotels-button").on("click", function () {
    $.ajax({
      url: "php/load_hotels.php",
      type: "POST",
      success: function (response) {
        alert(response); // Show success or error message
        if (response.trim() === "Hotels loaded successfully!") {
          $("#load-hotels-button")
            .prop("disabled", true)
            .text("Hotel Data Loaded")
            .css("background-color", "#ccc");
          localStorage.setItem("hotelsLoaded", "true"); // Persist state
        }
      },
      error: function () {
        alert("An error occurred while loading hotels.");
      },
    });
  });

  // Bind click events for admin search options
  $("#admin-search-texas-hotels-btn").on("click", searchTexasHotels);
  $("#admin-search-texas-flights-btn").on("click", searchTexasFlights);
  $("#admin-count-cali-flights-btn").on("click", countCaliforniaFlights);
  $("#admin-search-exp-hotels-btn").on("click", searchExpensiveHotels);
  $("#admin-search-exp-flights-btn").on("click", searchExpensiveFlights);
  $("#admin-search-infant-flights-btn").on("click", searchInfantFlights);
  $("#admin-search-infant-child-flights-btn").on(
    "click",
    searchInfantChildrenFlights
  );
  $("#admin-search-texas-noinfants-flights-btn").on(
    "click",
    searchTexasNoInfantFlights
  );

  // Bind click events for user search options
  $("#user-search-booking-btn").on("click", searchByBookingId);
  $("#user-search-ssn-btn").on("click", searchFlightsBySSN);
  $("#user-search-passengers-btn").on("click", searchFlightPassengers);
  $("#user-search-september-btn").on("click", searchSeptemberBookings);
});

// Format dates in a readable way
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

// Format currency values
function formatCurrency(amount) {
  if (amount === null || amount === undefined) return "";
  return "$" + parseFloat(amount).toFixed(2);
}

// Create a table from an array of objects
function createTable(data) {
  if (!data || data.length === 0) {
    return '<p class="text-red-500">No results found</p>';
  }

  const headers = Object.keys(data[0]);
  let tableHTML =
    '<div class="overflow-x-auto"><table class="min-w-full bg-white border border-gray-300">';

  // Create header row
  tableHTML += '<thead class="bg-gray-100"><tr>';
  headers.forEach((header) => {
    const formattedHeader = header
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    tableHTML += `<th class="px-4 py-2 border-b text-left">${formattedHeader}</th>`;
  });
  tableHTML += "</tr></thead>";

  // Create data rows
  tableHTML += "<tbody>";
  data.forEach((row) => {
    tableHTML += '<tr class="hover:bg-gray-50">';
    headers.forEach((header) => {
      let cellValue = row[header];

      // Format specific types of data
      if (header.toLowerCase().includes("date")) {
        cellValue = formatDate(cellValue);
      } else if (
        header.toLowerCase().includes("price") ||
        header.toLowerCase().includes("cost")
      ) {
        cellValue = formatCurrency(cellValue);
      }

      tableHTML += `<td class="px-4 py-2 border-b">${cellValue || ""}</td>`;
    });
    tableHTML += "</tr>";
  });
  tableHTML += "</tbody></table></div>";

  return tableHTML;
}

// Main function to handle the AJAX success response
function displaySearchResults(response, user_type) {
  var searchResults = document.getElementById("search-results");
  if (user_type === "admin") {
    searchResults = document.getElementById("admin-search-results");
  }

  try {
    // Parse the response if it's a string
    const data = typeof response === "string" ? JSON.parse(response) : response;
    // Handle error responses
    if (data.error) {
      searchResults.innerHTML = `<p class="text-red-500">Error: ${data.error}</p>`;
      return;
    }

    // Handle empty responses
    if (!data || (Array.isArray(data) && data.length === 0)) {
      searchResults.innerHTML = '<p class="text-gray-500">No results found</p>';
      return;
    }

    // Create and display the formatted table
    searchResults.innerHTML = createTable(Array.isArray(data) ? data : [data]);

    // Add a count if it's an array of results
    if (Array.isArray(data) && data.length > 0) {
      const countDiv = document.createElement("div");
      countDiv.className = "mt-4 text-gray-600";
      countDiv.textContent = `Total results: ${data.length}`;
      searchResults.appendChild(countDiv);
    }
  } catch (error) {
    console.log("Error log : ", response);
    searchResults.innerHTML = `<p class="text-red-500">Error processing results: ${error.message}</p>`;
  }
}
