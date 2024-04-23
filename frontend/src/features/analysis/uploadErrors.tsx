import React from 'react';
import { useAppSelector } from '../../hooks/redux/reduxHooks';
import ErrorDisplay from '../../components/errorDisplay';

const UploadErrors: React.FC = () => {
    const uploadError = useAppSelector(state => state.uploadError?.error);

    return uploadError ? <ErrorDisplay errors={uploadError} /> : null;
}

export default UploadErrors;