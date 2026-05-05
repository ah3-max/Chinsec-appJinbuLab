"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function BookmarkStar({
  hanzi,
  initialBookmarked,
  className,
}: {
  hanzi: string;
  initialBookmarked: boolean;
  className?: string;
}) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [pending, startTransition] = useTransition();

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = !bookmarked;
    setBookmarked(next); // optimistic
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/bookmarks/${encodeURIComponent(hanzi)}`,
          { method: next ? "POST" : "DELETE" },
        );
        if (!res.ok) throw new Error("failed");
        toast.success(next ? "บันทึกคำแล้ว ⭐" : "ลบออกจากที่บันทึก");
      } catch {
        setBookmarked(!next); // rollback
        toast.error("เกิดข้อผิดพลาด");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark this word"}
      className={className ?? "flex size-10 items-center justify-center rounded-full transition-transform active:scale-90"}
      style={{
        background: bookmarked ? "#fef3c7" : "var(--aiai-gray-100)",
        color: bookmarked ? "#d97706" : "var(--aiai-gray-500)",
      }}
    >
      <motion.span animate={{ scale: bookmarked ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.3 }}>
        <Star
          className="size-5"
          style={{
            fill: bookmarked ? "#fbbf24" : "transparent",
            color: bookmarked ? "#d97706" : "currentColor",
          }}
        />
      </motion.span>
    </button>
  );
}
