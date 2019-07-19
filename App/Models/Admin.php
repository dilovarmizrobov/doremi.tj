<?
namespace App\Models;

if ( file_exists(ROOT . '/models/SearchModel.php') ) {
  include_once(ROOT . '/models/SearchModel.php');
}

class Admin extends \Core\Model
{

  function __construct() {
    $this->search = new Search;
  }

  public function get_user_statistics() {
    return $this->select_sql("SELECT COUNT(*) as COUNT_USR FROM user");
  }

  public function get_song_statistics() {
    return $this->select_sql("SELECT COUNT(*) as COUNT_SNG FROM song");
  }

  public function get_artist_statistics() {
    return $this->select_sql("SELECT COUNT(*) as COUNT_ART FROM artist");
  }

  public function get_playlist_statistics() {
    return $this->select_sql("SELECT COUNT(*) as COUNT_PLS FROM playlist");
  }

  public function get_data_user($q) {
    return $this->select_sql($q);
  }
  //
  public function last_product($id, $product) {
    if ($product === 'song') {
      return $this->get_song("SELECT * FROM song ORDER BY SNG_ID DESC LIMIT $id");
    } elseif ($product === 'artist') {
      return $this->select_sql("SELECT * FROM artist ORDER BY ART_ID DESC LIMIT $id");
    } elseif ($product === 'playlist') {
      $ply = $this->select_sql("SELECT * FROM playlist ORDER BY PLY_ID DESC LIMIT $id");
      for ($i = 0; $i < count($ply); $i++) {
        $ply_sng_numb = explode(',', $ply[$i]['PLY_SONGS']);

        if ( empty($ply_sng_numb[0]) ) {
          $ply[$i]['PLY_SONGS'] = array();
          continue;
        }

        $ply_sng = array();

        for ($j=0; $j < count($ply_sng_numb); $j++) {
          $ids = $ply_sng_numb[$j];
          $sng = $this->get_song("SELECT * FROM song WHERE SNG_ID = $ids");

          if( !empty($sng) )
            $ply_sng[] = $sng[0];
        }

        $ply[$i]['PLY_SONGS'] = $ply_sng;
      }
      return $ply;
    } elseif ($product === 'upsong') {
      return $this->select_sql("SELECT * FROM upsong ORDER BY SNG_ID DESC LIMIT $id");
    }
  }

  //SONG
  public function add_song() {
    $errors = array();
    $name = $this->fl_input( $_POST['name'] );
    $name = str_replace('-', '–', $name);
    $arts = $_POST['products'];
    $art_def = $this->fl_input( $_POST['art_def'] );
    $time = $_POST['time'];

    if ( empty( $name ) ) $errors[] = "Имя трек не заполнено! ";

    if ( empty( $arts ) ) $errors[] = "Исполнитель не выбран! ";

    $file_size = $_FILES['prd']['size'];
    $file_type = $_FILES['prd']['type'];
    $file_error = $_FILES['prd']['error'];
    $file_tmp = $_FILES['prd']['tmp_name'];

    if ( $file_error === 4 ) $errors[] = "Файл не выбран! ";
      else {
        if ( $file_size > 20971520 ) $errors[] = "Файл должен быть меньше 20 мб. ";
        if ( $file_type !== 'audio/mp3' ) $errors[] = "Неподдерживаемый тип! Поддерживаемый тип mp3. ";
        if ( $file_error > 0 ) $errors[] = "Ошибка вовремя загрузки. ";
      }

    if ( empty( $errors ) ) {
      $size = round( $file_size/1048576, 2 );
      $date = date( "Y.m.d" );
      $hrsng = md5( time() );

      move_uploaded_file( $file_tmp, ROOT.'/public/song/'.$hrsng.'.mp3' );

      mysqli_query( $this->getDB(), "INSERT INTO song( SNG_TITLE, SNG_ART, SNG_ART_DEF, SNG_TIME, SNG_SIZE, SNG_DATE, SNG_HREF, SNG_COUNT ) VALUES ( '$name', '$arts', '$art_def', '$time', '$size', '$date', '$hrsng', 0) " );
      echo '<script>alert("Успешно добавлено!");</script>';
      echo "<meta http-equiv='refresh' content='0'>";
    } else {
      $er = '';
      for ( $i = 0; $i < count( $errors ); $i++ ) $er .= $errors[$i];
      echo '<script>alert("'.$er.'");</script>';
      echo "<meta http-equiv='refresh' content='0'>";
    }
  }

  public function edit_song() {
    $errors = array();
    $id = $_POST['edit'];
    $name = $this->fl_input( $_POST['name'] );
    $name = str_replace('-', '–', $name);
    $arts = $_POST['products'];
    $art_def = $this->fl_input( $_POST['art_def'] );
    $time = $_POST['time'];

    if ( empty( $name) ) $errors[] = "Имя трека не заполнено! ";

    if ( empty( $arts ) ) $errors[] = "Исполнитель не выбран! ";

    $file_error = $_FILES['prd']['error'];
    $file_size = $_FILES['prd']['size'];
    $file_type = $_FILES['prd']['type'];
    $file_tmp = $_FILES['prd']['tmp_name'];

    if ( $file_error !== 4 ) {
      if ( $file_size > 20971520 ) $errors[] = "Файл должен быть меньше 20 мб. ";
      if ($file_type !== 'audio/mp3') $errors[] = "Неподдерживаемый тип! Поддерживаемый тип mp3. ";
      if ( $file_error > 0 ) $errors[] = "Ошибка вовремя загрузки. ";
    }

    if ( empty( $errors ) ) {
      if ( $file_error !== 4 ) $this->change_song( $id, $file_tmp );

      mysqli_query( $this->getDB(), "UPDATE song SET SNG_TITLE = '$name', SNG_ART = '$arts', SNG_ART_DEF = '$art_def', SNG_TIME = '$time' WHERE SNG_ID = $id" );
      echo '<script>alert("Успешно изменено!");</script>';
      echo "<meta http-equiv='refresh' content='0'>";
    } else {
      $er = '';
      for ( $i = 0; $i < count( $errors ); $i++ ) $er .= $errors[$i];
      echo '<script>alert("'.$er.'");</script>';
      echo "<meta http-equiv='refresh' content='0'>";
    }
  }

  public function remove_song($id) {
    $sng_href = $this->select_sql("SELECT SNG_HREF FROM song WHERE SNG_ID = $id");
    $sng_href = ROOT . '/public/song/' . $sng_href[0]["SNG_HREF"] . '.mp3';

    if ( ( file_exists( $sng_href ) && unlink( $sng_href ) ) || !file_exists( $sng_href ) ) {
      $res_qry = mysqli_query($this->getDB(), "DELETE FROM song WHERE SNG_ID = $id");
      echo json_encode(array('result'=>'true'));
    } else {
      echo json_encode(array('result'=>'false'));
    }
  }

  public function change_song( $id, $file_tmp ) {
    $sng_href = $this->select_sql( "SELECT SNG_HREF FROM song WHERE SNG_ID = $id" );
    $sng_href = ROOT . '/public/song/' . $sng_href[0]["SNG_HREF"] . '.mp3';

    if ( ( file_exists( $sng_href ) && unlink( $sng_href ) ) || !file_exists( $sng_href ) ) {
      $hrsng = md5( time() );
      move_uploaded_file( $file_tmp, ROOT . '/public/song/' . $hrsng . '.mp3' );
      mysqli_query( $this->getDB(), "UPDATE song SET SNG_HREF = '$hrsng' WHERE SNG_ID = $id" );
      return true;
    }
    return false;
  }


  // ARTIST
  public function add_artist() {
    $errors = array();
    $name = $this->fl_input( $_POST['name'] );
    $info = $this->fl_input( $_POST['info'] );
    $genre = $_POST['genre'];

    if ( empty($name) ) $errors[] = "Поля имя не заполнено! ";

    if ($genre === '0') $errors[] = "Поля жанр не заполнено! ";

    $file_size = $_FILES['prd']['size'];
    $file_type = $_FILES['prd']['type'];
    $file_error = $_FILES['prd']['error'];
    $file_tmp = $_FILES['prd']['tmp_name'];

    if ( $file_error === 4 ) $hrart = 'unknown-artist.jpg';
      else {
        if ( $file_size > 20971520 ) $errors[] = "Файл должен быть меньше 20 мб. ";
        if ( $file_type !== 'image/jpeg' ) $errors[] = "Неподдерживаемый тип! Поддерживаемый тип jpeg или jpg. ";
        if ( $file_error > 0 ) $errors[] = "Ошибка вовремя загрузки. ";
      }

    if ( empty( $errors ) ) {
      if ( $file_error !== 4 ) {
        $hrart = md5( time() ) . '.jpg';
        move_uploaded_file( $file_tmp, ROOT.'/public/img/artists/' . $hrart );
      }

      mysqli_query( $this->getDB(), "INSERT INTO artist( ART_NAME, ART_GENRE, ART_INFO, ART_PICTURE ) VALUES ( '$name', '$genre', '$info', '$hrart' )" );
      echo '<script>alert("Успешно добавлено!");</script>';
      echo "<meta http-equiv='refresh' content='0'>";
    } else {
      $er = '';

      for ( $i = 0; $i < count( $errors ); $i++ ) $er .= $errors[$i];
      echo '<script>alert("'.$er.'");</script>';
      echo "<meta http-equiv='refresh' content='0'>";
    }
  }

  public function edit_artist() {
    $errors = array();
    $id = $_POST['edit'];
    $name = $this->fl_input( $_POST['name'] );
    $info = $this->fl_input( $_POST['info'] );
    $genre = $_POST['genre'];
    $delete = $_POST['delete'];

    if ( empty( $name ) ) $errors[] = "Поля имя не заполнено! ";

    if ( $genre === '0' ) $errors[] = "Поля жанр не заполнено! ";

    $file_error = $_FILES['prd']['error'];
    $file_size = $_FILES['prd']['size'];
    $file_type = $_FILES['prd']['type'];
    $file_tmp = $_FILES['prd']['tmp_name'];

    if ( $file_error !== 4 ) {
      if ( $file_size > 20971520 ) $errors[] = "Файл должен быть меньше 20 мб. ";
      if ( $file_type !== 'image/jpeg' ) $errors[] = "Неподдерживаемый тип! Поддерживаемый тип jpeg или jpg. ";
      if ( $file_error > 0 ) $errors[] = "Ошибка вовремя загрузки. ";
    }

    if ( empty( $errors ) ) {
      if ( $file_error !== 4 ) $this->change_picture_artist( $id, $file_tmp );

      if ( $delete ) $this->remove_picture_artist( $id );

      mysqli_query( $this->getDB(), "UPDATE artist SET ART_NAME = '$name', ART_GENRE = '$genre', ART_INFO = '$info' WHERE ART_ID = $id" );
      echo '<script>alert("Успешно изменено!");</script>';
      echo "<meta http-equiv='refresh' content='0'>";
    } else {
      $er = '';
      for ( $i = 0; $i < count( $errors ); $i++ ) $er .= $errors[$i];
      echo '<script>alert("'.$er.'");</script>';
      echo "<meta http-equiv='refresh' content='0'>";
    }
  }

  public function remove_picture_artist( $id ) {
    $art_def = 'unknown-artist.jpg';
    $art_href = $this->select_sql( "SELECT ART_PICTURE FROM artist WHERE ART_ID = $id" );

    if ( $art_href[0]["ART_PICTURE"] === $art_def ) return true;

    $art_href = ROOT . '/public/img/artists/' . $art_href[0]["ART_PICTURE"];

    if ( ( file_exists( $art_href ) && unlink( $art_href ) ) || !file_exists( $art_href ) ) {
      mysqli_query( $this->getDB(), "UPDATE artist SET ART_PICTURE = '$art_def' WHERE ART_ID = $id" );
      return true;
    }
    return false;
  }

  public function change_picture_artist( $id, $file_tmp ) {
    if ( $this->remove_picture_artist( $id ) ) {
      $hrart = md5( time() ) . '.jpg';
      move_uploaded_file( $file_tmp, ROOT.'/public/img/artists/' . $hrart );
      mysqli_query( $this->getDB(), "UPDATE artist SET ART_PICTURE = '$hrart' WHERE ART_ID = $id" );
      return true;
    }
    return false;
  }


  //PLAYLIST
  public function add_playlist() {
    $errors = array();
    $name = $this->fl_input( $_POST['name'] );
    $info = $this->fl_input( $_POST['info'] );
    $sng = $_POST['products'];
    $date = date( "Y.m.d" );

    if ( empty( $name ) ) $errors[] = "Поля названия пуста! ";

    $file_size = $_FILES['prd']['size'];
    $file_type = $_FILES['prd']['type'];
    $file_error = $_FILES['prd']['error'];
    $file_tmp = $_FILES['prd']['tmp_name'];

    if ( $file_error === 4 ) $hrply = 'unknown-artist.jpg';
      else {
        if ( $file_size > 20971520 ) $errors[] = "Файл должен быть меньше 20 мб. ";
        if ( $file_type !== 'image/jpeg' ) $errors[] = "Неподдерживаемый тип! Поддерживаемый тип jpeg или jpg. ";
        if ( $file_error > 0 ) $errors[] = "Ошибка вовремя загрузки. ";
      }

    if ( empty( $errors ) ) {
      if ( $file_error !== 4 ) {
        $hrply = md5( time() ) . '.jpg';
        move_uploaded_file($file_tmp, ROOT . '/public/img/playlists/' . $hrply);
      }

      mysqli_query( $this->getDB(), "INSERT INTO playlist(PLY_TITLE, PLY_DESCRIPTION, PLY_PICTURE, PLY_DATE, PLY_SONGS ) VALUES ( '$name', '$info', '$hrply', '$date', '$sng' )" );
      echo '<script>alert("Успешно добавлено!");</script>';
      echo "<meta http-equiv='refresh' content='0'>";
    } else {
      $er = '';
      for ($i = 0; $i < count($errors); $i++) $er .= $errors[$i];
      echo '<script>alert("'.$er.'");</script>';
      echo "<meta http-equiv='refresh' content='0'>";
    }
  }

  public function edit_playlist() {
    $errors = array();
    $id = $_POST['edit'];
    $name = $this->fl_input( $_POST['name'] );
    $info = $this->fl_input( $_POST['info'] );
    $sng = $_POST['products'];
    $delete = $_POST['delete'];

    if ( empty( $name ) ) $errors[] = "Поля названия пуста! ";

    $file_error = $_FILES['prd']['error'];
    $file_size = $_FILES['prd']['size'];
    $file_type = $_FILES['prd']['type'];
    $file_tmp = $_FILES['prd']['tmp_name'];

    if ( $file_error !== 4 ) {
      if ( $file_size > 20971520 ) $errors[] = "Файл должен быть меньше 20 мб. ";
      if ( $file_type !== 'image/jpeg' ) $errors[] = "Неподдерживаемый тип! Поддерживаемый тип jpeg или jpg. ";
      if ( $file_error > 0 ) $errors[] = "Ошибка вовремя загрузки. ";
    }

    if ( empty($errors) ) {
      if ( $file_error !== 4 ) $this->change_picture_playlist( $id, $file_tmp );

      if ( $delete ) $this->remove_picture_playlist( $id );

      mysqli_query( $this->getDB(), "UPDATE playlist SET PLY_TITLE = '$name', PLY_DESCRIPTION = '$info', PLY_SONGS = '$sng' WHERE PLY_ID = '$id'" );
      echo '<script>alert("Успешно изменено!");</script>';
      echo "<meta http-equiv='refresh' content='0'>";
    } else {
      $er = '';
      for ($i = 0; $i < count($errors); $i++) $er .= $errors[$i];
      echo '<script>alert("'.$er.'");</script>';
      echo "<meta http-equiv='refresh' content='0'>";
    }
  }

  public function remove_picture_playlist( $id ) {
    $ply_def = 'unknown-artist.jpg';
    $ply_href = $this->select_sql( "SELECT PLY_PICTURE FROM playlist WHERE PLY_ID = $id" );

    if ( $ply_href[0]["PLY_PICTURE"] === $ply_def ) return true;

    $ply_href = ROOT . '/public/img/playlists/' . $ply_href[0]["PLY_PICTURE"];

    if ( ( file_exists( $ply_href ) && unlink( $ply_href ) ) || !file_exists( $ply_href ) ) {
      mysqli_query( $this->getDB(), "UPDATE playlist SET PLY_PICTURE = '$ply_def' WHERE PLY_ID = $id" );
      return true;
    }
    return false;
  }

  public function change_picture_playlist( $id, $file_tmp ) {
    if ( $this->remove_picture_playlist( $id ) ) {
      $hrply = md5( time() ) . '.jpg';
      move_uploaded_file( $file_tmp, ROOT.'/public/img/playlists/' . $hrply );
      mysqli_query( $this->getDB(), "UPDATE playlist SET PLY_PICTURE = '$hrply' WHERE PLY_ID = $id" );
      return true;
    }
    return false;
  }


  //UPSONG
  public function approve_upsong() {
    $errors = array();
    $id = $_POST['approve'];
    $name = $this->fl_input( $_POST['name'] );
    $arts = $_POST['products'];
    $art_def = $this->fl_input( $_POST['art_def'] );
    $time = $_POST['time'];
    $size = $_POST['size'];
    $date = $_POST['date'];
    $hrsng = $_POST['href'];
    if ( empty( $name ) ) $errors[] = "Имя трек не заполнено! ";

    if ( empty( $arts ) ) $errors[] = "Исполнитель не выбран! ";

    if ( empty( $errors ) ) {
      rename( ROOT . '/public/upload/song/' . $hrsng . '.mp3', ROOT . '/public/song/' . $hrsng . '.mp3' );

      mysqli_query( $this->getDB(), "INSERT INTO song( SNG_TITLE, SNG_ART, SNG_ART_DEF, SNG_TIME, SNG_SIZE, SNG_DATE, SNG_HREF, SNG_COUNT ) VALUES ( '$name', '$arts', '$art_def', '$time', '$size', '$date', '$hrsng', 0) " );
      $this->disapprove_upsong( $id );
      echo '<script>alert("Успешно добавлено!");</script>';
      echo "<meta http-equiv='refresh' content='0'>";
    } else {
      $er = '';
      for ( $i = 0; $i < count( $errors ); $i++ ) $er .= $errors[$i];
      echo '<script>alert("'.$er.'");</script>';
      echo "<meta http-equiv='refresh' content='0'>";
    }
  }

  public function disapprove_upsong($id) {
    $sng_href = $this->select_sql("SELECT SNG_HREF FROM upsong WHERE SNG_ID = $id");
    $sng_href = ROOT . '/public/upload/song/' . $sng_href[0]["SNG_HREF"] . '.mp3';

    if ( ( file_exists( $sng_href ) && unlink( $sng_href ) ) || !file_exists( $sng_href ) ) {
      $res_qry = mysqli_query($this->getDB(), "DELETE FROM upsong WHERE SNG_ID = $id");
      echo json_encode(array('result'=>'true'));
    } else {
      echo json_encode(array('result'=>'false'));
    }
  }
}

?>
