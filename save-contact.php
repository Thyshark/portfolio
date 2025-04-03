<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

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

// Validate required fields
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
    // Prepare SQL statement with additional fields
    $stmt = $conn->prepare(
        "INSERT INTO contact_messages 
        (name, email, subject, message, ip_address) 
        VALUES (:name, :email, :subject, :message, :ip_address)"
    );

    // Get client IP address
    $ip_address = $_SERVER['REMOTE_ADDR'];

    // Execute with bound parameters
    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':subject' => $subject,
        ':message' => $message,
        ':ip_address' => $ip_address
    ]);

    // Set success response
    $response['success'] = true;
    $response['message'] = 'Thank you for your message! I will get back to you soon.';

    // Send email notification (using PHPMailer recommended for production)
    $to = 'mr.ken.kimiri@gmail.com';
    $emailSubject = 'New Contact: ' . ($subject ?: 'No Subject');
    $emailBody = "
        Name: $name\n
        Email: $email\n
        IP Address: $ip_address\n\n
        Message:\n$message
    ";
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    @mail($to, $emailSubject, $emailBody, $headers);

} catch (PDOException $e) {
    // Log detailed error for admin
    error_log('[' . date('Y-m-d H:i:s') . '] Contact Form Error: ' . $e->getMessage());

    // Generic error message for user
    $response['message'] = 'An error occurred while processing your request. Please try again later.';
}

// Return JSON response
echo json_encode($response);
?>