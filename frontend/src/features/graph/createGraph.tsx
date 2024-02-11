import React from 'react';
import { useAppSelector } from '../../hooks/redux/reduxHooks';
import { useFetchFileData } from '../../hooks/analysis/useFetchFileData';
import UploadText from './uploadText';
import Graph from './graph';
import GraphList from './graphList';
import Carousel from 'react-material-ui-carousel';

const CreateGraph: React.FC = () => {
    const uploadedData = useAppSelector(state => state.uploadedData.data);

    useFetchFileData();
    
    return (
        <div>
            <UploadText />
            <Carousel
                autoPlay={false}
            >
                {uploadedData &&
                    Object.entries(uploadedData).map(([fileName, measurementData]) => {
                        return (
                            <Graph key={fileName} graphName={fileName} data={measurementData} />
                        )
                    })
                }
            </Carousel>
            <GraphList />
        </div>
    )
}

export default CreateGraph;