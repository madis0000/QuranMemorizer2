"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Users } from "lucide-react";

import { useCircles } from "@/hooks/use-circles";
import { CircleCard } from "@/components/social/CircleCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CirclesPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"mine" | "discover">("mine");

  const { data: myCircles, isLoading: myLoading } = useCircles("mine", search);
  const { data: discoverCircles, isLoading: discoverLoading } = useCircles(
    "discover",
    search
  );

  const circles = activeTab === "mine" ? myCircles : discoverCircles;
  const isLoading = activeTab === "mine" ? myLoading : discoverLoading;

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Hifz Circles
            </h1>
            <p className="text-muted-foreground">
              Join study groups and memorize together
            </p>
          </div>
          <Button asChild>
            <Link href="/circles/create">
              <Plus className="h-4 w-4" />
              Create Circle
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search circles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab("mine")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "mine"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            My Circles
          </button>
          <button
            onClick={() => setActiveTab("discover")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "discover"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Discover
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-36 rounded-xl border animate-pulse bg-[#059669]/5 dark:bg-[#00E5A0]/5"
              />
            ))}
          </div>
        ) : circles && circles.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {circles.map((circle) => (
              <CircleCard
                key={circle.id}
                circle={circle}
                showJoinButton={activeTab === "discover"}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-[#059669]/30 dark:text-[#00E5A0]/30" />
            {activeTab === "mine" ? (
              <>
                <h3 className="text-lg font-medium mb-1">No circles yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create a circle or join an existing one to get started
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button asChild>
                    <Link href="/circles/create">Create Circle</Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("discover")}
                  >
                    Discover Circles
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium mb-1">
                  No circles to discover
                </h3>
                <p className="text-muted-foreground">
                  {search
                    ? "Try a different search term"
                    : "Be the first to create a public circle!"}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
