import React from 'react';
import CustomLink from '@/components/customLink';
import { Typography } from '@mui/material';

const SendActivation: React.FC = () => {
    return (
        <div>
            <Typography component={"h1"} variant="h3" sx={{ mt: 3 }}>
                仮登録完了
            </Typography>
            <Typography variant='body1' sx={{ mt: 3 }}>
                メールを送信しました。メールに記載されているURLからアクティベーションを完了してください。<br />
                メールが届かない場合は、<CustomLink to="/activate/resend" variant='body1'>こちら</CustomLink>から再送信してください。
            </Typography>
        </div>
    )
}

export default SendActivation;