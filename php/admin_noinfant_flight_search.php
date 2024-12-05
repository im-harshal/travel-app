<?php
session_start();
require_once 'config.php';

// Function to check if user is admin
function checkAdminAuth() {
    if (!isset($_SESSION['user']) || $_SESSION['user']['Phone'] !== '222-222-2222') {
        sendJsonResponse(['error' => 'Unauthorized'], 401);
    }
}

// Search Texas flights without infants
if (isset($_POST['city'])) {
    checkAdminAuth();
    
    $sql = "SELECT f.*
            FROM flights f
            WHERE f.destination = ?
            AND f.flightid NOT IN (
                SELECT DISTINCT fb.flight_id
                FROM flight_bookings fb
                JOIN tickets t ON fb.flight_booking_id = t.flight_booking_id
                JOIN passengers p ON t.ssn = p.ssn
                WHERE p.category = 'infants'
            )";
            
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $_POST['city']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $texasFlights = [];
    while ($row = $result->fetch_assoc()) {
        $texasFlights[] = $row;
    }
    
    echo json_encode($texasFlights);
    $stmt->close();
    
}