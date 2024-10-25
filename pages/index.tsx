import { Button, styled, Box } from '@mui/material';
import Router from 'next/router';
import type { ReactElement } from 'react';
import BaseLayout from 'src/layouts/BaseLayout';
import Landing from '../pages/components/landing';
import { useMsal } from '@azure/msal-react';
import { AuthError, InteractionStatus } from '@azure/msal-browser';
import { useEffect, useState, forwardRef } from 'react';
import { DNA } from 'react-loader-spinner';
import { useAxios } from './services';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { TransitionProps } from '@mui/material/transitions';
import moment from 'moment-timezone';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Panel = styled(Box)(
  () => `
    position: absolute;
    z-index: 10;
    width: 800px;
    height: 250px;
    background: #eee;
    top: 50%;
    left: 30%;
    margin: -110px 0 0 -100px;
    padding: 20px;
    border-radius: 4px;
    box-sizing: border-box;
    z-index: 100;
`
);

export const getDisplayTextForAuthentificationStatus = (
  status: InteractionStatus
) => {
  switch (status) {
    case InteractionStatus.AcquireToken:
      return 'aquiring token';
    case InteractionStatus.HandleRedirect:
      return 'redirectig';
    case InteractionStatus.Login:
      return 'logging in';
    case InteractionStatus.Logout:
      return 'logging out';
    case InteractionStatus.None:
      return 'doing nothing';
    case InteractionStatus.SsoSilent:
      return 'SSO Silent';
    case InteractionStatus.Startup:
      return 'starting up';
  }
};

function Overview() {
  const msal = useMsal();
  const [dopen, setDialogOpen] = useState(false);
  const [snackopen, setSnackOpen] = useState(false);
  const [severity, setSeverity] = useState('Success');
  const [message, setMessage] = useState('');

  const [axios] = useAxios();
  const [interactionHistory, setInteractionHistory] = useState<
    InteractionStatus[]
  >([]);

  const [error, setError] = useState('');

  useEffect(() => {
    setInteractionHistory([...interactionHistory, msal.inProgress]);
  }, [msal.inProgress]);

  const authenticate = async () => {
    try {
      const result = await msal.instance.loginPopup();
      setDialogOpen(true);
      console.log('Home Account id:', result.account, severity);
      msal.instance.setActiveAccount(result.account);
      silentAuthentificate();
    } catch (ex) {
      throw ex;
    }
  };

  const silentAuthentificate = async () => {
    const accessTokenRequest = {
      scopes: ['api://5cf3e0ce-6bee-4ebe-b790-7bd7442f1751/ReadAccess']
    };
    try {
      console.log(msal.instance);
      const currentAccount = msal.instance.getActiveAccount();
      console.log('Current account is:', currentAccount.homeAccountId);

      await msal.instance
        .acquireTokenSilent(accessTokenRequest)
        .then((tokenResponse) => {
          localStorage.setItem('token', tokenResponse.accessToken);
          localStorage.setItem('accountId', currentAccount.homeAccountId);
          loadIp();
        });

      setError('');
    } catch (ex) {
      const authEx = ex as AuthError;
      setError(authEx.message);
      console.log(error);
    }
  };

  const loadIp = async () => {
    const response = await fetch('https://api.ipify.org/?format=json');
    const data = await response.json();
    console.log(data.ip);
    getLocation(data.ip);
  };

  const getLocation = async (ipAddress: string) => {
    const response = await fetch(
      `https://apiip.net/api/check?ip=${ipAddress}&accessKey=184e7701-3370-457e-ac1a-0901bc79d131`
    );
    const data = await response.json();
    const location = data.city + ',' + data.regionName + ',' + data.countryName;
    loginDetails(ipAddress, location);
  };

  async function loginDetails(userIP, location) {
    await axios
      .get('Users/GetLoginUserDetails?userIp=' + userIP)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          localStorage.setItem('UserId', res.data.Data.UserDetails.user_id);
          localStorage.setItem(
            'AccountId',
            res.data.Data.UserAccounts[0].account_id
          );
          localStorage.setItem(
            'AccountLogo',
            res.data.Data.UserAccounts[0].account_logo
          );

          localStorage.setItem('ClientId', res.data.Data.UserDetails.client_id);

          localStorage.setItem(
            'ProviderId',
            res.data.Data.UserDetails.provider_id
          );

          localStorage.setItem(
            'PatientId',
            res.data.Data.UserDetails.patient_id
          );

          localStorage.setItem(
            'RoleName',
            res.data.Data.UserRoles[0].role_name
          );
          let permissionArray = JSON.stringify(res.data.Data.UserRoles);
          localStorage.setItem('Permission', permissionArray);
          localStorage.setItem('UserIP', userIP);
          localStorage.setItem(
            'UserName',
            res.data.Data.UserDetails.first_name +
              ' ' +
              res.data.Data.UserDetails.last_name
          );
          postSignInlogs(
            res.data.Data.UserDetails.user_id,
            userIP,
            location,
            res.data.Data.UserRoles
          );
          postAduitLog(
            res.data.Data.UserDetails.first_name +
              ' ' +
              res.data.Data.UserDetails.last_name +
              ' is logged in successfully'
          );
        } else {
          setDialogOpen(false);
          setMessage(res.data.StatusMessage);
          setSnackOpen(true);
          setSeverity('error');
          setTimeout(logoff, 4000);
        }
      });
  }

  async function postSignInlogs(userId, userIP, location, permissionArray) {
    const postData = {
      UserId: userId,
      SignInDate: moment(new Date())
        .tz('America/Los_Angeles')
        .format('MM-DD-YYYY HH:mm'),
      IpAddress: userIP,
      Location: location,
      Action: 'Success'
    };
    await axios
      .post('Users/CreateUserSignInLog', postData)
      .then((res) => {
        console.log(res);
        if (res.data.StatusCode == 200) {
          console.log(permissionArray);
          permissionArray.some((item) => item.permission_name === 'Patients')
            ? Router.push({
                pathname: '/dashboards/crypto'
              })
            : Router.push({
                pathname: '/components/profile'
              });
        } else {
          setDialogOpen(false);
          setMessage(res.data.Data);
          setSnackOpen(true);
          setSeverity('error');
          setTimeout(logoff, 2000);
        }
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }

  async function postAduitLog(message) {
    const postData = {
      UserId: 0,
      AuditCategoryMasterId: 1,
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
        } else {
          setDialogOpen(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setDialogOpen(false);
        setSeverity('error');
      });
  }

  const logoff = async () => {
    const account = await msal.instance.getActiveAccount();
    const currentAccount = await msal.instance.getAccountByHomeId(
      account.homeAccountId
    );
    const logoutHint = currentAccount.idTokenClaims.login_hint;
    await msal.instance.logoutPopup({
      logoutHint: logoutHint,
      mainWindowRedirectUri: '/'
    });
  };

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  return (
    <main>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Snackbar
          open={snackopen}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
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
      <div>
        <div>
          <Landing />
        </div>
        <Panel>
          <img
            width={200}
            height={40}
            alt="EndoDNA-logo"
            src="/static/images/logo/EndoDNA-logo.png"
          />
          <h3 style={{ fontSize: '22px' }}>
            The breakthrough DNA test that matches you with the right
            cannabinoid products for your wellness journey21.
          </h3>
          <Button
            variant="contained"
            color="success"
            onClick={authenticate}
            style={{
              fontSize: '16px',
              textTransform: 'uppercase',
              padding: '10px 30px'
            }}
          >
            Login
          </Button>
        </Panel>
      </div>
    </main>
  );
}

export default Overview;

Overview.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
