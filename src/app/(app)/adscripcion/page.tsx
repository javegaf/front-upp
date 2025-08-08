
"use client";

import { useState, useEffect, useMemo } from "react";
import type { Estudiante, Establecimiento, Carrera, Directivo, Comuna, Cupo, NivelPractica, Ficha, EmailSchema, SendEmailToEstablecimientoPayload } from "@/lib/definitions";
import * as api from "@/lib/api";
import { format, startOfWeek, addWeeks, parseISO, differenceInWeeks } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, BellRing, BellPlus, Search, PlusCircle, Trash2, ChevronRight, Mail, Send } from "lucide-react";
import { EditableHtmlDisplay } from "@/components/shared/editable-html-display";
import { useToast } from "@/hooks/use-toast";

const ADSCRIPCION_STEPS = {
  STEP1: "seleccion-estudiantes",
  STEP2: "notificacion-establecimiento",
  STEP3: "notificacion-estudiantes",
};

// Helper to safely access nested properties of an object.
const get = (obj: any, path: string, defaultValue: any = undefined) => {
    const travel = (regexp: RegExp) =>
        String.prototype.split
            .call(path, regexp)
            .filter(Boolean)
            .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
    const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
    return result === undefined || result === obj ? defaultValue : result;
};


export default function AdscripcionPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [availableStudents, setAvailableStudents] = useState<Estudiante[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Estudiante[]>([]);
  
  const [allStudents, setAllStudents] = useState<Estudiante[]>([]);
  const [allEstablecimientos, setAllEstablecimientos] = useState<Establecimiento[]>([]);
  const [allCarreras, setAllCarreras] = useState<Carrera[]>([]);
  const [allDirectivos, setAllDirectivos] = useState<Directivo[]>([]);
  const [allComunas, setAllComunas] = useState<Comuna[]>([]);
  const [allCupos, setAllCupos] = useState<Cupo[]>([]);
  const [allNivelesPractica, setAllNivelesPractica] = useState<NivelPractica[]>([]);
  const [createdFichas, setCreatedFichas] = useState<Ficha[]>([]);

  const [selectedEstablecimientoId, setSelectedEstablecimientoId] = useState<string | null>(null);
  const [studentCupoAssignments, setStudentCupoAssignments] = useState<Record<number, number | null>>({});
  
  const [establishmentTemplate, setEstablishmentTemplate] = useState<string>('');
  const [studentTemplate, setStudentTemplate] = useState<string>('');
  const [renderedEmail, setRenderedEmail] = useState<string>('');

  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingFichas, setIsCreatingFichas] = useState(false);
  
  // Step 2 State
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Step 3 State
  const [studentsGroupedByLevel, setStudentsGroupedByLevel] = useState<Record<string, { nivel: NivelPractica; students: Estudiante[] }>>({});
  const [scheduledSendTimes, setScheduledSendTimes] = useState<Record<string, string>>({}); // { [nivelId]: 'YYYY-MM-DDTHH:mm' }
  const [previewStudent, setPreviewStudent] = useState<Estudiante | null>(null);
  const [renderedStudentEmail, setRenderedStudentEmail] = useState<string>('');
  const [isUpdatingAndSending, setIsUpdatingAndSending] = useState(false);
  const [studentEmailsSent, setStudentEmailsSent] = useState(false);

  const [professionalDates, setProfessionalDates] = useState({ inicio: "", termino: "" });
  const [pedagogicalDates, setPedagogicalDates] = useState({ inicio: "", termino: "" });

  const [currentStep, setCurrentStep] = useState<string>(ADSCRIPCION_STEPS.STEP1);
  const [unlockedSteps, setUnlockedSteps] = useState<string[]>([ADSCRIPCION_STEPS.STEP1]);

  const selectedEstablecimiento = useMemo(() => {
    return allEstablecimientos.find(c => c.id === selectedEstablecimientoId) || null;
  }, [selectedEstablecimientoId, allEstablecimientos]);

  const selectedDirectivo = useMemo(() => {
    if (!selectedEstablecimiento) return null;
    return allDirectivos.find(d => d.establecimiento_id === selectedEstablecimiento.id) || null;
  }, [selectedEstablecimiento, allDirectivos]);

  const weekOptions = useMemo(() => {
    const options = [];
    let currentWeekStart = startOfWeek(addWeeks(new Date(), 1), { weekStartsOn: 1 }); // Monday

    for (let i = 0; i < 39; i++) {
        const week_start_formatted = format(currentWeekStart, "dd 'de' MMMM, yyyy");
        const week_value = format(currentWeekStart, "yyyy-MM-dd");
        options.push({
            label: `Semana del ${week_start_formatted}`,
            value: week_value,
        });
        currentWeekStart = addWeeks(currentWeekStart, 1);
    }
    return options;
  }, []);

  const getCarreraName = (carreraId: number) => allCarreras.find(c => c.id === carreraId)?.nombre || "N/A";
  const getComunaName = (comunaId: number) => allComunas.find(c => c.id === comunaId)?.nombre || "N/A";
  const getNivelName = (nivelId: number) => allNivelesPractica.find(n => n.id === nivelId)?.nombre || "N/A";

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [studentsData, establecimientosData, carrerasData, directivosData, comunasData, cuposData, nivelesData, estTemplateData, stuTemplateData] = await Promise.all([
          api.getEstudiantes(),
          api.getEstablecimientos(),
          api.getCarreras(),
          api.getDirectivos(),
          api.getComunas(),
          api.getCupos(),
          api.getNivelesPractica(),
          api.getEstablishmentEmailTemplate(),
          api.getStudentEmailTemplate(),
        ]);
        setAllStudents(studentsData);
        setAvailableStudents(studentsData);
        setAllEstablecimientos(establecimientosData);
        setAllCarreras(carrerasData);
        setAllDirectivos(directivosData);
        setAllComunas(comunasData);
        setAllCupos(cuposData);
        setAllNivelesPractica(nivelesData);
        setEstablishmentTemplate(estTemplateData || '');
        setStudentTemplate(stuTemplateData || '');

      } catch (error) {
        toast({
            title: "Error al cargar datos",
            description: "No se pudieron obtener los datos para el proceso de adscripción.",
            variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [toast]);
  
  useEffect(() => {
    if (currentStep === ADSCRIPCION_STEPS.STEP3 && createdFichas.length > 0) {
        const grouped: Record<string, { nivel: NivelPractica; students: Estudiante[] }> = {};

        for (const ficha of createdFichas) {
            const student = allStudents.find(s => s.id === ficha.estudiante_id);
            if (!student) continue;

            const cupo = allCupos.find(c => c.id === ficha.cupo_id);
            if (!cupo) continue;

            const nivel = allNivelesPractica.find(n => n.id === cupo.nivel_practica_id);
            if (!nivel) continue;

            if (!grouped[nivel.id]) {
                grouped[nivel.id] = { nivel, students: [] };
            }
            grouped[nivel.id].students.push(student);
        }
        setStudentsGroupedByLevel(grouped);
    }
  }, [currentStep, createdFichas, allStudents, allCupos, allNivelesPractica]);

  useEffect(() => {
    if (!previewStudent || !studentTemplate || !selectedEstablecimiento || !selectedDirectivo) {
        setRenderedStudentEmail("<p class='text-muted-foreground p-4 text-center'>Seleccione un estudiante para previsualizar el correo.</p>");
        return;
    }

    const ficha = createdFichas.find(f => f.estudiante_id === previewStudent.id);
    if (!ficha) return;

    const cupo = allCupos.find(c => c.id === ficha.cupo_id);
    const nivel = allNivelesPractica.find(n => n.id === cupo?.nivel_practica_id);

    const templateData = {
        estudiante: previewStudent,
        nombre_establecimiento: selectedEstablecimiento.nombre,
        nivel_practica: nivel?.nombre || 'N/A',
        semana_inicio: ficha.fecha_inicio ? format(parseISO(ficha.fecha_inicio), "dd 'de' MMMM, yyyy") : "N/A",
        semana_termino: ficha.fecha_termino ? format(parseISO(ficha.fecha_termino), "dd 'de' MMMM, yyyy") : 'N/A',
        directivo: selectedDirectivo,
    };
    
    const rendered = renderTemplate(studentTemplate, templateData);
    setRenderedStudentEmail(rendered);

  }, [previewStudent, studentTemplate, createdFichas, allCupos, allNivelesPractica, selectedEstablecimiento, selectedDirectivo]);

  const renderTemplate = (template: string, data: Record<string, any>): string => {
    if (!template) return "";

    const processContent = (content: string, contextData: Record<string, any>): string => {
        let loopResolvedContent = content;
        
        const loopRegex = /\{%\s*for\s+(\w+)\s+in\s+([\w\.]+)\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g;
        loopResolvedContent = loopResolvedContent.replace(loopRegex, (match, itemName, collectionPath, innerContent) => {
            const collection = get(contextData, collectionPath.trim());
            if (Array.isArray(collection)) {
                return collection.map(item => {
                    const newContext = { ...contextData, [itemName]: item };
                    return processContent(innerContent, newContext);
                }).join('');
            }
            return '';
        });

        const varRegex = /\{\{\s*([\w\._]+)\s*\}\}/g;
        return loopResolvedContent.replace(varRegex, (match, path) => {
            const value = get(contextData, path.trim());

            if (value === undefined || value === null) {
                return '';
            }
            
            if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z)?)?$/.test(value)) {
                try {
                    return format(parseISO(value), "dd 'de' MMMM, yyyy");
                } catch (e) { /* fallback */ }
            }

            if (typeof value === 'object') {
              return '';
            }

            return String(value);
        });
    };

    return processContent(template, data);
  };
  
  const calculateWeeks = (start: string, end: string) => {
    if (!start || !end) return 0;
    try {
        const startDate = parseISO(start);
        const endDate = parseISO(end);
        return differenceInWeeks(endDate, startDate);
    } catch(e) {
        return 0;
    }
  }

  useEffect(() => {
    if (!selectedEstablecimiento || !selectedDirectivo) {
        setRenderedEmail("<p class='text-muted-foreground p-4 text-center'>Por favor, seleccione un establecimiento para generar la previsualización del correo.</p>");
        return;
    }

    const fichasForTemplate = createdFichas.map(ficha => {
        const student = allStudents.find(s => s.id === ficha.estudiante_id);
        return {
            ...ficha,
            estudiante: student || {},
        };
    });

    const templateData = {
        directivo: selectedDirectivo,
        establecimiento: selectedEstablecimiento,
        semana_inicio_profesional: professionalDates.inicio ? format(parseISO(professionalDates.inicio), "dd 'de' MMMM") : "N/A",
        semana_termino_profesional: professionalDates.termino ? format(parseISO(professionalDates.termino), "dd 'de' MMMM") : "N/A",
        numero_semanas_profesional: calculateWeeks(professionalDates.inicio, professionalDates.termino),
        semana_inicio_pp: pedagogicalDates.inicio ? format(parseISO(pedagogicalDates.inicio), "dd 'de' MMMM") : "N/A",
        semana_termino_pp: pedagogicalDates.termino ? format(parseISO(pedagogicalDates.termino), "dd 'de' MMMM") : "N/A",
        numero_semanas_pp: calculateWeeks(pedagogicalDates.inicio, pedagogicalDates.termino),
        fichas: fichasForTemplate,
    };

    const rendered = renderTemplate(establishmentTemplate, templateData);
    setRenderedEmail(rendered);

  }, [selectedEstablecimiento, selectedDirectivo, establishmentTemplate, professionalDates, pedagogicalDates, createdFichas, allStudents]);

  const filteredAvailableStudents = useMemo(() => {
    if (!searchTerm) {
      return availableStudents;
    }
    return availableStudents.filter(
      (student) =>
        student.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${student.nombre} ${student.ap_paterno} ${student.ap_materno}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCarreraName(student.carrera_id).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, availableStudents, allCarreras]);

  const handleAddStudent = (studentToAdd: Estudiante) => {
    setSelectedStudents((prevSelected) => [...prevSelected, studentToAdd]);
    setAvailableStudents((prevAvailable) => prevAvailable.filter((s) => s.id !== studentToAdd.id));
    setStudentCupoAssignments(prev => ({...prev, [studentToAdd.id]: null}));
  };

  const handleRemoveStudent = (studentToRemove: Estudiante) => {
    setAvailableStudents((prevAvailable) => [...prevAvailable, studentToRemove]);
    setSelectedStudents((prevSelected) => prevSelected.filter((s) => s.id !== studentToRemove.id));
    setStudentCupoAssignments(prev => {
        const newAssignments = {...prev};
        delete newAssignments[studentToRemove.id];
        return newAssignments;
    })
  };

  const getAvailableCuposForStudent = (student: Estudiante) => {
    if (!selectedEstablecimientoId) return [];
    
    const nivelesForCarrera = allNivelesPractica.filter(n => n.carrera_id === student.carrera_id);
    const nivelIds = nivelesForCarrera.map(n => n.id);

    return allCupos.filter(cupo => 
        cupo.establecimiento_id === selectedEstablecimientoId && 
        nivelIds.includes(cupo.nivel_practica_id)
    );
  };

  const handleCupoAssignmentChange = (studentId: number, cupoId: string) => {
    setStudentCupoAssignments(prev => ({...prev, [studentId]: Number(cupoId)}))
  }

  const isStep1Valid = selectedStudents.length > 0 && selectedEstablecimientoId !== null && professionalDates.inicio && professionalDates.termino && pedagogicalDates.inicio && pedagogicalDates.termino && selectedStudents.every(s => studentCupoAssignments[s.id]);
  const isStep2Valid = selectedEstablecimientoId !== null && createdFichas.length > 0;
  const isStep3Valid = createdFichas.length > 0 && Object.keys(studentsGroupedByLevel).every(nivelId => scheduledSendTimes[nivelId]);

  const handleCreateFichas = async (): Promise<Ficha[] | null> => {
    if (!isStep1Valid) {
      toast({
        title: "Información incompleta",
        description: "Asegúrate de haber seleccionado un establecimiento, las fechas y de haber asignado un cupo a cada estudiante.",
        variant: "destructive",
      });
      return null;
    }

    const fichaCreationPromises: Promise<Ficha>[] = [];

    for (const student of selectedStudents) {
      const cupoId = studentCupoAssignments[student.id];
      if (!cupoId) continue; // Should be prevented by isStep1Valid, but as a safeguard.

      const cupo = allCupos.find(c => c.id === cupoId);
      if (!cupo) continue;

      const nivelPractica = allNivelesPractica.find(n => n.id === cupo.nivel_practica_id);
      if (!nivelPractica) continue;

      const isProfessional = nivelPractica.nombre.toLowerCase().includes('profesional');
      const dates = isProfessional ? professionalDates : pedagogicalDates;

      const fichaPayload = {
        estudiante_id: student.id,
        establecimiento_id: selectedEstablecimientoId!,
        cupo_id: cupo.id,
        fecha_inicio: dates.inicio,
        fecha_termino: dates.termino,
        fecha_envio: new Date().toISOString(),
      };

      fichaCreationPromises.push(api.createFicha(fichaPayload));
    }

    try {
      const newFichas = await Promise.all(fichaCreationPromises);
      setCreatedFichas(newFichas);
      toast({
        title: "Fichas Creadas Exitosamente",
        description: `Se han creado ${newFichas.length} fichas de práctica.`,
      });
      return newFichas;
    } catch (error) {
      toast({
        title: "Error al crear fichas",
        description: "Ocurrió un error al intentar registrar las fichas en el sistema.",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSendNotification = async () => {
    if (!selectedEstablecimiento || !selectedDirectivo) {
      toast({
        title: "Información incompleta",
        description: "No se ha seleccionado un establecimiento o no se encontró un directivo.",
        variant: "destructive",
      });
      return;
    }

    if (createdFichas.length === 0) {
        toast({
            title: "No hay fichas para enviar",
            description: "No se encontraron fichas creadas en este proceso. Por favor, vuelva al paso 1 e inténtelo de nuevo.",
            variant: "destructive",
        });
        return;
    }

    setIsSendingEmail(true);

    const emailPayload: SendEmailToEstablecimientoPayload = {
      email: {
        subject: `Notificación de adscripción de prácticas - ${selectedEstablecimiento.nombre}`,
        email: [selectedDirectivo.email],
      },
      body: {
        directivo: selectedDirectivo,
        establecimiento: null,
        fichas: createdFichas,
        semana_inicio_profesional: professionalDates.inicio ? format(parseISO(professionalDates.inicio), "dd 'de' MMMM") : "N/A",
        semana_termino_profesional: professionalDates.termino ? format(parseISO(professionalDates.termino), "dd 'de' MMMM") : "N/A",
        numero_semanas_profesional: calculateWeeks(professionalDates.inicio, professionalDates.termino),
        semana_inicio_pp: pedagogicalDates.inicio ? format(parseISO(pedagogicalDates.inicio), "dd 'de' MMMM") : "N/A",
        semana_termino_pp: pedagogicalDates.termino ? format(parseISO(pedagogicalDates.termino), "dd 'de' MMMM") : "N/A",
        numero_semanas_pp: calculateWeeks(pedagogicalDates.inicio, pedagogicalDates.termino),
      }
    };
    
    try {
      await api.sendEmailToEstablecimiento(selectedEstablecimiento.id, emailPayload);
      toast({
        title: "Notificación Enviada",
        description: `El correo ha sido enviado a ${selectedDirectivo.email}.`,
      });
      setEmailSent(true);
    } catch (error) {
      toast({
        title: "Error al enviar notificación",
        description: "No se pudo enviar el correo. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };
  
  const handleUpdateAndSendStudentEmails = async () => {
    const allDatesSet = Object.keys(studentsGroupedByLevel).every(nivelId => scheduledSendTimes[nivelId]);
    if (!allDatesSet) {
        toast({ title: "Fechas Incompletas", description: "Por favor, define una fecha y hora de envío para cada grupo de práctica.", variant: "destructive" });
        return;
    }

    setIsUpdatingAndSending(true);

    try {
        const updatePromises = createdFichas.map(ficha => {
            const cupo = allCupos.find(c => c.id === ficha.cupo_id);
            const nivelId = cupo!.nivel_practica_id;
            const fecha_envio = new Date(scheduledSendTimes[nivelId]).toISOString();
            
            const fichaPayload: Omit<Ficha, 'id'> = {
                estudiante_id: ficha.estudiante_id,
                establecimiento_id: ficha.establecimiento_id,
                cupo_id: ficha.cupo_id,
                fecha_inicio: ficha.fecha_inicio,
                fecha_termino: ficha.fecha_termino,
                fecha_envio: fecha_envio,
            };

            return api.updateFicha(ficha.id, fichaPayload);
        });

        await Promise.all(updatePromises);
        toast({ title: "Fichas Actualizadas", description: "Las fechas de envío han sido guardadas." });

        const sendPromises = createdFichas.map(async (ficha) => {
            const student = allStudents.find(s => s.id === ficha.estudiante_id);
            if (!student) return Promise.resolve();

            const emailPayload: EmailSchema = {
                subject: `Detalles de tu Práctica - ${selectedEstablecimiento?.nombre || 'UCSC'}`,
                email: [student.email],
            };
            return api.sendEmailToStudent(ficha.id, emailPayload);
        });
        
        await Promise.all(sendPromises);
        
        toast({ title: "Correos Enviados", description: "Los correos a los estudiantes han sido procesados y/o programados." });
        setStudentEmailsSent(true);

    } catch (error) {
        console.error("Error updating/sending student emails:", error);
        toast({ title: "Error en el Envío", description: "No se pudieron actualizar las fichas o enviar los correos.", variant: "destructive" });
    } finally {
        setIsUpdatingAndSending(false);
    }
  };


  const goToNextStep = async (nextStep: string) => {
    if (currentStep === ADSCRIPCION_STEPS.STEP1) {
      setIsCreatingFichas(true);
      const newFichas = await handleCreateFichas();
      setIsCreatingFichas(false);
      if (!newFichas || newFichas.length === 0) {
        return; 
      }
    }
    setUnlockedSteps((prev) => [...new Set([...prev, nextStep])]);
    setCurrentStep(nextStep);
  };

  const handleTabChange = (newStep: string) => {
    if (unlockedSteps.includes(newStep)) {
      setCurrentStep(newStep);
    }
  };
  
  if (isLoading) {
      return <p>Cargando datos para adscripción...</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Proceso de Adscripción</h1>
        <p className="text-muted-foreground">
          Gestiona el proceso de asignación de prácticas paso a paso.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pasos del Proceso de Adscripción</CardTitle>
          <CardDescription>
            Navega a través de los pasos para completar la adscripción de estudiantes a prácticas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={currentStep} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6">
              <TabsTrigger value={ADSCRIPCION_STEPS.STEP1} disabled={unlockedSteps.includes(ADSCRIPCION_STEPS.STEP2)}>
                <Users className="mr-2 h-4 w-4" />
                Paso 1: Selección y Adscripción
              </TabsTrigger>
              <TabsTrigger value={ADSCRIPCION_STEPS.STEP2} disabled={!unlockedSteps.includes(ADSCRIPCION_STEPS.STEP2)}>
                <BellRing className="mr-2 h-4 w-4" />
                Paso 2: Notificación al Establecimiento
              </TabsTrigger>
              <TabsTrigger value={ADSCRIPCION_STEPS.STEP3} disabled={!unlockedSteps.includes(ADSCRIPCION_STEPS.STEP3)}>
                <BellPlus className="mr-2 h-4 w-4" />
                Paso 3: Notificación a Estudiantes
              </TabsTrigger>
            </TabsList>

            <TabsContent value={ADSCRIPCION_STEPS.STEP1}>
              <fieldset disabled={unlockedSteps.includes(ADSCRIPCION_STEPS.STEP2)}>
                <Card>
                  <CardHeader>
                    <CardTitle>Paso 1: Selección de Establecimiento, Fechas y Estudiantes</CardTitle>
                    <CardDescription>
                      Completa la información para la adscripción. Todos los campos son requeridos para continuar.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="establecimiento-select">Seleccionar Establecimiento</Label>
                        <Select
                        value={selectedEstablecimientoId || undefined}
                        onValueChange={(value) => setSelectedEstablecimientoId(value)}
                        >
                        <SelectTrigger id="establecimiento-select" className="w-full sm:w-[400px]">
                            <SelectValue placeholder="Seleccione un establecimiento..." />
                        </SelectTrigger>
                        <SelectContent>
                            {allEstablecimientos.map((establecimiento) => (
                            <SelectItem key={establecimiento.id} value={establecimiento.id}>
                                {establecimiento.nombre}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="shadow-none border">
                            <CardHeader>
                                <CardTitle className="text-base">Fechas Práctica Profesional</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Semana de Inicio</Label>
                                    <Select value={professionalDates.inicio} onValueChange={(value) => setProfessionalDates(p => ({...p, inicio: value}))}>
                                        <SelectTrigger><SelectValue placeholder="Seleccionar semana..." /></SelectTrigger>
                                        <SelectContent>
                                            {weekOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                 <div className="space-y-2">
                                    <Label>Semana de Término</Label>
                                    <Select value={professionalDates.termino} onValueChange={(value) => setProfessionalDates(p => ({...p, termino: value}))}>
                                        <SelectTrigger><SelectValue placeholder="Seleccionar semana..." /></SelectTrigger>
                                        <SelectContent>
                                            {weekOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                         <Card className="shadow-none border">
                            <CardHeader>
                                <CardTitle className="text-base">Fechas Prácticas Pedagógicas</CardTitle>
                                <CardDescription className="text-xs">Para todos los niveles que no son "Profesional"</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Semana de Inicio</Label>
                                     <Select value={pedagogicalDates.inicio} onValueChange={(value) => setPedagogicalDates(p => ({...p, inicio: value}))}>
                                        <SelectTrigger><SelectValue placeholder="Seleccionar semana..." /></SelectTrigger>
                                        <SelectContent>
                                            {weekOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                 <div className="space-y-2">
                                    <Label>Semana de Término</Label>
                                     <Select value={pedagogicalDates.termino} onValueChange={(value) => setPedagogicalDates(p => ({...p, termino: value}))}>
                                        <SelectTrigger><SelectValue placeholder="Seleccionar semana..." /></SelectTrigger>
                                        <SelectContent>
                                            {weekOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <fieldset disabled={!selectedEstablecimientoId} className="space-y-6 disabled:opacity-50">
                        <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Buscar y Agregar Estudiantes</h3>
                        {!selectedEstablecimientoId && <p className="text-sm text-muted-foreground">Debes seleccionar un establecimiento para agregar estudiantes.</p>}
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                            type="search"
                            placeholder="Buscar por nombre, RUT, email o carrera..."
                            className="pl-8 w-full sm:w-[300px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {filteredAvailableStudents.length > 0 ? (
                            <Card className="border shadow-sm max-h-60 overflow-y-auto">
                            <Table>
                                <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre Completo</TableHead>
                                    <TableHead>Carrera</TableHead>
                                    <TableHead className="text-right">Acción</TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                {filteredAvailableStudents.map((student) => (
                                    <TableRow key={student.id}>
                                    <TableCell>{`${student.nombre} ${student.ap_paterno} ${student.ap_materno}`}</TableCell>
                                    <TableCell>{getCarreraName(student.carrera_id)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleAddStudent(student)}
                                        >
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Agregar
                                        </Button>
                                    </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                            </Card>
                        ) : (
                            <p className="text-muted-foreground text-sm text-center py-4">
                            {searchTerm ? "No se encontraron estudiantes con ese criterio." : "No hay más estudiantes disponibles para agregar."}
                            </p>
                        )}
                        </div>

                        <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Estudiantes Seleccionados para Adscripción ({selectedStudents.length})</h3>
                        {selectedStudents.length > 0 ? (
                            <Card className="border shadow-sm">
                            <Table>
                                <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre Completo</TableHead>
                                    <TableHead>Carrera</TableHead>
                                    <TableHead>Cupo Asignado</TableHead>
                                    <TableHead className="text-right">Acción</TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                {selectedStudents.map((student) => {
                                    const availableCupos = getAvailableCuposForStudent(student);
                                    return (
                                        <TableRow key={student.id}>
                                            <TableCell>{`${student.nombre} ${student.ap_paterno} ${student.ap_materno}`}</TableCell>
                                            <TableCell>{getCarreraName(student.carrera_id)}</TableCell>
                                            <TableCell>
                                                <Select
                                                  value={studentCupoAssignments[student.id]?.toString() || ""}
                                                  onValueChange={(value) => handleCupoAssignmentChange(student.id, value)}
                                                  disabled={availableCupos.length === 0}
                                                >
                                                    <SelectTrigger className="w-[200px]">
                                                        <SelectValue placeholder="Seleccionar cupo..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {availableCupos.length > 0 ? (
                                                            availableCupos.map(cupo => (
                                                                <SelectItem key={cupo.id} value={cupo.id.toString()}>
                                                                    {getNivelName(cupo.nivel_practica_id)}
                                                                </SelectItem>
                                                            ))
                                                        ) : (
                                                            <SelectItem value="-" disabled>No hay cupos disponibles</SelectItem>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleRemoveStudent(student)}
                                                >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Quitar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                </TableBody>
                            </Table>
                            </Card>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center min-h-[150px] border-dashed border-2 border-muted rounded-md p-6">
                            <Users className="h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                            <p className="text-muted-foreground">
                                No has seleccionado ningún estudiante aún.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Utiliza la búsqueda de arriba para agregar estudiantes.
                            </p>
                            </div>
                        )}
                        </div>
                    </fieldset>
                    <div className="flex justify-end mt-4">
                        <Button
                            onClick={() => goToNextStep(ADSCRIPCION_STEPS.STEP2)}
                            disabled={!isStep1Valid || isCreatingFichas}
                        >
                            {isCreatingFichas ? "Creando Fichas..." : "Crear Fichas y Continuar"}
                            {!isCreatingFichas && <ChevronRight className="ml-2 h-4 w-4" />}
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              </fieldset>
            </TabsContent>

            <TabsContent value={ADSCRIPCION_STEPS.STEP2}>
              <Card>
                <CardHeader>
                  <CardTitle>Paso 2: Notificación al Establecimiento</CardTitle>
                  <CardDescription>
                    Revisa la previsualización del correo de notificación. La plantilla se puede editar en la sección "Plantillas".
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedEstablecimiento && selectedDirectivo && (
                    <div className="space-y-1 text-sm p-4 bg-muted/50 rounded-lg">
                      <p><span className="font-semibold">Establecimiento:</span> {selectedEstablecimiento.nombre}</p>
                      <p><span className="font-semibold">Comuna:</span> {getComunaName(selectedEstablecimiento.comuna_id)}</p>
                      <p><span className="font-semibold">Destinatario:</span> {selectedDirectivo.nombre} ({selectedDirectivo.email})</p>
                      <p><span className="font-semibold">Estudiantes a notificar:</span> {createdFichas.length}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Previsualización del Correo</Label>
                    <EditableHtmlDisplay
                      key={selectedEstablecimientoId || 'no-establecimiento-selected'}
                      initialHtml={renderedEmail}
                      editable={false}
                      className="w-full min-h-[300px] max-h-[60vh] overflow-y-auto"
                      aria-label="Previsualización del contenido del correo"
                    />
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <Button 
                      variant="outline"
                      onClick={handleSendNotification}
                      disabled={!isStep2Valid || isSendingEmail || emailSent}
                    >
                       <Mail className="mr-2 h-4 w-4" />
                       {isSendingEmail ? "Enviando..." : (emailSent ? "Notificación Enviada" : "Enviar Notificación")}
                    </Button>
                    <Button
                      onClick={() => goToNextStep(ADSCRIPCION_STEPS.STEP3)}
                      disabled={!isStep2Valid}
                    >
                      Siguiente Paso <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value={ADSCRIPCION_STEPS.STEP3}>
                <Card>
                    <CardHeader>
                        <CardTitle>Paso 3: Notificación a Estudiantes</CardTitle>
                        <CardDescription>
                            Programa la fecha de envío, previsualiza el correo para cada estudiante y envía las notificaciones.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold">Programación de Envío por Nivel</h3>
                            {Object.keys(studentsGroupedByLevel).length > 0 ? (
                                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                                    {Object.entries(studentsGroupedByLevel).map(([nivelId, { nivel, students }]) => (
                                        <Card key={nivelId} className="bg-muted/50">
                                            <CardHeader className="pb-4">
                                                <CardTitle className="text-base">{nivel.nombre}</CardTitle>
                                                <CardDescription>{students.length} estudiante(s) en este nivel.</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor={`datetime-${nivelId}`}>Fecha y Hora de Envío</Label>
                                                    <Input
                                                        id={`datetime-${nivelId}`}
                                                        type="datetime-local"
                                                        value={scheduledSendTimes[nivelId] || ''}
                                                        onChange={(e) => setScheduledSendTimes(prev => ({ ...prev, [nivelId]: e.target.value }))}
                                                    />
                                                </div>
                                                <div className="text-sm">
                                                    <p className="font-medium mb-1">Estudiantes:</p>
                                                    <ul className="list-disc list-inside text-muted-foreground">
                                                      {students.map(student => (
                                                        <li key={student.id}>
                                                          <button onClick={() => setPreviewStudent(student)} className="text-left underline-offset-2 hover:underline disabled:no-underline disabled:cursor-default" disabled={previewStudent?.id === student.id}>
                                                            {student.nombre} {student.ap_paterno}
                                                          </button>
                                                        </li>
                                                      ))}
                                                    </ul>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No hay estudiantes para notificar.</p>
                            )}
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Previsualización del Correo del Estudiante</h3>
                            {previewStudent && <p className="text-sm text-muted-foreground">Mostrando previsualización para: <span className="font-medium text-foreground">{previewStudent.nombre} {previewStudent.ap_paterno}</span></p>}
                            <EditableHtmlDisplay
                                initialHtml={renderedStudentEmail}
                                editable={false}
                                className="w-full min-h-[400px] max-h-[60vh] overflow-y-auto"
                                aria-label="Previsualización del correo del estudiante"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                       <Button
                         onClick={handleUpdateAndSendStudentEmails}
                         disabled={!isStep3Valid || isUpdatingAndSending || studentEmailsSent}
                       >
                         <Send className="mr-2 h-4 w-4" />
                         {isUpdatingAndSending ? 'Procesando...' : (studentEmailsSent ? 'Correos Enviados' : 'Actualizar y Enviar Correos')}
                       </Button>
                    </CardFooter>
                </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

    