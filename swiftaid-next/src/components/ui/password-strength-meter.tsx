import React from 'react';
import { cn } from '@/lib/utils';

interface PasswordStrengthMeterProps {
  password: string;
  strength: {
    strength: 'weak' | 'medium' | 'strong' | 'very-strong';
    percentage: number;
    color: string;
  };
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  strength,
}) => {
  if (!password) return null;

  const getStrengthText = () => {
    switch (strength.strength) {
      case 'weak':
        return 'Weak';
      case 'medium':
        return 'Medium';
      case 'strong':
        return 'Strong';
      case 'very-strong':
        return 'Very Strong';
      default:
        return '';
    }
  };

  const getStrengthColor = () => {
    switch (strength.strength) {
      case 'weak':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'strong':
        return 'text-blue-500';
      case 'very-strong':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600">Password Strength:</span>
        <span className={cn('font-semibold', getStrengthColor())}>
          {getStrengthText()}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-300 rounded-full',
            strength.color
          )}
          style={{ width: `${strength.percentage}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 space-y-1">
        <p>Password must contain:</p>
        <ul className="list-disc list-inside space-y-0.5 ml-2">
          <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>
            At least one uppercase letter
          </li>
          <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>
            At least one lowercase letter
          </li>
          <li className={/[0-9]/.test(password) ? 'text-green-600' : ''}>
            At least one number
          </li>
          <li className={/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password) ? 'text-green-600' : ''}>
            At least one special character
          </li>
          <li className={password.length >= 8 ? 'text-green-600' : ''}>
            Minimum 8 characters
          </li>
        </ul>
      </div>
    </div>
  );
};
