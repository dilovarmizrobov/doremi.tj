<?php

namespace Core;

/**
 * View
 *
 * PHP version 7.0
 */

class View
{
  private $data = array();

  private $render = FALSE;

  public function __construct($template)
  {
    $file = ROOT . '/App/Views/' . strtolower($template) . '.php';

    if (file_exists($file)) {
      $this->render = $file;
    } else {
      throw new \Exception('Template ' . $template . ' not found!');
    }
  }

  private function valid($template) {
    $file = ROOT . '/App/Views/' . strtolower($template) . '.php';

    if (file_exists($file)) {
      $this->render = $file;
    } else {
      throw new \Exception('Template ' . $template . ' not found!');
    }
  }

  public function assign($variable, $value)
  {
    $this->data[$variable] = $value;
  }

  private function renderTemplate() {
    extract($this->data);
    include($this->render);
  }

  public function __destruct()
  {
    extract($this->data);
    include($this->render);
  }

  public function t_song($sng) {
    $this->valid('template/song');
    $this->assign('sng', $sng);
    $this->renderTemplate();
  }

  public function t_artist($art) {
    $this->valid('template/artist');
    $this->assign('art', $art);
    $this->renderTemplate();
  }

  public function t_playlist($ply) {
    $this->valid('template/playlist');
    $this->assign('ply', $ply);
    $this->renderTemplate();
  }
}
