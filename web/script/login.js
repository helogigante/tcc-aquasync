document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.form');
  const btnEntrar = document.querySelector('.sign');
  const username = document.getElementById('username');
  const password = document.getElementById('password');

  const API_URL = "http://localhost/aquasync/api/control/c_usuario.php";
  
  function showAlert(message, type = 'error') {
    const alertPopup = document.createElement('div');
    alertPopup.className = `custom-alert ${type}`;
    
    const icon = type === 'error' 
        ? '<i class="fas fa-exclamation-circle"></i>' 
        : '<i class="fas fa-check-circle"></i>';
    
    alertPopup.innerHTML = `
        <div class="alert-content">
            <div class="alert-icon">
                ${icon}
            </div>
            <div class="alert-message">${message}</div>
            <button class="alert-close"><i class="fas fa-times"></i></button>
        </div>
    `;
    
    document.body.appendChild(alertPopup);

    setTimeout(() => {
        alertPopup.classList.add('show');
    }, 10);

    const closeBtn = alertPopup.querySelector('.alert-close');
    closeBtn.addEventListener('click', () => {
        alertPopup.classList.remove('show');
        setTimeout(() => {
            if (alertPopup.parentNode) {
                alertPopup.parentNode.removeChild(alertPopup);
            }
        }, 300);
    });

    setTimeout(() => {
        if (alertPopup.parentNode) {
            alertPopup.classList.remove('show');
            setTimeout(() => {
                if (alertPopup.parentNode) {
                    alertPopup.parentNode.removeChild(alertPopup);
                }
            }, 300);
        }
    }, 5000);
  }

  function showError(input, message) {
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    
    input.style.borderColor = '#e74c3c';
   
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.color = '#e74c3c';
    errorElement.style.fontSize = '0.85rem';
    errorElement.style.marginTop = '0.3rem';
    errorElement.style.textAlign = 'left';
    errorElement.textContent = message;
    
    input.parentNode.appendChild(errorElement);
  }

  function removeError(input) {
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    input.style.borderColor = '#DAE1F1';
  }

  function showSuccess(input) {
    removeError(input);
    input.style.borderColor = '#2ecc71';
  }

  function validateUsername() {
    const value = username.value.trim();
    
    if (value === '') {
      showError(username, 'Digite seu nome de usuário ou e-mail');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      showSuccess(username);
      return true;
    } else {
      if (value.length < 3) {
        showError(username, 'Usuário deve ter pelo menos 3 caracteres');
        return false;
      }
      
      if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ0-9_\sçÇ]+$/.test(value)) {
        showError(username, 'Usuário só pode conter letras, números, espaços e underscore');
        return false;
      }
      
      showSuccess(username);
      return true;
    }
  }

  function validatePassword() {
    const value = password.value;
    
    if (value === '') {
      showError(password, 'Digite sua senha');
      return false;
    }
    
    if (value.length < 6) {
      showError(password, 'Senha deve ter pelo menos 8 caracteres');
      return false;
    }
    
    showSuccess(password);
    return true;
  }

  username.addEventListener('blur', validateUsername);
  username.addEventListener('input', function() {
    if (this.value.trim() !== '') {
      removeError(this);
      this.style.borderColor = '#96B3DF';
    }
  });

  password.addEventListener('blur', validatePassword);
  password.addEventListener('input', function() {
    if (this.value.trim() !== '') {
      removeError(this);
      this.style.borderColor = '#96B3DF';
    }
  });

  function validateForm() {
    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();
    
    return isUsernameValid && isPasswordValid;
  }

  btnEntrar.addEventListener('click', function(e) {
    e.preventDefault();
    
    if (!validateForm()) return;

    const data = {
      action: "login",
      login: username.value.trim(),
      password: password.value
    };

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    .then(res => res.json().then(result => ({ result, status: res.status })))
    .then(({ result, status }) => {
        if (status === 200 && result.user_id) {
          showAlert(result.message || "Login realizado com sucesso.", "success");
        
          localStorage.setItem("user_id", result.user_id);          
          setTimeout(() => {
            window.location.href = "Home.html";
          }, 1500);
        } else {
          showAlert(result.message || "Usuário (Email) ou senha incorretos.", "error");
        }
    })
    .catch(err => {
      console.error("Erro de login:", err);
      showAlert("Erro ao tentar fazer login.", "error");
    });
  });

  form.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      btnEntrar.click();
    }
  });

  username.addEventListener('focus', function() {
    removeError(this);
    this.style.borderColor = '#DAE1F1';
  });

  password.addEventListener('focus', function() {
    removeError(this);
    this.style.borderColor = '#DAE1F1';
  });
});