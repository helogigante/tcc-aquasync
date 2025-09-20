// Calendar.js - funcional, responsivo e pronto para uso

let calendar = {
  month: null,
  year: null,
  container: null,
  months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
           "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
  shortMonths: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", 
                "Jul", "Ago", "Set", "Out", "Nov", "Dez"],

  init: function(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) {
      console.error("Container do calendário não encontrado!");
      return;
    }
    
    const monthSelect = this.container.querySelector("#calendar__month");
    const yearSelect = this.container.querySelector("#calendar__year");

    const today = new Date();
    this.month = today.getMonth();
    this.year = today.getFullYear();

    // Preencher select de meses
    monthSelect.innerHTML = '';
    this.shortMonths.forEach((m, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = m;
      if (i === this.month) opt.selected = true;
      monthSelect.appendChild(opt);
    });

    // Preencher select de anos (5 anos antes e depois)
    yearSelect.innerHTML = '';
    for (let y = this.year - 5; y <= this.year + 5; y++) {
      const opt = document.createElement("option");
      opt.value = y;
      opt.textContent = y;
      if (y === this.year) opt.selected = true;
      yearSelect.appendChild(opt);
    }

    // Eventos de seleção
    monthSelect.addEventListener("change", (e) => {
      this.month = parseInt(e.target.value);
      this.renderDates();
    });

    yearSelect.addEventListener("change", (e) => {
      this.year = parseInt(e.target.value);
      this.renderDates();
    });

    this.renderDates();
    this.setupValveSwitch();
  },

  renderDates: function() {
    const datesContainer = this.container.querySelector(".calendar__dates");
    if (!datesContainer) {
      console.error("Container de datas não encontrado!");
      return;
    }
    
    datesContainer.innerHTML = "";

    const firstDay = new Date(this.year, this.month, 1).getDay(); // domingo=0
    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();

    // Ajustar primeiro dia (segunda = 0)
    let startDay = firstDay === 0 ? 6 : firstDay - 1;

    // Dias do mês anterior (cinza)
    const prevMonthDays = new Date(this.year, this.month, 0).getDate();
    for (let i = startDay; i > 0; i--) {
      const div = document.createElement("div");
      div.className = "calendar__date calendar__date--grey";
      div.textContent = prevMonthDays - i + 1;
      datesContainer.appendChild(div);
    }

    // Dias do mês atual
    const today = new Date();
    for (let d = 1; d <= daysInMonth; d++) {
      const div = document.createElement("div");
      div.className = "calendar__date";
      
      // Destacar o dia atual
      if (d === today.getDate() && 
          this.month === today.getMonth() && 
          this.year === today.getFullYear()) {
        div.classList.add("calendar__date--selected");
      }
      
      // Adicionar indicador de alerta para alguns dias anteriores ao atual
      const currentDate = new Date(this.year, this.month, d);
      if (currentDate < today && currentDate.getDate() % 5 === 0) {
        div.classList.add("calendar__date--alert");
      }
      
      div.textContent = d;
      datesContainer.appendChild(div);
    }

    // Dias do próximo mês para completar a última semana
    const totalCells = datesContainer.children.length;
    const nextDays = (7 - (totalCells % 7)) % 7;
    for (let i = 1; i <= nextDays; i++) {
      const div = document.createElement("div");
      div.className = "calendar__date calendar__date--grey";
      div.textContent = i;
      datesContainer.appendChild(div);
    }
  },

  prevMonth: function() {
    if (this.month === 0) {
      this.month = 11;
      this.year--;
    } else {
      this.month--;
    }
    this.updateSelects();
    this.renderDates();
  },

  nextMonth: function() {
    if (this.month === 11) {
      this.month = 0;
      this.year++;
    } else {
      this.month++;
    }
    this.updateSelects();
    this.renderDates();
  },

  updateSelects: function() {
    this.container.querySelector("#calendar__month").value = this.month;
    this.container.querySelector("#calendar__year").value = this.year;
  },

  setupValveSwitch: function() {
    const valveSwitch = document.getElementById('valveSwitch');
    const statusText = document.getElementById('statusText');
    
    if (valveSwitch && statusText) {
      // Inicializar como aberto (checked)
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
};

// Inicializar automaticamente quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar o calendário
  calendar.init(".calendar");
  
  // Adicionar funções globais para os botões
  window.prevMonth = () => calendar.prevMonth();
  window.nextMonth = () => calendar.nextMonth();
  
  console.log("Calendário inicializado com sucesso!");
});

// Função para setup de seleção de data
function setupDateSelection() {
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('calendar__date')) {
      const date = e.target.getAttribute('data-date');
      const selectedDate = new Date(date);
      const today = new Date();
      
      // Resetar horas para comparar apenas a data
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      // Se a data selecionada for anterior à data atual
      if (selectedDate < today) {
        // Redirecionar para a página de relatórios
        window.location.href = `relatório.html?date=${date}`;
      }
    }
  });
}

// Chame esta função após inicializar o calendário
setupDateSelection();

// Funções para a sidenav
function openNav() {
  document.getElementById("mySidenav").style.width = window.innerWidth > 768 ? "20rem" : "70%";
  document.getElementById("overlay").classList.add("active");
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("overlay").classList.remove("active");
}

function toggleDropdown(event) {
  event.stopPropagation();
  const dropdownContent = event.currentTarget.nextElementSibling;
  const arrow = event.currentTarget.querySelector('.dropdown-arrow');
  
  dropdownContent.classList.toggle('open');
  arrow.style.transform = dropdownContent.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0)';
}

// Fechar o dropdown ao clicar fora dele
document.addEventListener('click', function(e) {
  if (!e.target.closest('.sidenav-dropdown')) {
    const dropdowns = document.querySelectorAll('.sidenav-dropdown-content');
    const arrows = document.querySelectorAll('.dropdown-arrow');
    
    dropdowns.forEach(dropdown => dropdown.classList.remove('open'));
    arrows.forEach(arrow => arrow.style.transform = 'rotate(0)');
  }
});

// Fechar sidenav ao clicar em um link
document.querySelectorAll('.sidenav a').forEach(link => {
  link.addEventListener('click', closeNav);
});