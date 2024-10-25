import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { Grid } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import Interpretation from 'pages/components/interpretations';
import { StyledEngineProvider } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
import { useDropzone } from 'react-dropzone';
import { List, ListItem } from '@wfp/ui';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import '@wfp/ui/assets/css/styles.css';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { DNA } from 'react-loader-spinner';
import Drawer from '@mui/material/Drawer';
import parse from 'date-fns/parse';
import ReportView from 'pages/components/reportView';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AddPatient(data) {
  const [axios] = useAxios();
  const [snackopen, setSnackOpen] = useState(false);
  const [severity, setSeverity] = useState('Success');
  const [patientId, setPatientId] = useState(0);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [dropen, setDrOpen] = useState(false);
  const [rropen, setRrOpen] = useState(false);
  const [zip, setZip] = useState<any>({ zip: '', state: '', city: '' });
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [options, setOptions] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [lpId, setLpId] = useState('');
  const loading = open && options.length === 0;
  const [dopen, setDialogOpen] = useState(false);
  const [isReportGenerated, setIsReportGenerated] = useState(false);
  const [buttonStatus, setButtonStatus] = useState('Submit');
  const [reportFile, setReportFile] = useState(null);
  const [dnafileUrl, setDNAFileUrl] = useState(null);
  const [clientdata, setClientdata] = useState([]);
  const [base64File, setbase64File] = useState(null);
  const [providerData, setProviderData] = useState([]);
  const [externalReport, setExternalReport] = useState([]);
  const [multiFileData, setmultiFileData] = useState([]);

  function multipleFileUpload(files) {
    const fileArray = [];
    files.forEach((element) => {
      const reader = new FileReader();
      reader.readAsDataURL(element);
      reader.onload = (e) => {
        console.log(element);
        console.log(e);
        console.log(reader.result);
        fileArray.push({
          fileName: element.name,
          fileType: element.type,
          base64: reader.result
        });
      };
    });
    setmultiFileData(fileArray);
  }

  function onDrop(files) {
    setbase64File(files[0]);
    console.log(base64File);
  }

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: isReportGenerated,
    maxFiles: 1,
    accept: {
      'text/plain': ['.txt']
    }
  });

  const fileList = acceptedFiles.map((file) => (
    <ListItem key={file.name}>
      {file.name} - {Math.round(file.size / 1000)} kB
    </ListItem>
  ));

  const {
    acceptedFiles: MutilpleFiles,
    getRootProps: getRootProps1,
    getInputProps: getInputProps1
  } = useDropzone({
    onDrop: multipleFileUpload,
    multiple: true
  });

  const MutipleList = MutilpleFiles.map((file) => (
    <ListItem key={file.name}>
      {file.name} - {Math.round(file.size / 1000)} kB
    </ListItem>
  ));

  const validationSchema = Yup.object().shape({
    fname: Yup.string().required('First Name is required'),
    lname: Yup.string().required('Last Name is required'),
    gender: Yup.string().required('Gender is required'),
    dob: Yup.date()
      .transform(function (value, originalValue) {
        if (this.isType(value)) {
          return value;
        }
        const result = parse(originalValue, 'MM.dd.yyyy', value);
        return result;
      })
      .nullable()
      .typeError('please enter a valid date')
      .required('DOB Date is required'),
    pname: Yup.string().required('Provider Name is required'),
    cname: Yup.string().required('Client Name is required'),
    address: Yup.string().nullable().notRequired(),
    zip: Yup.string().nullable().notRequired(),
    city: Yup.string().nullable().notRequired(),
    state: Yup.string().nullable().notRequired(),
    stype: Yup.string().required('Specimen Type is required'),
    cmethod: Yup.string().required('Collection Method is required'),
    cdate: Yup.date()
      .transform(function (value, originalValue) {
        if (this.isType(value)) {
          return value;
        }
        const result = parse(originalValue, 'MM.dd.yyyy', value);
        return result;
      })
      .nullable()
      .typeError('please enter a valid date')
      .required('Collection Date is required'),

    email: Yup.string()
      .nullable()
      .notRequired()
      .when('email', {
        is: (value) => value?.length,
        then: (rule) => rule.email('Email is invalid')
      })
  },
  [
    // Add Cyclic deps here because when require itself
    ['email', 'email']

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

  const toggleDrawer = (newOpen: boolean) => () => {
    setDrOpen(newOpen);
  };

  const toggleRDrawer = (newOpen: boolean) => () => {
    setRrOpen(newOpen);
  };

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      fname: '',
      lname: '',
      dob: null,
      gender: '',
      pname: '',
      address: '',
      email: '',
      zip: '',
      city: '',
      state: '',
      stype: 'Oral',
      cmethod: 'Oral Swab',
      cdate: null,
      cname: ''
    },
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = (data) => {
    setIsUpdating(true);
    setDialogOpen(true);
    const externalReportFileUrl = [];
    console.log(multiFileData);
    if (multiFileData.length > 0) {
      console.log('checking...');
      for (var i = 0; i < multiFileData.length; i++) {
        console.log(multiFileData[i]);
        externalReportFileUrl.push({
          ppatient_id: 0,
          preport_name: multiFileData[i].fileName,
          preport_url: multiFileData[i].base64,
          preport_type: multiFileData[i].fileType,
          ppatient_attachments_id: 0
        });
      }
    }

    var postData = {
      PatientId: 0,
      FirstName: data.fname,
      LastName: data.lname,
      Gender: data.gender,
      DateOfBirth: data.dob,
      Address: data.address,
      City: city,
      State: state,
      Zip: data.zip,
      Email: data.email,
      SpecimenType: data.stype,
      CollectionMethod: data.cmethod,
      PatientGeneFile: '',
      PatientAttachments: externalReportFileUrl,
      CollectionDate: data.cdate,
      ProviderId: data.pname,
      ClientId: data.cname,
      Status: 1,
      CreatedBy: localStorage.getItem('UserId'),
      CreatedDate: moment(new Date()).format('MM-DD-YYYY'),
      ModifiedBy: localStorage.getItem('UserId'),
      ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
    };
    buttonStatus === 'Submit'
      ? createPatient(postData)
      : updatePatient(postData);
  };

  async function createPatient(data) {
    console.log(data);
    axios
      .post('Patients/CreatePatient', data)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          if (fileList.length > 0) {
            setPatientId(res.data.Data);
            uploadPatientGeneFile(res.data.Data, data.FirstName, data.LastName);
          } else {
            setIsUpdating(false);
            setMessage('Patient Created');
            setSnackOpen(true);
            setSeverity('success');
            postAduitLog(
              data.FirstName +
                ', ' +
                data.LastName +
                ' has been created successfully'
            );
          }
        } else {
          setIsUpdating(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
          postAduitLog(
            data.FirstName + ', ' + data.LastName + 'creation failed'
          );
        }
      })
      .catch((err) => {
        console.log(severity);
        console.log(err);
        setIsUpdating(false);
        setMessage('Failed To Create Patient');
        setSnackOpen(true);
        setSeverity('error');
        window.location.reload();
      });
  }

  async function uploadPatientGeneFile(patientId, pfname, plname) {
    let formData = new FormData();
    const userId = localStorage.getItem('UserId');
    for (var i = 0; i < acceptedFiles.length; i++) {
      let file = acceptedFiles[i];
      formData.append('file', file);
    }
    axios
      .post(
        'Patients/CreatePatientGeneFile/' +
          patientId +
          '/' +
          userId +
          '/' +
          moment(new Date()).format('MM-DD-YYYY'),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      .then((res) => {
        console.log(res);
        if (res.data.StatusCode == 200) {
          if (pfname !== '') {
            postAduitLog(
              pfname + ', ' + plname + ' has been created successfully'
            );
          }
          setDNAFileUrl(res.data.Data);
          setIsUpdating(false);
          setMessage(
            'Patient DNA File Interpretation Ready. Please Click on View'
          );
          setSnackOpen(true);
          setSeverity('success');
        } else {
          setButtonStatus('Update');
          setIsUpdating(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setMessage('Failed to create DNA File');
        setSeverity('error');
        setSnackOpen(true);
      });
  }

  async function updatePatient(data) {
    if (dnafileUrl == '' || dnafileUrl == null) {
      data.PatientGeneFile = '';
    } else {
      data.PatientGeneFile = dnafileUrl;
    }
    data.PatientId = patientId;
    axios
      .put('Patients/UpdatePatient', data)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          if (fileList.length > 0) {
            uploadPatientGeneFile(data.PatientId, '', '');
          } else {
            setIsUpdating(false);
            setMessage('Patient Updated');
            setSnackOpen(true);
            setSeverity('success');
            window.location.reload();
          }
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
        setMessage('Failed To Update Patient');
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
      const zip = await response.data;
      setOptions(zip);
    }
  };

  useEffect(() => {
    setIsUpdating(true);
    setDialogOpen(true);
    console.log(data.props);
    getPatientsOpeningData();
    if (data.props == 0) {
      setButtonStatus('Submit');
    } else {
      setButtonStatus('Update');
      setPatientId(data.props);
      getPatientById(data.props);
    }
  }, []);

  const handleClientChange = (e) => {
    setProviderData([]);
    setValue('pname', '');
    console.log(e);
    const selectedClientId = e.target.value;
    console.log(selectedClientId);
    if (selectedClientId != null) {
      getProviderListByClientId(selectedClientId, 0, roleName);
    }
  };

  async function getProviderListByClientId(clientId, providerId, rname) {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get(`Providers/GetProviderListByClientId/${clientId}`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          console.log(res.data.Data);
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
          }
          setDialogOpen(false);
          setIsUpdating(false);
        } else {
          setSnackOpen(true);
          setIsUpdating(false);
          setMessage(res.data.StatusMessage);
        }
      })
      .catch((err) => {
        console.log(err);
        setSnackOpen(true);
        setIsUpdating(false);
        setMessage('Failed to get provider list');
      });
  }

  async function getPatientsOpeningData() {
    const rName = localStorage.getItem('RoleName');
    const clientId = localStorage.getItem('ClientId');
    const providerId = localStorage.getItem('ProviderId');
    await axios
      .get(`Patients/GetPatientsOpeningData/${clientId}`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setRoleName(rName);
          setLpId(providerId);
          setClientdata(res.data.Data.ClientPatientOpeningDatas);
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
        setIsUpdating(false);
        setSeverity('error');
        setSnackOpen(true);
        setMessage('Failed to load Provider data');
      });
  }

  async function getPatientById(patientId) {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get('Patients/GetPatientsbyId/' + patientId)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          const rolName = localStorage.getItem('RoleName');
          const val = {
            city: 'Wake',
            state: 'VA',
            zip: res.data.Data.PatientDetailsReportMasters[0].zip
          };
          setZip(val);
          setValue(
            'fname',
            res.data.Data.PatientDetailsReportMasters[0].first_name
          );
          setValue(
            'lname',
            res.data.Data.PatientDetailsReportMasters[0].last_name
          );
          setValue(
            'gender',
            res.data.Data.PatientDetailsReportMasters[0].gender
          );
          setValue(
            'dob',
            res.data.Data.PatientDetailsReportMasters[0].date_of_birth
          );
          setValue('zip', val.zip);
          setValue(
            'pname',
            res.data.Data.PatientDetailsReportMasters[0].provider_id
          );
          setValue('email', res.data.Data.PatientDetailsReportMasters[0].email);
          setValue(
            'cname',
            res.data.Data.PatientDetailsReportMasters[0].client_id
          );
          if (rolName === 'Provider') {
            if (
              res.data.Data.PatientDetailsReportMasters[0].isreportgenerated ===
              true
            ) {
              setIsReportGenerated(true);
            }
          }

          getProviderListByClientId(
            res.data.Data.PatientDetailsReportMasters[0].client_id,
            res.data.Data.PatientDetailsReportMasters[0].provider_id,
            rolName
          );
          setValue(
            'address',
            res.data.Data.PatientDetailsReportMasters[0].address
          );
          setValue('city', res.data.Data.PatientDetailsReportMasters[0].city);
          setValue('state', res.data.Data.PatientDetailsReportMasters[0].state);
          setValue(
            'stype',
            res.data.Data.PatientDetailsReportMasters[0].specimen_type
          );
          setValue(
            'cmethod',
            res.data.Data.PatientDetailsReportMasters[0].collection_method
          );
          setValue(
            'cdate',
            res.data.Data.PatientDetailsReportMasters[0].collection_date
          );
          setDNAFileUrl(
            res.data.Data.PatientDetailsReportMasters[0].gene_file_url
          );
          setReportFile(
            res.data.Data.PatientDetailsReportMasters[0].report_url
          );
          setCity(res.data.Data.PatientDetailsReportMasters[0].city);
          setState(res.data.Data.PatientDetailsReportMasters[0].state);

          setExternalReport(res.data.Data.PatientAttachmentReportMasters);
          console.log(res.data.Data.PatientAttachmentReportMasters);
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
        setIsUpdating(false);
        setMessage('Failed to fetch patient details');
        setSeverity('error');
        setSnackOpen(true);
      });
  }

  async function postAduitLog(message) {
    const postData = {
      UserId: 0,
      AuditCategoryMasterId: 2,
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
          setIsUpdating(false);
          setSeverity('success');
          setSnackOpen(true);
          window.location.reload();
        } else {
          setIsUpdating(false);
          setSeverity('error');
          setMessage(res.data.StatusMessage);
          setSnackOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setSeverity('error');
        setMessage('Failed to create');
        setSnackOpen(true);
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
            <Controller
              name="fname"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  id="fname"
                  disabled={isReportGenerated}
                  label="First Name"
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
                  required
                  id="lname"
                  label="Last Name"
                  disabled={isReportGenerated}
                  variant="filled"
                  {...register('lname')}
                  error={errors.lname ? true : false}
                  helperText={errors.lname?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl
              variant="filled"
              sx={{ marginTop: '8px', width: '32ch', m: 1 }}
            >
              <InputLabel required id="demo-simple-select-filled-label">
                Gender
              </InputLabel>
              <Controller
                name="gender"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <Select
                    required
                    labelId="demo-simple-select-filled"
                    {...register('gender')}
                    id="demo-simple-select"
                    value={value}
                    disabled={isReportGenerated}
                    label="Gender"
                    onChange={onChange}
                  >
                    <MenuItem value={''}>Choose Gender</MenuItem>
                    <MenuItem value={'Male'}>Male</MenuItem>
                    <MenuItem value={'Female'}>Female</MenuItem>
                  </Select>
                )}
              />
              {errors.gender && (
                <p
                  style={{
                    color: '#FF1943',
                    fontSize: '13px',
                    fontWeight: 'bold'
                  }}
                >
                  {errors.gender.message}
                </p>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="dob"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    disableFuture={true}
                    disabled={isReportGenerated}
                    renderInput={(params) => (
                      <TextField
                        variant="filled"
                        required
                        {...params}
                        error={errors.dob ? true : false}
                        helperText={errors.dob?.message}
                      />
                    )}
                    label="Date Of Birth"
                    onChange={(newValue) => {
                      field.onChange(newValue);
                      setValue('dob', newValue);
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
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
                    required
                    labelId="demo-simple-select-filled"
                    {...register('cname')}
                    id="demo-simple-select"
                    value={value}
                    disabled={isReportGenerated}
                    label="Client Name"
                    onChange={(e) => {
                      onChange(e);
                      handleClientChange(e);
                    }}
                  >
                    {clientdata.map((c, i) => (
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
            <FormControl
              variant="filled"
              sx={{ marginTop: '8px', width: '32ch', m: 1 }}
            >
              <InputLabel required id="demo-simple-select-filled-label">
                Provider
              </InputLabel>
              <Controller
                name="pname"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <Select
                    required
                    labelId="demo-simple-select-filled"
                    {...register('pname')}
                    id="demo-simple-select"
                    value={value}
                    disabled={isReportGenerated}
                    label="Provider"
                    onChange={onChange}
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
          <Grid item xs={3}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="filled-multiline-flexible"
                  disabled={isReportGenerated}
                  label="Address"
                  multiline
                  maxRows={2}
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
                  disabled={isReportGenerated}
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
              name="stype"
              control={control}
              render={({ field }) => (
                <TextField
                  required
                  {...field}
                  id="stype"
                  label="Specimen Type"
                  disabled={isReportGenerated}
                  variant="filled"
                  {...register('stype')}
                  error={errors.stype ? true : false}
                  helperText={errors.stype?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              name="cmethod"
              control={control}
              render={({ field }) => (
                <TextField
                  required
                  {...field}
                  id="cmethod"
                  label="Collection Method"
                  disabled={isReportGenerated}
                  variant="filled"
                  {...register('cmethod')}
                  error={errors.cmethod ? true : false}
                  helperText={errors.cmethod?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="cdate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    disabled={isReportGenerated}
                    disableFuture={true}
                    renderInput={(params) => (
                      <TextField
                        variant="filled"
                        required
                        {...params}
                        error={errors.cdate ? true : false}
                        helperText={errors.cdate?.message}
                      />
                    )}
                    label="Collection Date"
                    onChange={(newValue) => {
                      field.onChange(newValue);
                      setValue('cdate', newValue);
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid container>
            <Grid
              item
              xs={5}
              sx={{
                margin: '12px',
                border: '3px dotted #eee',
                padding: '15px'
              }}
            >
              <section className="container">
                <div {...getRootProps({ className: 'dropzone' })}>
                  <input {...getInputProps()} />
                  <CloudUploadIcon fontSize="large" />
                  <div
                    style={{
                      color: 'red',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    Drop files or click here to upload DNA file
                  </div>
                </div>
                <aside className="wfp--dropzone__file-list">
                  <h4>Files</h4>
                  <List>
                    {buttonStatus === 'Submit' ||
                    dnafileUrl == null ||
                    dnafileUrl == '' ||
                    fileList.length > 0 ? (
                      fileList
                    ) : (
                      <a href={dnafileUrl} target="_blank" rel="noreferrer">
                        DNA Sample
                      </a>
                    )}
                  </List>
                </aside>
              </section>
            </Grid>
            <Grid
              item
              xs={5}
              sx={{
                margin: '12px',
                border: '3px dotted #eee',
                padding: '15px'
              }}
            >
              <section className="container">
                <div {...getRootProps1({ className: 'dropzone' })}>
                  <input {...getInputProps1()} />
                  <CloudUploadIcon fontSize="large" />
                  <div
                    style={{
                      color: '#000',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    Drop files or click here for other reports
                  </div>
                </div>
                <aside className="wfp--dropzone__file-list">
                  <h4>Files</h4>
                  <List>
                    {buttonStatus === 'Submit' || MutipleList.length > 0
                      ? MutipleList
                      : externalReport.map((c, index) => (
                          // eslint-disable-next-line react/jsx-key
                          <div>
                            <a
                              key={`c-${index}`}
                              href={c.report_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {c.report_name}
                            </a>
                          </div>
                        ))}
                  </List>
                </aside>
              </section>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              disabled={isReportGenerated}
              size="large"
              sx={{ marginTop: '13px', marginLeft: '8px' }}
              endIcon={<SendIcon />}
            >
              {buttonStatus}
            </Button>

            {dnafileUrl === null || dnafileUrl === '' ? (
              ''
            ) : (
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                sx={{ marginTop: '13px', marginLeft: '8px' }}
                onClick={toggleDrawer(true)}
              >
                View Interpretation
              </Button>
            )}
            <Drawer
              style={{ zIndex: '1399' }}
              open={dropen}
              anchor="right"
              onClose={toggleDrawer(false)}
            >
              <StyledEngineProvider injectFirst>
                <Interpretation patientId={patientId} />
              </StyledEngineProvider>
            </Drawer>
            <Drawer
              style={{ zIndex: '1399' }}
              open={rropen}
              anchor="bottom"
              onClose={toggleRDrawer(false)}
            >
              <StyledEngineProvider injectFirst>
                <ReportView patientId={patientId} />
              </StyledEngineProvider>
            </Drawer>
            {reportFile === null || reportFile === '' ? (
              ''
            ) : (
              <Button
                variant="outlined"
                color="success"
                size="large"
                sx={{ marginTop: '13px', marginLeft: '8px' }}
                onClick={toggleRDrawer(true)}
              >
                Report
              </Button>
            )}
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

export default AddPatient;
