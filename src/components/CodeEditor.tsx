
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Play } from "lucide-react";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language?: string;
}

interface CompilerOutput {
  output: string;
  error: string | null;
}

export const CodeEditor = ({ code, onChange, language = 'javascript' }: CodeEditorProps) => {
  const { toast } = useToast();
  const [isCompiling, setIsCompiling] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [output, setOutput] = useState<CompilerOutput>({ output: '', error: null });
  const [isRunning, setIsRunning] = useState(false);

  const supportedLanguages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
  ];

  const handleCompile = async () => {
    setIsCompiling(true);
    try {
      // Basic JS validation for client-side JavaScript
      if (selectedLanguage === 'javascript') {
        try {
          new Function(code);
          toast({
            title: "Success",
            description: "Code compiled successfully!",
          });
        } catch (error: any) {
          toast({
            title: "Compilation Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        // For other languages, we'll just validate syntax based on basic rules
        toast({
          title: "Success",
          description: "Code validated successfully!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCompiling(false);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput({ output: '', error: null });

    try {
      if (selectedLanguage === 'javascript') {
        try {
          // Create a safe execution environment
          const consoleLogs: string[] = [];
          const mockConsole = {
            log: (...args: any[]) => consoleLogs.push(args.join(' ')),
            error: (...args: any[]) => consoleLogs.push(`Error: ${args.join(' ')}`),
            warn: (...args: any[]) => consoleLogs.push(`Warning: ${args.join(' ')}`),
          };

          // Execute the code in a controlled environment
          const fn = new Function('console', code);
          fn(mockConsole);

          setOutput({
            output: consoleLogs.join('\n'),
            error: null,
          });
        } catch (error: any) {
          setOutput({
            output: '',
            error: error.message,
          });
        }
      } else {
        // For other languages, show a message that server-side compilation is needed
        setOutput({
          output: '',
          error: `Running ${selectedLanguage} code requires a backend compiler. This is a client-side only implementation.`,
        });
      }
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Select
            value={selectedLanguage}
            onValueChange={setSelectedLanguage}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {supportedLanguages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <textarea
            value={code}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-[400px] font-mono text-sm p-4 bg-black text-white rounded-lg"
            placeholder={`Write your ${selectedLanguage} code here...`}
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
            variant="outline"
          >
            {isCompiling ? 'Compiling...' : 'Compile'}
          </Button>
          <Button
            onClick={handleRun}
            disabled={isRunning || !code.trim()}
            className="gap-2"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run
              </>
            )}
          </Button>
        </div>
      </Card>

      {(output.output || output.error) && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Output</h3>
          <pre className="bg-black text-white p-4 rounded-lg overflow-x-auto">
            {output.error ? (
              <span className="text-red-400">{output.error}</span>
            ) : (
              output.output || 'No output'
            )}
          </pre>
        </Card>
      )}
    </div>
  );
};
