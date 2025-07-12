'use client';

import { useState } from 'react';
import { ArrowBigUp, ArrowBigDown, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VoteButtonsProps {
  upvotes: number;
  downvotes: number;
  isAccepted?: boolean;
}

export function VoteButtons({ upvotes, downvotes, isAccepted = false }: VoteButtonsProps) {
  const [voteCount, setVoteCount] = useState(upvotes - downvotes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const handleVote = (type: 'up' | 'down') => {
    // This is a mock implementation. In a real app, you would call a server action.
    if (userVote === type) {
      // User is undoing their vote
      setUserVote(null);
      setVoteCount(voteCount + (type === 'up' ? -1 : 1));
    } else {
      // New vote or changing vote
      let newVoteCount = voteCount;
      if (userVote === 'up') newVoteCount++;
      if (userVote === 'down') newVoteCount--;
      newVoteCount += type === 'up' ? 1 : -1;
      
      setVoteCount(newVoteCount);
      setUserVote(type);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 text-muted-foreground">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleVote('up')}
        className={cn('h-10 w-10 rounded-full', userVote === 'up' && 'text-primary bg-primary/10')}
      >
        <ArrowBigUp className="h-6 w-6" />
      </Button>
      <span className="text-xl font-bold text-foreground">{voteCount}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleVote('down')}
        className={cn('h-10 w-10 rounded-full', userVote === 'down' && 'text-destructive bg-destructive/10')}
      >
        <ArrowBigDown className="h-6 w-6" />
      </Button>
      {isAccepted && (
         <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <CheckCircle2 className="h-8 w-8 text-green-500 mt-2" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>Accepted Answer</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
