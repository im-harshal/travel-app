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

  $("#commentForm").submit(function (e) {
    e.preventDefault();

    const formData = {
      comment: $('input[name="comment_"]').val(),
    };

    if (formData.comment.length < 10) {
      alert("Comment must be at least 10 characters long");
      return;
    }

    $.ajax({
      url: "php/contact.php",
      type: "POST",
      data: formData,
      beforeSend: function (xhr) {
        console.log("Sending data:", formData);
      },
      success: function (response) {
        if (response.success) {
          alert("Comment successfully stored");
          // Reset the form
          $("#commentForm")[0].reset();
        } else {
          alert(response.message);
        }
      },
      error: function (xhr, status, error) {
        console.error("AJAX error:", status, error);
        console.log("Response text:", xhr.responseText);
        alert("Error occurred during login");
      },
    });
  });
});
