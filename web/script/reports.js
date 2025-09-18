// ===== FUNÇÃO PRINCIPAL DO CALENDÁRIO =====
function calendario() {
    // Variáveis de estado
    let currentDate = new Date();
    let selectedDate = new Date();
    let currentView = 'month';
    let currentPeriod = 'day'; // day, month, year, decade
    
    // Dias com pontos vermelhos fixos (exemplo: dias 5, 12, 19, 26 de cada mês)
    const redDotDays = [5, 12, 19, 26];
    
    // Inicializar o canvas do gráfico
    const canvas = document.getElementById('flowChart');
    const ctx = canvas.getContext('2d');
    let flowChartInstance = null;
    
    // Elementos para atualização
    const selectedDateElement = document.getElementById('selectedDate');
    const selectedPeriodElement = document.getElementById('selectedPeriod');
    const notificationsList = document.getElementById('notificationsList');
    const weekdaysHeader = document.getElementById('weekdays-header');
    
    // ===== FUNÇÕES DE UTILIDADE =====
    
    // Ajustar tamanho do canvas responsivamente
    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = 250;
    }
    
    // Adicionar listener para redimensionamento da janela
    window.addEventListener('resize', resizeCanvas);
    
    // ===== FUNÇÕES DE RENDERIZAÇÃO =====
    
    // Renderizar a visualização atual
    function renderView() {
        // Mostrar/ocultar cabeçalho dos dias da semana conforme a visualização
        if (currentView === 'month') {
            weekdaysHeader.style.display = 'grid';
        } else {
            weekdaysHeader.style.display = 'none';
        }
        
        // Renderizar a visualização apropriada
        if (currentView === 'month') {
            renderMonthView();
        } else if (currentView === 'year') {
            renderYearView();
        } else if (currentView === 'decade') {
            renderDecadeView();
        }
        
        // Atualizar gráficos e dados
        updateDataDisplay();
    }
    
    // Renderizar a visualização de mês
    function renderMonthView() {
        const calendarDays = document.getElementById('calendar-days');
        const currentViewElement = document.getElementById('current-view');
        
        // Limpa o calendário
        calendarDays.innerHTML = '';
        
        // Atualiza o cabeçalho com mês/ano
        const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        
        currentViewElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        
        // Obtém o primeiro dia do mês e o último dia do mês
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        // Obtém o último dia do mês anterior
        const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        
        // Obtém o dia da semana do primeiro dia (0 = Domingo, 1 = Segunda, etc.)
        const firstDayIndex = firstDay.getDay();
        
        // Dias do mês anterior
        for (let i = firstDayIndex; i > 0; i--) {
            const day = document.createElement('div');
            day.classList.add('day', 'other-month');
            day.textContent = prevMonthLastDay - i + 1;
            calendarDays.appendChild(day);
        }
        
        // Dias do mês atual
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const day = document.createElement('div');
            day.classList.add('day', 'current-month');
            day.textContent = i;
            
            // Verifica se é o dia atual
            const today = new Date();
            if (currentDate.getMonth() === today.getMonth() && 
                currentDate.getFullYear() === today.getFullYear() && 
                i === today.getDate()) {
                day.classList.add('today');
            }
            
            // Verifica se é o dia selecionado
            if (currentDate.getMonth() === selectedDate.getMonth() && 
                currentDate.getFullYear() === selectedDate.getFullYear() && 
                i === selectedDate.getDate()) {
                day.classList.add('selected');
            }
            
            // Adiciona indicador de pontos vermelhos fixos
            if (redDotDays.includes(i)) {
                day.classList.add('has-anomaly');
            }
            
            // Adiciona evento de clique simples para selecionar o dia
            day.addEventListener('click', function() {
                selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
                currentPeriod = 'day';
                renderView();
            });
            
            calendarDays.appendChild(day);
        }
        
        // Dias do próximo mês
        const daysNextMonth = 42 - (firstDayIndex + lastDay.getDate()); // 42 células no total (6 semanas)
        for (let i = 1; i <= daysNextMonth; i++) {
            const day = document.createElement('div');
            day.classList.add('day', 'other-month');
            day.textContent = i;
            calendarDays.appendChild(day);
        }
    }
    
    // Renderizar a visualização de ano
    function renderYearView() {
        const calendarMonths = document.getElementById('calendar-months');
        const currentViewElement = document.getElementById('current-view');
        
        // Limpa o calendário
        calendarMonths.innerHTML = '';
        
        // Atualiza o cabeçalho com o ano
        currentViewElement.textContent = currentDate.getFullYear();
        
        // Nomes dos meses
        const monthNames = [
            'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
            'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
        ];
        
        // Adiciona os meses
        for (let i = 0; i < 12; i++) {
            const month = document.createElement('div');
            month.classList.add('month');
            month.textContent = monthNames[i];
            
            // Destaca o mês atual
            const today = new Date();
            if (i === today.getMonth() && currentDate.getFullYear() === today.getFullYear()) {
                month.classList.add('today');
            }
            
            // Destaca o mês selecionado
            if (i === selectedDate.getMonth() && currentDate.getFullYear() === selectedDate.getFullYear()) {
                month.classList.add('selected');
            }
            
            // Adiciona evento de clique simples para visualizar o mês
            month.addEventListener('click', function() {
                // Atualiza os dados para o mês selecionado
                selectedDate = new Date(currentDate.getFullYear(), i, 1);
                currentPeriod = 'month';
                updateDataDisplay();
            });
            
            // Adiciona evento de duplo clique para navegar para o mês
            month.addEventListener('dblclick', function() {
                currentDate = new Date(currentDate.getFullYear(), i, 1);
                selectedDate = new Date(currentDate.getFullYear(), i, 1);
                currentView = 'month';
                currentPeriod = 'day';
                switchView();
                renderView();
            });
            
            calendarMonths.appendChild(month);
        }
    }
    
    // Renderizar a visualização de década
    function renderDecadeView() {
        const calendarYears = document.getElementById('calendar-years');
        const currentViewElement = document.getElementById('current-view');
        
        // Limpa o calendário
        calendarYears.innerHTML = '';
        
        // Calcula o início da década
        const startYear = Math.floor(currentDate.getFullYear() / 10) * 10;
        
        // Atualiza o cabeçalho com a década
        currentViewElement.textContent = `${startYear} - ${startYear + 9}`;
        
        // Ano anterior (para navegação)
        const prevYear = document.createElement('div');
        prevYear.classList.add('year', 'other-month');
        prevYear.textContent = startYear - 1;
        prevYear.addEventListener('click', function() {
            currentDate.setFullYear(startYear - 10);
            renderView();
        });
        calendarYears.appendChild(prevYear);
        
        // Anos da década
        for (let i = startYear; i < startYear + 10; i++) {
            const year = document.createElement('div');
            year.classList.add('year');
            year.textContent = i;
            
            // Destaca o ano atual
            const today = new Date();
            if (i === today.getFullYear()) {
                year.classList.add('today');
            }
            
            // Destaca o ano selecionado
            if (i === selectedDate.getFullYear()) {
                year.classList.add('selected');
            }
            
            // Adiciona evento de clique simples para visualizar o ano
            year.addEventListener('click', function() {
                // Atualiza os dados para o ano selecionado
                selectedDate = new Date(i, 0, 1);
                currentPeriod = 'year';
                updateDataDisplay();
            });
            
            // Adiciona evento de duplo clique para navegar para o ano
            year.addEventListener('dblclick', function() {
                currentDate = new Date(i, 0, 1);
                selectedDate = new Date(i, 0, 1);
                currentView = 'year';
                currentPeriod = 'month';
                switchView();
                renderView();
            });
            
            calendarYears.appendChild(year);
        }
        
        // Próximo ano (para navegação)
        const nextYear = document.createElement('div');
        nextYear.classList.add('year', 'other-month');
        nextYear.textContent = startYear + 10;
        nextYear.addEventListener('click', function() {
            currentDate.setFullYear(startYear + 10);
            renderView();
        });
        calendarYears.appendChild(nextYear);
    }
    
    // Alternar entre as visualizações
    function switchView() {
        // Oculta todas as visualizações
        document.getElementById('month-view').classList.remove('active-view');
        document.getElementById('year-view').classList.remove('active-view');
        document.getElementById('decade-view').classList.remove('active-view');
        
        // Mostra a visualização atual
        document.getElementById(`${currentView}-view`).classList.add('active-view');
    }
    
    // Formatar data para exibição
    function formatDate(date) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('pt-BR', options);
    }
    
    // Formatar hora para exibição
    function formatTime(date) {
        const options = { hour: '2-digit', minute: '2-digit' };
        return date.toLocaleTimeString('pt-BR', options);
    }
    
    // ===== FUNÇÕES DE ATUALIZAÇÃO DE DADOS =====
    
    // Atualizar a exibição de dados (gráfico e informações)
    function updateDataDisplay() {
        // Atualiza a data exibida
        selectedDateElement.textContent = formatDate(selectedDate);
        
        // Atualiza o subtítulo do período
        updatePeriodSubtitle();
        
        // Atualiza o gráfico de vazão
        drawVazaoChart();
        
        // Atualiza os dados de consumo
        updateConsumoData();
        
        // Atualiza as notificações
        updateNotifications();
    }
    
    // Atualizar o subtítulo do período
    function updatePeriodSubtitle() {
        let subtitle = '';
        
        if (currentPeriod === 'day') {
            subtitle = 'Dados do dia';
        } else if (currentPeriod === 'month') {
            subtitle = `Dados de ${selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`;
        } else if (currentPeriod === 'year') {
            subtitle = `Dados de ${selectedDate.getFullYear()}`;
        } else if (currentPeriod === 'decade') {
            const startYear = Math.floor(selectedDate.getFullYear() / 10) * 10;
            subtitle = `Dados da década ${startYear}-${startYear + 9}`;
        }
        
        selectedPeriodElement.textContent = subtitle;
    }
    
    // Desenhar o gráfico de vazão (estilo do relatorio.html)
    function drawVazaoChart() {
        resizeCanvas();
        
        // Destruir gráfico anterior se existir
        if (flowChartInstance) {
            flowChartInstance.destroy();
        }
        
        // Dados baseados no período selecionado
        let labels = [];
        let flowData = [];
        
        if (currentPeriod === 'day') {
            // Dados por hora para um dia
            labels = Array.from({length: 24}, (_, i) => `${i}:00`);
            flowData = Array.from({length: 24}, () => Math.floor(Math.random() * 25) + 5);
        } else if (currentPeriod === 'month') {
            // Dados por dia para um mês
            const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
            labels = Array.from({length: daysInMonth}, (_, i) => `${i + 1}`);
            flowData = Array.from({length: daysInMonth}, () => Math.floor(Math.random() * 20) + 10);
        } else if (currentPeriod === 'year') {
            // Dados por mês para um ano
            labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            flowData = Array.from({length: 12}, () => Math.floor(Math.random() * 30) + 15);
        } else if (currentPeriod === 'decade') {
            // Dados por ano para uma década
            const startYear = Math.floor(selectedDate.getFullYear() / 10) * 10;
            labels = Array.from({length: 10}, (_, i) => `${startYear + i}`);
            flowData = Array.from({length: 10}, () => Math.floor(Math.random() * 40) + 20);
        }
        
        // Criar novo gráfico no estilo do relatorio.html
        flowChartInstance = new Chart(ctx, {
            type: currentPeriod === 'day' ? 'line' : 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Vazão (L/min)',
                    data: flowData,
                    borderColor: '#253140',
                    backgroundColor: currentPeriod === 'day' ? 'rgba(37, 49, 64, 0.1)' : '#253140',
                    fill: currentPeriod === 'day',
                    tension: 0.4,
                    pointBackgroundColor: '#253140',
                    pointRadius: 3,
                    pointHoverRadius: 5
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Vazão (L/min)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: currentPeriod === 'day' ? 'Hora do dia' : 
                                  currentPeriod === 'month' ? 'Dia do mês' :
                                  currentPeriod === 'year' ? 'Mês' : 'Ano'
                        }
                    }
                }
            }
        });
    }
    
    // Atualizar dados de consumo
    function updateConsumoData() {
        // Gera valores baseados no período selecionado
        let maxFlow, minFlow, totalConsumption, avgPerHour, cost;
        
        if (currentPeriod === 'day') {
            maxFlow = (15 + (selectedDate.getDate() % 10)).toFixed(1);
            minFlow = (5 + (selectedDate.getDate() % 5)).toFixed(1);
            totalConsumption = 2000 + (selectedDate.getDate() * 50);
            avgPerHour = Math.floor(totalConsumption / 24);
            cost = (totalConsumption / 1000 * 5.5).toFixed(2);
        } else if (currentPeriod === 'month') {
            maxFlow = (20 + (selectedDate.getMonth() % 8)).toFixed(1);
            minFlow = (8 + (selectedDate.getMonth() % 4)).toFixed(1);
            totalConsumption = 60000 + (selectedDate.getMonth() * 5000);
            avgPerHour = Math.floor(totalConsumption / 720); // 30 dias * 24 horas
            cost = (totalConsumption / 1000 * 5.5).toFixed(2);
        } else if (currentPeriod === 'year') {
            maxFlow = (25 + (selectedDate.getFullYear() % 10)).toFixed(1);
            minFlow = (10 + (selectedDate.getFullYear() % 5)).toFixed(1);
            totalConsumption = 700000 + ((selectedDate.getFullYear() % 10) * 50000);
            avgPerHour = Math.floor(totalConsumption / 8760); // 365 dias * 24 horas
            cost = (totalConsumption / 1000 * 5.5).toFixed(2);
        } else if (currentPeriod === 'decade') {
            maxFlow = (30 + (selectedDate.getFullYear() % 10)).toFixed(1);
            minFlow = (12 + (selectedDate.getFullYear() % 5)).toFixed(1);
            totalConsumption = 8000000 + ((selectedDate.getFullYear() % 10) * 500000);
            avgPerHour = Math.floor(totalConsumption / 87600); // 10 anos * 365 dias * 24 horas
            cost = (totalConsumption / 1000 * 5.5).toFixed(2);
        }
        
        // Atualizar elementos DOM
        document.getElementById('maxFlow').textContent = `${maxFlow} L/min`;
        document.getElementById('minFlow').textContent = `${minFlow} L/min`;
        document.getElementById('maxFlowTime').textContent = `às ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
        document.getElementById('minFlowTime').textContent = `às ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
        document.getElementById('totalConsumption').textContent = `${totalConsumption} L`;
        document.getElementById('avgPerHour').textContent = `${avgPerHour} L/h`;
        document.getElementById('estimatedCost').textContent = `R$ ${cost}`;
    }
    
    // Gerar notificações de exemplo baseadas no período
    function generateNotificationsForPeriod() {
        const notifications = [];
        let notificationCount = 0;
        
        if (currentPeriod === 'day') {
            // Notificações aparecem apenas em dias múltiplos de 5
            if (selectedDate.getDate() % 5 === 0) {
                notificationCount = Math.floor(Math.random() * 3) + 1;
            }
        } else if (currentPeriod === 'month') {
            // Média de 1-2 notificações por semana no mês
            notificationCount = Math.floor(Math.random() * 8) + 4;
        } else if (currentPeriod === 'year') {
            // Média de 1-2 notificações por mês no ano
            notificationCount = Math.floor(Math.random() * 12) + 12;
        } else if (currentPeriod === 'decade') {
            // Média de 1-2 notificações por ano na década
            notificationCount = Math.floor(Math.random() * 10) + 10;
        }
        
        for (let i = 0; i < notificationCount; i++) {
            let notificationDate;
            
            if (currentPeriod === 'day') {
                const hour = Math.floor(Math.random() * 24);
                const minute = Math.floor(Math.random() * 60);
                notificationDate = new Date(selectedDate);
                notificationDate.setHours(hour, minute);
            } else if (currentPeriod === 'month') {
                const day = Math.floor(Math.random() * 30) + 1;
                const hour = Math.floor(Math.random() * 24);
                notificationDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day, hour);
            } else if (currentPeriod === 'year') {
                const month = Math.floor(Math.random() * 12);
                const day = Math.floor(Math.random() * 28) + 1;
                notificationDate = new Date(selectedDate.getFullYear(), month, day);
            } else if (currentPeriod === 'decade') {
                const year = Math.floor(selectedDate.getFullYear() / 10) * 10 + Math.floor(Math.random() * 10);
                const month = Math.floor(Math.random() * 12);
                notificationDate = new Date(year, month, 1);
            }
            
            const types = [
                "Vazamento detectado",
                "Consumo incomum de água",
                "Pico de consumo",
                "Registro fechado automaticamente",
                "Manutenção preventiva realizada",
                "Sistema atualizado",
                "Relatório mensal gerado",
                "Análise de consumo concluída"
            ];
            
            notifications.push({
                time: notificationDate,
                message: types[Math.floor(Math.random() * types.length)]
            });
        }
        
        // Ordenar notificações por data
        notifications.sort((a, b) => a.time - b.time);
        
        return notifications;
    }
    
    // Atualizar notificações
    function updateNotifications() {
        const notifications = generateNotificationsForPeriod();
        notificationsList.innerHTML = '';
        
        if (notifications.length === 0) {
            notificationsList.innerHTML = '<div class="no-notifications">Nenhuma notificação para este período</div>';
            return;
        }
        
        notifications.forEach(notification => {
            const notificationElement = document.createElement('div');
            notificationElement.className = 'notification-item';
            
            let timeText;
            if (currentPeriod === 'day') {
                timeText = formatTime(notification.time);
            } else if (currentPeriod === 'month') {
                timeText = notification.time.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
            } else if (currentPeriod === 'year') {
                timeText = notification.time.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
            } else if (currentPeriod === 'decade') {
                timeText = notification.time.getFullYear().toString();
            }
            
            notificationElement.innerHTML = `
                <div class="notification-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                </div>
                <div class="notification-content">
                    <div>${notification.message}</div>
                    <div class="notification-time">${timeText}</div>
                </div>
            `;
            
            notificationsList.appendChild(notificationElement);
        });
    }
    
    // ===== INICIALIZAÇÃO E NAVEGAÇÃO =====
    
    // Inicializar eventos de navegação
    function initNavigation() {
        // Botões de navegação anterior/próximo
        document.getElementById('prev-view').addEventListener('click', function() {
            if (currentView === 'month') {
                currentDate.setMonth(currentDate.getMonth() - 1);
            } else if (currentView === 'year') {
                currentDate.setFullYear(currentDate.getFullYear() - 1);
            } else if (currentView === 'decade') {
                currentDate.setFullYear(currentDate.getFullYear() - 10);
            }
            renderView();
        });
        
        document.getElementById('next-view').addEventListener('click', function() {
            if (currentView === 'month') {
                currentDate.setMonth(currentDate.getMonth() + 1);
            } else if (currentView === 'year') {
                currentDate.setFullYear(currentDate.getFullYear() + 1);
            } else if (currentView === 'decade') {
                currentDate.setFullYear(currentDate.getFullYear() + 10);
            }
            renderView();
        });
        
        // Alternar visualizações ao clicar no cabeçalho
        document.getElementById('current-view').addEventListener('click', function() {
            if (currentView === 'month') {
                currentView = 'year';
                currentPeriod = 'month';
            } else if (currentView === 'year') {
                currentView = 'decade';
                currentPeriod = 'year';
            } else {
                currentView = 'month';
                currentPeriod = 'day';
            }
            switchView();
            renderView();
        });
    }
    
    // Inicializar o calendário
    function init() {
        initNavigation();
        switchView();
        renderView();
        resizeCanvas();
        
        // Adicionar elemento de subtítulo do período se não existir
        if (!document.getElementById('selectedPeriod')) {
            const subtitle = document.createElement('div');
            subtitle.id = 'selectedPeriod';
            subtitle.className = 'chart-subtitle';
            selectedDateElement.parentNode.insertBefore(subtitle, selectedDateElement.nextSibling);
        }
    }
    
    // Iniciar quando o DOM estiver carregado
    document.addEventListener('DOMContentLoaded', init);
}

// ===== INICIALIZAR O CALENDÁRIO =====
calendario();