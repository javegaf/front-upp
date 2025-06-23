
"use client";

import * as React from "react";
import type { Establecimiento, Comuna } from "@/lib/definitions";
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

const colegioSchema = z.object({
  rbd: z.string().min(1, "RBD es requerido"),
  nombre: z.string().min(3, "Nombre es requerido"),
  dependencia: z.string().min(1, "Dependencia es requerida"),
  comuna_id: z.string().min(1, "Comuna es requerida"),
});

export type ColegioFormValues = z.infer<typeof colegioSchema>;

interface ColegioFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: ColegioFormValues) => Promise<void>;
  initialData?: Establecimiento | null;
  comunas: Comuna[];
}

export function ColegioForm({ isOpen, onOpenChange, onSubmit, initialData, comunas }: ColegioFormProps) {
  
  const defaultValues = { rbd: "", nombre: "", dependencia: "", comuna_id: "" };

  const form = useForm<ColegioFormValues>({
    resolver: zodResolver(colegioSchema),
    defaultValues,
  });

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          ...initialData,
          comuna_id: String(initialData.comuna_id),
        });
      } else {
        form.reset(defaultValues);
      }
    }
  }, [initialData, form, isOpen]);

  const handleFormSubmit = async (data: ColegioFormValues) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {initialData ? "Editar Colegio" : "Agregar Nuevo Colegio"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField control={form.control} name="rbd" render={({ field }) => (
                <FormItem>
                  <FormLabel>RBD</FormLabel>
                  <FormControl><Input placeholder="Ej: 12345-6" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="nombre" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Establecimiento</FormLabel>
                  <FormControl><Input placeholder="Ej: Liceo Bicentenario" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="dependencia" render={({ field }) => (
                <FormItem>
                  <FormLabel>Dependencia</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione una dependencia" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Municipal">Municipal</SelectItem>
                      <SelectItem value="Particular Subvencionado">Particular Subvencionado</SelectItem>
                      <SelectItem value="Particular Pagado">Particular Pagado</SelectItem>
                       <SelectItem value="Servicio Local de Educación">Servicio Local de Educación</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
            )}/>
             <FormField control={form.control} name="comuna_id" render={({ field }) => (
                <FormItem>
                  <FormLabel>Comuna</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione una comuna" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {comunas.map((comuna) => (
                        <SelectItem key={comuna.id} value={String(comuna.id)}>{comuna.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
            )}/>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Guardando..." : (initialData ? "Actualizar Colegio" : "Agregar Colegio")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
