'use client';

import React, { useCallback } from 'react';
import type { Editor } from '@tiptap/react';
import {
  Bold, Italic, Strikethrough, List, ListOrdered, Link as LinkIcon, Pilcrow,
  Heading1, Heading2, Heading3, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, Smile
} from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from './ui/separator';

interface ToolbarProps {
  editor: Editor;
}

const ToolbarButton = ({
  onClick,
  isActive,
  children,
  tooltip,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isActive?: boolean;
  children: React.ReactNode;
  tooltip: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-2 rounded hover:bg-muted ${isActive ? 'bg-muted' : ''}`}
    title={tooltip}
  >
    {children}
  </button>
);


export function RichTextEditorToolbar({ editor }: ToolbarProps) {
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt('Image URL');

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  return (
    <div className="p-2 border rounded-md flex items-center gap-1 flex-wrap bg-card">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        tooltip="Bold"
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        tooltip="Italic"
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        tooltip="Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>
      <Separator orientation="vertical" className="h-6 mx-1" />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        tooltip="Bullet List"
      >
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        tooltip="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      <Separator orientation="vertical" className="h-6 mx-1" />
       <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} tooltip="Set Link">
        <LinkIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={addImage} tooltip="Add Image">
        <ImageIcon className="h-4 w-4" />
      </ToolbarButton>
      <Separator orientation="vertical" className="h-6 mx-1" />
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
        tooltip="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>
       <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
        tooltip="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
        tooltip="Align Right"
      >
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>
       <Separator orientation="vertical" className="h-6 mx-1" />
        <ToolbarButton onClick={() => alert('Emoji picker coming soon!')} tooltip="Add Emoji">
            <Smile className="h-4 w-4" />
        </ToolbarButton>
    </div>
  );
}
