/**
 * Pre-computed common mutashabihat (similar verse) pairs
 *
 * These are well-known confusable verse pairs that Huffaz commonly mix up.
 * Format: [verse1Key, verse2Key, similarity, category]
 */

export interface SeedPair {
  verse1Key: string;
  verse2Key: string;
  similarity: number;
  category:
    | "near_identical"
    | "similar_opening"
    | "similar_ending"
    | "thematic";
}

export const SIMILAR_VERSE_PAIRS: SeedPair[] = [
  // Near-identical pairs
  {
    verse1Key: "2:35",
    verse2Key: "7:19",
    similarity: 0.92,
    category: "near_identical",
  },
  {
    verse1Key: "2:58",
    verse2Key: "7:161",
    similarity: 0.88,
    category: "near_identical",
  },
  {
    verse1Key: "2:136",
    verse2Key: "3:84",
    similarity: 0.91,
    category: "near_identical",
  },
  {
    verse1Key: "2:164",
    verse2Key: "45:5",
    similarity: 0.82,
    category: "similar_opening",
  },
  {
    verse1Key: "2:275",
    verse2Key: "4:161",
    similarity: 0.72,
    category: "thematic",
  },
  {
    verse1Key: "3:3",
    verse2Key: "5:48",
    similarity: 0.75,
    category: "similar_opening",
  },
  {
    verse1Key: "3:113",
    verse2Key: "3:114",
    similarity: 0.73,
    category: "similar_opening",
  },
  {
    verse1Key: "3:133",
    verse2Key: "57:21",
    similarity: 0.78,
    category: "similar_opening",
  },
  {
    verse1Key: "2:60",
    verse2Key: "7:160",
    similarity: 0.85,
    category: "near_identical",
  },
  {
    verse1Key: "2:61",
    verse2Key: "3:112",
    similarity: 0.76,
    category: "similar_opening",
  },

  // Similar opening pairs
  {
    verse1Key: "6:95",
    verse2Key: "10:34",
    similarity: 0.74,
    category: "similar_opening",
  },
  {
    verse1Key: "6:99",
    verse2Key: "16:11",
    similarity: 0.71,
    category: "thematic",
  },
  {
    verse1Key: "7:26",
    verse2Key: "7:27",
    similarity: 0.72,
    category: "similar_opening",
  },
  {
    verse1Key: "7:73",
    verse2Key: "11:61",
    similarity: 0.83,
    category: "near_identical",
  },
  {
    verse1Key: "7:85",
    verse2Key: "11:84",
    similarity: 0.87,
    category: "near_identical",
  },
  {
    verse1Key: "11:25",
    verse2Key: "23:23",
    similarity: 0.85,
    category: "near_identical",
  },
  {
    verse1Key: "11:50",
    verse2Key: "46:21",
    similarity: 0.79,
    category: "similar_opening",
  },
  {
    verse1Key: "14:42",
    verse2Key: "71:4",
    similarity: 0.71,
    category: "similar_ending",
  },
  {
    verse1Key: "16:68",
    verse2Key: "16:69",
    similarity: 0.71,
    category: "similar_opening",
  },
  {
    verse1Key: "18:7",
    verse2Key: "67:2",
    similarity: 0.72,
    category: "thematic",
  },

  // Repeated story pairs (prophets)
  {
    verse1Key: "7:59",
    verse2Key: "11:25",
    similarity: 0.84,
    category: "near_identical",
  },
  {
    verse1Key: "7:65",
    verse2Key: "11:50",
    similarity: 0.81,
    category: "near_identical",
  },
  {
    verse1Key: "7:73",
    verse2Key: "27:45",
    similarity: 0.74,
    category: "similar_opening",
  },
  {
    verse1Key: "26:105",
    verse2Key: "26:123",
    similarity: 0.93,
    category: "near_identical",
  },
  {
    verse1Key: "26:141",
    verse2Key: "26:160",
    similarity: 0.92,
    category: "near_identical",
  },
  {
    verse1Key: "26:176",
    verse2Key: "26:160",
    similarity: 0.85,
    category: "near_identical",
  },
  {
    verse1Key: "37:75",
    verse2Key: "54:10",
    similarity: 0.72,
    category: "similar_opening",
  },

  // Similar ending pairs (fawasil)
  {
    verse1Key: "2:163",
    verse2Key: "59:22",
    similarity: 0.75,
    category: "similar_ending",
  },
  {
    verse1Key: "2:255",
    verse2Key: "3:2",
    similarity: 0.71,
    category: "similar_opening",
  },
  {
    verse1Key: "3:18",
    verse2Key: "59:23",
    similarity: 0.73,
    category: "similar_ending",
  },
  {
    verse1Key: "4:11",
    verse2Key: "4:12",
    similarity: 0.78,
    category: "similar_opening",
  },
  {
    verse1Key: "6:1",
    verse2Key: "35:1",
    similarity: 0.77,
    category: "similar_opening",
  },
  {
    verse1Key: "6:12",
    verse2Key: "6:20",
    similarity: 0.72,
    category: "similar_ending",
  },
  {
    verse1Key: "9:51",
    verse2Key: "64:11",
    similarity: 0.73,
    category: "thematic",
  },

  // Thematic pairs
  {
    verse1Key: "2:21",
    verse2Key: "4:1",
    similarity: 0.71,
    category: "similar_opening",
  },
  {
    verse1Key: "2:183",
    verse2Key: "2:178",
    similarity: 0.72,
    category: "similar_opening",
  },
  {
    verse1Key: "3:26",
    verse2Key: "3:27",
    similarity: 0.75,
    category: "similar_opening",
  },
  {
    verse1Key: "5:3",
    verse2Key: "6:145",
    similarity: 0.73,
    category: "thematic",
  },
  {
    verse1Key: "13:3",
    verse2Key: "16:10",
    similarity: 0.72,
    category: "thematic",
  },
  {
    verse1Key: "20:25",
    verse2Key: "28:33",
    similarity: 0.76,
    category: "similar_opening",
  },
  {
    verse1Key: "21:87",
    verse2Key: "37:143",
    similarity: 0.74,
    category: "similar_opening",
  },
  {
    verse1Key: "23:12",
    verse2Key: "32:7",
    similarity: 0.72,
    category: "similar_opening",
  },
  {
    verse1Key: "39:53",
    verse2Key: "12:87",
    similarity: 0.71,
    category: "thematic",
  },
  {
    verse1Key: "40:60",
    verse2Key: "2:186",
    similarity: 0.72,
    category: "thematic",
  },
  {
    verse1Key: "41:30",
    verse2Key: "46:13",
    similarity: 0.78,
    category: "similar_opening",
  },

  // Short surah confusables (Juz Amma)
  {
    verse1Key: "93:1",
    verse2Key: "91:1",
    similarity: 0.71,
    category: "similar_opening",
  },
  {
    verse1Key: "94:5",
    verse2Key: "94:6",
    similarity: 0.95,
    category: "near_identical",
  },
  {
    verse1Key: "99:1",
    verse2Key: "99:2",
    similarity: 0.71,
    category: "similar_opening",
  },
  {
    verse1Key: "102:1",
    verse2Key: "102:2",
    similarity: 0.72,
    category: "similar_opening",
  },
  {
    verse1Key: "103:1",
    verse2Key: "95:1",
    similarity: 0.71,
    category: "similar_opening",
  },
  {
    verse1Key: "111:1",
    verse2Key: "111:3",
    similarity: 0.72,
    category: "similar_ending",
  },
  {
    verse1Key: "113:1",
    verse2Key: "114:1",
    similarity: 0.85,
    category: "near_identical",
  },
];
