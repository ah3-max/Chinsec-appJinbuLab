"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Flag, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export interface TranslationTarget {
  contentType: "vocabulary" | "sentence" | "ui_text" | "dialogue";
  contentId: string;
  language: string; // th / vi / id / en
  originalText: string;
}

export function TranslationReportButton({
  target,
  children,
  className,
}: {
  target: TranslationTarget;
  children: React.ReactNode;
  className?: string;
}) {
  const t = useTranslations("translationReport");
  const containerRef = useRef<HTMLSpanElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [suggested, setSuggested] = useState("");
  const [comment, setComment] = useState("");

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  function startLongPress() {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = setTimeout(() => {
      setOpen(true);
    }, 500);
  }
  function cancelLongPress() {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  }

  async function submit() {
    if (!suggested.trim() && !comment.trim()) {
      toast.error(t("emptyError"));
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/learn/translation-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...target,
          suggestedText: suggested.trim() || undefined,
          comment: comment.trim() || undefined,
        }),
      });
      if (!res.ok) {
        toast.error(t("submitFailed"));
        return;
      }
      toast.success(t("submitted"));
      setOpen(false);
      setSuggested("");
      setComment("");
    } catch {
      toast.error(t("submitFailed"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <span ref={containerRef} className={className} style={{ position: "relative" }}>
      <span
        onContextMenu={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
        onTouchStart={startLongPress}
        onTouchEnd={cancelLongPress}
        onTouchCancel={cancelLongPress}
        onTouchMove={cancelLongPress}
        className="cursor-pointer"
      >
        {children}
      </span>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-x-2 top-20 z-50 mx-auto w-[min(28rem,calc(100%-1rem))] rounded-xl border bg-card p-4 shadow-2xl"
        >
          <div className="mb-2 flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold">
              <Flag className="size-4 text-amber-500" />
              {t("title")}
            </h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1 text-muted-foreground hover:bg-muted"
              aria-label={t("close")}
            >
              <X className="size-4" />
            </button>
          </div>

          <p className="mb-2 rounded bg-muted/40 px-2 py-1 text-xs text-muted-foreground">
            <span className="opacity-70">{t("currentLabel")}: </span>
            <span className="font-medium text-foreground">
              {target.originalText}
            </span>
          </p>

          <label className="block text-xs font-medium">
            {t("suggestedLabel")}
          </label>
          <textarea
            value={suggested}
            onChange={(e) => setSuggested(e.target.value)}
            placeholder={t("suggestedPlaceholder")}
            rows={2}
            className="mb-2 w-full rounded border bg-background px-2 py-1.5 text-sm"
          />

          <label className="block text-xs font-medium">
            {t("commentLabel")}
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t("commentPlaceholder")}
            rows={2}
            className="mb-3 w-full rounded border bg-background px-2 py-1.5 text-sm"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded border px-3 py-1.5 text-sm hover:bg-muted"
            >
              {t("cancel")}
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="flex items-center gap-1 rounded px-3 py-1.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{
                background: "var(--aiai-green-400)",
                color: "#FFFFFF",
              }}
            >
              {submitting && <Loader2 className="size-3.5 animate-spin" />}
              {t("submit")}
            </button>
          </div>
        </div>
      )}
    </span>
  );
}
