/**
 * Comunicação com o servidor (Google Apps Script).
 * Usa POST com "text/plain" para evitar bloqueio de CORS do Google.
 */
const Api = (function () {
  const CHAVE_TOKEN = 'rastreia_token';

  function lerToken() {
    try { return localStorage.getItem(CHAVE_TOKEN) || ''; } catch (e) { return ''; }
  }

  function salvarToken(token) {
    try {
      if (token) localStorage.setItem(CHAVE_TOKEN, token);
      else localStorage.removeItem(CHAVE_TOKEN);
    } catch (e) { /* armazenamento indisponível */ }
  }

  function configurada() {
    const url = RASTREIA_CONFIG.API_URL || '';
    return /^https:\/\/script\.google\.com\/.+\/exec$/.test(url.trim());
  }

  // Consultas que podem ser repetidas sem risco: em erro temporário do Google, o app tenta de novo sozinho.
  const SO_LEITURA = { resumoInicio: 1, rotaDoDia: 1, consultarArquivo: 1, listarTransferencias: 1, listarEventos: 1, relatorio: 1,
    dadosBase: 1, sessao: 1, listarRotas: 1, listarUsuarios: 1, listarAuditoria: 1, listarErros: 1 };
  const ESPERAS_LEITURA = [1500, 4000];
  let aoErroTecnico = null; // o app registra aqui quem guarda os erros técnicos

  async function chamar(acao, dados) {
    for (let tentativa = 0; ; tentativa++) {
      try {
        return await chamarUmaVez(acao, dados);
      } catch (erro) {
        const repetir = erro.temporario && SO_LEITURA[acao] && navigator.onLine && tentativa < ESPERAS_LEITURA.length;
        if (!repetir) {
          if (erro.temporario && aoErroTecnico) aoErroTecnico({ acao: acao, mensagem: erro.message, detalhe: erro.detalhe || '' });
          throw erro;
        }
        await new Promise(function (ok) { setTimeout(ok, ESPERAS_LEITURA[tentativa]); });
      }
    }
  }

  async function chamarUmaVez(acao, dados) {
    if (!configurada()) {
      throw new ErroApi('O endereço do servidor ainda não foi configurado no arquivo config.js.');
    }
    if (!navigator.onLine) {
      throw new ErroApi('Sem internet. Verifique a conexão e tente de novo.', { offline: true });
    }
    let resposta;
    try {
      resposta = await fetch(RASTREIA_CONFIG.API_URL.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ acao: acao, token: lerToken(), dados: dados || {} }),
        redirect: 'follow'
      });
    } catch (e) {
      // Sem resposta: sem internet de verdade, ou o Google não respondeu (temporário)
      throw new ErroApi('Não foi possível falar com o servidor. Verifique a internet.', { offline: true, temporario: navigator.onLine, detalhe: String(e && e.message || e) });
    }
    let corpo;
    try {
      corpo = await resposta.json();
    } catch (e) {
      // O Google devolveu uma página de erro (servidor sobrecarregado, limite, implantação errada)
      throw new ErroApi('O servidor do Google não respondeu direito (código ' + resposta.status + '). O app vai tentar de novo.', { temporario: true, detalhe: 'HTTP ' + resposta.status });
    }
    if (!corpo.ok) {
      throw new ErroApi(String(corpo.erro || 'Erro desconhecido.').replace(/^SESSAO:\s*/, ''), { sessaoExpirada: !!corpo.sessaoExpirada, temporario: !!corpo.temporario });
    }
    return corpo.dados;
  }

  class ErroApi extends Error {
    constructor(mensagem, extras) {
      super(mensagem);
      Object.assign(this, extras || {});
    }
  }

  return { chamar, lerToken, salvarToken, configurada, ErroApi, aoErroTecnico: function (fn) { aoErroTecnico = fn; } };
})();
