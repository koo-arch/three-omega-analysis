import { GraphValues } from './graph';

export interface AnalysisForm {
    dRdT: number | undefined;
    length: number | undefined;
    graphs: GraphValues;
}

export interface FileData {
    [fileName: string]: MeasurementData[]
}

export interface MeasurementData {
    "Current_Freq(Hz)": number;
    "Heater_Freq(Hz)": number;
    "Vomega(V)": number;
    "ImVomega(V)": number;
    "V3omega(V)": number;
    "ImV3omega(V)": number;
}