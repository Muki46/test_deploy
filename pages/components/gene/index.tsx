import SidebarLayout from '@/layouts/SidebarLayout';
import Head from 'next/head';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  IconButton,
  Snackbar,
  Tooltip,
  useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { forwardRef, useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import Footer from '@/components/Footer';
import { TransitionProps } from '@mui/material/transitions';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import MUIDataTable from 'mui-datatables';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useAxios } from 'pages/services';
import AddGene from './AddGene';
import { DNA } from 'react-loader-spinner';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import moment from 'moment';
import { useConfirm } from 'material-ui-confirm';

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
            padding: '4px',
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

function Gene() {
  const theme = useTheme();
  const confirm = useConfirm();
  const [axios] = useAxios();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);
  const [snackopen, setSnackOpen] = useState(false);
  const [severity, setSeverity] = useState('info');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [dopen, setDialogOpen] = useState(false);
  const [geneData, setGeneData] = useState([]);

  useEffect(() => {
    console.log(severity);
    setLoading(true);
    setDialogOpen(true);
    getCategoryGeneMappingList();
  }, []);

  async function getCategoryGeneMappingList() {
    await axios
      .get(`Category/GetCategoryGeneMappingList`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setGeneData(res.data.Data);
          setLoading(false);
          setDialogOpen(false);
        } else {
          setMessage(res.data.StatusMessage);
          setSnackOpen(true);
          setSeverity('success');
          setLoading(false);
          setDialogOpen(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        setDialogOpen(false);
        console.log(err);
        setSnackOpen(true);
        setMessage('Failed to Fetch the data');
        setSeverity('error');
      });
  }

  const handleDelete = (item) => {
    confirm({
      description: `Once deleted, you will not be able to recover this Gene.`
    })
      .then(() => deleteCategoryGene(item))
      .catch(() => console.log('Deletion cancelled.'));
  };

  async function deleteCategoryGene(geneId) {
    setLoading(true);
    setDialogOpen(true);
    const postData = [
      {
        Id: geneId,
        ModifiedBy: localStorage.getItem('UserId'),
        ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
      }
    ];

    axios
      .delete('Category/DeleteCategoryGeneMapping', { data: postData })
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setDialogOpen(false);
          setMessage('Gene Deleted');
          setSnackOpen(true);
          setSeverity('success');
          window.location.reload();
        } else {
          setLoading(false);
          setDialogOpen(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        console.log(severity);
        setDialogOpen(false);
        setLoading(false);
        setMessage('Failed To Delete Gene');
        setSnackOpen(true);
        setSeverity('error');
        window.location.reload();
      });
  }

  const columns = [
    {
      name: 'ReportName',
      label: 'Report Name',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value === (null || '') ? 'NA' : value;
        },
        setCellProps: () => ({
          style: { minWidth: '120px', maxWidth: '120px', position: 'sticky' }
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
        }
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
        }
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
        }
      }
    },
    {
      name: 'GeneDescription',
      label: 'Gene Description ',
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
          style: { minWidth: '250px', maxWidth: '250px' }
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
            minWidth: '60px',
            maxWidth: '60px',
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
                    setId(geneData[dataIndex].CategoryGeneMappingId);
                    setOpen(true);
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
                    handleDelete(geneData[dataIndex].CategoryGeneMappingId);
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
        description: `Once deleted, you will not be able to recover this Gene.`
      })
        .then(() => {
          const idsToDelete = rowsDeleted.data.map(
            (d) => geneData[d.dataIndex].CategoryGeneMappingId
          );
          bulkDeleteCategoryGene(idsToDelete);
        })
        .catch(() => window.location.reload());
    },
    print: false,
    onDownload: () => {
      GetCategoryGeneMappingListFile();

      //prevents default download behavior
      return false;
    }
  };

  async function GetCategoryGeneMappingListFile() {
    setLoading(true);
    setDialogOpen(true);
    await axios
      .get(`Category/GetCategoryGeneMappingListFile`, { responseType: 'blob' })
      .then((res) => {
        let a = document.createElement('a');
        a.href = URL.createObjectURL(res.data);
        a.download = 'GeneList.csv';
        a.click();
        a.remove();
        console.log(res);
        setLoading(false);
        setDialogOpen(false);
      })
      .catch((err) => {
        setLoading(false);
        setDialogOpen(false);
        console.log(err);
        setSnackOpen(true);
        setMessage('Failed to download Gene List');
        setSeverity('error');
      });
  }

  async function bulkDeleteCategoryGene(item) {
    setLoading(true);
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
      .delete('Category/DeleteCategoryGeneMapping', { data: deleteArray })
      .then((res) => {
        console.log(res);
        if (res.data.StatusCode == 200) {
          setDialogOpen(false);
          setLoading(false);
          setSnackOpen(true);
          setMessage('Selected Gene Deleted Successfully');
          setSeverity('success');
          window.location.reload();
        } else {
          setLoading(false);
          setDialogOpen(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setDialogOpen(false);
        setMessage('Failed To Delete Gene');
        setSnackOpen(true);
        setSeverity('error');
        setLoading(false);
      });
  }

  const handleOpen = () => {
    setId(0);
    setOpen(true);
  };

  const handleSnacKClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    console.log(event);
    setSnackOpen(false);
  };

  const handleClose = (event, reason) => {
    console.log(event);
    if (reason && reason == 'backdropClick' && 'escapeKeyDown') return;
    myCloseModal();
  };

  function myCloseModal() {
    setOpen(false);
  }

  return (
    <>
      <Head>
        <title>Gene</title>
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
              Gene
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
              onClick={handleOpen}
            >
              Add Gene
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
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
                  Add Gene
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
                  <AddGene props={id} />
                </div>
              </Box>
            </Modal>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Snackbar
                open={snackopen}
                autoHideDuration={3000}
                onClose={handleSnacKClose}
              >
                <Alert
                  severity="success"
                  variant="filled"
                  sx={{ width: '100%' }}
                >
                  {message}
                </Alert>
              </Snackbar>
            </Box>
            {loading ? (
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
                  data={geneData}
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
Gene.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;
export default Gene;
