<?php
  $date = explode('-', $sng["SNG_DATE"]);
  $sng_art = '';

  for ($i=0; $i < count($sng['SNG_ART']); $i++) {
    $sng_art .= '<a class="a-1" href="/artist/' . $sng['SNG_ART'][$i]['ART_ID'] . '">' . $sng['SNG_ART'][$i]['ART_NAME'] . '</a>' . ($i+1 !== count($sng['SNG_ART']) ? ', ' : '' );
  }
?>
<div class="page-main">
  <div class="row clearfix">
    <div class="res-con-song">
      <div class="tr-block">
        <h1 class="tit-1"><? echo $sng['SNG_TITLE']; ?></h1>
        <div style="font-size: 18px;">Исполнитель: <b><?php echo $sng_art ?></b></div>
        <p>На музыкальном портале <b>Doremi.tj</b> Вы можете бесплатно скачать и слушать онлайн песню <b><? echo $sng['SNG_TITLE']; ?></b> в формате mp3.</p>
        <div class="song-content">
          <div class="song-item" data-id = "<? echo $sng['SNG_ID']; ?>" data-name="<? echo $sng['SNG_HREF'] ?>">
            <div class="song-control play-btn tr-control"></div>
            <div class="name-song" style="display: none;">
              <a href="<? echo '/track/' . $sng['SNG_ID']; ?>" class="a-1"><? echo $sng['SNG_TITLE']; ?></a> – <?php echo $sng_art; ?>
            </div>
            <div class="tr-params-song"><? echo $sng['SNG_TIME']; ?></div>
            <div class="tr-params-song"><? echo $sng['SNG_SIZE'] . ' МБ'; ?></div>
            <div class="tr-params-song"><? echo $date[2] . '.' . $date[1] . '.' . $date[0]; ?></div>
            <div class="tr-params-song"><? echo 'Скачиваний: ' . $sng['SNG_COUNT']; ?></div>
            <div class="tr-params-song tr-download">Скачать</div>
          </div>
        </div>
      </div>
      <h2 class="tit-2">Другие песни <? echo $sng_art; ?></h2>
      <? $this->t_song($over_sng); ?>
    </div>
    <div class="res-con-banner">
      <h2 class="tit-2" style="margin:30px 0;">Реклама</h2>
      <div class="banner-link">
        <img src="/public/img/ban.jpg" alt="Реклама">
      </div>
      <div class="info-doremi">
        Doremi 2018 – <a target="_blank" href='/about'>О нас.</a>
      </div>
    </div>
  </div>
</div>
