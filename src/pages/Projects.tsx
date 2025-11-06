import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useImages } from "@/contexts/ImageContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Star, Share, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Projects = () => {
  const navigate = useNavigate();
  const { folders, addImage, deleteFolder, toggleFavorite } = useImages();
  const [searchTerm, setSearchTerm] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.name.toLowerCase().endsWith('.tif') && !file.name.toLowerCase().endsWith('.tiff')) {
        toast.error(`Arquivo ${file.name} não é um TIFF válido`);
        return;
      }

      addImage(file);
      toast.success(`Imagem ${file.name} adicionada com sucesso`);
    });

    e.target.value = '';
  };

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedFolders = [...filteredFolders].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Aerofotogrametria</h2>
          <div>
            <Input
              type="file"
              accept=".tif,.tiff"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <Button asChild className="bg-primary hover:bg-primary/90">
              <label htmlFor="file-upload" className="cursor-pointer">
                Adicionar Imagem
              </label>
            </Button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Buscar por Ativo"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <Button variant="outline">Filtrar Ativos</Button>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Geo ID</TableHead>
                <TableHead>Data de criação</TableHead>
                <TableHead>Criado por</TableHead>
                <TableHead>Data do último upload</TableHead>
                <TableHead>Atualizado por</TableHead>
                <TableHead>Qtde. Imagens</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedFolders.map((folder) => (
                <TableRow
                  key={folder.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/imagens/${folder.id}`)}
                >
                  <TableCell className="font-medium flex items-center gap-2">
                    {folder.isFavorite && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                    {folder.name}
                  </TableCell>
                  <TableCell>{new Date(folder.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{folder.createdBy}</TableCell>
                  <TableCell>{new Date(folder.lastUpload).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{folder.updatedBy}</TableCell>
                  <TableCell>{folder.imageCount}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toggleFavorite(folder.id)}>
                          <Star className="h-4 w-4 mr-2" />
                          {folder.isFavorite ? 'Remover favorito' : 'Favoritar'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
                          <Share className="h-4 w-4 mr-2" />
                          Compartilhar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            deleteFolder(folder.id);
                            toast.success("Pasta excluída");
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

export default Projects;
