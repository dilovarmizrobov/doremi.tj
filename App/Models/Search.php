<?php
namespace App\Models;

class Search extends \Core\Model
{
  public function search_product($string, $table, $column, $limit = 10, $function = 'select_sql') {
    $string_ru = $this->translit($string, 'ru');
    $string_en = $this->translit($string);
    $before_ru = $string_ru . '%';
    $before_en = $string_en . '%';
    $between_ru = '%' . ' ' . $string_ru . '%';
    $between_en = '%' . ' ' . $string_en . '%';
    $after_ru = '%' . ' ' . $string_ru;
    $after_en = '%' . ' ' . $string_en;
    return $this->$function("SELECT * FROM $table WHERE $column LIKE '$before_ru' OR $column LIKE '$before_en' OR $column LIKE '$between_ru' OR $column LIKE '$between_en' OR $column LIKE '$after_ru' OR $column LIKE '$after_en' LIMIT $limit");
  }

  public function search_song($string, $limit = 100) {
    return $this->search_product($string, 'song', 'SNG_TITLE', $limit, 'get_song');
  }

  public function search_artist($string, $limit = 50) {
    return $this->search_product($string, 'artist', 'ART_NAME', $limit);
  }

  public function search_playlist($string, $limit = 50) {
    $ply = $this->search_product($string, 'playlist', 'PLY_TITLE', $limit);

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
        if ( !empty($sng) )
          $ply_sng[] = $sng[0];
      }

      $ply[$i]['PLY_SONGS'] = $ply_sng;
    }
    return $ply;
  }
}

?>
