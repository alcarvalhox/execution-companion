import { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface ImageMetadata {
  acquisitionDate: Date;
  assetName: string;
  km: number;
  line: string;
  latitude?: number;
  longitude?: number;
}

export interface ProcessingHistory {
  id: string;
  status: "FINALIZADO" | "ERRO" | "FILA" | "MEDINDO";
  timestamp: Date;
}

export interface Image {
  id: string;
  name: string;
  folderId: string;
  uploadDate: Date;
  uploadedBy: string;
  status: "Processado" | "Em processamento" | "Erro de processamento";
  metadata: ImageMetadata;
  processingHistory: ProcessingHistory[];
  isFavorite: boolean;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: Date;
  createdBy: string;
  lastUpload: Date;
  updatedBy: string;
  imageCount: number;
  images: Image[];
  isFavorite: boolean;
}

interface ImageContextType {
  folders: Folder[];
  addImage: (file: File) => void;
  deleteFolder: (folderId: string) => void;
  deleteImage: (folderId: string, imageId: string) => void;
  processImage: (imageId: string) => void;
  toggleFavorite: (folderId: string) => void;
  toggleImageFavorite: (folderId: string, imageId: string) => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([]);

  const extractMetadataFromFilename = (filename: string): ImageMetadata => {
    // Remove extensão
    const nameWithoutExt = filename.replace(/\.(tif|tiff)$/i, "");
    
    // Primeiros 17 dígitos são desconsiderados para o nome da pasta
    const prefix = nameWithoutExt.substring(0, 17);
    const assetName = nameWithoutExt.substring(17);
    
    // Extrair data: posições 4-7 (ano), 8-9 (mês), 10-11 (dia), 12-13 (hora), 14-15 (minutos)
    const year = parseInt(prefix.substring(4, 8));
    const month = parseInt(prefix.substring(8, 10)) - 1; // Mês é 0-indexed
    const day = parseInt(prefix.substring(10, 12));
    const hour = parseInt(prefix.substring(12, 14));
    const minute = parseInt(prefix.substring(14, 16));
    
    const acquisitionDate = new Date(year, month, day, hour, minute);
    
    // Extrair KM (primeiros 6 dígitos do nome do ativo divididos por 1000)
    const kmDigits = assetName.substring(0, 6);
    const km = parseInt(kmDigits) / 1000;
    
    // Extrair Linha (letra L seguida de dígitos)
    const lineMatch = assetName.match(/L(\d+)/);
    const line = lineMatch ? `L${lineMatch[1]}` : "N/A";
    
    return {
      acquisitionDate,
      assetName,
      km,
      line,
    };
  };

  const addImage = (file: File) => {
    const metadata = extractMetadataFromFilename(file.name);
    const folderName = metadata.assetName;
    
    const newImage: Image = {
      id: `img-${Date.now()}-${Math.random()}`,
      name: file.name,
      folderId: "",
      uploadDate: new Date(),
      uploadedBy: user?.name || "Usuário",
      status: "Em processamento",
      metadata,
      processingHistory: [{
        id: `proc-${Date.now()}`,
        status: "FILA",
        timestamp: new Date(),
      }],
      isFavorite: false,
    };

    setFolders((prev) => {
      const existingFolder = prev.find(f => f.name === folderName);
      
      if (existingFolder) {
        // Pasta existe, adicionar imagem
        return prev.map(folder => {
          if (folder.id === existingFolder.id) {
            return {
              ...folder,
              images: [...folder.images, { ...newImage, folderId: folder.id }],
              imageCount: folder.imageCount + 1,
              lastUpload: new Date(),
              updatedBy: user?.name || "Usuário",
            };
          }
          return folder;
        });
      } else {
        // Criar nova pasta
        const newFolder: Folder = {
          id: `folder-${Date.now()}`,
          name: folderName,
          createdAt: new Date(),
          createdBy: user?.name || "Usuário",
          lastUpload: new Date(),
          updatedBy: user?.name || "Usuário",
          imageCount: 1,
          images: [{ ...newImage, folderId: `folder-${Date.now()}` }],
          isFavorite: false,
        };
        return [...prev, newFolder];
      }
    });
  };

  const deleteFolder = (folderId: string) => {
    setFolders(prev => prev.filter(f => f.id !== folderId));
  };

  const deleteImage = (folderId: string, imageId: string) => {
    setFolders(prev => prev.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          images: folder.images.filter(img => img.id !== imageId),
          imageCount: folder.imageCount - 1,
        };
      }
      return folder;
    }));
  };

  const processImage = (imageId: string) => {
    setFolders(prev => prev.map(folder => ({
      ...folder,
      images: folder.images.map(img => {
        if (img.id === imageId) {
          return {
            ...img,
            status: "Em processamento" as const,
            processingHistory: [
              ...img.processingHistory,
              {
                id: `proc-${Date.now()}`,
                status: "MEDINDO" as const,
                timestamp: new Date(),
              }
            ],
          };
        }
        return img;
      }),
    })));

    // Simular processamento completo após 3 segundos
    setTimeout(() => {
      setFolders(prev => prev.map(folder => ({
        ...folder,
        images: folder.images.map(img => {
          if (img.id === imageId) {
            return {
              ...img,
              status: "Processado" as const,
              processingHistory: img.processingHistory.map((h, idx) => 
                idx === img.processingHistory.length - 1 
                  ? { ...h, status: "FINALIZADO" as const }
                  : h
              ),
            };
          }
          return img;
        }),
      })));
    }, 3000);
  };

  const toggleFavorite = (folderId: string) => {
    setFolders(prev => prev.map(folder => 
      folder.id === folderId 
        ? { ...folder, isFavorite: !folder.isFavorite }
        : folder
    ));
  };

  const toggleImageFavorite = (folderId: string, imageId: string) => {
    setFolders(prev => prev.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          images: folder.images.map(img =>
            img.id === imageId 
              ? { ...img, isFavorite: !img.isFavorite }
              : img
          ),
        };
      }
      return folder;
    }));
  };

  return (
    <ImageContext.Provider value={{ 
      folders, 
      addImage, 
      deleteFolder, 
      deleteImage, 
      processImage,
      toggleFavorite,
      toggleImageFavorite,
    }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImages = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("useImages must be used within ImageProvider");
  }
  return context;
};
