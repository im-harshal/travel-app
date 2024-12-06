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
  
  
  document.addEventListener("DOMContentLoaded", function () {
    // Retrieve hotel details from localStorage
    const hotelDetails = JSON.parse(localStorage.getItem("selectedHotel"));

    if (!hotelDetails) {
        document.getElementById("cart-details").innerHTML = "<p>No hotel selected!</p>";
        return;
    }

    // Display hotel details
    document.getElementById("cart-details").innerHTML = `
        <h3>Booking Details</h3>
        <p><strong>Hotel Name:</strong> ${hotelDetails.hotelName}</p>
        <p><strong>City:</strong> ${hotelDetails.city}</p>
        <p><strong>Price per Night:</strong> $${hotelDetails.pricePerNight}</p>
        <p><strong>Number of Rooms:</strong> ${hotelDetails.numberOfRooms}</p>
        <p><strong>Total Price:</strong> $${hotelDetails.totalPrice}</p>
        <p><strong>Check-in Date:</strong> ${hotelDetails.checkInDate}</p>
        <p><strong>Check-out Date:</strong> ${hotelDetails.checkOutDate}</p>
        <h3>Guest Details</h3>
        <div id="guest-forms"></div>
        <button id="submitBooking">Book Now</button>
    `;

    // Generate guest forms
    generateGuestForms(hotelDetails);

    // Handle booking submission
    document.getElementById("submitBooking").addEventListener("click", function () {
        submitBooking(hotelDetails);
    });
});

function generateGuestForms(hotelDetails) {
    const totalGuests = hotelDetails.guests.adults + hotelDetails.guests.children + hotelDetails.guests.infants;
    const guestFormsContainer = document.getElementById("guest-forms");

    for (let i = 1; i <= totalGuests; i++) {
        guestFormsContainer.innerHTML += `
            <div class="guest-form">
                <h4>Guest ${i}</h4>
                <label>First Name: <input type="text" class="first-name" required /></label><br />
                <label>Last Name: <input type="text" class="last-name" required /></label><br />
                <label>Date of Birth: <input type="date" class="dob" required /></label><br />
                <label>SSN: <input type="text" class="ssn" required /></label><br />
                <label>Category:
                    <select class="category" required>
                        <option value="adults">Adults</option>
                        <option value="children">Children</option>
                        <option value="infants">Infants</option>
                    </select>
                </label>
            </div>
        `;
    }
}

function submitBooking(hotelDetails) {
    // Collect guest details
    const guests = [];
    document.querySelectorAll(".guest-form").forEach(form => {
        guests.push({
            firstName: form.querySelector(".first-name").value,
            lastName: form.querySelector(".last-name").value,
            dob: form.querySelector(".dob").value,
            ssn: form.querySelector(".ssn").value,
            category: form.querySelector(".category").value
        });
    });

    // Send data to the server
    $.ajax({
        url: "php/bookHotel.php",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ hotelDetails, guests }),
        success: function (response) {
            console.log("Booking Response:", response);
            displayBookingDetails(response); // Display booking and guest details directly
        },
        error: function (xhr, status, error) {
            console.error("Error while booking:", error);
            alert("An error occurred while booking. Please try again.");
        }
    });
}

function displayBookingDetails(response) {
    const cartDetails = document.getElementById("cart-details");
    cartDetails.innerHTML = `
        <h3>Booking Confirmed</h3>
        <p><strong>Hotel Booking ID:</strong> ${response.bookingId}</p>
        <p><strong>Hotel Name:</strong> ${response.hotelName}</p>
        <p><strong>City:</strong> ${response.city}</p>
        <p><strong>Price per Night:</strong> $${response.pricePerNight}</p>
        <p><strong>Number of Rooms:</strong> ${response.numberOfRooms}</p>
        <p><strong>Total Price:</strong> $${response.totalPrice}</p>
        <p><strong>Check-in Date:</strong> ${response.checkInDate}</p>
        <p><strong>Check-out Date:</strong> ${response.checkOutDate}</p>
        <h3>Guest Details</h3>
        ${response.guests
            .map(
                guest => `
                <p><strong>SSN:</strong> ${guest.ssn}</p>
                <p><strong>Name:</strong> ${guest.firstName} ${guest.lastName}</p>
                <p><strong>Date of Birth:</strong> ${guest.dob}</p>
                <p><strong>Category:</strong> ${guest.category}</p>
            `
            )
            .join("")}
    `;
}
$(document).ready(function () {
    // Check login status immediately
    initColorOptions();
    initFontSizeControl();
    // Update datetime every second
    updateDateTime();
    setInterval(updateDateTime, 1000);
  });