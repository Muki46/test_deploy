import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import Button from '@mui/material/Button';
import { useState, useEffect, forwardRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { ListItem } from '@wfp/ui';
import MUIDataTable from 'mui-datatables';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Tooltip,
  Divider,
  Typography
} from '@mui/material';
import Footer from '@/components/Footer';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import { useAxios } from 'pages/services';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Select from '@mui/material/Select';
import * as Yup from 'yup';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { DNA } from 'react-loader-spinner';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Drawer from '@mui/material/Drawer';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import moment from 'moment';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const getMuiTheme = () =>
  createTheme({
    components: {
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: '10px 13px',
            fontFamily:
              '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"'
          }
        }
      },
      MuiToolbar: {
        styleOverrides: {
          regular: {
            minHeight: '1px',
            fontWeight: 'bold'
          }
        }
      }
    },
    colors: {
      gradients: {
        blue1: '',
        blue2: '',
        blue3: '',
        blue4: '',
        blue5: '',
        orange1: '',
        orange2: '',
        orange3: '',
        purple1: '',
        purple3: '',
        pink1: '',
        pink2: '',
        green1: '',
        green2: '',
        black1: '',
        black2: ''
      },
      shadows: {
        success: '',
        error: '',
        primary: '',
        warning: '',
        info: ''
      },
      alpha: {
        white: {
          5: '',
          10: '',
          30: '',
          50: '',
          70: '',
          100: ''
        },
        trueWhite: {
          5: '',
          10: '',
          30: '',
          50: '',
          70: '',
          100: ''
        },
        black: {
          5: '',
          10: '',
          30: '',
          50: '',
          70: '',
          100: ''
        }
      },
      secondary: {
        lighter: '',
        light: '',
        main: '',
        dark: ''
      },
      primary: {
        lighter: '',
        light: '',
        main: '',
        dark: ''
      },
      success: {
        lighter: '',
        light: '',
        main: '',
        dark: ''
      },
      warning: {
        lighter: '',
        light: '',
        main: '',
        dark: ''
      },
      error: {
        lighter: '',
        light: '',
        main: '',
        dark: ''
      },
      info: {
        lighter: '',
        light: '',
        main: '',
        dark: ''
      }
    },
    general: {
      reactFrameworkColor: undefined,
      borderRadiusSm: '',
      borderRadius: '',
      borderRadiusLg: '',
      borderRadiusXl: ''
    },
    sidebar: {
      background: undefined,
      boxShadow: undefined,
      width: '',
      textColor: undefined,
      dividerBg: undefined,
      menuItemColor: undefined,
      menuItemColorActive: undefined,
      menuItemBg: undefined,
      menuItemBgActive: undefined,
      menuItemIconColor: undefined,
      menuItemIconColorActive: undefined,
      menuItemHeadingColor: undefined
    },
    header: {
      height: '',
      background: undefined,
      boxShadow: undefined,
      textColor: undefined
    }
  });
function Reports() {
  const [axios] = useAxios();
  const [base64File, setbase64File] = useState(null);
  const [patient, setPatient] = useState([]);
  // const [category, setCategory] = useState([]);
  const [patientId, setPatientId] = useState<any>();
  const [open, setOpen] = useState(false);
  const [dopen, setDialogOpen] = useState(false);
  const [dnafileUrl, setDNAFileUrl] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [loadResult, setResultLoading] = useState(false);
  const [dropen, setDrOpen] = useState(false);
  const [reportUrl, setReportUrl] = useState(null);
  const [snackopen, setSnackOpen] = useState(false);
  const [severity, setSeverity] = useState('Success');
  const [message, setMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [gbtnDisabled, setGBtnDisabled] = useState(true);
  const [clientname, setClient] = useState([]);
  const [patientData, setPatientData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [categoryId, setCategoryId] = useState(0);

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  const gotoUrl = (val) => {
    window.open(val, '_blank');
  };

  const columns = [
    {
      name: 'ReportName',
      label: 'Category',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'SampleId',
      label: 'Sample ID',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'ImportGeneDate',
      label: 'Imported Date',
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          return value === null ? 'NA' : moment(value).format('MM/DD/YYYY');
        },
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        })
      }
    },
    {
      name: 'ReportCreateDate',
      label: 'Report Created Date',
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          return value === null ? 'NA' : moment(value).format('MM/DD/YYYY');
        },
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        })
      }
    },
    {
      name: 'ReportMasterId',
      label: 'Interpretation',
      options: {
        filter: false,
        download: false,
        customBodyRender: (value) => {
          return value === null || value === '' ? (
            'NA'
          ) : (
            <Tooltip placement="top" title="Interpretation" arrow>
              <IconButton
                sx={{ padding: '0px !important' }}
                onClick={toggleDrawer(true, value)}
              >
                <VisibilityIcon color="success" fontSize="small" />
              </IconButton>
            </Tooltip>
          );
        }
      }
    },
    {
      name: 'ReportFileUrl',
      label: 'Report',
      options: {
        filter: false,
        customBodyRender: (value) => {
          return value === null || value === '' ? (
            'NA'
          ) : (
            <Tooltip placement="top" title="Report" arrow>
              <IconButton
                sx={{ padding: '0px !important' }}
                onClick={() => {
                  gotoUrl(value);
                }}
              >
                <PictureAsPdfIcon color="error" fontSize="small" />
              </IconButton>
            </Tooltip>
          );
        }
      }
    }
  ];

  const options = {
    responsive: 'scroll',
    selectableRows: 'none',
    print: false,
    downloadOptions: { filename: 'patient_history.csv', separator: ',' }
  };

  useEffect(() => {
    console.log(reportUrl);
    setIsUpdating(true);
    setDialogOpen(false);
    loadCategories();
  }, []);

  async function loadCategories() {
    const clientid = localStorage.getItem('ClientId');
    await axios
      .get(`Patients/GenerateReportOpeningData/${clientid}`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          console.log(res.data);
          setClient(res.data.Data.ClientReportMasterOpening);
          setIsUpdating(false);
          setDialogOpen(false);
        } else {
          setIsUpdating(false);
          setMessage(res.data.StatusMessage);
          setSeverity('Success');
          setSnackOpen(true);
          setDialogOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setMessage('Failed to load ');
        setSeverity('error');
        setSnackOpen(true);
        setDialogOpen(false);
      });
  }

  const onClientChange = (e, value, reason) => {
    console.log(e);
    if (value !== null) {
      console.log(value.client_id);
      getPatientListByClientId(value.client_id);
      setPatient([]);
      setCategoryData([]);
      setCategoryId(0);
      setReportData([]);
      setDNAFileUrl('');
      setGBtnDisabled(true);
    }
    if (reason === 'clear') {
      console.log(patient);
      setReportData([]);
      setGBtnDisabled(true);
      setDNAFileUrl('');
      setPatientData([]);
      setCategoryData([]);
      setPatient([]);
      setCategoryId(0);
      console.log(patient);
    }
  };
  async function getPatientListByClientId(Id) {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get(`Patients/GetPatientListByClientId/${Id}`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          console.log(res.data.Data);
          setPatientData(res.data.Data.PatientData);
          setCategoryData(res.data.Data.CategoryData);
          setIsUpdating(false);
          setDialogOpen(false);
        } else {
          setMessage(res.data.StatusMessage);
          setSeverity('Success');
          setIsUpdating(false);
          setDialogOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setMessage('Failed to load patient List');
        setSeverity('error');
        setSnackOpen(true);
        setDialogOpen(false);
      });
  }

  function onDrop(files) {
    setDNAFileUrl('');
    setReportUrl('');
    setbase64File(files[0]);
    console.log(patientId);
    if (patientId === undefined || patientId === '' || patientId === null) {
      setGBtnDisabled(true);
    } else {
      setGBtnDisabled(false);
    }

    console.log(base64File);
  }

  const { acceptedFiles, getRootProps, getInputProps, inputRef } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'text/plain': ['.txt']
    }
  });

  const fileList = acceptedFiles.map((file) => (
    <ListItem key={file.name}>{file.name}</ListItem>
  ));

  const removeAll = () => {
    console.log('removeAll...');
    acceptedFiles.length = 0;
    acceptedFiles.splice(0, acceptedFiles.length);
    inputRef.current.value = '';
    console.log(acceptedFiles);
  };

  async function getPatientHistory(patientId, reportid) {
    setIsUpdating(true);
    setDialogOpen(true);
    axios
      .get(`Patients/GetPatientHistory/${patientId}/${reportid}`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          console.log(res.data.Data);
          removeAll();
          ``;
          setReportData(res.data.Data);
          if (res.data.Data.length > 0) {
            setDNAFileUrl(res.data.Data[0].GeneFileUrl);
            if (
              res.data.Data[0].GeneFileUrl === '' ||
              res.data.Data[0].GeneFileUrl === null
            ) {
              setGBtnDisabled(true);
            } else {
              setGBtnDisabled(false);
            }
          }
          setIsUpdating(false);
          setDialogOpen(false);
        } else {
          setMessage(res.data.StatusMessage);
          setSnackOpen(true);
          setSeverity('error');
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
  const onPatientChange = (event, value, reason) => {
    removeAll();
    setDNAFileUrl('');
    setReportUrl('');
    setIsUpdating(true);
    setDialogOpen(true);
    setReportData([]);
    setCategoryId(0);
    setGBtnDisabled(true);
    setPatient(value);
    setPatientId(value?.patient_id);
    setValue('patient', value);
    if (reason === 'clear') {
      setReportData([]);
      setCategoryId(0);
      setIsUpdating(false);
      setDialogOpen(false);
      setGBtnDisabled(true);
    } else {
      setIsUpdating(false);
      setDialogOpen(false);
    }
    console.log(event);
  };

  const handleCategoryChange = (e) => {
    console.log(e);
    const selectCategory = e.target.value;
    if (selectCategory != '') {
      setCategoryId(selectCategory);
      console.log(categoryId);
    }
    getPatientHistory(patientId, selectCategory);
  };

  const validationSchema = Yup.object().shape({
    patient: Yup.string().required('Patient is required'),
    category: Yup.string().required('Category is required'),
    client: Yup.string().required('Client is required')
  });

  const {
    register,
    setValue,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      patient: '',
      category: '',
      client: ''
    },
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = (data) => {
    setIsUpdating(true);
    setDialogOpen(true);
    dnafileUrl
      ? generateReport(patientId, data.category)
      : uploadPatientGeneFile(patientId, data.category);
  };

  const toggleDrawer = (newOpen: boolean, value: string) => () => {
    setResultLoading(true);
    setDrOpen(newOpen);
    if (value !== '') {
      getGeneSummary(value);
    }
  };

  async function getGeneSummary(categoryId) {
    setIsUpdating(true);
    setResultLoading(true);
    await axios
      .get('Patients/GetPatientsGeneDumpbyId/' + patientId + '/' + categoryId)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setTableData(res.data.Data);
          setResultLoading(false);
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
      });
  }

  async function generateReport(patientId, reportId) {
    var reportDate = moment(new Date()).format('MM-DD-YYYY');
    const userid = localStorage.getItem('UserId');
    await axios
      .get(
        'Patients/GeneratePatientReport/' +
          patientId +
          '/' +
          reportId +
          '/' +
          reportDate +
          '/' +
          userid
      )
      .then((res) => {
        if (res.data.StatusCode == 200) {
          getPatientHistory(patientId, reportId);
          setMessage('Report Generated, Please Click On Report To View');
          setIsUpdating(false);
          setSnackOpen(true);
          setSeverity('success');
        } else {
          setIsUpdating(false);
          setMessage(res.data.StatusMessage);
          setSnackOpen(true);
          setSeverity('error');
        }
      })
      .catch((err) => {
        console.log(severity);
        console.log(err);
        setIsUpdating(false);
        setMessage('Failed To Generate Report');
        setSnackOpen(true);
        setSeverity('error');
      });
  }

  async function uploadPatientGeneFile(patientId, reportId) {
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
        if (res.data.StatusCode == 200) {
          setMessage('Reports Getting Generated');
          removeAll();
          setDNAFileUrl(res.data.Data);
          generateReport(patientId, reportId);
          setSnackOpen(true);
          setSeverity('success');
        } else {
          setIsUpdating(false);
          setMessage(res.data.StatusMessage);
          setReportData([]);
          setSnackOpen(true);
          setSeverity('error');
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setMessage('Reports Not Generated ');
        setSnackOpen(true);
        setSeverity('error');
      });
  }

  return (
    <>
      <Head>
        <title>Reports</title>
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
            <Typography
              variant="h3"
              component="h3"
              gutterBottom
              style={{
                marginTop: 13,
                textTransform: 'uppercase'
              }}
            >
              Generate Report
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Generate Report" />
              <Divider />
              <CardContent>
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 1 }
                  }}
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Grid container>
                    <Grid item xs={4}>
                      <Autocomplete
                        sx={{ display: 'inline-flex', width: '55ch' }}
                        options={clientname}
                        getOptionLabel={(option) => option.client_name}
                        onChange={onClientChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Client Name"
                            variant="filled"
                            {...register('client')}
                            error={errors.client ? true : false}
                            helperText={errors.client?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Autocomplete
                        sx={{ display: 'inline-flex', width: '55ch' }}
                        open={open}
                        onOpen={() => {
                          setOpen(true);
                        }}
                        onClose={() => {
                          setOpen(false);
                        }}
                        getOptionLabel={(option) =>
                          `${
                            option.first_name +
                            ' , ' +
                            option.last_name +
                            ' | ' +
                            option.gender +
                            ' | ' +
                            option.provider_name
                          }`
                        }
                        options={patientData}
                        value={patient && patient.length == 0 ? null : patient}
                        onChange={onPatientChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Patient"
                            variant="filled"
                            {...register('patient')}
                            error={errors.patient ? true : false}
                            helperText={errors.patient?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl
                        variant="filled"
                        sx={{ marginTop: '8px', width: '54ch', marginLeft:'1ch'}}
                      >
                        <InputLabel id="demo-simple-select-filled-label">
                          Category
                        </InputLabel>
                        <Controller
                          name="category"
                          control={control}
                          defaultValue=""
                          render={({ field: { onChange,value } }) => (
                            <Select
                              required
                              labelId="demo-simple-select-filled"
                              {...register('category')}
                              id="demo-simple-select"
                              value={value}
                              disabled={!categoryData?.length}
                              label="Category"
                              onChange={(e) => {
                                onChange(e);
                                handleCategoryChange(e);
                              }}
                            >
                              {categoryData.map((c, i) => (
                                <MenuItem
                                  key={`c-${i}`}
                                  value={c.report_master_id}
                                >
                                  {c.report_name}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                        {errors.category && (
                          <p
                            style={{
                              color: '#FF1943',
                              fontSize: '13px',
                              fontWeight: 'bold'
                            }}
                          >
                            {errors.category.message}
                          </p>
                        )}
                      </FormControl>
                    </Grid>
                    {/* <Grid item xs={4}>
                      <Autocomplete
                        multiple
                        readOnly
                        id="checkboxes-tags-demo"
                        options={subCategoryOptions}
                        getOptionLabel={(option) => option.name}
                        disableCloseOnSelect
                        sx={{ display: 'inline-flex', width: '55ch' }}
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {option.name}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Sub Categories"
                            variant="filled"
                            {...register('scat')}
                          />
                        )}
                        value={selectedSubCategories}
                        onChange={(event, newValue) => {
                          console.log(newValue, event);
                          // Check if 'All' option is clicked

                          if (newValue.find((option) => option.id === 0)) {
                            // Check if all options are selected
                            if (
                              subCategoryOptions.length ===
                              selectedSubCategories.length
                            ) {
                              setValue('scat', '');
                              setSelectedSubCategories([]);
                            } else {
                              setSelectedSubCategories(subCategoryOptions);
                            }
                          } else {
                            setSelectedSubCategories(newValue);
                          }
                        }}
                        // Add These props
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        limitTags={3}
                        filterOptions={(options, params) => {
                          const filtered = createFilterOptions()(
                            options,
                            params
                          );
                          let optionName =
                            subCategoryOptions.length ===
                            selectedSubCategories.length
                              ? 'Remove All'
                              : 'All';
                          return [{ id: 0, name: optionName }, ...filtered];
                        }}
                      />
                    </Grid> */}
                    <Grid
                      item
                      xs={4}
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
                        <div {...getRootProps({ className: 'dropzone' })}>
                          <input {...getInputProps()} />
                          <CloudUploadIcon fontSize="large" />
                          <div>Drop files or click here to upload DNA file</div>
                        </div>
                        <aside
                          className="wfp--dropzone__file-list"
                          style={{ padding: '10px 0px' }}
                        >
                          <span>
                            {dnafileUrl == null ||
                            dnafileUrl == '' ||
                            fileList.length > 0 ? (
                              fileList
                            ) : (
                              <a
                                href={dnafileUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                DNA Sample
                              </a>
                            )}
                          </span>
                        </aside>
                      </section>
                    </Grid>
                    <Grid item xs={12} sx={{ marginTop: '10px' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={gbtnDisabled}
                        size="large"
                        style={{
                          marginLeft: 13,
                          marginBottom: 18,
                          padding: '12px 15px'
                        }}
                      >
                        Generate
                      </Button>
                    </Grid>
                    <Grid item xs={12} sx={{ marginTop: '20px' }}>
                      <ThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                          data={reportData}
                          columns={columns}
                          options={options}
                        />
                      </ThemeProvider>
                      {/* <Button
                        variant="contained"
                        color="error"
                        disabled={ibtnDisabled}
                        size="large"
                        style={{ marginLeft: 13, marginBottom: 18 }}
                        onClick={toggleDrawer(true)}
                      >
                        View Interpretation
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        size="large"
                        disabled={rbtnDisabled}
                        style={{ marginLeft: 13, marginBottom: 18 }}
                        onClick={reportOpen}
                      >
                        Report
                      </Button> */}
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
                      <Drawer
                        style={{ zIndex: '1399' }}
                        open={dropen}
                        anchor="right"
                        onClose={toggleDrawer(false, '')}
                      >
                        <TableContainer component={Paper}>
                          <Table
                            sx={{ minWidth: 450 }}
                            aria-label="simple table"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>Sample ID</TableCell>
                                <TableCell align="center">SNP Name</TableCell>
                                <TableCell align="center">Allele1</TableCell>
                                <TableCell align="center">Allele2</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {tableData.map((row) => (
                                <TableRow
                                  key={row.SnpName}
                                  sx={{
                                    '&:last-child td, &:last-child th': {
                                      border: 0
                                    }
                                  }}
                                >
                                  <TableCell component="th" scope="row">
                                    {loadResult ? (
                                      <Skeleton animation="wave" width={80} />
                                    ) : (
                                      row.SampleId
                                    )}
                                  </TableCell>
                                  <TableCell align="center">
                                    {loadResult ? (
                                      <Skeleton animation="wave" width={80} />
                                    ) : (
                                      row.SnpName
                                    )}
                                  </TableCell>
                                  <TableCell align="center">
                                    {loadResult ? (
                                      <Skeleton animation="wave" width={80} />
                                    ) : (
                                      row.Allele1
                                    )}
                                  </TableCell>
                                  <TableCell align="center">
                                    {loadResult ? (
                                      <Skeleton animation="wave" width={80} />
                                    ) : (
                                      row.Allele2
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Drawer>
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
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

Reports.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Reports;
