import { useState } from "react"
import { MuiTelInput } from "mui-tel-input"

const TelInput = () => {
    const [value, setValue] = useState('')

    const handleChange = (newValue: string) => {
        setValue(newValue)
    }

    return <MuiTelInput  value={value} defaultCountry='EG' forceCallingCode disableDropdown onChange={handleChange} />
}
 
export default TelInput;