// Variáveis globais para os elementos do formulário
let wifiNetworkInput, wifiPasswordInput, billValueInput, sensorNameInput, saveSensorBtn;

// Função para mostrar popup de alerta estilizado
function showAlert(message, type = 'error') {
    const alertPopup = document.createElement('div');
    alertPopup.className = `custom-alert ${type}`;
    alertPopup.innerHTML = `
        <div class="alert-content">
            <div class="alert-icon">
                <i class="fas ${type === 'error' ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i>
            </div>
            <div class="alert-message">${message}</div>
            <button class="alert-close"><i class="fas fa-times"></i></button>
        </div>
    `;
    document.body.appendChild(alertPopup);

    alertPopup.style.backgroundColor = type === 'error' ? '#f8d7da' : '#d1e7dd';
    alertPopup.style.borderLeft = type === 'error' ? '6px solid #dc3545' : '6px solid #198754';
    alertPopup.querySelector('.alert-message').style.color = type === 'error' ? '#721c24' : '#0f5132';

    setTimeout(() => alertPopup.classList.add('show'), 10);
    const close = () => {
        alertPopup.classList.remove('show');
        setTimeout(() => alertPopup.remove(), 300);
    };
    alertPopup.querySelector('.alert-close').onclick = close;
    setTimeout(close, 5000);
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

// Função para configurar o botão de deletar conta
function setupDeleteAccount() {
    const deleteAccountBtn = document.getElementById('confirmDelete');
    
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => {
            // Mostrar popup de confirmação personalizado
            showConfirm(
                'Tem certeza que deseja deletar sua conta? Esta ação é irreversível e todos os seus dados serão perdidos permanentemente.',
                () => {
                    // Callback para confirmar a deleção
                    handleAccountDeletion();
                },
                () => {
                    // Callback para cancelar - não faz nada
                    console.log('Deleção de conta cancelada pelo usuário');
                }
            );
        });
    }
}

// Função de deleção da conta
function handleAccountDeletion() {
    fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId })
    })
    .then(res => res.json().then(result => ({ result, status: res.status })))
    .then(({ result, status }) => {
        if (status === 200) {
            showAlert("Conta deletada com sucesso.", "success");
            localStorage.removeItem("user_id");
            setTimeout(() => window.location.href = "login.html", 2000);
        } else {
            showAlert(result.message || "Erro ao deletar conta.", "error");
        }
    })
    .catch(err => {
        console.error(err);
        showAlert("Erro de comunicação com o servidor.", "error");
    });
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
            const name = document.getElementById('editName').value.trim();
            const email = document.getElementById('editEmail').value.trim();
            const phone = document.getElementById('editPhone').value.trim();

            if (!name || !email || !phone) {
                showAlert('Por favor, preencha todos os campos.', 'error');
                return;
            }

            fetch(API_URL, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    name: name,
                    email: email,
                    phone: phone
                })
            })
            .then(res => res.json().then(result => ({ result, status: res.status })))
            .then(({ result, status }) => {
                if (status === 200) {
                    showAlert("Informações atualizadas com sucesso!", "success");
                    document.getElementById('userNameHeader').textContent = name;
                    document.getElementById('userEmail').textContent = email;
                    document.getElementById('userPhone').textContent = phone;
                    closeEditModal();
                } else {
                    showAlert(result.message || "Erro ao atualizar dados.", "error");
                }
            })
            .catch(err => {
                console.error(err);
                showAlert("Erro de comunicação com o servidor.", "error");
            });
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
            localStorage.removeItem("user_id");
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

// Função para configurar a exclusão de sensor
function setupSensorDeletion() {
    const deleteSensorBtn = document.getElementById('deleteSensorBtn');
    
    if (deleteSensorBtn) {
        deleteSensorBtn.addEventListener('click', () => {
            const selectedSensor = document.getElementById('sensorSelect').value;
            
            if (!selectedSensor) {
                showAlert('Por favor, selecione um sensor para excluir.', 'error');
                return;
            }
            
            const sensorName = document.getElementById('sensorSelect').options[document.getElementById('sensorSelect').selectedIndex].text;
            
            // Mostrar popup de confirmação personalizado
            showConfirm(
                `Tem certeza que deseja excluir o sensor "${sensorName}"? Esta ação é irreversível e todos os dados deste sensor serão perdidos.`,
                () => {
                    // Callback para confirmar a exclusão
                    handleSensorDeletion(selectedSensor, sensorName);
                },
                () => {
                    // Callback para cancelar - não faz nada
                    console.log('Exclusão de sensor cancelada pelo usuário');
                }
            );
        });
    }
}

// Função para lidar com a exclusão do sensor
function handleSensorDeletion(sensorId, sensorName) {
    // Fazer requisição para a API para excluir o sensor
    fetch(`http://localhost/aquasync/api/control/c_sensor.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            sensor_id: sensorId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert(`Sensor "${sensorName}" excluído com sucesso!`, 'success');
            
            // Remover o sensor do dropdown
            const sensorSelect = document.getElementById('sensorSelect');
            const optionToRemove = sensorSelect.querySelector(`option[value="${sensorId}"]`);
            if (optionToRemove) {
                optionToRemove.remove();
            }
            
            // Resetar o formulário
            sensorSelect.value = '';
            document.getElementById('editSensorName').value = '';
            document.getElementById('editBillValue').value = '';
            
            // Esconder os campos
            const sensorFields = document.querySelectorAll('.sensor-fields');
            sensorFields.forEach(field => {
                field.classList.remove('show');
                setTimeout(() => {
                    field.style.display = 'none';
                }, 300);
            });
            
            // Atualizar o estado do botão de excluir
            updateDeleteButtonState();
            
            // Atualizar o localStorage para sincronizar com a home
            removeSensorFromStorage(sensorId);
            
        } else {
            showAlert('Erro ao excluir sensor: ' + (data.message || 'Erro desconhecido'), 'error');
        }
    })
    .catch(error => {
        console.error('Erro ao excluir sensor:', error);
        showAlert('Erro de comunicação com o servidor.', 'error');
    });
}

// Função para remover sensor do localStorage
function removeSensorFromStorage(sensorId) {
    const sensorUpdates = JSON.parse(localStorage.getItem('sensorUpdates') || '{}');
    delete sensorUpdates[sensorId];
    localStorage.setItem('sensorUpdates', JSON.stringify(sensorUpdates));
    
    // Disparar um evento customizado para notificar outras páginas
    window.dispatchEvent(new CustomEvent('sensorDeleted', {
        detail: { sensorId }
    }));
}

// Função para atualizar o estado do botão de excluir
function updateDeleteButtonState() {
    const deleteSensorBtn = document.getElementById('deleteSensorBtn');
    const selectedSensor = document.getElementById('sensorSelect').value;
    
    if (deleteSensorBtn) {
        if (selectedSensor) {
            deleteSensorBtn.disabled = false;
        } else {
            deleteSensorBtn.disabled = true;
        }
    }
}

// Função para configurar o modal de edição de sensor
function setupEditSensorModal() {
    const editSensorBtn = document.getElementById('editSensorBtn');
    const editSensorModal = document.getElementById('editSensorModal');
    const closeEditSensorModal = document.getElementById('closeEditSensorModal');
    const cancelEditSensor = document.getElementById('cancelEditSensor');
    const saveEditSensor = document.getElementById('saveEditSensor');
    const sensorSelect = document.getElementById('sensorSelect');
    const sensorFields = document.querySelectorAll('.sensor-fields');

    // Configurar abertura do modal de edição de sensor
    if (editSensorBtn) {
        editSensorBtn.addEventListener('click', () => {
            editSensorModal.classList.add('active');
            
            // Carregar sensores do usuário
            loadUserSensors();
            
            // Resetar o formulário quando abrir o modal
            sensorSelect.value = '';
            sensorFields.forEach(field => {
                field.style.display = 'none';
                field.classList.remove('show');
            });
            document.getElementById('editSensorName').value = '';
            document.getElementById('editBillValue').value = '';
            
            // Atualizar estado do botão de excluir
            updateDeleteButtonState();
        });
    }

    // Configurar mudança no dropdown de sensores
    if (sensorSelect) {
        sensorSelect.addEventListener('change', function() {
            const selectedValue = this.value;
            
            if (selectedValue) {
                // Mostrar campos quando um sensor é selecionado
                sensorFields.forEach(field => {
                    field.style.display = 'block';
                    setTimeout(() => {
                        field.classList.add('show');
                    }, 10);
                });

                // Carregar dados do sensor selecionado
                loadSensorData(selectedValue);
            } else {
                // Esconder campos quando nenhum sensor é selecionado
                sensorFields.forEach(field => {
                    field.classList.remove('show');
                    setTimeout(() => {
                        field.style.display = 'none';
                    }, 300);
                });
            }
            
            // Atualizar estado do botão de excluir
            updateDeleteButtonState();
        });
    }

    // função para carregar dados do sensor
    function loadSensorData(sensorId) {
        fetch(`http://localhost/aquasync/api/control/c_sensor.php?user_id=${userId}&sensor_id=${sensorId}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.sensor_name) {
                    document.getElementById('editSensorName').value = data.sensor_name;
                    document.getElementById('editBillValue').value = data.tariff_value ? parseFloat(data.tariff_value).toFixed(2) : '';
                } else {
                    // Fallback para dados de exemplo se a API não retornar
                    const sensorData = {
                        '1': { sensor_name: 'Casa A', tariff_value: '5.50' },
                        '2': { sensor_name: 'Casa B', tariff_value: '6.20' }
                    };
                    const fallbackData = sensorData[sensorId];
                    if (fallbackData) {
                        document.getElementById('editSensorName').value = fallbackData.sensor_name;
                        document.getElementById('editBillValue').value = fallbackData.tariff_value;
                    }
                }
            })
            .catch(error => {
                console.error('Erro ao carregar dados do sensor:', error);
                // Fallback para dados de exemplo em caso de erro
                const sensorData = {
                    '1': { sensor_name: 'Casa A', tariff_value: '5.50' },
                    '2': { sensor_name: 'Casa B', tariff_value: '6.20' }
                };
                const fallbackData = sensorData[sensorId];
                if (fallbackData) {
                    document.getElementById('editSensorName').value = fallbackData.sensor_name;
                    document.getElementById('editBillValue').value = fallbackData.tariff_value;
                }
            });
    }

    // Função para fechar modal de edição de sensor
    const closeEditSensorModalFunc = () => {
        editSensorModal.classList.remove('active');
    };

    if (closeEditSensorModal) {
        closeEditSensorModal.addEventListener('click', closeEditSensorModalFunc);
    }

    if (cancelEditSensor) {
        cancelEditSensor.addEventListener('click', closeEditSensorModalFunc);
    }

    // Configurar salvamento das edições do sensor
    if (saveEditSensor) {
        saveEditSensor.addEventListener('click', () => {
            const selectedSensor = sensorSelect.value;
            const sensorName = document.getElementById('editSensorName').value.trim();
            const billValue = document.getElementById('editBillValue').value.trim();

            if (!selectedSensor) {
                showAlert('Por favor, selecione um sensor.', 'error');
                return;
            }

            if (!sensorName || !billValue) {
                showAlert('Por favor, preencha todos os campos.', 'error');
                return;
            }

            fetch(`http://localhost/aquasync/api/control/c_sensor.php`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sensor_id: selectedSensor,
                    sensor_name: sensorName,
                    tariff_value: billValue.replace(',', '.'),
                    register_state: 1
                })
            })
            .then(res => res.json().then(result => ({ result, status: res.status })))
            .then(({ result, status }) => {
                if (status === 200 || (result && result.success)) {
                    // atualiza o dropdown no modal atual
                    updateSensorDropdown(selectedSensor, sensorName);

                    // atualiza o localStorage para sincronizar com a home
                    updateSensorInStorage(selectedSensor, sensorName);

                    document.querySelectorAll('.custom-alert.sucess').forEach(a => a.remove());

                    showAlert('Sensor atualizado com sucesso!', 'success');

                    closeEditSensorModalFunc();
                } else {
                    document.querySelectorAll('.custom-alert.error').forEach(a => a.remove());
                    showAlert(result.message || 'Erro ao atualizar sensor.', 'error');
                }
            })
            .catch(error => {
                console.error('Erro ao atualizar sensor:', error);
                document.querySelectorAll('.custom-alert.error').forEach(a => a.remove());
                showAlert('Erro de comunicação com o servidor.', 'error');
            });
        });
    }

    // Configurar fechamento do modal ao clicar fora dele
    if (editSensorModal) {
        editSensorModal.addEventListener('click', (e) => {
            if (e.target === editSensorModal) {
                closeEditSensorModalFunc();
            }
        });
    }

    // Configurar botão de excluir sensor
    setupSensorDeletion();

    // Atualizar estado inicial do botão de excluir
    updateDeleteButtonState();
}

// Função para atualizar o dropdown no modal
function updateSensorDropdown(sensorId, newName) {
    const sensorSelect = document.getElementById('sensorSelect');
    const option = sensorSelect.querySelector(`option[value="${sensorId}"]`);
    if (option) {
        option.textContent = newName;
    }
}

// atualiza o localStorage pra sincronizar com a home
function updateSensorInStorage(sensorId, newName) {
    const sensorUpdates = JSON.parse(localStorage.getItem('sensorUpdates') || '{}');
    sensorUpdates[sensorId] = { name: newName, updatedAt: new Date().toISOString() };
    localStorage.setItem('sensorUpdates', JSON.stringify(sensorUpdates));

    const editDropdown = document.getElementById('sensorSelect');
    if (editDropdown) {
        const option = editDropdown.querySelector(`option[value="${sensorId}"]`);
        if (option) option.textContent = newName;
    }

    const homeDropdown = document.getElementById('sensorDropdown');
    if (homeDropdown) {
        const optionHome = homeDropdown.querySelector(`option[value="${sensorId}"]`);
        if (optionHome) {
            optionHome.textContent = newName;
            if (homeDropdown.value === String(sensorId) || homeDropdown.value === sensorId) {
                // força o texto visível a atualizar (alguns browsers precisam)
                homeDropdown.value = String(sensorId);
                const sensorHeader = document.getElementById('selectedSensorName');
                if (sensorHeader) sensorHeader.textContent = newName;
            }
        }
    }

    const sensorHeader = document.getElementById('selectedSensorName');
    if (sensorHeader) {
        const homeDropdownNow = document.getElementById('sensorDropdown');
        if (!homeDropdownNow || homeDropdownNow.value === String(sensorId) || homeDropdownNow.value === sensorId) {
            sensorHeader.textContent = newName;
        }
    }

    window.dispatchEvent(new CustomEvent('sensorUpdated', { detail: { sensorId, newName } }));
}

function handleSensorChange(sensorId) {
    const sensorDropdown = document.getElementById('sensorDropdown');
    const selectedOption = sensorDropdown.options[sensorDropdown.selectedIndex];
    const sensorName = selectedOption.textContent;

    const sensorHeader = document.getElementById('selectedSensorName');
    if (sensorHeader) {
        sensorHeader.textContent = sensorName;
    }

    loadSensorData(sensorId);
}


// função para carregar sensores do usuário (substitui os dados estáticos)
function loadUserSensors() {
    fetch(`http://localhost/aquasync/api/control/c_sensor.php?user_id=${userId}`)
        .then(response => response.json())
        .then(sensors => {
            const sensorSelect = document.getElementById('sensorSelect');

            // limpar options existentes (exceto a primeira)
            while (sensorSelect.options.length > 1) {
                sensorSelect.remove(1);
            }

            // recupera atualizações do localStorage
            const sensorUpdates = JSON.parse(localStorage.getItem('sensorUpdates') || '{}');

            // adiciona sensores do usuário
            if (sensors && sensors.length > 0) {
                sensors.forEach(sensor => {
                    const option = document.createElement('option');
                    option.value = sensor.sensor_id;

                    // se houver nome atualizado salvo, usa ele
                    const updated = sensorUpdates[sensor.sensor_id];
                    option.textContent = updated ? updated.name : sensor.sensor_name;

                    sensorSelect.appendChild(option);
                });
            } else {
                // fallback para sensores de exemplo
                const defaultSensors = [
                    { sensor_id: '1', sensor_name: 'Casa A' },
                    { sensor_id: '2', sensor_name: 'Casa B' }
                ];

                defaultSensors.forEach(sensor => {
                    const option = document.createElement('option');
                    option.value = sensor.sensor_id;
                    option.textContent = sensor.sensor_name;
                    sensorSelect.appendChild(option);
                });
            }

            // aqui aplica eventuais atualizações pendentes do localStorage
            Object.keys(sensorUpdates).forEach(sensorId => {
                const opt = sensorSelect.querySelector(`option[value="${sensorId}"]`);
                if (opt && sensorUpdates[sensorId].name) {
                    opt.textContent = sensorUpdates[sensorId].name;
                }
            });
        })
        .catch(error => {
            console.error('Erro ao carregar sensores:', error);

            const sensorSelect = document.getElementById('sensorSelect');
            const defaultSensors = [
                { sensor_id: '1', sensor_name: 'Casa A' },
                { sensor_id: '2', sensor_name: 'Casa B' }
            ];

            defaultSensors.forEach(sensor => {
                const option = document.createElement('option');
                option.value = sensor.sensor_id;
                option.textContent = sensor.sensor_name;
                sensorSelect.appendChild(option);
            });
        });
}

const API_URL = "http://localhost/aquasync/api/control/c_usuario.php";
const userId = localStorage.getItem("user_id");

if (!userId) {
    // se o usuário não estiver logado
    window.location.href = "login.html";
}

// essa função vai carregar os dados do perfil do usuário
function loadUserProfile() {
    if (!userId) return;

    fetch(`${API_URL}?user_id=${userId}`)
    .then(res => res.json().then(result => ({ result, status: res.status })))
    .then(({ result, status }) => {
        if (status === 200) {
            // atualiza o DOM com os dados do usuário
            // DOM é a estrutura HTML da página
            document.getElementById('userNameHeader').textContent = result.nome;
            document.getElementById('userEmail').textContent = result.email;
            document.getElementById('userPhone').textContent = result.telefone || "(00) 00000-0000";
        } else {
            console.error(result.message || "Erro ao carregar perfil do usuário.");
        }
    })
    .catch(err => {
        console.error("Erro ao buscar perfil:", err);
    });
}

// Inicialização quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', function () {
    loadUserProfile();
    setupModals();
    setupSensorCodeValidation();
    enhanceValidationUI();
    setupDisconnectModal();
    setupDeleteAccount();
    setupEditSensorModal();
    setupSensorDeletion();

    // atualizar dropdowns quando um sensor for atualizado
    window.addEventListener('sensorUpdated', (e) => {
        const { sensorId, newName } = e.detail;

        // atualiza o dropdown da home
        const homeDropdown = document.getElementById('sensorDropdown');
        if (homeDropdown) {
            const optionHome = homeDropdown.querySelector(`option[value="${sensorId}"]`);
            if (optionHome) {
                optionHome.textContent = newName;
            }

            // se o sensor alterado for o que está sendo usado, atualiza o texto visível
            if (homeDropdown.value === String(sensorId) || homeDropdown.value === sensorId) {
                const sensorHeader = document.getElementById('selectedSensorName');
                if (sensorHeader) sensorHeader.textContent = newName;
            }
        }

        // atualiza também o dropdown do modal de edição
        const editDropdown = document.getElementById('sensorSelect');
        if (editDropdown) {
            const optionEdit = editDropdown.querySelector(`option[value="${sensorId}"]`);
            if (optionEdit) optionEdit.textContent = newName;
        }
    });
});