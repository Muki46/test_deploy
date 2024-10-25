import {
  Button,
  styled,
  Box,
  Grid,
  InputAdornment,
  IconButton,
  Link
} from '@mui/material';
import Router from 'next/router';
import type { ReactElement } from 'react';
import TextField from '@mui/material/TextField';
import BaseLayout from 'src/layouts/BaseLayout';
import Landing from '../pages/components/landing';
import { useState, forwardRef } from 'react';
import { DNA } from 'react-loader-spinner';
import { useAxios } from './services';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { TransitionProps } from '@mui/material/transitions';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Captcha from 'demos-react-captcha';
import moment from 'moment-timezone';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Panel = styled(Box)(
  () => `
    position: absolute;
    z-index: 10;
    width: 850px;
    height: 380px;
    background: #eee;
    top: 40%;
    left: 30%;
    margin: -110px 0 0 -100px;
    padding: 20px;
    border-radius: 4px;
    box-sizing: border-box;
    z-index: 100;
`
);

function Overview() {
  const [dopen, setDialogOpen] = useState(false);
  const [snackopen, setSnackOpen] = useState(false);
  const [severity, setSeverity] = useState('Success');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState(false);
  const [axios] = useAxios();

  const validationSchema = Yup.object().shape({
    uname: Yup.string().required('Username is required'),
    pwd: Yup.string().required('Password is required')
  });

  const onCaptchaChange = async (value) => {
    console.log(severity);
    setCaptcha(value);
  };

  const loadIp = async () => {
    setDialogOpen(true);
    const response = await fetch('https://api.ipify.org/?format=json');
    const data = await response.json();
    console.log(data.ip);
    getLocation(data.ip);
  };

  const getLocation = async (ipAddress: string) => {
    const response = await fetch(
      `https://apiip.net/api/check?ip=${ipAddress}&accessKey=184e7701-3370-457e-ac1a-0901bc79d131`
    );
    const data = await response.json();
    const location = data.city + ',' + data.regionName + ',' + data.countryName;
    loginDetails(ipAddress, location);
  };

  async function loginDetails(userIP, location) {
    const userid = localStorage.getItem('UserId');
    await axios
      .get(`Users/GetLoginUserDetails?userIp=${userIP}&userid=${userid}`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          localStorage.setItem('UserId', res.data.Data.UserDetails.user_id);
          localStorage.setItem(
            'AccountId',
            res.data.Data.UserAccounts[0].account_id
          );
          localStorage.setItem(
            'AccountLogo',
            res.data.Data.UserAccounts[0].account_logo
          );

          localStorage.setItem('ClientId', res.data.Data.UserDetails.client_id);

          localStorage.setItem(
            'ProviderId',
            res.data.Data.UserDetails.provider_id
          );

          localStorage.setItem(
            'PatientId',
            res.data.Data.UserDetails.patient_id
          );

          localStorage.setItem(
            'RoleName',
            res.data.Data.UserRoles[0].role_name
          );
          let permissionArray = JSON.stringify(res.data.Data.UserRoles);
          localStorage.setItem('Permission', permissionArray);
          localStorage.setItem('UserIP', userIP);
          localStorage.setItem(
            'UserName',
            res.data.Data.UserDetails.first_name +
              ' ' +
              res.data.Data.UserDetails.last_name
          );
          postSignInlogs(
            res.data.Data.UserDetails.user_id,
            userIP,
            location,
            res.data.Data.UserRoles
          );
          postAduitLog(
            res.data.Data.UserDetails.first_name +
              ' ' +
              res.data.Data.UserDetails.last_name +
              ' is logged in successfully'
          );
        } else {
          setDialogOpen(false);
          setMessage(res.data.StatusMessage);
          setSnackOpen(true);
          setSeverity('error');
        }
      });
  }

  async function postSignInlogs(userId, userIP, location, permissionArray) {
    const postData = {
      UserId: userId,
      SignInDate: moment(new Date())
        .tz('America/Los_Angeles')
        .format('MM-DD-YYYY HH:mm'),
      IpAddress: userIP,
      Location: location,
      Action: 'Success'
    };
    await axios
      .post('Users/CreateUserSignInLog', postData)
      .then((res) => {
        console.log(res);
        if (res.data.StatusCode == 200) {
          console.log(permissionArray);
          permissionArray.some((item) => item.permission_name === 'Patients')
            ? Router.push({
                pathname: '/dashboards/crypto'
              })
            : Router.push({
                pathname: '/components/profile'
              });
        } else {
          setDialogOpen(false);
          setMessage(res.data.Data);
          setSnackOpen(true);
          setSeverity('error');
        }
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }

  async function postAduitLog(message) {
    const postData = {
      UserId: 0,
      AuditCategoryMasterId: 1,
      AuditDate: moment(new Date())
        .tz('America/Los_Angeles')
        .format('MM-DD-YYYY HH:mm'),
      Activity: message,
      PatientId: 0,
      ProviderId: 0,
      ReportId: 0,
      ClientId: 0,
      AuditUserId: localStorage.getItem('UserId'),
      Status: 1
    };
    await axios
      .post('Users/CreateAuditLog', postData)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          console.log(res);
          setDialogOpen(false);
          Router.push({
            pathname: '/dashboards/crypto'
          });
        } else {
          setDialogOpen(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setDialogOpen(false);
        setSeverity('error');
      });
  }

  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      uname: '',
      pwd: ''
    },
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = (data) => {
    setDialogOpen(true);
    console.log(data);
    var postData = {
      UserName: data.uname,
      Password: data.pwd
    };
    if (captcha == true) {
      getAuth(postData);
    } else {
      setSnackOpen(true);
      setMessage('Enter valid captcha ');
      setDialogOpen(false);
    }
  };

  async function getAuth(data) {
    axios
      .post(
        'https://etadevapi.azurewebsites.net/api/Auth/login?api-version=1',
        data
      )
      .then((res) => {
        setDialogOpen(false);
        console.log(res.data.UserId);
        localStorage.setItem('token', res.data.JWtToken);
        localStorage.setItem('UserId', res.data.UserId);
        localStorage.setItem('Email', res.data.Email);
        if (res.data.IsFirstTimeLogin == true) {
          gotoHorizontalStepper();
        } else {
          loadIp();
        }
      })
      .catch((err) => {
        console.log(err);
        setSnackOpen(true);
        setMessage('Invalid Credentials');
        setSeverity('error');
        setDialogOpen(false);
        setTimeout(goOff, 1000);
      });
  }

  const goOff = () => {
    window.location.reload();
  };

  const gotoForgotPasswordPage = () => {
    Router.push({
      pathname: './components/forgotPassword'
    });
  };

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  const gotoHorizontalStepper = () => {
    setDialogOpen(true);
    Router.push({
      pathname: './components/horizontalStepper'
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Snackbar
          open={snackopen}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
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
      <div>
        <div>
          <Landing />
        </div>
        <Panel>
          <img
            width={200}
            height={40}
            alt="EndoDNA-logo"
            src="/static/images/logo/EndoDNA-logo.png"
          />
          <h3 style={{ fontSize: '18px' }}>
            The breakthrough DNA test that matches you with the right
            cannabinoid products for your wellness journey.
          </h3>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { mt: 3, ml: 3 }
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              spacing={3}
            >
              <Grid container>
                <Grid item xs={6}>
                  <Controller
                    name="uname"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        sx={{ width: '46ch' }}
                        id="uname"
                        required
                        label="Username"
                        variant="filled"
                        {...register('uname')}
                        error={errors.uname ? true : false}
                        helperText={errors.uname?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name="pwd"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        sx={{ width: '46ch' }}
                        {...field}
                        id="pwd"
                        required
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        variant="filled"
                        {...register('pwd')}
                        error={errors.pwd ? true : false}
                        helperText={errors.pwd?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityIcon />
                                ) : (
                                  <VisibilityOffIcon />
                                )}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                  <Link
                    variant="h6"
                    color="primary"
                    onClick={gotoForgotPasswordPage}
                    sx={{
                      cursor: 'pointer',
                      float: 'right',
                      paddingRight: '5px',
                      fontSize: '15px !important'
                    }}
                  >
                    {' '}
                    Forgot Password?
                  </Link>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={4} sx={{ ml: '20px' }}>
                  <Captcha
                    onChange={onCaptchaChange}
                    placeholder="Enter captcha"
                    length={5}
                  />
                </Grid>
                <Grid item xs={7} sx={{ marginTop: '58px' }}>
                  <Button
                    variant="contained"
                    color="success"
                    type="submit"
                    // onClick={gotoHorizontalStepper}
                    style={{
                      fontSize: '16px',
                      textTransform: 'uppercase',
                      padding: '10px 30px'
                    }}
                  >
                    Login
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Panel>
      </div>
    </main>
  );
}

export default Overview;

Overview.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
