import Head from 'next/head';
import { useState, useEffect, Fragment, forwardRef } from 'react';
import SidebarLayout from '@/layouts/SidebarLayout';
import Skeleton from '@mui/material/Skeleton';
import SendIcon from '@mui/icons-material/Send';
import {
  Grid,
  Typography,
  CardContent,
  Card,
  Container,
  Box,
  IconButton,
  Divider,
  Button,
  TextField,
  Autocomplete,
  Snackbar,
  Alert
} from '@mui/material';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import Footer from '@/components/Footer';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { useAxios } from 'pages/services';
import { Controller, useForm } from 'react-hook-form';
import CircularProgress from '@mui/material/CircularProgress';
import moment from 'moment';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { DNA } from 'react-loader-spinner';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
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
const thumbsContainer = {
  display: 'flex',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 150,
  height: 150,
  padding: 4
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img1 = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 350,
  height: 90,
  padding: 4
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

function Account() {
  interface AccountUser {
    AccountName: string;
    AccountLogo: string;
    Email: string;
    Phone: string;
    Address: string;
    City: string;
    State: string;
    Zip: string;
    Fax: string;
  }
  const validationSchema = Yup.object().shape(
    {
      aname: Yup.string().required('Account Name is required'),
      address: Yup.string().notRequired(),
      zip: Yup.string().notRequired(),
      city: Yup.string().notRequired(),
      state: Yup.string().notRequired(),
      fax: Yup.string().notRequired(),
      pname: Yup.string().notRequired(),
      tzone: Yup.string().notRequired(),
      phone: Yup.string()
        .nullable()
        .notRequired()
        .when('mobNo', {
          is: (value) => value?.length,
          then: (rule) => rule.min(10)
        })
    },
    [
      // Add Cyclic deps here because when require itself
      ['mobNo', 'mobNo']
    ]
  );

  const [axios] = useAxios();
  const [loading, setLoading] = useState(false);
  const [snackopen, setSnackOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [zip, setZip] = useState<any>({ zip: '', state: '', city: '' });
  const [AccountDetails, setAccountdetails] = useState<AccountUser>();
  const [openload, setOpenload] = useState(false);
  const [options, setOptions] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [dopen, setDialogOpen] = useState(false);
  const onloading = openload && options.length === 0;
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [logo, setLogo] = useState('');
  const [base64URL, setBase64URL] = useState(null);
  const [files, setFiles] = useState([]);
  const [buttondisable, setbuttondisable] = useState(true);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: (acceptedFiles) => {
      setLogo('New Image');
      setBase64URL(acceptedFiles[0]);
      getBase64(acceptedFiles[0]);
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    }
  });
  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  const getBase64 = (file) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setBase64URL(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  };

  useEffect(() => {
    if (logo === '' || logo == null || logo === undefined) {
      setbuttondisable(true);
    } else {
      setbuttondisable(false);
    }
  }, [logo]);

  const handleOpen = () => {
    setOpen(true);
  };

  const popupHandleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  const handleClose = (event, reason) => {
    console.log(event);
    if (reason && reason == 'backdropClick' && 'escapeKeyDown') return;
     myCloseModal();
  };

  function myCloseModal() {
     setOpen(false);
  }

  function handlecloseclick ()
  {
    setOpen(false);
    const accountId = localStorage.getItem('AccountId');
    getAccountById(accountId);
  }

  useEffect(() => {
    const accountId = localStorage.getItem('AccountId');
    getAccountById(accountId);
  }, []);

  const {
    control,
    setValue,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      aname: '',
      address: '',
      zip: '',
      city: '',
      state: '',
      phone: '',
      fax: '',
      pname: '',
      tzone: ''
    },
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = (data) => {
    var postData = {
      AccountId: 1,
      AccountName: data.aname,
      AccountLogo: base64URL === null ? logo : base64URL,
      Address: data.address,
      City: city,
      State: state,
      Zip: data.zip,
      Phone: data.phone,
      Fax: data.fax,
      ContactPersonName: '',
      ContactPersonPhone: '',
      ContactPersonEmail: '',
      TimeZone: '',
      CreatedBy: localStorage.getItem('UserId'),
      CreatedDate: moment(new Date()).format('MM-DD-YYYY'),
      ModifiedBy: localStorage.getItem('UserId'),
      ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
    };
    updateAccount(postData);
  };

  async function getAccountById(accountId) {
    setLoading(true);
    setIsUpdating(true);
    setDialogOpen(true);
    axios
      .get(`Accounts/GetAccountById/${accountId}`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setAccountdetails(res.data.Data);
          const val = { city: 'Wake', state: 'VA', zip: res.data.Data.Zip };
          setZip(val);
          setValue('aname', res.data.Data.AccountName);
          setValue('address', res.data.Data.Address);
          setValue('zip', val.zip);
          setValue('city', res.data.Data.City);
          setValue('state', res.data.Data.State);
          setValue('phone', res.data.Data.Phone);
          setValue('fax', res.data.Data.Fax);
          setCity(res.data.Data.City);
          setState(res.data.Data.State);
          setLogo(res.data.Data.AccountLogo);
          setLoading(false);
          setIsUpdating(false);
          setDialogOpen(false);
        } else {
          setLoading(false);
          setSnackOpen(true);
          setIsUpdating(false);
          setDialogOpen(false);
          setMessage(res.data.StatusMessage);
        }
      })
      .catch((err) => {
        console.log(err);
        setSnackOpen(true);
        setMessage('Failed');
        setIsUpdating(false);
        setDialogOpen(false);
      });
  }

  const closePopup=()=>
    {
      setOpen(false);
      const accountId = localStorage.getItem('AccountId');
      getAccountById(accountId);
    }

  async function updateAccount(data) {
    setIsUpdating(true);
    setDialogOpen(true);
    setLoading(true);
    axios
      .put(`Accounts/UpdateAccount`, data)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          localStorage.removeItem('AccountLogo');
          localStorage.setItem('AccountLogo', res.data.Data);
          setLoading(false);
          setSnackOpen(true);
          setMessage('updated Successfully');
          setIsUpdating(false);
          setDialogOpen(false);
          setTimeout(closePopup,2000);
        } else {
          setLoading(false);
          setSnackOpen(true);
          setIsUpdating(false);
          setDialogOpen(false);
          setMessage(res.data.StatusMessage);
        }
      })
      .catch((err) => {
        console.log(err);
        setSnackOpen(true);
        setIsUpdating(false);
        setDialogOpen(false);
        setMessage('Failed to update');
      });
  }

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

  const onChangeHandle = async (value) => {
    // use the changed value to make request and then use the result. Which
    console.log(value);
    if (value.length >= 3) {
      const response = await axios.get(
        'Patients/ZIPSearch?searchText=' + value
      );
      const zip = await response.data;
      setOptions(zip);
    }
  };

  return (
    <>
      <Head>
        <title>Account</title>
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
            <Card>
              <Box
                p={3}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h4" gutterBottom>
                    Account Details
                  </Typography>
                </Box>
                <Button
                  variant="text"
                  startIcon={<EditTwoToneIcon />}
                  onClick={handleOpen}
                >
                  Edit
                </Button>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <IconButton
                      onClick={()=>
                        {
                          handlecloseclick();
                        }
                      }
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
                    <Box>
                      <Grid
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
                              <Controller
                                name="aname"
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    required
                                    id="aname"
                                    label="Account Name"
                                    {...register('aname')}
                                    variant="filled"
                                    error={errors.aname ? true : false}
                                    helperText={errors.aname?.message}
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
                                    id="address"
                                    label="Address"
                                    {...register('address')}
                                    variant="filled"
                                  />
                                )}
                              />
                            </Grid>

                            <Grid item xs={3}>
                              <Autocomplete
                                open={openload}
                                onOpen={() => {
                                  setOpenload(true);
                                }}
                                onClose={() => {
                                  setOpenload(false);
                                }}
                                getOptionLabel={(option) => option.zip}
                                isOptionEqualToValue={(option, value) =>
                                  option.zip === value.zip
                                }
                                options={options}
                                value={zip}
                                loading={onloading}
                                onChange={onZipChange}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Zip"
                                    variant="filled"
                                    {...register('zip')}
                                    onChange={(ev) => {
                                      if (
                                        ev.target.value !== '' ||
                                        ev.target.value !== null
                                      ) {
                                        onChangeHandle(ev.target.value);
                                      }
                                    }}
                                    InputProps={{
                                      ...params.InputProps,
                                      endAdornment: (
                                        <Fragment>
                                          {onloading ? (
                                            <CircularProgress
                                              color="inherit"
                                              size={20}
                                            />
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
                                    disabled
                                    {...field}
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
                                    disabled
                                    {...field}
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
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    id="phone"
                                    label="Phone"
                                    {...register('phone')}
                                    variant="filled"
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <Controller
                                name="fax"
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    id="fax"
                                    label="Fax"
                                    {...register('fax')}
                                    variant="filled"
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <Controller
                                name="pname"
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    id="pname"
                                    label="Contact Person Name"
                                    variant="filled"
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <Controller
                                name="tzone"
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    id="tzone"
                                    label="Time Zone"
                                    variant="filled"
                                    {...register('tzone')}
                                  />
                                )}
                              />
                            </Grid>
                            <Grid
                              item
                              xs={5}
                              sx={{
                                borderRadius: '10px',
                                background: 'rgba(0, 0, 0, 0.06)',
                                marginTop: '10px'
                              }}
                            >
                              <section
                                className="container"
                                style={{
                                  width: '49ch',
                                  marginLeft: '20px',
                                  marginTop: '5px'
                                }}
                              >
                                <div
                                  {...getRootProps({ className: 'dropzone' })}
                                >
                                  <input {...getInputProps()} />
                                  <CloudUploadIcon fontSize="large" />
                                  <div>
                                    Drop files or click here to upload
                                    AccountLogo
                                  </div>
                                </div>
                                {logo == 'New Image' ? (
                                  <aside style={thumbsContainer}>
                                    {thumbs}
                                  </aside>
                                ) : (
                                  <aside style={thumbsContainer}>
                                    <img src={logo} style={img1} />
                                  </aside>
                                )}
                              </section>
                              <span
                                style={{ color: 'red', fontWeight: 'bold' }}
                              >
                                ** IMAGE STANDARD SIZE WOULD BE 350*150 PX
                              </span>
                            </Grid>
                            <Grid item xs={12}>
                              <Button
                                type="submit"
                                disabled={buttondisable}
                                variant="contained"
                                size="large"
                                sx={{ marginTop: '13px', marginLeft: '8px' }}
                                endIcon={<SendIcon />}
                              >
                                Update
                              </Button>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'center'
                                }}
                              >
                                <Snackbar
                                  open={snackopen}
                                  autoHideDuration={6000}
                                  onClose={popupHandleClose}
                                  anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center'
                                  }}
                                >
                                  <Alert
                                    onClose={popupHandleClose}
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
                      </Grid>
                    </Box>
                  </Box>
                </Modal>
              </Box>
              <Divider />
              <CardContent sx={{ p: 4 }}>
                <Typography variant="subtitle2">
                  <Grid container spacing={0}>
                    <Grid
                      item
                      xs={12}
                      sm={1}
                      md={1}
                      textAlign={{ sm: 'right' }}
                    >
                      <Box pr={3} pb={2}>
                        Name:
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={11} md={11}>
                      <b>
                        {loading ? (
                          <Skeleton animation="wave" width={230} />
                        ) : (
                          AccountDetails?.AccountName
                        )}
                      </b>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={1}
                      md={1}
                      textAlign={{ sm: 'right' }}
                    >
                      <Box pr={3} pb={2}>
                        Phone:
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={11} md={11}>
                      <b>
                        {loading ? (
                          <Skeleton animation="wave" width={230} />
                        ) : (
                          AccountDetails?.Phone
                        )}
                      </b>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={1}
                      md={1}
                      textAlign={{ sm: 'right' }}
                    >
                      <Box pr={1.5} pb={2}>
                        Address:
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={11} md={11}>
                      <Box sx={{ maxWidth: { xs: 'auto', sm: 300 } }}>
                        {loading ? (
                          <Skeleton animation="wave" width={230} />
                        ) : (
                          AccountDetails?.Address +
                          ' ' +
                          AccountDetails?.City +
                          ' ' +
                          AccountDetails?.State +
                          ' ' +
                          AccountDetails?.Zip
                        )}
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={1}
                      md={1}
                      textAlign={{ sm: 'right' }}
                    >
                      <Box pr={3} pb={2}>
                        Logo:
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={11} md={11}>
                      <b>
                        {loading ? (
                          <Skeleton animation="wave" width={230} />
                        ) : (
                          <img
                            src={AccountDetails?.AccountLogo}
                            width={180}
                            height={35}
                          />
                        )}
                      </b>
                    </Grid>
                  </Grid>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
Account.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;
export default Account;
