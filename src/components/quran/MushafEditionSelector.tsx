"use client";

import { useState } from "react";
import { MUSHAF_EDITIONS, type MushafEditionId } from "@/types/quran";
import { BookOpen, Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface MushafEditionSelectorProps {
  value: MushafEditionId;
  onChange: (edition: MushafEditionId) => void;
  className?: string;
}

/**
 * Dropdown selector for Mushaf editions
 */
export function MushafEditionSelector({
  value,
  onChange,
  className,
}: MushafEditionSelectorProps) {
  const [open, setOpen] = useState(false);
  const currentEdition = MUSHAF_EDITIONS[value];

  const editions = Object.values(MUSHAF_EDITIONS);
  const uthmaniEditions = editions.filter((e) => e.scriptType === "uthmani");
  const indopakEditions = editions.filter((e) => e.scriptType === "indopak");

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between min-w-[200px]", className)}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">
              {currentEdition?.name || "Select edition"}
            </span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[280px]">
        {/* Uthmani Script Editions */}
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Uthmani Script (الخط العثماني)
        </DropdownMenuLabel>
        {uthmaniEditions.map((edition) => (
          <EditionMenuItem
            key={edition.id}
            edition={edition}
            isSelected={value === edition.id}
            onSelect={() => {
              onChange(edition.id);
              setOpen(false);
            }}
          />
        ))}

        <DropdownMenuSeparator />

        {/* IndoPak Script Editions */}
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          IndoPak Script (الخط الهندي)
        </DropdownMenuLabel>
        {indopakEditions.map((edition) => (
          <EditionMenuItem
            key={edition.id}
            edition={edition}
            isSelected={value === edition.id}
            onSelect={() => {
              onChange(edition.id);
              setOpen(false);
            }}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Individual edition menu item
 */
interface EditionMenuItemProps {
  edition: (typeof MUSHAF_EDITIONS)[MushafEditionId];
  isSelected: boolean;
  onSelect: () => void;
}

function EditionMenuItem({
  edition,
  isSelected,
  onSelect,
}: EditionMenuItemProps) {
  return (
    <DropdownMenuItem
      onSelect={onSelect}
      className="flex items-start gap-3 py-2 cursor-pointer"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{edition.name}</span>
          {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
          <span>{edition.totalPages} pages</span>
          <span>•</span>
          <span>{edition.linesPerPage} lines</span>
        </div>
      </div>
    </DropdownMenuItem>
  );
}

/**
 * Compact edition badge display
 */
export function EditionBadge({
  edition,
  className,
}: {
  edition: MushafEditionId;
  className?: string;
}) {
  const config = MUSHAF_EDITIONS[edition];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5",
        "px-2 py-1 rounded-md",
        "bg-muted text-muted-foreground",
        "text-xs font-medium",
        className
      )}
    >
      <BookOpen className="h-3 w-3" />
      <span>{config?.name || edition}</span>
    </div>
  );
}

/**
 * Edition info card for settings
 */
export function EditionInfoCard({
  edition,
  isSelected,
  onSelect,
  className,
}: {
  edition: MushafEditionId;
  isSelected: boolean;
  onSelect: () => void;
  className?: string;
}) {
  const config = MUSHAF_EDITIONS[edition];

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left p-4 rounded-lg border-2 transition-colors",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-muted/50",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{config.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {config.nameArabic}
          </p>
        </div>
        {isSelected && (
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground">
            <Check className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        <span>{config.totalPages} صفحة</span>
        <span>{config.linesPerPage} سطر</span>
        <span className="capitalize">{config.scriptType}</span>
      </div>

      <p className="text-xs text-muted-foreground mt-2">{config.description}</p>
    </button>
  );
}

export default MushafEditionSelector;
