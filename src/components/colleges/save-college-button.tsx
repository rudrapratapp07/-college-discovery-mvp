"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type SaveCollegeButtonProps = {
  collegeId: string;
  initialSaved?: boolean;
};

export function SaveCollegeButton({ collegeId, initialSaved = false }: SaveCollegeButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function toggleSave() {
    if (!session?.user) {
      router.push(`/login?callbackUrl=/colleges`);
      return;
    }

    setLoading(true);
    try {
      if (saved) {
        await fetch(`/api/user/saved-colleges/${collegeId}`, { method: "DELETE" });
        setSaved(false);
      } else {
        const response = await fetch("/api/user/saved-colleges", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collegeId }),
        });
        if (response.ok) setSaved(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant={saved ? "secondary" : "primary"} onClick={toggleSave} disabled={loading}>
      {loading ? "Saving..." : saved ? "Saved" : "Save college"}
    </Button>
  );
}
