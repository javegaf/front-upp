
"use client";

import * as React from "react";
import type { Tutor } from "@/lib/definitions";
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
import { useToast } from "@/hooks/use-toast";

const tutorSchema = z.object({
  nombre: z.string().min(3, "Nombre es requerido"),
  email: z.string().email("Email inválido"),
});

type TutorFormValues = z.infer<typeof tutorSchema>;

interface TutorFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: TutorFormValues) => Promise<void>;
  initialData?: Tutor | null;
}

export function TutorForm({ isOpen, onOpenChange, onSubmit, initialData }: TutorFormProps) {
  const { toast } = useToast();
  
  const defaultValues = { nombre: "", email: "" };

  const form = useForm<TutorFormValues>({
    resolver: zodResolver(tutorSchema),
    defaultValues: initialData || defaultValues,
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset(initialData || defaultValues);
    }
  }, [initialData, form, isOpen]);

  const handleFormSubmit = async (data: TutorFormValues) => {
    try {
      await onSubmit(data);
      toast({
        title: `Tutor ${initialData ? 'actualizado' : 'creado'}`,
        description: `El tutor "${data.nombre}" ha sido ${initialData ? 'actualizado' : 'registrado'} exitosamente.`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Ocurrió un error al ${initialData ? 'actualizar' : 'crear'} el tutor.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {initialData ? "Editar Tutor" : "Agregar Nuevo Tutor"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField control={form.control} name="nombre" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl><Input placeholder="Ej: Dr. Juan Pérez" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" placeholder="tutor@universidad.cl" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )}/>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Guardando..." : (initialData ? "Actualizar Tutor" : "Agregar Tutor")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
