import React, { useState } from 'react';
import { 
  EyeIcon, 
  EyeOffIcon, 
  InformationCircleIcon 
} from '@heroicons/react/outline';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  info?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  info, 
  type = 'text', 
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-4">
      <label 
        htmlFor={props.id} 
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          type={type === 'password' && showPassword ? 'text' : type}
          className={`
            w-full 
            px-3 
            py-2 
            border 
            rounded-lg 
            bg-white 
            dark:bg-gray-700 
            dark:text-gray-200
            ${error 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'}
          `}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {info && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <InformationCircleIcon className="h-4 w-4 mr-1 text-blue-500" />
          {info}
        </p>
      )}
    </div>
  );
};

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  label, 
  checked, 
  onChange, 
  description 
}) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      <button 
        onClick={() => onChange(!checked)}
        className={`
          relative 
          inline-flex 
          flex-shrink-0 
          h-6 
          w-11 
          border-2 
          border-transparent 
          rounded-full 
          cursor-pointer 
          transition-colors 
          ease-in-out 
          duration-200
          ${checked 
            ? 'bg-blue-500' 
            : 'bg-gray-200 dark:bg-gray-700'}
        `}
      >
        <span
          className={`
            ${checked ? 'translate-x-5' : 'translate-x-0'}
            inline-block 
            h-5 
            w-5 
            rounded-full 
            bg-white 
            shadow 
            transform 
            ring-0 
            transition 
            ease-in-out 
            duration-200
          `}
        />
      </button>
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ 
  label, 
  options, 
  error, 
  ...props 
}) => {
  return (
    <div className="mb-4">
      <label 
        htmlFor={props.id} 
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        {label}
      </label>
      <select
        {...props}
        className={`
          w-full 
          px-3 
          py-2 
          border 
          rounded-lg 
          bg-white 
          dark:bg-gray-700 
          dark:text-gray-200
          ${error 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'}
        `}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};