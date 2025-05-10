import { Checkbox } from "@mui/material";

interface IProps {
    name: string;
    value: string;
    onCheckedChange?: (checked: boolean) => void;
}

const CheckBox = ({ name, value, onCheckedChange } : IProps) => {
    return (
        <Checkbox 
            name={name} 
            value={value} 
            color="primary"
            onChange={(e) => onCheckedChange?.(e.target.checked)}
        />
    )
}

export default CheckBox;