<?php
session_start();
require_once 'config.php';

header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

// Check if user is logged in
if (!isset($_SESSION['user']) || !isset($_SESSION['user']['Phone'])) {
    echo json_encode(['success' => false, 'message' => 'not_logged_in']);
    exit;
}

// Validate the comment
if (!isset($_POST['comment']) || strlen(trim($_POST['comment'])) < 10) {
    echo json_encode(['success' => false, 'message' => 'Comment must be at least 10 characters long']);
    exit;
}

// Get user information from database
$phone = $_SESSION['user']['Phone'];
$stmt = $conn->prepare("SELECT phone, firstname, lastname, dob, email, gender FROM users WHERE phone = ?");
$stmt->bind_param("s", $phone);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    echo json_encode(['success' => false, 'message' => 'User not found']);
    exit;
}

// Generate unique contact ID (timestamp + random number)
$contactId = time() . rand(1000, 9999);

// Create XML entry
$xmlData = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><contact></contact>');
$xmlData->addChild('contact-id', $contactId);
$xmlData->addChild('phone-number', $phone);
$xmlData->addChild('first-name', $user['firstname']);
$xmlData->addChild('last-name', $user['lastname']);
$xmlData->addChild('date-of-birth', $user['dob']);
$xmlData->addChild('email', $user['email']);
$xmlData->addChild('gender', $user['gender']);
$xmlData->addChild('comment', $_POST['comment']);
$xmlData->addChild('submission-date', date('Y-m-d H:i:s'));

// Load existing XML file or create new one
$xmlFilePath = '../data/contacts.xml';
if (file_exists($xmlFilePath)) {
    $existingXml = simplexml_load_file($xmlFilePath);
    $dom = dom_import_simplexml($existingXml);
    $newDom = dom_import_simplexml($xmlData);
    $newNode = $dom->ownerDocument->importNode($newDom, true);
    $dom->parentNode->appendChild($newNode);
    $existingXml->asXML($xmlFilePath);
} else {
    // Create directory if it doesn't exist
    if (!file_exists('../data')) {
        mkdir('../data', 0777, true);
    }
    // Save the new XML file
    $xmlData->asXML($xmlFilePath);
}

// Close database connection
$stmt->close();
$conn->close();

echo json_encode(['success' => true]);
?>