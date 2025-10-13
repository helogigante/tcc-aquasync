// Variáveis globais para os elementos do formulário
let wifiNetworkInput, wifiPasswordInput, billValueInput, sensorNameInput, saveSensorBtn;

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

// Função para mostrar popup de confirmação personalizado
function showConfirm(message, confirmCallback, cancelCallback) {
    // Criar elemento do popup de confirmação
    const confirmPopup = document.createElement('div');
    confirmPopup.className = 'custom-confirm';
    confirmPopup.innerHTML = `
        <div class="confirm-overlay">
            <div class="confirm-modal">
                <div class="confirm-header">
                    <div class="confirm-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h4 class="confirm-title">Confirmação</h4>
                    <button class="confirm-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="confirm-content">
                    <p class="confirm-message">${message}</p>
                </div>
                <div class="confirm-footer">
                    <button class="btn btn-cancel confirm-no">Cancelar</button>
                    <button class="btn btn-danger confirm-yes">Confirmar</button>
                </div>
            </div>
        </div>
    `;

    // Adicionar ao body
    document.body.appendChild(confirmPopup);

    // Mostrar com animação
    setTimeout(() => {
        confirmPopup.classList.add('show');
    }, 10);

    // Configurar botões
    const closeBtn = confirmPopup.querySelector('.confirm-close');
    const noBtn = confirmPopup.querySelector('.confirm-no');
    const yesBtn = confirmPopup.querySelector('.confirm-yes');

    const closeConfirm = () => {
        confirmPopup.classList.remove('show');
        setTimeout(() => {
            if (confirmPopup.parentNode) {
                confirmPopup.parentNode.removeChild(confirmPopup);
            }
        }, 300);
    };

    // Evento para cancelar
    const handleCancel = () => {
        closeConfirm();
        if (cancelCallback) cancelCallback();
    };

    // Evento para confirmar
    const handleConfirm = () => {
        closeConfirm();
        if (confirmCallback) confirmCallback();
    };

    closeBtn.addEventListener('click', handleCancel);
    noBtn.addEventListener('click', handleCancel);
    yesBtn.addEventListener('click', handleConfirm);

    // Fechar ao clicar fora do modal
    const overlay = confirmPopup.querySelector('.confirm-overlay');
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            handleCancel();
        }
    });

    // Tecla ESC para fechar
    const handleEscKey = (e) => {
        if (e.key === 'Escape') {
            handleCancel();
            document.removeEventListener('keydown', handleEscKey);
        }
    };
    document.addEventListener('keydown', handleEscKey);
}

// Função para validar campos obrigatórios no modal de edição
function validateEditForm() {
    const name = document.getElementById('editName').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const phone = document.getElementById('editPhone').value.trim();

    return name !== '' && email !== '' && phone !== '';
}

// Função para mostrar mensagens de erro nos campos
function showFieldError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(inputId + 'Error');

    if (!errorSpan) {
        const errorElement = document.createElement('span');
        errorElement.id = inputId + 'Error';
        errorElement.className = 'field-error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#dc3545';
        errorElement.style.fontSize = '12px';
        errorElement.style.marginTop = '5px';
        errorElement.style.display = 'block';

        input.parentNode.appendChild(errorElement);
    } else {
        errorSpan.textContent = message;
    }

    input.classList.add('field-error');
}

// Função para remover mensagens de erro
function removeFieldError(inputId) {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(inputId + 'Error');

    if (errorSpan) {
        errorSpan.remove();
    }

    input.classList.remove('field-error');
}

// Função para validar campo individual
function validateField(inputId) {
    const input = document.getElementById(inputId);
    const value = input.value.trim();

    if (value === '') {
        showFieldError(inputId, 'Este campo é obrigatório');
        return false;
    } else {
        removeFieldError(inputId);
        return true;
    }
}

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

            // Preencher os campos com os valores atuais
            const currentName = document.getElementById('userNameHeader').textContent;
            const currentEmail = document.getElementById('userEmail').textContent;
            const currentPhone = document.getElementById('userPhone').textContent;

            document.getElementById('editName').value = currentName;
            document.getElementById('editEmail').value = currentEmail;
            document.getElementById('editPhone').value = currentPhone;

            // Limpar mensagens de erro
            removeFieldError('editName');
            removeFieldError('editEmail');
            removeFieldError('editPhone');
        });
    }

    // Função para fechar modal de edição
    const closeEditModal = () => {
        editModal.classList.remove('active');
    };

    // Função para fechar modal de edição com validação
    const closeEditModalWithValidation = () => {
        if (validateEditForm()) {
            closeEditModal();
        } else {
            // Usar popup personalizado em vez de confirm padrão
            showConfirm(
                'Existem campos não preenchidos. Tem certeza que deseja cancelar? Suas alterações serão perdidas.',
                () => {
                    // Callback para confirmar (SIM)
                    closeEditModal();
                },
                () => {
                    // Callback para cancelar (NÃO) - não faz nada, mantém o modal aberto
                }
            );
        }
    };

    if (closeModal) closeModal.addEventListener('click', closeEditModalWithValidation);
    if (cancelEdit) cancelEdit.addEventListener('click', closeEditModalWithValidation);

    // Configurar salvamento das edições
    if (saveEdit) {
        saveEdit.addEventListener('click', () => {
            // Validar todos os campos
            const isNameValid = validateField('editName');
            const isEmailValid = validateField('editEmail');
            const isPhoneValid = validateField('editPhone');

            if (!isNameValid || !isEmailValid || !isPhoneValid) {
                // Usar popup personalizado em vez de alert padrão
                showAlert('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }

            const name = document.getElementById('editName').value;
            const email = document.getElementById('editEmail').value;
            const phone = document.getElementById('editPhone').value;

            // Atualizar informações na página
            if (name) document.getElementById('userNameHeader').textContent = name;
            if (email) document.getElementById('userEmail').textContent = email;
            if (phone) document.getElementById('userPhone').textContent = phone;

            // Fechar o modal após salvar
            closeEditModal();

            // Mostrar mensagem de sucesso
            showAlert('Informações atualizadas com sucesso!', 'success');
        });
    }

    // Adicionar validação em tempo real nos campos
    const editNameInput = document.getElementById('editName');
    const editEmailInput = document.getElementById('editEmail');
    const editPhoneInput = document.getElementById('editPhone');

    if (editNameInput) {
        editNameInput.addEventListener('blur', () => validateField('editName'));
        editNameInput.addEventListener('input', () => removeFieldError('editName'));
    }

    if (editEmailInput) {
        editEmailInput.addEventListener('blur', () => validateField('editEmail'));
        editEmailInput.addEventListener('input', () => removeFieldError('editEmail'));
    }

    if (editPhoneInput) {
        editPhoneInput.addEventListener('blur', () => validateField('editPhone'));
        editPhoneInput.addEventListener('input', () => removeFieldError('editPhone'));
    }

    // Configurar abertura do modal de adicionar sensor
    if (addSensorBtn) {
        addSensorBtn.addEventListener('click', () => {
            addSensorModal.classList.add('active');

            // Resetar o formulário quando abrir o modal
            document.getElementById('sensorCode').value = '';
            document.getElementById('codeValidation').style.display = 'none';
            document.getElementById('sensorCode').classList.remove('valid', 'invalid');

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
                showAlert('Por favor, preencha todos os campos.', 'error');
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
            showAlert('Sensor adicionado com sucesso!', 'success');
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
        sensorCodeInput.addEventListener('input', function () {
            const code = this.value.trim();

            // Esconder mensagem se o campo estiver vazio
            if (code === '') {
                validationMessage.style.display = 'none';
                this.classList.remove('valid', 'invalid');
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
            } else {
                // Código inválido - aplicar estilos e mensagem de erro
                this.classList.add('invalid');
                this.classList.remove('valid');
                validationMessage.textContent = 'Código incorreto. Tente novamente.';
                validationMessage.className = 'validation-message error';
                validationMessage.style.display = 'block';
            }
        });
    }
}

// Função para melhorar a experiência visual da validação
function enhanceValidationUI() {
    const sensorCodeInput = document.getElementById('sensorCode');

    if (sensorCodeInput) {
        // Adicionar feedback visual durante a digitação
        sensorCodeInput.addEventListener('keyup', function () {
            if (this.value.length > 0) {
                this.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
            } else {
                this.style.boxShadow = 'none';
            }
        });

        // Focar automaticamente no input quando o modal abrir
        const addSensorBtn = document.getElementById('addSensorBtn');
        if (addSensorBtn) {
            addSensorBtn.addEventListener('click', function () {
                setTimeout(() => {
                    sensorCodeInput.focus();
                }, 300);
            });
        }
    }
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
            window.location.href = 'login.html';
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
document.addEventListener('DOMContentLoaded', function () {
    // Configurar todos os modais
    setupModals();

    // Configurar validação do código do sensor
    setupSensorCodeValidation();

    // Melhorar a UI de validação
    enhanceValidationUI();

    // Configurar modal de desconexão
    setupDisconnectModal();
});