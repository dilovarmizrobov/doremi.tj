<div class="page-main">
  <div class="page-account">
    <h1 class="ac-tl">Мои личные данные</h1>
    <form name="changeForm" method="post" autocomplete="off">
      <div class="clearfix">
        <div class="ac-row-img">
          <img class="account-img" src=<?echo '/public/img/users/'. $user['PICTURE']?> alt="User picture">
          <div class="ac-edit-info account-change-img">Изменить</div>
          <input hidden type="file" name="img" accept="image/*">
        </div>
        <div class="ac-row-text">
          <h2 class="ac-txt-tl">Войти</h2>
          <div>
            <span>Логин | <span class="ac-edit-info ac-edit-login">Редактировать</span></span>
            <input disabled class="upf-input" value=<? echo $user['LOGIN']; ?> type="text" name="login" maxlength="50">
          </div>
          <div>
            <span>Пароль | <span class="ac-edit-info ac-edit-password">Редактировать</span></span>
            <input disabled class="upf-input" type="password" name="password" maxlength="15" placeholder="******">
          </div>
          <h2 class="ac-txt-tl">Почта</h2>
          <div>
            <span>Электронный адрес | <span class="ac-edit-info ac-edit-email">Редактировать</span></span>
            <input disabled class="upf-input" type="text" name="email" maxlength="50" placeholder=<? echo $user['EMAIL']?>>
          </div>
          <h2 class="ac-txt-tl">Личные данные</h2>
          <div>
            <span>Пол:</span>
            <select class="account-select" name="gender">
            <?
              if ($user['GENDER'] === 'M') {
                echo '<option selected value="M">Муж.</option>';
                echo '<option value="W">Жен.</option>';
              } else {
                echo '<option value="M">Муж.</option>';
                echo '<option selected value="W">Жен.</option>';
              }

            ?>
            </select>
          </div>
          <div>
            <span>Возраст:</span>
            <select class="account-select" name="age">
            <? for ($i=10; $i <= 60 ; $i++) {
                if ($i == $user['AGE']) {
                  echo '<option selected value="' . $i . '">' . $i . '</option>';
                } else {
                  echo '<option value="' . $i . '">' . $i . '</option>';
                }
             }
            ?>
            </select>
          </div>
          <button class="account-add" type="submit" name="edit_data" value="">Сохранить</button>
        </div>
        <form method="post">
          <button class="account-delete" type="submit" name="delete">
            Удалить мой аккаунт
          </button>
        </form>
      </div>
    </form>
  </div>
</div>
