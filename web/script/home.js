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
        label: 'Vazão (L)',
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

// função que configura estado_registro
function setupValveSwitch() {
  const valveSwitch = document.getElementById('valveSwitch');
  const statusText = document.getElementById('statusText');
  const sensorId = 1;
  const userId = localStorage.getItem('user_id');
  let sensorInfo = {}; // armazena nome e valor atuais do sensor

  if (!valveSwitch || !statusText) return;

  // busca o estado atual do registro e salva dados
  fetch(`http://localhost/aquasync/api/control/c_sensor.php?user_id=${userId}&sensor_id=${sensorId}`)
    .then(response => response.json())
    .then(data => {
      console.log("Estado recebido do banco:", data);

      sensorInfo = {
        name: data.sensor_name,
        tariff: data.tariff_value
      };

      const estado = parseInt(data.register_state);
      valveSwitch.checked = estado === 1;

      statusText.textContent = valveSwitch.checked ? "ABERTO" : "FECHADO";
      statusText.className = valveSwitch.checked ? "status-text status-open" : "status-text status-closed";
    })
    .catch(error => console.error("Erro ao buscar estado do registro:", error));

  // quando o switch é alterado
  valveSwitch.addEventListener('change', function () {
    const newState = this.checked ? 1 : 0;

    statusText.textContent = this.checked ? "ABERTO" : "FECHADO";
    statusText.className = this.checked ? "status-text status-open" : "status-text status-closed";

    // atualiza o estado no banco
    fetch(`http://localhost/aquasync/api/control/c_sensor.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sensor_id: sensorId,
        sensor_name: sensorInfo.name,
        tariff_value: sensorInfo.tariff,
        register_state: newState
      })
    })
      .then(response => response.json())
      .then(data => console.log("Estado do registro atualizado:", data))
      .catch(error => console.error("Erro ao atualizar estado:", error));
  });
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

// Função para sincronizar o dropdown da home com atualizações do perfil
function syncSensorDropdown() {
    const dropdown = document.getElementById('sensorDropdown');
    
    // Verificar se há atualizações no localStorage
    const sensorUpdates = JSON.parse(localStorage.getItem('sensorUpdates') || '{}');
    
    Object.keys(sensorUpdates).forEach(sensorId => {
        const update = sensorUpdates[sensorId];
        const option = dropdown.querySelector(`option[value="${sensorId}"]`);
        
        if (option && option.textContent !== update.name) {
            option.textContent = update.name;
            console.log(`Sensor ${sensorId} atualizado para: ${update.name}`);
        }
    });
    
    // Limpar atualizações antigas (mais de 1 hora)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    Object.keys(sensorUpdates).forEach(sensorId => {
        if (sensorUpdates[sensorId].updatedAt < oneHourAgo) {
            delete sensorUpdates[sensorId];
        }
    });
    localStorage.setItem('sensorUpdates', JSON.stringify(sensorUpdates));
}

// função para carregar sensores do usuário na home
function loadUserSensorsInHome() {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    fetch(`http://localhost/aquasync/api/control/c_sensor.php?user_id=${userId}`)
        .then(response => response.json())
        .then(sensors => {
            const dropdown = document.getElementById('sensorDropdown');
            const sensorHeader = document.getElementById('selectedSensorName');

            dropdown.innerHTML = '';

            if (sensors && sensors.length > 0) {
                sensors.forEach(sensor => {
                    const option = document.createElement('option');
                    option.value = sensor.sensor_id;
                    option.textContent = sensor.sensor_name;
                    dropdown.appendChild(option);
                });

                // seleciona o primeiro sensor por padrão
                const firstSensor = sensors[0];
                dropdown.value = firstSensor.sensor_id;

                // atualiza o nome no dropdown
                if (sensorHeader) sensorHeader.textContent = firstSensor.sensor_name;

                // salva no localStorage qual sensor está selecionado
                localStorage.setItem('lastSelectedSensor', firstSensor.sensor_id);

                // carrega dados do primeiro sensor
                loadSensorData(firstSensor.sensor_id);
            } else {
                // sensores padrão
                const defaultSensors = [
                    { sensor_id: '1', sensor_name: 'Casa A' },
                    { sensor_id: '2', sensor_name: 'Casa B' }
                ];

                defaultSensors.forEach(sensor => {
                    const option = document.createElement('option');
                    option.value = sensor.sensor_id;
                    option.textContent = sensor.sensor_name;
                    dropdown.appendChild(option);
                });

                dropdown.value = '1';
                if (sensorHeader) sensorHeader.textContent = '';
                localStorage.setItem('lastSelectedSensor', '1');
                loadSensorData('1');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar sensores:', error);

            const dropdown = document.getElementById('sensorDropdown');
            const sensorHeader = document.getElementById('selectedSensorName');
            const defaultSensors = [
                { sensor_id: '1', sensor_name: 'Casa A' },
                { sensor_id: '2', sensor_name: 'Casa B' }
            ];

            defaultSensors.forEach(sensor => {
                const option = document.createElement('option');
                option.value = sensor.sensor_id;
                option.textContent = sensor.sensor_name;
                dropdown.appendChild(option);
            });

            dropdown.value = '1';
            if (sensorHeader) sensorHeader.textContent = '';
            localStorage.setItem('lastSelectedSensor', '1');
            loadSensorData('1');
        });
}

// essa função inicializa a página home
function initHomePage() {
    updateTime();
    setInterval(updateTime, 1000);
    
    setupDropdownAnimations();
    loadUserSensorsInHome();

    setTimeout(syncSensorDropdown, 500);

    window.addEventListener('load', () => {
        console.log("Carregando dados iniciais...");
        setupValveSwitch();
        setInterval(() => {
            const dropdown = document.getElementById('sensorDropdown');
            if (dropdown && dropdown.value) {
                loadSensorData(dropdown.value);
            }
        }, 1000);
    });
    
    // sincronizar com updates
    window.addEventListener('storage', syncSensorDropdown);
    window.addEventListener('sensorUpdated', (event) => {
        const dropdown = document.getElementById('sensorDropdown');
        const option = dropdown.querySelector(`option[value="${event.detail.sensorId}"]`);
        if (option) {
            option.textContent = event.detail.newName;

            // atualiza o texto acima do dropdown se for o mesmo sensor
            const sensorHeader = document.getElementById('selectedSensorName');
            if (sensorHeader && dropdown.value === String(event.detail.sensorId)) {
                sensorHeader.textContent = event.detail.newName;
            }
        }
    });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHomePage);
} else {
  initHomePage();
}