import { useState } from "react"
import { MuiTelInput } from "mui-tel-input"

interface TelInputProps {
    onPhoneChange: (phoneNumber: string) => void;
    error?: string;
}

const TelInput = ({ onPhoneChange, error }: TelInputProps) => {
    const [value, setValue] = useState('')
    const [localError, setLocalError] = useState('')

    const handleChange = (newValue: string) => {
        // Remove any non-digit characters except +
        let cleanNumber = newValue.replace(/[^\d+]/g, '');
        
        // If number doesn't start with +20, add it
        if (!cleanNumber.startsWith('+20')) {
            cleanNumber = '+20' + cleanNumber.replace('+', '');
        }
        
        // Limit the number after +20 to 11 digits
        const prefix = '+20';
        const numberPart = cleanNumber.slice(prefix.length).slice(0, 11);
        cleanNumber = prefix + numberPart;
        
        setValue(cleanNumber);

        // Validate length
        if (numberPart.length !== 11) {
            setLocalError('Phone number must be 11 digits')
        } else {
            setLocalError('')
        }

        // Send to backend with 0 prefix
        const backendNumber = '0' + numberPart;
        onPhoneChange(backendNumber);
    }

    return (
        <div>
            <MuiTelInput 
                value={value} 
                defaultCountry='EG' 
                forceCallingCode={true}
                disableDropdown 
                onChange={handleChange}
                error={!!error || !!localError}
                helperText={error || localError}
                className="w-full"
            />
        </div>
    )
}
 
export default TelInput;