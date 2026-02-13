/**
 * Seed Juz Data
 *
 * Seeds 30 juz from static JUZ_INFO constant.
 */
import type { PrismaClient } from "@prisma/client";

const JUZ_DATA = [
  {
    number: 1,
    name: "Alif Lam Meem",
    nameArabic: "ألم",
    startSurah: 1,
    startAyah: 1,
    startPage: 1,
  },
  {
    number: 2,
    name: "Sayaqool",
    nameArabic: "سيقول",
    startSurah: 2,
    startAyah: 142,
    startPage: 22,
  },
  {
    number: 3,
    name: "Tilkar Rusul",
    nameArabic: "تلك الرسل",
    startSurah: 2,
    startAyah: 253,
    startPage: 42,
  },
  {
    number: 4,
    name: "Lan Tanaloo",
    nameArabic: "لن تنالوا",
    startSurah: 3,
    startAyah: 93,
    startPage: 62,
  },
  {
    number: 5,
    name: "Wal Mohsanat",
    nameArabic: "والمحصنات",
    startSurah: 4,
    startAyah: 24,
    startPage: 82,
  },
  {
    number: 6,
    name: "La Yuhibbullah",
    nameArabic: "لا يحب الله",
    startSurah: 4,
    startAyah: 148,
    startPage: 102,
  },
  {
    number: 7,
    name: "Wa Iza Samiu",
    nameArabic: "وإذا سمعوا",
    startSurah: 5,
    startAyah: 83,
    startPage: 121,
  },
  {
    number: 8,
    name: "Wa Lau Annana",
    nameArabic: "ولو أننا",
    startSurah: 6,
    startAyah: 111,
    startPage: 142,
  },
  {
    number: 9,
    name: "Qalal Malao",
    nameArabic: "قال الملأ",
    startSurah: 7,
    startAyah: 88,
    startPage: 162,
  },
  {
    number: 10,
    name: "Wa A'lamu",
    nameArabic: "واعلموا",
    startSurah: 8,
    startAyah: 41,
    startPage: 182,
  },
  {
    number: 11,
    name: "Ya'taziroon",
    nameArabic: "يعتذرون",
    startSurah: 9,
    startAyah: 94,
    startPage: 201,
  },
  {
    number: 12,
    name: "Wa Ma Min Dabbah",
    nameArabic: "وما من دابة",
    startSurah: 11,
    startAyah: 6,
    startPage: 222,
  },
  {
    number: 13,
    name: "Wa Ma Ubarrio",
    nameArabic: "وما أبرئ",
    startSurah: 12,
    startAyah: 53,
    startPage: 242,
  },
  {
    number: 14,
    name: "Rubama",
    nameArabic: "ربما",
    startSurah: 15,
    startAyah: 2,
    startPage: 262,
  },
  {
    number: 15,
    name: "Subhanallazi",
    nameArabic: "سبحان الذي",
    startSurah: 17,
    startAyah: 1,
    startPage: 282,
  },
  {
    number: 16,
    name: "Qal Alam",
    nameArabic: "قال ألم",
    startSurah: 18,
    startAyah: 75,
    startPage: 302,
  },
  {
    number: 17,
    name: "Iqtaraba",
    nameArabic: "اقترب",
    startSurah: 21,
    startAyah: 1,
    startPage: 322,
  },
  {
    number: 18,
    name: "Qad Aflaha",
    nameArabic: "قد أفلح",
    startSurah: 23,
    startAyah: 1,
    startPage: 342,
  },
  {
    number: 19,
    name: "Wa Qalallazina",
    nameArabic: "وقال الذين",
    startSurah: 25,
    startAyah: 21,
    startPage: 362,
  },
  {
    number: 20,
    name: "A'man Khalaq",
    nameArabic: "أمن خلق",
    startSurah: 27,
    startAyah: 56,
    startPage: 382,
  },
  {
    number: 21,
    name: "Utlu Ma Oohi",
    nameArabic: "اتل ما أوحي",
    startSurah: 29,
    startAyah: 46,
    startPage: 402,
  },
  {
    number: 22,
    name: "Wa Man Yaqnut",
    nameArabic: "ومن يقنت",
    startSurah: 33,
    startAyah: 31,
    startPage: 422,
  },
  {
    number: 23,
    name: "Wa Mali",
    nameArabic: "وما لي",
    startSurah: 36,
    startAyah: 22,
    startPage: 442,
  },
  {
    number: 24,
    name: "Fa Man Azlam",
    nameArabic: "فمن أظلم",
    startSurah: 39,
    startAyah: 32,
    startPage: 462,
  },
  {
    number: 25,
    name: "Ilaihi Yurad",
    nameArabic: "إليه يرد",
    startSurah: 41,
    startAyah: 47,
    startPage: 482,
  },
  {
    number: 26,
    name: "Ha Meem",
    nameArabic: "حم",
    startSurah: 46,
    startAyah: 1,
    startPage: 502,
  },
  {
    number: 27,
    name: "Qala Fa Ma Khatbukum",
    nameArabic: "قال فما خطبكم",
    startSurah: 51,
    startAyah: 31,
    startPage: 522,
  },
  {
    number: 28,
    name: "Qad Sami Allah",
    nameArabic: "قد سمع الله",
    startSurah: 58,
    startAyah: 1,
    startPage: 542,
  },
  {
    number: 29,
    name: "Tabarakallazi",
    nameArabic: "تبارك الذي",
    startSurah: 67,
    startAyah: 1,
    startPage: 562,
  },
  {
    number: 30,
    name: "Amma",
    nameArabic: "عم",
    startSurah: 78,
    startAyah: 1,
    startPage: 582,
  },
];

export async function seedJuz(prisma: PrismaClient): Promise<void> {
  console.log("Seeding 30 juz...");

  const existing = await prisma.quranJuz.count();
  if (existing === 30) {
    console.log("  Already seeded (30 juz found). Skipping.");
    return;
  }

  for (const juz of JUZ_DATA) {
    await prisma.quranJuz.upsert({
      where: { number: juz.number },
      update: juz,
      create: juz,
    });
  }

  console.log("  ✓ 30 juz seeded.");
}
