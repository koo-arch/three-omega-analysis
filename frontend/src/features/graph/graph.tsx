import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormValues } from '../../pages/top';
import { createSelector } from 'reselect';
import { RootState } from '../../redux/store';
import { useAppDispatch, useAppSelector } from '../../hooks/redux/reduxHooks';
import { updateSelectedPoints } from '../../redux/selectedPointsSlice';
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

const selectGlobalPoints = (graphName: string) => createSelector(
    (state: RootState) => state.selectedPoints,
    (selectedPoints) => selectedPoints[graphName] || []
);

const Graph: React.FC<GraphProps> = ({ data, graphName }) => {
    const dispatch = useAppDispatch();
    const globalSelectedPoints = useAppSelector(selectGlobalPoints(graphName));
    const [selectedPoints, setSelectedPointsLocal] = useState<number[]>(globalSelectedPoints);

    const { setValue } = useFormContext<FormValues>();

    useEffect(() => {
        if (globalSelectedPoints !== selectedPoints) {
            dispatch(updateSelectedPoints({ graphName, points: selectedPoints }));
        }
        setValue(`graphs.${graphName}`, selectedPoints)
    },[selectedPoints, dispatch, graphName, setValue])

    console.log(globalSelectedPoints)

    const handlePointClick = (e: CategoricalChartState) => {
        if (e && e.activeTooltipIndex) {
            if (selectedPoints.includes(e.activeTooltipIndex)) {
                // 既に選択されている点を削除
                setSelectedPointsLocal(selectedPoints.filter(point => point !== e.activeTooltipIndex));
            } else if (selectedPoints.length < 2) {
                // 新しい点を追加し、昇順でソート
                const newSelectedPoints = [...selectedPoints, e.activeTooltipIndex];
                newSelectedPoints.sort((a, b) => a - b);
                setSelectedPointsLocal(newSelectedPoints);
            }
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
                    <Line type="monotone" dataKey="V3omega(V)" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="ImV3omega(V)" stroke="#82ca9d" />
                    {selectedPoints.map((point, index) => {
                        return (
                            <ReferenceLine key={index} x={data[point]["Heater_Freq(Hz)"]} stroke="red" />
                        )
                    
                    })}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default Graph;