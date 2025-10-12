
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.form');
  const btnEntrar = document.querySelector('.sign');
  const username = document.getElementById('username');
  const password = document.getElementById('password');

  
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

  //  validação em tempo real
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

  // Substituir o evento de clique original
  btnEntrar.addEventListener('click', function(e) {
    e.preventDefault();
    
    if (validateForm()) {
      // Se todos os campos são válidos, mostrar mensagem de sucesso
      console.log('Login válido! Redirecionando...');
      
      // Simular autenticação (aqui vcs mudam dps)
      const loginData = {
        username: username.value.trim(),
        password: password.value
      };
      
      
      
      // Feedback visual de carregamento
      btnEntrar.textContent = 'Entrando...';
      btnEntrar.disabled = true;
      btnEntrar.style.opacity = '0.7';
      
      // Simular delay de autenticação
      setTimeout(() => {
        window.location.href = 'Home.html';
      }, 1000);
      
    } else {
      // Rolar até o primeiro erro
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      //  erro no botão
      btnEntrar.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
      setTimeout(() => {
        btnEntrar.style.background = 'linear-gradient(135deg, #364775 0%, #212E4E 100%)';
      }, 1000);
    }
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