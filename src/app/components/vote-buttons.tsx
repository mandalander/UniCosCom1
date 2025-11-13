'use client';

import { useState, useEffect } from 'react';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, runVoteTransaction } from '@/firebase';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useLanguage } from './language-provider';
import { cn } from '@/lib/utils';

interface VoteButtonsProps {
  targetType: 'post' | 'comment';
  targetId: string;
  communityId: string;
  postId?: string; // only for comments
  initialVoteCount: number;
}

export function VoteButtons({ targetType, targetId, communityId, postId, initialVoteCount }: VoteButtonsProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLanguage();

  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [userVote, setUserVote] = useState<number | null>(null); // 1 for up, -1 for down, null for none
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    setVoteCount(initialVoteCount);
  }, [initialVoteCount]);

  useEffect(() => {
    const fetchUserVote = async () => {
      if (!user || !firestore) return;
      let voteRef;
      if (targetType === 'post') {
        voteRef = doc(firestore, 'communities', communityId, 'posts', targetId, 'votes', user.uid);
      } else if (postId) {
        voteRef = doc(firestore, 'communities', communityId, 'posts', postId, 'comments', targetId, 'votes', user.uid);
      }

      if (voteRef) {
        const voteSnap = await getDoc(voteRef);
        if (voteSnap.exists()) {
          setUserVote(voteSnap.data().value);
        }
      }
    };
    fetchUserVote();
  }, [user, firestore, communityId, postId, targetId, targetType]);

  const handleVote = async (newVote: 1 | -1) => {
    if (!user) {
      toast({
        variant: 'destructive',
        description: t('mustBeLoggedInToVote'),
      });
      router.push('/login');
      return;
    }
    if (!firestore || isVoting) return;

    setIsVoting(true);

    const newVoteValue = userVote === newVote ? 0 : newVote;

    const transactionBody = async (transaction: any) => {
      let targetRef;
      let voteRef;

      if (targetType === 'post') {
        targetRef = doc(firestore, 'communities', communityId, 'posts', targetId);
        voteRef = doc(firestore, 'communities', communityId, 'posts', targetId, 'votes', user.uid);
      } else {
        targetRef = doc(firestore, 'communities', communityId, 'posts', postId!, 'comments', targetId);
        voteRef = doc(firestore, 'communities', communityId, 'posts', postId!, 'comments', targetId, 'votes', user.uid);
      }
      
      const voteDoc = await transaction.get(voteRef);
      const currentVote = voteDoc.exists() ? voteDoc.data().value : 0;

      let upvotesIncrement = 0;
      let downvotesIncrement = 0;

      if (newVoteValue === 1) { // New upvote
        upvotesIncrement = 1;
        if (currentVote === -1) downvotesIncrement = -1;
      } else if (newVoteValue === -1) { // New downvote
        downvotesIncrement = 1;
        if (currentVote === 1) upvotesIncrement = -1;
      } else { // Clearing vote
        if (currentVote === 1) upvotesIncrement = -1;
        if (currentVote === -1) downvotesIncrement = -1;
      }

      const voteCountIncrement = upvotesIncrement - downvotesIncrement;

      transaction.update(targetRef, {
        upvotes: increment(upvotesIncrement),
        downvotes: increment(downvotesIncrement),
        voteCount: increment(voteCountIncrement),
      });

      if (newVoteValue === 0) {
        transaction.delete(voteRef);
      } else {
        transaction.set(voteRef, { value: newVoteValue });
      }
    };

    try {
        await runVoteTransaction(firestore, transactionBody);
        
        let voteChange = 0;
        if (userVote === newVote) { // un-voting
            voteChange = -newVote;
            setUserVote(null);
        } else if (userVote !== null) { // changing vote
            voteChange = 2 * newVote;
            setUserVote(newVote);
        } else { // new vote
            voteChange = newVote;
            setUserVote(newVote);
        }
        setVoteCount(prev => prev + voteChange);

    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: t('voteError'),
        description: (e as Error).message,
      });
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-7 w-7", userVote === 1 && "text-primary bg-primary/20")}
        onClick={() => handleVote(1)}
        disabled={isVoting}
      >
        <ArrowBigUp className="h-5 w-5" />
      </Button>
      <span className="text-sm font-bold min-w-[20px] text-center">{voteCount}</span>
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-7 w-7", userVote === -1 && "text-blue-600 bg-blue-600/20")}
        onClick={() => handleVote(-1)}
        disabled={isVoting}
      >
        <ArrowBigDown className="h-5 w-5" />
      </Button>
    </div>
  );
}
