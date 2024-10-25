import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import {
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  InputAdornment,
  IconButton,
  Typography
} from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useAxios } from 'pages/services';
import { useState, useEffect, Fragment, forwardRef } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import moment from 'moment-timezone';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { DNA } from 'react-loader-spinner';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AddUser(data) {
  const [axios] = useAxios();
  const [snackopen, setSnackOpen] = useState(false);
  const [passopen, setPassOpen] = useState(true);
  const [dopen, setDialogOpen] = useState(false);
  const [severity, setSeverity] = useState('info');
  const [userId, setUserId] = useState(0);
  const [buttonStatus, setButtonStatus] = useState('Submit');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [zip, setZip] = useState<any>({ zip: '' });
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [options, setOptions] = useState([]);
  const [roleData, setRoleOpeningMasterData] = useState([]);
  const [clientData, setuseropeningClientData] = useState([]);
  const [roleId, setRoleId] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [providerData, setProviderData] = useState([]);
  const [patientData, setPatientData] = useState([]);
  const loading = open && options.length === 0;
  const [providerId, setProviderId] = useState(0);
  const [patientId, setPatientId] = useState(0);
  const [clientId, setClientId] = useState(0);
  const [roleName, setRoleName] = useState('');
  const [lpId, setLpId] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [domainName, setDomainName] = useState([]);

  const domainNames = [];

  domainName.forEach((item) => {
    domainNames.push(item.domain_name);
  });

  console.log(domainNames);

  const blackListedDomains = domainNames;

  const validationSchema = Yup.object().shape(
    {
      rname: Yup.string().required('Role Name is required'),
      cname:
        roleId === 3 || roleId === 4 || roleId === 5
          ? Yup.string().required('Client Name is required')
          : Yup.string().notRequired(),

      pname:
        roleId == 4 || roleId == 5
          ? Yup.string().required('Provider Name is required')
          : Yup.string().notRequired(),

      ppname:
        roleId == 5
          ? Yup.string().required('Patient Name is required')
          : Yup.string().notRequired(),

      fname: Yup.string().required('First Name is required'),
      lname: Yup.string().required('Last Name is required'),
      uname: Yup.string().required('User Name is required'),
      email:
        roleId == 6 || roleId == 2 || domainNames.length == 0
          ? Yup.string()
              .required('Email is required')
              .when('email', {
                is: (value) => value?.length,
                then: (rule) => rule.email('Email is invalid')
              })
          : Yup.string()
              .required('Email is required')
              .email('Email is invalid')
              .test(
                'is-not-blacklist',
                `Please use email ends with  ${domainNames} `,
                (value) => {
                  if (value) {
                    const currentDomain = value.substring(
                      value.indexOf('@') + 1
                    );

                    return blackListedDomains.includes(currentDomain);
                  }
                }
              ),
      cpwd:
        buttonStatus == 'Update'
          ? Yup.string().nullable().notRequired()
          : Yup.string().required('Password Required'),
      address: Yup.string().nullable().notRequired(),
      zip: Yup.string().nullable().notRequired(),
      city: Yup.string().nullable().notRequired(),
      state: Yup.string().nullable().notRequired(),
      startIp: Yup.string().required('Start IP address Required'),
      endIp: Yup.string().required('End IP address Required'),
      mobNo: Yup.string()
        .nullable()
        .notRequired()
        .when('mobNo', {
          is: (value) => value?.length,
          then: (rule) => rule.min(10)
        })
    },
    [
      // Add Cyclic deps here because when require itself
      ['mobNo', 'mobNo'],
      ['email', 'email']
    ]
  );

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  const {
    control,
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors }
  } = useForm({
    defaultValues: {
      rname: '',
      cname: '',
      pname: '',
      ppname: '',
      fname: '',
      lname: '',
      address: '',
      email: '',
      cpwd: '',
      uname: '',
      zip: '',
      city: '',
      state: '',
      mobNo: '',
      startIp: '',
      endIp: ''
    },
    resolver: yupResolver(validationSchema)
  });

  const onZipChange = (event, value) => {
    console.log(event);
    setZip(value);
    setValue('zip', value);
    if (value == null) {
      setValue('city', '');
      setValue('state', '');
      setCity('');
      setState('');
    } else {
      setValue('city', value?.city);
      setValue('state', value?.state);
      setCity(value?.city);
      setState(value?.state);
    }
  };

  const onSubmit = (data) => {
    setIsUpdating(true);
    setDialogOpen(true);
    var postData = {
      UserId: 0,
      FirstName: data.fname,
      LastName: data.lname,
      UserName: data.uname,
      Address: data.address,
      City: city,
      State: state,
      Zip: data.zip,
      Email: data.email,
      Password: data.cpwd,
      ClientId: clientId,
      ProviderId: providerId,
      PatientId: patientId,
      RoleId: roleId,
      Phone: data.mobNo,
      Subject: '',
      StartIp: data.startIp,
      EndIp: data.endIp,
      CreatedBy: localStorage.getItem('UserId'),
      CreatedDate: moment(new Date()).format('MM-DD-YYYY'),
      ModifiedBy: localStorage.getItem('UserId'),
      ModifiedDate: moment(new Date()).format('MM-DD-YYYY'),
      Status: 1
    };
    buttonStatus === 'Submit' ? createUser(postData) : updateUser(postData);
    console.log(data);
  };

  async function createUser(data) {
    axios
      .post('Users/CreateUser', data)
      .then((res) => {
        console.log(res);
        if (res.data.StatusCode == 200) {
          setIsUpdating(false);
          setPassOpen(false);
          setMessage('User Created');
          setSnackOpen(true);
          setSeverity('success');
          postAduitLog(data.UserName + ' has been created successfully', 0);
        } else {
          setIsUpdating(false);
          setMessage(res.data.StatusMessage);
          setSnackOpen(true);
          setSeverity('success');
          postAduitLog(data.uname + 'creation failed', 1);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setMessage('Failed To Create User');
        setSnackOpen(true);
        setSeverity('error');
      });
  }

  const handleClickShowPassword1 = () => {
    setShowPassword1(!showPassword1);
  };

  async function updateUser(data) {
    data.UserId = userId;
    axios
      .put('Users/UpdateUser', data)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setIsUpdating(false);
          setPassOpen(false);
          setMessage('User Updated');
          setSnackOpen(true);
          setSeverity('success');
          window.location.reload();
        } else {
          setIsUpdating(false);
          setMessage(res.data.StatusMessage);
          setSnackOpen(true);
          setSeverity('success');
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setMessage('Failed To Update User');
        setSnackOpen(true);
        setSeverity('error');
      });
  }

  const onChangeHandle = async (value) => {
    // use the changed value to make request and then use the result. Which
    console.log(severity);
    if (value.length >= 3) {
      const response = await axios.get(
        'Patients/ZIPSearch?searchText=' + value
      );
      const countries = await response.data;
      setOptions(countries);
    }
  };

  useEffect(() => {
    console.log(passopen);
    setIsUpdating(true);
    setDialogOpen(true);
    getUserOpeningData();
    console.log(data.props);
    if (data.props == 0) {
      setButtonStatus('Submit');
    } else {
      setButtonStatus('Update');
      setUserId(data.props);
      getUserById(data.props);
    }
  }, []);

  async function getUserOpeningData() {
    const rName = localStorage.getItem('RoleName');
    const clientId = localStorage.getItem('ClientId');
    const userId = localStorage.getItem('UserId');
    const providerId = localStorage.getItem('ProviderId');
    await axios
      .get(`Users/GetUserOpeningData/${clientId}/${userId}`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setRoleName(rName);
          setLpId(providerId);
          setRoleOpeningMasterData(res.data.Data.RoleOpeningMaster);
          setuseropeningClientData(res.data.Data.UserOpeningMaster);
          setDialogOpen(false);
          setIsUpdating(false);
        } else {
          setDialogOpen(false);
          setIsUpdating(false);
          setSnackOpen(true);
          setMessage(res.data.StatusMessage);
        }
      })
      .catch((err) => {
        console.log(err);
        setDialogOpen(false);
        setIsUpdating(false);
        setSnackOpen(true);
        setMessage('Failed to load  user opening Data');
      });
  }

  const handleRolechange = (event) => {
    const selectedRoleId = event.target.value;
    setRoleId(selectedRoleId);
    console.log(selectedRoleId);
  };

  const handleClientChange = (event) => {
    setProviderData([]);
    setValue('pname', '');
    const selectClientId = event.target.value;
    if (selectClientId != null) {
      setClientId(selectClientId);
      console.log(selectClientId);
      getProviderlistByClientId(selectClientId, 0, roleName);
    }
    if (roleId == 3) {
      getClientListByclientId(selectClientId);
    }
  };

  async function getClientListByclientId(id) {
    setIsUpdating(true);
    setDialogOpen(true);
    setClientId(id);
    axios
      .get(`Clients/GetClientById/${id}`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          const val = {
            city: 'Wake',
            state: 'VA',
            zip: res.data.Data.ClientMasters.zip
          };
          setZip(val);
          setValue('address', res.data.Data.ClientMasters.address);
          setValue('zip', val.zip);
          setValue('city', res.data.Data.ClientMasters.city);
          setValue('state', res.data.Data.ClientMasters.state);
          setValue('mobNo', res.data.Data.ClientMasters.phone);
          setIsUpdating(false);
          setDialogOpen(false);
        } else {
          setIsUpdating(false);
          setDialogOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setDialogOpen(false);
      });
  }

  async function getProviderlistByClientId(clientId, providerId, rname) {
    setIsUpdating(true);
    setDialogOpen(true);
    axios
      .get(`Providers/GetProviderListByClientId/${clientId}`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          if (rname == 'Provider') {
            const pfdata = res.data.Data;
            const prData = [];
            if (providerId != 0) {
              prData.push(pfdata.find((x) => x.ProviderId == providerId));
              console.log(prData);
              setProviderData(prData);
              setValue('pname', providerId);
            } else {
              prData.push(pfdata.find((x) => x.ProviderId == lpId));
              console.log(prData);
              setProviderData(prData);
            }
          } else {
            setProviderData(res.data.Data);
            getDomainClientMappingByClientIdActive(clientId);
          }
          setIsUpdating(false);
          setDialogOpen(false);
        } else {
          setIsUpdating(false);
          setDialogOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setDialogOpen(false);
      });
  }

  async function getDomainClientMappingByClientIdActive(clientid) {
    setIsUpdating(true);
    setDialogOpen(true);
    axios
      .get(`Users/GetDomainClientMappingByClientIdActive/${clientid}`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setDomainName(res.data.Data.ClientDomainMaster);
          setIsUpdating(false);
          setDialogOpen(false);
        } else {
          setIsUpdating(false);
          setDialogOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setDialogOpen(false);
      });
  }

  const handleProviderChange = (event) => {
    setPatientData([]);
    setValue('ppname', '');
    const selectProviderId = event.target.value;
    if (selectProviderId != null) {
      console.log(selectProviderId);
      setProviderId(selectProviderId);
      getPatientlistByProviderId(selectProviderId, 0);
    }
    if (roleId == 4) {
      getProviderListByProviderId(selectProviderId);
    }
  };

  async function getProviderListByProviderId(providerId) {
    setIsUpdating(true);
    setDialogOpen(true);
    axios
      .get(`Providers/GetProvidersById/${providerId}`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          const val = { city: 'Wake', state: 'VA', zip: res.data.Data.Zip };
          setZip(val);
          setValue('address', res.data.Data.Address);
          setValue('zip', val.zip);
          setValue('city', res.data.Data.City);
          setValue('state', res.data.Data.State);
          setValue('mobNo', res.data.Data.Phone);
          setValue('email', res.data.Data.Email);
          setIsUpdating(false);
          setDialogOpen(false);
        } else {
          setIsUpdating(false);
          setDialogOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setDialogOpen(false);
      });
  }

  async function getPatientlistByProviderId(providerId, patientid) {
    setIsUpdating(true);
    setDialogOpen(true);
    axios
      .get(`Patients/GetPatientListByProviderId/${providerId}`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          if (patientid != 0) {
            setValue('ppname', patientid);
          }
          setPatientData(res.data.Data);
          setIsUpdating(false);
          setDialogOpen(false);
        } else {
          setIsUpdating(false);
          setDialogOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setDialogOpen(false);
      });
  }

  const handlePatientChange = (event) => {
    const selectPatientId = event.target.value;
    if (selectPatientId != null) {
      console.log(selectPatientId);
      setPatientId(selectPatientId);
      getPatientlistById(selectPatientId);
    }
  };

  async function getPatientlistById(patientId) {
    setIsUpdating(true);
    setDialogOpen(true);
    axios
      .get(`Patients/GetPatientsbyId/${patientId}`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          const val = { city: 'Wake', state: 'VA', zip: res.data.Data.Zip };
          setZip(val);
          setValue('fname', res.data.Data.FirstName);
          setValue('lname', res.data.Data.LastName);
          setValue('address', res.data.Data.Address);
          setValue('zip', val.zip);
          setValue('city', res.data.Data.City);
          setValue('state', res.data.Data.State);
          setValue('email', res.data.Data.Email);
          setIsUpdating(false);
          setDialogOpen(false);
        } else {
          setIsUpdating(false);
          setDialogOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setDialogOpen(false);
      });
  }

  async function getUserById(userId) {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get('Users/GetUserById/' + userId)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          const rolName = localStorage.getItem('RoleName');
          const val = { city: 'Wake', state: 'VA', zip: res.data.Data.Zip };
          setZip(val);
          setIsEdit(true);
          setRoleId(res.data.Data.RoleId);
          setValue('rname', res.data.Data.RoleId);
          setValue('cname', res.data.Data.ClientId);
          setClientId(res.data.Data.ClientId);
          setProviderId(res.data.Data.ProviderId);
          setPatientId(res.data.Data.PatientId);
          getProviderlistByClientId(
            res.data.Data.ClientId,
            res.data.Data.ProviderId,
            rolName
          );
          getPatientlistByProviderId(
            res.data.Data.ProviderId,
            res.data.Data.PatientId
          );
          setValue('ppname', res.data.Data.PatientId);
          setValue('pname', res.data.Data.ProviderId);
          setValue('fname', res.data.Data.FirstName);
          setValue('lname', res.data.Data.LastName);
          setValue('uname', res.data.Data.UserName);
          setValue('email', res.data.Data.Email);
          setValue('mobNo', res.data.Data.Phone);
          setValue('zip', val.zip);
          setValue('address', res.data.Data.Address);
          setValue('city', res.data.Data.City);
          setValue('state', res.data.Data.State);
          setValue('startIp', res.data.Data.StartIp);
          setValue('endIp', res.data.Data.EndIp);
          setCity(res.data.Data.City);
          setState(res.data.Data.State);
          setIsUpdating(false);
        } else {
          setIsUpdating(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setMessage('Failed to fetching the data');
        setSeverity('error');
        setIsUpdating(false);
        setSnackOpen(true);
      });
  }

  const generateNewPassword = () => {
    generatePassword();
  };

  async function generatePassword() {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get('GeneratePassword/GeneratePassword')
      .then((res) => {
        console.log(res.data);
        clearErrors('cpwd');
        setValue('cpwd', res.data);
        setIsUpdating(false);
        setMessage('Password Generated');
        setSnackOpen(true);
        setDialogOpen(false);
      })
      .catch((err) => {
        console.log(err);
        setMessage('Failed to Generate password');
        setSeverity('error');
        setIsUpdating(false);
        setSnackOpen(true);
      });
  }

  async function postAduitLog(message, count) {
    const postData = {
      UserId: 0,
      AuditCategoryMasterId: 3,
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
          setIsUpdating(false);
          if (count == 0) {
            window.location.reload();
          } else {
          }
        } else {
          setIsUpdating(false);
          setDialogOpen(false);
          setMessage(res.data.StatusMessage);
          setSnackOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setDialogOpen(false);
        setSnackOpen(true);
        setMessage('Failed to Audit');
      });
  }

  const handleClick = () => {
    clearErrors('startIp');
    clearErrors('endIp');
    setValue('startIp', '0.0.0.0');
    setValue('endIp', '0.0.0.0');
  };

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '32ch' }
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
          <Grid item xs={3}>
            <FormControl
              variant="filled"
              sx={{ marginTop: '8px', width: '32ch', m: 1 }}
            >
              <InputLabel required id="demo-simple-select-filled-label">
                Role Name
              </InputLabel>
              <Controller
                name="rname"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <Select
                    labelId="demo-simple-select-filled"
                    {...register('rname')}
                    id="demo-simple-select"
                    value={value}
                    disabled={isEdit}
                    label="Role Name"
                    onChange={(event) => {
                      onChange(event);
                      handleRolechange(event);
                    }}
                  >
                    {roleData.map((c, i) => (
                      <MenuItem key={`c-${i}`} value={c.role_id}>
                        {c.role_name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.rname && (
                <p
                  style={{
                    color: '#FF1943',
                    fontSize: '13px',
                    fontWeight: 'bold'
                  }}
                >
                  {errors.rname.message}
                </p>
              )}
            </FormControl>
          </Grid>
          {roleId == 3 || roleId == 5 || roleId == 4 ? (
            <Grid item xs={3}>
              <FormControl
                variant="filled"
                sx={{ marginTop: '8px', width: '32ch', m: 1 }}
              >
                <InputLabel required id="demo-simple-select-filled-label">
                  Client Name
                </InputLabel>
                <Controller
                  name="cname"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value } }) => (
                    <Select
                      labelId="demo-simple-select-filled"
                      {...register('cname')}
                      id="demo-simple-select"
                      value={value}
                      disabled={!clientData?.length}
                      label="Client Name"
                      onChange={(event) => {
                        onChange(event);
                        handleClientChange(event);
                      }}
                    >
                      {clientData.map((c, i) => (
                        <MenuItem key={`c-${i}`} value={c.client_id}>
                          {c.client_name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.cname && (
                  <p
                    style={{
                      color: '#FF1943',
                      fontSize: '13px',
                      fontWeight: 'bold'
                    }}
                  >
                    {errors.cname.message}
                  </p>
                )}
              </FormControl>
            </Grid>
          ) : (
            ''
          )}
          {roleId == 4 || roleId == 5 ? (
            <Grid item xs={3}>
              <FormControl
                variant="filled"
                sx={{ marginTop: '8px', width: '32ch', m: 1 }}
              >
                <InputLabel required id="demo-simple-select-filled-label">
                  Provider Name
                </InputLabel>
                <Controller
                  name="pname"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value } }) => (
                    <Select
                      labelId="demo-simple-select-filled"
                      {...register('pname')}
                      id="demo-simple-select"
                      value={value}
                      disabled={!providerData?.length}
                      label="Provider Name"
                      onChange={(event) => {
                        onChange(event);
                        handleProviderChange(event);
                      }}
                    >
                      {providerData.map((c, i) => (
                        <MenuItem key={`c-${i}`} value={c.ProviderId}>
                          {c.ProviderName}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.pname && (
                  <p
                    style={{
                      color: '#FF1943',
                      fontSize: '13px',
                      fontWeight: 'bold'
                    }}
                  >
                    {errors.pname.message}
                  </p>
                )}
              </FormControl>
            </Grid>
          ) : (
            ''
          )}
          {roleId == 5 ? (
            <Grid item xs={3}>
              <FormControl
                variant="filled"
                sx={{ marginTop: '8px', width: '32ch', m: 1 }}
              >
                <InputLabel required id="demo-simple-select-filled-label">
                  Patient Name
                </InputLabel>
                <Controller
                  name="ppname"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value } }) => (
                    <Select
                      labelId="demo-simple-select-filled"
                      {...register('ppname')}
                      id="demo-simple-select"
                      value={value}
                      disabled={!patientData?.length}
                      label="Patient Name"
                      onChange={(event) => {
                        onChange(event);
                        handlePatientChange(event);
                      }}
                    >
                      {patientData.map((c, i) => (
                        <MenuItem key={`c-${i}`} value={c.PatientId}>
                          {c.FirstName},{c.LastName}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.ppname && (
                  <p
                    style={{
                      color: '#FF1943',
                      fontSize: '13px',
                      fontWeight: 'bold'
                    }}
                  >
                    {errors.ppname.message}
                  </p>
                )}
              </FormControl>
            </Grid>
          ) : (
            ''
          )}
          <Grid item xs={3}>
            <Controller
              name="fname"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="First Name"
                  required
                  variant="filled"
                  {...register('fname')}
                  error={errors.fname ? true : false}
                  helperText={errors.fname?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              name="lname"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="lname"
                  required
                  label="Last Name"
                  variant="filled"
                  {...register('lname')}
                  error={errors.lname ? true : false}
                  helperText={errors.lname?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              name="uname"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
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
          <Grid item xs={3}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  id="email"
                  label="Email"
                  variant="filled"
                  {...register('email')}
                  error={errors.email ? true : false}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>
          {buttonStatus === 'Submit' ? (
            <Grid item xs={3}>
              <Controller
                name="cpwd"
                control={control}
                render={({ field }) => (
                  <TextField
                    sx={{ width: '38ch' }}
                    required
                    {...field}
                    id="cpwd"
                    type={showPassword1 ? 'text' : 'password'}
                    label="Password"
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
              <Link
                variant="h6"
                color="primary"
                onClick={generateNewPassword}
                sx={{
                  cursor: 'pointer',
                  float: 'right',
                  paddingRight: '18px',
                  fontSize: '15px !important',
                  textDecoration: 'underline'
                }}
              >
                {' '}
                Generate Password
              </Link>
            </Grid>
          ) : (
            ''
          )}
          <Grid item xs={3}>
            <Controller
              name="mobNo"
              control={control}
              render={({ field }) => (
                <TextField
                  id="mobNo"
                  {...field}
                  label="Mobile Number"
                  variant="filled"
                  {...register('mobNo')}
                  error={errors.mobNo ? true : false}
                  helperText={errors.mobNo?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="filled-multiline-flexible"
                  label="Address"
                  multiline
                  maxRows={2}
                  variant="filled"
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Autocomplete
              disableClearable
              open={open}
              onOpen={() => {
                setOpen(true);
              }}
              onClose={() => {
                setOpen(false);
              }}
              getOptionLabel={(option) => option.zip}
              isOptionEqualToValue={(option, value) => option.zip === value.zip}
              value={zip}
              options={options}
              loading={loading}
              onChange={onZipChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Zip"
                  variant="filled"
                  {...register('zip')}
                  onChange={(ev) => {
                    if (ev.target.value !== '' || ev.target.value !== null) {
                      onChangeHandle(ev.target.value);
                    }
                  }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <Fragment>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </Fragment>
                    )
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  disabled
                  id="city"
                  label="City"
                  {...register('city')}
                  variant="filled"
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  disabled
                  id="state"
                  label="State"
                  {...register('state')}
                  variant="filled"
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              name="startIp"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  id="startIp"
                  label="Start-IP Address"
                  {...register('startIp')}
                  variant="filled"
                  error={errors.startIp ? true : false}
                  helperText={errors.startIp?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              name="endIp"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  id="endIp"
                  label="End-IP Address"
                  {...register('endIp')}
                  variant="filled"
                  error={errors.endIp ? true : false}
                  helperText={errors.endIp?.message}
                />
              )}
            />
          </Grid>
        </Grid>
        <Box>
          <Typography variant="body1" gutterBottom>
            Don't have IP Address?
            <Link onClick={handleClick} sx={{ cursor: 'pointer' }}>
              {' '}
              Add Default IP Address 0.0.0.0
            </Link>
          </Typography>
        </Box>
        <Grid container>
          <Grid item xs={3}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ marginTop: '13px', marginLeft: '8px' }}
              endIcon={<SendIcon />}
            >
              {buttonStatus}
            </Button>
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
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AddUser;
