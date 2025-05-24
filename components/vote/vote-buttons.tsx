import { useState } from 'react';
import { useWalletStore } from '@/lib/store/wallet';

interface VoteButtonsProps {
  targetId: string;
  type: 'question' | 'answer';
  initialVotes: number;
  disabled?: boolean;
  onVote?: (vote: number) => void;
}

export function VoteButtons({ targetId, type, initialVotes, disabled, onVote }: VoteButtonsProps) {
  const { address } = useWalletStore();
  const [votes, setVotes] = useState(initialVotes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleVote(vote: 1 | -1) {
    if (disabled || loading) return;
    if (!address) {
      setError('Connect your wallet to vote.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_id: targetId, type, vote, wallet_address: address }),
      });
      if (res.ok) {
        setVotes(votes + vote);
        onVote?.(votes + vote);
      } else {
        const data = await res.json();
        setError(data.error || 'Vote failed');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <button
        className="text-xl text-gray-500 hover:text-blue-600 disabled:opacity-50"
        onClick={() => handleVote(1)}
        disabled={disabled || loading}
        aria-label="Upvote"
      >
        ▲
      </button>
      <span className="font-semibold text-base">{votes}</span>
      <button
        className="text-xl text-gray-500 hover:text-red-600 disabled:opacity-50"
        onClick={() => handleVote(-1)}
        disabled={disabled || loading}
        aria-label="Downvote"
      >
        ▼
      </button>
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
}
