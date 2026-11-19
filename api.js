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

  async function chamar(acao, dados) {
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
      throw new ErroApi('Não foi possível falar com o servidor. Verifique a internet.', { offline: true });
    }
    let corpo;
    try {
      corpo = await resposta.json();
    } catch (e) {
      throw new ErroApi('Resposta inválida do servidor. Confira se a implantação do Apps Script está com acesso "Qualquer pessoa".');
    }
    if (!corpo.ok) {
      throw new ErroApi(String(corpo.erro || 'Erro desconhecido.').replace(/^SESSAO:\s*/, ''), { sessaoExpirada: !!corpo.sessaoExpirada });
    }
    return corpo.dados;
  }

  class ErroApi extends Error {
    constructor(mensagem, extras) {
      super(mensagem);
      Object.assign(this, extras || {});
    }
  }

  return { chamar, lerToken, salvarToken, configurada, ErroApi };
})();
