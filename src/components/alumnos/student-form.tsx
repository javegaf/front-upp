"use client";

import * as React from "react";
import type { Alumno } from "@/lib/definitions";
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
import { carreras } from "@/lib/definitions";
import { useToast } from "@/hooks/use-toast";

const studentSchema = z.object({
  nombres: z.string().min(2, "Nombres son requeridos"),
  apellidos: z.string().min(2, "Apellidos son requeridos"),
  email: z.string().email("Email inválido"),
  carrera: z.string().min(1, "Carrera es requerida"),
  semestre: z.coerce.number().min(1, "Semestre debe ser mayor a 0").max(12, "Semestre inválido"),
  telefono: z.string().optional(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface StudentFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: StudentFormValues) => Promise<void>;
  initialData?: Alumno | null;
}

export function StudentForm({ isOpen, onOpenChange, onSubmit, initialData }: StudentFormProps) {
  const { toast } = useToast();
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData
      ? {
          nombres: initialData.nombres,
          apellidos: initialData.apellidos,
          email: initialData.email,
          carrera: initialData.carrera,
          semestre: initialData.semestre,
          telefono: initialData.telefono || "",
        }
      : {
          nombres: "",
          apellidos: "",
          email: "",
          carrera: "",
          semestre: 1,
          telefono: "",
        },
  });

  const handleFormSubmit = async (data: StudentFormValues) => {
    try {
      await onSubmit(data);
      toast({
        title: `Alumno ${initialData ? 'actualizado' : 'creado'}`,
        description: `${data.nombres} ${data.apellidos} ha sido ${initialData ? 'actualizado' : 'registrado'} exitosamente.`,
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Ocurrió un error al ${initialData ? 'actualizar' : 'crear'} el alumno.`,
        variant: "destructive",
      });
    }
  };
  
  React.useEffect(() => {
    if (initialData) {
      form.reset({
        nombres: initialData.nombres,
        apellidos: initialData.apellidos,
        email: initialData.email,
        carrera: initialData.carrera,
        semestre: initialData.semestre,
        telefono: initialData.telefono || "",
      });
    } else {
      form.reset({
        nombres: "",
        apellidos: "",
        email: "",
        carrera: "",
        semestre: 1,
        telefono: "",
      });
    }
  }, [initialData, form, isOpen]);


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {initialData ? "Editar Alumno" : "Agregar Nuevo Alumno"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombres"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombres</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Juan Alberto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apellidos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellidos</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Pérez González" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="ejemplo@correo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="carrera"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carrera</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una carrera" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {carreras.map((carrera) => (
                        <SelectItem key={carrera} value={carrera}>
                          {carrera}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="semestre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semestre</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej: 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: +56912345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Guardando..." : (initialData ? "Actualizar Alumno" : "Agregar Alumno")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
