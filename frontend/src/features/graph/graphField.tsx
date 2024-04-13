import React from 'react';
import { useAppSelector } from '../../hooks/redux/reduxHooks';
import { useFetchFileData } from '../../hooks/analysis/useFetchFileData';
import UploadText from './uploadText';
import GraphErrors from './graphErrors';
import Graph from './graph';
import GraphList from './graphList';
import Carousel from 'react-material-ui-carousel';

const GraphField: React.FC = () => {
    const uploadedData = useAppSelector(state => state.uploadedData.data);
    console.log(uploadedData);
    useFetchFileData();
    
    return (
        <div>
            <UploadText />
            <GraphErrors />
            <Carousel
                autoPlay={false}
            >
                {uploadedData &&
                    Object.entries(uploadedData.data).map(([fileName, measurementData]) => {
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

export default GraphField;