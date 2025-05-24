import { AuditUploader } from "@/components/features/upload/audit-uploader";
import { Features } from "@/components/features/features";
import { Hero } from "@/components/layout/hero";
import { Leaderboard } from "@/components/features/leaderboard/leaderboard";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Link
            href="/questions"
            className="bg-blue-600 text-white px-5 py-2 rounded font-semibold shadow hover:bg-blue-700 transition"
          >
            Community Q&amp;A
          </Link>
          <Link
            href="/questions/ask"
            className="bg-green-600 text-white px-5 py-2 rounded font-semibold shadow hover:bg-green-700 transition"
          >
            Ask a Question
          </Link>
        </div>
        <AuditUploader />
        <Features />
        <Leaderboard />
      </div>
    </div>
  );
}