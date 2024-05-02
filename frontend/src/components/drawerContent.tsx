import React from 'react';
import { useAppSelector } from '@/hooks/redux/reduxHooks';
import { Link } from 'react-router-dom';
import {
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Divider
} from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';

interface DrawerContentProps {
    handleDrawerClose: () => void;
}

const DrawerContent: React.FC<DrawerContentProps> = ({ handleDrawerClose }) => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const user = useAppSelector(state => state.auth.user);

    return (
        <div>
            <List>
                {isAuthenticated ?
                    // ログインしている場合はユーザー名を表示するリストアイテム
                    <div>
                        <ListItemButton component={Link} to="/account" onClick={handleDrawerClose}>
                            <ListItemIcon>
                                <AccountBoxIcon />
                            </ListItemIcon>
                            <ListItemText primary={user?.username} />
                        </ListItemButton>
                    </div>
                    :
                    // ログインしていない場合は空のToolbarを表示
                    <Toolbar />
                }
                <Divider />
                <ListItemButton component={Link} to="/" onClick={handleDrawerClose}>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="トップページ" />
                </ListItemButton>
                <ListItemButton component={Link} to="/setting" onClick={handleDrawerClose}>
                    <ListItemIcon>
                        <ListIcon />
                    </ListItemIcon>
                    <ListItemText primary="測定設定一覧" />
                </ListItemButton>
            </List>
        </div>
    )
}

export default DrawerContent;