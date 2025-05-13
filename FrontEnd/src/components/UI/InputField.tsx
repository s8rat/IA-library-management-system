import TextField from '@mui/material/TextField';
import { ChangeEvent } from 'react';

interface InputFieldProps {
    label?: string;
    required: boolean;
    type?: string;
    name: string;
    className?: string;
    value: string;
    placeholder?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

const InputField = ({ label, type, name, value, required, className, placeholder, onChange, error } : InputFieldProps) => {
    return (
        <TextField
            required={required}
            label={label}
            type={type}
            name={name}
            value={value}
            placeholder={placeholder}
            className={` ${className}`}
            onChange={onChange}
            error={!!error}
            helperText={error}
        />
    );
}
 
export default InputField;