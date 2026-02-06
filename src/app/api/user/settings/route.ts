import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Default settings returned when user has no saved settings
const DEFAULT_SETTINGS = {
  display: {
    theme: "system" as const,
    mushafEdition: "madinah_1421",
    fontSize: 28,
    showTajweed: true,
    showTranslation: false,
    translationLanguage: "en",
    showTransliteration: false,
  },
  audio: {
    preferredReciter: "ar.alafasy",
    playbackSpeed: 1.0,
    autoPlay: false,
    repeatMode: "none" as const,
  },
  memorization: {
    revealMode: "word" as const,
    mistakeSensitivity: "normal" as const,
    autoRecord: false,
  },
  notifications: {
    dailyReminder: true,
    reminderTime: "08:00",
    streakReminder: true,
    goalReminder: true,
  },
};

// GET /api/user/settings - Return user's settings
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { settings: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return stored settings or defaults
    const settings = user.settings ?? DEFAULT_SETTINGS;

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/user/settings - Update user settings (JSON merge)
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Request body must be a JSON object" },
        { status: 400 }
      );
    }

    // Fetch current user settings
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { settings: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Deep merge incoming settings with existing settings
    const existingSettings =
      (user.settings as Record<string, unknown>) ?? DEFAULT_SETTINGS;
    const mergedSettings = deepMerge(existingSettings, body);

    // Build update data
    const updateData: Record<string, unknown> = {
      settings: mergedSettings,
    };

    // If language was changed in display settings, also update preferredLanguage on user
    if (
      body.display &&
      typeof body.display === "object" &&
      "translationLanguage" in body.display
    ) {
      updateData.preferredLanguage = body.display.translationLanguage;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { settings: true, preferredLanguage: true },
    });

    return NextResponse.json({ settings: updatedUser.settings });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Deep merge two objects. Values from the source override target values.
 * Nested objects are merged recursively; arrays and primitives are replaced.
 */
function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): Record<string, unknown> {
  const result = { ...target };

  for (const key of Object.keys(source)) {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
      result[key] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      );
    } else {
      result[key] = sourceValue;
    }
  }

  return result;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
