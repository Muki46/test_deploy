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

function MasterBox() {
  const [isOpen, setOpen] = useState<boolean>(false);

  useEffect(() => {}, []);

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
            <MasterBoxLabel variant="body1">Master</MasterBoxLabel>
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
        <List sx={{ p: 0 }} component="nav">
          <ListItem
            button
            component={Link}
            href="/components/reportType"
            onClick={handleClose}
          >
            <ListItemText primary="Report Type" />
          </ListItem>
        </List>
        <Divider />
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 0 }} component="nav">
          <ListItem
            button
            component={Link}
            href="/components/category"
            onClick={handleClose}
          >
            <ListItemText primary="Category" />
          </ListItem>
        </List>
        <Divider />
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 0 }} component="nav">
          <ListItem
            button
            component={Link}
            href="/components/subCategory"
            onClick={handleClose}
          >
            <ListItemText primary="Sub Category" />
          </ListItem>
        </List>
        <Divider />
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 0 }} component="nav">
          <ListItem
            button
            component={Link}
            href="/components/gene"
            onClick={handleClose}
          >
            <ListItemText primary="Gene" />
          </ListItem>
        </List>
        <Divider />
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 0 }} component="nav">
          <ListItem
            button
            component={Link}
            href="/components/snp"
            onClick={handleClose}
          >
            <ListItemText primary="SNP" />
          </ListItem>
        </List>
        <Divider />
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 0 }} component="nav">
          <ListItem
            button
            component={Link}
            href="/components/domain"
            onClick={handleClose}
          >
            <ListItemText primary="Domain" />
          </ListItem>
        </List>
        <Divider />
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 0 }} component="nav">
          <ListItem
            button
            component={Link}
            href="/components/color"
            onClick={handleClose}
          >
            <ListItemText primary="Color" />
          </ListItem>
        </List>
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 0 }} component="nav">
          <ListItem
            button
            component={Link}
            href="/components/graphState"
            onClick={handleClose}
          >
            <ListItemText primary="Graph State" />
          </ListItem>
        </List>
      </Popover>
    </>
  );
}

export default MasterBox;
