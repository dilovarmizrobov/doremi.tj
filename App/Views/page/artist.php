<?
$loved = '';
if ( isset($_SESSION['IS_USER']) ) {
  for ($j=0; $j < count($_SESSION['USER']['ARTISTS']) ; $j++) {
    if ($art['ART_ID'] === $_SESSION['USER']['ARTISTS'][$j]) {
      $loved = ' loved';
    }
  }
}
?>

<div class="page-main">
  <div class="row clearfix">
    <div class="page-artist">
      <div class="pa-header clearfix">
        <div class="pa-img" data-id="<? echo $art['ART_ID'] ?>">
          <img src="<? echo '/public/img/artists/' . $art['ART_PICTURE'] ?>">
          <div class="loved-artist <? echo $loved; ?>"></div>
        </div>
        <div class="pa-info">
          <div class="pai-executor">ИСПОЛНИТЕЛЬ</div>
          <div class="pai-name"><? echo $art['ART_NAME'] ?></div>
          <span class="pai-genre"><? echo $art['GENRE'] ?></span>
          <div class="pai-popul"><? echo $art['ART_RANK'] ?> просмотров</div>
          <div class="pai-text"><? echo $art['ART_INFO'] ?></div>
        </div>
        <div class="pa-nav">
          <a href="/artist/<? echo $pid; ?>/track"><div class="pa-sort-date<? if ($page === 'track') echo " pa-nav-active"; ?>">ТРЕКИ</div></a>
          <a href="/artist/<? echo $pid; ?>/top_track"><div class="pa-sort-popul<? if ($page === 'top_track') echo " pa-nav-active"; ?>">ПОПУЛЯРНЫЕ ТРЕКИ</div></a>
        </div>
      </div>
      <div class="pa-body">
        <? $this->t_song($art["ART_SNG"]); ?>
      </div>
    </div>
  </div>
</div>
