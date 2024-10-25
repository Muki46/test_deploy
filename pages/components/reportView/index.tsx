import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea, Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import { useAxios } from 'pages/services';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import moment from 'moment';
import DescriptionIcon from '@mui/icons-material/Description';

export default function ReportView(props) {
  const [axios] = useAxios();
  const [reportData, setReportData] = useState([]);
  const [open, setOpen] = useState(false);
  const [externalReportData, setExternalReportData] = useState([]);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    GetPatientReportDetails(props.patientId);
  }, []);

  async function GetPatientReportDetails(patientId) {
    handleOpen();
    axios
      .get('Patients/GetPatientReportDetails/' + patientId)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          console.log(res.data.Data);
          setReportData(res.data.Data.PatientReportDetailsModels);
          setExternalReportData(
            res.data.Data.PatientReportAttachmentDetailsModels
          );
          handleClose();
        } else {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container display="flex" justifyContent="stretch">
        <Grid item xs={5}>
          <Grid item xs={12} sx={{ marginLeft: '10px' }}>
            <Box>
              <Typography
                variant="h4"
                component="h4"
                gutterBottom
                sx={{ marginBottom: '5px', marginLeft: '10px' }}
              >
                Report Section
              </Typography>
            </Box>
          </Grid>
          {reportData.length > 0 ? (
            <Grid
              style={{
                display: 'inline-flex',
                marginLeft: '10px',
                marginTop: '10px'
              }}
            >
              {reportData.map((elem) => (
                <Card
                  sx={{ width: '140px', marginRight: '10px' }}
                  key={reportData.indexOf(elem)}
                >
                  <CardActionArea href={elem.report_url} target="_blank">
                    <CardMedia
                      component="img"
                      sx={{
                        height: '70px',
                        width: '70px',
                        margin: '0px auto'
                      }}
                      image={elem.report_card_url}
                      alt="Menopause"
                    />
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography gutterBottom variant="h5" component="div">
                        {elem.report_name}
                      </Typography>
                      <span style={{ fontSize: '13px' }}>
                        {elem.report_create_date}
                      </span>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Grid>
          ) : open == true ? (
            <Skeleton
              animation="wave"
              width={80}
              height={100}
              sx={{ margin: '10px', width: '120px' }}
            />
          ) : (
            <p
              style={{
                fontSize: '17px',
                fontWeight: 'bold',
                color: 'red',
                padding: '15px'
              }}
            >
              No Reports Found Yet.
            </p>
          )}
        </Grid>

        <Grid item xs={5} sx={{ marginLeft: '90px' }}>
          <Grid item xs={12} sx={{ marginLeft: '10px' }}>
            <Box>
              <Typography
                variant="h4"
                component="h4"
                gutterBottom
                sx={{ marginBottom: '5px' }}
              >
                External Report Section
              </Typography>
            </Box>
          </Grid>
          {externalReportData.length > 0 ? (
            <Grid
              style={{
                display: 'inline-flex',
                marginLeft: '10px',
                marginTop: '10px'
              }}
            >
              {externalReportData.map((elem) => (
                <Card
                  sx={{ maxWidth: '140px', marginRight: '10px' }}
                  key={externalReportData.indexOf(elem)}
                >
                  <CardActionArea href={elem.report_url} target="_blank">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <DescriptionIcon style={{ fontSize: '60px' }} />
                      <Typography gutterBottom variant="h5" component="div">
                        {elem.report_name}
                      </Typography>
                      <span style={{ fontSize: '13px' }}>
                        {moment(elem.created_date).format('MM-DD-YYYY')}
                      </span>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Grid>
          ) : open == true ? (
            <Skeleton
              animation="wave"
              width={80}
              height={100}
              sx={{ margin: '10px', width: '120px' }}
            />
          ) : (
            <p
              style={{
                fontSize: '17px',
                fontWeight: 'bold',
                color: 'red',
                padding: '15px'
              }}
            >
              No External Report Found Yet.
            </p>
          )}
        </Grid>
      </Grid>
    </>
  );
}
