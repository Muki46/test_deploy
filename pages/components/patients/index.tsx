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
import AddPatient from './AddPatient';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import React, { useEffect, useState, forwardRef } from 'react';
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
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useConfirm } from 'material-ui-confirm';
import { StyledEngineProvider } from '@mui/material/styles';
import ReportView from 'pages/components/reportView';
import Drawer from '@mui/material/Drawer';

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

function Patients() {
  const confirm = useConfirm();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [axios] = useAxios();
  const [patientData, setPatientData] = useState([]);
  const [snackopen, setSnackOpen] = useState(false);
  const [severity, setSeverity] = useState('info');
  const [message, setMessage] = useState('');
  const [dopen, setDialogOpen] = useState(false);
  const [rropen, setRrOpen] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [leftHeaderSpace, setLeftHeaderSpace] = useState('4.2%');
  const [leftDataSpace, setLeftDataSpace] = useState('3.7%');
  const [roleName, setRoleName] = useState('');
  const [rowSelectable, setRowSelectable] = useState('multiple');
  const [actionDisplay, setActionDisplay] = useState(true);

  useEffect(() => {
    setLoading(true);
    setDialogOpen(true);
    getPatientList();
  }, []);

  const toggleRDrawer = (newOpen: boolean, value: string) => () => {
    setPatientId(value);
    setRrOpen(newOpen);
  };

  async function getPatientList() {
    const rName = localStorage.getItem('RoleName');
    const clientId = localStorage.getItem('ClientId');
    const providerId = localStorage.getItem('ProviderId');
    const patientId = localStorage.getItem('PatientId');
    await axios
      .get(`Patients/GetPatientsList/${clientId}/${providerId}/${patientId}`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          console.log(res.data.Data);
          if (rName == 'Patients') {
            setRoleName(rName);
            setActionDisplay(false);
            setRowSelectable('none');
            setLeftHeaderSpace('0%');
            setLeftDataSpace('0%');
          }
          setLoading(false);
          setPatientData(res.data.Data);
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
        setMessage('Failed to Get Patient List');
        setDialogOpen(false);
        setSnackOpen(true);
        setSeverity('error');
      });
  }

  const handleDelete = (item) => {
    confirm({
      description: `Once deleted, you will not be able to recover this patient.`
    })
      .then(() => deletePatient(item))
      .catch(() => console.log('Deletion cancelled.'));
  };

  async function deletePatient(patientId) {
    setLoading(true);
    setDialogOpen(true);
    const postData = [
      {
        Id: patientId,
        ModifiedBy: localStorage.getItem('UserId'),
        ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
      }
    ];

    axios
      .delete('Patients/DeletePatient', { data: postData })
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setDialogOpen(false);
          setMessage('Patient Deleted');
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
        setMessage('Failed To Delete Patient');
        setSnackOpen(true);
        setSeverity('error');
        window.location.reload();
      });
  }

  const columns = [
    {
      name: 'pfirst_name',
      label: 'First Name',
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
      name: 'psample_id',
      label: 'Sample ID',
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
      name: 'pgender',
      label: 'Gender',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: { minWidth: '100px', maxWidth: '100px' }
        })
      }
    },
    {
      name: 'pdate_of_birth',
      label: 'DOB',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        }),
        customBodyRender: (value) => {
          return moment(value).format('MM/DD/YYYY');
        }
      }
    },
    {
      name: 'pprovider_name',
      label: 'Provider Name',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        })
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
      name: 'pspecimen_type',
      label: 'Specimen Type',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        })
      }
    },
    {
      name: 'pcollection_method',
      label: 'Collection Method',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: { minWidth: '180px', maxWidth: '180px' }
        })
      }
    },
    {
      name: 'pcollection_date',
      label: 'Collection Date',
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          return moment(value).format('MM/DD/YYYY');
        },
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        })
      }
    },
    {
      name: 'pimport_gene_date',
      label: 'Imported Date',
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          return value === null ? 'NA' : moment(value).format('MM/DD/YYYY');
        },
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        })
      }
    },
    {
      name: 'ppatient_id',
      label: 'Report',
      options: {
        filter: false,
        download: false,
        setCellProps: () => ({
          style: { minWidth: '100px', maxWidth: '100px' }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? (
            'NA'
          ) : (
            <Tooltip placement="top" title="Report" arrow>
              <IconButton
                sx={{ padding: '0px !important' }}
                onClick={toggleRDrawer(true, value)}
              >
                <PictureAsPdfIcon color="error" fontSize="small" />
              </IconButton>
            </Tooltip>
          );
        }
      }
    },
    roleName == 'Patients'
      ? {
          name: 'Report URL',
          options: {
            display: false,
            viewColumns: false
          }
        }
      : {
          name: 'preport_file_urls',
          label: 'Report URL',
          options: {
            filter: false,
            sort: true,
            display: false,
            setCellProps: () => ({
              style: { minWidth: '150px', maxWidth: '150px' }
            })
          }
        },
    roleName == 'Patients'
      ? {
          name: 'Action',
          options: {
            display: false,
            viewColumns: false
          }
        }
      : {
          name: 'Action',
          options: {
            filter: false,
            download: false,
            display: actionDisplay,
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
                        setId(patientData[dataIndex].ppatient_id);
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
                        handleDelete(patientData[dataIndex].ppatient_id);
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
    selectableRows: rowSelectable,
    onRowsDelete: (rowsDeleted) => {
      confirm({
        description: `Once deleted, you will not be able to recover this patients.`
      })
        .then(() => {
          const idsToDelete = rowsDeleted.data.map(
            (d) => patientData[d.dataIndex].ppatient_id
          );
          bulkDeletePatient(idsToDelete);
        })
        .catch(() => window.location.reload());
    },
    print: false,
    downloadOptions: { filename: 'patients.csv', separator: ',' }
  };

  async function bulkDeletePatient(item) {
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
      .delete('Patients/DeletePatient', { data: deleteArray })
      .then((res) => {
        console.log(res);
        if (res.data.StatusCode == 200) {
          setDialogOpen(false);
          setMessage('Selected Patients Deleted Successfully');
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
        setMessage('Failed To Delete Patients');
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
        <title>Patients</title>
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
              Patients
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
                Add Patient
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
                  Add Patient
                </h3>
                <IconButton
                  onClick={() => {
                    getPatientList();
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
                  <AddPatient props={id} />
                </div>
              </Box>
            </Modal>
            <Drawer
              style={{ zIndex: '1399' }}
              open={rropen}
              anchor="bottom"
              onClose={toggleRDrawer(false, '')}
            >
              <StyledEngineProvider injectFirst>
                <ReportView patientId={patientId} />
              </StyledEngineProvider>
            </Drawer>
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
                  data={patientData}
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

Patients.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Patients;
