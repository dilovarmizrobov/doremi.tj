<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta name="description" content="Слушайте таджикскую музыку на doremi и делитесь любимыми песнями."/>
    <meta name="keywords" content="doremi, музыка, таджикская музыка, суруд, оханг, мусики, нигина амонкулова, шабнами сурайё, садридини начмиддин, чонибек муродов, зафар нозимов, далер назаров, шабнами собири, фарзонаи хуршед, зулйхо махмадшоева, муборакшо мирзошоев, валичон азизов, мино, нозияи кароматулло, мехринигори рустам, мухаммадрафи кароматулло, tajik music, shabnam, valijon, musiqi, taronahoi tojiki, jonibek murodov, nigina amonqulova"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <title><? echo $title; ?></title>
    <meta property="og:description" content="Слушайте таджикскую музыку на doremi и делитесь любимыми песнями.">
    <meta property="og:title" content="Doremi">
    <meta property="og:url" content="http://www.doremi.tj">
    <meta property="og:image" content="http://doremi.tj/public/img/favicon.ico">
    <link rel="stylesheet" href="/public/css/index.css">
    <link rel="shortcut icon" href="/public/img/favicon.ico">
  </head>
  <body>
    <div class="header clearfix">
      <div class="menu-mobi">
        <span class="mobi-row"></span>
        <span class="mobi-row"></span>
        <span class="mobi-row"></span>
      </div>
      <div class="header-logo">
        <a href="/">Doremi</a>
      </div>
    </div>
    <div class="page-saidebar">
      <ul>
<?
  if ( isset($_SESSION['IS_USER']) ) {
?>
        <li class="s-user-picture">
          <a href="/account">
            <img src=<? echo '/public/img/users/' . $_SESSION['USER']['PICTURE']; ?> alt="User picture">
          </a>
        </li>
<?
  }
?>
        <li>
          <div class="header-search">
            <form action="/search" method="get">
              <input type="text" name="q" autocomplete="off" placeholder="Поиск">
              <button type="submit"></button>
            </form>
          </div>
        </li>
        <li><a class="a-sidebar" href="/new">Новинки</a></li>
        <li><a class="a-sidebar" href="/popular">Популярное</a></li>
        <li><a class="a-sidebar" href="/artists">Артисты</a></li>
        <li><a class="a-sidebar" href="/upload">Добавить музыку</a></li>
        <div class="line-partition"></div>
<?
  if ( !isset($_SESSION['IS_USER']) ) {
?>
        <li><a class="a-sidebar" href="/login">Вход</a></li>
        <li><a class="a-sidebar" href="/register">Регистрация</a></li>
<?
  } elseif( isset($_SESSION['IS_USER']) ) {
?>
        <li><a class="a-sidebar" href="/profile">Моя музыка</a></li>
        <li>
          <a class="a-sidebar" href="/profile/loved">
            <svg class="sidebar-icon" width="14" height="14" viewBox="0 0 12 12">
              <path d="M6.00011325,2.5 C6.00011325,2.5 5.00009438,1 3.25,1 C1.66669813,1 1.65327318e-16,2.25 0,4.5 C1.65327318e-16,7.5 6,11.5 6,11.5 C6,11.5 11.9999997,7.5 12,4.5 C12.0000002,2.25 10.3335284,1 8.75,1 C7.00013213,1 6.00011325,2.5 6.00011325,2.5 Z"/>
            </svg>
            <span>Любимые треки</span>
          </a>
        </li>
        <li>
          <a class="a-sidebar" href="/profile/playlists">
            <svg class="sidebar-icon" width="14" height="14" viewBox="0 0 12 12">
              <path d="M8,9.99224439 C8,11.1010972 6.88071187,12 5.5,12 C4.11928813,12 3,11.1010972 3,9.99224439 C3,8.88339158 4.11928813,7.98448877 5.5,7.98448877 C6.06280296,7.98448877 6.58216973,8.13384364 7,8.38589285 L7,2.36277306 L7,0.75552108 C7,0.201673187 7.42629719,-0.118924155 7.95813424,0.0412456698 L12,1.25850747 L12,3.26731057 C12,3.82115846 11.5737028,4.1417558 11.0418658,3.98158598 L8,3 L8,9.99224439 Z M0,0 L6,0 L6,1 L0,1 L0,0 L0,0 Z M0,2 L6,2 L6,3 L0,3 L0,2 L0,2 Z M0,4 L6,4 L6,5 L0,5 L0,4 L0,4 Z"/>
            </svg>
            <span>Плейлисты</span>
          </a>
        </li>
        <li>
          <a class="a-sidebar" href="/profile/artists">
            <svg class="sidebar-icon" width="14" height="14" viewBox="0 0 25 25">
              <path d="M16.428,15.744c-0.159-0.052-1.164-0.505-0.536-2.414h-0.009c1.637-1.686,2.888-4.399,2.888-7.07c0-4.107-2.731-6.26-5.905-6.26C9.69,0,6.974,2.152,6.974,6.26c0,2.682,1.244,5.406,2.891,7.088c0.642,1.684-0.506,2.309-0.746,2.396c-3.324,1.203-7.224,3.394-7.224,5.557c0,0.584,0,0.23,0,0.811c0,2.947,5.714,3.617,11.002,3.617c5.296,0,10.938-0.67,10.938-3.617c0-0.58,0-0.227,0-0.811C23.835,19.073,19.916,16.899,16.428,15.744z"/>
            </svg>
            <span>Артисты</span>
          </a>
        </li>
        <li><a class="a-sidebar" href="/logout">Выйти</a></li>
<?
  }
?>
      </ul>
    </div>
