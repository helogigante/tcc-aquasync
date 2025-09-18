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
  loadNotifications();
});

// Função para carregar notificações do localStorage
function loadNotifications() {
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

// Função para simular o recebimento de novas notificações (apenas para demonstração)
function simulateNewNotification() {
  // Seleciona o container de notificações
  const container = document.querySelector('.notificacoes-container');
  
  // Cria um novo elemento de notificação
  const newNotification = document.createElement('div');
  newNotification.className = 'notificacao-card unread';
  
  // Obtém a data e hora atual formatadas
  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR');
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  
  // Preenche o conteúdo da notificação
  newNotification.innerHTML = `
    <div class="notificacao-content">
      <h3>Novo alerta</h3>
      <p>exemplo.</p>
      <span class="notificacao-time">${dateStr} - ${timeStr}</span>
    </div>
  `;
  
  // Insere a nova notificação no topo da lista
  container.insertBefore(newNotification, container.firstChild);
  
  // Adiciona evento de clique para marcar como lida
  newNotification.addEventListener('click', function() {
    this.classList.remove('unread');
  });
}

// Para teste: simula nova notificação a cada 15 segundos (comentado)
// setInterval(simulateNewNotification, 15000);