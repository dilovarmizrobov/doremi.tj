<?php
namespace App\Controllers;

class Ajax extends \Core\Controller
{

  public function __construct() {
    $this->model = new \App\Models\Ajax;
  }

  public function rankAction() {
    $p = $_POST;
  	if ( isset($p['METHOD']) && $p['METHOD'] === 'LISTENED_SONG' && isset($p['ID']) ) {
  		$id = $p['ID'] - 0;

  		if($id === 0){
  			echo json_encode('error');
  			return;
  		}

  		if( $this->model->listened_song($id) )
  			echo json_encode('ok');
  	}
  }

  public function loveAction() {
    if ( !isset($_SESSION['IS_USER']) ) {
      echo json_encode('error');
      return;
    }

    $p = $_POST;
    if ( isset($p['METHOD']) && isset($p['ID']) ) {
      $mth = strtoupper($p['METHOD']);
      $id = $p['ID'] - 0;

      if ($id === 0) {
        echo json_encode('error');
        return;
      }

      switch ($mth) {
        case 'LOVE_SONG':
          $prd = 'LOVED_SNG';
          $l = true;
          break;
        case 'UNLOVE_SONG':
          $prd = 'LOVED_SNG';
          $l = false;
          break;
        case 'LOVE_ARTIST':
          $prd = 'ARTISTS';
          $l = true;
          break;
        case 'UNLOVE_ARTIST':
          $prd = 'ARTISTS';
          $l = false;
          break;
        case 'LOVE_PLAYLIST':
          $prd = 'PLAYLISTS';
          $l = true;
          break;
        case 'UNLOVE_PLAYLIST':
          $prd = 'PLAYLISTS';
          $l = false;
          break;
        default:
          $prd = false;
          break;
      }

      if ($prd && $this->model->love_unlove_product($id, $prd, $l) ) {}
      else
        echo json_encode('error');
    }

  }

}
