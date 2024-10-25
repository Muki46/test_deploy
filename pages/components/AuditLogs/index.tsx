import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import {
  Container,
  Typography,
  Grid,
  InputLabel,
  FormControl,
  Box,
  ThemeProvider,
  Slide,
  createTheme,
  Autocomplete,
  TextField
} from '@mui/material';
import { DateRangePicker, TransitionProps } from 'rsuite';
import 'rsuite/dist/rsuite.css';
import { forwardRef, useEffect, useState } from 'react';
import { DNA } from 'react-loader-spinner';
import MUIDataTable from 'mui-datatables';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useAxios } from 'pages/services';
import moment from 'moment-timezone';
import Footer from '@/components/Footer';

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
            fontFamily: '"Nunito", "Helvetica", "Arial", "sans-serif"'
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

function AuditLogs() {
  const [axios] = useAxios();
  const [dopen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spaceValue, setSpaceValue] = useState(0);
  const [reportId, setReportId] = useState(0);
  const [patientId, setPatientId] = useState(0);
  const [userId, setUserId] = useState(0);
  const [providerId, setProviderId] = useState(0);
  const [clientId, setClientId] = useState(0);
  const [startDate, setStartDate] = useState(
    moment().subtract(1, 'days').tz('America/Los_Angeles').format('MM-DD-YYYY HH:mm')
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).tz('America/Los_Angeles').format('MM-DD-YYYY HH:mm')
  );
  const [defaultAuditValue, setDefaultAuditValue] = useState(0);
  const [patientdata, setpatientData] = useState([]);
  const [userdata, setUserData] = useState([]);
  const [providerdata, setProviderData] = useState([]);
  const [clientdata, setClientData] = useState([]);
  const [reportdata, setReportData] = useState([]);
  const [auditMasterdata, setAuditMasterData] = useState([]);
  const [auditdata, setAuditData] = useState([]);

  const newCategory = {
    audit_category_master_id: 0,
    audit_category_name: 'All'
  };

  const newPatientValue = {
    patient_id: 0,
    patient_name: 'All'
  };

  const newReportValue = {
    report_master_id: 0,
    report_name: 'All'
  };

  const newUserValue = {
    user_id: 0,
    username: 'All'
  };

  const newProviderValue = {
    provider_id: 0,
    provider_name: 'All'
  };
  const newClientValue = {
    client_id: 0,
    client_name: 'All'
  };

  const columns = [
    {
      name: 'AuditDate',
      label: 'Audit Date',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '150px',
            maxWidth: '150px',
            wordWrap: 'break-word'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'UserName',
      label: 'UserName',
      options: {
        filter: true,
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
      name: 'CategoryName',
      label: 'Category',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'Activity',
      label: 'Activity',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'FromText',
      label: 'Content From',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        },
        setCellProps: () => ({
          style: { minWidth: '180px', maxWidth: '180px' }
        })
      }
    },
    {
      name: 'ToText',
      label: 'Content To',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        },
        setCellProps: () => ({
          style: { minWidth: '180px', maxWidth: '180px' }
        })
      }
    },
    {
      name: 'Status',
      label: 'Status',
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    }
  ];

  const options = {
    responsive: 'scroll',
    selectableRows: 'none',
    print: false,
    downloadOptions: { filename: 'audit_logs.csv', separator: ',' }
  };

  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1);

  const handleChanges = (value) => {
    if (value !== null) {
      setStartDate(moment(value[0]).tz('America/Los_Angeles').format('MM-DD-YYYY HH:mm'));
      console.log(moment(value[0]).tz('America/Los_Angeles').format('MM-DD-YYYY hh: mm'));
      setEndDate(moment(value[1]).tz('America/Los_Angeles').format('MM-DD-YYYY HH:mm'));
      console.log(moment(value[1]).tz('America/Los_Angeles').format('MM-DD-YYYY hh: mm'));

      getAuditLogList(
        userId,
        moment(value[0]).tz('America/Los_Angeles').format('MM-DD-YYYY'),
        moment(value[1]).tz('America/Los_Angeles').format('MM-DD-YYYY'),
        defaultAuditValue,
        patientId,
        providerId,
        reportId,
        clientId
      );
    }
  };

  const handleValueChange = (e, value) => {
    console.log(e);
    if (value !== null) {
      console.log(value.audit_category_master_id);
      if (value.audit_category_master_id == 0) {
        setSpaceValue(0);
      } else {
        setSpaceValue(1);
      }
      setDefaultAuditValue(value.audit_category_master_id);

      getAuditLogList(
        0,
        startDate,
        endDate,
        value.audit_category_master_id,
        0,
        0,
        0,
        0
      );
    }
  };

  const handleUserChange = (e, value) => {
    console.log(e);
    if (value !== null) {
      console.log(value.user_id);
      setUserId(value.user_id);
      getAuditLogList(
        value.user_id,
        startDate,
        endDate,
        defaultAuditValue,
        0,
        0,
        0,
        0
      );
    }
  };

  const handlePatientChange = (e, value) => {
    console.log(e);
    if (value !== null) {
      console.log(value.patient_id);
      setPatientId(value.patient_id);
      getAuditLogList(
        0,
        startDate,
        endDate,
        defaultAuditValue,
        value.patient_id,
        0,
        0,
        0
      );
    }
  };

  const handleProviderChange = (e, value) => {
    console.log(e);
    if (value !== null) {
      console.log(value.provider_id);
      setProviderId(value.provider_id);
      getAuditLogList(
        0,
        startDate,
        endDate,
        defaultAuditValue,
        0,
        value.provider_id,
        0,
        0
      );
    }
  };

  const handleReportChange = (e, value) => {
    console.log(e);
    if (value !== null) {
      console.log(value.report_master_id);
      setReportId(value.report_master_id);
      getAuditLogList(
        0,
        startDate,
        endDate,
        defaultAuditValue,
        0,
        0,
        value.report_master_id,
        0
      );
    }
  };

  const handleClientChange = (e, value) => {
    console.log(e);
    if (value !== null) {
      console.log(value.client_id);
      setClientId(value.client_id);
      getAuditLogList(
        0,
        startDate,
        endDate,
        defaultAuditValue,
        0,
        0,
        0,
        value.client_id
      );
    }
  };

  useEffect(() => {
    getAuditOpeningData();
  }, []);

  const yesterdaydate = moment()
    .subtract(1, 'days')
    .tz('America/Los_Angeles')
    .format('MM-DD-YYYY HH:mm');
  async function getAuditOpeningData() {
    try {
      setLoading(true);
      setDialogOpen(true);
      const response = await axios.get('Users/GetAuditOpeningData');
      if (response.data.StatusCode == 200) {
        setAuditMasterData(response.data.Data.AuditMaster);
        setAuditMasterData((prevData) => [...prevData, newCategory]);
        setpatientData(response.data.Data.PatientMaster);
        setpatientData((prevdata) => [...prevdata, newPatientValue]);
        setUserData(response.data.Data.UserMaster);
        setUserData((prevdata) => [...prevdata, newUserValue]);
        setProviderData(response.data.Data.ProviderMaster);
        setProviderData((prevdata) => [...prevdata, newProviderValue]);
        setReportData(response.data.Data.ReportMasterAudit);
        setReportData((prevdata) => [...prevdata, newReportValue]);
        setClientData(response.data.Data.ClientMasterAudit);
        setClientData((prevdata) => [...prevdata, newClientValue]);

        setLoading(false);
        getAuditLogList(
          userId,
          yesterdaydate,
          moment(new Date())
            .tz('America/Los_Angeles')
            .format('MM-DD-YYYY HH:mm'),
          defaultAuditValue,
          patientId,
          providerId,
          reportId,
          clientId
        );
      } else {
        setLoading(false);
        setDialogOpen(false);
      }
    } catch (error) {
      setLoading(false);
      setDialogOpen(false);
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  }

  async function getAuditLogList(
    userId,
    startDate,
    EndDate,
    categoryId,
    patientId,
    providerId,
    reportId,
    clientId
  ) {
    try {
      setLoading(true);
      setDialogOpen(true);
      const response = await axios.get(
        `Users/GetAuditLogList/${userId}/${startDate}/${EndDate}/${categoryId}/${patientId}/${providerId}/${reportId}/${clientId}`
      );
      if (response.data.StatusCode == 200) {
        setAuditData(response.data.Data);
        setLoading(false);
        setDialogOpen(false);
      } else {
        setLoading(false);
        setDialogOpen(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
    }
  }
  return (
    <>
      <Head>
        <title>Audit Logs</title>
      </Head>
      <Container maxWidth="xl">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={3}
          style={{ marginTop: '10px' }}
        >
          {defaultAuditValue == 7?(
            <Grid item xs={7} >
            <Typography variant="h3" gutterBottom>
              Audit Logs
            </Typography>
          </Grid>
          ):(
          <Grid item xs={5}>
            <Typography variant="h3" gutterBottom>
              Audit Logs
            </Typography>
          </Grid>)}
          {spaceValue == 0 ? (
            <>
              <Grid item xs={2}></Grid>
            </>
          ) : (
            ''
          )}
          <Grid item xs={2}>
            <FormControl variant="outlined">
              <InputLabel id="Managment-label"></InputLabel>
              <Autocomplete
                options={auditMasterdata}
                defaultValue={{
                  audit_category_master_id: 0,
                  audit_category_name: 'All'
                }}
                onChange={handleValueChange}
                sx={{ width: 235 }}
                getOptionLabel={(option) => option?.audit_category_name ?? ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    defaultValue="All"
                  />
                )}
              />
            </FormControl>
          </Grid>
          {defaultAuditValue == 1 ? (
            <>
              <Grid item xs={2}>
                <FormControl variant="outlined">
                  <InputLabel></InputLabel>
                  <Autocomplete
                    options={userdata}
                    sx={{ width: 235 }}
                    defaultValue={{
                      user_id: 0,
                      username: 'All'
                    }}
                    onChange={handleUserChange}
                    getOptionLabel={(option) => option?.username}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        defaultValue="All"
                      />
                    )}
                  />{' '}
                </FormControl>
              </Grid>
            </>
          ) : (
            ''
          )}
          {defaultAuditValue == 2 ? (
            <>
              <Grid item xs={2}>
                <FormControl variant="outlined">
                  <InputLabel></InputLabel>
                  <Autocomplete
                    // value={defaultValue}
                    options={patientdata}
                    sx={{ width: 235 }}
                    defaultValue={{
                      patient_id: 0,
                      patient_name: 'All'
                    }}
                    onChange={handlePatientChange}
                    getOptionLabel={(option) => option?.patient_name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        defaultValue="All"
                      />
                    )}
                  />{' '}
                </FormControl>
              </Grid>
            </>
          ) : (
            ''
          )}
          {defaultAuditValue == 3 ? (
            <>
              <Grid item xs={2}>
                <FormControl variant="outlined">
                  <InputLabel></InputLabel>
                  <Autocomplete
                    // value={defaultValue}
                    options={userdata}
                    sx={{ width: 235 }}
                    defaultValue={{
                      user_id: 0,
                      username: 'All'
                    }}
                    onChange={handleUserChange}
                    getOptionLabel={(option) => option?.username}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        defaultValue="All"
                      />
                    )}
                  />{' '}
                </FormControl>
              </Grid>
            </>
          ) : (
            ''
          )}
          {defaultAuditValue == 4 ? (
            <>
              <Grid item xs={2}>
                <FormControl variant="outlined">
                  <InputLabel></InputLabel>
                  <Autocomplete
                    // value={defaultValue}
                    options={reportdata}
                    sx={{ width: 235 }}
                    defaultValue={{
                      report_master_id: 0,
                      report_name: 'All'
                    }}
                    onChange={handleReportChange}
                    getOptionLabel={(option) => option?.report_name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        defaultValue="All"
                      />
                    )}
                  />{' '}
                </FormControl>
              </Grid>
            </>
          ) : (
            ''
          )}
          {defaultAuditValue == 5 ? (
            <>
              <Grid item xs={2}>
                <FormControl variant="outlined">
                  <InputLabel></InputLabel>
                  <Autocomplete
                    // value={defaultValue}
                    options={providerdata}
                    sx={{ width: 235 }}
                    defaultValue={{
                      provider_id: 0,
                      provider_name: 'All'
                    }}
                    onChange={handleProviderChange}
                    getOptionLabel={(option) => option?.provider_name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        defaultValue="All"
                      />
                    )}
                  />{' '}
                </FormControl>
              </Grid>
            </>
          ) : (
            ''
          )}
          {defaultAuditValue == 6 ? (
            <>
              <Grid item xs={2}>
                <FormControl variant="outlined">
                  <InputLabel></InputLabel>
                  <Autocomplete
                    // value={defaultValue}
                    options={clientdata}
                    sx={{ width: 235 }}
                    defaultValue={{
                      client_id: 0,
                      client_name: 'All'
                    }}
                    onChange={handleClientChange}
                    getOptionLabel={(option) => option?.client_name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        defaultValue="All"
                      />
                    )}
                  />{' '}
                </FormControl>
              </Grid>
            </>
          ) : (
            ''
          )}
          <Grid item xs={3}>
            <DateRangePicker
              showOneCalendar
              size="lg"
              format="dd/MM/yyyy"
              character=" - "
              placeholder="Select Date Range"
              ranges={[]}
              onChange={handleChanges}
              defaultValue={[currentDate, new Date()]}
            />
          </Grid>
          <Grid item xs={12}>
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
                  data={auditdata}
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
AuditLogs.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;
export default AuditLogs;
