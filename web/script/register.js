document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.form');
  const btnEntrar = document.querySelector('.sign');
  const username = document.getElementById('username');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');

  const API_URL = "http://localhost/aquasync/api/control/c_usuario.php";

  // Função para mostrar popup de alerta estilizado
  function showAlert(message, type = 'error') {
    // Criar elemento do popup
    const alertPopup = document.createElement('div');
    alertPopup.className = `custom-alert ${type}`;
    alertPopup.innerHTML = `
  <div class="alert-content">
    <div class="alert-icon">
      ${type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' : '<i class="fas fa-check-circle"></i>'}
    </div>
    <div class="alert-message">${message}</div>
    <button class="alert-close">&times;</button>
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
    
    // Adiciona borda vermelha ao input
    input.style.borderColor = '#e74c3c';
    
    // Cria e exibe a mensagem de erro
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.color = '#e74c3c';
    errorElement.style.fontSize = '0.85rem';
    errorElement.style.marginTop = '0.3rem';
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

  // Funções de validação individuais
  function validateUsername() {
    const value = username.value.trim();
    
    if (value === '') {
      showError(username, 'Insira seu nome de usuário');
      return false;
    }
    
    if (value.length < 3) {
      showError(username, 'Usuário deve ter pelo menos 3 caracteres');
      return false;
    }
    
    // aceita acentos e caracteres especiais 
 if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ0-9_\sçÇ]+$/.test(value)) {
    showError(username, 'Usuário só pode conter letras, números, espaços e underscore');
    return false;
}
    
    removeError(username);
    return true;
  }

  function validateEmail() {
    const value = email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (value === '') {
      showError(email, 'Insira seu e-mail');
      return false;
    }
    
    if (!emailRegex.test(value)) {
      showError(email, 'Formato de e-mail inválido');
      return false;
    }
    
    removeError(email);
    return true;
  }

  function validatePhone() {
    const value = phone.value.trim();
    const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
    
    if (value === '') {
      showError(phone, 'Insira seu telefone');
      return false;
    }
    
    // Remove caracteres não numéricos para validação
    const cleanPhone = value.replace(/\D/g, '');
    
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      showError(phone, 'Telefone deve ter 10 ou 11 dígitos');
      return false;
    }
    
    if (!phoneRegex.test(value)) {
      showError(phone, 'Formato de telefone inválido. Use: (XX) XXXXX-XXXX');
      return false;
    }
    
    removeError(phone);
    return true;
  }

  function validatePassword() {
    const value = password.value;
    
    if (value === '') {
      showError(password, 'Insira sua senha');
      return false;
    }
    
    if (value.length < 8) {
      showError(password, 'Senha deve ter pelo menos 8 caracteres');
      return false;
    }
    
    if (!/(?=.*[a-z])/.test(value)) {
      showError(password, 'Senha deve conter pelo menos uma letra minúscula');
      return false;
    }
    
    if (!/(?=.*[A-Z])/.test(value)) {
      showError(password, 'Senha deve conter pelo menos uma letra maiúscula');
      return false;
    }
    
    if (!/(?=.*\d)/.test(value)) {
      showError(password, 'Senha deve conter pelo menos um número');
      return false;
    }
    
    if (!/(?=.*[@$!%*?&])/.test(value)) {
      showError(password, 'Senha deve conter pelo menos um caractere especial (@$!%*?&)');
      return false;
    }
    
    removeError(password);
    return true;
  }

  function validateConfirmPassword() {
    const value = confirmPassword.value;
    const passwordValue = password.value;
    
    if (value === '') {
      showError(confirmPassword, 'Confirme sua senha');
      return false;
    }
    
    if (value !== passwordValue) {
      showError(confirmPassword, 'As senhas não coincidem');
      return false;
    }
    
    removeError(confirmPassword);
    return true;
  }

  // Event listeners para validação em tempo real
  username.addEventListener('blur', validateUsername);
  email.addEventListener('blur', validateEmail);
  phone.addEventListener('blur', validatePhone);
  password.addEventListener('blur', validatePassword);
  confirmPassword.addEventListener('blur', validateConfirmPassword);

  // Validação do formulário completo
  function validateForm() {
    const isUsernameValid = validateUsername();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    
    return isUsernameValid && isEmailValid && isPhoneValid && 
           isPasswordValid && isConfirmPasswordValid;
  }

  btnEntrar.addEventListener('click', function(e) {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const data = {
      name: username.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      password: password.value.trim()
    };

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    .then(res => res.json().then(result => ({ result, status: res.status })))
    .then(({ result, status }) => {
        if (status === 200) {
            showAlert(result.message || "Cadastro realizado com sucesso.", "success");
            setTimeout(() => {
              window.location.href = "login.html";
            }, 1500);
        } else {
            showAlert(result.message || "Falha no cadastro do usuário.", "error");
        }
    })
    .catch(error => {
      console.error("Erro no cadastro:", error);
      showAlert("Falha na comunicação com o servidor.", "error");
    });
  });

  // Validação em tempo real para alguns campos
  phone.addEventListener('input', function(e) {
    // Formatação automática do telefone
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      if (value.length === 11) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else if (value.length === 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      }
      e.target.value = value;
    }
  });

  // Feedback visual para campos válidos
  function addValidStyle(input) {
    input.addEventListener('input', function() {
      if (this.value.trim() !== '') {
        this.style.borderColor = '#2ecc71';
      } else {
        this.style.borderColor = '#DAE1F1';
      }
    });
  }

  // Aplicar feedback visual a todos os campos
  [username, email, phone, password, confirmPassword].forEach(addValidStyle);
});