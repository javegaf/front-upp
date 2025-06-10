
"use client";

import type { HTMLAttributes } from 'react';
import { useEffect, useRef } from 'react';

interface EditableHtmlDisplayProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onInput' | 'dangerouslySetInnerHTML' | 'contentEditable' | 'suppressContentEditableWarning'> {
  initialHtml: string;
  onHtmlChange: (newHtml: string) => void;
  editable?: boolean;
  className?: string;
}

export function EditableHtmlDisplay({
  initialHtml,
  onHtmlChange,
  editable = false,
  className,
  ...divProps
}: EditableHtmlDisplayProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Effect to set the content of the contentEditable div when initialHtml changes
  // This runs when a new template is loaded into initialHtml
  useEffect(() => {
    if (editorRef.current) {
      // Only update if the content is actually different to avoid unnecessary cursor jumps
      // if the parent component re-renders but initialHtml hasn't changed.
      if (editorRef.current.innerHTML !== initialHtml) {
        editorRef.current.innerHTML = initialHtml;
      }
    }
  }, [initialHtml]);

  const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
    if (editable) {
      onHtmlChange(event.currentTarget.innerHTML);
    }
  };

  return (
    <div
      ref={editorRef}
      contentEditable={editable}
      suppressContentEditableWarning={true} // Necessary for contentEditable with React
      className={className}
      onInput={handleInput}
      {...divProps}
      // dangerouslySetInnerHTML is not used here to allow the browser to manage edits
      // and for the useEffect to handle initial/template content loading.
    />
  );
}
