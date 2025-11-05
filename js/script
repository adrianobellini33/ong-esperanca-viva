/* =====================================================
   ONG Esperança Viva - script.js
   - Menu responsivo (hamburger)
   - Dropdown acessível
   - Toasts e modal de feedback
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const $ = sel => document.querySelector(sel);
  const $$ = sel => document.querySelectorAll(sel);

  /* ===== MENU MOBILE ===== */
  const hamburger = $('.hamburger');
  const mobilePanel = $('.mobile-panel');

  if (hamburger && mobilePanel) {
    hamburger.addEventListener('click', () => {
      const aberto = mobilePanel.getAttribute('aria-hidden') === 'false';
      mobilePanel.setAttribute('aria-hidden', aberto ? 'true' : 'false');
      hamburger.setAttribute('aria-expanded', !aberto);
    });

    mobilePanel.addEventListener('click', (e) => {
      if (e.target === mobilePanel) {
        mobilePanel.setAttribute('aria-hidden', 'true');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ===== DROPDOWN ===== */
  $$('.has-dropdown').forEach(item => {
    const trigger = item.querySelector('a');
    const menu = item.querySelector('.dropdown');
    trigger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const aberto = menu.style.display === 'block';
        menu.style.display = aberto ? 'none' : 'block';
      }
    });
  });

  /* ===== TOASTS ===== */
  window.showToast = (msg, tempo = 3000) => {
    let container = document.querySelector('.toasts');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toasts';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, tempo);
  };

  /* ===== FORMULÁRIOS (feedback visual) ===== */
  $$('form').forEach(form => {
    form.addEventListener('submit', e => {
      const invalid = form.querySelector(':invalid');
      if (invalid) {
        e.preventDefault();
        invalid.classList.add('is-error');
        invalid.focus();
        showToast('Preencha corretamente os campos obrigatórios!');
      }
    });

    form.addEventListener('input', e => {
      if (e.target.classList.contains('is-error') && e.target.checkValidity()) {
        e.target.classList.remove('is-error');
      }
    });
  });

  // ==============================
// MODO ESCURO E ALTO CONTRASTE
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  // evita duplicar se já existir (útil ao recarregar)
  if (document.querySelector('.theme-toggle')) return;

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'theme-toggle';
  toggleBtn.setAttribute('aria-label', 'Alternar modo de contraste');
  toggleBtn.title = 'Alternar modo de contraste (claro/escuro/alto contraste)';
  toggleBtn.textContent = '🌓';
  document.body.appendChild(toggleBtn);

  // Recupera o tema anterior salvo
  let currentTheme = localStorage.getItem('theme') || 'light';
  applyTheme(currentTheme);

  toggleBtn.addEventListener('click', () => {
    if (currentTheme === 'light') {
      currentTheme = 'dark';
    } else if (currentTheme === 'dark') {
      currentTheme = 'high';
    } else {
      currentTheme = 'light';
    }
    applyTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
  });

  // Permite ativar via teclado (Enter / Space) quando focado
  toggleBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleBtn.click();
    }
  });

  function applyTheme(theme) {
    document.body.classList.remove('dark-mode', 'high-contrast');
    if (theme === 'dark') document.body.classList.add('dark-mode');
    if (theme === 'high') document.body.classList.add('high-contrast');
  }
});
});
