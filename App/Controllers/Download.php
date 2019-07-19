<?php
namespace App\Controllers;

class Download extends \Core\Controller
{
  public function __construct() {
    $this->model = new \App\Models\Download;
    $this->rank_model = new \App\Models\Rank;
  }

  public function listenAction() {
    $song = $_GET['s'];

    if ( strlen($song) !== 32 )
      $this->error();

    $file = ROOT . '/public/song/' . $song . '.mp3';

    if (file_exists($file)) {
      $this->rank_model->listened_song($song);

      if ( ob_get_level() ) ob_end_clean();

      header('Accept-Ranges: bytes');
      header('Content-length: ' . filesize($file));
      header('Content-type: audio/mpeg, audio/x-mpeg, audio/x-mpeg-3, audio/mpeg3');
      readfile($file);
      exit;
    } else
      $this->error();
  }

  public function loadAction($url) {
    $song = $_GET['s'];

    if ( strlen($song) !== 32 )
      $this->error();

    $song = $this->model->get_data_song($song);
    if ( !empty($song) ) {
      $this->rank_model->download_song($song['SNG_ID']);
      $file = ROOT . '/public/song/' . $song["SNG_HREF"] . '.mp3';
      $file_name = ROOT . '/public/song/' . ucwords( $this->translit($song["SNG_ART"][0]['ART_NAME']) ) . ' – ' . ucfirst( $this->translit( $song["SNG_TITLE"] ) ) . '.mp3';

      if (file_exists($file)) {
        if ( ob_get_level() ) ob_end_clean();

        rename($file, $file_name);
        header('Content-type: audio/mpeg, audio/x-mpeg, audio/x-mpeg-3, audio/mpeg3');
        header('Content-length: ' . filesize($file_name));
        header('Content-Disposition: attachment; filename="'.basename($file_name).'"');
        header('Cache-Control: no-cache');
        readfile($file_name);
        rename($file_name, $file);
        exit;
      }
    } else $this->error();
  }

}

?>
