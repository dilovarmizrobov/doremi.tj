<div class="page-main">
  <div class="row clearfix">
    <div class="res-con-song">
      <h1 class="tit-1" style="margin:20px auto; text-align:center;">
        <? echo $heading ?>
      </h1>
      <? $this->t_playlist($ply); ?>
      <? $this->t_song($sng); ?>

      <div class="next-page">
        <ul>
          <? for ($i = 1; $i < 9 ; $i++) {
            $i == $pid ? $c = 'class="next-page-active"' : $c = '';
            echo '<li '.$c.'><a class="p-number" href="/new/page/'.$i.'">'.$i.'</a></li>';
          } ?>
        </ul>
      </div>
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
