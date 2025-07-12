'use client';

import React, { useRef, useCallback } from 'react';
import {
  Bold, Italic, Strikethrough, List, ListOrdered, Link as LinkIcon, Pilcrow
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const ToolbarButton = ({
  onClick,
  children,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}) => (
  <Button
    type="button"
    variant="ghost"
    size="icon"
    className="h-8 w-8"
    onMouseDown={onClick}
  >
    {children}
  </Button>
);

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);
  
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };
  
  const handleLink = () => {
    const url = prompt('Enter the URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  return (
    <div className={cn('rounded-md border border-input bg-background', className)}>
      <div className="p-2 border-b flex items-center gap-1 flex-wrap">
        <ToolbarButton onClick={() => execCommand('bold')}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('italic')}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('strikeThrough')}>
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <ToolbarButton onClick={() => execCommand('insertUnorderedList')}>
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('insertOrderedList')}>
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
         <ToolbarButton onClick={() => execCommand('insertParagraph')}>
          <Pilcrow className="h-4 w-4" />
        </ToolbarButton>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <ToolbarButton onClick={handleLink}>
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        className="prose dark:prose-invert max-w-none min-h-[200px] p-4 focus:outline-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-b-md"
      />
    </div>
  );
}
