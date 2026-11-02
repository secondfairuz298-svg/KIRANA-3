export interface MBTIQuestion {
  id: number;
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  direction: 'positive' | 'negative'; // positive means 5 scores toward E, S, T, J
  text: string;
}

export interface MBTIResult {
  code: string; // e.g. "INFJ"
  title: string;
  tagline: string;
  description: string;
  dimensions: {
    EI: { extraversion: number; introversion: number; dominant: 'E' | 'I' };
    SN: { sensing: number; intuition: number; dominant: 'S' | 'N' };
    TF: { thinking: number; feeling: number; dominant: 'T' | 'F' };
    JP: { judging: number; perceiving: number; dominant: 'J' | 'P' };
  };
  strengths: string[];
  growthAreas: string[];
  studyAndCareerTips: string[];
  interpersonalStyle: string;
}

// 100 Comprehensive Questions for Indonesian Counseling Context
const rawQuestionsData: { dim: 'EI' | 'SN' | 'TF' | 'JP'; dir: 'positive' | 'negative'; text: string }[] = [
  // E vs I (25 questions)
  { dim: 'EI', dir: 'positive', text: 'Saya merasa bertenaga dan bersemangat setelah menghabiskan waktu bersama banyak orang.' },
  { dim: 'EI', dir: 'negative', text: 'Saya membutuhkan waktu hening sendirian untuk mengisi ulang energi mental saya.' },
  { dim: 'EI', dir: 'positive', text: 'Saya mudah memulai percakapan ramah dengan orang yang baru pertama kali saya temui.' },
  { dim: 'EI', dir: 'negative', text: 'Saya lebih suka mengamati suasana terlebih dahulu sebelum memutuskan untuk ikut berbicara.' },
  { dim: 'EI', dir: 'positive', text: 'Dalam kerja kelompok, saya senang memimpin diskusi secara lisan dan interaktif.' },
  { dim: 'EI', dir: 'negative', text: 'Saya lebih nyaman mengekspresikan pikiran terdalam melalui tulisan daripada ucapan spontan.' },
  { dim: 'EI', dir: 'positive', text: 'Akhir pekan yang ramai bersama sahabat terasa lebih menyenangkan daripada berdiam diri di kamar.' },
  { dim: 'EI', dir: 'negative', text: 'Terlalu lama berada di kerumunan membuat saya cepat merasa lelah dan ingin segera pulang.' },
  { dim: 'EI', dir: 'positive', text: 'Saya cenderung memproses ide dengan membicarakannya langsung kepada rekan di sekitar saya.' },
  { dim: 'EI', dir: 'negative', text: 'Saya lebih suka mematangkan rencana di kepala sendiri sebelum menceritakannya ke orang lain.' },
  { dim: 'EI', dir: 'positive', text: 'Saya menikmati menjadi pusat perhatian dalam forum atau perayaan kelas.' },
  { dim: 'EI', dir: 'negative', text: 'Saya merasa canggung ketika sorotan publik tertuju secara tiba-tiba kepada saya.' },
  { dim: 'EI', dir: 'positive', text: 'Saya memiliki jejaring pertemanan yang luas di berbagai komunitas dan kegiatan.' },
  { dim: 'EI', dir: 'negative', text: 'Saya lebih memilih memiliki 2–3 sahabat karib yang sangat mendalam daripada banyak kenalan santai.' },
  { dim: 'EI', dir: 'positive', text: 'Saya cepat beradaptasi dengan lingkungan baru yang penuh interaksi sosial.' },
  { dim: 'EI', dir: 'negative', text: 'Bagi saya, percakapan bermakna berdua jauh lebih berharga daripada obrolan ringan di pesta.' },
  { dim: 'EI', dir: 'positive', text: 'Ketika menghadapi kejenuhan, bertemu teman adalah obat terbaik bagi saya.' },
  { dim: 'EI', dir: 'negative', text: 'Membaca buku, mendengarkan musik santai, atau hobi personal adalah cara terbaik saya melepas penat.' },
  { dim: 'EI', dir: 'positive', text: 'Saya spontan membagikan cerita dan pengalaman saya kepada orang-orang di ruangan.' },
  { dim: 'EI', dir: 'negative', text: 'Saya menjaga privasi pribadi secara rapat dan hanya membagikannya kepada lingkaran sangat dekat.' },
  { dim: 'EI', dir: 'positive', text: 'Diskusi kelompok terbuka membuat saya jauh lebih kreatif dan produktif.' },
  { dim: 'EI', dir: 'negative', text: 'Saya bekerja paling optimal saat suasana tenang dan tidak ada gangguan percakapan.' },
  { dim: 'EI', dir: 'positive', text: 'Saya sering menjadi orang yang mencairkan keheningan dalam suatu pertemuan.' },
  { dim: 'EI', dir: 'negative', text: 'Saya merasa nyaman menikmati kesendirian tanpa merasa kesepian.' },
  { dim: 'EI', dir: 'positive', text: 'Saya suka menghadiri acara sosial meski belum mengenal banyak peserta di sana.' },

  // S vs N (25 questions)
  { dim: 'SN', dir: 'positive', text: 'Saya lebih memercayai fakta konkret, data riil, dan pengalaman nyata yang telah terbukti.' },
  { dim: 'SN', dir: 'negative', text: 'Saya suka mengeksplorasi gagasan filosofis, makna tersembunyi, dan kemungkinan masa depan.' },
  { dim: 'SN', dir: 'positive', text: 'Saya fokus pada rincian langkah demi langkah saat mengerjakan suatu instruksi tugas.' },
  { dim: 'SN', dir: 'negative', text: 'Saya lebih tertarik melihat gambaran besar (big picture) daripada detail teknis yang kaku.' },
  { dim: 'SN', dir: 'positive', text: 'Saya menghargai solusi praktis yang bisa langsung diterapkan di dunia nyata.' },
  { dim: 'SN', dir: 'negative', text: 'Saya bersemangat mendiskusikan konsep teoritis dan visi inovatif baru.' },
  { dim: 'SN', dir: 'positive', text: 'Saat mengingat suatu peristiwa, saya mengingat secara akurat detail kronologis yang terjadi.' },
  { dim: 'SN', dir: 'negative', text: 'Saat mengingat peristiwa, saya lebih mengingat impresi emosional dan makna simboliknya.' },
  { dim: 'SN', dir: 'positive', text: 'Saya lebih suka menguasai metode yang sudah teruji daripada bereksperimen dengan metode baru yang belum pasti.' },
  { dim: 'SN', dir: 'negative', text: 'Saya mudah bosan dengan rutinitas yang repetitif dan selalu mencari cara alternatif yang unik.' },
  { dim: 'SN', dir: 'positive', text: 'Saya mengandalkan panca indra dan fakta yang terlihat di depan mata.' },
  { dim: 'SN', dir: 'negative', text: 'Saya sering mengandalkan intuisi atau firasat batin saya dalam membaca suatu situasi.' },
  { dim: 'SN', dir: 'positive', text: 'Bagi saya, orang yang berpijak pada bumi (realistis) lebih bijak dibanding pemimpi utopis.' },
  { dim: 'SN', dir: 'negative', text: 'Bagi saya, imajinasi dan kemampuan menciptakan hal belum pernah ada adalah kunci kemajuan.' },
  { dim: 'SN', dir: 'positive', text: 'Saya menyukai petunjuk tugas yang spesifik, jelas batasannya, dan terukur.' },
  { dim: 'SN', dir: 'negative', text: 'Saya menyukai tugas terbuka yang memberi kebebasan berimajinasi dan menafsirkan.' },
  { dim: 'SN', dir: 'positive', text: 'Saya terbiasa memperhatikan lingkungan fisik di sekitar saya, seperti perubahan tata letak barang.' },
  { dim: 'SN', dir: 'negative', text: 'Pikiran saya sering melayang memikirkan skenario hipotetis dan pola masa depan.' },
  { dim: 'SN', dir: 'positive', text: 'Saya lebih menghargai penjelasan yang lugas tanpa analogi atau kiasan yang rumit.' },
  { dim: 'SN', dir: 'negative', text: 'Saya senang menggunakan metafora, puisi, atau simbolik dalam menguraikan pemikiran.' },
  { dim: 'SN', dir: 'positive', text: 'Saya memandang masa kini sebagai prioritas utama yang harus diselesaikan dengan baik.' },
  { dim: 'SN', dir: 'negative', text: 'Saya selalu tertarik memproyeksikan apa yang mungkin terjadi dalam 5 hingga 10 tahun ke depan.' },
  { dim: 'SN', dir: 'positive', text: 'Saya menyukai panduan teknis yang sistematis dari awal hingga akhir.' },
  { dim: 'SN', dir: 'negative', text: 'Saya suka menghubungkan hal-hal yang tampaknya tidak berkaitan untuk menemukan wawasan baru.' },
  { dim: 'SN', dir: 'positive', text: 'Kenyataan objektif lebih bernilai bagi saya daripada dugaan yang spekulatif.' },

  // T vs F (25 questions)
  { dim: 'TF', dir: 'positive', text: 'Ketika mengambil keputusan penting, saya mengutamakan logika rasional dan keadilan objektif.' },
  { dim: 'TF', dir: 'negative', text: 'Ketika mengambil keputusan, saya mempertimbangkan perasaan orang lain dan keharmonisan bersama.' },
  { dim: 'TF', dir: 'positive', text: 'Kebenaran harus disampaikan secara jujur apa adanya, meskipun terkadang terasa pahit.' },
  { dim: 'TF', dir: 'negative', text: 'Bagi saya, menjaga kelembutan hati dan martabat orang lain sama pentingnya dengan isi pesan itu sendiri.' },
  { dim: 'TF', dir: 'positive', text: 'Saya menganalisis masalah dengan kepala dingin tanpa melibatkan emosi pribadi.' },
  { dim: 'TF', dir: 'negative', text: 'Saya mudah berempati dan merasakan beban emosional yang sedang ditanggung sahabat saya.' },
  { dim: 'TF', dir: 'positive', text: 'Efisiensi dan ketepatan argumentasi adalah standar utama keberhasilan menurut saya.' },
  { dim: 'TF', dir: 'negative', text: 'Rasa saling menghargai dan kehangatan hubungan adalah nilai tertinggi dalam sebuah tim.' },
  { dim: 'TF', dir: 'positive', text: 'Saya tidak mudah tersinggung ketika menerima kritik yang berlandaskan fakta logis.' },
  { dim: 'TF', dir: 'negative', text: 'Kritik yang disampaikan dengan nada dingin atau kasar bisa sangat melukai perasaan saya.' },
  { dim: 'TF', dir: 'positive', text: 'Aturan harus ditegakkan secara seragam dan setara untuk semua orang tanpa pilih kasih.' },
  { dim: 'TF', dir: 'negative', text: 'Pengecualian manusiawi perlu dipertimbangkan berdasarkan situasi khusus yang dialami individu.' },
  { dim: 'TF', dir: 'positive', text: 'Saya nyaman terlibat dalam perdebatan argumentatif untuk menguji validitas ide.' },
  { dim: 'TF', dir: 'negative', text: 'Saya cenderung menghindari konflik atau perdebatan tajam demi menjaga kedamaian suasana.' },
  { dim: 'TF', dir: 'positive', text: 'Saya membedah masalah dengan menguraikan sebab-akibat secara matematis.' },
  { dim: 'TF', dir: 'negative', text: 'Saya peka terhadap nada bicara dan bahasa tubuh yang menyiratkan suasana hati orang lain.' },
  { dim: 'TF', dir: 'positive', text: 'Dalam evaluasi, saya menilai hasil kerja murni dari kualitas output tanpa rasa sungkan.' },
  { dim: 'TF', dir: 'negative', text: 'Saya selalu berusaha menghargai niat baik dan usaha keras seseorang, bukan sekadar nilai angka.' },
  { dim: 'TF', dir: 'positive', text: 'Bagi saya, bersikap adil berarti memberikan perlakuan yang sama berdasarkan standar baku.' },
  { dim: 'TF', dir: 'negative', text: 'Bagi saya, bersikap welas asih adalah fondasi kemanusiaan yang paling utama.' },
  { dim: 'TF', dir: 'positive', text: 'Saya tidak ragu mengoreksi kekeliruan seseorang demi perbaikan kualitas hasil.' },
  { dim: 'TF', dir: 'negative', text: 'Saya memilih cara yang sangat hati-hati dan suportif agar masukan saya tidak mematahkan semangat.' },
  { dim: 'TF', dir: 'positive', text: 'Saya lebih mengagumi kecerdasan analitis yang tajam.' },
  { dim: 'TF', dir: 'negative', text: 'Saya lebih mengagumi ketulusan hati dan kepedulian tulus terhadap sesama.' },
  { dim: 'TF', dir: 'positive', text: 'Keputusan yang tepat adalah keputusan yang lolos uji penalaran logis.' },

  // J vs P (25 questions)
  { dim: 'JP', dir: 'positive', text: 'Saya merasa tenang dan puas ketika segala jadwal telah tersusun rapi dalam agenda harian.' },
  { dim: 'JP', dir: 'negative', text: 'Saya lebih menyukai keleluasaan waktu dan spontanitas tanpa terikat jadwal ketat.' },
  { dim: 'JP', dir: 'positive', text: 'Saya selalu menyelesaikan tugas jauh sebelum batas waktu (deadline) berakhir.' },
  { dim: 'JP', dir: 'negative', text: 'Tekanan deadline yang mendekat sering kali memicu kreativitas terbaik saya.' },
  { dim: 'JP', dir: 'positive', text: 'Saya menyukai rencana perjalanan yang detail dengan tujuan dan waktu yang pasti.' },
  { dim: 'JP', dir: 'negative', text: 'Saya menikmati perjalanan fleksibel di mana saya bisa bebas berhenti di mana saja sesuka hati.' },
  { dim: 'JP', dir: 'positive', text: 'Meja kerja atau ruang belajar saya tertata rapi dengan barang-barang di tempat semestinya.' },
  { dim: 'JP', dir: 'negative', text: 'Bagi saya, sedikit ketidakteraturan adalah hal wajar asalkan saya tahu di mana mencari barang.' },
  { dim: 'JP', dir: 'positive', text: 'Saya merasa tidak nyaman jika ada keputusan penting yang masih menggantung tanpa kejelasan.' },
  { dim: 'JP', dir: 'negative', text: 'Saya suka membiarkan opsi tetap terbuka selama mungkin sebelum mengambil keputusan final.' },
  { dim: 'JP', dir: 'positive', text: 'Membuat daftar to-do list harian adalah kebiasaan yang sangat membantu produktivitas saya.' },
  { dim: 'JP', dir: 'negative', text: 'Saya lebih suka mengalir mengikuti suasana hati dan dorongan inspirasi saat bekerja.' },
  { dim: 'JP', dir: 'positive', text: 'Perubahan rencana di menit-menit terakhir membuat saya merasa terganggu dan kesal.' },
  { dim: 'JP', dir: 'negative', text: 'Saya mudah berimprovisasi dan beradaptasi saat terjadi perubahan tak terduga.' },
  { dim: 'JP', dir: 'positive', text: 'Saya lebih suka menuntaskan satu proyek hingga tuntas sebelum memulai proyek berikutnya.' },
  { dim: 'JP', dir: 'negative', text: 'Saya sering mengerjakan beberapa aktivitas secara bersamaan dan beralih di antara keduanya.' },
  { dim: 'JP', dir: 'positive', text: 'Disiplin dan kepatuhan pada target adalah prinsip utama keberhasilan saya.' },
  { dim: 'JP', dir: 'negative', text: 'Fleksibilitas dan keterbukaan terhadap peluang baru adalah kekuatan terbesar saya.' },
  { dim: 'JP', dir: 'positive', text: 'Saya selalu menyiapkan rencana cadangan (Plan B) sebelum melangkah.' },
  { dim: 'JP', dir: 'negative', text: 'Saya percaya diri bisa mengatasi rintangan di lapangan dengan akal praktis spontan.' },
  { dim: 'JP', dir: 'positive', text: 'Bagi saya, aturan dan struktur memberi rasa aman dan keteraturan yang terarah.' },
  { dim: 'JP', dir: 'negative', text: 'Aturan yang terlalu kaku membuat saya merasa terkekang dan membatasi kreasi.' },
  { dim: 'JP', dir: 'positive', text: 'Saya mengemas barang bawaan beberapa hari sebelum hari keberangkatan.' },
  { dim: 'JP', dir: 'negative', text: 'Saya sering mengemas barang beberapa jam sebelum berangkat tanpa merasa panik.' },
  { dim: 'JP', dir: 'positive', text: 'Kepastian adalah hal yang sangat berharga bagi ketenteraman batin saya.' }
];

export const MBTI_QUESTIONS: MBTIQuestion[] = rawQuestionsData.map((q, idx) => ({
  id: idx + 1,
  dimension: q.dim,
  direction: q.dir,
  text: q.text,
}));

export const MBTI_PROFILES: Record<string, {
  title: string;
  tagline: string;
  description: string;
  strengths: string[];
  growthAreas: string[];
  studyTips: string[];
  interpersonalStyle: string;
}> = {
  INFJ: {
    title: 'Advokat / Penasihat Bijaksana',
    tagline: 'Pribadi bervisi mendalam, berempati tinggi, dan memiliki integritas moral kokoh.',
    description: 'INFJ adalah tipe kepribadian langka yang menggabungkan intuisi tajam dengan kepedulian mendalam terhadap kemanusiaan. Mereka berorientasi pada nilai-nilai luhur dan memiliki komitmen tulus untuk membimbing orang lain menemukan potensi terbaiknya.',
    strengths: ['Wawasan psikologis tajam & empatik', 'Memiliki integritas etika yang teguh', 'Kreatif dan visioner', 'Penuh dedikasi untuk kebaikan bersama'],
    growthAreas: ['Rentan mengalami burnout emosional', 'Terlalu perfeksionis terhadap diri sendiri', 'Cenderung memendam perasaan hingga meledak'],
    studyTips: ['Belajar di ruang hening yang nyaman', 'Hubungkan materi pelajaran dengan nilai kemanusiaan dan dampak nyata', 'Buat rangkuman visual yang menghubungkan konsep besar'],
    interpersonalStyle: 'Mendengarkan dengan sepenuh hati, menjadi pendengar setia, dan menghargai koneksi batin yang autentik.'
  },
  INTJ: {
    title: 'Arsitek / Pemikir Strategis',
    tagline: 'Perancang strategi yang mandiri, visioner, dan selalu mencari kesempurnaan sistem.',
    description: 'INTJ adalah analis tajam yang memandang hidup seperti papan catur raksasa. Mereka memiliki standar tinggi, haus akan pengetahuan, dan mampu menyusun rencana jangka panjang yang terstruktur.',
    strengths: ['Pemikiran strategis dan logis kuat', 'Mandiri dan percaya diri', 'Mampu melihat solusi inovatif', 'Fokus mencapai target tinggi'],
    growthAreas: ['Bisa terlihat dingin atau tidak sabar pada hal tidak efisien', 'Terlalu kritis terhadap orang lain', 'Kurang memperhatikan faktor emosi'],
    studyTips: ['Susun peta konsep berhierarki', 'Pelajari teori dasar terlebih dahulu sebelum aplikasi', 'Tantang diri dengan soal tingkat tinggi (HOTS)'],
    interpersonalStyle: 'Lugaskan komunikasi, hargai kompetensi, dan butuh ruang privasi intelektual.'
  },
  INFP: {
    title: 'Mediator / Penyembuh Puitis',
    tagline: 'Jiwa idealis yang lembut, menjunjung tinggi ketulusan batin dan keunikan individu.',
    description: 'INFP digerakkan oleh keyakinan personal yang mendalam. Mereka menghargai harmoni, sangat menghormati perasaan sesama, dan memiliki imajinasi kaya yang melahirkan karya penuh rasa.',
    strengths: ['Empati yang sangat dalam', 'Kreatif dan kaya imajinasi', 'Sangat setia pada prinsip batin', 'Mampu melihat keindahan dalam setiap insan'],
    growthAreas: ['Mudah merasa terbebani oleh kritik', 'Kadang kesulitan mengambil tindakan praktis', 'Terlalu larut dalam idealisme yang tidak realistis'],
    studyTips: ['Ciptakan lingkungan belajar yang estetik dan tenang', 'Tulis refleksi materi dengan gaya naratif bebas', 'Bagi tugas besar menjadi langkah kecil teratur'],
    interpersonalStyle: 'Penuh penerimaan tanpa menghakimi, hangat, dan pendengar yang menenangkan.'
  },
  INTP: {
    title: 'Logikawan / Peneliti Inovatif',
    tagline: 'Pemikir independen yang terpesona oleh misteri logika, sains, dan pola dunia.',
    description: 'INTP gemar membongkar konsep hingga ke akar-akarnya. Mereka tidak puas dengan penjelasan permukaan dan selalu mencari penjelasan teoretis yang koheren.',
    strengths: ['Kecerdasan analitis mendalam', 'Objektif dan kritis', 'Terbuka pada pemikiran baru', 'Ahli menemukan kekeliruan sistem'],
    growthAreas: ['Sering menunda eksekusi karena keasyikan berpikir', 'Kurang peka terhadap perasaan orang lain', 'Mudah bosan jika konsep sudah terpecahkan'],
    studyTips: ['Eksplorasi alasan logis di balik setiap rumus atau dalil', 'Gunakan aplikasi simulasi interaktif', 'Diskusikan logika masalah dengan teman sebaya yang setara'],
    interpersonalStyle: 'Lebih tertarik pada pertukaran gagasan intelektual daripada obrolan basa-basi.'
  },
  ENFJ: {
    title: 'Protagonis / Pembimbing Karismatik',
    tagline: 'Pemimpin inspiratif yang mampu membakar semangat orang lain menuju kebaikan bersama.',
    description: 'ENFJ memiliki daya tarik alami yang hangat dan ramah. Mereka mahir membaca dinamika sosial dan selalu berupaya menciptakan komunitas yang saling mendukung.',
    strengths: ['Karismatik dan komunikatif', 'Empati tinggi dan suportif', 'Pengorganisasi acara yang andal', 'Mampu menginspirasi orang lain'],
    growthAreas: ['Terlalu memikirkan pendapat orang lain', 'Kerap mengorbankan kebutuhan pribadi demi orang lain', 'Bisa menjadi terlalu protektif'],
    studyTips: ['Bentuk kelompok belajar diskusi kelompok', 'Ajarkan kembali materi kepada teman', 'Tetapkan batasan waktu agar tidak terdistraksi sosial'],
    interpersonalStyle: 'Sangat ramah, merangkul semua orang, dan selalu menyemangati.'
  },
  ENTJ: {
    title: 'Komandan / Pemimpin Eksekutif',
    tagline: 'Pemimpin tangguh yang tegas, berani mengambil keputusan sulit, dan terfokus pada hasil.',
    description: 'ENTJ adalah katalisator kemajuan. Mereka melihat tantangan sebagai batu loncatan dan mampu mengarahkan tim dengan efisiensi tinggi serta ketegasan tanpa ragu.',
    strengths: ['Kepemimpinan tegas dan berwibawa', 'Efisien dan berorientasi hasil', 'Percaya diri dan strategis', 'Cepat mengambil keputusan'],
    growthAreas: ['Bisa terkesan otoriter atau mendominasi', 'Kurang sabar dengan kelambanan', 'Mengabaikan kelelahan emosional anggota tim'],
    studyTips: ['Tetapkan target prestasi ambisius', 'Buat time-blocking jadwal belajar yang ketat', 'Fokus pada inti bahasan penting dan uji diri sendiri'],
    interpersonalStyle: 'Langsung ke pokok persoalan, berenergi tinggi, dan menuntut komitmen.'
  },
  ENFP: {
    title: 'Juru Kampanye / Jiwa Penjelajah',
    tagline: 'Pribadi antusias, kreatif, dan penuh energi positif yang melihat potensi tak terbatas dalam hidup.',
    description: 'ENFP memancarkan keceriaan dan daya imajinasi bebas. Mereka suka membangun koneksi dengan orang-orang baru dan selalu antusias melahirkan ide-ide segar.',
    strengths: ['Sangat kreatif dan penuh ide orisinal', 'Komunikatif dan ramah', 'Melihat potensi dalam setiap orang', 'Fleksibel dan bersemangat'],
    growthAreas: ['Sulit fokus pada detail teknis yang membosankan', 'Sering memulai banyak hal tanpa menuntaskannya', 'Terlalu mudah cemas jika dituntut kaku'],
    studyTips: ['Gunakan teknik belajar gamifikasi dan mind mapping berwarna', 'Belajar dalam suasana dinamis bersama musik santai', 'Fokus menyelesaikan satu tugas sebelum melompat ke ide baru'],
    interpersonalStyle: 'Hangat, ekspresif, ceria, dan selalu membawa tawa serta semangat positif.'
  },
  ENTP: {
    title: 'Debat / Visioner Cerdik',
    tagline: 'Pemikir lincah yang suka menantang status quo dan menemukan cara kerja inovatif baru.',
    description: 'ENTP tidak pernah takut berbeda pendapat. Mereka menyukai duel intelektual yang cerdas dan mampu melihat celah serta peluang yang luput dari pandangan orang lain.',
    strengths: ['Cepat tanggap dan cerdik', 'Penemu ide terobosan (brainstormer ulung)', 'Tidak takut menghadapi risiko', 'Mampu melihat solusi multi-perspektif'],
    growthAreas: ['Bisa terlihat mendebat hanya demi mendebat', 'Kurang teliti dalam pelaksanaan rutin', 'Cepat bosan setelah fase konsep selesai'],
    studyTips: ['Gunakan pendekatan problem solving berbasis studi kasus', 'Debatkan materi ujian dengan rekan belajar', 'Gunakan aplikasi pencatat digital untuk mengikat ide'],
    interpersonalStyle: 'Penuh humor cerdas, senang menguji pemikiran lawan bicara, dan bersahabat.'
  },
  ISFJ: {
    title: 'Pelindung / Pembela yang Tulus',
    tagline: 'Pribadi penuh dedikasi, andal, hangat, dan selalu siap menjaga kesejahteraan lingkungan.',
    description: 'ISFJ adalah tulang punggung komunitas. Mereka bekerja dengan teliti di balik layar untuk memastikan segala hal berjalan tertib, aman, dan penuh kepedulian manusiawi.',
    strengths: ['Sangat bertanggung jawab dan teliti', 'Hangat dan penuh perhatian', 'Setia dan bisa diandalkan', 'Menjaga tradisi dan keharmonisan'],
    growthAreas: ['Enggan menerima perubahan mendadak', 'Terlalu sungkan menolak permintaan orang lain (people-pleaser)', 'Menyimpan rasa sakit dalam diam'],
    studyTips: ['Buat jadwal belajar berulang yang konsisten', 'Gunakan buku catatan fisik yang rapi dan terorganisir', 'Kaitkan teori dengan contoh kasus di kehidupan sehari-hari'],
    interpersonalStyle: 'Lembut, perhatian pada kebutuhan kecil orang lain, dan sangat loyal.'
  },
  ISTJ: {
    title: 'Inspektur / Administrator Bertanggung Jawab',
    tagline: 'Sosok berintegritas tinggi, teratur, logis, dan menjunjung tinggi ketepatan serta janji.',
    description: 'ISTJ menghargai keteraturan dan fakta konkret. Mereka memiliki etos kerja yang kokoh, tidak menyukai kekacauan, dan selalu menyelesaikan amanah dengan sempurna.',
    strengths: ['Sangat disiplin dan teratur', 'Logis dan berpijak pada fakta riil', 'Dapat diandalkan 100%', 'Ahli menciptakan keteraturan'],
    growthAreas: ['Kaku dalam menghadapi ketidakpastian', 'Menghakimi orang yang kurang disiplin', 'Enggan bereksperimen di luar SOP yang ada'],
    studyTips: ['Susun jadwal waktu belajar harian yang paten', 'Pelajari buku teks resmi secara urut bab demi bab', 'Latihan soal dengan simulasi waktu yang akurat'],
    interpersonalStyle: 'Tenang, menepati kata-kata, berbicara berdasarkan fakta, dan stabil.'
  },
  ISFP: {
    title: 'Petualang / Seniman Autentik',
    tagline: 'Jiwa estetis yang ramah, hidup di saat ini, dan mengekspresikan jati diri melalui karya nyata.',
    description: 'ISFP adalah seniman kehidupan yang menghargai harmoni sensoris dan kebebasan berekspresi. Mereka tidak suka dihakimi dan selalu bersikap hangat tanpa kepura-puraan.',
    strengths: ['Kepekaan estetika dan artistik tinggi', 'Ramah dan tidak suka menghakimi', 'Fleksibel dan adaptif', 'Menghayati momen masa kini'],
    growthAreas: ['Mudah merasa tertekan oleh konflik tajam', 'Rentan menunda-nunda tugas yang kaku', 'Menutup diri saat merasa tidak dihargai'],
    studyTips: ['Gunakan ilustrasi, warna, dan diagram artistik dalam mencatat', 'Belajar sambil mendengarkan musik instrumen yang menenangkan', 'Praktikkan langsung konsep yang sedang dipelajari'],
    interpersonalStyle: 'Tenang, bersahabat, menghargai kebebasan masing-masing, dan penuh empati hangat.'
  },
  ISTP: {
    title: 'Ahli Praktis / Penjelajah Teknis',
    tagline: 'Pemecah masalah praktis yang tenang, jeli, dan ahli menguasai alat serta mekanisme dunia fisik.',
    description: 'ISTP suka membongkar dan memperbaiki sesuatu. Mereka memiliki logika praktis yang sangat tajam dan tetap tenang di bawah tekanan krisis.',
    strengths: ['Sangat tenang di situasi darurat', 'Logika praktis dan mekanis andal', 'Cepat beradaptasi di lapangan', 'Mandiri dan efisien'],
    growthAreas: ['Cenderung menyendiri dan sulit terbuka secara emosional', 'Cepat bosan dengan aturan teori panjang', 'Bisa terkesan acuh tak acuh'],
    studyTips: ['Fokus pada eksperimen laboratorium dan praktik nyata', 'Pelajari studi kasus aplikasi teknik', 'Hindari hafalan kaku; pahami cara kerja intinya'],
    interpersonalStyle: 'Santai, tidak banyak bicara basa-basi, namun sigap membantu secara nyata saat dibutuhkan.'
  },
  ESFJ: {
    title: 'Konsul / Pengayom Komunitas',
    tagline: 'Pribadi ramah, peduli sosial, dan selalu memastikan semua orang merasa dirangkul dan bahagia.',
    description: 'ESFJ adalah perekat kebersamaan. Mereka peka terhadap kebutuhan sosial kelompok dan dengan tulus melayani sesama dengan senyuman tulus.',
    strengths: ['Sangat ramah dan hangat', 'Keterampilan interpersonal luar biasa', 'Teliti dalam melayani kebutuhan orang banyak', 'Menghargai kesopanan dan tradisi'],
    growthAreas: ['Sangat rentan terluka jika tidak dihargai', 'Kerap menolak kenyataan pahit demi menjaga wajah baik', 'Sulit membuat keputusan yang membuat orang tidak senang'],
    studyTips: ['Bekerja sama dalam belajar kelompok', 'Gunakan kartu kilas (flashcards) bersama teman', 'Beri apresiasi atau hadiah kecil pada diri sendiri saat mencapai target belajar'],
    interpersonalStyle: 'Sangat perhatian, menyapa dengan antusias, dan menciptakan suasana kekeluargaan.'
  },
  ESTJ: {
    title: 'Eksekutif / Pengarah Terorganisir',
    tagline: 'Pemimpin operasional yang tertib, berdedikasi tinggi, dan ahli mengelola proyek terstruktur.',
    description: 'ESTJ memastikan segala sistem berjalan tepat waktu dan sesuai aturan. Mereka memiliki kejelasan arah dan tidak gentar memimpin kelompok dalam keteraturan.',
    strengths: ['Organisator andal', 'Tegas dan berprinsip kokoh', 'Jujur dan berterus terang', 'Dedikasi tinggi pada tugas'],
    growthAreas: ['Bisa terkesan kaku atau menuntut berlebihan', 'Kurang fleksibel terhadap metode non-konvensional', 'Cenderung menilai orang dari hasil lahiriah saja'],
    studyTips: ['Gunakan jadwal target harian yang terukur jelas', 'Fokus pada silabus dan kisi-kisi resmi ujian', 'Susun tugas berdasarkan skala prioritas kepentingan'],
    interpersonalStyle: 'Terbuka, berwibawa, menghargai komitmen waktu, dan menjaga ketertiban bersama.'
  },
  ESFP: {
    title: 'Penghibur / Jiwa Ceria Panggung',
    tagline: 'Pribadi spontan, berenergi tinggi, dan selalu mampu menghidupkan suasana di mana pun berada.',
    description: 'ESFP mencintai hidup dan senang berbagi kebahagiaan dengan orang lain. Mereka adalah pembelajar kinestetik yang menyerap pengalaman hidup secara nyata dan interaktif.',
    strengths: ['Penuh antusiasme dan ceria', 'Ramah dan mudah akrab dengan siapa saja', 'Praktis dan menyukai kegiatan nyata', 'Sangat menyenangkan untuk diajak bekerja sama'],
    growthAreas: ['Mudah teralihkan oleh hiburan sesaat', 'Kurang memikirkan konsekuensi jangka panjang', 'Menghindari topik bahasan yang berat atau rumit'],
    studyTips: ['Gabungkan belajar dengan gerakan atau role-play', 'Gunakan video animasi yang menarik dan berwarna', 'Belajar dengan sesi singkat 25 menit (metode Pomodoro)'],
    interpersonalStyle: 'Ceria, humoris, senang mengobrol, dan membuat orang di sekitarnya merasa gembira.'
  },
  ESTP: {
    title: 'Pengusaha / Penakluk Tantangan',
    tagline: 'Pribadi berani, gesit, penuh aksi, dan mahir membaca peluang nyata secara cepat.',
    description: 'ESTP hidup di jalur cepat. Mereka lebih suka bertindak terlebih dahulu daripada berdebat dalam rapat panjang, dan ahli menyelesaikan persoalan darurat dengan solusi langsung.',
    strengths: ['Berani mengambil risiko terukur', 'Sangat jeli melihat peluang nyata', 'Cepat bertindak dan tidak ragu', 'Percaya diri dan berkarisma'],
    growthAreas: ['Bisa bersikap impulsif tanpa perhitungan', 'Kurang sabar dengan aturan birokrasi yang panjang', 'Kadang mengabaikan dampak emosi dari tindakannya'],
    studyTips: ['Fokus pada aplikasi praktis dan studi kasus bisnis riil', 'Gunakan kompetisi belajar yang menantang', 'Beri jeda aktivitas fisik di sela-sela belajar'],
    interpersonalStyle: 'Blak-blakan, dinamis, energik, dan selalu siap mengajak orang mencoba hal baru.'
  }
};

/**
 * Pure calculation function for MBTI assessment
 * @param answers Map of question id to response (1: Sangat Tidak Setuju .. 5: Sangat Setuju)
 */
export function calculateMBTI(answers: Record<number, number>): MBTIResult {
  let eScore = 0;
  let iScore = 0;
  let sScore = 0;
  let nScore = 0;
  let tScore = 0;
  let fScore = 0;
  let jScore = 0;
  let pScore = 0;

  MBTI_QUESTIONS.forEach((q) => {
    const val = answers[q.id] ?? 3; // default neutral 3 if missing
    // 1..5 scale: 3 is neutral (0 delta). 5 is +2, 4 is +1, 2 is -1, 1 is -2.
    const delta = val - 3;

    if (q.dimension === 'EI') {
      if (q.direction === 'positive') {
        if (delta > 0) eScore += delta;
        else if (delta < 0) iScore += Math.abs(delta);
      } else {
        if (delta > 0) iScore += delta;
        else if (delta < 0) eScore += Math.abs(delta);
      }
    } else if (q.dimension === 'SN') {
      if (q.direction === 'positive') {
        if (delta > 0) sScore += delta;
        else if (delta < 0) nScore += Math.abs(delta);
      } else {
        if (delta > 0) nScore += delta;
        else if (delta < 0) sScore += Math.abs(delta);
      }
    } else if (q.dimension === 'TF') {
      if (q.direction === 'positive') {
        if (delta > 0) tScore += delta;
        else if (delta < 0) fScore += Math.abs(delta);
      } else {
        if (delta > 0) fScore += delta;
        else if (delta < 0) tScore += Math.abs(delta);
      }
    } else if (q.dimension === 'JP') {
      if (q.direction === 'positive') {
        if (delta > 0) jScore += delta;
        else if (delta < 0) pScore += Math.abs(delta);
      } else {
        if (delta > 0) pScore += delta;
        else if (delta < 0) jScore += Math.abs(delta);
      }
    }
  });

  const eiTotal = Math.max(1, eScore + iScore);
  const snTotal = Math.max(1, sScore + nScore);
  const tfTotal = Math.max(1, tScore + fScore);
  const jpTotal = Math.max(1, jScore + pScore);

  const ePct = Math.round((eScore / eiTotal) * 100);
  const iPct = 100 - ePct;
  const sPct = Math.round((sScore / snTotal) * 100);
  const nPct = 100 - sPct;
  const tPct = Math.round((tScore / tfTotal) * 100);
  const fPct = 100 - tPct;
  const jPct = Math.round((jScore / jpTotal) * 100);
  const pPct = 100 - jPct;

  const codeE = eScore >= iScore ? 'E' : 'I';
  const codeS = sScore >= nScore ? 'S' : 'N';
  const codeT = tScore >= fScore ? 'T' : 'F';
  const codeJ = jScore >= pScore ? 'J' : 'P';

  const mbtiCode = `${codeE}${codeS}${codeT}${codeJ}`;
  const profile = MBTI_PROFILES[mbtiCode] || MBTI_PROFILES['INFJ'];

  return {
    code: mbtiCode,
    title: profile.title,
    tagline: profile.tagline,
    description: profile.description,
    dimensions: {
      EI: { extraversion: ePct, introversion: iPct, dominant: codeE },
      SN: { sensing: sPct, intuition: nPct, dominant: codeS },
      TF: { thinking: tPct, feeling: fPct, dominant: codeT },
      JP: { judging: jPct, perceiving: pPct, dominant: codeJ },
    },
    strengths: profile.strengths,
    growthAreas: profile.growthAreas,
    studyAndCareerTips: profile.studyTips,
    interpersonalStyle: profile.interpersonalStyle,
  };
}
