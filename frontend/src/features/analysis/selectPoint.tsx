import React from 'react';
import { useAppSelector } from '../../hooks/redux/reduxHooks';
import UploadText from './uploadText';
import Graph from './graph';

const SelectPoint: React.FC = () => {
    const uploadedData = useAppSelector(state => state.uploadedData.data);
    
    return (
        <div>
            <UploadText />
            {uploadedData &&
                Object.entries(uploadedData).map(([fileName, measurementData]) => {
                    return (
                        <Graph key={fileName} data={measurementData} />
                    )
                })
            }
        </div>
    )
}

export default SelectPoint;