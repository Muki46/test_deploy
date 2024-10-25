import Head from 'next/head';
import React, { useEffect, useState, forwardRef } from 'react';
import SidebarLayout from '@/layouts/SidebarLayout';
import MUIDataTable from 'mui-datatables';
import {
  Container,
  Typography,
  useTheme,
  Tooltip,
  IconButton,
  Grid
} from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import BlockIcon from '@mui/icons-material/Block';
import { useAxios } from 'pages/services';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.css';
import moment from 'moment-timezone';
import { DNA } from 'react-loader-spinner';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
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

function SignInLogs() {
  interface User {
    UserName: string;
    Email: string;
    Phone: string;
    Address: string;
    City: string;
    State: string;
    Zip: string;
  }
  const confirm = useConfirm();
  const [axios] = useAxios();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [SignInLog, setSignInLogData] = useState<User>();
  const [dopen, setDialogOpen] = useState(false);
  const [userId, setUserId] = useState(0);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('info');
  const [message, setMessage] = useState('');

  const handleBlock = (item) => {
    confirm({
      description: `Once blocked, user will not be able to login to application.`
    })
      .then(() => blockUser(item))
      .catch(() => console.log('block cancelled.'));
  };

  const handleClose = (event, reason) => {
    console.log(event);
    if (reason && reason == 'backdropClick' && 'escapeKeyDown') return;
    myCloseModal();
  };

  function myCloseModal() {
    setOpen(false);
  }

  const yesterdaydate = moment()
    .subtract(1, 'days')
    .tz('America/Los_Angeles')
    .format('MM-DD-YYYY HH:mm');

  async function blockUser(userId) {
    setLoading(true);
    setDialogOpen(true);
    const postData = {
      UserId: userId,
      Status: 0,
      ModifiedBy: localStorage.getItem('UserId'),
      ModifiedDate: moment(new Date())
        .tz('America/Los_Angeles')
        .format('MM-DD-YYYY HH:mm')
    };

    axios
      .put('Users/UpdateUserSignInLog', postData)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setDialogOpen(false);
          setMessage('User has been blocked successfully');
          setOpen(true);
          setSeverity('success');
          getSigninLogsDetails(
            userId,
            yesterdaydate,
            moment(new Date())
              .tz('America/Los_Angeles')
              .format('MM-DD-YYYY HH:mm')
          );
        } else {
          setDialogOpen(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setOpen(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        console.log(severity);
        setMessage('Failed To Delete Patient');
        setOpen(true);
        setSeverity('error');
        window.location.reload();
      });
  }

  const columns = [
    {
      name: 'SignInDate',
      label: 'Sign-in-Date',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value === (null || '') ? 'NA' : value;
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
          return value === (null || '') ? 'NA' : value;
        }
      }
    },
    {
      name: 'Email',
      label: 'Email-ID',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value === (null || '') ? 'NA' : value;
        }
      }
    },
    {
      name: 'IpAddress',
      label: 'IP address',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value === (null || '') ? 'NA' : value;
        }
      }
    },
    {
      name: 'Location',
      label: 'Location',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value === (null || '') ? 'NA' : value;
        }
      }
    },
    {
      name: 'Action',
      label: 'Status',
      options: {
        filter: false,
        sort: true,
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
              <Tooltip placement="top" title="Block" arrow>
                <IconButton
                  onClick={() => {
                    handleBlock(SignInLog[dataIndex].UserId);
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
                  <BlockIcon fontSize="small" />
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
    selectableRows: 'none',
    print: false,
    downloadOptions: { filename: 'sign_in_logs.csv', separator: ',' }
  };

  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1);

  useEffect(() => {
    setUserId(parseInt(localStorage.getItem('UserId')));
    getSigninLogsDetails(
      userId,
      yesterdaydate,
      moment(new Date()).tz('America/Los_Angeles').format('MM-DD-YYYY HH:mm')
    );
  }, []);

  async function getSigninLogsDetails(userId, startDate, EndDate) {
    setLoading(true);
    setDialogOpen(true);
    try {
      const response = await axios.get(
        `Users/GetUserSignInLogList/${userId}/${startDate}/${EndDate}`
      );
      console.log(response.data.Data);
      if (response.data.StatusCode == 200) {
        setSignInLogData(response.data.Data);
        setLoading(false);
        setDialogOpen(false);
      } else {
        setMessage(response.data.StatusMessage);
        setLoading(false);
        setDialogOpen(false);
        setOpen(true);
        setSeverity('Success');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Failed to load the Signin log details');
      setLoading(false);
      setOpen(true);
      setSeverity('error');
    }
    setLoading(false);
  }

  const handleChange = (value) => {
    console.log(value);
    if (value !== null) {
      const startDate = moment(value[0]).format('MM-DD-YYYY');
      const EndDate = moment(value[1]).format('MM-DD-YYYY');
      getSigninLogsDetails(userId, startDate, EndDate);
    }
  };

  return (
    <>
      <Head>
        <title>Sign-In-Logs</title>
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
            <Typography variant="h3" gutterBottom>
              Sign In Logs
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <DateRangePicker
              showOneCalendar
              size="lg"
              format="dd/MM/yyyy"
              character=" - "
              placeholder="Select Date Range"
              onChange={handleChange}
              ranges={[]}
              defaultValue={[currentDate, new Date()]}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Snackbar
                open={open}
                autoHideDuration={4000}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center'
                }}
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
                  data={SignInLog}
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
SignInLogs.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;
export default SignInLogs;
