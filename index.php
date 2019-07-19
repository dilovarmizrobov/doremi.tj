<?php
session_start();

/**
 * Front controller
 *
 * PHP version 7.0
 */
define('ROOT', dirname(__FILE__));
define('HOST', $_SERVER["HTTP_HOST"]);
if ( !isset($_SESSION['VIEWS']) )
  $_SESSION['VIEWS'] = array();

/**
 * Composer
 */
require ROOT . '/vendor/autoload.php';


/**
 * Error and Exception handling
 */
error_reporting(E_ALL);
set_error_handler('Core\Error::errorHandler');
set_exception_handler('Core\Error::exceptionHandler');


/**
 * Routing
 */
$router = new Core\Router();
$router->run();
