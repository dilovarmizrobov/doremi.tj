<?php
namespace App\Models;

class User extends \Core\Model
{
  public function p_account() {}

  public function change_user($id, $function) {
    if ($function === 'data') {
      $gender = $this->fl_input($_POST['gender']);
      $age = $this->fl_input($_POST['age']);

      if ( $this->get_validate_input($gender, 'gender') && $this->get_validate_input($age, 'age') ) {
        mysqli_query($this->getDB(), "UPDATE user SET GENDER = '$gender', AGE = '$age' WHERE ID = $id");

        $_SESSION['USER']['GENDER'] = $gender;
        $_SESSION['USER']['AGE'] = $age;
        echo json_encode( array( "result"=>"Успешно изменено!", "errors"=>array() ) );
      } else {
        echo json_encode( array( "result"=>array(), "errors"=>array("Не удалось обновить!") ) );
      }
    } else {
      $password = $this->fl_input($_POST['password']);
      $uid = $_SESSION['USER']['ID'];
      if ( $this->get_validate_input($password, 'password') ) {
        $user = $this->select_sql("SELECT * FROM user WHERE ID = '$uid'");
        if ( !empty($user[0]) && $user[0]['PASSWORD'] === md5($password . $user[0]['SALT']) ) {

          if ($function === 'login') {
            $new_login = $this->fl_input($_POST['new_login']);

            if ( !$this->get_validate_input($new_login, 'login') ) return;

            $ver_new_login = $this->fl_input($_POST['ver_new_login']);
            $rez = $this->select_sql("SELECT * FROM user WHERE LOGIN = '$new_login' AND ID <> $uid");

            if ( empty($rez) && $new_login === $ver_new_login && $this->iud_sql("UPDATE user SET LOGIN = '$new_login' WHERE ID = $uid") ) {
              $_SESSION['USER']['LOGIN'] = $new_login;
              echo json_encode( array( "result"=>"Успешно изменено!", "errors"=>array() ) );
            }
          } elseif ($function === 'password') {
            $new_password = $this->fl_input($_POST['new_password']);

            if ( !$this->get_validate_input($new_password, 'password') ) return;

            $ver_new_password = $this->fl_input($_POST['ver_new_password']);

            if ($new_password === $ver_new_password) {
              $salt = $this->generateSalt();
              $new_password = md5($new_password . $salt);
              $this->iud_sql("UPDATE user SET PASSWORD = '$new_password', SALT = '$salt' WHERE ID = $uid");
              $_SESSION['USER']['PASSWORD'] = $new_password;
              echo json_encode( array( "result"=>"Успешно изменено!", "errors"=>array() ) );
            }
          } elseif ($function === 'email') {
            $new_email = $_POST['new_email'];

            if ( !$this->get_validate_input($new_email, 'email') ) return;

            $ver_new_email = $_POST['ver_new_email'];

            if ($new_email === $ver_new_email) {
              $this->iud_sql("UPDATE user SET EMAIL = '$new_email' WHERE ID = $uid");
              $_SESSION['USER']['EMAIL'] = $new_email;
              echo json_encode( array( "result"=>"Успешно изменено!", "errors"=>array() ) );
            }
          }
        } else {
          echo json_encode( array( "result"=>array(), "errors"=>array("Не удалось обновить!") ) );
        }
      }
    }
  }

  public function get_validate_login($login) {
    $login = $this->fl_input( $login );

    if ( !$this->get_validate_input($login, 'login') ) return;

    if ( isset($_SESSION['USER']) ) {
      $uid = $_SESSION['USER']['ID'];
      $rez = $this->select_sql("SELECT * FROM user WHERE LOGIN = '$login' AND ID <> $uid");
    } else {
      $rez = $this->select_sql("SELECT * FROM user WHERE LOGIN = '$login'");
    }

    if ( !empty($rez) ) return;

    return true;
  }

  public function change_account_img($img) {
    $uid = $_SESSION['USER']['ID'];
    $errors = array();
    $file_size = $img['size'];
    $file_type = $img['type'];
    $file_error = $img['error'];
    $file_tmp = $img['tmp_name'];

    if ( $file_error === 4 ) $errors[] = 'Не удалось обновить';
    else {
      if ( $file_size > 20971520 ) $errors[] = "Файл должен быть меньше 20 мб. ";
      if ( !preg_match("/image.*/", $file_type) ) $errors[] = "Неподдерживаемый тип!";

      if ( $file_error > 0 ) $errors[] = "Ошибка вовремя загрузки. ";
    }
    if ( empty( $errors ) ) {
      $slt = $this->select_sql("SELECT PICTURE FROM user WHERE ID = $uid");
      $href_img_user = $slt[0]['PICTURE'];

      if ($href_img_user !== 'img_men_head.jpg' && $href_img_user !== 'img_women_head.jpg') {
        $href_img_user = ROOT . '/public/img/users/' . $href_img_user;

        if ( file_exists($href_img_user) ) unlink($href_img_user);
      }

      $href_img = md5( time() . 'user' ) . '.jpg';
      move_uploaded_file( $file_tmp, ROOT.'/public/img/users/' . $href_img );
      $this->iud_sql("UPDATE user SET PICTURE = '$href_img' WHERE ID = $uid");
      $_SESSION['USER']['PICTURE'] = $href_img;
      echo json_encode( array( "result"=>"Успешно изменено!", "error"=>array() ) );
    } else {
      $er = '';

      for ( $i = 0; $i < count( $errors ); $i++ ) $er .= $errors[$i];

      echo json_encode( array( "result"=>array(), "error"=> $er ) );
    }

  }

  public function remove_user($id) {
    mysqli_query($this->getDB(), "DELETE FROM user WHERE ID = '$id'");
    unset($_SESSION['USER']);
    unset($_SESSION['IS_USER']);
    echo json_encode( array( "result"=>"Успешно удалено!", "errors"=>array() ) );
  }

  //Profile loved
  public function p_song($l) {
    if ( empty($l) ) return array();

    for ($i=0; $i < count($l); $i++) {
      $s = $this->get_song_id($l[$i]);
      $r[] = $s;
      if (count($s) === 0) {
        $this->ajax_unloved($l[$i], 'LOVED_SNG');
      }
    }

    return array_reverse($r);
  }

  //Profile playlists
  public function p_playlist($p) {
    if ( empty($p) ) return array();

    for ($i=0; $i < count($p); $i++) {
      $result[] = $this->get_playlist_id($p[$i]);
    }

    return array_reverse($result);
  }

  //Profile artist
  public function p_artist($a) {
    if ( empty($a) ) return array();

    for ($i=0; $i < count($a); $i++) {
      $res[] = $this->get_artist_id($a[$i]);
    }

    return array_reverse($res);
  }

  //login
  public function login() {
    if ( isset($_POST['logined']) ) {

      $login = $this->fl_input( $_POST['login'] );
      $password = $this->fl_input( $_POST['password'] );

      if ( !$this->get_validate_input($login, 'login') || !$this->get_validate_input($password, 'password') ) return;

      $users = $this->select_sql("SELECT * FROM user WHERE LOGIN = '$login'");
      $user = array();

      for ($i = 0; $i < count($users); $i++) {
        if ( $users[$i]['PASSWORD'] === md5($password . $users[$i]['SALT']) ) {
          if ($users[$i]['STATUS'] == 1) {
            $user = $users[$i];
          } else {
            $_SESSION['confirm'] = true;
            $_SESSION['USER']['id'] = $users[$i]['ID'];
            header("Location: http://" . HOST . '/confirmation');
          }
          break;
        }
      }

      if ( !empty($user) ) {

        $_SESSION['USER'] = $user;

        $_SESSION['USER']['LOVED_SNG'] === '' ? $_SESSION['USER']['LOVED_SNG'] = array() : $_SESSION['USER']['LOVED_SNG'] = explode(',', $_SESSION['USER']['LOVED_SNG']);

        $_SESSION['USER']['ARTISTS'] === '' ? $_SESSION['USER']['ARTISTS'] = array() : $_SESSION['USER']['ARTISTS'] = explode(',', $_SESSION['USER']['ARTISTS']);

        $_SESSION['USER']['PLAYLISTS'] === '' ? $_SESSION['USER']['PLAYLISTS'] = array() : $_SESSION['USER']['PLAYLISTS'] = explode(',', $_SESSION['USER']['PLAYLISTS']);

        $_SESSION['IS_USER'] = true;
      } else {
        echo '<script>alert("Логин или пароль введены неверно.");</script>';
        echo "<meta http-equiv='refresh' content='0'>";
      }
    }
  }

  //register
  public function register() {
    if (isset($_POST['reg'])) {
      $email = $this->fl_input( $_POST['email'] );
      $login = $this->fl_input( $_POST['login'] );
      $password = $this->fl_input( $_POST['password'] );
      $gender = $this->fl_input( $_POST['gender'] );
      $age = $this->fl_input( $_POST['age'] );
      $dt = date("Y.m.d");

      if ( $this->reg_correct( array('email' => $email, 'login' => $login, 'password' => $password, 'gender' => $gender, 'age' => $age) ) ) {
        $salt = $this->generateSalt();
        $password = md5($password . $salt);
        $token = md5(time() . $salt);

        if ($gender === 'M')
          $href_img = 'img_men_head.jpg';
        elseif ($gender === 'W' )
          $href_img = 'img_women_head.jpg';

        mysqli_query($this->getDB(), "INSERT INTO user(EMAIL, LOGIN, PASSWORD, SALT, GENDER, AGE, PICTURE, REG_DATE, TOKEN) VALUES ('$email', '$login', '$password', '$salt', '$gender', '$age', '$href_img', '$dt', '$token')");
        $user = $this->select_sql("SELECT ID FROM user WHERE LOGIN = '$login' AND PASSWORD = '$password'");
        if ( $this->send_code_mail($user[0]['ID']) ) {
          $_SESSION['registered'] = true;
        } else {
          $_SESSION['USER']['id'] = $user[0]['ID'];
          $_SESSION['registered'] = false;
        }
      }

      header("Location: http://" . HOST . '/confirmation');
    }
  }

  //validate
  private function reg_correct($d, $l = true) {
    $email = $d['email'];
    $login = $d['login'];
    $password = $d['password'];
    $gender = $d['gender'];
    $age = $d['age'];

    //email
    if ($email == "" || strlen($email) > 50) return false; //не пусто ли поле пароля
    if (!preg_match('/^([a-z0-9])(\w|[.]|-|_)+([a-z0-9])@([a-z0-9])([a-z0-9.-]*)([a-z0-9])([.]{1})([a-z]{2,4})$/is', $email)) return false; //соответствует ли поле e-mail регулярному выражению

    // login
    if ($login == "" || strlen($login) > 50 || strlen($login) < 3) return false;
    if (!preg_match('/^([a-zA-Z0-9])(\w|-|_)+([a-z0-9])$/is', $login)) return false; // соответствует ли логин регулярному выражению

    // password
    if ($password == "" || strlen($password) < 6 || strlen($password) > 15) return false; //не пусто ли поле пароля

    // gender
    if ($gender !== 'W' && $gender !== 'M') return false;

    // age
    $age -= 0;
    if (strlen($age) !== 2 ) return false;

    if ($l) {
      $login = $this->fl_input( $_POST['login'] );
      $rez = $this->select_sql("SELECT * FROM user WHERE LOGIN = '$login'");
      if ( !empty($rez) ) return false; // проверка на существование в БД такого же логина
    }

  	return true; //если выполнение функции дошло до этого места, возвращаем true }
  }

  public function confirm_mail($t) {
    if ( !empty( $t ) && strlen( $t ) === 32 ) {
      $idt = mysqli_query($this->getDB(), "SELECT ID FROM user WHERE TOKEN = '$t'");
      if (@mysqli_num_rows($idt) > 0) {
        $idts = mysqli_query($this->getDB(), "SELECT ID FROM user WHERE TOKEN = '$t' AND STATUS = '0'");
        if (@mysqli_num_rows($idts) == 1) {
          mysqli_query($this->getDB(), "UPDATE user SET STATUS = 1, TOKEN = '' WHERE TOKEN = '$t'");
          $msg="Поздравляем! Вы подтвердили свой адрес электронной почты.";
        }
      } else {
        $msg ="Неверный код подтверждения.";
      }
    } else {
      $msg ="Неверный код подтверждения.";
    }

    return $msg;
  }

  public function send_code_mail($id) {
    $user = $this->select_sql("SELECT EMAIL, TOKEN FROM user WHERE ID = '$id'");
    $from = "info@doremi.tj";
    $to = $user[0]['EMAIL'];
    $subject = "Подтверждение адреса электронной почты";
    $message = "
      Здравствуйте!\r\n
      На сайте Doremi.tj была создана учетная запись с этим адресом электронной почты.\r\n
      Если это сделали Вы, пожалуйста, нажмите на ссылку ниже, чтобы подтвердить этот адрес электронной почты.\r\n
      http://doremi.tj/confirmation?token=" . $user[0]['TOKEN'] . "\r\n
      Если Вы не создавали учетную запись, просто проигнорируйте это сообщение.
    ";
    $headers = "From:" . $from;

    return mail($to, $subject, $message, $headers);
  }
}


?>
