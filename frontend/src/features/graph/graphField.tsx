import React, { useState } from 'react';
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

    const [activeIndex, setActiveIndex] = useState(0);

    const handleSetIndex = (index: number) => {
        setActiveIndex(index);
    }

    // カルーセルとactiveIndexの連携
    const handleCarouselChange = (now?: number, previous?: number) => {
        setActiveIndex(now ?? 0);
    };
    
    return (
        <div>
            <UploadText />
            <GraphErrors />
            <Carousel
                autoPlay={false}
                index={activeIndex}
                onChange={handleCarouselChange}
            >
                {uploadedData &&
                    Object.entries(uploadedData.data).map(([fileName, measurementData]) => {
                        return (
                            <Graph key={fileName} graphName={fileName} data={measurementData} />
                            )
                        })
                    }
            </Carousel>
            <GraphList activeIndex={activeIndex} onListItemClick={handleSetIndex}/>
        </div>
    )
}

export default GraphField;