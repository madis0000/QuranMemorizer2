/**
 * Seed Similar Verse Pairs
 *
 * No external API needed — purely computational.
 * Loads all 6,236 ayah texts, runs Jaccard similarity,
 * and writes pairs to SimilarVersePair table.
 */
import { Prisma, type PrismaClient } from "@prisma/client";

// Inline Arabic normalization (seed can't use @/ paths)
function normalizeArabic(text: string): string {
  return (
    text
      // Remove diacritics (tashkeel)
      .replace(/[\u064B-\u065F\u0670]/g, "")
      // Normalize Alef variants to plain Alef
      .replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627")
      // Normalize Teh Marbuta to Heh
      .replace(/\u0629/g, "\u0647")
      // Normalize Alef Maksura to Yeh
      .replace(/\u0649/g, "\u064A")
      // Remove Tatweel
      .replace(/\u0640/g, "")
      // Collapse whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}

function tokenizeVerse(text: string): string[] {
  return normalizeArabic(text)
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

function jaccardSimilarity(words1: string[], words2: string[]): number {
  const set1 = new Set(words1);
  const set2 = new Set(words2);

  let intersection = 0;
  for (const word of set1) {
    if (set2.has(word)) intersection++;
  }

  const union = set1.size + set2.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function classifyOverlap(
  words1: string[],
  words2: string[],
  similarity: number
): string {
  if (similarity >= 0.9) return "near_identical";

  const minLen = Math.min(words1.length, words2.length);
  const checkLen = Math.min(3, minLen);

  let openingMatch = 0;
  for (let i = 0; i < checkLen; i++) {
    if (words1[i] === words2[i]) openingMatch++;
  }

  let endingMatch = 0;
  for (let i = 0; i < checkLen; i++) {
    if (words1[words1.length - 1 - i] === words2[words2.length - 1 - i]) {
      endingMatch++;
    }
  }

  if (openingMatch >= 2) return "similar_opening";
  if (endingMatch >= 2) return "similar_ending";
  return "thematic";
}

function highlightDifferences(
  words1: string[],
  words2: string[]
): { verse1Only: string[]; verse2Only: string[] } {
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  return {
    verse1Only: words1.filter((w) => !set2.has(w)),
    verse2Only: words2.filter((w) => !set1.has(w)),
  };
}

export async function seedSimilarVerses(prisma: PrismaClient): Promise<void> {
  console.log("Computing similar verse pairs...");

  const existing = await prisma.similarVersePair.count();
  if (existing >= 100) {
    console.log(`  Already seeded (${existing} pairs found). Skipping.`);
    return;
  }

  // Load all ayah texts
  const ayahs = await prisma.quranAyah.findMany({
    select: { surahNumber: true, numberInSurah: true, text: true },
    orderBy: [{ surahNumber: "asc" }, { numberInSurah: "asc" }],
  });

  if (ayahs.length === 0) {
    throw new Error("No ayahs found. Run seed-ayahs first.");
  }

  console.log(`  Loaded ${ayahs.length} ayahs. Tokenizing...`);

  // Precompute tokenized forms
  const entries: Array<{
    key: string;
    words: string[];
  }> = [];

  for (const ayah of ayahs) {
    const key = `${ayah.surahNumber}:${ayah.numberInSurah}`;
    const words = tokenizeVerse(ayah.text);
    // Skip very short verses (< 3 words) — too many false positives
    if (words.length >= 3) {
      entries.push({ key, words });
    }
  }

  console.log(
    `  ${entries.length} verses with 3+ words. Running O(n²) comparison...`
  );

  const threshold = 0.7;
  const pairs: Array<{
    verse1Key: string;
    verse2Key: string;
    similarity: number;
    diffWords: Prisma.InputJsonValue;
    category: string;
  }> = [];

  const totalComparisons = (entries.length * (entries.length - 1)) / 2;
  let comparisons = 0;
  let lastLog = Date.now();

  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      comparisons++;

      // Progress log every 5 seconds
      if (Date.now() - lastLog > 5000) {
        const pct = ((comparisons / totalComparisons) * 100).toFixed(1);
        process.stdout.write(
          `\r  ${pct}% compared (${pairs.length} pairs found so far)`
        );
        lastLog = Date.now();
      }

      const a = entries[i];
      const b = entries[j];

      // Quick length filter
      const lenRatio =
        Math.min(a.words.length, b.words.length) /
        Math.max(a.words.length, b.words.length);
      if (lenRatio < 0.5) continue;

      const similarity = jaccardSimilarity(a.words, b.words);
      if (similarity >= threshold) {
        const diffWords = highlightDifferences(a.words, b.words);
        const category = classifyOverlap(a.words, b.words, similarity);
        pairs.push({
          verse1Key: a.key,
          verse2Key: b.key,
          similarity: Math.round(similarity * 1000) / 1000,
          diffWords: diffWords as unknown as Prisma.InputJsonValue,
          category,
        });
      }
    }
  }

  console.log(
    `\n  Found ${pairs.length} similar pairs. Writing to database...`
  );

  // Clear and re-insert
  await prisma.similarVersePair.deleteMany({});

  // Insert in batches
  for (let i = 0; i < pairs.length; i += 500) {
    await prisma.similarVersePair.createMany({
      data: pairs.slice(i, i + 500),
      skipDuplicates: true,
    });
  }

  const finalCount = await prisma.similarVersePair.count();
  console.log(`  ✓ ${finalCount} similar verse pairs seeded.`);
}
