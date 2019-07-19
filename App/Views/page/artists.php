<div class="page-main">
  <div class="row">
    <h1 class="tit-1 up-title" style="margin:10px 30px 20px;">Артисты</h1>
    <?php $this->t_artist($arts); ?>
  </div>
  <div class="row">
    <div class="next-page">
      <ul>
        <? for ($i = 1; $i < 9 ; $i++) {
          $i == $pid ? $c = 'class="next-page-active"' : $c = '';
          echo '<li '.$c.'><a class="p-number" href="/artists/page/'.$i.'">'.$i.'</a></li>';
        } ?>
      </ul>
    </div>
  </div>
</div>
