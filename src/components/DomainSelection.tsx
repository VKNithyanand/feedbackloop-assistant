
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type Domain = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

const domains: Domain[] = [
  {
    id: "frontend",
    name: "Frontend Development",
    description: "React, Vue, Angular, and modern web technologies",
    icon: "🎨",
  },
  {
    id: "backend",
    name: "Backend Development",
    description: "Node.js, Python, Java, and server technologies",
    icon: "⚙️",
  },
  {
    id: "fullstack",
    name: "Full Stack Development",
    description: "End-to-end application development",
    icon: "🔄",
  },
  {
    id: "devops",
    name: "DevOps",
    description: "CI/CD, Cloud platforms, and infrastructure",
    icon: "🚀",
  },
];

interface DomainSelectionProps {
  onSelect: (domain: string, mode: "practice" | "interview" | "quiz" | "coding") => void;
}

export const DomainSelection = ({ onSelect }: DomainSelectionProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Choose Your Path</h1>
        <p className="text-muted-foreground">
          Select a domain and mode to begin your technical interview preparation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {domains.map((domain) => (
          <motion.div
            key={domain.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{domain.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{domain.name}</h3>
              <p className="text-muted-foreground mb-6">{domain.description}</p>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline"
                  onClick={() => onSelect(domain.id, "practice")}
                  className="w-full"
                >
                  Practice
                </Button>
                <Button
                  onClick={() => onSelect(domain.id, "interview")}
                  className="w-full"
                >
                  Interview
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => onSelect(domain.id, "quiz")}
                  className="w-full"
                >
                  Quiz
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => onSelect(domain.id, "coding")}
                  className="w-full"
                >
                  Coding
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>All sessions are recorded and scored to track your progress</p>
      </div>
    </div>
  );
};
