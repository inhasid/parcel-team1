// TODO:=========================================
// ЗАДАЧА 1

// Якщо імейл і пароль користувача збігаються, зберігай дані з форми при сабміті
// у локальне сховище і змінюй кнопку login на logout і роби поля введення
// недоступними для змін.

// При перезавантаженні сторінки, якщо користувач залогінений, ми маємо бачити logout-кнопку
// та недоступні для зміни поля з даними користувача.
// Клік по кнопці logout повертає все до початкового вигляду і видаляє дані користувача
// З локального сховища.

// Якщо введені дані не збігаються з потрібними даними, викликати аlert і
// повідомляти про помилку.

const USER_DATA = {
  email: "user@mail.com",
  password: "secret",
};

const refs = {
    formElement: document.querySelector('.login-form'),
    btn: document.querySelector('.login-btn'),
    inputLogin: document.querySelector('input[name="email"]'),
    inputPassword: document.querySelector('input[name="password"]'),  
    todo: document.querySelector('.todo'), 
}



const data = {};

refs.formElement.addEventListener('input', onSaveData);
refs.formElement.addEventListener('submit', onSubmit);

function onSaveData(e) {
    const { name, value } = e.target;
    data[name] = value;
    console.log(data);
}

function onSubmit(e) {
    e.preventDefault();
    if (refs.btn.textContent === 'logout') {
        refs.btn.textContent = 'login';
        refs.inputLogin.removeAttribute('readonly');
        refs.inputPassword.removeAttribute('readonly');
        localStorage.removeItem('form-data');
        refs.todo.style.display = 'none';
        return;
    }
    if (!data.email || !data.password) return alert('Fill all fields')
    if (USER_DATA.email !== data.email || USER_DATA.password !== data.password) return alert('Uncorrect data')
    localStorage.setItem('form-data', JSON.stringify(data));
    loginUser();
    e.currentTarget.reset();
}
function populateData() {
    if (localStorage.getItem('form-data')) {
        loginUser();
     }
 }

function loginUser() {
    refs.btn.textContent = 'logout';
    refs.inputLogin.setAttribute('readonly', true);
    refs.inputPassword.setAttribute('readonly', true);
    refs.todo.style.display = 'flex';
}
 

populateData();