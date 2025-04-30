import TextField from '@mui/material/TextField';

interface InputFieldProps {
    label: string;
    required: boolean;
    type?: string;
    name: string;
    className?: string;
}

const InputField = ({ label, type, name, required, className } : InputFieldProps) => {
    return (
        <TextField
            required={required}
            label={label}
            type={type}
            name={name}
            className={` ${className}`}
        />
    );
}
 
export default InputField;