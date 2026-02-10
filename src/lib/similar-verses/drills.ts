/**
 * Similar Verse Drills — Practice exercises for mutashabihat
 *
 * 4 drill types to help Huffaz distinguish between confusable verse pairs.
 */

export type DrillType =
  | "continue"
  | "which_surah"
  | "spot_difference"
  | "complete_verse";

export interface Drill {
  type: DrillType;
  prompt: string;
  verseKey: string;
  pairVerseKey: string;
  options?: string[];
  correctAnswer: string;
}

export interface DrillResult {
  correct: boolean;
  score: number;
  timeSpent: number;
}

/**
 * Generate a drill for a similar verse pair
 */
export function generateDrill(
  pair: {
    verse1Key: string;
    verse2Key: string;
    similarity: number;
    category: string;
  },
  verse1Text: string,
  verse2Text: string,
  drillType?: DrillType
): Drill {
  const type = drillType ?? pickDrillType(pair.category);

  switch (type) {
    case "continue":
      return generateContinueDrill(pair, verse1Text, verse2Text);
    case "which_surah":
      return generateWhichSurahDrill(pair, verse1Text, verse2Text);
    case "spot_difference":
      return generateSpotDifferenceDrill(pair, verse1Text, verse2Text);
    case "complete_verse":
      return generateCompleteVerseDrill(pair, verse1Text, verse2Text);
    default:
      return generateContinueDrill(pair, verse1Text, verse2Text);
  }
}

function pickDrillType(category: string): DrillType {
  switch (category) {
    case "near_identical":
      return "spot_difference";
    case "similar_opening":
      return "continue";
    case "similar_ending":
      return "complete_verse";
    default:
      return "which_surah";
  }
}

/**
 * Continue drill: Given the start of a verse, recite the correct continuation
 */
function generateContinueDrill(
  pair: { verse1Key: string; verse2Key: string },
  verse1Text: string,
  verse2Text: string
): Drill {
  const words1 = verse1Text.split(/\s+/);
  const cutPoint = Math.max(2, Math.floor(words1.length * 0.4));
  const prompt = words1.slice(0, cutPoint).join(" ") + " ...";
  const correctContinuation = words1.slice(cutPoint).join(" ");
  const wrongContinuation = verse2Text.split(/\s+/).slice(cutPoint).join(" ");

  return {
    type: "continue",
    prompt,
    verseKey: pair.verse1Key,
    pairVerseKey: pair.verse2Key,
    options: [correctContinuation, wrongContinuation],
    correctAnswer: correctContinuation,
  };
}

/**
 * Which surah drill: Given a verse, identify which surah it belongs to
 */
function generateWhichSurahDrill(
  pair: { verse1Key: string; verse2Key: string },
  verse1Text: string,
  _verse2Text: string
): Drill {
  const [surah1] = pair.verse1Key.split(":");
  const [surah2] = pair.verse2Key.split(":");

  return {
    type: "which_surah",
    prompt: verse1Text,
    verseKey: pair.verse1Key,
    pairVerseKey: pair.verse2Key,
    options: [`Surah ${surah1}`, `Surah ${surah2}`],
    correctAnswer: `Surah ${surah1}`,
  };
}

/**
 * Spot difference drill: Two similar verses shown, identify the different words
 */
function generateSpotDifferenceDrill(
  pair: { verse1Key: string; verse2Key: string },
  verse1Text: string,
  verse2Text: string
): Drill {
  return {
    type: "spot_difference",
    prompt: `${verse1Text}\n---\n${verse2Text}`,
    verseKey: pair.verse1Key,
    pairVerseKey: pair.verse2Key,
    correctAnswer: pair.verse1Key,
  };
}

/**
 * Complete verse drill: Given the ending, identify which verse it belongs to
 */
function generateCompleteVerseDrill(
  pair: { verse1Key: string; verse2Key: string },
  verse1Text: string,
  verse2Text: string
): Drill {
  const words1 = verse1Text.split(/\s+/);
  const cutPoint = Math.max(words1.length - 3, Math.floor(words1.length * 0.6));
  const ending = words1.slice(cutPoint).join(" ");

  return {
    type: "complete_verse",
    prompt: "... " + ending,
    verseKey: pair.verse1Key,
    pairVerseKey: pair.verse2Key,
    options: [pair.verse1Key, pair.verse2Key],
    correctAnswer: pair.verse1Key,
  };
}

/**
 * Score a drill answer
 */
export function scoreDrillAnswer(
  drill: Drill,
  userAnswer: string,
  timeSpent: number
): DrillResult {
  const correct = userAnswer === drill.correctAnswer;

  // Base score
  let score = correct ? 100 : 0;

  // Time bonus: under 5 seconds = full bonus, decays after
  if (correct && timeSpent < 5000) {
    score += 50;
  } else if (correct && timeSpent < 10000) {
    score += 25;
  }

  return { correct, score, timeSpent };
}
