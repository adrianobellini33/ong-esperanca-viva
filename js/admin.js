document.addEventListener('DOMContentLoaded', () => {
  const tabelaVol = document.querySelector('#tabelaVoluntarios tbody');
  const tabelaDoacoes = document.querySelector('#tabelaDoacoes tbody');

  // === VOLUNTÁRIOS ===
  const voluntarios = JSON.parse(localStorage.getItem('voluntarios')) || [];

  function carregarVoluntarios() {
    if (!tabelaVol) return;
    tabelaVol.innerHTML = '';
    voluntarios.forEach((v, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHTML(v.nome)}</td>
        <td>${escapeHTML(v.email)}</td>
        <td>${escapeHTML((v.projetos || []).join(', '))}</td>
        <td>
          <button class="removerVol btn btn-small" data-i="${i}">Remover</button>
          <button class="certificadoVol btn btn-small" data-i="${i}">Certificado</button>
        </td>
      `;
      tabelaVol.appendChild(tr);
    });
  }

  tabelaVol && tabelaVol.addEventListener('click', e => {
    if (e.target.classList.contains('removerVol')) {
      const i = e.target.dataset.i;
      voluntarios.splice(i, 1);
      localStorage.setItem('voluntarios', JSON.stringify(voluntarios));
      carregarVoluntarios();
      showToast('Voluntário removido.');
    }

    if (e.target.classList.contains('certificadoVol')) {
      const v = voluntarios[e.target.dataset.i];
      gerarCertificado(v);
    }
  });

  // === DOAÇÕES ===
  const doacoes = JSON.parse(localStorage.getItem('doacoes')) || [];

  function carregarDoacoes() {
    if (!tabelaDoacoes) return;
    tabelaDoacoes.innerHTML = '';
    doacoes.forEach(d => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHTML(d.nome)}</td>
        <td>${escapeHTML(d.email)}</td>
        <td>R$ ${Number(d.valor).toFixed(2)}</td>
        <td>${escapeHTML(d.data)}</td>
      `;
      tabelaDoacoes.appendChild(tr);
    });
  }

  // === GERAÇÃO DE CERTIFICADO SIMPLES ===
  function gerarCertificado(v) {
    const novaJanela = window.open('', '_blank');
    novaJanela.document.write(`
      <html>
      <head><title>Certificado de Voluntariado</title></head>
      <body style="font-family: Arial; text-align:center; padding:40px;">
        <h1>Certificado de Voluntariado</h1>
        <p>Certificamos que <strong>${escapeHTML(v.nome)}</strong></p>
        <p>participou como voluntário(a) nos projetos:</p>
        <p><em>${escapeHTML((v.projetos || []).join(', '))}</em></p>
        <p>ONG Esperança Viva — ${new Date().getFullYear()}</p>
        <br><br>
        <p>__________________________</p>
        <p>Assinatura da Coordenação</p>
      </body>
      </html>
    `);
    novaJanela.document.close();
    novaJanela.print();
  }

  // === HAMBURGER + MOBILE PANEL ===
  const hamburger = document.querySelector('.hamburger');
  const mobilePanel = document.querySelector('.mobile-panel');
  const mobilePanelClose = document.querySelector('.mobile-panel .close-btn');

  if (hamburger && mobilePanel) {
    hamburger.addEventListener('click', () => {
      const isHidden = mobilePanel.getAttribute('aria-hidden') === 'true' || !mobilePanel.hasAttribute('aria-hidden');
      mobilePanel.setAttribute('aria-hidden', !isHidden ? 'true' : 'false');
      document.body.style.overflow = (!isHidden ? '' : 'hidden');
    });
    mobilePanel.addEventListener('click', (e) => {
      if (e.target === mobilePanel) {
        mobilePanel.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  }
  if (mobilePanelClose) {
    mobilePanelClose.addEventListener('click', () => {
      mobilePanel.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  }

  // === DROPDOWN: keyboard accessible ===
  document.querySelectorAll('.nav .has-dropdown').forEach(node => {
    const link = node.querySelector('a');
    const menu = node.querySelector('.dropdown');
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
      if (e.key === 'Escape') { closeMenu(); }
    });
    node.addEventListener('focusout', (e) => {
      if (!node.contains(e.relatedTarget)) closeMenu();
    });
    function toggleMenu() { const visible = menu.style.display === 'block'; menu.style.display = visible ? 'none' : 'block'; }
    function closeMenu() { menu.style.display = 'none'; }
  });

  // === FORMS: validation helpers ===
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('is-error');
          showElementError(input, 'Campo obrigatório');
          valid = false;
        } else {
          input.classList.remove('is-error');
          input.classList.add('is-success');
          clearElementError(input);
        }
      });
      if (valid) {
        showToast('Formulário enviado com sucesso.');
        const cb = form.dataset.callback;
        if (cb && typeof window[cb] === 'function') window[cb](new FormData(form));
        form.reset();
      } else {
        showToast('Verifique os campos em destaque.', { type: 'warning' });
      }
    });
  });

  function showElementError(el, msg) {
    let hint = el.nextElementSibling;
    if (!hint || !hint.classList.contains('hint')) {
      hint = document.createElement('div');
      hint.className = 'hint';
      el.insertAdjacentElement('afterend', hint);
    }
    hint.textContent = msg;
  }
  function clearElementError(el) {
    const hint = el.nextElementSibling;
    if (hint && hint.classList.contains('hint')) hint.textContent = '';
  }

  // === TOASTS ===
  const toastsContainer = document.querySelector('.toasts') || createToastsContainer();
  function createToastsContainer() {
    const c = document.createElement('div');
    c.className = 'toasts';
    document.body.appendChild(c);
    return c;
  }
  function showToast(message, opts = {}) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.role = 'status';
    toast.innerHTML = `<div class="toast-message">${escapeHTML(message)}</div><button class="toast-close" aria-label="Fechar">✕</button>`;
    toastsContainer.appendChild(toast);
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => toast.remove());
    setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, opts.duration || 6000);
  }

  // === MODAL HELPERS ===
  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.modalOpen;
      const modalBackdrop = document.querySelector(`#${id}`);
      if (modalBackdrop) modalBackdrop.setAttribute('aria-hidden', 'false');
    });
  });
  document.querySelectorAll('.modal-backdrop [data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const backdrop = btn.closest('.modal-backdrop');
      if (backdrop) backdrop.setAttribute('aria-hidden', 'true');
    });
  });

  function escapeHTML(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  carregarVoluntarios();
  carregarDoacoes();
});