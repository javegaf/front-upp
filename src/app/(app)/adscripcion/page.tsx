
"use client";

import { useState, useEffect, useMemo } from "react";
import type { Alumno } from "@/lib/definitions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, BellRing, BellPlus, Search, PlusCircle, Trash2 } from "lucide-react";
import Image from "next/image";

// Mock data - en una aplicación real, esto vendría de una API
const mockAlumnosDisponibles: Alumno[] = [
  { id: "101", nombres: "Elena", apellidos: "Valdés Rojas", email: "elena.valdes@example.com", carrera: "Educación Parvularia", semestre: 6, telefono: "+56912345670" },
  { id: "102", nombres: "Javier", apellidos: "Mora Tapia", email: "javier.mora@example.com", carrera: "Pedagogía en Matemática y Física", semestre: 7, telefono: "+56912345671" },
  { id: "103", nombres: "Camila", apellidos: "Silva Castro", email: "camila.silva@example.com", carrera: "Psicopedagogía", semestre: 8, telefono: "+56912345672" },
  { id: "104", nombres: "Andrés", apellidos: "Pérez Luna", email: "andres.perez@example.com", carrera: "Educación Básica", semestre: 5, telefono: "+56912345673" },
  { id: "105", nombres: "Sofía", apellidos: "González Ríos", email: "sofia.gonzalez@example.com", carrera: "Pedagogía en Inglés", semestre: 7, telefono: "+56912345674" },
];

export default function AdscripcionPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [availableStudents, setAvailableStudents] = useState<Alumno[]>(mockAlumnosDisponibles);
  const [selectedStudents, setSelectedStudents] = useState<Alumno[]>([]);

  const filteredAvailableStudents = useMemo(() => {
    if (!searchTerm) {
      return availableStudents;
    }
    return availableStudents.filter(
      (alumno) =>
        `${alumno.nombres} ${alumno.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alumno.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alumno.carrera.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, availableStudents]);

  const handleAddStudent = (studentToAdd: Alumno) => {
    setSelectedStudents((prevSelected) => [...prevSelected, studentToAdd]);
    setAvailableStudents((prevAvailable) => prevAvailable.filter((s) => s.id !== studentToAdd.id));
  };

  const handleRemoveStudent = (studentToRemove: Alumno) => {
    setAvailableStudents((prevAvailable) => [...prevAvailable, studentToRemove]);
    setSelectedStudents((prevSelected) => prevSelected.filter((s) => s.id !== studentToRemove.id));
  };


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
          <Tabs defaultValue="seleccion-estudiantes" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6">
              <TabsTrigger value="seleccion-estudiantes">
                <Users className="mr-2 h-4 w-4" />
                Paso 1: Selección de Estudiantes
              </TabsTrigger>
              <TabsTrigger value="notificacion-establecimiento">
                <BellRing className="mr-2 h-4 w-4" />
                Paso 2: Notificación al Establecimiento
              </TabsTrigger>
              <TabsTrigger value="notificacion-estudiantes">
                <BellPlus className="mr-2 h-4 w-4" />
                Paso 3: Notificación a Estudiantes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="seleccion-estudiantes">
              <Card>
                <CardHeader>
                  <CardTitle>Paso 1: Selección de Estudiantes</CardTitle>
                  <CardDescription>
                    Busca y selecciona los alumnos que participarán en el proceso de prácticas. Los alumnos seleccionados aparecerán en la tabla inferior.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Sección de Búsqueda y Adición de Alumnos */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Buscar y Agregar Alumnos</h3>
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
                      <Card className="border shadow-sm">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nombre Completo</TableHead>
                              <TableHead>Carrera</TableHead>
                              <TableHead className="text-center">Semestre</TableHead>
                              <TableHead className="text-right">Acción</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredAvailableStudents.map((alumno) => (
                              <TableRow key={alumno.id}>
                                <TableCell>{`${alumno.nombres} ${alumno.apellidos}`}</TableCell>
                                <TableCell>{alumno.carrera}</TableCell>
                                <TableCell className="text-center">{alumno.semestre}</TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleAddStudent(alumno)}
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
                        {searchTerm ? "No se encontraron alumnos con ese criterio." : "No hay más alumnos disponibles para agregar."}
                      </p>
                    )}
                  </div>

                  {/* Sección de Alumnos Seleccionados */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Alumnos Seleccionados para Adscripción ({selectedStudents.length})</h3>
                    {selectedStudents.length > 0 ? (
                       <Card className="border shadow-sm">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nombre Completo</TableHead>
                              <TableHead>Carrera</TableHead>
                              <TableHead className="text-center">Semestre</TableHead>
                              <TableHead className="text-right">Acción</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedStudents.map((alumno) => (
                              <TableRow key={alumno.id}>
                                <TableCell>{`${alumno.nombres} ${alumno.apellidos}`}</TableCell>
                                <TableCell>{alumno.carrera}</TableCell>
                                <TableCell className="text-center">{alumno.semestre}</TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleRemoveStudent(alumno)}
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
                          No has seleccionado ningún alumno aún.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Utiliza la búsqueda de arriba para agregar alumnos.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notificacion-establecimiento">
              <Card>
                <CardHeader>
                  <CardTitle>Paso 2: Notificación al Establecimiento</CardTitle>
                  <CardDescription>
                    Comunica a los colegios o centros de práctica los estudiantes asignados.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center min-h-[250px] space-y-4">
                  <Image
                    src="https://placehold.co/500x250.png"
                    alt="Notificación al establecimiento"
                    width={500}
                    height={250}
                    className="rounded-md object-contain opacity-70"
                    data-ai-hint="official notification document"
                  />
                  <p className="text-muted-foreground">
                    Este paso permitirá generar y enviar las notificaciones formales a los establecimientos.
                  </p>
                   <p className="text-sm text-muted-foreground">
                    (Funcionalidad en desarrollo)
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notificacion-estudiantes">
              <Card>
                <CardHeader>
                  <CardTitle>Paso 3: Notificación a Estudiantes</CardTitle>
                  <CardDescription>
                    Informa a los estudiantes sobre los detalles de su asignación de práctica.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center min-h-[250px] space-y-4">
                  <Image
                    src="https://placehold.co/500x250.png"
                    alt="Notificación a estudiantes"
                    width={500}
                    height={250}
                    className="rounded-md object-contain opacity-70"
                    data-ai-hint="student communication email"
                  />
                  <p className="text-muted-foreground">
                    Gestiona el envío de comunicaciones a los estudiantes con la información relevante a su práctica.
                  </p>
                   <p className="text-sm text-muted-foreground">
                    (Funcionalidad en desarrollo)
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
