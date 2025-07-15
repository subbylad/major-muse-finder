import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface ScaleQuestionProps {
  title: string;
  value: number[];
  onChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  leftLabel: string;
  rightLabel: string;
  className?: string;
}

export function ScaleQuestion({
  title,
  value,
  onChange,
  min = 1,
  max = 5,
  step = 1,
  leftLabel,
  rightLabel,
  className = ""
}: ScaleQuestionProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <Label className="text-lg font-normal text-foreground">{title}</Label>
        <div className="text-lg font-normal text-foreground min-w-8 text-center">
          {value[0]}
        </div>
      </div>
      
      <Slider
        value={value}
        onValueChange={onChange}
        max={max}
        min={min}
        step={step}
        className="w-full"
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}