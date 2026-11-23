/**
 * RASTREIA — Gerador de planilhas Excel (.xlsx) no próprio navegador, sem bibliotecas.
 * Uso: Xlsx.baixar('relatorio.xlsx', [{ nome: 'Aba 1', colunas: [{ titulo: 'Arquivo', largura: 12 }], linhas: [[64425], ...] }])
 */
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) module.exports = fabrica();
  else raiz.Xlsx = fabrica();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const TABELA_CRC = (function () {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();

  function crc32(bytes) {
    let c = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) c = TABELA_CRC[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  const utf8 = (texto) => new TextEncoder().encode(texto);

  /** Monta um arquivo ZIP (sem compressão) a partir de { nome: texto }. */
  function zip(arquivos) {
    const partes = [];
    const central = [];
    let posicao = 0;
    Object.keys(arquivos).forEach(function (nome) {
      const nomeB = utf8(nome);
      const dados = utf8(arquivos[nome]);
      const crc = crc32(dados);
      const local = new DataView(new ArrayBuffer(30));
      local.setUint32(0, 0x04034b50, true); local.setUint16(4, 20, true); local.setUint16(6, 0x0800, true);
      local.setUint16(8, 0, true); local.setUint16(10, 0, true); local.setUint16(12, 0x21, true);
      local.setUint32(14, crc, true); local.setUint32(18, dados.length, true); local.setUint32(22, dados.length, true);
      local.setUint16(26, nomeB.length, true); local.setUint16(28, 0, true);
      partes.push(new Uint8Array(local.buffer), nomeB, dados);
      const cd = new DataView(new ArrayBuffer(46));
      cd.setUint32(0, 0x02014b50, true); cd.setUint16(4, 20, true); cd.setUint16(6, 20, true); cd.setUint16(8, 0x0800, true);
      cd.setUint16(10, 0, true); cd.setUint16(12, 0, true); cd.setUint16(14, 0x21, true);
      cd.setUint32(16, crc, true); cd.setUint32(20, dados.length, true); cd.setUint32(24, dados.length, true);
      cd.setUint16(28, nomeB.length, true); cd.setUint32(42, posicao, true);
      central.push(new Uint8Array(cd.buffer), nomeB);
      posicao += 30 + nomeB.length + dados.length;
    });
    const tamCentral = central.reduce(function (s, p) { return s + p.length; }, 0);
    const fim = new DataView(new ArrayBuffer(22));
    fim.setUint32(0, 0x06054b50, true);
    const qtd = Object.keys(arquivos).length;
    fim.setUint16(8, qtd, true); fim.setUint16(10, qtd, true);
    fim.setUint32(12, tamCentral, true); fim.setUint32(16, posicao, true);
    const todas = partes.concat(central, [new Uint8Array(fim.buffer)]);
    const total = todas.reduce(function (s, p) { return s + p.length; }, 0);
    const saida = new Uint8Array(total);
    let o = 0;
    todas.forEach(function (p) { saida.set(p, o); o += p.length; });
    return saida;
  }

  function xml(texto) {
    return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
  }

  function letraColuna(i) {
    let s = '';
    i++;
    while (i > 0) { const r = (i - 1) % 26; s = String.fromCharCode(65 + r) + s; i = Math.floor((i - 1) / 26); }
    return s;
  }

  function planilhaXml(aba) {
    const colunas = aba.colunas || [];
    let x = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
      '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>';
    if (colunas.length) {
      x += '<cols>' + colunas.map(function (c, i) {
        return '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + (c.largura || 14) + '" customWidth="1"/>';
      }).join('') + '</cols>';
    }
    x += '<sheetData>';
    const linhas = [colunas.map(function (c) { return c.titulo; })].concat(aba.linhas || []);
    linhas.forEach(function (linha, li) {
      x += '<row r="' + (li + 1) + '">';
      linha.forEach(function (v, ci) {
        if (v === null || v === undefined || v === '') return;
        const ref = letraColuna(ci) + (li + 1);
        const estilo = li === 0 ? ' s="1"' : '';
        if (typeof v === 'number' && isFinite(v)) x += '<c r="' + ref + '"' + estilo + '><v>' + v + '</v></c>';
        else x += '<c r="' + ref + '" t="inlineStr"' + estilo + '><is><t xml:space="preserve">' + xml(v) + '</t></is></c>';
      });
      x += '</row>';
    });
    x += '</sheetData>';
    if (colunas.length && linhas.length > 1) x += '<autoFilter ref="A1:' + letraColuna(colunas.length - 1) + linhas.length + '"/>';
    return x + '</worksheet>';
  }

  /** Gera os bytes do .xlsx. abas: [{ nome, colunas: [{titulo, largura}], linhas: [[...]] }] */
  function gerar(abas) {
    const nomes = [];
    abas.forEach(function (a, i) {
      let n = String(a.nome || 'Planilha ' + (i + 1)).replace(/[\\\/\?\*\[\]:]/g, ' ').slice(0, 31) || 'Planilha';
      while (nomes.indexOf(n) >= 0) n = n.slice(0, 28) + ' ' + (i + 1);
      nomes.push(n);
    });
    const arquivos = {
      '[Content_Types].xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
        '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
        abas.map(function (a, i) { return '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'; }).join('') +
        '</Types>',
      '_rels/.rels': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
      'xl/workbook.xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>' +
        nomes.map(function (n, i) { return '<sheet name="' + xml(n) + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>'; }).join('') +
        '</sheets></workbook>',
      'xl/_rels/workbook.xml.rels': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        abas.map(function (a, i) { return '<Relationship Id="rId' + (i + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>'; }).join('') +
        '<Relationship Id="rId' + (abas.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>',
      'xl/styles.xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
        '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts>' +
        '<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>' +
        '<fill><patternFill patternType="solid"><fgColor rgb="FF1E3A8A"/><bgColor indexed="64"/></patternFill></fill></fills>' +
        '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
        '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
        '<cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
        '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs>' +
        '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>'
    };
    abas.forEach(function (a, i) { arquivos['xl/worksheets/sheet' + (i + 1) + '.xml'] = planilhaXml(a); });
    return zip(arquivos);
  }

  function baixar(nomeArquivo, abas) {
    const blob = new Blob([gerar(abas)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nomeArquivo;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1000);
  }

  return { gerar: gerar, baixar: baixar };
});
