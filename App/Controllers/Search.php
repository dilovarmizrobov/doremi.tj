<?php
namespace App\Controllers;
use \Core\View;

class Search extends \Core\Controller
{

  public function __construct() {
    $this->model = new \App\Models\Search;
  }

  public function runAction() {
    if ( !isset($_GET['q']) ) return $this->error();

    $qstr = htmlspecialchars($_GET['q'], ENT_QUOTES);
    $q = $this->model->fl_input( $_GET['q'] );
    $sng = $art = array();

    if ( !empty($q) ) {
      $sng = $this->model->search_song($q);
      $art = $this->model->search_artist($q);
    }

    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest') {
      echo json_encode(
        array(
          'method' => 'psearch',
          'result' => array(
            'title' =>'Поиск музыки « ' . $qstr . ' »',
            'heading' => $qstr,
            'song' => $sng,
            'artist' => $art,
          ),
          'error' => array()
        )
      );
    } else $head_view = new View('settings');
  }

}

?>
