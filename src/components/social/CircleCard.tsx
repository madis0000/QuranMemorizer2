"use client";

import Link from "next/link";
import { Flame, Globe, Lock, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { useJoinCircle, type CircleListItem } from "@/hooks/use-circles";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CircleCardProps {
  circle: CircleListItem;
  showJoinButton?: boolean;
}

export function CircleCard({
  circle,
  showJoinButton = false,
}: CircleCardProps) {
  const joinCircle = useJoinCircle();

  const handleJoin = () => {
    joinCircle.mutate({ circleId: circle.id });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <Link href={`/circles/${circle.id}`}>
              <CardTitle className="text-base hover:text-primary transition-colors truncate">
                {circle.name}
              </CardTitle>
            </Link>
            {circle.description && (
              <CardDescription className="mt-1 line-clamp-2">
                {circle.description}
              </CardDescription>
            )}
          </div>
          <div
            className={cn(
              "ml-2 flex h-6 w-6 items-center justify-center rounded-full shrink-0",
              circle.isPublic
                ? "bg-green-100 dark:bg-green-900/30"
                : "bg-amber-100 dark:bg-amber-900/30"
            )}
          >
            {circle.isPublic ? (
              <Globe className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
            ) : (
              <Lock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {circle.memberCount}
              {circle.maxMembers ? `/${circle.maxMembers}` : ""}
            </span>
            {circle.groupStreak > 0 && (
              <span className="flex items-center gap-1">
                <Flame className="h-4 w-4 text-orange-500" />
                {circle.groupStreak}
              </span>
            )}
          </div>
          {showJoinButton && circle.isPublic && (
            <Button
              size="sm"
              onClick={handleJoin}
              disabled={joinCircle.isPending}
            >
              {joinCircle.isPending ? "Joining..." : "Join"}
            </Button>
          )}
          {circle.myRole && (
            <span className="text-xs font-medium text-muted-foreground capitalize">
              {circle.myRole.toLowerCase()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
