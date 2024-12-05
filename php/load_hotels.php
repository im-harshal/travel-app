<?php
session_start();

// Ensure only admin can access
if (!isset($_SESSION['user']) || $_SESSION['user']['Phone'] !== '222-222-2222') {
    echo "Unauthorized access";
    exit;
}

require_once 'config.php';

// Path to your JSON file
$jsonFile = '../data/hotels.json';

if (!file_exists($jsonFile)) {
    echo "JSON file not found.";
    exit;
}

$jsonData = file_get_contents($jsonFile);
$hotels = json_decode($jsonData, true);

if (!$hotels || !is_array($hotels)) {
    echo "Failed to parse JSON.";
    exit;
}

// Prepare SQL statement
$stmt = $conn->prepare("
    INSERT INTO hotels (hotel_id, hotel_name, city, price_per_night)
    VALUES (?, ?, ?, ?)
");

if (!$stmt) {
    echo "Database error: " . $conn->error;
    exit;
}

$conn->begin_transaction();

try {
    foreach ($hotels as $hotel) {
        $stmt->bind_param(
            "sssd",
            $hotel['hotel_id'],
            $hotel['hotel_name'],
            $hotel['city'],
            $hotel['price_per_night']
        );
        $stmt->execute();
    }

    $conn->commit();
    echo "Hotels loaded successfully!";
} catch (Exception $e) {
    $conn->rollback();
    echo "Error loading hotels: " . $e->getMessage();
}

$stmt->close();

?>
