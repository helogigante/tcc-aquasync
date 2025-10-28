

// Função para mostrar popup de alerta estilizado
function showAlert(message, type = 'error') {
    // Determinar ícone e cores baseado no tipo
    let iconClass, iconType;
    if (type === 'success') {
        iconClass = 'fa-check-circle';
        iconType = 'success';
    } else if (type === 'warning') {
        iconClass = 'fa-exclamation-triangle';
        iconType = 'warning';
    } else {
        iconClass = 'fa-exclamation-circle';
        iconType = 'error';
    }

    // Criar elemento do popup
    const alertPopup = document.createElement('div');
    alertPopup.className = 'custom-alert ' + type;
    alertPopup.innerHTML = `
        <div class="alert-content">
            <div class="alert-popup-icon ${iconType}">
                <i class="fas ${iconClass}"></i>
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
