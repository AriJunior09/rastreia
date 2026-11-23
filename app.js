/**
 * RASTREIA — Aplicação web (fase 1)
 * Login, troca de senha, início e configurações (parâmetros, lojas, vendedores, usuários, histórico).
 */
(function () {
  'use strict';

  /* =========================================================
   *  ESTADO E UTILITÁRIOS
   * ========================================================= */
  const Estado = { usuario: null, base: null };
  const CHAVE_BASE = 'rastreia_base';

  const PERFIS = {
    ADM: 'Administrador',
    CEO: 'CEO',
    MOTORISTA: 'Motorista',
    GERENTE: 'Gerente',
    ESTOQUISTA: 'Estoquista'
  };

  const ICONES = {
    caixa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    sair: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>',
    inicio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>',
    registrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
    lista: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
    config: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    chave: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    loja: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6"/></svg>',
    armazem: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21V8l10-5 10 5v13"/><path d="M6 21v-9h12v9"/><path d="M6 15h12M6 18h12"/></svg>',
    caminhao: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 4h14v12H1z"/><path d="M15 9h4l3 3v4h-7z"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/></svg>',
    certo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    alerta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
    pessoa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg>',
    nuvem: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/><path d="M12 12v5M9.5 14.5L12 12l2.5 2.5"/></svg>',
    seta: '<svg class="seta" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
    sino: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    grafico: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 16v-5M12 16V8M17 16v-8"/></svg>',
    baixar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></svg>',
    rota: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h8.5a3.5 3.5 0 0 0 0-7h-9a3.5 3.5 0 0 1 0-7H16"/></svg>',
    mais: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>'
  };

  const $app = document.getElementById('app');

  function esc(valor) {
    return String(valor === undefined || valor === null ? '' : valor)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function normalizar(texto) {
    return String(texto || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().trim();
  }

  function dataHora(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function data(isoDia) {
    if (!isoDia) return '';
    const p = String(isoDia).slice(0, 10).split('-');
    return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : isoDia;
  }

  function toast(mensagem, erro) {
    let caixa = document.getElementById('avisos-flutuantes');
    if (!caixa) {
      caixa = document.createElement('div');
      caixa.id = 'avisos-flutuantes';
      document.body.appendChild(caixa);
    }
    const el = document.createElement('div');
    el.className = 'toast' + (erro ? ' erro' : '');
    el.textContent = mensagem;
    caixa.appendChild(el);
    setTimeout(function () { el.remove(); }, erro ? 5000 : 2800);
  }

  function carregandoHtml(texto) {
    return '<div class="carregando"><div class="girando"></div>' + esc(texto || 'Carregando...') + '</div>';
  }

  /** Aplica a cor e o logo da empresa (personalização). */
  function aplicarTema(config) {
    config = config || {};
    const cor = /^#[0-9a-fA-F]{6}$/.test(config.cor_principal || '') ? config.cor_principal : '#1d4ed8';
    const mistura = function (hex, alvo, peso) {
      const n = parseInt(hex.slice(1), 16);
      const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(function (v) { return Math.round(v + (alvo - v) * peso); });
      return '#' + c.map(function (v) { return ('0' + v.toString(16)).slice(-2); }).join('');
    };
    const raiz = document.documentElement.style;
    raiz.setProperty('--cor-primaria', cor);
    raiz.setProperty('--cor-primaria-escura', mistura(cor, 0, 0.35));
    raiz.setProperty('--cor-primaria-clara', mistura(cor, 255, 0.85));
    const meta = document.querySelector('meta[name=theme-color]');
    if (meta) meta.setAttribute('content', mistura(cor, 0, 0.35));
  }

  function logoHtml(classe) {
    const logo = Estado.base && Estado.base.config ? Estado.base.config.empresa_logo : ((lerCacheBase() || {}).config || {}).empresa_logo;
    return logo && /^data:image\//.test(logo) ? '<img class="' + classe + '" src="' + esc(logo) + '" alt="">' : '';
  }

  function salvarCacheBase(base) {
    try { localStorage.setItem(CHAVE_BASE, JSON.stringify(base)); } catch (e) { /* ignora */ }
  }

  function lerCacheBase() {
    try { return JSON.parse(localStorage.getItem(CHAVE_BASE) || 'null'); } catch (e) { return null; }
  }

  function lojaPorId(id) {
    return (Estado.base && Estado.base.lojas || []).find(function (l) { return l.id === id; });
  }

  function nomeLoja(id) {
    if (id === 'TODAS') return 'Todas as lojas';
    const l = lojaPorId(id);
    if (!l) return id || '—';
    if (l.tipo === 'CD') return l.nome;
    let nome = l.nome;
    if (l.gerente) nome += ' – ' + l.gerente;
    if (l.cidade) nome += ' (' + l.cidade + ')';
    return nome;
  }

  function seloLoja(id) {
    if (id === 'TODAS') return '<span class="selo">Todas as lojas</span>';
    const l = lojaPorId(id);
    if (!l) return '<span class="selo">' + esc(id || '—') + '</span>';
    if (l.tipo === 'CD') return '<span class="selo cd">' + ICONES.armazem + esc(l.nome) + '</span>';
    return '<span class="selo loja">' + ICONES.loja + esc(nomeLoja(id)) + '</span>';
  }

  function lojasOrdenadas(filtro) {
    return (Estado.base.lojas || [])
      .filter(filtro || function () { return true; })
      .slice()
      .sort(function (a, b) {
        if (a.tipo !== b.tipo) return a.tipo === 'CD' ? 1 : -1;
        return (Number(a.numero) || 0) - (Number(b.numero) || 0);
      });
  }

  function ehAdm() {
    return Estado.usuario && Estado.usuario.perfil === 'ADM';
  }

  async function chamar(acao, dados) {
    try {
      return await Api.chamar(acao, dados);
    } catch (e) {
      if (e.sessaoExpirada) {
        sair(e.message);
        throw e;
      }
      throw e;
    }
  }

  async function recarregarBase() {
    const base = await chamar('dadosBase');
    Estado.base = base;
    Estado.usuario = base.usuario;
    salvarCacheBase(base);
    aplicarTema(base.config);
    return base;
  }

  /* =========================================================
   *  JANELA (MODAL)
   * ========================================================= */
  function abrirJanela(titulo, corpoHtml, opcoes) {
    opcoes = opcoes || {};
    const fundo = document.createElement('div');
    fundo.className = 'janela-fundo';
    fundo.innerHTML =
      '<form class="janela" novalidate>' +
        '<h3>' + esc(titulo) + '</h3>' +
        '<div class="msg-janela"></div>' +
        corpoHtml +
        '<div class="rodape">' +
          (opcoes.extraRodape || '') +
          '<button type="button" class="botao secundario" data-fechar>' + esc(opcoes.textoCancelar || 'Cancelar') + '</button>' +
          '<button type="submit" class="botao">' + esc(opcoes.textoSalvar || 'Salvar') + '</button>' +
        '</div>' +
      '</form>';
    document.body.appendChild(fundo);
    const form = fundo.querySelector('form');
    const fechar = function () { fundo.remove(); };
    fundo.querySelector('[data-fechar]').onclick = fechar;
    fundo.addEventListener('mousedown', function (e) { if (e.target === fundo) fechar(); });
    form.onsubmit = async function (e) {
      e.preventDefault();
      const botao = form.querySelector('button[type=submit]');
      const msg = form.querySelector('.msg-janela');
      msg.innerHTML = '';
      botao.disabled = true;
      const textoOriginal = botao.textContent;
      botao.textContent = 'Salvando...';
      try {
        await opcoes.aoSalvar(form);
        fechar();
      } catch (erro) {
        msg.innerHTML = '<div class="mensagem erro">' + esc(erro.message) + '</div>';
        botao.disabled = false;
        botao.textContent = textoOriginal;
      }
    };
    const primeiro = form.querySelector('input:not([type=checkbox]), select, textarea');
    if (primeiro) setTimeout(function () { primeiro.focus(); }, 50);
    if (opcoes.aoAbrir) opcoes.aoAbrir(form, fechar);
    return form;
  }

  /* =========================================================
   *  TELAS SEM LAYOUT (login, troca de senha obrigatória)
   * ========================================================= */
  function telaSemConfig() {
    $app.innerHTML =
      '<div class="tela-login"><div class="caixa-login">' +
        '<div class="marca">' + ICONES.caixa + '<h1>Rastreia</h1></div>' +
        '<div class="mensagem info">O endereço do servidor ainda não foi configurado.<br><br>' +
        'Abra o arquivo <b>config.js</b> e cole a URL do App da Web do Google Apps Script no campo <b>API_URL</b>.</div>' +
      '</div></div>';
  }

  function telaLogin(mensagem) {
    const empresa = (lerCacheBase() || {}).config ? lerCacheBase().config.empresa_nome : '';
    aplicarTema((lerCacheBase() || {}).config);
    $app.innerHTML =
      '<div class="tela-login"><form class="caixa-login" novalidate>' +
        '<div class="marca">' + (logoHtml('logo-login') || ICONES.caixa) +
          '<h1>Rastreia</h1>' +
          '<p class="sub">' + esc(empresa || 'Controle de transferências') + '</p>' +
        '</div>' +
        (mensagem ? '<div class="mensagem erro">' + esc(mensagem) + '</div>' : '') +
        '<div class="msg"></div>' +
        '<div class="campo"><label for="login">Usuário</label>' +
          '<input id="login" name="login" autocomplete="username" autocapitalize="none" required></div>' +
        '<div class="campo"><label for="senha">Senha</label>' +
          '<input id="senha" name="senha" type="password" autocomplete="current-password" required></div>' +
        '<button class="botao largo" type="submit">Entrar</button>' +
      '</form></div>';
    const form = $app.querySelector('form');
    form.login.focus();
    form.onsubmit = async function (e) {
      e.preventDefault();
      const botao = form.querySelector('button');
      const msg = form.querySelector('.msg');
      msg.innerHTML = '';
      botao.disabled = true;
      botao.textContent = 'Entrando...';
      try {
        const r = await Api.chamar('login', { login: form.login.value, senha: form.senha.value });
        Api.salvarToken(r.token);
        Estado.usuario = r.usuario;
        await recarregarBase();
        if (Estado.usuario.trocar_senha) telaTrocarSenhaObrigatoria();
        else { location.hash = '#/inicio'; rotear(); Fila.sincronizar(); }
      } catch (erro) {
        msg.innerHTML = '<div class="mensagem erro">' + esc(erro.message) + '</div>';
        botao.disabled = false;
        botao.textContent = 'Entrar';
      }
    };
  }

  function formularioSenhaHtml() {
    return '<div class="campo"><label>Senha atual</label><input name="senhaAtual" type="password" autocomplete="current-password" required></div>' +
      '<div class="campo"><label>Nova senha</label><input name="novaSenha" type="password" autocomplete="new-password" required>' +
      '<div class="ajuda">Mínimo de 6 caracteres.</div></div>' +
      '<div class="campo"><label>Repita a nova senha</label><input name="confirmacao" type="password" autocomplete="new-password" required></div>';
  }

  async function enviarTrocaSenha(form) {
    if (form.novaSenha.value !== form.confirmacao.value) throw new Error('A confirmação não confere com a nova senha.');
    await chamar('trocarSenha', { senhaAtual: form.senhaAtual.value, novaSenha: form.novaSenha.value });
    Estado.usuario.trocar_senha = false;
  }

  function telaTrocarSenhaObrigatoria() {
    $app.innerHTML =
      '<div class="tela-login"><form class="caixa-login" novalidate>' +
        '<div class="marca">' + ICONES.chave + '<h1>Crie sua senha</h1>' +
        '<p class="sub">Olá, ' + esc(Estado.usuario.nome) + '. Antes de continuar, troque a senha provisória.</p></div>' +
        '<div class="msg"></div>' + formularioSenhaHtml() +
        '<button class="botao largo" type="submit">Salvar e continuar</button>' +
        '<p style="text-align:center"><a href="#" data-sair>Sair</a></p>' +
      '</form></div>';
    const form = $app.querySelector('form');
    form.querySelector('[data-sair]').onclick = function (e) { e.preventDefault(); sair(); };
    form.onsubmit = async function (e) {
      e.preventDefault();
      const botao = form.querySelector('button');
      const msg = form.querySelector('.msg');
      msg.innerHTML = '';
      botao.disabled = true;
      try {
        await enviarTrocaSenha(form);
        toast('Senha alterada com sucesso.');
        location.hash = '#/inicio';
        rotear();
      } catch (erro) {
        msg.innerHTML = '<div class="mensagem erro">' + esc(erro.message) + '</div>';
        botao.disabled = false;
      }
    };
  }

  function sair(mensagem) {
    Api.salvarToken('');
    Estado.usuario = null;
    location.hash = '';
    telaLogin(mensagem);
  }

  /* =========================================================
   *  LAYOUT PRINCIPAL
   * ========================================================= */
  function itensMenu() {
    const itens = [
      { rota: '#/inicio', texto: 'Início', icone: 'inicio' },
      { rota: '#/registrar', texto: 'Registrar', icone: 'registrar' },
      { rota: '#/transferencias', texto: 'Transferências', icone: 'lista' },
      { rota: '#/rota', texto: 'Rota do motorista', icone: 'rota' },
      { rota: '#/relatorios', texto: 'Relatórios', icone: 'grafico' }
    ];
    if (ehAdm()) itens.push({ separador: true }, { rota: '#/config/lojas', texto: 'Configurações', icone: 'config', prefixo: '#/config' });
    itens.push({ separador: true }, { rota: '#/senha', texto: 'Trocar senha', icone: 'chave' });
    return itens;
  }

  function montarLayout(rotaAtual) {
    const empresa = Estado.base && Estado.base.config ? Estado.base.config.empresa_nome : '';
    const u = Estado.usuario;
    const detalhe = PERFIS[u.perfil] + (u.loja_id ? ' · ' + nomeLoja(u.loja_id) : '');
    const menu = itensMenu().map(function (i) {
      if (i.separador) return '<div class="separador"></div>';
      const ativo = rotaAtual === i.rota || (i.prefixo && rotaAtual.indexOf(i.prefixo) === 0);
      return '<a href="' + i.rota + '" class="' + (ativo ? 'ativo' : '') + (i.breve ? ' desabilitado' : '') + '">' +
        ICONES[i.icone] + esc(i.texto) + (i.breve ? '<span class="etiqueta-breve">' + esc(i.breve) + '</span>' : '') + '</a>';
    }).join('');

    $app.innerHTML =
      '<header class="topo">' +
        '<button class="botao-icone botao-menu" aria-label="Abrir menu">' + ICONES.menu + '</button>' +
        '<div class="titulo">' + logoHtml('logo-topo') + 'Rastreia<small>' + esc(empresa) + '</small></div>' +
        '<div class="usuario"><b>' + esc(u.nome) + '</b><br>' + esc(detalhe) + '</div>' +
        '<button class="botao-icone sino" data-sino title="Notificações" aria-label="Notificações">' + ICONES.sino + '<span class="contador oculto"></span></button>' +
        '<button class="botao-icone" data-sair title="Sair" aria-label="Sair">' + ICONES.sair + '</button>' +
        '<div class="painel-sino oculto"></div>' +
      '</header>' +
      '<div id="faixa-fila"></div>' +
      '<div class="layout">' +
        '<nav class="menu">' + menu + '</nav>' +
        '<div class="fundo-menu"></div>' +
        '<main class="conteudo"></main>' +
      '</div>';

    const nav = $app.querySelector('.menu');
    const fundo = $app.querySelector('.fundo-menu');
    const alternar = function (abrir) { nav.classList.toggle('aberto', abrir); fundo.classList.toggle('aberto', abrir); };
    $app.querySelector('.botao-menu').onclick = function () { alternar(true); };
    fundo.onclick = function () { alternar(false); };
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { alternar(false); }); });
    $app.querySelector('[data-sair]').onclick = function () {
      const n = Fila.lista().length;
      if (confirm(n ? 'Há ' + n + ' registro(s) guardado(s) neste aparelho que ainda não foram enviados. Eles continuam guardados e serão enviados quando você entrar de novo. Deseja sair?' : 'Deseja sair do Rastreia?')) sair();
    };
    atualizarFaixaFila();
    const sino = $app.querySelector('[data-sino]');
    const painel = $app.querySelector('.painel-sino');
    sino.onclick = function (e) {
      e.stopPropagation();
      const abrir = painel.classList.contains('oculto');
      painel.classList.toggle('oculto', !abrir);
      if (abrir) desenharPainelSino();
    };
    painel.onclick = function (e) { e.stopPropagation(); if (e.target.closest('a')) painel.classList.add('oculto'); };
    document.onclick = function () { painel.classList.add('oculto'); };
    atualizarSino(false);
    return $app.querySelector('.conteudo');
  }

  /* =========================================================
   *  SINO DE NOTIFICAÇÕES
   * ========================================================= */
  function guardarResumo(dados) {
    Estado.resumo = { quando: Date.now(), dados: dados };
    desenharContadorSino();
  }

  async function atualizarSino(forcar) {
    if (!forcar && Estado.resumo && Date.now() - Estado.resumo.quando < 120000) { desenharContadorSino(); return; }
    if (!navigator.onLine) return;
    try { guardarResumo(await Api.chamar('resumoInicio')); } catch (e) { /* o sino fica como estava */ }
  }

  function desenharContadorSino() {
    const cont = document.querySelector('[data-sino] .contador');
    if (!cont || !Estado.resumo) return;
    const n = (Estado.resumo.dados.atencao || []).length;
    cont.textContent = n > 99 ? '99+' : String(n);
    cont.classList.toggle('oculto', n === 0);
    const painel = document.querySelector('.painel-sino');
    if (painel && !painel.classList.contains('oculto')) desenharPainelSino();
  }

  function desenharPainelSino() {
    const painel = document.querySelector('.painel-sino');
    if (!painel) return;
    if (!Estado.resumo) { painel.innerHTML = carregandoHtml('Carregando...'); atualizarSino(true); return; }
    const r = Estado.resumo.dados;
    const itens = r.atencao || [];
    painel.innerHTML = '<div class="painel-titulo"><b>Precisam de atenção</b><span>' + itens.length + '</span></div>' +
      '<p class="descricao pequena">Parados há mais de ' + esc(r.dias_alerta_pendente) + ' dias (' + esc(r.dias_alerta_cd) + ' no CD), com volume faltando ou com ocorrência.</p>' +
      (itens.length ? listaArquivosHtml(itens.slice(0, 15), 'ambos') : '<div class="vazio pequeno">Tudo em dia. Nenhum arquivo precisa de atenção.</div>') +
      (itens.length ? '<a class="botao secundario largo" href="#/transferencias?situacao=ATENCAO">Ver todos na lista</a>' : '');
  }

  /* =========================================================
   *  ROTAS
   * ========================================================= */
  const ROTAS = {
    '#/inicio': paginaInicio,
    '#/registrar': paginaRegistrar,
    '#/pendentes': paginaPendentes,
    '#/transferencias': paginaTransferencias,
    '#/relatorios': paginaRelatorios,
    '#/rota': paginaRota,
    '#/config/aparencia': paginaAparencia,
    '#/config/leitura': paginaLeitura,
    '#/senha': paginaSenha,
    '#/config/parametros': paginaParametros,
    '#/config/lojas': paginaLojas,
    '#/config/vendedores': paginaVendedores,
    '#/config/usuarios': paginaUsuarios,
    '#/config/historico': paginaHistorico
  };

  function rotear() {
    if (!Estado.usuario) return;
    if (Estado.usuario.trocar_senha) return telaTrocarSenhaObrigatoria();
    let rota = (location.hash || '#/inicio').split('?')[0];
    if (!ROTAS[rota]) rota = '#/inicio';
    if (rota.indexOf('#/config') === 0 && !ehAdm()) rota = '#/inicio';
    clearInterval(Estado.timerPagina);
    const conteudo = montarLayout(rota);
    ROTAS[rota](conteudo);
  }

  window.addEventListener('hashchange', rotear);

  /* =========================================================
   *  PÁGINA: INÍCIO
   * ========================================================= */
  const CHAVE_RESUMO = 'rastreia_resumo';

  const SITUACOES = {
    SEPARADA: { texto: 'Aguardando coleta', classe: 'separada', icone: 'caixa' },
    COM_MOTORISTA: { texto: 'Com motorista', classe: 'motorista', icone: 'caminhao' },
    NO_CD: { texto: 'No CD', classe: 'cd', icone: 'armazem' },
    ENTREGUE: { texto: 'Entregue', classe: 'ok', icone: 'certo' }
  };

  function seloSituacao(status) {
    const s = SITUACOES[status] || { texto: status || '—', classe: '', icone: '' };
    return '<span class="selo ' + s.classe + '">' + (s.icone ? ICONES[s.icone] : '') + esc(s.texto) + '</span>';
  }

  function tempoTexto(dias) {
    if (dias <= 0) return 'hoje';
    if (dias === 1) return 'há 1 dia';
    return 'há ' + dias + ' dias';
  }

  function nomeLojaCurto(id) {
    const l = lojaPorId(id);
    if (!l) return id || '—';
    if (l.tipo === 'CD') return l.nome;
    return l.nome + (l.gerente ? ' – ' + l.gerente : '');
  }

  /** Lista de arquivos. lado: 'origem' mostra "De ...", 'destino' mostra "Para ...", 'ambos' mostra os dois. */
  function listaArquivosHtml(itens, lado, vazio) {
    if (!itens || !itens.length) return '<div class="vazio pequeno">' + esc(vazio || 'Nenhum arquivo.') + '</div>';
    return '<div class="lista-arquivos">' + itens.map(function (t) {
      let rota;
      if (lado === 'origem') rota = 'De ' + esc(nomeLojaCurto(t.origem_id));
      else if (lado === 'destino') rota = 'Para ' + esc(nomeLojaCurto(t.destino_id));
      else rota = esc(nomeLojaCurto(t.origem_id)) + ' → ' + esc(nomeLojaCurto(t.destino_id));
      const marcas = [];
      if (t.vendedor_nome) marcas.push('<span class="selo vendedor">' + ICONES.pessoa + esc(t.vendedor_nome) + '</span>');
      if (t.total_volumes > 1) marcas.push('<span class="selo">' + t.total_volumes + ' volumes</span>');
      if (t.volumes_pendentes > 0) marcas.push('<span class="selo erro">' + t.volumes_pendentes + (t.volumes_pendentes > 1 ? ' volumes faltando' : ' volume faltando') + '</span>');
      if (t.ocorrencia) marcas.push('<span class="selo erro">Ocorrência</span>');
      if (t.atrasado) marcas.push('<span class="selo aviso">Atrasado</span>');
      return '<a href="#/registrar?arq=' + encodeURIComponent(t.arquivo) + '" class="item-arquivo' + (t.atrasado || t.volumes_pendentes || t.ocorrencia ? ' alerta' : '') + '">' +
        '<div class="item-topo"><span class="numero-arquivo">Arq. ' + esc(t.arquivo) + '</span>' + seloSituacao(t.status) + '</div>' +
        '<div class="item-rota">' + rota + ' <span class="item-tempo">· ' + esc(tempoTexto(t.dias)) + '</span></div>' +
        (marcas.length ? '<div class="lista-chips">' + marcas.join('') + '</div>' : '') +
      '</a>';
    }).join('') + '</div>';
  }

  /* Seções que podem ser abertas/fechadas. A escolha fica guardada no aparelho. */
  const CHAVE_BLOCOS = 'rastreia_blocos_fechados';

  function blocosFechados() {
    try { return JSON.parse(localStorage.getItem(CHAVE_BLOCOS) || '{}'); } catch (e) { return {}; }
  }

  function chaveBloco(titulo) {
    return normalizar(String(titulo).replace(/\s*\(\d+\)\s*$/, '')).replace(/[^A-Z0-9]+/g, '-');
  }

  function blocoHtml(titulo, conteudo, extra) {
    const chave = chaveBloco(titulo);
    const fechado = blocosFechados()[chave] === true;
    return '<details class="bloco" data-bloco="' + esc(chave) + '"' + (fechado ? '' : ' open') + '>' +
      '<summary class="bloco-titulo"><h3>' + ICONES.seta + esc(titulo) + '</h3>' + (extra || '') + '</summary>' +
      '<div class="bloco-corpo">' + conteudo + '</div></details>';
  }

  /** Liga o "guardar aberto/fechado" nas seções de um elemento. */
  function ativarBlocos(el) {
    el.querySelectorAll('details.bloco').forEach(function (d) {
      d.addEventListener('toggle', function () {
        const fechados = blocosFechados();
        if (d.open) delete fechados[d.dataset.bloco]; else fechados[d.dataset.bloco] = true;
        try { localStorage.setItem(CHAVE_BLOCOS, JSON.stringify(fechados)); } catch (e) { /* ignora */ }
      });
    });
  }

  function botoesBlocosHtml() {
    return '<div class="botoes-blocos"><button type="button" class="link" data-blocos="abrir">Expandir tudo</button>' +
      '<span>·</span><button type="button" class="link" data-blocos="fechar">Recolher tudo</button></div>';
  }

  function ativarBotoesBlocos(el) {
    el.querySelectorAll('[data-blocos]').forEach(function (b) {
      b.onclick = function () {
        const abrir = b.dataset.blocos === 'abrir';
        el.querySelectorAll('details.bloco').forEach(function (d) { d.open = abrir; });
      };
    });
  }

  function numeroHtml(valor, rotulo, classe, icone) {
    return '<div class="cartao indicador ' + (classe || '') + '">' +
      (icone ? '<span class="indicador-icone">' + ICONES[icone] + '</span>' : '') +
      '<span class="valor">' + valor + '</span><span class="rotulo">' + esc(rotulo) + '</span></div>';
  }

  function avisoFaseHtml() {
    return '<div class="mensagem info">Os números passam a aparecer quando o registro das transferências começar (fase 2).</div>';
  }

  async function paginaInicio(el) {
    const u = Estado.usuario;
    el.innerHTML =
      '<h2>Olá, ' + esc(u.nome.split(' ')[0]) + '!</h2>' +
      '<p class="descricao">' + esc(PERFIS[u.perfil]) + (u.loja_id ? ' · ' + esc(nomeLoja(u.loja_id)) : ' · Todas as lojas') + '</p>' +
      '<div class="corpo-inicio">' + carregandoHtml('Buscando seus arquivos...') + '</div>';
    const corpo = el.querySelector('.corpo-inicio');

    const carregar = async function (silencioso) {
      let resumo;
      try {
        resumo = await chamar('resumoInicio');
        guardarResumo(resumo);
        try { localStorage.setItem(CHAVE_RESUMO, JSON.stringify({ quando: new Date().toISOString(), resumo: resumo })); } catch (e) { /* ignora */ }
      } catch (erro) {
        if (silencioso) return;
        let cache = null;
        try { cache = JSON.parse(localStorage.getItem(CHAVE_RESUMO) || 'null'); } catch (e) { /* ignora */ }
        if (erro.offline && cache) {
          resumo = cache.resumo;
          corpo.insertAdjacentHTML('beforebegin', '<div class="mensagem aviso">Sem internet: mostrando os números de ' + esc(dataHora(cache.quando)) + '.</div>');
        } else {
          corpo.innerHTML = '<div class="mensagem erro">' + esc(erro.message) + '</div>';
          return;
        }
      }
      if (!document.body.contains(corpo)) return;
      if (resumo.tipo === 'LOJA') desenharInicioLoja(corpo, resumo);
      else desenharInicioGeral(corpo, resumo);
    };
    await carregar(false);
    // Atualiza sozinho a cada minuto (rota do motorista e números)
    Estado.timerPagina = setInterval(function () {
      if (document.visibilityState === 'visible' && navigator.onLine) carregar(true);
    }, 60000);
  }

  /** Aviso para o gerente quando a loja dele está na rota de hoje. */
  function avisoRotaGerente(rota, lojaId, aguardandoColeta) {
    if (!rota || !lojaId) return '';
    const indices = [];
    rota.paradas.forEach(function (p, i) { if (p.loja_id === lojaId) indices.push(i); });
    if (!indices.length) return '';
    // A parada que importa agora: a primeira por onde ele ainda não passou (ou a última, se já passou por todas)
    const idx = indices.filter(function (i) { return !rota.paradas[i].passou_em; })[0];
    const i = idx === undefined ? indices[indices.length - 1] : idx;
    const p = rota.paradas[i];
    const ehChegada = !!p.chegada;
    let texto, classe = 'rota-aviso';
    if (rota.estado === 'NA_PARADA' && rota.indice === i) {
      texto = '<b>O motorista está na sua loja agora!</b>';
      classe += ' agora';
    } else if (rota.estado === 'CONCLUIDA' && ehChegada) {
      texto = 'O motorista voltou para a sua loja às ' + horaCurta(p.passou_em) + '. Rota concluída.';
      classe += ' feito';
    } else if (p.passou_em) {
      texto = 'O motorista já passou na sua loja hoje, às ' + horaCurta(p.passou_em) + '.';
      classe += ' feito';
    } else if (ehChegada) {
      texto = rota.estado === 'VOLTANDO' ? '<b>O motorista está voltando para a sua loja!</b>' : 'O motorista volta para a sua loja no fim da rota.';
      if (rota.estado !== 'VOLTANDO') classe += ' feito';
    } else {
      const proxima = (rota.estado === 'A_CAMINHO' || rota.estado === 'NA_PARADA') && rota.indice + 1 === i;
      texto = '<b>' + (proxima ? 'O motorista está vindo para a sua loja!' : 'O motorista passa na sua loja hoje!') + '</b> Deixe as transferências prontas.' +
        (aguardandoColeta ? '<br><small>' + aguardandoColeta + ' arquivo(s) separado(s) esperando por ele.</small>' : '');
    }
    return '<div class="' + classe + '">' + ICONES.caminhao + '<div>' + texto + '</div></div>';
  }

  function cardMiniHtml(id, titulo, numero, sub, icone, cor, selecionado) {
    return '<button type="button" class="card-mini ' + cor + (selecionado ? ' selecionado' : '') + '" data-card="' + id + '">' +
      '<span class="card-mini-topo"><span class="card-mini-titulo">' + esc(titulo) + '</span>' + ICONES[icone] + '</span>' +
      '<span class="card-mini-numero">' + numero + '</span>' +
      '<span class="card-mini-sub">' + sub + '</span></button>';
  }

  function desenharInicioLoja(corpo, r) {
    const rec = r.recebendo;
    const env = r.enviando;
    let escolhido = 'para-voce';
    try { escolhido = localStorage.getItem('rastreia_card_inicio') || 'para-voce'; } catch (e) { /* ignora */ }
    const partes = [];
    if (rec.com_motorista) partes.push(rec.com_motorista + ' c/ motorista');
    if (rec.no_cd) partes.push(rec.no_cd + ' no CD');
    if (rec.na_origem) partes.push(rec.na_origem + ' na origem');
    const listas = {
      'para-voce': { titulo: 'Arquivos para você', itens: rec.lista, lado: 'origem', vazio: 'Nenhum arquivo a caminho da sua loja.' },
      vendedores: { titulo: 'Encomendas de vendedores', itens: rec.vendedores, lado: 'origem', vazio: 'Nenhuma encomenda de vendedor chegando.', dica: 'Avise o vendedor quando a mercadoria chegar.' },
      coleta: { titulo: 'Aguardando coleta na sua loja', itens: env.lista_coleta, lado: 'destino', vazio: 'Nenhum arquivo esperando o motorista.' },
      enviando: { titulo: 'Sua loja enviando', itens: env.lista_caminho, lado: 'destino', vazio: 'Nenhum arquivo da sua loja a caminho do destino.', dica: 'Arquivos que já saíram da sua loja e ainda não chegaram ao destino.' }
    };
    if (!listas[escolhido]) escolhido = 'para-voce';

    const desenhar = function () {
      const l = listas[escolhido];
      corpo.innerHTML =
        avisoRotaGerente(r.rota, r.loja_id, env.aguardando_coleta) +
        '<div class="cards-mini">' +
          cardMiniHtml('para-voce', 'Arquivos para você', rec.total, partes.length ? partes.join(' · ') : rec.recebidos_7_dias + ' recebido(s) em 7 dias', 'caixa', 'c-azul', escolhido === 'para-voce') +
          cardMiniHtml('vendedores', 'Encomendas de vendedores', rec.vendedores_total !== undefined ? rec.vendedores_total : rec.vendedores.length, 'chegando para vendedores', 'pessoa', 'c-roxo', escolhido === 'vendedores') +
          cardMiniHtml('coleta', 'Aguard. coleta na sua loja', env.aguardando_coleta, 'esperando o motorista', 'armazem', 'c-laranja', escolhido === 'coleta') +
          cardMiniHtml('enviando', 'Sua loja enviando', env.a_caminho, env.entregues_7_dias + ' entregue(s) em 7 dias', 'caminhao', 'c-verde', escolhido === 'enviando') +
        '</div>' +
        (r.rota ? rotaHtml(r.rota, { destaque: r.loja_id }) : '') +
        (r.atencao.length ? blocoHtml('Precisam de atenção (' + r.atencao.length + ')',
          '<p class="descricao pequena">Atrasados (mais de ' + r.dias_alerta_pendente + ' dias parados, ou ' + r.dias_alerta_cd + ' no CD), com volume faltando ou com ocorrência.</p>' +
          listaArquivosHtml(r.atencao, 'ambos'), '<span class="selo erro">' + ICONES.alerta + 'Atenção</span>') : '') +
        '<section class="lista-card"><h3>' + esc(l.titulo) + ' (' + (l.itens || []).length + ')</h3>' +
          (l.dica ? '<p class="descricao pequena">' + esc(l.dica) + '</p>' : '') +
          listaArquivosHtml(l.itens, l.lado, l.vazio) + '</section>';
      ativarBlocos(corpo);
      ativarRota(corpo);
      corpo.querySelectorAll('[data-card]').forEach(function (b) {
        b.onclick = function () {
          escolhido = b.dataset.card;
          try { localStorage.setItem('rastreia_card_inicio', escolhido); } catch (e) { /* ignora */ }
          desenhar();
          const lista = corpo.querySelector('.lista-card');
          if (lista && window.innerWidth < 800) lista.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
      });
    };
    desenhar();
  }

  function desenharInicioGeral(corpo, r) {
    const u = Estado.usuario;
    const podeMontar = u.perfil === 'ADM' || u.perfil === 'CEO';
    let escolhido = 'coleta';
    try { escolhido = localStorage.getItem('rastreia_card_geral') || 'coleta'; } catch (e) { /* ignora */ }
    const listas = {
      coleta: { titulo: 'Aguardando coleta', itens: r.lista_coleta || [], vazio: 'Nenhum arquivo esperando o motorista nas lojas.' },
      vendedores: { titulo: 'Encomendas de vendedores', itens: r.lista_vendedores || [], vazio: 'Nenhuma encomenda de vendedor em aberto.', dica: 'Arquivos pedidos por vendedores que ainda não foram entregues.' },
      cd: { titulo: 'No CD', itens: r.lista_cd || [], vazio: 'Nada parado no CD.' },
      motorista: { titulo: 'Com motorista', itens: r.lista_motorista || [], vazio: 'Nenhum arquivo em trânsito.' }
    };
    if (!listas[escolhido]) escolhido = 'coleta';
    const naRota = {};
    if (r.rota) r.rota.paradas.forEach(function (p) { naRota[p.loja_id] = true; });
    const lojas = (r.lojas || []).filter(function (l) { return lojaPorId(l.loja_id); });
    const marcadas = {};
    lojas.forEach(function (l) { if (l.retirar || l.entregar) marcadas[l.loja_id] = true; });

    const tabelaHtml = function () {
      const total = lojas.reduce(function (a, l) { return { retirar: a.retirar + l.retirar, entregar: a.entregar + l.entregar }; }, { retirar: 0, entregar: 0 });
      return '<section class="cartao tabela-lojas-caixa">' +
        '<div class="tabela-lojas-topo"><h3>Movimento por loja</h3>' +
          '<p class="descricao pequena"><b>Retirar</b>: arquivos separados na loja esperando o motorista. <b>Entregar</b>: arquivos que ainda precisam chegar nessa loja.</p></div>' +
        '<table class="tabela-lojas"><thead><tr>' + (podeMontar ? '<th class="col-marca"></th>' : '') +
          '<th>Loja</th><th class="num">Retirar</th><th class="num">Entregar</th></tr></thead><tbody>' +
        lojas.map(function (l) {
          const loja = lojaPorId(l.loja_id);
          const nome = loja.tipo === 'CD' ? loja.nome : nomeLojaCurto(l.loja_id);
          const vazio = !l.retirar && !l.entregar;
          return '<tr class="' + (vazio ? 'sem-movimento' : '') + (loja.tipo === 'CD' ? ' linha-cd' : '') + '">' +
            (podeMontar ? '<td class="col-marca"><input type="checkbox" data-loja-rota="' + esc(l.loja_id) + '"' + (marcadas[l.loja_id] ? ' checked' : '') + ' aria-label="Incluir na rota"></td>' : '') +
            '<td><span class="nome-loja">' + (loja.tipo === 'CD' ? ICONES.armazem : '') + esc(nome) + '</span>' +
              (loja.cidade ? '<small>' + esc(loja.cidade) + '</small>' : '') +
              (naRota[l.loja_id] ? '<span class="selo na-rota">' + ICONES.caminhao + 'na rota hoje</span>' : '') +
              (l.atrasados ? '<span class="selo aviso">' + l.atrasados + ' atrasado(s)</span>' : '') + '</td>' +
            '<td class="num"><span class="qtd' + (l.retirar ? ' tem retirar' : '') + '">' + l.retirar + '</span></td>' +
            '<td class="num"><span class="qtd' + (l.entregar ? ' tem entregar' : '') + '">' + (loja.tipo === 'CD' ? '—' : l.entregar) + '</span></td></tr>';
        }).join('') +
        '</tbody><tfoot><tr>' + (podeMontar ? '<td></td>' : '') + '<td>Total</td><td class="num">' + total.retirar + '</td><td class="num">' + total.entregar + '</td></tr></tfoot></table>' +
        (podeMontar ? '<div class="barra-acoes acoes-tabela"><span class="descricao pequena">Marque as lojas e monte a rota a partir delas.</span><span class="espaco"></span>' +
          '<button type="button" class="botao" data-montar-rota>' + ICONES.rota + (r.rota ? 'Refazer a rota de hoje' : 'Montar rota de hoje') + '</button></div>' : '') +
      '</section>';
    };

    const desenhar = function () {
      const l = listas[escolhido];
      corpo.innerHTML =
        (r.rota ? rotaHtml(r.rota, { podeMarcar: ['MOTORISTA', 'ADM', 'CEO'].indexOf(u.perfil) >= 0 }) :
          (podeMontar ? '<a class="rota-vazia" href="#/rota">' + ICONES.rota + 'Nenhuma rota para hoje. Toque para montar a rota do motorista.</a>' : '')) +
        '<div class="cards-mini">' +
          cardMiniHtml('coleta', 'Aguardando coleta', r.aguardando_coleta, 'separados nas lojas', 'caixa', 'c-laranja', escolhido === 'coleta') +
          cardMiniHtml('vendedores', 'Encomendas de vendedores', r.vendedores_total || 0, 'ainda não entregues', 'pessoa', 'c-roxo', escolhido === 'vendedores') +
          cardMiniHtml('cd', 'No CD', r.no_cd, 'esperando seguir viagem', 'armazem', 'c-cd', escolhido === 'cd') +
          cardMiniHtml('motorista', 'Com motorista', r.com_motorista, r.entregues_hoje + ' entregue(s) hoje', 'caminhao', 'c-azul', escolhido === 'motorista') +
        '</div>' +
        tabelaHtml() +
        (r.atencao.length ? blocoHtml('Precisam de atenção (' + r.atencao.length + ')',
          '<p class="descricao pequena">Atrasados (mais de ' + r.dias_alerta_pendente + ' dias parados, ou ' + r.dias_alerta_cd + ' no CD), com volume faltando ou com ocorrência.</p>' +
          listaArquivosHtml(r.atencao, 'ambos'), '<span class="selo erro">' + ICONES.alerta + 'Atenção</span>') : '') +
        '<section class="lista-card"><h3>' + esc(l.titulo) + ' (' + l.itens.length + ')</h3>' +
          (l.dica ? '<p class="descricao pequena">' + esc(l.dica) + '</p>' : '') +
          listaArquivosHtml(l.itens, 'ambos', l.vazio) + '</section>';
      ativarBlocos(corpo);
      ativarRota(corpo, function (nova) { r.rota = nova; desenhar(); });
      corpo.querySelectorAll('[data-card]').forEach(function (b) {
        b.onclick = function () {
          escolhido = b.dataset.card;
          try { localStorage.setItem('rastreia_card_geral', escolhido); } catch (e) { /* ignora */ }
          desenhar();
          const lista = corpo.querySelector('.lista-card');
          if (lista && window.innerWidth < 800) lista.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
      });
      corpo.querySelectorAll('[data-loja-rota]').forEach(function (c) {
        c.onchange = function () { if (c.checked) marcadas[c.dataset.lojaRota] = true; else delete marcadas[c.dataset.lojaRota]; };
      });
      const montar = corpo.querySelector('[data-montar-rota]');
      if (montar) montar.onclick = function () {
        const ids = lojas.map(function (l) { return l.loja_id; }).filter(function (id) { return marcadas[id]; });
        if (ids.length < 2) { toast('Marque pelo menos 2 lojas para montar a rota.', true); return; }
        location.hash = '#/rota?lojas=' + ids.join(',');
      };
    };
    desenhar();
  }

  /* =========================================================
   *  ROTA DO MOTORISTA (desenho com o veículo)
   * ========================================================= */
  function horaCurta(iso) {
    return iso ? new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';
  }

  function nomeParada(id) {
    const l = lojaPorId(id);
    if (!l) return { linha1: id, linha2: '' };
    if (l.tipo === 'CD') return { linha1: 'CD', linha2: '' };
    return { linha1: l.nome, linha2: l.cidade || l.gerente || '' };
  }

  function textoEstadoRota(rota) {
    const p = rota.paradas;
    const nome = function (i) { return p[i] ? nomeParada(p[i].loja_id).linha1 : ''; };
    switch (rota.estado) {
      case 'AGUARDANDO': return 'Aguardando a saída da ' + nome(0);
      case 'NA_PARADA': return 'Na ' + nome(rota.indice) + ' desde ' + horaCurta(rota.ultima_hora);
      case 'A_CAMINHO': return 'A caminho da ' + nome(rota.indice + 1);
      case 'VOLTANDO': return 'Voltando para a ' + nome(p.length - 1);
      case 'CONCLUIDA': return 'Rota concluída às ' + horaCurta(rota.ultima_hora);
      default: return '';
    }
  }

  /** Posição do veículo na linha, de 0 a 100. */
  function posicaoVeiculo(rota) {
    const n = rota.paradas.length;
    if (n < 2) return 0;
    const passo = 100 / (n - 1);
    if (rota.estado === 'AGUARDANDO') return 0;
    if (rota.estado === 'A_CAMINHO' || rota.estado === 'VOLTANDO') return Math.min(100, (rota.indice + 0.5) * passo);
    return Math.max(0, rota.indice) * passo;
  }

  /**
   * opcoes: { destaque: id da loja do usuário, podeMarcar: mostra os botões do motorista, titulo }
   */
  function rotaHtml(rota, opcoes) {
    opcoes = opcoes || {};
    const n = rota.paradas.length;
    const pos = posicaoVeiculo(rota);
    const hoje = diaIso(new Date());
    const ehHoje = rota.data === hoje;
    const titulo = opcoes.titulo || (ehHoje ? 'Rota de hoje' : 'Rota de ' + data(rota.data));
    const paradas = rota.paradas.map(function (p, i) {
      const nome = nomeParada(p.loja_id);
      const l = lojaPorId(p.loja_id);
      const classes = ['rota-parada'];
      if (p.passou_em) classes.push('passou');
      if (rota.estado === 'NA_PARADA' && rota.indice === i) classes.push('atual');
      if (opcoes.destaque && p.loja_id === opcoes.destaque) classes.push('minha');
      if (l && l.tipo === 'CD') classes.push('cd');
      const marca = i === 0 ? 'Saída' : (p.chegada ? 'Chegada' : (i === n - 1 ? 'Final' : ''));
      if (p.chegada) classes.push('chegada');
      return '<div class="' + classes.join(' ') + '" style="left:' + (n > 1 ? i * 100 / (n - 1) : 0) + '%">' +
        '<span class="ponto"></span>' +
        '<span class="parada-nome">' + (marca ? '<em>' + marca + '</em>' : '') + esc(nome.linha1) + (nome.linha2 ? '<small>' + esc(nome.linha2) + '</small>' : '') + '</span>' +
        (p.passou_em ? '<span class="parada-hora">✓ ' + horaCurta(p.passou_em) + '</span>' : '') +
      '</div>';
    }).join('');
    const classeVeiculo = 'rota-veiculo' + (rota.estado === 'VOLTANDO' ? ' andando voltando' : '') + (rota.estado === 'A_CAMINHO' ? ' andando' : '') +
      (rota.estado === 'CONCLUIDA' ? ' chegou' : '');
    // Último trecho da volta (pontilhado, com o texto "volta")
    const trechoVolta = rota.volta && n > 1 ? '<div class="rota-trecho-volta" style="left:' + ((n - 2) * 100 / (n - 1)) + '%"><span>volta</span></div>' : '';
    let botoes = '';
    if (opcoes.podeMarcar && ehHoje && rota.estado !== 'CONCLUIDA') {
      const prox = rota.estado === 'AGUARDANDO' ? 0 : rota.indice + 1;
      const botaoParada = function (i, texto) {
        return '<button type="button" class="botao secundario pequeno" data-marcar="PARADA" data-loja="' + esc(rota.paradas[i].loja_id) + '">' + ICONES.certo + texto + esc(nomeParada(rota.paradas[i].loja_id).linha1) + '</button>';
      };
      if (prox > n - 1) {
        botoes = '<button type="button" class="botao secundario pequeno" data-marcar="RETORNO">' + ICONES.certo + 'Encerrar rota</button>';
      } else if (rota.paradas[prox].chegada) {
        botoes = (rota.estado === 'VOLTANDO' ? '' : '<button type="button" class="botao secundario pequeno" data-marcar="RETORNO">' + ICONES.rota + 'Iniciar volta</button> ') +
          botaoParada(prox, 'Cheguei de volta na ');
      } else {
        botoes = botaoParada(prox, prox === 0 ? 'Saindo da ' : 'Cheguei na ');
      }
      botoes = '<div class="rota-botoes">' + botoes + '<span class="descricao pequena">Use quando não houver arquivo para registrar na parada.</span></div>';
    }
    return '<section class="rota-card" data-rota-data="' + esc(rota.data) + '" data-pos="' + pos + '">' +
      '<div class="rota-topo"><span class="rota-titulo">' + ICONES.rota + esc(titulo) + '</span>' +
        '<span class="rota-estado e-' + rota.estado.toLowerCase() + '">' + esc(textoEstadoRota(rota)) + '</span></div>' +
      '<div class="rota-rolagem"><div class="rota-trilha" style="min-width:' + Math.max(200, n * 46) + 'px">' +
        '<div class="rota-linha' + (rota.volta ? ' com-volta' : '') + '" style="' + (rota.volta && n > 1 ? 'right:' + (100 / (n - 1)) + '%' : '') + '"></div>' + trechoVolta +
        '<div class="rota-linha-feita" style="width:' + pos + '%"></div>' +
        paradas +
        '<div class="' + classeVeiculo + '" style="left:' + pos + '%">' + ICONES.caminhao + '</div>' +
      '</div></div>' +
      '<div class="rota-rodape">' + (rota.motorista_nome ? ICONES.pessoa + esc(rota.motorista_nome) : '') +
        (rota.observacao ? '<span>· ' + esc(rota.observacao) + '</span>' : '') + '</div>' +
      botoes +
    '</section>';
  }

  /** Move o veículo suavemente da última posição vista até a nova e liga os botões do motorista. */
  function ativarRota(el, aoMudar) {
    el.querySelectorAll('.rota-card').forEach(function (card) {
      const chave = 'rastreia_rota_pos_' + card.dataset.rotaData;
      const nova = Number(card.dataset.pos);
      const veiculo = card.querySelector('.rota-veiculo');
      let antiga = null;
      try { antiga = localStorage.getItem(chave); } catch (e) { /* ignora */ }
      if (veiculo && antiga !== null && Number(antiga) !== nova && Number(antiga) <= nova) {
        veiculo.style.transition = 'none';
        veiculo.style.left = antiga + '%';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { veiculo.style.transition = ''; veiculo.style.left = nova + '%'; });
        });
      }
      try { localStorage.setItem(chave, String(nova)); } catch (e) { /* ignora */ }
      // Rola a trilha para o veículo ficar à vista no celular
      const rolagem = card.querySelector('.rota-rolagem');
      if (rolagem && rolagem.scrollWidth > rolagem.clientWidth) {
        rolagem.scrollLeft = Math.max(0, (rolagem.scrollWidth * nova / 100) - rolagem.clientWidth / 2);
      }
      card.querySelectorAll('[data-marcar]').forEach(function (b) {
        b.onclick = async function () {
          b.disabled = true;
          try {
            const r = await chamar('marcarRota', { tipo: b.dataset.marcar, loja_id: b.dataset.loja || '' });
            toast(b.dataset.marcar === 'RETORNO' ? 'Retorno iniciado.' : 'Parada marcada.');
            if (aoMudar) aoMudar(r); else rotear();
          } catch (erro) {
            toast(erro.message, true);
            b.disabled = false;
          }
        };
      });
    });
  }

  /* =========================================================
   *  PÁGINA: ROTA DO MOTORISTA (ver e montar)
   * ========================================================= */
  function paginaRota(el) {
    const u = Estado.usuario;
    const podeEditar = u.perfil === 'ADM' || u.perfil === 'CEO';
    const parametros = new URLSearchParams((location.hash.split('?')[1] || ''));
    let dia = parametros.get('data') || diaIso(new Date());
    const mudarDia = function (delta) {
      const d = new Date(dia + 'T12:00:00');
      d.setDate(d.getDate() + delta);
      location.hash = '#/rota?data=' + diaIso(d);
    };
    el.innerHTML =
      '<h2>Rota do motorista</h2><p class="descricao">' + (podeEditar ? 'Monte a rota do dia: a saída, as lojas por onde o motorista passa e a última parada.' : 'Por onde o motorista passa no dia.') + '</p>' +
      '<div class="barra-acoes barra-dia">' +
        '<button type="button" class="botao secundario pequeno" data-dia="-1">◀</button>' +
        '<input type="date" class="campo-dia" value="' + esc(dia) + '">' +
        '<button type="button" class="botao secundario pequeno" data-dia="1">▶</button>' +
        '<button type="button" class="botao secundario pequeno" data-hoje>Hoje</button>' +
      '</div>' +
      '<div class="rota-visao">' + carregandoHtml('Carregando rota...') + '</div>' +
      '<div class="rota-editor"></div>' +
      '<div class="rota-proximas"></div>';
    el.querySelectorAll('[data-dia]').forEach(function (b) { b.onclick = function () { mudarDia(Number(b.dataset.dia)); }; });
    el.querySelector('[data-hoje]').onclick = function () { location.hash = '#/rota'; };
    el.querySelector('.campo-dia').onchange = function (e) { if (e.target.value) location.hash = '#/rota?data=' + e.target.value; };

    const visao = el.querySelector('.rota-visao');
    const editor = el.querySelector('.rota-editor');
    let editorJaUsouSugestao = false;

    const carregar = async function () {
      let r, proximas;
      try {
        [r, proximas] = await Promise.all([chamar('rotaDoDia', { data: dia }), chamar('listarRotas', { de: diaIso(new Date()) })]);
      } catch (erro) {
        visao.innerHTML = '<div class="mensagem erro">' + esc(erro.message) + '</div>';
        return;
      }
      visao.innerHTML = r.rota ? rotaHtml(r.rota, { podeMarcar: ['MOTORISTA', 'ADM', 'CEO'].indexOf(u.perfil) >= 0, destaque: u.loja_id }) :
        '<div class="vazio">Nenhuma rota para ' + (dia === r.hoje ? 'hoje' : data(dia)) + '.</div>';
      ativarRota(visao, function () { carregar(); });
      el.querySelector('.rota-proximas').innerHTML = proximas.length ? blocoHtml('Próximas rotas (' + proximas.length + ')', '<div class="lista-rotas">' + proximas.map(function (p) {
        return '<a href="#/rota?data=' + esc(p.data) + '" class="item-rota-dia' + (p.data === dia ? ' atual' : '') + '"><b>' + esc(data(p.data)) + '</b>' +
          '<span>' + p.paradas.map(function (id) { return esc(nomeParada(id).linha1); }).join(' → ') + (p.volta !== false && p.paradas.length ? ' → volta à ' + esc(nomeParada(p.paradas[0]).linha1) : '') + '</span>' +
          (p.motorista_nome ? '<small>' + esc(p.motorista_nome) + '</small>' : '') + '</a>';
      }).join('') + '</div>') : '';
      ativarBlocos(el.querySelector('.rota-proximas'));
      if (podeEditar) desenharEditor(r, proximas);
    };

    const desenharEditor = function (r, proximas) {
      let paradas = r.rota ? r.rota.paradas.filter(function (p) { return !p.chegada; }).map(function (p) { return p.loja_id; }) : [];
      const sugeridas = (parametros.get('lojas') || '').split(',').filter(function (id) { return lojaPorId(id); });
      const veioDaTabela = sugeridas.length >= 2 && !editorJaUsouSugestao;
      if (veioDaTabela) { paradas = sugeridas; editorJaUsouSugestao = true; }
      let volta = r.rota ? r.rota.volta !== false : true;
      let motoristaId = r.rota ? r.rota.motorista_id : '';
      let observacao = r.rota ? r.rota.observacao : '';
      const opcoesLoja = function (sel) {
        return lojasOrdenadas(function (l) { return l.ativo || l.id === sel; }).map(function (l) {
          return '<option value="' + esc(l.id) + '"' + (l.id === sel ? ' selected' : '') + '>' + esc(l.tipo === 'CD' ? l.nome : nomeLojaCurto(l.id) + (l.cidade ? ' (' + l.cidade + ')' : '')) + '</option>';
        }).join('');
      };
      const desenhar = function () {
        editor.innerHTML = '<form class="cartao form-rota" novalidate>' +
          '<h3 style="margin-top:0">' + (r.rota ? 'Editar' : 'Montar') + ' a rota de ' + esc(data(dia)) + '</h3><div class="msg">' +
            (veioDaTabela ? '<div class="mensagem info">Lojas trazidas da tabela da tela inicial. Arrume a ordem com ▲ ▼ (a primeira é a saída) e clique em <b>Salvar rota</b>.</div>' : '') + '</div>' +
          '<ol class="lista-paradas">' + paradas.map(function (id, i) {
            return '<li><span class="ordem">' + (i === 0 ? 'Saída' : i === paradas.length - 1 && !volta ? 'Final' : (i + 1) + 'ª') + '</span>' +
              '<select data-parada="' + i + '">' + opcoesLoja(id) + '</select>' +
              '<button type="button" class="botao-icone" data-subir="' + i + '" title="Subir"' + (i === 0 ? ' disabled' : '') + '>▲</button>' +
              '<button type="button" class="botao-icone" data-descer="' + i + '" title="Descer"' + (i === paradas.length - 1 ? ' disabled' : '') + '>▼</button>' +
              '<button type="button" class="botao-icone" data-tirar="' + i + '" title="Remover">✕</button></li>';
          }).join('') + '</ol>' +
          '<div class="barra-acoes"><select class="nova-parada"><option value="">+ Adicionar parada...</option>' + opcoesLoja('') + '</select></div>' +
          '<div class="campo"><label class="check"><input type="checkbox" name="volta"' + (volta ? ' checked' : '') + '> Voltar para a saída no fim' +
            (paradas.length ? ' (' + esc(nomeParada(paradas[0]).linha1) + ')' : '') + '</label>' +
            '<div class="ajuda">O sistema coloca a saída de novo como chegada, no fim da linha. Desmarque se o motorista terminar o dia em outro lugar.</div></div>' +
          '<div class="linha-campos">' +
            '<div class="campo"><label>Motorista <span class="opcional">(opcional)</span></label><select name="motorista"><option value="">—</option>' +
              (r.motoristas || []).map(function (m) { return '<option value="' + esc(m.id) + '"' + (motoristaId === m.id ? ' selected' : '') + '>' + esc(m.nome) + '</option>'; }).join('') + '</select></div>' +
            '<div class="campo"><label>Observação <span class="opcional">(opcional)</span></label><input name="observacao" maxlength="300" value="' + esc(observacao) + '"></div>' +
          '</div>' +
          (proximas.filter(function (p) { return p.data !== dia; }).length ? '<div class="campo"><label>Copiar de outra rota</label><select class="copiar"><option value="">—</option>' +
            proximas.filter(function (p) { return p.data !== dia; }).map(function (p, i) { return '<option value="' + i + '">' + esc(data(p.data)) + ': ' + p.paradas.map(function (id) { return esc(nomeParada(id).linha1); }).join(' → ') + '</option>'; }).join('') + '</select></div>' : '') +
          '<div class="barra-acoes"><button type="submit" class="botao">Salvar rota</button>' +
            (r.rota ? '<button type="button" class="botao secundario" data-apagar>Apagar rota do dia</button>' : '') + '</div>' +
        '</form>';
        const form = editor.querySelector('form');
        form.motorista.onchange = function () { motoristaId = form.motorista.value; };
        form.volta.onchange = function () { volta = form.volta.checked; desenhar(); };
        form.observacao.oninput = function () { observacao = form.observacao.value; };
        form.querySelectorAll('[data-parada]').forEach(function (s) { s.onchange = function () { paradas[Number(s.dataset.parada)] = s.value; desenhar(); }; });
        form.querySelectorAll('[data-subir]').forEach(function (b) { b.onclick = function () { const i = Number(b.dataset.subir); paradas.splice(i - 1, 0, paradas.splice(i, 1)[0]); desenhar(); }; });
        form.querySelectorAll('[data-descer]').forEach(function (b) { b.onclick = function () { const i = Number(b.dataset.descer); paradas.splice(i + 1, 0, paradas.splice(i, 1)[0]); desenhar(); }; });
        form.querySelectorAll('[data-tirar]').forEach(function (b) { b.onclick = function () { paradas.splice(Number(b.dataset.tirar), 1); desenhar(); }; });
        form.querySelector('.nova-parada').onchange = function (e) { if (e.target.value) { paradas.push(e.target.value); desenhar(); } };
        const copiar = form.querySelector('.copiar');
        if (copiar) copiar.onchange = function (e) {
          const outras = proximas.filter(function (p) { return p.data !== dia; });
          if (e.target.value !== '') { const o = outras[Number(e.target.value)]; paradas = o.paradas.slice(); volta = o.volta !== false; desenhar(); }
        };
        const salvar = async function (lista) {
          const msg = form.querySelector('.msg');
          try {
            await chamar('salvarRota', { data: dia, paradas: lista, motorista_id: form.motorista.value, observacao: form.observacao.value, volta: volta });
            toast(lista.length ? 'Rota salva.' : 'Rota apagada.');
            Estado.resumo = null;
            carregar();
          } catch (erro) {
            msg.innerHTML = '<div class="mensagem erro">' + esc(erro.message) + '</div>';
          }
        };
        form.onsubmit = function (e) {
          e.preventDefault();
          if (paradas.length < 2) { form.querySelector('.msg').innerHTML = '<div class="mensagem erro">Coloque pelo menos a saída e mais uma parada.</div>'; return; }
          salvar(paradas);
        };
        const apagar = form.querySelector('[data-apagar]');
        if (apagar) apagar.onclick = function () { if (confirm('Apagar a rota de ' + data(dia) + '?')) salvar([]); };
      };
      desenhar();
    };
    carregar();
  }

  /* =========================================================
   *  FILA DE REGISTROS SEM INTERNET
   * ========================================================= */
  const Fila = (function () {
    const CHAVE = 'rastreia_fila';
    let enviando = false;

    function lista() {
      try { return JSON.parse(localStorage.getItem(CHAVE) || '[]'); } catch (e) { return []; }
    }
    function salvar(itens) {
      try { localStorage.setItem(CHAVE, JSON.stringify(itens)); } catch (e) { toast('Não foi possível guardar no aparelho: memória cheia ou bloqueada.', true); }
      atualizarFaixaFila();
    }
    function adicionar(dados) {
      const itens = lista();
      dados.offline = true;
      itens.push({ dados: dados, estado: 'aguardando', guardado_em: new Date().toISOString(), usuario_id: Estado.usuario.id });
      salvar(itens);
    }
    function alterar(idCliente, mudancas) {
      salvar(lista().map(function (i) { return i.dados.id_cliente === idCliente ? Object.assign(i, mudancas) : i; }));
    }
    function remover(idCliente) {
      salvar(lista().filter(function (i) { return i.dados.id_cliente !== idCliente; }));
    }
    async function sincronizar() {
      if (enviando || !navigator.onLine || !Estado.usuario) return;
      const aEnviar = lista().filter(function (i) { return i.estado === 'aguardando' && i.usuario_id === Estado.usuario.id; });
      if (!aEnviar.length) return;
      enviando = true;
      let enviados = 0;
      try {
        for (const item of aEnviar) {
          try {
            const r = await Api.chamar('registrar', item.dados);
            if (r.precisaConfirmar) alterar(item.dados.id_cliente, { estado: 'confirmar', avisos: r.avisos });
            else { remover(item.dados.id_cliente); enviados++; }
          } catch (erro) {
            if (erro.offline) break;
            if (erro.sessaoExpirada) { sair(erro.message); break; }
            alterar(item.dados.id_cliente, { estado: 'erro', mensagem: erro.message });
          }
        }
      } finally {
        enviando = false;
      }
      if (enviados) toast(enviados + ' registro(s) guardado(s) no aparelho foram enviados.');
      const problemas = lista().filter(function (i) { return i.estado !== 'aguardando'; }).length;
      if (problemas) toast(problemas + ' registro(s) precisam da sua atenção. Toque no aviso no topo da tela.', true);
    }
    return { lista: lista, adicionar: adicionar, alterar: alterar, remover: remover, sincronizar: sincronizar };
  })();

  function atualizarFaixaFila() {
    const el = document.getElementById('faixa-fila');
    if (!el || !Estado.usuario) return;
    const meus = Fila.lista().filter(function (i) { return i.usuario_id === Estado.usuario.id; });
    const aguardando = meus.filter(function (i) { return i.estado === 'aguardando'; }).length;
    const problemas = meus.length - aguardando;
    if (!meus.length) { el.innerHTML = ''; return; }
    el.innerHTML = '<a href="#/pendentes" class="faixa-fila' + (problemas ? ' problema' : '') + '">' +
      (problemas ? ICONES.alerta + problemas + ' registro(s) precisam da sua atenção' + (aguardando ? ' · ' : '') : '') +
      (aguardando ? ICONES.nuvem + aguardando + ' registro(s) guardado(s) no aparelho, aguardando internet' : '') +
      '<span class="ver">Ver</span></a>';
  }

  function novoIdCliente() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  /* =========================================================
   *  PÁGINA: REGISTRAR
   * ========================================================= */
  const NOMES_STATUS = {
    SEPARADA: { titulo: 'Separada na loja', sub: 'Pronta, aguardando o motorista', icone: 'caixa' },
    COM_MOTORISTA: { titulo: 'Com motorista', sub: 'Coletei / estou levando', icone: 'caminhao' },
    NO_CD: { titulo: 'No CD', sub: 'Deixei no Centro de Distribuição', icone: 'armazem' },
    ENTREGUE: { titulo: 'Entregue no destino', sub: 'Chegou na loja de destino', icone: 'certo' }
  };
  const PROXIMOS = { '': ['SEPARADA'], SEPARADA: ['COM_MOTORISTA'], COM_MOTORISTA: ['ENTREGUE', 'NO_CD'], NO_CD: ['COM_MOTORISTA'], ENTREGUE: [] };
  const TIPOS_OCORRENCIA = ['Volume faltando', 'Volume a mais ou errado', 'Avaria', 'Etiqueta errada ou ilegível', 'Outro'];
  const Registro = { ultimoStatus: '', ultimos: [] };

  function lojaDoUsuario() {
    return lojaPorId(Estado.usuario.loja_id);
  }

  /** Mesma regra do servidor: o que este usuário pode registrar. */
  function permitidosLocal(origemId, destinoId) {
    const u = Estado.usuario;
    if (u.perfil === 'ADM' || u.perfil === 'CEO') return ['SEPARADA', 'COM_MOTORISTA', 'NO_CD', 'ENTREGUE'];
    if (u.perfil === 'MOTORISTA') return ['COM_MOTORISTA', 'NO_CD', 'ENTREGUE'];
    const loja = lojaDoUsuario();
    if (loja && loja.tipo === 'CD') return ['COM_MOTORISTA', 'NO_CD'];
    const lista = [];
    if (!origemId || origemId === u.loja_id) lista.push('SEPARADA');
    if (!destinoId || destinoId === u.loja_id) lista.push('ENTREGUE');
    return lista;
  }

  function opcoesLojas(selecionada) {
    return '<option value="">Selecione...</option>' +
      lojasOrdenadas(function (l) { return l.tipo === 'LOJA' && (l.ativo || l.id === selecionada); }).map(function (l) {
        return '<option value="' + esc(l.id) + '"' + (l.id === selecionada ? ' selected' : '') + '>' + esc(nomeLoja(l.id)) + '</option>';
      }).join('');
  }

  function linhaDoTempoHtml(eventos) {
    if (!eventos || !eventos.length) return '';
    return '<ol class="linha-tempo">' + eventos.slice().reverse().map(function (e) {
      let titulo;
      if (e.status === 'OCORRENCIA') titulo = 'Ocorrência';
      else if (e.status === 'OCORRENCIA_RESOLVIDA') titulo = 'Ocorrência resolvida';
      else titulo = (NOMES_STATUS[e.status] || { titulo: e.status }).titulo;
      let local = '';
      if (e.local_id) local = ' · ' + nomeLojaCurto(e.local_id);
      return '<li class="' + (String(e.status).indexOf('OCORRENCIA') === 0 ? 'ocorrencia' : '') + '"><b>' + esc(titulo) + '</b>' +
        (e.volumes && e.volumes.indexOf(',') < 0 && e.volumes !== '1' ? ' (vol. ' + esc(e.volumes) + ')' : e.volumes && e.volumes.indexOf(',') >= 0 ? ' (vol. ' + esc(e.volumes) + ')' : '') +
        esc(local) + '<br><small>' + esc(dataHora(e.data_hora)) + ' · ' + esc(e.usuario_nome) + (e.observacao ? ' · ' + esc(e.observacao) : '') + '</small></li>';
    }).join('') + '</ol>';
  }

  function paginaRegistrar(el) {
    const u = Estado.usuario;
    const parametros = new URLSearchParams((location.hash.split('?')[1] || ''));
    const cds = lojasOrdenadas(function (l) { return l.tipo === 'CD' && l.ativo; });
    const lojaU = lojaDoUsuario();
    const ehCelular = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    let consulta = null;   // resposta de consultarArquivo
    let consultando = 0;
    let ultimoConsultado = ''; // evita consultar (e redesenhar) de novo o mesmo número
    let lidoPelaCamera = false;

    el.innerHTML =
      '<h2>Registrar</h2><p class="descricao">Fotografe a etiqueta ou digite o número do arquivo, confira os dados e escolha a situação.</p>' +
      '<form class="cartao form-registro" novalidate autocomplete="off">' +
        '<div class="area-camera">' +
          '<label class="botao largo grande botao-camera">' + ICONES.registrar + (ehCelular ? 'Ler etiqueta com a câmera' : 'Enviar foto da etiqueta') +
            '<input type="file" accept="image/*" capture="environment" class="entrada-foto"></label>' +
          '<div class="resultado-leitura"></div>' +
          '<div class="ou"><span>ou digite</span></div>' +
        '</div>' +
        '<div class="msg"></div>' +
        '<div class="campo"><label for="arq">Número do arquivo</label>' +
          '<input id="arq" name="arquivo" class="campo-arquivo" inputmode="numeric" pattern="[0-9]*" placeholder="Ex.: 64425" maxlength="8"></div>' +
        '<div class="info-arquivo"></div>' +
        '<div class="linha-campos">' +
          '<div class="campo"><label>De (origem)</label><select name="origem_id">' + opcoesLojas('') + '</select></div>' +
          '<div class="campo"><label>Para (destino)</label><select name="destino_id">' + opcoesLojas('') + '</select></div>' +
        '</div>' +
        '<div class="linha-campos">' +
          '<div class="campo"><label>Total de volumes</label><input name="total_volumes" type="number" min="1" max="99" value="1" inputmode="numeric"></div>' +
          '<div class="campo"><label>Vendedor <span class="opcional">(opcional)</span></label><input name="vendedor_nome" list="lista-vendedores" placeholder="Ex.: Julio">' +
            '<datalist id="lista-vendedores"></datalist></div>' +
        '</div>' +
        '<div class="campo campo-volumes oculto"><label>Quais volumes</label><div class="volumes"></div>' +
          '<div class="ajuda">Desmarque os volumes que não estão com você agora.</div></div>' +
        '<div class="campo"><label>Situação</label><div class="opcoes-status"></div></div>' +
        '<div class="campo campo-cd oculto"><label>Em qual CD?</label><select name="cd_id">' +
          cds.map(function (c) { return '<option value="' + esc(c.id) + '">' + esc(c.nome) + '</option>'; }).join('') + '</select></div>' +
        '<div class="campo"><label>Observação <span class="opcional">(opcional)</span></label><input name="observacao" maxlength="300"></div>' +
        '<button type="submit" class="botao largo grande">Registrar</button>' +
      '</form>' +
      '<div class="ultimos"></div>';

    const form = el.querySelector('form');
    const msg = form.querySelector('.msg');
    const info = form.querySelector('.info-arquivo');

    const atualizarVendedores = function () {
      const destino = form.destino_id.value;
      const nomes = Estado.base.vendedores.filter(function (v) { return v.ativo && (!destino || v.loja_id === destino || v.loja_id === 'TODAS'); })
        .map(function (v) { return v.nome; }).sort();
      form.querySelector('#lista-vendedores').innerHTML = nomes.map(function (n) { return '<option value="' + esc(n) + '">'; }).join('');
    };

    const volumesSelecionados = function () {
      return Array.from(form.querySelectorAll('input[name=vol]:checked')).map(function (c) { return Number(c.value); });
    };

    const desenharVolumes = function () {
      const total = Math.max(1, Math.min(99, parseInt(form.total_volumes.value, 10) || 1));
      const campo = form.querySelector('.campo-volumes');
      campo.classList.toggle('oculto', total < 2);
      const antes = volumesSelecionados();
      const vs = consulta && consulta.transferencia ? consulta.transferencia.volumes_status : {};
      let html = '';
      for (let i = 1; i <= total; i++) {
        const marcado = !antes.length || antes.indexOf(i) >= 0 || i > (form.querySelectorAll('input[name=vol]').length);
        const sit = vs[i] ? (NOMES_STATUS[vs[i]] || {}).titulo : '';
        html += '<label class="chip-volume"><input type="checkbox" name="vol" value="' + i + '"' + (marcado ? ' checked' : '') + '>' +
          '<span>' + i + '/' + total + (sit ? '<small>' + esc(sit) + '</small>' : '') + '</span></label>';
      }
      form.querySelector('.volumes').innerHTML = html;
      form.querySelectorAll('input[name=vol]').forEach(function (c) { c.onchange = desenharStatus; });
    };

    const statusAtualDosVolumes = function () {
      if (!consulta || !consulta.transferencia) return '';
      const t = consulta.transferencia;
      const vs = t.volumes_status || {};
      const sel = volumesSelecionados();
      const lista = (sel.length ? sel : [1]).map(function (v) { return vs[v] || (Object.keys(vs).length ? '' : t.status); });
      return lista[0] || '';
    };

    const desenharStatus = function () {
      const origem = form.origem_id.value;
      const destino = form.destino_id.value;
      const permitidos = consulta && consulta.permitidos && consulta.existe ? consulta.permitidos : permitidosLocal(origem, destino);
      const atual = statusAtualDosVolumes();
      const sugeridos = PROXIMOS[atual] || [];
      let escolhido = (form.querySelector('input[name=status]:checked') || {}).value;
      if (!escolhido || permitidos.indexOf(escolhido) < 0) {
        escolhido = sugeridos.filter(function (s) { return permitidos.indexOf(s) >= 0; })[0] ||
          (permitidos.indexOf(Registro.ultimoStatus) >= 0 ? Registro.ultimoStatus : '') ||
          (permitidos.length === 1 ? permitidos[0] : '');
      }
      const caixa = form.querySelector('.opcoes-status');
      if (!permitidos.length) {
        caixa.innerHTML = '<div class="mensagem erro">Seu perfil não pode registrar este arquivo' +
          (u.loja_id ? ' (a ' + esc(nomeLojaCurto(u.loja_id)) + ' não é origem nem destino).' : '.') + '</div>';
      } else {
        caixa.innerHTML = ['SEPARADA', 'COM_MOTORISTA', 'NO_CD', 'ENTREGUE'].filter(function (s) { return permitidos.indexOf(s) >= 0; }).map(function (s) {
          const n = NOMES_STATUS[s];
          const atualTxt = s === atual ? '<em class="tag-atual">Situação atual</em>' : (sugeridos.indexOf(s) === 0 ? '<em class="tag-proximo">Próximo passo</em>' : '');
          return '<label class="opcao-status s-' + s.toLowerCase() + '"><input type="radio" name="status" value="' + s + '"' + (s === escolhido ? ' checked' : '') + '>' +
            '<span class="opcao-icone">' + ICONES[n.icone] + '</span><span class="opcao-texto"><b>' + esc(n.titulo) + '</b><small>' + esc(n.sub) + '</small></span>' + atualTxt + '</label>';
        }).join('');
        caixa.querySelectorAll('input[name=status]').forEach(function (r) { r.onchange = ajustarCd; });
      }
      ajustarCd();
    };

    const ajustarCd = function () {
      const st = (form.querySelector('input[name=status]:checked') || {}).value;
      const precisa = st === 'NO_CD' && cds.length > 1 && !(lojaU && lojaU.tipo === 'CD');
      form.querySelector('.campo-cd').classList.toggle('oculto', !precisa);
    };

    const travarLojas = function (travar) {
      form.origem_id.disabled = travar;
      form.destino_id.disabled = travar;
    };

    const limparConsulta = function () {
      consulta = null;
      info.innerHTML = '';
      travarLojas(false);
    };

    const preencherNovo = function () {
      travarLojas(false);
      if ((u.perfil === 'GERENTE' || u.perfil === 'ESTOQUISTA') && lojaU && lojaU.tipo === 'LOJA' && !form.origem_id.value && !form.destino_id.value) {
        form.origem_id.value = u.loja_id;
      }
    };

    const mostrarConsulta = function () {
      if (!consulta) return;
      if (consulta.semAcesso) {
        info.innerHTML = '<div class="mensagem erro">O arquivo ' + esc(consulta.arquivo) + ' existe, mas não envolve a sua loja.</div>';
        return;
      }
      if (!consulta.existe) {
        info.innerHTML = '<div class="mensagem info">Arquivo novo: ainda não foi registrado. Preencha origem, destino e volumes.</div>';
        preencherNovo();
        return;
      }
      const t = consulta.transferencia;
      form.origem_id.value = t.origem_id;
      form.destino_id.value = t.destino_id;
      form.total_volumes.value = t.total_volumes;
      form.vendedor_nome.value = t.vendedor_nome || '';
      travarLojas(true);
      const pend = t.total_volumes - Object.keys(t.volumes_status || {}).filter(function (k) { return t.volumes_status[k] === t.status; }).length;
      info.innerHTML =
        '<div class="cartao-arquivo">' +
          '<div class="item-topo"><span class="numero-arquivo">Arq. ' + esc(t.arquivo) + '</span>' + seloSituacao(t.status) + '</div>' +
          '<div class="item-rota">' + esc(nomeLojaCurto(t.origem_id)) + ' → ' + esc(nomeLojaCurto(t.destino_id)) +
            ' <span class="item-tempo">· desde ' + esc(dataHora(t.status_desde)) + '</span></div>' +
          '<div class="lista-chips">' +
            (t.vendedor_nome ? '<span class="selo vendedor">' + ICONES.pessoa + esc(t.vendedor_nome) + '</span>' : '') +
            (t.total_volumes > 1 ? '<span class="selo">' + t.total_volumes + ' volumes</span>' : '') +
            (Object.keys(t.volumes_status || {}).length && pend > 0 ? '<span class="selo erro">' + pend + ' volume(s) ainda não lido(s) nesta etapa</span>' : '') +
          '</div>' +
          (t.ocorrencia ? '<div class="mensagem erro ocorrencia-aberta"><b>Ocorrência:</b> ' + esc(t.ocorrencia) + '</div>' : '') +
          '<details><summary>Ver histórico (' + consulta.eventos.length + ')</summary>' + linhaDoTempoHtml(consulta.eventos) + '</details>' +
          '<div class="acoes-arquivo">' +
            (t.ocorrencia ? '<button type="button" class="botao secundario pequeno" data-resolver>Resolver ocorrência</button>' : '') +
            '<button type="button" class="botao secundario pequeno" data-ocorrencia>' + ICONES.alerta + 'Registrar ocorrência</button>' +
          '</div>' +
        '</div>';
      const bOc = info.querySelector('[data-ocorrencia]');
      if (bOc) bOc.onclick = function () { formOcorrencia(t.arquivo, function () { consultar(true); }); };
      const bRes = info.querySelector('[data-resolver]');
      if (bRes) bRes.onclick = function () { formResolverOcorrencia(t.arquivo, function () { consultar(true); }); };
    };

    const consultar = async function (forcar) {
      const arquivo = form.arquivo.value.replace(/\D/g, '');
      if (arquivo.length < 3) { ultimoConsultado = ''; limparConsulta(); desenharVolumes(); desenharStatus(); return; }
      if (!forcar && ultimoConsultado === String(Number(arquivo))) return;
      ultimoConsultado = String(Number(arquivo));
      if (!navigator.onLine) {
        consulta = null;
        info.innerHTML = '<div class="mensagem aviso">Sem internet: não dá para consultar o arquivo agora. O registro será guardado no aparelho e enviado depois.</div>';
        preencherNovo();
        desenharVolumes(); desenharStatus();
        return;
      }
      const minha = ++consultando;
      info.innerHTML = '<div class="carregando pequeno"><div class="girando"></div>Consultando arquivo...</div>';
      try {
        const r = await chamar('consultarArquivo', { arquivo: arquivo });
        if (minha !== consultando) return;
        consulta = r;
        mostrarConsulta();
      } catch (erro) {
        if (minha !== consultando) return;
        consulta = null;
        info.innerHTML = erro.offline
          ? '<div class="mensagem aviso">Sem internet: o registro será guardado no aparelho e enviado depois.</div>'
          : '<div class="mensagem erro">' + esc(erro.message) + '</div>';
        preencherNovo();
      }
      desenharVolumes();
      atualizarVendedores();
      desenharStatus();
    };

    let espera;
    form.arquivo.oninput = function () {
      form.arquivo.value = form.arquivo.value.replace(/\D/g, '');
      clearTimeout(espera);
      if (ultimoConsultado && ultimoConsultado !== String(Number(form.arquivo.value))) {
        ultimoConsultado = '';
        limparConsulta();
        form.origem_id.value = ''; form.destino_id.value = ''; form.total_volumes.value = 1; form.vendedor_nome.value = '';
        desenharVolumes(); desenharStatus();
      }
      if (form.arquivo.value.length >= 5) espera = setTimeout(consultar, 700);
    };
    form.arquivo.onblur = function () { consultar(); };
    form.arquivo.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); consultar(); } };
    form.origem_id.onchange = desenharStatus;
    form.destino_id.onchange = function () { atualizarVendedores(); desenharStatus(); };
    form.total_volumes.oninput = function () { desenharVolumes(); desenharStatus(); };

    const desenharUltimos = function () {
      const caixa = el.querySelector('.ultimos');
      if (!Registro.ultimos.length) { caixa.innerHTML = ''; return; }
      caixa.innerHTML = blocoHtml('Registrados agora', '<div class="lista-arquivos">' + Registro.ultimos.slice(0, 10).map(function (r) {
        return '<div class="item-arquivo' + (r.guardado ? ' guardado' : '') + '"><div class="item-topo"><span class="numero-arquivo">Arq. ' + esc(r.arquivo) + '</span>' +
          (r.guardado ? '<span class="selo aviso">' + ICONES.nuvem + 'Aguardando internet</span>' : seloSituacao(r.status)) + '</div>' +
          '<div class="item-rota">' + esc(r.texto) + ' <span class="item-tempo">· ' + esc(r.hora) + '</span></div></div>';
      }).join('') + '</div>');
      ativarBlocos(caixa);
    };

    const limparFormulario = function () {
      form.arquivo.value = '';
      ultimoConsultado = '';
      lidoPelaCamera = false;
      limparMarcasLeitura();
      form.querySelector('.resultado-leitura').innerHTML = '';
      form.origem_id.value = ''; form.destino_id.value = '';
      form.total_volumes.value = 1; form.vendedor_nome.value = ''; form.observacao.value = '';
      limparConsulta();
      desenharVolumes();
      atualizarVendedores();
      desenharStatus();
      form.arquivo.focus();
    };

    const enviar = async function (dados, botao) {
      try {
        const r = await chamar('registrar', dados);
        if (r.precisaConfirmar) {
          confirmarAvisos(r.avisos, function () {
            dados.confirmar = true;
            return enviar(dados, botao);
          });
          return;
        }
        if (r.nadaMudou) {
          msg.innerHTML = '<div class="mensagem info">' + esc(r.mensagem) + '</div>';
          return;
        }
        Registro.ultimos.unshift({ arquivo: r.arquivo || dados.arquivo, status: dados.status, texto: (NOMES_STATUS[dados.status] || {}).titulo +
          (r.total_volumes > 1 ? ' · vol. ' + (r.volumes || []).join(', ') + ' de ' + r.total_volumes : ''), hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) });
        toast(r.repetido ? 'Este registro já tinha sido enviado.' : (r.mensagem || 'Registrado.'));
        if (r.volumes_pendentes > 0) toast(r.volumes_pendentes + ' volume(s) do arquivo ' + r.arquivo + ' ainda não foram lidos nesta etapa.', true);
        desenharUltimos();
        limparFormulario();
      } catch (erro) {
        if (erro.offline) {
          Fila.adicionar(dados);
          Registro.ultimos.unshift({ arquivo: dados.arquivo, status: dados.status, guardado: true, texto: (NOMES_STATUS[dados.status] || {}).titulo, hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) });
          toast('Sem internet: registro guardado no aparelho. Será enviado quando a conexão voltar.');
          desenharUltimos();
          limparFormulario();
        } else if (!erro.sessaoExpirada) {
          msg.innerHTML = '<div class="mensagem erro">' + esc(erro.message) + '</div>';
        }
      }
    };

    form.onsubmit = async function (e) {
      e.preventDefault();
      msg.innerHTML = '';
      const arquivo = form.arquivo.value.replace(/\D/g, '');
      const status = (form.querySelector('input[name=status]:checked') || {}).value;
      const total = Math.max(1, parseInt(form.total_volumes.value, 10) || 1);
      const volumes = total > 1 ? volumesSelecionados() : [1];
      const erro = function (t) { msg.innerHTML = '<div class="mensagem erro">' + esc(t) + '</div>'; msg.scrollIntoView({ block: 'center', behavior: 'smooth' }); };
      if (arquivo.length < 3) return erro('Digite o número do arquivo.');
      if (consulta && consulta.semAcesso) return erro('Este arquivo não envolve a sua loja.');
      if (!form.origem_id.value || !form.destino_id.value) return erro('Escolha a loja de origem e a de destino.');
      if (form.origem_id.value === form.destino_id.value) return erro('A origem e o destino não podem ser a mesma loja.');
      if (!volumes.length) return erro('Marque pelo menos um volume.');
      if (!status) return erro('Escolha a situação.');
      Registro.ultimoStatus = status;
      const dados = {
        arquivo: arquivo,
        origem_id: form.origem_id.value,
        destino_id: form.destino_id.value,
        total_volumes: total,
        volumes: volumes,
        status: status,
        vendedor_nome: form.vendedor_nome.value.trim(),
        cd_id: status === 'NO_CD' && !form.querySelector('.campo-cd').classList.contains('oculto') ? form.cd_id.value : '',
        observacao: form.observacao.value.trim(),
        forma_registro: lidoPelaCamera ? 'CAMERA' : (ehCelular ? 'MANUAL' : 'WEB'),
        id_cliente: novoIdCliente(),
        data_hora_cliente: new Date().toISOString()
      };
      const botao = form.querySelector('button[type=submit]');
      botao.disabled = true;
      botao.textContent = 'Registrando...';
      await enviar(dados, botao);
      botao.disabled = false;
      botao.textContent = 'Registrar';
    };

    // ----- Leitura da etiqueta pela foto -----
    const resultadoLeitura = form.querySelector('.resultado-leitura');
    const campoDe = function (nome) { return form[nome] ? form[nome].closest('.campo') : null; };

    function limparMarcasLeitura() {
      form.querySelectorAll('.campo.conferir, .campo.faltou, .campo.lido').forEach(function (c) { c.classList.remove('conferir', 'faltou', 'lido'); });
    }

    const marcarCampo = function (nome, confianca) {
      const c = campoDe(nome);
      if (!c) return;
      c.classList.remove('conferir', 'faltou', 'lido');
      c.classList.add(confianca === 'faltou' ? 'faltou' : confianca === 'alta' ? 'lido' : 'conferir');
      const tirar = function () { c.classList.remove('conferir', 'faltou'); };
      form[nome].addEventListener('change', tirar, { once: true });
      form[nome].addEventListener('input', tirar, { once: true });
    };

    const lerFoto = async function (arquivoFoto) {
      if (!arquivoFoto) return;
      msg.innerHTML = '';
      if (!navigator.onLine) {
        resultadoLeitura.innerHTML = '<div class="mensagem aviso">Sem internet: a leitura da foto precisa de conexão. Digite os dados abaixo.</div>';
        return;
      }
      resultadoLeitura.innerHTML = '<div class="carregando pequeno"><div class="girando"></div>Lendo a etiqueta...</div>';
      let leitura;
      try {
        const foto = await reduzirFoto(arquivoFoto, 1600, 0.85);
        const r = await chamar('lerEtiqueta', { imagem: foto, mime: 'image/jpeg' });
        if (!r.texto) {
          resultadoLeitura.innerHTML = '<div class="mensagem erro">Não consegui ler nada na foto. Tente de novo mais perto da etiqueta, com boa luz, ou digite os dados.</div>';
          return;
        }
        leitura = Leitor.interpretar(r.texto, Estado.base, { maiorArquivo: Estado.base.maior_arquivo });
      } catch (erro) {
        resultadoLeitura.innerHTML = '<div class="mensagem erro">' + esc(erro.offline ? 'Sem internet: digite os dados abaixo.' : erro.message) + '</div>';
        return;
      }
      await aplicarLeitura(leitura);
    };

    const aplicarLeitura = async function (l) {
      limparMarcasLeitura();
      lidoPelaCamera = true;
      // 1) Arquivo: consulta o servidor (se já existe, origem/destino vêm de lá)
      form.arquivo.value = l.arquivo || '';
      ultimoConsultado = '';
      if (l.arquivo) await consultar(true); else { limparConsulta(); }
      const existe = consulta && consulta.existe && consulta.transferencia;
      const avisos = l.avisos.slice();
      if (existe) {
        const t = consulta.transferencia;
        if (l.origem_id && l.origem_id !== t.origem_id || l.destino_id && l.destino_id !== t.destino_id) {
          avisos.push('A etiqueta parece dizer ' + nomeLojaCurto(l.origem_id) + ' → ' + nomeLojaCurto(l.destino_id) +
            ', mas o arquivo ' + t.arquivo + ' está registrado como ' + nomeLojaCurto(t.origem_id) + ' → ' + nomeLojaCurto(t.destino_id) + '. Confira o número.');
          marcarCampo('arquivo', 'baixa');
        }
        if (l.volume_total > 1 && l.volume_total !== t.total_volumes) avisos.push('A etiqueta diz ' + l.volume_total + ' volumes; o arquivo está com ' + t.total_volumes + '.');
        if (l.vendedor_nome && !form.vendedor_nome.value) { form.vendedor_nome.value = l.vendedor_nome; marcarCampo('vendedor_nome', l.confianca.vendedor); }
      } else {
        form.origem_id.value = l.origem_id || '';
        form.destino_id.value = l.destino_id || '';
        form.total_volumes.value = l.volume_total || 1;
        form.vendedor_nome.value = l.vendedor_nome || '';
        marcarCampo('origem_id', l.confianca.origem_id);
        marcarCampo('destino_id', l.confianca.destino_id);
        if (l.volume_total > 1) marcarCampo('total_volumes', l.confianca.volume);
        if (l.vendedor_nome) marcarCampo('vendedor_nome', l.confianca.vendedor);
      }
      marcarCampo('arquivo', l.confianca.arquivo);
      // 2) Volume da caixa fotografada
      desenharVolumes();
      if (Number(form.total_volumes.value) > 1 && l.volume_atual) {
        form.querySelectorAll('input[name=vol]').forEach(function (c) { c.checked = Number(c.value) === l.volume_atual; });
      }
      atualizarVendedores();
      desenharStatus();
      // 3) Resumo do que foi lido
      const precisaConferir = ['origem_id', 'destino_id', 'arquivo'].filter(function (c) { return l.confianca[c] !== 'alta'; }).length > 0 || avisos.length;
      resultadoLeitura.innerHTML =
        '<div class="mensagem ' + (precisaConferir ? 'aviso' : 'ok') + '">' +
          '<b>' + (precisaConferir ? 'Confira os campos destacados antes de registrar.' : 'Etiqueta lida. Confira e registre.') + '</b>' +
          (avisos.length ? '<ul class="lista-avisos">' + avisos.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>' : '') +
          '<details><summary>Texto lido da foto</summary><pre class="texto-lido">' + esc(l.texto) + '</pre></details>' +
        '</div>';
      resultadoLeitura.scrollIntoView({ block: 'start', behavior: 'smooth' });
    };

    form.querySelector('.entrada-foto').onchange = function (e) {
      const f = e.target.files && e.target.files[0];
      e.target.value = '';
      lerFoto(f);
    };

    desenharVolumes();
    atualizarVendedores();
    desenharStatus();
    desenharUltimos();
    const arqInicial = (parametros.get('arq') || '').replace(/\D/g, '');
    if (arqInicial) { form.arquivo.value = arqInicial; consultar(); }
    else if (!ehCelular) form.arquivo.focus();
  }

  function confirmarAvisos(avisos, aoConfirmar) {
    abrirJanela('Confira antes de registrar',
      '<div class="mensagem aviso"><ul class="lista-avisos">' + avisos.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul></div>' +
      '<p class="descricao">Se estiver tudo certo, toque em <b>Registrar mesmo assim</b>.</p>',
      { textoSalvar: 'Registrar mesmo assim', aoSalvar: async function () { setTimeout(aoConfirmar, 0); } });
  }

  function formOcorrencia(arquivo, depois) {
    abrirJanela('Ocorrência no arquivo ' + arquivo,
      '<div class="campo"><label>Tipo</label><select name="tipo"><option value="">Selecione...</option>' +
        TIPOS_OCORRENCIA.map(function (t) { return '<option>' + esc(t) + '</option>'; }).join('') + '</select></div>' +
      '<div class="campo"><label>O que aconteceu?</label><textarea name="observacao" maxlength="300" placeholder="Ex.: chegou só o volume 1 de 2" required></textarea></div>',
      {
        textoSalvar: 'Registrar ocorrência',
        aoSalvar: async function (form) {
          if (!form.tipo.value) throw new Error('Escolha o tipo da ocorrência.');
          if (!form.observacao.value.trim()) throw new Error('Descreva o que aconteceu.');
          const r = await chamar('registrarOcorrencia', { arquivo: arquivo, tipo: form.tipo.value, observacao: form.observacao.value.trim() });
          toast(r.mensagem);
          depois();
        }
      });
  }

  function formResolverOcorrencia(arquivo, depois) {
    abrirJanela('Resolver ocorrência do arquivo ' + arquivo,
      '<div class="campo"><label>Como foi resolvida? <span class="opcional">(opcional)</span></label><textarea name="observacao" maxlength="300"></textarea></div>',
      {
        textoSalvar: 'Marcar como resolvida',
        aoSalvar: async function (form) {
          const r = await chamar('resolverOcorrencia', { arquivo: arquivo, observacao: form.observacao.value.trim() });
          toast(r.mensagem);
          depois();
        }
      });
  }

  /* =========================================================
   *  PÁGINA: REGISTROS GUARDADOS NO APARELHO
   * ========================================================= */
  function paginaPendentes(el) {
    const desenhar = function () {
      const itens = Fila.lista().filter(function (i) { return i.usuario_id === Estado.usuario.id; });
      el.innerHTML = '<h2>Guardados no aparelho</h2><p class="descricao">Registros feitos sem internet ou que precisam da sua confirmação.</p>' +
        '<div class="barra-acoes"><button class="botao" data-enviar' + (navigator.onLine ? '' : ' disabled') + '>Enviar agora</button>' +
        (navigator.onLine ? '' : '<span class="descricao" style="margin:0">Sem internet no momento.</span>') + '</div>' +
        (itens.length ? '<div class="lista-arquivos">' + itens.map(function (i) {
          const d = i.dados;
          let estado = '<span class="selo aviso">' + ICONES.nuvem + 'Aguardando internet</span>';
          let detalhe = '';
          let acoes = '<button class="botao secundario pequeno" data-descartar="' + esc(d.id_cliente) + '">Descartar</button>';
          if (i.estado === 'confirmar') {
            estado = '<span class="selo aviso">' + ICONES.alerta + 'Precisa confirmar</span>';
            detalhe = '<ul class="lista-avisos">' + (i.avisos || []).map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>';
            acoes = '<button class="botao pequeno" data-confirmar="' + esc(d.id_cliente) + '">Confirmar e enviar</button> ' + acoes;
          } else if (i.estado === 'erro') {
            estado = '<span class="selo erro">' + ICONES.alerta + 'Não foi aceito</span>';
            detalhe = '<div class="mensagem erro">' + esc(i.mensagem) + '</div>';
            acoes = '<button class="botao secundario pequeno" data-tentar="' + esc(d.id_cliente) + '">Tentar de novo</button> ' + acoes;
          }
          return '<div class="item-arquivo' + (i.estado !== 'aguardando' ? ' alerta' : '') + '">' +
            '<div class="item-topo"><span class="numero-arquivo">Arq. ' + esc(d.arquivo) + '</span>' + estado + '</div>' +
            '<div class="item-rota">' + esc((NOMES_STATUS[d.status] || {}).titulo || d.status) + ' · ' + esc(nomeLojaCurto(d.origem_id)) + ' → ' + esc(nomeLojaCurto(d.destino_id)) +
              (d.total_volumes > 1 ? ' · vol. ' + esc(d.volumes.join(', ')) + ' de ' + d.total_volumes : '') +
              ' <span class="item-tempo">· feito em ' + esc(dataHora(d.data_hora_cliente)) + '</span></div>' +
            detalhe + '<div class="acoes-arquivo">' + acoes + '</div></div>';
        }).join('') + '</div>' : '<div class="vazio">Nada guardado. Todos os registros já foram enviados.</div>');

      const enviar = el.querySelector('[data-enviar]');
      enviar.onclick = async function () { enviar.disabled = true; await Fila.sincronizar(); desenhar(); };
      el.querySelectorAll('[data-descartar]').forEach(function (b) {
        b.onclick = function () {
          if (confirm('Descartar este registro? Ele não será enviado.')) { Fila.remover(b.dataset.descartar); desenhar(); }
        };
      });
      el.querySelectorAll('[data-confirmar]').forEach(function (b) {
        b.onclick = async function () {
          const item = Fila.lista().find(function (i) { return i.dados.id_cliente === b.dataset.confirmar; });
          item.dados.confirmar = true;
          Fila.alterar(b.dataset.confirmar, { dados: item.dados, estado: 'aguardando', avisos: null });
          await Fila.sincronizar();
          desenhar();
        };
      });
      el.querySelectorAll('[data-tentar]').forEach(function (b) {
        b.onclick = async function () {
          Fila.alterar(b.dataset.tentar, { estado: 'aguardando', mensagem: '' });
          await Fila.sincronizar();
          desenhar();
        };
      });
    };
    desenhar();
  }

  /** Diminui a foto para no máximo "lado" pixels e devolve em base64 (JPEG). */
  function reduzirFoto(arquivo, lado, qualidade) {
    return new Promise(function (ok, falha) {
      const leitor = new FileReader();
      leitor.onerror = function () { falha(new Error('Não foi possível abrir a foto.')); };
      leitor.onload = function () {
        const img = new Image();
        img.onerror = function () { falha(new Error('Arquivo de imagem inválido.')); };
        img.onload = function () {
          const escala = Math.min(1, lado / Math.max(img.width, img.height));
          const c = document.createElement('canvas');
          c.width = Math.round(img.width * escala);
          c.height = Math.round(img.height * escala);
          const ctx = c.getContext('2d');
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, c.width, c.height);
          ctx.drawImage(img, 0, 0, c.width, c.height);
          ok(c.toDataURL('image/jpeg', qualidade));
        };
        img.src = leitor.result;
      };
      leitor.readAsDataURL(arquivo);
    });
  }

  /* =========================================================
   *  DETALHE DE UM ARQUIVO (usado na lista)
   * ========================================================= */
  function cartaoArquivoHtml(consulta) {
    const t = consulta.transferencia;
    const pend = t.total_volumes - Object.keys(t.volumes_status || {}).filter(function (k) { return t.volumes_status[k] === t.status; }).length;
    const vols = Object.keys(t.volumes_status || {});
    return '<div class="cartao-arquivo">' +
      '<div class="item-topo"><span class="numero-arquivo">Arq. ' + esc(t.arquivo) + '</span>' + seloSituacao(t.status) + '</div>' +
      '<div class="item-rota">' + esc(nomeLojaCurto(t.origem_id)) + ' → ' + esc(nomeLojaCurto(t.destino_id)) +
        ' <span class="item-tempo">· desde ' + esc(dataHora(t.status_desde)) + '</span></div>' +
      '<div class="lista-chips">' +
        (t.vendedor_nome ? '<span class="selo vendedor">' + ICONES.pessoa + esc(t.vendedor_nome) + '</span>' : '') +
        (t.total_volumes > 1 ? '<span class="selo">' + t.total_volumes + ' volumes</span>' : '') +
        (vols.length && pend > 0 ? '<span class="selo erro">' + pend + ' volume(s) ainda não lido(s) nesta etapa</span>' : '') +
      '</div>' +
      (t.total_volumes > 1 && vols.length ? '<div class="volumes-situacao">' + vols.sort(function (a, b) { return a - b; }).map(function (v) {
        return '<span>Vol. ' + esc(v) + '/' + t.total_volumes + ': <b>' + esc((NOMES_STATUS[t.volumes_status[v]] || {}).titulo || t.volumes_status[v]) + '</b></span>';
      }).join('') + '</div>' : '') +
      (t.ocorrencia ? '<div class="mensagem erro ocorrencia-aberta"><b>Ocorrência:</b> ' + esc(t.ocorrencia) + '</div>' : '') +
      '<div class="historico"><b>Histórico</b>' + (linhaDoTempoHtml(consulta.eventos) || '<p class="descricao">Sem registros.</p>') + '</div>' +
      '<p class="descricao pequena">Registrado em ' + esc(dataHora(t.criado_em)) + ' por ' + esc(t.criado_por || '—') + '.</p>' +
    '</div>';
  }

  async function abrirDetalhe(arquivo) {
    const form = abrirJanela('Arquivo ' + arquivo, '<div class="corpo-detalhe">' + carregandoHtml('Buscando...') + '</div>', {
      textoSalvar: 'Registrar situação',
      textoCancelar: 'Fechar',
      aoSalvar: async function () { location.hash = '#/registrar?arq=' + encodeURIComponent(arquivo); }
    });
    const corpo = form.querySelector('.corpo-detalhe');
    try {
      const r = await chamar('consultarArquivo', { arquivo: arquivo });
      if (r.semAcesso) corpo.innerHTML = '<div class="mensagem erro">Este arquivo não envolve a sua loja.</div>';
      else if (!r.existe) corpo.innerHTML = '<div class="mensagem info">Arquivo não encontrado.</div>';
      else corpo.innerHTML = cartaoArquivoHtml(r);
    } catch (erro) {
      corpo.innerHTML = '<div class="mensagem erro">' + esc(erro.message) + '</div>';
    }
  }

  /* =========================================================
   *  PERÍODO (usado na lista e nos relatórios)
   * ========================================================= */
  function diaIso(d) {
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }

  function intervaloPeriodo(codigo) {
    const hoje = new Date();
    const menos = function (dias) { const d = new Date(); d.setDate(d.getDate() - dias); return diaIso(d); };
    switch (codigo) {
      case 'HOJE': return { de: diaIso(hoje), ate: diaIso(hoje) };
      case '7': return { de: menos(6), ate: diaIso(hoje) };
      case '30': return { de: menos(29), ate: diaIso(hoje) };
      case '90': return { de: menos(89), ate: diaIso(hoje) };
      case 'MES': return { de: diaIso(new Date(hoje.getFullYear(), hoje.getMonth(), 1)), ate: diaIso(hoje) };
      case 'MES_PASSADO': return { de: diaIso(new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1)), ate: diaIso(new Date(hoje.getFullYear(), hoje.getMonth(), 0)) };
      case 'TODOS': return { de: '', ate: '' };
      default: return null;
    }
  }

  function campoPeriodoHtml(codigo, de, ate) {
    const opcoes = [['HOJE', 'Hoje'], ['7', 'Últimos 7 dias'], ['30', 'Últimos 30 dias'], ['90', 'Últimos 90 dias'], ['MES', 'Este mês'],
      ['MES_PASSADO', 'Mês passado'], ['TODOS', 'Todo o período'], ['PERSONALIZADO', 'Escolher datas...']];
    return '<div class="campo"><label>Período (data do registro)</label><select name="periodo">' +
      opcoes.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === codigo ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></div>' +
      '<div class="linha-campos datas' + (codigo === 'PERSONALIZADO' ? '' : ' oculto') + '">' +
        '<div class="campo"><label>De</label><input type="date" name="de" value="' + esc(de || '') + '"></div>' +
        '<div class="campo"><label>Até</label><input type="date" name="ate" value="' + esc(ate || '') + '"></div>' +
      '</div>';
  }

  function lerPeriodo(form) {
    const codigo = form.periodo.value;
    const p = intervaloPeriodo(codigo);
    form.querySelector('.datas').classList.toggle('oculto', codigo !== 'PERSONALIZADO');
    if (p) { form.de.value = p.de; form.ate.value = p.ate; return p; }
    return { de: form.de.value, ate: form.ate.value };
  }

  function textoPeriodo(de, ate) {
    if (!de && !ate) return 'todo o período';
    if (de === ate) return data(de);
    return (de ? data(de) : 'início') + ' a ' + (ate ? data(ate) : 'hoje');
  }

  /* =========================================================
   *  PÁGINA: TRANSFERÊNCIAS (lista com filtros)
   * ========================================================= */
  const FiltrosLista = { periodo: '30', de: '', ate: '', origem_id: '', destino_id: '', situacao: '', arquivo: '', vendedor: '' };

  function paginaTransferencias(el) {
    const parametros = new URLSearchParams((location.hash.split('?')[1] || ''));
    if (parametros.get('situacao')) { FiltrosLista.situacao = parametros.get('situacao'); FiltrosLista.periodo = 'TODOS'; }
    const f = FiltrosLista;
    const situacoes = [['', 'Todas'], ['ABERTOS', 'Em aberto (não entregues)'], ['ATENCAO', 'Precisam de atenção'], ['SEPARADA', 'Aguardando coleta'],
      ['COM_MOTORISTA', 'Com motorista'], ['NO_CD', 'No CD'], ['ENTREGUE', 'Entregues']];
    const lojasOpcoes = function (sel) {
      return '<option value="">Todas</option>' + lojasOrdenadas(function (l) { return l.tipo === 'LOJA'; }).map(function (l) {
        return '<option value="' + esc(l.id) + '"' + (l.id === sel ? ' selected' : '') + '>' + esc(nomeLojaCurto(l.id)) + '</option>';
      }).join('');
    };
    el.innerHTML =
      '<h2>Transferências</h2><p class="descricao">Procure arquivos por período, loja, situação, número ou vendedor.</p>' +
      '<details class="cartao filtros" open><summary><b>Filtros</b><span class="resumo-filtros"></span></summary>' +
      '<form class="form-filtros" novalidate>' +
        '<div class="grade-filtros">' +
          '<div class="bloco-periodo">' + campoPeriodoHtml(f.periodo, f.de, f.ate) + '</div>' +
          '<div class="campo"><label>Situação</label><select name="situacao">' + situacoes.map(function (s) {
            return '<option value="' + s[0] + '"' + (s[0] === f.situacao ? ' selected' : '') + '>' + s[1] + '</option>'; }).join('') + '</select></div>' +
          '<div class="campo"><label>De (origem)</label><select name="origem_id">' + lojasOpcoes(f.origem_id) + '</select></div>' +
          '<div class="campo"><label>Para (destino)</label><select name="destino_id">' + lojasOpcoes(f.destino_id) + '</select></div>' +
          '<div class="campo"><label>Número do arquivo</label><input name="arquivo" inputmode="numeric" value="' + esc(f.arquivo) + '" placeholder="Ex.: 64425"></div>' +
          '<div class="campo"><label>Vendedor</label><input name="vendedor" value="' + esc(f.vendedor) + '" placeholder="Ex.: Julio"></div>' +
        '</div>' +
        '<div class="barra-acoes"><button type="button" class="botao secundario" data-limpar>Limpar filtros</button><span class="espaco"></span>' +
          '<button type="button" class="botao secundario" data-excel>' + ICONES.baixar + 'Baixar Excel</button></div>' +
      '</form></details>' +
      '<div class="resultado-lista"></div>';

    const form = el.querySelector('form');
    const saida = el.querySelector('.resultado-lista');
    let ultimo = null;
    let pedido = 0;

    const filtrosAtuais = function () {
      const p = lerPeriodo(form);
      Object.assign(FiltrosLista, {
        periodo: form.periodo.value, de: p.de, ate: p.ate, origem_id: form.origem_id.value, destino_id: form.destino_id.value,
        situacao: form.situacao.value, arquivo: form.arquivo.value.replace(/\D/g, ''), vendedor: form.vendedor.value.trim()
      });
      return { de: p.de, ate: p.ate, origem_id: FiltrosLista.origem_id, destino_id: FiltrosLista.destino_id, situacao: FiltrosLista.situacao, arquivo: FiltrosLista.arquivo, vendedor: FiltrosLista.vendedor };
    };

    const buscar = async function () {
      const filtros = filtrosAtuais();
      const meu = ++pedido;
      el.querySelector('.resumo-filtros').textContent = ' · ' + textoPeriodo(filtros.de, filtros.ate);
      saida.innerHTML = carregandoHtml('Buscando arquivos...');
      try {
        const r = await chamar('listarTransferencias', filtros);
        if (meu !== pedido) return;
        ultimo = { filtros: filtros, r: r };
        const abertos = r.itens.filter(function (t) { return t.status !== 'ENTREGUE'; }).length;
        const atencao = r.itens.filter(function (t) { return (t.status !== 'ENTREGUE' && t.atrasado) || t.volumes_pendentes > 0 || t.ocorrencia; }).length;
        saida.innerHTML =
          '<div class="resumo-lista"><b>' + r.total + '</b> arquivo(s) · ' + abertos + ' em aberto · ' + (r.itens.length - abertos) + ' entregue(s)' +
            (atencao ? ' · <span class="texto-erro">' + atencao + ' precisam de atenção</span>' : '') +
            (r.limitado ? '<br><small>Mostrando os ' + r.itens.length + ' mais recentes. Use os filtros para refinar.</small>' : '') + '</div>' +
          listaArquivosHtml(r.itens, 'ambos', 'Nenhum arquivo encontrado com esses filtros.');
      } catch (erro) {
        if (meu === pedido) saida.innerHTML = '<div class="mensagem erro">' + esc(erro.message) + '</div>';
      }
    };

    let espera;
    const buscarDepois = function () { clearTimeout(espera); espera = setTimeout(buscar, 450); };
    form.onchange = function (e) { if (e.target.name !== 'arquivo' && e.target.name !== 'vendedor') buscar(); };
    form.arquivo.oninput = buscarDepois;
    form.vendedor.oninput = buscarDepois;
    form.onsubmit = function (e) { e.preventDefault(); buscar(); };
    el.querySelector('[data-limpar]').onclick = function () {
      Object.assign(FiltrosLista, { periodo: '30', de: '', ate: '', origem_id: '', destino_id: '', situacao: '', arquivo: '', vendedor: '' });
      location.hash = '#/transferencias';
      paginaTransferencias(el);
    };
    el.querySelector('[data-excel]').onclick = function () {
      if (!ultimo) return;
      Xlsx.baixar('transferencias-' + diaIso(new Date()) + '.xlsx', [abaTransferencias(ultimo.r.itens)]);
    };
    saida.addEventListener('click', function (e) {
      const a = e.target.closest('a.item-arquivo');
      if (!a) return;
      e.preventDefault();
      abrirDetalhe(decodeURIComponent(a.getAttribute('href').split('arq=')[1] || ''));
    });
    if (window.matchMedia('(max-width: 700px)').matches) el.querySelector('details.filtros').open = false;
    buscar();
  }

  function abaTransferencias(itens) {
    return {
      nome: 'Transferências',
      colunas: [{ titulo: 'Arquivo', largura: 10 }, { titulo: 'Origem', largura: 26 }, { titulo: 'Destino', largura: 26 }, { titulo: 'Situação', largura: 18 },
        { titulo: 'Na situação desde', largura: 17 }, { titulo: 'Dias na situação', largura: 10 }, { titulo: 'Volumes', largura: 9 },
        { titulo: 'Volumes faltando', largura: 10 }, { titulo: 'Vendedor', largura: 16 }, { titulo: 'Atrasado', largura: 9 },
        { titulo: 'Ocorrência', largura: 40 }, { titulo: 'Registrado em', largura: 17 }, { titulo: 'Registrado por', largura: 18 },
        { titulo: 'Última atualização', largura: 17 }, { titulo: 'Atualizado por', largura: 18 }],
      linhas: itens.map(function (t) {
        return [Number(t.arquivo) || t.arquivo, nomeLojaCurto(t.origem_id), nomeLojaCurto(t.destino_id), (SITUACOES[t.status] || {}).texto || t.status,
          dataHora(t.desde), t.dias, t.total_volumes, t.volumes_pendentes || 0, t.vendedor_nome || '', t.atrasado ? 'Sim' : '',
          t.ocorrencia || '', dataHora(t.criado_em), t.criado_por || '', dataHora(t.atualizado_em), t.atualizado_por || ''];
      })
    };
  }

  /* =========================================================
   *  PÁGINA: RELATÓRIOS
   * ========================================================= */
  const FiltroRelatorio = { periodo: 'MES', de: '', ate: '' };

  function paginaRelatorios(el) {
    el.innerHTML =
      '<h2>Relatórios</h2><p class="descricao">Resumo das transferências no período, por loja e por vendedor. Tudo pode ser baixado em Excel.</p>' +
      '<form class="cartao form-relatorio" novalidate><div class="grade-filtros">' +
        '<div class="bloco-periodo">' + campoPeriodoHtml(FiltroRelatorio.periodo, FiltroRelatorio.de, FiltroRelatorio.ate) + '</div>' +
      '</div><div class="barra-acoes"><span class="espaco"></span>' +
        '<button type="button" class="botao" data-excel disabled>' + ICONES.baixar + 'Baixar relatório completo em Excel</button></div></form>' +
      '<div class="resultado-relatorio"></div>';
    const form = el.querySelector('form');
    const saida = el.querySelector('.resultado-relatorio');
    let atual = null;
    let pedido = 0;

    const n = function (v) { return v === null || v === undefined ? '—' : String(v).replace('.', ','); };

    const carregar = async function () {
      const p = lerPeriodo(form);
      Object.assign(FiltroRelatorio, { periodo: form.periodo.value, de: p.de, ate: p.ate });
      const meu = ++pedido;
      el.querySelector('[data-excel]').disabled = true;
      saida.innerHTML = carregandoHtml('Calculando...');
      try {
        const r = await chamar('relatorio', { de: p.de, ate: p.ate });
        if (meu !== pedido) return;
        atual = r;
        const t = r.totais;
        saida.innerHTML =
          '<p class="descricao">Período: <b>' + esc(textoPeriodo(r.de, r.ate)) + '</b>. "Em aberto", "atrasados" e "no CD" mostram a situação de agora.</p>' +
          '<div class="grade">' +
            numeroHtml(t.arquivos, 'Arquivos registrados no período', '', 'caixa') +
            numeroHtml(t.entregues, 'Entregues no período', '', 'certo') +
            numeroHtml(n(t.dias_medio_entrega), 'Dias em média até a entrega', '', 'caminhao') +
            numeroHtml(t.em_aberto, 'Em aberto agora', '', 'lista') +
            numeroHtml(t.atrasados, 'Atrasados agora', t.atrasados ? 'realce-erro' : '', 'alerta') +
            numeroHtml(t.no_cd, 'No CD agora', 'cd', 'armazem') +
            numeroHtml(t.ocorrencias, 'Ocorrências no período', t.ocorrencias ? 'realce-erro' : '', 'alerta') +
          '</div>' +
          blocoHtml('Por loja', '<div class="tabela-rolagem"><table class="tabela"><thead><tr><th>Loja</th><th>Enviados</th><th>Recebidos</th><th>A receber</th>' +
            '<th>Aguardando coleta</th><th>Atrasados</th><th>Ocorrências</th><th>Dias até entrega</th></tr></thead><tbody>' +
            r.por_loja.map(function (l) {
              return '<tr><td data-rotulo="Loja"><b>' + esc(nomeLojaCurto(l.loja_id)) + '</b></td><td data-rotulo="Enviados">' + l.enviados + '</td>' +
                '<td data-rotulo="Recebidos">' + l.recebidos + '</td><td data-rotulo="A receber">' + l.a_receber + '</td>' +
                '<td data-rotulo="Aguardando coleta">' + l.aguardando_coleta + '</td>' +
                '<td data-rotulo="Atrasados">' + (l.atrasados ? '<span class="texto-erro">' + l.atrasados + '</span>' : 0) + '</td>' +
                '<td data-rotulo="Ocorrências">' + l.ocorrencias + '</td><td data-rotulo="Dias até entrega">' + n(l.dias_medio_entrega) + '</td></tr>';
            }).join('') + '</tbody></table></div>') +
          blocoHtml('Por vendedor (' + r.por_vendedor.length + ')', r.por_vendedor.length ?
            '<div class="tabela-rolagem"><table class="tabela"><thead><tr><th>Vendedor</th><th>Loja (destino)</th><th>Arquivos</th><th>Entregues</th><th>Em aberto</th></tr></thead><tbody>' +
            r.por_vendedor.map(function (v) {
              return '<tr><td data-rotulo="Vendedor"><b>' + esc(v.vendedor_nome) + '</b></td><td data-rotulo="Loja">' + esc(nomeLojaCurto(v.destino_id)) + '</td>' +
                '<td data-rotulo="Arquivos">' + v.arquivos + '</td><td data-rotulo="Entregues">' + v.entregues + '</td><td data-rotulo="Em aberto">' + v.em_aberto + '</td></tr>';
            }).join('') + '</tbody></table></div>' : '<div class="vazio pequeno">Nenhum arquivo com vendedor no período.</div>');
        ativarBlocos(saida);
        el.querySelector('[data-excel]').disabled = false;
      } catch (erro) {
        if (meu === pedido) saida.innerHTML = '<div class="mensagem erro">' + esc(erro.message) + '</div>';
      }
    };

    form.onchange = carregar;
    form.onsubmit = function (e) { e.preventDefault(); carregar(); };
    el.querySelector('[data-excel]').onclick = async function () {
      const botao = this;
      if (!atual) return;
      botao.disabled = true;
      const textoBotao = botao.innerHTML;
      botao.textContent = 'Preparando...';
      try {
        const [lista, eventos] = await Promise.all([
          chamar('listarTransferencias', { de: atual.de, ate: atual.ate }),
          chamar('listarEventos', { de: atual.de, ate: atual.ate })
        ]);
        const t = atual.totais;
        Xlsx.baixar('relatorio-' + (atual.de || 'inicio') + '-a-' + (atual.ate || diaIso(new Date())) + '.xlsx', [
          { nome: 'Resumo', colunas: [{ titulo: 'Indicador', largura: 40 }, { titulo: 'Valor', largura: 14 }], linhas: [
            ['Empresa', (Estado.base.config || {}).empresa_nome || ''], ['Período', textoPeriodo(atual.de, atual.ate)],
            ['Gerado em', dataHora(new Date().toISOString())], ['Arquivos registrados no período', t.arquivos], ['Entregues no período', t.entregues],
            ['Dias em média até a entrega', t.dias_medio_entrega === null ? '' : t.dias_medio_entrega], ['Em aberto agora', t.em_aberto],
            ['Atrasados agora', t.atrasados], ['No CD agora', t.no_cd], ['Ocorrências no período', t.ocorrencias]] },
          { nome: 'Por loja', colunas: [{ titulo: 'Loja', largura: 28 }, { titulo: 'Enviados', largura: 10 }, { titulo: 'Recebidos', largura: 10 },
            { titulo: 'A receber', largura: 10 }, { titulo: 'Aguardando coleta', largura: 12 }, { titulo: 'Atrasados', largura: 10 },
            { titulo: 'Ocorrências', largura: 11 }, { titulo: 'Dias até entrega (média)', largura: 14 }],
            linhas: atual.por_loja.map(function (l) { return [nomeLojaCurto(l.loja_id), l.enviados, l.recebidos, l.a_receber, l.aguardando_coleta, l.atrasados, l.ocorrencias, l.dias_medio_entrega === null ? '' : l.dias_medio_entrega]; }) },
          { nome: 'Por vendedor', colunas: [{ titulo: 'Vendedor', largura: 20 }, { titulo: 'Loja (destino)', largura: 28 }, { titulo: 'Arquivos', largura: 10 },
            { titulo: 'Entregues', largura: 10 }, { titulo: 'Em aberto', largura: 10 }],
            linhas: atual.por_vendedor.map(function (v) { return [v.vendedor_nome, nomeLojaCurto(v.destino_id), v.arquivos, v.entregues, v.em_aberto]; }) },
          abaTransferencias(lista.itens),
          { nome: 'Histórico de registros', colunas: [{ titulo: 'Data e hora', largura: 17 }, { titulo: 'Arquivo', largura: 10 }, { titulo: 'Origem', largura: 24 },
            { titulo: 'Destino', largura: 24 }, { titulo: 'Registro', largura: 22 }, { titulo: 'Volumes', largura: 9 }, { titulo: 'Local', largura: 22 },
            { titulo: 'Usuário', largura: 18 }, { titulo: 'Forma', largura: 9 }, { titulo: 'Observação', largura: 40 }],
            linhas: eventos.map(function (e) {
              const nomeEv = e.status === 'OCORRENCIA' ? 'Ocorrência' : e.status === 'OCORRENCIA_RESOLVIDA' ? 'Ocorrência resolvida' : ((NOMES_STATUS[e.status] || {}).titulo || e.status);
              const forma = { CAMERA: 'Câmera', MANUAL: 'Celular', WEB: 'Computador' }[e.forma_registro] || e.forma_registro;
              return [dataHora(e.data_hora), Number(e.arquivo) || e.arquivo, nomeLojaCurto(e.origem_id), nomeLojaCurto(e.destino_id), nomeEv, e.volumes, e.local_id ? nomeLojaCurto(e.local_id) : '', e.usuario_nome, forma, e.observacao];
            }) }
        ]);
      } catch (erro) {
        toast(erro.message, true);
      }
      botao.disabled = false;
      botao.innerHTML = textoBotao;
    };
    carregar();
  }

  /* =========================================================
   *  CONFIGURAÇÕES: APARÊNCIA (logo e cor)
   * ========================================================= */
  function reduzirLogo(arquivo) {
    return new Promise(function (ok, falha) {
      const leitor = new FileReader();
      leitor.onerror = function () { falha(new Error('Não foi possível abrir a imagem.')); };
      leitor.onload = function () {
        const img = new Image();
        img.onerror = function () { falha(new Error('Arquivo de imagem inválido.')); };
        img.onload = function () {
          const tentativas = [180, 140, 110, 90, 70];
          for (let i = 0; i < tentativas.length; i++) {
            const escala = Math.min(1, tentativas[i] / Math.max(img.width, img.height));
            const c = document.createElement('canvas');
            c.width = Math.max(1, Math.round(img.width * escala));
            c.height = Math.max(1, Math.round(img.height * escala));
            c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
            let url = c.toDataURL('image/png');
            if (url.length > 44000) url = c.toDataURL('image/webp', 0.9);
            if (url.indexOf('data:image/webp') !== 0 && url.length > 44000) continue;
            if (url.length <= 44000) return ok(url);
          }
          falha(new Error('A imagem é muito detalhada. Tente um logo mais simples.'));
        };
        img.src = leitor.result;
      };
      leitor.readAsDataURL(arquivo);
    });
  }

  function paginaAparencia(el) {
    const corpo = cabecalhoConfig(el, '#/config/aparencia');
    const c = Estado.base.config;
    let logo = c.empresa_logo || '';
    const cores = ['#1d4ed8', '#0f766e', '#15803d', '#b91c1c', '#c2410c', '#7c3aed', '#be185d', '#334155'];
    corpo.innerHTML = '<form class="cartao" style="max-width:560px" novalidate><div class="msg"></div>' +
      '<div class="campo"><label>Logo da empresa</label>' +
        '<div class="previa-logo">' + (logo ? '<img src="' + esc(logo) + '" alt="">' : '<span class="descricao">Sem logo</span>') + '</div>' +
        '<div class="barra-acoes"><label class="botao secundario">Escolher imagem<input type="file" accept="image/*" class="oculto" data-logo></label>' +
        '<button type="button" class="botao secundario" data-remover>Remover logo</button></div>' +
        '<div class="ajuda">Aparece no topo do sistema e na tela de entrada. A imagem é reduzida automaticamente.</div></div>' +
      '<div class="campo"><label>Cor principal</label><div class="cores">' +
        cores.map(function (cor) { return '<button type="button" class="amostra-cor" data-cor="' + cor + '" style="background:' + cor + '" aria-label="' + cor + '"></button>'; }).join('') +
        '<input type="color" name="cor" value="' + esc(c.cor_principal || '#1d4ed8') + '"></div></div>' +
      '<button class="botao" type="submit">Salvar aparência</button></form>';
    const form = corpo.querySelector('form');
    const previa = form.querySelector('.previa-logo');
    form.querySelector('[data-logo]').onchange = async function (e) {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      try {
        logo = await reduzirLogo(f);
        previa.innerHTML = '<img src="' + esc(logo) + '" alt="">';
      } catch (erro) { toast(erro.message, true); }
    };
    form.querySelector('[data-remover]').onclick = function () { logo = ''; previa.innerHTML = '<span class="descricao">Sem logo</span>'; };
    form.querySelectorAll('[data-cor]').forEach(function (b) {
      b.onclick = function () { form.cor.value = b.dataset.cor; aplicarTema({ cor_principal: b.dataset.cor }); };
    });
    form.cor.oninput = function () { aplicarTema({ cor_principal: form.cor.value }); };
    form.onsubmit = async function (e) {
      e.preventDefault();
      const botao = form.querySelector('button[type=submit]');
      botao.disabled = true;
      try {
        Estado.base.config = await chamar('salvarConfig', { itens: { empresa_logo: logo, cor_principal: form.cor.value } });
        salvarCacheBase(Estado.base);
        aplicarTema(Estado.base.config);
        toast('Aparência salva.');
        rotear();
      } catch (erro) {
        form.querySelector('.msg').innerHTML = '<div class="mensagem erro">' + esc(erro.message) + '</div>';
        botao.disabled = false;
      }
    };
  }

  /* =========================================================
   *  CONFIGURAÇÕES: LEITURA DE ETIQUETAS
   * ========================================================= */
  function paginaLeitura(el) {
    const corpo = cabecalhoConfig(el, '#/config/leitura');
    const c = Estado.base.config;
    const servico = c.ocr_servico || 'GEMINI';
    corpo.innerHTML =
      '<form class="cartao" style="max-width:640px" novalidate><div class="msg"></div>' +
        '<div class="campo"><label>Serviço que lê a foto</label><select name="servico">' +
          '<option value="GEMINI"' + (servico === 'GEMINI' ? ' selected' : '') + '>Gemini (recomendado: melhor com letra de mão)</option>' +
          '<option value="VISION"' + (servico === 'VISION' ? ' selected' : '') + '>Google Cloud Vision</option>' +
          '<option value="DRIVE"' + (servico === 'DRIVE' ? ' selected' : '') + '>OCR do Google Drive (sem chave, lê pior)</option>' +
        '</select></div>' +
        '<div class="explica explica-GEMINI"><div class="mensagem info"><b>Como pegar a chave do Gemini (grátis, sem cartão):</b><ol>' +
          '<li>Entre em <b>aistudio.google.com</b> com a conta Google da empresa.</li>' +
          '<li>Clique em <b>Get API key</b> e depois em <b>Criar chave de API</b>.</li><li>Copie a chave e cole no campo abaixo.</li></ol>' +
          'No plano gratuito há um limite diário de leituras, e o Google pode usar as fotos enviadas para melhorar os serviços dele (são só fotos de etiquetas).</div></div>' +
        '<div class="explica explica-VISION"><div class="mensagem info"><b>Google Cloud Vision:</b> as primeiras 1.000 leituras do mês são grátis, mas o Google exige cadastrar um cartão (faturamento) no Google Cloud. ' +
          'Crie um projeto em console.cloud.google.com, ative a "Cloud Vision API" e crie uma chave de API.</div></div>' +
        '<div class="explica explica-DRIVE"><div class="mensagem info"><b>OCR do Google Drive:</b> não precisa de chave e é grátis, mas lê letra de mão bem pior. ' +
          'Na primeira leitura pode ser preciso autorizar o acesso ao Drive no Apps Script (rode a função configurarPlanilha de novo).</div></div>' +
        '<div class="campo campo-chave"><label>Chave da API</label><input name="chave" type="password" autocomplete="off" placeholder="' +
          (c.ocr_chave_configurada === 'SIM' ? '•••••••• chave já configurada (deixe em branco para manter)' : 'Cole aqui a chave') + '">' +
          '<div class="ajuda">A chave fica guardada só no servidor. Os usuários nunca veem.</div></div>' +
        '<div class="campo campo-modelo"><label>Modelo do Gemini</label><input name="modelo" value="' + esc(c.ocr_modelo || 'gemini-3.5-flash-lite') + '">' +
          '<div class="ajuda">Só mude se o Google desativar este modelo (veja a lista em aistudio.google.com).</div></div>' +
        '<button class="botao" type="submit">Salvar</button>' +
      '</form>' +
      '<div class="cartao" style="max-width:640px"><h3 style="margin-top:0">Testar leitura</h3>' +
        '<p class="descricao">Envie a foto de uma etiqueta para ver o que o sistema entende. Nada é registrado.</p>' +
        '<label class="botao secundario">' + ICONES.registrar + 'Escolher foto<input type="file" accept="image/*" capture="environment" class="oculto" data-teste></label>' +
        '<div class="resultado-teste"></div></div>';
    const form = corpo.querySelector('form');
    const ajustar = function () {
      const s = form.servico.value;
      corpo.querySelectorAll('.explica').forEach(function (e) { e.classList.toggle('oculto', !e.classList.contains('explica-' + s)); });
      form.querySelector('.campo-chave').classList.toggle('oculto', s === 'DRIVE');
      form.querySelector('.campo-modelo').classList.toggle('oculto', s !== 'GEMINI');
    };
    form.servico.onchange = ajustar;
    ajustar();
    form.onsubmit = async function (e) {
      e.preventDefault();
      const itens = { ocr_servico: form.servico.value, ocr_modelo: form.modelo.value.trim() || 'gemini-3.5-flash-lite' };
      if (form.chave.value.trim()) itens.ocr_chave = form.chave.value.trim();
      const botao = form.querySelector('button[type=submit]');
      botao.disabled = true;
      try {
        Estado.base.config = await chamar('salvarConfig', { itens: itens });
        salvarCacheBase(Estado.base);
        toast('Configuração de leitura salva.');
        paginaLeitura(el);
      } catch (erro) {
        form.querySelector('.msg').innerHTML = '<div class="mensagem erro">' + esc(erro.message) + '</div>';
        botao.disabled = false;
      }
    };
    corpo.querySelector('[data-teste]').onchange = async function (e) {
      const f = e.target.files && e.target.files[0];
      e.target.value = '';
      if (!f) return;
      const saida = corpo.querySelector('.resultado-teste');
      saida.innerHTML = carregandoHtml('Lendo a etiqueta...');
      try {
        const foto = await reduzirFoto(f, 1600, 0.85);
        const r = await chamar('lerEtiqueta', { imagem: foto, mime: 'image/jpeg' });
        const l = Leitor.interpretar(r.texto || '', Estado.base, { maiorArquivo: Estado.base.maior_arquivo });
        const conf = function (c) { return { alta: '<span class="selo ok">certo</span>', media: '<span class="selo aviso">conferir</span>', baixa: '<span class="selo aviso">conferir</span>', faltou: '<span class="selo erro">não leu</span>', padrao: '<span class="selo">padrão</span>' }[c] || ''; };
        saida.innerHTML = '<div class="teste-leitura"><img src="' + foto + '" alt="">' +
          '<table class="tabela"><tbody>' +
            '<tr><td>Origem</td><td><b>' + esc(l.origem_id ? nomeLojaCurto(l.origem_id) : '—') + '</b> ' + conf(l.confianca.origem_id) + '</td></tr>' +
            '<tr><td>Destino</td><td><b>' + esc(l.destino_id ? nomeLojaCurto(l.destino_id) : '—') + '</b> ' + conf(l.confianca.destino_id) + '</td></tr>' +
            '<tr><td>Arquivo</td><td><b>' + esc(l.arquivo || '—') + '</b> ' + conf(l.confianca.arquivo) + '</td></tr>' +
            '<tr><td>Volume</td><td><b>' + l.volume_atual + '/' + l.volume_total + '</b> ' + conf(l.confianca.volume) + '</td></tr>' +
            '<tr><td>Vendedor</td><td><b>' + esc(l.vendedor_nome || '—') + '</b> ' + (l.vendedor_nome ? conf(l.confianca.vendedor) : '') + '</td></tr>' +
          '</tbody></table></div>' +
          (l.avisos.length ? '<div class="mensagem aviso"><ul class="lista-avisos">' + l.avisos.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul></div>' : '') +
          '<div class="campo"><label>Texto lido pelo ' + esc(r.servico) + '</label><pre class="texto-lido">' + esc(r.texto || '(nada)') + '</pre></div>';
      } catch (erro) {
        saida.innerHTML = '<div class="mensagem erro">' + esc(erro.message) + '</div>';
      }
    };
  }

  /* =========================================================
   *  PÁGINA: TROCAR SENHA
   * ========================================================= */
  function paginaSenha(el) {
    el.innerHTML =
      '<h2>Trocar senha</h2><p class="descricao">Escolha uma senha que só você saiba.</p>' +
      '<form class="cartao" style="max-width:420px" novalidate><div class="msg"></div>' + formularioSenhaHtml() +
      '<button class="botao" type="submit">Salvar nova senha</button></form>';
    const form = el.querySelector('form');
    form.onsubmit = async function (e) {
      e.preventDefault();
      const msg = form.querySelector('.msg');
      const botao = form.querySelector('button');
      botao.disabled = true;
      try {
        await enviarTrocaSenha(form);
        form.reset();
        msg.innerHTML = '<div class="mensagem ok">Senha alterada com sucesso.</div>';
      } catch (erro) {
        msg.innerHTML = '<div class="mensagem erro">' + esc(erro.message) + '</div>';
      }
      botao.disabled = false;
    };
  }

  /* =========================================================
   *  CONFIGURAÇÕES — cabeçalho com abas
   * ========================================================= */
  function cabecalhoConfig(el, atual) {
    const abas = [
      ['#/config/lojas', 'Lojas e CD'],
      ['#/config/vendedores', 'Vendedores'],
      ['#/config/usuarios', 'Usuários'],
      ['#/config/parametros', 'Parâmetros'],
      ['#/config/aparencia', 'Aparência'],
      ['#/config/leitura', 'Leitura de etiquetas'],
      ['#/config/historico', 'Histórico']
    ];
    el.innerHTML =
      '<h2>Configurações</h2><p class="descricao">Cadastros e ajustes do sistema (somente administrador).</p>' +
      '<nav class="abas">' + abas.map(function (a) {
        return '<a href="' + a[0] + '" class="' + (a[0] === atual ? 'ativo' : '') + '">' + a[1] + '</a>';
      }).join('') + '</nav><div class="corpo-config"></div>';
    return el.querySelector('.corpo-config');
  }

  /* ---------- Parâmetros ---------- */
  function paginaParametros(el) {
    const corpo = cabecalhoConfig(el, '#/config/parametros');
    const c = Estado.base.config;
    const campos = [
      ['empresa_nome', 'Nome da empresa', 'text', 'Aparece no topo do sistema e na tela de login.'],
      ['dias_alerta_pendente', 'Alerta de arquivo pendente (dias)', 'number', 'Arquivos sem movimentação há mais dias que isso aparecem no sino.'],
      ['dias_alerta_cd', 'Alerta de mercadoria parada no CD (dias)', 'number', 'Arquivos no CD há mais dias que isso aparecem no sino.'],
      ['dias_apelido_antigo', 'Nome do gerente antigo aceito por (dias)', 'number', 'Quando o gerente de uma loja muda, o nome antigo continua sendo reconhecido nas etiquetas durante esse período.'],
      ['sessao_dias', 'Manter conectado por (dias)', 'number', 'Depois desse prazo o usuário precisa entrar com a senha de novo.']
    ];
    corpo.innerHTML = '<form class="cartao" style="max-width:560px" novalidate><div class="msg"></div>' +
      campos.map(function (f) {
        return '<div class="campo"><label>' + esc(f[1]) + '</label>' +
          '<input name="' + f[0] + '" type="' + f[2] + '" min="1" value="' + esc(c[f[0]] || '') + '" required>' +
          '<div class="ajuda">' + esc(f[3]) + '</div></div>';
      }).join('') +
      '<button class="botao" type="submit">Salvar parâmetros</button></form>';
    const form = corpo.querySelector('form');
    form.onsubmit = async function (e) {
      e.preventDefault();
      const msg = form.querySelector('.msg');
      const botao = form.querySelector('button');
      const itens = {};
      campos.forEach(function (f) { itens[f[0]] = form[f[0]].value; });
      botao.disabled = true;
      try {
        Estado.base.config = await chamar('salvarConfig', { itens: itens });
        salvarCacheBase(Estado.base);
        msg.innerHTML = '<div class="mensagem ok">Parâmetros salvos.</div>';
        el.closest('#app').querySelector('.topo .titulo small').textContent = Estado.base.config.empresa_nome || '';
      } catch (erro) {
        msg.innerHTML = '<div class="mensagem erro">' + esc(erro.message) + '</div>';
      }
      botao.disabled = false;
    };
  }

  /* ---------- Lojas e CD ---------- */
  function chipsApelidosLoja(l) {
    const chips = [];
    if (l.tipo === 'LOJA') {
      const n = Number(l.numero);
      const dois = ('0' + n).slice(-2);
      chips.push('LOJA ' + dois, 'L' + n + (dois !== String(n) ? ' / L' + dois : ''));
    }
    if (l.gerente) chips.push(l.gerente);
    if (l.cidade) chips.push(l.cidade);
    (l.apelidos || []).forEach(function (a) { chips.push(a); });
    let html = chips.map(function (c) { return '<span class="selo">' + esc(c) + '</span>'; }).join('');
    (l.apelidos_temporarios || []).forEach(function (t) {
      html += '<span class="selo aviso" title="Gerente anterior — aceito até ' + esc(data(t.ate)) + '">' + esc(t.nome) + ' até ' + esc(data(t.ate)) + '</span>';
    });
    return '<div class="lista-chips">' + html + '</div>';
  }

  function paginaLojas(el) {
    const corpo = cabecalhoConfig(el, '#/config/lojas');
    const desenhar = function () {
      const linhas = lojasOrdenadas().map(function (l) {
        return '<tr class="' + (l.ativo ? '' : 'inativo') + '">' +
          '<td data-rotulo="Loja">' + seloLoja(l.id) + '</td>' +
          '<td data-rotulo="Gerente">' + esc(l.gerente || '—') + '</td>' +
          '<td data-rotulo="Cidade">' + esc(l.cidade || '—') + '</td>' +
          '<td data-rotulo="Reconhecida na etiqueta como">' + chipsApelidosLoja(l) + '</td>' +
          '<td data-rotulo="Situação">' + (l.ativo ? '<span class="selo ok">Ativa</span>' : '<span class="selo erro">Inativa</span>') + '</td>' +
          '<td class="acoes"><button class="botao secundario pequeno" data-editar="' + esc(l.id) + '">Editar</button></td>' +
        '</tr>';
      }).join('');
      corpo.innerHTML =
        '<div class="barra-acoes"><span class="descricao" style="margin:0">O CD é só uma parada no caminho: nunca é origem nem destino.</span>' +
        '<span class="espaco"></span><button class="botao" data-nova>' + ICONES.mais + 'Nova loja / CD</button></div>' +
        '<table class="tabela"><thead><tr><th>Loja</th><th>Gerente</th><th>Cidade</th><th>Reconhecida na etiqueta como</th><th>Situação</th><th></th></tr></thead>' +
        '<tbody>' + (linhas || '<tr><td colspan="6" class="vazio">Nenhuma loja cadastrada.</td></tr>') + '</tbody></table>';
      corpo.querySelector('[data-nova]').onclick = function () { formLoja(null, desenhar); };
      corpo.querySelectorAll('[data-editar]').forEach(function (b) {
        b.onclick = function () { formLoja(lojaPorId(b.dataset.editar), desenhar); };
      });
    };
    desenhar();
  }

  function formLoja(loja, aoSalvar) {
    const l = loja || { tipo: 'LOJA', ativo: true, apelidos: [], apelidos_temporarios: [] };
    const dias = Estado.base.config.dias_apelido_antigo || '60';
    const temporarios = (l.apelidos_temporarios || []).map(function (t, i) {
      return '<label class="check"><input type="checkbox" name="temp" value="' + i + '" checked> ' +
        esc(t.nome) + ' <span class="selo aviso">aceito até ' + esc(data(t.ate)) + '</span></label>';
    }).join('');

    abrirJanela(loja ? 'Editar ' + (l.tipo === 'CD' ? 'CD' : 'loja') : 'Nova loja / CD',
      '<div class="linha-campos">' +
        '<div class="campo"><label>Tipo</label><select name="tipo">' +
          '<option value="LOJA"' + (l.tipo === 'LOJA' ? ' selected' : '') + '>Loja</option>' +
          '<option value="CD"' + (l.tipo === 'CD' ? ' selected' : '') + '>Centro de Distribuição</option>' +
        '</select></div>' +
        '<div class="campo campo-numero"><label>Número da loja</label><input name="numero" inputmode="numeric" value="' + esc(l.numero || '') + '"></div>' +
      '</div>' +
      '<div class="campo"><label>Nome</label><input name="nome" value="' + esc(l.nome || '') + '" placeholder="Ex.: Loja 05" required></div>' +
      '<div class="linha-campos campos-loja">' +
        '<div class="campo"><label>Gerente</label><input name="gerente" value="' + esc(l.gerente || '') + '"></div>' +
        '<div class="campo"><label>Cidade</label><input name="cidade" value="' + esc(l.cidade || '') + '"></div>' +
      '</div>' +
      '<div class="campo"><label>Outros apelidos aceitos na etiqueta</label>' +
        '<textarea name="apelidos" placeholder="Ex.: Senador; QXB; MN">' + esc((l.apelidos || []).join('; ')) + '</textarea>' +
        '<div class="ajuda">Separe por ponto e vírgula. O número da loja, o gerente e a cidade já são reconhecidos automaticamente.</div></div>' +
      (temporarios ? '<div class="campo"><label>Gerentes anteriores ainda aceitos</label>' + temporarios +
        '<div class="ajuda">Desmarque para deixar de aceitar o nome antes do prazo.</div></div>' : '') +
      (loja && l.gerente ? '<div class="mensagem info campos-loja">Se você trocar o gerente, o nome "' + esc(l.gerente) +
        '" continuará sendo aceito nas etiquetas por ' + esc(dias) + ' dias.</div>' : '') +
      '<div class="campo"><label class="check"><input type="checkbox" name="ativo"' + (l.ativo ? ' checked' : '') + '> Ativa</label></div>',
      {
        aoAbrir: function (form) {
          const ajustar = function () {
            const cd = form.tipo.value === 'CD';
            form.querySelector('.campo-numero').classList.toggle('oculto', cd);
            form.querySelectorAll('.campos-loja').forEach(function (x) { x.classList.toggle('oculto', cd); });
          };
          form.tipo.onchange = ajustar;
          form.numero.oninput = function () {
            if (!loja && /^\d+$/.test(form.numero.value) && (!form.nome.value || /^Loja \d+$/.test(form.nome.value))) {
              form.nome.value = 'Loja ' + ('0' + Number(form.numero.value)).slice(-2);
            }
          };
          ajustar();
        },
        aoSalvar: async function (form) {
          const cd = form.tipo.value === 'CD';
          const dados = {
            id: loja ? loja.id : '',
            tipo: form.tipo.value,
            numero: cd ? '' : form.numero.value.trim(),
            nome: form.nome.value.trim(),
            gerente: cd ? '' : form.gerente.value.trim(),
            cidade: cd ? '' : form.cidade.value.trim(),
            apelidos: form.apelidos.value,
            ativo: form.ativo.checked
          };
          if (loja) {
            const marcados = Array.from(form.querySelectorAll('input[name=temp]:checked')).map(function (c) { return Number(c.value); });
            dados.apelidos_temporarios = (l.apelidos_temporarios || []).filter(function (t, i) { return marcados.indexOf(i) >= 0; });
          }
          if (!cd && !/^\d+$/.test(dados.numero)) throw new Error('Informe o número da loja (somente números).');
          await chamar('salvarLoja', { loja: dados });
          await recarregarBase();
          toast('Loja salva.');
          aoSalvar();
        }
      });
  }

  /* ---------- Vendedores ---------- */
  function paginaVendedores(el) {
    const corpo = cabecalhoConfig(el, '#/config/vendedores');
    let filtroLoja = '';
    let busca = '';
    const desenhar = function () {
      const opcoes = '<option value="">Todas</option><option value="TODAS"' + (filtroLoja === 'TODAS' ? ' selected' : '') + '>Vendedores de todas as lojas</option>' +
        lojasOrdenadas(function (l) { return l.tipo === 'LOJA'; }).map(function (l) {
          return '<option value="' + esc(l.id) + '"' + (filtroLoja === l.id ? ' selected' : '') + '>' + esc(nomeLoja(l.id)) + '</option>';
        }).join('');
      const lista = Estado.base.vendedores
        .filter(function (v) { return !filtroLoja || v.loja_id === filtroLoja; })
        .filter(function (v) { return !busca || normalizar(v.nome + ' ' + v.apelidos.join(' ')).indexOf(normalizar(busca)) >= 0; })
        .sort(function (a, b) { return a.nome.localeCompare(b.nome, 'pt-BR'); });
      const linhas = lista.map(function (v) {
        return '<tr class="' + (v.ativo ? '' : 'inativo') + '">' +
          '<td data-rotulo="Nome"><b>' + esc(v.nome) + '</b></td>' +
          '<td data-rotulo="Loja">' + seloLoja(v.loja_id) + '</td>' +
          '<td data-rotulo="Apelidos">' + (v.apelidos.length ? '<div class="lista-chips">' + v.apelidos.map(function (a) { return '<span class="selo">' + esc(a) + '</span>'; }).join('') + '</div>' : '—') + '</td>' +
          '<td data-rotulo="Situação">' + (v.ativo ? '<span class="selo ok">Ativo</span>' : '<span class="selo erro">Inativo</span>') + '</td>' +
          '<td class="acoes"><button class="botao secundario pequeno" data-editar="' + esc(v.id) + '">Editar</button></td></tr>';
      }).join('');
      corpo.innerHTML =
        '<div class="barra-acoes">' +
          '<div class="campo"><select data-filtro>' + opcoes + '</select></div>' +
          '<div class="campo"><input data-busca placeholder="Buscar vendedor" value="' + esc(busca) + '"></div>' +
          '<span class="espaco"></span>' +
          '<button class="botao" data-novo>' + ICONES.mais + 'Novo vendedor</button></div>' +
        '<table class="tabela"><thead><tr><th>Nome</th><th>Loja</th><th>Outras formas na etiqueta</th><th>Situação</th><th></th></tr></thead>' +
        '<tbody>' + (linhas || '<tr><td colspan="5" class="vazio">Nenhum vendedor encontrado.</td></tr>') + '</tbody></table>';
      corpo.querySelector('[data-filtro]').onchange = function (e) { filtroLoja = e.target.value; desenhar(); };
      const campoBusca = corpo.querySelector('[data-busca]');
      campoBusca.oninput = function (e) {
        busca = e.target.value;
        desenhar();
        const novo = corpo.querySelector('[data-busca]');
        novo.focus();
        novo.setSelectionRange(busca.length, busca.length);
      };
      corpo.querySelector('[data-novo]').onclick = function () { formVendedor(null, desenhar, filtroLoja); };
      corpo.querySelectorAll('[data-editar]').forEach(function (b) {
        b.onclick = function () {
          formVendedor(Estado.base.vendedores.find(function (v) { return v.id === b.dataset.editar; }), desenhar);
        };
      });
    };
    desenhar();
  }

  function formVendedor(vendedor, aoSalvar, lojaSugerida) {
    const v = vendedor || { ativo: true, apelidos: [], loja_id: lojaSugerida && lojaSugerida !== 'TODAS' ? lojaSugerida : '' };
    const opcoes = '<option value="">Selecione...</option>' +
      '<option value="TODAS"' + (v.loja_id === 'TODAS' ? ' selected' : '') + '>Todas as lojas</option>' +
      lojasOrdenadas(function (l) { return l.tipo === 'LOJA' && (l.ativo || l.id === v.loja_id); }).map(function (l) {
        return '<option value="' + esc(l.id) + '"' + (v.loja_id === l.id ? ' selected' : '') + '>' + esc(nomeLoja(l.id)) + '</option>';
      }).join('');
    abrirJanela(vendedor ? 'Editar vendedor' : 'Novo vendedor',
      '<div class="campo"><label>Nome</label><input name="nome" value="' + esc(v.nome || '') + '" required></div>' +
      '<div class="campo"><label>Loja</label><select name="loja_id" required>' + opcoes + '</select>' +
        '<div class="ajuda">Use "Todas as lojas" para vendedores como o Online, que existe em todas.</div></div>' +
      '<div class="campo"><label>Outras formas de escrever na etiqueta</label>' +
        '<textarea name="apelidos" placeholder="Ex.: ON-LINE; ON LINE">' + esc((v.apelidos || []).join('; ')) + '</textarea>' +
        '<div class="ajuda">Opcional. Separe por ponto e vírgula.</div></div>' +
      '<div class="campo"><label class="check"><input type="checkbox" name="ativo"' + (v.ativo ? ' checked' : '') + '> Ativo</label></div>',
      {
        aoSalvar: async function (form) {
          if (!form.loja_id.value) throw new Error('Selecione a loja do vendedor.');
          await chamar('salvarVendedor', {
            vendedor: {
              id: vendedor ? vendedor.id : '',
              nome: form.nome.value.trim(),
              loja_id: form.loja_id.value,
              apelidos: form.apelidos.value,
              ativo: form.ativo.checked
            }
          });
          await recarregarBase();
          toast('Vendedor salvo.');
          aoSalvar();
        }
      });
  }

  /* ---------- Usuários ---------- */
  function paginaUsuarios(el) {
    const corpo = cabecalhoConfig(el, '#/config/usuarios');
    corpo.innerHTML = carregandoHtml('Carregando usuários...');
    let usuarios = [];
    const desenhar = function () {
      const ordem = { ADM: 0, CEO: 1, MOTORISTA: 2, GERENTE: 3, ESTOQUISTA: 4 };
      const linhas = usuarios.slice().sort(function (a, b) {
        return (ordem[a.perfil] - ordem[b.perfil]) || a.nome.localeCompare(b.nome, 'pt-BR');
      }).map(function (u) {
        return '<tr class="' + (u.ativo ? '' : 'inativo') + '">' +
          '<td data-rotulo="Nome"><b>' + esc(u.nome) + '</b></td>' +
          '<td data-rotulo="Login">' + esc(u.login) + '</td>' +
          '<td data-rotulo="Perfil">' + esc(PERFIS[u.perfil] || u.perfil) + '</td>' +
          '<td data-rotulo="Loja">' + (u.loja_id ? seloLoja(u.loja_id) : '<span class="selo">Todas</span>') + '</td>' +
          '<td data-rotulo="Último acesso">' + esc(dataHora(u.ultimo_acesso)) + '</td>' +
          '<td data-rotulo="Situação">' + (u.ativo ? '<span class="selo ok">Ativo</span>' : '<span class="selo erro">Inativo</span>') +
            (u.trocar_senha ? ' <span class="selo aviso">Senha provisória</span>' : '') + '</td>' +
          '<td class="acoes"><button class="botao secundario pequeno" data-senha="' + esc(u.id) + '">Redefinir senha</button> ' +
          '<button class="botao secundario pequeno" data-editar="' + esc(u.id) + '">Editar</button></td></tr>';
      }).join('');
      corpo.innerHTML =
        '<div class="barra-acoes"><span class="descricao" style="margin:0">Gerentes e estoquistas veem só a própria loja. Administrador e motorista veem todas.</span>' +
        '<span class="espaco"></span><button class="botao" data-novo>' + ICONES.mais + 'Novo usuário</button></div>' +
        '<table class="tabela"><thead><tr><th>Nome</th><th>Login</th><th>Perfil</th><th>Loja</th><th>Último acesso</th><th>Situação</th><th></th></tr></thead>' +
        '<tbody>' + (linhas || '<tr><td colspan="7" class="vazio">Nenhum usuário.</td></tr>') + '</tbody></table>';
      corpo.querySelector('[data-novo]').onclick = function () { formUsuario(null, carregar); };
      corpo.querySelectorAll('[data-editar]').forEach(function (b) {
        b.onclick = function () { formUsuario(usuarios.find(function (u) { return u.id === b.dataset.editar; }), carregar); };
      });
      corpo.querySelectorAll('[data-senha]').forEach(function (b) {
        b.onclick = function () { formRedefinirSenha(usuarios.find(function (u) { return u.id === b.dataset.senha; }), carregar); };
      });
    };
    const carregar = async function () {
      try {
        usuarios = await chamar('listarUsuarios');
        desenhar();
      } catch (erro) {
        corpo.innerHTML = '<div class="mensagem erro">' + esc(erro.message) + '</div>';
      }
    };
    carregar();
  }

  function formUsuario(usuario, aoSalvar) {
    const u = usuario || { perfil: 'ESTOQUISTA', ativo: true };
    const perfis = Object.keys(PERFIS).map(function (p) {
      return '<option value="' + p + '"' + (u.perfil === p ? ' selected' : '') + '>' + PERFIS[p] + '</option>';
    }).join('');
    const lojas = '<option value="">Selecione...</option>' +
      lojasOrdenadas(function (l) { return l.ativo || l.id === u.loja_id; }).map(function (l) {
        return '<option value="' + esc(l.id) + '"' + (u.loja_id === l.id ? ' selected' : '') + '>' + esc(nomeLoja(l.id)) + '</option>';
      }).join('');
    abrirJanela(usuario ? 'Editar usuário' : 'Novo usuário',
      '<div class="campo"><label>Nome</label><input name="nome" value="' + esc(u.nome || '') + '" required></div>' +
      '<div class="campo"><label>Login</label><input name="login" autocapitalize="none" value="' + esc(u.login || '') + '" required>' +
        '<div class="ajuda">Sem espaços. Ex.: joao.silva</div></div>' +
      '<div class="linha-campos">' +
        '<div class="campo"><label>Perfil</label><select name="perfil">' + perfis + '</select></div>' +
        '<div class="campo campo-loja"><label>Loja</label><select name="loja_id">' + lojas + '</select></div>' +
      '</div>' +
      (usuario ? '' : '<div class="campo"><label>Senha provisória</label><input name="senha" type="text" autocomplete="off" required>' +
        '<div class="ajuda">A pessoa vai criar a própria senha no primeiro acesso. Mínimo de 6 caracteres.</div></div>') +
      '<div class="campo"><label class="check"><input type="checkbox" name="ativo"' + (u.ativo ? ' checked' : '') + '> Ativo</label></div>',
      {
        aoAbrir: function (form) {
          const ajustar = function () {
            const precisa = form.perfil.value === 'GERENTE' || form.perfil.value === 'ESTOQUISTA';
            form.querySelector('.campo-loja').classList.toggle('oculto', !precisa);
          };
          form.perfil.onchange = ajustar;
          ajustar();
        },
        aoSalvar: async function (form) {
          const precisa = form.perfil.value === 'GERENTE' || form.perfil.value === 'ESTOQUISTA';
          if (precisa && !form.loja_id.value) throw new Error('Selecione a loja do gerente/estoquista.');
          await chamar('salvarUsuario', {
            usuario: {
              id: usuario ? usuario.id : '',
              nome: form.nome.value.trim(),
              login: form.login.value.trim().toLowerCase(),
              perfil: form.perfil.value,
              loja_id: precisa ? form.loja_id.value : '',
              senha: usuario ? '' : form.senha.value,
              ativo: form.ativo.checked
            }
          });
          toast('Usuário salvo.');
          if (usuario && usuario.id === Estado.usuario.id) await recarregarBase();
          aoSalvar();
        }
      });
  }

  function formRedefinirSenha(usuario, aoSalvar) {
    abrirJanela('Redefinir senha de ' + usuario.nome,
      '<p class="descricao">Defina uma senha provisória. No próximo acesso, ' + esc(usuario.nome.split(' ')[0]) + ' vai precisar criar uma nova.</p>' +
      '<div class="campo"><label>Senha provisória</label><input name="novaSenha" type="text" autocomplete="off" required></div>',
      {
        textoSalvar: 'Redefinir',
        aoSalvar: async function (form) {
          await chamar('resetarSenha', { id: usuario.id, novaSenha: form.novaSenha.value });
          toast('Senha redefinida.');
          aoSalvar();
        }
      });
  }

  /* ---------- Histórico ---------- */
  async function paginaHistorico(el) {
    const corpo = cabecalhoConfig(el, '#/config/historico');
    corpo.innerHTML = carregandoHtml('Carregando histórico...');
    try {
      const itens = await chamar('listarAuditoria', { limite: 300 });
      const linhas = itens.map(function (i) {
        return '<tr><td data-rotulo="Data">' + esc(dataHora(i.data_hora)) + '</td>' +
          '<td data-rotulo="Usuário">' + esc(i.usuario_nome) + '</td>' +
          '<td data-rotulo="Ação"><b>' + esc(i.acao) + '</b></td>' +
          '<td data-rotulo="Detalhes" style="font-size:12px;color:var(--texto-suave);word-break:break-word">' + esc(String(i.detalhes || '').slice(0, 200)) + '</td></tr>';
      }).join('');
      corpo.innerHTML = '<p class="descricao">Últimas alterações feitas nos cadastros.</p>' +
        '<table class="tabela"><thead><tr><th>Data</th><th>Usuário</th><th>Ação</th><th>Detalhes</th></tr></thead>' +
        '<tbody>' + (linhas || '<tr><td colspan="4" class="vazio">Nenhuma alteração registrada ainda.</td></tr>') + '</tbody></table>';
    } catch (erro) {
      corpo.innerHTML = '<div class="mensagem erro">' + esc(erro.message) + '</div>';
    }
  }

  /* =========================================================
   *  INICIALIZAÇÃO
   * ========================================================= */
  function atualizarFaixaOffline() {
    document.getElementById('faixa-offline').hidden = navigator.onLine;
  }

  async function iniciar() {
    aplicarTema((lerCacheBase() || {}).config);
    window.addEventListener('online', function () { if (Estado.usuario) Fila.sincronizar(); });
    setInterval(function () { if (Estado.usuario && navigator.onLine) Fila.sincronizar(); }, 60000);
    window.addEventListener('online', atualizarFaixaOffline);
    window.addEventListener('offline', atualizarFaixaOffline);
    atualizarFaixaOffline();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(function () { /* sem cache offline */ });
    }

    if (!Api.configurada()) return telaSemConfig();
    if (!Api.lerToken()) return telaLogin();

    $app.innerHTML = carregandoHtml('Abrindo o Rastreia...');
    try {
      await recarregarBase();
      rotear();
      Fila.sincronizar();
    } catch (erro) {
      if (erro.sessaoExpirada) return;
      const cache = lerCacheBase();
      if (erro.offline && cache && cache.usuario) {
        Estado.base = cache;
        Estado.usuario = cache.usuario;
        rotear();
        toast('Sem internet: mostrando os últimos dados salvos no aparelho.', true);
      } else {
        telaLogin(erro.message);
      }
    }
  }

  iniciar();
})();
