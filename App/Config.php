<?php

namespace App;


/**
 * Application configuration
 *
 * PHP version 7.0
 */
class Config
{

  /**
  * Routs
  * @var array
  */
  public static function getRoutes() {
    return array(
      ''=>array('controller' => 'Home', 'action' => 'home'),
      'error'=>array('controller' => 'Home', 'action' => 'errors'),
      'about'=>array('controller' => 'Home', 'action' => 'about'),
      'new'=>array('controller' => 'Home', 'action' => 'new'),
      'new/page/([0-9]+)'=>array('controller' => 'Home', 'action' => 'new'),
      'popular'=>array('controller' => 'Home', 'action' => 'popular'),
      'popular/page/([0-9]+)'=>array('controller' => 'Home', 'action' => 'popular'),
      'artists'=>array('controller' => 'Home', 'action' => 'artists'),
      'artists/page/([0-9]+)'=>array('controller' => 'Home', 'action' => 'artists'),
      'artist/([0-9]+)'=>array('controller' => 'Home', 'action' => 'artist'),
      'artist/([0-9]+)/track'=>array('controller' => 'Home', 'action' => 'artist'),
      'artist/([0-9]+)/top_track'=>array('controller' => 'Home', 'action' => 'artist'),
      'playlist/([0-9]+)'=>array('controller' => 'Home', 'action' => 'playlist'),
      'song/([0-9]+)'=>array('controller' => 'Home', 'action' => 'song'),
      'search'=>array('controller' => 'Search', 'action' => 'run'),
      'downloadsong'=>array('controller' => 'Download', 'action' => 'load'),
      'login'=>array('controller' => 'User', 'action' => 'in'),
      'logout'=>array('controller' => 'User', 'action' => 'out'),
      'register'=>array('controller' => 'User', 'action' => 'register'),
      'upload'=>array('controller' => 'Upload', 'action' => 'home'),
      'ajax/love'=>array('controller' => 'Ajax', 'action' => 'love'),
      'ajax/rank'=>array('controller' => 'Ajax', 'action' => 'rank'),
      'account'=>array('controller' => 'User', 'action' => 'account'),
      'profile'=>array('controller' => 'User', 'action' => 'profile'),
      'profile/loved'=>array('controller' => 'User', 'action' => 'profileLoved'),
      'profile/playlists'=>array('controller' => 'User', 'action' => 'profilePlaylist'),
      'profile/artists'=>array('controller' => 'User', 'action' => 'profileArtist'),
      'panel'=>array('controller' => 'Admin', 'action' => 'home'),
      'panel/login'=>array('controller' => 'Admin', 'action' => 'in'),
      'panel/logout'=>array('controller' => 'Admin', 'action' => 'out'),
      'panel/song'=>array('controller' => 'Admin', 'action' => 'song'),
      'panel/artist'=>array('controller' => 'Admin', 'action' => 'artist'),
      'panel/playlist'=>array('controller' => 'Admin', 'action' => 'playlist'),
      'panel/moderation'=>array('controller' => 'Admin', 'action' => 'moderation'),
      'panel/ajax'=>array('controller' => 'Admin', 'action' => 'ajax'),
      'confirmation'=>array('controller' => 'User', 'action' => 'confirmation'),
      'listensong'=>array('controller' => 'Download', 'action' => 'listen'),
    );
  }


  /**
   * Database host
   * @var string
   */
  const DB_HOST = 'localhost';

  /**
   * Database name
   * @var string
   */
  const DB_NAME = 'resource';

  /**
   * Database user
   * @var string
   */
  const DB_USER = 'root';

  /**
   * Database password
   * @var string
   */
  const DB_PASSWORD = '';

  /**
   * Show or hide error messages on screen
   * @var boolean
   */
  const SHOW_ERRORS = true;
}
