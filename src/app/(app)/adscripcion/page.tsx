
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import type { Estudiante, Establecimiento, Carrera, Directivo } from "@/lib/definitions";
import { mockEstudiantes, mockEstablecimientos, mockCarreras, mockDirectivos } from "@/lib/definitions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, BellRing, BellPlus, Search, PlusCircle, Trash2, ChevronRight, Building } from "lucide-react";
import Image from "next/image";
import { EditableHtmlDisplay } from "@/components/shared/editable-html-display";


// Mock data - en una aplicación real, esto vendría de una API
const mockAlumnosDisponibles: Estudiante[] = mockEstudiantes;

const ADSCRIPCION_STEPS = {
  STEP1: "seleccion-estudiantes",
  STEP2: "notificacion-establecimiento",
  STEP3: "notificacion-estudiantes",
};

const generateEmailPreview = (establecimiento: Establecimiento | null, directivo: Directivo | null): string => {
  if (!establecimiento || !directivo) return "<p class='text-muted-foreground p-4 text-center'>Por favor, seleccione un establecimiento para generar y editar la plantilla del correo.</p>";

  const jefeUTP = directivo.nombre;
  const nombreEstablecimiento = establecimiento.nombre;

  return `
<p>Estimado/a ${jefeUTP},</p>
<p>Le saludo de manera cordial en nombre de la Unidad de Práctica Pedagógica (UPP) de la Facultad de Educación de la Universidad Católica de la Santísima Concepción, y presento a usted, en su calidad de ${directivo.cargo} del ${nombreEstablecimiento} el inicio de las pasantías de estudiantes de Pedagogía de nuestra Facultad, de acuerdo con el siguiente calendario de prácticas UCSC primer semestre 2025:</p>
<table style="width:100%; border-collapse: collapse; margin-top: 1em; margin-bottom: 1em; border: 1px solid #ddd;">
  <thead>
    <tr>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">NIVEL DE PRÁCTICA</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">FECHA INICIO</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">FECHA TÉRMINO</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Nº SEMANAS</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">P. PROFESIONAL</td>
      <td style="border: 1px solid #ddd; padding: 8px;">Semana 10 de marzo</td>
      <td style="border: 1px solid #ddd; padding: 8px;">Semana 16 de junio</td>
      <td style="border: 1px solid #ddd; padding: 8px;">15</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">PPV - PPIV - PPIII – PPII - PPI</td>
      <td style="border: 1px solid #ddd; padding: 8px;">Semana 17 de marzo</td>
      <td style="border: 1px solid #ddd; padding: 8px;">Semana 16 de junio</td>
      <td style="border: 1px solid #ddd; padding: 8px;">14</td>
    </tr>
  </tbody>
</table>
<p>La nómina de estudiantes adscritos a su establecimiento se informa en el siguiente enlace, el que debe copiar y pegar en el navegador web. En dicha nómina se detalla nombre del estudiante, RUT, correo electrónico, carrera y nivel de práctica pedagógica que les corresponde cursar durante el primer semestre 2025.<br>
<a href="https://docs.google.com/spreadsheets/d/1X-TPDs1zXhBjeESi0Z34wizh9YO7vdLa/edit?usp=drive_link&ouid=111502115013884055736&rtpof=true&sd=true" target="_blank" rel="noopener noreferrer">https://docs.google.com/spreadsheets/d/1X-TPDs1zXhBjeESi0Z34wizh9YO7vdLa/edit?usp=drive_link&ouid=111502115013884055736&rtpof=true&sd=true</a></p>
<p>Al iniciar su pasantía, cada estudiante deberá hacer entrega de su carpeta de práctica con documentación institucional y personal; la cual considera:</p>
<ul>
  <li>Certificado de Antecedentes</li>
  <li>Certificado de Inhabilidades para trabajar con menores de edad</li>
  <li>Certificado de Inhabilidades por maltrato relevante</li>
  <li>Horario universitario</li>
  <li>Otra documentación</li>
</ul>
<p>Eventualmente, esta nómina puede variar en consideración a los cupos autorizados por su establecimiento debido a que el proceso de inscripción de asignaturas UCSC aún está abierto.</p>
<p>Finalmente, como UPP agradecemos el espacio formativo otorgado por su comunidad educativa.</p>
<p>Se despide atentamente,<br>
Equipo Unidad de Prácticas Pedagógicas UCSC</p>
`;
};


export default function AdscripcionPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [availableStudents, setAvailableStudents] = useState<Estudiante[]>(mockAlumnosDisponibles);
  const [selectedStudents, setSelectedStudents] = useState<Estudiante[]>([]);

  const [availableEstablecimientos, setAvailableEstablecimientos] = useState<Establecimiento[]>([]);
  const [selectedEstablecimientoId, setSelectedEstablecimientoId] = useState<string | null>(null);

  const initialEmailPlaceholder = useMemo(() => generateEmailPreview(null, null), []);
  const [currentTemplateHtml, setCurrentTemplateHtml] = useState<string>(initialEmailPlaceholder);


  const [currentStep, setCurrentStep] = useState<string>(ADSCRIPCION_STEPS.STEP1);
  const [unlockedSteps, setUnlockedSteps] = useState<string[]>([ADSCRIPCION_STEPS.STEP1]);

  useEffect(() => {
    setAvailableEstablecimientos(mockEstablecimientos);
  }, []);

  const getCarreraName = (carreraId: string) => mockCarreras.find(c => c.id === carreraId)?.nombre || "N/A";

  useEffect(() => {
    const establecimiento = availableEstablecimientos.find(c => c.id === selectedEstablecimientoId) || null;
    const directivo = establecimiento ? mockDirectivos.find(d => d.establecimiento_id === establecimiento.id) || null : null;
    const newTemplate = generateEmailPreview(establecimiento, directivo);
    setCurrentTemplateHtml(newTemplate);
  }, [selectedEstablecimientoId, availableEstablecimientos]);


  const filteredAvailableStudents = useMemo(() => {
    if (!searchTerm) {
      return availableStudents;
    }
    return availableStudents.filter(
      (student) =>
        `${student.nombre} ${student.ap_paterno} ${student.ap_materno}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCarreraName(student.carrera_id).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, availableStudents]);

  const handleAddStudent = (studentToAdd: Estudiante) => {
    setSelectedStudents((prevSelected) => [...prevSelected, studentToAdd]);
    setAvailableStudents((prevAvailable) => prevAvailable.filter((s) => s.id !== studentToAdd.id));
  };

  const handleRemoveStudent = (studentToRemove: Estudiante) => {
    setAvailableStudents((prevAvailable) => [...prevAvailable, studentToRemove]);
    setSelectedStudents((prevSelected) => prevSelected.filter((s) => s.id !== studentToRemove.id));
  };

  const isStep1Valid = selectedStudents.length > 0;
  const isStep2Valid = selectedEstablecimientoId !== null;


  const goToNextStep = (nextStep: string) => {
    setUnlockedSteps((prev) => [...new Set([...prev, nextStep])]);
    setCurrentStep(nextStep);
  };

  const handleTabChange = (newStep: string) => {
    if (unlockedSteps.includes(newStep)) {
      setCurrentStep(newStep);
    }
  };

  const selectedEstablecimiento = useMemo(() => {
    return availableEstablecimientos.find(c => c.id === selectedEstablecimientoId) || null;
  }, [selectedEstablecimientoId, availableEstablecimientos]);

  const selectedDirectivo = useMemo(() => {
    if (!selectedEstablecimiento) return null;
    return mockDirectivos.find(d => d.establecimiento_id === selectedEstablecimiento.id) || null;
  }, [selectedEstablecimiento]);

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
                Paso 1: Selección de Estudiantes
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
                    <CardTitle>Paso 1: Selección de Estudiantes</CardTitle>
                    <CardDescription>
                      Busca y selecciona los estudiantes que participarán en el proceso de prácticas. Los estudiantes seleccionados aparecerán en la tabla inferior.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Buscar y Agregar Estudiantes</h3>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Buscar por nombre, email o carrera..."
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
                                <TableHead className="text-right">Acción</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedStudents.map((student) => (
                                <TableRow key={student.id}>
                                  <TableCell>{`${student.nombre} ${student.ap_paterno} ${student.ap_materno}`}</TableCell>
                                  <TableCell>{getCarreraName(student.carrera_id)}</TableCell>
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
                              ))}
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
                    <div className="flex justify-end mt-4">
                      <Button
                        onClick={() => goToNextStep(ADSCRIPCION_STEPS.STEP2)}
                        disabled={!isStep1Valid}
                      >
                        Siguiente Paso <ChevronRight className="ml-2 h-4 w-4" />
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
                    Selecciona el establecimiento para previsualizar el correo de notificación.
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
                        {availableEstablecimientos.map((establecimiento) => (
                          <SelectItem key={establecimiento.id} value={establecimiento.id}>
                            {establecimiento.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedEstablecimiento && selectedDirectivo && (
                    <div className="space-y-1 text-sm">
                      <p><span className="font-semibold">Establecimiento:</span> {selectedEstablecimiento.nombre}</p>
                      <p><span className="font-semibold">Contacto:</span> {selectedDirectivo.nombre} ({selectedDirectivo.email})</p>
                      <p><span className="font-semibold">Estudiantes seleccionados:</span> {selectedStudents.length}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email-preview">Previsualización del Correo</Label>
                    <EditableHtmlDisplay
                      key={selectedEstablecimientoId || 'no-establecimiento-selected'}
                      initialHtml={currentTemplateHtml}
                      editable={false}
                      className="w-full min-h-[300px] max-h-[60vh] overflow-y-auto"
                      aria-label="Previsualización del contenido del correo"
                    />
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <Button variant="outline" disabled={!selectedEstablecimientoId}>
                       <Building className="mr-2 h-4 w-4" />
                       Enviar Notificación (Próximamente)
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
                    Informa a los estudiantes sobre los detalles de su asignación de práctica.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center justify-center text-center min-h-[250px] space-y-4">
                    <Image
                      src="https://placehold.co/500x250.png"
                      alt="Notificación a estudiantes"
                      width={500}
                      height={250}
                      className="rounded-md object-contain opacity-70"
                      data-ai-hint="student communication"
                    />
                    <p className="text-muted-foreground">
                      Gestiona el envío de comunicaciones a los estudiantes con la información relevante a su práctica.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      (Funcionalidad en desarrollo)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
