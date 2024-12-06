<?php
include "config.php";

// Get the city from the POST request
$city = $_POST['city'] ?? '';

if (empty($city)) {
    echo json_encode([]);
    exit;
}

// Prepare and execute the query
$stmt = $conn->prepare("SELECT hotel_id, hotel_name, city, price_per_night FROM hotels WHERE city = ?");
$stmt->bind_param("s", $city);
$stmt->execute();
$result = $stmt->get_result();

// Fetch results
$hotels = $result->fetch_all(MYSQLI_ASSOC);

// Return as JSON
echo json_encode($hotels);
?>
