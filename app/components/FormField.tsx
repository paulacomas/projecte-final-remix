interface FormFieldProps {
  label: string;
  type: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  required?: boolean;
  accept?: string; // Para campos de archivos
}

export default function FormField({
  label,
  type,
  value,
  onChange,
  required = false,
  accept,
}: FormFieldProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        accept={accept}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
      />
    </div>
  );
}
