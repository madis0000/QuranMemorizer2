"use client";

import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";

import { CreateCircleForm } from "@/components/social/CreateCircleForm";

export default function CreateCirclePage() {
  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-xl mx-auto">
        {/* Back link */}
        <Link
          href="/circles"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Circles
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            New Hifz Circle
          </h1>
          <p className="text-muted-foreground mt-1">
            Set up your memorization study group
          </p>
        </div>

        <CreateCircleForm />
      </div>
    </div>
  );
}
