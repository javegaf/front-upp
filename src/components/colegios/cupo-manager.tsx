
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Establecimiento, Cupo, NivelPractica, Carrera } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const cupoSchema = z.object({
  nivel_practica_id: z.string().min(1, "Debe seleccionar un nivel de práctica."),
});

type CupoFormValues = z.infer<typeof cupoSchema>;

interface CupoManagerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  establecimiento: Establecimiento;
  cupos: Cupo[];
  nivelesPractica: NivelPractica[];
  carreras: Carrera[];
  onAddCupo: (data: CupoFormValues) => Promise<void>;
  onDeleteCupo: (cupoId: number) => Promise<void>;
}

export function CupoManager({
  isOpen,
  onOpenChange,
  establecimiento,
  cupos,
  nivelesPractica,
  carreras,
  onAddCupo,
  onDeleteCupo,
}: CupoManagerProps) {
  const form = useForm<CupoFormValues>({
    resolver: zodResolver(cupoSchema),
    defaultValues: { nivel_practica_id: "" },
  });
  
  const getCarreraName = (carreraId: number) => carreras.find(c => c.id === carreraId)?.nombre || 'Carrera Desconocida';

  const nivelPracticaOptions = React.useMemo(() => {
    return nivelesPractica.map(nivel => ({
      ...nivel,
      carreraNombre: getCarreraName(nivel.carrera_id),
    }));
  }, [nivelesPractica, carreras]);

  const getNivelInfo = (nivelId: number) => {
    const nivel = nivelPracticaOptions.find(n => n.id === nivelId);
    if (!nivel) return { nombre: "Nivel Desconocido", carreraNombre: "" };
    return { nombre: nivel.nombre, carreraNombre: nivel.carreraNombre };
  }

  const handleFormSubmit = async (data: CupoFormValues) => {
    await onAddCupo(data);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle>Gestionar Cupos de Práctica</DialogTitle>
          <DialogDescription>
            Añade o elimina cupos de práctica para el establecimiento{" "}
            <span className="font-semibold">{establecimiento.nombre}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex items-start gap-2">
              <FormField
                control={form.control}
                name="nivel_practica_id"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel className="sr-only">Nivel de Práctica</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un nivel de práctica..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {nivelPracticaOptions.map((nivel) => (
                          <SelectItem key={nivel.id} value={String(nivel.id)}>
                            {nivel.nombre} ({nivel.carreraNombre})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Agregando..." : "Agregar Cupo"}
              </Button>
            </form>
          </Form>

          <div className="rounded-md border max-h-60 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nivel de Práctica</TableHead>
                  <TableHead>Carrera</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cupos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">
                      No hay cupos para este establecimiento.
                    </TableCell>
                  </TableRow>
                ) : (
                  cupos.map((cupo) => {
                    const { nombre, carreraNombre } = getNivelInfo(cupo.nivel_practica_id);
                    return (
                        <TableRow key={cupo.id}>
                            <TableCell>{nombre}</TableCell>
                            <TableCell>{carreraNombre}</TableCell>
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
                                    Esta acción eliminará el cupo para "{nombre}".
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => onDeleteCupo(cupo.id)}>
                                      Eliminar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            </TableCell>
                        </TableRow>
                    )
                  })
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
