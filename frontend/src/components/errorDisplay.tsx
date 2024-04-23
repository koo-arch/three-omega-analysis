import React from 'react';
import ErrorIcon from '@mui/icons-material/Error';

interface ErrorMessageProps {
    errors: Record<string, any>;
    getMessage?: (error: any) => string;
}

const ErrorDisplay: React.FC<ErrorMessageProps> = ({ errors, getMessage = (error) => error }) => {
    return (
        <div>
            {Object.entries(errors).map(([name, error]) => (
                <div key={name} style={{ color: 'red' }}>
                    <ErrorIcon style={{ fontSize: '1rem', verticalAlign: 'middle' }} />
                    <span style={{ marginLeft: '0.5rem' }}>{name}: {getMessage(error)}</span>
                </div>
            ))}
        </div>
    );
}

export default ErrorDisplay;