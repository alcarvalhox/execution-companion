import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useImages } from "@/contexts/ImageContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Star, Share, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Images = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const { folders, processImage, deleteImage, toggleImageFavorite } = useImages();

  const folder = folders.find(f => f.id === folderId);

  if (!folder) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <p>Pasta não encontrada</p>
        </main>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Processado': 'default',
      'Em processamento': 'secondary',
      'Erro de processamento': 'destructive',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">Aerofotogrametria / {folder.name}</p>
          <h2 className="text-2xl font-bold">{folder.name}</h2>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Imagem</TableHead>
                <TableHead>Data do último upload</TableHead>
                <TableHead>Data de Aquisição</TableHead>
                <TableHead>Responsável pelo upload</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[150px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {folder.images.map((image) => (
                <TableRow
                  key={image.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/analise/${image.id}`)}
                >
                  <TableCell className="font-medium flex items-center gap-2">
                    {image.isFavorite && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                    {image.name}
                  </TableCell>
                  <TableCell>{new Date(image.uploadDate).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{image.metadata.acquisitionDate.toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{image.uploadedBy}</TableCell>
                  <TableCell>{getStatusBadge(image.status)}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                        onClick={(e) => {
                          e.stopPropagation();
                          processImage(image.id);
                          toast.success("Processamento iniciado");
                        }}
                      >
                        Processar
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toggleImageFavorite(folderId!, image.id)}>
                            <Star className="h-4 w-4 mr-2" />
                            {image.isFavorite ? 'Remover favorito' : 'Favoritar'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
                            <Share className="h-4 w-4 mr-2" />
                            Compartilhar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info("Metadados: " + JSON.stringify(image.metadata))}>
                            Metadados
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              deleteImage(folderId!, image.id);
                              toast.success("Imagem excluída");
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default Images;
