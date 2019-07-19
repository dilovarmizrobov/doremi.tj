<div class="song-content">
<?
  if ( count( $sng ) == 0 ) {
?>
  <div class="nosong">
    <img class="nocontent" src="/public/img/nocontent.png">
  </div>
<?
  }

  for ( $i = 0; $i < count( $sng ); $i++ ) {
    $rate = round( $sng[$i]['SNG_RANK'] / 20, 2 );
    $sng_art = '';

    for ( $j = 0; $j < count( $sng[$i]['SNG_ART'] ); $j++ )
      $sng_art .= '<a class="a-1" href="/artist/' . $sng[$i]['SNG_ART'][$j]['ART_ID'] . '">' . $sng[$i]['SNG_ART'][$j]['ART_NAME'] . '</a>' . ( $j + 1 !== count( $sng[$i]['SNG_ART'] ) ? ', ' : '' );

    !empty( $sng[$i]['SNG_ART_DEF'] ) ? $sng_art .= ' & ' . $sng[$i]['SNG_ART_DEF'] : '';
    $loved = '';

    if ( isset( $_SESSION['IS_USER'] ) )
      for ( $j = 0; $j < count( $_SESSION['USER']['LOVED_SNG'] ); $j++)
        if ( $sng[$i]['SNG_ID'] === $_SESSION['USER']['LOVED_SNG'][$j] )
          $loved = ' loved';
?>
  <div class="song-item" data-id="<? echo $sng[$i]['SNG_ID']; ?>" data-name="<? echo $sng[$i]['SNG_HREF'] ?>">
    <button class="song-control play-btn"></button>
    <div class="name-song">
      <a href="<? echo '/song/' . $sng[$i]['SNG_ID']; ?>" class="a-1"><? echo $sng[$i]['SNG_TITLE']; ?></a> – <?php echo $sng_art; ?>
    </div>
    <button class="loved-song<? echo $loved; ?>"></button>
    <div class="s-popularity" title="Популярность: <? echo $rate; ?>/10">
<?
    for ($j = 0; $j < 10; $j++)
      echo '<span class="sp-item' . ( $j < round($rate) ? ' sp-rate' : !1 ) . '"></span>';
?>
    </div>
  </div>
<?
  }
?>
</div>
