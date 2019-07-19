  var f = (function() {
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

    //request e obj
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
      request.open( 'POST', ( e.fl || 'ajax.php') );
      request.responseType = e.type || 'text';
      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      request.send(e.d || "");
      request.onreadystatechange = function () {
        if (this.readyState != 4) return;
        if (this.status != 200) {
          alert('Нет подключения к Интернету');
          if (!!e.er) e.er();
        } else {
          if (this.response == null) return;
          if (e.f) e.f( JSON.parse(this.responseText), e.p );
          if (e.song) e.song(this.response);
        }
      }
    };

    return {
      gel: gel,
      listener: intitListener,
      ce: creatElem,
      req: RequestAjax
    };
  }());

window.onload = function() {

  var searchProductName = {
    songView: function(data) {
      return f.ce({
        d: data,
        c: 'span',
        a: [[, 'spn-element']],
        ach: [
          f.ce({c: 'span', a: [[, 'spn-element-text']], i: data.SNG_TITLE + ' – ' + data.SNG_ART[0].ART_NAME}),
          f.ce({c: 'span', a: [[, 'spn-element-button']]})
        ]
      });
    },
    artistView: function(data) {
      return f.ce({
        d: data,
        c: 'span',
        a: [[, 'spn-element']],
        ach: [
          f.ce({c: 'span', a: [[, 'spn-element-text']], i: data.ART_NAME}),
          f.ce({c: 'span', a: [[, 'spn-element-button']]})
        ]
      });
    },
    products: function() {
      var spnSend = f.gel('.spn-send').firstElementChild;

      if ( !spnSend ) return;
      var s = '';
      var prid = '';

      if (searchProductName.spn === 'SONG') prid = 'SNG_ID';
      else if (searchProductName.spn === 'ARTIST') prid = 'ART_ID';

      for (var i = 0; i < this.cname.childElementCount; i++) {
        s += this.cname.children[i].data[prid] + (i < (this.cname.childElementCount - 1) ? ',' : '');
      }
      f.ce({c: spnSend, a: [['value', s]]});
    },
    run: function() {
      this.sform = f.gel('.spn-search-form').firstElementChild;
      this.cname = f.gel('.spn-name-container');
      this.cresult = f.gel('.spn-result-container');
      if (!this.sform || !this.cname || !this.cresult || (this.sform.name !== 'SONG' && this.sform.name !== 'ARTIST') ) return;
      this.spn = this.sform.name;
      f.listener('input', function() {
        searchProductName.cresult.innerHTML = '';
        var t = event.target;
        if ( t.value.length == 0 ) {
          searchProductName.cresult.classList.remove('active');
          searchProductName.cresult.style.display = 'none';
        } else if (t.value.length > 0){
          searchProductName.cresult.classList.add('active');
          searchProductName.cresult.style.display = 'block';

          f.req({fl:'/panel/ajax', d:'METHOD=SEARCH_' + t.name + '&SEARCH=' + t.value, f: function(d) {
            var d = d.DATA;
            if (d.length === 0) return;

            for (var i = 0; i < d.length; i++) {
              var np = '';

              if (searchProductName.spn === 'SONG')
                np = d[i]['SNG_TITLE'] + ' – ' + d[i]['SNG_ART'][0]['ART_NAME'];
              else if (searchProductName.spn === 'ARTIST')
                np = d[i]['ART_NAME'];

              f.ce({
                c: searchProductName.cresult,
                ach: f.ce({d: d[i], a: [[,'spn-result-elemet l-text']], i: np })
              });
            }
          }});
        }
      }, this.sform);

      f.listener('click', function() {
        f.ce({c: searchProductName.cname, ach: searchProductName[searchProductName.spn.toLowerCase() + 'View'](event.target.data)});
        searchProductName.sform.value = '';
        searchProductName.cresult.classList.remove('active');
        searchProductName.cresult.style.display = 'none';
        searchProductName.products();
      }, this.cresult);

      f.listener('click', function() {
        var t = event.target;
        if ( t.classList.contains('spn-element-button') )  searchProductName.cname.removeChild(t.parentElement);
        searchProductName.products();
      }, this.cname);
      searchProductName.products();
    }
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
          a: [[, 'wnw-container']],
          ach: [
            f.ce({a: [[, 'wnw-dark']]}),
            f.ce({
              a: [[, 'wnw-content']],
              ach: f.ce({
                c: 'form',
                a: [['action'], ['enctype', 'multipart/form-data'], ['method', 'post'], ['autocomplete', 'off']],
                ach: [
                  f.ce({
                    a: [[, 'wnw-head']],
                    ach: [
                      f.ce({a: [[, 'wnw-title']], i: data.wnwTitle || 'Окно'}),
                      f.ce({a: [[, 'wnw-close']]})
                    ]
                  }),
                  f.ce({a: [[, 'wnw-body']]}),
                  f.ce({a: [[, 'wnw-footer']]})
                ]
              })
            })
          ]
        })
      });

      f.ce({c: pel, ach: wnwDocument});

      for (var d in data) {

        if (data[d].type == 'text') {
          f.ce({
            c: f.gel('.wnw-body'),
            ach: f.ce({c: 'input', a: [[, 'form-input'], ['name', data[d].name], ['value', data[d].value || ''], ['type', 'text'], ['placeholder', data[d].placeholder]]})
          });
        }

        if (d == 'spn') {
          f.ce({
            c: f.gel('.wnw-body'),
            ach: f.ce({
              a: [[, 'spn-container']],
              ach: [
                f.ce({a: [[, 'spn-title']], i: data[d].title}),
                f.ce({a: [[, 'spn-name-container']], ach: function() {
                  if (!!data[d].prd) {
                    var prdView = document.createDocumentFragment();
                    for (var i = 0; i < data[d].prd.length; i++)
                      f.ce({c: prdView, ach: searchProductName[data[d].name.toLowerCase() + 'View'](data[d].prd[i])});
                    return prdView;
                  }
                }()}),
                f.ce({
                  a: [[, 'spn-search-form']],
                  ach: f.ce({c: 'input', a: [[, 'form-input'], ['type', 'text'], ['name', data[d].name], ['maxlength', '50'], ['placeholder', data[d].placeholder]]})
                }),
                f.ce({a: [[, 'spn-result-container']]}),
                f.ce({
                  a: [[, 'spn-send']],
                  ach: f.ce({c: 'input', a: [['type', 'hidden'], ['name', 'products']]})
                })
              ]
            })
          });
          searchProductName.run();
        }

        if (d == 'textarea') {
          f.ce({
            c: f.gel('.wnw-body'),
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
            c: f.gel('.wnw-body'),
            ach: [f.ce({c: 'select', a: [[, 'form-input'], ['name', data[d].name]], ach: selOpt})]
          });
        }

        if (d == 'file') {
          f.ce({
            c: f.gel('.wnw-body'),
            ach: data[d].elm
          });
        }

        if (d == 'cancle') {
          f.ce({
            c: f.gel('.wnw-footer'),
            ach: f.ce({a: [[, 'wnw-cancle']], ach: f.ce({c: 'button', a: [['type', 'button']], i: data.cancle})})
          });
        }

        if (d == 'send') {
          f.ce({
            c: f.gel('.wnw-footer'),
            ach: f.ce({a: [[, 'wnw-add']], ach: f.ce({c: 'button', a: [['type', 'submit'], ['name', data.send.name], ['value', data.send.value || '']], i: data.send.text})})
          });
        }

        if (data[d].callback) {
          data[d].callback();
        }
      }

      f.listener('click', function() {
        var t = event.target, ct = event.currentTarget;

        if ( t.classList.contains('wnw-dark') || t.classList.contains('wnw-close') || t.parentElement.classList.contains('wnw-cancle') ) ct.parentElement.removeChild(ct);
      }, f.gel('.wnw-container'));
    }
  }

  var sound = {
    elm: undefined,
    aud: new Audio(),
    path: '/public/song/',
    initiality: function(t) {
      if (t !== this.elm) {
        this.reset_elem();
        this.elm = t;
        this.aud.src = this.path  + t.src + '.mp3';
        this.windowTitle(t);
        f.gel('.jp-progress', t).hidden = !1;
      };
    },
    reset_elem: function() {
      if(!this.elm) return;
      this.elm.style.backgroundColor = '';
      this.elm.classList.remove('active');
      this.elm.classList.remove('paused');
      f.gel('.jp-progress', this.elm).hidden = !0;
      f.gel('.jp-play-bar', this.elm).style.width = '';
      f.gel('.song-control', this.elm).classList.remove('pause-btn');
      f.gel('.song-control', this.elm).classList.add('play-btn');
    },
    play: function() {
      this.aud.play();
    },
    pause: function() {
      this.aud.pause();
    },
    windowTitle: function(i) {
      var title = f.gel('.song-link', i).innerHTML;
      if (!title) return;
      f.gel('title').innerHTML = title;
    },
    jplayer: function() {
      var sngItem = f.gel('.song-item');

      if (sngItem == false) return;

      if (sngItem.length === undefined) sngItem = [sngItem];

      for (var i = 0; i < sngItem.length; i++) {
        f.listener('click', function(t) {
          var pt = event.currentTarget;
          pt.src = pt.dataset.name;

          if (t.classList.contains('song-control')) {
            var sf = f.gel('.song-control', pt);

            if (!pt.classList.contains('active')) {
              pt.style.backgroundColor = '#efeff2';
              pt.classList.add('active');
              sound.initiality(pt);
            } else if(pt.classList.contains('active')) {
              pt.classList.add('paused');
            }

            if (sf.classList.contains('play-btn')) {
              pt.classList.remove('paused');
              sound.play();
            } else if (sf.classList.contains('pause-btn')) {
              sound.pause();
            }
          }
        }, sngItem[i]);

        f.listener('click', function(t){
          if(!sound.aud.duration) return;
          sound.aud.currentTime = sound.aud.duration * event.offsetX / event.currentTarget.offsetWidth;
          f.gel('.jp-play-bar', sound.elm).style.width = event.offsetX + 'px';
        }, f.gel('.jp-seek-bar', sngItem[i]));
      }
    },
    run: function() {
      f.listener('ended', function() {
        if (!sound.elm.nextElementSibling) return;
        f.gel('.play-btn', sound.elm.nextElementSibling).click();
      }, this.aud);
      f.listener('error', function() {
        alert('Нет подключения к Интернету');
      }, this.aud);
      f.listener('play', function() {
        var el = f.gel('.song-control', sound.elm).classList;
        el.add('pause-btn');
        el.remove('play-btn');
      }, this.aud);
      f.listener('pause', function() {
        var el = f.gel('.song-control', sound.elm).classList;
        el.add('play-btn');
        el.remove('pause-btn');
      }, this.aud);
      f.listener('timeupdate', function(e) {
        f.gel('.jp-play-bar', sound.elm).style.width = e.currentTime * 100 / e.duration + '%';
      }, this.aud);
    }
  };

  var psng = {
    sng: undefined,
    creatPageSong: function(cntElm) {
      var sng = this.sng;
      var songFrag = document.createDocumentFragment();
      for (var i = 0; i < sng.length; i++) {
        var sng_art = '';
        for (j = 0; j < sng[i]['SNG_ART'].length; j++) {
          sng_art += sng[i]['SNG_ART'][j]['ART_NAME'] + (j + 1 !== sng[i]['SNG_ART'].length ? ', ' : '' );
        }
        sng[i]['SNG_ART_DEF'] != '' ? sng_art += ' & ' + sng[i]['SNG_ART_DEF'] : '';

        f.ce({
          c: songFrag,
          ach: f.ce({
            d: sng[i],
            a: [[, 'song-item'], ['data-name', sng[i]['SNG_HREF']]],
            ach: [
              f.ce({a: [[, 'song-control play-btn']]}),
              f.ce({a: [[, 'name-song']], i: sng[i]['SNG_TITLE'] + ' – ' + sng_art}),
              f.ce({
                a: [[, 'params-song clearfix']],
                ach: [
                  f.ce({c: 'span', a: [[, 'time']], i: sng[i]['SNG_TIME']}),
                  f.ce({c: 'span', a: [[, 'size']], i: sng[i]['SNG_SIZE'] + ' МБ'}),
                  f.ce({ c: 'span', a: [[, 'date']], i: sng[i]['SNG_DATE']})
                ]
              }),
              f.ce({a: [[, 's-edit-btn']]}),
              f.ce({a: [[, 'delete-btn']]}),
              f.ce({
                a: [[, 'jp-progress'], ['hidden']],
                ach: f.ce({
                  a: [[, 'jp-seek-bar']],
                  ach: f.ce({a: [[, 'jp-play-bar']]})
                })
              })
            ]
          })
        })
      }

      var sngCnt = f.ce({a: [[, 'song-content']]});
      f.listener('click', function() {
        var t = event.target;
        var data = t.parentElement.data;
        if ( t.classList.contains('delete-btn') ) {
          if (confirm('Удалить музыку?')) {
            f.req({fl: '/panel/ajax', d: 'METHOD=REMOVE_SONG&ID=' + data.SNG_ID, f: function(r, el) {
              if (r.result === 'true') {
                el.parentElement.removeChild(el);
                alert('Успешно удалено!');
              } else if(r.result === 'false') alert('Ошибка!');
            }, p: t.parentElement});
          }
        } else if ( t.classList.contains('s-edit-btn') ) {
          wnw.run(f.gel('.page_content'), {
            wnwTitle: 'Редактировать музыку',
            name: {name: 'name', value: data.SNG_TITLE, placeholder: 'Имя Трек', type: 'text'},
            spn: {name: 'ARTIST', title: 'Добавить исполнитель', placeholder: 'Ищите исполнителья здесь', prd: data.SNG_ART},
            artDef: {name: 'art_def', value: data.SNG_ART_DEF, placeholder: 'Доп. исполнитель', type: 'text'},
            file: {
              elm: function() {
                return f.ce({
                  a: [[, 'form-file']],
                  ach: [
                    f.ce({
                      a: [[, 'ff-audio']],
                      ach: f.ce({
                        c: 'audio',
                        a: [['controls'], ['src', '/public/song/' + data.SNG_HREF + '.mp3']]
                      })
                    }),
                    f.ce({
                      c: 'button',
                      a: [[, 'ff-cancle'], ['type', 'button']],
                      i: 'Отменить'
                    }),
                    f.ce({
                      c: 'button',
                      a: [[, 'ff-change'], ['type', 'button']],
                      i: 'Выбрать музыку'
                    }),
                    f.ce({
                      c: 'input',
                      a: [['hidden'], ['name', 'prd'], ['type', 'file'], ['accept', 'audio/*']]
                    }),
                    f.ce({
                      c: 'input',
                      a: [['hidden'], ['name', 'time'], ['type', 'text'], ['value', data.SNG_TIME]]
                    })
                  ]
                });
              }(),
              callback: function() {
                var aud = f.gel('.ff-audio').firstElementChild,
                finp = f.gel('input[name="prd"]'),
                cbtn = f.gel('.ff-cancle'),
                chbtn = f.gel('.ff-change'),
                time = f.gel('input[name="time"]');

                f.listener('click', function() {
                  finp.click();
                }, chbtn);

                f.listener('click', function() {
                  aud.src = '/public/song/' + data.SNG_HREF + '.mp3';
                  finp.value = '';
                }, cbtn)

                f.listener('input', function() {
                  if ( finp.files && finp.files[0] && finp.files[0].type.match('audio/*') ) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                      aud.src = e.target.result;
                      aud.oncanplaythrough = function() {
                        var m = Math.floor( Math.floor( this.duration ) / 60 ) + '',
                        s = Math.floor( this.duration ) % 60 + '';
                        m = m.length == 1 ? '0' + m : m;
                        s = s.length == 1 ? '0' + s : s;
                        time.value = m + ':' + s;
                      };
                    }
                    reader.readAsDataURL(finp.files[0]);
                  }
                }, finp);
              }
            },
            cancle: 'Отменить',
            send: {
              name: 'edit',
              value: data.SNG_ID,
              text: 'Сохранить'
            }
          });
        }
      }, sngCnt);

      var docSngCnt = f.gel('.song-content', cntElm);
      if ( docSngCnt ) cntElm.removeChild(docSngCnt);

      f.ce({c: cntElm, ach: f.ce({c: sngCnt, ach: songFrag})});
      sound.jplayer();
    },
    run: function() {
      if (location.pathname !== "/panel/song") return;

      if (typeof( SNG ) !== 'undefined' && !!SNG) {
        this.sng = SNG;
        this.creatPageSong( f.gel('.page_content') );
      } else return;

      f.listener('input', function() {
        var s = event.currentTarget;
        if (s.value.length > 0) {
          f.req({fl:'/panel/ajax', d:'METHOD=SEARCH_SONG&SEARCH=' + s.value, f: function(r) {
            psng.sng = r.DATA;
            psng.creatPageSong( f.gel('.page_content') );
          }, er: function () {
          }});
        } else if (s.value.length === 0) {
          psng.sng = SNG;
          psng.creatPageSong( f.gel('.page_content') );
        }
      }, f.gel('.psap-search').firstElementChild);

      f.listener('click', function() {
        wnw.run(f.gel('.page_content'), {
          wnwTitle: 'Добавить музыку',
          name: {name: 'name', placeholder: 'Имя Трек', type: 'text'},
          spn: {name: 'ARTIST', title: 'Добавить исполнитель', placeholder: 'Ищите исполнителья здесь'},
          artDef: {name: 'art_def', placeholder: 'Доп. исполнитель', type: 'text'},
          file: {
            elm: function() {
              return f.ce({
                a: [[, 'form-file']],
                ach: [
                  f.ce({
                    a: [[, 'ff-audio']],
                    ach: f.ce({
                      c: 'audio',
                      a: [['controls'], ['src', '']]
                    })
                  }),
                  f.ce({
                    c: 'button',
                    a: [[, 'ff-cancle'], ['type', 'button']],
                    i: 'Отменить'
                  }),
                  f.ce({
                    c: 'button',
                    a: [[, 'ff-change'], ['type', 'button']],
                    i: 'Выбрать музыку'
                  }),
                  f.ce({
                    c: 'input',
                    a: [['hidden'], ['name', 'prd'], ['type', 'file'], ['accept', 'audio/*']]
                  }),
                  f.ce({
                    c: 'input',
                    a: [['hidden'], ['name', 'time'], ['type', 'text']]
                  })
                ]
              });
            }(),
            callback: function() {
              var aud = f.gel('.ff-audio').firstElementChild,
              finp = f.gel('input[name="prd"]'),
              cbtn = f.gel('.ff-cancle'),
              chbtn = f.gel('.ff-change'),
              time = f.gel('input[name="time"]');

              f.listener('click', function() {
                finp.click();
              }, chbtn);

              f.listener('click', function() {
                time.value = '';
                aud.src = '';
                finp.value = '';
              }, cbtn)

              f.listener('input', function() {
                if ( finp.files && finp.files[0] && finp.files[0].type.match('audio/*') ) {
                  var reader = new FileReader();
                  reader.onload = function (e) {
                    aud.src = e.target.result;
                    aud.oncanplaythrough = function() {
                      var m = Math.floor( Math.floor( this.duration ) / 60 ) + '',
                      s = Math.floor( this.duration ) % 60 + '';
                      m = m.length == 1 ? '0' + m : m;
                      s = s.length == 1 ? '0' + s : s;
                      time.value = m + ':' + s;
                    };
                  }
                  reader.readAsDataURL(finp.files[0]);
                }
              }, finp);
            }
          },
          cancle: 'Отменить',
          send: {
            name: 'add',
            text: 'Добавить'
          }
        });
      }, f.gel('.psap-add'));

      sound.run();
    }
  };
  psng.run();

  var part = {
    art: undefined,
    creatPageArtist: function(cntElm) {
      var art = this.art,
      artFrag = document.createDocumentFragment();

      for (var i = 0; i < art.length; i++) {
        f.ce({
          c: artFrag,
          ach: f.ce({
            d: art[i],
            a: [[, 'artist-item']],
            ach: [
              f.ce({
                a: [[, 'a-i-picture']],
                ach: [
                  f.ce({c: 'img', a: [['src', '/public/img/artists/' + art[i].ART_PICTURE], ['title', art[i].ART_NAME]]
                  }),
                  f.ce({a: [[, 'ap-edit-btn']]})
                ]
              }),
              f.ce({
                a: [[, 'a-i-name']],
                ach: [
                  f.ce({a: [[, 'a-i-n-artist l-text']], i: art[i].ART_NAME}),
                  f.ce({a: [[, 'a-i-n-fans l-text']], i: art[i].ART_RANK + ' поклонников'})
                ]
              })
            ]
          })
        });
      }

      var artCnt = f.ce({a: [[, 'artist-content']]});
      f.listener('click', function() {
        var t = event.target;
        var data = t.parentElement.parentElement.data;
        if ( t.classList.contains('ap-edit-btn') ) {
          wnw.run(f.gel('.page_content'), {
            wnwTitle: 'Редактировать артиста',
            name: {name: 'name', value: data.ART_NAME, type: 'text'},
            textarea: {name: 'info', text: data.ART_INFO},
            select: {name: 'genre', title: 'Жанр', option: ['ПОП-МУЗЫКА', 'РЭП', 'КЛАССИЧЕСКАЯ МУЗЫКА'], select: data.ART_GENRE},
            file: {
              elm: function() {
                return f.ce({
                  a: [[, 'form-file']],
                  ach: [
                    f.ce({
                      a: [[, 'ff-img']],
                      ach: f.ce({
                        c: 'img',
                        a: [['title', 'Изменить'], ['src', '/public/img/artists/' + data.ART_PICTURE]]
                      })
                    }),
                    f.ce({
                      c: 'button',
                      a: [[, 'ff-cancle'], ['type', 'button']],
                      i: 'Отменить'
                    }),
                    f.ce({
                      c: 'button',
                      a: [[, 'ff-delete'], ['type', 'button']],
                      i: 'Удалить'
                    }),
                    f.ce({
                      c: 'input',
                      a: [['hidden'], ['name', 'prd'], ['type', 'file'], ['accept', 'image/*']]
                    }),
                    f.ce({
                      c: 'input',
                      a: [['type', 'hidden'], ['name', 'delete'], ['value', '0']]
                    })
                  ]
                });
              }(),
              callback: function() {
                var img = f.gel('.ff-img').firstElementChild,
                finp = f.gel('input[name="prd"]'),
                dinp = f.gel('input[name="delete"]'),
                cbtn = f.gel('.ff-cancle'),
                dbtn = f.gel('.ff-delete');

                f.listener('click', function() {
                  finp.click();
                }, img);

                f.listener('click', function() {
                  img.src = '/public/img/artists/' + data.ART_PICTURE;
                  dinp.value = 0;
                  finp.value = '';
                }, cbtn)

                f.listener('click', function() {
                  img.src = '/public/img/artists/unknown-artist.jpg';
                  dinp.value = 1;
                  finp.value = '';
                }, dbtn)

                f.listener('input', function() {
                  if ( finp.files && finp.files[0] && finp.files[0].type.match('image.*') ) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                      img.src = e.target.result;
                    }
                    reader.readAsDataURL(finp.files[0]);
                  }
                }, finp);
              }
            },
            cancle: 'Отменить',
            send: {name: 'edit', value: data.ART_ID, text: 'Сохранить'}
          });
        }
      }, artCnt);

      var docArtCnt = f.gel('.artist-content', cntElm);
      if ( !!docArtCnt ) cntElm.removeChild(docArtCnt);

      f.ce({c: cntElm, ach: f.ce({c: artCnt, ach: artFrag})});
    },
    run: function() {
      if (location.pathname !== "/panel/artist") return;

      if (typeof( ART ) !== 'undefined' && !!ART) {
        this.art = ART;
        this.creatPageArtist( f.gel('.page_content') );
      } else return;

      f.listener('input', function() {
        var s = event.currentTarget;
        if (s.value.length > 0) {
          f.req({fl:'/panel/ajax', d:'METHOD=SEARCH_ARTIST&SEARCH=' + s.value, f: function(r) {
            part.art = r.DATA;
            part.creatPageArtist( f.gel('.page_content') );
          }});
        } else if (s.value.length === 0) {
          part.art = ART;
          part.creatPageArtist( f.gel('.page_content') );
        }
      }, f.gel('.psap-search').firstElementChild);

      f.listener('click', function() {
        wnw.run(f.gel('.page_content'), {
          wnwTitle: 'Добавить артиста',
          name: {name: 'name', placeholder: 'Имя Артиста', type: 'text'},
          textarea: {name: 'info', placeholder: 'Ввести описание (по желанию)'},
          select: {name: 'genre', title: 'Жанр', option: ['ПОП-МУЗЫКА', 'РЭП', 'КЛАССИЧЕСКАЯ МУЗЫКА']},
          file: {
            elm: function() {
              return f.ce({
                a: [[, 'form-file']],
                ach: [
                  f.ce({
                    a: [[, 'ff-img']],
                    ach: f.ce({
                      c: 'img',
                      a: [['title', 'Изменить'], ['src', '/public/img/artists/unknown-artist.jpg']]
                    })
                  }),
                  f.ce({
                    c: 'button',
                    a: [[, 'ff-cancle'], ['type', 'button']],
                    i: 'Отменить'
                  }),
                  f.ce({
                    c: 'button',
                    a: [[, 'ff-delete'], ['type', 'button']],
                    i: 'Удалить'
                  }),
                  f.ce({
                    c: 'input',
                    a: [['hidden'], ['name', 'prd'], ['type', 'file'], ['accept', 'image/*']]
                  }),
                  f.ce({
                    c: 'input',
                    a: [['type', 'hidden'], ['name', 'delete'], ['value', '0']]
                  })
                ]
              });
            }(),
            callback: function() {
              var img = f.gel('.ff-img').firstElementChild,
              finp = f.gel('input[name="prd"]'),
              dinp = f.gel('input[name="delete"]'),
              cbtn = f.gel('.ff-cancle'),
              dbtn = f.gel('.ff-delete');

              f.listener('click', function() {
                finp.click();
              }, img);

              f.listener('click', function() {
                img.src = '/public/img/artists/unknown-artist.jpg';
                dinp.value = 0;
                finp.value = '';
              }, cbtn)

              f.listener('click', function() {
                img.src = '/public/img/artists/unknown-artist.jpg';
                dinp.value = 1;
                finp.value = '';
              }, dbtn)

              f.listener('input', function() {
                if ( finp.files && finp.files[0] && finp.files[0].type.match('image.*') ) {
                  var reader = new FileReader();
                  reader.onload = function (e) {
                    img.src = e.target.result;
                  }
                  reader.readAsDataURL(finp.files[0]);
                }
              }, finp);
            }
          },
          cancle: 'Отменить',
          send: {name: 'add', text: 'Добавить'}
        });
      }, f.gel('.psap-add'));

    }
  };
  part.run();

  var pply = {
    ply: undefined,
    creatPagePlaylist: function(cntElm) {
      var ply = this.ply,
      plyFrag = document.createDocumentFragment();

      for (var i = 0; i < ply.length; i++) {
        f.ce({
          c: plyFrag,
          ach: f.ce({
            d: ply[i],
            a: [[, 'playlist-item']],
            ach: [
              f.ce({
                a: [[, 'pi-picture']],
                ach: [
                  f.ce({
                    c: 'img',
                    a: [['src', '/public/img/playlists/' + ply[i].PLY_PICTURE], ['title', 'Премьера']]
                  }),
                  f.ce({a: [[, 'ap-edit-btn']]})
                ]
              }),
              f.ce({
                a: [[, 'pi-name']],
                ach: [
                  f.ce({
                    a: [[, 'pin-playlist l-text']],
                    ach: f.ce({
                      i: ply[i].PLY_TITLE
                    })
                  }),
                  f.ce({
                    a: [[, 'pin-songs l-text']],
                    i: ply[i].PLY_SONGS.length + ' треков – 0 поклонник'
                  })
                ]
              })
            ]
          })
        })
      }

      var plyCnt = f.ce({a: [[, 'playlist-content']]});
      f.listener('click', function() {
        var t = event.target;
        var data = t.parentElement.parentElement.data;
        if ( t.classList.contains('ap-edit-btn') ) {
          wnw.run(f.gel('.page_content'), {
            wnwTitle: 'Редактировать плейлист',
            name: {name: 'name', value: data.PLY_TITLE, placeholder: 'Название плейлиста', type: 'text'},
            textarea: {name: 'info', text: data.PLY_DESCRIPTION, placeholder: 'Ввести описание (по желанию)'},
            file: {
              elm: function() {
                return f.ce({
                  a: [[, 'form-file']],
                  ach: [
                    f.ce({
                      a: [[, 'ff-img']],
                      ach: f.ce({
                        c: 'img',
                        a: [['title', 'Изменить'], ['src', '/public/img/playlists/' + data.PLY_PICTURE]]
                      })
                    }),
                    f.ce({
                      c: 'button',
                      a: [[, 'ff-cancle'], ['type', 'button']],
                      i: 'Отменить'
                    }),
                    f.ce({
                      c: 'button',
                      a: [[, 'ff-delete'], ['type', 'button']],
                      i: 'Удалить'
                    }),
                    f.ce({
                      c: 'input',
                      a: [['hidden'], ['name', 'prd'], ['type', 'file'], ['accept', 'image/*']]
                    }),
                    f.ce({
                      c: 'input',
                      a: [['type', 'hidden'], ['name', 'delete'], ['value', '0']]
                    })
                  ]
                });
              }(),
              callback: function() {
                var img = f.gel('.ff-img').firstElementChild,
                finp = f.gel('input[name="prd"]'),
                dinp = f.gel('input[name="delete"]'),
                cbtn = f.gel('.ff-cancle'),
                dbtn = f.gel('.ff-delete');

                f.listener('click', function() {
                  finp.click();
                }, img);

                f.listener('click', function() {
                  img.src = '/public/img/playlists/' + data.PLY_PICTURE;
                  dinp.value = 0;
                  finp.value = '';
                }, cbtn)

                f.listener('click', function() {
                  img.src = '/public/img/artists/unknown-artist.jpg';
                  dinp.value = 1;
                  finp.value = '';
                }, dbtn)

                f.listener('input', function() {
                  if ( finp.files && finp.files[0] && finp.files[0].type.match('image.*') ) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                      img.src = e.target.result;
                    }
                    reader.readAsDataURL(finp.files[0]);
                  }
                }, finp);
              }
            },
            spn: {name: 'SONG', title: 'Добавить исполнитель', placeholder: 'Ищите исполнителья здесь', prd: data.PLY_SONGS},
            cancle: 'Отменить',
            send: {
              name: 'edit',
              value: data.PLY_ID,
              text: 'Сохранить'
            }
          });
        }
      }, plyCnt);

      var docPlyCnt = f.gel('.playlist-content', cntElm);
      if ( !!docPlyCnt ) cntElm.removeChild(docPlyCnt);

      f.ce({c: cntElm, ach: f.ce({c: plyCnt, ach: plyFrag})});
    },
    run: function() {
      if (location.pathname !== "/panel/playlist") return;

      if (typeof( PLY ) !== 'undefined' && !!PLY) {
        this.ply = PLY;
        this.creatPagePlaylist( f.gel('.page_content') );
      } else return;

      f.listener('input', function() {
        var s = event.currentTarget;
        if (s.value.length > 0) {
          f.req({fl:'/panel/ajax', d:'METHOD=SEARCH_PLAYLIST&SEARCH=' + s.value, f: function(r) {
            pply.ply = r.DATA;
            pply.creatPagePlaylist( f.gel('.page_content') );
          }});
        } else if (s.value.length === 0) {
          pply.ply = PLY;
          pply.creatPagePlaylist( f.gel('.page_content') );
        }
      }, f.gel('.psap-search').firstElementChild);

      f.listener('click', function() {
        wnw.run(f.gel('.page_content'), {
          wnwTitle: 'Добавить плейлист',
          name: {name: 'name', placeholder: 'Название плейлиста', type: 'text'},
          textarea: {name: 'info', placeholder: 'Ввести описание (по желанию)'},
          foto: {type: 'title', text: 'Фотография'},
          file: {
            elm: function() {
              return f.ce({
                a: [[, 'form-file']],
                ach: [
                  f.ce({
                    a: [[, 'ff-img']],
                    ach: f.ce({
                      c: 'img',
                      a: [['title', 'Изменить'], ['src', '/public/img/artists/unknown-artist.jpg']]
                    })
                  }),
                  f.ce({
                    c: 'button',
                    a: [[, 'ff-cancle'], ['type', 'button']],
                    i: 'Отменить'
                  }),
                  f.ce({
                    c: 'button',
                    a: [[, 'ff-delete'], ['type', 'button']],
                    i: 'Удалить'
                  }),
                  f.ce({
                    c: 'input',
                    a: [['hidden'], ['name', 'prd'], ['type', 'file'], ['accept', 'image/*']]
                  }),
                  f.ce({
                    c: 'input',
                    a: [['type', 'hidden'], ['name', 'delete'], ['value', '0']]
                  })
                ]
              });
            }(),
            callback: function() {
              var img = f.gel('.ff-img').firstElementChild,
              finp = f.gel('input[name="prd"]'),
              dinp = f.gel('input[name="delete"]'),
              cbtn = f.gel('.ff-cancle'),
              dbtn = f.gel('.ff-delete');

              f.listener('click', function() {
                finp.click();
              }, img);

              f.listener('click', function() {
                img.src = '/public/img/artists/unknown-artist.jpg';
                dinp.value = 0;
                finp.value = '';
              }, cbtn)

              f.listener('click', function() {
                img.src = '/public/img/artists/unknown-artist.jpg';
                dinp.value = 1;
                finp.value = '';
              }, dbtn)

              f.listener('input', function() {
                if ( finp.files && finp.files[0] && finp.files[0].type.match('image.*') ) {
                  var reader = new FileReader();
                  reader.onload = function (e) {
                    img.src = e.target.result;
                  }
                  reader.readAsDataURL(finp.files[0]);
                }
              }, finp);
            }
          },
          spn: {name: 'SONG', title: 'Добавить музыку', placeholder: 'Ищите исполнителья здесь'},
          cancle: 'Отменить',
          send: {
            name: 'add',
            text: 'Добавить'
          }
        });
      }, f.gel('.psap-add'));
    }
  };
  pply.run();

  var pupsng = {
    sng: undefined,
    creatPageModeration: function( cntElm ) {
      var sng = this.sng;
      var songFrag = document.createDocumentFragment();
      for (var i = 0; i < sng.length; i++) {
        f.ce({
          c: songFrag,
          ach: f.ce({
            d: sng[i],
            a: [[, 'song-item'], ['data-name', sng[i]['SNG_HREF']]],
            ach: [
              f.ce({a: [[, 'song-control play-btn']]}),
              f.ce({a: [[, 'name-song']], i: sng[i]['SNG_TITLE']}),
              f.ce({
                a: [[, 'params-song clearfix']],
                ach: [
                  f.ce({c: 'span', a: [[, 'time']], i: sng[i]['SNG_TIME']}),
                  f.ce({c: 'span', a: [[, 'size']], i: sng[i]['SNG_SIZE'] + ' МБ'}),
                  f.ce({ c: 'span', a: [[, 'date']], i: sng[i]['SNG_DATE']})
                ]
              }),
              f.ce({a: [[, 's-edit-btn']]}),
              f.ce({a: [[, 'delete-btn']]}),
              f.ce({
                a: [[, 'jp-progress'], ['hidden']],
                ach: f.ce({
                  a: [[, 'jp-seek-bar']],
                  ach: f.ce({a: [[, 'jp-play-bar']]})
                })
              })
            ]
          })
        });
      }

      var sngCnt = f.ce({a: [[, 'song-content']]});
      f.listener('click', function() {
        var t = event.target;
        var data = t.parentElement.data;
        if ( t.classList.contains('delete-btn') ) {
          if (confirm('Удалить музыку?')) {
            f.req({fl: '/panel/ajax', d: 'METHOD=DISAPPROVE_UPSONG&ID=' + data.SNG_ID, f: function(r, el) {
              if (r.result === 'true') {
                el.parentElement.removeChild(el);
                alert('Успешно удалено!');
              } else if(r.result === 'false') alert('Ошибка!');
            }, p: t.parentElement});
          }
        } else if ( t.classList.contains('s-edit-btn') ) {
          wnw.run(f.gel('.page_content'), {
            wnwTitle: 'Mодерировать музыку',
            name: {name: 'name', value: data.SNG_TITLE, placeholder: 'Имя Трек', type: 'text'},
            spn: {name: 'ARTIST', title: 'Добавить исполнитель', placeholder: 'Ищите исполнителья здесь', prd: false},
            artDef: {name: 'art_def', value: data.SNG_ART_DEF, placeholder: 'Доп. исполнитель', type: 'text'},
            file: {
              elm: function() {
                return f.ce({
                  a: [[, 'form-file']],
                  ach: [
                    f.ce({
                      a: [[, 'ff-audio']],
                      ach: f.ce({
                        c: 'audio',
                        a: [['controls'], ['src', '/public/upload/song/' + data.SNG_HREF + '.mp3']]
                      })
                    }),
                    f.ce({
                      c: 'input',
                      a: [['hidden'], ['name', 'time'], ['type', 'text'], ['value', data.SNG_TIME]]
                    }),
                    f.ce({
                      c: 'input',
                      a: [['hidden'], ['name', 'size'], ['type', 'text'], ['value', data.SNG_SIZE]]
                    }),
                    f.ce({
                      c: 'input',
                      a: [['hidden'], ['name', 'date'], ['type', 'text'], ['value', data.SNG_DATE]]
                    }),
                    f.ce({
                      c: 'input',
                      a: [['hidden'], ['name', 'href'], ['type', 'text'], ['value', data.SNG_HREF]]
                    })
                  ]
                });
              }(),
              callback: function() {
                var aud = f.gel('.ff-audio').firstElementChild,
                finp = f.gel('input[name="prd"]'),
                time = f.gel('input[name="time"]');

                f.listener('input', function() {
                  if ( finp.files && finp.files[0] && finp.files[0].type.match('audio/*') ) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                      aud.src = e.target.result;
                      aud.oncanplaythrough = function() {
                        var m = Math.floor( Math.floor( this.duration ) / 60 ) + '',
                        s = Math.floor( this.duration ) % 60 + '';
                        m = m.length == 1 ? '0' + m : m;
                        s = s.length == 1 ? '0' + s : s;
                        time.value = m + ':' + s;
                      };
                    }
                    reader.readAsDataURL(finp.files[0]);
                  }
                }, finp);
              }
            },
            cancle: 'Отменить',
            send: {
              name: 'approve',
              value: data.SNG_ID,
              text: 'Oдобрить'
            }
          });
        }
      }, sngCnt);

      var docSngCnt = f.gel('.song-content', cntElm);
      if ( docSngCnt ) cntElm.removeChild(docSngCnt);

      f.ce({c: cntElm, ach: f.ce({c: sngCnt, ach: songFrag})});
      sound.path = '/public/upload/song/';
      sound.jplayer();
    },
    run: function() {
      if (location.pathname !== "/panel/moderation") return;

      if (typeof( UPSNG ) !== 'undefined' && !!UPSNG) {
        this.sng = UPSNG;
        this.creatPageModeration( f.gel('.page_content') );
      } else return;

      sound.run();
    }
  }
  pupsng.run();
};
