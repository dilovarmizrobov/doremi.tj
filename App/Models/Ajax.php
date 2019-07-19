<?php
namespace App\Models;

class Ajax extends \Core\Model
{
  public function listened_song($id) {
    return $this->iud_sql("UPDATE song SET SNG_RANK = SNG_RANK + 1 WHERE SNG_ID = '$id'");
  }

  public function love_unlove_product($id, $prd, $l) {
    $love_songs = $_SESSION['USER'][$prd];
    $key = array_search($id, $love_songs);
    $u_id = $_SESSION['USER']['ID'];

    if ($l) {
      if ($key !== false ) return;
      $love_songs[] = "$id";
    } else {
      if ($key === false ) return;
      array_splice($love_songs, $key, 1);
    }

    $str_sng = implode(",", $love_songs);
    $_SESSION['USER'][$prd] = $love_songs;

    if( $this->iud_sql("UPDATE user SET $prd = '$str_sng' WHERE ID = '$u_id'") ) {
      if ($l)
        echo json_encode('loved');
      else
        echo json_encode('unloved');
      return true;
    }
  }
}

?>
