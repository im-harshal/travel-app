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

$(document).ready(function () {
  // Check login status immediately
  checkLoginStatus();

  // Update datetime every second
  updateDateTime();
  setInterval(updateDateTime, 1000);
});
