
"use client";

import * as React from "react";
import type { Carrera } from "@/lib/definitions";
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

const carreraSchema = z.object({
  nombre: z.string().min(3, "Nombre es requerido"),
});

type CarreraFormValues = z.infer<typeof carreraSchema>;

interface CarreraFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: CarreraFormValues) => Promise<void>;
  initialData?: Carrera | null;
}

export function CarreraForm({ isOpen, onOpenChange, onSubmit, initialData }: CarreraFormProps) {
  const { toast } = useToast();
  
  const defaultValues = { nombre: "" };

  const form = useForm<CarreraFormValues>({
    resolver: zodResolver(carreraSchema),
    defaultValues: initialData || defaultValues,
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset(initialData || defaultValues);
    }
  }, [initialData, form, isOpen]);

  const handleFormSubmit = async (data: CarreraFormValues) => {
    try {
      await onSubmit(data);
      toast({
        title: `Carrera ${initialData ? 'actualizada' : 'creada'}`,
        description: `La carrera "${data.nombre}" ha sido ${initialData ? 'actualizada' : 'registrada'} exitosamente.`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Ocurrió un error al ${initialData ? 'actualizar' : 'crear'} la carrera.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {initialData ? "Editar Carrera" : "Agregar Nueva Carrera"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField control={form.control} name="nombre" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Carrera</FormLabel>
                  <FormControl><Input placeholder="Ej: Pedagogía en Inglés" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )}/>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Guardando..." : (initialData ? "Actualizar Carrera" : "Agregar Carrera")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
