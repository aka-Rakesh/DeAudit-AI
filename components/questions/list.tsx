'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// List all community questions
export default function QuestionList() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/questions');
        if (!res.ok) throw new Error('Failed to fetch questions');
        const data = await res.json();
        setQuestions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  return (
    <div>
      <h1>Community Questions</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="my-4">
        <Link href="/questions/ask" className="bg-blue-600 text-white px-4 py-2 rounded">Ask a Question</Link>
      </div>
      <ul className="space-y-4">
        {questions.map((q) => (
          <li key={q.id} className="border p-4 rounded shadow">
            <Link href={`/questions/${q.id}`} className="text-lg font-semibold hover:underline">
              {q.title}
            </Link>
            <div className="text-sm text-gray-500 mt-1">
              By {q.author?.username || q.author?.wallet_address?.slice(0, 8) || 'Anonymous'} • {new Date(q.created_at).toLocaleString()}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {q.tags?.map((tag: string) => (
                <span key={tag} className="bg-gray-200 px-2 py-1 rounded text-xs">{tag}</span>
              ))}
            </div>
            <div className="mt-2 text-gray-700 line-clamp-2">{q.content}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
