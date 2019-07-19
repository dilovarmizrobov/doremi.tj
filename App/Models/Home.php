<?php
namespace App\Models;

class Home extends \Core\Model
{

  public function new_song($id) {
    $count_row = 15;
    $first_row = $id * $count_row - $count_row;

    return $this->get_song("SELECT * FROM song ORDER BY SNG_ID DESC LIMIT $first_row, $count_row");
  }

  public function popular_song($id) {
    $count_row = 15;
    $first_row = $id * $count_row - $count_row;

    return $this->get_song("SELECT * FROM song ORDER BY SNG_RANK DESC LIMIT $first_row, $count_row");
  }

  public function new_artist($c) {
    return $this->select_sql("SELECT ART_ID, ART_NAME, ART_PICTURE, ART_RANK FROM artist ORDER BY ART_ID DESC LIMIT $c");
  }

  public function popular_artist($c) {
    return $this->select_sql("SELECT ART_ID, ART_NAME, ART_PICTURE, ART_RANK FROM artist ORDER BY ART_RANK DESC LIMIT $c");
  }

  public function new_playlist($p) {
    $q_ply = $this->select_sql("SELECT PLY_ID, PLY_TITLE, PLY_PICTURE, PLY_RANK, PLY_SONGS FROM playlist ORDER BY PLY_ID DESC LIMIT $p");

    for ($i=0; $i < count($q_ply); $i++) {
      $ply_sng_numb = explode(',', $q_ply[$i]['PLY_SONGS']);

      if ( empty($ply_sng_numb[0]) ) {
        $q_ply[$i]['PLY_SONGS'] = 0;
        continue;
      }

      $q_ply[$i]['PLY_SONGS'] = count( $ply_sng_numb );
    }

    return $q_ply;
  }

  public function popular_playlist($p) {
    $q_ply = $this->select_sql("SELECT PLY_ID, PLY_TITLE, PLY_PICTURE, PLY_RANK, PLY_SONGS FROM playlist ORDER BY PLY_RANK DESC LIMIT $p");

    for ($i=0; $i < count($q_ply); $i++) {
      $q_ply[$i]['PLY_SONGS'] = count( explode(',', $q_ply[$i]['PLY_SONGS']) );
    }

    return $q_ply;
  }

  public function get_artists($pid, $c) {
    $first_row = $pid * $c - $c;

    return $this->select_sql("SELECT ART_ID, ART_NAME, ART_PICTURE, ART_RANK FROM artist ORDER BY ART_RANK DESC LIMIT $first_row, $c");
  }
}

?>
