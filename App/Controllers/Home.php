<?php
namespace App\Controllers;
use \Core\View;

class Home extends \Core\Controller
{

  public function __construct() {
    $this->model = new \App\Models\Home;
    $this->rank_m = new \App\Models\Rank;
  }

  public function aboutAction() {
    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest') {
      echo json_encode(
        array(
          'method' => 'pabout',
          'result' => array(
            'title' =>'О нас'
          ),
          'error' => array()
        )
      );
    } else {
      $head_view = new View('settings');
    }
  }

  public function errorsAction() {
    $this->error('<h1 align = "center">500 Ошибка Сервера</h1><h4 align = "center">На сервере произошла непредвиденная ошибка. Пожалуйста, подождите; она вскоре будет исправлена.<br>Попробуйте вернуться на главную страницу <a href="/">Doremi.tj</a>.</h4>');
  }

  public function homeAction($url) {
    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest') {
      echo json_encode(
        array(
          'method' => 'phome',
          'result' => array(
            'title' =>'Doremi',
            'newArtist' => $this->model->new_artist(6),
            'newSong' => $this->model->new_song(1),
            'popularArtist' => $this->model->popular_artist(6),
            'popularSong' => $this->model->popular_song(1)
          ),
          'error' => array()
        )
      );
    } else {
      $head_view = new View('settings');
    }
  }

  public function newAction($url) {
    if (isset($url[1]) && $url[1] === 'page' ) $pid = $url[2];
      else $pid = 1;

    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest') {
      echo json_encode(
        array(
          'method' => 'pnew',
          'result' => array(
            'title' =>'Новинки',
            'newPlaylist' => $this->model->new_playlist(3),
            'newSong' => $this->model->new_song($pid),
          ),
          'error' => array()
        )
      );
    } else {
      $head_view = new View('settings');
    }
  }

  public function popularAction($url) {
    if (isset($url[1]) && $url[1] === 'page' ) $pid = $url[2];
      else $pid = 1;

    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest') {
      echo json_encode(
        array(
          'method' => 'ppopular',
          'result' => array(
            'title' =>'Популярное',
            'popularPlaylist' => $this->model->popular_playlist(3),
            'popularSong' => $this->model->popular_song($pid),
          ),
          'error' => array()
        )
      );
    } else {
      $head_view = new View('settings');
    }
  }

  public function artistsAction($url) {
    if (isset($url[1]) && $url[1] === 'page' ) $pid = $url[2];
      else $pid = 1;

    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest') {
      echo json_encode(
        array(
          'method' => 'partists',
          'result' => array(
            'title' =>'Артисты',
            'artists' => $this->model->get_artists($pid, 4),
          ),
          'error' => array()
        )
      );
    } else {
      $head_view = new View('settings');
    }
  }

  public function artistAction($url) {
    if (isset($url[2]) && $url[2] === 'top_track' ) $p = $url[2];
      else $p = 'track';

    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest') {
      $art = $this->model->get_artist($url[1], $p);

      $this->rank_m->artist_views($url[1]);

      echo json_encode(
        array(
          'method' => 'partist',
          'result' => array(
            'title' =>$art['ART_NAME'],
            'artist' => $art,
          ),
          'error' => array()
        )
      );
    } else {
      $head_view = new View('settings');
    }
  }

  public function playlistAction($url) {
    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest') {
      $ply = $this->model->get_playlist($url[1]);
      $this->rank_m->playlist_views($url[1]);

      echo json_encode(
        array(
          'method' => 'pplaylist',
          'result' => array(
            'title' => $ply['PLY_TITLE'],
            'playlist' => $ply
          ),
          'error' => array()
        )
      );
    } else {
      $head_view = new View('settings');
    }
  }

  public function songAction($url) {
    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest') {
      $sng = $this->model->get_song_id($url[1]);
      $over_sng = $this->model->get_art_sng($sng['SNG_ART'][0]['ART_ID']);
      echo json_encode(
        array(
          'method' => 'psong',
          'result' => array(
            'title' => $sng['SNG_TITLE'],
            'song' => $sng,
            'overSong' => $over_sng
          ),
          'error' => array()
        )
      );
    } else {
      $head_view = new View('settings');
    }
  }

}
