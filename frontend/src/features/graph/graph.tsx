import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, ReferenceLine } from 'recharts';
import { CategoricalChartState } from 'recharts/types/chart/generateCategoricalChart';

interface DataPoint {
    "V3omega(V)": number;
    "ImV3omega(V)": number;
    "Heater_Freq(Hz)": number;
}

interface GraphProps {
    data: DataPoint[];
}

const Graph: React.FC<GraphProps> = ({ data }) => {
    const [selectedPoints, setSelectedPoints] = useState<number[]>([]);

    const handlePointClick = (e: CategoricalChartState) => {
        if (e && e.activeTooltipIndex && selectedPoints.length >= 0 && selectedPoints.length < 2) {
            setSelectedPoints([...selectedPoints, e.activeTooltipIndex]);
        } else if (e && selectedPoints.some(point => point === e.activeTooltipIndex)) {
            setSelectedPoints(selectedPoints.filter(point => point !== e.activeTooltipIndex));
        } else if (e && e.activeTooltipIndex && selectedPoints.length === 2) {
            setSelectedPoints([...selectedPoints.slice(1), e.activeTooltipIndex]);
        }
    }

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