import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { Autocomplete, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
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

function AddSubCategory(data) {
  const [axios] = useAxios();
  const [snackopen, setSnackOpen] = useState(false);
  const [dopen, setDialogOpen] = useState(false);
  const [severity, setSeverity] = useState('info');
  const [buttonStatus, setButtonStatus] = useState('Submit');
  const [message, setMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [subCategoryId, setSubCategoryId] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [categoryId, setCategoryId] = useState(0);
  const [categoryValue, setCategoryValue] = useState<any>(null);

  const validationSchema = Yup.object().shape({
    cname: Yup.array()
      .min(1, 'Atleast one Category is required')
      .required('Category is required'),
    scname: Yup.string().required('Sub Category Name is required'),
    SubCategorydescription: Yup.string().nullable().notRequired(),
    status:Yup.string().notRequired()
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
      cname: [],
      scname: '',
      SubCategorydescription: '',
      status:''
    },
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = (data) => {
    setIsUpdating(true);
    setDialogOpen(true);
    console.log(severity);
    var postData = {
      CategoryId: categoryId,
      SubCategoryName: data.scname,
      SubCategoryIntroduction: data.SubCategorydescription,
      Status: 1,
      CreatedBy: localStorage.getItem('UserId'),
      CreatedDate: moment(new Date()).format('MM-DD-YYYY'),
      ModifiedBy: localStorage.getItem('UserId'),
      ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
    };
    var postUpdateData = {
      SubCategoryId: subCategoryId,
      CategoryId: categoryId,
      SubCategoryName: data.scname,
      SubCategoryIntroduction: data.SubCategorydescription,
      Status: data.status,
      ModifiedBy: localStorage.getItem('UserId'),
      ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
    };
    buttonStatus === 'Submit'
      ? createSubCategory(postData)
      : updateCategory(postUpdateData);
  };

  async function createSubCategory(data) {
    axios
      .post('Category/CreateSubCategory', data)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setIsUpdating(false);
          setMessage(' Sub category Created');
          setSnackOpen(true);
          setDialogOpen(false);
          setSeverity('success');
          postAduitLog(data.SubCategoryName  + " Subcategory Name has been created successfully");
        } else {
          setIsUpdating(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
          setDialogOpen(false);
          postAduitLog(data.SubCategoryName  + " Subcategory Name creation failed")
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setMessage('Failed To Create Sub category');
        setSnackOpen(true);
        setSeverity('error');
        setDialogOpen(false);
        window.location.reload();
      });
  }

  async function updateCategory(data) {
    axios
      .put('Category/UpdateSubCategory', data)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setIsUpdating(false);
          setDialogOpen(false);
          setMessage('Sub category Updated');
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
        setMessage('Failed To Update Sub category');
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
      getSubCategoryOpeningData(data.props);
    } else {
      setButtonStatus('Update');
      setSubCategoryId(data.props);
      getSubCategoryById(data.props);
    }
  }, []);

  async function getSubCategoryOpeningData(id) {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get('Category/GetSubCategoryOpeningData')
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setCategoryData(res.data.Data);
          if (id !== 0) {
            const val = res.data.Data.filter((obj) => {
              return obj.CategoryId == id;
            });
            console.log(val);
            setValue('cname', val);
            setCategoryValue(val[0]);
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
        setMessage('Failed to fetch Sub category details');
        setSeverity('error');
        setSnackOpen(true);
      });
  }
  const onCategoryChange = (e, value, reason) => {
    console.log(e);
    console.log(value);
    clearErrors('cname');
    if (value != null) {
      const newArray = [];
      newArray.push(value);
      console.log(newArray);
      setValue('cname', newArray);
      setCategoryId(value.CategoryId);
      setCategoryValue(value);
    }
    if (reason === 'clear') {
      setValue('cname', []);
      setCategoryId(0);
      setCategoryValue(null);
    }
  };

  async function getSubCategoryById(subCategoryId) {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get('Category/GetSubCategoryById/' + subCategoryId)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setValue('cname', res.data.Data.CategoryId);
          setCategoryId(res.data.Data.CategoryId);
          getSubCategoryOpeningData(res.data.Data.CategoryId);
          setValue('scname', res.data.Data.SubCategoryName);
          setValue(
            'SubCategorydescription',
            res.data.Data.SubCategoryIntroduction
          );
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
        setMessage('Failed to fetch Sub category details');
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
            <Controller
              control={control}
              name="cname"
              rules={{ required: true }}
              render={() => (
                <Autocomplete
                  sx={{ display: 'inline-flex', width: '55ch' }}
                  options={categoryData}
                  getOptionLabel={(option) => option.CategoryName}
                  value={categoryValue}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  onChange={onCategoryChange}
                  renderInput={(params) => (
                    <TextField
                      required
                      {...params}
                      label="Category Name"
                      variant="filled"
                      error={errors.cname ? true : false}
                      helperText={errors.cname?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              name="scname"
              control={control}
              render={({ field }) => (
                <TextField
                  required
                  {...field}
                  id="catValue"
                  label="Sub Category Name "
                  variant="filled"
                  {...register('scname')}
                  error={errors.scname ? true : false}
                  helperText={errors.scname?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              name="SubCategorydescription"
              control={control}
              render={({ field }) => (
                <TextField
                  rows={4}
                  multiline
                  {...field}
                  id="SubCategory-Description"
                  label="Sub Category-Description"
                  {...register('SubCategorydescription')}
                  error={errors.SubCategorydescription ? true : false}
                  helperText={errors.SubCategorydescription?.message}
                  variant="filled"
                />
              )}
            />
          </Grid>
          {buttonStatus == 'Update' ? (
            <Grid item xs={4}>
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

export default AddSubCategory;
