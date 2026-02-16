/**
 * Surah Mawdu'at (Thematic Sections) — Scholarly divisions of ALL 114 surahs
 *
 * Based on classical tafsir sources (Ibn Kathir, At-Tabari, As-Sa'di, Maududi's Tafhim)
 * and Tanzil.net ruku boundaries for structural backbone.
 *
 * Coverage strategy:
 *   ≤6 ayahs  → 1 section (entire surah theme)
 *   7-30 ayahs → 1-2 sections
 *   31-59 ayahs → 2-3 sections
 *   60+ ayahs  → 3+ sections (detailed breakdowns)
 */

export interface SurahSection {
  name: string;
  nameAr: string;
  startAyah: number;
  endAyah: number;
  color: string; // Tailwind-compatible color for visual encoding
}

export const SURAH_MAWDUAT: Record<number, SurahSection[]> = {
  // Al-Fatiha (7 ayahs)
  1: [
    {
      name: "The Opening Prayer",
      nameAr: "فاتحة الكتاب",
      startAyah: 1,
      endAyah: 7,
      color: "#3b82f6",
    },
  ],

  // Al-Baqarah (286 ayahs)
  2: [
    {
      name: "Opening & Guidance",
      nameAr: "هدى المتقين",
      startAyah: 1,
      endAyah: 20,
      color: "#3b82f6",
    },
    {
      name: "Creation of Adam",
      nameAr: "خلق آدم",
      startAyah: 21,
      endAyah: 39,
      color: "#8b5cf6",
    },
    {
      name: "Children of Israel",
      nameAr: "بنو إسرائيل",
      startAyah: 40,
      endAyah: 103,
      color: "#f59e0b",
    },
    {
      name: "Ibrahim's Legacy",
      nameAr: "ملة إبراهيم",
      startAyah: 104,
      endAyah: 141,
      color: "#10b981",
    },
    {
      name: "Change of Qiblah",
      nameAr: "تحويل القبلة",
      startAyah: 142,
      endAyah: 176,
      color: "#ef4444",
    },
    {
      name: "Laws & Rulings",
      nameAr: "الأحكام الشرعية",
      startAyah: 177,
      endAyah: 242,
      color: "#06b6d4",
    },
    {
      name: "Stories of Courage",
      nameAr: "قصص الشجاعة",
      startAyah: 243,
      endAyah: 253,
      color: "#d946ef",
    },
    {
      name: "Ayat al-Kursi & Finance",
      nameAr: "آية الكرسي والمال",
      startAyah: 254,
      endAyah: 281,
      color: "#f97316",
    },
    {
      name: "Closing Du'a",
      nameAr: "الخاتمة والدعاء",
      startAyah: 282,
      endAyah: 286,
      color: "#14b8a6",
    },
  ],

  // Ali 'Imran (200 ayahs)
  3: [
    {
      name: "Truth of Revelation",
      nameAr: "صدق الوحي",
      startAyah: 1,
      endAyah: 32,
      color: "#3b82f6",
    },
    {
      name: "Story of Maryam",
      nameAr: "قصة مريم",
      startAyah: 33,
      endAyah: 63,
      color: "#8b5cf6",
    },
    {
      name: "Dialogue with Ahl al-Kitab",
      nameAr: "حوار أهل الكتاب",
      startAyah: 64,
      endAyah: 101,
      color: "#f59e0b",
    },
    {
      name: "Unity of the Ummah",
      nameAr: "وحدة الأمة",
      startAyah: 102,
      endAyah: 120,
      color: "#10b981",
    },
    {
      name: "Battle of Uhud",
      nameAr: "غزوة أحد",
      startAyah: 121,
      endAyah: 175,
      color: "#ef4444",
    },
    {
      name: "Traits of the Faithful",
      nameAr: "صفات المؤمنين",
      startAyah: 176,
      endAyah: 200,
      color: "#06b6d4",
    },
  ],

  // An-Nisa (176 ayahs)
  4: [
    {
      name: "Family Rights",
      nameAr: "حقوق الأسرة",
      startAyah: 1,
      endAyah: 35,
      color: "#3b82f6",
    },
    {
      name: "Justice & Worship",
      nameAr: "العدل والعبادة",
      startAyah: 36,
      endAyah: 57,
      color: "#8b5cf6",
    },
    {
      name: "Obedience & Authority",
      nameAr: "الطاعة وأولي الأمر",
      startAyah: 58,
      endAyah: 91,
      color: "#f59e0b",
    },
    {
      name: "Rulings on Conflict",
      nameAr: "أحكام القتال",
      startAyah: 92,
      endAyah: 126,
      color: "#ef4444",
    },
    {
      name: "Women's Rights",
      nameAr: "حقوق النساء",
      startAyah: 127,
      endAyah: 152,
      color: "#10b981",
    },
    {
      name: "People of the Book",
      nameAr: "أهل الكتاب",
      startAyah: 153,
      endAyah: 176,
      color: "#06b6d4",
    },
  ],

  // Al-Ma'idah (120 ayahs)
  5: [
    {
      name: "Covenants & Lawful Food",
      nameAr: "العقود والحلال",
      startAyah: 1,
      endAyah: 26,
      color: "#3b82f6",
    },
    {
      name: "Cain & Abel",
      nameAr: "قصة ابني آدم",
      startAyah: 27,
      endAyah: 43,
      color: "#8b5cf6",
    },
    {
      name: "Torah & Gospel Confirmed",
      nameAr: "تصديق التوراة والإنجيل",
      startAyah: 44,
      endAyah: 68,
      color: "#f59e0b",
    },
    {
      name: "Warning to Disbelievers",
      nameAr: "تحذير الكافرين",
      startAyah: 69,
      endAyah: 86,
      color: "#ef4444",
    },
    {
      name: "Oaths & Expiation",
      nameAr: "الأيمان والكفارات",
      startAyah: 87,
      endAyah: 108,
      color: "#10b981",
    },
    {
      name: "'Isa's Table & Closing",
      nameAr: "المائدة والخاتمة",
      startAyah: 109,
      endAyah: 120,
      color: "#06b6d4",
    },
  ],

  // Al-An'am (165 ayahs)
  6: [
    {
      name: "Oneness of Allah",
      nameAr: "توحيد الله",
      startAyah: 1,
      endAyah: 45,
      color: "#3b82f6",
    },
    {
      name: "Prophetic Mission",
      nameAr: "الرسالة النبوية",
      startAyah: 46,
      endAyah: 73,
      color: "#8b5cf6",
    },
    {
      name: "Ibrahim's Search",
      nameAr: "بحث إبراهيم",
      startAyah: 74,
      endAyah: 110,
      color: "#f59e0b",
    },
    {
      name: "Halal & Haram",
      nameAr: "الحلال والحرام",
      startAyah: 111,
      endAyah: 144,
      color: "#10b981",
    },
    {
      name: "The Straight Path",
      nameAr: "الصراط المستقيم",
      startAyah: 145,
      endAyah: 165,
      color: "#ef4444",
    },
  ],

  // Al-A'raf (206 ayahs)
  7: [
    {
      name: "Adam & Iblis",
      nameAr: "آدم وإبليس",
      startAyah: 1,
      endAyah: 58,
      color: "#3b82f6",
    },
    {
      name: "Nuh's People",
      nameAr: "قوم نوح",
      startAyah: 59,
      endAyah: 72,
      color: "#8b5cf6",
    },
    {
      name: "Hud & Salih",
      nameAr: "هود وصالح",
      startAyah: 73,
      endAyah: 93,
      color: "#f59e0b",
    },
    {
      name: "Lut & Shu'ayb",
      nameAr: "لوط وشعيب",
      startAyah: 94,
      endAyah: 102,
      color: "#ef4444",
    },
    {
      name: "Musa & Fir'awn",
      nameAr: "موسى وفرعون",
      startAyah: 103,
      endAyah: 171,
      color: "#10b981",
    },
    {
      name: "Covenant & Warning",
      nameAr: "الميثاق والتذكير",
      startAyah: 172,
      endAyah: 206,
      color: "#06b6d4",
    },
  ],

  // Al-Anfal (75 ayahs)
  8: [
    {
      name: "Spoils of War",
      nameAr: "الأنفال",
      startAyah: 1,
      endAyah: 19,
      color: "#3b82f6",
    },
    {
      name: "Battle of Badr",
      nameAr: "غزوة بدر",
      startAyah: 20,
      endAyah: 44,
      color: "#ef4444",
    },
    {
      name: "War Ethics",
      nameAr: "أخلاق الحرب",
      startAyah: 45,
      endAyah: 75,
      color: "#10b981",
    },
  ],

  // At-Tawbah (129 ayahs)
  9: [
    {
      name: "Disavowal of Treaties",
      nameAr: "براءة من المشركين",
      startAyah: 1,
      endAyah: 28,
      color: "#ef4444",
    },
    {
      name: "Fighting & Jizyah",
      nameAr: "القتال والجزية",
      startAyah: 29,
      endAyah: 59,
      color: "#f59e0b",
    },
    {
      name: "Hypocrites Exposed",
      nameAr: "فضح المنافقين",
      startAyah: 60,
      endAyah: 99,
      color: "#8b5cf6",
    },
    {
      name: "Tabuk Expedition",
      nameAr: "غزوة تبوك",
      startAyah: 100,
      endAyah: 129,
      color: "#3b82f6",
    },
  ],

  // Yunus (109 ayahs)
  10: [
    {
      name: "The Quran's Truth",
      nameAr: "حقيقة القرآن",
      startAyah: 1,
      endAyah: 36,
      color: "#3b82f6",
    },
    {
      name: "Deniers & Their Fate",
      nameAr: "المكذبون ومصيرهم",
      startAyah: 37,
      endAyah: 70,
      color: "#ef4444",
    },
    {
      name: "Nuh & Musa",
      nameAr: "نوح وموسى",
      startAyah: 71,
      endAyah: 103,
      color: "#8b5cf6",
    },
    {
      name: "Follow the Revelation",
      nameAr: "اتبع الوحي",
      startAyah: 104,
      endAyah: 109,
      color: "#10b981",
    },
  ],

  // Hud (123 ayahs)
  11: [
    {
      name: "Quranic Guidance",
      nameAr: "هداية القرآن",
      startAyah: 1,
      endAyah: 24,
      color: "#3b82f6",
    },
    {
      name: "Nuh's Struggle",
      nameAr: "كفاح نوح",
      startAyah: 25,
      endAyah: 49,
      color: "#8b5cf6",
    },
    {
      name: "Hud to Shu'ayb",
      nameAr: "هود إلى شعيب",
      startAyah: 50,
      endAyah: 95,
      color: "#f59e0b",
    },
    {
      name: "Musa & Fir'awn",
      nameAr: "موسى وفرعون",
      startAyah: 96,
      endAyah: 109,
      color: "#ef4444",
    },
    {
      name: "Steadfastness",
      nameAr: "الاستقامة",
      startAyah: 110,
      endAyah: 123,
      color: "#10b981",
    },
  ],

  // Yusuf (111 ayahs)
  12: [
    {
      name: "The Dream",
      nameAr: "الرؤيا",
      startAyah: 1,
      endAyah: 18,
      color: "#f59e0b",
    },
    {
      name: "In the Well & Palace",
      nameAr: "في البئر والقصر",
      startAyah: 19,
      endAyah: 42,
      color: "#8b5cf6",
    },
    {
      name: "The King's Dream",
      nameAr: "رؤيا الملك",
      startAyah: 43,
      endAyah: 57,
      color: "#3b82f6",
    },
    {
      name: "Brothers Reunited",
      nameAr: "لقاء الإخوة",
      startAyah: 58,
      endAyah: 93,
      color: "#10b981",
    },
    {
      name: "Family Reunion & Lesson",
      nameAr: "جمع الشمل والعبرة",
      startAyah: 94,
      endAyah: 111,
      color: "#06b6d4",
    },
  ],

  // Ar-Ra'd (43 ayahs)
  13: [
    {
      name: "Signs of Allah's Power",
      nameAr: "دلائل قدرة الله",
      startAyah: 1,
      endAyah: 18,
      color: "#3b82f6",
    },
    {
      name: "Truth vs. Falsehood",
      nameAr: "الحق والباطل",
      startAyah: 19,
      endAyah: 43,
      color: "#8b5cf6",
    },
  ],

  // Ibrahim (52 ayahs)
  14: [
    {
      name: "Guidance from Darkness to Light",
      nameAr: "من الظلمات إلى النور",
      startAyah: 1,
      endAyah: 27,
      color: "#3b82f6",
    },
    {
      name: "Ibrahim's Du'a & Warning",
      nameAr: "دعاء إبراهيم والإنذار",
      startAyah: 28,
      endAyah: 52,
      color: "#8b5cf6",
    },
  ],

  // Al-Hijr (99 ayahs)
  15: [
    {
      name: "Quran's Preservation",
      nameAr: "حفظ القرآن",
      startAyah: 1,
      endAyah: 25,
      color: "#3b82f6",
    },
    {
      name: "Creation & Iblis",
      nameAr: "الخلق وإبليس",
      startAyah: 26,
      endAyah: 50,
      color: "#8b5cf6",
    },
    {
      name: "Ibrahim's Guests & Lut",
      nameAr: "ضيوف إبراهيم ولوط",
      startAyah: 51,
      endAyah: 99,
      color: "#f59e0b",
    },
  ],

  // An-Nahl (128 ayahs)
  16: [
    {
      name: "Signs in Creation",
      nameAr: "آيات في الخلق",
      startAyah: 1,
      endAyah: 34,
      color: "#3b82f6",
    },
    {
      name: "Messengers & Denial",
      nameAr: "الرسل والتكذيب",
      startAyah: 35,
      endAyah: 65,
      color: "#8b5cf6",
    },
    {
      name: "Allah's Blessings",
      nameAr: "نعم الله",
      startAyah: 66,
      endAyah: 89,
      color: "#10b981",
    },
    {
      name: "Justice & Virtue",
      nameAr: "العدل والإحسان",
      startAyah: 90,
      endAyah: 128,
      color: "#f59e0b",
    },
  ],

  // Al-Isra (111 ayahs)
  17: [
    {
      name: "Night Journey",
      nameAr: "الإسراء",
      startAyah: 1,
      endAyah: 22,
      color: "#8b5cf6",
    },
    {
      name: "Ethics & Commandments",
      nameAr: "الأخلاق والوصايا",
      startAyah: 23,
      endAyah: 52,
      color: "#3b82f6",
    },
    {
      name: "Adam & Iblis",
      nameAr: "آدم وإبليس",
      startAyah: 53,
      endAyah: 72,
      color: "#ef4444",
    },
    {
      name: "Steadfastness in Da'wah",
      nameAr: "الثبات في الدعوة",
      startAyah: 73,
      endAyah: 111,
      color: "#10b981",
    },
  ],

  // Al-Kahf (110 ayahs)
  18: [
    {
      name: "People of the Cave",
      nameAr: "أصحاب الكهف",
      startAyah: 1,
      endAyah: 31,
      color: "#3b82f6",
    },
    {
      name: "Two Gardens Parable",
      nameAr: "صاحب الجنتين",
      startAyah: 32,
      endAyah: 49,
      color: "#10b981",
    },
    {
      name: "Musa & Al-Khidr",
      nameAr: "موسى والخضر",
      startAyah: 50,
      endAyah: 82,
      color: "#8b5cf6",
    },
    {
      name: "Dhul-Qarnayn",
      nameAr: "ذو القرنين",
      startAyah: 83,
      endAyah: 110,
      color: "#f59e0b",
    },
  ],

  // Maryam (98 ayahs)
  19: [
    {
      name: "Zakariyya & Yahya",
      nameAr: "زكريا ويحيى",
      startAyah: 1,
      endAyah: 15,
      color: "#3b82f6",
    },
    {
      name: "Maryam & 'Isa",
      nameAr: "مريم وعيسى",
      startAyah: 16,
      endAyah: 40,
      color: "#8b5cf6",
    },
    {
      name: "Ibrahim & Prophets",
      nameAr: "إبراهيم والأنبياء",
      startAyah: 41,
      endAyah: 65,
      color: "#f59e0b",
    },
    {
      name: "Denial of Resurrection",
      nameAr: "إنكار البعث",
      startAyah: 66,
      endAyah: 98,
      color: "#ef4444",
    },
  ],

  // Ta-Ha (135 ayahs)
  20: [
    {
      name: "Musa's Calling",
      nameAr: "نداء موسى",
      startAyah: 1,
      endAyah: 48,
      color: "#3b82f6",
    },
    {
      name: "Musa vs. Sorcerers",
      nameAr: "موسى والسحرة",
      startAyah: 49,
      endAyah: 76,
      color: "#8b5cf6",
    },
    {
      name: "Exodus from Egypt",
      nameAr: "الخروج من مصر",
      startAyah: 77,
      endAyah: 98,
      color: "#f59e0b",
    },
    {
      name: "Adam & The Quran",
      nameAr: "آدم والقرآن",
      startAyah: 99,
      endAyah: 135,
      color: "#10b981",
    },
  ],

  // Al-Anbiya (112 ayahs)
  21: [
    {
      name: "Heedlessness of People",
      nameAr: "غفلة الناس",
      startAyah: 1,
      endAyah: 29,
      color: "#ef4444",
    },
    {
      name: "Prophets' Stories",
      nameAr: "قصص الأنبياء",
      startAyah: 30,
      endAyah: 91,
      color: "#3b82f6",
    },
    {
      name: "The Final Reckoning",
      nameAr: "الحساب الأخير",
      startAyah: 92,
      endAyah: 112,
      color: "#8b5cf6",
    },
  ],

  // Al-Hajj (78 ayahs)
  22: [
    {
      name: "Day of Judgment",
      nameAr: "يوم القيامة",
      startAyah: 1,
      endAyah: 24,
      color: "#ef4444",
    },
    {
      name: "Hajj Rites",
      nameAr: "مناسك الحج",
      startAyah: 25,
      endAyah: 41,
      color: "#f59e0b",
    },
    {
      name: "Permission to Fight",
      nameAr: "الإذن بالقتال",
      startAyah: 42,
      endAyah: 57,
      color: "#3b82f6",
    },
    {
      name: "Worship & Submission",
      nameAr: "العبادة والخضوع",
      startAyah: 58,
      endAyah: 78,
      color: "#10b981",
    },
  ],

  // Al-Mu'minun (118 ayahs)
  23: [
    {
      name: "Traits of Believers",
      nameAr: "صفات المؤمنين",
      startAyah: 1,
      endAyah: 22,
      color: "#10b981",
    },
    {
      name: "Stories of Prophets",
      nameAr: "قصص الأنبياء",
      startAyah: 23,
      endAyah: 56,
      color: "#3b82f6",
    },
    {
      name: "Warning to Arrogant",
      nameAr: "تحذير المستكبرين",
      startAyah: 57,
      endAyah: 92,
      color: "#ef4444",
    },
    {
      name: "Resurrection & Du'a",
      nameAr: "البعث والدعاء",
      startAyah: 93,
      endAyah: 118,
      color: "#8b5cf6",
    },
  ],

  // An-Nur (64 ayahs)
  24: [
    {
      name: "Laws of Chastity",
      nameAr: "أحكام العفة",
      startAyah: 1,
      endAyah: 26,
      color: "#3b82f6",
    },
    {
      name: "Etiquette & Privacy",
      nameAr: "آداب الاستئذان",
      startAyah: 27,
      endAyah: 34,
      color: "#8b5cf6",
    },
    {
      name: "Light of Allah",
      nameAr: "نور الله",
      startAyah: 35,
      endAyah: 46,
      color: "#f59e0b",
    },
    {
      name: "Obedience & Loyalty",
      nameAr: "الطاعة والولاء",
      startAyah: 47,
      endAyah: 64,
      color: "#10b981",
    },
  ],

  // Al-Furqan (77 ayahs)
  25: [
    {
      name: "The Criterion Revealed",
      nameAr: "نزول الفرقان",
      startAyah: 1,
      endAyah: 20,
      color: "#3b82f6",
    },
    {
      name: "Deniers' Excuses",
      nameAr: "حجج المكذبين",
      startAyah: 21,
      endAyah: 44,
      color: "#ef4444",
    },
    {
      name: "Signs in Nature",
      nameAr: "آيات في الطبيعة",
      startAyah: 45,
      endAyah: 62,
      color: "#10b981",
    },
    {
      name: "Servants of Ar-Rahman",
      nameAr: "عباد الرحمن",
      startAyah: 63,
      endAyah: 77,
      color: "#8b5cf6",
    },
  ],

  // Ash-Shu'ara (227 ayahs)
  26: [
    {
      name: "Musa & Fir'awn",
      nameAr: "موسى وفرعون",
      startAyah: 1,
      endAyah: 68,
      color: "#3b82f6",
    },
    {
      name: "Ibrahim's Da'wah",
      nameAr: "دعوة إبراهيم",
      startAyah: 69,
      endAyah: 104,
      color: "#8b5cf6",
    },
    {
      name: "Nuh's People",
      nameAr: "قوم نوح",
      startAyah: 105,
      endAyah: 122,
      color: "#f59e0b",
    },
    {
      name: "Hud's People",
      nameAr: "قوم هود",
      startAyah: 123,
      endAyah: 140,
      color: "#ef4444",
    },
    {
      name: "Salih & Lut",
      nameAr: "صالح ولوط",
      startAyah: 141,
      endAyah: 175,
      color: "#10b981",
    },
    {
      name: "Shu'ayb & Conclusion",
      nameAr: "شعيب والخاتمة",
      startAyah: 176,
      endAyah: 227,
      color: "#06b6d4",
    },
  ],

  // An-Naml (93 ayahs)
  27: [
    {
      name: "Musa & the Fire",
      nameAr: "موسى والنار",
      startAyah: 1,
      endAyah: 14,
      color: "#3b82f6",
    },
    {
      name: "Sulayman & the Ant",
      nameAr: "سليمان والنمل",
      startAyah: 15,
      endAyah: 44,
      color: "#f59e0b",
    },
    {
      name: "Salih & Lut",
      nameAr: "صالح ولوط",
      startAyah: 45,
      endAyah: 58,
      color: "#8b5cf6",
    },
    {
      name: "Allah's Power & Signs",
      nameAr: "قدرة الله وآياته",
      startAyah: 59,
      endAyah: 93,
      color: "#10b981",
    },
  ],

  // Al-Qasas (88 ayahs)
  28: [
    {
      name: "Musa's Birth & Youth",
      nameAr: "مولد موسى وشبابه",
      startAyah: 1,
      endAyah: 28,
      color: "#3b82f6",
    },
    {
      name: "Musa's Prophethood",
      nameAr: "نبوة موسى",
      startAyah: 29,
      endAyah: 46,
      color: "#8b5cf6",
    },
    {
      name: "Truth vs. Arrogance",
      nameAr: "الحق ضد الكبر",
      startAyah: 47,
      endAyah: 75,
      color: "#ef4444",
    },
    {
      name: "Qarun's Downfall",
      nameAr: "هلاك قارون",
      startAyah: 76,
      endAyah: 88,
      color: "#f59e0b",
    },
  ],

  // Al-Ankabut (69 ayahs)
  29: [
    {
      name: "Trial of Faith",
      nameAr: "ابتلاء الإيمان",
      startAyah: 1,
      endAyah: 13,
      color: "#3b82f6",
    },
    {
      name: "Prophets Tested",
      nameAr: "ابتلاء الأنبياء",
      startAyah: 14,
      endAyah: 44,
      color: "#8b5cf6",
    },
    {
      name: "The Spider's Web",
      nameAr: "مثل العنكبوت",
      startAyah: 45,
      endAyah: 69,
      color: "#f59e0b",
    },
  ],

  // Ar-Rum (60 ayahs)
  30: [
    {
      name: "Rome's Defeat & Victory",
      nameAr: "هزيمة الروم ونصرهم",
      startAyah: 1,
      endAyah: 10,
      color: "#3b82f6",
    },
    {
      name: "Signs of Allah",
      nameAr: "آيات الله",
      startAyah: 11,
      endAyah: 40,
      color: "#10b981",
    },
    {
      name: "Corruption & Hope",
      nameAr: "الفساد والأمل",
      startAyah: 41,
      endAyah: 60,
      color: "#f59e0b",
    },
  ],

  // Luqman (34 ayahs)
  31: [
    {
      name: "Quran's Wisdom",
      nameAr: "حكمة القرآن",
      startAyah: 1,
      endAyah: 11,
      color: "#3b82f6",
    },
    {
      name: "Luqman's Advice to His Son",
      nameAr: "وصايا لقمان لابنه",
      startAyah: 12,
      endAyah: 19,
      color: "#8b5cf6",
    },
    {
      name: "Signs & Submission",
      nameAr: "الآيات والخضوع",
      startAyah: 20,
      endAyah: 34,
      color: "#10b981",
    },
  ],

  // As-Sajda (30 ayahs)
  32: [
    {
      name: "Revelation & Creation",
      nameAr: "الوحي والخلق",
      startAyah: 1,
      endAyah: 14,
      color: "#3b82f6",
    },
    {
      name: "Believers vs. Deniers",
      nameAr: "المؤمنون والمكذبون",
      startAyah: 15,
      endAyah: 30,
      color: "#ef4444",
    },
  ],

  // Al-Ahzab (73 ayahs)
  33: [
    {
      name: "Battle of the Trench",
      nameAr: "غزوة الخندق",
      startAyah: 1,
      endAyah: 27,
      color: "#ef4444",
    },
    {
      name: "Prophet's Household",
      nameAr: "أهل بيت النبي",
      startAyah: 28,
      endAyah: 40,
      color: "#8b5cf6",
    },
    {
      name: "Modesty & Hijab",
      nameAr: "الحجاب والحياء",
      startAyah: 41,
      endAyah: 58,
      color: "#3b82f6",
    },
    {
      name: "Trust & Accountability",
      nameAr: "الأمانة والمسؤولية",
      startAyah: 59,
      endAyah: 73,
      color: "#10b981",
    },
  ],

  // Saba' (54 ayahs)
  34: [
    {
      name: "Allah's Knowledge & Bounty",
      nameAr: "علم الله ونعمه",
      startAyah: 1,
      endAyah: 21,
      color: "#3b82f6",
    },
    {
      name: "Dawud, Sulayman & Saba'",
      nameAr: "داود وسليمان وسبأ",
      startAyah: 22,
      endAyah: 39,
      color: "#8b5cf6",
    },
    {
      name: "Denial & Reckoning",
      nameAr: "التكذيب والحساب",
      startAyah: 40,
      endAyah: 54,
      color: "#ef4444",
    },
  ],

  // Fatir (45 ayahs)
  35: [
    {
      name: "Allah the Originator",
      nameAr: "فاطر السماوات والأرض",
      startAyah: 1,
      endAyah: 18,
      color: "#3b82f6",
    },
    {
      name: "Believers Rewarded",
      nameAr: "جزاء المؤمنين",
      startAyah: 19,
      endAyah: 35,
      color: "#10b981",
    },
    {
      name: "Warning to Deniers",
      nameAr: "إنذار المكذبين",
      startAyah: 36,
      endAyah: 45,
      color: "#ef4444",
    },
  ],

  // Ya-Sin (83 ayahs)
  36: [
    {
      name: "The Messenger's Mission",
      nameAr: "مهمة الرسول",
      startAyah: 1,
      endAyah: 12,
      color: "#3b82f6",
    },
    {
      name: "Parable of the Village",
      nameAr: "مثل أصحاب القرية",
      startAyah: 13,
      endAyah: 32,
      color: "#8b5cf6",
    },
    {
      name: "Signs in Nature",
      nameAr: "آيات في الطبيعة",
      startAyah: 33,
      endAyah: 50,
      color: "#10b981",
    },
    {
      name: "Day of Judgment",
      nameAr: "يوم القيامة",
      startAyah: 51,
      endAyah: 83,
      color: "#ef4444",
    },
  ],

  // As-Saffat (182 ayahs)
  37: [
    {
      name: "Oneness & Angels",
      nameAr: "التوحيد والملائكة",
      startAyah: 1,
      endAyah: 38,
      color: "#3b82f6",
    },
    {
      name: "Day of Judgment",
      nameAr: "يوم الدين",
      startAyah: 39,
      endAyah: 74,
      color: "#ef4444",
    },
    {
      name: "Nuh to Yunus",
      nameAr: "من نوح إلى يونس",
      startAyah: 75,
      endAyah: 148,
      color: "#8b5cf6",
    },
    {
      name: "Refuting False Claims",
      nameAr: "دحض الافتراءات",
      startAyah: 149,
      endAyah: 182,
      color: "#f59e0b",
    },
  ],

  // Sad (88 ayahs)
  38: [
    {
      name: "Denial & Warning",
      nameAr: "التكذيب والإنذار",
      startAyah: 1,
      endAyah: 16,
      color: "#ef4444",
    },
    {
      name: "Dawud & Sulayman",
      nameAr: "داود وسليمان",
      startAyah: 17,
      endAyah: 44,
      color: "#3b82f6",
    },
    {
      name: "Ayyub & Other Prophets",
      nameAr: "أيوب وأنبياء آخرون",
      startAyah: 45,
      endAyah: 64,
      color: "#8b5cf6",
    },
    {
      name: "Adam & Iblis",
      nameAr: "آدم وإبليس",
      startAyah: 65,
      endAyah: 88,
      color: "#f59e0b",
    },
  ],

  // Az-Zumar (75 ayahs)
  39: [
    {
      name: "Sincerity in Worship",
      nameAr: "إخلاص العبادة",
      startAyah: 1,
      endAyah: 21,
      color: "#3b82f6",
    },
    {
      name: "Quran's Guidance",
      nameAr: "هداية القرآن",
      startAyah: 22,
      endAyah: 41,
      color: "#10b981",
    },
    {
      name: "Intercession & Judgment",
      nameAr: "الشفاعة والحساب",
      startAyah: 42,
      endAyah: 52,
      color: "#8b5cf6",
    },
    {
      name: "Mercy & Reckoning",
      nameAr: "الرحمة والحساب",
      startAyah: 53,
      endAyah: 75,
      color: "#f59e0b",
    },
  ],

  // Ghafir (85 ayahs)
  40: [
    {
      name: "Forgiveness & Warning",
      nameAr: "المغفرة والإنذار",
      startAyah: 1,
      endAyah: 22,
      color: "#3b82f6",
    },
    {
      name: "Believing Man of Fir'awn",
      nameAr: "مؤمن آل فرعون",
      startAyah: 23,
      endAyah: 50,
      color: "#8b5cf6",
    },
    {
      name: "Allah Supports Messengers",
      nameAr: "نصر الله للرسل",
      startAyah: 51,
      endAyah: 68,
      color: "#10b981",
    },
    {
      name: "Arrogance Destroyed",
      nameAr: "هلاك المتكبرين",
      startAyah: 69,
      endAyah: 85,
      color: "#ef4444",
    },
  ],

  // Fussilat (54 ayahs)
  41: [
    {
      name: "Quran's Challenge",
      nameAr: "تحدي القرآن",
      startAyah: 1,
      endAyah: 18,
      color: "#3b82f6",
    },
    {
      name: "Witnesses on Judgment Day",
      nameAr: "الشهود يوم القيامة",
      startAyah: 19,
      endAyah: 36,
      color: "#ef4444",
    },
    {
      name: "Signs & Reassurance",
      nameAr: "الآيات والتثبيت",
      startAyah: 37,
      endAyah: 54,
      color: "#10b981",
    },
  ],

  // Ash-Shura (53 ayahs)
  42: [
    {
      name: "Revelation & Unity",
      nameAr: "الوحي والوحدة",
      startAyah: 1,
      endAyah: 19,
      color: "#3b82f6",
    },
    {
      name: "Provision & Shura",
      nameAr: "الرزق والشورى",
      startAyah: 20,
      endAyah: 39,
      color: "#10b981",
    },
    {
      name: "Signs & Guidance",
      nameAr: "الآيات والهداية",
      startAyah: 40,
      endAyah: 53,
      color: "#8b5cf6",
    },
  ],

  // Al-Waqi'ah (96 ayahs)
  56: [
    {
      name: "Three Groups",
      nameAr: "الأصناف الثلاثة",
      startAyah: 1,
      endAyah: 14,
      color: "#3b82f6",
    },
    {
      name: "People of the Right",
      nameAr: "أصحاب اليمين",
      startAyah: 15,
      endAyah: 40,
      color: "#10b981",
    },
    {
      name: "People of the Left",
      nameAr: "أصحاب الشمال",
      startAyah: 41,
      endAyah: 56,
      color: "#ef4444",
    },
    {
      name: "Signs of Allah's Power",
      nameAr: "دلائل قدرة الله",
      startAyah: 57,
      endAyah: 74,
      color: "#f59e0b",
    },
    {
      name: "The Quran's Glory",
      nameAr: "عظمة القرآن",
      startAyah: 75,
      endAyah: 96,
      color: "#8b5cf6",
    },
  ],

  // Ar-Rahman (78 ayahs)
  55: [
    {
      name: "Allah's Gifts to Creation",
      nameAr: "نعم الله على الخلق",
      startAyah: 1,
      endAyah: 30,
      color: "#3b82f6",
    },
    {
      name: "Judgment of Jinn & Humans",
      nameAr: "حساب الجن والإنس",
      startAyah: 31,
      endAyah: 45,
      color: "#ef4444",
    },
    {
      name: "Two Gardens of Paradise",
      nameAr: "جنتان",
      startAyah: 46,
      endAyah: 78,
      color: "#10b981",
    },
  ],

  // Az-Zukhruf (89 ayahs)
  43: [
    {
      name: "Quran's Arabic Clarity",
      nameAr: "القرآن العربي المبين",
      startAyah: 1,
      endAyah: 25,
      color: "#3b82f6",
    },
    {
      name: "Ibrahim & Previous Nations",
      nameAr: "إبراهيم والأمم السابقة",
      startAyah: 26,
      endAyah: 56,
      color: "#8b5cf6",
    },
    {
      name: "'Isa & Day of Judgment",
      nameAr: "عيسى ويوم القيامة",
      startAyah: 57,
      endAyah: 89,
      color: "#ef4444",
    },
  ],

  // Ad-Dukhan (59 ayahs)
  44: [
    {
      name: "Night of Decree & Warning",
      nameAr: "ليلة القدر والإنذار",
      startAyah: 1,
      endAyah: 16,
      color: "#3b82f6",
    },
    {
      name: "Fir'awn's Destruction",
      nameAr: "هلاك فرعون",
      startAyah: 17,
      endAyah: 33,
      color: "#ef4444",
    },
    {
      name: "Paradise vs. Hellfire",
      nameAr: "الجنة والنار",
      startAyah: 34,
      endAyah: 59,
      color: "#10b981",
    },
  ],

  // Al-Jathiyah (37 ayahs)
  45: [
    {
      name: "Signs in Creation",
      nameAr: "آيات في الخلق",
      startAyah: 1,
      endAyah: 15,
      color: "#3b82f6",
    },
    {
      name: "Bani Isra'il's Guidance",
      nameAr: "هداية بني إسرائيل",
      startAyah: 16,
      endAyah: 22,
      color: "#8b5cf6",
    },
    {
      name: "The Kneeling on Judgment Day",
      nameAr: "الجثو يوم القيامة",
      startAyah: 23,
      endAyah: 37,
      color: "#ef4444",
    },
  ],

  // Al-Ahqaf (35 ayahs)
  46: [
    {
      name: "Quran from Allah",
      nameAr: "القرآن من الله",
      startAyah: 1,
      endAyah: 14,
      color: "#3b82f6",
    },
    {
      name: "Kindness to Parents & Jinn's Belief",
      nameAr: "بر الوالدين وإيمان الجن",
      startAyah: 15,
      endAyah: 35,
      color: "#10b981",
    },
  ],

  // Muhammad (38 ayahs)
  47: [
    {
      name: "Fighting for Truth",
      nameAr: "القتال في سبيل الحق",
      startAyah: 1,
      endAyah: 19,
      color: "#ef4444",
    },
    {
      name: "Hypocrites & Obedience",
      nameAr: "المنافقون والطاعة",
      startAyah: 20,
      endAyah: 38,
      color: "#8b5cf6",
    },
  ],

  // Al-Fath (29 ayahs)
  48: [
    {
      name: "Victory & Allegiance",
      nameAr: "الفتح والبيعة",
      startAyah: 1,
      endAyah: 17,
      color: "#3b82f6",
    },
    {
      name: "Treaty of Hudaybiyyah",
      nameAr: "صلح الحديبية",
      startAyah: 18,
      endAyah: 29,
      color: "#10b981",
    },
  ],

  // Al-Hujurat (18 ayahs)
  49: [
    {
      name: "Manners with the Prophet",
      nameAr: "أدب مع النبي",
      startAyah: 1,
      endAyah: 10,
      color: "#3b82f6",
    },
    {
      name: "Brotherhood & Faith",
      nameAr: "الأخوة والإيمان",
      startAyah: 11,
      endAyah: 18,
      color: "#10b981",
    },
  ],

  // Qaf (45 ayahs)
  50: [
    {
      name: "Creation & Resurrection",
      nameAr: "الخلق والبعث",
      startAyah: 1,
      endAyah: 22,
      color: "#3b82f6",
    },
    {
      name: "Judgment & Remembrance",
      nameAr: "الحساب والتذكير",
      startAyah: 23,
      endAyah: 45,
      color: "#8b5cf6",
    },
  ],

  // Adh-Dhariyat (60 ayahs)
  51: [
    {
      name: "Winds & Promise of Judgment",
      nameAr: "الرياح ووعد الحساب",
      startAyah: 1,
      endAyah: 23,
      color: "#3b82f6",
    },
    {
      name: "Ibrahim's Guests & Past Nations",
      nameAr: "ضيوف إبراهيم والأمم",
      startAyah: 24,
      endAyah: 46,
      color: "#8b5cf6",
    },
    {
      name: "Purpose of Creation",
      nameAr: "الغاية من الخلق",
      startAyah: 47,
      endAyah: 60,
      color: "#10b981",
    },
  ],

  // At-Tur (49 ayahs)
  52: [
    {
      name: "Oaths & Torment of Deniers",
      nameAr: "القسم وعذاب المكذبين",
      startAyah: 1,
      endAyah: 28,
      color: "#ef4444",
    },
    {
      name: "Patience & Glorification",
      nameAr: "الصبر والتسبيح",
      startAyah: 29,
      endAyah: 49,
      color: "#3b82f6",
    },
  ],

  // An-Najm (62 ayahs)
  53: [
    {
      name: "The Prophet's Ascension",
      nameAr: "معراج النبي",
      startAyah: 1,
      endAyah: 18,
      color: "#8b5cf6",
    },
    {
      name: "Idols Refuted",
      nameAr: "دحض الأصنام",
      startAyah: 19,
      endAyah: 32,
      color: "#ef4444",
    },
    {
      name: "Accountability & Allah's Power",
      nameAr: "المسؤولية وقدرة الله",
      startAyah: 33,
      endAyah: 62,
      color: "#3b82f6",
    },
  ],

  // Al-Qamar (55 ayahs)
  54: [
    {
      name: "Moon Split & Warnings",
      nameAr: "انشقاق القمر والإنذار",
      startAyah: 1,
      endAyah: 17,
      color: "#3b82f6",
    },
    {
      name: "Destroyed Nations",
      nameAr: "الأمم المهلكة",
      startAyah: 18,
      endAyah: 42,
      color: "#ef4444",
    },
    {
      name: "Lessons & Destiny",
      nameAr: "العبر والقدر",
      startAyah: 43,
      endAyah: 55,
      color: "#8b5cf6",
    },
  ],

  // Al-Hadid (29 ayahs)
  57: [
    {
      name: "Allah's Sovereignty",
      nameAr: "ملك الله",
      startAyah: 1,
      endAyah: 15,
      color: "#3b82f6",
    },
    {
      name: "Charity & the Hereafter",
      nameAr: "الإنفاق والآخرة",
      startAyah: 16,
      endAyah: 29,
      color: "#10b981",
    },
  ],

  // Al-Mujadila (22 ayahs)
  58: [
    {
      name: "Zihar Ruling & Allah Hears",
      nameAr: "حكم الظهار والله يسمع",
      startAyah: 1,
      endAyah: 6,
      color: "#3b82f6",
    },
    {
      name: "Secret Councils & Loyalty",
      nameAr: "النجوى والولاء",
      startAyah: 7,
      endAyah: 22,
      color: "#8b5cf6",
    },
  ],

  // Al-Hashr (24 ayahs)
  59: [
    {
      name: "Exile of Banu Nadir",
      nameAr: "إجلاء بني النضير",
      startAyah: 1,
      endAyah: 10,
      color: "#ef4444",
    },
    {
      name: "Hypocrites Exposed",
      nameAr: "كشف المنافقين",
      startAyah: 11,
      endAyah: 17,
      color: "#8b5cf6",
    },
    {
      name: "Beautiful Names of Allah",
      nameAr: "أسماء الله الحسنى",
      startAyah: 18,
      endAyah: 24,
      color: "#3b82f6",
    },
  ],

  // Al-Mumtahana (13 ayahs)
  60: [
    {
      name: "Allegiance & Relations with Non-Believers",
      nameAr: "الولاء والعلاقة مع الكفار",
      startAyah: 1,
      endAyah: 13,
      color: "#3b82f6",
    },
  ],

  // As-Saff (14 ayahs)
  61: [
    {
      name: "Striving in Allah's Cause",
      nameAr: "الجهاد في سبيل الله",
      startAyah: 1,
      endAyah: 14,
      color: "#3b82f6",
    },
  ],

  // Al-Jumu'ah (11 ayahs)
  62: [
    {
      name: "Friday Prayer & Remembrance",
      nameAr: "صلاة الجمعة والذكر",
      startAyah: 1,
      endAyah: 11,
      color: "#3b82f6",
    },
  ],

  // Al-Munafiqun (11 ayahs)
  63: [
    {
      name: "Traits of Hypocrites",
      nameAr: "صفات المنافقين",
      startAyah: 1,
      endAyah: 11,
      color: "#ef4444",
    },
  ],

  // At-Taghabun (18 ayahs)
  64: [
    {
      name: "Allah's Glory & Day of Gathering",
      nameAr: "تسبيح الله ويوم التغابن",
      startAyah: 1,
      endAyah: 18,
      color: "#3b82f6",
    },
  ],

  // At-Talaq (12 ayahs)
  65: [
    {
      name: "Divorce Rulings & Trust in Allah",
      nameAr: "أحكام الطلاق والتوكل",
      startAyah: 1,
      endAyah: 12,
      color: "#3b82f6",
    },
  ],

  // At-Tahrim (12 ayahs)
  66: [
    {
      name: "Domestic Affairs & Repentance",
      nameAr: "الشؤون الأسرية والتوبة",
      startAyah: 1,
      endAyah: 12,
      color: "#3b82f6",
    },
  ],

  // Al-Mulk (30 ayahs)
  67: [
    {
      name: "Sovereignty & Creation",
      nameAr: "الملك والخلق",
      startAyah: 1,
      endAyah: 14,
      color: "#3b82f6",
    },
    {
      name: "Gratitude & Warning",
      nameAr: "الشكر والإنذار",
      startAyah: 15,
      endAyah: 30,
      color: "#8b5cf6",
    },
  ],

  // Al-Qalam (52 ayahs)
  68: [
    {
      name: "Defense of the Prophet",
      nameAr: "الدفاع عن النبي",
      startAyah: 1,
      endAyah: 16,
      color: "#3b82f6",
    },
    {
      name: "Parable of the Garden Owners",
      nameAr: "مثل أصحاب الجنة",
      startAyah: 17,
      endAyah: 33,
      color: "#8b5cf6",
    },
    {
      name: "Patience & Reward",
      nameAr: "الصبر والجزاء",
      startAyah: 34,
      endAyah: 52,
      color: "#10b981",
    },
  ],

  // Al-Haqqah (52 ayahs)
  69: [
    {
      name: "The Inevitable Hour",
      nameAr: "الحاقة",
      startAyah: 1,
      endAyah: 18,
      color: "#ef4444",
    },
    {
      name: "Records & Judgment",
      nameAr: "الصحف والحساب",
      startAyah: 19,
      endAyah: 37,
      color: "#8b5cf6",
    },
    {
      name: "The Quran's Truth",
      nameAr: "صدق القرآن",
      startAyah: 38,
      endAyah: 52,
      color: "#3b82f6",
    },
  ],

  // Al-Ma'arij (44 ayahs)
  70: [
    {
      name: "Day of Ascending Stairways",
      nameAr: "يوم المعارج",
      startAyah: 1,
      endAyah: 18,
      color: "#ef4444",
    },
    {
      name: "Human Nature & Believers",
      nameAr: "طبيعة الإنسان والمؤمنون",
      startAyah: 19,
      endAyah: 44,
      color: "#3b82f6",
    },
  ],

  // Nuh (28 ayahs)
  71: [
    {
      name: "Nuh's Da'wah & Plea",
      nameAr: "دعوة نوح وتضرعه",
      startAyah: 1,
      endAyah: 20,
      color: "#3b82f6",
    },
    {
      name: "Du'a Against Deniers",
      nameAr: "الدعاء على المكذبين",
      startAyah: 21,
      endAyah: 28,
      color: "#ef4444",
    },
  ],

  // Al-Jinn (28 ayahs)
  72: [
    {
      name: "Jinn Listen to Quran",
      nameAr: "استماع الجن للقرآن",
      startAyah: 1,
      endAyah: 15,
      color: "#8b5cf6",
    },
    {
      name: "Devotion & Warning",
      nameAr: "الإخلاص والإنذار",
      startAyah: 16,
      endAyah: 28,
      color: "#3b82f6",
    },
  ],

  // Al-Muzzammil (20 ayahs)
  73: [
    {
      name: "Night Prayer & Patience",
      nameAr: "قيام الليل والصبر",
      startAyah: 1,
      endAyah: 20,
      color: "#3b82f6",
    },
  ],

  // Al-Muddaththir (56 ayahs)
  74: [
    {
      name: "Rise & Warn",
      nameAr: "قم فأنذر",
      startAyah: 1,
      endAyah: 10,
      color: "#3b82f6",
    },
    {
      name: "The Arrogant Denier",
      nameAr: "المكذب المتكبر",
      startAyah: 11,
      endAyah: 31,
      color: "#ef4444",
    },
    {
      name: "Saqar & Its Guardians",
      nameAr: "سقر وخزنتها",
      startAyah: 32,
      endAyah: 56,
      color: "#8b5cf6",
    },
  ],

  // Al-Qiyamah (40 ayahs)
  75: [
    {
      name: "Resurrection Oath",
      nameAr: "القسم بالقيامة",
      startAyah: 1,
      endAyah: 19,
      color: "#ef4444",
    },
    {
      name: "Quran & Death's Reality",
      nameAr: "القرآن وحقيقة الموت",
      startAyah: 20,
      endAyah: 40,
      color: "#3b82f6",
    },
  ],

  // Al-Insan (31 ayahs)
  76: [
    {
      name: "Human Creation & Choice",
      nameAr: "خلق الإنسان واختياره",
      startAyah: 1,
      endAyah: 12,
      color: "#3b82f6",
    },
    {
      name: "Rewards of Paradise",
      nameAr: "نعيم الجنة",
      startAyah: 13,
      endAyah: 22,
      color: "#10b981",
    },
    {
      name: "Patience & Allah's Will",
      nameAr: "الصبر ومشيئة الله",
      startAyah: 23,
      endAyah: 31,
      color: "#8b5cf6",
    },
  ],

  // Al-Mursalat (50 ayahs)
  77: [
    {
      name: "Winds Sent Forth",
      nameAr: "المرسلات",
      startAyah: 1,
      endAyah: 28,
      color: "#3b82f6",
    },
    {
      name: "Woe to the Deniers",
      nameAr: "ويل للمكذبين",
      startAyah: 29,
      endAyah: 50,
      color: "#ef4444",
    },
  ],

  // An-Naba' (40 ayahs)
  78: [
    {
      name: "The Great News",
      nameAr: "النبأ العظيم",
      startAyah: 1,
      endAyah: 16,
      color: "#3b82f6",
    },
    {
      name: "Day of Judgment's Terrors",
      nameAr: "أهوال يوم القيامة",
      startAyah: 17,
      endAyah: 40,
      color: "#ef4444",
    },
  ],

  // An-Nazi'at (46 ayahs)
  79: [
    {
      name: "Angels & Resurrection",
      nameAr: "الملائكة والبعث",
      startAyah: 1,
      endAyah: 14,
      color: "#8b5cf6",
    },
    {
      name: "Musa & Fir'awn",
      nameAr: "موسى وفرعون",
      startAyah: 15,
      endAyah: 26,
      color: "#ef4444",
    },
    {
      name: "Creation & the Hour",
      nameAr: "الخلق والساعة",
      startAyah: 27,
      endAyah: 46,
      color: "#3b82f6",
    },
  ],

  // 'Abasa (42 ayahs)
  80: [
    {
      name: "The Blind Man's Lesson",
      nameAr: "عتاب الأعمى",
      startAyah: 1,
      endAyah: 16,
      color: "#f59e0b",
    },
    {
      name: "Human Ingratitude & Judgment",
      nameAr: "جحود الإنسان والحساب",
      startAyah: 17,
      endAyah: 42,
      color: "#ef4444",
    },
  ],

  // At-Takwir (29 ayahs)
  81: [
    {
      name: "Cosmic Upheaval",
      nameAr: "انهيار الكون",
      startAyah: 1,
      endAyah: 14,
      color: "#ef4444",
    },
    {
      name: "The Quran's Noble Messenger",
      nameAr: "الرسول الكريم والقرآن",
      startAyah: 15,
      endAyah: 29,
      color: "#3b82f6",
    },
  ],

  // Al-Infitar (19 ayahs)
  82: [
    {
      name: "Sky Torn Apart & Reckoning",
      nameAr: "انفطار السماء والحساب",
      startAyah: 1,
      endAyah: 19,
      color: "#ef4444",
    },
  ],

  // Al-Mutaffifin (36 ayahs)
  83: [
    {
      name: "Woe to Cheaters",
      nameAr: "ويل للمطففين",
      startAyah: 1,
      endAyah: 17,
      color: "#ef4444",
    },
    {
      name: "Righteous in Paradise",
      nameAr: "الأبرار في نعيم",
      startAyah: 18,
      endAyah: 36,
      color: "#10b981",
    },
  ],

  // Al-Inshiqaq (25 ayahs)
  84: [
    {
      name: "Sky Splits Open",
      nameAr: "انشقاق السماء",
      startAyah: 1,
      endAyah: 15,
      color: "#ef4444",
    },
    {
      name: "Gradual Stages",
      nameAr: "التدرج في المراحل",
      startAyah: 16,
      endAyah: 25,
      color: "#3b82f6",
    },
  ],

  // Al-Buruj (22 ayahs)
  85: [
    {
      name: "People of the Trench",
      nameAr: "أصحاب الأخدود",
      startAyah: 1,
      endAyah: 11,
      color: "#ef4444",
    },
    {
      name: "Allah's Power & the Quran",
      nameAr: "قدرة الله والقرآن",
      startAyah: 12,
      endAyah: 22,
      color: "#3b82f6",
    },
  ],

  // At-Tariq (17 ayahs)
  86: [
    {
      name: "The Night Star & Creation",
      nameAr: "الطارق والخلق",
      startAyah: 1,
      endAyah: 17,
      color: "#8b5cf6",
    },
  ],

  // Al-A'la (19 ayahs)
  87: [
    {
      name: "Glorify the Most High",
      nameAr: "سبح اسم ربك الأعلى",
      startAyah: 1,
      endAyah: 19,
      color: "#3b82f6",
    },
  ],

  // Al-Ghashiyah (26 ayahs)
  88: [
    {
      name: "The Overwhelming Event",
      nameAr: "الغاشية",
      startAyah: 1,
      endAyah: 16,
      color: "#ef4444",
    },
    {
      name: "Signs & Accountability",
      nameAr: "الآيات والحساب",
      startAyah: 17,
      endAyah: 26,
      color: "#3b82f6",
    },
  ],

  // Al-Fajr (30 ayahs)
  89: [
    {
      name: "Destroyed Tyrants",
      nameAr: "الطغاة المهلكون",
      startAyah: 1,
      endAyah: 14,
      color: "#ef4444",
    },
    {
      name: "Human Trials & Afterlife",
      nameAr: "ابتلاء الإنسان والآخرة",
      startAyah: 15,
      endAyah: 30,
      color: "#3b82f6",
    },
  ],

  // Al-Balad (20 ayahs)
  90: [
    {
      name: "Struggle & the Steep Path",
      nameAr: "المكابدة والعقبة",
      startAyah: 1,
      endAyah: 20,
      color: "#3b82f6",
    },
  ],

  // Ash-Shams (15 ayahs)
  91: [
    {
      name: "Sun, Soul & Purification",
      nameAr: "الشمس والنفس والتزكية",
      startAyah: 1,
      endAyah: 15,
      color: "#f59e0b",
    },
  ],

  // Al-Layl (21 ayahs)
  92: [
    {
      name: "Two Paths: Giving vs. Hoarding",
      nameAr: "طريقان: الإنفاق والبخل",
      startAyah: 1,
      endAyah: 21,
      color: "#3b82f6",
    },
  ],

  // Ad-Duha (11 ayahs)
  93: [
    {
      name: "Morning Light & Allah's Favor",
      nameAr: "نور الضحى ونعم الله",
      startAyah: 1,
      endAyah: 11,
      color: "#f59e0b",
    },
  ],

  // Ash-Sharh (8 ayahs)
  94: [
    {
      name: "Expansion of the Heart",
      nameAr: "شرح الصدر",
      startAyah: 1,
      endAyah: 8,
      color: "#3b82f6",
    },
  ],

  // At-Tin (8 ayahs)
  95: [
    {
      name: "Best Form of Creation",
      nameAr: "أحسن تقويم",
      startAyah: 1,
      endAyah: 8,
      color: "#10b981",
    },
  ],

  // Al-'Alaq (19 ayahs)
  96: [
    {
      name: "Read! First Revelation",
      nameAr: "اقرأ! أول الوحي",
      startAyah: 1,
      endAyah: 5,
      color: "#3b82f6",
    },
    {
      name: "Man's Transgression",
      nameAr: "طغيان الإنسان",
      startAyah: 6,
      endAyah: 19,
      color: "#ef4444",
    },
  ],

  // Al-Qadr (5 ayahs)
  97: [
    {
      name: "Night of Power",
      nameAr: "ليلة القدر",
      startAyah: 1,
      endAyah: 5,
      color: "#8b5cf6",
    },
  ],

  // Al-Bayyinah (8 ayahs)
  98: [
    {
      name: "Clear Evidence & Pure Faith",
      nameAr: "البينة والإيمان الخالص",
      startAyah: 1,
      endAyah: 8,
      color: "#3b82f6",
    },
  ],

  // Az-Zalzalah (8 ayahs)
  99: [
    {
      name: "Earth's Quaking & Judgment",
      nameAr: "زلزال الأرض والحساب",
      startAyah: 1,
      endAyah: 8,
      color: "#ef4444",
    },
  ],

  // Al-'Adiyat (11 ayahs)
  100: [
    {
      name: "Charging Steeds & Ingratitude",
      nameAr: "العاديات وجحود الإنسان",
      startAyah: 1,
      endAyah: 11,
      color: "#f59e0b",
    },
  ],

  // Al-Qari'ah (11 ayahs)
  101: [
    {
      name: "The Striking Calamity",
      nameAr: "القارعة",
      startAyah: 1,
      endAyah: 11,
      color: "#ef4444",
    },
  ],

  // At-Takathur (8 ayahs)
  102: [
    {
      name: "Rivalry in Worldly Gain",
      nameAr: "التكاثر في الدنيا",
      startAyah: 1,
      endAyah: 8,
      color: "#f59e0b",
    },
  ],

  // Al-'Asr (3 ayahs)
  103: [
    {
      name: "Time & Salvation Formula",
      nameAr: "العصر ومنهج النجاة",
      startAyah: 1,
      endAyah: 3,
      color: "#3b82f6",
    },
  ],

  // Al-Humazah (9 ayahs)
  104: [
    {
      name: "Woe to the Slanderer",
      nameAr: "ويل لكل همزة لمزة",
      startAyah: 1,
      endAyah: 9,
      color: "#ef4444",
    },
  ],

  // Al-Fil (5 ayahs)
  105: [
    {
      name: "Army of the Elephant",
      nameAr: "أصحاب الفيل",
      startAyah: 1,
      endAyah: 5,
      color: "#8b5cf6",
    },
  ],

  // Quraysh (4 ayahs)
  106: [
    {
      name: "Quraysh's Winter & Summer Journey",
      nameAr: "رحلة الشتاء والصيف",
      startAyah: 1,
      endAyah: 4,
      color: "#f59e0b",
    },
  ],

  // Al-Ma'un (7 ayahs)
  107: [
    {
      name: "Small Kindnesses & Hypocrisy",
      nameAr: "الماعون والرياء",
      startAyah: 1,
      endAyah: 7,
      color: "#ef4444",
    },
  ],

  // Al-Kawthar (3 ayahs)
  108: [
    {
      name: "Abundance from Allah",
      nameAr: "الكوثر من الله",
      startAyah: 1,
      endAyah: 3,
      color: "#10b981",
    },
  ],

  // Al-Kafirun (6 ayahs)
  109: [
    {
      name: "Disavowal of Disbelief",
      nameAr: "البراءة من الكفر",
      startAyah: 1,
      endAyah: 6,
      color: "#3b82f6",
    },
  ],

  // An-Nasr (3 ayahs)
  110: [
    {
      name: "Victory & Praise",
      nameAr: "النصر والتسبيح",
      startAyah: 1,
      endAyah: 3,
      color: "#10b981",
    },
  ],

  // Al-Masad (5 ayahs)
  111: [
    {
      name: "Doom of Abu Lahab",
      nameAr: "هلاك أبي لهب",
      startAyah: 1,
      endAyah: 5,
      color: "#ef4444",
    },
  ],

  // Al-Ikhlas (4 ayahs)
  112: [
    {
      name: "Pure Monotheism",
      nameAr: "التوحيد الخالص",
      startAyah: 1,
      endAyah: 4,
      color: "#3b82f6",
    },
  ],

  // Al-Falaq (5 ayahs)
  113: [
    {
      name: "Refuge from External Evil",
      nameAr: "الاستعاذة من الشر الخارجي",
      startAyah: 1,
      endAyah: 5,
      color: "#8b5cf6",
    },
  ],

  // An-Nas (6 ayahs)
  114: [
    {
      name: "Refuge from Whispering Evil",
      nameAr: "الاستعاذة من الوسواس",
      startAyah: 1,
      endAyah: 6,
      color: "#8b5cf6",
    },
  ],
};

/**
 * Get hizb sections that fall within a given surah's ayah range.
 * Used alongside mawdu'at for showing structural divisions.
 */
export function getHizbsInSurah(
  surahNumber: number,
  totalAyahs: number
): Array<{ hizbNumber: number; juz: number; startAyah: number }> {
  // Import would create circular dep, so we use inline lookup
  const HIZB_DATA: Array<{
    number: number;
    juz: number;
    startSurah: number;
    startAyah: number;
  }> = [
    { number: 1, juz: 1, startSurah: 1, startAyah: 1 },
    { number: 2, juz: 1, startSurah: 2, startAyah: 26 },
    { number: 3, juz: 2, startSurah: 2, startAyah: 142 },
    { number: 4, juz: 2, startSurah: 2, startAyah: 203 },
    { number: 5, juz: 3, startSurah: 2, startAyah: 253 },
    { number: 6, juz: 3, startSurah: 3, startAyah: 15 },
    { number: 7, juz: 4, startSurah: 3, startAyah: 92 },
    { number: 8, juz: 4, startSurah: 3, startAyah: 171 },
    { number: 9, juz: 5, startSurah: 4, startAyah: 24 },
    { number: 10, juz: 5, startSurah: 4, startAyah: 88 },
    { number: 11, juz: 6, startSurah: 4, startAyah: 148 },
    { number: 12, juz: 6, startSurah: 5, startAyah: 27 },
    { number: 13, juz: 7, startSurah: 5, startAyah: 82 },
    { number: 14, juz: 7, startSurah: 6, startAyah: 36 },
    { number: 15, juz: 8, startSurah: 6, startAyah: 111 },
    { number: 16, juz: 8, startSurah: 7, startAyah: 31 },
    { number: 17, juz: 9, startSurah: 7, startAyah: 88 },
    { number: 18, juz: 9, startSurah: 7, startAyah: 171 },
    { number: 19, juz: 10, startSurah: 8, startAyah: 41 },
    { number: 20, juz: 10, startSurah: 9, startAyah: 34 },
    { number: 21, juz: 11, startSurah: 9, startAyah: 93 },
    { number: 22, juz: 11, startSurah: 10, startAyah: 26 },
    { number: 23, juz: 12, startSurah: 11, startAyah: 6 },
    { number: 24, juz: 12, startSurah: 11, startAyah: 84 },
    { number: 25, juz: 13, startSurah: 12, startAyah: 53 },
    { number: 26, juz: 13, startSurah: 13, startAyah: 18 },
    { number: 27, juz: 14, startSurah: 15, startAyah: 1 },
    { number: 28, juz: 14, startSurah: 16, startAyah: 1 },
    { number: 29, juz: 15, startSurah: 17, startAyah: 1 },
    { number: 30, juz: 15, startSurah: 17, startAyah: 99 },
    { number: 31, juz: 16, startSurah: 18, startAyah: 75 },
    { number: 32, juz: 16, startSurah: 19, startAyah: 59 },
    { number: 33, juz: 17, startSurah: 21, startAyah: 1 },
    { number: 34, juz: 17, startSurah: 22, startAyah: 1 },
    { number: 35, juz: 18, startSurah: 23, startAyah: 1 },
    { number: 36, juz: 18, startSurah: 24, startAyah: 21 },
    { number: 37, juz: 19, startSurah: 25, startAyah: 21 },
    { number: 38, juz: 19, startSurah: 27, startAyah: 1 },
    { number: 39, juz: 20, startSurah: 27, startAyah: 56 },
    { number: 40, juz: 20, startSurah: 29, startAyah: 1 },
    { number: 41, juz: 21, startSurah: 29, startAyah: 46 },
    { number: 42, juz: 21, startSurah: 31, startAyah: 22 },
    { number: 43, juz: 22, startSurah: 33, startAyah: 31 },
    { number: 44, juz: 22, startSurah: 34, startAyah: 24 },
    { number: 45, juz: 23, startSurah: 36, startAyah: 28 },
    { number: 46, juz: 23, startSurah: 38, startAyah: 1 },
    { number: 47, juz: 24, startSurah: 39, startAyah: 32 },
    { number: 48, juz: 24, startSurah: 40, startAyah: 41 },
    { number: 49, juz: 25, startSurah: 41, startAyah: 47 },
    { number: 50, juz: 25, startSurah: 43, startAyah: 24 },
    { number: 51, juz: 26, startSurah: 46, startAyah: 1 },
    { number: 52, juz: 26, startSurah: 48, startAyah: 18 },
    { number: 53, juz: 27, startSurah: 51, startAyah: 31 },
    { number: 54, juz: 27, startSurah: 54, startAyah: 28 },
    { number: 55, juz: 28, startSurah: 58, startAyah: 1 },
    { number: 56, juz: 28, startSurah: 60, startAyah: 7 },
    { number: 57, juz: 29, startSurah: 67, startAyah: 1 },
    { number: 58, juz: 29, startSurah: 71, startAyah: 11 },
    { number: 59, juz: 30, startSurah: 78, startAyah: 1 },
    { number: 60, juz: 30, startSurah: 87, startAyah: 1 },
  ];

  return HIZB_DATA.filter(
    (h) => h.startSurah === surahNumber && h.startAyah <= totalAyahs
  ).map((h) => ({ hizbNumber: h.number, juz: h.juz, startAyah: h.startAyah }));
}
