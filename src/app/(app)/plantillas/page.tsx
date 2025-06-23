
"use client";

import { useState, useEffect } from "react";
import { EditableHtmlDisplay } from "@/components/shared/editable-html-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

const TEMPLATE_ESTABLISHMENT_KEY = "email_template_establishment";
const TEMPLATE_STUDENT_KEY = "email_template_student";

const DEFAULT_ESTABLISHMENT_TEMPLATE = `
<p>Estimado/a {{nombre_directivo}},</p>
<p>Le saludo de manera cordial en nombre de la Unidad de Práctica Pedagógica (UPP) de la Facultad de Educación de la Universidad Católica de la Santísima Concepción, y presento a usted, en su calidad de {{cargo_directivo}} del {{nombre_establecimiento}}, el inicio de las pasantías de estudiantes de Pedagogía de nuestra Facultad, de acuerdo con el siguiente calendario de prácticas UCSC primer semestre 2025:</p>
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
<p>La nómina de estudiantes adscritos a su establecimiento se informa en el siguiente enlace: <a href="{{link_nomina}}" target="_blank">{{link_nomina}}</a></p>
<p>Al iniciar su pasantía, cada estudiante deberá hacer entrega de su carpeta de práctica con documentación institucional y personal.</p>
<p>Eventualmente, esta nómina puede variar en consideración a los cupos autorizados por su establecimiento.</p>
<p>Finalmente, como UPP agradecemos el espacio formativo otorgado por su comunidad educativa.</p>
<p>Se despide atentamente,<br>Equipo Unidad de Prácticas Pedagógicas UCSC</p>
`;

const DEFAULT_STUDENT_TEMPLATE = `
<p>Estimado/a {{nombre_estudiante}},</p>
<p>Junto con saludar, te informamos que has sido asignado/a para realizar tu práctica en el siguiente establecimiento:</p>
<p><strong>Establecimiento:</strong> {{nombre_establecimiento}}</p>
<p><strong>Dirección:</strong> {{direccion_establecimiento}}</p>
<p><strong>Contacto Principal:</strong> {{nombre_directivo}} ({{cargo_directivo}})</p>
<p>Por favor, preséntate en el establecimiento en la fecha y hora acordadas.</p>
<p>¡Mucho éxito en tu práctica!</p>
<p>Atentamente,<br>Equipo Unidad de Prácticas Pedagógicas UCSC</p>
`;

export default function PlantillasPage() {
    const [establishmentTemplate, setEstablishmentTemplate] = useState<string>('');
    const [studentTemplate, setStudentTemplate] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const estTpl = localStorage.getItem(TEMPLATE_ESTABLISHMENT_KEY) || DEFAULT_ESTABLISHMENT_TEMPLATE;
        const stuTpl = localStorage.getItem(TEMPLATE_STUDENT_KEY) || DEFAULT_STUDENT_TEMPLATE;
        setEstablishmentTemplate(estTpl);
        setStudentTemplate(stuTpl);
        setIsLoading(false);
    }, []);

    const handleSave = (key: string, content: string, templateName: string) => {
        localStorage.setItem(key, content);
        toast({
            title: "Plantilla Guardada",
            description: `La plantilla para "${templateName}" ha sido guardada en tu navegador.`,
        });
    };

    if (isLoading) {
        return <div>Cargando plantillas...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Editor de Plantillas de Correo</h1>
                <p className="text-muted-foreground">
                    Modifica y guarda las plantillas para las notificaciones automáticas. Los cambios se guardan localmente en tu navegador.
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
                                <code className="block bg-muted p-2 rounded-md my-2 text-sm">
                                    &#123;&#123;nombre_directivo&#125;&#125;, &#123;&#123;cargo_directivo&#125;&#125;, &#123;&#123;nombre_establecimiento&#125;&#125;, &#123;&#123;link_nomina&#125;&#125;
                                </code>
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
                            <Button onClick={() => handleSave(TEMPLATE_ESTABLISHMENT_KEY, establishmentTemplate, 'Establecimientos')}>
                                <Save className="mr-2 h-4 w-4" />
                                Guardar Plantilla
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
                                <code className="block bg-muted p-2 rounded-md my-2 text-sm">
                                    &#123;&#123;nombre_estudiante&#125;&#125;, &#123;&#123;nombre_establecimiento&#125;&#125;, &#123;&#123;direccion_establecimiento&#125;&#125;, &#123;&#123;nombre_directivo&#125;&#125;, &#123;&#123;cargo_directivo&#125;&#125;
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
                            <Button onClick={() => handleSave(TEMPLATE_STUDENT_KEY, studentTemplate, 'Estudiantes')}>
                                <Save className="mr-2 h-4 w-4" />
                                Guardar Plantilla
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
