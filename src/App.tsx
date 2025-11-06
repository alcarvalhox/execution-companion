import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ImageProvider } from "./contexts/ImageContext";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Projects from "./pages/Projects";
import Images from "./pages/Images";
import Analysis from "./pages/Analysis";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ImageProvider>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/produtos" element={<Products />} />
              <Route path="/projetos" element={<Projects />} />
              <Route path="/imagens/:folderId" element={<Images />} />
              <Route path="/analise/:imageId" element={<Analysis />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ImageProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
