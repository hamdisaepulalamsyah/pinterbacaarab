import { stripHarakat } from '@/lib/arabic';

export interface PracticeOption {
  id: string;
  label: string;
  isCorrect: boolean;
  explanation: string;
}

export interface PracticeStep {
  wordIndex: number;
  wordGundul: string;
  wordVocalized: string;
  meaning: string;
  nahwuRule: string;
  wazan: string;
  root: string;
  shighah: string;
  // Question 1: Posisi / Kedudukan Nahwu
  kedudukanQuestion: {
    prompt: string;
    hint: string;
    options: PracticeOption[];
  };
  // Question 2: Harakat Akhir / Syakal I'rab
  harakatQuestion: {
    prompt: string;
    hint: string;
    options: PracticeOption[];
  };
}

export interface PracticeLesson {
  id: string;
  title: string;
  category: 'mubtadi' | 'mutawassith' | 'mutaqaddim';
  levelLabel: string;
  source: string;
  fullMatanGundul: string;
  fullMatanVocalized: string;
  translation: string;
  introAdvice: string;
  steps: PracticeStep[];
}

export const PRACTICE_LESSONS: PracticeLesson[] = [
  {
    id: 'hadis-niat',
    title: 'Hadis Niat',
    category: 'mubtadi',
    levelLabel: 'Tingkat Dasar (Mubtadi\')',
    source: 'Shahih Al-Bukhari No. 1',
    fullMatanGundul: 'انما الاعمال بالنيات',
    fullMatanVocalized: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
    translation: 'Sesungguhnya sah dan berpahalanya segala amal perbuatan itu hanyalah bergantung pada niatnya.',
    introAdvice:
      'Ahlan wa sahlan! Hadis ini adalah poros utama ajaran Islam. Mari kita telaah kata demi kata mulai dari kalimat pembatas makna (adatul hashr).',
    steps: [
      {
        wordIndex: 0,
        wordGundul: 'انما',
        wordVocalized: 'إِنَّمَا',
        meaning: 'Hanyasanya / Sesungguhnya',
        nahwuRule: 'Kaffah wa Makfufah (Adatul Hashr) mabni di atas sukun.',
        wazan: 'حَرْفٌ',
        root: '—',
        shighah: 'Harf Hashr Mabni',
        kedudukanQuestion: {
          prompt: 'Perhatikan kata pertama 「انما」. Apakah jenis kata ini dalam kaidah bahasa Arab?',
          hint: 'Perhatikan gabungan antara huruf taukid 「إِنَّ」 dengan huruf 「مَا」 yang menahan amalnya.',
          options: [
            {
              id: 'a',
              label: 'Harf Kaffah wa Makfufah (Adatul Hashr)',
              isCorrect: true,
              explanation:
                'Mumtaz! Tepat sekali. Huruf "Inna" kemasukan "Ma" zaidah kaffah sehingga tercegah dari menashabkan isim, berfungsi sebagai adatul hashr (pembatas makna: hanyasanya).',
            },
            {
              id: 'b',
              label: 'Isim Mubtada\' (Kata benda pembuka kalimat)',
              isCorrect: false,
              explanation:
                'Afwan, kurang tepat. 「انما」 bukan kata benda (isim), melainkan gabungan huruf taukid (inna) dan ma kaffah. Kata benda baru dimulai pada kata setelahnya.',
            },
            {
              id: 'c',
              label: 'Fi\'il Madhi (Kata kerja masa lampau)',
              isCorrect: false,
              explanation:
                'Afwan, belum tepat. Kata kerja (fi\'il) memiliki tanda masa dan wazan fa\'ala/fa\'ila/fa\'ula. 「انما」 adalah huruf adatul hashr.',
            },
          ],
        },
        harakatQuestion: {
          prompt: 'Bagaimana cara membaca dan syakal yang tepat untuk lafaz ini?',
          hint: 'Huruf alif di awal berharakat kasrah karena berada di permulaan kalam (ibtidaiyah), nun bertasydid fathah, dan mim berharakat fathah panjang.',
          options: [
            {
              id: 'a',
              label: 'إِنَّمَا (Innamā)',
              isCorrect: true,
              explanation:
                'Shahih! Hamzah dibaca kasrah 「إِ」 di awal kalam, nun bertasydid fathah 「نَّ」, dan mim fathah panjang 「مَا」.',
            },
            {
              id: 'b',
              label: 'أَنَّمَا (Annamā)',
              isCorrect: false,
              explanation:
                'Afwan, keliru. Huruf inna jika berada di awal kalimat pembicaraan (shadrul kalam) WAJIB dibaca kasrah hamzahnya 「إِنَّ」, bukan fathah 「أَنَّ」.',
            },
            {
              id: 'c',
              label: 'إِنَّمُ (Innamu)',
              isCorrect: false,
              explanation:
                'Afwan, keliru. Huruf 「مَا」 di sini berharakat fathah dan bersambung dengan alif maddiyyah, bukan dhammah.',
            },
          ],
        },
      },
      {
        wordIndex: 1,
        wordGundul: 'الاعمال',
        wordVocalized: 'الْأَعْمَالُ',
        meaning: 'Segala amal perbuatan',
        nahwuRule: 'Mubtada\' marfu\' dengan tanda rafa\' dhammah zhahirah di akhirnya.',
        wazan: 'أَفْعَالٌ',
        root: 'ع-م-ل',
        shighah: 'Isim Jamak Taksir (Mufrad: \'Amal)',
        kedudukanQuestion: {
          prompt: 'Kata kedua 「الاعمال」 adalah isim makrifat yang mengawali jumlah ismiyyah setelah innama. Apa kedudukan nahwunya?',
          hint: 'Isim marfu\' yang terletak di permulaan kalimat ismiyyah untuk diterangkan oleh khabar.',
          options: [
            {
              id: 'a',
              label: 'Mubtada\' (Subjek permulaan kalimat)',
              isCorrect: true,
              explanation:
                'Ahsantum! Karena amal 「إِنَّ」 telah dibatalkan oleh 「مَا」 kaffah, kata setelahnya kembali menjadi Mubtada\' yang marfu\'.',
            },
            {
              id: 'b',
              label: 'Isim Inna yang manshub',
              isCorrect: false,
              explanation:
                'Afwan, perhatikan kaidahnya: ketika Inna kemasukan Ma (menjadi Innama), amalnya BATAL! Jadi kata ini tidak lagi menjadi isim Inna yang manshub, melainkan kembali marfu\' sebagai Mubtada\'.',
            },
            {
              id: 'c',
              label: 'Maf\'ul Bih (Objek penderita)',
              isCorrect: false,
              explanation:
                'Afwan, Maf\'ul Bih membutuhkan kata kerja aktif (fi\'il muta\'addi) sebelumnya. Kalimat ini belum memiliki kata kerja.',
            },
          ],
        },
        harakatQuestion: {
          prompt: 'Karena berkedudukan sebagai Mubtada\' dalam bentuk Jamak Taksir, bagaimana harakat huruf lam di akhirnya?',
          hint: 'Hukum asal tanda rafa\' pada isim mufrad dan jamak taksir adalah harakat pokok dhammah.',
          options: [
            {
              id: 'a',
              label: 'الْأَعْمَالُ (Berharakat Dhammah: Al-A\'mālu)',
              isCorrect: true,
              explanation:
                'Mumtaz! Benar sekali. Tanda rafa\' untuk Jamak Taksir (al-a\'māl, jamak dari \'amal) adalah dhammah zhahirah di huruf lam.',
            },
            {
              id: 'b',
              label: 'الْأَعْمَالَ (Berharakat Fathah: Al-A\'māla)',
              isCorrect: false,
              explanation:
                'Afwan, harakat fathah adalah tanda manshub. Sedangkan Mubtada\' hukum dasarnya adalah marfu\' (dhammah).',
            },
            {
              id: 'c',
              label: 'الْأَعْمَالِ (Berharakat Kasrah: Al-A\'māli)',
              isCorrect: false,
              explanation:
                'Afwan, kasrah adalah tanda majrur (karena huruf jar atau mudhaf ilaih). Kata ini tidak didahului huruf jar.',
            },
          ],
        },
      },
      {
        wordIndex: 2,
        wordGundul: 'بالنيات',
        wordVocalized: 'بِالنِّيَّاتِ',
        meaning: 'Dengan niat-niatnya',
        nahwuRule: 'Sibh al-jumlah (jar wa majrur) fi mahalli raf\'in khabar al-mubtada\'.',
        wazan: 'فِعْلَاتٌ',
        root: 'ن-و-ي',
        shighah: 'Jar Majrur (Jamak Muannats Salim dari Niyyah)',
        kedudukanQuestion: {
          prompt: 'Lafaz ketiga 「بالنيات」 diawali huruf Ba\' 「بِـ」. Apa fungsi dan kedudukannya dalam menyempurnakan makna Mubtada\'?',
          hint: 'Kombinasi huruf jar dan isim majrur (sibh al-jumlah) yang melengkapi keterangan dari subjek sebelumnya.',
          options: [
            {
              id: 'a',
              label: 'Sibh al-Jumlah (Jar & Majrur) menempati posisi Khabar Mubtada\'',
              isCorrect: true,
              explanation:
                'Mumtaz jiddan! Huruf Ba\' adalah huruf jar, an-niyyāt isim majrur. Keduanya membentuk susunan Jar Majrur yang berkedudukan di posisi rafa\' sebagai Khabar.',
            },
            {
              id: 'b',
              label: 'Mudhaf Ilaih (Kata sandang kepemilikan)',
              isCorrect: false,
              explanation:
                'Afwan, kurang tepat. Kata ini berawalan huruf jar 「بِـ」, bukan tersusun secara idhafah kepemilikan kata benda murni.',
            },
            {
              id: 'c',
              label: 'Na\'at / Sifat (Kata sifat bagi al-a\'mal)',
              isCorrect: false,
              explanation:
                'Afwan, Na\'at harus menyelaraskan i\'rab dan jenis dengan maushuf-nya secara langsung tanpa perantara huruf jar.',
            },
          ],
        },
        harakatQuestion: {
          prompt: 'Huruf Ba\' berharakat kasrah 「بِـ」. Lalu bagaimana harakat akhir huruf Ta\' pada 「النيات」 sebagai Jamak Muannats Salim yang majrur?',
          hint: 'Tanda jarr untuk Jamak Muannats Salim (yang berakhiran Alif dan Ta\') adalah kasrah.',
          options: [
            {
              id: 'a',
              label: 'بِالنِّيَّاتِ (Berharakat Kasrah: Bin-Niyyāti)',
              isCorrect: true,
              explanation:
                'Masya Allah, sempurna! Huruf Ba\' men-jarr-kan isim setelahnya, sehingga an-niyyāti dibaca kasrah zhahirah di huruf ta\'.',
            },
            {
              id: 'b',
              label: 'بِالنِّيَّاتُ (Berharakat Dhammah: Bin-Niyyātu)',
              isCorrect: false,
              explanation:
                'Afwan, keliru. Isim yang kemasukan huruf jar pantang berharakat dhammah, ia wajib majrur.',
            },
            {
              id: 'c',
              label: 'بِالنِّيَّاتَ (Berharakat Fathah: Bin-Niyyāta)',
              isCorrect: false,
              explanation:
                'Afwan, keliru. Tanda majrur pada Jamak Muannats Salim adalah kasrah, bukan fathah.',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'hadis-senyum',
    title: 'Hadis Senyum Adalah Sedekah',
    category: 'mubtadi',
    levelLabel: 'Tingkat Dasar (Mubtadi\')',
    source: 'Sunan At-Tirmidzi No. 1956',
    fullMatanGundul: 'تبسمك في وجه اخيك صدقة',
    fullMatanVocalized: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ',
    translation: 'Senyumanmu di hadapan wajah saudaramu terhitung sebagai suatu sedekah.',
    introAdvice:
      'Hadis yang sangat indah dan penuh keteladanan akhlak. Mari kita bedah struktur susunan Mubtada\' mudhaf-mudhaf ilaih dan khabar-nya.',
    steps: [
      {
        wordIndex: 0,
        wordGundul: 'تبسمك',
        wordVocalized: 'تَبَسُّمُكَ',
        meaning: 'Senyumanmu',
        nahwuRule: 'Mubtada\' marfu\' bil-dhammah wa huwa mudhaf, kaf dhamir muttashil mudhaf ilaih.',
        wazan: 'تَفَعُّلٌ',
        root: 'ب-س-م',
        shighah: 'Masdar Tsulatsi Mazid bi Harfain (Kaf Dhamir)',
        kedudukanQuestion: {
          prompt: 'Perhatikan kata pertama 「تبسمك」 yang mengawali kalimat. Apa kedudukan nahwunya?',
          hint: 'Kata ini adalah isim masdar yang menjadi subjek utama pembuka kalimat.',
          options: [
            {
              id: 'a',
              label: 'Mubtada\' marfu\' (Subjek)',
              isCorrect: true,
              explanation:
                'Benar sekali! 「تَبَسُّمُ」 adalah isim masdar marfu\' berkedudukan sebagai Mubtada\', bersambung dengan dhamir kaf sebagai mudhaf ilaih.',
            },
            {
              id: 'b',
              label: 'Fi\'il Amr (Kata kerja perintah)',
              isCorrect: false,
              explanation:
                'Afwan, jangan terkecoh dengan huruf ta\' di awal. Kata ini bukan kata kerja perintah, melainkan isim masdar (kata benda) dari wazan tabassama - yatabassamu - tabassuman.',
            },
            {
              id: 'c',
              label: 'Fa\'il (Pelaku)',
              isCorrect: false,
              explanation:
                'Afwan, Fa\'il harus didahului oleh fi\'il (kata kerja). Di awal kalimat ini belum ada fi\'il.',
            },
          ],
        },
        harakatQuestion: {
          prompt: 'Bagaimana harakat huruf Mim sebelum huruf Kaf dhamir?',
          hint: 'Karena berstatus sebagai Mubtada\' marfu\', tanda i\'rab aslinya tampak pada huruf terakhir kata asalnya (mim).',
          options: [
            {
              id: 'a',
              label: 'تَبَسُّمُكَ (Mim berharakat Dhammah)',
              isCorrect: true,
              explanation:
                'Mumtaz! Huruf mim berharakat dhammah 「تَبَسُّمُ」 karena marfu\' sebagai Mubtada\'.',
            },
            {
              id: 'b',
              label: 'تَبَسَّمَكَ (Mim berharakat Fathah)',
              isCorrect: false,
              explanation:
                'Afwan, mim fathah adalah bentuk fi\'il madhi. Sedangkan di sini posisinya adalah isim masdar marfu\'.',
            },
            {
              id: 'c',
              label: 'تَبَسُّمِكَ (Mim berharakat Kasrah)',
              isCorrect: false,
              explanation:
                'Afwan, tidak ada amil yang men-jarr-kan kata ini.',
            },
          ],
        },
      },
      {
        wordIndex: 1,
        wordGundul: 'في',
        wordVocalized: 'فِي',
        meaning: 'Di / pada',
        nahwuRule: 'Harf jar mabni \'alas sukun.',
        wazan: 'حَرْفٌ',
        root: '—',
        shighah: 'Harf Jar Mabni',
        kedudukanQuestion: {
          prompt: 'Kata kedua 「في」 termasuk ke dalam kategori kata apa?',
          hint: 'Salah satu dari huruf-huruf pen-jarr isim yang bermakna zharaf / di dalam.',
          options: [
            {
              id: 'a',
              label: 'Harf Jar (Huruf pen-jarr)',
              isCorrect: true,
              explanation:
                'Shahih! 「فِي」 adalah salah satu huruf jar paling masyhur, mabni di atas sukun.',
            },
            {
              id: 'b',
              label: 'Isim Isyarah (Kata tunjuk)',
              isCorrect: false,
              explanation:
                'Afwan, kata tunjuk adalah hadza, hadzihi, tilka, dll. 「في」 adalah huruf jar.',
            },
          ],
        },
        harakatQuestion: {
          prompt: 'Bagaimana cara membaca lafaz 「في」?',
          hint: 'Fa\' kasrah bertemu ya\' sukun.',
          options: [
            {
              id: 'a',
              label: 'فِي (Fī - kasrah panjang)',
              isCorrect: true,
              explanation: 'Tepat sekali! Huruf fa\' kasrah bersambung dengan ya\' sukun maddiyyah.',
            },
            {
              id: 'b',
              label: 'فَي (Fay - fathah)',
              isCorrect: false,
              explanation: 'Afwan, keliru. Harakat huruf jar ini adalah kasrah 「فِي」.',
            },
          ],
        },
      },
      {
        wordIndex: 2,
        wordGundul: 'وجه',
        wordVocalized: 'وَجْهِ',
        meaning: 'Wajah / hadapan',
        nahwuRule: 'Isim majrur bi fī wa \'alamatu jarrihi al-kasrah, wa huwa mudhaf.',
        wazan: 'فَعْلٌ',
        root: 'و-ج-ه',
        shighah: 'Isim Jamid',
        kedudukanQuestion: {
          prompt: 'Karena terletak tepat setelah huruf jar 「فِي」, apa kedudukan nahwunya?',
          hint: 'Setiap isim yang jatuh setelah huruf jar hukumnya...',
          options: [
            {
              id: 'a',
              label: 'Isim Majrur bil-Harf (sekaligus Mudhaf)',
              isCorrect: true,
              explanation:
                'Mumtaz! Isim ini dijarr-kan oleh huruf jar 「فِي」 dan berstatus mudhaf ke kata setelahnya.',
            },
            {
              id: 'b',
              label: 'Khabar Mubtada\'',
              isCorrect: false,
              explanation:
                'Afwan, belum menjadi khabar yang menyempurnakan faedah inti kalimat.',
            },
          ],
        },
        harakatQuestion: {
          prompt: 'Apa harakat huruf Ha\' di akhir lafaz 「وجه」?',
          hint: 'Tanda asal majrur pada isim mufrad adalah kasrah.',
          options: [
            {
              id: 'a',
              label: 'وَجْهِ (Ha\' berharakat Kasrah: Wajhi)',
              isCorrect: true,
              explanation: 'Shahih! Dibaca kasrah tanpa tanwin karena berstatus mudhaf.',
            },
            {
              id: 'b',
              label: 'وَجْهُ (Ha\' berharakat Dhammah: Wajhu)',
              isCorrect: false,
              explanation: 'Afwan, ada amil jar 「فِي」 sebelumnya yang mewajibkan kasrah.',
            },
          ],
        },
      },
      {
        wordIndex: 3,
        wordGundul: 'اخيك',
        wordVocalized: 'أَخِيكَ',
        meaning: 'Saudaramu',
        nahwuRule: 'Mudhaf ilaih majrur dengan Ya\' (Asma\'ul Khamsah) wa huwa mudhaf, kaf mudhaf ilaih.',
        wazan: 'فَعِيلٌ',
        root: 'أ-خ-و',
        shighah: 'Asma\'ul Khamsah',
        kedudukanQuestion: {
          prompt: 'Lafaz 「اخيك」 termasuk Asma\'ul Khamsah yang bersandar pada 「وجه」. Apa kedudukannya?',
          hint: 'Kata yang disandari kepemilikan oleh kata sebelumnya (Idhafah).',
          options: [
            {
              id: 'a',
              label: 'Mudhaf Ilaih majrur',
              isCorrect: true,
              explanation:
                'Tepat sekali! Karena Asma\'ul Khamsah majrur, tandanya adalah huruf Ya\' 「أَخِيكَ」.',
            },
            {
              id: 'b',
              label: 'Maf\'ul Bih manshub',
              isCorrect: false,
              explanation: 'Afwan, susunan ini adalah idhafah (wajhi akhīka).',
            },
          ],
        },
        harakatQuestion: {
          prompt: 'Tanda i\'rab jarr untuk Asma\'ul Khamsah (kata saudara/akhu) saat majrur adalah dengan huruf apa?',
          hint: 'Rafa\' dengan wawu (akhūka), nashab dengan alif (akhāka), dan jarr dengan...',
          options: [
            {
              id: 'a',
              label: 'أَخِيكَ (Tanda Jarr dengan Huruf Ya\')',
              isCorrect: true,
              explanation:
                'Mumtaz! Asma\'ul Khamsah marfu\' bil-wawu, manshub bil-alif, dan majrur bil-ya\'. Jadi dibaca Akhīka!',
            },
            {
              id: 'b',
              label: 'أَخُوكَ (Dengan Huruf Wawu - Akhūka)',
              isCorrect: false,
              explanation:
                'Afwan, huruf wawu adalah tanda marfu\' (Rafa\'). Sedangkan mudhaf ilaih wajib majrur.',
            },
            {
              id: 'c',
              label: 'أَخَاكَ (Dengan Huruf Alif - Akhāka)',
              isCorrect: false,
              explanation:
                'Afwan, huruf alif adalah tanda manshub (Nashab).',
            },
          ],
        },
      },
      {
        wordIndex: 4,
        wordGundul: 'صدقة',
        wordVocalized: 'صَدَقَةٌ',
        meaning: 'Suatu sedekah',
        nahwuRule: 'Khabar al-mubtada\' marfu\' dengan dhammah tanwin.',
        wazan: 'فَعَلَةٌ',
        root: 'ص-د-ق',
        shighah: 'Isim Mufrad',
        kedudukanQuestion: {
          prompt: 'Kata terakhir 「صدقة」 melengkapi makna utama dari subjek 「تبسمك」. Apa kedudukan nahwunya?',
          hint: 'Pemberi kabar / predikat yang menyempurnakan makna kalimat sempurna.',
          options: [
            {
              id: 'a',
              label: 'Khabar Mubtada\' (Predikat penyempurna)',
              isCorrect: true,
              explanation:
                'Ahsantum! Inilah inti beritanya: "Senyumanmu di wajah saudaramu itu adalah SEDEKAH". Khabar hukumnya marfu\'.',
            },
            {
              id: 'b',
              label: 'Hal (Keterangan keadaan)',
              isCorrect: false,
              explanation: 'Afwan, kata ini adalah predikat pokok berita, bukan sekadar penjelas keadaan sampingan.',
            },
          ],
        },
        harakatQuestion: {
          prompt: 'Karena berstatus Khabar Mubtada\' isim mufrad nakirah, bagaimana harakat ta\' marbuthah di akhirnya?',
          hint: 'Khabar isim nakirah yang marfu\' diakhiri dengan tanda pokok...',
          options: [
            {
              id: 'a',
              label: 'صَدَقَةٌ (Dhammahtain / Tanwin Dhammah: Shadaqatun)',
              isCorrect: true,
              explanation: 'Masya Allah! Sempurna. Dibaca Shadaqatun dengan tanwin dhammah.',
            },
            {
              id: 'b',
              label: 'صَدَقَةً (Fathahtain / Tanwin Fathah)',
              isCorrect: false,
              explanation: 'Afwan, tanwin fathah adalah tanda manshub.',
            },
            {
              id: 'c',
              label: 'صَدَقَةٍ (Kasrahtain / Tanwin Kasrah)',
              isCorrect: false,
              explanation: 'Afwan, tanwin kasrah adalah tanda majrur.',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'hadis-dutsur',
    title: 'Hadis Ahli Dutsur',
    category: 'mutawassith',
    levelLabel: 'Tingkat Menengah (Mutawassith)',
    source: 'Shahih Muslim No. 1006',
    fullMatanGundul: 'ذهب اهل الدثور بالاجور',
    fullMatanVocalized: 'ذَهَبَ أَهْلُ الدُّثُورِ بِالْأُجُورِ',
    translation: 'Orang-orang kaya yang berharta melimpah telah memborong pahala yang banyak.',
    introAdvice:
      'Hadis masyhur tentang semangat sahabat miskin berlomba dalam amal shalih. Mari kita telaah struktur Jumlah Fi\'liyyah yang tersusun rapi.',
    steps: [
      {
        wordIndex: 0,
        wordGundul: 'ذهب',
        wordVocalized: 'ذَهَبَ',
        meaning: 'Telah pergi / memborong',
        nahwuRule: 'Fi\'il madhi mabni \'alal fathi lazim.',
        wazan: 'فَعَلَ',
        root: 'ذ-ه-ب',
        shighah: 'Fi\'il Madhi Tsulatsi Mujarrad',
        kedudukanQuestion: {
          prompt: 'Lafaz pembuka 「ذهب」 menunjukkan suatu perbuatan yang telah lampau. Apa kedudukan nahwunya?',
          hint: 'Kata kerja masa lampau yang tidak membutuhkan amil nasib atau jazim.',
          options: [
            {
              id: 'a',
              label: 'Fi\'il Madhi mabni \'alal fathi',
              isCorrect: true,
              explanation:
                'Mumtaz! 「ذَهَبَ」 adalah fi\'il madhi tsulatsi mujarrad, mabni di atas harakat fathah lahir.',
            },
            {
              id: 'b',
              label: 'Fi\'il Mudhari\' marfu\'',
              isCorrect: false,
              explanation:
                'Afwan, fi\'il mudhari\' diawali huruf mudhara\'ah (anita: alif, nun, ya, ta) seperti yadz-habu.',
            },
            {
              id: 'c',
              label: 'Isim Mubtada\'',
              isCorrect: false,
              explanation:
                'Afwan, kata ini adalah kata kerja (fi\'il), sehingga kalimat ini adalah Jumlah Fi\'liyyah.',
            },
          ],
        },
        harakatQuestion: {
          prompt: 'Fi\'il Madhi yang tidak bersambung dengan dhamir apa pun dihukumi mabni di atas harakat apa?',
          hint: 'Kaidah dasar fi\'il madhi: mabni \'alal...',
          options: [
            {
              id: 'a',
              label: 'ذَهَبَ (Fathah pada huruf Ba\')',
              isCorrect: true,
              explanation: 'Shahih! Kaidah paten: Al-fi\'lul madhi mabniyyun \'alal fathi abadan.',
            },
            {
              id: 'b',
              label: 'ذَهَبُ (Dhammah)',
              isCorrect: false,
              explanation: 'Afwan, fi\'il madhi hanya mabni dhammah jika bersambung wawu jama\'ah (Dzahabū).',
            },
            {
              id: 'c',
              label: 'ذَهَبْ (Sukun)',
              isCorrect: false,
              explanation: 'Afwan, fi\'il madhi mabni sukun hanya jika bersambung dhamir rafa\' mutaharrik (Dzahabtu, dzahabna).',
            },
          ],
        },
      },
      {
        wordIndex: 1,
        wordGundul: 'اهل',
        wordVocalized: 'أَهْلُ',
        meaning: 'Pemilik / orang-orang',
        nahwuRule: 'Fa\'il marfu\' bil-dhammah azh-zhahirah, wa huwa mudhaf.',
        wazan: 'فَعْلٌ',
        root: 'أ-ه-ل',
        shighah: 'Isim Jamid (Mudhaf)',
        kedudukanQuestion: {
          prompt: 'Lafaz 「اهل」 terletak setelah kata kerja 「ذهب」 dan menjadi pelaku dari perbuatan pergi/memborong tersebut. Apa kedudukannya?',
          hint: 'Subjek pelaku pekerjaan dalam struktur Jumlah Fi\'liyyah.',
          options: [
            {
              id: 'a',
              label: 'Fa\'il (Pelaku pekerjaan) marfu\'',
              isCorrect: true,
              explanation:
                'Benar sekali! Isim yang terletak setelah fi\'il ma\'ruf dan berfungsi sebagai pelaku adalah Fa\'il, hukumnya marfu\'.',
            },
            {
              id: 'b',
              label: 'Maf\'ul Bih (Objek)',
              isCorrect: false,
              explanation: 'Afwan, 「اهل」 adalah pihak yang melakukan perbuatan pergi/memborong (pelaku), bukan objek yang dikenai perbuatan.',
            },
          ],
        },
        harakatQuestion: {
          prompt: 'Sebagai Fa\'il isim mufrad yang berposisi sebagai mudhaf (tanpa alif lam dan tanwin), apa harakat huruf Lam?',
          hint: 'Tanda pokok rafa\' pada fa\'il mufrad adalah dhammah tunggal.',
          options: [
            {
              id: 'a',
              label: 'أَهْلُ (Dhammah tunggal: Ahlu)',
              isCorrect: true,
              explanation: 'Mumtaz! Dibaca Ahlu dengan satu dhammah karena bersambung sebagai mudhaf.',
            },
            {
              id: 'b',
              label: 'أَهْلَ (Fathah: Ahla)',
              isCorrect: false,
              explanation: 'Afwan, fathah adalah tanda maf\'ul bih yang manshub.',
            },
            {
              id: 'c',
              label: 'أَهْلِ (Kasrah: Ahli)',
              isCorrect: false,
              explanation: 'Afwan, kasrah adalah tanda majrur.',
            },
          ],
        },
      },
      {
        wordIndex: 2,
        wordGundul: 'الدثور',
        wordVocalized: 'الدُّثُورِ',
        meaning: 'Harta melimpah',
        nahwuRule: 'Mudhaf ilaih majrur bil-kasrah azh-zhahirah.',
        wazan: 'فُعُولٌ',
        root: 'د-ث-ر',
        shighah: 'Isim Jamak Taksir (Mufrad: Datsr)',
        kedudukanQuestion: {
          prompt: 'Lafaz 「الدثور」 bersandar pada kata 「أهل」 untuk menerangkan kepemilikan harta. Apa kedudukan nahwunya?',
          hint: 'Kata kedua dalam susunan Idhafah.',
          options: [
            {
              id: 'a',
              label: 'Mudhaf Ilaih majrur',
              isCorrect: true,
              explanation: 'Tepat sekali! Susunan "Ahlu ad-dutsūr" adalah susunan idhafah, kata kedua berkedudukan sebagai mudhaf ilaih majrur.',
            },
            {
              id: 'b',
              label: 'Na\'at (Sifat)',
              isCorrect: false,
              explanation: 'Afwan, kata ini bukan sifat kata benda (bukan ad-datsir), melainkan jamak taksir benda yang disandarkan.',
            },
          ],
        },
        harakatQuestion: {
          prompt: 'Tanda i\'rab jarr untuk lafaz 「الدثور」 pada huruf Ra\' di akhir kata adalah:',
          hint: 'Isim jamak taksir bertanda jarr dengan tanda asal...',
          options: [
            {
              id: 'a',
              label: 'الدُّثُورِ (Kasrah: Ad-Dutsūri)',
              isCorrect: true,
              explanation: 'Mumtaz! Tanda jarr-nya adalah kasrah zhahirah.',
            },
            {
              id: 'b',
              label: 'الدُّثُورُ (Dhammah)',
              isCorrect: false,
              explanation: 'Afwan, mudhaf ilaih tidak pernah marfu\' dhammah.',
            },
          ],
        },
      },
      {
        wordIndex: 3,
        wordGundul: 'بالاجور',
        wordVocalized: 'بِالْأُجُورِ',
        meaning: 'Dengan pahala yang banyak',
        nahwuRule: 'Sibh jumlah (jar majrur) muta\'alliq bil-fi\'li dzahaba.',
        wazan: 'فُعُولٌ',
        root: 'أ-ج-ر',
        shighah: 'Jar Majrur (Jamak Taksir dari Ajr)',
        kedudukanQuestion: {
          prompt: 'Lafaz terakhir diawali huruf Ba\' 「بِـ」. Apa fungsi susunan kata ini?',
          hint: 'Jar wa Majrur yang terikat (muta\'alliq) maknanya dengan fi\'il dzahaba.',
          options: [
            {
              id: 'a',
              label: 'Jar wa Majrur muta\'alliq (terikat) dengan fi\'il dzahaba',
              isCorrect: true,
              explanation: 'Masya Allah, analisis mutawassith yang luar biasa! Ba\' harf jar men-jarr-kan al-ujūr, terikat maknanya dengan kata kerja memborong.',
            },
            {
              id: 'b',
              label: 'Maf\'ul Muthlaq',
              isCorrect: false,
              explanation: 'Afwan, Maf\'ul muthlaq adalah masdar dari fi\'il yang sama (seperti dzahaba dzahaban).',
            },
          ],
        },
        harakatQuestion: {
          prompt: 'Bagaimana harakat huruf Ra\' pada 「بالاجور」?',
          hint: 'Huruf jar mewajibkan isim sesudahnya berharakat...',
          options: [
            {
              id: 'a',
              label: 'بِالْأُجُورِ (Kasrah: Bil-Ujūri)',
              isCorrect: true,
              explanation: 'Sempurna! Dibaca Bil-Ujūri dengan kasrah zhahirah.',
            },
            {
              id: 'b',
              label: 'بِالْأُجُورَ (Fathah)',
              isCorrect: false,
              explanation: 'Afwan, huruf jar men-jarr-kan bukan menashabkan.',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'hadis-arkan',
    title: 'Hadis Rukun Islam',
    category: 'mutawassith',
    levelLabel: 'Tingkat Menengah (Mutawassith)',
    source: 'Shahih Al-Bukhari No. 8',
    fullMatanGundul: 'بني الاسلام على خمس',
    fullMatanVocalized: 'بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ',
    translation: 'Islam ditegakkan di atas lima pondasi pokok.',
    introAdvice:
      'Mari belajar mengenali fi\'il mabni lil-majhul (bentuk pasif) dan Na\'ibul Fa\'il.',
    steps: [
      {
        wordIndex: 0,
        wordGundul: 'بني',
        wordVocalized: 'بُنِيَ',
        meaning: 'Ditegakkan / dibangun',
        nahwuRule: 'Fi\'il madhi mabni lil-majhul (pasif) mabni \'alal fathi.',
        wazan: 'فُعِلَ',
        root: 'ب-ن-ي',
        shighah: 'Fi\'il Madhi Mabni Majhul (Naqis)',
        kedudukanQuestion: {
          prompt: 'Perhatikan kata kerja 「بني」. Apakah bentuk aktif (ma\'lum) atau bentuk pasif (majhul)?',
          hint: 'Bandingkan dengan banā (membangun) vs buniya (dibangun).',
          options: [
            {
              id: 'a',
              label: 'Fi\'il Madhi Mabni lil-Majhul (Bentuk Pasif)',
              isCorrect: true,
              explanation: 'Tepat sekali! Fi\'il madhi dibentuk pasif dengan mendhammahkan huruf pertama dan mengkasrahkan huruf sebelum akhir (fu\'ila -> buniya).',
            },
            {
              id: 'b',
              label: 'Fi\'il Madhi Ma\'lum (Bentuk Aktif)',
              isCorrect: false,
              explanation: 'Afwan, bentuk aktifnya berbunyi banā 「بَنَى」.',
            },
          ],
        },
        harakatQuestion: {
          prompt: 'Berdasarkan wazan majhul 「فُعِلَ」, bagaimana syakal kata 「بني」?',
          hint: 'Dhammatan awwaluhu wa kusira ma qabla akhirih.',
          options: [
            {
              id: 'a',
              label: 'بُنِيَ (Ba\' dhammah, Nun kasrah, Ya\' fathah: Buniya)',
              isCorrect: true,
              explanation: 'Mumtaz! Buniya: dhammah di awal, kasrah sebelum akhir, dan tetap mabni fathah di huruf terakhir.',
            },
            {
              id: 'b',
              label: 'بَنَى (Bana)',
              isCorrect: false,
              explanation: 'Afwan, ini bentuk aktifnya.',
            },
          ],
        },
      },
      {
        wordIndex: 1,
        wordGundul: 'الاسلام',
        wordVocalized: 'الْإِسْلَامُ',
        meaning: 'Agama Islam',
        nahwuRule: 'Na\'ibul Fa\'il marfu\' bil-dhammah azh-zhahirah.',
        wazan: 'إِفْعَالٌ',
        root: 'س-ل-م',
        shighah: 'Masdar Mazid bi Hamzah',
        kedudukanQuestion: {
          prompt: 'Karena terletak tepat setelah fi\'il majhul 「بُنِيَ」, apa kedudukan nahwu lafaz 「الاسلام」?',
          hint: 'Pengganti fa\'il yang hukumnya marfu\' setelah fi\'il pasif.',
          options: [
            {
              id: 'a',
              label: 'Na\'ibul Fa\'il marfu\' (Pengganti Pelaku)',
              isCorrect: true,
              explanation: 'Ahsantum! Setiap fi\'il mabni lil-majhul memerlukan Na\'ibul Fa\'il yang dihukumi marfu\'.',
            },
            {
              id: 'b',
              label: 'Maf\'ul Bih manshub',
              isCorrect: false,
              explanation: 'Afwan, objek yang semula maf\'ul bih telah dipromosikan statusnya menjadi Na\'ibul Fa\'il dan berharakat marfu\'.',
            },
          ],
        },
        harakatQuestion: {
          prompt: 'Apa harakat huruf Mim di akhir kata 「الاسلام」?',
          hint: 'Na\'ibul fa\'il dihukumi marfu\' sebagaimana fa\'il.',
          options: [
            {
              id: 'a',
              label: 'الْإِسْلَامُ (Dhammah: Al-Islāmu)',
              isCorrect: true,
              explanation: 'Shahih! Al-Islāmu dengan tanda rafa\' dhammah zhahirah.',
            },
            {
              id: 'b',
              label: 'الْإِسْلَامَ (Fathah: Al-Islāma)',
              isCorrect: false,
              explanation: 'Afwan, Na\'ibul fa\'il tidak manshub.',
            },
          ],
        },
      },
      {
        wordIndex: 2,
        wordGundul: 'على',
        wordVocalized: 'عَلَى',
        meaning: 'Di atas / pondasi',
        nahwuRule: 'Harf jar mabni \'alas sukun.',
        wazan: 'حَرْفٌ',
        root: '—',
        shighah: 'Harf Jar Mabni',
        kedudukanQuestion: {
          prompt: 'Apa jenis kata 「على」?',
          hint: 'Huruf jar yang menunjukkan makna isti\'la\' (di atas).',
          options: [
            {
              id: 'a',
              label: 'Harf Jar mabni \'alas sukun',
              isCorrect: true,
              explanation: 'Benar! Huruf jar yang selalu mabni di atas sukun (alif layyinah).',
            },
          ],
        },
        harakatQuestion: {
          prompt: 'Bagaimana cara membaca huruf ini?',
          hint: '\'Ain fathah, Lam fathah dengan alif maqshurah.',
          options: [
            {
              id: 'a',
              label: 'عَلَى (\'Alā)',
              isCorrect: true,
              explanation: 'Tepat!',
            },
            {
              id: 'b',
              label: 'عَلِي (\'Alī)',
              isCorrect: false,
              explanation: 'Afwan, itu nama orang (Ali), bukan huruf jar \'ala.',
            },
          ],
        },
      },
      {
        wordIndex: 3,
        wordGundul: 'خمس',
        wordVocalized: 'خَمْسٍ',
        meaning: 'Lima pondasi',
        nahwuRule: 'Isim majrur bi \'ala wa \'alamatu jarrihi al-kasrah.',
        wazan: 'فَعْلٌ',
        root: 'خ-م-س',
        shighah: '\'Adad Asli Mufrad Nakirah',
        kedudukanQuestion: {
          prompt: 'Kata 「خمس」 didahului huruf jar 「على」 dan merupakan bilangan nakirah. Apa kedudukannya?',
          hint: 'Isim majrur bil-harf.',
          options: [
            {
              id: 'a',
              label: 'Isim Majrur bil-Harf',
              isCorrect: true,
              explanation: 'Shahih! Berkedudukan sebagai isim majrur karena didahului oleh huruf jar \'ala.',
            },
          ],
        },
        harakatQuestion: {
          prompt: 'Karena merupakan isim mufrad nakirah yang majrur, apa harakat akhirnya?',
          hint: 'Majrur isim nakirah bertanwin...',
          options: [
            {
              id: 'a',
              label: 'خَمْسٍ (Tanwin Kasrah: Khamsin)',
              isCorrect: true,
              explanation: 'Masya Allah! Sempurna. Dibaca Khamsin dengan kasrahtain.',
            },
            {
              id: 'b',
              label: 'خَمْسٌ (Tanwin Dhammah)',
              isCorrect: false,
              explanation: 'Afwan, ada huruf jar \'ala sebelumnya.',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'hadis-ihsan',
    title: 'Tingkatan Ihsan',
    category: 'mutaqaddim',
    levelLabel: 'Tingkat Lanjutan (Mutaqaddim)',
    source: 'Shahih Muslim No. 8',
    fullMatanGundul: 'ان تعبد الله كانك تراه',
    fullMatanVocalized: 'أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ',
    translation: 'Bahwasanya engkau beribadah kepada Allah seakan-akan engkau melihat-Nya.',
    introAdvice:
      'Tingkatan tertinggi dalam ibadah. Mari kita telaah huruf nasib mashdariyyah, maf\'ul bihi lafzhul jalalah, dan khabar jumlah fi\'liyyah.',
    steps: [
      {
        wordIndex: 0,
        wordGundul: 'ان',
        wordVocalized: 'أَنْ',
        meaning: 'Bahwasanya',
        nahwuRule: 'Harf mashdariyyah wa nashb mabni \'alas sukun.',
        wazan: 'حَرْفٌ',
        root: '—',
        shighah: 'Harf Mashdari wa Nashb',
        kedudukanQuestion: {
          prompt: 'Lafaz pembuka 「ان」 masuk ke kata kerja mudhari\'. Apa peran nahwunya?',
          hint: 'Huruf yang menashabkan fi\'il mudhari\' dan meleburnya menjadi makna masdar.',
          options: [
            {
              id: 'a',
              label: 'Harf Mashdariyyah wa Nashb (Penashab fi\'il)',
              isCorrect: true,
              explanation: 'Mumtaz! 「أَنْ」 adalah amil nawashib (penashab fi\'il mudhari\') sekaligus harf mashdariyyah.',
            },
            {
              id: 'b',
              label: 'Harf Syarat (Penjazim)',
              isCorrect: false,
              explanation: 'Afwan, in syarat berharakat kasrah hamzahnya 「إِنْ」, sedangkan ini fathah 「أَنْ」.',
            },
          ],
        },
        harakatQuestion: {
          prompt: 'Bagaimana syakal dan harakat huruf 「ان」?',
          hint: 'Hamzah fathah di atas alif dan nun sukun.',
          options: [
            {
              id: 'a',
              label: 'أَنْ (\'An - Hamzah fathah dan Nun sukun)',
              isCorrect: true,
              explanation: 'Shahih! Dibaca \'An.',
            },
            {
              id: 'b',
              label: 'إِنْ (\'In - Kasrah)',
              isCorrect: false,
              explanation: 'Afwan, \'in kasrah adalah huruf syarat.',
            },
          ],
        },
      },
      {
        wordIndex: 1,
        wordGundul: 'تعبد',
        wordVocalized: 'تَعْبُدَ',
        meaning: 'Engkau beribadah / menyembah',
        nahwuRule: 'Fi\'il mudhari\' manshub bi an wa \'alamatu nashbihi al-fathah.',
        wazan: 'تَفْعُلَ',
        root: 'ع-ب-د',
        shighah: 'Fi\'il Mudhari\' Manshub',
        kedudukanQuestion: {
          prompt: 'Kata 「تعبد」 didahului oleh amil penashab 「أَنْ」. Apa kedudukan dan status i\'rabnya?',
          hint: 'Fi\'il mudhari\' yang kemasukan amil nasib berhukum...',
          options: [
            {
              id: 'a',
              label: 'Fi\'il Mudhari\' Manshub bi \'An',
              isCorrect: true,
              explanation: 'Tepat sekali! Huruf \'An menashabkan fi\'il mudhari\' ta\'buda.',
            },
            {
              id: 'b',
              label: 'Fi\'il Mudhari\' Marfu\'',
              isCorrect: false,
              explanation: 'Afwan, fi\'il mudhari\' hanya marfu\' jika sepi dari amil nasib dan amil jazim.',
            },
          ],
        },
        harakatQuestion: {
          prompt: 'Tanda nashab pada fi\'il mudhari\' shahih akhir yang didahului \'An adalah harakat:',
          hint: 'Tanda pokok nashab pada fi\'il mudhari\' adalah...',
          options: [
            {
              id: 'a',
              label: 'تَعْبُدَ (Dal berharakat Fathah: Ta\'buda)',
              isCorrect: true,
              explanation: 'Mumtaz! Dibaca Ta\'buda dengan harakat fathah di huruf dal.',
            },
            {
              id: 'b',
              label: 'تَعْبُدُ (Dal berharakat Dhammah: Ta\'budu)',
              isCorrect: false,
              explanation: 'Afwan, dhammah adalah tanda marfu\'. Di sini ada amil nasib \'an.',
            },
            {
              id: 'c',
              label: 'تَعْبُدْ (Dal berharakat Sukun: Ta\'bud)',
              isCorrect: false,
              explanation: 'Afwan, sukun adalah tanda jazm (jika ada lam atau in syarat).',
            },
          ],
        },
      },
      {
        wordIndex: 2,
        wordGundul: 'الله',
        wordVocalized: 'اللَّهَ',
        meaning: 'Allah (Lafzhul Jalalah)',
        nahwuRule: 'Lafzhul Jalalah maf\'ul bihi manshub bil-fathah azh-zhahirah.',
        wazan: '—',
        root: 'أ-ل-ه',
        shighah: 'Isim \'Alam (Lafzhul Jalalah)',
        kedudukanQuestion: {
          prompt: 'Lafzhul Jalalah 「الله」 adalah Dzat yang disembah dalam perbuatan ibadah tersebut. Apa kedudukannya?',
          hint: 'Objek yang dikenai perbuatan (yang disembah).',
          options: [
            {
              id: 'a',
              label: 'Maf\'ul Bih (Objek yang disembah) manshub',
              isCorrect: true,
              explanation: 'Masya Allah, tepat! Lafzhul Jalalah berkedudukan sebagai Maf\'ul Bih manshub dengan fathah adaban ma\'allah.',
            },
            {
              id: 'b',
              label: 'Fa\'il (Pelaku)',
              isCorrect: false,
              explanation: 'Afwan, pelakunya adalah dhamir mustatir taqdiruhu anta (engkau).',
            },
          ],
        },
        harakatQuestion: {
          prompt: 'Tanda nashab pada Lafzhul Jalalah sebagai maf\'ul bihi adalah:',
          hint: 'Isim mufrad manshub bertanda harakat...',
          options: [
            {
              id: 'a',
              label: 'اللَّهَ (Fathah: Allāha)',
              isCorrect: true,
              explanation: 'Shahih! Dibaca Ta\'budallāha dengan fathah.',
            },
            {
              id: 'b',
              label: 'اللَّهُ (Dhammah: Allāhu)',
              isCorrect: false,
              explanation: 'Afwan, dhammah adalah tanda fa\'il atau mubtada\'.',
            },
            {
              id: 'c',
              label: 'اللَّهِ (Kasrah: Allāhi)',
              isCorrect: false,
              explanation: 'Afwan, kasrah adalah tanda majrur.',
            },
          ],
        },
      },
      {
        wordIndex: 3,
        wordGundul: 'كانك',
        wordVocalized: 'كَأَنَّكَ',
        meaning: 'Seakan-akan engkau',
        nahwuRule: 'Ka\'anna harf tasybih wa nashb, kaf dhamir muttashil fi mahalli nashbin ismu ka\'anna.',
        wazan: 'حَرْفٌ',
        root: '—',
        shighah: 'Saudara Inna (Musyabbahah bil-Fi\'il)',
        kedudukanQuestion: {
          prompt: 'Lafaz 「كانك」 merupakan huruf tasybih (penyerupaan). Termasuk kelompok amil apakah ia?',
          hint: 'Salah satu dari saudara-saudara Inna (Inna wa Akhawatuha).',
          options: [
            {
              id: 'a',
              label: 'Saudara Inna (Harf Tasybih wa Nashb)',
              isCorrect: true,
              explanation: 'Mumtaz! Ka\'anna adalah salah satu akhawātu Inna yang menashabkan isim dan merafa\'kan khabar.',
            },
            {
              id: 'b',
              label: 'Saudara Kana (Kana wa Akhawatuha)',
              isCorrect: false,
              explanation: 'Afwan, Kana beramal sebaliknya (merafa\'kan isim dan menashabkan khabar). Ini adalah Ka\'anna (saudara Inna).',
            },
          ],
        },
        harakatQuestion: {
          prompt: 'Bagaimana harakat nun pada kata 「كانك」?',
          hint: 'Nun bertasydid fathah.',
          options: [
            {
              id: 'a',
              label: 'كَأَنَّكَ (Ka\'annaka - Nun bertasydid fathah)',
              isCorrect: true,
              explanation: 'Shahih! Ka\'annaka, dengan nun bertasydid fathah.',
            },
            {
              id: 'b',
              label: 'كَأَنْكَ (Ka\'anka - Nun sukun)',
              isCorrect: false,
              explanation: 'Afwan, ka\'anna ber-tasydid nunnya.',
            },
          ],
        },
      },
      {
        wordIndex: 4,
        wordGundul: 'تراه',
        wordVocalized: 'تَرَاهُ',
        meaning: 'Melihat-Nya',
        nahwuRule: 'Jumlah fi\'liyyah fi mahalli raf\'in khabar ka\'anna, ha\' dhamir muttashil maf\'ul bih.',
        wazan: 'تَفْعَاهُ',
        root: 'ر-أ-ي',
        shighah: 'Fi\'il Mudhari\' Mu\'tal Akhir (Naqis)',
        kedudukanQuestion: {
          prompt: 'Susunan kalimat kerja 「تراه」 berkedudukan sebagai apa bagi huruf 「كَأَنَّكَ」 sebelumnya?',
          hint: 'Khabar yang menyempurnakan makna Ka\'anna.',
          options: [
            {
              id: 'a',
              label: 'Jumlah Fi\'liyyah fi mahalli raf\'in Khabar Ka\'anna',
              isCorrect: true,
              explanation: 'Alhamdulillah, sempurna! Seluruh kalimat kerja ini menempati posisi marfu\' sebagai Khabar Ka\'anna.',
            },
            {
              id: 'b',
              label: 'Shifat (Na\'at)',
              isCorrect: false,
              explanation: 'Afwan, posisinya adalah pilar penutup predikat khabar.',
            },
          ],
        },
        harakatQuestion: {
          prompt: 'Bagaimana cara membaca lafaz ini dengan benar?',
          hint: 'Ta\' fathah, Ra\' fathah panjang, dan Ha\' dhamir berharakat dhammah.',
          options: [
            {
              id: 'a',
              label: 'تَرَاهُ (Tarāhu)',
              isCorrect: true,
              explanation: 'Mumtaz jiddan! Dibaca Tarāhu dengan alif layyinah fathah panjang dan hu dhamir.',
            },
            {
              id: 'b',
              label: 'تُرَاهُ (Turāhu)',
              isCorrect: false,
              explanation: 'Afwan, fi\'il mudhari\' tsulatsi ra\'ā bentuk aktifnya berawalan fathah ta\'nya: yarā / tarā.',
            },
          ],
        },
      },
    ],
  },
];

const COMMON_ROLE_CANDIDATES = [
  { key: 'fiil_madhi', label: "Fi'il Madhi (Kata kerja lampau)", test: /fi['i]l.*madh/i },
  { key: 'fiil_mudhari', label: "Fi'il Mudhari' (Kata kerja kini/nanti)", test: /fi['i]l.*mudh/i },
  { key: 'mubtada', label: "Mubtada' (Subjek awal kalimat)", test: /mubtada/i },
  { key: 'khabar', label: "Khabar (Predikat penyempurna makna)", test: /khabar/i },
  { key: 'fail', label: "Fa'il (Pelaku pekerjaan)", test: /fa['i]l/i },
  { key: 'naibul_fail', label: "Na'ibul Fa'il (Pengganti pelaku)", test: /na['i]b.*fa['i]l/i },
  { key: 'maful', label: "Maf'ul Bih (Objek penderita)", test: /maf['i]ul/i },
  { key: 'mudhaf_ilaih', label: "Mudhaf Ilaih (Kata sandang kepemilikan)", test: /mudhaf.*ilaih/i },
  { key: 'harf_jar', label: "Harf Jar (Huruf pen-jarr)", test: /harf.*jar|huruf.*jar/i },
  { key: 'majrur', label: "Isim Majrur (Kata yang dijarr-kan)", test: /majrur/i },
  { key: 'shifat', label: "Na'at / Shifat (Kata sifat)", test: /shifat|na['a]t/i },
  { key: 'hal', label: "Hal (Keterangan keadaan)", test: /\bhal\b/i },
];

/**
 * Mengubah dokumen dari arsip database pengguna menjadi modul latihan interaktif dinamis.
 */
export function convertDocToPracticeLesson(doc: any): PracticeLesson {
  const allWords: any[] = [];
  const sortedSegs = (doc.segments || []).sort(
    (a: any, b: any) => (a.position || 0) - (b.position || 0),
  );

  sortedSegs.forEach((seg: any) => {
    const segWords = (seg.words || []).sort(
      (a: any, b: any) => (a.position || 0) - (b.position || 0),
    );
    allWords.push(...segWords);
  });

  const fullMatanGundul = doc.source_text || '';
  const fullMatanVocalized =
    sortedSegs
      .map((s: any) => s.arabic_vocalized)
      .filter(Boolean)
      .join(' ') || fullMatanGundul;

  const translation =
    sortedSegs
      .map((s: any) => s.translation_id)
      .filter(Boolean)
      .join(' ') || (doc.title || 'Kajian Naskah Arab');

  // Ambil maksimal 20 kata pertama untuk sesi latihan terfokus & menyenangkan
  const targetWords = allWords.slice(0, 20);

  const steps: PracticeStep[] = targetWords.map((w, idx) => {
    const vocalized = w.arabic_vocalized || w.ar || '';
    const gundul = stripHarakat(vocalized);
    const nahwu = w.nahwu || "Kaidah I'rab";
    const meaning = w.meaning_id || '—';
    const wazan = w.sharf?.wazan || '—';
    const root = w.sharf?.root || '—';
    const shighah = w.sharf?.tashrif || '—';

    // 1. Deteksi peran yang cocok
    const matched = COMMON_ROLE_CANDIDATES.find((rc) => rc.test.test(nahwu));
    const correctRoleLabel = matched ? matched.label : (nahwu.slice(0, 40) + '...');

    // Ambil 2 pengecoh yang tidak cocok
    const distractors = COMMON_ROLE_CANDIDATES.filter((rc) => !rc.test.test(nahwu)).slice(0, 2);

    const kedudukanOptions: PracticeOption[] = [
      {
        id: 'a',
        label: correctRoleLabel,
        isCorrect: true,
        explanation: `Tepat sekali! Sesuai analisis naskah: ${nahwu}`,
      },
      {
        id: 'b',
        label: distractors[0]?.label || "Maf'ul Bih (Objek)",
        isCorrect: false,
        explanation: `Kurang tepat. Perhatikan konteksnya dalam naskah, kata ini dianalisis sebagai: ${nahwu}`,
      },
      {
        id: 'c',
        label: distractors[1]?.label || "Mubtada' (Subjek)",
        isCorrect: false,
        explanation: `Kurang tepat. Kedudukan yang benar adalah: ${nahwu}`,
      },
    ];

    // 2. Opsi Harakat
    const harakatOptions: PracticeOption[] = [
      {
        id: 'a',
        label: `${vocalized} (Sesuai I'rab)`,
        isCorrect: true,
        explanation: `Benar! Bacaan yang tepat adalah ${vocalized} (${meaning}).`,
      },
      {
        id: 'b',
        label: `${gundul} (Alternatif lain)`,
        isCorrect: false,
        explanation: `Kurang tepat. Bentuk bersyakal yang tepat adalah ${vocalized} sesuai i'rab: ${nahwu}.`,
      },
    ];

    return {
      wordIndex: idx,
      wordGundul: gundul,
      wordVocalized: vocalized,
      meaning,
      nahwuRule: nahwu,
      wazan,
      root,
      shighah,
      kedudukanQuestion: {
        prompt: `Perhatikan kata ke-${idx + 1} 「${gundul}」. Apa kedudukan nahwunya dalam kalimat?`,
        hint: `Perhatikan posisi kata ini dalam susunan kalimat. I'rab: ${nahwu.slice(0, 60)}...`,
        options: kedudukanOptions,
      },
      harakatQuestion: {
        prompt: `Bagaimana harakat/bacaan yang tepat untuk lafaz 「${gundul}」 ini?`,
        hint: `Tinjau kedudukan nahwunya: ${nahwu}`,
        options: harakatOptions,
      },
    };
  });

  return {
    id: `doc-${doc.id}`,
    title: doc.title || 'Dokumen Arsip',
    category: 'mutawassith',
    levelLabel: doc.source_name ? `Arsip: ${doc.source_name}` : 'Arsip Saya',
    source: doc.source_name || doc.title || 'Arsip Kajian',
    fullMatanGundul,
    fullMatanVocalized,
    translation,
    introAdvice: `Mari latihan membaca naskah "${doc.title}" kata per kata bersama Asisten.`,
    steps,
  };
}
