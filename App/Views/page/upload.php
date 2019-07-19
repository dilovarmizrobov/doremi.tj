<div class="page-main">
  <div class="row clearfix">
    <div class="res-con-song">
      <h2 class="tit-1 up-title">Добавить музыку</h2>
      <form class="up-form" action="" enctype="multipart/form-data" method="post" autocomplete="off">
        <input class="upf-input" name="name" value="" type="text" placeholder="Название трека">
        <input class="upf-input" name="artist" value="" type="text" placeholder="Исполнитель">
        <div class="upf-file">
          <button class="upf-change" type="button">Выбрать музыку</button>
          <div class="upf-audio">
            <audio controls="" src=""></audio>
          </div>
          <input hidden="" name="prd" type="file" accept="audio/*">
          <input hidden="" name="time" type="text">
        </div>
        <div class="upf-footer">
          <button class="upf-add" type="submit" name="add" value="">Добавить</button>
        </div>
      </form>
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
