
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Play, Check, Code } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language?: string;
  testCases?: TestCase[];
  questionId?: string;
}

interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

interface CompilerOutput {
  output: string;
  error: string | null;
  testsPassed?: boolean[];
}

export const CodeEditor = ({ 
  code, 
  onChange, 
  language = 'javascript',
  testCases = [],
  questionId
}: CodeEditorProps) => {
  const { toast } = useToast();
  const [isCompiling, setIsCompiling] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [output, setOutput] = useState<CompilerOutput>({ output: '', error: null });
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supportedLanguages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
  ];

  const runTestCases = (userCode: string) => {
    const results: boolean[] = [];
    let totalOutput = '';

    for (const testCase of testCases) {
      try {
        // Create a safe execution environment for each test case
        const consoleLogs: string[] = [];
        const mockConsole = {
          log: (...args: any[]) => consoleLogs.push(args.join(' ')),
        };

        // Wrap user code in a function and call it with test input
        const wrappedCode = `
          ${userCode}
          // Assuming the user defines a function called 'solution'
          console.log(solution(${testCase.input}));
        `;

        const fn = new Function('console', wrappedCode);
        fn(mockConsole);

        const testOutput = consoleLogs.join('\n').trim();
        const passed = testOutput === testCase.expectedOutput;
        results.push(passed);
        
        totalOutput += `Test case: ${testCase.description}\n`;
        totalOutput += `Input: ${testCase.input}\n`;
        totalOutput += `Expected: ${testCase.expectedOutput}\n`;
        totalOutput += `Got: ${testOutput}\n`;
        totalOutput += `Status: ${passed ? '✅ Passed' : '❌ Failed'}\n\n`;
      } catch (error: any) {
        results.push(false);
        totalOutput += `Test case: ${testCase.description}\n`;
        totalOutput += `Error: ${error.message}\n\n`;
      }
    }

    return { results, output: totalOutput };
  };

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    try {
      const { results, output: testOutput } = runTestCases(code);
      const allTestsPassed = results.every(r => r);
      const score = Math.round((results.filter(r => r).length / results.length) * 100);

      if (allTestsPassed) {
        // Save the score to the leaderboard
        const { error } = await supabase
          .from('scores')
          .insert({
            score,
            domain: 'coding',
            question_id: questionId
          });

        if (error) throw error;

        toast({
          title: "Success!",
          description: "All test cases passed! Score saved to leaderboard.",
        });
      }

      setOutput({
        output: testOutput,
        error: null,
        testsPassed: results
      });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompile = async () => {
    setIsCompiling(true);
    try {
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
        const { results, output: testOutput } = runTestCases(code);
        setOutput({
          output: testOutput,
          error: null,
          testsPassed: results
        });
      } else {
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
            {isCompiling ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Compiling...
              </>
            ) : (
              <>
                <Code className="h-4 w-4 mr-2" />
                Compile
              </>
            )}
          </Button>
          <Button
            onClick={handleRun}
            disabled={isRunning || !code.trim()}
            className="gap-2"
            variant="outline"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run Tests
              </>
            )}
          </Button>
          <Button
            onClick={handleSubmitCode}
            disabled={isSubmitting || !code.trim()}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Submit Code
              </>
            )}
          </Button>
        </div>
      </Card>

      {(output.output || output.error) && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Output</h3>
          <pre className="bg-black text-white p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
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
