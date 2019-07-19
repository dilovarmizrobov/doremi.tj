<div class="artist-content">
<?
  if ( count( $art ) == 0 ) {
?>
  <div class="nosong">
    <img class="nocontent" src="/public/img/nocontent.png">
  </div>
<?
  }

  for ( $i = 0; $i < count( $art ); $i++ ) {
    $loved = '';
    if ( isset( $_SESSION['IS_USER'] ) )
      for ( $j = 0; $j < count( $_SESSION['USER']['ARTISTS'] ); $j++ )
        if ( $art[$i]['ART_ID'] === $_SESSION['USER']['ARTISTS'][$j] )
          $loved = ' loved';
?>
  <div class="artist-item" data-id="<? echo $art[$i]['ART_ID'] ?>">
    <div class="a-i-picture">
      <img src="<? echo '/public/img/artists/' . $art[$i]['ART_PICTURE']; ?>" title="<? echo $art[$i]['ART_NAME']; ?>">
      <button class="loved-artist<? echo $loved; ?>"></button>
    </div>
    <div class="a-i-name">
      <div class="a-i-n-artist l-text">
        <a class="a-1" href="<? echo '/artist/' . $art[$i]['ART_ID']; ?>"><? echo $art[$i]['ART_NAME']; ?></a>
      </div>
      <div class="a-i-n-fans l-text"><? echo $art[$i]['ART_RANK'] . ' просмотров'; ?></div>
    </div>
  </div>
<?
  }
?>
</div>
