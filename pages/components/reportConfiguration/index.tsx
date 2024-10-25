import SidebarLayout from '@/layouts/SidebarLayout';
import Footer from '@/components/Footer';
import Head from 'next/head';
import AddIcon from '@mui/icons-material/Add';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { TransitionProps } from '@mui/material/transitions';
import { DNA } from 'react-loader-spinner';
import Modal from '@mui/material/Modal';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import { Controller, useForm } from 'react-hook-form';
import SendIcon from '@mui/icons-material/Send';
import {
  Container,
  Grid,
  Slide,
  Typography,
  IconButton,
  TextField,
  Button,
  Tooltip,
  useTheme,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import Router from 'next/router';
import { forwardRef, useEffect, useState } from 'react';
import { useAxios } from 'pages/services';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useConfirm } from 'material-ui-confirm';
import MUIDataTable from 'mui-datatables';
import moment from 'moment';
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

const getMuiTheme = () =>
  createTheme({
    components: {
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: '10px 13px',
            backgroundColor: '#fff',
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

function ReportConfiguration() {
  const [axios] = useAxios();
  const confirm = useConfirm();
  const theme = useTheme();
  const [snackopen, setSnackOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [dopen, setDialogOpen] = useState(false);
  const [geneSnpResultData, setGeneSnpResultData] = useState([]);
  const [open, setOpen] = useState(false);
  const [geneSnpData, setGeneSnpData] = useState([]);
  const [geneSnpResultId, setGeneSnpResultId] = useState<any>(null);
  const [geneSnpId, setGeneSnpId] = useState(0);
  const [categoryGeneSnpResultMappingId, setCategoryGeneSnpResultMappingId] =
    useState(0);

  const validationSchema = Yup.object().shape({
    snp: Yup.array()
      .min(1, 'Atleast one SNP is required')
      .required('SNP is required'),
    Gene: Yup.string().required('SNP  is required'),
    rtext: Yup.string().required('Result Text  is required'),
    sname: Yup.string().notRequired(),
    sdescription: Yup.string().notRequired(),
    rlink: Yup.string().notRequired(),
    status: Yup.string().notRequired()
  });

  const {
    control,
    setValue,
    register,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      snp: [],
      Gene: '',
      rtext: '',
      sname: '',
      sdescription: '',
      rlink: '',
      status: ''
    },
    resolver: yupResolver(validationSchema)
  });

  useEffect(() => {
    getCategoryGeneSnpResultMappingList();
  }, []);

  async function getCategoryGeneSnpResultMappingList() {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get(`Category/GetCategoryGeneSnpResultMappingList`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setGeneSnpResultData(res.data.Data);
          setDialogOpen(false);
          setIsUpdating(false);
        } else {
          setMessage(res.data.StatusMessage);
          setSnackOpen(true);
          setIsUpdating(false);
          setDialogOpen(false);
        }
      })
      .catch((err) => {
        setIsUpdating(false);
        setDialogOpen(false);
        console.log(err);
        setSnackOpen(true);
        setMessage('Failed to Fetch the data');
      });
  }

  const handleDelete = (item) => {
    confirm({
      description: `Once deleted, you will not be able to recover this Configuration.`
    })
      .then(() => deleteCategoryGeneSnpResultMapping(item))
      .catch(() => console.log('Deletion cancelled.'));
  };

  async function deleteCategoryGeneSnpResultMapping(
    CategoryGeneSnpResultMappingId
  ) {
    setIsUpdating(true);
    setDialogOpen(true);
    const postData = [
      {
        Id: CategoryGeneSnpResultMappingId,
        ModifiedBy: localStorage.getItem('UserId'),
        ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
      }
    ];

    axios
      .delete('Category/DeleteCategoryGeneSnpResultMapping', { data: postData })
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setDialogOpen(false);
          setMessage('Configuration Deleted');
          setSnackOpen(true);
          setIsUpdating(false);
          setTimeout(goBack, 1000);
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
        setMessage('Failed To Delete Configuration');
        setSnackOpen(true);
        setTimeout(goBack, 2000);
      });
  }

  const handleclick = (id) => {
    console.log(id);
    if (id == 0) {
      getCategoryGeneSnpResultOpeningData(id);
    } else {
      getReportCategoryById(id);
      setCategoryGeneSnpResultMappingId(id);
    }
  };

  async function getCategoryGeneSnpResultOpeningData(id) {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get('Category/GetCategoryGeneSnpResultOpeningData')
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setGeneSnpData(res.data.Data);
          if (id !== 0) {
            const val = res.data.Data.filter((obj) => {
              return obj.CategoryGeneSnpsMappingId == id;
            });
            console.log(val);
            setValue('snp', val);
            setGeneSnpResultId(val[0]);
          }
          setIsUpdating(false);
          setDialogOpen(false);
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
        setMessage('Failed to fetch  details');
        setSnackOpen(true);
      });
  }

  async function getReportCategoryById(GeneSnpId) {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get('Category/GetCategoryGeneSnpResultMappingById/' + GeneSnpId)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          getCategoryGeneSnpResultOpeningData(
            res.data.Data.CategoryGeneSnpMappingId
          );
          setGeneSnpId(res.data.Data.CategoryGeneSnpMappingId);
          setValue('Gene', res.data.Data.Genotype);
          setValue('rtext', res.data.Data.GenotypeResult);
          setValue('sname', res.data.Data.StudyName);
          setValue('sdescription', res.data.Data.StudyDescription);
          setValue('rlink', res.data.Data.StudyLink);
          setValue('status', res.data.Data.Status);
          setIsUpdating(false);
          setDialogOpen(false);
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
        setMessage('Failed to fetch  details');
        setSnackOpen(true);
      });
  }

  const onGeneSnpChange = (e, value, reason) => {
    console.log(e);
    console.log(value);
    clearErrors('snp');
    if (value != null) {
      const newArray = [];
      newArray.push(value);
      console.log(newArray);
      setValue('snp', newArray);
      setGeneSnpId(value.CategoryGeneSnpsMappingId);
      setGeneSnpResultId(value);
    }
    if (reason === 'clear') {
      setValue('snp', []);
      setGeneSnpId(0);
      setGeneSnpResultId(null);
    }
  };

  const columns = [
    {
      name: 'ReportName',
      label: 'Report Name',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '180px',
            maxWidth: '180px',
            whiteSpace: 'nowrap',
            wordWrap: 'break-word',
            position: 'sticky',
            left: '4.5%',
            background: 'white',
            zIndex: 100
          }
        }),
        setCellHeaderProps: () => ({
          style: {
            position: 'sticky',
            left: '4.5%',
            background: 'white',
            top: 0, //Incase Header is Fixed
            zIndex: 102
          }
        })
      }
    },
    {
      name: 'CategoryName',
      label: 'Category Name',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        },
        setCellProps: () => ({
          style: { minWidth: '250px', maxWidth: '250px' }
        })
      }
    },
    {
      name: 'SubCategoryName',
      label: 'Sub Category Name',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        },
        setCellProps: () => ({
          style: { minWidth: '200px', maxWidth: '200px' }
        })
      }
    },
    {
      name: 'Gene',
      label: 'Gene',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        },
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        })
      }
    },
    {
      name: 'Snp',
      label: 'SNP',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: { minWidth: '100px', maxWidth: '100px' }
        })
      }
    },

    {
      name: 'GenoType',
      label: 'Geno Type',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: { minWidth: '150px', maxWidth: '150px' }
        })
      }
    },
    {
      name: 'GenoTypeResult',
      label: 'Geno Type Result',
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          return value === null || value === ''
            ? 'NA'
            : value.length <= 45
            ? value
            : value.substr(0, 45) + '...';
        },
        setCellProps: () => ({
          style: {
            minWidth: '250px',
            maxWidth: '250px',
            textOverflow: 'ellipsis'
          }
        })
      }
    },
    {
      name: 'StudyName',
      label: 'Study Name',
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          return value === null || value === ''
            ? 'NA'
            : value.length <= 45
            ? value
            : value.substr(0, 45) + '...';
        },
        setCellProps: () => ({
          style: {
            minWidth: '250px',
            maxWidth: '250px',
            textOverflow: 'ellipsis'
          }
        })
      }
    },
    {
      name: 'StudyDescription',
      label: 'Study Description',
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          return value === null || value === ''
            ? 'NA'
            : value.length <= 45
            ? value
            : value.substr(0, 45) + '...';
        },
        setCellProps: () => ({
          style: {
            minWidth: '250px',
            maxWidth: '250px',
            textOverflow: 'ellipsis'
          }
        })
      }
    },
    {
      name: 'Studylink',
      label: 'Study link',
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          return value === null || value === ''
            ? 'NA'
            : value.length <= 25
            ? value
            : value.substr(0, 25) + '...';
        },
        setCellProps: () => ({
          style: { minWidth: '280px', maxWidth: '280px' }
        })
      }
    },
    {
      name: 'Status',
      label: 'Status',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value === 1 ? 'Active' : 'Inactive';
        }
      }
    },
    {
      name: 'Action',
      options: {
        filter: false,
        download: false,
        setCellProps: () => ({
          style: {
            minWidth: '80px',
            maxWidth: '80px',
            whiteSpace: 'nowrap',
            position: 'sticky',
            right: 0,
            background: 'white',
            zIndex: 100
          }
        }),
        setCellHeaderProps: () => ({
          style: {
            position: 'sticky',
            right: 0,
            top: 0, //Incase Header is Fixed
            zIndex: 102
          }
        }),
        customBodyRenderLite: (dataIndex) => {
          return (
            <>
              <Tooltip placement="top" title="View" arrow>
                <IconButton
                  onClick={() => {
                    setOpen(true);
                    handleclick(
                      geneSnpResultData[dataIndex]
                        .CategoryGeneSnpResultMappingId
                    );
                  }}
                  sx={{
                    '&:hover': {
                      background: theme.colors.success.lighter
                    },
                    color: theme.palette.success.main
                  }}
                  color="inherit"
                  size="small"
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip placement="top" title="Delete" arrow>
                <IconButton
                  onClick={() => {
                    handleDelete(
                      geneSnpResultData[dataIndex]
                        .CategoryGeneSnpResultMappingId
                    );
                  }}
                  sx={{
                    '&:hover': {
                      background: theme.colors.error.lighter
                    },
                    color: theme.palette.error.main
                  }}
                  color="inherit"
                  size="small"
                >
                  <DeleteTwoToneIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          );
        }
      }
    }
  ];

  const options = {
    responsive: 'scroll',
    onRowsDelete: (rowsDeleted) => {
      confirm({
        description: `Once deleted, you will not be able to recover this Configuration.`
      })
        .then(() => {
          const idsToDelete = rowsDeleted.data.map(
            (d) => geneSnpResultData[d.dataIndex].CategoryGeneSnpResultMappingId
          );
          bulkDeleteCategoryGeneSnpResultMapping(idsToDelete);
        })
        .catch(() => window.location.reload());
    },
    print: false,
    onDownload: () => {
      GetCategoryGeneSnpResultMappingListFile();
      //prevents default download behavior
      return false;
    }
  };

  async function GetCategoryGeneSnpResultMappingListFile() {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get(`Category/GetCategoryGeneSnpResultMappingListFile`, {
        responseType: 'blob'
      })
      .then((res) => {
        let a = document.createElement('a');
        a.href = URL.createObjectURL(res.data);
        a.download = 'GenotypeConfigurationList.csv';
        a.click();
        a.remove();
        console.log(res);
        setIsUpdating(false);
        setDialogOpen(false);
      })
      .catch((err) => {
        setIsUpdating(true);
        setDialogOpen(false);
        console.log(err);
        setSnackOpen(true);
        setMessage('Failed to download Gene List');
      });
  }

  const goBack = () => {
    Router.push({
      pathname: '/components/reportConfiguration'
    });
    getCategoryGeneSnpResultMappingList();
  };

  async function bulkDeleteCategoryGeneSnpResultMapping(item) {
    setIsUpdating(true);
    setDialogOpen(true);
    var deleteArray = [];
    for (let i = 0; i < item.length; i++) {
      const postData = {
        Id: item[i],
        ModifiedBy: localStorage.getItem('UserId'),
        ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
      };
      deleteArray.push(postData);
    }
    axios
      .delete('Category/DeleteCategoryGeneSnpResultMapping', {
        data: deleteArray
      })
      .then((res) => {
        console.log(res);
        if (res.data.StatusCode == 200) {
          setDialogOpen(false);
          setIsUpdating(false);
          setMessage('Selected Configuration Deleted Successfully');
          setSnackOpen(true);
          setTimeout(goBack, 1000);
        } else {
          setIsUpdating(false);
          setDialogOpen(false);
          setMessage(res.data.StatusMessage);
          setSnackOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setDialogOpen(false);
        setMessage('Failed To Delete Configuration');
        setSnackOpen(true);
        setIsUpdating(false);
        setTimeout(goBack, 1000);
      });
  }

  const onSubmit = (data) => {
    setIsUpdating(true);
    setDialogOpen(true);
    console.log(data);
    var postData = {
      CategoryGeneSnpResultMappingId: categoryGeneSnpResultMappingId,
      CategoryGeneSnpMappingId: geneSnpId,
      GenoType: data.Gene,
      GenoTypeResult: data.rtext,
      StudyName: data.sname,
      StudyDescription: data.sdescription,
      StudyLink: data.rlink,
      Status: data.status,
      ModifiedBy: localStorage.getItem('UserId'),
      ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
    };
    updateCategoryGeneSnpResultMapping(postData);
  };

  const closePopup = () => {
    setOpen(false);
    getCategoryGeneSnpResultMappingList();
  };

  async function updateCategoryGeneSnpResultMapping(data) {
    axios
      .put('Category/UpdateCategoryGeneSnpResultMapping', data)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setIsUpdating(false);
          setDialogOpen(false);
          setMessage('Configuration Updated');
          setSnackOpen(true);
          setTimeout(closePopup, 1000);
        } else {
          setIsUpdating(false);
          setDialogOpen(false);
          setMessage(res.data.StatusMessage);
          setSnackOpen(true);
          setTimeout(closePopup, 1000);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setDialogOpen(false);
        setMessage('Failed To Update GeneSnpResult');
        setSnackOpen(true);
        setTimeout(closePopup, 1000);
      });
  }

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  const gotoReportConfiguration = () => {
    setDialogOpen(true);
    setMessage('loading');
    setIsUpdating(true);
    Router.push({
      pathname: 'reportConfiguration/AddReportConfiguration'
    });
  };

  return (
    <>
      <Head>
        <title>Genotype Configuration</title>
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
          <Grid item xs={9}>
            <Typography
              variant="h3"
              component="h3"
              gutterBottom
              style={{
                marginTop: 13,
                textTransform: 'uppercase'
              }}
            >
              Genotype Configuration
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              size="large"
              style={{
                marginLeft: 13,
                float: 'right',
                background: '#9DA338 !important'
              }}
              startIcon={<AddIcon />}
              onClick={gotoReportConfiguration}
            >
              Add Genotype Configuration
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              arial-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <h3
                  id="unstyled-modal-title"
                  className="modal-title"
                  style={{
                    position: 'absolute',
                    left: 20,
                    top: 10,
                    color: '#223354'
                  }}
                >
                  Add Genotype Configuration
                </h3>
                <IconButton
                  onClick={() => {
                    setOpen(false);
                  }}
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
                <div style={{ marginTop: '30px' }}>
                  <Box>
                    <Grid
                      sx={{
                        '& .MuiTextField-root': { m: 1, width: '32ch' }
                      }}
                      component="form"
                      noValidate
                      autoComplete="off"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <Grid container>
                        <Grid
                          item
                          xs={12}
                          sx={{
                            '& .MuiTextField-root': { width: '60ch' }
                          }}
                        >
                          <Controller
                            control={control}
                            name="snp"
                            rules={{ required: true }}
                            render={() => (
                              <Autocomplete
                                sx={{
                                  display: 'inline-flex',
                                  width: '58ch'
                                }}
                                options={geneSnpData}
                                value={geneSnpResultId}
                                onChange={onGeneSnpChange}
                                isOptionEqualToValue={(option, value) =>
                                  option.value === value.value
                                }
                                getOptionLabel={(option) =>
                                  `${
                                    option.Snp +
                                    ' | ' +
                                    option.Gene +
                                    ' | ' +
                                    option.SubCategoryName +
                                    ' | ' +
                                    option.CategoryName
                                  }`
                                }
                                renderInput={(params) => (
                                  <TextField
                                    required
                                    {...params}
                                    label="SNP"
                                    variant="filled"
                                    error={errors.snp ? true : false}
                                    helperText={errors.snp?.message}
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
                                sx={{ width: '20ch' }}
                                required
                                {...field}
                                id="Gene"
                                label="Gene Type"
                                variant="filled"
                                {...register('Gene')}
                                error={errors.Gene ? true : false}
                                helperText={errors.Gene?.message}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <Controller
                            name="rtext"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                sx={{ width: '30ch' }}
                                rows={4}
                                multiline
                                {...field}
                                id="Result-Text"
                                label="Result Text"
                                {...register('rtext')}
                                error={errors.rtext ? true : false}
                                helperText={errors.rtext?.message}
                                variant="filled"
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <Controller
                            name="sname"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                sx={{ width: '30ch' }}
                                rows={4}
                                multiline
                                {...field}
                                id="Study-Name"
                                label="Study Name"
                                {...register('sname')}
                                error={errors.sname ? true : false}
                                helperText={errors.sname?.message}
                                variant="filled"
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <Controller
                            name="sdescription"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                sx={{ width: '30ch' }}
                                rows={4}
                                multiline
                                {...field}
                                id="Study-Description"
                                label="Study Description"
                                {...register('sdescription')}
                                error={errors.sdescription ? true : false}
                                helperText={errors.sdescription?.message}
                                variant="filled"
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <Controller
                            name="rlink"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                sx={{ width: '30ch' }}
                                rows={4}
                                multiline
                                {...field}
                                id="Reference-Link"
                                label="Reference Link"
                                {...register('rlink')}
                                error={errors.rlink ? true : false}
                                helperText={errors.rlink?.message}
                                variant="filled"
                              />
                            )}
                          />
                        </Grid>
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

                        <Grid item xs={12}>
                          <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            sx={{ marginTop: '13px', marginLeft: '8px' }}
                            endIcon={<SendIcon />}
                          >
                            Update
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </div>
              </Box>
            </Modal>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Snackbar
                open={snackopen}
                autoHideDuration={6000}
                onClose={handleClose}
              >
                <Alert severity="success" sx={{ width: '100%' }}>
                  {message}
                </Alert>
              </Snackbar>
            </Box>
            {isUpdating ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Dialog
                  open={dopen}
                  TransitionComponent={Transition}
                  keepMounted
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogContent>
                    <DNA
                      visible={true}
                      height="80"
                      width="80"
                      ariaLabel="dna-loading"
                      wrapperStyle={{}}
                      wrapperClass="dna-wrapper"
                    />
                  </DialogContent>
                </Dialog>
              </Box>
            ) : (
              <ThemeProvider theme={getMuiTheme()}>
                <MUIDataTable
                  data={geneSnpResultData}
                  columns={columns}
                  options={options}
                />
              </ThemeProvider>
            )}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
ReportConfiguration.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;
export default ReportConfiguration;
