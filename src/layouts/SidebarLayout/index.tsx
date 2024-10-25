import { FC, ReactNode, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import { ActiveSessionProvider } from 'active-session-library';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Header from './Header';

interface SidebarLayoutProps {
  children?: ReactNode;
}

const SidebarLayout: FC<SidebarLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [isidle, setIsIdle] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const handleClose = () => {
    setOpen(false);
    clearInterval(intervalId);
  };

  const handleOut = async () => {
    localStorage.clear();
    window.location.replace('/');
  };

  const logoff = async () => {
    localStorage.clear();
    window.location.replace('/');
  };

  return (
    <>
      <ActiveSessionProvider
        timeout={1080000}
        postAction={() => {
          setIsIdle(true);
          setOpen(true);
          const newIntervalId = setInterval(logoff, 120000);
          setIntervalId(newIntervalId);
        }}
        isEnabled
        events={['click', 'mousemove', 'keydown', 'scroll', 'drag']}
      >
        <Box>
          <Header />
          <Box
            sx={{
              position: 'relative',
              zIndex: 5,
              display: 'block',
              flex: 1,
              pt: `${theme.header.height}`,
              [theme.breakpoints.up('lg')]: {
                ml: `${theme.sidebar.width}`
              }
            }}
          >
            <Box sx={{ maxWidth: '1500px' }} display="block">
              {children}
            </Box>
          </Box>
        </Box>
        {isidle ? (
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{'Time Out!'}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Session has been idle over it's time limit. It will be
                automatically logged off in 2 minutes.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Stay Logged In</Button>
              <Button onClick={handleOut} autoFocus>
                LogOff
              </Button>
            </DialogActions>
          </Dialog>
        ) : (
          ''
        )}
      </ActiveSessionProvider>
    </>
  );
};

SidebarLayout.propTypes = {
  children: PropTypes.node
};

export default SidebarLayout;
