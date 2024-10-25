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

const MasterBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MasterBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const MasterBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

function ClientBox() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [permission, setPermission] = useState([]);

  useEffect(() => {
    let retString = localStorage.getItem('Permission');
    let retArray = JSON.parse(retString);
    setPermission(retArray);
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
      <MasterBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Hidden mdDown>
          <MasterBoxText>
            <MasterBoxLabel variant="body1">Clients</MasterBoxLabel>
          </MasterBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </MasterBoxButton>
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
        {permission.some((item) => item.permission_name === 'Client') ? (
          <List sx={{ p: 0 }} component="nav">
            <ListItem
              classes={{ root: 'MuiListItem-indicators' }}
              button
              onClick={handleClose}
              component={Link}
              href="/components/clients"
            >
              <ListItemText
                primaryTypographyProps={{ noWrap: true }}
                primary="Clients List"
              />
            </ListItem>
          </List>
        ) : (
          ''
        )}
        <Divider sx={{ mb: 0 }} />
        {permission.some((item) => item.permission_name === 'Client') ? (    
        <List sx={{ p: 0 }} component="nav">
          <ListItem
            classes={{ root: 'MuiListItem-indicators' }}
            button
            component={Link}
            onClick={handleClose}
            href="/components/clientDomainMapping"
          >
            <ListItemText
              primaryTypographyProps={{ noWrap: true }}
              primary="Client-Domain Mapping"
            />
          </ListItem>
        </List>
        ):('')}
        <Divider />
      </Popover>
    </>
  );
}

export default ClientBox;
