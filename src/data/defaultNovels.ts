import { Novel } from '../types/novel';

export const PRESET_COVERS = [
  {
    name: 'Dilan & Romansa',
    url: '/src/assets/images/cover_senja_hujan_1793874774349.jpg',
    theme: 'Warm Rain & Street'
  },
  {
    name: 'Perahu Kertas & Bunga',
    url: '/src/assets/images/cover_catatan_jingga_1793874774806.jpg',
    theme: 'Warm Wildflowers'
  },
  {
    name: 'Horor Desa & Kabut',
    url: '/src/assets/images/cover_rumah_kabut_1793874775877.jpg',
    theme: 'Misty Woods'
  },
  {
    name: 'Serial Bumi & Fantasi',
    url: '/src/assets/images/book_cover_stars_1793873619982.jpg',
    theme: 'Celestial Constellation'
  },
  {
    name: 'Harry Potter & Waktu',
    url: '/src/assets/images/book_cover_midnight_1793874315002.jpg',
    theme: 'Antique Library'
  },
  {
    name: 'Komedi & Santai',
    url: '/src/assets/images/book_cover_cafe_1793874315391.jpg',
    theme: 'Ceramic Coffee'
  }
];

export const INITIAL_NOVELS: Novel[] = [
  // ================= 1. ROMANCE =================
  {
    id: 'novel-dilan-1990',
    title: 'Dilan: Dia Adalah Dilanku Tahun 1990',
    author: 'Pidi Baiq',
    genre: 'Romance',
    status: 'Sedang Dibaca',
    description: 'Kisah cinta SMA Dilan & Milea yang gemes banget.',
    coverUrl: '/src/assets/images/cover_senja_hujan_1793874774349.jpg',
    rating: 4.9,
    totalChapters: 20,
    currentChapter: 5,
    totalPages: 332,
    currentPage: 86,
    favoriteQuote: '"Jangan rindu, berat. Kamu tidak akan kuat, biar aku saja."',
    notes: 'Gaya bicara Dilan selalu unik dan bikin senyum-senyum sendiri.',
    publishedYear: 2014,
    dateAdded: '2026-03-01',
    chapters: [
      {
        id: 'dilan-1',
        number: 1,
        title: 'Bab 1: Ramalan di Angkot',
        content: `Matahari di Bandung pagi itu baru saja terbit, memancarkan hawa dingin khas kota kembang di awal tahun sembilan puluhan. Aku, Milea Adnan Hussain, siswi pindahan baru dari Jakarta, sedang berjalan menuju SMA baruku.

Tiba-tiba ada suara motor CB mendekat. Pengendaranya mengenakan jaket jeans belel berkerah cokelat. Tanpa turun dari motornya, ia melambatkan laju kendaraannya di samping trotoarku.

"Boleh aku meramal?" tanyanya tiba-tiba dengan suara yang tenang dan percaya diri.

Aku menoleh dengan heran. "Meramal apa?"

"Aku ramal, nanti sore kita akan bertemu di kantin sekolah," katanya sambil tersenyum tipis, lalu tancap gas meninggalkan aroma bensin dan rasa penasaran yang mendadak menempel di kepalaku.`
      },
      {
        id: 'dilan-2',
        number: 2,
        title: 'Bab 2: Cokelat dan Telepon Koin',
        content: `Nama anak itu Dilan. Dia adalah panglima tempur geng motor yang paling ditakuti se-Bandung, namun cara ia memperlakukanku sungguh di luar akal sehat siapa pun.

Suatu hari ia mengirimiku buku TTS yang seluruh kotaknya sudah diisi rapi dengan tinta biru. Di halaman depan ia menulis pesan:

"TTS ini sudah kuisi semua. Aku tidak mau kamu pusing karena harus mengisinya."

Bagaimana mungkin seorang gadis tidak luluh menghadapi cowok seperti itu? Dilan bukan pangeran berkuda putih, ia adalah Dilan dengan jaket jeans dan sejuta kata ajaib.`
      }
    ]
  },
  {
    id: 'novel-hujan',
    title: 'Hujan',
    author: 'Tere Liye',
    genre: 'Romance',
    status: 'Sedang Dibaca',
    description: 'Tentang Lail yang kehilangan orang yang dicintai, tapi belajar ikhlas.',
    coverUrl: '/src/assets/images/book_cover_sea_1793873618950.jpg',
    rating: 4.8,
    totalChapters: 28,
    currentChapter: 8,
    totalPages: 320,
    currentPage: 95,
    favoriteQuote: '"Bukan melupakan yang membuat kita damai, melainkan kemampuan untuk mengingatnya tanpa rasa sakit."',
    notes: 'Kisah cinta berbalut fiksi ilmiah masa depan yang menyentuh hati tentang keikhlasan.',
    publishedYear: 2016,
    dateAdded: '2026-03-02',
    chapters: [
      {
        id: 'hujan-1',
        number: 1,
        title: 'Bab 1: Ruang Memori Tahun 2042',
        content: `Lail duduk diam di kursi oval yang empuk. Ruangan berdinding kaca di depannya memperlihatkan pemandangan kota modern tahun 2042 yang basah oleh hujan asam.

Di seberang meja, seorang ilmuwan medis tersenyum ramah. "Kamu yakin ingin menghapus memori tentang dia, Lail? Alat modifikasi saraf ini akan menghapus seluruh rekaman peristiwa dan emosimu bersamanya secara permanen."

Lail meremas jemarinya. Ingatannya melayang kembali ke masa ketika ia berusia tiga belas tahun—hari ketika bumi berguncang hebat oleh letusan gunung purba, dan seorang anak laki-laki bernama Esok menggenggam tangannya di terowongan kereta bawah tanah yang runtuh.`
      }
    ]
  },
  {
    id: 'novel-perahu-kertas',
    title: 'Perahu Kertas',
    author: 'Dee Lestari',
    genre: 'Romance',
    status: 'Selesai',
    description: 'Kugy & Keenan, dua anak muda yang kejar mimpi sambil jatuh cinta.',
    coverUrl: '/src/assets/images/cover_catatan_jingga_1793874774806.jpg',
    rating: 4.8,
    totalChapters: 35,
    currentChapter: 35,
    totalPages: 444,
    currentPage: 444,
    favoriteQuote: '"Hati tidak pernah memilih; ia hanya tahu kepada siapa ia ingin berlabuh."',
    notes: 'Sangat menginspirasi bagi mereka yang mencintai dunia seni lukis dan dongeng anak.',
    publishedYear: 2009,
    dateAdded: '2026-02-15',
    dateCompleted: '2026-03-01',
    chapters: [
      {
        id: 'perahu-1',
        number: 1,
        title: 'Bab 1: Agen Rahasia Dewa Neptunus',
        content: `Kugy adalah gadis mungil bertubuh lincah yang menganggap dirinya agen rahasia Dewa Neptunus. Setiap kali ia memiliki perasaan atau rahasia yang tak sanggup diutarakan, ia akan menuliskannya di secarik kertas, melipatnya menjadi perahu kertas kecil, lalu melarungkannya ke sungai menuju laut lepas.

Sementara Keenan adalah pemuda berwajah teduh yang hanya ingin melukis di kanvas, meski ayahnya memaksanya kuliah ekonomi.

Ketika takdir mempertemukan mereka di gerbong kereta menuju Bandung, mereka sadar ada frekuensi jiwa yang sama bergetar di antara mereka berdua.`
      }
    ]
  },
  {
    id: 'novel-critical-eleven',
    title: 'Critical Eleven',
    author: 'Ika Natassa',
    genre: 'Romance',
    status: 'Selesai',
    description: 'Cinta beda kota, beda karakter, tapi harus kompromi.',
    coverUrl: '/src/assets/images/book_cover_memoir_1793873619960.jpg',
    rating: 4.7,
    totalChapters: 22,
    currentChapter: 22,
    totalPages: 344,
    currentPage: 344,
    favoriteQuote: '"Dalam penerbangan ada istilah critical eleven: sebelas menit paling menentukan. Begitu juga dalam cinta."',
    notes: 'Realistis menggambarkan naik turunnya hubungan pernikahan modern.',
    publishedYear: 2015,
    dateAdded: '2026-02-10',
    dateCompleted: '2026-02-28',
    chapters: [
      {
        id: 'critical-1',
        number: 1,
        title: 'Bab 1: Sebelas Menit di Ketinggian 30.000 Kaki',
        content: `Dalam dunia aviasi, critical eleven adalah sebelas menit paling genting: tiga menit setelah lepas landas dan delapan menit menjelang pendaratan. Delapan puluh persen kecelakaan pesawat terjadi dalam rentang waktu ini.

Bagi Ale dan Anya, sebelas menit pertama pertemuan mereka di penerbangan Jakarta-New York adalah awal mula dari segalanya. Tiga menit pertama untuk saling mencuri pandang, dan delapan menit berikutnya untuk menyadari bahwa hidup mereka tak akan pernah sama lagi.`
      }
    ]
  },

  // ================= 2. FANTASY =================
  {
    id: 'novel-bumi-serial',
    title: 'Bumi (Serial Bumi)',
    author: 'Tere Liye',
    genre: 'Fantasy',
    status: 'Sedang Dibaca',
    description: 'Raib, Seli, Ali petualangan ke dunia paralel.',
    coverUrl: '/src/assets/images/book_cover_stars_1793873619982.jpg',
    rating: 4.9,
    totalChapters: 30,
    currentChapter: 12,
    totalPages: 440,
    currentPage: 178,
    favoriteQuote: '"Dunia ini jauh lebih luas dari apa yang dapat dilihat oleh matamu."',
    notes: 'Kekuatan Raib menghilang saat menutup mata dengan kedua telapak tangan sangat ikonik!',
    publishedYear: 2014,
    dateAdded: '2026-03-01',
    chapters: [
      {
        id: 'bumi-1',
        number: 1,
        title: 'Bab 1: Gadis yang Bisa Menghilang',
        content: `Namaku Raib. Usiaku lima belas tahun. Aku adalah anak perempuan biasa yang suka memelihara kucing bernama Si Putih.

Kecuali satu rahasia: sejak kecil, setiap kali aku menutup wajahku dengan kedua telapak tangan, tubuhku akan lenyap tak terlihat oleh siapa pun.

Awalnya aku mengira itu hanya trik sulap kekanak-kanakan. Hingga suatu sore di tiang listrik belakang sekolah yang meledak, sahabatku Seli mengeluarkan percikan petir dari jemarinya, dan Ali si pemuda jenius di kelas kami menyadari bahwa kami bertiga bukan berasal dari klan yang sama.`
      }
    ]
  },
  {
    id: 'novel-harry-potter-1',
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    genre: 'Fantasy',
    status: 'Selesai',
    description: 'Wajib punya, anak penyihir masuk Hogwarts.',
    coverUrl: '/src/assets/images/book_cover_midnight_1793874315002.jpg',
    rating: 5.0,
    totalChapters: 17,
    currentChapter: 17,
    totalPages: 309,
    currentPage: 309,
    favoriteQuote: '"It does not do to dwell on dreams and forget to live."',
    notes: 'Mahakarya fantasi sepanjang masa. Nostalgia masa kecil yang tak pernah lekang oleh waktu.',
    publishedYear: 1997,
    dateAdded: '2026-01-15',
    dateCompleted: '2026-02-05',
    chapters: [
      {
        id: 'hp-1',
        number: 1,
        title: 'Bab 1: Anak Laki-Laki yang Bertahan Hidup',
        content: `Mr. and Mrs. Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal, thank you very much.

Mereka sama sekali tidak menyangka bahwa pada suatu malam berkabut di bulan November, seorang pria tua berjubah ungu bernama Albus Dumbledore dan seekor kucing betina yang dapat berubah wujud akan meletakkan seorang bayi terbungkus selimut di depan pintu rumah mereka.

Di dahi bayi kecil itu, terukir sebuah luka berbentuk sambaran petir yang kelak akan mengguncang seluruh dunia sihir.`
      }
    ]
  },
  {
    id: 'novel-hunger-games',
    title: 'The Hunger Games',
    author: 'Suzanne Collins',
    genre: 'Fantasy',
    status: 'Sedang Dibaca',
    description: 'Katniss berjuang hidup di arena.',
    coverUrl: '/src/assets/images/book_cover_earth_1793873618872.jpg',
    rating: 4.8,
    totalChapters: 27,
    currentChapter: 15,
    totalPages: 374,
    currentPage: 210,
    favoriteQuote: '"May the odds be ever in your favor."',
    notes: 'Tegangan tinggi di setiap bab arena survival Panem.',
    publishedYear: 2008,
    dateAdded: '2026-02-18',
    chapters: [
      {
        id: 'hg-1',
        number: 1,
        title: 'Bab 1: Panen di Distrik 12',
        content: `Ketika aku terbangun, sisi lain tempat tidur terasa dingin. Tanganku terulur mencari kehangatan Prim, adik perempuanku, tetapi hanya menemukan sprei kasar kasur kami.

Hari ini adalah hari Pemungutan Suara untuk Hunger Games ke-74. Di alun-alun Distrik 12, ribuan pasang mata menahan napas saat Effie Trinket merogoh toples kaca raksasa berisi nama-nama anak Distrik 12.

Dan nama pertama yang dibacakan adalah: "Primrose Everdeen."

Tanpa berpikir sedetik pun, nafasku tercekat dan suaraku berteriak menembus keheningan lapangan: "Aku mengajukan diri! Aku akan menggantikannya!"`
      }
    ]
  },
  {
    id: 'novel-eragon',
    title: 'Eragon',
    author: 'Christopher Paolini',
    genre: 'Fantasy',
    status: 'Ingin Dibaca',
    description: 'Anak desa nemu telur naga.',
    coverUrl: '/src/assets/images/cover_daun_teh_1793874776281.jpg',
    rating: 4.7,
    totalChapters: 59,
    currentChapter: 0,
    totalPages: 509,
    currentPage: 0,
    favoriteQuote: '"Naga tidak memilih penunggangnya berdasarkan kekuatan otot, melainkan ketulusan hati."',
    notes: 'Kisah klasik penunggang naga di Alagaësia bersama naga biru Saphira.',
    publishedYear: 2002,
    dateAdded: '2026-03-03',
    chapters: [
      {
        id: 'eragon-1',
        number: 1,
        title: 'Bab 1: Batu Safir di Pegunungan Spine',
        content: `Eragon berlutut di semak-semak beku Pegunungan Spine, mengarahkan busurnya ke seekor rusa jantan. Tiba-tiba sebuah kilatan cahaya biru membutakan pandangannya.

Di kawah kecil tempat tanah menghitam terpanggang, terletak sebongkah batu oval berwarna biru safir pekat dengan urat-urat putih keperakan.

Batu itu tidak dingin seperti batu gunung lainnya; ia memancarkan kehangatan lembut. Dan beberapa malam kemudian di kamarnya, permukaan batu itu mulai retak dari dalam, mengeluarkan seekor bayi naga bermata biru cemerlang.`
      }
    ]
  },

  // ================= 3. HOROR / THRILLER =================
  {
    id: 'novel-danur',
    title: 'Danur',
    author: 'Risa Saraswati',
    genre: 'Horor / Thriller',
    status: 'Sedang Dibaca',
    description: 'Risa yang bisa lihat hantu sejak kecil.',
    coverUrl: '/src/assets/images/cover_rumah_kabut_1793874775877.jpg',
    rating: 4.6,
    totalChapters: 18,
    currentChapter: 6,
    totalPages: 240,
    currentPage: 78,
    favoriteQuote: '"Mereka yang tak terlihat bukan untuk ditakuti, melainkan didengarkan ceritanya yang terputus."',
    notes: 'Persahabatan Risa dengan Peter, William, Hendrick, Hans, dan Janshen.',
    publishedYear: 2011,
    dateAdded: '2026-03-01',
    chapters: [
      {
        id: 'danur-1',
        number: 1,
        title: 'Bab 1: Sahabat-Sahabat Kecilku',
        content: `Saat ulang tahunku yang kedelapan, aku meniup lilin di atas kue tart dan berdoa dengan sungguh-sungguh agar aku diberi teman bermain. Aku adalah anak tunggal yang sering ditinggal orang tua bekerja.

Keesokan sorenya di halaman rumah peninggalan kolonial nenekku di Bandung, lima anak laki-laki Belanda berpakaian seragam sekolah dasar muncul mengajakku main petak umpet.

Mereka ceria, bertubuh pucat, dan selalu tertawa riang. Butuh waktu berbulan-bulan sampai ibuku menjerit histeris ketika melihatku sedang tertawa dan mengobrol sendirian di depan lemari pakaian kosong.`
      }
    ]
  },
  {
    id: 'novel-kkn-desa-penari',
    title: 'KKN di Desa Penari',
    author: 'SimpleMan',
    genre: 'Horor / Thriller',
    status: 'Sedang Dibaca',
    description: 'KKN yang berubah jadi teror.',
    coverUrl: '/src/assets/images/cover_rumah_kabut_1793874775877.jpg',
    rating: 4.7,
    totalChapters: 20,
    currentChapter: 9,
    totalPages: 256,
    currentPage: 114,
    favoriteQuote: '"Ada tempat-tempat di tanah Jawa di mana manusia hanyalah tamu yang harus tunduk pada aturan gaib."',
    notes: 'Fenomena viral paling menghebohkan. Suasana desa terpencil di hutan timur Jawa sangat mencekam.',
    publishedYear: 2019,
    dateAdded: '2026-03-02',
    chapters: [
      {
        id: 'kkn-1',
        number: 1,
        title: 'Bab 1: Menembus Hutan Terlarang',
        content: `Mobil elf yang membawa enam mahasiswa—Nur, Widya, Ayu, Bima, Anton, dan Wahyu—berhenti di ujung jalan aspal. Di depan mereka hanya ada jalan setapak tanah liat yang membelah lebatnya hutan belantara di ujung timur Jawa.

Pak Prabu, kepala desa berwajah tegas, menyambut mereka dengan selendang merah di pundak.

"Ingat pesan saya," Pak Prabu menatap tajam ke dalam mata mereka satu per satu. "Jangan pernah melintasi batas gapura bertumbal di ujung timur desa. Di sana adalah tempat sinden dan penari keramat yang bukan bangsa manusia."`
      }
    ]
  },
  {
    id: 'novel-gone-girl',
    title: 'Gone Girl',
    author: 'Gillian Flynn',
    genre: 'Horor / Thriller',
    status: 'Selesai',
    description: 'Istri hilang, suami jadi tersangka.',
    coverUrl: '/src/assets/images/book_cover_sea_1793873618950.jpg',
    rating: 4.8,
    totalChapters: 30,
    currentChapter: 30,
    totalPages: 432,
    currentPage: 432,
    favoriteQuote: '"There\'s a difference between really loving someone and loving the idea of her."',
    notes: 'Plot twist legendaris pertengahan buku yang mengubah seluruh sudut pandang pembaca.',
    publishedYear: 2012,
    dateAdded: '2026-02-12',
    dateCompleted: '2026-02-27',
    chapters: [
      {
        id: 'gone-1',
        number: 1,
        title: 'Bab 1: Pagi di Hari Ulang Tahun Pernikahan',
        content: `Pada pagi hari peringatan lima tahun pernikahan kami, Amy menghilang.

Pintu depan rumah kami di tepi Sungai Mississippi terbuka lebar. Meja kopi di ruang tamu hancur berkeping-keping di atas karpet Persia, dan setrika di dapur masih menyala berasap.

Semua orang di kota kecil ini mengira aku adalah suami teladan. Tetapi ketika polisi menemukan jejak darah yang telah dibersihkan secara kimia di lantai dapur, sorotan kamera media langsung tertuju ke wajahku sebagai tersangka pembunuh nomor satu.`
      }
    ]
  },
  {
    id: 'novel-silent-patient',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    genre: 'Horor / Thriller',
    status: 'Sedang Dibaca',
    description: 'Pasien yang diam total setelah bunuh suaminya.',
    coverUrl: '/src/assets/images/book_cover_midnight_1793874315002.jpg',
    rating: 4.9,
    totalChapters: 25,
    currentChapter: 11,
    totalPages: 336,
    currentPage: 150,
    favoriteQuote: '"Kata-kata seringkali hanya topeng, tetapi keheningan selalu menyimpan kebenaran yang mengerikan."',
    notes: 'Psikologis thriller yang sangat cerdas. Karakter Alicia Berenson sangat misterius.',
    publishedYear: 2019,
    dateAdded: '2026-03-03',
    chapters: [
      {
        id: 'silent-1',
        number: 1,
        title: 'Bab 1: Keheningan Alicia Berenson',
        content: `Alicia Berenson berusia tiga puluh tiga tahun ketika ia menembak suaminya, Gabriel, sebanyak lima kali tepat di wajah pada suatu malam musim panas di London.

Setelah malam itu, Alicia tidak pernah mengucapkan sepatah kata pun lagi. Sama sekali tidak ada suara yang keluar dari bibirnya selama enam tahun di rumah sakit jiwa The Grove.

Satu-satunya petunjuk yang ia tinggalkan adalah sebuah lukisan potret diri yang ia selesaikan beberapa hari setelah pembunuhan, dengan tulisan huruf Yunani kuno di sudut kanvas: ALCESTIS.`
      }
    ]
  },

  // ================= 4. DRAMA / KEHIDUPAN =================
  {
    id: 'novel-laskar-pelangi',
    title: 'Laskar Pelangi',
    author: 'Andrea Hirata',
    genre: 'Drama / Kehidupan',
    status: 'Selesai',
    description: '10 anak SD di Belitung kejar mimpi dengan keterbatasan.',
    coverUrl: '/src/assets/images/cover_senja_hujan_1793874774349.jpg',
    rating: 5.0,
    totalChapters: 34,
    currentChapter: 34,
    totalPages: 529,
    currentPage: 529,
    favoriteQuote: '"Hiduplah untuk memberi sebanyak-banyaknya, bukan untuk menerima sebanyak-banyaknya."',
    notes: 'Kisah Lintang mengayuh sepeda puluhan kilometer demi sekolah sangat menyentuh hati nurani.',
    publishedYear: 2005,
    dateAdded: '2026-01-10',
    dateCompleted: '2026-01-25',
    chapters: [
      {
        id: 'laskar-1',
        number: 1,
        title: 'Bab 1: Sepuluh Murid Baru',
        content: `Pagi itu, sekolah Muhammadiyah Gantong yang reyot terancam ditutup oleh pengawas dinas jika murid barunya tidak mencapai sepuluh orang. Pak Harfan dan Bu Muslimah menunggu dengan cemas di teras sekolah berdinding papan miring.

Sembilan anak telah duduk gemetar di bangku reyot. Angka sembilan adalah vonis mati bagi sekolah kami.

Lalu di kejauhan, Harun, seorang anak laki-laki berusia lima belas tahun dengan keterbelakangan mental, berlari kecil digandeng ibunya. Pak Harfan tersenyum lebar dengan air mata menetes di janggutnya: "Genap sepuluh! Sekolah kita tidak jadi ditutup!"`
      }
    ]
  },
  {
    id: 'novel-negeri-5-menara',
    title: 'Negeri 5 Menara',
    author: 'Ahmad Fuadi',
    genre: 'Drama / Kehidupan',
    status: 'Sedang Dibaca',
    description: '6 santri di Gontor dengan mimpi "Man Jadda Wajada".',
    coverUrl: '/src/assets/images/book_cover_stars_1793873619982.jpg',
    rating: 4.8,
    totalChapters: 22,
    currentChapter: 14,
    totalPages: 423,
    currentPage: 270,
    favoriteQuote: '"Man Jadda Wajada — Siapa yang bersungguh-sungguh, dia akan berhasil."',
    notes: 'Persahabatan enam anak di bawah bayang-bayang menara masjid Madani.',
    publishedYear: 2009,
    dateAdded: '2026-02-15',
    chapters: [
      {
        id: 'n5m-1',
        number: 1,
        title: 'Bab 1: Menebas Kayu dengan Parang Tumpul',
        content: `Ustad Salman melangkah ke depan kelas dengan sebatang kayu jati tua dan sebuah parang tumpul. Di hadapan kami para santri baru Pondok Madani, beliau mulai membacok kayu keras itu berulang-ulang tanpa henti.

Tebasan ke tiga puluh... tebasan ke lima puluh... kayu itu masih utuh.

Hingga pada tebasan ke seratus, terdengar bunyi patahan keras: KRAAAK! Kayu itu terbelah dua.

Ustad Salman berteriak lantang: "Man Jadda Wajada! Siapa yang bersungguh-sungguh, ia akan berhasil! Besi tumpul pun bisa membelah kayu keras jika diarahkan ke titik yang sama tanpa kenal lelah!"`
      }
    ]
  },
  {
    id: 'novel-ayah',
    title: 'Ayah',
    author: 'Andrea Hirata',
    genre: 'Drama / Kehidupan',
    status: 'Ingin Dibaca',
    description: 'Kisah ayah yang berjuang untuk anaknya.',
    coverUrl: '/src/assets/images/cover_daun_teh_1793874776281.jpg',
    rating: 4.8,
    totalChapters: 28,
    currentChapter: 0,
    totalPages: 412,
    currentPage: 0,
    favoriteQuote: '"Kasih seorang ayah seringkali tidak bersuara, namun ia menopang seluruh langit hidup anaknya."',
    notes: 'Kisah Sabari yang luar biasa setia dan penuh pengorbanan demi sang anak, Zorro.',
    publishedYear: 2015,
    dateAdded: '2026-03-03',
    chapters: [
      {
        id: 'ayah-1',
        number: 1,
        title: 'Bab 1: Cinta Sabari yang Melampaui Akal',
        content: `Sabari bukanlah pria tampan idaman para gadis Belitong. Wajahnya kurus, giginya sedikit jarang, dan pekerjaannya hanyalah juru tulis di pabrik batu bata.

Tetapi Sabari memiliki satu hal yang jarang dimiliki manusia modern: ketulusan cinta yang tidak mengenal syarat. Ketika Marlena melahirkan seorang bayi laki-laki bernama Zorro, Sabari merengkuh bayi itu ke dadanya seolah ia baru saja menerima hadiah terindah dari surga.`
      }
    ]
  },
  {
    id: 'novel-ronggeng-dukuh-paruk',
    title: 'Ronggeng Dukuh Paruk',
    author: 'Ahmad Tohari',
    genre: 'Drama / Kehidupan',
    status: 'Selesai',
    description: 'Klasik, tentang Srintil di desa kecil.',
    coverUrl: '/src/assets/images/book_cover_earth_1793873618872.jpg',
    rating: 4.9,
    totalChapters: 25,
    currentChapter: 25,
    totalPages: 408,
    currentPage: 408,
    favoriteQuote: '"Dukuh Paruk hidup dalam irama calung dan kemenyan yang melingkupi malam."',
    notes: 'Mahakarya sastra Indonesia tentang tradisi ronggeng dan gejolak sejarah bangsa.',
    publishedYear: 1982,
    dateAdded: '2026-01-20',
    dateCompleted: '2026-02-14',
    chapters: [
      {
        id: 'ronggeng-1',
        number: 1,
        title: 'Bab 1: Calung di Bawah Pohon Randu',
        content: `Dukuh Paruk adalah sebuah pedukuhan kecil yang terpencil di tengah ladang tandus. Di desa ini, seorang ronggeng adalah lambang kesuburan dan kebanggaan seluruh warga.

Ketika Srintil yang baru berusia sebelas tahun meliuk-liukkan tubuhnya di pelataran rumah dengan selendang merah, tetua desa langsung menyadari bahwa titisan ronggeng legendaris Ki Secamenggala telah bangkit kembali dalam diri gadis itu.`
      }
    ]
  },

  // ================= 5. KOMEDI / RINGAN =================
  {
    id: 'novel-koala-kumal',
    title: 'Koala Kumal',
    author: 'Raditya Dika',
    genre: 'Komedi / Ringan',
    status: 'Sedang Dibaca',
    description: 'Cerita galau mantan yang kocak.',
    coverUrl: '/src/assets/images/book_cover_cafe_1793874315391.jpg',
    rating: 4.6,
    totalChapters: 15,
    currentChapter: 4,
    totalPages: 250,
    currentPage: 65,
    favoriteQuote: '"Patah hati terberat adalah ketika kamu menyadari rumah yang biasa kamu tuju kini telah dihuni orang lain."',
    notes: 'Kocak sekaligus menyentuh bagi siapa saja yang pernah mengalami kegagalan cinta.',
    publishedYear: 2015,
    dateAdded: '2026-03-01',
    chapters: [
      {
        id: 'koala-1',
        number: 1,
        title: 'Bab 1: Patah Hati Terberat',
        content: `Koala adalah hewan yang sangat terikat pada pohon tempat tinggalnya. Ketika hutan terbakar dan pohon itu ditebang, koala yang kembali akan merasa asing dan kebingungan. Bulunya menjadi kumal karena kehilangan tempat bernaung.

Begitu pula rasanya saat rencana pernikahan yang sudah disusun matang-matang tiba-tiba batal di tengah jalan karena sang calon pengantin memilih orang lain. Kamu kembali ke dunia lajang dengan perasaan seperti koala kumal yang kehilangan ranting tempatnya tidur.`
      }
    ]
  },
  {
    id: 'novel-cinta-brontosaurus',
    title: 'Cinta Brontosaurus',
    author: 'Raditya Dika',
    genre: 'Komedi / Ringan',
    status: 'Selesai',
    description: 'Cowok yang selalu gagal move on.',
    coverUrl: '/src/assets/images/cover_catatan_jingga_1793874774806.jpg',
    rating: 4.5,
    totalChapters: 14,
    currentChapter: 14,
    totalPages: 160,
    currentPage: 160,
    favoriteQuote: '"Cinta itu seperti dinosaurus brontosaurus: katanya ada masa kadaluarsanya dan bisa punah."',
    notes: 'Buku komedi klasik Raditya Dika yang bikin ngakak terpingkal-pingkal.',
    publishedYear: 2006,
    dateAdded: '2026-01-28',
    dateCompleted: '2026-02-10',
    chapters: [
      {
        id: 'bronto-1',
        number: 1,
        title: 'Bab 1: Teori Kepunahan Cinta',
        content: `Dika selalu berteori bahwa cinta itu punya masa kedaluwarsa, sama seperti dinosaurus Brontosaurus yang akhirnya punah jutaan tahun lalu.

Setiap kali ia mulai menjalin hubungan dengan seorang cewek, selalu saja ada kejadian absurd yang membuatnya gagal move on—mulai dari kencan di warung pecel lele yang kebanjiran hingga pertemuan canggung dengan calon mertua yang hobi bermain sulap koin.`
      }
    ]
  },
  {
    id: 'novel-rosie-project',
    title: 'The Rosie Project',
    author: 'Graeme Simsion',
    genre: 'Komedi / Ringan',
    status: 'Ingin Dibaca',
    description: 'Profesor kaku nyari istri pake kuesioner.',
    coverUrl: '/src/assets/images/book_cover_cafe_1793874315391.jpg',
    rating: 4.8,
    totalChapters: 20,
    currentChapter: 0,
    totalPages: 304,
    currentPage: 0,
    favoriteQuote: '"Cinta tidak bisa dihitung dengan algoritma, namun ia selalu menemukan jawabannya sendiri."',
    notes: 'Komedian romantis jenius tentang Profesor Don Tillman dan Rosie Jarman.',
    publishedYear: 2013,
    dateAdded: '2026-03-04',
    chapters: [
      {
        id: 'rosie-1',
        number: 1,
        title: 'Bab 1: Kuesioner Pasangan Hidup Sempurna',
        content: `Don Tillman adalah seorang profesor genetika brilian di Universitas Melbourne yang hidupnya diatur secara presisi hingga hitungan detik. Menu makan malamnya sama setiap minggu: lobster pada hari Selasa dan kari ayam pada hari Kamis.

Karena lelah dengan kencan buta yang tidak efisien, Don menciptakan The Wife Project: sebuah kuesioner enam belas halaman untuk menyaring calon istri yang tidak merokok, tidak terlambat, dan memiliki BMI ideal.

Lalu datanglah Rosie Jarman—seorang bartender perokok, selalu terlambat, dan berantakan—yang justru membalikkan seluruh tatanan logika hidupnya.`
      }
    ]
  }
];

export const GENRE_LIST = [
  'Semua',
  'Romance',
  'Fantasy',
  'Horor / Thriller',
  'Drama / Kehidupan',
  'Komedi / Ringan'
];

export const STATUS_LIST = [
  'Semua',
  'Sedang Dibaca',
  'Selesai',
  'Ingin Dibaca',
  'Ditunda'
] as const;
