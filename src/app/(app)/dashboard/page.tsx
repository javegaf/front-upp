import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, School, ClipboardPlus } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
      <p className="text-muted-foreground">
        Bienvenido a {process.env.NEXT_PUBLIC_APP_NAME || "Prácticas Conectadas"}. Aquí puedes obtener un resumen general.
      </p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alumnos Registrados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125</div>
            <p className="text-xs text-muted-foreground">+10 desde el último mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Colegios Activos</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">+2 nuevos convenios</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prácticas Asignadas</CardTitle>
            <ClipboardPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">88</div>
            <p className="text-xs text-muted-foreground">5 en proceso de asignación</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prácticas en Curso</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Monitoreando activamente</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Bienvenido al Sistema de Gestión de Prácticas</CardTitle>
          <CardDescription>Utiliza el menú lateral para navegar por las diferentes secciones y administrar la información de alumnos, colegios y asignaciones de prácticas pedagógicas.</CardDescription>
        </CardHeader>
        <CardContent>
          <Image 
            src="https://placehold.co/800x300.png"
            alt="University campus or students"
            width={800}
            height={300}
            className="rounded-md object-cover w-full"
            data-ai-hint="university students"
          />
          <p className="mt-4 text-sm">
            Este sistema está diseñado para facilitar y optimizar el proceso de adscripción a las prácticas pedagógicas. 
            Si tienes alguna duda o necesitas asistencia, por favor contacta al administrador del sistema.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
