<?php
/**
 * check_session.php — Returns JSON with current session state.
 * Used by the React frontend AuthGuard to verify if the user is logged in.
 */
header('Content-Type: application/json');
header('Cache-Control: no-cache, no-store, must-revalidate');

require_once '../session-config.php';

if (isset($_SESSION['email']) && !empty($_SESSION['email'])) {
    echo json_encode([
        'loggedIn' => true,
        'user' => [
            'email' => $_SESSION['email'],
            'name' => $_SESSION['name'] ?? '',
            'role' => $_SESSION['role'] ?? 'user',
        ]
    ]);
} else {
    echo json_encode([
        'loggedIn' => false,
        'user' => null,
    ]);
}
?>
