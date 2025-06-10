
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Users, BellRing, BellPlus } from "lucide-react";

export default function AdscripcionPage() {
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
                    Selecciona los alumnos que participarán en el proceso de prácticas.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center min-h-[250px] space-y-4">
                  <Image
                    src="https://placehold.co/500x250.png"
                    alt="Selección de estudiantes"
                    width={500}
                    height={250}
                    className="rounded-md object-contain opacity-70"
                    data-ai-hint="student selection list"
                  />
                  <p className="text-muted-foreground">
                    Aquí podrás buscar, filtrar y seleccionar los estudiantes elegibles para la adscripción.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    (Funcionalidad en desarrollo)
                  </p>
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
