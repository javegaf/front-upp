
"use client";

import * as React from "react";
import type { Comuna } from "@/lib/definitions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const comunaSchema = z.object({
  nombre: z.string().min(3, "El nombre es requerido"),
});

type ComunaFormValues = z.infer<typeof comunaSchema>;

interface ComunaFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: ComunaFormValues) => Promise<void>;
  initialData?: Comuna | null;
}

export function ComunaForm({ isOpen, onOpenChange, onSubmit, initialData }: ComunaFormProps) {
  
  const defaultValues = { nombre: "" };

  const form = useForm<ComunaFormValues>({
    resolver: zodResolver(comunaSchema),
    defaultValues: initialData || defaultValues,
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset(initialData || defaultValues);
    }
  }, [initialData, form, isOpen]);

  const handleFormSubmit = async (data: ComunaFormValues) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {initialData ? "Editar Comuna" : "Agregar Nueva Comuna"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField control={form.control} name="nombre" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Comuna</FormLabel>
                  <FormControl><Input placeholder="Ej: Concepción" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )}/>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Guardando..." : (initialData ? "Actualizar" : "Agregar")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
