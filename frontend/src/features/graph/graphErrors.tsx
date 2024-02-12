import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormValues } from '../analysis/analysis';
import ErrorIcon from '@mui/icons-material/Error';

const GraphErrors: React.FC = () => {
    const { formState: { errors }} = useFormContext<FormValues>();

    return (
        <div>
            {errors.graphs && Object.keys(errors.graphs).map((graphName) => (
                <div key={graphName} style={{ color: 'red' }}>
                    <ErrorIcon style={{ fontSize: '1rem', verticalAlign: 'middle' }} />
                    <span style={{ marginLeft: '0.5rem' }}>{errors.graphs && errors.graphs[graphName]?.message}</span>
                </div>
            ))}
        </div>
    )
}

export default GraphErrors;