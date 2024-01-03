import React from 'react';
import ChangePassword from '../features/account/changePassword';
import DeleteAccount from '../features/account/deleteAccount';
import { useAppSelector } from '../hooks/redux/reduxHooks';
import CustomSnackbar from '../components/customSnackbar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Container,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';

const Account: React.FC = () => {
    const snackbar = useAppSelector(state => state.snackbar);
    return (
        <div>
            <Container sx={{ mt: 3, mb: 3 }}>
                <Typography component={"h1"} variant="h3">
                    アカウント設定
                </Typography>
            </Container>
            <Container maxWidth="md">
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>パスワード変更</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <ChangePassword />
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>アカウント削除</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <DeleteAccount />
                    </AccordionDetails>
                </Accordion>
            </Container>
            <CustomSnackbar {...snackbar} />
        </div>
    )
}

export default Account;