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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import {
  Container,
  Grid,
  Slide,
  Typography,
  IconButton,
  Button,
  Tooltip,
  useTheme
} from '@mui/material';
import Router from 'next/router';
import { forwardRef, useEffect, useState } from 'react';
import { useAxios } from 'pages/services';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useConfirm } from 'material-ui-confirm';
import MUIDataTable from 'mui-datatables';
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



function GenotypeConfiguration() {
  const [axios] = useAxios();
  const confirm = useConfirm();
  const theme = useTheme();
  const [snackopen, setSnackOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [dopen, setDialogOpen] = useState(false);
  const [conditionGeneSnpResultData, setConditionconditionGeneSnpResultData] = useState([]);


  useEffect(() => {
    getConditionGenotypeSnpList();
  }, []);

  async function getConditionGenotypeSnpList() {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get(`Category/GetConditionGenotypeSnpList`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setConditionconditionGeneSnpResultData(res.data.Data);
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
      .then(() => deleteConditionGenotypeSnp(item))
      .catch(() => console.log('Deletion cancelled.'));
  };

  async function deleteConditionGenotypeSnp(
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
      .delete('Category/DeleteConditionGenotypeSnp', { data: postData })
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

  const handleclick  = (id) => {
    console.log(id);
    Router.push({
      pathname: 'genotypeConfiguration/AddGenotypeConfiguration',
      query: { props: id > 0 ? id : 0 }
    });
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
          style: { minWidth: '150px', maxWidth: '150px' }
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
          style: { minWidth: '200px', maxWidth: '200px' }
        })
      }
    },
    {
      name: 'ConditionName',
      label: 'Condition Name',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '200px',
            maxWidth: '200px',
            textOverflow: 'ellipsis'
          }
        })
      }
    },
    {
      name: 'GraphStateName',
      label: 'Graph State Name',
      options: {
        filter: false,
        sort: true,
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
      name: 'ColorName',
      label: 'Color Name',
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
          style: { minWidth: '200px', maxWidth: '200px' }
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
                    handleclick(
                      conditionGeneSnpResultData[dataIndex]
                        .SubCategoryConditionMappingId
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
                      conditionGeneSnpResultData[dataIndex]
                        .SubCategoryConditionMappingId
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
        description: `Once deleted, you will not be able to recover this Condition Configuration.`
      })
        .then(() => {
          const idsToDelete = rowsDeleted.data.map(
            (d) => conditionGeneSnpResultData[d.dataIndex].SubCategoryConditionMappingId
          );
          bulkDeleteConditionGenotypeSnp(idsToDelete);
        })
        .catch(() => window.location.reload());
    },
    print: false,
    onDownload: () => {
      GetConditionGenotypeSnpListFile();
      //prevents default download behavior
      return false;
    }
  };

  async function GetConditionGenotypeSnpListFile() {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get(`Category/GetConditionGenotypeSnpListFile`, {
        responseType: 'blob'
      })
      .then((res) => {
        let a = document.createElement('a');
        a.href = URL.createObjectURL(res.data);
        a.download = 'SnpConditionList.csv';
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
      pathname: '/components/genotypeConfiguration'
    });
    getConditionGenotypeSnpList();
  };

  async function bulkDeleteConditionGenotypeSnp(item) {
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
      .delete('Category/DeleteConditionGenotypeSnp', {
        data: deleteArray
      })
      .then((res) => {
        console.log(res);
        if (res.data.StatusCode == 200) {
          setDialogOpen(false);
          setIsUpdating(false);
          setMessage('Selected Condition Configuration Deleted Successfully');
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

  


  

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  const gotoGenotypeConfiguration = () => {
    setDialogOpen(true);
    setMessage('loading');
    setIsUpdating(true);
    Router.push({
      pathname: 'genotypeConfiguration/AddGenotypeConfiguration'
    });
  };

  return (
    <>
      <Head>
        <title>Condition Configuration</title>
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
              Condition Configuration
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
              onClick={gotoGenotypeConfiguration}
            >
              Add Condition Configuration
            </Button>
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
                  data={conditionGeneSnpResultData}
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
GenotypeConfiguration.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;
export default GenotypeConfiguration;
