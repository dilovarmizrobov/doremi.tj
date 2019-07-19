<div class="page-main">
  <div class="row">
    <h2>
      <? echo $heading ?>
    </h2>
  </div>
  <div class="row clearfix">
    <div class="res-con-song">
      <p class="des-2">Найдено: <?echo count($art); ?> артиста</p>

      <? $this->t_artist($art); ?>

      <p class="des-2">Найдено: <?echo count($sng); ?> песен</p>

      <? $this->t_song($sng); ?>

    </div>
    <div class="res-con-banner">
      <h2 class="tit-2">Реклама</h2>
      <div class="banner-link">
        <img src="/public/img/ban.jpg" alt="Реклама">
      </div>
      <div class="info-doremi">
        Doremi 2018 – <a target="_blank" href='/about'>О нас.</a>
      </div>
    </div>
  </div>
</div>
