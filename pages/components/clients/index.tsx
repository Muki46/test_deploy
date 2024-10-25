import { useState, useEffect, forwardRef } from 'react';
import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import {
  Button,
  Container,
  Typography,
  useTheme,
  Tooltip,
  IconButton,
  Grid
} from '@mui/material';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Footer from '@/components/Footer';
import MUIDataTable from 'mui-datatables';
import AddIcon from '@mui/icons-material/Add';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddClient from './AddClient';
import { useAxios } from 'pages/services';
import { DNA } from 'react-loader-spinner';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import moment from 'moment';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import { useConfirm } from 'material-ui-confirm';

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

function Clients() {
  const confirm = useConfirm();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [axios] = useAxios();
  const [clientData, setClientData] = useState([]);
  const [snackopen, setSnackOpen] = useState(false);
  const [severity, setSeverity] = useState('info');
  const [message, setMessage] = useState('');
  const [dopen, setDialogOpen] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [rowSelectable, setRowSelectable] = useState('multiple');
  const [leftDataSpace, setLeftDataSpace] = useState('3.7%');
  const [leftHeaderSpace, setLeftHeaderSpace] = useState('4.2%');


  useEffect(() => {
    setLoading(true);
    setDialogOpen(true);
    getClientData();
  }, []);

  async function getClientData() {
    const clientid = localStorage.getItem('ClientId');
    const rName = localStorage.getItem('RoleName');
    await axios
      .get(`Clients/GetClientList/${clientid}`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          if (rName == 'Client User') {
            setRoleName(rName);
            setRowSelectable('none');
            setLeftHeaderSpace('0%');
            setLeftDataSpace('0%');
          }
          console.log(res.data.Data);
          setLoading(false);
          setClientData(res.data.Data);
          setDialogOpen(false);
          setSeverity('success');
        } else {
          setMessage(res.data.StatusMessage);
          setLoading(false);
          setDialogOpen(false);
          setSnackOpen(true);
          setSeverity('error');
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setMessage('Failed to Get client List');
        setDialogOpen(false);
        setSnackOpen(true);
        setSeverity('error');
      });
  }

  const handleDelete = (item) => {
    confirm({
      description: `Once deleted, you will not be able to recover this client.`
    })
      .then(() => deleteClient(item))
      .catch(() => console.log('Deletion cancelled.'));
  };

  async function deleteClient(clientId) {
    setLoading(true);
    setDialogOpen(true);
    const postData = [
      {
        Id: clientId,
        ModifiedBy: localStorage.getItem('UserId'),
        ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
      }
    ];

    axios
      .delete('Clients/DeleteClient', { data: postData })
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setMessage('Client Deleted');
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
        setMessage('Failed To Delete Client');
        setSnackOpen(true);
        setSeverity('error');
        window.location.reload();
      });
  }

  const columns = [
    {
      name: 'ClientName',
      label: 'Client Name',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '150px',
            maxWidth: '150px',
            whiteSpace: 'nowrap',
            position: 'sticky',
            left: leftDataSpace,
            background: 'white',
            zIndex: 100
          }
        }),
        setCellHeaderProps: () => ({
          style: {
            position: 'sticky',
            left: leftHeaderSpace,
            top: 0, //Incase Header is Fixed
            zIndex: 102
          }
        })
      }
    },
    {
      name: 'Address',
      label: 'Address',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        },
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        })
      }
    },
    {
      name: 'City',
      label: 'City',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        },
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        })
      }
    },
    {
      name: 'State',
      label: 'State',
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        },
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        })
      }
    },
    {
      name: 'Zip',
      label: 'Zip',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        },
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        })
      }
    },
    {
      name: 'Phone',
      label: 'Phone',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        },
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        })
      }
    },
    {
      name: 'Fax',
      label: 'Fax',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        },
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        })
      }
    },
    {
      name: 'ContactPersonName',
      label: 'Contact Person Name',
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        },
        setCellProps: () => ({
          style: { minWidth: '200px', maxWidth: '200px' }
        })
      }
    },
    {
      name: 'TimeZone',
      label: 'TimeZone',
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        },
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        })
      }
    },
    {
      name: 'Action',
      options: {
        filter: false,
        download: false,

        setCellProps: () => ({
          style: {
            minWidth: '80px',
            maxWidth: '80px',
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
                    setId(clientData[dataIndex].ClientId);
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
              {roleName == 'Client User' ? (
                ''
              ) : (
                <Tooltip placement="top" title="Delete" arrow>
                  <IconButton
                    onClick={() => {
                      handleDelete(clientData[dataIndex].ClientId);
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
            </>
          );
        }
      }
    }
  ];

  const options = {
    responsive: 'scroll',
    selectableRows: rowSelectable,
    onRowsDelete: (rowsDeleted) => {
      confirm({
        description: `Once deleted, you will not be able to recover this Clients.`
      })
        .then(() => {
          const idsToDelete = rowsDeleted.data.map(
            (d) => clientData[d.dataIndex].ClientId
          );
          bulkDeleteClients(idsToDelete);
        })
        .catch(() => window.location.reload());
    },
    print: false,
    downloadOptions: { filename: 'clients.csv', separator: ',' }
  };

  async function bulkDeleteClients(item) {
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
      .delete('Clients/DeleteClient', { data: deleteArray })
      .then((res) => {
        console.log(res);
        if (res.data.StatusCode == 200) {
          setDialogOpen(false);
          setMessage('Selected Clients Deleted Successfully');
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
        setDialogOpen(false);
        setMessage('Failed To Delete Clients');
        setSnackOpen(true);
        setSeverity('error');
        setLoading(false);
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
        <title>clients</title>
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
              clients
            </Typography>
          </Grid>
          <Grid item xs={2}>
            {roleName == 'Client User' ? (
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
                Add Client
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
                  Add Client
                </h3>
                <IconButton
                  onClick={() => {
                    getClientData();
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
                  <AddClient props={id} />
                </div>
              </Box>
            </Modal>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Snackbar
                open={snackopen}
                autoHideDuration={6000}
                onClose={handleClose}
              >
                <Alert severity="success" sx={{ width: '100%' }}>
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
                  data={clientData}
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

Clients.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Clients;
