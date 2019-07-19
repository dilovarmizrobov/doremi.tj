<?php
namespace App\Models;
/**
 * Upload Model
 */
class Upload extends \Core\Model
{

  public function add() {
    $errors = array();
    $name = $this->fl_input( $_POST['name'] );
    $artist = $this->fl_input( $_POST['artist'] );
    $time = $this->fl_input( $_POST['time'] );

    if ( empty( $name ) ) $errors[] = "Имя трек не заполнено! ";

    if ( empty( $artist ) ) $errors[] = "Исполнитель не выбран! ";

    if ( !preg_match('/^([0-9]+)\:([0-9]+)$/i', $time) || strlen( $time ) != 5 ) $errors[] = "Файл не выбран! ";

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
      $name .= ' – ' . $artist;
      $size = round( $file_size/1048576, 2 );
      $date = date( "Y.m.d" );
      $hrsng = md5( time() );

      move_uploaded_file( $file_tmp, ROOT.'/public/upload/song/'.$hrsng.'.mp3' );

      mysqli_query( $this->getDB(), "INSERT INTO upsong( SNG_TITLE, SNG_TIME, SNG_SIZE, SNG_DATE, SNG_HREF ) VALUES ( '$name', '$time', '$size', '$date', '$hrsng') " );
      echo json_encode(
        array(
          "result" => "Успешно добавлено! Музыка отправлена на модерацию.",
          "error" => false
        )
      );
    } else {
      $er = '';
      for ( $i = 0; $i < count($errors) - 1; $i++ ) $er .= $errors[$i];
      echo json_encode(
        array(
          "result" => $er,
          "error" => count($errors) - 1
        )
      );
    }
  }
}
