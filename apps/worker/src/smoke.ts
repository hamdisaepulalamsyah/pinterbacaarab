import * as dotenv from 'dotenv';
import * as path from 'path';
import { analyzeSegment, getLlmConfig } from './llm';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

async function runSmokeTest() {
  console.log('--- 9ROUTER LLM CLIENT SMOKE TEST ---');
  const config = getLlmConfig();
  console.log('Endpoint Base URL:', config.baseUrl);
  console.log('Model:', config.model);

  const sampleSentence = 'ذهب أهل الدثور بالأجور';
  console.log('Menguji analisis segmen teks:', sampleSentence);

  const startTime = Date.now();
  try {
    const result = await analyzeSegment(sampleSentence, {
      detail: 'full',
      config,
    });

    const elapsed = Date.now() - startTime;
    console.log(`\nBerhasil dalam ${elapsed}ms!`);
    console.log('\n--- OUTPUT JSON HASIL ANALISIS 9ROUTER ---');
    console.log(JSON.stringify(result, null, 2));
    console.log('\nJumlah kata yang dianalisis:', result.words.length);
    console.log('Syakal:', result.arabic_vocalized);
    console.log('Terjemah:', result.translation_id);
    console.log('--- SMOKE TEST LULUS 100% ---');
  } catch (err: any) {
    console.error('Smoke test gagal:', err);
    process.exit(1);
  }
}

runSmokeTest();
