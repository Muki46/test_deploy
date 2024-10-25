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

function AddColor(data) {
  const [axios] = useAxios();
  const [snackopen, setSnackOpen] = useState(false);
  const [dopen, setDialogOpen] = useState(false);
  const [severity, setSeverity] = useState('info');
  const [buttonStatus, setButtonStatus] = useState('Submit');
  const [message, setMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [colorId, setColorId] = useState(0);

  const validationSchema = Yup.object().shape({
    Color: Yup.string()
    .required('Color is required'),
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
      Color: '',
      status: ''
    },
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = (data) => {
    setIsUpdating(true);
    setDialogOpen(true);
    console.log(severity);
    var postData = {
      ColorName: data.Color,
      CreatedBy: localStorage.getItem('UserId'),
      CreatedDate: moment(new Date()).format('MM-DD-YYYY'),
      ModifiedBy: localStorage.getItem('UserId'),
      ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
    };
    var postUpdateData = {
      ColorId:colorId ,
      ColorName: data.Color,
      Status: data.status,
      ModifiedBy: localStorage.getItem('UserId'),
      ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
    };
    buttonStatus === 'Submit'
      ? CreateColor(postData)
      : updateColor(postUpdateData);
  };

  async function CreateColor(data) {
    axios
      .post('Master/CreateColor', data)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setIsUpdating(false);
          setMessage('Color Created');
          setSnackOpen(true);
          setDialogOpen(false);
          setSeverity('success');
          window.location.reload();
        } else {
          setIsUpdating(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
          setDialogOpen(false);
          setTimeout(reload, 1000);
          
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setMessage('Failed To Create Color');
        setSnackOpen(true);
        setSeverity('error');
        setDialogOpen(false);
        setTimeout(reload, 1000);
      });
  }

const reload = () => {
  window.location.reload();
}

  async function updateColor(data) {
    axios
      .put('Master/UpdateColor', data)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setIsUpdating(false);
          setDialogOpen(false);
          setMessage('Color Updated');
          setSnackOpen(true);
          setSeverity('success');
          setTimeout(reload, 1000);
        } else {
          setIsUpdating(false);
          setDialogOpen(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
          setTimeout(reload, 1000);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setDialogOpen(false);
        setMessage('Failed To Update Color');
        setSnackOpen(true);
        setSeverity('error');
        setTimeout(reload, 1000);
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
      setColorId(data.props);
      getColorById(data.props);
    }
  }, []);

 

  async function getColorById(colorId) {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get('Master/getColorById/' + colorId)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setValue('status', res.data.Data.Status);
          setValue('Color' , res.data.Data.ColorName);
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
        setMessage('Failed to fetch Color details');
        setSeverity('error');
        setSnackOpen(true);
      });
  }



  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1 ,width:'43ch'}
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
          <Grid item xs={4} >
            <Controller
              name="Color"
              control={control}
              render={({ field }) => (
                <TextField
                  required
                  {...field}
                  id="ColorName"
                  label="Color Name"
                  variant="filled"
                  {...register('Color')}
                  error={errors.Color ? true : false}
                  helperText={errors.Color?.message}
                />
              )}
            />
          </Grid>
          {buttonStatus == 'Update' ? (
            <Grid item xs={3}>
              <FormControl
                variant="filled"
                sx={{ marginTop: '8px', width: '43ch', m: 1 }}
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

export default AddColor;
