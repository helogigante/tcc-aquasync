// Função para carregar dados do sensor selecionado
function loadSensorData(sensorId) {
  console.log(`Carregando dados do sensor: ${sensorId}`);
  
  // Dados de exemplo para vários sensores
  const sensorData = {
    sensor1: {
      lastRecord: "18,5 L/min",
      dailyConsumption: "2450 L",
      averageValue: "15,2 L/min",
      maxFlow: "38,0 L/min",
      minFlow: "8,0 L/min",
      maxFlowTime: "12:45:22",
      minFlowTime: "00:15:10"
    },
    sensor2: {
      lastRecord: "12,3 L/min",
      dailyConsumption: "1850 L",
      averageValue: "10,8 L/min",
      maxFlow: "35,0 L/min",
      minFlow: "6,0 L/min",
      maxFlowTime: "14:20:15",
      minFlowTime: "03:40:05"
    },
    sensor3: {
      lastRecord: "22,1 L/min",
      dailyConsumption: "3120 L",
      averageValue: "18,5 L/min",
      maxFlow: "45,0 L/min",
      minFlow: "10,0 L/min",
      maxFlowTime: "11:30:45",
      minFlowTime: "02:10:30"
    }
  };
  
  // Seleciona os dados do sensor ou usa o sensor1 como padrão
  const data = sensorData[sensorId] || sensorData.sensor1;
  
  // Atualizar a interface com os dados do sensor
  document.getElementById('lastRecord').textContent = data.lastRecord;
  document.getElementById('dailyConsumption').textContent = data.dailyConsumption;
  document.getElementById('averageValue').textContent = data.averageValue;
  document.getElementById('maxFlow').textContent = data.maxFlow;
  document.getElementById('minFlow').textContent = data.minFlow;
  document.getElementById('maxFlowTime').textContent = data.maxFlowTime;
  document.getElementById('minFlowTime').textContent = data.minFlowTime;
  
  // Atualiza o timestamp
  document.getElementById('updateTime').textContent = new Date().toLocaleString('pt-BR');
  
  // Atualizar o gráfico com os dados do sensor
  updateFlowChart(sensorId);
}

// Função para atualizar o gráfico de vazão
function updateFlowChart(sensorId) {
  const canvas = document.getElementById('flowChart');
  
  // Verificar se o canvas existe
  if (!canvas) {
    console.error('Canvas do gráfico não encontrado!');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  
  // Destruir gráfico existente se houver
  if (window.flowChartInstance) {
    window.flowChartInstance.destroy();
  }
  
  // Dados diferentes para cada sensor
  const chartData = {
    sensor1: {
      labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '19:00', '20:00', '22:00'],
      data: [8, 12, 15, 22, 28, 32, 38, 35, 30, 25, 20, 15, 10]
    },
    sensor2: {
      labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '19:00', '20:00', '22:00'],
      data: [6, 10, 13, 18, 24, 28, 32, 30, 26, 22, 18, 14, 9]
    },
    sensor3: {
      labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '19:00', '20:00', '22:00'],
      data: [10, 14, 18, 25, 32, 36, 40, 38, 34, 28, 22, 17, 12]
    }
  };
  
  // Seleciona os dados do gráfico ou usa o sensor1 como padrão
  const data = chartData[sensorId] || chartData.sensor1;
  
  // Criar novo gráfico
  window.flowChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Vazão (L/min)',
        data: data.data,
        borderColor: '#2c74b8',
        backgroundColor: 'rgba(44, 116, 184, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#2c74b8',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: {
            size: 14
          },
          bodyFont: {
            size: 13
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          title: {
            display: true,
            text: 'L/min',
            font: {
              weight: 'bold'
            }
          },
          ticks: {
            font: {
              size: 12
            }
          }
        },
        x: {
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          title: {
            display: true,
            text: 'Horário',
            font: {
              weight: 'bold'
            }
          },
          ticks: {
            font: {
              size: 12
            }
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      }
    }
  });
}

// Configurar o interruptor de registro
function setupValveSwitch() {
  const valveSwitch = document.getElementById('valveSwitch');
  const statusText = document.getElementById('statusText');
  
  if (valveSwitch && statusText) {
    // Configurar estado inicial
    if (valveSwitch.checked) {
      statusText.textContent = "ABERTO";
      statusText.className = "status-text status-open";
    } else {
      statusText.textContent = "FECHADO";
      statusText.className = "status-text status-closed";
    }
    
    // Adicionar evento de mudança
    valveSwitch.addEventListener('change', function() {
      if (this.checked) {
        statusText.textContent = "ABERTO";
        statusText.className = "status-text status-open";
      } else {
        statusText.textContent = "FECHADO";
        statusText.className = "status-text status-closed";
      }
    });
  }
}

// Atualizar o horário de atualização
function updateTime() {
  const now = new Date();
  const options = { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit' 
  };
  const updateTimeElement = document.getElementById('updateTime');
  if (updateTimeElement) {
    updateTimeElement.textContent = now.toLocaleDateString('pt-BR', options);
  }
}

// Função para configurar animações do dropdown
function setupDropdownAnimations() {
  const dropdown = document.getElementById('sensorDropdown');
  const dropdownContainer = document.querySelector('.sensor-dropdown');
  
  if (dropdown && dropdownContainer) {
    // Adicionar classe quando o dropdown estiver em foco
    dropdown.addEventListener('focus', function() {
      dropdownContainer.classList.add('dropdown-focused');
    });
    
    // Remover classe quando perder o foco
    dropdown.addEventListener('blur', function() {
      dropdownContainer.classList.remove('dropdown-focused');
    });
    
    // Feedback visual quando uma opção é selecionada
    dropdown.addEventListener('change', function() {
      // Efeito de confirmação
      dropdownContainer.style.transform = 'scale(0.98)';
      setTimeout(() => {
        dropdownContainer.style.transform = 'scale(1)';
      }, 150);
    });
  }
}

// Inicialização quando o documento estiver carregado
function initHomePage() {
  // Configurar o interruptor de registro
  setupValveSwitch();
  
  // Atualizar o horário imediatamente e a cada minuto
  updateTime();
  setInterval(updateTime, 60000);
  
  // Configurar animações do dropdown
  setupDropdownAnimations();
  
  // Carregar dados do sensor padrão (sensor1)
  setTimeout(() => {
    loadSensorData('sensor1');
  }, 100);
}

// Inicializar a página quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHomePage);
} else {
  initHomePage();
}