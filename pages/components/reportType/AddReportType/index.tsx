import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import {
  FormControl,
  Grid,
  MenuItem,
  InputLabel,
  TextField,
  Select
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

function AddReportType(data) {
  const [axios] = useAxios();
  const [snackopen, setSnackOpen] = useState(false);
  const [dopen, setDialogOpen] = useState(false);
  const [severity, setSeverity] = useState('info');
  const [buttonStatus, setButtonStatus] = useState('Submit');
  const [message, setMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [categoryId, setCategoryId] = useState(0);

  const validationSchema = Yup.object().shape({
    rname: Yup.string().required('Report Name is required'),
    GeneticPredisposition: Yup.string().required(
      'Genetic Predisposition is required'
    ),
    ImportantTakeways: Yup.string().required('ImportantTakeways is required'),
    status: Yup.string().notRequired()
  });

  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      rname: '',
      GeneticPredisposition: '',
      ImportantTakeways: '',
      status: ''
    },
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = (data) => {
    setIsUpdating(true);
    setDialogOpen(true);
    console.log(severity);
    var postData = {
      CategoryName: data.rname,
      ReportGenePredisposition: data.GeneticPredisposition,
      ReportImportantTakeways: data.ImportantTakeways,
      Status: 1,
      CreatedBy: localStorage.getItem('UserId'),
      CreatedDate: moment(new Date()).format('MM-DD-YYYY'),
      ModifiedBy: localStorage.getItem('UserId'),
      ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
    };
    var postUpdateData = {
      ReportMasterId: categoryId,
      CategoryName: data.rname,
      ReportGenePredisposition: data.GeneticPredisposition,
      ReportImportantTakeways: data.ImportantTakeways,
      Status: data.status,
      ModifiedBy: localStorage.getItem('UserId'),
      ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
    };
    buttonStatus === 'Submit'
      ? createCategory(postData)
      : updateCategory(postUpdateData);
  };

  async function createCategory(data) {
    axios
      .post('Category/CreateCategory', data)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setIsUpdating(false);
          setMessage('ReportName Created');
          setSnackOpen(true);
          setDialogOpen(false);
          setSeverity('success');
          postAduitLog(
            data.CategoryName + '  Report Name has been created successfully'
          );
        } else {
          setIsUpdating(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
          setDialogOpen(false);
          postAduitLog(data.CategoryName + ' Report Name creation failed');
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setMessage('Failed To Create ReportName');
        setSnackOpen(true);
        setSeverity('error');
        setDialogOpen(false);
        window.location.reload();
      });
  }

  async function updateCategory(data) {
    axios
      .put('Category/UpdateCategory', data)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setIsUpdating(false);
          setDialogOpen(false);
          setMessage('ReportName  Updated');
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
        setMessage('Failed To Update ReportName');
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
      setButtonStatus('Submit');
    } else {
      setButtonStatus('Update');
      setCategoryId(data.props);
      getCategoryById(data.props);
    }
  }, []);

  async function getCategoryById(categoryId) {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get('Category/GetCategoryById/' + categoryId)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setValue('rname', res.data.Data.ReportName);
          setValue(
            'GeneticPredisposition',
            res.data.Data.ReportGenePredisposition
          );
          setValue('ImportantTakeways', res.data.Data.ReportImportantTakeways);
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
        setMessage('Failed to fetch category details');
        setSeverity('error');
        setSnackOpen(true);
      });
  }

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
        '& .MuiTextField-root': { m: 1, width: '42ch' }
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
          <Grid item xs={4}>
            <Controller
              name="rname"
              control={control}
              render={({ field }) => (
                <TextField
                  required
                  {...field}
                  id="catValue"
                  label="Report Name"
                  variant="filled"
                  {...register('rname')}
                  error={errors.rname ? true : false}
                  helperText={errors.rname?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              name="GeneticPredisposition"
              control={control}
              render={({ field }) => (
                <TextField
                  rows={4}
                  multiline
                  fullWidth
                  {...field}
                  id="Genetic-Predisposition"
                  label="Genetic-Predisposition"
                  {...register('GeneticPredisposition')}
                  error={errors.GeneticPredisposition ? true : false}
                  helperText={errors.GeneticPredisposition?.message}
                  required
                  variant="filled"
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              name="ImportantTakeways"
              control={control}
              render={({ field }) => (
                <TextField
                  rows={4}
                  multiline
                  {...field}
                  id="Important-Takeways"
                  label="Important-Takeways"
                  {...register('ImportantTakeways')}
                  error={errors.ImportantTakeways ? true : false}
                  helperText={errors.ImportantTakeways?.message}
                  required
                  variant="filled"
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

export default AddReportType;
