import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import {
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

function AddCategory(data) {
  const [axios] = useAxios();
  const [snackopen, setSnackOpen] = useState(false);
  const [dopen, setDialogOpen] = useState(false);
  const [severity, setSeverity] = useState('info');
  const [buttonStatus, setButtonStatus] = useState('Submit');
  const [message, setMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [categoryId, setCategoryId] = useState(0);
  const [ReportNameData, setReportNameData] = useState([]);

  const validationSchema = Yup.object().shape({
    rname: Yup.string().required('Report Name is required'),
    cname: Yup.string().required('Category Name is required'),
    Categorydescription: Yup.string().nullable().notRequired(),
    status:Yup.string().notRequired()
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
      cname: '',
      Categorydescription: '',
      status:''
    },
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = (data) => {
    setIsUpdating(true);
    setDialogOpen(true);
    console.log(severity);
    var postData = {
      ReportMasterId: data.rname,
      CategoryName: data.cname,
      CategoryIntroduction: data.Categorydescription,
      Status: 1,
      CreatedBy: localStorage.getItem('UserId'),
      CreatedDate: moment(new Date()).format('MM-DD-YYYY'),
      ModifiedBy: localStorage.getItem('UserId'),
      ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
    };

    var postUpdateData = {
      CategoryId: categoryId,
      ReportMasterId: data.rname,
      CategoryName: data.cname,
      Status:data.status,
      CategoryDescription: data.Categorydescription,
      ModifiedBy: localStorage.getItem('UserId'),
      ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
    };
    buttonStatus === 'Submit'
      ? createReportCategory(postData)
      : updateReportCategory(postUpdateData);
  };

  async function createReportCategory(data) {
    axios
      .post('Category/CreateReportCategory', data)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setIsUpdating(false);
          setMessage('Category Created');
          setSnackOpen(true);
          setDialogOpen(false);
          setSeverity('success');
          postAduitLog(data.CategoryName  + " Category Name has been created successfully")
        } else {
          setIsUpdating(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
          setDialogOpen(false);
          postAduitLog(data.CategoryName  + " Category Name creation failed")
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setMessage('Failed To Create Category');
        setSnackOpen(true);
        setSeverity('error');
        setDialogOpen(false);
        window.location.reload();
      });
  }

  async function updateReportCategory(data) {
    axios
      .put('Category/UpdateReportCategory', data)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setIsUpdating(false);
          setDialogOpen(false);
          setMessage('Category Updated');
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
        setMessage('Failed To Update Category');
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
      getReportCategoryById(data.props);
    }
    getCategoryOpeningData();
  }, []);

  async function getCategoryOpeningData() {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get('Category/GetCategoryOpeningData')
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setReportNameData(res.data.Data);
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

  async function getReportCategoryById(categoryId) {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get('Category/GetReportCategoryById/' + categoryId)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setValue('rname', res.data.Data.ReportMasterId);
          setValue('cname', res.data.Data.CategoryName);
          setValue('Categorydescription', res.data.Data.CategoryIntroduction);
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
        '& .MuiTextField-root': { m: 1, width: '43ch' }
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
            <FormControl
              variant="filled"
              sx={{ marginTop: '8px', width: '43ch', m: 1 }}
            >
              <InputLabel required id="demo-simple-select-filled-label">
                Report Name
              </InputLabel>
              <Controller
                name="rname"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <Select
                    required
                    labelId="demo-simple-select-filled"
                    {...register('rname')}
                    id="demo-simple-select"
                    value={value}
                    label="Report Name"
                    onChange={(e) => {
                      onChange(e);
                      //   handleClientChange(e);
                    }}
                  >
                    {ReportNameData.map((c, i) => (
                      <MenuItem key={`c-${i}`} value={c.CategoryId}>
                        {c.CategoryName}
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
          <Grid item xs={4}>
            <Controller
              name="cname"
              control={control}
              render={({ field }) => (
                <TextField
                  required
                  {...field}
                  id="catValue"
                  label="Category Name"
                  variant="filled"
                  {...register('cname')}
                  error={errors.cname ? true : false}
                  helperText={errors.cname?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              name="Categorydescription"
              control={control}
              render={({ field }) => (
                <TextField
                  rows={4}
                  multiline
                  {...field}
                  id="Category-Description"
                  label="Category-Description"
                  {...register('Categorydescription')}
                  error={errors.Categorydescription ? true : false}
                  helperText={errors.Categorydescription?.message}
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
                  status
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

export default AddCategory;
