import React, { useState } from 'react';
import { useAppSelector } from '@/hooks/redux/reduxHooks';
import { isDataExist } from '@/utils/uploadFile';
import { Box, Button } from '@mui/material';
import { motion } from 'framer-motion';
import StartIcon from '@mui/icons-material/StartOutlined';

const AnalysisButton: React.FC = () => {
    const [hover, setHover] = useState(false);
    const uploadedData = useAppSelector(state => state.uploadedData.data);

    if (!isDataExist(uploadedData?.data)) {
        return null;
    }

    const iconStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'primary.main',
        borderRadius: '50%',
        width: 50, // アイコンの大きさを少し大きくする
        height: 50, // アイコンの大きさを少し大きくする
        color: '#fff',
    }

    return (
        <Button
            type="submit"
            color="inherit"
            size="large"
            form="analysis-form"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            sx={{
                padding: '12px 30px', // パディングを調整してボタンを大きくする
                fontSize: '1.25rem', // フォントサイズを大きくする
                ':hover': {
                    backgroundColor: 'transparent', // ホバー時の背景色変更を無効化
                    color: 'primary.main',
                    boxShadow: 'none', // ホバー時の影を無効化
                }
            }}
            startIcon={
                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: hover ? 100 : 0 }}
                    transition={{ type: "tween", duration: 0.3 }}
                >
                    <Box sx={{ ...iconStyle }}>
                        <StartIcon />
                    </Box>
                </motion.div>
            }
        >
            <motion.span
                initial={{ x: 0 }}
                animate={{ x: hover ? -50 : 0 }}
                transition={{ type: "tween", duration: 0.3 }}
            >
                解析開始
            </motion.span>
        </Button>
    )
}

export default AnalysisButton;
