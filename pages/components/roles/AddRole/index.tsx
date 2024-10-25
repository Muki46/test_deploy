import Button from '@mui/material/Button';
import SidebarLayout from '@/layouts/SidebarLayout';
import SendIcon from '@mui/icons-material/Send';
import {
  Card,
  CardHeader,
  FormControl,
  InputLabel,
  Divider,
  Grid,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
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
import { Typography } from '@mui/material';
import Footer from '@/components/Footer';
import Head from 'next/head';
import Router from 'next/router';
import { useRouter } from 'next/router';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function not(a: readonly number[], b: readonly number[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly number[], b: readonly number[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: readonly number[], b: readonly number[]) {
  return [...a, ...not(b, a)];
}
function AddRole() {
  const [axios] = useAxios();
  const router = useRouter();
  const { props } = router.query;
  const [buttonStatus, setButtonStatus] = useState('Submit');
  const [snackopen, setSnackOpen] = useState(false);
  const [dopen, setDialogOpen] = useState(false);
  const [severity, setSeverity] = useState('info');
  const [message, setMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [checked, setChecked] = useState<any[]>([]);
  const [left, setLeft] = useState<any[]>([]);
  const [right, setRight] = useState<any[]>([]);
  const [roleId, setRoleId] = useState('0');

  useEffect(() => {
    console.log(props);
    setIsUpdating(true);
    setDialogOpen(true);
    if (props === '0') {
      setButtonStatus('Submit');
    } else {
      setButtonStatus('Update');
    }
    getRoleOpeningData();
  }, []);

  async function getRoleOpeningData() {
    await axios
      .get(`Admin/GetRoleOpeningData`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          if (props !== '0') {
            getRoleById(props, res.data.Data.PermissionAdminMasters);
          } else {
            setLeft(res.data.Data.PermissionAdminMasters);
          }
          setDialogOpen(false);
          setIsUpdating(false);
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
        setSeverity('error');
        setSnackOpen(true);
        setMessage('Failed to load data');
      });
  }

  async function getRoleById(Id, allPermission) {
    setRoleId(Id);
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get('Admin/GetRoleById/' + Id)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setValue('Rname', res.data.Data.RoleByIdMasterData.role_name);
          setValue(
            'Roledescription',
            res.data.Data.RoleByIdMasterData.description
          );
          setValue('status', res.data.Data.RoleByIdMasterData.status);
          let result = allPermission.filter(
            (item) =>
              !res.data.Data.PermissionByIdMasterData.some(
                (itemToBeRemoved) =>
                  itemToBeRemoved.permission_name === item.permission_name
              )
          );
          setLeft(result);
          setRight(res.data.Data.PermissionByIdMasterData);
          setValue('right', res.data.Data.PermissionByIdMasterData);
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
        setMessage('Failed to fetch Role details');
        setSeverity('error');
        setSnackOpen(true);
      });
  }

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    console.log(currentIndex);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    console.log(newChecked);

    setChecked(newChecked);
  };

  const numberOfChecked = (items: readonly number[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: readonly number[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    clearErrors('right');
    console.log(checked);
    console.log(right);
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
    setValue('right', right.concat(leftChecked));
  };

  const handleCheckedLeft = () => {
    console.log(checked);
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const validationSchema = Yup.object().shape({
    Rname: Yup.string().required('Role Name is required'),
    Roledescription: Yup.string().notRequired(),
    status: Yup.string().notRequired(),
    right: Yup.array()
      .min(1, 'At least one Permission is required.')
      .required('required')
  });

  const {
    control,
    register,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      Rname: '',
      status: '',
      Roledescription: '',
      right: []
    },
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = (data) => {
    if (right.length == 0) {
      setError('right', {
        type: 'manual',
        message: 'At least one Permission is required.'
      });
    } else {
      setIsUpdating(true);
      setDialogOpen(true);
      console.log(severity);
      console.log(right);
      buttonStatus === 'Submit' ? createRole(data) : updateRole(data);
    }
  };

  async function createRole(data) {
    const roleMappingData = [];
    if (right.length > 0) {
      for (var i = 0; i < right.length; i++) {
        roleMappingData.push({
          role_permission_id: 0,
          permission_id: right[i].permission_id
        });
      }
    }
    var postData = {
      RoleName: data.Rname,
      Description: data.Roledescription,
      RolePermissionRelations: roleMappingData,
      CreatedBy: localStorage.getItem('UserId'),
      CreatedDate: moment(new Date()).format('MM-DD-YYYY'),
      ModifiedBy: localStorage.getItem('UserId'),
      ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
    };
    axios
      .post('Admin/CreateRole', postData)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setIsUpdating(false);
          setMessage('Role Created');
          setSnackOpen(true);
          setDialogOpen(false);
          setSeverity('success');
          postAduitLog(data.Rname + " Role has been created successfully");
          setTimeout(goBack, 2000);
        } else {
          setIsUpdating(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
          setDialogOpen(false);
          postAduitLog(data.Rname + " Role creation failed");
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setMessage('Failed To Create Role');
        setSnackOpen(true);
        setSeverity('error');
        setDialogOpen(false);
        setTimeout(goBack, 2000);
      });
  }

  async function updateRole(data) {
    const roleUpdateMappingData = [];
    if (right.length > 0) {
      for (var i = 0; i < right.length; i++) {
        console.log(right[i].role_permission_id);
        roleUpdateMappingData.push({
          role_permission_id: right[i].role_permission_id,
          permission_id: right[i].permission_id
        });
      }
    }
    var postUpdateData = {
      RoleId: roleId,
      RoleName: data.Rname,
      Description: data.Roledescription,
      Status: data.status,
      RolePermissionRelations: roleUpdateMappingData,
      ModifiedBy: localStorage.getItem('UserId'),
      ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
    };

    axios
      .post('Admin/UpdateRole', postUpdateData)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setIsUpdating(false);
          setMessage('Role Updated');
          setSnackOpen(true);
          setDialogOpen(false);
          setSeverity('success');
          setTimeout(goBack, 2000);
        } else {
          setIsUpdating(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
          setDialogOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setMessage('Failed To Update Role');
        setSnackOpen(true);
        setSeverity('error');
        setDialogOpen(false);
        setTimeout(goBack, 2000);
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


  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  const goBack = () => {
    Router.push({
      pathname: '/components/roles'
    });
  };

  const customList = (title: React.ReactNode, items: readonly number[]) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1, bgcolor: 'rgba(0, 0, 0, 0.03) !important' }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            sx={{ bgcolor: 'transparent !important' }}
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'all items selected'
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          width: 300,
          height: 300,
          bgcolor: 'rgba(0, 0, 0, 0.06)',
          overflow: 'auto'
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value: any) => {
          const labelId = `transfer-list-all-item-${value.permission_id}-label`;

          return (
            <ListItemButton
              key={value.permission_id}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId
                  }}
                  sx={{ bgcolor: 'transparent !important' }}
                />
              </ListItemIcon>
              <ListItemText
                id={value.permission_id}
                primary={value.permission_name}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

  return (
    <>
      <Head>
        <title>Add Role</title>
      </Head>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1 }
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Card sx={{ margin: '2%' }}>
          <Grid
            container
            direction="row"
            alignItems="stretch"
            spacing={3}
            style={{ marginTop: '3px', paddingBottom: '10px' }}
          >
            <Grid item xs={12}>
              <Typography
                sx={{ marginLeft: '30px' }}
                variant="h3"
                component="h3"
                gutterBottom
              >
                Add Role
              </Typography>
            </Grid>
            <Grid item xs={3} sx={{ marginLeft: '20px' }}>
              <Grid container>
                <Grid item xs={12} md={12}>
                  <Controller
                    name="Rname"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        sx={{ width: '40ch' }}
                        required
                        {...field}
                        id="Rname"
                        label="Role Name"
                        variant="filled"
                        {...register('Rname')}
                        error={errors.Rname ? true : false}
                        helperText={errors.Rname?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={12} sx={{ marginTop: '20px' }}>
                  <Controller
                    name="Roledescription"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        sx={{ width: '40ch' }}
                        rows={4}
                        multiline
                        {...field}
                        id="Role-Description"
                        label="Role-Description"
                        {...register('Roledescription')}
                        error={errors.Roledescription ? true : false}
                        helperText={errors.Roledescription?.message}
                        variant="filled"
                      />
                    )}
                  />
                </Grid>

                {buttonStatus == 'Update' ? (
                  <Grid item xs={12} md={12} sx={{ marginTop: '20px' }}>
                    <FormControl variant="filled" sx={{ width: '40ch', m: 1 }}>
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
            </Grid>
            <Grid item xs={7}>
              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item>{customList('Available Permissions', left)}</Grid>
                <Grid item>
                  <Grid container direction="column" alignItems="center">
                    <Button
                      sx={{ my: 0.5 }}
                      variant="outlined"
                      size="small"
                      onClick={handleCheckedRight}
                      disabled={leftChecked.length === 0}
                      aria-label="move selected right"
                    >
                      &gt;
                    </Button>
                    <Button
                      sx={{ my: 0.5 }}
                      variant="outlined"
                      size="small"
                      onClick={handleCheckedLeft}
                      disabled={rightChecked.length === 0}
                      aria-label="move selected left"
                    >
                      &lt;
                    </Button>
                  </Grid>
                </Grid>
                <Grid item>
                  {customList('Chosen Permissions', right)}
                  {errors.right && (
                    <p
                      style={{
                        color: '#FF1943',
                        fontSize: '13px',
                        fontWeight: 'bold'
                      }}
                    >
                      {errors.right.message}
                    </p>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                marginTop: '16px',
                marginLeft: '21px',
                marginBottom: '20px'
              }}
              endIcon={<SendIcon />}
            >
              {buttonStatus}
            </Button>
            <Button
              variant="contained"
              size="large"
              color="error"
              sx={{
                marginTop: '16px',
                marginLeft: '21px',
                marginBottom: '20px'
              }}
              onClick={goBack}
            >
              Cancel
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
        </Card>
      </Box>
      <Footer />
    </>
  );
}

AddRole.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;
export default AddRole;
