export interface RIASECQuestion {
  id: number;
  category: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  text: string;
}

export interface RIASECResult {
  topCode: string; // e.g. "ASI"
  topCategories: { code: string; label: string; score: number }[];
  scores: Record<string, number>;
  recommendedMajors: string[];
  careerPaths: string[];
  description: string;
}

// 50 RIASEC questions
const rawRIASEC: { cat: 'R' | 'I' | 'A' | 'S' | 'E' | 'C'; text: string }[] = [
  // Realistic (8)
  { cat: 'R', text: 'Saya senang merakit komponen mekanik atau memperbaiki perkakas yang rusak.' },
  { cat: 'R', text: 'Saya menyukai kegiatan di luar ruangan (outdoor) daripada berdiam di dalam kantor.' },
  { cat: 'R', text: 'Saya tertarik mempelajari cara kerja mesin, kendaraan, atau perangkat keras komputer.' },
  { cat: 'R', text: 'Saya terampil menggunakan tangan untuk membuat model fisik atau pertukangan.' },
  { cat: 'R', text: 'Saya menikmati olahraga fisik yang menuntut ketangkasan dan stamina tinggi.' },
  { cat: 'R', text: 'Saya lebih suka belajar dengan mempraktikkan langsung daripada mendengarkan ceramah.' },
  { cat: 'R', text: 'Saya menyukai berkebun, memelihara hewan, atau bekerja dekat dengan alam.' },
  { cat: 'R', text: 'Saya merasa puas saat berhasil merakit barang fungsional dari awal.' },

  // Investigative (8)
  { cat: 'I', text: 'Saya gemar memecahkan teka-teki logika, teka-teki matematika, atau teka-teki sains.' },
  { cat: 'I', text: 'Saya terdorong mencari tahu alasan ilmiah di balik fenomena alam yang terjadi.' },
  { cat: 'I', text: 'Saya menikmati membaca jurnal, artikel penelitian, atau ensiklopedia pengetahuan.' },
  { cat: 'I', text: 'Saya suka melakukan eksperimen dan menganalisis data secara sistematis.' },
  { cat: 'I', text: 'Saya tertarik pada biologi, astronomi, kedokteran, atau pemrograman komputer tingkat lanjut.' },
  { cat: 'I', text: 'Saya lebih suka mengamati dan meneliti permasalahan secara objektif sebelum bertindak.' },
  { cat: 'I', text: 'Saya menyukai pekerjaan riset yang membutuhkan konsentrasi pemikiran tinggi.' },
  { cat: 'I', text: 'Saya selalu mempertanyakan asumsi umum untuk membuktikan kebenarannya secara empiris.' },

  // Artistic (9)
  { cat: 'A', text: 'Saya senang mengekspresikan diri melalui seni rupa, desain grafis, ilustrasi, atau fotografi.' },
  { cat: 'A', text: 'Saya menikmati menulis puisi, cerpen, skenario drama, atau artikel reflektif.' },
  { cat: 'A', text: 'Saya gemar memainkan alat musik, bernyanyi, atau mengaransemen lagu.' },
  { cat: 'A', text: 'Saya memiliki apresiasi tinggi terhadap estetika, komposisi warna, dan keindahan ruang.' },
  { cat: 'A', text: 'Saya merasa terkekang jika harus bekerja dengan aturan kaku tanpa ruang kreativitas.' },
  { cat: 'A', text: 'Saya senang menciptakan konsep unik yang belum pernah dibuat oleh orang lain.' },
  { cat: 'A', text: 'Saya tertarik pada dunia film, sinematografi, atau seni pertunjukan teater.' },
  { cat: 'A', text: 'Saya peka terhadap keindahan bahasa dan metafora emosional.' },
  { cat: 'A', text: 'Saya suka mendesain tata letak visual atau konten media kreatif.' },

  // Social (9)
  { cat: 'S', text: 'Saya memiliki kepuasan batin saat dapat membantu orang lain menyelesaikan masalahnya.' },
  { cat: 'S', text: 'Saya senang mengajar, melatih, atau membimbing adik kelas memahami pelajaran.' },
  { cat: 'S', text: 'Saya mudah berempati dan menjadi pendengar setia saat teman curhat.' },
  { cat: 'S', text: 'Saya tertarik menjadi relawan dalam kegiatan kemanusiaan atau bakti sosial.' },
  { cat: 'S', text: 'Saya menyukai profesi yang berinteraksi langsung membantu kesejahteraan manusia.' },
  { cat: 'S', text: 'Saya pandai menjembatani perselisihan dan menciptakan perdamaian antar teman.' },
  { cat: 'S', text: 'Saya tertarik pada topik psikologi perkembangan, konseling, dan kesehatan mental.' },
  { cat: 'S', text: 'Bagi saya, kontribusi positif bagi sesama lebih bermakna daripada sekadar materi uang.' },
  { cat: 'S', text: 'Saya senang menyambut orang baru dan membuat mereka merasa diterima di kelompok.' },

  // Enterprising (8)
  { cat: 'E', text: 'Saya senang memimpin rapat, mengorganisasi acara, atau menjadi ketua panitia.' },
  { cat: 'E', text: 'Saya memiliki ketertarikan kuat pada dunia wirausaha, bisnis, dan strategi penjualan.' },
  { cat: 'E', text: 'Saya percaya diri berbicara di depan umum dan mempengaruhi opini audiens.' },
  { cat: 'E', text: 'Saya senang bernegosiasi untuk mencapai kesepakatan yang menguntungkan.' },
  { cat: 'E', text: 'Saya termotivasi untuk mencapai target keberhasilan yang kompetitif.' },
  { cat: 'E', text: 'Saya berani mengambil risiko untuk mewujudkan peluang usaha baru.' },
  { cat: 'E', text: 'Saya suka merancang strategi pemasaran dan membangun jaringan relasi (networking).' },
  { cat: 'E', text: 'Saya memiliki ambisi untuk memegang peran kepemimpinan strategis masa depan.' },

  // Conventional (8)
  { cat: 'C', text: 'Saya menyukai keteraturan data angka, pembukuan keuangan, dan arsip dokumen yang rapi.' },
  { cat: 'C', text: 'Saya merasa nyaman bekerja dengan prosedur operasional baku (SOP) yang jelas.' },
  { cat: 'C', text: 'Saya teliti dalam memeriksa kekeliruan ketik, angka desimal, atau detail administratif.' },
  { cat: 'C', text: 'Saya senang membuat tabel data spreadsheet (Excel/Sheets) yang terstruktur rapi.' },
  { cat: 'C', text: 'Saya selalu memastikan anggaran belanja atau catatan kas tercatat secara transparan.' },
  { cat: 'C', text: 'Saya lebih suka instruksi kerja yang pasti daripada tugas yang ambigu atau serba bebas.' },
  { cat: 'C', text: 'Saya terbiasa mematuhi tenggat waktu dengan ketepatan jadwal yang disiplin.' },
  { cat: 'C', text: 'Saya menikmati mengorganisir inventaris berkas atau sistem informasi data sekolah.' }
];

export const TALENTS_QUESTIONS: RIASECQuestion[] = rawRIASEC.map((q, idx) => ({
  id: idx + 1,
  category: q.cat,
  text: q.text,
}));

export const RIASEC_LABELS: Record<string, string> = {
  R: 'Realistis (Praktikal & Fisik)',
  I: 'Investigatif (Analitis & Riset)',
  A: 'Artistik (Kreatif & Ekspresif)',
  S: 'Sosial (Humaniora & Edukasi)',
  E: 'Enterprising (Kepemimpinan & Bisnis)',
  C: 'Konvensional (Administratif & Data)',
};

export function calculateRIASEC(answers: Record<number, number>): RIASECResult {
  const scores: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  TALENTS_QUESTIONS.forEach((q) => {
    const val = answers[q.id] ?? 3; // 1 to 5
    scores[q.category] += val;
  });

  const sortedCats = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, val]) => ({
      code: cat,
      label: RIASEC_LABELS[cat] || cat,
      score: val,
    }));

  const top3 = sortedCats.slice(0, 3);
  const topCode = top3.map((c) => c.code).join('');

  // Determine majors and careers based on top categories
  const majorsSet = new Set<string>();
  const careersSet = new Set<string>();

  top3.forEach((c) => {
    if (c.code === 'R') {
      ['Teknik Mesin', 'Teknik Sipil', 'Teknik Elektro', 'Ilmu Pertanian & Kehutanan', 'Arsitektur Lanskap'].forEach((m) => majorsSet.add(m));
      ['Insinyur Lapangan', 'Teknisi Sistem', 'Spesialis Robotika', 'Arsitek'].forEach((ca) => careersSet.add(ca));
    } else if (c.code === 'I') {
      ['Kedokteran & Kesehatan', 'Farmasi', 'Ilmu Komputer & AI', 'Fisika/Kimia Murni', 'Bioteknologi'].forEach((m) => majorsSet.add(m));
      ['Peneliti / Saintis', 'Data Scientist', 'Dokter Spesialis', 'Software Engineer'].forEach((ca) => careersSet.add(ca));
    } else if (c.code === 'A') {
      ['Desain Komunikasi Visual (DKV)', 'Sastra & Bahasa', 'Seni Rupa & Film', 'Desain Interior', 'Jurnalistik'].forEach((m) => majorsSet.add(m));
      ['UI/UX Designer', 'Creative Director', 'Penulis / Editor', 'Animator & Kreator Konten'].forEach((ca) => careersSet.add(ca));
    } else if (c.code === 'S') {
      ['Bimbingan Konseling & Psikologi', 'Pendidikan Guru', 'Kesejahteraan Sosial', 'Ilmu Komunikasi & PR', 'Keperawatan'].forEach((m) => majorsSet.add(m));
      ['Konselor Psikologis / Guru BK', 'Spesialis HR & Pelatihan', 'Pekerja Sosial', 'Hubungan Masyarakat'].forEach((ca) => careersSet.add(ca));
    } else if (c.code === 'E') {
      ['Manajemen Bisnis', 'Ilmu Hukum', 'Hubungan Internasional', 'Ekonomi Pembangunan', 'Marketing Komunikasi'].forEach((m) => majorsSet.add(m));
      ['Wirausahawan (Founder)', 'Manajer Pemasaran', 'Konsultan Manajemen', 'Diplomat / Advokat'].forEach((ca) => careersSet.add(ca));
    } else if (c.code === 'C') {
      ['Akuntansi & Perpajakan', 'Sistem Informasi Manajemen', 'Administrasi Bisnis / Publik', 'Aktuaria', 'Statistika Terapan'].forEach((m) => majorsSet.add(m));
      ['Auditor Keuangan', 'Database Administrator', 'Aktuaris', 'Manajer Operasional'].forEach((ca) => careersSet.add(ca));
    }
  });

  return {
    topCode,
    topCategories: top3,
    scores,
    recommendedMajors: Array.from(majorsSet).slice(0, 6),
    careerPaths: Array.from(careersSet).slice(0, 6),
    description: `Kombinasi minat dominan Anda adalah ${top3.map((c) => c.label).join(', ')}. Anda memiliki potensi unggul dalam bidang yang memadukan daya kreasi, kepedulian, dan pemikiran terstruktur.`,
  };
}
