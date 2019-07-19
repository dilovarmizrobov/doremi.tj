;(function(h) {
  h.prototype.addClass = function(string) {
    this.classList.add(string);
  }
  h.prototype.hasClass = function(string) {
    return this.classList.contains(string);
  }
  h.prototype.removeClass = function(string) {
    this.classList.remove(string);
  }
  h.prototype.toggleClass = function(string) {
    this.classList.toggle(string);
  }
}(HTMLElement));


var f = (function(){
  //Prefix
  var prefix = (function () {
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
  })();


  //Loved sng,art
  function loved(r, t) {
    if (r === 'loved') t.addClass('loved');
    if (r === 'unloved') t.removeClass('loved');
  };

  // Get Element, s-selector, e-element;
  function gel(s, e) {
    var el = e ? e.querySelectorAll(s) : document.querySelectorAll(s);
    if (el.length > 1) return el;
    if (el.length == 1) return el[0];
    return false;
  };

  //
  function intitListener(e, f, el) {
    if (!el) return;
    var el = el || document, einf = window.addEventListener ? ['addEventListener', ''] : ['attachEvent', 'on'];
    el[ einf[0] ](einf[1] + e, function(event) {
      event = event || window.event;
      var target = event.target || event.srcElement;
      f(target);
    }, false);
  };

  //
  function creatElem(e) {
    var el;
    e.c == 'text' ? el = document.createTextNode(', ') : e.c ? typeof(e.c) === 'object' ? el = e.c : el = document.createElement(e.c) : el = document.createElement('div');

    e.i ? el.innerHTML = e.i : el;

    if (e.ach && e.ach.length) {
      for (var i = 0; i < e.ach.length; i++) {
        if (e.ach[i]) {
          el.appendChild(e.ach[i]);
        }
      }
    } else if (e.ach) {
      el.appendChild(e.ach);
    }

    if (e.a) for (var i = 0; i < e.a.length; i++) el.setAttribute(e.a[i][0] || 'class' , e.a[i][1] || '');

    if (e.d) {
      el.data = e.d;
    }

    return el;
  };

  //request
  function RequestAjax(e) {
    var request = function() {
      var Request = false;

      if (window.XMLHttpRequest) {
        Request = new XMLHttpRequest();
      } else if (window.ActiveXObject) {
        try {
          Request = new ActiveXObject("Microsoft.XMLHTTP");
        }

        catch (CatchException) {
          Request = new ActiveXObject("Msxml2.XMLHTTP");
        }
      }

      if (!Request) {
        alert("Невозможно создать XMLHttpRequest");
      }

      return Request;
    }();
    request.open( 'POST', ( e.fl || '/') );
    request.responseType = e.type || 'text';
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    request.send(e.d || "");
    request.onreadystatechange = function () {
      if (this.readyState != 4) return;

      if (this.status != 200) {
        alert('Нет подключения к Интернету');

        if (e.er) e.er();
      } else {
        if (this.response == null)
          return;

        if (e.f)
          e.f( JSON.parse(this.responseText), e.p );
      }
    }
  };

  return {
    prefix: prefix,
    loved: loved,
    gel: gel,
    listener: intitListener,
    ce: creatElem,
    req: RequestAjax
  };
}());


;(function() {
  var sound = {
    songElement: undefined,
    songControlElement: false,
    aud: new Audio(),
    playerControlsElement: f.gel('.pc-controls'),
    playerControlElement: f.gel('.pc-control'),
    playerControlPrevElement: f.gel('.pc-control-prev'),
    playerControlNextElement: f.gel('.pc-control-next'),
    playerProgressContentElement: f.gel('.pc-progress-content'),
    playerProgressSeekElement: f.gel('.pc-progress-seek'),
    playerProgressBufferElement: f.gel('.pc-progress-buffer'),
    playerCurrentTimeElement: f.gel('.pc-current-time'),
    playerSetTitle: function() {
      f.gel('.pc-title').innerHTML = f.gel('.name-song', sound.songElement).innerHTML;
    },
    initiality: function(target) {
      this.resetSongElement();
      this.songElement = target;
      this.aud.src = '/public/song/' + target.src + '.mp3';
      this.windowTitle();
      this.playerSetTitle();
      this.songControlElement = f.gel('.song-control', target);
      f.req({
        fl: '/ajax/rank',
        d: 'METHOD=LISTENED_SONG' + '&' + 'ID=' + target.dataset.id
      });
    },
    resetSongElement: function() {
      if(!this.songElement) return;
      this.songElement.style.backgroundColor = '';
      this.songElement.removeClass('active');
      this.songElement.removeClass('paused');
      this.songControlElement.removeClass('pause-btn');
      this.songControlElement.addClass('play-btn');
      this.songControlElement.removeClass('ball-btn');
    },
    play: function() {
      this.aud.play();
    },
    pause: function() {
      this.aud.pause();
    },
    windowTitle: function() {
      var nameSong = f.gel('.a-1', this.songElement),
      string = nameSong[0].innerHTML + ' - ';

      for (var i = 1; i < nameSong.length; i++)
        string += nameSong[i].innerHTML  + (i < nameSong.length - 1 ? ', ' : ' - Doremi');

      f.gel('title').innerHTML = string;
    },
    jplayer: function() {
      var sngItem = f.gel('.song-item');

      if (!sngItem) return;

      if (sngItem.length === undefined) sngItem = [sngItem];

      for (var i = 0; i < sngItem.length; i++) {
        f.listener('click', function(target) {
          var currentTarget = event.currentTarget;
          currentTarget.src = currentTarget.dataset.name;

          if (target.hasClass('song-control')) {

            if (!currentTarget.hasClass('active')) {
              currentTarget.style.backgroundColor = '#efeff2';
              currentTarget.addClass('active');
              sound.playerControlsElement.addClass('active');
              sound.initiality(currentTarget);
            } else {
              currentTarget.addClass('paused');
              sound.playerControlsElement.addClass('paused');
            }

            if (sound.songControlElement.hasClass('play-btn')) {
              currentTarget.removeClass('paused');
              sound.playerControlsElement.removeClass('paused');
              sound.play();
              if (sound.songElement == sound.songElement.parentElement.firstElementChild && sound.songElement == sound.songElement.parentElement.lastElementChild) {
                sound.playerControlPrevElement.addClass('pc-control-prev-off');
                sound.playerControlNextElement.addClass('pc-control-next-off');
              } else if ( sound.songElement == sound.songElement.parentElement.firstElementChild ) {
                sound.playerControlPrevElement.addClass('pc-control-prev-off');
                sound.playerControlNextElement.removeClass('pc-control-next-off');
              } else if (sound.songElement == sound.songElement.parentElement.lastElementChild) {
                sound.playerControlPrevElement.removeClass('pc-control-prev-off');
                sound.playerControlNextElement.addClass('pc-control-next-off');
              } else {
                sound.playerControlPrevElement.removeClass('pc-control-prev-off');
                sound.playerControlNextElement.removeClass('pc-control-next-off');
              }
            } else if (sound.songControlElement.hasClass('pause-btn'))
              sound.pause();
          }
          else if (target.hasClass('loved-song'))
            f.req({
              fl: '/ajax/love',
              d: 'METHOD=' + (!target.hasClass('loved') ? 'LOVE_SONG' : 'UNLOVE_SONG' ) + '&' + 'ID=' + currentTarget.dataset.id,
              f: f.loved,
              p: target
            });
        }, sngItem[i]);

        f.listener('mouseenter', function(target) {
          if ( target.hasClass('active') && !target.hasClass('paused') ) {
            sound.songControlElement.removeClass('ball-btn');
          }
        }, sngItem[i]);

        f.listener('mouseleave', function(t) {
          if ( t.hasClass('active') && !t.hasClass('paused') ) {
            sound.songControlElement.addClass('ball-btn');
          }
        }, sngItem[i]);
      }

      f.listener('click', function(t) {
        if(!sound.aud.duration) return;

        sound.aud.currentTime = sound.aud.duration * event.offsetX / event.currentTarget.offsetWidth;
        sound.playerProgressSeekElement.style.width = event.offsetX + 'px';
      }, this.playerProgressContentElement);

      f.listener('click', function(target) {
        if ( !sound.aud.src ) return;

        if ( target.hasClass('pc-control-play') ) {
          sound.songControlElement.addClass('ball-btn');
          sound.songControlElement.click();
        } else if ( target.hasClass('pc-control-pause') ) {
          sound.songControlElement.click();
          sound.songControlElement.removeClass('ball-btn');
        } else if ( target.hasClass('pc-control-prev') ) {
          if ( !sound.songElement.previousElementSibling ) return;

          var prevElement = sound.songElement.previousElementSibling;
          f.gel('.song-control', prevElement).click();
          sound.songControlElement.addClass('ball-btn');

          if ( prevElement == prevElement.parentElement.firstElementChild )
            target.addClass('pc-control-prev-off');
          else
            target.parentElement.lastElementChild.removeClass('pc-control-next-off');
        } else if ( target.hasClass('pc-control-next') ) {
          if ( !sound.songElement.nextElementSibling ) return;

          var nextElement = sound.songElement.nextElementSibling;
          f.gel('.song-control', nextElement).click();
          sound.songControlElement.addClass('ball-btn');

          if ( nextElement == nextElement.parentElement.lastElementChild )
            target.addClass('pc-control-next-off');
          else
            target.parentElement.firstElementChild.removeClass('pc-control-prev-off');
        }
      }, this.playerControlsElement);
    },
    run: function() {
      f.listener('ended', function() {
        if (!!sound.songElement.nextElementSibling) {
          f.gel('.song-control', sound.songElement.nextElementSibling).click();
          sound.songControlElement.addClass('ball-btn');
        } else
          sound.songControlElement.removeClass('ball-btn');
      }, this.aud);
      f.listener('error', function() {
        alert('Нет подключения к Интернету');
      }, this.aud);
      f.listener('play', function() {
        sound.songControlElement.addClass('pause-btn');
        sound.songControlElement.removeClass('play-btn');
        sound.playerControlElement.removeClass('pc-control-play');
        sound.playerControlElement.addClass('pc-control-pause');
        sound.songElement.removeClass('paused');
      }, this.aud);
      f.listener('pause', function() {
        sound.songControlElement.addClass('play-btn');
        sound.songControlElement.removeClass('pause-btn');
        sound.playerControlElement.addClass('pc-control-play');
        sound.playerControlElement.removeClass('pc-control-pause');
        sound.songElement.addClass('paused');
      }, this.aud);
      f.listener('timeupdate', function(e) {
        var
        minute = Math.floor(e.currentTime / 60),
        second = Math.floor(e.currentTime % 60);
        sound.playerCurrentTimeElement.innerHTML = (minute < 10 ? '0' : '') + minute + ':'+ (second < 10 ? '0' : '') + second;
        sound.playerProgressSeekElement.style.width = e.currentTime * 100 / e.duration + '%';
      }, this.aud);
      f.listener('progress', function(e) {
        for (i = 0; i < sound.aud.buffered.length; i++)
          sound.playerProgressBufferElement.style.width = sound.aud.buffered.end(i) * 100 / e.duration + '%';
      }, this.aud);
      f.listener('keyup', function(e) {
        if (e.tagName == 'INPUT' || event.keyCode != 32 || !sound.songElement) return;
        sound.playerControlElement.click();
        event.preventDefault();
      }, document);
      this.jplayer();
    }
  }
  sound.run();

  ;(function() {
    var downloadElement = f.gel('.tr-download');
    if (!downloadElement) return;

    f.listener('click', function(e) {
      f.ce({c: 'a', a: [['href', '/downloadsong?s=' + e.parentElement.dataset.name], ['target', '_blank']]}).click();
    }, downloadElement);
  }());

  ;(function() {
    var
    pageSaidebar = f.gel('.page-saidebar'),
    pageMain = f.gel('.page-main'),
    menuMobi = f.gel('.menu-mobi');

    f.listener('click', function(t) {
      if ( pageSaidebar.hasClass('active') ) {
        pageSaidebar.removeClass('active');
        pageSaidebar.removeClass('mobi-page-saidebar');
        pageMain.style.opacity = '';
      } else {
        pageSaidebar.addClass('active');
        pageSaidebar.addClass('mobi-page-saidebar');
        pageMain.style.opacity = '0.3';
      }
    }, menuMobi);

    f.listener('click', function(t) {
      if ( pageSaidebar.hasClass('active') ) {
        pageSaidebar.removeClass('active');
        pageSaidebar.removeClass('mobi-page-saidebar');
        pageMain.style.opacity = '';
      }
    }, pageMain);
  }());

  ;(function() {
    var artItems = f.gel('.artist-item');

    if (!artItems) return;

    if (!artItems.length) artItems = [artItems];

    for (var i = 0; i < artItems.length; i++)
      f.listener('click', function(target) {
        var currentTarget = event.currentTarget;

        if (target.tagName === 'IMG')
          f.gel('.a-i-n-artist', currentTarget).firstElementChild.click();
        else if ( target.hasClass('loved-artist') )
          f.req({
            fl: '/ajax/love',
            d: 'METHOD=' + (!target.hasClass('loved') ? 'LOVE_ARTIST' : 'UNLOVE_ARTIST' ) + '&' + 'ID=' + currentTarget.dataset.id,
            f: f.loved,
            p: target
          });
      }, artItems[i]);
  }());

  ;(function() {
    var plyItems = f.gel('.playlist-item');

    if (!plyItems) return;

    if (!plyItems.length) plyItems = [plyItems];

    for (var i = 0; i < plyItems.length; i++)
      f.listener('click', function(target) {
        var currentTarget = event.currentTarget;

        if (target.tagName === 'IMG') {
          f.gel('.pin-playlist', currentTarget).firstElementChild.click();
        } else if ( target.hasClass('loved-playlist') )
          f.req({
            fl: '/ajax/love',
            d: 'METHOD=' + (!target.hasClass('loved') ? 'LOVE_PLAYLIST' : 'UNLOVE_PLAYLIST' ) + '&' + 'ID=' + currentTarget.dataset.id,
            f: f.loved,
            p: target
          });
      }, plyItems[i]);
  }());

  ;(function() {
    var item = f.gel('.pp-img') || f.gel('.pa-img');

    if (!item) return;

    f.listener('click', function(target) {
      var currentTarget = event.currentTarget;

      if ( currentTarget.hasClass('pp-img') ) {
        var method = 'PLAYLIST';
      } else if ( currentTarget.hasClass('pa-img') ) {
        var method = 'ARTIST';
      }

      if ( target.hasClass('loved-playlist') || target.hasClass('loved-artist') )
        f.req({
          fl: '/ajax/love',
          d: 'METHOD=' + (!target.hasClass('loved') ? 'LOVE_' + method : 'UNLOVE_' + method ) + '&' + 'ID=' + currentTarget.dataset.id,
          f: f.loved,
          p: target
        });
    }, item);
  }());

  ;(function() {
    var
    audioElement = f.gel('.upf-audio').firstElementChild,
    inputFileElement = f.gel('input[name="prd"]'),
    timeElement = f.gel('input[name="time"]');
    changeButtonElement = f.gel('.upf-change'),

    f.listener('click', function() { inputFileElement.click(); }, changeButtonElement);

    f.listener('input', function() {
      if ( inputFileElement.files && inputFileElement.files[0] && inputFileElement.files[0].type.match('audio/*') ) {
        var reader = new FileReader();
        reader.onload = function (e) {
          audioElement.src = e.target.result;
          audioElement.oncanplaythrough = function() {
            var m = Math.floor( Math.floor( this.duration ) / 60 ) + '',
            s = Math.floor( this.duration ) % 60 + '';
            m = m.length == 1 ? '0' + m : m;
            s = s.length == 1 ? '0' + s : s;
            timeElement.value = m + ':' + s;
          };
        }
        reader.readAsDataURL(inputFileElement.files[0]);
      }
    }, inputFileElement);
  }());

  carouselElement(f.gel('.carousel1'), f.gel('.controls1'), 250);
  carouselElement(f.gel('.carousel2'), f.gel('.controls2'), 250);

  function carouselElement(carousel, controls, widthElement) {
    if (!carousel || !controls) return;

    var counter = carouselCount = 0,
    content = carousel.firstElementChild;
    content.addClass('carousel-content');
    content.style.width = content.childElementCount * widthElement + 'px';

    f.listener('click', function(e) {
      var prev = event.currentTarget.firstElementChild,
      next = event.currentTarget.lastElementChild;
      carouselCount = Math.ceil( content.childElementCount / (carousel.offsetWidth / widthElement) ) - 1;

      if ( e.hasClass('carousel-prev') ) {
        if (counter > 0) {
          counter--;
          content.style[f.prefix.js + 'Transform'] = 'translateX(-' + (counter * carousel.offsetWidth) +'px)';
          next.removeClass('carousel-next-off');
          if (counter == 0) {
            prev.addClass('carousel-prev-off');
          }
        }
      } else if ( e.hasClass('carousel-next') ) {
        if (carouselCount > counter) {
          counter++;
          content.style[f.prefix.js + 'Transform'] = 'translateX(-' + (counter * carousel.offsetWidth) +'px)';
          prev.removeClass('carousel-prev-off');
          if (carouselCount == counter) {
            next.addClass('carousel-next-off');
          }
        } else {
          next.addClass('carousel-next-off');
        }
      }
    }, controls);
  };

  var wnw = {
    run: function(pel, data) {
      var pel = pel || document.body,
      data = data || {
        wnwTitle: 'Добавить музыку',
        cancle: 'Отменить',
        send: {name: 'err', text: 'Добавить'}
      },
      wnwDocument = document.createDocumentFragment();

      f.ce({
        c: wnwDocument,
        ach: f.ce({
          a: [[, 'modal']],
          ach: [
            f.ce({a: [[, 'modal-backdrop']]}),
            f.ce({
              a: [[, 'modal-wrapper']],
              ach: f.ce({
                a: [[, 'modal-dialog']],
                ach: f.ce({
                  c: 'form',
                  a: [['name', data.formName || ''], ['action', data.formAction || ''], ['enctype', 'multipart/form-data'], ['method', 'post'], ['autocomplete', 'off']],
                  ach: [
                    f.ce({
                      a: [[, 'modal-head']],
                      ach: [
                        f.ce({a: [[, 'modal-title']], i: data.wnwTitle || 'Окно'}),
                        f.ce({a: [[, 'modal-close']]})
                      ]
                    }),
                    f.ce({a: [[, 'modal-body']]}),
                    f.ce({a: [[, 'modal-footer']]})
                  ]
                })
              })
            })
          ]
        })
      });

      f.ce({c: pel, ach: wnwDocument});

      for (var d in data) {

        if (data[d].type === 'text' || data[d].type == 'email' || data[d].type == 'password') {
          f.ce({
            c: f.gel('.modal-body'),
            ach: f.ce({c: 'input', a: [[, 'upf-input'], ['name', data[d].name], ['value', data[d].value || ''], ['type', data[d].type], ['placeholder', data[d].placeholder]]})
          });
        }

        if (d == 'textarea') {
          f.ce({
            c: f.gel('.modal-body'),
            ach: f.ce({
              c: 'textarea',
              a: [[, 'form-textarea'], ['name', data[d].name], ['maxlength', '1500'], ['placeholder', data[d].placeholder]],
              i: data[d].text
            })
          })
        }

        if (d == 'select') {
          var selOpt = document.createDocumentFragment();

          for (var i = 0; i < data[d].option.length + 1; i++) {
            f.ce({
              c: selOpt,
              ach: f.ce({
                c: 'option',
                a: [['value', i + ''], [i == data[d].select ? 'selected' : '']],
                i: i == 0 ? data[d].title : data[d].option[i-1]})
            });
          }

          f.ce({
            c: f.gel('.modal-body'),
            ach: [f.ce({c: 'select', a: [[, 'form-input'], ['name', data[d].name]], ach: selOpt})]
          });
        }

        if (d == 'file') {
          f.ce({
            c: f.gel('.modal-body'),
            ach: data[d].elm
          });
        }

        if (d == 'cancle') {
          f.ce({
            c: f.gel('.modal-footer'),
            ach: f.ce({a: [[, 'wnw-cancle']], ach: f.ce({c: 'button', a: [['type', 'button']], i: data.cancle})})
          });
        }

        if (d == 'send') {
          f.ce({
            c: f.gel('.modal-footer'),
            ach: f.ce({a: [[, 'wnw-add']], ach: f.ce({c: 'button', a: [['type', 'submit'], ['name', data.send.name], ['value', data.send.value || '']], i: data.send.text})})
          });
        }

        if (data[d].callback) {
          data[d].callback();
        }
      }

      f.listener('click', function() {
        var t = event.target, ct = event.currentTarget;

        if ( t.classList.contains('modal-backdrop') || t.classList.contains('modal-close') || t.parentElement.classList.contains('wnw-cancle') ) ct.parentElement.removeChild(ct);
      }, f.gel('.modal'));
    }
  };
  ;(function() {
    var accountImg = f.gel('.account-img'),
    change = f.gel('.account-change-img');
    if (!accountImg || !change) return;

    var parent = change.parentElement,
    file = f.gel('input[type="file"]', parent);

    f.listener('click', function() {
      if ( change.hasClass('add') ) {
        var send = f.ce({c: 'button', a: [['hidden'], ['type','submit'], ['name', 'CHANGE_ACCOUNT_IMG']]}),
        form = f.ce({
          c: 'form',
          a: [['method', 'post'], ['enctype', 'multipart/form-data']],
          ach: [
            file,
            send
          ]
        });
        parent.appendChild(form);
        send.click();
      } else {
        file.click();
      }
    }, change);

    f.listener('input', function() {
      if ( file.files && file.files[0] && file.files[0].type.match('image.*') ) {
        var reader = new FileReader();
        reader.onload = function (e) {
          accountImg.src = e.target.result;
          change.innerHTML = "Сохранить";
          change.addClass('add');
        }
        reader.readAsDataURL(file.files[0]);
      }
    }, file);
  }());

  ;(function() {
    var edits = f.gel('.ac-edit-info');
    if (!edits) return;

    for (var i = 0; i < edits.length; i++) {
      f.listener('click', function(target) {
        var edit = event.currentTarget;

        if (edit.hasClass('ac-edit-login'))
          wnw.run(document.body, {
            formName: 'edit_login',
            wnwTitle: 'Изменение логина',
            password: {name: 'password', placeholder: 'Ваш пароль', type: 'password'},
            newLogin: {name: 'new_login', placeholder: 'Новый логин', type: 'text'},
            verNewLogin: {name: 'ver_new_login', placeholder: 'Подтверждение нового логина', type: 'text'},
            cancle: 'Отменить',
            send: {
              name: 'edit_login',
              text: 'Сохранить',
              callback: function() {
                var
                formSend = f.gel('form[name="edit_login"]'),
                password = f.gel('input[name="password"]', formSend),
                newLogin = f.gel('input[name="new_login"]', formSend),
                verNewLogin = f.gel('input[name="ver_new_login"]', formSend);

                f.listener('input', function(target) {
                  if (target.value.length > 2) {
                    var re = /^([a-zA-Z0-9])(\w|-|_)+([a-z0-9])$/;

                    if ( re.test( String(newLogin.value).toLowerCase() ) )
                      f.req({
                        fl: '/account',
                        d: 'validate_login=' + target.value,
                        f: function(d) {
                          if (d.result) {
                            errorEdit('Этот логин уже занят.', password.parentElement);
                            newLogin.free = false;
                          } else {
                            var errorElement = f.gel('.form-error', password.parentElement);

                            if (errorElement) password.parentElement.removeChild(errorElement);

                            newLogin.free = true;
                          }
                        }
                      });
                    else
                      errorEdit('Неверный формат логина.', password.parentElement);
                  } else
                    errorEdit('Имя пользователя должно содержать не менее 3 символов.', password.parentElement);
                }, newLogin);

                f.listener('submit', function(e) {
                  if ( password.value.length < 6 )
                    errorEdit('Пароль должен содержать не менее 6 символов.', password.parentElement);
                  else if (newLogin.value !== verNewLogin.value)
                    errorEdit('Подтверждение не совпадает с логином.', password.parentElement);
                  else if (!newLogin.free)
                    errorEdit('Не удалось обновить!', password.parentElement);
                }, formSend);
              }
            }
          });
        else if (edit.hasClass('ac-edit-password'))
          wnw.run(document.body, {
            formName: 'edit_password',
            wnwTitle: 'Изменение пароля',
            password: {name: 'password', placeholder: 'Ваш пароль', type: 'password'},
            newPassword: {name: 'new_password', placeholder: 'Новый пароль', type: 'password'},
            verNewPassword: {name: 'ver_new_password', placeholder: 'Подтверждение нового пароля', type: 'password'},
            cancle: 'Отменить',
            send: {
              name: 'edit_password',
              text: 'Сохранить',
              callback: function() {
                var
                formSend = f.gel('form[name="edit_password"]'),
                password = f.gel('input[name="password"]', formSend),
                newPassword = f.gel('input[name="new_password"]', formSend),
                verNewPassword = f.gel('input[name="ver_new_password"]', formSend);

                f.listener('submit', function(e) {
                  if (password.value.length < 6)
                    errorEdit('Пароль должен содержать не менее 6 символов.', password.parentElement);
                  else {
                    if (newPassword.value.length < 6)
                      errorEdit('Пароль должен содержать не менее 6 символов.', password.parentElement);
                    else if (newPassword.value !== verNewPassword.value){
                      errorEdit('Подтверждение не совпадает с паролем.', password.parentElement);
                    }
                  }
                }, formSend);
              }
            }
          });
        else if (edit.hasClass('ac-edit-email'))
          wnw.run(document.body, {
            formName: 'edit_email',
            wnwTitle: 'Изменение электронного адреса',
            password: {name: 'password', placeholder: 'Ваш пароль', type: 'password'},
            newEmail: {name: 'new_email', placeholder: 'Новый электронный адрес', type: 'email'},
            verNewEmail: {name: 'ver_new_email', placeholder: 'Проверка нового электронного адреса', type: 'email'},
            cancle: 'Отменить',
            send: {
              name: 'edit_email',
              text: 'Сохранить',
              callback: function() {
                var
                formSend = f.gel('form[name="edit_email"]'),
                password = f.gel('input[name="password"]', formSend),
                newEmail = f.gel('input[name="new_email"]', formSend),
                verNewEmail = f.gel('input[name="ver_new_email"]', formSend);

                f.listener('submit', function(e) {
                  if (password.value.length < 6)
                    errorEdit('Пароль должен содержать не менее 6 символов.', password.parentElement);
                  else {
                    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                    if ( re.test(String(newEmail.value).toLowerCase()) ) {
                      if (newEmail.value !== verNewEmail.value)
                        errorEdit('Подтверждение не совпадает с электронным адресом.', password.parentElement);
                    } else
                      errorEdit('Неверный формат адреса электронной почты.', password.parentElement);
                  }
                }, formSend);
              }
            }
          });
      }, edits[i]);
    }

    function errorEdit(text, element) {
      var errorElement = f.gel('.form-error', element);

      if (errorElement)
        errorElement.innerHTML = text;
      else
        f.ce({c: element, ach: f.ce({a: [[, 'form-error'], ['style', 'color: red;']], i: text})})

      event.preventDefault();
    }
  }());

  ;(function() {
    if (!f.gel('.account-delete')) return;

    f.listener('click', function() {
      if ( !confirm('Удалить ваш аккаунт?') ) event.preventDefault();
    }, f.gel('.account-delete') );
  }());

}());
