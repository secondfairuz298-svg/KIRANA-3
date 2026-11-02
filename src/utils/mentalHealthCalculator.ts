export interface MentalHealthQuestion {
  id: number;
  dimension: 'stress' | 'anxiety' | 'resilience' | 'mindfulness' | 'social_worth';
  isReverseScored: boolean; // if true, 5 is positive wellness; if false, 5 indicates high distress
  text: string;
}

export interface MentalHealthResult {
  overallScore: number; // 0 to 100 (100 is best psychological wellbeing)
  statusTier: 'Sejahtera Optimal' | 'Cukup Sehat & Stabil' | 'Waspada Ringan (Stres Terdeteksi)' | 'Butuh Dukungan Konseling';
  tagline: string;
  dimensionScores: {
    stress: { score: number; label: string; interpretation: string };
    anxiety: { score: number; label: string; interpretation: string };
    resilience: { score: number; label: string; interpretation: string };
    mindfulness: { score: number; label: string; interpretation: string };
    socialWorth: { score: number; label: string; interpretation: string };
  };
  recommendations: string[];
  counselorPrompt: string;
}

// 100 questions across 5 dimensions (20 questions each)
const rawMentalHealth: { dim: 'stress' | 'anxiety' | 'resilience' | 'mindfulness' | 'social_worth'; rev: boolean; text: string }[] = [
  // 1. Regulasi Emosi & Manajemen Stres (20 questions)
  { dim: 'stress', rev: false, text: 'Saya merasa beban tugas dan tanggung jawab harian melebihi kapasitas mental saya.' },
  { dim: 'stress', rev: false, text: 'Saya mudah merasa kesal atau tersinggung oleh hal-hal sepele yang tidak sesuai rencana.' },
  { dim: 'stress', rev: true,  text: 'Saya dapat menenangkan diri dengan baik ketika situasi di sekitar sedang memanas.' },
  { dim: 'stress', rev: false, text: 'Otot leher atau pundak saya sering terasa tegang dan kaku akibat tekanan pikiran.' },
  { dim: 'stress', rev: true,  text: 'Saya memiliki cara efektif untuk melepas penat setelah seharian beraktivitas.' },
  { dim: 'stress', rev: false, text: 'Saya merasa lelah secara fisik dan emosional meskipun baru saja bangun di pagi hari.' },
  { dim: 'stress', rev: true,  text: 'Saya bisa membedakan mana hal yang bisa saya kendalikan dan mana yang di luar kendali saya.' },
  { dim: 'stress', rev: false, text: 'Saya sering melampiaskan kejengkelan kepada orang terdekat tanpa disengaja.' },
  { dim: 'stress', rev: true,  text: 'Saya mampu mengambil jeda istirahat tanpa merasa bersalah pada diri sendiri.' },
  { dim: 'stress', rev: false, text: 'Pikiran saya terus berpacu bahkan ketika saya sedang berusaha bersantai.' },
  { dim: 'stress', rev: false, text: 'Saya merasa kewalahan mengatur prioritas saat banyak hal datang bersamaan.' },
  { dim: 'stress', rev: true,  text: 'Saya merasa mampu menghadapi ritme rutinitas harian dengan hati yang tenang.' },
  { dim: 'stress', rev: false, text: 'Nafsu makan saya berubah drastis (hilang nafsu makan atau makan berlebih) saat banyak pikiran.' },
  { dim: 'stress', rev: true,  text: 'Saya dapat mengekspresikan emosi sedih atau kecewa dengan cara yang sehat dan aman.' },
  { dim: 'stress', rev: false, text: 'Saya merasa energi mental saya terkuras habis untuk menyelesaikan hal-hal sederhana.' },
  { dim: 'stress', rev: true,  text: 'Saya mampu bersabar dan tidak terburu-buru ketika menghadapi hambatan tak terduga.' },
  { dim: 'stress', rev: false, text: 'Saya merasa waktu 24 jam sehari tidak pernah cukup untuk menyelesaikan kewajiban saya.' },
  { dim: 'stress', rev: true,  text: 'Saya memiliki rutinitas yang membantu saya menjaga kesehatan mental tetap segar.' },
  { dim: 'stress', rev: false, text: 'Saya mudah kehilangan kesabaran saat antre atau menunggu proses yang lambat.' },
  { dim: 'stress', rev: true,  text: 'Saya merasa damai dan nyaman dengan kondisi hidup saya saat ini.' },

  // 2. Tingkat Kecemasan & Overthinking (20 questions)
  { dim: 'anxiety', rev: false, text: 'Saya sering terjaga di malam hari memikirkan skenario terburuk yang belum tentu terjadi.' },
  { dim: 'anxiety', rev: true,  text: 'Saya merasa yakin bahwa masa depan saya akan berjalan dengan baik.' },
  { dim: 'anxiety', rev: false, text: 'Jantung saya berdegup kencang secara tiba-tiba tanpa pemicu fisik yang jelas.' },
  { dim: 'anxiety', rev: true,  text: 'Saya dapat mengendalikan aliran pikiran cemas sebelum membesar tak terkontrol.' },
  { dim: 'anxiety', rev: false, text: 'Saya memutar ulang percakapan masa lalu di kepala dan mengkhawatirkan apa kata orang tentang saya.' },
  { dim: 'anxiety', rev: false, text: 'Saya merasa gelisah dan tidak bisa duduk tenang saat memikirkan masa depan.' },
  { dim: 'anxiety', rev: true,  text: 'Saya merasa aman dan terlindungi di lingkungan tempat tinggal saya.' },
  { dim: 'anxiety', rev: false, text: 'Saya khawatir berlebihan membuat kesalahan di depan umum hingga menghambat tindakan saya.' },
  { dim: 'anxiety', rev: true,  text: 'Saya bisa menerima bahwa ketidakpastian adalah bagian alami dari kehidupan.' },
  { dim: 'anxiety', rev: false, text: 'Saya sering merasa seolah-olah sesuatu yang buruk akan terjadi pada saya atau keluarga.' },
  { dim: 'anxiety', rev: false, text: 'Telapak tangan saya mudah berkeringat dingin saat harus berbicara dengan orang penting.' },
  { dim: 'anxiety', rev: true,  text: 'Saya percaya pada kemampuan diri saya untuk mengatasi ujian atau tantangan mendatang.' },
  { dim: 'anxiety', rev: false, text: 'Saya ragu-ragu berkepanjangan saat harus membuat keputusan sederhana.' },
  { dim: 'anxiety', rev: true,  text: 'Saya merasa santai dan tidak diburu rasa panik dalam keseharian.' },
  { dim: 'anxiety', rev: false, text: 'Saya sering membayangkan kemungkinan gagal sebelum sempat mencoba suatu kesempatan.' },
  { dim: 'anxiety', rev: true,  text: 'Saya bisa bernapas dalam-dalam dan menenangkan detak jantung saat mulai merasa cemas.' },
  { dim: 'anxiety', rev: false, text: 'Saya merasa tegang saat mendengar notifikasi ponsel berdering tak terduga.' },
  { dim: 'anxiety', rev: true,  text: 'Saya merasa rileks saat menghabiskan waktu luang tanpa agenda khusus.' },
  { dim: 'anxiety', rev: false, text: 'Kecemasan membuat saya menghindari menghadiri pertemuan sosial tertentu.' },
  { dim: 'anxiety', rev: true,  text: 'Pikiran saya jernih dan fokus saat mengerjakan tugas yang menuntut konsentrasi.' },

  // 3. Resiliensi & Coping Mechanism (20 questions)
  { dim: 'resilience', rev: true,  text: 'Ketika mengalami kegagalan, saya mampu bangkit kembali dan mencoba strategi baru.' },
  { dim: 'resilience', rev: false, text: 'Kegagalan kecil membuat saya merasa putus asa dan ingin menyerah total.' },
  { dim: 'resilience', rev: true,  text: 'Saya memandang kesulitan sebagai pelajaran berharga yang mendewasakan karakter saya.' },
  { dim: 'resilience', rev: false, text: 'Saya merasa tidak berdaya saat rencana yang telah saya susun berantakan.' },
  { dim: 'resilience', rev: true,  text: 'Saya tahu kepada siapa saya harus meminta bantuan saat merasa tidak sanggup sendiri.' },
  { dim: 'resilience', rev: false, text: 'Kritik dari orang lain membuat saya meragukan seluruh nilai harga diri saya.' },
  { dim: 'resilience', rev: true,  text: 'Saya dapat menemukan sudut pandang positif dan humor bahkan di hari yang berat.' },
  { dim: 'resilience', rev: false, text: 'Saya cenderung menyalahkan diri sendiri secara ekstrem atas keadaan buruk yang menimpa.' },
  { dim: 'resilience', rev: true,  text: 'Saya memiliki ketabahan mental untuk bertahan melewati masa-masa krisis.' },
  { dim: 'resilience', rev: false, text: 'Saya merasa lekas menyerah saat tugas terasa sedikit lebih rumit dari biasanya.' },
  { dim: 'resilience', rev: true,  text: 'Pengalaman masa lalu membuktikan bahwa saya mampu melewati badai kehidupan.' },
  { dim: 'resilience', rev: false, text: 'Saya merasa tidak memiliki daya juang saat menghadapi penolakan.' },
  { dim: 'resilience', rev: true,  text: 'Saya fleksibel mengubah rencana jika situasi di lapangan menuntut demikian.' },
  { dim: 'resilience', rev: false, text: 'Saya mengurung diri berhari-hari saat mengalami kekecewaan mendalam.' },
  { dim: 'resilience', rev: true,  text: 'Saya menyadari bahwa fase sedih adalah sementara dan harapan selalu ada.' },
  { dim: 'resilience', rev: false, text: 'Saya terjebak dalam rasa penyesalan atas peristiwa masa lalu yang tidak bisa diubah.' },
  { dim: 'resilience', rev: true,  text: 'Saya terus melangkah maju meskipun hasil belum langsung terlihat hari ini.' },
  { dim: 'resilience', rev: false, text: 'Rasa takut gagal menghentikan saya untuk mengejar cita-cita yang sebenarnya saya inginkan.' },
  { dim: 'resilience', rev: true,  text: 'Saya bangga dengan ketangguhan diri saya menghadapi rintangan selama ini.' },
  { dim: 'resilience', rev: false, text: 'Saya merasa masa depan tampak gelap gulita tanpa jalan keluar.' },

  // 4. Keseimbangan Hidup & Mindfulness (20 questions)
  { dim: 'mindfulness', rev: true,  text: 'Saya mampu menikmati momen saat ini tanpa terdistraksi oleh ponsel atau lamunan.' },
  { dim: 'mindfulness', rev: false, text: 'Saya menjalani hari seperti robot otomatis tanpa benar-benar merasakan apa yang saya kerjakan.' },
  { dim: 'mindfulness', rev: true,  text: 'Saya meluangkan waktu untuk mengamati keindahan alam, pepohonan, atau langit senja.' },
  { dim: 'mindfulness', rev: false, text: 'Saya terbiasa makan terburu-buru sambil menatap layar gawai tanpa menikmati rasa makanan.' },
  { dim: 'mindfulness', rev: true,  text: 'Saya peka terhadap sinyal fisik tubuh saya saat membutuhkan tidur atau nutrisi.' },
  { dim: 'mindfulness', rev: false, text: 'Pola tidur saya sangat berantakan dan saya sering begadang tanpa alasan produktif.' },
  { dim: 'mindfulness', rev: true,  text: 'Saya bersyukur atas hal-hal kecil menyenangkan yang terjadi dalam hidup saya setiap hari.' },
  { dim: 'mindfulness', rev: false, text: 'Saya kesulitan mematikan pikiran dari urusan pekerjaan atau sekolah saat hari libur.' },
  { dim: 'mindfulness', rev: true,  text: 'Saya bisa mendengarkan seseorang berbicara tanpa sibuk merancang jawaban di kepala saya.' },
  { dim: 'mindfulness', rev: false, text: 'Saya merasa bersalah jika seharian tidak menghasilkan output kerja nyata.' },
  { dim: 'mindfulness', rev: true,  text: 'Saya memiliki hobi yang murni saya nikmati tanpa tuntutan dinilai orang lain.' },
  { dim: 'mindfulness', rev: false, text: 'Saya merasa terjebak dalam rutinitas yang monoton dan kehilangan makna hidup.' },
  { dim: 'mindfulness', rev: true,  text: 'Saya memberikan kasih sayang dan pengampunan kepada diri sendiri saat melakukan kesalahan.' },
  { dim: 'mindfulness', rev: false, text: 'Saya sering merasa waktu berlalu begitu cepat tanpa ingatan bermakna yang berbekas.' },
  { dim: 'mindfulness', rev: true,  text: 'Saya mempraktikkan pernapasan sadar atau doa/meditasi untuk menjernihkan batin.' },
  { dim: 'mindfulness', rev: false, text: 'Saya mengabaikan rasa lelah hingga tubuh saya jatuh sakit.' },
  { dim: 'mindfulness', rev: true,  text: 'Keseimbangan antara belajar/bekerja dan istirahat saya terjaga dengan sehat.' },
  { dim: 'mindfulness', rev: false, text: 'Saya merasa terasing dari tubuh dan perasaan batin saya sendiri.' },
  { dim: 'mindfulness', rev: true,  text: 'Saya merasa terhubung secara utuh dengan diri saya yang sejati.' },
  { dim: 'mindfulness', rev: false, text: 'Saya mudah terpancing amarah oleh konten provokatif di media sosial.' },

  // 5. Hubungan Sosial & Self-Worth (20 questions)
  { dim: 'social_worth', rev: true,  text: 'Saya merasa diri saya berharga dan pantas untuk dicintai apa adanya.' },
  { dim: 'social_worth', rev: false, text: 'Saya sering membandingkan pencapaian saya dengan orang lain di media sosial dan merasa rendah diri.' },
  { dim: 'social_worth', rev: true,  text: 'Saya memiliki orang terdekat yang tulus mendengarkan dan mendukung saya tanpa syarat.' },
  { dim: 'social_worth', rev: false, text: 'Saya merasa kesepian di tengah keramaian dan merasa tidak ada yang benar-benar memahami saya.' },
  { dim: 'social_worth', rev: true,  text: 'Saya berani berkata "tidak" pada permintaan yang melanggar batasan pribadi saya.' },
  { dim: 'social_worth', rev: false, text: 'Saya rela mengorbankan kenyamanan diri sendiri hanya agar disukai dan diterima orang lain.' },
  { dim: 'social_worth', rev: true,  text: 'Saya merasa kehadiran saya di dunia ini memiliki arti dan kontribusi positif bagi sesama.' },
  { dim: 'social_worth', rev: false, text: 'Saya merasa keberadaan saya hanyalah beban bagi keluarga atau teman-teman saya.' },
  { dim: 'social_worth', rev: true,  text: 'Saya dapat merayakan keberhasilan sahabat saya dengan tulus tanpa rasa iri hati.' },
  { dim: 'social_worth', rev: false, text: 'Saya merasa tidak pantas menerima pujian tulus atas keberhasilan yang saya raih.' },
  { dim: 'social_worth', rev: true,  text: 'Hubungan pertemanan saya dilandasi oleh rasa saling menghargai dan kepercayaan timbal-balik.' },
  { dim: 'social_worth', rev: false, text: 'Saya sering merasa cemas ditolak atau ditinggalkan oleh orang yang saya sayangi.' },
  { dim: 'social_worth', rev: true,  text: 'Saya nyaman menjadi diri saya sendiri tanpa harus memakai topeng kepura-puraan.' },
  { dim: 'social_worth', rev: false, text: 'Saya merasa terisolasi dan enggan menceritakan isi hati saya kepada siapa pun.' },
  { dim: 'social_worth', rev: true,  text: 'Saya memaafkan masa lalu dan fokus membina relasi hangat saat ini.' },
  { dim: 'social_worth', rev: false, text: 'Saya merasa sulit memercayai ketulusan orang lain yang berniat baik pada saya.' },
  { dim: 'social_worth', rev: true,  text: 'Saya merasa aman untuk berbagi kerapuhan diri kepada orang yang saya percayai.' },
  { dim: 'social_worth', rev: false, text: 'Saya merasa harga diri saya ditentukan semata-mata oleh nilai rapor atau validasi orang lain.' },
  { dim: 'social_worth', rev: true,  text: 'Saya memandang diri saya dengan penuh kebaikan hati dan penerimaan tulus.' },
  { dim: 'social_worth', rev: false, text: 'Saya merasa terasing dan tidak memiliki tempat bernaung yang aman di lingkungan saya.' }
];

export const MENTAL_HEALTH_QUESTIONS: MentalHealthQuestion[] = rawMentalHealth.map((q, idx) => ({
  id: idx + 1,
  dimension: q.dim,
  isReverseScored: q.rev,
  text: q.text,
}));

export function calculateMentalHealth(answers: Record<number, number>): MentalHealthResult {
  const dimRaw: Record<string, number> = {
    stress: 0,
    anxiety: 0,
    resilience: 0,
    mindfulness: 0,
    social_worth: 0,
  };

  MENTAL_HEALTH_QUESTIONS.forEach((q) => {
    const rawVal = answers[q.id] ?? 3; // 1 to 5
    // Normalize so that 5 is maximum psychological wellness (healthy), 1 is high distress
    let healthPoint = 3;
    if (q.isReverseScored) {
      // 5: strongly agree with healthy statement => 5 points
      healthPoint = rawVal;
    } else {
      // 5: strongly agree with distress statement => 1 point
      healthPoint = 6 - rawVal;
    }
    dimRaw[q.dimension] += healthPoint;
  });

  // Each dimension has 20 questions, min score 20, max score 100.
  const toPct = (val: number) => Math.round(((val - 20) / 80) * 100);

  const stressPct = toPct(dimRaw.stress);
  const anxietyPct = toPct(dimRaw.anxiety);
  const resiliencePct = toPct(dimRaw.resilience);
  const mindfulnessPct = toPct(dimRaw.mindfulness);
  const socialWorthPct = toPct(dimRaw.social_worth);

  const overall = Math.round((stressPct + anxietyPct + resiliencePct + mindfulnessPct + socialWorthPct) / 5);

  let statusTier: 'Sejahtera Optimal' | 'Cukup Sehat & Stabil' | 'Waspada Ringan (Stres Terdeteksi)' | 'Butuh Dukungan Konseling';
  let tagline: string;
  let counselorPrompt: string;
  const recommendations: string[] = [];

  if (overall >= 80) {
    statusTier = 'Sejahtera Optimal';
    tagline = 'Kesejahteraan psikologis Anda berada pada tingkat prima dengan resiliensi dan regulasi emosi yang kokoh.';
    counselorPrompt = 'Kondisi emosional Anda sangat stabil. Tetap pelihara kebiasaan positif dan jadilah pendukung bagi rekan sekitar.';
    recommendations.push(
      'Pertahankan ritme hidup seimbang antara aktivitas, istirahat, dan hobi yang menyenangkan.',
      'Praktikkan jurnalisme rasa syukur harian untuk memperkaya kedamaian batin.',
      'Bagikan energi positif dan jadilah pendengar yang suportif bagi sahabat atau keluarga.'
    );
  } else if (overall >= 65) {
    statusTier = 'Cukup Sehat & Stabil';
    tagline = 'Secara umum kondisi mental Anda stabil dengan kapasitas coping yang memadai, meskipun terdapat beberapa pemicu stres.';
    counselorPrompt = 'Kondisi Anda cukup baik, namun penting untuk memberi perhatian pada area yang mulai terasa melelahkan.';
    recommendations.push(
      'Kenali tanda-tanda awal kejenuhan dan jangan ragu mengambil jeda rehat singkat.',
      'Terapkan teknik pernapasan sadar (4-7-8) saat pikiran mulai merasa terbebani.',
      'Bicarakan unek-unek kepada orang terpercaya sebelum menumpuk menjadi beban.'
    );
  } else if (overall >= 45) {
    statusTier = 'Waspada Ringan (Stres Terdeteksi)';
    tagline = 'Terdeteksi adanya tekanan stres dan kecemasan yang mulai mempengaruhi ketenangan pikiran dan energi harian Anda.';
    counselorPrompt = 'Sangat disarankan untuk berkonsultasi santai dengan Konselor KIRANA atau Guru BK untuk mengurai simpul tekanan pikiran.';
    recommendations.push(
      'Batasi paparan berita negatif atau penggunaan media sosial yang memicu perbandingan diri.',
      'Jadwalkan sesi konseling naungan aman bersama Konselor KIRANA untuk mendapatkan sudut pandang baru yang menenangkan.',
      'Prioritaskan tidur berkualitas 7-8 jam dan luangkan waktu berjalan santai di alam terbuka.'
    );
  } else {
    statusTier = 'Butuh Dukungan Konseling';
    tagline = 'Kapasitas emosional Anda sedang berada di ambang kelelahan tinggi. Anda tidak harus menanggung beban ini seorang diri.';
    counselorPrompt = 'KIRANA hadir sebagai naungan aman bagi Anda. Silakan hubungi konselor profesional atau Guru BK kami sekarang melalui fitur chat atau jadwal temu.';
    recommendations.push(
      'Segera jadwalkan sesi konseling tatap muka atau video call dengan Konselor Profesional KIRANA.',
      'Lepaskan tuntutan perfeksionisme; beri izin diri sendiri untuk beristirahat tanpa rasa bersalah.',
      'Hubungi orang terkasih atau lingkaran pendukung terdekat untuk menemani proses pemulihan batin Anda.'
    );
  }

  const getDimStatus = (pct: number) => {
    if (pct >= 75) return 'Sangat Baik & Kokoh';
    if (pct >= 55) return 'Stabil / Cukup Baik';
    if (pct >= 40) return 'Perlu Perhatian';
    return 'Rentan / Butuh Penguatan';
  };

  return {
    overallScore: overall,
    statusTier,
    tagline,
    dimensionScores: {
      stress: { score: stressPct, label: 'Manajemen Stres & Regulasi', interpretation: getDimStatus(stressPct) },
      anxiety: { score: anxietyPct, label: 'Ketenangan & Bebas Cemas', interpretation: getDimStatus(anxietyPct) },
      resilience: { score: resiliencePct, label: 'Daya Lenting (Resiliensi)', interpretation: getDimStatus(resiliencePct) },
      mindfulness: { score: mindfulnessPct, label: 'Keseimbangan Hidup & Hadir Utuh', interpretation: getDimStatus(mindfulnessPct) },
      socialWorth: { score: socialWorthPct, label: 'Hubungan Sehat & Keberhargaan Diri', interpretation: getDimStatus(socialWorthPct) },
    },
    recommendations,
    counselorPrompt,
  };
}
