import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  lighten,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import GridViewIcon from '@mui/icons-material/GridView';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`
);

function HeaderUserbox() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [uname, setUsername] = useState('');
  const [roleName, setRoleName] = useState('');
  const [permission, setPermission] = useState([]);

  const user = {
    name: 'mike',
    avatar: '',
    jobtitle: 'User'
  };

  useEffect(() => {
    setUsername(localStorage.getItem('UserName'));
    setRoleName(localStorage.getItem('RoleName'));
    let retString = localStorage.getItem('Permission');
    let retArray = JSON.parse(retString);
    setPermission(retArray);
  }, []);

  const ref = useRef<any>(null);

  const handleOpen = (): void => {
    setIsOpen(true);
  };

  const handleClose = (): void => {
    setIsOpen(false);
  };

  const signOut = (): void => {
    localStorage.clear();
    window.location.replace('/');
  };

  return (
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Avatar variant="rounded" alt={uname} src={user.avatar} />
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabel variant="body1">{uname}</UserBoxLabel>
            <UserBoxDescription variant="body2">{roleName}</UserBoxDescription>
          </UserBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuUserBox sx={{ minWidth: 200 }} display="flex">
          <Avatar variant="rounded" alt={uname} src="" />
          <UserBoxText>
            <UserBoxLabel variant="body1">{uname}</UserBoxLabel>
            <UserBoxDescription variant="body2">{roleName}</UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
        {permission.some((item) => item.permission_name === 'Accounts') ? (
          <List sx={{ p: 1 }} component="nav">
            <ListItem
              button
              component={Link}
              href="/components/account"
              onClick={handleClose}
            >
              <AccountBalanceIcon fontSize="small" />
              <ListItemText primary="Account" />
            </ListItem>
          </List>
        ) : (
          ''
        )}
        <Divider />
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 1 }} component="nav">
          <ListItem
            button
            component={Link}
            href="/components/profile"
            onClick={handleClose}
          >
            <AccountBoxTwoToneIcon fontSize="small" />
            <ListItemText primary="My Profile" />
          </ListItem>
        </List>
        <Divider />
        <Divider sx={{ mb: 0 }} />
        {permission.some((item) => item.permission_name === 'Sign in logs') ? (
          <List sx={{ p: 1 }} component="nav">
            <ListItem
              button
              component={Link}
              href="/components/SignInLogs"
              onClick={handleClose}
            >
              <GridViewIcon fontSize="small" />
              <ListItemText primary="Sign In Logs" />
            </ListItem>
          </List>
        ) : (
          ''
        )}
        <Divider />
        <Divider sx={{ mb: 0 }} />
        {permission.some((item) => item.permission_name === 'Audit logs') ? (
          <List sx={{ p: 1 }} component="nav">
            <ListItem
              button
              component={Link}
              href="/components/AuditLogs"
              onClick={handleClose}
            >
              <AutoAwesomeMosaicIcon fontSize="small" />
              <ListItemText primary="Audit Logs" />
            </ListItem>
          </List>
        ) : (
          ''
        )}
        <Divider />
        <Divider sx={{ mb: 0 }} />
        {permission.some((item) => item.permission_name === 'Recycle bin') ? (
          <List sx={{ p: 1 }} component="nav">
            <ListItem
              button
              component={Link}
              href="/components/RecycleBin"
              onClick={handleClose}
            >
              <RestoreFromTrashIcon fontSize="medium" />
              <ListItemText primary="Recycle Bin" />
            </ListItem>
          </List>
        ) : (
          ''
        )}
        <Divider />
        <Box sx={{ m: 1 }}>
          <Button
            fullWidth
            onClick={signOut}
            style={{
              padding: '10px 10px'
            }}
          >
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            <span
              style={{
                fontSize: '17px'
              }}
            >
              Sign out
            </span>
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderUserbox;
