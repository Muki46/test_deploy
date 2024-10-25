import Head from 'next/head';
import { useState, useEffect } from 'react';
import SidebarLayout from '@/layouts/SidebarLayout';
import Skeleton from '@mui/material/Skeleton';
import {
  Grid,
  Typography,
  CardContent,
  Card,
  Container,
  Box,
  IconButton,
  Divider,
  Button
} from '@mui/material';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import Footer from '@/components/Footer';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import AddUser from '../users/AddUser';
import { useAxios } from 'pages/services';

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

function Profile() {
  interface User {
    UserName: string;
    Email: string;
    Phone: string;
    Address: string;
    City: string;
    State: string;
    Zip: string;
  }

  const [axios] = useAxios();
  const [loading, setLoading] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [profileData, setProfileData] = useState<User>();
  const [userId, setUserId] = useState(0);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    console.log(event);
    if (reason && reason == 'backdropClick' && 'escapeKeyDown') return;
    myCloseModal();
  };

  function myCloseModal() {
    setOpen(false);
  }

  useEffect(() => {
    const id = localStorage.getItem('UserId');
    setRoleName(localStorage.getItem('RoleName'));
    setUserId(parseInt(id));
    if (id != null) {
      getUserDetails(id);
    }
  }, []);

  async function getUserDetails(userId) {
    setLoading(true);
    const response = await axios.get('Users/GetUserById/' + userId);
    if (response.data.StatusCode == 200) {
      console.log(response.data.Data);
      setLoading(false);
      setProfileData(response.data.Data);
    } else {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Profile</title>
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
            <Card>
              <Box
                p={3}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h4" gutterBottom>
                    User Details
                  </Typography>
                  <Typography variant="subtitle2">
                    Manage informations related to your personal details
                  </Typography>
                </Box>
                {roleName == 'Patients' ||
                roleName == 'Provider' ||
                roleName == 'Client User' ? (
                  ''
                ) : (
                  <Button
                    variant="text"
                    startIcon={<EditTwoToneIcon />}
                    onClick={handleOpen}
                  >
                    Edit
                  </Button>
                )}

                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
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
                    <AddUser props={userId} />
                  </Box>
                </Modal>
              </Box>
              <Divider />
              <CardContent sx={{ p: 4 }}>
                <Typography variant="subtitle2">
                  <Grid container spacing={0}>
                    <Grid
                      item
                      xs={12}
                      sm={1}
                      md={1}
                      textAlign={{ sm: 'right' }}
                    >
                      <Box pr={3} pb={2}>
                        Name:
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={11} md={11}>
                      <b>
                        {loading ? (
                          <Skeleton animation="wave" width={230} />
                        ) : (
                          profileData?.UserName
                        )}
                      </b>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={1}
                      md={1}
                      textAlign={{ sm: 'right' }}
                    >
                      <Box pr={3} pb={2}>
                        Email:
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={11} md={11}>
                      <b>
                        {loading ? (
                          <Skeleton animation="wave" width={230} />
                        ) : (
                          profileData?.Email
                        )}
                      </b>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={1}
                      md={1}
                      textAlign={{ sm: 'right' }}
                    >
                      <Box pr={3} pb={2}>
                        Phone:
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={11} md={11}>
                      <b>
                        {loading ? (
                          <Skeleton animation="wave" width={230} />
                        ) : (
                          profileData?.Phone
                        )}
                      </b>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={1}
                      md={1}
                      textAlign={{ sm: 'right' }}
                    >
                      <Box pr={3} pb={2}>
                        Address:
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={11} md={11}>
                      <Box sx={{ maxWidth: { xs: 'auto', sm: 300 } }}>
                        {loading ? (
                          <Skeleton animation="wave" width={230} />
                        ) : (
                          profileData?.Address +
                          ' ' +
                          profileData?.City +
                          ' ' +
                          profileData?.State +
                          ' ' +
                          profileData?.Zip
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
Profile.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;
export default Profile;
