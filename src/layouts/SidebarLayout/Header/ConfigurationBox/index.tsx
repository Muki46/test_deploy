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

const ConfigurationBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const ConfigurationBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const ConfigurationBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

function ConfigurationBox() {
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
      <ConfigurationBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Hidden mdDown>
          <ConfigurationBoxText>
            <ConfigurationBoxLabel variant="body1">
              Configuration
            </ConfigurationBoxLabel>
          </ConfigurationBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </ConfigurationBoxButton>
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
            href="/components/reportConfiguration"
            onClick={handleClose}
          >
            <ListItemText primary="Genotype Configuration" />
          </ListItem>
        </List>
        <Divider />

        {/* <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 0 }} component="nav">
          <ListItem
            button
            component={Link}
            href="/components"
            onClick={handleClose}
          >
            <ListItemText primary="Graph Configuration" />
          </ListItem>
        </List>
        <Divider /> */}
      </Popover>
    </>
  );
}

export default ConfigurationBox;
