import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Code, FileWarning, FileText, BookOpen, Terminal, AreaChart, Wand2 } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Security Analysis",
      description: "Identify vulnerabilities and security issues in your Move smart contracts."
    },
    {
      icon: <Code className="h-10 w-10 text-primary" />,
      title: "Code Suggestions",
      description: "Get suggested code fixes for each identified issue in your contract."
    },
    {
      icon: <FileWarning className="h-10 w-10 text-primary" />,
      title: "Vulnerability Detection",
      description: "Detect common vulnerabilities specific to the Move language and Sui blockchain."
    },
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: "Detailed Reports",
      description: "Receive comprehensive reports with explanations and severity ratings."
    },
    {
      icon: <Terminal className="h-10 w-10 text-primary" />,
      title: "CLI Support",
      description: "Run audits directly from your terminal with our command-line tool."
    },
    {
      icon: <AreaChart className="h-10 w-10 text-primary" />,
      title: "Security Metrics",
      description: "Track your contract's security score and improvement over time."
    },
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: "Best Practices",
      description: "Learn secure coding patterns and best practices for Move development."
    },
    {
      icon: <Wand2 className="h-10 w-10 text-primary" />,
      title: "AI-Powered",
      description: "Leverage advanced AI models trained specifically on Move contracts."
    }
  ];

  return (
    <section id="features" className="py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">Platform Features</h2>
        <p className="text-muted-foreground mt-2">
          Comprehensive tools to secure your Move smart contracts
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="mb-4">{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}