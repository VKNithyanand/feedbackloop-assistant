
import { motion } from "framer-motion";
import { Card } from "./ui/card";

type Domain = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

const domains: Domain[] = [
  {
    id: "backend",
    title: "Backend",
    description: "The Ultimate Backend Roadmap",
    icon: "🖥️",
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    description: "The Ultimate Data Analyst Roadmap",
    icon: "📊",
  },
  {
    id: "python",
    title: "Python",
    description: "The Ultimate Python Roadmap",
    icon: "🐍",
  },
  {
    id: "devops",
    title: "DevOps",
    description: "The Ultimate DevOps Roadmap",
    icon: "⚙️",
  },
];

interface DomainSelectionProps {
  onSelect: (domain: string) => void;
}

export const DomainSelection = ({ onSelect }: DomainSelectionProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
          Roadmaps
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Follow guided learning paths that help you explore topics, gain relevant skills
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {domains.map((domain) => (
          <motion.div
            key={domain.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              className="p-6 cursor-pointer hover:bg-accent/50 transition-colors border-2 border-accent/20"
              onClick={() => onSelect(domain.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{domain.icon}</div>
                <div>
                  <h2 className="text-2xl font-semibold">{domain.title}</h2>
                  <p className="text-muted-foreground">{domain.description}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
