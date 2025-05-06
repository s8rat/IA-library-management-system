import TextField from '@mui/material/TextField';
import { ChangeEvent } from 'react';

interface InputFieldProps {
    label?: string;
    required: boolean;
    type?: string;
    name: string;
    className?: string;
    value: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({ label, type, name, value, required, className, onChange } : InputFieldProps) => {
    return (
        <TextField
            required={required}
            label={label}
            type={type}
            name={name}
            value={value}
            className={` ${className}`}
            onChange={onChange}
        />
    );
}
 
export default InputField;