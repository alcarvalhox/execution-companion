import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import { useImages } from "@/contexts/ImageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCw, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Analysis = () => {
  const { imageId } = useParams();
  const { folders } = useImages();
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  // Encontrar a imagem
  let image = null;
  for (const folder of folders) {
    const found = folder.images.find(img => img.id === imageId);
    if (found) {
      image = found;
      break;
    }
  }

  if (!image) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <p>Imagem não encontrada</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 flex">
        {/* Painel Lateral Esquerdo */}
        <div className="w-80 border-r bg-card">
          <div className="p-4 border-b">
            <h3 className="font-semibold mb-2">Histórico de Processamento</h3>
            <div className="space-y-2">
              {image.processingHistory.map((process, idx) => (
                <div key={idx} className="text-sm p-2 bg-muted rounded">
                  <div className="flex justify-between items-center">
                    <span>ID: {process.id}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      process.status === 'FINALIZADO' ? 'bg-green-500/20 text-green-700' :
                      process.status === 'ERRO' ? 'bg-red-500/20 text-red-700' :
                      'bg-yellow-500/20 text-yellow-700'
                    }`}>
                      {process.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(process.timestamp).toLocaleString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Tabs defaultValue="info" className="flex-1">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="alerts">Alertas</TabsTrigger>
              <TabsTrigger value="classes">Classes</TabsTrigger>
              <TabsTrigger value="measurements">Medições</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(100vh-300px)]">
              <TabsContent value="info" className="p-4 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Informações da Imagem</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Nome:</span> {image.name}</div>
                    <div><span className="font-medium">Ativo:</span> {image.metadata.assetName}</div>
                    <div><span className="font-medium">Data de Aquisição:</span> {image.metadata.acquisitionDate.toLocaleString('pt-BR')}</div>
                    <div><span className="font-medium">Upload:</span> {new Date(image.uploadDate).toLocaleString('pt-BR')}</div>
                    <div><span className="font-medium">Km:</span> {image.metadata.km}</div>
                    <div><span className="font-medium">Linha:</span> {image.metadata.line}</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="alerts" className="p-4">
                <h4 className="font-semibold mb-2">Alertas</h4>
                <p className="text-sm text-muted-foreground">Em desenvolvimento</p>
              </TabsContent>

              <TabsContent value="classes" className="p-4">
                <h4 className="font-semibold mb-2">Classes Detectadas</h4>
                <p className="text-sm text-muted-foreground">Em desenvolvimento</p>
              </TabsContent>

              <TabsContent value="measurements" className="p-4">
                <h4 className="font-semibold mb-2">Medições</h4>
                <p className="text-sm text-muted-foreground">Em desenvolvimento</p>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Visor Principal Direito */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">{image.name}</h3>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 relative bg-muted/20 flex items-center justify-center">
            <div
              className="relative bg-white shadow-lg"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transition: 'transform 0.3s ease'
              }}
            >
              <img
                src="/placeholder.svg"
                alt={image.name}
                className="max-w-full max-h-[70vh]"
              />
            </div>

            {/* Controles */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setZoom(Math.max(50, zoom - 10))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setZoom(Math.min(200, zoom + 10))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setRotation((rotation + 90) % 360)}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setZoom(100);
                  setRotation(0);
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analysis;
