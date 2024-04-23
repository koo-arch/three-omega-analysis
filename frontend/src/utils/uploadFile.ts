interface FileData {
    [fileName: string]: MeasurementData[]
}

interface MeasurementData {
    "Current_Freq(Hz)": number;
    "Heater_Freq(Hz)": number;
    "Vomega(V)": number;
    "ImVomega(V)": number;
    "V3omega(V)": number;
    "ImV3omega(V)": number;
}


export const isDataExist = (data?: FileData): boolean => {
    return !!data && Object.keys(data).length !== 0;
}