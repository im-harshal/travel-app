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

document.getElementById("searchButton").addEventListener("click", function () {
    const city = document.getElementById("city").value.trim();
    const checkInDate = new Date(document.getElementById("checkInDate").value);
    const checkOutDate = new Date(document.getElementById("checkOutDate").value);
    const adults = parseInt(document.getElementById("adults").value, 10) || 0;
    const children = parseInt(document.getElementById("children").value, 10) || 0;
    const infants = parseInt(document.getElementById("infants").value, 10) || 0;

    // Validate inputs
    const minDate = new Date("2024-09-01");
    const maxDate = new Date("2024-12-01");

    if (checkInDate < minDate || checkOutDate > maxDate || checkInDate >= checkOutDate) {
        alert("Dates must be between Sep 1, 2024, and Dec 1, 2024. Check-out must be after check-in.");
        return;
    }

    const validCities = ["Austin", "Dallas", "Houston", "Los Angeles", "San Francisco", "San Diego"];
    if (!validCities.includes(city)) {
        alert("Invalid city. Please select a city in Texas or California.");
        return;
    }

    const totalGuests = adults + children;
    if (totalGuests > 2 && infants === 0) {
        alert("Maximum of 2 guests per room, except for infants.");
        return;
    }

    // Calculate number of rooms needed
    const roomsNeeded = Math.ceil(totalGuests / 2);

    // Display search criteria
    document.getElementById("results").innerHTML = `
        <p><strong>Search Criteria:</strong></p>
        <p>City: ${city}</p>
        <p>Check-in Date: ${checkInDate.toDateString()}</p>
        <p>Check-out Date: ${checkOutDate.toDateString()}</p>
        <p>Guests: Adults (${adults}), Children (${children}), Infants (${infants})</p>
        <p>Rooms Needed: ${roomsNeeded}</p>
        <h3>Available Hotels:</h3>
    `;

    // Call AJAX function to search hotels
    searchHotels(city);
});

function searchHotels(city) {
    $.post("php/searchHotels.php", { city: city }, function (data) {
        // Log the raw response to the console for debugging
        console.log("Response data:", data);

        // Ensure the response is an array
        if (!Array.isArray(data)) {
            try {
                data = JSON.parse(data); // Parse if response is a JSON string
            } catch (error) {
                console.error("Invalid JSON response:", error);
                document.getElementById("results").innerHTML = "<p>An error occurred while processing the response.</p>";
                return;
            }
        }

        if (data.length === 0) {
            document.getElementById("results").innerHTML = "<p>No hotels found for the selected city.</p>";
            return;
        }

        let resultsHtml = "<ul>";
        data.forEach(hotel => {
            resultsHtml += `
                <li>
                    <strong>${hotel.hotel_name}</strong> - $${hotel.price_per_night} per night
                    <button onclick="redirectToCart('${hotel.hotel_id}', '${hotel.hotel_name}', '${hotel.price_per_night}', '${hotel.city}')">
                        Select
                    </button>
                </li>
            `;
        });
        resultsHtml += "</ul>";
        document.getElementById("results").innerHTML = resultsHtml;
    }).fail(function () {
        alert("An error occurred while fetching hotels. Please try again.");
    });
}


function redirectToCart(hotelId, hotelName, pricePerNight, city) {
    const checkInDate = document.getElementById("checkInDate").value;
    const checkOutDate = document.getElementById("checkOutDate").value;
    const adults = parseInt(document.getElementById("adults").value, 10) || 0;
    const children = parseInt(document.getElementById("children").value, 10) || 0;
    const infants = parseInt(document.getElementById("infants").value, 10) || 0;

    const numberOfRooms = Math.ceil((adults + children) / 2);

    const hotelDetails = {
        hotelId,
        hotelName,
        city,
        pricePerNight,
        checkInDate,
        checkOutDate,
        numberOfRooms,
        totalPrice: numberOfRooms * parseFloat(pricePerNight),
        guests: {
            adults,
            children,
            infants
        }
    };

    localStorage.setItem("selectedHotel", JSON.stringify(hotelDetails));
    window.location.href = "cartstay.html";
}


function bookHotel() {
    const hotelDetails = JSON.parse(localStorage.getItem("selectedHotel"));
    const guests = []; // Array to store guest details

    document.querySelectorAll(".guest-form").forEach(form => {
        guests.push({
            firstName: form.querySelector(".first-name").value,
            lastName: form.querySelector(".last-name").value,
            dob: form.querySelector(".dob").value,
            ssn: form.querySelector(".ssn").value,
            category: form.querySelector(".category").value
        });
    });

    $.ajax({
        url: "php/bookHotel.php",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ hotelDetails, guests }),
        success: function (response) {
            alert("Booking successful!");
        },
        error: function () {
            alert("Error occurred while booking. Please try again.");
        }
    });
}


function addToCart(hotelId, hotelName, pricePerNight) {
    const checkInDate = document.getElementById("checkInDate").value;
    const checkOutDate = document.getElementById("checkOutDate").value;
    const numberOfRooms = Math.ceil((parseInt(document.getElementById("adults").value) + parseInt(document.getElementById("children").value)) / 2);
    const totalPrice = numberOfRooms * pricePerNight;

    alert(`Hotel ${hotelName} added to cart!\nTotal Price: $${totalPrice}`);

    const cartData = {
        hotel_id: hotelId,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        number_of_rooms: numberOfRooms,
        price_per_night: pricePerNight,
        total_price: totalPrice
    };

    bookHotel(cartData);
}

$(document).ready(function () {
    // Check login status immediately
    initColorOptions();
    initFontSizeControl();
    // Update datetime every second
    updateDateTime();
    setInterval(updateDateTime, 1000);
  });