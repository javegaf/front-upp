
"use client";

import type { HTMLAttributes } from 'react';
import { useEffect, useRef } from 'react';
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, Table as TableIcon } from 'lucide-react'; // Renamed Table to TableIcon to avoid conflict
import { Button } from '@/components/ui/button';

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
      // Only update if the content is actually different to avoid unnecessary cursor jumps
      // if the parent component re-renders but initialHtml hasn't changed.
      // This is primarily for when the underlying template (initialHtml) changes.
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
      editorRef.current.focus(); // Ensure editor has focus
      document.execCommand(command, false, value);
      // The 'input' event should fire after execCommand, which will call handleInput.
      // Forcing an update if handleInput isn't triggered consistently by execCommand in some rare cases:
      if (editorRef.current) { // Check ref again, just in case
        const currentContent = editorRef.current.innerHTML;
        // A minimal check, could be more sophisticated.
        // This is to ensure onHtmlChange is called if the input event doesn't fire reliably for some commands.
        // However, onInput event should generally cover this.
        // For now, we rely on onInput to call handleInput and thus onHtmlChange.
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
    // Basic 2x2 table
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
      <p></p> {/* Add a paragraph after the table for easier continued typing */}
    `;
    execCommand('insertHTML', tableHtml);
  };

  return (
    <div className="rounded-md border border-input shadow-sm">
      {editable && (
        <div className="flex flex-wrap space-x-1 border-b border-input p-2 bg-muted/50 rounded-t-md">
          <Button variant="outline" size="sm" onClick={handleBoldClick} title="Bold (Ctrl+B)" className="h-8 w-8 p-0">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleItalicClick} title="Italic (Ctrl+I)" className="h-8 w-8 p-0">
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleUnderlineClick} title="Underline (Ctrl+U)" className="h-8 w-8 p-0">
            <Underline className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleStrikethroughClick} title="Strikethrough" className="h-8 w-8 p-0">
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleUnorderedListClick} title="Bulleted List" className="h-8 w-8 p-0">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleOrderedListClick} title="Numbered List" className="h-8 w-8 p-0">
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleInsertTableClick} title="Insert Table" className="h-8 w-8 p-0">
            <TableIcon className="h-4 w-4" />
          </Button>
          {/* Add more buttons here as needed */}
        </div>
      )}
      <div
        ref={editorRef}
        contentEditable={editable}
        suppressContentEditableWarning={true} // Necessary for contentEditable with React
        className={className} // This will include prose styles from parent
        onInput={handleInput}
        {...divProps}
        // The initial HTML is set via useEffect when `initialHtml` prop changes
      />
    </div>
  );
}
