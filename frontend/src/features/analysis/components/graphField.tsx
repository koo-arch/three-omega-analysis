import React, { useState } from 'react';
import { useAppSelector } from '../../../hooks/redux/reduxHooks';
import { useFetchFileData } from '../../../hooks/analysis/useFetchFileData';
import GraphErrors from './graph/graphErrors';
import GraphCarousel from './graph/graphCarousel';
import GraphList from './graph/graphList';
import GraphClearButton from './graph/graphClearButton';
import { isDataExist } from '../../../utils/uploadFile';
import { Container, Typography, Grid } from '@mui/material';

const GraphField: React.FC = () => {
    const fileDataRow = useAppSelector(state => state.uploadedData.data);
    const uploadedData = fileDataRow?.data;
    console.log(fileDataRow);
    useFetchFileData();

    const [activeIndex, setActiveIndex] = useState(0);

    const handleSetIndex = (index: number) => {
        setActiveIndex(index);
    }

    // カルーセルとactiveIndexの連携
    const handleCarouselChange = (now?: number) => {
        setActiveIndex(now ?? 0);
    };
    
    return (
        <div>
            {isDataExist(uploadedData) &&
                <div>
                    <Typography variant="h3">グラフ</Typography>
                    <Typography variant="body1" gutterBottom>各グラフの2点をクリックして解析範囲を指定してください</Typography>
                    <GraphErrors />
                    <Grid container justifyContent={'flex-end'}>
                        <Grid item>
                            <GraphClearButton />
                        </Grid>
                    </Grid>
                    <Container maxWidth="md">
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={8}>
                                <GraphCarousel activeIndex={activeIndex} onIndexChange={handleCarouselChange}/>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <GraphList activeIndex={activeIndex} onListItemClick={handleSetIndex}/>
                            </Grid>
                        </Grid>
                    </Container>
                </div>
            }
        </div>
    )
}

export default GraphField;