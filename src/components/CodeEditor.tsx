
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language?: string;
}

export const CodeEditor = ({ code, onChange, language = 'javascript' }: CodeEditorProps) => {
  const { toast } = useToast();
  const [isCompiling, setIsCompiling] = useState(false);

  const handleCompile = async () => {
    setIsCompiling(true);
    try {
      // Basic JS validation
      new Function(code);
      toast({
        title: "Success",
        description: "Code compiled successfully!",
      });
    } catch (error) {
      toast({
        title: "Compilation Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-[400px] font-mono text-sm p-4 bg-black text-white rounded-lg"
          placeholder="Write your code here..."
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => onChange('')}
        >
          Clear
        </Button>
        <Button
          onClick={handleCompile}
          disabled={isCompiling}
        >
          {isCompiling ? 'Compiling...' : 'Compile'}
        </Button>
      </div>
    </Card>
  );
};
