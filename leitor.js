/**
 * RASTREIA — Leitor de etiquetas
 * Recebe o texto lido da foto da etiqueta (escrita à mão) e descobre:
 * loja de origem, loja de destino, número do arquivo, volume (ex.: 1/3) e vendedor.
 *
 * Regras (ver plano do programa, seção 5):
 *  - Marcadores aceitos com ":", "/", "-", "!" ou sem separador:
 *      origem: DE, D · destino: PARA, P · arquivo: ARQUIVO, ARQ, A · volume/vendedor: VOLUME, VOL, V
 *  - "V" seguido de número/número = volume; seguido de nome = vendedor.
 *  - Origem sem "DE": a loja que aparece antes do destino.
 *  - Número solto de 4 a 7 dígitos = arquivo.
 *  - Loja reconhecida por número (LOJA 05, L5, L05), gerente, cidade ou apelido; tolera pequenos erros.
 *  - Nome que não é loja = vendedor (de preferência um vendedor cadastrado).
 *
 * Funciona no navegador (window.Leitor) e no Node (require).
 */
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) module.exports = fabrica();
  else raiz.Leitor = fabrica();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const MARCADORES = {
    DE: 'ORIGEM', D: 'ORIGEM',
    PARA: 'DESTINO', PRA: 'DESTINO', P: 'DESTINO',
    ARQUIVO: 'ARQUIVO', ARQ: 'ARQUIVO', ARO: 'ARQUIVO', ARG: 'ARQUIVO', ABQ: 'ARQUIVO', AQ: 'ARQUIVO', A: 'ARQUIVO',
    VOLUME: 'V', VOL: 'V', V: 'V'
  };
  // Palavras que nunca são nome de vendedor
  const IGNORAR = ['LOJA', 'LJ', 'DE', 'PARA', 'ARQ', 'ARQUIVO', 'VOL', 'VOLUME', 'CD', 'NF', 'OK'];

  function semAcento(texto) {
    return String(texto || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
  }

  function chave(texto) {
    return semAcento(texto).replace(/[^A-Z0-9]/g, '');
  }

  function distancia(a, b) {
    if (a === b) return 0;
    const m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    let ant = [];
    for (let j = 0; j <= n; j++) ant[j] = j;
    for (let i = 1; i <= m; i++) {
      const atual = [i];
      for (let j = 1; j <= n; j++) {
        atual[j] = Math.min(ant[j] + 1, atual[j - 1] + 1, ant[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      ant = atual;
    }
    return ant[n];
  }

  /** Quantos erros de letra são tolerados para um nome desse tamanho. */
  function tolerancia(tamanho) {
    if (tamanho <= 3) return 0;
    if (tamanho <= 6) return 1;
    return 2;
  }

  /** Corrige letras que o leitor costuma confundir com números (só em palavras que são quase todas números). */
  function corrigirNumero(token) {
    const digitos = (token.match(/\d/g) || []).length;
    if (token.length < 4 || token.length > 8 || digitos < Math.ceil(token.length * 0.6)) return token;
    const mapa = { O: '0', Q: '0', D: '0', I: '1', L: '1', J: '1', T: '1', S: '5', B: '8', Z: '2', G: '6', A: '4' };
    if (!/^[0-9OQDILJTSBZGA]+$/.test(token)) return token;
    return token.replace(/[OQDILJTSBZGA]/g, function (c) { return mapa[c]; });
  }

  /** Monta a lista de nomes reconhecíveis de cada loja e vendedor. */
  function prepararCadastros(lojas, vendedores) {
    const hoje = new Date().toISOString().slice(0, 10);
    const nomesLojas = [];
    (lojas || []).forEach(function (l) {
      if (l.tipo !== 'LOJA' || l.ativo === false) return;
      const nomes = [l.gerente, l.cidade].concat(l.apelidos || [])
        .concat((l.apelidos_temporarios || []).filter(function (t) { return !t.ate || t.ate >= hoje; }).map(function (t) { return t.nome; }));
      nomes.forEach(function (n) {
        const k = chave(n);
        if (k) nomesLojas.push({ chave: k, partes: semAcento(n).split(/[^A-Z0-9]+/).filter(Boolean), loja: l });
      });
    });
    const nomesVendedores = [];
    (vendedores || []).forEach(function (v) {
      if (v.ativo === false) return;
      [v.nome].concat(v.apelidos || []).forEach(function (n) {
        const k = chave(n);
        if (k) nomesVendedores.push({ chave: k, partes: semAcento(n).split(/[^A-Z0-9]+/).filter(Boolean), vendedor: v });
      });
    });
    return { lojas: lojas || [], nomesLojas: nomesLojas, nomesVendedores: nomesVendedores };
  }

  /** Junta nomes de várias palavras (ex.: MORADA NOVA, ON-LINE) num só "pedaço" antes de separar o texto. */
  function juntarNomesCompostos(texto, cad) {
    const compostos = cad.nomesLojas.concat(cad.nomesVendedores).filter(function (n) { return n.partes.length > 1; })
      .sort(function (a, b) { return b.partes.join('').length - a.partes.join('').length; });
    compostos.forEach(function (n) {
      const re = new RegExp('\\b' + n.partes.join('[\\s\\-_./]*') + '\\b', 'g');
      texto = texto.replace(re, ' ' + n.partes.join('_') + ' ');
    });
    return texto;
  }

  /** Transforma o texto em uma lista de pedaços: marcadores, palavras, números e volumes. */
  function separar(texto, cad) {
    let t = semAcento(texto).replace(/\r/g, '');
    t = juntarNomesCompostos(t, cad);
    // Volume "1/3", "1 / 3", "1 DE 3"
    t = t.replace(/(^|[^0-9])(\d{1,2})\s*(?:\/|\\|DE)\s*(\d{1,2})(?!\d)/g, function (m, antes, a, b) {
      return antes + ' @VOL' + a + '_' + b + ' ';
    });
    // Separadores viram espaço (o "_" dos nomes compostos é mantido)
    t = t.replace(/[:;\/\\\-!|=,.()\[\]{}"'*+#~]/g, ' ');
    const brutos = t.split(/\s+/).filter(Boolean);
    const pedacos = [];
    brutos.forEach(function (b) {
      if (b.indexOf('@VOL') === 0) {
        const p = b.slice(4).split('_');
        pedacos.push({ tipo: 'VOL', atual: Number(p[0]), total: Number(p[1]), texto: p[0] + '/' + p[1] });
        return;
      }
      b = corrigirNumero(b);
      // separa letras grudadas em números (LOJA6 → LOJA 6, ARQ64407 → ARQ 64407)
      b.replace(/([A-Z_]+)(\d+)/g, '$1 $2').replace(/(\d+)([A-Z_]+)/g, '$1 $2').split(' ').forEach(function (x) {
        if (!x) return;
        if (/^\d+$/.test(x)) pedacos.push({ tipo: 'NUM', texto: x });
        else pedacos.push({ tipo: 'PALAVRA', texto: x });
      });
    });
    // Marca os marcadores
    pedacos.forEach(function (p, i) {
      if (p.tipo !== 'PALAVRA') return;
      const m = MARCADORES[p.texto];
      if (!m) return;
      // "A" só é marcador de arquivo se vier antes de um número
      if (p.texto === 'A' && !(pedacos[i + 1] && pedacos[i + 1].tipo === 'NUM')) return;
      // "D" e "P" sozinhos: só se não for o fim do texto
      if ((p.texto === 'D' || p.texto === 'P' || p.texto === 'V') && !pedacos[i + 1]) return;
      p.tipo = 'MARCADOR';
      p.campo = m;
    });
    return pedacos;
  }

  /**
   * O leitor às vezes gruda o marcador no nome: "P/VERA" vira "PIVERA", "D/CACILIO" vira "DICACILIO".
   * Se a palavra não é nome conhecido mas "prefixo + nome de loja" é, separa os dois.
   */
  function descolarMarcadores(pedacos, cad) {
    const prefixos = [['PARA', 'DESTINO'], ['PI', 'DESTINO'], ['P1', 'DESTINO'], ['PL', 'DESTINO'], ['P', 'DESTINO'],
      ['DE', 'ORIGEM'], ['DI', 'ORIGEM'], ['D1', 'ORIGEM'], ['DL', 'ORIGEM'], ['D', 'ORIGEM']];
    const saida = [];
    pedacos.forEach(function (p) {
      if (p.tipo !== 'PALAVRA' || acharLoja([p], 0, cad) || acharVendedor(p.texto, cad, '')) { saida.push(p); return; }
      for (let i = 0; i < prefixos.length; i++) {
        const pre = prefixos[i][0];
        const resto = p.texto.slice(pre.length);
        if (p.texto.indexOf(pre) === 0 && resto.length >= 2) {
          const ehLoja = /^(LOJA|LOJ|LOIA|LJ)$/.test(resto);
          const achou = ehLoja || acharLoja([{ tipo: 'PALAVRA', texto: resto }], 0, cad);
          if (achou) {
            saida.push({ tipo: 'MARCADOR', campo: prefixos[i][1], texto: pre });
            saida.push({ tipo: 'PALAVRA', texto: resto });
            return;
          }
        }
      }
      saida.push(p);
    });
    return saida;
  }

  /** Procura uma loja começando na posição i. Devolve { loja, usados, confianca } ou null. */
  function acharLoja(pedacos, i, cad) {
    const p = pedacos[i];
    if (!p) return null;
    const porNumero = function (n) {
      return cad.lojas.filter(function (l) { return l.tipo === 'LOJA' && l.ativo !== false && Number(l.numero) === Number(n); })[0];
    };
    // LOJA 06 / LJ 6 / L 6
    if (p.tipo === 'PALAVRA' && /^(LOJA|LOJ|LOIA|LJ|L)$/.test(p.texto) && pedacos[i + 1] && pedacos[i + 1].tipo === 'NUM' && pedacos[i + 1].texto.length <= 2) {
      const l = porNumero(pedacos[i + 1].texto);
      if (l) return { loja: l, usados: 2, confianca: 'alta' };
    }
    // Número sozinho de 1 ou 2 dígitos logo após "PARA"/"DE"
    if (p.tipo === 'NUM' && p.texto.length <= 2) {
      const l = porNumero(p.texto);
      if (l) return { loja: l, usados: 1, confianca: 'media' };
    }
    if (p.tipo !== 'PALAVRA') return null;
    const k = chave(p.texto);
    if (!k || k.length < 2) return null;
    // Exato
    const exato = cad.nomesLojas.filter(function (n) { return n.chave === k; })[0];
    if (exato) return { loja: exato.loja, usados: 1, confianca: 'alta' };
    // Aproximado (erros de leitura)
    let melhor = null;
    cad.nomesLojas.forEach(function (n) {
      if (n.chave.length <= 3 || k.length <= 3) return;
      const d = distancia(k, n.chave);
      if (d <= tolerancia(n.chave.length) && (!melhor || d < melhor.d)) melhor = { d: d, n: n };
    });
    if (melhor) {
      // empate entre lojas diferentes = dúvida
      const empate = cad.nomesLojas.some(function (n) {
        return n.loja.id !== melhor.n.loja.id && n.chave.length > 3 && distancia(k, n.chave) === melhor.d;
      });
      if (!empate) return { loja: melhor.n.loja, usados: 1, confianca: 'media' };
    }
    return null;
  }

  /** Procura um vendedor cadastrado pelo nome lido. */
  function acharVendedor(palavra, cad, destinoId) {
    const k = chave(palavra);
    if (!k || k.length < 3) return null;
    const candidatos = [];
    cad.nomesVendedores.forEach(function (n) {
      const d = n.chave === k ? 0 : (n.chave.length > 3 ? distancia(k, n.chave) : 99);
      if (d <= tolerancia(n.chave.length)) candidatos.push({ d: d, v: n.vendedor });
    });
    if (!candidatos.length) return null;
    candidatos.sort(function (a, b) {
      const pa = a.v.loja_id === destinoId ? 0 : a.v.loja_id === 'TODAS' ? 1 : 2;
      const pb = b.v.loja_id === destinoId ? 0 : b.v.loja_id === 'TODAS' ? 1 : 2;
      return a.d - b.d || pa - pb;
    });
    return { vendedor: candidatos[0].v, confianca: candidatos[0].d === 0 ? 'alta' : 'media' };
  }

  /**
   * Interpreta o texto lido da etiqueta.
   * @param {string} texto  texto lido da foto
   * @param {{lojas:Array, vendedores:Array}} base  cadastros (os mesmos do dadosBase)
   * @param {{maiorArquivo?:number}} [opcoes]
   */
  function interpretar(texto, base, opcoes) {
    opcoes = opcoes || {};
    const cad = prepararCadastros(base.lojas, base.vendedores);
    const pedacos = descolarMarcadores(separar(texto, cad), cad);
    const r = {
      origem_id: '', destino_id: '', arquivo: '', volume_atual: 0, volume_total: 0, vendedor_nome: '', vendedor_id: '',
      confianca: {}, avisos: [], texto: String(texto || '')
    };
    const usado = pedacos.map(function () { return false; });
    const marcar = function (i, n) { for (let k = i; k < i + n; k++) usado[k] = true; };

    // 1) Campos com marcador
    let posDestino = -1;
    for (let i = 0; i < pedacos.length; i++) {
      const p = pedacos[i];
      if (p.tipo !== 'MARCADOR') continue;
      const prox = i + 1;
      if (p.campo === 'ORIGEM' || p.campo === 'DESTINO') {
        const achou = acharLoja(pedacos, prox, cad);
        const alvo = p.campo === 'ORIGEM' ? 'origem_id' : 'destino_id';
        if (achou && !r[alvo]) {
          r[alvo] = achou.loja.id;
          r.confianca[alvo] = achou.confianca;
          marcar(i, 1 + achou.usados);
          if (p.campo === 'DESTINO') posDestino = i;
        } else if (p.campo === 'DESTINO' && posDestino < 0) {
          posDestino = i;
        }
      } else if (p.campo === 'ARQUIVO') {
        const n = pedacos[prox];
        if (n && n.tipo === 'NUM' && n.texto.length >= 3 && !r.arquivo) {
          r.arquivo = String(Number(n.texto));
          r.confianca.arquivo = 'alta';
          marcar(i, 2);
        }
      } else if (p.campo === 'V') {
        const n = pedacos[prox];
        if (n && n.tipo === 'VOL' && !r.volume_total) {
          r.volume_atual = n.atual; r.volume_total = n.total; r.confianca.volume = 'alta';
          marcar(i, 2);
        } else if (n && n.tipo === 'PALAVRA' && !r.vendedor_nome && IGNORAR.indexOf(n.texto) < 0) {
          // "V: JULIO" = vendedor
          const nome = n.texto.replace(/_/g, ' ');
          const v = acharVendedor(n.texto, cad, r.destino_id);
          r.vendedor_nome = v ? v.vendedor.nome : capitalizar(nome);
          r.vendedor_id = v ? v.vendedor.id : '';
          r.confianca.vendedor = v ? v.confianca : 'media';
          marcar(i, 2);
        } else {
          usado[i] = true;
        }
      }
    }

    // 2) Volume sem marcador
    if (!r.volume_total) {
      pedacos.forEach(function (p, i) {
        if (p.tipo === 'VOL' && !usado[i] && !r.volume_total) {
          r.volume_atual = p.atual; r.volume_total = p.total; r.confianca.volume = 'media'; usado[i] = true;
        }
      });
    }

    // 3) Arquivo sem marcador: número solto de 4 a 7 dígitos (o mais perto da faixa atual, se houver vários)
    if (!r.arquivo) {
      const nums = [];
      pedacos.forEach(function (p, i) { if (p.tipo === 'NUM' && !usado[i] && p.texto.length >= 4 && p.texto.length <= 7) nums.push(i); });
      if (nums.length) {
        let escolhido = nums[0];
        if (opcoes.maiorArquivo && nums.length > 1) {
          escolhido = nums.slice().sort(function (a, b) {
            return Math.abs(Number(pedacos[a].texto) - opcoes.maiorArquivo) - Math.abs(Number(pedacos[b].texto) - opcoes.maiorArquivo);
          })[0];
        }
        r.arquivo = String(Number(pedacos[escolhido].texto));
        r.confianca.arquivo = nums.length > 1 ? 'baixa' : 'media';
        usado[escolhido] = true;
      }
    }

    // 4) Lojas sem marcador (ex.: "VERA P/ CACILIO": VERA é a origem)
    const lojasSoltas = [];
    for (let i = 0; i < pedacos.length; i++) {
      if (usado[i] || pedacos[i].tipo === 'MARCADOR') continue;
      const achou = acharLoja(pedacos, i, cad);
      if (achou && !(pedacos[i].tipo === 'NUM')) {
        lojasSoltas.push({ i: i, achou: achou });
        i += achou.usados - 1;
      }
    }
    lojasSoltas.forEach(function (ls) {
      if (!r.origem_id && (posDestino < 0 || ls.i < posDestino) && ls.achou.loja.id !== r.destino_id) {
        r.origem_id = ls.achou.loja.id; r.confianca.origem_id = ls.achou.confianca === 'alta' ? 'media' : 'baixa'; marcar(ls.i, ls.achou.usados);
      } else if (!r.destino_id && ls.i > posDestino && ls.achou.loja.id !== r.origem_id) {
        r.destino_id = ls.achou.loja.id; r.confianca.destino_id = 'baixa'; marcar(ls.i, ls.achou.usados);
      }
    });

    // 5) Vendedor sem marcador: palavra que sobrou
    if (!r.vendedor_nome) {
      const sobras = [];
      pedacos.forEach(function (p, i) {
        if (usado[i] || p.tipo !== 'PALAVRA') return;
        const k = chave(p.texto);
        if (k.length < 3 || IGNORAR.indexOf(k) >= 0 || MARCADORES[k]) return;
        const lj = acharLoja(pedacos, i, cad);
        if (lj && lj.confianca === 'alta') return; // nome de loja repetido não é vendedor
        const vend = acharVendedor(p.texto, cad, r.destino_id);
        if (lj && !(vend && vend.confianca === 'alta')) return; // parece loja e não é vendedor conhecido
        sobras.push(p.texto);
      });
      const cadastrado = sobras.map(function (s) { return acharVendedor(s, cad, r.destino_id); }).filter(Boolean)[0];
      if (cadastrado) {
        r.vendedor_nome = cadastrado.vendedor.nome; r.vendedor_id = cadastrado.vendedor.id;
        r.confianca.vendedor = cadastrado.confianca === 'alta' ? 'media' : 'baixa';
      } else if (sobras.length === 1 && sobras[0].length >= 3) {
        r.vendedor_nome = capitalizar(sobras[0].replace(/_/g, ' '));
        r.confianca.vendedor = 'baixa';
      } else if (sobras.length > 1) {
        r.avisos.push('Não ficou claro se há vendedor na etiqueta (sobrou: ' + sobras.map(capitalizar).join(', ') + ').');
      }
    }

    // 6) Conferências
    if (!r.volume_total) { r.volume_atual = 1; r.volume_total = 1; r.confianca.volume = 'padrao'; }
    if (r.volume_atual > r.volume_total || r.volume_atual < 1) { r.avisos.push('Volume lido parece errado (' + r.volume_atual + '/' + r.volume_total + ').'); r.confianca.volume = 'baixa'; }
    if (r.origem_id && r.origem_id === r.destino_id) { r.avisos.push('Origem e destino deram a mesma loja.'); r.confianca.origem_id = r.confianca.destino_id = 'baixa'; }
    if (r.arquivo && opcoes.maiorArquivo && Math.abs(Number(r.arquivo) - opcoes.maiorArquivo) > 3000) {
      r.avisos.push('O número ' + r.arquivo + ' está longe dos arquivos recentes. Confira.');
      r.confianca.arquivo = 'baixa';
    }
    ['origem_id', 'destino_id', 'arquivo'].forEach(function (c) { if (!r[c]) r.confianca[c] = 'faltou'; });
    return r;
  }

  function capitalizar(t) {
    return String(t).toLowerCase().replace(/(^|\s)\S/g, function (c) { return c.toUpperCase(); });
  }

  return { interpretar: interpretar, distancia: distancia, _separar: separar, _preparar: prepararCadastros };
});
