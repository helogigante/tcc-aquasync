function loadSensorData(sensorId) {
  console.log(`Carregando dados reais do sensor: ${sensorId}`);

  fetch(`http://localhost/aquasync/api/control/c_leitura.php?period=day&sensor=${sensorId}&day=${new Date().getDate()}&month=${new Date().getMonth()+1}&year=${new Date().getFullYear()}`)
    .then(response => {
      if (!response.ok) throw new Error('Erro na resposta do servidor');
      return response.json();
    })
    .then(data => {
      console.log('Dados recebidos:', data);

      document.getElementById('lastRecord').textContent =
        data.last_record.value ? `${data.last_record.value} L` : '—';
      document.getElementById('lastRecordTime').textContent =
        data.last_record.time ? `às ${data.last_record.time}` : '—';
      document.getElementById('dailyConsumption').textContent =
        data.total_consumption ? `${data.total_consumption} L` : '—';
      document.getElementById('averageValue').textContent =
        data.average_consumption ? `${data.average_consumption} L/min` : '—';
      document.getElementById('maxFlow').textContent =
        data.highest_consumption?.value ? `${data.highest_consumption.value} L` : '—';
      document.getElementById('maxFlowTime').textContent =
        data.highest_consumption?.time ? `às ${data.highest_consumption.time}` : '—';
      document.getElementById('minFlow').textContent =
        data.lowest_consumption?.value ? `${data.lowest_consumption.value} L` : '—';
      document.getElementById('minFlowTime').textContent =
        data.lowest_consumption?.time ? `às ${data.lowest_consumption.time}` : '—';
      document.getElementById('updateTime').textContent = new Date().toLocaleString('pt-BR');

      updateFlowChart(sensorId, data.timely_consumption);
    })
    .catch(error => {
      console.error('Erro ao buscar dados do sensor:', error);
    });
}

function updateFlowChart(sensorId, timelyData) {
  const canvas = document.getElementById('flowChart');
  const ctx = canvas.getContext('2d');
  if (window.flowChartInstance) window.flowChartInstance.destroy();

  const labels = timelyData ? timelyData.map(d => d.time) : [];
  const values = timelyData ? timelyData.map(d => parseFloat(d.value.replace(',', '.'))) : [];

  window.flowChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Vazão (L/min)',
        data: values,
        borderColor: '#2c74b8',
        backgroundColor: 'rgba(44, 116, 184, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

function setupValveSwitch() {
  const valveSwitch = document.getElementById('valveSwitch');
  const statusText = document.getElementById('statusText');
  
  if (valveSwitch && statusText) {
    valveSwitch.checked = true;
    statusText.textContent = "ABERTO";
    statusText.className = "status-text status-open";
    
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

function setupDropdownAnimations() {
  const dropdown = document.getElementById('sensorDropdown');
  const dropdownContainer = document.querySelector('.sensor-dropdown');
  
  if (dropdown && dropdownContainer) {
    dropdown.addEventListener('focus', function() {
      dropdownContainer.classList.add('dropdown-focused');
    });
    
    dropdown.addEventListener('blur', function() {
      dropdownContainer.classList.remove('dropdown-focused');
    });
    
    dropdown.addEventListener('change', function() {
      dropdownContainer.style.transform = 'scale(0.98)';
      setTimeout(() => {
        dropdownContainer.style.transform = 'scale(1)';
      }, 150);
    });
  }
}

function initHomePage() {
  setupValveSwitch();
  
  updateTime();
  setInterval(updateTime, 60000);
  
  setupDropdownAnimations();
  
  window.addEventListener('load', () => {
    const dropdown = document.getElementById('sensorDropdown');
    if (dropdown) dropdown.value = '1';
    console.log("Carregando dados iniciais da Casa A...");
    loadSensorData('1');
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHomePage);
} else {
  initHomePage();
}