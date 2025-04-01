<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

// Initialize response array
$response = [
    'success' => false,
    'message' => '',
    'errors' => []
];

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Invalid request method';
    echo json_encode($response);
    exit;
}

// Sanitize and validate input
$name = trim(filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING));
$email = trim(filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL));
$subject = trim(filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_STRING));
$message = trim(filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING));

// Validate fields
if (empty($name)) {
    $response['errors']['name'] = 'Name is required';
}

if (empty($email)) {
    $response['errors']['email'] = 'Email is required';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $response['errors']['email'] = 'Invalid email format';
}

if (empty($message)) {
    $response['errors']['message'] = 'Message is required';
}

// Return validation errors if any
if (!empty($response['errors'])) {
    $response['message'] = 'Please correct the following errors';
    echo json_encode($response);
    exit;
}

try {
    // Prepare and execute SQL statement
    $stmt = $conn->prepare(
        "INSERT INTO contact_messages 
        (name, email, subject, message) 
        VALUES (:name, :email, :subject, :message)"
    );

    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':subject' => $subject,
        ':message' => $message
    ]);

    // Set success response
    $response['success'] = true;
    $response['message'] = 'Thank you for your message! I will get back to you soon.';

    // Send email notification (silenced to prevent error exposure)
    $to = 'mr.ken.kimiri@gmail.com';
    $emailSubject = 'New Portfolio Contact: ' . ($subject ?: 'No Subject');
    $emailBody = "Name: $name\nEmail: $email\n\nMessage:\n$message";
    $headers = "From: $email\r\nReply-To: $email";

    @mail($to, $emailSubject, $emailBody, $headers);

} catch (PDOException $e) {
    // Log detailed error for admin
    error_log('Contact Form Error: ' . $e->getMessage());

    // Generic error message for user
    $response['message'] = 'An error occurred while processing your request. Please try again later.';
}

// Return JSON response
echo json_encode($response);
?>