'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { RichTextEditorToolbar } from './rich-text-editor-toolbar';
import { cn } from '@/lib/utils';
import Placeholder from '@tiptap/extension-placeholder'

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, className, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image.configure({
        inline: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start writing...',
      })
    ],
    content: value,
    editorProps: {
      attributes: {
        class: cn('tiptap', className),
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="flex flex-col gap-2">
      {editor && <RichTextEditorToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
