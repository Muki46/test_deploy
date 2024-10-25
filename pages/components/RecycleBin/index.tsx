import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import {
  Container,
  Typography,
  Grid,
  Box,
  ThemeProvider,
  Slide,
  useTheme,
  createTheme,
  IconButton,
  Tooltip
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { TransitionProps } from 'rsuite';
import 'rsuite/dist/rsuite.css';
import { forwardRef, useEffect, useState } from 'react';
import { DNA } from 'react-loader-spinner';
import MUIDataTable from 'mui-datatables';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useAxios } from 'pages/services';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import moment from 'moment';
import InputLabel from '@mui/material/InputLabel';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Footer from '@/components/Footer';

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
            fontFamily: '"Nunito", "Helvetica", "Arial", "sans-serif"'
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

function RecycleBin() {
  const theme = useTheme();
  const [axios] = useAxios();
  const [dopen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryData, setOpeningData] = useState([]);
  const [defaultvalues, setCategoryValue] = useState('4');
  const [dataTableColumns, setDataTableColumns] = useState([]);
  const [dataTableData, setDataTableData] = useState([]);
  const [dataTableoptions, setDataTableoptions] = useState({});
  const [snackopen, setSnackOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    setDialogOpen(true);
    getRecyclebinOpeningData();
  }, []);

  async function getRecyclebinOpeningData() {
    try {
      const response = await axios.get(`Users/GetRecycleBinOpeningData`);
      if (response.data.StatusCode == 200) {
        setOpeningData(response.data.Data);
        getRecycleBinData(defaultvalues);
        setDialogOpen(false);
        setLoading(false);
      } else {
      }
    } catch (error) {
      setLoading(false);
      setDialogOpen(false);
      console.error('Error fetching data:', error);
    }
  }

  const handleChange = (event: SelectChangeEvent) => {
    setCategoryValue(event.target.value as string);
    getRecycleBinData(event.target.value);
  };

  async function getRecycleBinData(id) {
    setLoading(true);
    setDialogOpen(true);
    console.log(id);
    try {
      const response = await axios.get(`Users/GetRecycleBinData/${id}`);
      if (response.data.StatusCode == 200) {
        if (id == 1) {
          setDataTableData(response.data.Data.RecycleUserMaster);
          setDataTableColumns(userColumns);
          setDataTableoptions(Useroptions);
        } else if (id == 2) {
          setDataTableData(response.data.Data.RecyclePatientMaster);
          setDataTableColumns(patientColumns);
          setDataTableoptions(patientOptions);
        } else if (id == 3) {
          setDataTableData(response.data.Data.RecycleProviderMaster);
          setDataTableColumns(providerColumns);
          setDataTableoptions(providerOptions);
        } else {
          setDataTableData(response.data.Data.RecycleClientMaster);
          setDataTableColumns(clientColumns);
          setDataTableoptions(clientOptions);
        }
        setLoading(false);
        setDialogOpen(false);
      } else {
        setLoading(false);
        setDialogOpen(false);
      }
    } catch (error) {
      setLoading(false);
      setDialogOpen(false);
      console.error('Error fetching data:', error);
    }
  }

  async function updateRecycleBinData(id, categoryId) {
    setLoading(true);
    setDialogOpen(true);
    const postData = {
      CategoryId: categoryId,
      ModifiedId: id,
      ModifiedBy: parseInt(localStorage.getItem('UserId')),
      ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
    };
    await axios
      .put('Users/UpdateRecycleBinData', postData)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          console.log(res);
          setLoading(false);
          setDialogOpen(false);
          getRecycleBinData(categoryId);
          setMessage('Revoked Successfully');
          setSnackOpen(true);
        } else {
          setDialogOpen(false);
          setLoading(false);
          setMessage(res.data.StatusMessage);
          setSnackOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setDialogOpen(false);
        setSnackOpen(true);
        setMessage('Failed to Revoke');
      });
  }

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

  const userColumns = [
    {
      name: 'user_name',
      label: 'UserName',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '150px',
            maxWidth: '150px',
            whiteSpace: 'nowrap',
            position: 'sticky',
            left: '0%',
            background: 'white',
            zIndex: 100
          }
        }),
        setCellHeaderProps: () => ({
          style: {
            position: 'sticky',
            left: '0%',
            top: 0, //Incase Header is Fixed
            zIndex: 102
          }
        })
      }
    },
    {
      name: 'first_name',
      label: 'First Name',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '200px',
            maxWidth: '200px',
            wordWrap: 'break-word'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'last_name',
      label: 'Last Name',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '200px',
            maxWidth: '200px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'email',
      label: 'Email',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '250px',
            maxWidth: '250px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'phone',
      label: 'Phone',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '150px',
            maxWidth: '150px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'address',
      label: 'Address',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '150px',
            maxWidth: '150px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'city',
      label: 'City',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '150px',
            maxWidth: '150px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'state',
      label: 'State',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '150px',
            maxWidth: '150px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'zip',
      label: 'Zip',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '150px',
            maxWidth: '150px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'start_ip',
      label: 'Start Ip',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '200px',
            maxWidth: '200px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'end_ip',
      label: 'End Ip',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '200px',
            maxWidth: '200px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'modified_date',
      label: 'Deleted Date',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '200px',
            maxWidth: '200px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === ''
            ? 'NA'
            : moment(value).format('MM/DD/YYYY');
        }
      }
    },
    {
      name: 'user_name',
      label: 'Deleted By',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '200px',
            maxWidth: '200px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'user_id',
      label: 'Action',
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
        customBodyRender: (value) => {
          return (
            <>
              <Tooltip placement="top" title="Restore" arrow>
                <IconButton
                  onClick={() => {
                    updateRecycleBinData(value, 1);
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
                  <RestartAltIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          );
        }
      }
    }
  ];

  const Useroptions = {
    responsive: 'scroll',
    selectableRows: 'none',
    print: false,
    downloadOptions: { filename: 'User.csv', separator: ',' }
  };

  const patientColumns = [
    {
      name: 'patient_name',
      label: 'Patient Name',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '150px',
            maxWidth: '150px',
            whiteSpace: 'nowrap',
            position: 'sticky',
            left: '0%',
            background: 'white',
            zIndex: 100
          }
        }),
        setCellHeaderProps: () => ({
          style: {
            position: 'sticky',
            left: '0%',
            top: 0, //Incase Header is Fixed
            zIndex: 102
          }
        })
      }
    },
    {
      name: 'first_name',
      label: 'First Name',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '150px',
            maxWidth: '150px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'last_name',
      label: 'Last Name',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '150px',
            maxWidth: '150px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'gender',
      label: 'Gender',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '150px',
            maxWidth: '150px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'date_of_birth',
      label: 'DOB',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '150px',
            maxWidth: '150px'
          }
        }),
        customBodyRender: (value) => {
          return moment(value).format('MM/DD/YYYY');
        }
      }
    },
    {
      name: 'sample_id',
      label: 'Sample ID',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '150px',
            maxWidth: '150px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'specimen_type',
      label: 'Specimen Type',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '200px',
            maxWidth: '200px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'collection_method',
      label: 'Collection Method',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '200px',
            maxWidth: '200px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'collection_date',
      label: 'Collection Date',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '200px',
            maxWidth: '200px'
          }
        }),
        customBodyRender: (value) => {
          return moment(value).format('MM/DD/YYYY');
        }
      }
    },
    {
      name: 'provider_name',
      label: 'Provider Name',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '200px',
            maxWidth: '200px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'address',
      label: 'Address',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '80px',
            maxWidth: '80px',
            right: 20
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'modified_date',
      label: 'Deleted Date',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '200px',
            maxWidth: '200px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === ''
            ? 'NA'
            : moment(value).format('MM/DD/YYYY');
        }
      }
    },
    {
      name: 'user_name',
      label: 'Deleted By',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '200px',
            maxWidth: '200px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'patient_id',
      label: 'Action',
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
        customBodyRender: (value) => {
          return (
            <>
              <Tooltip placement="top" title="Restore" arrow>
                <IconButton
                  onClick={() => {
                    updateRecycleBinData(value, 2);
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
                  <RestartAltIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          );
        }
      }
    }
  ];

  const patientOptions = {
    responsive: 'scroll',
    selectableRows: 'none',
    print: false,
    downloadOptions: { filename: 'Patient.csv', separator: ',' }
  };

  const providerColumns = [
    {
      name: 'provider_name',
      label: 'Provider Name',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '150px',
            maxWidth: '150px',
            whiteSpace: 'nowrap',
            position: 'sticky',
            left: '0%',
            background: 'white',
            zIndex: 100
          }
        }),
        setCellHeaderProps: () => ({
          style: {
            position: 'sticky',
            left: '0%',
            top: 0, //Incase Header is Fixed
            zIndex: 102
          }
        })
      }
    },
    {
      name: 'address',
      label: 'Address',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '150px',
            maxWidth: '150px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'city',
      label: 'City',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '150px',
            maxWidth: '150px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'state',
      label: 'State',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '150px',
            maxWidth: '150px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'zip',
      label: 'Zip',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '150px',
            maxWidth: '150px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'phone',
      label: 'Phone',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '200px',
            maxWidth: '200px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'email',
      label: 'Email',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '280px',
            maxWidth: '280px',
            wordWrap: 'break-word'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'modified_date',
      label: 'Deleted Date',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '200px',
            maxWidth: '200px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === ''
            ? 'NA'
            : moment(value).format('MM/DD/YYYY');
        }
      }
    },
    {
      name: 'user_name',
      label: 'Deleted By',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '200px',
            maxWidth: '200px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'provider_id',
      label: 'Action',
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
        customBodyRender: (value) => {
          return (
            <>
              <Tooltip placement="top" title="Restore" arrow>
                <IconButton
                  onClick={() => {
                    updateRecycleBinData(value, 3);
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
                  <RestartAltIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          );
        }
      }
    }
  ];

  const providerOptions = {
    responsive: 'scroll',
    selectableRows: 'none',
    print: false,
    downloadOptions: { filename: 'Provider.csv', separator: ',' }
  };

  const clientColumns = [
    {
      name: 'client_name',
      label: 'Client Name',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '150px',
            maxWidth: '150px',
            whiteSpace: 'nowrap',
            position: 'sticky',
            left: '0%',
            background: 'white',
            zIndex: 100
          }
        }),
        setCellHeaderProps: () => ({
          style: {
            position: 'sticky',
            left: '0%',
            top: 0, //Incase Header is Fixed
            zIndex: 102
          }
        })
      }
    },
    {
      name: 'address',
      label: 'Address',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '180px',
            maxWidth: '180px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'city',
      label: 'City',
      options: {
        filter: false,
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
      name: 'state',
      label: 'State',
      options: {
        filter: false,
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
      name: 'zip',
      label: 'Zip',
      options: {
        filter: false,
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
      name: 'contact_person_name',
      label: 'Contact Person Name',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '200px',
            maxWidth: '200px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    // {
    //   name: 'contact_person_phone',
    //   label: 'Contact Person Phone',
    //   options: {
    //     filter: false,
    //     sort: true,
    //     setCellProps: () => ({
    //       style: {
    //         minWidth: '220px',
    //         maxWidth: '220px'
    //       }
    //     }),
    //     customBodyRender: (value) => {
    //       return value === null || value === '' ? 'NA' : value;
    //     }
    //   }
    // },
    // {
    //   name: 'contact_person_email',
    //   label: 'Contact Person Email',
    //   options: {
    //     filter: false,
    //     sort: true,
    //     setCellProps: () => ({
    //       style: {
    //         minWidth: '200px',
    //         maxWidth: '200px'
    //       }
    //     }),
    //     customBodyRender: (value) => {
    //       return value === null || value === '' ? 'NA' : value;
    //     }
    //   }
    // },
    {
      name: 'modified_date',
      label: 'Deleted Date',
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '200px',
            maxWidth: '200px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === ''
            ? 'NA'
            : moment(value).format('MM/DD/YYYY');
        }
      }
    },
    {
      name: 'user_name',
      label: 'Deleted By',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            minWidth: '200px',
            maxWidth: '200px'
          }
        }),
        customBodyRender: (value) => {
          return value === null || value === '' ? 'NA' : value;
        }
      }
    },
    {
      name: 'client_id',
      label: 'Action',
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
        customBodyRender: (value) => {
          return (
            <>
              <Tooltip placement="top" title="Restore" arrow>
                <IconButton
                  onClick={() => {
                    updateRecycleBinData(value, 4);
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
                  <RestartAltIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          );
        }
      }
    }
  ];

  const clientOptions = {
    responsive: 'scroll',
    selectableRows: 'none',
    print: false,
    downloadOptions: { filename: 'Client.csv', separator: ',' }
  };

  return (
    <>
      <Head>
        <title>Recycle Bin</title>
      </Head>
      <Container maxWidth="xl">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={3}
          style={{ marginTop: '10px' }}
        >
          <Grid item xs={10}>
            <Typography variant="h3" gutterBottom>
              Recycle Bin
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <FormControl fullWidth variant="filled">
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                required
                labelId="demo-simple-select-filled"
                id="demo-simple-select"
                value={defaultvalues.toString()}
                label="Category"
                onChange={handleChange}
              >
                {categoryData.map((c, i) => (
                  <MenuItem key={`c-${i}`} value={c.CategoryId}>
                    {c.CategoryValue}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                  data={dataTableData}
                  columns={dataTableColumns}
                  options={dataTableoptions}
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

RecycleBin.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default RecycleBin;
