import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
  isValid?: boolean;
  icon?: React.ReactNode;
  hint?: string;
}

export const ValidatedInput = React.forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ label, name, error, isValid, icon, hint, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <Label htmlFor={name} className="flex items-center justify-between">
          <span>{label}</span>
          {isValid && (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          )}
        </Label>
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-3 h-4 w-4 text-gray-400">
              {icon}
            </div>
          )}
          <Input
            id={name}
            name={name}
            ref={ref}
            className={cn(
              icon ? 'pl-10' : '',
              error ? 'border-red-500 focus-visible:ring-red-500' : '',
              isValid ? 'border-green-500 focus-visible:ring-green-500' : '',
              className
            )}
            {...props}
          />
          {error && (
            <XCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
          )}
          {isValid && !error && (
            <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
          )}
        </div>
        {hint && !error && (
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {hint}
          </p>
        )}
        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

ValidatedInput.displayName = 'ValidatedInput';
