<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Doremi</title>
    <meta name="description" content="Слушайте таджикскую музыку на doremi и делитесь любимыми песнями."/>
    <meta name="keywords" content="doremi, музыка, таджикская музыка, суруд, оханг, мусики, нигина амонкулова, шабнами сурайё, садридини начмиддин, чонибек муродов, зафар нозимов, далер назаров, шабнами собири, фарзонаи хуршед, зулйхо махмадшоева, муборакшо мирзошоев, валичон азизов, мино, нозияи кароматулло, мехринигори рустам, мухаммадрафи кароматулло, tajik music, shabnam, valijon, musiqi, taronahoi tojiki, jonibek murodov, nigina amonqulova"/>
    <meta property="og:description" content="Слушайте таджикскую музыку на doremi и делитесь любимыми песнями.">
    <meta property="og:title" content="Doremi">
    <meta property="og:url" content="http://www.doremi.tj">
    <meta property="og:image" content="http://doremi.tj/public/img/favicon.ico">
    <link rel="stylesheet" href="/public/lib/normalize.css">
    <link rel="shortcut icon" href="/public/img/favicon.ico">
    <link rel="stylesheet" href="/public/lib/OwlCarousel2-2.3.4/dist/assets/owl.carousel.min.css">
    <link rel="stylesheet" href="/public/lib/OwlCarousel2-2.3.4/dist/assets/owl.theme.default.min.css">
    <link rel="stylesheet" href="/public/css/index.css">
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-128256557-1"></script>
  </head>
  <body>
    <div id="DoremiApp"></div>
<?
    $user = isset($_SESSION["IS_USER"]) ? array(
      "id"        => $_SESSION["USER"]["ID"],
      "picture"   => $_SESSION["USER"]["PICTURE"],
      "song"      => $_SESSION["USER"]["LOVED_SNG"],
      "artist"    => $_SESSION["USER"]["ARTISTS"],
      "playlist"  => $_SESSION["USER"]["PLAYLISTS"]
    ) : array();
    $user = json_encode($user);
?>
    <script>var user = <? echo $user; ?></script>
    <script type="text/javascript" src="/public/lib/jquery-3.3.1/jquery.js"></script>
    <script type="text/javascript" src="/public/lib/OwlCarousel2-2.3.4/dist/owl.carousel.min.js"></script>
    <script type="text/javascript" src="/public/js/main.js"></script>
  </body>
</html>
