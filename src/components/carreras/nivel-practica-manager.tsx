
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Carrera, NivelPractica } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

const nivelPracticaSchema = z.object({
  nombre: z.string().min(3, "El nombre del nivel es requerido."),
});

type NivelPracticaFormValues = z.infer<typeof nivelPracticaSchema>;

interface NivelPracticaManagerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  carrera: Carrera;
  niveles: NivelPractica[];
  onAddNivel: (data: NivelPracticaFormValues) => Promise<void>;
  onDeleteNivel: (nivelId: string) => Promise<void>;
}

export function NivelPracticaManager({
  isOpen,
  onOpenChange,
  carrera,
  niveles,
  onAddNivel,
  onDeleteNivel,
}: NivelPracticaManagerProps) {
  const { toast } = useToast();
  const form = useForm<NivelPracticaFormValues>({
    resolver: zodResolver(nivelPracticaSchema),
    defaultValues: { nombre: "" },
  });

  const handleFormSubmit = async (data: NivelPracticaFormValues) => {
    try {
      await onAddNivel(data);
      toast({
        title: "Nivel de Práctica Agregado",
        description: `Se ha añadido "${data.nombre}" a la carrera.`,
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al agregar el nivel.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirmation = async (nivelId: string) => {
    try {
      await onDeleteNivel(nivelId);
      toast({
        title: "Nivel de Práctica Eliminado",
        description: `El nivel de práctica ha sido eliminado.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el nivel.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>Gestionar Niveles de Práctica</DialogTitle>
          <DialogDescription>
            Añade o elimina niveles de práctica para la carrera de{" "}
            <span className="font-semibold">{carrera.nombre}</span>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex items-start gap-2">
                <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                    <FormItem className="flex-grow">
                    <FormLabel className="sr-only">Nombre del Nivel</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: Práctica Profesional" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Agregando..." : "Agregar"}
                </Button>
            </form>
            </Form>
        
            <div className="rounded-md border max-h-60 overflow-y-auto">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Nombre del Nivel</TableHead>
                        <TableHead className="text-right">Acción</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {niveles.length === 0 ? (
                        <TableRow>
                        <TableCell colSpan={2} className="text-center h-24">
                            No hay niveles para esta carrera.
                        </TableCell>
                        </TableRow>
                    ) : (
                        niveles.map((nivel) => (
                        <TableRow key={nivel.id}>
                            <TableCell>{nivel.nombre}</TableCell>
                            <TableCell className="text-right">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                        Esta acción eliminará el nivel "{nivel.nombre}".
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                        onClick={() => handleDeleteConfirmation(nivel.id)}
                                        >
                                        Eliminar
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                        ))
                    )}
                    </TableBody>
                </Table>
            </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

