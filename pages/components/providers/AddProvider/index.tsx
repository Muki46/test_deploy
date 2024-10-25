import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
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

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AddProvider(data) {
  const [axios] = useAxios();
  const [snackopen, setSnackOpen] = useState(false);
  const [dopen, setDialogOpen] = useState(false);
  const [severity, setSeverity] = useState('info');
  const [open, setOpen] = useState(false);
  const [buttonStatus, setButtonStatus] = useState('Submit');
  const [providerId, setProviderId] = useState(0);
  const [message, setMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [zip, setZip] = useState<any>({ zip: '' });
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [options, setOptions] = useState([]);
  const [clientData, setClientData] = useState([]);
  const loading = open && options.length === 0;

  const validationSchema = Yup.object().shape(
    {
      cname: Yup.string().required('Client Name is required'),
      pname: Yup.string().required('Provider Name is required'),
      address: Yup.string().nullable().notRequired(),
      zip: Yup.string().nullable().notRequired(),
      city: Yup.string().nullable().notRequired(),
      state: Yup.string().nullable().notRequired(),
      email: Yup.string()
        .nullable()
        .notRequired()
        .when('email', {
          is: (value) => value?.length,
          then: (rule) => rule.email('Email is invalid')
        }),
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
      ['email', 'email'],
      ['mobNo', 'mobNo'],
      ['address', 'address']
    ]
  );

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

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      cname: '',
      pname: '',
      address: '',
      zip: '',
      city: '',
      state: '',
      email: '',
      mobNo: ''
    },
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = (data) => {
    setIsUpdating(true);
    console.log(severity);
    setDialogOpen(true);
    console.log(data);
    var postData = {
      ProviderId: 0,
      Providername: data.pname,
      ClientId: data.cname,
      Address: data.address,
      City: city,
      State: state,
      Zip: data.zip,
      Phone: data.mobNo,
      Email: data.email,
      CreatedBy: localStorage.getItem('UserId'),
      CreatedDate: moment(new Date()).format('MM-DD-YYYY'),
      ModifiedBy: localStorage.getItem('UserId'),
      ModifiedDate: moment(new Date()).format('MM-DD-YYYY'),
      Status: 1
    };
    buttonStatus === 'Submit'
      ? createProvider(postData)
      : updateProvider(postData);
    console.log(data);
  };

  async function createProvider(data) {
    axios
      .post('Providers/CreateProvider', data)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          postAduitLog(data.Providername + ' has been created successfully');
          setIsUpdating(false);
          setMessage('Provider Created');
          setSnackOpen(true);
          setSeverity('success');
        } else {
          postAduitLog(data.Providername + ' creation failed');
          setIsUpdating(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setMessage('Failed To Create Provider');
        setSnackOpen(true);
        setSeverity('error');
      });
  }

  async function updateProvider(data) {
    data.ProviderId = providerId;
    axios
      .put('Providers/UpdateProvider', data)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setIsUpdating(false);
          setMessage('Provider Updated');
          setSnackOpen(true);
          setSeverity('success');
          window.location.reload();
        } else {
          setIsUpdating(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setMessage('Failed To Update Provider');
        setSnackOpen(true);
        setSeverity('error');
        window.location.reload();
      });
  }

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  const onChangeHandle = async (value) => {
    // use the changed value to make request and then use the result. Which
    console.log(value);
    if (value.length >= 3) {
      const response = await axios.get(
        'Patients/ZIPSearch?searchText=' + value
      );
      const countries = await response.data;
      setOptions(countries);
    }
  };

  useEffect(() => {
    setIsUpdating(true);
    setDialogOpen(true);
    console.log(data.props);
    getProviderOpeningData();
    if (data.props == 0) {
      setButtonStatus('Submit');
    } else {
      setButtonStatus('Update');
      setProviderId(data.props);
      getProviderById(data.props);
    }
  }, []);

  async function getProviderOpeningData() {
    const clientId = localStorage.getItem('ClientId');
    await axios
      .get(`Providers/GetProviderOpeningData/${clientId}`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setClientData(res.data.Data.ProviderClientMaster);
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
        setSnackOpen(true);
        setIsUpdating(false);
        setMessage('Failed to load provider opening data');
      });
  }

  async function getProviderById(providerId) {
    setIsUpdating(true);
    setDialogOpen(true);
    const response = await axios.get(
      'Providers/GetProvidersById/' + providerId
    );
    if (response.data.StatusCode == 200) {
      const val = { city: 'Wake', state: 'VA', zip: response.data.Data.Zip };
      setZip(val);
      setValue('pname', response.data.Data.Providername);
      setValue('cname', response.data.Data.ClientId);
      setValue('email', response.data.Data.Email);
      setValue('mobNo', response.data.Data.Phone);
      setValue('zip', response.data.Data.Zip);
      setValue('address', response.data.Data.Address);
      setValue('city', response.data.Data.City);
      setValue('state', response.data.Data.State);
      setCity(response.data.Data.City);
      setState(response.data.Data.State);
      setIsUpdating(false);
      setDialogOpen(false);
    } else {
      setMessage(response.data.message);
      setIsUpdating(false);
      setDialogOpen(false);
    }
  }

  async function postAduitLog(message) {
    const postData = {
      UserId: 0,
      AuditCategoryMasterId: 5,
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
          window.location.reload();
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
        setMessage('Failed to Create');
      });
  }

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
                    onChange={onChange}
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
          <Grid item xs={3}>
            <Controller
              name="pname"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  id="pname"
                  label="Provider Name"
                  variant="filled"
                  {...register('pname')}
                  error={errors.pname ? true : false}
                  helperText={errors.pname?.message}
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
                  {...register('address')}
                  variant="filled"
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Autocomplete
              open={open}
              onOpen={() => {
                setOpen(true);
              }}
              onClose={() => {
                setOpen(false);
              }}
              getOptionLabel={(option) => option.zip}
              isOptionEqualToValue={(option, value) => option.zip === value.zip}
              options={options}
              value={zip}
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
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
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
          <Grid item xs={3}>
            <Controller
              name="mobNo"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="mobNo"
                  label="Mobile Number"
                  variant="filled"
                  {...register('mobNo')}
                  error={errors.mobNo ? true : false}
                  helperText={errors.mobNo?.message}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container>
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
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AddProvider;
