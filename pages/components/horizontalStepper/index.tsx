import {
  Box,
  styled,
  TextField,
  Grid,
  InputAdornment,
  IconButton,
  Tooltip
} from '@mui/material';
import Stack from '@mui/material/Stack';
import moment from 'moment-timezone';
import type { ReactElement } from 'react';
import BaseLayout from 'src/layouts/BaseLayout';
import Landing from '../landing';
import { useEffect, useState, forwardRef } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import SecurityIcon from '@mui/icons-material/Security';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import * as Yup from 'yup';
import { useAxios } from 'pages/services';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import OtpInput from 'react-otp-input';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { DNA } from 'react-loader-spinner';
import Router from 'next/router';
import { Otptimer } from 'otp-timer-ts';

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
      width: 900px;
      height: 380px;
      background: #eee;
      top: 40%;
      left: 25%;
      margin: -110px 0 0 -100px;
      padding: 20px;
      border-radius: 4px;
      box-sizing: border-box;
      z-index: 100;
  `
);

function HorizontalStepper() {
  const [axios] = useAxios();
  const [dopen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('Success');
  const [snackopen, setSnackOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const steps = ['Password setup', 'Security setup', 'Email Verification'];
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [securityData, setSecurityData] = useState([]);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState<string | null>(null);

  const validationSchema = Yup.object().shape({
    Npwd: Yup.string()
      .required('Enter New Password is required')
      .min(8, 'Password must contain atleast 8 characters')
      .matches(/[0-9]/, 'Password must contain atleast one number')
      .matches(/[A-Z]/, 'Password must contain atleast one upper case')
      .matches(/[a-z]/, 'Password must contain atleast one lower case')
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        'Password must contain atleast one Special charcter'
      ),
    cpwd: Yup.string()
      .oneOf([Yup.ref('Npwd')], 'Password must match New password')
      .required('Enter Confirm New Password'),
    ans1: Yup.string().required('Type Your Answer'),
    ans2: Yup.string()
      .required('Type Your Answer')
      .matches(/^\d+$/, 'Answer must be numeric')
      .length(3, 'Answer must be exactly 3 digits'),
    ans3: Yup.string()
      .required('Type Your Answer')
      .matches(/^\d+$/, 'Answer must be numeric')
      .length(4, 'Answer must be exactly 4 digits')
  });

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowPassword1 = () => {
    setShowPassword1(!showPassword1);
  };

  useEffect(() => {
    const getEmail = localStorage.getItem('Email');
    setEmail(getEmail);
    getSecurityOpeningData();
  }, []);

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
    console.log(severity);
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
    trigger,
    getValues,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      cpwd: '',
      Npwd: '',
      ans1: '',
      ans2: '',
      ans3: ''
    },
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  async function getSecurityOpeningData() {
    await axios
      .get(`Users/GetSecurityOpeningData`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setDialogOpen(false);
          setSecurityData(res.data.Data.SecurityQuestionMasters);
        } else {
          setDialogOpen(false);
          setSnackOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setDialogOpen(false);
        setSnackOpen(true);
      });
  }

  const gotoOTP = () => {
    setSnackOpen(false);
  };

  const onSendOTP = () => {
    UpdateOtp();
  };

  async function UpdateOtp() {
    setIsUpdating(true);
    setDialogOpen(true);
    var data = {
      Email: email
    };
    axios
      .put('Users/UpdateOtp', data)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setSnackOpen(true);
          setMessage(res.data.Data);
          setDialogOpen(false);
          setIsUpdating(false);
          setTimeout(gotoOTP, 10000);
        } else {
          setSnackOpen(true);
          setMessage(res.data.StatusMessage);
          setDialogOpen(false);
          setIsUpdating(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setDialogOpen(false);
        setIsUpdating(false);
        setMessage('Failed to send OTP');
        setSnackOpen(true);
        window.location.reload();
      });
  }

  const onVerifyOTP = () => {
    console.log(otp);
    verifyOtp(otp);
  };

  async function verifyOtp(otp) {
    setIsUpdating(true);
    setDialogOpen(true);
    var data = {
      Email: email,
      Otp: otp
    };
    axios
      .put('Users/VerifyOtp', data)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setSnackOpen(true);
          setMessage('OTP verfied successfully and Redirected to Homepage');
          setDialogOpen(false);
          setIsUpdating(false);
          loadIp();
        } else {
          setSnackOpen(true);
          setMessage(res.data.StatusMessage);
          setDialogOpen(false);
          setIsUpdating(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setDialogOpen(false);
        setIsUpdating(false);
        setMessage('Failed to verify OTP');
        setSnackOpen(true);
        window.location.reload();
      });
  }

  const isStepSkipped = (step: number) => {
    var skipped = new Set<number>();
    return skipped.has(step);
  };

  const handleNext = async () => {
    if (activeStep == 0) {
      const output = await trigger(['Npwd', 'cpwd']);
      if (output == true) {
        var postData = {
          puser_id: localStorage.getItem('UserId'),
          ppassword: getValues('Npwd')
        };
        updatePassword(postData);
      }
    }

    if (activeStep == 1) {
      const output = await trigger(['ans1', 'ans2', 'ans3']);
      if (output == true) {
        const securityData = [
          {
            question_id: 1,
            security_answer: getValues('ans1')
          },
          {
            question_id: 2,
            security_answer: getValues('ans2')
          },
          {
            question_id: 3,
            security_answer: getValues('ans3')
          }
        ];
        var postSecurityData = {
          UserId: localStorage.getItem('UserId'),
          SecurityAnswerRelation: securityData,
          CreatedBy: localStorage.getItem('UserId'),
          CreatedDate: moment(new Date()).format('MM-DD-YYYY'),
          ModifiedBy: localStorage.getItem('UserId'),
          ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
        };
        updateSecurityAnswer(postSecurityData);
      }
    }
    if (activeStep == 2) {
      onVerifyOTP();
    }
  };

  async function updatePassword(data) {
    setIsUpdating(true);
    setDialogOpen(true);
    axios
      .put('Users/UpdatePassword', data)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setDialogOpen(false);
          setIsUpdating(false);
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
          setSnackOpen(true);
          setMessage(res.data.StatusMessage);
          setDialogOpen(false);
          setIsUpdating(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setDialogOpen(false);
        setIsUpdating(false);
        setMessage('Failed to Set New Password');
        setSnackOpen(true);
        window.location.reload();
      });
  }

  async function updateSecurityAnswer(data) {
    setIsUpdating(true);
    setDialogOpen(true);
    axios
      .put('Users/UpdateSecurityAnswer', data)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setDialogOpen(false);
          setIsUpdating(false);
          getSecurityOpeningData();
          UpdateOtp();
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
          setSnackOpen(true);
          setMessage(res.data.StatusMessage);
          setDialogOpen(false);
          setIsUpdating(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setDialogOpen(false);
        setIsUpdating(false);
        setMessage('Failed to Set Security Answer');
        setSnackOpen(true);
        window.location.reload();
      });
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const tooltipContent = (
    <Stack>
      <ul>
        <li>Password should contain at least 8 characters</li>
        <li>At least one uppercase letter and one lowercase letter</li>
        <li>At least one special character and one number</li>
      </ul>
    </Stack>
  );

  return (
    <>
      <main>
        <div>
          <Landing />
        </div>
        <Panel>
          <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps: { completed?: boolean } = {};
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <Box
              component="form"
              sx={{
                '& .MuiTextField-root': { mt: 2, ml: 3 }
              }}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
            >
              {activeStep === 0 && (
                <>
                  <Grid container>
                    <Grid item xs={6} style={{ marginTop: '30px' }}>
                      <div>
                        <img
                          width={200}
                          height={40}
                          alt="EndoDNA-logo"
                          src="/static/images/logo/EndoDNA-logo.png"
                        />
                      </div>
                      <br />
                      <span
                        style={{
                          fontSize: '32px',
                          marginBottom: '15px !important'
                        }}
                      >
                        Change your password
                      </span>
                      <br />
                      Enter your new password to change your password
                    </Grid>
                    <Grid item xs={3} sx={{ marginTop: '20px' }}>
                      <Controller
                        name="Npwd"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            sx={{ width: '48ch' }}
                            {...field}
                            required
                            id="Npwd"
                            type={showPassword ? 'text' : 'password'}
                            label="Enter New Password"
                            variant="filled"
                            {...register('Npwd')}
                            error={errors.Npwd ? true : false}
                            helperText={errors.Npwd?.message}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Tooltip
                                    open={open}
                                    onOpen={handleTooltipOpen}
                                    onClose={handleTooltipClose}
                                    title={tooltipContent}
                                    arrow
                                  >
                                    <IconButton
                                      aria-label="password instructions"
                                      edge="end"
                                      color="warning"
                                    >
                                      <ErrorOutlineIcon />
                                    </IconButton>
                                  </Tooltip>

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
                      <Controller
                        name="cpwd"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            sx={{ width: '48ch', marginTop: '10px' }}
                            required
                            {...field}
                            id="cpwd"
                            type={showPassword1 ? 'text' : 'password'}
                            label="Confirm New Password"
                            variant="filled"
                            {...register('cpwd')}
                            error={errors.cpwd ? true : false}
                            helperText={errors.cpwd?.message}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword1}
                                    edge="end"
                                  >
                                    {showPassword1 ? (
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
                    </Grid>
                    <Grid item xs={12}>
                      <div style={{ height: '70px' }}>&nbsp;</div>
                    </Grid>
                  </Grid>
                </>
              )}
              {activeStep === 1 && (
                <>
                  <Grid container>
                    <Grid
                      item
                      xs={3}
                      sx={{ marginLeft: '13px', marginTop: '25px' }}
                    >
                      <SecurityIcon sx={{ fontSize: '7em' }} />
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sx={{ marginLeft: '13px', marginTop: '20px' }}
                    >
                      {securityData.length > 0 && (
                        <Typography
                          variant="body1"
                          sx={{ fontSize: '15px !important' }}
                          key={securityData[0].question_id}
                        >
                          1. {securityData[0].question}
                        </Typography>
                      )}
                      <Controller
                        name="ans1"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            sx={{ width: '20ch' }}
                            id="ans1"
                            label="Type Answer"
                            variant="filled"
                            {...register('ans1')}
                            error={errors.ans1 ? true : false}
                            helperText={errors.ans1?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={5}
                      sx={{ marginLeft: '13px', marginTop: '20px' }}
                    >
                      {securityData.length > 0 && (
                        <Typography
                          variant="body1"
                          sx={{ fontSize: '15px !important' }}
                          key={securityData[2].question_id}
                        >
                          2. {securityData[2].question}
                        </Typography>
                      )}
                      <Controller
                        name="ans2"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            sx={{ width: '30ch' }}
                            {...field}
                            id="ans2"
                            label="Type Answer"
                            variant="filled"
                            {...register('ans2')}
                            error={errors.ans2 ? true : false}
                            helperText={errors.ans2?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sx={{
                        marginLeft: '13px',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginTop: '5px'
                      }}
                    >
                      Answer Your Security Questions
                    </Grid>
                    <Grid
                      item
                      xs={8}
                      sx={{ marginLeft: '13px', marginTop: '20px' }}
                    >
                      {securityData.length > 0 && (
                        <Typography
                          variant="body1"
                          sx={{ fontSize: '15px !important' }}
                          key={securityData[1].question_id}
                        >
                          3. {securityData[1].question}
                        </Typography>
                      )}
                      <Controller
                        name="ans3"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            sx={{ width: '40ch' }}
                            {...field}
                            id="ans3"
                            label="Type Answer"
                            variant="filled"
                            {...register('ans3')}
                            error={errors.ans3 ? true : false}
                            helperText={errors.ans3?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
              {activeStep === 2 && (
                <>
                  <Grid container>
                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                      <img
                        width={100}
                        height={100}
                        alt="EndoDNA-logo"
                        src="/static/images/email.png"
                      />
                    </Grid>

                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                      <Typography sx={{ fontSize: '20px !important' }}>
                        JUST ONE MORE STEP.
                      </Typography>
                      <Typography
                        fontSize="small"
                        sx={{
                          paddingTop: '10px !important',
                          paddingBottom: '14px !important',
                          fontSize: '15px !important'
                        }}
                      >
                        OTP (One Time Password) has been sent to {email}, Please
                        check your email and enter the OTP below to verify your
                        email.
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{ textAlign: 'center', display: 'block !important' }}
                    >
                      <div
                        style={{
                          textAlign: 'center',
                          display: 'inline-flex'
                        }}
                      >
                        <OtpInput
                          value={otp}
                          onChange={setOtp}
                          numInputs={6}
                          renderSeparator={<span>-</span>}
                          renderInput={(props) => (
                            <input
                              {...props}
                              style={{
                                width: '2.5em',
                                height: '2.5em',
                                textAlign: 'center',
                                border: '3px solid #5569ff !important'
                              }}
                            />
                          )}
                        />
                      </div>
                      <div>
                        <Otptimer
                          minutes={0}
                          seconds={30}
                          onResend={onSendOTP}
                          buttonText={'RESEND'}
                          buttonClass={'button-r'}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </>
              )}
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                {activeStep !==0 && activeStep !==2 && (
                  <Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
                    Back
                  </Button>)
                }
                <Box sx={{ flex: '1 1 auto' }} />
                <Button
                  onClick={handleNext}
                  color="primary"
                  variant="contained"
                >
                  Next
                </Button>
              </Box>
            </Box>
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
                <Alert
                  onClose={handleClose}
                  severity="success"
                  sx={{ width: '100%' }}
                >
                  {message}
                </Alert>
              </Snackbar>
              {isUpdating ? (
                <Dialog
                  open={dopen}
                  TransitionComponent={Transition}
                  keepMounted
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogContent>
                    <DNA
                      visible={true}
                      height="90"
                      width="90"
                      ariaLabel="triangle-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </DialogContent>
                </Dialog>
              ) : (
                ''
              )}
            </Box>
          </Box>
        </Panel>
      </main>
    </>
  );
}

export default HorizontalStepper;

HorizontalStepper.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
