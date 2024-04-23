import React, { useState } from 'react';
import { useFetchUserInfo } from '../hooks/auth/useFetchUserInfo';
import AccountButton from './accountButton';
import {
    CssBaseline,
    AppBar,
    IconButton,
    Box,
    Typography,
    Drawer,
    SwipeableDrawer,
    Toolbar,
} from '@mui/material';
import DrawerContent from './drawerContent';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 300;

interface ResponsiveDrawerProps {
    children: React.ReactNode;
}

const ResponsiveDrawer: React.FC<ResponsiveDrawerProps> = ({ children }) => {
    // ドロワー（サイドメニュー）の状態を管理
    const [open, setOpen] = useState(false);

    // ドロワーの開閉を制御する関数
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    // ユーザー情報をフェッチするカスタムフックを使用
    useFetchUserInfo();

    return (
        <Box sx={{
            flexGrow: 1,
            display: 'flex',
        }}>
            {/* ヘッダーコンポーネント */}
            <CssBaseline />
            <AppBar 
                position="fixed"
                sx={{
                    backgroundColor: 'white',
                    color: 'black',
                }}
            >
                <Toolbar>
                    {/* メニューアイコン：モバイルデバイスでドロワーを開閉 */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerOpen}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    {/* ページタイトル */}
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        3ω解析
                    </Typography>
                    {/* アカウント関連のボタン */}
                    <AccountButton />
                </Toolbar>
            </AppBar>
            <Box component="nav">
                {/* モバイル用ドロワー */}
                <SwipeableDrawer
                    open={open}
                    onOpen={handleDrawerOpen}
                    onClose={handleDrawerClose}
                    variant="temporary"
                    ModalProps={{
                        keepMounted: true, // モバイルデバイスでのパフォーマンス向上のため
                    }}
                    sx={{
                        display: { sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    <DrawerContent handleDrawerClose={handleDrawerClose} />
                </SwipeableDrawer>
            </Box>
            {/* メインコンテンツ */}
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3 }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default ResponsiveDrawer;