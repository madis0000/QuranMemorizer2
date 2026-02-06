"use client";

import { useAudioStore, useQuranStore, useUserStore } from "@/stores";
import {
  Bell,
  BookOpen,
  Monitor,
  Moon,
  Palette,
  Settings,
  Sun,
  User,
  Volume2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const { settings, updateSettings, setTheme } = useUserStore();
  const { fontSize, setFontSize, mushafEdition, setMushafEdition } =
    useQuranStore();
  const { playbackSpeed, setPlaybackSpeed } = useAudioStore();

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  const editions = [
    { value: "madinah_1421", label: "Madinah 1421H" },
    { value: "madinah_1441", label: "Madinah 1441H" },
    { value: "madinah_1405", label: "Madinah 1405H" },
    { value: "indopak_15", label: "IndoPak 15 Lines" },
    { value: "indopak_13", label: "IndoPak 13 Lines" },
  ] as const;

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground">
            Customize your QuranMemorizer experience
          </p>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selection */}
              <div>
                <Label className="mb-3 block">Theme</Label>
                <div className="flex gap-2">
                  {themes.map((theme) => (
                    <Button
                      key={theme.value}
                      variant={
                        settings.theme === theme.value ? "default" : "outline"
                      }
                      onClick={() => setTheme(theme.value)}
                      className="flex-1"
                    >
                      <theme.icon className="mr-2 h-4 w-4" />
                      {theme.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Arabic Font Size</Label>
                  <span className="text-sm text-muted-foreground">
                    {fontSize}px
                  </span>
                </div>
                <Slider
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  min={16}
                  max={48}
                  step={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Quran Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Quran Display
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mushaf Edition */}
              <div>
                <Label className="mb-3 block">Mushaf Edition</Label>
                <div className="grid grid-cols-2 gap-2">
                  {editions.map((edition) => (
                    <Button
                      key={edition.value}
                      variant={
                        mushafEdition === edition.value ? "default" : "outline"
                      }
                      onClick={() => setMushafEdition(edition.value)}
                      className="justify-start"
                    >
                      {edition.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Translation Language */}
              <div>
                <Label className="mb-3 block">Translation Language</Label>
                <select className="w-full border border-border rounded-md px-3 py-2 bg-background">
                  <option value="en">English</option>
                  <option value="ur">Urdu</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                  <option value="id">Indonesian</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Audio Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Audio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Playback Speed */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Default Playback Speed</Label>
                  <span className="text-sm text-muted-foreground">
                    {playbackSpeed}x
                  </span>
                </div>
                <Slider
                  value={[playbackSpeed * 100]}
                  onValueChange={(value) => setPlaybackSpeed(value[0] / 100)}
                  min={50}
                  max={200}
                  step={25}
                />
              </div>

              {/* Sound Effects */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>Sound Effects</Label>
                  <p className="text-sm text-muted-foreground">
                    Play sounds for achievements and notifications
                  </p>
                </div>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) =>
                    updateSettings({ soundEnabled: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Daily Reminder</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminded to practice daily
                  </p>
                </div>
                <Switch
                  checked={settings.dailyReminder}
                  onCheckedChange={(checked) =>
                    updateSettings({ dailyReminder: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Streak Reminder</Label>
                  <p className="text-sm text-muted-foreground">
                    Don&apos;t lose your streak!
                  </p>
                </div>
                <Switch
                  checked={settings.streakReminder}
                  onCheckedChange={(checked) =>
                    updateSettings({ streakReminder: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Goal Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Reminders about your goals
                  </p>
                </div>
                <Switch
                  checked={settings.goalReminder}
                  onCheckedChange={(checked) =>
                    updateSettings({ goalReminder: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Account */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Manage Account
              </Button>
              <Button variant="outline" className="w-full text-destructive">
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
