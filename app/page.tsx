import { Features } from "@/components/features/features";
import { Hero } from "@/components/layout/hero";
import { Leaderboard } from "@/components/features/leaderboard/leaderboard";
import { AuditUploader } from "@/components/features/upload/audit-uploader";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Community Q&A Section (from HEAD, more detailed) */}
        <section id="community-qa">
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-bold mb-2">Community Q&amp;A</h2>
            <p className="text-gray-500 mb-4">
              Ask and answer questions about Move smart contract security.
            </p>
            <div className="flex justify-center mb-4">
              <span className="inline-block animate-bounce text-3xl">💬</span>
            </div>
            <p className="text-base text-gray-500 max-w-2xl mx-auto mb-6">
              The Move language is new and growing, and resources are still
              limited. Our Q&amp;A section is here to help you connect with
              other developers, share knowledge, and get help fast. Whether
              you’re a beginner or an expert, your questions and answers help
              build the Move community for everyone.
            </p>
          </div>
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
        </section>
        {/* AuditUploader from test branch, placed after Q&A section */}
        <AuditUploader />
        <Features />
        <Leaderboard />
        {/* About Section from test branch */}
        <section
          id="about"
          className="max-w-3xl mx-auto mt-16 text-center py-12"
        >
          <h2 className="text-3xl font-bold mb-4">About DeAudit AI</h2>
          <p className="text-lg text-gray-500 mb-6">
            Move is a relatively new smart contract language, and as such, it
            lacks the large, established community and resources that other
            ecosystems enjoy. This can make it challenging for new developers to
            find help, share knowledge, and grow their skills. DeAudit AI was
            created to fill this gap—our mission is to foster a vibrant,
            supportive community for Move developers, where everyone can learn,
            collaborate, and build securely. With the added power of AI, we make
            it even easier to get expert insights, audit your code, and accelerate
            your journey in the Move ecosystem.
          </p>
          <div className="mb-6">
            <p className="font-medium text-base text-gray-700">
              Hi, I'm Rakesh (
              <span className="font-mono">aka_rakesh</span>), the creator of
              DeAudit AI. I'm passionate about building tools and communities for
              new technologies. If you have feedback, ideas, or want to
              collaborate, feel free to reach out!
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <a
              href="https://github.com/aka-Rakesh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gray-900 text-white px-6 py-2 rounded font-semibold shadow hover:bg-gray-800 transition"
            >
              GitHub
            </a>
            <a
              href="https://x.com/aka__rakesh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded font-semibold shadow hover:bg-blue-600 transition"
            >X (Twitter)
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}