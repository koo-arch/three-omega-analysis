import React from 'react';
import { useAppSelector } from '@/hooks/redux/reduxHooks';
import Carousel from 'react-material-ui-carousel';
import GraphDisplay from './graphDisplay';
import { Card, CardContent } from '@mui/material';

interface Props {
    activeIndex: number;
    onIndexChange: (now?: number) => void;
}

const GraphCarousel: React.FC<Props> = ({ activeIndex, onIndexChange }) => {
    const uploadedData = useAppSelector(state => state.uploadedData.data);

    return (
        <Card variant='outlined'>
            <CardContent>
                <Carousel
                    autoPlay={false}
                    index={activeIndex}
                    onChange={onIndexChange}
                >
                    {uploadedData &&
                        Object.entries(uploadedData.data).map(([fileName, measurementData]) => {
                            return (
                                <GraphDisplay key={fileName} graphName={fileName} data={measurementData} />
                            )
                        })
                    }
                </Carousel>
            </CardContent>
        </Card>
    )
}

export default GraphCarousel;