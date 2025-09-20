// Variáveis globais para os elementos do formulário
let wifiNetworkInput, wifiPasswordInput, billValueInput, sensorNameInput, saveSensorBtn;

// Função principal para configurar todos os modais
function setupModals() {
  // Modal de edição de informações
  const editModal = document.getElementById('editModal');
  const editInfoBtn = document.getElementById('editInfoBtn');
  const closeModal = document.getElementById('closeModal');
  const cancelEdit = document.getElementById('cancelEdit');
  const saveEdit = document.getElementById('saveEdit');
  
  // Modal de adicionar sensor
  const addSensorModal = document.getElementById('addSensorModal');
  const addSensorBtn = document.getElementById('addSensorBtn');
  const closeAddSensorModal = document.getElementById('closeAddSensorModal');
  const cancelAddSensor = document.getElementById('cancelAddSensor');
  const saveSensor = document.getElementById('saveSensor');
  
  // Inicializar variáveis globais com elementos do formulário
  wifiNetworkInput = document.getElementById('wifiNetwork');
  wifiPasswordInput = document.getElementById('wifiPassword');
  billValueInput = document.getElementById('billValue');
  sensorNameInput = document.getElementById('sensorName');
  saveSensorBtn = document.getElementById('saveSensor');
  
  // Configurar abertura do modal de edição
  if (editInfoBtn) {
    editInfoBtn.addEventListener('click', () => {
      editModal.classList.add('active');
    });
  }
  
  // Função para fechar modal de edição
  const closeEditModal = () => editModal.classList.remove('active');
  if (closeModal) closeModal.addEventListener('click', closeEditModal);
  if (cancelEdit) cancelEdit.addEventListener('click', closeEditModal);
  
  // Configurar salvamento das edições
  if (saveEdit) {
    saveEdit.addEventListener('click', () => {
      const name = document.getElementById('editName').value;
      const email = document.getElementById('editEmail').value;
      const phone = document.getElementById('editPhone').value;
      
      // Atualizar informações na página
      if (name) document.getElementById('userNameHeader').textContent = name;
      if (email) document.getElementById('userEmail').textContent = email;
      if (phone) document.getElementById('userPhone').textContent = phone;
      
      closeEditModal();
    });
  }
  
  // Configurar abertura do modal de adicionar sensor
  if (addSensorBtn) {
    addSensorBtn.addEventListener('click', () => {
      addSensorModal.classList.add('active');
      
      // Resetar o formulário quando abrir o modal
      document.getElementById('sensorCode').value = '';
      document.getElementById('codeValidation').style.display = 'none';
      document.getElementById('sensorCode').classList.remove('valid', 'invalid');
      
      // Desabilitar campos
      disableFormFields();
    });
  }
  
  // Função para fechar modal de adicionar sensor
  const closeAddSensorModalFunc = () => addSensorModal.classList.remove('active');
  if (closeAddSensorModal) closeAddSensorModal.addEventListener('click', closeAddSensorModalFunc);
  if (cancelAddSensor) cancelAddSensor.addEventListener('click', closeAddSensorModalFunc);
  
  // Configurar salvamento do sensor
  if (saveSensor) {
    saveSensor.addEventListener('click', () => {
      const sensorCode = document.getElementById('sensorCode').value;
      const wifiNetwork = document.getElementById('wifiNetwork').value;
      const wifiPassword = document.getElementById('wifiPassword').value;
      const billValue = document.getElementById('billValue').value;
      const sensorName = document.getElementById('sensorName').value;
      
      // Validação básica dos campos
      if (!sensorCode || !wifiNetwork || !wifiPassword || !billValue || !sensorName) {
        alert('Por favor, preencha todos os campos.');
        return;
      }
      
      // Simulação de conexão do sensor (em produção, aqui seria uma chamada API)
      console.log('Conectando sensor:', {
        sensorCode,
        wifiNetwork,
        wifiPassword,
        billValue,
        sensorName
      });
      
      // Fechar o modal após salvar
      closeAddSensorModalFunc();
      
      // Limpar os campos do formulário
      document.getElementById('sensorCode').value = '';
      document.getElementById('wifiNetwork').value = '';
      document.getElementById('wifiPassword').value = '';
      document.getElementById('billValue').value = '';
      document.getElementById('sensorName').value = '';
      
      // Mostrar mensagem de sucesso
      alert('Sensor adicionado com sucesso!');
    });
  }
  
  // Configurar fechamento de modais ao clicar fora deles
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });
}

// Função para validar o código do sensor
function setupSensorCodeValidation() {
  const sensorCodeInput = document.getElementById('sensorCode');
  const validationMessage = document.getElementById('codeValidation');
  
  // Códigos válidos de exemplo (em um sistema real, isso viria de um servidor)
  const validCodes = ['SENSOR123', 'WATER456', 'FLOW789', 'SYBAU2024'];
  
  if (sensorCodeInput) {
    sensorCodeInput.addEventListener('input', function() {
      const code = this.value.trim();
      
      // Esconder mensagem se o campo estiver vazio
      if (code === '') {
        validationMessage.style.display = 'none';
        this.classList.remove('valid', 'invalid');
        disableFormFields();
        return;
      }
      
      // Verificar se o código é válido
      if (validCodes.includes(code.toUpperCase())) {
        // Código válido - aplicar estilos e mensagem de sucesso
        this.classList.add('valid');
        this.classList.remove('invalid');
        validationMessage.textContent = 'Código correto!';
        validationMessage.className = 'validation-message success';
        validationMessage.style.display = 'block';
        
        // Habilitar os outros campos
        enableFormFields();
      } else {
        // Código inválido - aplicar estilos e mensagem de erro
        this.classList.add('invalid');
        this.classList.remove('valid');
        validationMessage.textContent = 'Código incorreto. Tente novamente.';
        validationMessage.className = 'validation-message error';
        validationMessage.style.display = 'block';
        
        // Desabilitar os outros campos
        disableFormFields();
      }
    });
  }
  
  // Inicializar com campos desabilitados
  disableFormFields();
}

// Função para melhorar a experiência visual da validação
function enhanceValidationUI() {
  const sensorCodeInput = document.getElementById('sensorCode');
  
  if (sensorCodeInput) {
    // Adicionar feedback visual durante a digitação
    sensorCodeInput.addEventListener('keyup', function() {
      if (this.value.length > 0) {
        this.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
      } else {
        this.style.boxShadow = 'none';
      }
    });
    
    // Focar automaticamente no input quando o modal abrir
    const addSensorBtn = document.getElementById('addSensorBtn');
    if (addSensorBtn) {
      addSensorBtn.addEventListener('click', function() {
        setTimeout(() => {
          sensorCodeInput.focus();
        }, 300);
      });
    }
  }
}

// Função para habilitar campos do formulário de sensor
function enableFormFields() {
  wifiNetworkInput.disabled = false;
  wifiPasswordInput.disabled = false;
  billValueInput.disabled = false;
  sensorNameInput.disabled = false;
  saveSensorBtn.disabled = false;
  
  // Atualizar estilos dos labels
  document.querySelectorAll('.disabled-label').forEach(label => {
    label.classList.remove('disabled-label');
  });
}

// Função para desabilitar campos do formulário de sensor
function disableFormFields() {
  wifiNetworkInput.disabled = true;
  wifiPasswordInput.disabled = true;
  billValueInput.disabled = true;
  sensorNameInput.disabled = true;
  saveSensorBtn.disabled = true;
  
  // Limpar valores dos campos
  wifiNetworkInput.value = '';
  wifiPasswordInput.value = '';
  billValueInput.value = '';
  sensorNameInput.value = '';
  
  // Atualizar estilos dos labels
  const labels = document.querySelectorAll('.input-group label');
  labels.forEach(label => {
    if (label.htmlFor !== 'sensorCode' && !label.classList.contains('disabled-label')) {
      label.classList.add('disabled-label');
    }
  });
}

// Função para configurar o modal de desconexão
function setupDisconnectModal() {
  const disconnectBtn = document.getElementById('disconnectBtn');
  const disconnectModal = document.getElementById('disconnectModal');
  const closeDisconnectModal = document.getElementById('closeDisconnectModal');
  const cancelDisconnect = document.getElementById('cancelDisconnect');
  const confirmDisconnect = document.getElementById('confirmDisconnect');
  
  // Configurar abertura do modal de desconexão
  if (disconnectBtn) {
    disconnectBtn.addEventListener('click', () => {
      disconnectModal.classList.add('active');
    });
  }
  
  // Função para fechar modal de desconexão
  const closeDisconnectModalFunc = () => disconnectModal.classList.remove('active');
  if (closeDisconnectModal) closeDisconnectModal.addEventListener('click', closeDisconnectModalFunc);
  if (cancelDisconnect) cancelDisconnect.addEventListener('click', closeDisconnectModalFunc);
  
  // Configurar confirmação de desconexão
  if (confirmDisconnect) {
    confirmDisconnect.addEventListener('click', () => {
      // Redirecionar para a página de login
      window.location.href = 'index.html';
    });
  }
  
  // Configurar fechamento do modal ao clicar fora dele
  if (disconnectModal) {
    disconnectModal.addEventListener('click', (e) => {
      if (e.target === disconnectModal) {
        closeDisconnectModalFunc();
      }
    });
  }
}

// Inicialização quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  // Configurar todos os modais
  setupModals();
  
  // Configurar validação do código do sensor
  setupSensorCodeValidation();
  
  // Melhorar a UI de validação
  enhanceValidationUI();
  
  // Configurar modal de desconexão
  setupDisconnectModal();
});