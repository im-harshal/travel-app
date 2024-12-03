<?php
session_start();

// Ensure only admin can access
if (!isset($_SESSION['user']) || $_SESSION['user']['Phone'] !== '222-222-2222') {
    echo "Unauthorized access";
    exit;
}

require_once 'config.php';

// Path to your XML file
$xmlFile = '../data/flights.xml';

if (!file_exists($xmlFile)) {
    echo "XML file not found.";
    exit;
}

$xml = simplexml_load_file($xmlFile);


if (!$xml) {
    echo "Failed to parse XML.";
    exit;
}

// Prepare SQL statement
$stmt = $conn->prepare("
    INSERT INTO flights (flightid, origin, destination, departuredate, arrivaldate, departuretime, arrivaltime, availableseats, price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
");

if (!$stmt) {
    echo "Database error: " . $conn->error;
    exit;
}

$conn->begin_transaction();

try {
    foreach ($xml->flight as $flight) {
        $stmt->bind_param(
            "sssssssid",
            $flight->flightid,
            $flight->origin,
            $flight->destination,
            $flight->departuredate,
            $flight->arrivaldate,
            $flight->departuretime,
            $flight->arrivaltime,
            $flight->availableseats,
            $flight->price
        );
        $stmt->execute();
    }

    $conn->commit();
    echo "Flights loaded successfully!";
} catch (Exception $e) {
    $conn->rollback();
    echo "Error loading flights: " . $e->getMessage();
}

$stmt->close();
$conn->close();
?>
