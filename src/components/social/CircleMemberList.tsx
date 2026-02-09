"use client";

import { Crown, Flame, Shield, UserX } from "lucide-react";

import { cn } from "@/lib/utils";
import { useKickMember, type CircleMemberItem } from "@/hooks/use-circles";
import { Button } from "@/components/ui/button";

interface CircleMemberListProps {
  members: CircleMemberItem[];
  circleId: string;
  myRole: "OWNER" | "TEACHER" | "MEMBER" | null;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

const roleIcons: Record<string, typeof Crown> = {
  OWNER: Crown,
  TEACHER: Shield,
};

const roleColors: Record<string, string> = {
  OWNER: "text-amber-500",
  TEACHER: "text-blue-500",
};

export function CircleMemberList({
  members,
  circleId,
  myRole,
}: CircleMemberListProps) {
  const kickMember = useKickMember();

  const canKick = myRole === "OWNER" || myRole === "TEACHER";

  const handleKick = (userId: string) => {
    if (confirm("Are you sure you want to remove this member?")) {
      kickMember.mutate({ circleId, userId });
    }
  };

  return (
    <div className="space-y-2">
      {members.map((member) => {
        const RoleIcon = roleIcons[member.role];
        const roleColor = roleColors[member.role] ?? "";
        const showKickButton =
          canKick &&
          member.role === "MEMBER" &&
          !(myRole === "TEACHER" && member.role !== "MEMBER");

        return (
          <div
            key={member.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {RoleIcon && (
                <div
                  className={cn(
                    "absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-background border border-border flex items-center justify-center",
                    roleColor
                  )}
                >
                  <RoleIcon className="h-3 w-3" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">
                  {member.name}
                </span>
                {member.role !== "MEMBER" && (
                  <span
                    className={cn("text-xs font-medium capitalize", roleColor)}
                  >
                    {member.role.toLowerCase()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                <span>{member.weeklyXP} XP this week</span>
                {member.streakCount > 0 && (
                  <span className="flex items-center gap-0.5">
                    <Flame className="h-3 w-3 text-orange-500" />
                    {member.streakCount}
                  </span>
                )}
                <span>Active {formatTimeAgo(member.lastActiveAt)}</span>
              </div>
            </div>

            {/* Kick button */}
            {showKickButton && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => handleKick(member.userId)}
                disabled={kickMember.isPending}
                className="text-muted-foreground hover:text-destructive shrink-0"
                title="Remove member"
              >
                <UserX className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      })}

      {members.length === 0 && (
        <div className="py-8 text-center text-muted-foreground text-sm">
          No members yet
        </div>
      )}
    </div>
  );
}
