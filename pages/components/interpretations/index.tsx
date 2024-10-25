import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import { useAxios } from 'pages/services';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function Interpretation(props) {
  const [axios] = useAxios();
  const [value, setValue] = useState('');
  const [tableData, setTableData] = useState([]);
  const [loadResult, setResultLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [categorydetails, setCategoryReportDetails] = useState([]);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    console.log(props.patientId);
    getCategoryByPatientId(props.patientId);
  }, []);

  async function getGeneSummary(patientId, reportMasterId) {
    handleOpen();
    setResultLoading(true);
    await axios
      .get(
        'Patients/GetPatientsGeneDumpbyId/' + patientId + '/' + reportMasterId
      )
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setTableData(res.data.Data);
          setResultLoading(false);
          handleClose();
        } else {
          setResultLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setResultLoading(false);
      });
  }

  async function getCategoryByPatientId(patientId) {
    handleOpen();
    setResultLoading(true);
    await axios
      .get(`Patients/GetCategoryByPatientId/${patientId}`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setCategoryReportDetails(res.data.Data.CategoryReportDetails);
          setValue(res.data.Data.CategoryReportDetails[0].report_master_id);
          getGeneSummary(
            props.patientId,
            res.data.Data.CategoryReportDetails[0].report_master_id
          );
        } else {
          setResultLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setResultLoading(false);
      });
  }

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    console.log(event);
    setValue(newValue);
    var reportMasterId = newValue;
    if (newValue == '1') {
      getGeneSummary(props.patientId, reportMasterId);
    } else {
      getGeneSummary(props.patientId, reportMasterId);
    }
  };

  return (
    <TabContext value={value}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          {categorydetails.map((category, index) => (
            <Tab
              key={`category-${index}`}
              id={`simple-tab-${index}`}
              label={category.report_name}
              aria-label={`simple-tabpanel-${index}`}
              value={category.report_master_id}
            />
          ))}
        </TabList>
      </Box>
      <TabPanel value={value}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 450 }} aria-label="simple table">
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
                    '&:last-child td, &:last-child th': { border: 0 }
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
      </TabPanel>
    </TabContext>
  );
}
