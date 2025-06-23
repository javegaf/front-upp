
"use client";

import type { Estudiante, Carrera, Comuna, Tutor, Ficha, Establecimiento, Cupo, NivelPractica } from "@/lib/definitions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, BookUser, University, MapPin, NotebookPen, Sparkles, ClipboardCheck, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, isPast, isFuture, isWithinInterval } from "date-fns";


interface StudentDetailsProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  student: Estudiante | null;
  carreras: Carrera[];
  comunas: Comuna[];
  tutores: Tutor[];
  fichas: Ficha[];
  establecimientos: Establecimiento[];
  cupos: Cupo[];
  nivelesPractica: NivelPractica[];
}

const DetailRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | React.ReactNode }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-4 py-2">
            <div className="flex-shrink-0 w-8 text-center">
                <Icon className="h-5 w-5 text-muted-foreground inline-block" />
            </div>
            <div>
                <p className="text-sm font-semibold text-muted-foreground">{label}</p>
                <p className="text-base text-foreground">{value}</p>
            </div>
        </div>
    );
};


export function StudentDetails({ 
    isOpen, onOpenChange, student, carreras, comunas, tutores,
    fichas, establecimientos, cupos, nivelesPractica
}: StudentDetailsProps) {
  if (!student) return null;

  const getCarreraName = (id: number) => carreras.find(c => c.id === id)?.nombre || "N/A";
  const getComunaName = (id: number) => comunas.find(c => c.id === id)?.nombre || "N/A";
  const getTutorName = (id: number | null) => tutores.find(t => t.id === id)?.nombre || "No asignado";

  const studentFichas = fichas.filter(f => f.estudiante_id === student.id);
  
  const getFichaDetails = (ficha: Ficha) => {
      const establecimiento = establecimientos.find(e => e.id === ficha.establecimiento_id);
      const cupo = cupos.find(c => c.id === ficha.cupo_id);
      const nivel = cupo ? nivelesPractica.find(n => n.id === cupo.nivel_practica_id) : null;
      return {
          establecimientoNombre: establecimiento?.nombre || "Establecimiento no encontrado",
          nivelNombre: nivel?.nombre || "Nivel no encontrado",
      };
  };

  const getPracticeStatus = (ficha: Ficha): { text: string; variant: "default" | "secondary" | "outline" } => {
      const now = new Date();
      const startDate = parseISO(ficha.fecha_inicio);
      const endDate = ficha.fecha_termino ? parseISO(ficha.fecha_termino) : null;

      if (endDate && isPast(endDate)) {
          return { text: "Finalizada", variant: "secondary" };
      }
      if (isFuture(startDate)) {
          return { text: "Programada", variant: "outline" };
      }
      if (endDate && isWithinInterval(now, { start: startDate, end: endDate })) {
          return { text: "En Curso", variant: "default" };
      }
      // If no end date but start date is in the past
      if (!endDate && isPast(startDate)) {
          return { text: "En Curso", variant: "default" };
      }

      return { text: "Estado Desconocido", variant: "outline" };
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline">Detalles del Estudiante</DialogTitle>
          <DialogDescription>
            Información completa de {student.nombre} {student.ap_paterno}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-2 py-4 max-h-[70vh] overflow-y-auto pr-4">
            <DetailRow
                icon={User}
                label="Nombre Completo"
                value={`${student.nombre} ${student.ap_paterno} ${student.ap_materno}`}
            />
             <DetailRow
                icon={NotebookPen}
                label="RUT"
                value={student.rut}
            />
             <DetailRow
                icon={User}
                label="Email"
                value={student.email}
            />
            <DetailRow
                icon={University}
                label="Carrera"
                value={getCarreraName(student.carrera_id)}
            />
            <DetailRow
                icon={MapPin}
                label="Comuna"
                value={getComunaName(student.comuna_id)}
            />
            <DetailRow
                icon={BookUser}
                label="Tutor Académico"
                value={getTutorName(student.tutor_id)}
            />
            {student.cond_especial && (
                 <DetailRow
                    icon={Sparkles}
                    label="Condición Especial"
                    value={student.cond_especial}
                />
            )}

            <div className="pt-4">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5" /> Historial de Prácticas
                </h3>
                {studentFichas.length > 0 ? (
                    <div className="space-y-4">
                        {studentFichas.map(ficha => {
                            const details = getFichaDetails(ficha);
                            const status = getPracticeStatus(ficha);
                            return (
                                <Card key={ficha.id} className="bg-muted/50">
                                    <CardHeader className="p-4">
                                        <CardTitle className="text-base flex justify-between items-center">
                                            <span>{details.nivelNombre}</span>
                                            <Badge variant={status.variant}>{status.text}</Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 text-sm space-y-2">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <University className="h-4 w-4" />
                                            <span>{details.establecimientoNombre}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <CalendarDays className="h-4 w-4" />
                                            <span>
                                                {format(parseISO(ficha.fecha_inicio), "dd/MM/yyyy")} - {ficha.fecha_termino ? format(parseISO(ficha.fecha_termino), "dd/MM/yyyy") : 'Indefinido'}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Este estudiante no tiene un historial de prácticas registrado.
                    </p>
                )}
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
