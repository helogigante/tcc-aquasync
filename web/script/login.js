document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.form');
  const btnEntrar = document.querySelector('.sign');
  const username = document.getElementById('username');
  const password = document.getElementById('password');

  const API_URL = "http://localhost/aquasync/api/control/c_usuario.php";
  
  // Função para mostrar popup de alerta estilizado
  function showAlert(message, type = 'error') {
    // Criar elemento do popup
    const alertPopup = document.createElement('div');
    alertPopup.className = `custom-alert ${type}`;
    alertPopup.innerHTML = `
        <div class="alert-content">
            <div class="alert-icon">
                <i class="fas ${type === 'error' ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i>
            </div>
            <div class="alert-message">${message}</div>
            <button class="alert-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Adicionar ao body
    document.body.appendChild(alertPopup);

    // Mostrar com animação
    setTimeout(() => {
        alertPopup.classList.add('show');
    }, 10);

    // Configurar fechamento
    const closeBtn = alertPopup.querySelector('.alert-close');
    closeBtn.addEventListener('click', () => {
        alertPopup.classList.remove('show');
        setTimeout(() => {
            if (alertPopup.parentNode) {
                alertPopup.parentNode.removeChild(alertPopup);
            }
        }, 300);
    });

    // Fechar automaticamente após 5 segundos
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

  // Função para remover mensagem de erro
  function removeError(input) {
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    input.style.borderColor = '#DAE1F1';
  }

  // Função para mostrar sucesso
  function showSuccess(input) {
    removeError(input);
    input.style.borderColor = '#2ecc71';
  }

  // Validação do campo de usuário/e-mail
  function validateUsername() {
    const value = username.value.trim();
    
    if (value === '') {
      showError(username, 'Digite seu nome de usuário ou e-mail');
      return false;
    }
    
    // Verifica se é um e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      // É um e-mail válido
      showSuccess(username);
      return true;
    } else {
      // É um nome de usuário - verifica comprimento mínimo
      if (value.length < 3) {
        showError(username, 'Usuário deve ter pelo menos 3 caracteres');
        return false;
      }
      
      // Verifica caracteres válidos para usuário
      if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        showError(username, 'Usuário só pode conter letras, números e underscore');
        return false;
      }
      
      showSuccess(username);
      return true;
    }
  }

  // Validação do campo de senha
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

  // validação em tempo real
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

  // Validação do formulário completo
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
        
          // salva o ID do usuário no localStorage
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

  // submit com Enter
  form.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      btnEntrar.click();
    }
  });

  // Limpa os erros ao focar nos campos
  username.addEventListener('focus', function() {
    removeError(this);
    this.style.borderColor = '#DAE1F1';
  });

  password.addEventListener('focus', function() {
    removeError(this);
    this.style.borderColor = '#DAE1F1';
  });
});