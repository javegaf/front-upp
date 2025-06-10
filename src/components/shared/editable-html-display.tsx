
"use client";

import type { HTMLAttributes } from 'react';
import { useEffect, useRef } from 'react';
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, Table as TableIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils"; // Added import

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

  useEffect(() => {
    if (editorRef.current) {
      if (editorRef.current.innerHTML !== initialHtml) {
        editorRef.current.innerHTML = initialHtml;
      }
    }
  }, [initialHtml]);

  const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
    if (editable && editorRef.current) {
      onHtmlChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value: string | null = null) => {
    if (editorRef.current && editable) {
      editorRef.current.focus(); 
      document.execCommand(command, false, value);
      // Explicitly update React state after execCommand
      // This ensures changes (especially for lists/tables) are captured
      // even if onInput doesn't fire reliably for these commands.
      if (editorRef.current) {
        onHtmlChange(editorRef.current.innerHTML);
      }
    }
  };

  const handleBoldClick = () => execCommand('bold');
  const handleItalicClick = () => execCommand('italic');
  const handleUnderlineClick = () => execCommand('underline');
  const handleStrikethroughClick = () => execCommand('strikeThrough');
  const handleUnorderedListClick = () => execCommand('insertUnorderedList');
  const handleOrderedListClick = () => execCommand('insertOrderedList');

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
    `;
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
          <Button variant="outline" size="sm" onMouseDown={(e) => e.preventDefault()} onClick={handleUnorderedListClick} title="Bulleted List" className="h-8 w-8 p-0">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onMouseDown={(e) => e.preventDefault()} onClick={handleOrderedListClick} title="Numbered List" className="h-8 w-8 p-0">
            <ListOrdered className="h-4 w-4" />
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
           editable ? "bg-background" : "bg-muted/30 cursor-not-allowed opacity-70",
           className
        )}
        onInput={handleInput}
        {...divProps}
      />
    </div>
  );
}
