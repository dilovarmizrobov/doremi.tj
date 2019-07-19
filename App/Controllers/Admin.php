<?php
namespace App\Controllers;
use \Core\View;

class Admin extends \Core\Controller
{
  public function __construct($p) {
    if ( $p['action'] != 'home' && $p['action'] != 'in' && !isset($_SESSION['IS_ADMIN']) ) {
      $this->error();
      exit();
    }

    $this->model = new \App\Models\Admin;
    $this->search = new \App\Models\Search;
  }

  public function inAction() {

    if ( isset( $_POST['logined'] ) ) {
      $er = false;
      $login = $this->model->fl_input( $_POST['login'] );
      $password = $this->model->fl_input( $_POST['password'] );

      // login
      if ($login == "" || strlen($login) > 50) $er = true;
      if (!preg_match('/^([a-zA-Z0-9])(\w|-|_)+([a-z0-9])$/is', $login)) $er = true; // соответствует ли логин регулярному выражению

      // password
      if ($password == "" || strlen($password) < 6 || strlen($password) > 15) $er = true; //не пусто ли поле пароля

      if ($er) return header("Location: http://" . HOST . "/panel/login");

      $admin = $this->model->get_data_user("SELECT * FROM admin WHERE LOGIN = '$login' AND PASSWORD = '$password'");

      if ( !empty( $admin ) ) {
        $result = $admin[0];
        $_SESSION['ADMIN']['ID'] = $result['ID'];
        $_SESSION['ADMIN']['NAME'] = $result['NAME'];
        $_SESSION['ADMIN']['ACCESS'] = $result['ACCESS'];
        $_SESSION['IS_ADMIN'] = true;
        header("Location: http://" . HOST . "/panel");
      }
    }
    $login_view = new View('login');
  }

  public function outAction() {
    unset($_SESSION['ADMIN']);
    unset($_SESSION['IS_ADMIN']);
    header("Location: http://" . HOST);
  }

  public function ajaxAction() {
    $p = $_POST;
    if ( isset($p['METHOD']) && isset($p['SEARCH']) ) {
      $mth = strtolower($p['METHOD']);
      $s = $this->model->fl_input($p['SEARCH']);

      if ( empty($s) ) {
        echo json_encode('error');
        return;
      }

      if ( method_exists($this->search, $mth) )
        echo json_encode( array( 'DATA' => $this->search->$mth($s) ) );
      else
        echo json_encode( array( 'DATA' => array() ) );

    } elseif ( isset($p['METHOD']) && isset($p['ID']) ) {
      $mth = strtolower($p['METHOD']);
      $id = $p['ID'] - 0;

      if ($id ===0 ) {
        echo json_encode('error');
        return;
      }

      if ( method_exists($this->model, $mth) )
        return $this->model->$mth($id);
      else
        echo json_encode('error');

    } else {
      echo json_encode('error');
      return;
    }
  }

  public function homeAction($url) {
    if ( !isset($_SESSION['IS_ADMIN']) ) {
      header("Location: http://" . HOST . "/panel/login");
    } elseif ( isset($_SESSION['IS_ADMIN']) ) {
      $sum_user = $this->model->get_user_statistics();
      $sum_user = $sum_user[0]['COUNT_USR'];

      $sum_song = $this->model->get_song_statistics();
      $sum_song = $sum_song[0]['COUNT_SNG'];

      $sum_artist = $this->model->get_artist_statistics();
      $sum_artist = $sum_artist[0]['COUNT_ART'];

      $sum_playlist = $this->model->get_playlist_statistics();
      $sum_playlist = $sum_playlist[0]['COUNT_PLS'];

      $head_view = new View('admin/head');
      $head_view->assign('page', $url);
      $home_view = new View('admin/home');
      $home_view->assign('sum_user', $sum_user);
      $home_view->assign('sum_song', $sum_song);
      $home_view->assign('sum_artist', $sum_artist);
      $home_view->assign('sum_playlist', $sum_playlist);
      $footer_view = new View('admin/footer');
    }
  }

  public function songAction($url) {
    if ( isset( $_POST['add'] ) )
      $this->model->add_song();
    elseif ( isset( $_POST['edit'] ) )
      $this->model->edit_song();

    $head_view = new View('admin/head');
    $head_view->assign('page', $url[1]);
    $song_view = new View('admin/song');
    $song_view->assign('song', $this->model->last_product(10, 'song'));
    $footer_view = new View('admin/footer');
  }

  public function artistAction($url) {
    if ( isset( $_POST['add'] ) )
      $this->model->add_artist();
    elseif ( isset( $_POST['edit'] ) )
      $this->model->edit_artist();

    $head_view = new View('admin/head');
    $head_view->assign('page', $url[1]);
    $artist_view = new View('admin/artist');
    $artist_view->assign('artist', $this->model->last_product(10, 'artist'));
    $footer_view = new View('admin/footer');
  }

  public function playlistAction($url) {
    if ( isset( $_POST['add'] ) )
      $this->model->add_playlist();
    elseif ( isset( $_POST['edit'] ) )
      $this->model->edit_playlist();

    $head_view = new View('admin/head');
    $head_view->assign('page', $url[1]);
    $playlist_view = new View('admin/playlist');
    $playlist_view->assign('playlist', $this->model->last_product(10, 'playlist'));
    $footer_view = new View('admin/footer');
  }

  public function moderationAction($url) {
    if ( isset( $_POST['approve'] ) )
      $this->model->approve_upsong();

    $head_view = new View('admin/head');
    $head_view->assign('page', $url[1]);
    $moderation_view = new View('admin/moderation');
    $moderation_view->assign('upsong', $this->model->last_product(10, 'upsong'));
    $footer_view = new View('admin/footer');
  }

}
