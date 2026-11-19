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
    caminhao: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 4h14v12H1z"/><path d="M15 9h4l3 3v4h-7z"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/></svg>',
    certo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    alerta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
    pessoa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg>',
    nuvem: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/><path d="M12 12v5M9.5 14.5L12 12l2.5 2.5"/></svg>',
    seta: '<svg class="seta" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
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
    return $app.querySelector('.conteudo');
  }

  /* =========================================================
   *  ROTAS
   * ========================================================= */
  const ROTAS = {
    '#/inicio': paginaInicio,
    '#/registrar': paginaRegistrar,
    '#/pendentes': paginaPendentes,
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

    let resumo;
    try {
      resumo = await chamar('resumoInicio');
      try { localStorage.setItem(CHAVE_RESUMO, JSON.stringify({ quando: new Date().toISOString(), resumo: resumo })); } catch (e) { /* ignora */ }
    } catch (erro) {
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
    corpo.innerHTML = (resumo.tipo === 'LOJA' ? inicioLojaHtml(resumo) : inicioGeralHtml(resumo)) + '';
    const primeiroBloco = corpo.querySelector('details.bloco');
    if (primeiroBloco) primeiroBloco.insertAdjacentHTML('beforebegin', botoesBlocosHtml());
    ativarBlocos(corpo);
    ativarBotoesBlocos(corpo);
  }

  function inicioLojaHtml(r) {
    const rec = r.recebendo;
    const env = r.enviando;
    const semNada = rec.total + env.aguardando_coleta + env.a_caminho + rec.recebidos_7_dias + env.entregues_7_dias === 0;
    const partes = [];
    if (rec.com_motorista) partes.push('<span>' + ICONES.caminhao + rec.com_motorista + ' com o motorista</span>');
    if (rec.no_cd) partes.push('<span>' + ICONES.armazem + rec.no_cd + ' no CD</span>');
    if (rec.na_origem) partes.push('<span>' + ICONES.caixa + rec.na_origem + ' aguardando coleta na origem</span>');

    let html =
      '<div class="destaque">' +
        '<div class="destaque-rotulo">Arquivos para você</div>' +
        '<div class="destaque-numero">' + rec.total + '</div>' +
        (partes.length ? '<div class="destaque-partes">' + partes.join('') + '</div>' : '<div class="destaque-partes"><span>Nenhum arquivo a caminho da sua loja no momento.</span></div>') +
        '<div class="destaque-rodape">' + ICONES.certo + rec.recebidos_7_dias + ' recebido' + (rec.recebidos_7_dias === 1 ? '' : 's') + ' nos últimos 7 dias</div>' +
      '</div>';

    if (r.atencao.length) {
      html += blocoHtml('Precisam de atenção (' + r.atencao.length + ')',
        '<p class="descricao pequena">Atrasados (mais de ' + r.dias_alerta_pendente + ' dias parados, ou ' + r.dias_alerta_cd + ' no CD), com volume faltando ou com ocorrência.</p>' +
        listaArquivosHtml(r.atencao, 'ambos'), '<span class="selo erro">' + ICONES.alerta + 'Atenção</span>');
    }

    html += blocoHtml('Sua loja enviando',
      '<div class="grade tres">' +
        numeroHtml(env.aguardando_coleta, 'Aguardando coleta na sua loja', env.aguardando_coleta ? 'realce' : '', 'caixa') +
        numeroHtml(env.a_caminho, 'A caminho do destino', '', 'caminhao') +
        numeroHtml(env.entregues_7_dias, 'Entregues nos últimos 7 dias', '', 'certo') +
      '</div>');

    if (semNada) html += avisoFaseHtml();

    if (rec.vendedores.length) {
      html += blocoHtml('Pedidos de vendedores chegando (' + rec.vendedores.length + ')',
        '<p class="descricao pequena">Avise o vendedor quando a mercadoria chegar.</p>' + listaArquivosHtml(rec.vendedores, 'origem'));
    }
    html += blocoHtml('Arquivos para você (' + rec.total + ')', listaArquivosHtml(rec.lista, 'origem', 'Nenhum arquivo a caminho da sua loja.'));
    html += blocoHtml('Aguardando coleta na sua loja (' + env.aguardando_coleta + ')', listaArquivosHtml(env.lista_coleta, 'destino', 'Nenhum arquivo esperando o motorista.'));
    html += blocoHtml('Enviados a caminho (' + env.a_caminho + ')', listaArquivosHtml(env.lista_caminho, 'destino', 'Nenhum arquivo enviado em trânsito.'));
    return html;
  }

  function inicioGeralHtml(r) {
    const lojasColeta = Object.keys(r.coleta_por_loja || {}).sort().map(function (id) {
      return '<span class="selo loja">' + esc(nomeLojaCurto(id)) + ': ' + r.coleta_por_loja[id] + '</span>';
    }).join('');
    let html =
      '<div class="destaque">' +
        '<div class="destaque-rotulo">Arquivos em aberto</div>' +
        '<div class="destaque-numero">' + r.em_aberto + '</div>' +
        '<div class="destaque-rodape">' + ICONES.certo + r.entregues_hoje + ' entregue' + (r.entregues_hoje === 1 ? '' : 's') + ' hoje</div>' +
      '</div>' +
      '<div class="grade tres">' +
        numeroHtml(r.aguardando_coleta, 'Aguardando coleta nas lojas', r.aguardando_coleta ? 'realce' : '', 'caixa') +
        numeroHtml(r.com_motorista, 'Com motorista', '', 'caminhao') +
        numeroHtml(r.no_cd, 'No CD', 'cd', 'armazem') +
      '</div>';
    if (r.em_aberto + r.entregues_hoje === 0) html += avisoFaseHtml();
    if (lojasColeta) html += blocoHtml('Onde tem mercadoria para coletar', '<div class="lista-chips">' + lojasColeta + '</div>');
    if (r.atencao.length) html += blocoHtml('Precisam de atenção (' + r.atencao.length + ')', listaArquivosHtml(r.atencao, 'ambos'), '<span class="selo erro">' + ICONES.alerta + 'Atenção</span>');
    html += blocoHtml('No CD (' + r.no_cd + ')', listaArquivosHtml(r.lista_cd, 'ambos', 'Nada parado no CD.'));
    html += blocoHtml('Com motorista (' + r.com_motorista + ')', listaArquivosHtml(r.lista_motorista, 'ambos', 'Nenhum arquivo em trânsito.'));
    return html;
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
    if (u.perfil === 'ADM') return ['SEPARADA', 'COM_MOTORISTA', 'NO_CD', 'ENTREGUE'];
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

    el.innerHTML =
      '<h2>Registrar</h2><p class="descricao">Digite o número do arquivo da etiqueta e escolha a situação.</p>' +
      '<form class="cartao form-registro" novalidate autocomplete="off">' +
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
        forma_registro: ehCelular ? 'MANUAL' : 'WEB',
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
