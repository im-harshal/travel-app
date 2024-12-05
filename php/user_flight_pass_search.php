<?php
// user_searches.php - Handles all user-related searches
session_start();
require_once 'config.php';

// Function to check if user is logged in
function checkUserAuth() {
    if (!isset($_SESSION['user'])) {
        sendJsonResponse(['error' => 'Unauthorized'], 401);
    }
}

// Search flight passengers
if (isset($_POST['flightBookingId'])) {
    checkUserAuth();
    
    $sql = "SELECT p.*, t.passenger_price
            FROM passengers p
            JOIN tickets t ON p.ssn = t.ssn
            WHERE t.flight_booking_id = ?";
            
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $_POST['flightBookingId']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $passengers = [];
    while ($row = $result->fetch_assoc()) {
        $passengers[] = $row;
    }
    
    echo json_encode($passengers);
    $stmt->close();
}