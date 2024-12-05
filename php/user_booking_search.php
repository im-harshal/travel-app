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

// Search by booking ID
if (isset($_POST['bookingId'])) {
    checkUserAuth();
    
    $sql = "SELECT fb.flight_booking_id, f.*, t.passenger_price, p.firstname, p.lastname, p.category 
            FROM flight_bookings fb
            JOIN flights f ON fb.flight_id = f.flightid
            JOIN tickets t ON fb.flight_booking_id = t.flight_booking_id
            JOIN passengers p ON t.ssn = p.ssn
            WHERE fb.flight_booking_id = ?";
            
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $_POST['bookingId']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $bookingData = [];
    while ($row = $result->fetch_assoc()) {
        $bookingData[] = $row;
    }
    
    echo json_encode($bookingData);
    $stmt->close();
}