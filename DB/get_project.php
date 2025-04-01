<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

try {
    $stmt = $conn->query("SELECT * FROM projects ORDER BY created_at DESC");
    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format tags as array
    foreach ($projects as &$project) {
        $project['tags'] = explode(',', $project['tags']);
    }

    echo json_encode($projects);
} catch (PDOException $e) {
    echo json_encode([]);
}
?>