import { FileData } from '../types/features/analysis';

export const isDataExist = (data?: FileData): boolean => {
    return !!data && Object.keys(data).length !== 0;
}