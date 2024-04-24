import React, { useState } from 'react';
import { useAppSelector } from '@/hooks/redux/reduxHooks';
import { Link, useLocation } from 'react-router-dom';
import { useLogout } from '@/hooks/auth/useLogout';
import { IconButton, Menu, MenuItem, Button } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

const AccountButton: React.FC = () => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const location = useLocation();
    const logout = useLogout();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const signButton = (
        location.pathname === '/login' ?
            <Button
                color='inherit'
                variant='outlined'
                component={Link}
                to='/register'
            >
                新規登録
            </Button>
            :
            <Button
                variant='outlined'
                color="primary"
                component={Link}
                to='/login'
            >
                ログイン
            </Button>
    )
    return (
        <div>
            {isAuthenticated ?
                <div>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleClick}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem component={Link} to={"/account"} onClick={handleClose}>
                            アカウント設定
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleClose();
                                logout();
                            }}
                        >
                            ログアウト
                        </MenuItem>
                    </Menu>
                </div>
                :
                signButton
            }
        </div>
    )
}

export default AccountButton;