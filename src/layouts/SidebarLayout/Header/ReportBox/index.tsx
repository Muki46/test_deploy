import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Divider,
  Hidden,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';

const ReportBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const ReportBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const ReportBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

function ReportBox() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [roleName, setRoleName] = useState('');
  const [permission, setPermission] = useState([]);

  useEffect(() => {
    setRoleName(localStorage.getItem('RoleName'));
    let retString = localStorage.getItem('Permission');
    let retArray = JSON.parse(retString);
    setPermission(retArray);
    console.log(roleName);
  }, []);

  const ref = useRef<any>(null);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <ReportBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Hidden mdDown>
          <ReportBoxText>
            <ReportBoxLabel variant="body1">Reports</ReportBoxLabel>
          </ReportBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </ReportBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <Divider sx={{ mb: 0 }} />
        {permission.some(
          (item) => item.permission_name === 'Generate Report'
        ) ? (
          <List sx={{ p: 0 }} component="nav">
            <ListItem
              button
              component={Link}
              href="/components/reports"
              onClick={handleClose}
            >
              <ListItemText primary="Generate" />
            </ListItem>
          </List>
        ) : (
          ''
        )}
        <Divider />
        <Divider sx={{ mb: 0 }} />
        {permission.some(
          (item) => item.permission_name === 'Report history'
        ) ? (
          <List sx={{ p: 0 }} component="nav">
            <ListItem
              button
              component={Link}
              href="/components/reports/reportHistory"
              onClick={handleClose}
            >
              <ListItemText primary="History" />
            </ListItem>
          </List>
        ) : (
          ''
        )}
        <Divider />
      </Popover>
    </>
  );
}

export default ReportBox;
