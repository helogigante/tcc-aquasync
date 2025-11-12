// Função para navegar de volta para a página inicial
function goBackToHome() {
  window.location.href = 'home.html';
}

// Inicialização quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', function() {
  // Seleciona todos os cartões de notificação
  const notificationCards = document.querySelectorAll('.notificacao-card');
  
  // Adiciona evento de clique para cada cartão de notificação
  notificationCards.forEach(card => {
    card.addEventListener('click', function() {
      // Remove a classe 'unread' ao clicar (marca como lida visualmente)
      this.classList.remove('unread');
      localStorage.setItem(notificationId, 'read');
      
      // Ponto para adicionar lógica de backend para marcar como lida
      console.log('Notificação marcada como lida');
    });
  });
  
  // Adiciona evento de clique para o botão de voltar
  const backButton = document.querySelector('.back-button');
  if (backButton) {
    backButton.addEventListener('click', function(e) {
      e.preventDefault(); // Previne o comportamento padrão do link
      goBackToHome(); // Chama a função para voltar para a home
    });
  }
  
  // Carrega notificações do armazenamento local (opcional)
  //loadSimulatedNotifications();

  // Carrega notificações do banco
  loadNotifications();
});

// Função para carregar notificações do localStorage
function loadSimulatedNotifications() {
  // Recupera notificações salvas no localStorage
  const savedNotifications = localStorage.getItem('aquasync_notifications');
  
  // Processa as notificações se existirem
  if (savedNotifications) {
    try {
      const notifications = JSON.parse(savedNotifications);
      console.log('Notificações carregadas:', notifications);
      // Ponto para processar e exibir as notificações carregadas
    } catch (e) {
      console.error('Erro ao carregar notificações:', e);
    }
  }
}

// Função para carregar os alertas do banco
function loadNotifications() {
  const userId = localStorage.getItem("user_id");
  fetch(`http://127.0.0.1/aquasync/api/control/c_alerta.php?case=2&user_id=${userId}`)
  .then(response => response.json())
  .then(data => {
    const container = document.querySelector('.notificacoes-container');
    container.innerHTML = '';

    data.forEach(item => {

      const notificationId = `alert_${item.alert_id}`;
      const isRead = localStorage.getItem(notificationId) === 'read';
      
      const notification = document.createElement('div');
      notification.className = `notificacao-card ${isRead ? '' : 'unread'}`;
      notification.dataset.notificationId = notificationId;
      
      notification.innerHTML = `
        <div class="notificacao-content">
          <h3>${item.title}</h3>
          <p>${item.sensor_name}: ${item.description}</p>
          <span class="notificacao-time">${item.dt_time}</span>
        </div>
      `;
      
      notification.addEventListener('click', function() {
        this.classList.remove('unread');
        localStorage.setItem(notificationId, 'read');
      });

      container.insertBefore(notification, container.firstChild);
    });
  })
  .catch(error => console.error('Erro ao buscar notificações:', error));
}

// Função para simular o recebimento de novas notificações
function newNotification(date, title, description, sensor) {
  // Seleciona o container de notificações
  const container = document.querySelector('.notificacoes-container');
  
  // Cria um novo elemento de notificação
  const newNotification = document.createElement('div');
  newNotification.className = 'notificacao-card unread';
  
  // Preenche o conteúdo da notificação
  newNotification.innerHTML = `
    <div class="notificacao-content">
      <h3>${title}</h3>
      <p>${sensor}: ${description}</p>
      <span class="notificacao-time">${date}</span>
    </div>
  `;
  
  // Insere a nova notificação no topo da lista
  container.insertBefore(newNotification, container.firstChild);
  
  // Adiciona evento de clique para marcar como lida
  newNotification.addEventListener('click', function() {
    this.classList.remove('unread');
  });
}

function addAlert(type, userId, sensorId){
  const data = {
    user_id: userId,
    sensor_id: sensorId,
    id_alert_type: type
  };

  fetch(`http://localhost/aquasync/api/control/c_alerta.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(res => res.json().then(result => ({ result, status: res.status })))
  .then(({ result, status }) => {
      if (status === 200) {
        console.log(result.message);
      } else {
        console.log(result.message);
      }
  })
  .catch(error => {
    console.error("Erro na inserção:", error);
    showAlert("Falha na comunicação com o servidor.", "error");
  });
}

// Confere as anomalias
function checkAlerts(){
  const userId = localStorage.getItem("user_id");
  const sensorId = 1;
  const COOLDOWN = 300000;
  const now = Date.now();
  
  fetch(`http://localhost/aquasync/api/control/c_verifica.php?sensor=${sensorId}`)
  .then(response => response.json())
  .then(data => {
      if(data.ex_daily === true && canSendAlert(1, now, COOLDOWN)) {
          addAlert(1, userId, sensorId);
      }
      if(data.ex_monthly === true && canSendAlert(2, now, COOLDOWN)) {
          addAlert(2, userId, sensorId);
      }
      if(data.sus_closed === true && canSendAlert(3, now, COOLDOWN)) {
          addAlert(3, userId, sensorId);
      }
      if(data.sus_24h === true && canSendAlert(4, now, COOLDOWN)) {
          addAlert(4, userId, sensorId);
      }
  })
  .catch(error => console.error('Erro ao buscar dados do sensor:', error));
}

// Função que confere se se passaram 5 minutos após o último envio do alerta, para evitar spam de alertas
function canSendAlert(alertType, currentTime, cooldownTime) {
  const lastAlertTime = localStorage.getItem(`lastAlert_${alertType}`);
  
  // Retorna true se pode enviar (nunca enviou ou cooldown expirou)
  const canSend = !lastAlertTime || (currentTime - parseInt(lastAlertTime)) >= cooldownTime;
  
  if(canSend) {
    localStorage.setItem(`lastAlert_${alertType}`, currentTime.toString());
  }
  
  return canSend;
}

// Conferir anomalias a cada segundo
setInterval(checkAlerts(), 1000);
