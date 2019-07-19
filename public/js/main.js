var DOREMI = {
  SRATE: 20,
  data: {},
  user: {},
  app: $("#DoremiApp"),
  loaderBar: function(b){
    var loader = $("#page_loader"),
    bar = loader.children().first();
    if (b) {
      bar.css("width", "0");
      loader.css(DOREMI.prefix.js + 'Transform', 'translateX(0)');
    } else {
      bar.css("width", "100%");
      setTimeout(function() {
        loader.css(DOREMI.prefix.js + 'Transform', '');
      }, 500);
    }
  },
  getPage: function() {
    $.ajax({
      beforeSend: function() {
        DOREMI.loaderBar(true);
      },
      complete: function() {
        DOREMI.loaderBar(false);
      },
      type: "POST",
      url: location.href,
      dataType: 'json',
      success: function(d) {
        if (d.error.length !== 0) {
          console.log('Нет подключения к Интернету');
          return;
        }
        DOREMI.initSetting(d);
      },
      error: function() {
        console.log('Нет подключения к Интернету');
      },
      xhr: function() {
        var xhr = $.ajaxSettings.xhr(),
        bar = $("#page_loader").children().first();

        xhr.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
             var percentComplete = evt.loaded / evt.total;
             bar.css("width", percentComplete*100 + "%");
          }
        }, false);

       return xhr;
      },
    });
  },
  clickLink: function(e, link) {
    e.preventDefault();
    history.pushState(null, null, e.target.href || link);
    this.getPage();
    this.closeSideBar();
  },
  toPage: function(url) {
    url = url || '/';
    $('<a href="' + url + '"></a>')
      .click(function(e) {
        DOREMI.clickLink(e);
      }).click();
  },
  initSetting: function(d) {
    this.data = d;
    $('.page-main')[0].innerHTML = '';
    document.documentElement.scrollTop = 0;
    drPlayer.resetSongElm();
    this.creatDOM[d.method](d.result);
    this.googleTagManager();
  },
  googleTagManager: function(f) {
    window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    
      gtag('config', 'UA-128256557-1');
  },
  creatDOM: {
    phome: function(d) {
      this.titlePage(d.title);

      $('.page-main')
      .append(
        $('<div class="row clearfix"></div>')
        .append(
          $('<div class="res-con-song"></div>')
          .append(
            $('<h2 class="tit-1" style="margin:20px auto; text-align:center;">Новые треки</h2>')
          )
          .append(
            this.tartist(d.newArtist)
            .addClass('owl-carousel owl-theme')
            .owlCarousel({
              dots: false,
              responsive:{
                0:{
                  items:1
                },
                550:{
                  items:2
                },
                769:{
                  items:1
                },
                990:{
                  items:2
                },
                1350:{
                  items:3
                }
              }
            })
          )
          .append(
            this.tsong(d.newSong)
          )
          .append(
            $('<h2 class="tit-1" style="margin:20px auto; text-align:center;">Популярные треки</h2>')
          )
          .append(
            $('<div class="carousel-container carousel2"></div>')
            .append(
              this.tartist(d.popularArtist)
              .addClass('owl-carousel owl-theme')
              .owlCarousel({
                dots: false,
                responsive:{
                  0:{
                    items:1
                  },
                  550:{
                    items:2
                  },
                  769:{
                    items:1
                  },
                  990:{
                    items:2
                  },
                  1350:{
                    items:3
                  }
                }
              })
            )
          )
          .append(
            this.tsong(d.popularSong)
          )
        )
        .append(
          $('<div class="res-con-banner"><h2 class="tit-2" style="margin:30px 0;">Реклама</h2><div class="banner-link"><img src="/public/img/ban.jpg" alt="Реклама"></div><div class="info-doremi">Doremi 2018 – <a target="_blank" href="/about">О нас.</a></div></div>')
        )
      )
    },
    psearch: function(d) {
      this.titlePage(d.title);

      $('.page-main')
      .append(
        $('<div class="row clearfix"></div>')
        .append(
          $('<div class="res-con-song"></div>')
          .append(
            $('<h2>Результаты поиска для « ' + d.heading + ' »</h2>')
          )
          .append(
            $('<p class="des-2">Найдено: ' + d.artist.length + ' артиста</p>')
          )
          .append(
            this.tartist(d.artist)
          )
          .append(
            $('<p class="des-2">Найдено: ' + d.song.length + ' песен</p>')
          )
          .append(
            this.tsong(d.song)
          )
        )
        .append(
          $('<div class="res-con-banner"><h2 class="tit-2" style="margin:30px 0;">Реклама</h2><div class="banner-link"><img src="/public/img/ban.jpg" alt="Реклама"></div><div class="info-doremi">Doremi 2018 – <a target="_blank" href="/about">О нас.</a></div></div>')
        )
      )
    },
    pnew: function(d) {
      this.titlePage(d.title);

      $('.page-main')
      .append(
        $('<div class="row clearfix"></div>')
        .append(
          $('<div class="res-con-song"></div>')
          .append(
            $('<h1 class="tit-1" style="margin:20px auto; text-align:center;">Новые треки</h1>')
          )
          .append(
            this.tplaylist(d.newPlaylist)
            .addClass('owl-carousel owl-theme')
            .owlCarousel({
              dots: false,
              responsive:{
                0:{
                  items:1
                },
                550:{
                  items:2
                },
                769:{
                  items:1
                },
                990:{
                  items:2
                },
                1350:{
                  items:3
                }
              }
            })
          )
          .append(
            this.tsong(d.newSong)
          )
          .append(
            $('<div class="next-page"></div>')
            .append(
              this.nextPage('new')
            )
          )
        )
        .append(
          $('<div class="res-con-banner"><h2 class="tit-2" style="margin:30px 0;">Реклама</h2><div class="banner-link"><img src="/public/img/ban.jpg" alt="Реклама"></div><div class="info-doremi">Doremi 2018 – <a target="_blank" href="/about">О нас.</a></div></div>')
        )
      )
    },
    ppopular: function(d) {
      this.titlePage(d.title);

      $('.page-main')
      .append(
        $('<div class="row clearfix"></div>')
        .append(
          $('<div class="res-con-song"></div>')
          .append(
            $('<h1 class="tit-1" style="margin:20px auto; text-align:center;">Популярные треки</h1>')
          )
          .append(
            this.tplaylist(d.popularPlaylist)
            .addClass('owl-carousel owl-theme')
            .owlCarousel({
              dots: false,
              responsive:{
                0:{
                  items:1
                },
                550:{
                  items:2
                },
                769:{
                  items:1
                },
                990:{
                  items:2
                },
                1350:{
                  items:3
                }
              }
            })
          )
          .append(
            this.tsong(d.popularSong)
          )
          .append(
            $('<div class="next-page"></div>')
            .append(
              this.nextPage('popular')
            )
          )
        )
        .append(
          $('<div class="res-con-banner"><h2 class="tit-2" style="margin:30px 0;">Реклама</h2><div class="banner-link"><img src="/public/img/ban.jpg" alt="Реклама"></div><div class="info-doremi">Doremi 2018 – <a target="_blank" href="/about">О нас.</a></div></div>')
        )
      )
    },
    partists: function(d) {
      this.titlePage(d.title);

      $('.page-main')
      .append(
        $('<div class="row"></div>')
        .append(
          $('<h1 class="tit-1 up-title" style="margin:10px 30px 20px;">Артисты</h1>')
        )
        .append(
          this.tartist(d.artists)
        )
      )
      .append(
        $('<div class="row"></div>')
        .append(
          $('<div class="next-page"></div>')
          .append(
            this.nextPage('artists')
          )
        )
      )
    },
    pupload: function(d) {
      this.titlePage(d.title);

      $('.page-main')
      .append(
        $('<div class="row clearfix"></div>')
        .append(
          $('<div class="res-con-song"><h2 class="tit-1 up-title">Добавить музыку</h2><form class="up-form" action="" enctype="multipart/form-data" method="post" autocomplete="off"><input class="upf-input" name="name" value="" type="text" placeholder="Название трека"><input class="upf-input" name="artist" value="" type="text" placeholder="Исполнитель"><div class="upf-file"><button class="upf-change" type="button">Выбрать музыку</button><div class="upf-audio"><audio controls="" src=""></audio></div><input hidden="" name="prd" type="file" accept="audio/*"><input hidden="" name="time" type="text"></div><div class="upf-footer"><button class="upf-add" type="submit" name="add" value="">Добавить</button></div></form></div>')
        )
        .append(
          $('<div class="res-con-banner"><h2 class="tit-2" style="margin:30px 0;">Реклама</h2><div class="banner-link"><img src="/public/img/ban.jpg" alt="Реклама"></div><div class="info-doremi">Doremi 2018 – <a target="_blank" href="/about">О нас.</a></div></div>')
        )
      )

      var
      audio = $('.upf-audio > audio')[0],
      file = $('input[name="prd"]')[0],
      time = $('input[name="time"]')[0],
      sendBtn = $(".upf-add");

      $('.upf-change').on("click", function() {
        file.click();
      })

      $(file).on("input", function() {
        if ( this.files && this.files[0] && this.files[0].type.match('audio/*') ) {
          var reader = new FileReader();
          reader.onload = function (e) {
            audio.src = e.target.result;
            audio.oncanplaythrough = function() {
              var m = Math.floor( Math.floor( this.duration ) / 60 ) + '',
              s = Math.floor( this.duration ) % 60 + '';
              m = m.length == 1 ? '0' + m : m;
              s = s.length == 1 ? '0' + s : s;
              time.value = m + ':' + s;
            };
          }
          reader.readAsDataURL(this.files[0]);
        }
      })

      sendBtn.on("click", function(e) {
        var form = $(".up-form").get(0), formData = new FormData(form);
        $.ajax({
          beforeSend: function() {
            DOREMI.loaderBar(true);
          },
          complete: function() {
            DOREMI.loaderBar(false);
          },
          type: "POST",
          dataType: 'json',
          contentType: false,
          processData: false,
          url: '/upload',
          data: formData,
          success: function(d) {
            if (!d.error) {
              audio.src = '';
              form.reset();
            }
            alert(d.result);
          },
          error: function() {
            console.log('Нет подключения к Интернету');
          },
          xhr: function() {
            var xhr = $.ajaxSettings.xhr(),
            bar = $("#page_loader").children().first();

            xhr.upload.addEventListener("progress", function(evt){
              if (evt.lengthComputable) {
                var percentComplete = evt.loaded / evt.total;
                bar.css("width", percentComplete*100 + "%");
              }
            }, false);
           return xhr;
          }
        });
        e.preventDefault();
      });
    },
    partist: function(d) {
      this.titlePage(d.title);

      var loved = this.setLoved(d.artist.ART_ID, 'artist') ? ' loved' : '',
      href = location.pathname.split('/').pop(),
      track = topTrack = ' pa-nav-active';

      if (href === 'top_track') track = '';
      else topTrack = '';


      $('.page-main')
      .append(
        $('<div class="row"></div>')
        .append(
          $('<div class="page-artist"></div>')
          .append(
            $('<div class="pa-header clearfix"></div>')
            .append(
              $('<div class="pa-img" data-id="' + d.artist.ART_ID + '"></div>')
              .append(
                $('<img src="/public/img/artists/' + d.artist.ART_PICTURE + '">')
              )
              .append(
                $('<button class="loved-artist' + loved + '">')
                .data("id", d.artist.ART_ID)
                .click(function() {
                  $.ajax({
                    type: "POST",
                    url: '/ajax/love',
                    dataType: 'json',
                    data: {
                      METHOD: (!$(this).hasClass('loved') ? 'LOVE_ARTIST' : 'UNLOVE_ARTIST' ),
                      ID: $(this).data().id
                    },
                    success: function(d) {
                      DOREMI.creatDOM.toogleLoved(d, this.target, 'artist');
                    },
                    error: function() {
                      console.log('Нет подключения к Интернету');
                    },
                    target: $(this)
                  });
                })
              )
            )
            .append(
              $('<div class="pa-info"></div>')
              .append(
                $('<div class="pai-executor">ИСПОЛНИТЕЛЬ</div>')
              )
              .append(
                $('<div class="pai-name">' + d.artist.ART_NAME + '</div>')
              )
              .append(
                $('<span class="pai-genre">' + d.artist.GENRE + '</span>')
              )
              .append(
                $('<div class="pai-popul">' + d.artist.ART_RANK + ' просмотров</div>')
              )
              .append(
                $('<div class="pai-text">' + d.artist.ART_INFO + '</div>')
              )
            )
            .append(
              $('<div class="pa-nav"></div>')
              .append(
                $('<div class="pa-sort-date' + track + '"></div>')
                .append(
                  $('<a href="/artist/' + d.artist.ART_ID + '/track">ТРЕКИ</a>')
                  .click(function(e) {
                    DOREMI.clickLink(e);
                  })
                )
              )
              .append(
                $('<div class="pa-sort-popul' + topTrack + '"></div>')
                .append(
                  $('<a href="/artist/' + d.artist.ART_ID + '/top_track">ПОПУЛЯРНЫЕ ТРЕКИ</a>')
                  .click(function(e) {
                    DOREMI.clickLink(e);
                  })
                )
              )
            )
          )
          .append(
            $('<div class="pa-body"></div>')
            .append(
              this.tsong(d.artist.ART_SNG)
            )
          )
        )
      )
    },
    psong: function(d) {
      this.titlePage(d.title);

      var song =
      $('<div class="song-item" data-key="' + d.song.SNG_ID + '"></div>')
      .data("d", d.song)
      .click(function(e) {
        var t = $(e.target), self = $(this);
        if (t.hasClass("song-control")) {
          if ( t.hasClass("play-btn") ) {
            drPlayer.play({method: 'song', elm: self});
          } else if ( t.hasClass("pause-btn") ) {
            drPlayer.pause({method: 'song', elm: self});
          }
        }
      })
      .append(
        $('<button class="song-control play-btn"></button>')
      )
      .append(
        $('<div class="tr-params-song">' + d.song.SNG_TIME + '</div>')
      )
      .append(
        $('<div class="tr-params-song">' + d.song.SNG_SIZE + ' МБ</div>')
      )
      .append(
        $('<div class="tr-params-song">' + d.song.SNG_DATE + '</div>')
      )
      .append(
        $('<div class="tr-params-song">Скачиваний: ' + d.song.SNG_COUNT + '</div>')
      )
      .append(
        $('<div class="tr-params-song tr-download">Скачать</div>')
        .data("SNG_HREF", d.song.SNG_HREF)
        .click(function() {
          location.href = '/downloadsong?s=' + $(this).data().SNG_HREF;
        })
      )

      if (drPlayer.currentSongKey && drPlayer.currentSongKey == d.song.SNG_ID) {
        drPlayer.activeSongElm(song);
      }

      $('.page-main')
      .append(
        $('<div class="row clearfix"></div>')
        .append(
          $('<div class="res-con-song"></div>')
          .append(
            $('<div class="tr-block"></div>')
            .append(
              $('<h1 class="tit-1">' + d.song.SNG_TITLE + '</h1>')
            )
            .append(
              $('<div style="font-size: 18px;">')
              .append(
                $(document.createTextNode("Исполнитель: "))
              )
              .append(
                $('<b>')
                .append(
                  $('<a class="a-1" href="/artist/' + d.song.SNG_ART[0]["ART_ID"] + '">' + d.song.SNG_ART[0]["ART_NAME"] + '</a>')
                  .click(function(e) {
                    DOREMI.clickLink(e);
                  })
                )
              )
            )
            .append(
              $('<p>На музыкальном портале <b>Doremi.tj</b> Вы можете бесплатно скачать и слушать онлайн песню <b>' + d.song.SNG_TITLE + '</b> в формате mp3.</p>')
            )
            .append(
              $('<div class="song-content"></div>')
              .data("d", [d.song])
              .append(song)
            )
          )
          .append(
            $('<h2 class="tit-2">')
            .append(
              $(document.createTextNode("Другие песни "))
            )
            .append(
              $('<b>')
              .append(
                $('<a class="a-1" href="/artist/' + d.song.SNG_ART[0]["ART_ID"] + '">' + d.song.SNG_ART[0]["ART_NAME"] + '</a>')
                .click(function(e) {
                  DOREMI.clickLink(e);
                })
              )
            )
          )
          .append(
            this.tsong(d.overSong)
          )
        )
        .append(
          $('<div class="res-con-banner"><h2 class="tit-2" style="margin:30px 0;">Реклама</h2><div class="banner-link"><img src="/public/img/ban.jpg" alt="Реклама"></div><div class="info-doremi">Doremi 2018 – <a target="_blank" href="/about">О нас.</a></div></div>')
        )
      )
    },
    pplaylist: function(d) {
      this.titlePage(d.title);

      var ply_m = ply_s = 0, ply_h, source_songs, sng = d.playlist.PLY_SONGS,
      loved = this.setLoved(d.playlist.PLY_ID, 'playlist') ? ' loved' : '';

      for (var i = 0; i < sng.length; i++) {
        var dur_song = sng[i]['SNG_TIME'].split(':');
        ply_m += dur_song[0] - 0;
        ply_s += dur_song[1] - 0;
      }

      ply_m += Math.round(ply_s / 60);
      ply_h = ( ply_m - (ply_m % 60) ) / 60;
      ply_m = ply_m % 60;

      source_songs = sng.length + ' треков · ' + ply_h + ' ч ' + ply_m + ' мин · ' + d.playlist['PLY_RANK'] + ' просмотров';

      $('.page-main')
      .append(
        $('<div class="row"></div>')
        .append(
          $('<div class="page-playlist"></div>')
          .append(
            $('<div class="pp-header clearfix"></div>')
            .append(
              $('<div class="pp-img" data-id="' + d.playlist.PLY_ID + '"></div>')
              .append(
                $('<img src="/public/img/playlists/' + d.playlist.PLY_PICTURE + '">')
              )
              .append(
                $('<button class="loved-playlist' + loved + '">')
                .data("id", d.playlist.PLY_ID)
                .click(function() {
                  $.ajax({
                    type: "POST",
                    url: '/ajax/love',
                    dataType: 'json',
                    data: {
                      METHOD: (!$(this).hasClass('loved') ? 'LOVE_PLAYLIST' : 'UNLOVE_PLAYLIST' ),
                      ID: $(this).data().id
                    },
                    success: function(d) {
                      DOREMI.creatDOM.toogleLoved(d, this.target, 'playlist');
                    },
                    error: function() {
                      console.log('Нет подключения к Интернету');
                    },
                    target: $(this)
                  });
                })
              )
            )
            .append(
              $('<div class="pp-info"></div>')
              .html('<div class="ppi-title">' + d.playlist.PLY_TITLE + '</div><div class="ppi-info">' + d.playlist.PLY_DESCRIPTION + '</div><div class="ppi-source">' + source_songs + '</div>')
            )
          )
          .append(
            $('<div class="pp-body"></div>')
            .append(
              this.tsong(d.playlist.PLY_SONGS)
            )
          )
        )
      )
    },
    pabout: function(d) {
      this.titlePage(d.title);

      $('.page-main')
      .append(
        $('<div class="row"></div>')
        .append(
          $('<h2 class="pab-title">О нас</h2>')
        )
        .append(
          $('<div class="pab-section"><p>Наша почта: info@doremi.tj</p></div>')
        )
        .append(
          $('<div class="pab-section"><p>Если Вы являетесь правообладателем или лицом, представляющим правообладателя, и не хотите чтобы данные, нарушающие Ваши права, присутствовали на сайте, Вам необходимо заполнить следующую форму и выслать ее на наш электронный адрес. После проверки высланной Вами формы и подписки о правомерности действий (заполняется от руки и высылается в отсканированном варианте, обязательна для каждой жалобы), мы обязуемся удалить файлы в кратчайшие сроки.</p><h3>1. Данные о продукте:</h3><p>1.1. Название продукта - русское и английское (в случае наличия английской версии).</p><p>1.2. Официальная страница продукта в Интернете (в случае наличия).</p><p>1.3. Номер, присвоенный продукту по государственному реестру.</p><p>1.4. Для Юридического Лица / Правообладателя электронных изданий/программ для ЭВМ/баз данных - Копия документа о государственной регистрации. Для Юридического Лица / Правообладателя кино- и видеоматериалов - Прокатное удостоверение (копия).</p><h3>2. Данные о правообладателе:</h3><p>2.1. Полное наименование юридического лица.</p><p>2.2. Почтовый адрес (в случае несовпадения юридического и почтового адреса – обязательное указание юридического адреса).</p><p>2.3. Сайт правообладателя в сети Интернет.</p><p>2.4. Лицензия на право деятельности (если таковая деятельность лицензируется в установленном законом порядке).</p><p>2.5. Контактное лицо правообладателя (ФИО, должность, телефон, e-mail).</p><h3>3. Данные лица, подающего жалобу:</h3><p>3.1. Ф.И.О.</p><p>3.2. Должность.</p><p>3.3. Телефон.</p><p>3.4. e-mail.</p><p>3.5. Копия доверенности на действия от лица Правообладателя (не требуется в случае, если лицо подающее жалобу – руководитель компании Правообладателя). Если жалобу подает не правообладатель, а его уполномоченный доверенностью представитель - юридическое лицо, следует предоставить копию доверенности на действия физического лица от лица компании, уполномоченной доверенностью Правообладателя (не требуется в случае, если лицо подающее жалобу - руководитель компании представителя).</p><h3>4. Претензионные данные:</h3><p>4.1. Адрес страницы сайта, которая содержит ссылки на данные, нарушающие права.</p><p>4.2. Полное описание сути нарушения прав (почему распространение данной информации запрещено Правообладателем).</p><h3>5. Подписка о правомерности действий (заполняется от руки и высылается в отсканированном варианте).</h3><p>Обязательна для каждой жалобы.Я, «ФИО», действующий от лица «Юридическое наименование правообладателя» на основании доверенности «данные доверенности» свидетельствую о том, что все данные, указанные в данном обращении верны, «Наименование лица» (Правообладатель) – является обладателем исключительных имущественных прав, включая:</p><p>– исключительное право на воспроизведение;</p><p>– исключительное право на распространение;</p><p>– исключительное право на публичный показ;</p><p>– исключительное право на доведение до всеобщего сведения.</p><p>В случае возникновения претензий к ресурсу <b>doremi.tj</b> со стороны третьих лиц, связанных с нарушением их прав (в том числе потребительских прав) в отношении удаленной/блокированной ссылки, Правообладатель принимает все необходимые меры по урегулированию претензий, а также возможных споров, в том числе судебных.</p><p>Правообладатель обязуется урегулировать требования, претензии, либо иски третьих лиц, а также полностью возместить ресурсу <b>doremi.tj</b> расходы и убытки (включая упущенную выгоду, оплату услуг юриста и т.п.), связанные с компенсацией требований, претензий, исков третьих лиц по факту нарушения их прав, а также иными претензиями, связанными с незаконным или ошибочным блокированием, либо удалением ссылки по требованию Правообладателя.</p></div>')
        )
      )
    },
    paccount: function(d) {
      this.titlePage(d.title);

      $('.page-main')
      .append(
        $('<div class="page-account">')
        .append(
          $('<h1 class="ac-tl">Мои личные данные</h1>')
        )
        .append(
            $('<div class="clearfix">')
            .append(
              $('<div class="ac-row-img">')
              .append(
                $('<form name="changeImage">')
                .append(
                  $('<img class="account-img" src="/public/img/users/' + d.user.picture + '" alt="User picture">')
                )
                .append(
                  $('<div class="ac-edit-info account-label-img"></div>')
                )
                .append(
                  $('<input hidden class="account-file" type="file" name="img" accept="image/*">')
                )
              )
            )
            .append(
              $('<div class="ac-row-text">')
              .append(
                $('<h2 class="ac-txt-tl">Войти</h2>')
              )
              .append(
                $('<div>')
                .append(
                  $('<span>Логин | </span>')
                )
                .append(
                  $('<span class="ac-edit-info">Редактировать</span>')
                  .click(function() {
                    modalWindow({
                      title: 'Изменение логина',
                      form: [
                        {
                          type: 'password',
                          name: 'password',
                          placeholder: 'Ваш пароль'
                        },
                        {
                          type: 'text',
                          name: 'new_login',
                          placeholder: 'Новый логин'
                        },
                        {
                          type: 'text',
                          name: 'ver_new_login',
                          placeholder: 'Подтверждение нового логина'
                        },
                      ],
                      callback: function(f) {
                        var
                        modal = $('.modal'),
                        form = modal.find("form"),
                        password = modal.find('input[name="password"]'),
                        newLogin = modal.find('input[name="new_login"]'),
                        verNewLogin = modal.find('input[name="ver_new_login"]'),
                        acLogin = $("#acLogin");

                        newLogin.on("input", function() {
                          var self = $(this);

                          if (self.val().length > 2) {
                            var re = /^([a-zA-Z0-9])(\w|-|_)+([a-z0-9])$/;

                            if ( re.test( String(self.val()).toLowerCase() ) )
                              $.ajax({
                                type: "POST",
                                url: location.href,
                                dataType: 'json',
                                data: {
                                  validate_login: self.val()
                                },
                                success: function(d) {
                                  if (d.result) {
                                    newLogin.free = false;
                                    f.showError('Этот логин уже занят.');
                                  } else {
                                    newLogin.free = true;
                                    f.removeError();
                                  }
                                },
                                error: function() {
                                  console.log('Нет подключения к Интернету');
                                }
                              });
                            else
                              f.showError('Неверный формат логина.');
                          } else
                            f.showError('Имя пользователя должно содержать не менее 3 символов.');
                        });

                        form.on("submit", function(e) {
                          e.preventDefault();

                          if ( password.val().length < 6 )
                            f.showError('Пароль должен содержать не менее 6 символов.');
                          else if (newLogin.val() !== verNewLogin.val())
                            f.showError('Подтверждение не совпадает с логином.');
                          else if (!newLogin.free)
                            f.showError('Не удалось обновить!');
                          else
                            $.ajax({
                              type: "POST",
                              url: location.href,
                              dataType: 'json',
                              data: {
                                edit_login: true,
                                password: password.val(),
                                new_login: newLogin.val(),
                                ver_new_login: verNewLogin.val()
                              },
                              success: function(d) {
                                if (d.errors.length > 0) {
                                  f.showError('Не удалось обновить!.');
                                } else {
                                  f.showError(d.result);
                                  acLogin.val(newLogin.val());
                                  setTimeout(f.closeModal, 1000);
                                }
                              },
                              error: function() {
                                console.log('Нет подключения к Интернету');
                              }
                            });
                        });
                      }
                    });
                  })
                )
                .append(
                  $('<input id="acLogin" disabled class="upf-input" type="text" placeholder="' + d.user.login + '">')
                )
              )
              .append(
                $('<div>')
                .append(
                  $('<span>Пароль | </span>')
                )
                .append(
                  $('<span class="ac-edit-info">Редактировать</span>')
                  .click(function() {
                    modalWindow({
                      title: 'Изменение пароля',
                      form: [
                        {
                          type: 'password',
                          name: 'password',
                          placeholder: 'Ваш пароль'
                        },
                        {
                          type: 'password',
                          name: 'new_password',
                          placeholder: 'Новый пароль'
                        },
                        {
                          type: 'password',
                          name: 'ver_new_password',
                          placeholder: 'Подтверждение нового пароля'
                        },
                      ],
                      callback: function(f) {
                        var
                        modal = $('.modal'),
                        form = modal.find("form"),
                        password = modal.find('input[name="password"]'),
                        newPassword = modal.find('input[name="new_password"]'),
                        verNewPassword = modal.find('input[name="ver_new_password"]');

                        form.on("submit", function(e) {
                          e.preventDefault();

                          if ( password.val().length < 6 )
                            f.showError('Пароль должен содержать не менее 6 символов.');
                          else if ( newPassword.val().length < 6 )
                            f.showError('Новый пароль должен содержать не менее 6 символов.');
                          else if (newPassword.val() !== verNewPassword.val())
                            f.showError('Подтверждение не совпадает с паролем.');
                          else
                            $.ajax({
                              type: "POST",
                              url: location.href,
                              dataType: 'json',
                              data: {
                                edit_password: true,
                                password: password.val(),
                                new_password: newPassword.val(),
                                ver_new_password: verNewPassword.val()
                              },
                              success: function(d) {
                                if (d.errors.length > 0) {
                                  f.showError('Не удалось обновить!.');
                                } else {
                                  f.showError(d.result);
                                }
                              },
                              error: function() {
                                console.log('Нет подключения к Интернету');
                              }
                            });
                        });
                      }
                    });
                  })
                )
                .append(
                  $('<input disabled class="upf-input" type="password" placeholder="********">')
                )
              )
              .append(
                $('<h2 class="ac-txt-tl">Почта</h2>')
              )
              .append(
                $('<div>')
                .append(
                  $('<span>Электронный адрес | </span>')
                )
                .append(
                  $('<span class="ac-edit-info">Редактировать</span>')
                  .click(function() {
                    modalWindow({
                      title: 'Изменение электронного адреса',
                      form: [
                        {
                          type: 'password',
                          name: 'password',
                          placeholder: 'Ваш пароль'
                        },
                        {
                          type: 'email',
                          name: 'new_email',
                          placeholder: 'Новый электронный адрес'
                        },
                        {
                          type: 'email',
                          name: 'ver_new_email',
                          placeholder: 'Подтверждение нового электронного адреса'
                        },
                      ],
                      callback: function(f) {
                        var
                        modal = $('.modal'),
                        form = modal.find("form"),
                        password = modal.find('input[name="password"]'),
                        newEmail = modal.find('input[name="new_email"]'),
                        verNewEmail = modal.find('input[name="ver_new_email"]'),
                        acEmail = $("#acEmail");

                        form.on("submit", function(e) {
                          e.preventDefault();

                          if ( password.val().length < 6 )
                            f.showError('Пароль должен содержать не менее 6 символов.');
                          else {
                            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                            if ( !re.test(String( newEmail.val() ).toLowerCase()) )
                              f.showError('Неверный формат адреса электронной почты.')
                            else if( newEmail.val() !== verNewEmail.val() )
                              f.showError('Подтверждение не совпадает с электронным адресом.');
                            else
                            $.ajax({
                              type: "POST",
                              url: location.href,
                              dataType: 'json',
                              data: {
                                edit_email: true,
                                password: password.val(),
                                new_email: newEmail.val(),
                                ver_new_email: verNewEmail.val()
                              },
                              success: function(d) {
                                if (d.errors.length > 0) {
                                  f.showError('Не удалось обновить!.');
                                } else {
                                  f.showError(d.result);
                                  acEmail.val(newEmail.val());
                                  setTimeout(f.closeModal, 1000);
                                }
                              },
                              error: function() {
                                console.log('Нет подключения к Интернету');
                              }
                            });
                          }
                        });
                      }
                    });
                  })
                )
                .append(
                  $('<input id="acEmail" disabled class="upf-input" type="text" placeholder="' + d.user.email + '">')
                )
              )
              .append(
                $('<h2 class="ac-txt-tl">Личные данные</h2>')
              )
              .append(
                $('<form>')
                .submit(function(e) {
                  e.preventDefault();
                  var self = $(this);
                  var acGender = $('#acGender');
                  var acAge = $('#acAge');
                  $.ajax({
                    type: "POST",
                    url: location.href,
                    dataType: 'json',
                    data: {
                      edit_data: true,
                      gender: acGender.val(),
                      age: acAge.val()
                    },
                    success: function(d) {
                      if (d.errors.length > 0) {
                        alert('Не удалось обновить!.');
                      } else {
                        alert(d.result);
                      }
                    },
                    error: function() {
                      console.log('Нет подключения к Интернету');
                    }
                  })
                })
                .append(
                  $('<div style="margin: 15px"><span>Пол: </span><select id="acGender" class="account-select"><option ' + (d.user.gender == 'M' ? 'selected' : '') + ' value="M">Муж.</option><option ' + (d.user.gender == 'W' ? 'selected' : '') + ' value="W">Жен.</option></select></div>')
                )
                .append(
                  $('<div style="margin: 15px">')
                  .append(
                    $('<span>Возраст: </span>')
                  )
                  .append(
                    $('<select id="acAge" class="account-select">')
                    .append(
                      function() {
                        var frag = $(document.createDocumentFragment());

                        for (var i = 10; i <= 60; i++)
                          frag
                          .append(
                            $('<option ' + (i == d.user.age ? ' selected ' : '') + 'value="' + i + '">' + i + '</option>')
                          )
                        return frag;
                      }()
                    )
                  )
                )
                .append(
                  $('<button class="account-add" type="submit">Сохранить</button>')
                )
              )
            )
            .append(
              $('<button class="account-delete" type="submit" name="delete">Удалить мой аккаунт</button>')
              .click(function() {
                if ( confirm('Удалить ваш аккаунт?') )
                  $.ajax({
                    type: "POST",
                    url: location.href,
                    dataType: 'json',
                    data: {
                      delete: true
                    },
                    success: function(d) {
                      if (d.errors.length > 0) {
                        alert('Не удалось удалить!.');
                      } else {
                        alert(d.result);
                        location.href = "/";
                      }
                    },
                    error: function() {
                      console.log('Нет подключения к Интернету');
                    }
                  })
              })
            )
          )
      )

      var form = $('form[name="changeImage"]'),
      img = $(".account-img"),
      file = $(".account-file"),
      label = $(".account-label-img");

      img.on("click", function() {
        file.click();
      });

      file.on("input", function() {
        if ( this.files && this.files[0] && this.files[0].type.match('image.*') ) {
          var reader = new FileReader();
          reader.onload = function (e) {
            img.attr("src", e.target.result);
            label.text("Сохранить");
            label.addClass('save');
          }
          reader.readAsDataURL(this.files[0]);
        }
      });

      label.on("click", function() {
        var self = $(this);

        if ( !self.hasClass("save") ) return;

        var formData = new FormData(form[0]);
        formData.append("CHANGE_ACCOUNT_IMG", "true");

        $.ajax({
          beforeSend: function() {
            DOREMI.loaderBar(true);
          },
          complete: function() {
            DOREMI.loaderBar(false);
          },
          type: "POST",
          dataType: 'json',
          contentType: false,
          url: location.href,
          processData: false,
          data: formData,
          success: function(d) {
            if (d.error.length > 0) label.text(d.error);
            else label.text(d.result);
            label.removeClass("save");
          },
          error: function() {
            console.log('Нет подключения к Интернету');
          },
          xhr: function() {
            var xhr = $.ajaxSettings.xhr(),
            bar = $("#page_loader").children().first();

            xhr.upload.addEventListener("progress", function(evt){
              if (evt.lengthComputable) {
                var percentComplete = evt.loaded / evt.total;
                bar.css("width", percentComplete*100 + "%");
              }
            }, false);
           return xhr;
          }
        });
      });
    },
    pprofile: function(d) {
      this.titlePage(d.title);

      var lenSong = d.song.length,
      lenArtist = d.artist.length,
      lenPlaylist = d.playlist.length;
      $('.page-main')
      .append(
        $('<div class="row">')
        .append('<div class="page-mymusic"><div class="tit-2">Моя музыка</div></div>')
        .append('<h1 class="tit-3">' + lenSong + ' любимых трека</h1>')
        .append( this.tsong(d.song) )
        .append('<h1 class="tit-3">' + lenArtist + ' исполнителей</h1>')
        .append( this.tartist(d.artist) )
        .append('<h1 class="tit-3">' + lenPlaylist + ' плейлистов</h1>')
        .append( this.tplaylist(d.playlist) )
      )
    },
    pploved: function(d) {
      this.titlePage(d.title);
      var lenSong = d.song.length;

      $('.page-main')
      .append(
        $('<div class="row">')
        .append('<h1 class="tit-3">Любимыe треки ' + lenSong + '</h1>')
        .append( this.tsong(d.song) )
      )
    },
    ppplaylist: function(d) {
      this.titlePage(d.title);
      var lenPlaylist = d.playlist.length;

      $('.page-main')
      .append(
        $('<div class="row">')
        .append('<h1 class="tit-3">Любимыe плейлисты ' + lenPlaylist + '</h1>')
        .append( this.tplaylist(d.playlist) )
      )
    },
    ppartist: function(d) {
      this.titlePage(d.title);
      var lenArtist = d.artist.length;

      $('.page-main')
      .append(
        $('<div class="row">')
        .append('<h1 class="tit-3">Любимыe артисты ' + lenArtist + '</h1>')
        .append( this.tartist(d.artist) )
      )
    },
    tvalidData: function(d) {
      if ( Array.isArray(d) && d.length > 0) {
        return false;
      } else {
        return $('<div class="nosong"><img class="nocontent" src="/public/img/nocontent.png"></div>');
      }
    },
    tsong: function(d) {
      if ( !this.tvalidData(d) ) {
        var div = $('<div class="song-content">').data("d", d);

        for (var i = 0; i < d.length; i++) {
          var loved = this.setLoved(d[i].SNG_ID, 'song') ? ' loved' : '';
          d[i].index = i;
          var item = $('<div class="song-item" data-key="' + d[i].SNG_ID + '"></div>')
          .data("d", d[i])
          .click(function(e) {
            var t = $(e.target), self = $(this);
            if (t.hasClass("song-control")) {
              if ( t.hasClass("play-btn") ) {
                drPlayer.play({method: 'song', elm: self});
              } else if ( t.hasClass("pause-btn") ) {
                drPlayer.pause({method: 'song', elm: self});
              }
            }
          })
          .append(
            $('<button class="song-control play-btn"></button>')
          )
          .append(
            $('<div class="name-song"></div>')
            .append(
              $('<a href="/song/' + d[i]["SNG_ID"] + '" class="a-1">' + d[i]["SNG_TITLE"] + '</a>')
              .click(function(e) {
                DOREMI.clickLink(e);
              })
            )
            .append(
              $('<span> – </span>')
            )
            .append(
              function(d) {
                var arts = $(document.createDocumentFragment());

                for (var i = 0; i < d.length; i++)
                  arts
                  .append(
                    $('<a class="a-1" href="/artist/' + d[i]["ART_ID"] + '">' + d[i]["ART_NAME"] + '</a>')
                    .click(function(e) {
                      DOREMI.clickLink(e);
                    })
                  )
                  .append(
                    i + 1 == d.length ? false : $(document.createTextNode(', '))
                  )
                return arts;
              }(d[i]["SNG_ART"])
            )
          )
          .append(
            $('<button class="loved-song' + loved + '"></button>')
            .data("id", d[i]["SNG_ID"])
            .click(function() {
              $.ajax({
                type: "POST",
                url: '/ajax/love',
                dataType: 'json',
                data: {
                  METHOD: (!$(this).hasClass('loved') ? 'LOVE_SONG' : 'UNLOVE_SONG' ),
                  ID: $(this).data().id
                },
                success: function(d) {
                  DOREMI.creatDOM.toogleLoved(d, this.target, 'song');
                },
                error: function() {
                  console.log('Нет подключения к Интернету');
                },
                target: $(this)
              });
            })
          )
          .append(
            $('<div class="s-popularity" title="Популярность: ' + d[i]["SNG_RANK"] + '"></div>')
            .append(
              function(d) {
                d = Math.ceil(d/this.DOREMI.SRATE);
                var str = '';

                for (var i = 0; i < 10; i++)
                  str += '<span class="sp-item ' + ( i >= d || 'sp-rate') + '"></span>'

                return $(str);
              }(d[i]["SNG_RANK"])
            )
          )

          div.append(item);
          if (drPlayer.currentSongKey && drPlayer.currentSongKey == d[i].SNG_ID) {
            drPlayer.activeSongElm(item);
          }
        }
        return div;
      }

      return this.tvalidData(d);;
    },
    tartist: function(d) {
      if ( !this.tvalidData(d) ) {
        var div = $('<div class="artist-content"></div>');

        for (var i = 0; i < d.length; i++) {
          var loved = this.setLoved(d[i].ART_ID, 'artist') ? ' loved' : '';

          div.append(
            $('<div class="artist-item">')
            .click(function(e) {
              if ( $(e.target).hasClass("picture-link") ) $(this).find("a").click();
            })
            .append(
              $('<div class="a-i-picture"></div>')
              .append(
                $('<img class="picture-link" src="/public/img/artists/' + d[i]["ART_PICTURE"] + '" title="' + d[i]["ART_NAME"] + '">')
              )
              .append(
                $('<button class="loved-artist' + loved + '"></button>')
                .data("id", d[i]["ART_ID"])
                .click(function() {
                  $.ajax({
                    type: "POST",
                    url: '/ajax/love',
                    dataType: 'json',
                    data: {
                      METHOD: (!$(this).hasClass('loved') ? 'LOVE_ARTIST' : 'UNLOVE_ARTIST' ),
                      ID: $(this).data().id
                    },
                    success: function(d) {
                      DOREMI.creatDOM.toogleLoved(d, this.target, 'artist');
                    },
                    error: function() {
                      console.log('Нет подключения к Интернету');
                    },
                    target: $(this)
                  });
                })
              )
            )
            .append(
              $('<div class="a-i-name"></div>')
              .append(
                $('<div class="a-i-n-artist l-text">')
                .append(
                  $('<a class="a-1" href="/artist/' + d[i]["ART_ID"] + '">' + d[i]["ART_NAME"] + '</a>')
                  .click(function(e) {
                    DOREMI.clickLink(e);
                  })
                )
              )
              .append(
                $('<div class="a-i-n-fans l-text">' + d[i]["ART_RANK"] + ' просмотров</div>')
              )
            )
          )
        }

        return div;
      }

      return this.tvalidData(d);
    },
    tplaylist: function(d) {
      if ( !this.tvalidData(d) ) {
        var cnt = $('<div class="playlist-content"></div>')
        for (var i = 0; i < d.length; i++) {
          var loved = this.setLoved(d[i].PLY_ID, 'playlist') ? ' loved' : '';

          cnt.append(
            $('<div class="playlist-item"></div>')
            .click(function(e) {
              if ( $(e.target).hasClass("picture-link") ) $(this).find("a").click();
            })
            .append(
              $('<div class="pi-picture"></div>')
              .append(
                $('<img class="picture-link" src="/public/img/playlists/' + d[i]["PLY_PICTURE"] + '" title="Самые громкие новинки">')
                .data("PLY_ID", d[i]["PLY_ID"])
              )
              .append(
                $('<button class="loved-playlist' + loved + '"></button>')
                .data("id", d[i]["PLY_ID"])
                .click(function() {
                  $.ajax({
                    type: "POST",
                    url: '/ajax/love',
                    dataType: 'json',
                    data: {
                      METHOD: (!$(this).hasClass('loved') ? 'LOVE_PLAYLIST' : 'UNLOVE_PLAYLIST' ),
                      ID: $(this).data().id
                    },
                    success: function(d) {
                      DOREMI.creatDOM.toogleLoved(d, this.target, 'playlist');
                    },
                    error: function() {
                      console.log('Нет подключения к Интернету');
                    },
                    target: $(this)
                  });
                })
              )
            )
            .append(
              $('<div class="pi-name"></div>')
              .append(
                $('<div class="pin-playlist l-text"></div>')
                .append(
                  $('<a class="a-1" href="/playlist/' + d[i]["PLY_ID"] + '">' + d[i]["PLY_TITLE"] + '</a>')
                  .click(function(e) {
                    DOREMI.clickLink(e);
                  })
                )
              )
              .append(
                $('<div class="pin-songs l-text">' + d[i]["PLY_SONGS"] + ' треков – ' + d[i]["PLY_RANK"] + ' просмотров</div>')
              )
            )
          )
        }

        return cnt;
      }

      return this.tvalidData(d);;
    },
    nextPage: function(p) {
      var ul = $('<ul></ul>');
      var href = location.pathname.split('/').pop() - 0;

      for (var i = 1; i < 9; i++) {
        var active = '';
        if ( href === i || (i === 1 && !href)) active = 'class="next-page-active"';

        ul.append(
          $('<li ' + active + '>')
          .append(
            $('<a class="p-number" href="/' + p + '/page/' + i + '">' + i + '</a>')
            .click(function(e) {
              DOREMI.clickLink(e);
            })
          )
        )
      }

      return ul;
    },
    titlePage: function(t) {
      $('title')[0].text = t;
    },
    setLoved: function(item, arr) {
      if (DOREMI.user.id) {
        var arr = DOREMI.user[arr];
        for (var i = 0; i < arr.length; i++)
          if (item === arr[i]) return true;
      }

      return false;
    },
    toogleLoved: function(b, elm, arr) {
      var arr = DOREMI.user[arr];

      if (b === 'loved') {
        arr.push(elm.data().id);
        elm.addClass('loved');
      } else if (b === 'unloved') {
        var id = elm.data().id,
        pos = arr.indexOf(id);

        if ( pos >= 0 ) arr.splice(pos, 1);

        elm.removeClass('loved');
      }
    }
  },
  prefix: function() {
    var styles = window.getComputedStyle(document.documentElement, ''),
    pre = (Array.prototype.slice
      .call(styles)
      .join('')
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1],
    dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
    return {
      dom: dom,
      lowercase: pre,
      css: '-' + pre + '-',
      js: pre[0].toUpperCase() + pre.substr(1)
    };
  }(),
  toggleSaideBar: function() {
    var
    pageSaidebar = $('.page-saidebar'),
    pageMain = $('.page-main');

    if (pageSaidebar.hasClass('active')) {
      pageMain.css('opacity', 1);
      pageSaidebar.removeClass('active mobi-page-saidebar');
    } else {
      pageMain.css('opacity', 0.3);
      pageSaidebar.addClass('active mobi-page-saidebar');
    }
  },
  closeSideBar: function() {
    var pageSaidebar = $('.page-saidebar'),
    pageMain = $('.page-main');

    if (pageSaidebar.hasClass('active')) {
      pageMain.css('opacity', 1);
      pageSaidebar.removeClass('active mobi-page-saidebar');
    }
  },
  run: function() {
    this.user = typeof(user) === 'undefined' ? {} : user;

    (function(app) {
      app
      .append(
        $('<div class="page-loader" id="page_loader"><div class="page-loader-bar"></div></div>')
      )
      .append(
        $('<div class="header clearfix">')
        .append(
          $('<div class="menu-mobi">')
          .click(function(e) {
            DOREMI.toggleSaideBar();
          })
          .append(
            $('<span class="mobi-row"></span><span class="mobi-row"></span><span class="mobi-row"></span>')
          )
        )
        .append(
          $('<div class="header-logo">')
          .append(
            $('<a href="/">Doremi</a>')
            .click(function(e) {
              DOREMI.clickLink(e);
            })
          )
        )
      )
      .append(
        $('<div class="page-saidebar">')
        .append(
          $('<ul>')
          .append(
            (function(user) {
              var frag = $(document.createDocumentFragment());

              if (user.id)
              frag
                .append(
                  $('<li class="s-user-picture">')
                  .append(
                    $('<a href="/account">')
                    .click(function(e) {
                      DOREMI.clickLink(e, this.href);
                    })
                    .append(
                      $('<img src="/public/img/users/' + user.picture + '" alt="Picture User">')
                    )
                  )
                )

              frag
              .append(
                $('<li>')
                .append(
                  $('<div class="header-search">')
                  .append(
                    $('<form id="searchPage" action="/search" method="get">')
                    .submit(function(e) {
                      var q = $('input[name="q"]')[0].value,
                      href = $('<a href="/search?q=' + q + '"></a>')
                      .click(function(e) {
                        DOREMI.clickLink(e);
                      });

                      href.click();
                      e.preventDefault();
                    })
                    .html('<input type="text" name="q" autocomplete="off" placeholder="Поиск"><button type="submit"></button>')
                  )
                )
              )
              .append(
                $('<li>')
                .append(
                  $('<a class="a-sidebar" href="/new">Новинки</a></li>')
                  .click(function(e) {
                    DOREMI.clickLink(e, this.href);
                  })
                )
              )
              .append(
                $('<li>')
                .append(
                  $('<a class="a-sidebar" href="/popular">Популярное</a>')
                  .click(function(e) {
                    DOREMI.clickLink(e, this.href);
                  })
                )
              )
              .append(
                $('<li>')
                .append(
                  $('<a class="a-sidebar" href="/artists">Артисты</a>')
                  .click(function(e) {
                    DOREMI.clickLink(e, this.href);
                  })
                )
              )
              .append(
                $('<li>')
                .append(
                  $('<a class="a-sidebar" href="/upload">Добавить музыку</a>')
                  .click(function(e) {
                    DOREMI.clickLink(e, this.href);
                  })
                )
              )
              .append(
                $('<div class="line-partition"></div>')
              )

              if (user.id)
                frag
                .append(
                  $('<li>')
                  .append(
                    $('<a class="a-sidebar" href="/profile">Моя музыка</a>')
                    .click(function(e) {
                      DOREMI.clickLink(e, this.href);
                    })
                  )
                )
                .append(
                  $('<li>')
                  .append(
                    $('<a class="a-sidebar" href="/profile/loved">')
                    .click(function(e) {
                      DOREMI.clickLink(e, this.href);
                    })
                    .append(
                      $('<svg class="sidebar-icon" width="14" height="14" viewBox="0 0 12 12"><path d="M6.00011325,2.5 C6.00011325,2.5 5.00009438,1 3.25,1 C1.66669813,1 1.65327318e-16,2.25 0,4.5 C1.65327318e-16,7.5 6,11.5 6,11.5 C6,11.5 11.9999997,7.5 12,4.5 C12.0000002,2.25 10.3335284,1 8.75,1 C7.00013213,1 6.00011325,2.5 6.00011325,2.5 Z"/></svg>')
                    )
                    .append(
                      $('<span>Любимые треки</span>')
                    )
                  )
                )
                .append(
                  $('<li>')
                  .append(
                    $('<a class="a-sidebar" href="/profile/playlists">')
                    .click(function(e) {
                      DOREMI.clickLink(e, this.href);
                    })
                    .append(
                      $('<svg class="sidebar-icon" width="14" height="14" viewBox="0 0 12 12"><path d="M8,9.99224439 C8,11.1010972 6.88071187,12 5.5,12 C4.11928813,12 3,11.1010972 3,9.99224439 C3,8.88339158 4.11928813,7.98448877 5.5,7.98448877 C6.06280296,7.98448877 6.58216973,8.13384364 7,8.38589285 L7,2.36277306 L7,0.75552108 C7,0.201673187 7.42629719,-0.118924155 7.95813424,0.0412456698 L12,1.25850747 L12,3.26731057 C12,3.82115846 11.5737028,4.1417558 11.0418658,3.98158598 L8,3 L8,9.99224439 Z M0,0 L6,0 L6,1 L0,1 L0,0 L0,0 Z M0,2 L6,2 L6,3 L0,3 L0,2 L0,2 Z M0,4 L6,4 L6,5 L0,5 L0,4 L0,4 Z"/></svg>')
                    )
                    .append(
                      $('<span>Плейлисты</span>')
                    )
                  )
                )
                .append(
                  $('<li>')
                  .append(
                    $('<a class="a-sidebar" href="/profile/artists">')
                    .click(function(e) {
                      DOREMI.clickLink(e, this.href);
                    })
                    .append(
                      $('<svg class="sidebar-icon" width="14" height="14" viewBox="0 0 25 25"><path d="M16.428,15.744c-0.159-0.052-1.164-0.505-0.536-2.414h-0.009c1.637-1.686,2.888-4.399,2.888-7.07c0-4.107-2.731-6.26-5.905-6.26C9.69,0,6.974,2.152,6.974,6.26c0,2.682,1.244,5.406,2.891,7.088c0.642,1.684-0.506,2.309-0.746,2.396c-3.324,1.203-7.224,3.394-7.224,5.557c0,0.584,0,0.23,0,0.811c0,2.947,5.714,3.617,11.002,3.617c5.296,0,10.938-0.67,10.938-3.617c0-0.58,0-0.227,0-0.811C23.835,19.073,19.916,16.899,16.428,15.744z"/></svg>')
                    )
                    .append(
                      $('<span>Артисты</span>')
                    )
                  )
                )
                .append(
                  $('<li>')
                  .append(
                    $('<a class="a-sidebar" href="/logout">Выйти</a>')
                  )
                )
              else
                frag
                .append(
                  $('<li><a class="a-sidebar" href="/login">Вход</a></li>')
                )
                .append(
                  $('<li><a class="a-sidebar" href="/register">Регистрация</a></li>')
                )

              return frag;
            }(DOREMI.user))
          )
        )
      )
      .append(
        $('<div class="page-main clearfix">')
        .click(DOREMI.closeSideBar)
      )
      .append(
        $('<div class="footer">')
      )
    }(this.app));

    $(window).on('popstate', function() {
      DOREMI.getPage();
    });

    this.getPage();
  }
};
DOREMI.run();

function Sado(s) {
  var audio = new Audio();
  for (var e in s) audio[e] = s[e];

  var funcs = {
    src: function(v) {
      audio.src = v;
    },
    play: function() {
      if (audio.error) {
        console.log('Нет подключения к Интернету');
        return false;
      } else {
        audio.play();
        return true;
      }
    },
    pause: function() {
      if (audio.error) {
        console.log('Нет подключения к Интернету');
        return false;
      } else {
        audio.pause();
        return true;
      }
    },
    volum: function(v) {
      if (v || v === 0) audio.volume = v;
      return audio.volume;
    },
    timer: function(v) {
      if (v || v === 0) audio.currentTime = v;
      return audio.currentTime;
    },
    duration: function() {
      return audio.duration;
    },
    loop: function(b) {
      audio.loop = b || false;
    },
    mute: function(b) {
      audio.muted = b || false;
    }
  }

  for (var f in funcs) this[f] = funcs[f];
}

function Player(playlist) {
  var self = this;
  self.index = 0;
  self.playlist = playlist || [{
    SNG_ART: [{ART_ID: "17", ART_NAME: "Mohsen Chavoshi"}],
    SNG_ART_DEF: "",
    SNG_COUNT: "0",
    SNG_DATE: "2018-11-30",
    SNG_HREF: "6372d64c8e0de8104cebe047e2d431b0",
    SNG_ID: "53",
    SNG_RANK: "95",
    SNG_SIZE: "7.96",
    SNG_TIME: "03:23",
    SNG_TITLE: "Gheire Mamooli",
  }];
  self.elems = [];
  creatPlayer(DOREMI.app);

  ['track', 'timer', 'duration', 'playPauseBtn', 'prevBtn', 'nextBtn', 'playlistBtn', 'plPlaylist','volumeBtn', 'progress', 'seek', 'buffer', 'loading'].forEach(function(elm) {
    self.elems[elm] = $("#" + elm);
  });

  self.windowTitle(self.playlist[self.index]);
  self.title(self.playlist[self.index]);
  self.activeControls.player = self.elems.playPauseBtn;

  self.sado = new Sado({
    src: self.path(self.playlist[self.index]),
    preload: "metadata",
    ontimeupdate: function() {
      requestAnimationFrame(self.step.bind(self));
    },
    onprogress: function() {
      requestAnimationFrame(self.progress.bind(self, this.buffered));
    },
    onended: function() {
      self.skip("ended");
    },
    onerror: function() {
      console.log('Нет подключения к Интернету');
    },
    onplay: function() {
      self.onplay();
    },
    onpause: function() {
      self.onpause();
    }
  });

  function creatPlayer(elm) {
    elm
    .append(
      $('<div class="player-content">')
      .append(
        $('<div class="pc-resp">')
        .append(
          $('<div class="pc-controls">')
          .append(
            $('<button id="prevBtn" class="pc-control-prev">')
          )
          .append(
            $('<button id="playPauseBtn" class="pc-control-play">')
          )
          .append(
            $('<button id="nextBtn" class="pc-control-next">')
          )
          .append(
            $('<button id="playlistBtn" class="pc-playlist">')
          )
        )
        .append(
          $('<div class="pc-progress">')
          .append(
            $('<div class="pc-progress-resp">')
            .append(
              $('<div id="track" class="pc-title l-text">')
              .text("Doremi")
            )
            .append(
              $('<span id="timer" class="pc-current-time">')
            )
            .append(
              $('<div id="progress" class="pc-progress-content">')
              .append(
                $('<div id="seek" class="pc-progress-seek">')
              )
              .append(
                $('<div id="buffer" class="pc-progress-buffer">')
              )
            )
          )
        )
      )
    )
    .append(
      $('<div id="plPlaylist" class="player-playlist">')
    )
  }
};

Player.prototype = {
  skipTo: function(o) {
    var self = this;

    if (o.method === 'elm') {
      var elm = o.elm;

      self.resetSongElm();
      self.playlist = elm.parent().data().d;
      self.index = elm.data().d.index;

      var item = elm.data().d;
      self.currentSongKey = item.SNG_ID;
      self.sado.src(self.path(item));
      self.title(item);
      self.windowTitle(item);
    }

    if (o.method === 'data') {
      self.resetSongElm();

      var item = self.playlist[self.index];
      self.currentSongKey = item.SNG_ID;
      self.sado.src( self.path(item) );
      self.title(item);
      self.windowTitle(item);
    }

    if (o.method === 'data' || o.method === 'elm') {
      $("[data-key=" + self.currentSongKey + "]").each(function(i, item) {
        item = $(item);
        item.css("backgroundColor", "#efeff2");
        self.activeSongElm($(item));
      });

      $.ajax({
        type: "POST",
        url: '/ajax/rank',
        dataType: 'json',
        data: {
          METHOD: "LISTENED_SONG",
          ID: self.currentSongKey
        },
        error: function() {
          console.log('Нет подключения к Интернету');
        }
      });
    }

    self.sado.play();
  },
  skip: function(direction) {
    var self = this;

    var index = 0;
    if (direction === 'prev') {
      index = self.index - 1;
      if (index < 0) {
        index = self.playlist.length - 1;
      }
    } else if (direction === 'next' || direction === 'ended') {
      index = self.index + 1;
      if (index >= self.playlist.length) {
        index = 0;
      }
    }

    self.index = index;
    self.skipTo({method: "data"});
  },
  play: function(elm) {
    elm = elm || {};
    if (elm.method === 'song') {
      if (elm.elm && elm.elm.data().key != this.currentSongKey) {
        this.skipTo({method: "elm", elm: elm.elm});
      } else {
        this.skipTo({method: "play"});
      }
    }

    if (elm.method === 'player') {
      this.skipTo({method: "play"});
    }
  },
  pause: function() {
    this.sado.pause();
  },
  onplay: function() {
    this.isPlay = true;
    this.isPause = false;

    var controls = this.activeControls;

    if (controls.player) {
      controls.player.removeClass("pc-control-play");
      controls.player.addClass("pc-control-pause");
    }

    controls.songs.forEach(function(item) {
      var control = item.children().first();
      control.removeClass("play-btn");
      control.addClass("pause-btn");
    });
  },
  onpause: function() {
    this.isPlay = false;
    this.isPause = true;

    var controls = this.activeControls;

    if (controls.player) {
      controls.player.removeClass("pc-control-pause");
      controls.player.addClass("pc-control-play");
    }

    controls.songs.forEach(function(item) {
      var control = item.children().first();
      control.addClass("play-btn");
      control.removeClass("pause-btn");
      control.removeClass("ball-btn");
    });
  },
  isPlay: false,
  isPause: true,
  currentSongKey: undefined,
  activeSongElm: function(elm) {
    this.activeControls.songs.push(elm);
    elm.css("backgroundColor", "#efeff2");
    elm.children().first().attr("class", this.isPlay ? "song-control pause-btn ball-btn" :  "song-control play-btn");

    var control = elm.children().first();
    elm.on("mouseleave", function() {
      !control.hasClass("pause-btn") || control.addClass("ball-btn");
    });
    elm.on("mouseenter", function() {
      !control.hasClass("pause-btn") || control.removeClass("ball-btn");
    });
  },
  activeControls: {
    songs: []
  },
  resetSongElm: function() {
    var songs = this.activeControls.songs;
    songs.forEach(function(item, i) {
      item.css("backgroundColor", "");
      item.unbind("mouseleave");
      item.unbind("mouseenter");

      var control = item.children().first();
      control.removeClass("pause-btn");
      control.addClass("play-btn");
      control.removeClass("ball-btn");
    });
    songs.splice(0);
  },
  title: function(d) {
    var track = this.elems.track.html(''),
    arts = $(document.createDocumentFragment());

    d.SNG_ART.forEach(function(art, i, arr) {
      arts
      .append(
        $('<a class="a-1" href="/artist/' + art.ART_ID + '">' + art.ART_NAME + '</a>')
        .click(function(e) {
          DOREMI.clickLink(e);
        })
      )
      .append(
        i + 1 == arr.length ? false : $(document.createTextNode(', '))
      )
    });

    track
    .append(
      $('<a href="/song/' + d.SNG_ID + '" class="a-1">' + d.SNG_TITLE + '</a>')
      .click(function(e) {
        DOREMI.clickLink(e);
      })
    )
    .append(
      $(document.createTextNode(' – '))
    )
    .append(
      arts
    )
  },
  formatTime: function(secs) {
    var minutes = Math.floor(secs / 60) || 0;
    var seconds = (secs - minutes * 60) || 0;

    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  },
  windowTitle: function(d) {
    var name = d.SNG_TITLE,
    arts = '';

    d.SNG_ART.forEach(function(art, i, arr) {
      arts += art["ART_NAME"] + ( ( i + 1 == arr.length) ? '' : ', ' );
    });

    $('title').text(name + ' - ' + arts + ' - ' + 'Doremi');
  },
  step: function() {
    var
    self = this,
    seek = self.sado.timer() || 0,
    duration = self.sado.duration(),
    time = self.toggleTimer ? duration - seek : seek;
    self.elems.timer.text( self.formatTime( Math.round(time) ) );
    self.elems.seek.css("width", (((seek / duration) * 100) || 0) + '%');
  },
  progress: function(b) {
    for (i = 0; i < b.length; i++)
      this.elems.buffer.css("width", b.end(i) * 100 / this.sado.duration() + '%');
  },
  rewindTimer: function(e) {
    this.sado.timer(this.sado.duration() * event.offsetX / event.currentTarget.offsetWidth);
  },
  togglePlaylist: function() {
    var self = this;
    var ply = self.elems.plPlaylist;
    if (ply.css('display') === 'block'){
      ply.slideUp(300, function() {
        ply.html('');
        self.activeControls.songs.splice(self.activeControls.songs.length - 1);
      });
    } else {
      ply.append(
        $('<div class="py-pl-resp">')
        .append('<h2 class="tit-1" style="margin:20px auto; text-align:center;">Список воспроизведения')
        .append(
          $('<div class="py-pl-close">')
          .click(function() {
            drPlayer.togglePlaylist();
          })
        )
        .append(
          DOREMI.creatDOM.tsong(self.playlist)
        )
      );
      ply.slideDown(300);
    }
  },
  path: function(u) {
    return '/public/song/' + u.SNG_HREF + '.mp3';
  }
}

var drPlayer = new Player();

drPlayer.elems.playPauseBtn.on("click", function() {
  var self = $(this);
  if( self.hasClass("pc-control-play") ) {
    drPlayer.play({method: 'player'});
  } else if ( self.hasClass("pc-control-pause") ) {
    drPlayer.pause({method: 'player'});
  }
});
drPlayer.elems.prevBtn.on("click", function() {
  drPlayer.skip("prev");
});
drPlayer.elems.nextBtn.on("click", function() {
  drPlayer.skip("next");
});
drPlayer.elems.timer.on("click", function() {
  drPlayer.toggleTimer = drPlayer.toggleTimer ? false : true;
  drPlayer.step();
});
drPlayer.elems.progress.on("click", function() {
  drPlayer.rewindTimer(event);
});
drPlayer.elems.playlistBtn.on("click", function() {
  drPlayer.togglePlaylist();
});

function modalWindow(settings) {
  var s = settings || {};
  s.title = s.title || 'Модальное окно';
  s.cancle = s.cancle || 'Отменить';
  s.send = s.send || 'Сохранить';
  s.closeModal = function() {
    $('.modal').remove();
  };

  var frag = $(document.createDocumentFragment());

  (s.form || []).forEach(function(item) {
    switch (item.type) {
      case 'text':
      case 'password':
      case 'email':
        frag
        .append(
          $('<input class="upf-input" name="' + item.name + '" type="' + item.type + '" placeholder="' + item.placeholder + '">')
        )
        break;
      default:

    }
  });

  (function(app) {
    app
    .append(
      $('<div class="modal">')
      .append(
        $('<div class="modal-backdrop"></div>')
        .click(s.closeModal)
      )
      .append(
        $('<div class="modal-wrapper"></div>')
        .append(
          $('<div class="modal-dialog"></div>')
          .append(
            $('<form autocomplete="off">')
            .append(
              $('<div class="modal-head"></div>')
              .append(
                $('<div class="modal-title">' + s.title + '</div>')
              )
              .append(
                $('<div class="modal-close"></div>')
                .click(s.closeModal)
              )
            )
            .append(
              $('<div class="modal-body"></div>')
              .append(
                frag
              )
            )
            .append(
              $('<div class="modal-footer">')
              .append(
                $('<div class="wnw-cancle">')
                .append(
                  $('<button type="button" name="cancle">' + s.cancle + '</button>')
                  .click(s.closeModal)
                )
              )
              .append(
                $('<div class="wnw-add">')
                .append(
                  $('<button type="submit" name="send">' + s.send + '</button>')
                )
              )
            )
          )
        )
      )
    )
  }(DOREMI.app))

  s.callback({
    closeModal: s.closeModal,
    showError: function(t) {
      var
      modalBody = $(".modal-body"),
      errorElement = modalBody.find(".form-error");

      if (errorElement.length)
        errorElement.text(t);
      else
        modalBody
        .append(
          $('<div class="form-error" style="color: red;">' + t + '</div>')
        )
    },
    removeError: function() {
      var
      modalBody = $(".modal-body"),
      errorElement = modalBody.find(".form-error");

      if (errorElement.length) errorElement.remove();
    }
  });

};
