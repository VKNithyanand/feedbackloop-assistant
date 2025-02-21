
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Question } from '@/types/interview';

interface CodeEditorProps {
  question: Question;
  onSubmit: (code: string) => void;
}

export const CodeEditor = ({ question, onSubmit }: CodeEditorProps) => {
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    onSubmit(code);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">{question.text}</h3>
        <p className="text-muted-foreground">{question.category}</p>
      </div>

      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-[400px] font-mono text-sm p-4 bg-black text-white rounded-lg"
          placeholder="Write your code here..."
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => setCode('')}
        >
          Clear
        </Button>
        <Button
          onClick={handleSubmit}
        >
          Submit Solution
        </Button>
      </div>
    </Card>
  );
};
