<?
  $loved = '';
  if ( isset($_SESSION['IS_USER']) ) {
    for ($j=0; $j < count($_SESSION['USER']['PLAYLISTS']) ; $j++) {
      if ($ply['PLY_ID'] === $_SESSION['USER']['PLAYLISTS'][$j]) {
        $loved = ' loved';
      }
    }
  }

  $ply_m = $ply_s = 0;
  for ($i=0; $i < count($ply['PLY_SONGS']); $i++) {
    $dur_song = explode( ':', $ply['PLY_SONGS'][$i]['SNG_TIME'] );
    $ply_m += $dur_song[0] - 0;
    $ply_s += $dur_song[1] - 0;
  }
  $ply_m += round($ply_s / 60);
  $ply_h = ($ply_m - ($ply_m % 60))/60;
  $ply_m = $ply_m % 60;

  $source_songs = count($ply['PLY_SONGS']) . ' треков · ' . $ply_h . ' ч ' . $ply_m . ' мин · ' . $ply['PLY_RANK'] . ' просмотров';
?>

<div class="page-main">
  <div class="row">
    <div class="page-playlist">
      <div class="pp-header clearfix">
        <div class="pp-img"  data-id="<? echo $ply['PLY_ID'] ?>">
          <img src="<? echo '/public/img/playlists/' . $ply['PLY_PICTURE']; ?>">
          <div class="loved-playlist<? echo $loved; ?>"></div>
        </div>
        <div class="pp-info">
          <div class="ppi-title"><? echo $ply['PLY_TITLE']; ?></div>
          <div class="ppi-info"><? echo $ply['PLY_DESCRIPTION'] ?></div>
          <div class="ppi-source"><?php echo $source_songs ?></div>
        </div>
      </div>
      <div class="pp-body">
        <? $this->t_song($ply['PLY_SONGS']); ?>
      </div>
    </div>
  </div>
</div>
