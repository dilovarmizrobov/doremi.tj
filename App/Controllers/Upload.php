<?php
namespace App\Controllers;
use \Core\View;

/**
 * Upload Controller
 */
class Upload extends \Core\Controller
{

  function __construct() {
    $this->model = new \App\Models\Upload;
  }

  public function homeAction()
  {
    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest') {
      if ( isset( $_FILES["prd"] ) ) $this->model->add();
      else echo json_encode(
        array(
          'method' => 'pupload',
          'result' => array(
            'title' =>'Добавить музыку',
          ),
          'error' => array()
        )
      );
    } else {
      $head_view = new View('settings');
    }
  }
}
