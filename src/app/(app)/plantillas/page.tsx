
"use client";

import { useState, useEffect } from "react";
import { EditableHtmlDisplay } from "@/components/shared/editable-html-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import * as api from "@/lib/api";

export default function PlantillasPage() {
    const [establishmentTemplate, setEstablishmentTemplate] = useState<string>('');
    const [studentTemplate, setStudentTemplate] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState<'' | 'establishment' | 'student'>('');
    const { toast } = useToast();

    useEffect(() => {
        const fetchTemplates = async () => {
            setIsLoading(true);
            try {
                const [estTpl, stuTpl] = await Promise.all([
                    api.getEstablishmentEmailTemplate(),
                    api.getStudentEmailTemplate()
                ]);
                setEstablishmentTemplate(estTpl || '');
                setStudentTemplate(stuTpl || '');
            } catch (error) {
                toast({
                    title: "Error al cargar plantillas",
                    description: "No se pudieron obtener las plantillas desde el servidor.",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchTemplates();
    }, [toast]);

    const handleSave = async (key: 'establishment' | 'student') => {
        setIsSaving(key);
        try {
            if (key === 'establishment') {
                await api.setEstablishmentEmailTemplate(establishmentTemplate);
                toast({
                    title: "Plantilla Guardada",
                    description: `La plantilla para "Establecimientos" ha sido guardada en el servidor.`,
                });
            } else {
                await api.setStudentEmailTemplate(studentTemplate);
                toast({
                    title: "Plantilla Guardada",
                    description: `La plantilla para "Estudiantes" ha sido guardada en el servidor.`,
                });
            }
        } catch (error) {
            toast({
                title: "Error al guardar",
                description: "No se pudo guardar la plantilla en el servidor.",
                variant: "destructive",
            });
        } finally {
            setIsSaving('');
        }
    };

    if (isLoading) {
        return <div>Cargando plantillas...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Editor de Plantillas de Correo</h1>
                <p className="text-muted-foreground">
                    Modifica y guarda las plantillas para las notificaciones automáticas. Los cambios se guardan en el servidor.
                </p>
            </div>

            <Tabs defaultValue="establecimiento">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="establecimiento">Notificación a Establecimiento</TabsTrigger>
                    <TabsTrigger value="estudiante">Notificación a Estudiante</TabsTrigger>
                </TabsList>
                <TabsContent value="establecimiento">
                    <Card>
                        <CardHeader>
                            <CardTitle>Plantilla para Establecimientos</CardTitle>
                            <CardDescription>
                                Este es el correo que se enviará al directivo del colegio. Puedes usar las siguientes variables:
                                <code className="block bg-muted p-2 rounded-md my-2 text-sm leading-relaxed">
                                    &#123;&#123;directivo.nombre&#125;&#125;, &#123;&#123;directivo.cargo&#125;&#125;, &#123;&#123;establecimiento.nombre&#125;&#125;, <br />
                                    &#123;&#123;semana_inicio_profesional&#125;&#125;, &#123;&#123;semana_termino_profesional&#125;&#125;, &#123;&#123;numero_semanas_profesional&#125;&#125;,<br />
                                    &#123;&#123;semana_inicio_pp&#125;&#125;, &#123;&#123;semana_termino_pp&#125;&#125;, &#123;&#123;numero_semanas_pp&#125;&#125;
                                </code>
                                <strong>Nota:</strong> Se aconseja no modificar la estructura de la tabla de estudiantes, ya que se genera automáticamente con un bucle sobre las variables <code className="text-xs">&#123;% for ficha in fichas %&#125;</code>.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EditableHtmlDisplay
                                initialHtml={establishmentTemplate}
                                onHtmlChange={setEstablishmentTemplate}
                                editable={true}
                                className="w-full min-h-[400px] max-h-[70vh] overflow-y-auto"
                            />
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => handleSave('establishment')} disabled={isSaving === 'establishment'}>
                                <Save className="mr-2 h-4 w-4" />
                                {isSaving === 'establishment' ? 'Guardando...' : 'Guardar Plantilla'}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="estudiante">
                    <Card>
                        <CardHeader>
                            <CardTitle>Plantilla para Estudiantes</CardTitle>
                            <CardDescription>
                                Este es el correo que se enviará a cada estudiante asignado. Puedes usar las siguientes variables:
                                <code className="block bg-muted p-2 rounded-md my-2 text-sm leading-relaxed">
                                    &#123;&#123;estudiante.nombre&#125;&#125;, &#123;&#123;estudiante.ap_paterno&#125;&#125;, &#123;&#123;estudiante.ap_materno&#125;&#125;, <br />
                                    &#123;&#123;nombre_establecimiento&#125;&#125;, &#123;&#123;nivel_practica&#125;&#125;, &#123;&#123;semana_inicio&#125;&#125;, &#123;&#123;semana_termino&#125;&#125;,<br />
                                    &#123;&#123;directivo.nombre&#125;&#125;, &#123;&#123;directivo.cargo&#125;&#125;, &#123;&#123;directivo.email&#125;&#125;
                                </code>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <EditableHtmlDisplay
                                initialHtml={studentTemplate}
                                onHtmlChange={setStudentTemplate}
                                editable={true}
                                className="w-full min-h-[400px] max-h-[70vh] overflow-y-auto"
                            />
                        </CardContent>
                         <CardFooter>
                            <Button onClick={() => handleSave('student')} disabled={isSaving === 'student'}>
                                <Save className="mr-2 h-4 w-4" />
                                {isSaving === 'student' ? 'Guardando...' : 'Guardar Plantilla'}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
