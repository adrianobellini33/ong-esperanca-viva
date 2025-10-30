document.addEventListener('DOMContentLoaded', () => {
  const tabelaVol = document.querySelector('#tabelaVoluntarios tbody');
  const tabelaDoacoes = document.querySelector('#tabelaDoacoes tbody');

  // === VOLUNTÁRIOS ===
  const voluntarios = JSON.parse(localStorage.getItem('voluntarios')) || [];

  function carregarVoluntarios() {
    tabelaVol.innerHTML = '';
    voluntarios.forEach((v, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${v.nome}</td>
        <td>${v.email}</td>
        <td>${v.projetos.join(', ')}</td>
        <td>
          <button class="removerVol" data-i="${i}">Remover</button>
          <button class="certificadoVol" data-i="${i}">Certificado</button>
        </td>
      `;
      tabelaVol.appendChild(tr);
    });
  }

  tabelaVol.addEventListener('click', e => {
    if (e.target.classList.contains('removerVol')) {
      const i = e.target.dataset.i;
      voluntarios.splice(i, 1);
      localStorage.setItem('voluntarios', JSON.stringify(voluntarios));
      carregarVoluntarios();
    }

    if (e.target.classList.contains('certificadoVol')) {
      const v = voluntarios[e.target.dataset.i];
      gerarCertificado(v);
    }
  });

  // === DOAÇÕES ===
  const doacoes = JSON.parse(localStorage.getItem('doacoes')) || [];

  function carregarDoacoes() {
    tabelaDoacoes.innerHTML = '';
    doacoes.forEach(d => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${d.nome}</td>
        <td>${d.email}</td>
        <td>R$ ${Number(d.valor).toFixed(2)}</td>
        <td>${d.data}</td>
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
        <p>Certificamos que <strong>${v.nome}</strong></p>
        <p>participou como voluntário(a) nos projetos:</p>
        <p><em>${v.projetos.join(', ')}</em></p>
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

  // === INICIALIZAÇÃO ===
  carregarVoluntarios();
  carregarDoacoes();
});
