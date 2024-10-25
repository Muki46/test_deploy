import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import {
  FormControl,
  Grid,
  MenuItem,
  InputLabel,
  TextField,
  Select,
  Autocomplete
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
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  width: 150,
  height: 150,
  padding: 4
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

function AddGene(data) {
  const [axios] = useAxios();
  const [snackopen, setSnackOpen] = useState(false);
  const [dopen, setDialogOpen] = useState(false);
  const [severity, setSeverity] = useState('info');
  const [buttonStatus, setButtonStatus] = useState('Submit');
  const [message, setMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [categoryGeneMappingId, SetcategoryGeneMappingId] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [base64URL, setBase64URL] = useState(null);
  const [categoryid, setCategoryid] = useState(0);
  const [subCategoryid, setSubCategoryid] = useState(0);
  const [GeneData, setGeneData] = useState<any>(null);
  const [subCategoryValue, setSubCategoryValue] = useState<any>(null);
  const [logo, setLogo] = useState('');
  const [files, setFiles] = useState([]);

  const validationSchema = Yup.object().shape({
    cname: Yup.array()
      .min(1, 'At least one category is required')
      .required('Category Name is required'),
    scname: Yup.array()
      .min(1, 'At least sub category is required')
      .required('Sub Category Name is required'),
    Gene: Yup.string().required('Gene is required'),
    Genedescription: Yup.string().notRequired(),
    status:Yup.string().notRequired()
  });

  const {
    control,
    register,
    clearErrors,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      cname: [],
      scname: [],
      Gene: '',
      Genedescription: '',
      status:''
    },
    resolver: yupResolver(validationSchema)
  });

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
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

  const onSubmit = (data) => {
    setIsUpdating(true);
    setDialogOpen(true);
    console.log(severity);
    var postData = {
      CategoryGeneMappingId: 0,
      CategoryId: categoryid,
      SubCategoryId: subCategoryid,
      Gene: data.Gene,
      GeneDescription: data.Genedescription,
      GeneImage: base64URL === null ? logo : base64URL,
      Status: 1,
      CreatedBy: localStorage.getItem('UserId'),
      CreatedDate: moment(new Date()).format('MM-DD-YYYY'),
      ModifiedBy: localStorage.getItem('UserId'),
      ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
    };
    var postUpdateData = {
      CategoryGeneMappingId: categoryGeneMappingId,
      CategoryId: categoryid,
      SubCategoryId: subCategoryid,
      Gene: data.Gene,
      GeneDescription: data.Genedescription,
      GeneImage: base64URL === null ? logo : base64URL,
      Status: data.status,
      ModifiedBy: localStorage.getItem('UserId'),
      ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
    };

    buttonStatus === 'Submit'
      ? CreateCategoryGeneMapping(postData)
      : updateCategoryGeneMappingById(postUpdateData);
  };

  async function CreateCategoryGeneMapping(data) {
    axios
      .post('Category/CreateCategoryGeneMapping', data)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setIsUpdating(false);
          setMessage('Gene Created');
          setSnackOpen(true);
          setDialogOpen(false);
          setSeverity('success');
          postAduitLog(data.Gene  + " Gene has been created successfully");
        } else {
          setIsUpdating(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
          setDialogOpen(false);
          postAduitLog(data.Gene  + " Gene creation failed");
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setMessage('Failed To Create Gene');
        setSnackOpen(true);
        setSeverity('error');
        setDialogOpen(false);
        window.location.reload();
      });
  }

  async function updateCategoryGeneMappingById(data) {
    axios
      .put('Category/UpdateCategoryGeneMappingById', data)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setIsUpdating(false);
          setDialogOpen(false);
          setMessage('Gene Updated');
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
        setMessage('Failed To Update Gene');
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
      getCategoryGeneOpeningData(data.props);
      setButtonStatus('Submit');
    } else {
      setButtonStatus('Update');
      SetcategoryGeneMappingId(data.props);
      getCategoryGeneMappingById(data.props);
    }
  }, []);

  async function getCategoryGeneOpeningData(id) {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get('Category/GetCategoryGeneOpeningData')
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setCategoryData(res.data.Data);
          if (id !== 0) {
            const val = res.data.Data.filter((obj) => {
              return obj.CategoryId === id;
            });
            setValue('cname', val);
            console.log(val);
            setGeneData(val[0]);
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
        setMessage('Failed to fetch Data');
        setSeverity('error');
        setSnackOpen(true);
      });
  }

  const onCategoryChange = (e, value, reason) => {
    clearErrors('cname');
    console.log(e);
    if (value != null) {
      console.log(value.CategoryId);
      setCategoryid(value.CategoryId);
      const newArray = [];
      newArray.push(value);
      console.log(newArray);
      setValue('cname', newArray);
      getSubCategoryByCategoryId(value.CategoryId, 0);
    }
    if (reason === 'clear') {
      setCategoryid(0);
      setSubCategoryData([]);
      setSubCategoryid(0);
      setGeneData(null);
      setValue('cname', []);
      setValue('scname', []);
      setSubCategoryValue(null);
    }
    setGeneData(value);
  };

  async function getSubCategoryByCategoryId(CategoryId, id) {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get(`Category/GetSubCategoryByCategoryId/${CategoryId}`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setSubCategoryData(res.data.Data);
          if (id !== 0) {
            const val = res.data.Data.filter((obj) => {
              return obj.SubCategoryId === id;
            });
            setValue('scname', val);
            console.log(val);
            setSubCategoryValue(val[0]);
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
        setMessage('Failed to fetch Data');
        setSeverity('error');
        setSnackOpen(true);
      });
  }

  const onSubCategoryChange = (e, value) => {
    clearErrors('scname');
    console.log(e);
    if (value != null) {
      const newArray = [];
      newArray.push(value);
      console.log(newArray);
      setValue('scname', newArray);
      setSubCategoryid(value.SubCategoryId);
    }
    setSubCategoryValue(value);
  };

  async function getCategoryGeneMappingById(geneMappingId) {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get('Category/GetCategoryGeneMappingById/' + geneMappingId)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          getCategoryGeneOpeningData(res.data.Data.CategoryId);
          getSubCategoryByCategoryId(
            res.data.Data.CategoryId,
            res.data.Data.SubCategoryId
          );
          setCategoryid(res.data.Data.CategoryId);
          setSubCategoryid(res.data.Data.SubCategoryId);
          setValue('Gene', res.data.Data.Gene);
          setValue('Genedescription', res.data.Data.GeneDescription);
          setLogo(res.data.Data.GeneImage);
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
            <Controller
              control={control}
              name="cname"
              rules={{ required: true }}
              render={() => (
                <Autocomplete
                  sx={{ display: 'inline-flex', width: '55ch' }}
                  options={categoryData}
                  getOptionLabel={(option) => option.CategoryName}
                  value={GeneData}
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
              control={control}
              name="scname"
              rules={{ required: true }}
              render={() => (
                <Autocomplete
                  sx={{ display: 'inline-flex', width: '55ch' }}
                  options={subCategoryData}
                  getOptionLabel={(option) => option.SubCategoryName}
                  value={subCategoryValue}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  onChange={onSubCategoryChange}
                  renderInput={(params) => (
                    <TextField
                      required
                      {...params}
                      label="Sub Category Name"
                      variant="filled"
                      error={errors.scname ? true : false}
                      helperText={errors.scname?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              name="Gene"
              control={control}
              render={({ field }) => (
                <TextField
                  required
                  {...field}
                  id="Gene"
                  label="Gene Name"
                  variant="filled"
                  {...register('Gene')}
                  error={errors.Gene ? true : false}
                  helperText={errors.Gene?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              name="Genedescription"
              control={control}
              render={({ field }) => (
                <TextField
                  rows={4}
                  multiline
                  {...field}
                  id="Gene-Description"
                  label="Gene-Description"
                  {...register('Genedescription')}
                  error={errors.Genedescription ? true : false}
                  helperText={errors.Genedescription?.message}
                  variant="filled"
                />
              )}
            />
          </Grid>
          <Grid item xs={3} sx={{ marginLeft: '18px', marginTop: '20px' }}>
            <section className="container">
              <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <CloudUploadIcon fontSize="large" />
                <div> click here to upload Gene Image</div>
              </div>
              {logo == 'New Image' ? (
                <aside style={thumbsContainer}>{thumbs}</aside>
              ) : (
                <aside style={thumbsContainer}>
                  <img src={logo} style={img1} />
                </aside>
              )}
            </section>
          </Grid>
          {buttonStatus == 'Update' ? (
            <Grid item xs={4}>
              <FormControl
                variant="filled"
                sx={{ marginTop: '8px', width: '32ch', m: 1,marginLeft:'10ch' }}
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

export default AddGene;
