import SidebarLayout from '@/layouts/SidebarLayout';
import Head from 'next/head';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  useTheme,
  IconButton,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState, forwardRef, useEffect } from 'react';
import { TransitionProps } from '@mui/material/transitions';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useConfirm } from 'material-ui-confirm';
import Slide from '@mui/material/Slide';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useAxios } from 'pages/services';
import MUIDataTable from 'mui-datatables';
import { DNA } from 'react-loader-spinner';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import moment from 'moment';
import Router from 'next/router';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const getMuiTheme = () =>
  createTheme({
    components: {
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: '4px',
            backgroundColor: '#fff',
            fontFamily:
              '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"'
          }
        }
      },
      MuiToolbar: {
        styleOverrides: {
          regular: {
            minHeight: '1px',
            fontWeight: 'bold'
          }
        }
      }
    },
    colors: {
      gradients: {
        blue1: '',
        blue2: '',
        blue3: '',
        blue4: '',
        blue5: '',
        orange1: '',
        orange2: '',
        orange3: '',
        purple1: '',
        purple3: '',
        pink1: '',
        pink2: '',
        green1: '',
        green2: '',
        black1: '',
        black2: ''
      },
      shadows: {
        success: '',
        error: '',
        primary: '',
        warning: '',
        info: ''
      },
      alpha: {
        white: {
          5: '',
          10: '',
          30: '',
          50: '',
          70: '',
          100: ''
        },
        trueWhite: {
          5: '',
          10: '',
          30: '',
          50: '',
          70: '',
          100: ''
        },
        black: {
          5: '',
          10: '',
          30: '',
          50: '',
          70: '',
          100: ''
        }
      },
      secondary: {
        lighter: '',
        light: '',
        main: '',
        dark: ''
      },
      primary: {
        lighter: '',
        light: '',
        main: '',
        dark: ''
      },
      success: {
        lighter: '',
        light: '',
        main: '',
        dark: ''
      },
      warning: {
        lighter: '',
        light: '',
        main: '',
        dark: ''
      },
      error: {
        lighter: '',
        light: '',
        main: '',
        dark: ''
      },
      info: {
        lighter: '',
        light: '',
        main: '',
        dark: ''
      }
    },
    general: {
      reactFrameworkColor: undefined,
      borderRadiusSm: '',
      borderRadius: '',
      borderRadiusLg: '',
      borderRadiusXl: ''
    },
    sidebar: {
      background: undefined,
      boxShadow: undefined,
      width: '',
      textColor: undefined,
      dividerBg: undefined,
      menuItemColor: undefined,
      menuItemColorActive: undefined,
      menuItemBg: undefined,
      menuItemBgActive: undefined,
      menuItemIconColor: undefined,
      menuItemIconColorActive: undefined,
      menuItemHeadingColor: undefined
    },
    header: {
      height: '',
      background: undefined,
      boxShadow: undefined,
      textColor: undefined
    }
  });

function Roles() {
  const [axios] = useAxios();
  const confirm = useConfirm();
  const theme = useTheme();
  const [snackopen, setSnackOpen] = useState(false);
  const [severity, setSeverity] = useState('info');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [dopen, setDialogOpen] = useState(false);
  const [roleList, setRoleList] = useState([]);

  useEffect(() => {
    console.log(severity);
    setLoading(true);
    setDialogOpen(true);
    getRoleList();
  }, []);

  async function getRoleList() {
    await axios
      .get(`Admin/GetRoleList`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setRoleList(res.data.Data);
          setLoading(false);
          setDialogOpen(false);
        } else {
          setMessage(res.data.StatusMessage);
          setSnackOpen(true);
          setSeverity('success');
          setLoading(false);
          setDialogOpen(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        setDialogOpen(false);
        console.log(err);
        setSnackOpen(true);
        setMessage('Failed to Fetch the data');
        setSeverity('error');
      });
  }

  const handleDelete = (item) => {
    confirm({
      description: `Once deleted, you will not be able to recover this Role.`
    })
      .then(() => deleteRole(item))
      .catch(() => console.log('Deletion cancelled.'));
  };

  async function deleteRole(RoleId) {
    setLoading(true);
    setDialogOpen(true);
    const postData = [
      {
        Id: RoleId,
        ModifiedBy: localStorage.getItem('UserId'),
        ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
      }
    ];

    axios
      .delete('Admin/DeleteRole', { data: postData })
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setDialogOpen(false);
          setLoading(false);
          setMessage('Role Deleted');
          setSnackOpen(true);
          setSeverity('success');
          window.location.reload();
        } else {
          setLoading(false);
          setDialogOpen(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        console.log(severity);
        setDialogOpen(false);
        setLoading(false);
        setMessage('Failed To Delete Role');
        setSnackOpen(true);
        setSeverity('error');
        window.location.reload();
      });
  }

  const columns = [
    {
      name: 'RoleName',
      label: 'Role name',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value === (null || '') ? 'NA' : value;
        },
        setCellProps: () => ({
          style: { minWidth: '120px', maxWidth: '120px', position: 'sticky' }
        })
      }
    },
    {
      name: 'Description',
      label: 'Role Description ',
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          return value === null || value === ''
            ? 'NA'
            : value.length <= 45
            ? value
            : value.substr(0, 45) + '...';
        },
        setCellProps: () => ({
          style: { minWidth: '250px', maxWidth: '250px' }
        })
      }
    },
    {
      name: 'ActiveUsers',
      label: 'Active Users',
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          return value === null ? 'NA' : value;
        },
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        })
      }
    },
    {
      name: 'InactiveUsers',
      label: 'Inactive Users',
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          return value === null ? 'NA' : value;
        },
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        })
      }
    },
    {
      name: 'CreatedBy',
      label: 'Created By',
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          return value === null ? 'NA' : value;
        },
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        })
      }
    },
    {
      name: 'ModifiedBy',
      label: 'Modified By',
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          return value === null ? 'NA' : value;
        },
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        })
      }
    },
    {
      name: 'Status',
      label: 'Status',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value === null ? 'NA' : value;
        }
      }
    },
    {
      name: 'Action',
      options: {
        filter: false,
        download: false,
        setCellProps: () => ({
          style: {
            minWidth: '60px',
            maxWidth: '60px',
            whiteSpace: 'nowrap',
            position: 'sticky',
            right: 0,
            background: 'white',
            zIndex: 100
          }
        }),
        setCellHeaderProps: () => ({
          style: {
            position: 'sticky',
            right: 0,
            top: 0, //Incase Header is Fixed
            zIndex: 102
          }
        }),
        customBodyRenderLite: (dataIndex) => {
          return (
            <>
              <Tooltip placement="top" title="View" arrow>
                <IconButton
                  onClick={() => {
                    console.log(dataIndex);
                    gotoAddRole(roleList[dataIndex].RoleId);
                  }}
                  sx={{
                    '&:hover': {
                      background: theme.colors.success.lighter
                    },
                    color: theme.palette.success.main
                  }}
                  color="inherit"
                  size="small"
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip placement="top" title="Delete" arrow>
                <IconButton
                  onClick={() => {
                    handleDelete(roleList[dataIndex].RoleId);
                  }}
                  sx={{
                    '&:hover': {
                      background: theme.colors.error.lighter
                    },
                    color: theme.palette.error.main
                  }}
                  color="inherit"
                  size="small"
                >
                  <DeleteTwoToneIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          );
        }
      }
    }
  ];

  const options = {
    responsive: 'scroll',
    onRowsDelete: (rowsDeleted) => {
      confirm({
        description: `Once deleted, you will not be able to recover this Role.`
      })
        .then(() => {
          const idsToDelete = rowsDeleted.data.map(
            (d) => roleList[d.dataIndex].RoleId
          );
          bulkDeleteRole(idsToDelete);
        })
        .catch(() => window.location.reload());
    },
    print: false,
    downloadOptions: { filename: 'role.csv', separator: ',' }
  };

  async function bulkDeleteRole(item) {
    setLoading(true);
    setDialogOpen(true);
    var deleteArray = [];
    for (let i = 0; i < item.length; i++) {
      const postData = {
        Id: item[i],
        ModifiedBy: localStorage.getItem('UserId'),
        ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
      };
      deleteArray.push(postData);
    }
    axios
      .delete('Admin/DeleteRole', { data: deleteArray })
      .then((res) => {
        console.log(res);
        if (res.data.StatusCode == 200) {
          setDialogOpen(false);
          setLoading(false);
          setSnackOpen(true);
          setMessage('Selected Roles Deleted Successfully');
          setSeverity('success');
          window.location.reload();
        } else {
          setLoading(false);
          setDialogOpen(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setDialogOpen(false);
        setMessage('Failed To Delete Roles');
        setSnackOpen(true);
        setSeverity('error');
        setLoading(false);
      });
  }

  const handleSnacKClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    console.log(event);
    setSnackOpen(false);
  };

  const gotoAddRole = (id) => {
    setDialogOpen(true);
    setMessage('loading');
    setLoading(true);
    console.log(id);
    Router.push({
      pathname: 'roles/AddRole',
      query: { props: id > 0 ? id : 0 }
    });
  };

  return (
    <>
      <Head>
        <title>Roles</title>
      </Head>
      <Container maxWidth="xl">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
          style={{ marginTop: '10px' }}
        >
          <Grid item xs={9}>
            <Typography
              variant="h3"
              component="h3"
              gutterBottom
              style={{
                marginTop: 13,
                textTransform: 'uppercase'
              }}
            >
              Roles
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              size="large"
              style={{
                marginLeft: 13,
                float: 'right',
                background: '#9DA338 !important'
              }}
              startIcon={<AddIcon />}
              onClick={gotoAddRole}
            >
              Add Roles
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Snackbar
                open={snackopen}
                autoHideDuration={3000}
                onClose={handleSnacKClose}
              >
                <Alert
                  severity="success"
                  variant="filled"
                  sx={{ width: '100%' }}
                >
                  {message}
                </Alert>
              </Snackbar>
            </Box>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Dialog
                  open={dopen}
                  TransitionComponent={Transition}
                  keepMounted
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogContent>
                    <DNA
                      visible={true}
                      height="80"
                      width="80"
                      ariaLabel="dna-loading"
                      wrapperStyle={{}}
                      wrapperClass="dna-wrapper"
                    />
                  </DialogContent>
                </Dialog>
              </Box>
            ) : (
              <ThemeProvider theme={getMuiTheme()}>
                <MUIDataTable
                  data={roleList}
                  columns={columns}
                  options={options}
                />
              </ThemeProvider>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
Roles.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;
export default Roles;
