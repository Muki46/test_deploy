import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import {
  Autocomplete,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import Box from '@mui/material/Box';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useAxios } from 'pages/services';
import { useState, useEffect, forwardRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { DNA } from 'react-loader-spinner';
import moment from 'moment';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AddSnp(data) {
  const [axios] = useAxios();
  const [snackopen, setSnackOpen] = useState(false);
  const [dopen, setDialogOpen] = useState(false);
  const [severity, setSeverity] = useState('info');
  const [buttonStatus, setButtonStatus] = useState('Submit');
  const [message, setMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [geneSnpMappingId, setGeneSnpMappingId] = useState(0);
  const [geneSnpData, setGeneSnpData] = useState([]);
  const [snpGetData, setSnpGetData] = useState<any>(null);
  const [snpMappingId, setSnpMappingId] = useState(0);

  const validationSchema = Yup.object().shape({
    gname: Yup.array()
      .min(1, 'Atleast one Gene is required')
      .required('Gene is required'),
    snp: Yup.string().required('SNP  is required'),
    status: Yup.string().notRequired()
  });

  const {
    control,
    register,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      gname: [],
      snp: '',
      status: ''
    },
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = (data) => {
    clearErrors('gname');
    setIsUpdating(true);
    setDialogOpen(true);
    console.log(severity);
    var postData = {
      CategoryGeneSnpMappingId: 0,
      CategoryGeneMappingId: snpMappingId,
      Snp: data.snp,
      Status: 1,
      CreatedBy: localStorage.getItem('UserId'),
      CreatedDate: moment(new Date()).format('MM-DD-YYYY'),
      ModifiedBy: localStorage.getItem('UserId'),
      ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
    };
    var postUpdateData = {
      CategoryGeneSnpMappingId: geneSnpMappingId,
      CategoryGeneMappingId: snpMappingId,
      Snp: data.snp,
      Status: data.status,
      ModifiedBy: localStorage.getItem('UserId'),
      ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
    };
    buttonStatus === 'Submit'
      ? createCategoryGeneSnpMapping(postData)
      : updateCategoryGeneSnpMapping(postUpdateData);
  };

  async function createCategoryGeneSnpMapping(data) {
    axios
      .post('Category/CreateCategoryGeneSnpMapping', data)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setIsUpdating(false);
          setMessage('SNP Created');
          setSnackOpen(true);
          setDialogOpen(false);
          setSeverity('success');
          postAduitLog(data.Snp + ' SNP has been created successfully');
        } else {
          setIsUpdating(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
          setDialogOpen(false);
          postAduitLog(data.Snp + ' SNP creation failed');
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setMessage('Failed To Create SNP');
        setSnackOpen(true);
        setSeverity('error');
        setDialogOpen(false);
        window.location.reload();
      });
  }

  async function updateCategoryGeneSnpMapping(data) {
    axios
      .put('Category/UpdateCategoryGeneSnpMapping', data)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setIsUpdating(false);
          setDialogOpen(false);
          setMessage('Snp Updated');
          setSnackOpen(true);
          setSeverity('success');
          window.location.reload();
        } else {
          setIsUpdating(false);
          setDialogOpen(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setDialogOpen(false);
        setMessage('Failed To Update SNP');
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

  useEffect(() => {
    console.log(data.props);
    if (data.props == 0) {
      getCategoryGeneSnpOpeningData(data.props);
      setButtonStatus('Submit');
    } else {
      setButtonStatus('Update');
      setGeneSnpMappingId(data.props);
      getCategoryGeneSnpMappingById(data.props);
    }
  }, []);

  async function getCategoryGeneSnpOpeningData(id) {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get('Category/GetCategoryGeneSnpOpeningData')
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setGeneSnpData(res.data.Data);
          if (id !== 0) {
            const val = res.data.Data.filter((obj) => {
              return obj.CategoryGeneMappingId === id;
            });
            console.log(val);
            setValue('gname', val);
            setSnpGetData(val[0]);
          }
          setIsUpdating(false);
          setDialogOpen(false);
        } else {
          setIsUpdating(false);
          setDialogOpen(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setDialogOpen(false);
        setMessage('Failed to fetch  details');
        setSeverity('error');
        setSnackOpen(true);
      });
  }

  async function getCategoryGeneSnpMappingById(geneSnpId) {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get('Category/GetCategoryGeneSnpMappingById/' + geneSnpId)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setValue('snp', res.data.Data.Snp);
          setSnpMappingId(res.data.Data.CategoryGeneMappingId);
          getCategoryGeneSnpOpeningData(res.data.Data.CategoryGeneMappingId);
          setValue('status', res.data.Data.Status);
          setIsUpdating(false);
          setDialogOpen(false);
        } else {
          setIsUpdating(false);
          setDialogOpen(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setDialogOpen(false);
        setMessage('Failed to fetch SNP details');
        setSeverity('error');
        setSnackOpen(true);
      });
  }

  const onGeneSnpChange = (e, value, reason) => {
    console.log(e);
    console.log(value);
    clearErrors('gname');
    if (value != null) {
      const newArray = [];
      newArray.push(value);
      console.log(newArray);
      setValue('gname', newArray);
      setSnpMappingId(value.CategoryGeneMappingId);
      setSnpGetData(value);
    }
    if (reason === 'clear') {
      setValue('gname', []);
      setSnpMappingId(0);
      setSnpGetData(null);
    }
  };

  async function postAduitLog(message) {
    const postData = {
      UserId: 0,
      AuditCategoryMasterId: 7,
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
        setMessage('Failed to Audit');
      });
  }

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1 }
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
          <Grid item xs={5}>
            <Controller
              control={control}
              name="gname"
              rules={{ required: true }}
              render={() => (
                <Autocomplete
                  sx={{ display: 'inline-flex', width: '60ch' }}
                  options={geneSnpData}
                  value={snpGetData}
                  getOptionLabel={(option) =>
                    `${
                      option.Gene +
                      ' | ' +
                      option.SubCategoryName +
                      ' | ' +
                      option.CategoryName
                    }`
                  }
                  onChange={onGeneSnpChange}
                  renderInput={(params) => (
                    <TextField
                      required
                      {...params}
                      label="Gene"
                      variant="filled"
                      error={errors.gname ? true : false}
                      helperText={errors.gname?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={3} sx={{ marginLeft: '28px' }}>
            <Controller
              name="snp"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ width: '32ch' }}
                  required
                  {...field}
                  id="snpName"
                  label="SNP"
                  variant="filled"
                  {...register('snp')}
                  error={errors.snp ? true : false}
                  helperText={errors.snp?.message}
                />
              )}
            />
          </Grid>
          {buttonStatus == 'Update' ? (
            <Grid item xs={3}>
              <FormControl
                variant="filled"
                sx={{ marginTop: '8px', width: '32ch', m: 1 }}
              >
                <InputLabel id="demo-simple-select-filled-label">
                  Status
                </InputLabel>
                <Controller
                  name="status"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value } }) => (
                    <Select
                      labelId="demo-simple-select-filled"
                      {...register('status')}
                      id="demo-simple-select"
                      value={value}
                      label="status"
                      onChange={onChange}
                    >
                      <MenuItem value={1}>Active</MenuItem>
                      <MenuItem value={0}>Inactive</MenuItem>
                    </Select>
                  )}
                />
                {errors.status && (
                  <p
                    style={{
                      color: '#FF1943',
                      fontSize: '13px',
                      fontWeight: 'bold'
                    }}
                  >
                    {errors.status.message}
                  </p>
                )}
              </FormControl>
            </Grid>
          ) : (
            ''
          )}
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

export default AddSnp;
