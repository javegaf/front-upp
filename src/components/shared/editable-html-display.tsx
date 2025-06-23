
"use client";

import type { HTMLAttributes } from 'react';
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface EditableHtmlDisplayProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'dangerouslySetInnerHTML'> {
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

  // EDIT MODE: Use a textarea to prevent browser from parsing/corrupting template tags.
  if (editable) {
    return (
        <div className="rounded-md border border-input shadow-sm bg-card">
            {/* The WYSIWYG controls are removed as they operate on a live DOM, not raw text. */}
            <Textarea
              defaultValue={initialHtml}
              onChange={(e) => onHtmlChange?.(e.target.value)}
              className={cn(
                "w-full min-h-[400px] max-h-[70vh] overflow-y-auto p-4 font-mono text-sm bg-background focus-visible:ring-0 focus-visible:ring-offset-0 border-0 shadow-none",
                className
              )}
            />
        </div>
    );
  }

  // PREVIEW MODE: Render the HTML in a div.
  return (
    <div className="rounded-md border border-input shadow-sm bg-card">
      <div
        className={cn(
          "min-h-[200px] p-4 focus:outline-none prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-table:my-2",
           "bg-muted/30",
           className
        )}
        dangerouslySetInnerHTML={{ __html: initialHtml }}
        {...divProps}
      />
    </div>
  );
}
