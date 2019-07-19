<div class="playlist-content">
<?
  if ( count( $ply ) == 0 ) {
?>
  <div class="nosong">
    <img class="nocontent" src="/public/img/nocontent.png">
  </div>
<?
  }

  for ( $i = 0; $i < count( $ply ); $i++ ) {
    $loved = '';

    if ( isset( $_SESSION['IS_USER'] ) )
      for ( $j = 0; $j < count( $_SESSION['USER']['PLAYLISTS'] ); $j++ )
        if ( $ply[$i]['PLY_ID'] === $_SESSION['USER']['PLAYLISTS'][$j] )
          $loved = ' loved';
?>
  <div class="playlist-item" data-id="<? echo $ply[$i]['PLY_ID'] ?>">
    <div class="pi-picture">
      <img src="<? echo '/public/img/playlists/' . $ply[$i]['PLY_PICTURE']; ?>" title="<? echo $ply[$i]['PLY_TITLE']; ?>">
      <button class="loved-playlist<? echo $loved; ?>"></button>
    </div>
    <div class="pi-name">
      <div class="pin-playlist l-text">
        <a class="a-1" href="<? echo '/playlist/' . $ply[$i]['PLY_ID']; ?>"><? echo $ply[$i]['PLY_TITLE']; ?></a>
      </div>
      <div class="pin-songs l-text"><? echo $ply[$i]['PLY_SONGS'] . ' треков – ' . $ply[$i]['PLY_RANK'] . ' просмотров'; ?></div>
    </div>
  </div>
<?
  }
?>
</div>
