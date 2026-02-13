/**
 * Seed Page Layouts
 *
 * Seeds 604 Madinah Mushaf page layouts from GitHub JSON files.
 * Uses 10-parallel concurrency with retries.
 */
import { Prisma, type PrismaClient } from "@prisma/client";

import { progressBar, runConcurrent, withRetry } from "./utils";

const GITHUB_RAW_BASE =
  "https://raw.githubusercontent.com/zonetecde/mushaf-layout/refs/heads/main/mushaf";

// Surah names in Arabic (for header lines)
const SURAH_NAMES: Record<number, string> = {
  1: "سُورَةُ ٱلْفَاتِحَةِ",
  2: "سُورَةُ ٱلْبَقَرَةِ",
  3: "سُورَةُ آلِ عِمْرَانَ",
  4: "سُورَةُ ٱلنِّسَاءِ",
  5: "سُورَةُ ٱلْمَائِدَةِ",
  6: "سُورَةُ ٱلْأَنْعَامِ",
  7: "سُورَةُ ٱلْأَعْرَافِ",
  8: "سُورَةُ ٱلْأَنفَالِ",
  9: "سُورَةُ ٱلتَّوْبَةِ",
  10: "سُورَةُ يُونُسَ",
  11: "سُورَةُ هُودٍ",
  12: "سُورَةُ يُوسُفَ",
  13: "سُورَةُ ٱلرَّعْدِ",
  14: "سُورَةُ إِبْرَاهِيمَ",
  15: "سُورَةُ ٱلْحِجْرِ",
  16: "سُورَةُ ٱلنَّحْلِ",
  17: "سُورَةُ ٱلْإِسْرَاءِ",
  18: "سُورَةُ ٱلْكَهْفِ",
  19: "سُورَةُ مَرْيَمَ",
  20: "سُورَةُ طٰهٰ",
  21: "سُورَةُ ٱلْأَنْبِيَاءِ",
  22: "سُورَةُ ٱلْحَجِّ",
  23: "سُورَةُ ٱلْمُؤْمِنُونَ",
  24: "سُورَةُ ٱلنُّورِ",
  25: "سُورَةُ ٱلْفُرْقَانِ",
  26: "سُورَةُ ٱلشُّعَرَاءِ",
  27: "سُورَةُ ٱلنَّمْلِ",
  28: "سُورَةُ ٱلْقَصَصِ",
  29: "سُورَةُ ٱلْعَنكَبُوتِ",
  30: "سُورَةُ ٱلرُّومِ",
  31: "سُورَةُ لُقْمَانَ",
  32: "سُورَةُ ٱلسَّجْدَةِ",
  33: "سُورَةُ ٱلْأَحْزَابِ",
  34: "سُورَةُ سَبَإٍ",
  35: "سُورَةُ فَاطِرٍ",
  36: "سُورَةُ يٰسٓ",
  37: "سُورَةُ ٱلصَّافَّاتِ",
  38: "سُورَةُ صٓ",
  39: "سُورَةُ ٱلزُّمَرِ",
  40: "سُورَةُ غَافِرٍ",
  41: "سُورَةُ فُصِّلَتْ",
  42: "سُورَةُ ٱلشُّورَىٰ",
  43: "سُورَةُ ٱلزُّخْرُفِ",
  44: "سُورَةُ ٱلدُّخَانِ",
  45: "سُورَةُ ٱلْجَاثِيَةِ",
  46: "سُورَةُ ٱلْأَحْقَافِ",
  47: "سُورَةُ مُحَمَّدٍ",
  48: "سُورَةُ ٱلْفَتْحِ",
  49: "سُورَةُ ٱلْحُجُرَاتِ",
  50: "سُورَةُ قٓ",
  51: "سُورَةُ ٱلذَّارِيَاتِ",
  52: "سُورَةُ ٱلطُّورِ",
  53: "سُورَةُ ٱلنَّجْمِ",
  54: "سُورَةُ ٱلْقَمَرِ",
  55: "سُورَةُ ٱلرَّحْمَـٰنِ",
  56: "سُورَةُ ٱلْوَاقِعَةِ",
  57: "سُورَةُ ٱلْحَدِيدِ",
  58: "سُورَةُ ٱلْمُجَادَلَةِ",
  59: "سُورَةُ ٱلْحَشْرِ",
  60: "سُورَةُ ٱلْمُمْتَحَنَةِ",
  61: "سُورَةُ ٱلصَّفِّ",
  62: "سُورَةُ ٱلْجُمُعَةِ",
  63: "سُورَةُ ٱلْمُنَافِقُونَ",
  64: "سُورَةُ ٱلتَّغَابُنِ",
  65: "سُورَةُ ٱلطَّلَاقِ",
  66: "سُورَةُ ٱلتَّحْرِيمِ",
  67: "سُورَةُ ٱلْمُلْكِ",
  68: "سُورَةُ ٱلْقَلَمِ",
  69: "سُورَةُ ٱلْحَاقَّةِ",
  70: "سُورَةُ ٱلْمَعَارِجِ",
  71: "سُورَةُ نُوحٍ",
  72: "سُورَةُ ٱلْجِنِّ",
  73: "سُورَةُ ٱلْمُزَّمِّلِ",
  74: "سُورَةُ ٱلْمُدَّثِّرِ",
  75: "سُورَةُ ٱلْقِيَامَةِ",
  76: "سُورَةُ ٱلْإِنسَانِ",
  77: "سُورَةُ ٱلْمُرْسَلَاتِ",
  78: "سُورَةُ ٱلنَّبَإِ",
  79: "سُورَةُ ٱلنَّازِعَاتِ",
  80: "سُورَةُ عَبَسَ",
  81: "سُورَةُ ٱلتَّكْوِيرِ",
  82: "سُورَةُ ٱلْإِنفِطَارِ",
  83: "سُورَةُ ٱلْمُطَفِّفِينَ",
  84: "سُورَةُ ٱلْإِنشِقَاقِ",
  85: "سُورَةُ ٱلْبُرُوجِ",
  86: "سُورَةُ ٱلطَّارِقِ",
  87: "سُورَةُ ٱلْأَعْلَىٰ",
  88: "سُورَةُ ٱلْغَاشِيَةِ",
  89: "سُورَةُ ٱلْفَجْرِ",
  90: "سُورَةُ ٱلْبَلَدِ",
  91: "سُورَةُ ٱلشَّمْسِ",
  92: "سُورَةُ ٱللَّيْلِ",
  93: "سُورَةُ ٱلضُّحَىٰ",
  94: "سُورَةُ ٱلشَّرْحِ",
  95: "سُورَةُ ٱلتِّينِ",
  96: "سُورَةُ ٱلْعَلَقِ",
  97: "سُورَةُ ٱلْقَدْرِ",
  98: "سُورَةُ ٱلْبَيِّنَةِ",
  99: "سُورَةُ ٱلزَّلْزَلَةِ",
  100: "سُورَةُ ٱلْعَادِيَاتِ",
  101: "سُورَةُ ٱلْقَارِعَةِ",
  102: "سُورَةُ ٱلتَّكَاثُرِ",
  103: "سُورَةُ ٱلْعَصْرِ",
  104: "سُورَةُ ٱلْهُمَزَةِ",
  105: "سُورَةُ ٱلْفِيلِ",
  106: "سُورَةُ قُرَيْشٍ",
  107: "سُورَةُ ٱلْمَاعُونِ",
  108: "سُورَةُ ٱلْكَوْثَرِ",
  109: "سُورَةُ ٱلْكَافِرُونَ",
  110: "سُورَةُ ٱلنَّصْرِ",
  111: "سُورَةُ ٱلْمَسَدِ",
  112: "سُورَةُ ٱلْإِخْلَاصِ",
  113: "سُورَةُ ٱلْفَلَقِ",
  114: "سُورَةُ ٱلنَّاسِ",
};

const BASMALLAH_UTHMANI = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ";

// JUZ lookup by page
const JUZ_START_PAGES = [
  1, 22, 42, 62, 82, 102, 121, 142, 162, 182, 201, 222, 242, 262, 282, 302, 322,
  342, 362, 382, 402, 422, 442, 462, 482, 502, 522, 542, 562, 582,
];

function getJuzForPage(pageNumber: number): number {
  for (let i = JUZ_START_PAGES.length - 1; i >= 0; i--) {
    if (pageNumber >= JUZ_START_PAGES[i]) return i + 1;
  }
  return 1;
}

function getHizbForPage(pageNumber: number): number {
  return Math.ceil(pageNumber / 10);
}

// GitHub JSON types
interface GithubWord {
  location: string;
  word: string;
  qpcV2?: string;
  qpcV1?: string;
}

interface GithubLine {
  line: number;
  type: "surah-header" | "basmala" | "text";
  text?: string;
  surah?: string;
  words?: GithubWord[];
  qpcV2?: string;
  qpcV1?: string;
}

interface GithubPageData {
  page: number;
  lines: GithubLine[];
}

// MushafPage types (matching src/types/quran.ts)
interface MushafWord {
  id: number;
  text: string;
  textUthmani: string;
  surahNumber: number;
  ayahNumber: number;
  wordPosition: number;
  wordKey: string;
  lineNumber: number;
  pageNumber: number;
  isFirstInAyah: boolean;
  isLastInAyah: boolean;
  isAyahEnd: boolean;
  qpcV1?: string;
  qpcV2?: string;
}

interface MushafLine {
  lineNumber: number;
  pageNumber: number;
  lineType: string;
  words: MushafWord[];
  isCentered: boolean;
  surahNumber?: number;
}

interface MushafPage {
  pageNumber: number;
  lines: MushafLine[];
  surahsOnPage: number[];
  juz: number;
  hizb: number;
  edition: string;
}

function transformGithubToMushafPage(
  data: GithubPageData,
  pageNumber: number
): MushafPage {
  const lines: MushafLine[] = [];
  const surahsOnPage = new Set<number>();

  for (const githubLine of data.lines) {
    const lineNumber = githubLine.line;

    if (githubLine.type === "surah-header") {
      const surahNumber = parseInt(githubLine.surah || "0", 10);
      const headerText =
        githubLine.text || SURAH_NAMES[surahNumber] || `سورة ${surahNumber}`;
      surahsOnPage.add(surahNumber);

      lines.push({
        lineNumber,
        pageNumber,
        lineType: "surah_name",
        words: [
          {
            id: 0,
            text: headerText,
            textUthmani: headerText,
            surahNumber,
            ayahNumber: 0,
            wordPosition: 0,
            wordKey: `${surahNumber}:header`,
            lineNumber,
            pageNumber,
            isFirstInAyah: false,
            isLastInAyah: false,
            isAyahEnd: false,
          },
        ],
        isCentered: true,
        surahNumber,
      });
    } else if (githubLine.type === "basmala") {
      lines.push({
        lineNumber,
        pageNumber,
        lineType: "basmallah",
        words: [
          {
            id: 0,
            text: BASMALLAH_UTHMANI,
            textUthmani: BASMALLAH_UTHMANI,
            surahNumber: 0,
            ayahNumber: 0,
            wordPosition: 0,
            wordKey: "0:basmallah",
            lineNumber,
            pageNumber,
            isFirstInAyah: false,
            isLastInAyah: false,
            isAyahEnd: false,
            qpcV1: githubLine.qpcV1,
            qpcV2: githubLine.qpcV2,
          },
        ],
        isCentered: true,
        surahNumber: 0,
      });
    } else {
      // text line
      const words: MushafWord[] = [];
      if (githubLine.words) {
        for (let i = 0; i < githubLine.words.length; i++) {
          const gw = githubLine.words[i];
          const [surahStr, verseStr, wordStr] = gw.location.split(":");
          const surahNumber = parseInt(surahStr, 10);
          const ayahNumber = parseInt(verseStr, 10);
          const wordPosition = parseInt(wordStr, 10);
          surahsOnPage.add(surahNumber);

          const arabicNumeralPattern = /[\u0660-\u0669]+\s*$/;
          const hasAyahEndMarker = arabicNumeralPattern.test(gw.word);

          words.push({
            id: i,
            text: gw.word,
            textUthmani: gw.word,
            surahNumber,
            ayahNumber,
            wordPosition,
            wordKey: gw.location,
            lineNumber,
            pageNumber,
            isFirstInAyah: wordPosition === 1,
            isLastInAyah: hasAyahEndMarker,
            isAyahEnd: hasAyahEndMarker,
            qpcV1: gw.qpcV1,
            qpcV2: gw.qpcV2,
          });
        }
      }

      lines.push({
        lineNumber,
        pageNumber,
        lineType: "ayah",
        words,
        isCentered: false,
        surahNumber: words.length > 0 ? words[0].surahNumber : 0,
      });
    }
  }

  return {
    pageNumber,
    lines,
    surahsOnPage: Array.from(surahsOnPage).sort((a, b) => a - b),
    juz: getJuzForPage(pageNumber),
    hizb: getHizbForPage(pageNumber),
    edition: "madinah_1421",
  };
}

export async function seedPageLayouts(prisma: PrismaClient): Promise<void> {
  console.log("Seeding 604 page layouts...");

  const existing = await prisma.quranPageLayout.count();
  if (existing === 604) {
    console.log("  Already seeded (604 pages found). Skipping.");
    return;
  }

  // Find which pages are missing
  const existingPages = await prisma.quranPageLayout.findMany({
    select: { id: true },
  });
  const existingSet = new Set(existingPages.map((p) => p.id));
  const pagesToSeed: number[] = [];
  for (let i = 1; i <= 604; i++) {
    if (!existingSet.has(i)) pagesToSeed.push(i);
  }

  console.log(`  ${pagesToSeed.length} pages need fetching...`);

  let completed = 0;
  const total = pagesToSeed.length;

  await runConcurrent(pagesToSeed, 10, async (pageNumber) => {
    const paddedPage = pageNumber.toString().padStart(3, "0");
    const url = `${GITHUB_RAW_BASE}/page-${paddedPage}.json`;

    const githubData: GithubPageData = await withRetry(async () => {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP ${response.status} for page ${pageNumber}`);
      return response.json();
    });

    const mushafPage = transformGithubToMushafPage(githubData, pageNumber);

    await prisma.quranPageLayout.upsert({
      where: { id: pageNumber },
      update: {
        layout: mushafPage as unknown as Prisma.JsonObject,
        surahsOnPage: mushafPage.surahsOnPage,
        juz: mushafPage.juz,
        hizb: mushafPage.hizb,
        edition: "madinah_1421",
      },
      create: {
        id: pageNumber,
        layout: mushafPage as unknown as Prisma.JsonObject,
        surahsOnPage: mushafPage.surahsOnPage,
        juz: mushafPage.juz,
        hizb: mushafPage.hizb,
        edition: "madinah_1421",
      },
    });

    completed++;
    progressBar(completed, total, `pages fetched`);
  });

  const finalCount = await prisma.quranPageLayout.count();
  console.log(`  ✓ ${finalCount} page layouts seeded.`);
}
