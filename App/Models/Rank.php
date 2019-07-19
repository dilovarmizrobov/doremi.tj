<?php
namespace App\Models;

class Rank extends \Core\Model
{
  public function listened_song($href) {
    return $this->iud_sql("UPDATE song SET SNG_RANK = SNG_RANK + 1 WHERE SNG_HREF = '$href'");
  }

  public function download_song($id) {
    return $this->iud_sql("UPDATE song SET SNG_COUNT = SNG_COUNT + 1 WHERE SNG_ID = '$id'");
  }

  public function artist_views($id) {
    for ($i = 0; $i < count($_SESSION['VIEWS']); $i++)
      if (isset($_SESSION['VIEWS'][$i]['ART_ID']) && $id == $_SESSION['VIEWS'][$i]['ART_ID']) {
        if ( (time() - $_SESSION['VIEWS'][$i]['DATE']) > 86400 ) {
          mysqli_query($this->getDB(), "UPDATE artist SET ART_RANK = ART_RANK + 1 WHERE ART_ID = $id");
          $_SESSION['VIEWS'][$i]['DATE'] = time();
        }

        return;
      }

    $_SESSION['VIEWS'][] = array('ART_ID' => $id, 'DATE' => time());
    mysqli_query($this->getDB(), "UPDATE artist SET ART_RANK = ART_RANK + 1 WHERE ART_ID = $id");
  }

  public function playlist_views($id) {
    for ($i = 0; $i < count($_SESSION['VIEWS']); $i++)
      if (isset($_SESSION['VIEWS'][$i]['PLY_ID']) && $id == $_SESSION['VIEWS'][$i]['PLY_ID']) {
        if ( (time() - $_SESSION['VIEWS'][$i]['DATE']) > 86400 ) {
          mysqli_query($this->getDB(), "UPDATE playlist SET PLY_RANK = PLY_RANK + 1 WHERE PLY_ID = $id");
          $_SESSION['VIEWS'][$i]['DATE'] = time();        
        }
        
        return;
      }

    $_SESSION['VIEWS'][] = array('PLY_ID' => $id, 'DATE' => time());
    mysqli_query($this->getDB(), "UPDATE playlist SET PLY_RANK = PLY_RANK + 1 WHERE PLY_ID = $id");
  }
}

?>
