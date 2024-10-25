import React, { useEffect, useState, forwardRef } from 'react';
import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import {
  Button,
  Container,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  Grid
} from '@mui/material';
import Footer from '@/components/Footer';
import MUIDataTable from 'mui-datatables';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useAxios } from 'pages/services';
import { DNA } from 'react-loader-spinner';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import AddDomain from './AddDomain';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Alert from '@mui/material/Alert';
import { useConfirm } from 'material-ui-confirm';

import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import moment from 'moment';

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

function Domain() {
  const confirm = useConfirm();
  const [loading, setLoading] = useState(false);
  const [dopen, setDialogOpen] = useState(false);
  const [axios] = useAxios();
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

  const [snackopen, setSnackOpen] = useState(false);
  const [severity, setSeverity] = useState('info');
  const [message, setMessage] = useState('');
  const [domainData, setDomainData] = useState([]);

  useEffect(() => {
    console.log(severity);
    setLoading(true);
    setDialogOpen(true);
    getDomainList();
  }, []);

  async function getDomainList() {
    await axios
      .get(`Users/GetDomainList`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setDomainData(res.data.Data);
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
      description: `Once deleted, you will not be able to recover this Domain.`
    })
      .then(() => deleteDomain(item))
      .catch(() => console.log('Deletion cancelled.'));
  };

  async function deleteDomain(domainId) {
    setLoading(true);
    setDialogOpen(true);
    const postData = [
      {
        Id: domainId,
        ModifiedBy: localStorage.getItem('UserId'),
        ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
      }
    ];

    axios
      .delete('Users/DeleteDomain', { data: postData })
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setDialogOpen(false);
          setMessage('Domain Deleted Successfully');
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
        setMessage('Failed To Delete Domain');
        setSnackOpen(true);
        setSeverity('error');
        window.location.reload();
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

  const columns = [
    {
      name: 'DomainName',
      label: 'Domain Name',
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
      name: 'UserName',
      label: 'Created By ',
      options: {
        filter: false,
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
      name: 'CreatedDate',
      label: 'Created Date',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '130px',
            maxWidth: '130px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === ''
            ? 'NA'
            : moment(value).format('MM/DD/YYYY');
        }
      }
    },
    {
      name: 'Status',
      label: 'Status',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '130px',
            maxWidth: '130px'
          }
        }),
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
                    setId(domainData[dataIndex].DomainMasterId);
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
              <Tooltip placement="top" title="Delete" arrow>
                <IconButton
                  onClick={() => {
                    handleDelete(domainData[dataIndex].DomainMasterId);
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
        description: `Once deleted, you will not be able to recover this Domain.`
      })
        .then(() => {
          const idsToDelete = rowsDeleted.data.map(
            (d) => domainData[d.dataIndex].DomainMasterId
          );
          bulkDeleteDomain(idsToDelete);
        })
        .catch(() => window.location.reload());
    },
    print: false,
    downloadOptions: { filename: 'domain.csv', separator: ',' }
  };

  async function bulkDeleteDomain(item) {
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
      .delete('Users/DeleteDomain', { data: deleteArray })
      .then((res) => {
        console.log(res);
        if (res.data.StatusCode == 200) {
          setDialogOpen(false);
          setLoading(false);
          setSnackOpen(true);
          setMessage('Selected Domain Deleted Successfully');
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
        setMessage('Failed To Delete Domain');
        setSnackOpen(true);
        setSeverity('error');
        setLoading(false);
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
        <title>Domain</title>
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
              Domain
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
              onClick={handleOpen}
            >
              Add Domain
            </Button>
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
                  Add Domain
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
                  <AddDomain props={id} />
                </div>
              </Box>
            </Modal>
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
                  data={domainData}
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

Domain.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Domain;
