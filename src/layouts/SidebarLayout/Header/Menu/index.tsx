import { Box, List, ListItem, ListItemText, styled } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import MasterBox from '../Masterbox';
import ReportBox from '../ReportBox';
import AppUserBox from '../AppUserBox';
import ConfigurationBox from '../ConfigurationBox';

const ListWrapper = styled(Box)(
  ({ theme }) => `
        .MuiTouchRipple-root {
            display: none;
        }
        
        .MuiListItem-root {
            transition: ${theme.transitions.create(['color', 'fill'])};
            
            &.MuiListItem-indicators {
                padding: ${theme.spacing(1, 2)};
            
                .MuiListItemText-root {
                    .MuiTypography-root {
                        &:before {
                            height: 4px;
                            width: 22px;
                            opacity: 0;
                            visibility: hidden;
                            display: block;
                            font-weight:600;
                            position: absolute;
                            bottom: -10px;
                            transition: all .2s;
                            border-radius: ${theme.general.borderRadiusLg};
                            content: "";
                            background: ${theme.colors.primary.main};
                        }
                    }
                }

                &.active,
                &:active,
                &:hover {
                
                    background: transparent;
                
                    .MuiListItemText-root {
                        .MuiTypography-root {
                            &:before {
                                opacity: 1;
                                visibility: visible;
                                bottom: 0px;
                            }
                        }
                    }
                }
            }
        }
`
);

function HeaderMenu() {
  const [logo, setLogo] = useState('');
  const [roleName, setRoleName] = useState('');
  const [permission, setPermission] = useState([]);

  useEffect(() => {
    setLogo(localStorage.getItem('AccountLogo'));
    let retString = localStorage.getItem('Permission');
    let retArray = JSON.parse(retString);
    setPermission(retArray);
    console.log(retArray);
    setRoleName(localStorage.getItem('RoleName'));
  }, []);

  return (
    <>
      <ListWrapper
        sx={{
          display: {
            xs: 'none',
            md: 'block'
          }
        }}
      >
        <List disablePadding component={Box} display="flex">
          {roleName == 'Client User' || roleName == 'Client Admin' ? (
            <ListItem
              classes={{ root: 'MuiListItem-indicators' }}
              component={Link}
              href="/components/clients"
            >
              <img width={180} height={35} alt="EndoDNA-logo" src={logo} />
            </ListItem>
          ) : (
            <ListItem
              classes={{ root: 'MuiListItem-indicators' }}
              component={Link}
              href={
                permission.some((item) => item.permission_name === 'Patients')
                  ? '/components/patients'
                  : '/components/profile'
              }
            >
              <img width={180} height={35} alt="EndoDNA-logo" src={logo} />
            </ListItem>
          )}

          {permission.some((item) => item.permission_name === 'Client') ? (
            <ListItem
              classes={{ root: 'MuiListItem-indicators' }}
              button
              component={Link}
              href="/components/clients"
            >
              <ListItemText
                primaryTypographyProps={{ noWrap: true }}
                primary="Clients"
              />
            </ListItem>
          ) : (
            ''
          )}

          {permission.some((item) => item.permission_name === 'Patients') ? (
            <ListItem
              classes={{ root: 'MuiListItem-indicators' }}
              button
              component={Link}
              href="/components/patients"
            >
              <ListItemText
                primaryTypographyProps={{ noWrap: true }}
                primary="Patients"
              />
            </ListItem>
          ) : (
            ''
          )}

          {permission.some((item) => item.permission_name === 'Provider') ? (
            <ListItem
              classes={{ root: 'MuiListItem-indicators' }}
              button
              component={Link}
              href="/components/providers"
            >
              <ListItemText
                primaryTypographyProps={{ noWrap: true }}
                primary="Providers"
              />
            </ListItem>
          ) : (
            ''
          )}

          {permission.some(
            (item) => item.permission_name === 'Generate Report'
          ) ||
          permission.some(
            (item) => item.permission_name === 'Report history'
          ) ? (
            <ListItem sx={{ padding: 0.1, marginRight: '5px' }}>
              <ReportBox />
            </ListItem>
          ) : (
            ''
          )}

          {permission.some((item) => item.permission_name === 'Roles') ||
          permission.some((item) => item.permission_name === 'Users') ? (
            <ListItem sx={{ padding: 0.1, marginRight: '5px' }}>
              <AppUserBox />
            </ListItem>
          ) : (
            ''
          )}

          {permission.some((item) => item.permission_name === 'Master') ? (
            <ListItem sx={{ padding: 0.1, marginRight: '2px' }}>
              <MasterBox />
            </ListItem>
          ) : (
            ''
          )}

          {permission.some(
            (item) => item.permission_name === 'Genotype Configuration'
          ) ? (
            <ListItem sx={{ padding: 0.1, marginRight: '5px' }}>
              <ConfigurationBox />
            </ListItem>
          ) : (
            ''
          )}
        </List>
      </ListWrapper>
    </>
  );
}

export default HeaderMenu;
