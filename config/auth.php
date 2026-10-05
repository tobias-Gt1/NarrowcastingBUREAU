<?php

declare(strict_types=1);

session_start();

function require_login(): void
{
    if (empty($_SESSION['user_id'])) {
        header('Location: /login.php');
        exit;
    }
}
