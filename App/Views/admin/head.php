<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <title>Admin Panel</title>
    <link rel="stylesheet" href="/public/css/panel.css">
    <link rel="shortcut icon" href="/public/img/favicon.ico">
  </head>
  <body>
    <div class="page_sidebar">
      <div class="logo">
        <a href="/panel">Admin Panel</a>
      </div>
      <div class="admin"><?php echo $_SESSION['ADMIN']['NAME'] ?></div>
      <div class="nav-menu">
        <ul>
          <li><a class="nm-link<? if ($page === 'song'){echo ' nm-active';} ?>" href="/panel/song">Треки</a></li>
          <li><a class="nm-link<? if ($page === 'artist'){echo ' nm-active';} ?>" href="/panel/artist">Артисты</a></li>
          <li><a class="nm-link<? if ($page === 'playlist'){echo ' nm-active';} ?>" href="/panel/playlist">Плейлисты</a></li>          <li><a class="nm-link<? if ($page === 'moderation'){echo ' nm-active';} ?>" href="/panel/moderation">Модерация</a></li>
        </ul>
      </div>
      <div class="exit">
        <a href="/panel/logout">Выход</a>
      </div>
    </div>
