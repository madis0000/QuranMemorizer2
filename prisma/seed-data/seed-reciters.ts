/**
 * Seed Reciters Data
 *
 * Seeds 8 popular reciters from static POPULAR_RECITERS constant.
 */
import type { PrismaClient } from "@prisma/client";

const AUDIO_CDN_BASE = "https://cdn.islamic.network/quran/audio";

const RECITERS = [
  {
    id: "ar.alafasy",
    name: "Mishary Rashid Alafasy",
    englishName: "Mishary Rashid Alafasy",
    arabicName: "مشاري راشد العفاسي",
    style: "Murattal",
    bitrate: 128,
    baseUrl: `${AUDIO_CDN_BASE}/128/ar.alafasy`,
  },
  {
    id: "ar.abdulbasitmurattal",
    name: "Abdul Basit Abdul Samad",
    englishName: "Abdul Basit Abdul Samad (Murattal)",
    arabicName: "عبد الباسط عبد الصمد",
    style: "Murattal",
    bitrate: 192,
    baseUrl: `${AUDIO_CDN_BASE}/192/ar.abdulbasitmurattal`,
  },
  {
    id: "ar.abdurrahmaansudais",
    name: "Abdur Rahman As-Sudais",
    englishName: "Abdur Rahman As-Sudais",
    arabicName: "عبدالرحمن السديس",
    style: "Murattal",
    bitrate: 192,
    baseUrl: `${AUDIO_CDN_BASE}/192/ar.abdurrahmaansudais`,
  },
  {
    id: "ar.saabormahmoudkhalilalhos",
    name: "Mahmoud Khalil Al-Hussary",
    englishName: "Mahmoud Khalil Al-Hussary",
    arabicName: "محمود خليل الحصري",
    style: "Murattal",
    bitrate: 128,
    baseUrl: `${AUDIO_CDN_BASE}/128/ar.husary`,
  },
  {
    id: "ar.minshawi",
    name: "Mohamed Siddiq El-Minshawi",
    englishName: "Mohamed Siddiq El-Minshawi",
    arabicName: "محمد صديق المنشاوي",
    style: "Murattal",
    bitrate: 128,
    baseUrl: `${AUDIO_CDN_BASE}/128/ar.minshawi`,
  },
  {
    id: "ar.muhammadayyoub",
    name: "Muhammad Ayyub",
    englishName: "Muhammad Ayyub",
    arabicName: "محمد أيوب",
    style: "Murattal",
    bitrate: 128,
    baseUrl: `${AUDIO_CDN_BASE}/128/ar.muhammadayyoub`,
  },
  {
    id: "ar.ahmedajamy",
    name: "Ahmed ibn Ali al-Ajamy",
    englishName: "Ahmed ibn Ali al-Ajamy",
    arabicName: "أحمد بن علي العجمي",
    style: "Murattal",
    bitrate: 128,
    baseUrl: `${AUDIO_CDN_BASE}/128/ar.ahmedajamy`,
  },
  {
    id: "ar.maabormahmoudkhalilalhos",
    name: "Mahmoud Khalil Al-Hussary (Mujawwad)",
    englishName: "Mahmoud Khalil Al-Hussary (Mujawwad)",
    arabicName: "محمود خليل الحصري - مجوّد",
    style: "Mujawwad",
    bitrate: 128,
    baseUrl: `${AUDIO_CDN_BASE}/128/ar.husarymujawwad`,
  },
];

export async function seedReciters(prisma: PrismaClient): Promise<void> {
  console.log("Seeding 8 reciters...");

  const existing = await prisma.quranReciter.count();
  if (existing === RECITERS.length) {
    console.log("  Already seeded (8 reciters found). Skipping.");
    return;
  }

  for (const reciter of RECITERS) {
    await prisma.quranReciter.upsert({
      where: { id: reciter.id },
      update: reciter,
      create: reciter,
    });
  }

  console.log("  ✓ 8 reciters seeded.");
}
