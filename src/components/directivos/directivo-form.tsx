
"use client";

import * as React from "react";
import type { Directivo, Establecimiento } from "@/lib/definitions";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const directivoSchema = z.object({
  nombre: z.string().min(3, "Nombre es requerido"),
  email: z.string().email("Email inválido"),
  cargo: z.string().min(3, "Cargo es requerido"),
  establecimiento_id: z.string().min(1, "Establecimiento es requerido"),
});

type DirectivoFormValues = z.infer<typeof directivoSchema>;

interface DirectivoFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: DirectivoFormValues) => Promise<void>;
  initialData?: Directivo | null;
  establecimientos: Establecimiento[];
}

export function DirectivoForm({ isOpen, onOpenChange, onSubmit, initialData, establecimientos }: DirectivoFormProps) {
  const { toast } = useToast();
  
  const defaultValues = { nombre: "", email: "", cargo: "", establecimiento_id: "" };

  const form = useForm<DirectivoFormValues>({
    resolver: zodResolver(directivoSchema),
    defaultValues: initialData || defaultValues,
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset(initialData || defaultValues);
    }
  }, [initialData, form, isOpen]);

  const handleFormSubmit = async (data: DirectivoFormValues) => {
    try {
      await onSubmit(data);
      toast({
        title: `Directivo ${initialData ? 'actualizado' : 'creado'}`,
        description: `El directivo "${data.nombre}" ha sido ${initialData ? 'actualizado' : 'registrado'} exitosamente.`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Ocurrió un error al ${initialData ? 'actualizar' : 'crear'} el directivo.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {initialData ? "Editar Directivo" : "Agregar Nuevo Directivo"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField control={form.control} name="nombre" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl><Input placeholder="Ej: Juana Pérez" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" placeholder="contacto@colegio.cl" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="cargo" render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <FormControl><Input placeholder="Ej: Jefe UTP" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )}/>
             <FormField control={form.control} name="establecimiento_id" render={({ field }) => (
                <FormItem>
                  <FormLabel>Establecimiento</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un establecimiento" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {establecimientos.map((establecimiento) => (
                        <SelectItem key={establecimiento.id} value={establecimiento.id}>{establecimiento.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
