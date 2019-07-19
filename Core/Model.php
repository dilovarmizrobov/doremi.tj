<?php

namespace Core;

use PDO;
use App\Config;

/**
 * Base model
 *
 * PHP version 7.0
 */
abstract class Model extends \App\Library\AppFunction
{

    /**
     * Get the MySql database connection
     *
     * @return mixed
     */


    // Get Songs Artist
    public function get_art_sng($id, $f = 'track') {
      $q = $id;
      $q_before = $id.',%';
      $q_after = '%,'.$id;
      $q_between = '%,'.$id.',%';

      if ($f === 'top_track') {
        $q_sng = "SELECT * FROM song WHERE SNG_ART LIKE '$q' OR SNG_ART LIKE '$q_before' OR SNG_ART LIKE '$q_after' OR SNG_ART LIKE '$q_between' ORDER BY SNG_RANK DESC";
      } else {
        $q_sng = "SELECT * FROM song WHERE SNG_ART LIKE '$q' OR SNG_ART LIKE '$q_before' OR SNG_ART LIKE '$q_after' OR SNG_ART LIKE '$q_between' ORDER BY SNG_ID DESC";
      }

      return $this->get_song($q_sng);
    }

    // Get Artis
    public function get_artist($id, $p) {
      $art = $this->select_sql("SELECT * FROM artist, genre WHERE ART_ID = $id AND artist.ART_GENRE = genre.GENRE_ID");
      if ( empty($art) ) return $art;
        else $art = $art[0];
      $art["ART_SNG"] = $this->get_art_sng($id, $p);
      return $art;
    }

    public function get_playlist($id) {
      $ply = $this->select_sql("SELECT * FROM playlist WHERE PLY_ID = $id");
      $ply = $ply[0];

      $ply_sng_numb = explode(',', $ply['PLY_SONGS']);

      if ( empty($ply_sng_numb[0]) ) {
        $ply['PLY_SONGS'] = array();
        return $ply;
      }

      $ply_sng = array();

      for ($j=0; $j < count($ply_sng_numb); $j++) {
        $sng = $this->get_song_id($ply_sng_numb[$j]);
        $ply_sng[] = $sng;
      }

      $ply['PLY_SONGS'] = $ply_sng;

      return $ply;
    }

    public function get_song_id($id) {
      $s = $this->get_song("SELECT * FROM song WHERE SNG_ID = $id");
      if (empty($s)) return $s;
        else return $s[0];
    }

    public function get_artist_id($id) {
      $r =  $this->select_sql("SELECT ART_ID, ART_NAME, ART_PICTURE, ART_RANK FROM artist WHERE ART_ID = $id");
      return $r[0];
    }

    public function get_playlist_id($id) {
      $q_ply = $this->select_sql("SELECT PLY_ID, PLY_TITLE, PLY_PICTURE, PLY_RANK, PLY_SONGS FROM playlist WHERE PLY_ID = $id");

      for ($i=0; $i < count($q_ply); $i++) {
        $q_ply[$i]['PLY_SONGS'] = count( explode(',', $q_ply[$i]['PLY_SONGS']) );
      }

      return $q_ply[0];
    }


    public function get_song($q) {
      $sng = $this->select_sql($q);

      for ($i = 0; $i < count($sng); $i++) {
        $art_id = explode(',', $sng[$i]["SNG_ART"]);
        $r_art = array();

        for ($j = 0; $j < count($art_id); $j++) {
          $art = $this->select_sql("SELECT ART_ID, ART_NAME FROM artist WHERE ART_ID = $art_id[$j]");
          $r_art[] = $art[0];
        }

        $sng[$i]['SNG_ART'] = $r_art;
      }

      return $sng;
    }

    // GET DATABASE
    protected static function getDB() {
      static $db = null;

      if ($db === null) {
        $db = mysqli_connect(Config::DB_HOST, Config::DB_USER, Config::DB_PASSWORD, Config::DB_NAME);
        $db->set_charset("utf8");
      }

      return $db;
    }

    // SELECT SQL
    protected function select_sql($q) {
      $query = mysqli_query($this->getDB(), $q);
      $res = array();

      if (@mysqli_num_rows($query) == 0)
        return $res;

      while ( $r = $query->fetch_assoc() )
        $res[] = $r;

      return $res;
    }

    //INSERT UPDATE DELETE SQL
    public function iud_sql($s) {
      return mysqli_query($this->getDB(), $s);
    }

    //FILTER INPUT
    public function fl_input($str) {
      return mysqli_real_escape_string( $this->getDB(), htmlspecialchars( strip_tags( trim( $str ) ) ) );
    }

    //GENERATE SALT
    public function generateSalt() {
      $salt = '';
      $length = rand(5, 10);

      for($i = 0; $i < $length; $i++)
        $salt .= chr(rand(33,126));

      return $salt;
    }

    public function get_validate_input($input, $type) {
      if ( empty($input) ) return;

      if ($type === 'login') {
        if (strlen($input) > 50 || strlen($input) < 3 || !preg_match('/^([a-zA-Z0-9])(\w|-|_)+([a-z0-9])$/is', $input)) return;
      } elseif ($type === 'password') {
        if (strlen($input) < 6 || strlen($input) > 15) return;
      } elseif ($type === 'email') {
        if (strlen($input) > 50) return;
        if ( !preg_match('/^([a-z0-9])(\w|[.]|-|_)+([a-z0-9])@([a-z0-9])([a-z0-9.-]*)([a-z0-9])([.]{1})([a-z]{2,4})$/is', $input) ) return;
      } elseif ($type === 'gender') {
        if ($input !== 'W' && $input !== 'M') return;
      } elseif ($type === 'age') {
        $input -= 0;
        if (strlen($input) !== 2 ) return;
      }

      return true;
    }
}
