import React, { useState } from 'react';
import { useAppSelector } from '../../hooks/redux/reduxHooks';
import { useFetchFileData } from '../../hooks/analysis/useFetchFileData';
import GraphErrors from './graphErrors';
import GraphCarousel from './graphCarousel';
import GraphList from './graphList';
import { Container, Typography, Grid } from '@mui/material';

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

const GraphField: React.FC = () => {
    const uploadedData = useAppSelector(state => state.uploadedData.data);
    console.log(uploadedData);
    useFetchFileData();

    const isDataExist = (data?: FileData): boolean => {
        return !!data && Object.keys(data).length !== 0;
    }

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
            {isDataExist(uploadedData?.data) &&
                <div>
                    <Typography variant="h3">グラフ</Typography>
                    <Typography variant="body1" gutterBottom>各グラフの2点をクリックして解析範囲を指定してください</Typography>
                    <GraphErrors />
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