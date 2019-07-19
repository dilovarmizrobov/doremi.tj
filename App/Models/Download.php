<?php
namespace App\Models;

class Download extends \Core\Model
{
  public function get_data_song($href) {
    $sng = $this->get_song("SELECT * FROM song WHERE SNG_HREF = '$href'");

    if ( empty($sng) )
      return $sng;

    return $sng[0];
  }
}
