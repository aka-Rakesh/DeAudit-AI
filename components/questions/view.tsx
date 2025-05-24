'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useWalletStore } from '@/lib/store/wallet';

export default function QuestionView() {
  const { address } = useWalletStore();
  const params = useParams();
  const questionId = params?.id;
  const [question, setQuestion] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const qRes = await fetch(`/api/questions?id=${questionId}`);
        if (!qRes.ok) throw new Error('Failed to fetch question');
        const qData = await qRes.json();
        setQuestion(Array.isArray(qData) ? qData[0] : qData);
        const aRes = await fetch(`/api/answers?question_id=${questionId}`);
        if (!aRes.ok) throw new Error('Failed to fetch answers');
        setAnswers(await aRes.json());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (questionId) fetchData();
  }, [questionId]);

  async function handleAnswerSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPosting(true);
    setError(null);
    try {
      // Fetch the user's profile to get author_id (just like posting a question)
      let author_id = null;
      if (address) {
        const res = await fetch(`/api/profiles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wallet_address: address }),
        });
        const profile = await res.json();
        author_id = profile.id;
      }
      if (!author_id) throw new Error('You must connect your wallet to answer.');
      const res = await fetch('/api/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: questionId,
          content: answerText,
          author_id,
        }),
      });
      if (!res.ok) throw new Error('Failed to post answer');
      setAnswerText('');
      // Refresh answers
      const aRes = await fetch(`/api/answers?question_id=${questionId}`);
      setAnswers(await aRes.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!question) return <div>Question not found.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{question.title}</h1>
      <div className="text-gray-600 mb-2">
        By {question.author?.username || question.author?.wallet_address?.slice(0, 8) || 'Anonymous'} • {new Date(question.created_at).toLocaleString()}
      </div>
      <div className="mb-4">{question.content}</div>
      {question.code && (
        <pre className="bg-gray-100 p-2 rounded mb-4 overflow-x-auto text-sm"><code>{question.code}</code></pre>
      )}
      <div className="mb-4 flex gap-2 flex-wrap">
        {question.tags?.map((tag: string) => (
          <span key={tag} className="bg-gray-200 px-2 py-1 rounded text-xs">{tag}</span>
        ))}
      </div>
      <h2 className="text-xl font-semibold mt-8 mb-2">Answers</h2>
      <ul className="space-y-4 mb-8">
        {answers.length === 0 && <li>No answers yet.</li>}
        {answers.map((a) => (
          <li key={a.id} className="border p-3 rounded">
            <div className="text-gray-700 whitespace-pre-line">{a.content}</div>
            <div className="text-xs text-gray-500 mt-1">By {a.author} • {new Date(a.created_at).toLocaleString()}</div>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAnswerSubmit} className="space-y-2 max-w-xl">
        <label className="block font-medium">Your Answer</label>
        <textarea className="w-full border rounded px-2 py-1" value={answerText} onChange={e => setAnswerText(e.target.value)} required rows={4} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={posting}>
          {posting ? 'Posting...' : 'Post Answer'}
        </button>
      </form>
    </div>
  );
}
