'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWalletStore } from '@/lib/store/wallet';

// Ask a new question form
export default function AskQuestion() {
  const { address } = useWalletStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: description,
          code,
          wallet_address: address,
          tag_names: tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error('Failed to post question');
      const data = await res.json();
      router.push(`/questions/${data.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!address) {
    return (
      <div className="max-w-xl mx-auto mt-8 p-6 border rounded bg-yellow-50 text-yellow-900">
        <h2 className="text-xl font-semibold mb-2">Connect your wallet to ask a question</h2>
        <p className="mb-4">You must be authenticated with your wallet to post a new question.</p>
        <div className="mb-2">
          {/* Optionally, render the wallet connect button here */}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Ask a Question</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="block font-medium">Title</label>
          <input className="w-full border rounded px-2 py-1" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea className="w-full border rounded px-2 py-1" value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        <div>
          <label className="block font-medium">Move Code (optional)</label>
          <textarea className="w-full border rounded px-2 py-1 font-mono" value={code} onChange={e => setCode(e.target.value)} rows={6} />
        </div>
        <div>
          <label className="block font-medium">Tags (comma separated)</label>
          <input className="w-full border rounded px-2 py-1" value={tags} onChange={e => setTags(e.target.value)} />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? 'Posting...' : 'Post Question'}
        </button>
      </form>
    </div>
  );
}
