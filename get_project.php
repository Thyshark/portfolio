<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

// Initialize response array
$response = [
    'success' => false,
    'data' => [],
    'error' => null
];

try {
    $stmt = $conn->query("SELECT * FROM projects ORDER BY created_at DESC");
    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format tags as array if stored as comma-separated string
    foreach ($projects as &$project) {
        if (isset($project['tags'])) {
            $project['tags'] = explode(',', $project['tags']);
        } else {
            $project['tags'] = []; // Ensure tags always exists as array
        }

        // Set default values for optional fields
        if (!isset($project['image'])) {
            $project['image'] = 'default-project.jpg';
        }
        if (!isset($project['github_url'])) {
            $project['github_url'] = null;
        }
        if (!isset($project['live_url'])) {
            $project['live_url'] = null;
        }
    }

    $response['success'] = true;
    $response['data'] = $projects;

} catch (PDOException $e) {
    // Log error
    error_log('[' . date('Y-m-d H:i:s') . '] Project fetch error: ' . $e->getMessage());
    $response['error'] = 'Database error occurred';
} finally {
    // Ensure JSON is properly encoded and output
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}
?>