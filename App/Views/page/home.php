<div class="page-main">
  <div class="row clearfix">
    <div class="res-con-song">
      <div class="head-container">
        <h2 class="tit-1" style="margin:20px auto; text-align:center;">Новые музыки</h2>
        <div class="carousel-controls controls1">
          <button class="carousel-prev carousel-prev-off" type="button"></button>
          <button class="carousel-next" type="button"></button>
        </div>
      </div>
      <div class="carousel-container carousel1">
<?
  $this->t_artist($new_art);
?>
      </div>
<?
  $this->t_song($new_sng);
?>
      <div class="head-container">
        <h2 class="tit-1" style="margin:40px 0 20px; text-align:center;">Популярные музыки</h2>
        <div class="carousel-controls controls2">
          <button class="carousel-prev carousel-prev-off" type="button"></button>
          <button class="carousel-next" type="button"></button>
        </div>
      </div>
      <div class="carousel-container carousel2">
<?
  $this->t_artist($popular_art);
?>
      </div>
<?
  $this->t_song($popular_sng);
?>
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
