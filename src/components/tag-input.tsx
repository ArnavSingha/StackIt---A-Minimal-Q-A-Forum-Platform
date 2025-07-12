'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  className?: string;
  maxTags?: number;
}

export function TagInput({ value, onChange, className, maxTags = 5 }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim().toLowerCase();
      if (newTag && !value.includes(newTag) && value.length < maxTags) {
        onChange([...value, newTag]);
      }
      setInputValue('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag, index) => (
          <Badge key={index} variant="secondary">
            {tag}
            <button
              type="button"
              className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length >= maxTags ? `You can add up to ${maxTags} tags` : "Type a tag and press Enter"}
        disabled={value.length >= maxTags}
      />
    </div>
  );
}
