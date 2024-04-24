import React from 'react';
import { useFormContext } from 'react-hook-form';
import { AnalysisForm } from '../../../../types/features/analysis';
import ErrorDisplay from '../../../../components/errorDisplay';

const GraphErrors: React.FC = () => {
    const { formState: { errors }} = useFormContext<AnalysisForm>();
    const graphErrors = errors?.graphs ?? {};

    return <ErrorDisplay errors={graphErrors} getMessage={(error) => error?.message} />;
}

export default GraphErrors;