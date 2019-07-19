<div class="page_content">
  <div class="heading-1">WELCOME <?php echo strtoupper($_SESSION['ADMIN']['NAME']) ?></div>
  <div class="sts-row clearfix">
    <div class="sts-name">Users</div>
    <div class="sts-rank"><? echo $sum_user; ?><div class="sts-rank-val" style="width: <? echo ($sum_user*300/500) . 'px'; ?>"></div></div>
    <div class="sts-val">500</div>
  </div>

  <div class="sts-row clearfix">
    <div class="sts-name">Songs</div>
    <div class="sts-rank"><? echo $sum_song; ?><div class="sts-rank-val" style="width: <? echo ($sum_song*300/1000) . 'px'; ?>"></div></div>
    <div class="sts-val">1000</div>
  </div>

  <div class="sts-row clearfix">
    <div class="sts-name">Artists</div>
    <div class="sts-rank"><? echo $sum_artist; ?><div class="sts-rank-val" style="width: <? echo ($sum_artist*300/100) . 'px'; ?>"></div></div>
    <div class="sts-val">100</div>
  </div>

  <div class="sts-row clearfix">
    <div class="sts-name">Playlists</div>
    <div class="sts-rank"><? echo $sum_playlist; ?><div class="sts-rank-val" style="width: <? echo ($sum_playlist*300/100) . 'px'; ?>"></div></div>
    <div class="sts-val">100</div>
  </div>
</div>
