export interface VARKQuestion {
  id: number;
  category: 'V' | 'A' | 'R' | 'K'; // Visual, Auditory, Read/Write, Kinesthetic
  text: string;
}

export interface VARKResult {
  dominantStyle: string;
  secondaryStyle: string;
  scores: {
    visual: number;
    auditory: number;
    readWrite: number;
    kinesthetic: number;
  };
  percentages: {
    visual: number;
    auditory: number;
    readWrite: number;
    kinesthetic: number;
  };
  strengths: string[];
  strategies: string[];
}

const rawVARK: { cat: 'V' | 'A' | 'R' | 'K'; text: string }[] = [
  // Visual (13)
  { cat: 'V', text: 'Saya lebih mudah mengingat materi ketika guru menggunakan diagram alur, peta konsep, atau grafik berwarna.' },
  { cat: 'V', text: 'Saya terbiasa membayangkan bentuk dan letak kata dalam halaman buku saat mengingat materi.' },
  { cat: 'V', text: 'Saya lebih suka membaca instruksi yang dilengkapi bagan visual daripada sekadar teks panjang.' },
  { cat: 'V', text: 'Catatan belajar saya dipenuhi stabilo berwarna-warni dan garis bawah untuk membedakan tingkatan konsep.' },
  { cat: 'V', text: 'Menonton video dokumenter atau animasi edukatif sangat mempercepat pemahaman saya.' },
  { cat: 'V', text: 'Saya mudah mengingat wajah seseorang meskipun sering lupa namanya.' },
  { cat: 'V', text: 'Saya lebih menyukai buku pelajaran yang memiliki tata letak grafis rapi dan banyak ilustrasi penjelas.' },
  { cat: 'V', text: 'Ketika memikirkan rencana, saya membuat gambar sketsa atau peta visual di kertas.' },
  { cat: 'V', text: 'Saya mudah terganggu oleh ruangan belajar yang berantakan secara visual.' },
  { cat: 'V', text: 'Saya menyukai infografis yang merangkum data statistik menjadi visual ringkas.' },
  { cat: 'V', text: 'Saya dapat membayangkan bentuk ruang 3 dimensi di kepala saya dengan jelas.' },
  { cat: 'V', text: 'Peta pikiran (Mind Map) adalah senjata belajar utama saya menjelang ujian.' },
  { cat: 'V', text: 'Saya lebih tertarik pada presentasi slide yang memuat foto dan grafik pendukung daripada penuh peluru teks.' },

  // Auditory (13)
  { cat: 'A', text: 'Saya belajar paling efektif saat mendengarkan penjelasan langsung dari guru atau dosen.' },
  { cat: 'A', text: 'Mendengarkan rekaman audio materi atau podcast edukasi sangat membantu ingatan saya.' },
  { cat: 'A', text: 'Saya suka melafalkan catatan pelajaran dengan suara keras saat menghafal di kamar.' },
  { cat: 'A', text: 'Diskusi tanya-jawab lisan dengan teman membuat pemahaman saya jauh lebih matang.' },
  { cat: 'A', text: 'Saya peka terhadap intonasi dan nada bicara guru saat menekankan poin penting.' },
  { cat: 'A', text: 'Saya mudah mengingat lirik lagu, lelucon verbal, atau kutipan kata yang pernah diucapkan orang.' },
  { cat: 'A', text: 'Musik lembut tanpa lirik membantu meningkatkan konsentrasi belajar saya.' },
  { cat: 'A', text: 'Saya merasa lebih mudah menjelaskan ide melalui lisan daripada merumuskannya dalam tulisan esai.' },
  { cat: 'A', text: 'Saya mudah terganggu oleh suara bising atau bisikan percakapan saat belajar.' },
  { cat: 'A', text: 'Menjelaskan kembali materi pelajaran ke teman dengan kata-kata sendiri adalah cara ampuh saya menguji diri.' },
  { cat: 'A', text: 'Saya lebih menyukai petunjuk arah yang didiktekan secara lisan daripada membaca peta peta jalan.' },
  { cat: 'A', text: 'Debat lisan dalam kelas membuat saya bersemangat menyerap argumentasi baru.' },
  { cat: 'A', text: 'Saya sering mengulang kalimat dalam hati untuk mencerna maknanya secara mendalam.' },

  // Read/Write (12)
  { cat: 'R', text: 'Saya menikmati membaca buku teks tebal, artikel jurnal, atau buku referensi secara mandiri.' },
  { cat: 'R', text: 'Menulis ulang intisari materi ke dalam buku catatan membuat informasi tersebut melekat kuat.' },
  { cat: 'R', text: 'Saya menyukai tugas menyusun esai, makalah, atau laporan tertulis yang terstruktur.' },
  { cat: 'R', text: 'Saya selalu mencari definisi kata atau istilah asing dalam glosarium atau kamus.' },
  { cat: 'R', text: 'Saya lebih suka menerima instruksi tertulis melalui chat atau dokumen resmi daripada lisan lewat telepon.' },
  { cat: 'R', text: 'Membuat daftar to-do list tertulis memberi saya kepuasan tersendiri saat mencoretnya.' },
  { cat: 'R', text: 'Saya suka merangkum poin-poin penting dalam bentuk paragraf atau poin bernomor yang rapi.' },
  { cat: 'R', text: 'Saya gemar membaca artikel ensiklopedia online untuk memuaskan rasa ingin tahu.' },
  { cat: 'R', text: 'Menyusun daftar istilah kunci dengan maknanya adalah metode hafalan andalan saya.' },
  { cat: 'R', text: 'Saya lebih memilih soal ujian berbentuk esai analitis daripada soal pilihan ganda sederhana.' },
  { cat: 'R', text: 'Saya terbiasa membaca ulang catatan sendiri berkali-kali sebelum memasuki ruang ujian.' },
  { cat: 'R', text: 'Bagi saya, kata-kata tertulis memiliki kekuatan kejelasan dan kepastian yang mutlak.' },

  // Kinesthetic (12)
  { cat: 'K', text: 'Saya paling paham jika diajak melakukan eksperimen langsung di laboratorium atau bengkel kerja.' },
  { cat: 'K', text: 'Saya sulit duduk diam dalam waktu lama dan sering menggerakkan kaki atau memutar bolpoin saat belajar.' },
  { cat: 'K', text: 'Saya belajar sambil berjalan bolak-balik di kamar saat menghafalkan konsep penting.' },
  { cat: 'K', text: 'Role-play (simulasi peran) atau drama kelas sangat memudahkan saya memahami peristiwa sejarah.' },
  { cat: 'K', text: 'Saya menyukai kegiatan pembelajaran lapangan (field trip) daripada duduk di dalam kelas biasa.' },
  { cat: 'K', text: 'Saya lebih suka langsung mencoba mengutak-atik perangkat daripada membaca buku manualnya terlebih dahulu.' },
  { cat: 'K', text: 'Menggunakan alat peraga fisik atau model tiruan membantu saya memahami cara kerja sistem.' },
  { cat: 'K', text: 'Saya membutuhkan jeda istirahat fisik singkat (peregangan) setiap 30 menit sesi belajar.' },
  { cat: 'K', text: 'Saya sering menggunakan gerakan tangan dan tubuh untuk mengekspresikan pikiran saya saat berbicara.' },
  { cat: 'K', text: 'Membuat proyek hasta karya fisik atau miniatur membantu saya menyerap teori yang diajarkan.' },
  { cat: 'K', text: 'Saya lebih mudah mengingat apa yang saya lakukan secara fisik daripada apa yang hanya saya dengar.' },
  { cat: 'K', text: 'Saya menikmati aktivitas praktikum olahraga atau seni tari yang melibatkan koordinasi fisik teratur.' }
];

export const VARK_QUESTIONS: VARKQuestion[] = rawVARK.map((q, idx) => ({
  id: idx + 1,
  category: q.cat,
  text: q.text,
}));

export function calculateVARK(answers: Record<number, number>): VARKResult {
  let v = 0;
  let a = 0;
  let r = 0;
  let k = 0;

  VARK_QUESTIONS.forEach((q) => {
    const val = answers[q.id] ?? 3;
    if (q.category === 'V') v += val;
    else if (q.category === 'A') a += val;
    else if (q.category === 'R') r += val;
    else if (q.category === 'K') k += val;
  });

  const total = Math.max(1, v + a + r + k);
  const pV = Math.round((v / total) * 100);
  const pA = Math.round((a / total) * 100);
  const pR = Math.round((r / total) * 100);
  const pK = 100 - (pV + pA + pR);

  const entries: [string, number][] = [
    ['Visual', v],
    ['Auditori', a],
    ['Baca-Tulis', r],
    ['Kinestetik', k],
  ];
  entries.sort((x, y) => y[1] - x[1]);

  const dominant = entries[0][0];
  const secondary = entries[1][0];

  const strategies: string[] = [];
  const strengths: string[] = [];

  if (dominant === 'Visual') {
    strengths.push('Daya ingat spasial dan imajinasi grafis kuat', 'Cepat menyerap bagan, tabel, dan pola visual');
    strategies.push(
      'Gunakan Mind Mapping berwarna dan diagram alur untuk setiap bab pelajaran',
      'Tandai konsep inti dengan stabilo warna bergradasi sesuai kategori',
      'Tonton video animasi penjelasan konsep di YouTube edukasi'
    );
  } else if (dominant === 'Auditori') {
    strengths.push('Peka terhadap ritme suara dan penjelasan lisan', 'Hebat dalam diskusi verbal dan presentasi');
    strategies.push(
      'Rekam suara rangkuman diri sendiri dan dengarkan kembali menjelang tidur atau saat perjalanan',
      'Lafalkan konsep dengan suara terdengar (vokal) saat belajar mandiri di kamar',
      'Bentuk kelompok belajar dan aktiflah dalam sesi tanya-jawab lisan'
    );
  } else if (dominant === 'Baca-Tulis') {
    strengths.push('Kosa kata luas dan ketajaman analisis tekstual', 'Teliti dalam membaca referensi mendalam');
    strategies.push(
      'Buat rangkuman poin-poin penting dalam buku catatan khusus',
      'Ubah diagram atau tabel menjadi narasi esai penjelasan terstruktur',
      'Gunakan kartu kilas (flashcards) berisi istilah dan definisinya'
    );
  } else {
    strengths.push('Ketangkasan fisik dan pemahaman berbasis pengalaman nyata', 'Mampu belajar cepat lewat simulasi langsung');
    strategies.push(
      'Terapkan metode belajar Pomodoro (25 menit belajar aktif, 5 menit peregangan fisik)',
      'Belajarlah sambil berjalan santai di dalam ruangan saat menghafalkan konsep',
      'Buat model simulasi fisik, eksperimen sederhana, atau kaitkan teori dengan benda di sekitar'
    );
  }

  return {
    dominantStyle: dominant,
    secondaryStyle: secondary,
    scores: { visual: v, auditory: a, readWrite: r, kinesthetic: k },
    percentages: { visual: pV, auditory: pA, readWrite: pR, kinesthetic: pK },
    strengths,
    strategies,
  };
}
