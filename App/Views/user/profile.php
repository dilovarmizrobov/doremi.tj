<div class="page-main">
  <div class="row">
    <div class="page-mymusic">
      <div class="tit-2">Моя музыка</div>
    </div>
    <h1 class="tit-3"><? echo count($song); ?> любимых трека</h1>
    <? $this->t_song($song); ?>
    <h1 class="tit-3"><? echo count($artist)?> исполнителей</h1>
    <?php $this->t_artist($artist); ?>
    <h1 class="tit-3"><? echo count($playlist)?> плейлистов</h1>
    <?php $this->t_playlist($playlist); ?>
  </div>
</div>
