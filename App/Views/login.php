<!DOCTYPE html>
<html lang="ru-RU">
<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport" />
  <title>Doremi</title>
  <link rel="shortcut icon" href="/public/img/favicon.ico">
  <style>
    body{
      background-color: #23232c;
    }
    .container{
      position: absolute;
      margin-top: -110px;
      margin-left: -160px;
      top: 45%;
      left: 50%;
      width: 320px;
    }
    .logo{
      text-align: center;
      font-size: 60px;
      margin-bottom: 20px;
    }
    .logo >a{
      color: #fff;
      text-decoration: none;
    }
    ul{
      list-style: none;
      margin: 0px;
      padding: 0px;
    }
    input{
      font-family: Arial, sans-serif;
      border: 0px;
      font-size: 16px;
      font-style: italic;
      line-height: 24px;
      padding: 10px;
      width: 300px;
      border-bottom: 1px solid #cec6c6;
    }
    button{
      font-size: 15px;
      cursor: pointer;
      border: 0px;
      padding: 0;
    }
    li > a, button{
      display: inline-block;
      color: #000;
      margin-top: 15px;
      width: 158px;
      transition-duration: .15s;
      transition-property: background-color, color;
      background-color: #fff;
      border-radius: 3px;
      text-decoration: none;
      text-align: center;
      line-height: 35px;
    }
    li > a:hover, button:hover{
      background-color: #191922;
      color: #fff;
    }
    @media screen and (max-width : 768px){
      .container{
        margin-left: -135px;
        width: 270px;
      }
      .logo{
        font-size: 50px;
      }
      input{
        width: 250px;
        height: 15px;
        margin-bottom: 5px;
      }
      li > a, button{
        line-height: 30px;
        width: 133px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo"><a href="/">Doremi</a></div>
    <form action="" method="POST" autocomplete="off">
      <ul>
        <li><input style="border-top-left-radius: 3px; border-top-right-radius: 3px;" name="login" type="text" placeholder="Логин" maxlength="50"></li>
        <li><input name="password" type="password" placeholder="Пароль" maxlength="15"></li>
        <li>
          <a href="#">Забыли пароль?</a>
          <button name="logined" type="submit">Войти</button>
        </li>
      </ul>
    </form>
  </div>
</body>
</html>
