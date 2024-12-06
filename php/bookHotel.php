<?php
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);
$hotelDetails = $data['hotelDetails'];
$guests = $data['guests'];

// Insert into hotel_booking
$stmt = $conn->prepare("
    INSERT INTO hotel_booking (hotel_id, check_in_date, check_out_date, number_of_rooms, price_per_night, total_price)
    VALUES (?, ?, ?, ?, ?, ?)
");
$stmt->bind_param(
    "issidd",
    $hotelDetails['hotelId'],
    $hotelDetails['checkInDate'],
    $hotelDetails['checkOutDate'],
    $hotelDetails['numberOfRooms'],
    $hotelDetails['pricePerNight'],
    $hotelDetails['totalPrice']
);
$stmt->execute();
$bookingId = $stmt->insert_id;

// Insert into guesses
foreach ($guests as $guest) {
    $stmt = $conn->prepare("
        INSERT INTO guesses (SSN, hotel_booking_id, first_name, last_name, date_of_birth, category)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param(
        "sissss",
        $guest['ssn'],
        $bookingId,
        $guest['firstName'],
        $guest['lastName'],
        $guest['dob'],
        $guest['category']
    );
    $stmt->execute();
}

// Prepare response
$response = [
    "bookingId" => $bookingId,
    "hotelName" => $hotelDetails['hotelName'],
    "city" => $hotelDetails['city'],
    "pricePerNight" => $hotelDetails['pricePerNight'],
    "numberOfRooms" => $hotelDetails['numberOfRooms'],
    "totalPrice" => $hotelDetails['totalPrice'],
    "checkInDate" => $hotelDetails['checkInDate'],
    "checkOutDate" => $hotelDetails['checkOutDate'],
    "guests" => $guests
];

// Send response
header("Content-Type: application/json");
echo json_encode($response);
?>
