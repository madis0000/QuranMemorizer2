"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Loader2, Lock } from "lucide-react";

import { useCreateCircle } from "@/hooks/use-circles";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export function CreateCircleForm() {
  const router = useRouter();
  const createCircle = useCreateCircle();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [maxMembers, setMaxMembers] = useState(50);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCircle.mutate(
      {
        name,
        description: description || undefined,
        isPublic,
        maxMembers,
      },
      {
        onSuccess: (circle) => {
          router.push(`/circles/${circle.id}`);
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a Hifz Circle</CardTitle>
        <CardDescription>
          Create a study group for Quran memorization. Invite friends, track
          progress together, and participate in challenges.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="circle-name">Circle Name</Label>
            <Input
              id="circle-name"
              placeholder="e.g., Weekend Hifz Group"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="circle-description">
              Description{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="circle-description"
              placeholder="What is this circle about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Public/Private */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
              {isPublic ? (
                <Globe className="h-5 w-5 text-green-600" />
              ) : (
                <Lock className="h-5 w-5 text-amber-600" />
              )}
              <div>
                <Label htmlFor="circle-public" className="cursor-pointer">
                  {isPublic ? "Public Circle" : "Private Circle"}
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isPublic
                    ? "Anyone can find and join this circle"
                    : "Only people with the invite code can join"}
                </p>
              </div>
            </div>
            <Switch
              id="circle-public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>

          {/* Max Members */}
          <div className="space-y-2">
            <Label htmlFor="circle-max-members">Maximum Members</Label>
            <Input
              id="circle-max-members"
              type="number"
              min={2}
              max={200}
              value={maxMembers}
              onChange={(e) => setMaxMembers(parseInt(e.target.value) || 50)}
            />
            <p className="text-xs text-muted-foreground">
              Between 2 and 200 members
            </p>
          </div>

          {/* Error */}
          {createCircle.error && (
            <p className="text-sm text-destructive">
              {createCircle.error.message}
            </p>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={!name.trim() || createCircle.isPending}
          >
            {createCircle.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Create Circle
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
