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
      left: 50%;
      width: 320px;
      margin-left: -160px;
      margin-bottom: 20px;
      text-align: center;
    }
    .logo{
      cursor: pointer;
      font-size: 60px;
      margin-bottom: 20px;
    }
    .logo >a{
      color: #ffffff;
      text-decoration: none;
    }
    ul{
      list-style: none;
      margin: 0px;
      padding: 0px;
    }
    input{
      font-family: Arial,sans-serif;
      border: 0px;
      font-size: 14px;
      font-style: italic;
      line-height: 24px;
      padding: 10px;
      border-bottom: 1px solid #cec6c6;
      width: 300px;
    }
    select{
      width: 160px;
      height: 45px;
      padding: 0 10px;
      margin: 0px;
      border: 0px;
      font-size: 14px;
      font-style: italic;
    }
    select:first-child{
      border-right: 1px solid #cec6c6;
    }
    button{
      width: 100%;
      margin-top: 20px;
      line-height: 35px;
      font-size: 20px;
      border: 0px;
      cursor: pointer;
      transition-duration: .15s;
      transition-property: background-color, color;
      background-color: #ddd;
      border-radius: 3px;
    }
    button:hover{
      background-color: #191922;
      color: #fff;
    }
    .form-error{
      margin: 5px;
      color: #fff;
    }
    @media screen and (max-width : 768px){
      .container{
        width: 270px;
        margin-left: -135px;
      }
      .logo{
        font-size: 50px;
      }
      input{
        width: 250px;
        height: 15px;
        margin-bottom: 5px;
      }
      select{
        width: 135px;
        height: 35px;
      }
      button{
        font-size: 16px;
        line-height: 30px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo"><a href="/">Doremi</a></div>
    <form name="regform" action="" method="POST" autocomplete="off">
      <ul>
        <li><input style="border-top-left-radius: 3px; border-top-right-radius: 3px;"  placeholder="Электронный адрес" type="email" name="email" maxlength="50" /><div></div></li>
        <li><input placeholder="Логин" type="text" name="login" maxlength="50" /><div></div></li>
        <li><input placeholder="Пароль (не менее 6 символов)" type="password" name="password" maxlength="15" /><div></div</li>
        <li><input placeholder="Пароль (подтверждение)" type="password" name="repaswrd" maxlength="15" /><div></div</li>
        <li>
          <select name="gender">
              <option value="0">Пол</option>
              <option  value="W">Жен.</option>
              <option  value="M">Муж.</option>
          </select><select name="age">
            <option value="0">Возраст</option>
            <?
              for ($i=10; $i <= 60 ; $i++)
                echo '<option value="' . $i . '">' . $i . '</option>';
            ?>
          </select>
          <div></div>
        </li>
        <li>
          <button name="reg" type="submit">Регистрация</button>
        </li>
      </ul>
    </form>
  </div>
  <script src="/public/js/validate.js" type="text/javascript"></script>
</body>
</html>
