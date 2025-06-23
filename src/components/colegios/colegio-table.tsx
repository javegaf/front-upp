
"use client";

import type { Establecimiento, Comuna, Cupo, Directivo } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { FilePenLine, Trash2, Settings2, Contact } from "lucide-react";
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

interface ColegioTableProps {
  establecimientos: Establecimiento[];
  comunas: Comuna[];
  cupos: Cupo[];
  directivos: Directivo[];
  onEdit: (establecimiento: Establecimiento) => void;
  onDelete: (establecimientoId: string) => Promise<void>;
  onManageCupos: (establecimiento: Establecimiento) => void;
  onManageDirectivos: (establecimiento: Establecimiento) => void;
}

export function ColegioTable({ 
  establecimientos, comunas, cupos, directivos, 
  onEdit, onDelete, onManageCupos, onManageDirectivos
}: ColegioTableProps) {

  const getComunaName = (comunaId: number) => comunas.find(c => c.id === comunaId)?.nombre || "N/A";
  const getCuposCount = (establecimientoId: string) => cupos.filter(c => c.establecimiento_id === establecimientoId).length;
  const getDirectivosCount = (establecimientoId: string) => directivos.filter(d => d.establecimiento_id === establecimientoId).length;

  return (
    <div className="rounded-md border shadow-sm bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>RBD</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Comuna</TableHead>
            <TableHead>Directivos</TableHead>
            <TableHead>Cupos</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {establecimientos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24">
                No hay colegios registrados.
              </TableCell>
            </TableRow>
          ) : (
            establecimientos.map((colegio) => (
              <TableRow key={colegio.id}>
                <TableCell className="font-medium">{colegio.rbd}</TableCell>
                <TableCell>{colegio.nombre}</TableCell>
                <TableCell>{getComunaName(colegio.comuna_id)}</TableCell>
                <TableCell>{getDirectivosCount(colegio.id)}</TableCell>
                <TableCell>{getCuposCount(colegio.id)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon" onClick={() => onManageDirectivos(colegio)} title="Gestionar Directivos">
                    <Contact className="h-4 w-4" />
                    <span className="sr-only">Gestionar Directivos</span>
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => onManageCupos(colegio)} title="Gestionar Cupos">
                    <Settings2 className="h-4 w-4" />
                    <span className="sr-only">Gestionar Cupos</span>
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => onEdit(colegio)} title="Editar Colegio">
                    <FilePenLine className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon" title="Eliminar Colegio">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Esto eliminará permanentemente el colegio
                          <span className="font-semibold"> {colegio.nombre}</span>, sus directivos y sus cupos asociados.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(colegio.id)}>
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
  );
}
