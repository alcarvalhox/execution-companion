import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }

    const success = login(email, password);
    
    if (success) {
      toast.success("Login realizado com sucesso!");
      navigate("/produtos");
    } else {
      toast.error("Email ou senha incorretos");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Seção Superior - Título e Imagem */}
      <div className="h-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-20" />
        <h1 className="text-4xl md:text-5xl font-bold text-white z-10 text-center px-4">
          Plataforma de Diagnóstico de Via por Imagens - MRS
        </h1>
      </div>

      {/* Seção Inferior - Formulário */}
      <div className="h-1/2 bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@mrs.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Entrar
            </Button>

            <div className="flex justify-between text-sm">
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => toast.info("Funcionalidade em desenvolvimento")}
              >
                Esqueci a senha
              </button>
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => toast.info("Funcionalidade em desenvolvimento")}
              >
                Cadastrar senha
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
