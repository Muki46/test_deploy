import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import {
  Container,
  Typography,
  IconButton,
  Tooltip,
  Grid
} from '@mui/material';
import Box from '@mui/material/Box';
import Footer from '@/components/Footer';
import MUIDataTable from 'mui-datatables';
import React, { useEffect, useState, forwardRef } from 'react';
import { useAxios } from 'pages/services';
import { DNA } from 'react-loader-spinner';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import moment from 'moment';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import ArticleIcon from '@mui/icons-material/Article';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Interpretation from 'pages/components/interpretations';
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
            padding: '10px 13px',
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

const gotoFile = (val) => {
  window.open(val, '_blank');
};

function ReportHistory() {
  const [loading, setLoading] = useState(false);
  const [axios] = useAxios();
  const [patientData, setPatientData] = useState([]);
  const [dopen, setDialogOpen] = useState(false);
  const [dropen, setDrOpen] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [rropen, setRrOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setDialogOpen(true);
    fetchData();
  }, []);

  const toggleDrawer = (newOpen: boolean, value: string) => () => {
    setPatientId(value);
    setDrOpen(newOpen);
  };

  const toggleRDrawer = (newOpen: boolean, value: string) => () => {
    setPatientId(value);
    setRrOpen(newOpen);
  };

  async function fetchData() {
    const clientid = localStorage.getItem('ClientId');
    await axios
      .get(`Patients/GetPatientReportHistoryList/${clientid}`)
      .then((res) => {
        console.log(res);
        if (res.data.StatusCode == 200) {
          setLoading(false);
          setPatientData(res.data.Data);
        } else {
          setLoading(false);
          setDialogOpen(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }

  const columns = [
    {
      name: 'FirstName',
      label: 'First Name',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'LastName',
      label: 'Last Name',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'SampleId',
      label: 'Sample ID',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'Gender',
      label: 'Gender',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'DateOfBirth',
      label: 'Date Of Birth',
      options: {
        filter: false,
        sort: true,
        download: true,
        customBodyRender: (value) => {
          return moment(value).format('MM/DD/YYYY');
        }
      }
    },
    {
      name: 'ProviderName',
      label: 'Provider Name',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'ClientName',
      label: 'Client Name',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'PatientGeneFile',
      label: 'DNA File',
      options: {
        filter: false,
        customBodyRender: (value) => {
          return value === null || value === '' ? (
            'NA'
          ) : (
            <Tooltip placement="top" title="DNA File" arrow>
              <IconButton
                sx={{ padding: '0px !important' }}
                onClick={() => {
                  gotoFile(value);
                }}
              >
                <ArticleIcon color="secondary" fontSize="small" />
              </IconButton>
            </Tooltip>
          );
        }
      }
    },
    {
      name: 'ImportGeneDate',
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
      name: 'PatientId',
      label: 'Interpretation',
      options: {
        filter: false,
        download: false,
        customBodyRender: (value) => {
          return value === null || value === '' ? (
            'NA'
          ) : (
            <Tooltip placement="top" title="Interpretation" arrow>
              <IconButton
                sx={{ padding: '0px !important' }}
                onClick={toggleDrawer(true, value)}
              >
                <VisibilityIcon color="success" fontSize="small" />
              </IconButton>
            </Tooltip>
          );
        }
      }
    },
    {
      name: 'PatientId',
      label: 'Report',
      options: {
        filter: false,
        download: false,
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
    {
      name: 'ReportFileUrls',
      label: 'Report URL',
      options: {
        filter: false,
        sort: true,
        display: false,
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        })
      }
    }
  ];

  const options = {
    responsive: 'scroll',
    selectableRows: 'none',
    print: false,
    downloadOptions: { filename: 'report_history.csv', separator: ',' }
  };

  return (
    <>
      <Head>
        <title>Report History</title>
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
          <Grid item xs={12}>
            <Typography
              variant="h3"
              component="h3"
              gutterBottom
              style={{
                marginTop: 13,
                textTransform: 'uppercase'
              }}
            >
              Report History
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Drawer
              style={{ zIndex: '1399' }}
              open={dropen}
              anchor="right"
              onClose={toggleDrawer(false, '')}
            >
              <StyledEngineProvider injectFirst>
                <Interpretation patientId={patientId} />
              </StyledEngineProvider>
            </Drawer>
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

ReportHistory.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default ReportHistory;
