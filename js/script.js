/* =====================================================
   ONG Esperança Viva — JavaScript Principal (corrigido)
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==============================
  // FORMULÁRIO DE VOLUNTÁRIO
  // ==============================
  const formCadastro = document.querySelector('#form-cadastro');
  if (formCadastro) {
    formCadastro.addEventListener('submit', (e) => {
      e.preventDefault();

      const nomeEl = document.getElementById('nome');
      const emailEl = document.getElementById('email');
      const telefoneEl = document.getElementById('telefone');

      const nome = nomeEl ? nomeEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim() : '';
      const telefone = telefoneEl ? telefoneEl.value.trim() : '';

      if (!nome || !email || !telefone) {
        showToast('Preencha todos os campos!', 'error');
        return;
      }

      const voluntario = { nome, email, telefone };
      const lista = JSON.parse(localStorage.getItem('voluntarios')) || [];
      lista.push(voluntario);
      localStorage.setItem('voluntarios', JSON.stringify(lista));

      formCadastro.reset();
      showToast('Cadastro realizado com sucesso!', 'success');
    });
  }

  // ==============================
  // TOASTS DE FEEDBACK
  // ==============================
  function showToast(mensagem, tipo = 'info') {
    const area = document.querySelector('.toasts') || criarAreaToasts();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span>${mensagem}</span>
      <button class="toast-close">&times;</button>
    `;
    area.appendChild(toast);
    toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
    setTimeout(() => toast.remove(), 4000);
  }

  function criarAreaToasts() {
    const area = document.createElement('div');
    area.className = 'toasts';
    document.body.appendChild(area);
    return area;
  }

  // ==============================
  // MENU MOBILE / HAMBÚRGUER
  // ==============================
  const btnHamb = document.querySelector('.hamburger');
  const painelMobile = document.querySelector('.mobile-panel');
  if (btnHamb && painelMobile) {
    btnHamb.addEventListener('click', () => {
      const aberto = painelMobile.getAttribute('aria-hidden') === 'false';
      painelMobile.setAttribute('aria-hidden', aberto ? 'true' : 'false');
    });
  }

  // ==============================
  // MODO ESCURO E ALTO CONTRASTE
  // ==============================
  if (!document.querySelector('.theme-toggle')) {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle';
    toggleBtn.setAttribute('aria-label', 'Alternar modo de contraste');
    toggleBtn.title = 'Alternar modo de contraste (claro/escuro/alto contraste)';
    toggleBtn.textContent = '🌓';
    document.body.appendChild(toggleBtn);

    let currentTheme = localStorage.getItem('theme') || 'light';
    aplicarTema(currentTheme);

    toggleBtn.addEventListener('click', () => {
      if (currentTheme === 'light') {
        currentTheme = 'dark';
      } else if (currentTheme === 'dark') {
        currentTheme = 'high';
      } else {
        currentTheme = 'light';
      }
      aplicarTema(currentTheme);
      localStorage.setItem('theme', currentTheme);
    });

    toggleBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleBtn.click();
      }
    });

    function aplicarTema(tema) {
      document.body.classList.remove('dark-mode', 'high-contrast');
      if (tema === 'dark') document.body.classList.add('dark-mode');
      if (tema === 'high') document.body.classList.add('high-contrast');
    }
  }
});
