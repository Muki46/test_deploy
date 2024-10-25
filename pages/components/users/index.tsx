import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import { DNA } from 'react-loader-spinner';
import {
  Button,
  Container,
  Typography,
  IconButton,
  useTheme,
  Tooltip,
  Grid,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Footer from '@/components/Footer';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import MUIDataTable from 'mui-datatables';
import AddIcon from '@mui/icons-material/Add';
import AddUser from './AddUser';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import React, { useEffect, useState, forwardRef } from 'react';
import { useAxios } from 'pages/services';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import moment from 'moment';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { useConfirm } from 'material-ui-confirm';
import LockResetIcon from '@mui/icons-material/LockReset';

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
            padding: '2px',
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
function Users() {
  const confirm = useConfirm();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [axios] = useAxios();
  const [snackopen, setSnackOpen] = useState(false);
  const [dopen, setDialogOpen] = useState(false);
  const [severity, setSeverity] = useState('info');
  const [message, setMessage] = useState('');
  const [roleName, setRoleName] = useState('');
  const [permission, setPermission] = useState([]);

  const goBack = () => {
    setSnackOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    setRoleName(localStorage.getItem('RoleName'));
    let retString = localStorage.getItem('Permission');
    let retArray = JSON.parse(retString);
    setPermission(retArray);
    console.log(severity);
    setDialogOpen(true);
    getUsersList();
  }, []);

  async function getUsersList() {
    const clientId = localStorage.getItem('ClientId');
    const providerId = localStorage.getItem('ProviderId');
    const patientId = localStorage.getItem('PatientId');
    const userId = localStorage.getItem('UserId');
    await axios
      .get(
        `Users/GetUsersList/${userId}/${clientId}/${providerId}/${patientId}`
      )
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setLoading(false);
          console.log(res.data.Data);
          setUserData(res.data.Data);
        } else {
          setLoading(false);
          setMessage(res.data.StatusMessage);
          setSnackOpen(true);
          setSeverity('success');
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        setSnackOpen(true);
        setMessage('Failed to Fetch the data');
        setSeverity('error');
      });
  }

  const handleDelete = (item) => {
    confirm({
      description: `Once deleted, you will not be able to recover this user.`
    })
      .then(() => deleteUser(item))
      .catch(() => console.log('Deletion cancelled.'));
  };

  async function deleteUser(userId) {
    setLoading(true);
    setDialogOpen(true);
    const postData = [
      {
        Id: userId,
        ModifiedBy: localStorage.getItem('UserId'),
        ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
      }
    ];

    axios
      .delete('Users/DeleteUser', { data: postData })
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setDialogOpen(false);
          setMessage('User Deleted');
          setSnackOpen(true);
          setSeverity('success');
          window.location.reload();
        } else {
          setDialogOpen(false);
          setMessage(res.data.StatusMessage);
          setSnackOpen(true);
          setSeverity('error');
        }
      })
      .catch((err) => {
        console.log(err);
        setDialogOpen(false);
        setMessage('Failed To Delete User');
        setSnackOpen(true);
        setSeverity('error');
        window.location.reload();
      });
  }

  async function resetPassword(userId) {
    setLoading(true);
    setDialogOpen(true);
    axios
      .put('GeneratePassword/RestPassword?userId=' + userId)
      .then((res) => {
        console.log(res);
        if (res.data.StatusCode == 200) {
          setMessage(res.data.Data);
          setSnackOpen(true);
          setDialogOpen(false);
          setLoading(false);
          setSeverity('success');
          setTimeout(goBack, 12000);
        } else {
          setDialogOpen(false);
          setLoading(false);
          setMessage('Password Reset Failure');
          setSnackOpen(true);
          setSeverity('error');
        }
      })
      .catch((err) => {
        console.log(err);
        setDialogOpen(false);
        setLoading(false);
        setMessage('Failed To Delete User');
        setSnackOpen(true);
        setSeverity('error');
        window.location.reload();
      });
  }

  const theme = useTheme();
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4
  };

  const columns = [
    {
      name: 'puser_name',
      label: 'UserName',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '150px',
            maxWidth: '150px',
            whiteSpace: 'nowrap',
            position: 'sticky',
            left: '3.6%',
            background: 'white',
            zIndex: 100
          }
        }),
        setCellHeaderProps: () => ({
          style: {
            position: 'sticky',
            left: '3.6%',
            background: 'white',
            top: 0, //Incase Header is Fixed
            zIndex: 102
          }
        })
      }
    },
    {
      name: 'pfirst_name',
      label: 'First Name',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        })
      }
    },
    {
      name: 'plast_name',
      label: 'Last Name',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        })
      }
    },
    {
      name: 'pemail',
      label: 'Email',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '250px',
            maxWidth: '250px',
            wordWrap: 'break-word'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'pclient_name',
      label: 'Client Name',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'prole_name',
      label: 'Role Name',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },

    {
      name: 'pphone',
      label: 'Phone',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'paddress',
      label: 'Address',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '200px',
            maxWidth: '200px',
            wordWrap: 'break-word'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'pcity',
      label: 'City',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'pstate',
      label: 'State',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: { minWidth: '100px', maxWidth: '100px' }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'pzip',
      label: 'Zip',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: { minWidth: '100px', maxWidth: '100px' }
        }),
        customBodyRender: (value) => {
          return value === (null || '') ? 'NA' : value;
        }
      }
    },
    {
      name: 'pstart_ip',
      label: 'Start IP',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: { minWidth: '120px', maxWidth: '120px' }
        }),
        customBodyRender: (value) => {
          return value === (null || '') ? 'NA' : value;
        }
      }
    },
    {
      name: 'pend_ip',
      label: 'End IP',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: { minWidth: '120px', maxWidth: '120px' }
        }),
        customBodyRender: (value) => {
          return value === (null || '') ? 'NA' : value;
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
            minWidth: '100px',
            maxWidth: '100px',
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
                    setId(userData[dataIndex].puser_id);
                    setOpen(true);
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
              {roleName == 'Patients' ? (
                ''
              ) : (
                <Tooltip placement="top" title="Delete" arrow>
                  <IconButton
                    onClick={() => {
                      handleDelete(userData[dataIndex].puser_id);
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
              )}
              {permission.some(
                (item) => item.permission_name === 'Reset Password'
              ) ? (
                <Tooltip placement="top" title="Password Reset" arrow>
                  <IconButton
                    onClick={() => {
                      resetPassword(userData[dataIndex].puser_id);
                    }}
                    sx={{
                      '&:hover': {
                        background: theme.colors.success.lighter
                      },
                      color: theme.palette.secondary.dark
                    }}
                    color="inherit"
                    size="small"
                  >
                    <LockResetIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ) : (
                ''
              )}
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
        description: `Once deleted, you will not be able to recover this users.`
      })
        .then(() => {
          const idsToDelete = rowsDeleted.data.map(
            (d) => userData[d.dataIndex].puser_id
          );
          bulkDeleteUser(idsToDelete);
        })
        .catch(() => window.location.reload());
    },
    print: false,
    downloadOptions: { filename: 'users.csv', separator: ',' }
  };

  async function bulkDeleteUser(item) {
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
      .delete('Users/DeleteUser', { data: deleteArray })
      .then((res) => {
        console.log(res);
        if (res.data.StatusCode == 200) {
          setDialogOpen(false);
          setMessage('Selected Users Deleted Successfully');
          setSnackOpen(true);
          setSeverity('success');
          window.location.reload();
        } else {
          setDialogOpen(false);
          setMessage(res.data.StatusMessage);
          setSnackOpen(true);
          setSeverity('success');
        }
      })
      .catch((err) => {
        console.log(err);
        setDialogOpen(false);
        setMessage('Failed To Delete User');
        setSnackOpen(true);
        setSeverity('error');
        window.location.reload();
      });
  }

  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);
  const handleOpen = () => {
    setId(0);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    console.log(event);
    if (reason && reason == 'backdropClick' && 'escapeKeyDown') return;
    myCloseModal();
  };

  function myCloseModal() {
    setOpen(false);
  }

  return (
    <>
      <Head>
        <title>Users</title>
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
          <Grid item xs={10}>
            <Typography
              variant="h3"
              component="h3"
              gutterBottom
              style={{
                marginTop: 13,
                textTransform: 'uppercase'
              }}
            >
              Users
            </Typography>
          </Grid>
          <Grid item xs={2}>
            {roleName == 'Patients' ? (
              ''
            ) : (
              <Button
                variant="contained"
                size="large"
                style={{
                  marginLeft: 13,
                  float: 'right',
                  background: '#9DA338 !important'
                }}
                startIcon={<AddIcon />}
                onClick={handleOpen}
              >
                Add User
              </Button>
            )}
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <h3
                  id="unstyled-modal-title"
                  className="modal-title"
                  style={{
                    position: 'absolute',
                    left: 20,
                    top: 10,
                    color: '#223354'
                  }}
                >
                  Add User
                </h3>
                <IconButton
                  onClick={() => {
                    setOpen(false);
                  }}
                  sx={{
                    position: 'absolute',
                    right: 2,
                    top: 1,
                    color: 'black',
                    fontSize: 34
                  }}
                  color="inherit"
                  size="large"
                >
                  <CloseIcon color="error" />
                </IconButton>
                <div style={{ marginTop: '30px' }}>
                  <AddUser props={id} />
                </div>
              </Box>
            </Modal>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={snackopen}
                autoHideDuration={6000}
                onClose={handleClose}
              >
                <Alert
                  sx={{
                    background: '#000 !important',
                    color: '#fff !important'
                  }}
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
                  data={userData}
                  columns={columns}
                  options={options}
                />
              </ThemeProvider>
            )}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

Users.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Users;
