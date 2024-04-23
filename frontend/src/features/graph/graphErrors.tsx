import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormValues } from '../analysis/analysis';
import ErrorDisplay from '../../components/errorDisplay';

const GraphErrors: React.FC = () => {
    const { formState: { errors }} = useFormContext<FormValues>();
    const graphErrors = errors?.graphs ?? {};

    return <ErrorDisplay errors={graphErrors} getMessage={(error) => error?.message} />;
}

export default GraphErrors;