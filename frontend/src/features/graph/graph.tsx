import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormValues, SelectedPoints } from '../../features/analysis/analysis';
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
    const [selectedPoints, setSelectedPoints] = useState<SelectedPoints>({} as SelectedPoints);

    const { setValue } = useFormContext<FormValues>();

    useEffect(() => {
        setValue(`graphs.${graphName}`, selectedPoints)
    },[selectedPoints, graphName, setValue])


    const handlePointClick = (e: CategoricalChartState) => {
        const pointIndex = e.activeTooltipIndex;

        if (pointIndex) {
            let newStart = selectedPoints.start;
            let newEnd = selectedPoints.end;

            if (newStart === pointIndex || newEnd === pointIndex) {
                // 選択されている点を削除
                newStart = newStart === pointIndex ? undefined : newStart;
                newEnd = newEnd === pointIndex ? undefined : newEnd;
            } else {
                // 新しい点を追加または更新
                if (newStart && newEnd) {
                    newStart = pointIndex;
                    newEnd = undefined;
                } else if (!newStart || (newEnd && newStart > pointIndex)) {
                    newStart = pointIndex;
                } else {
                    newEnd = pointIndex;
                }
            }

            // start が end より大きい場合は入れ替える
            if (newStart && newEnd && newStart > newEnd) {
                [newStart, newEnd] = [newEnd, newStart];
            }

            setSelectedPoints({ start: newStart, end: newEnd });
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