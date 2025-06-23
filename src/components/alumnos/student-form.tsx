
"use client";

import * as React from "react";
import type { Estudiante, Carrera, Comuna, Tutor } from "@/lib/definitions";
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
import { Textarea } from "../ui/textarea";

const studentSchema = z.object({
  rut: z.string().min(8, "RUT es requerido"),
  nombre: z.string().min(2, "Nombres son requeridos"),
  ap_paterno: z.string().min(2, "Apellido Paterno es requerido"),
  ap_materno: z.string().min(2, "Apellido Materno es requerido"),
  email: z.string().email("Email inválido"),
  carrera_id: z.string().min(1, "Carrera es requerida"),
  comuna_id: z.string().min(1, "Comuna es requerida"),
  tutor_id: z.string().min(1, "Tutor es requerido"),
  cond_especial: z.string().optional(),
});

export type StudentFormValues = z.infer<typeof studentSchema>;

interface StudentFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: StudentFormValues) => Promise<void>;
  initialData?: Estudiante | null;
  carreras: Carrera[];
  comunas: Comuna[];
  tutores: Tutor[];
}

export function StudentForm({ 
  isOpen, onOpenChange, onSubmit, initialData, 
  carreras, comunas, tutores 
}: StudentFormProps) {
  
  const defaultValues = {
    rut: "",
    nombre: "",
    ap_paterno: "",
    ap_materno: "",
    email: "",
    carrera_id: "",
    comuna_id: "",
    tutor_id: "",
    cond_especial: "",
  };

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues,
  });

  const handleFormSubmit = async (data: StudentFormValues) => {
    await onSubmit(data);
    form.reset();
  };
  
  React.useEffect(() => {
    if (isOpen) {
        if (initialData) {
            form.reset({ 
                ...initialData,
                carrera_id: String(initialData.carrera_id),
                comuna_id: String(initialData.comuna_id),
                tutor_id: initialData.tutor_id ? String(initialData.tutor_id) : "",
                cond_especial: initialData.cond_especial || "" 
            });
        } else {
            form.reset(defaultValues);
        }
    }
  }, [initialData, form, isOpen]);


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {initialData ? "Editar Estudiante" : "Agregar Nuevo Estudiante"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField control={form.control} name="rut" render={({ field }) => (
                <FormItem>
                  <FormLabel>RUT</FormLabel>
                  <FormControl><Input placeholder="Ej: 12.345.678-9" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="nombre" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombres</FormLabel>
                  <FormControl><Input placeholder="Ej: Juan Alberto" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )}/>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="ap_paterno" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido Paterno</FormLabel>
                    <FormControl><Input placeholder="Ej: Pérez" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>
              <FormField control={form.control} name="ap_materno" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido Materno</FormLabel>
                    <FormControl><Input placeholder="Ej: González" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>
            </div>
            <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" placeholder="ejemplo@correo.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )}/>
             <FormField control={form.control} name="carrera_id" render={({ field }) => (
                <FormItem>
                  <FormLabel>Carrera</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione una carrera" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {carreras.map((carrera) => (
                        <SelectItem key={carrera.id} value={String(carrera.id)}>{carrera.nombre}</SelectItem>
                      ))}
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
             <FormField control={form.control} name="tutor_id" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tutor Académico</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un tutor" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {tutores.map((tutor) => (
                        <SelectItem key={tutor.id} value={String(tutor.id)}>{tutor.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="cond_especial" render={({ field }) => (
                <FormItem>
                  <FormLabel>Condición Especial (Opcional)</FormLabel>
                  <FormControl><Textarea placeholder="Describa si el estudiante tiene alguna condición especial a considerar..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )}/>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Guardando..." : (initialData ? "Actualizar Estudiante" : "Agregar Estudiante")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
