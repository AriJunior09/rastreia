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
    const el = document.createElement('div');
    el.className = 'toast' + (erro ? ' erro' : '');
    el.textContent = mensagem;
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, erro ? 5000 : 2800);
  }

  function carregandoHtml(texto) {
    return '<div class="carregando"><div class="girando"></div>' + esc(texto || 'Carregando...') + '</div>';
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
          '<button type="button" class="botao secundario" data-fechar>Cancelar</button>' +
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
    $app.innerHTML =
      '<div class="tela-login"><form class="caixa-login" novalidate>' +
        '<div class="marca">' + ICONES.caixa +
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
        else { location.hash = '#/inicio'; rotear(); }
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
      { rota: '#/registrar', texto: 'Registrar', icone: 'registrar', breve: 'Fase 2' },
      { rota: '#/transferencias', texto: 'Transferências', icone: 'lista', breve: 'Fase 3' }
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
        '<div class="titulo">Rastreia<small>' + esc(empresa) + '</small></div>' +
        '<div class="usuario"><b>' + esc(u.nome) + '</b><br>' + esc(detalhe) + '</div>' +
        '<button class="botao-icone" data-sair title="Sair" aria-label="Sair">' + ICONES.sair + '</button>' +
      '</header>' +
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
      if (confirm('Deseja sair do Rastreia?')) sair();
    };
    return $app.querySelector('.conteudo');
  }

  /* =========================================================
   *  ROTAS
   * ========================================================= */
  const ROTAS = {
    '#/inicio': paginaInicio,
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
    let rota = location.hash || '#/inicio';
    if (!ROTAS[rota]) rota = '#/inicio';
    if (rota.indexOf('#/config') === 0 && !ehAdm()) rota = '#/inicio';
    const conteudo = montarLayout(rota);
    ROTAS[rota](conteudo);
  }

  window.addEventListener('hashchange', rotear);

  /* =========================================================
   *  PÁGINA: INÍCIO
   * ========================================================= */
  function paginaInicio(el) {
    const u = Estado.usuario;
    const lojas = Estado.base.lojas.filter(function (l) { return l.ativo && l.tipo === 'LOJA'; });
    const cds = Estado.base.lojas.filter(function (l) { return l.ativo && l.tipo === 'CD'; });
    const vendedores = Estado.base.vendedores.filter(function (v) { return v.ativo; });
    const visao = u.perfil === 'ADM' || u.perfil === 'MOTORISTA'
      ? 'Você vê as transferências de <b>todas as lojas</b>.'
      : 'Você vê as transferências em que a <b>' + esc(nomeLoja(u.loja_id)) + '</b> é origem ou destino.';

    el.innerHTML =
      '<h2>Olá, ' + esc(u.nome.split(' ')[0]) + '!</h2>' +
      '<p class="descricao">' + esc(PERFIS[u.perfil]) + (u.loja_id ? ' · ' + esc(nomeLoja(u.loja_id)) : '') + '</p>' +
      '<div class="grade">' +
        '<div class="cartao indicador"><span class="valor">' + lojas.length + '</span><span class="rotulo">Lojas ativas</span></div>' +
        '<div class="cartao indicador"><span class="valor">' + cds.length + '</span><span class="rotulo">Centro(s) de distribuição</span></div>' +
        '<div class="cartao indicador"><span class="valor">' + vendedores.length + '</span><span class="rotulo">Vendedores cadastrados</span></div>' +
      '</div>' +
      '<div class="cartao"><p style="margin-top:0">' + visao + '</p>' +
        '<div class="mensagem info" style="margin-bottom:0">O registro das transferências (câmera e digitação) e o painel de acompanhamento ' +
        'chegam nas próximas fases. Por enquanto o sistema está na fase de cadastros.</div></div>';
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
      const ordem = { ADM: 0, MOTORISTA: 1, GERENTE: 2, ESTOQUISTA: 3 };
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
