"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Copy,
  Flame,
  LogOut,
  Settings,
  Trash2,
  Users,
} from "lucide-react";

import {
  useCircle,
  useDeleteCircle,
  useJoinCircle,
  useLeaveCircle,
} from "@/hooks/use-circles";
import { CircleActivityFeed } from "@/components/social/CircleActivityFeed";
import { CircleChallenge } from "@/components/social/CircleChallenge";
import { CircleMemberList } from "@/components/social/CircleMemberList";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CircleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: circle, isLoading, error } = useCircle(id);
  const leaveCircle = useLeaveCircle();
  const deleteCircle = useDeleteCircle();
  const joinCircle = useJoinCircle();
  const [codeCopied, setCodeCopied] = useState(false);

  const handleCopyInviteCode = () => {
    if (circle?.inviteCode) {
      navigator.clipboard.writeText(circle.inviteCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const handleLeave = () => {
    if (confirm("Are you sure you want to leave this circle?")) {
      leaveCircle.mutate(id, {
        onSuccess: () => router.push("/circles"),
      });
    }
  };

  const handleDelete = () => {
    if (
      confirm(
        "Are you sure you want to delete this circle? This action cannot be undone."
      )
    ) {
      deleteCircle.mutate(id, {
        onSuccess: () => router.push("/circles"),
      });
    }
  };

  const handleJoin = () => {
    joinCircle.mutate({ circleId: id });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-4" />
          <div className="h-4 w-96 bg-muted rounded animate-pulse mb-8" />
          <div className="h-64 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !circle) {
    return (
      <div className="min-h-screen p-4 lg:p-8">
        <div className="max-w-4xl mx-auto text-center py-16">
          <h2 className="text-xl font-bold mb-2">Circle not found</h2>
          <p className="text-muted-foreground mb-4">
            This circle may have been deleted or you do not have access.
          </p>
          <Button asChild variant="outline">
            <Link href="/circles">Back to Circles</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/circles"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Circles
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">{circle.name}</h1>
            {circle.description && (
              <p className="text-muted-foreground mt-1">{circle.description}</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {circle.memberCount} member{circle.memberCount !== 1 ? "s" : ""}
              </span>
              {circle.groupStreak > 0 && (
                <span className="flex items-center gap-1">
                  <Flame className="h-4 w-4 text-orange-500" />
                  {circle.groupStreak} group streak
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!circle.isMember && circle.isPublic && (
              <Button onClick={handleJoin} disabled={joinCircle.isPending}>
                {joinCircle.isPending ? "Joining..." : "Join Circle"}
              </Button>
            )}
            {circle.isMember && circle.inviteCode && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyInviteCode}
              >
                {codeCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {codeCopied ? "Copied!" : "Invite Code"}
              </Button>
            )}
            {circle.myRole === "OWNER" && (
              <>
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/circles/${id}`} title="Settings">
                    <Settings className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDelete}
                  className="text-destructive hover:text-destructive"
                  title="Delete circle"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            {circle.isMember && circle.myRole !== "OWNER" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLeave}
                disabled={leaveCircle.isPending}
              >
                <LogOut className="h-4 w-4" />
                Leave
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="members">
          <TabsList>
            <TabsTrigger value="members">
              Members ({circle.memberCount})
            </TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="mt-4">
            <CircleMemberList
              members={circle.members}
              circleId={id}
              myRole={circle.myRole}
            />
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <CircleActivityFeed activities={circle.recentActivity} />
          </TabsContent>

          <TabsContent value="challenges" className="mt-4">
            {circle.activeChallenge ? (
              <div className="space-y-4">
                <CircleChallenge challenge={circle.activeChallenge} />
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground text-sm">
                No active challenges.
                {(circle.myRole === "OWNER" || circle.myRole === "TEACHER") && (
                  <span> Create one to motivate the group!</span>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
