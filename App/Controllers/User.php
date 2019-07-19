<?php
namespace App\Controllers;
use \Core\View;

class User extends \Core\Controller
{
  public function __construct() {
    $this->model = new \App\Models\User;
  }

  //account
  public function accountAction() {
    if (!isset($_SESSION['IS_USER'])) return $this->error();

    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest') {
      if (isset( $_POST['CHANGE_ACCOUNT_IMG'] ) && $_FILES['img'] ) {
        $this->model->change_account_img($_FILES['img']);
      } elseif ( isset($_POST['validate_login']) ) {
        if ( preg_match('/^'. $_SESSION['USER']['LOGIN'] . '$/i', $_POST['validate_login']) )
          echo json_encode( array('result' => false) );
        else {
          $r = $this->model->get_validate_login($_POST['validate_login']);
          echo json_encode( array('result' => !$r) );
        }
      } elseif ( isset($_POST['edit_data']) )
        $this->model->change_user($_SESSION['USER']['ID'], 'data');
      elseif ( isset($_POST['edit_login']) )
        $this->model->change_user($_SESSION['USER']['ID'], 'login');
      elseif ( isset($_POST['edit_password']) )
        $this->model->change_user($_SESSION['USER']['ID'], 'password');
      elseif ( isset($_POST['edit_email']) )
        $this->model->change_user($_SESSION['USER']['ID'], 'email');
      elseif ( isset($_POST['delete']) )
        $this->model->remove_user($_SESSION['USER']['ID']);
      else {
        echo json_encode(
          array(
            'method' => 'paccount',
            'result' => array(
              'title' => 'Аккаунт',
              'user' => array(
                'login' => $_SESSION['USER']['LOGIN'],
                'email' => $_SESSION['USER']['EMAIL'],
                'gender' => $_SESSION['USER']['GENDER'],
                'age' => $_SESSION['USER']['AGE'],
                'picture' => $_SESSION['USER']['PICTURE']
              )
            ),
            'error' => array()
          )
        );
      }
    } else {
      $head_view = new View('settings');
    }

  }

  //Profile
  public function profileAction() {
    if (!isset($_SESSION['IS_USER'])) return $this->error();

    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest') {
      echo json_encode(
        array(
          'method' => 'pprofile',
          'result' => array(
            'title' => 'Моя музыка',
            'song' => $this->model->p_song($_SESSION['USER']['LOVED_SNG']),
            'artist' => $this->model->p_artist($_SESSION['USER']['ARTISTS']),
            'playlist' => $this->model->p_playlist($_SESSION['USER']['PLAYLISTS'])
          ),
          'error' => array()
        )
      );
    } else {
      $head_view = new View('settings');
    }
  }

  //ProfileLoved
  public function profileLovedAction() {
    if (!isset($_SESSION['IS_USER'])) return $this->error();

    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest') {
      echo json_encode(
        array(
          'method' => 'pploved',
          'result' => array(
            'title' => 'Любимые треки',
            'song' => $this->model->p_song($_SESSION['USER']['LOVED_SNG']),
          ),
          'error' => array()
        )
      );
    } else {
      $head_view = new View('settings');
    }
  }

  //ProfilePlaylists
  public function profilePlaylistAction() {
    if (!isset($_SESSION['IS_USER'])) return $this->error();

    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest') {
      echo json_encode(
        array(
          'method' => 'ppplaylist',
          'result' => array(
            'title' => 'Любимые плейлисты',
            'playlist' => $this->model->p_playlist($_SESSION['USER']['PLAYLISTS'])
          ),
          'error' => array()
        )
      );
    } else {
      $head_view = new View('settings');
    }
  }

  //ProfileArtists
  public function profileArtistAction() {
    if (!isset($_SESSION['IS_USER'])) return $this->error();

    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest') {
      echo json_encode(
        array(
          'method' => 'ppartist',
          'result' => array(
            'title' => 'Любимые артисты',
            'artist' => $this->model->p_artist($_SESSION['USER']['ARTISTS'])
          ),
          'error' => array()
        )
      );
    } else {
      $head_view = new View('settings');
    }
  }

  //login
  public function inAction() {
    $this->model->login();
    if ( !isset($_SESSION['IS_USER']) ) {
      new View('login');
    } elseif ( isset($_SESSION['IS_USER']) ) {
      header("Location: http://" . HOST);
    }
  }

  //logout
  public function outAction() {
    unset($_SESSION['USER']);
    unset($_SESSION['IS_USER']);
    header("Location: http://" . HOST);
  }

  //register
  public function registerAction() {
    if ( isset($_SESSION['IS_USER']) ) header("Location: http://" . HOST);
    else {
      if ( isset($_POST['validate_login']) ) {
        $r = $this->model->get_validate_login($_POST['validate_login']);
        echo json_encode( array('result' => !$r) );
        return;
      }

      $this->model->register();
      new View('register');
    }
  }

  public function confirmationAction() {
    $msg = '';
    if ( isset($_GET['token']) ) {
      $msg = $this->model->confirm_mail($_GET['token']);
    } elseif ( isset($_GET['repeatcode']) ) {
      if ( isset($_SESSION['USER']['id']) ) {
        if ( $this->model->send_code_mail($_SESSION['USER']['id']) ) {
          $msg = 'Вам отправлен код подтверждения. Пожалуйста, подтвердите адрес вашей электронной почты, после этого можете начать использовать ваш аккаунт на сайте.';
          unset($_SESSION['USER']);
        } else {
          $msg = 'При отправке сообщения произошла ошибка. Пожалуйста, попробуйте <a href="?repeatcode">еще раз.</a>';
        }
      } else {
        header("Location: http://" . HOST);
      }
    } elseif ( isset($_SESSION['confirm']) ) {
      $msg = 'Пожалуйста, подтвердите адрес вашей электронной почты, и можете начать использовать ваш аккаунт на сайте. <a href="?repeatcode">Отправить код еще раз?</a>';
      unset($_SESSION['confirm']);
    } elseif ( isset($_SESSION['registered']) ) {
      if ($_SESSION['registered']) {
        $msg = 'Регистрация успешно завершена. Вам отправлен код подтверждения. Пожалуйста, подтвердите адрес вашей электронной почты, после этого можете начать использовать ваш аккаунт на сайте.';
      } else {
        $msg = 'При отправке сообщения произошла ошибка. Пожалуйста, попробуйте <a href="?repeatcode">еще раз.</a>';
      }
      unset($_SESSION['registered']);
    } else {
      header("Location: http://" . HOST);
    }

    $head_view = new View('confirmation');
    $head_view->assign('msg', $msg);
  }

}

?>
