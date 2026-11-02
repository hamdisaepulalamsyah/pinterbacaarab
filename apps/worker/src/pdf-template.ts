export interface PdfWord {
  ar: string;
  meaning_id: string;
  nahwu: string | null;
  sharf_root: string | null;
  sharf_wazan: string | null;
  sharf_tashrif: string | null;
  sharf_note: string | null;
}

export interface PdfSegment {
  position: number;
  title: string | null;
  arabic_vocalized: string | null;
  translation_id: string | null;
  words: PdfWord[];
}

export interface PdfDocumentData {
  title: string;
  source_name: string | null;
  segments: PdfSegment[];
}

export function generateKajianHtml(doc: PdfDocumentData): string {
  const segmentsHtml = doc.segments
    .map((seg) => {
      const rowsHtml = seg.words
        .map(
          (w) => `
        <tr>
          <td class="col-ar" dir="rtl" lang="ar">${w.ar}</td>
          <td class="col-meaning">${w.meaning_id || '-'}</td>
          <td class="col-nahwu">${w.nahwu || '-'}</td>
          <td class="col-sharf">
            ${w.sharf_wazan ? `<div><strong>Wazan:</strong> ${w.sharf_wazan}</div>` : ''}
            ${w.sharf_root ? `<div><strong>Akar:</strong> ${w.sharf_root}</div>` : ''}
            ${w.sharf_tashrif ? `<div><strong>Tashrif:</strong> ${w.sharf_tashrif}</div>` : ''}
            ${w.sharf_note ? `<div class="note">${w.sharf_note}</div>` : ''}
            ${!w.sharf_wazan && !w.sharf_root ? '-' : ''}
          </td>
        </tr>`,
        )
        .join('');

      return `
      <section class="segment-block">
        <div class="segment-header">
          <span class="segment-badge">Segmen ${seg.position}</span>
          ${seg.title ? `<span class="segment-title">${seg.title}</span>` : ''}
        </div>
        
        <div class="arabic-box" dir="rtl" lang="ar">
          ${seg.arabic_vocalized || ''}
        </div>

        <div class="translation-box">
          <strong>Terjemah:</strong>
          <p>${seg.translation_id || '-'}</p>
        </div>

        <table class="words-table">
          <thead>
            <tr>
              <th style="width: 20%;">Lafaz (Lafadz)</th>
              <th style="width: 25%;">Arti Per Kata</th>
              <th style="width: 30%;">Analisis Nahwu (I'rab)</th>
              <th style="width: 25%;">Analisis Shorof</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </section>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${doc.title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 landscape;
      margin: 15mm 18mm 18mm 18mm;
      @bottom-right {
        content: "Halaman " counter(page) " dari " counter(pages);
        font-family: 'Inter', sans-serif;
        font-size: 9pt;
        color: #666;
      }
      @bottom-left {
        content: "${doc.title} — Nahwu Studio";
        font-family: 'Inter', sans-serif;
        font-size: 9pt;
        color: #666;
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', sans-serif;
      font-size: 10pt;
      color: #1C1C1C;
      background-color: #FAF6EE;
      line-height: 1.5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .cover-header {
      text-align: center;
      padding-bottom: 20px;
      margin-bottom: 25px;
      border-bottom: 2px solid #B8913B;
    }

    .doc-title {
      font-size: 22pt;
      font-weight: 700;
      color: #1F4D3A;
      margin-bottom: 6px;
    }

    .doc-source {
      font-size: 11pt;
      color: #7A6224;
      font-style: italic;
    }

    .segment-block {
      page-break-inside: avoid;
      margin-bottom: 30px;
      padding: 16px;
      background: #FFFFFF;
      border-radius: 8px;
      border: 1px solid #E6DEC8;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .segment-header {
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .segment-badge {
      display: inline-block;
      background: #1F4D3A;
      color: #FFFFFF;
      font-size: 9pt;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 4px;
    }

    .segment-title {
      font-size: 11pt;
      font-weight: 600;
      color: #1F4D3A;
    }

    .arabic-box {
      font-family: 'Amiri', serif;
      font-size: 22pt;
      line-height: 2.2;
      color: #141414;
      background: #FAF6EE;
      padding: 14px 20px;
      border-radius: 6px;
      border-right: 4px solid #1F4D3A;
      margin-bottom: 14px;
      text-align: right;
      unicode-bidi: isolate;
    }

    .translation-box {
      background: #F4EFE6;
      padding: 10px 14px;
      border-radius: 6px;
      margin-bottom: 16px;
      font-size: 10pt;
    }

    .translation-box strong {
      color: #1F4D3A;
      font-size: 9pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .words-table {
      width: 100%;
      border-collapse: collapse;
      page-break-inside: auto;
      margin-top: 10px;
    }

    .words-table thead {
      display: table-header-group;
    }

    .words-table tr {
      page-break-inside: avoid;
    }

    .words-table th {
      background-color: #1F4D3A;
      color: #FFFFFF;
      text-align: left;
      font-size: 9pt;
      font-weight: 600;
      padding: 8px 10px;
      border: 1px solid #16382A;
    }

    .words-table td {
      padding: 8px 10px;
      border: 1px solid #DDD3BF;
      font-size: 9pt;
      vertical-align: top;
    }

    .words-table tbody tr:nth-child(even) {
      background-color: #FAF7F0;
    }

    .words-table tbody tr:nth-child(odd) {
      background-color: #FFFFFF;
    }

    .col-ar {
      font-family: 'Amiri', serif;
      font-size: 17pt;
      line-height: 1.8;
      color: #1F4D3A;
      font-weight: 700;
      text-align: right;
    }

    .col-meaning {
      font-weight: 500;
      color: #222;
    }

    .col-nahwu {
      color: #2D3748;
    }

    .col-sharf {
      font-size: 8.5pt;
      color: #333;
    }

    .col-sharf strong {
      color: #1F4D3A;
    }

    .col-sharf .note {
      font-style: italic;
      color: #666;
      margin-top: 2px;
    }
  </style>
</head>
<body>
  <header class="cover-header">
    <h1 class="doc-title">${doc.title}</h1>
    ${doc.source_name ? `<div class="doc-source">Kitab / Rujukan: ${doc.source_name}</div>` : ''}
  </header>

  <main>
    ${segmentsHtml}
  </main>
</body>
</html>`;
}
