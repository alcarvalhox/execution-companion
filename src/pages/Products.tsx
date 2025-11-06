import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Products = () => {
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      title: "Aerofotogrametria",
      description: "Análise avançada de imagens aéreas de via permanente",
      action: () => navigate("/projetos"),
      featured: true,
    },
    {
      id: 2,
      title: "Projeto A",
      description: "Em desenvolvimento",
      action: () => {},
      featured: false,
    },
    {
      id: 3,
      title: "Projeto B",
      description: "Em desenvolvimento",
      action: () => {},
      featured: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                product.featured ? "border-primary border-2" : ""
              }`}
              onClick={product.action}
            >
              <CardHeader>
                <CardTitle className={product.featured ? "text-primary" : ""}>
                  {product.title}
                </CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {product.featured && (
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-md flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <p className="text-sm">Imagem de fundo</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Products;
