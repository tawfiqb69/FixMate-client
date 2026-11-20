"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">FixMate</h1>
      <Button className="mt-4" onClick={() => toast.success("Toast works!")}>
        Test toast
      </Button>
    </main>
  );
}