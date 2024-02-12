import { format } from 'date-fns';

export const  downloadCSV = (name: string, resData: Blob): void => {
    const formatedDate = format(new Date(), "yyyyMMdd");
    const fileName = `${name}_${formatedDate}.csv`

    const url = window.URL.createObjectURL(new Blob([resData]));
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
}

export const parseBlobToJson = (blob: Blob): Promise<any> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            try {
                // 読み込んだファイルをJSONに変換
                const jsonData = JSON.parse(reader.result as string)
                resolve(jsonData)
            } catch {
                reject(new Error("Failed to parse JSON"))
            }
        }
        reader.onerror = () => {
            reject(new Error("Failed to read the blob as text"))
        }
        // Blobをテキストとして読み込む
        reader.readAsText(blob)
    });
}