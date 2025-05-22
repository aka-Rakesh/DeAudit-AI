import { AuditUploader } from "@/components/features/upload/audit-uploader";
import { Features } from "@/components/features/features";
import { Hero } from "@/components/layout/hero";
import { Leaderboard } from "@/components/features/leaderboard/leaderboard";

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <AuditUploader />
        <Features />
        <Leaderboard />
      </div>
    </div>
  );
}