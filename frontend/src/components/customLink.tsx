import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';

interface CustomLinkProps {
    to: string;
    children: React.ReactNode;
    variant: "body1" | "body2" | "button" | "caption" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "inherit" | "overline" | "subtitle1" | "subtitle2" | undefined;
}

const CustomLink: React.FC<CustomLinkProps> = (props) => {
    const { to, children, variant } = props;
    return (
        <MuiLink component={RouterLink} to={to} variant={variant}>
            {children}
        </MuiLink>
    );
}

export default CustomLink;