import React from 'react';
import { ChevronDown } from 'lucide-react';
interface BaseInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}
interface TextInputProps extends
  React.InputHTMLAttributes<HTMLInputElement>,
  BaseInputProps {}
export function TextInput({
  label,
  error,
  hint,
  className = '',
  ...props
}: TextInputProps) {
  return (
    <div className="w-full">
      {label &&
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      }
      <input
        {...props}
        className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-navy-900/20 focus:border-navy-900 ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'} ${className}`}
        style={{
          overflowX: 'hidden',
          ...((props as any).style ?? {})
        }} />

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>);

}
interface SelectOption {
  value: string;
  label: string;
}
interface SelectInputProps extends
  React.SelectHTMLAttributes<HTMLSelectElement>,
  BaseInputProps {
  options: SelectOption[];
}
export function SelectInput({
  label,
  error,
  helperText,
  options,
  fullWidth = true,
  className = '',
  ...props
}: SelectInputProps) {
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label &&
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label} {props.required && <span className="text-red-600">*</span>}
        </label>
      }
      <div className="relative">
        <select
          className={`
            block w-full h-12 px-4 pr-10 rounded-lg border text-base appearance-none bg-white transition-shadow
            focus:outline-none focus:ring-2 focus:ring-blue-500/20
            disabled:bg-gray-50 disabled:text-gray-500
            ${error ? 'border-red-600 focus:border-red-600 focus:ring-red-500/20' : 'border-gray-200 focus:border-blue-500'}
          `}
          {...props}>

          <option value="" disabled>
            Select an option
          </option>
          {options.map((opt) =>
          <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      {!error && helperText &&
      <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
      }
    </div>);

}
interface CheckboxInputProps extends
  React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
export function CheckboxInput({
  label,
  className = '',
  ...props
}: CheckboxInputProps) {
  return (
    <label
      className={`flex items-center min-h-[44px] cursor-pointer group ${className}`}>

      <div className="relative flex items-center">
        <input type="checkbox" className="peer sr-only" {...props} />
        <div className="w-6 h-6 border-2 border-gray-300 rounded-md bg-white peer-checked:bg-navy-900 peer-checked:border-navy-900 transition-colors peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-blue-500">
          <svg
            className="w-full h-full text-white opacity-0 peer-checked:opacity-100 transition-opacity"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round">

            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </div>
      <span className="ml-3 text-base text-gray-700 group-hover:text-gray-900">
        {label}
      </span>
    </label>);

}
interface RadioGroupProps {
  name: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}
export function RadioGroup({
  name,
  options,
  value,
  onChange,
  label
}: RadioGroupProps) {
  return (
    <div className="space-y-3">
      {label &&
      <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      }
      {options.map((option) =>
      <label
        key={option.value}
        className="flex items-center min-h-[32px] cursor-pointer group">

          <div className="relative flex items-center">
            <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="peer sr-only" />

            <div className="w-6 h-6 border-2 border-gray-300 rounded-full bg-white peer-checked:border-navy-900 flex items-center justify-center transition-colors peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-blue-500">
              <div className="w-2.5 h-2.5 rounded-full bg-navy-900 opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
          </div>
          <span className="ml-3 text-base text-gray-700 group-hover:text-gray-900">
            {option.label}
          </span>
        </label>
      )}
    </div>);

}
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}
export function ToggleSwitch({
  checked,
  onChange,
  label,
  disabled
}: ToggleSwitchProps) {
  return (
    <label
      className={`flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>

      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled} />

        <div
          className={`w-[52px] h-7 rounded-full transition-colors ${checked ? 'bg-green-600' : 'bg-gray-200'}`}>
        </div>
        <div
          className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform transform ${checked ? 'translate-x-6' : 'translate-x-0'}`}>
        </div>
      </div>
      {label && <span className="ml-3 text-base text-gray-700">{label}</span>}
    </label>);

}
export function PhoneInput({
  label,
  error,
  helperText,
  fullWidth = true,
  className = '',
  ...props
}: TextInputProps) {
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label &&
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label} {props.required && <span className="text-red-600">*</span>}
        </label>
      }
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <span className="text-gray-500 font-medium">+1</span>
        </div>
        <input
          className={`
            block w-full h-12 pl-12 pr-4 rounded-lg border text-base transition-shadow
            placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20
            disabled:bg-gray-50 disabled:text-gray-500
            ${error ? 'border-red-600 focus:border-red-600 focus:ring-red-500/20' : 'border-gray-200 focus:border-blue-500'}
          `}
          type="tel"
          {...props} />

      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      {!error && helperText &&
      <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
      }
    </div>);

}
export function CurrencyInput({
  label,
  error,
  helperText,
  fullWidth = true,
  className = '',
  ...props
}: TextInputProps) {
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label &&
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label} {props.required && <span className="text-red-600">*</span>}
        </label>
      }
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <span className="text-gray-500 font-medium font-mono">$</span>
        </div>
        <input
          className={`
            block w-full h-12 pl-10 pr-4 rounded-lg border text-base font-mono text-right transition-shadow
            placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20
            disabled:bg-gray-50 disabled:text-gray-500
            ${error ? 'border-red-600 focus:border-red-600 focus:ring-red-500/20' : 'border-gray-200 focus:border-blue-500'}
          `}
          type="text"
          inputMode="decimal"
          {...props} />

      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      {!error && helperText &&
      <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
      }
    </div>);

}
interface TextareaInputProps extends
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  BaseInputProps {}
export function TextareaInput({
  label,
  error,
  hint,
  className = '',
  ...props
}: TextareaInputProps) {
  return (
    <div className="w-full">
      {label &&
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      }
      <textarea
        {...props}
        className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-navy-900/20 focus:border-navy-900 resize-none ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'} ${className}`}
        style={{
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
          overflowX: 'hidden',
          ...((props as any).style ?? {})
        }} />

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>);

}