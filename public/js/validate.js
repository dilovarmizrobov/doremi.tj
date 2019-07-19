var f = (function(){
  function gel(s, e) {
    var el = e ? e.querySelectorAll(s) : document.querySelectorAll(s);
    if (el.length > 1) return el;
    if (el.length == 1) return el[0];
    return false;
  };
  function intitListener(e, f, el){
    if (el === false) return;
    var el = el || document, einf = window.addEventListener ? ['addEventListener', ''] : ['attachEvent', 'on'];
    el[ einf[0] ](einf[1] + e, function(event) {
      event = event || window.event;
      var target = event.target || event.srcElement;
      f(target);
    }, false);
  };
  function RequestAjax(e) {
    if (!e) return;
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
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    request.send(e.d || "");
    request.onreadystatechange = function () {
      if (this.readyState != 4) return;
      if (this.status != 200) {
        alert('Нет подключения к Интернету');
      } else {
        if (this.responseText==='') return;
        if (e.f) e.f( JSON.parse(this.responseText), e.p );
      }
    }
  };
  return {
    gel: gel,
    listener: intitListener,
    req: RequestAjax
  };
}());

var
rgfrm = f.gel('form[name="regform"]'),
vform = {
  felm:
  [
    {
      input: 'email',
      vfunc: function(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if ( re.test(String(email).toLowerCase()) ) {
          return {er: false, msg: ''};
        } else {
          return {er: true, msg: 'Неверный формат адреса электронной почты.'};
        }
      },
      er: true
    },
    {
      input: 'login',
      vfunc: function(login, t) {
        var re = /^([a-zA-Z0-9])(\w|-|_)+([a-z0-9])$/;
        if ( re.test( String( login ).toLowerCase() ) ) {
          f.req({
            fl:'/register',
            d: 'validate_login=' + login,
            f: vform.validateLogin,
            p: [t, this]
          });
          return {er: false, msg: ''};
        } else {
          if (login.length < 3) {
            return {er: true, msg: 'Имя пользователя должно содержать не менее 3 символов.'};
          } else {
            return {er: true, msg: 'Неверный формат логина.'};
          }
        }
      },
      er: true
    },
    {
      input: 'password',
      vfunc: function(password) {
        if ( password.length > 5 ) {
          return {er: false, msg: ''};
        } else {
          return {er: true, msg: 'Пароль должен содержать не менее 6 символов.'};
        }
      },
      er: true
    },
    {
      input: 'repaswrd',
      vfunc: function(rePassword) {
        var password = f.gel('input[name="password"]').value;
        if (rePassword === password && rePassword.length > 5) {
          return {er: false, msg: ''};
        } else {
          return {er: true, msg: 'Подтверждение не совпадает с паролем.'};
        }
      },
      er: true
    },
    {
      input: 'gender',
      vfunc: function(gender) {
        if ( gender != 0 ) {
          return {er: false, msg: ''};
        } else {
          return {er: true, msg: 'Выберите ваш пол.'};
        }
      },
      er: true
    },
    {
      input: 'age',
      vfunc: function(age) {
        if ( age != 0 ) {
          return {er: false, msg: ''};
        } else {
          return {er: true, msg: 'Выберите ваш возраст.'};
        }
      },
      er: true
    }
  ],
  crErEl: function(t, o) {
    var l = t.parentElement.lastElementChild;
    var v = o.vfunc( t.value, t );
    if ( v.er ) {
      l.classList.add('form-error');
      l.innerHTML = v.msg;
      o.er = true;
    } else {
      l.innerHTML = '';
      l.classList.remove('form-error');
      o.er = false;
    }
  },
  validateLogin: function(d, p) {
    t = p[0];
    o = p[1];
    var l = t.parentElement.lastElementChild;
    if (d.result) {
      l.classList.add('form-error');
      l.innerHTML = 'Этот логин уже занят';
      o.er = true;
    } else {
      l.innerHTML = '';
      l.classList.remove('form-error');
      o.er = false;
    }
  }
};

f.listener('input', function() {
  for (var i = 0; i < vform.felm.length; i++) {
    if (event.target.name === vform.felm[i].input ) {
      vform.crErEl(event.target, vform.felm[i]);
    }
  }
}, rgfrm);

f.listener('submit', function() {
  for (var i = 0; i < vform.felm.length; i++) {
    if (vform.felm[i].er){
      alert('Заполните все поля!')
      event.preventDefault();
      return;
    }
  }
}, rgfrm);
