
"use client";

import type { HTMLAttributes } from 'react';
import { useEffect, useRef } from 'react';
import { Bold, Italic, Underline, Strikethrough, Table as TableIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";

interface EditableHtmlDisplayProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onInput' | 'dangerouslySetInnerHTML' | 'contentEditable' | 'suppressContentEditableWarning'> {
  initialHtml: string;
  onHtmlChange?: (newHtml: string) => void;
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

  // Effect to load initialHtml into the editor when the component mounts or initialHtml prop changes.
  useEffect(() => {
    if (editorRef.current) {
      // Only update if the initialHtml is genuinely different from current content
      // This prevents overwriting user edits if initialHtml prop hasn't changed
      // but the component re-renders for other reasons.
      if (editorRef.current.innerHTML !== initialHtml) {
        editorRef.current.innerHTML = initialHtml;
        // If we just reset the editor's content from initialHtml (e.g. new template),
        // we should also inform the parent that the "edited" state is now this initialHtml.
        onHtmlChange?.(initialHtml);
      }
    }
  // onHtmlChange is a stable function (setState from parent), so it's okay in the dep array.
  // This effect runs when a new template (initialHtml) is provided.
  }, [initialHtml, onHtmlChange]);

  // Handler for user input (typing, pasting, etc.)
  // This ensures that direct manipulations by the user are captured.
  const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
    if (editable && editorRef.current) {
      onHtmlChange?.(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value: string | null = null) => {
    if (editorRef.current && editable) {
      editorRef.current.focus(); // Ensure editor has focus
      document.execCommand(command, false, value);
      // After execCommand, DOM is modified. Read the new innerHTML and inform parent.
      // This is crucial for commands that might not reliably fire 'input' events
      // or for ensuring immediate state sync with React.
      if (editorRef.current) {
        onHtmlChange?.(editorRef.current.innerHTML);
      }
    }
  };

  const handleBoldClick = () => execCommand('bold');
  const handleItalicClick = () => execCommand('italic');
  const handleUnderlineClick = () => execCommand('underline');
  const handleStrikethroughClick = () => execCommand('strikeThrough');

  const handleInsertTableClick = () => {
    const tableHtml = `
      <table border="1" style="width:100%; border-collapse: collapse; margin-bottom: 1em;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Header 1</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Header 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Cell 1.1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Cell 1.2</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Cell 2.1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Cell 2.2</td>
          </tr>
        </tbody>
      </table>
      <p></p> 
    `; // Added <p></p> to ensure there's a new paragraph line after table insertion for better UX.
    execCommand('insertHTML', tableHtml);
  };

  return (
    <div className="rounded-md border border-input shadow-sm bg-card">
      {editable && (
        <div className="flex flex-wrap items-center gap-1 border-b border-input p-2 bg-muted/50 rounded-t-md">
          <Button variant="outline" size="sm" onMouseDown={(e) => e.preventDefault()} onClick={handleBoldClick} title="Bold (Ctrl+B)" className="h-8 w-8 p-0">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onMouseDown={(e) => e.preventDefault()} onClick={handleItalicClick} title="Italic (Ctrl+I)" className="h-8 w-8 p-0">
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onMouseDown={(e) => e.preventDefault()} onClick={handleUnderlineClick} title="Underline (Ctrl+U)" className="h-8 w-8 p-0">
            <Underline className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onMouseDown={(e) => e.preventDefault()} onClick={handleStrikethroughClick} title="Strikethrough" className="h-8 w-8 p-0">
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onMouseDown={(e) => e.preventDefault()} onClick={handleInsertTableClick} title="Insert Table" className="h-8 w-8 p-0">
            <TableIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div
        ref={editorRef}
        contentEditable={editable}
        suppressContentEditableWarning={true}
        className={cn(
          "min-h-[200px] p-4 focus:outline-none prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-table:my-2",
           editable ? "bg-background" : "bg-muted/30",
           className
        )}
        onInput={handleInput} // This handles direct typing, pasting etc.
        {...divProps}
        // initialHtml is loaded via useEffect. No dangerouslySetInnerHTML here.
      />
    </div>
  );
}
