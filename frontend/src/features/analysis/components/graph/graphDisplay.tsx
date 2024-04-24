import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux/reduxHooks';
import { useFormContext } from 'react-hook-form';
import { AnalysisForm } from '@/types/features/analysis';
import { setSelectedPoints } from '@/redux/slices/selectedPointsSlice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, ReferenceLine } from 'recharts';
import { CategoricalChartState } from 'recharts/types/chart/generateCategoricalChart';

interface DataPoint {
    "V3omega(V)": number;
    "ImV3omega(V)": number;
    "Heater_Freq(Hz)": number;
}

interface GraphProps {
    data: DataPoint[];
    graphName: string;
}

const Graph: React.FC<GraphProps> = ({ data, graphName }) => {
    const dispatch = useAppDispatch();
    const selectedPoints = useAppSelector(state => state.selectedPoints[graphName]) || { start: undefined, end: undefined }

    const { setValue, clearErrors } = useFormContext<AnalysisForm>();

    useEffect(() => {
        setValue(`graphs.${graphName}`, selectedPoints)
    },[selectedPoints, graphName, setValue])
    
    
    const handlePointClick = (e: CategoricalChartState) => {
        clearErrors(`graphs.${graphName}`);
        const pointIndex = e.activeTooltipIndex;

        updateSelectedPoints(pointIndex);
    };

    const updateSelectedPoints = (pointIndex: number | undefined) => {
        if (pointIndex) {

            let { start, end } = selectedPoints;
    
            if (start === pointIndex || end === pointIndex) {
                // 選択されている点を削除
                start = start === pointIndex ? undefined : start;
                end = end === pointIndex ? undefined : end;
            } else {
                // 新しい点を追加または更新
                if (start && end) {
                    start = pointIndex;
                    end = undefined;
                } else if (!start || (end && start > pointIndex)) {
                    start = pointIndex;
                } else {
                    end = pointIndex;
                }
            }
    
            // start が end より大きい場合は入れ替える
            if (start && end && start > end) {
                [start, end] = [end, start];
            }

            dispatch(setSelectedPoints({ graphName, points: { start, end }}));
        }
    };


    // グラフのy軸の最大値と最小値を設定
    const maxYValue = Math.max(
        ...data.map(d => Math.max(d["V3omega(V)"], d["ImV3omega(V)"]))
    );
    const minYValue = Math.min(
        ...data.map(d => Math.min(d["V3omega(V)"], d["ImV3omega(V)"]))
    );

    return (
        <div>
            <ResponsiveContainer height={600}>
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    onClick={handlePointClick}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Heater_Freq(Hz)" scale="log">
                        <Label value="Heater_Freq(Hz)" offset={0} position="bottom" />
                    </XAxis>
                    <YAxis domain={[minYValue, maxYValue]}>
                        <Label value="V3omega(V)" angle={-90} position="insideLeft" />
                    </YAxis>
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="V3omega(V)" stroke="#8884d8" activeDot={{ r: 8 }} isAnimationActive={false} />
                    <Line type="monotone" dataKey="ImV3omega(V)" stroke="#82ca9d" isAnimationActive={false} />
                    {selectedPoints.start && 
                        <ReferenceLine x={data[selectedPoints.start]["Heater_Freq(Hz)"]} stroke="red" />
        
                    }
                    {selectedPoints.end && 
                        <ReferenceLine x={data[selectedPoints.end]["Heater_Freq(Hz)"]} stroke="red" />
                    }
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default Graph;