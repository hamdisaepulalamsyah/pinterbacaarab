import { stripHarakat } from '@pinterbacaarab/shared';

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
  showHarakat?: boolean;
}

export function generateKajianHtml(doc: PdfDocumentData): string {
  const showHarakat = doc.showHarakat !== false;
  const isMultiSegment = doc.segments.length > 1;

  const segmentsHtml = doc.segments
    .map((seg, sIdx) => {
      const arabicText = showHarakat
        ? (seg.arabic_vocalized || '')
        : stripHarakat(seg.arabic_vocalized || '');

      const rowsHtml = seg.words
        .map((w) => {
          const arWord = showHarakat ? w.ar : stripHarakat(w.ar);
          return `
        <tr>
          <td class="col-ar" dir="rtl" lang="ar">${arWord}</td>
          <td class="col-meaning">${w.meaning_id || '-'}</td>
          <td class="col-nahwu">${w.nahwu || '-'}</td>
          <td class="col-sharf">
            ${w.sharf_wazan ? `<div><strong>Wazan:</strong> ${w.sharf_wazan}</div>` : ''}
            ${w.sharf_root ? `<div><strong>Akar:</strong> ${w.sharf_root}</div>` : ''}
            ${w.sharf_tashrif ? `<div><strong>Tashrif:</strong> ${w.sharf_tashrif}</div>` : ''}
            ${w.sharf_note ? `<div class="note">${w.sharf_note}</div>` : ''}
            ${!w.sharf_wazan && !w.sharf_root && !w.sharf_tashrif ? '-' : ''}
          </td>
        </tr>`;
        })
        .join('');

      return `
      <section class="segment-section">
        ${
          isMultiSegment
            ? `
        <div class="segment-label">
          <span>Bagian ${sIdx + 1}</span>
          ${seg.title ? `<span class="sep">•</span><span>${seg.title}</span>` : ''}
        </div>`
            : ''
        }
        
        <div class="arabic-box" dir="rtl" lang="ar">
          ${arabicText}
        </div>

        ${
          seg.translation_id
            ? `
        <div class="translation-box">
          <span class="translation-tag">Terjemah:</span>
          <span class="translation-text">&ldquo;${seg.translation_id}&rdquo;</span>
        </div>`
            : ''
        }

        <table class="words-table">
          <thead>
            <tr>
              <th style="width: 22%; text-align: right;">Lafaz</th>
              <th style="width: 23%;">Terjemah Arti</th>
              <th style="width: 32%;">I'rab &amp; Kedudukan Nahwu</th>
              <th style="width: 23%;">Morfologi Shorof</th>
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
      size: A4 portrait;
      margin: 12mm 12mm 14mm 12mm;
      @bottom-right {
        content: "Halaman " counter(page) " dari " counter(pages);
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 8pt;
        color: #777777;
      }
      @bottom-left {
        content: "${doc.title} • Nahwu Studio";
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 8pt;
        color: #777777;
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      font-size: 9pt;
      color: #1a1a1a;
      background-color: #ffffff;
      line-height: 1.5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .cover-header {
      padding-bottom: 10px;
      margin-bottom: 16px;
      border-bottom: 2px solid #1F4D3A;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .doc-title-group {
      flex: 1;
    }

    .doc-title {
      font-size: 18pt;
      font-weight: 700;
      color: #1F4D3A;
      letter-spacing: -0.3px;
      line-height: 1.2;
      margin-bottom: 3px;
    }

    .doc-source {
      font-size: 9pt;
      color: #666666;
      font-style: italic;
    }

    .doc-badge-group {
      text-align: right;
    }

    .badge-syakal {
      display: inline-block;
      font-size: 7.5pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 3px 8px;
      border-radius: 4px;
      background: #E8F5E9;
      color: #1F4D3A;
      border: 1px solid #C8E6C9;
    }

    .badge-gundul {
      display: inline-block;
      font-size: 7.5pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 3px 8px;
      border-radius: 4px;
      background: #FFF3E0;
      color: #E65100;
      border: 1px solid #FFE0B2;
    }

    .segment-section {
      margin-bottom: 20px;
    }

    .segment-label {
      font-size: 8pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #7A6224;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .segment-label .sep {
      color: #cccccc;
    }

    .arabic-box {
      font-family: 'Amiri', 'Traditional Arabic', serif;
      font-size: 21pt;
      line-height: 2.2;
      color: #111111;
      background: #FAF8F4;
      padding: 10px 16px;
      border-radius: 6px;
      border-right: 4px solid #1F4D3A;
      margin-bottom: 10px;
      text-align: right;
      direction: rtl;
      unicode-bidi: isolate;
      page-break-inside: avoid;
    }

    .translation-box {
      background: #F4EFE6;
      padding: 8px 12px;
      border-radius: 5px;
      margin-bottom: 12px;
      font-size: 9pt;
      color: #333333;
      page-break-inside: avoid;
      line-height: 1.45;
    }

    .translation-tag {
      font-weight: 700;
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #1F4D3A;
      margin-right: 6px;
    }

    .translation-text {
      font-style: italic;
      color: #444444;
    }

    .words-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
      margin-bottom: 14px;
    }

    .words-table thead {
      display: table-header-group;
    }

    .words-table tr {
      page-break-inside: avoid;
    }

    .words-table th {
      background-color: #1F4D3A;
      color: #ffffff;
      text-align: left;
      font-size: 8pt;
      font-weight: 600;
      padding: 6px 8px;
      border: 1px solid #16382A;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .words-table td {
      padding: 7px 9px;
      border: 1px solid #E2DBCB;
      font-size: 8.5pt;
      vertical-align: middle;
    }

    .words-table tbody tr:nth-child(even) {
      background-color: #FAF8F4;
    }

    .words-table tbody tr:nth-child(odd) {
      background-color: #ffffff;
    }

    /* Teks Arab per kata: Ukuran besar, tebal, jelas dan mudah dibaca */
    .col-ar {
      font-family: 'Amiri', 'Traditional Arabic', serif;
      font-size: 22pt !important;
      line-height: 1.4;
      color: #1F4D3A;
      font-weight: 700;
      text-align: right;
      direction: rtl;
      unicode-bidi: isolate;
      white-space: nowrap;
      padding-right: 12px !important;
    }

    .col-meaning {
      font-weight: 500;
      color: #1c1c1c;
      font-size: 8.5pt;
      line-height: 1.4;
    }

    .col-nahwu {
      color: #2b2b2b;
      font-size: 8pt;
      line-height: 1.4;
    }

    .col-sharf {
      font-size: 7.8pt;
      color: #333333;
      line-height: 1.35;
    }

    .col-sharf strong {
      color: #1F4D3A;
    }

    .col-sharf .note {
      font-style: italic;
      color: #777777;
      margin-top: 2px;
    }

    .doc-footer {
      margin-top: 24px;
      padding-top: 10px;
      border-top: 1px solid #e5e5e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.5pt;
      color: #888888;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
  </style>
</head>
<body>
  <header class="cover-header">
    <div class="doc-title-group">
      <h1 class="doc-title">${doc.title}</h1>
      ${doc.source_name ? `<div class="doc-source">Kitab / Rujukan: ${doc.source_name}</div>` : ''}
    </div>
    <div class="doc-badge-group">
      <span class="${showHarakat ? 'badge-syakal' : 'badge-gundul'}">
        ${showHarakat ? 'Teks Bersyakal' : 'Teks Gundul'}
      </span>
    </div>
  </header>

  <main>
    ${segmentsHtml}
  </main>

  <footer class="doc-footer">
    <span>Nahwu Studio — Lembaran Kajian I'rab Hadis &amp; Shorof</span>
    <span>project by Hamdipyxis</span>
  </footer>
</body>
</html>`;
}
