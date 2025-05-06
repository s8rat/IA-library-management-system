import { Checkbox } from "@mui/material";

interface IProps {
    name: string;
    value: string;
}

const CheckBox = ({ name, value } : IProps) => {
    return (
        <Checkbox name={name} value={value} color="primary" />
    )
}

export default CheckBox;