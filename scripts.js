// scripts.js
$(document).ready(function () {
  // Check login status and update UI
  checkLoginStatus();

  // Update datetime every second
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // Toggle forms
  $("#showRegister").click(function (e) {
    e.preventDefault();
    $("#loginForm").hide();
    $("#registerForm").show();
  });

  $("#showLogin").click(function (e) {
    e.preventDefault();
    $("#registerForm").hide();
    $("#loginForm").show();
  });

  // Registration form validation and submission
  $("#register").submit(function (e) {
    e.preventDefault();

    const formData = {
      phone: $('input[name="phone_number"]').val(),
      password: $('input[name="password_"]').val(),
      confirm_password: $('input[name="confirm_password"]').val(),
      firstname: $('input[name="firstname"]').val(),
      lastname: $('input[name="lastname"]').val(),
      dob: $('input[name="dob"]').val(),
      email: $('input[name="email"]').val(),
      gender: $('input[name="gender"]:checked').val(),
    };

    if (!validateRegistration(formData)) {
      return;
    }

    $.ajax({
      url: "php/register.php",
      type: "POST",
      data: formData,
      beforeSend: function (xhr) {
        console.log("Sending data:", formData);
      },
      success: function (response) {
        try {
          if (response.success) {
            alert("Registration successful! Please login.");
            $("#showLogin").click();
          } else {
            alert(response.message);
          }
        } catch (e) {
          console.error("Error parsing response:", e);
          console.log("Invalid JSON:", response);
        }
      },
      error: function (xhr, status, error) {
        console.error("AJAX error:", status, error);
        console.log("Response text:", xhr.responseText);
        alert("Error occurred during registration");
      },
    });
  });

  // Login form submission
  $("#login").submit(function (e) {
    e.preventDefault();

    const formData = {
      phone: $('input[name="phone"]').val(),
      password: $('input[name="password"]').val(),
    };

    $.ajax({
      url: "php/login.php",
      type: "POST",
      data: formData,
      success: function (response) {
        if (response.success) {
          window.location.href = "dashboard.html";
        } else {
          alert(response.message);
        }
      },
      error: function () {
        alert("Error occurred during login");
      },
    });
  });
});

// Validation functions
function validateRegistration(data) {
  if (!validatePhone(data.phone)) {
    alert("Phone number must be in format ddd-ddd-dddd");
    return false;
  }

  if (data.password.length < 8) {
    alert("Password must be at least 8 characters");
    return false;
  }

  if (data.password !== data.confirm_password) {
    alert("Passwords do not match");
    return false;
  }

  if (!validateDOB(data.dob)) {
    alert("Date of birth must be in format YYYY-MM-DD");
    return false;
  }

  if (!validateEmail(data.email)) {
    alert("Invalid email format");
    return false;
  }

  return true;
}

function validatePhone(phone) {
  // Trim any whitespace
  phone = phone.trim();

  // Check if the phone number matches the pattern
  const isValid = /^\d{3}-\d{3}-\d{4}$/.test(phone);
  console.log("Phone validation result:", isValid);

  return isValid;
}

function validateDOB(dob) {
  return /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(dob);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.com$/.test(email);
}

function updateDateTime() {
  const now = new Date();
  $("#datetime").text(now.toLocaleString());
}

function checkLoginStatus() {
  $.ajax({
    url: "php/check_session.php",
    type: "GET",
    dataType: "json",
    success: function (response) {
      if (response.loggedIn) {
        $("#user-name").text(response.firstname + " " + response.lastname);
        $("#user-info").show();
        $("#loginForm, #registerForm").hide();
      }
    },
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});
