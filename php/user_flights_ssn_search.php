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

// Search flights by SSN
if (isset($_POST['ssn'])) {
    checkUserAuth();
    
    $sql = "SELECT DISTINCT f.*, fb.flight_booking_id, t.passenger_price 
            FROM flights f
            JOIN flight_bookings fb ON f.flightid = fb.flight_id
            JOIN tickets t ON fb.flight_booking_id = t.flight_booking_id
            WHERE t.ssn = ?";
            
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $_POST['ssn']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $flights = [];
    while ($row = $result->fetch_assoc()) {
        $flights[] = $row;
    }
    
    echo json_encode($flights);
    $stmt->close();
}
