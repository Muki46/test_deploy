import SidebarLayout from '@/layouts/SidebarLayout';
import Head from 'next/head';
import Footer from '@/components/Footer';
import { Autocomplete, Box, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { Grid, Typography } from '@mui/material';
import Router from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import SendIcon from '@mui/icons-material/Send';
import { forwardRef, useEffect, useState } from 'react';
import moment from 'moment';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { DNA } from 'react-loader-spinner';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import { useAxios } from 'pages/services';
import DialogContent from '@mui/material/DialogContent';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AddReportConfiguration() {
  const validationSchema = Yup.object().shape({
    snp: Yup.string().required('SNP is required'),
    parameters: Yup.array()
      .of(
        Yup.object().shape({
          gtype: Yup.string().required('Geno Type is required'),
          rtext: Yup.string().required('Result Text is required'),
          sname: Yup.string().notRequired(),
          studyDescription: Yup.string().notRequired(),
          referencelink: Yup.string().notRequired()
        })
      )
      .test(
        'unique-gtype',
        'Duplicate gtype values are not allowed',
        function (value) {
          if (!value) return true; // return true if the array is empty or undefined

          const gtypeSet = new Set();
          const duplicates = [];

          value.forEach((item, index) => {
            if (gtypeSet.has(item.gtype)) {
              duplicates.push({ gtype: item.gtype, index });
            } else {
              gtypeSet.add(item.gtype);
            }
          });

          if (duplicates.length > 0) {
            return this.createError({
              path: `${this.path}[${duplicates[0].index}].gtype`,
              message: `Duplicate Geno Type : ${duplicates[0].gtype}`
            });
          }

          return true; //no duplicates are found,
        }
      )
  });

  const [axios] = useAxios();
  const [snackopen, setSnackOpen] = useState(false);
  const [dopen, setDialogOpen] = useState(false);
  const [severity, setSeverity] = useState('info');
  const [message, setMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [geneSnpResultData, setGeneSnpResultData] = useState([]);
  const [geneSnpId, setGeneSnpId] = useState(0);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      snp: '',
      parameters: [
        {
          gtype: '',
          rtext: '',
          sname: '',
          studyDescription: '',
          referencelink: ''
        }
      ]
    },
    resolver: yupResolver(validationSchema)
  });

  const {
    fields: parameterfields,
    append: appendParameters,
    remove: removeParameters
  } = useFieldArray({
    control,
    name: 'parameters'
  });

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  const onSubmit = (data) => {
    setIsUpdating(true);
    setDialogOpen(true);
    console.log(severity);
    const postData = [];
    if (data.parameters.length > 0) {
      for (let i = 0; i < data.parameters.length; i++) {
        console.log(data.parameters[i]);
        postData.push({
          pcategory_gene_snps_mapping_id: geneSnpId,
          pgenotype: data.parameters[i].gtype,
          pgenotype_result: data.parameters[i].rtext,
          pstudy_name: data.parameters[i].sname,
          pstudy_description: data.parameters[i].studyDescription,
          pstudy_link: data.parameters[i].referencelink
        });
      }
    }
    createCategoryGeneSnpResultMapping(postData);
  };

  async function createCategoryGeneSnpResultMapping(data) {
    var postData = {
      CategoryGeneSnpResultRelation: data,
      CreatedBy: localStorage.getItem('UserId'),
      CreatedDate: moment(new Date()).format('MM-DD-YYYY'),
      ModifiedBy: localStorage.getItem('UserId'),
      ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
    };
    const gtypes = data.map((item) => item.pgenotype);
    axios
      .post('Category/CreateCategoryGeneSnpResultMapping', postData)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setIsUpdating(false);
          setMessage('Configuration Created Successfully');
          setSnackOpen(true);
          setDialogOpen(false);
          setSeverity('success');
          postAduitLog(gtypes + ' Geno Type has been created successfully');
        } else {
          setIsUpdating(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
          setDialogOpen(false);
          postAduitLog(gtypes + ' Geno Type creation failed');
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setMessage('Failed To Create ');
        setSnackOpen(true);
        setSeverity('error');
        setDialogOpen(false);
        window.location.reload();
      });
  }

  const goBack = () => {
    Router.push({
      pathname: '/components/reportConfiguration'
    });
  };

  useEffect(() => {
    GetCategoryGeneSnpResultOpeningData();
  }, []);

  async function GetCategoryGeneSnpResultOpeningData() {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get('Category/GetCategoryGeneSnpResultOpeningData')
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setGeneSnpResultData(res.data.Data);
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
        setMessage('Failed to fetch  details');
        setSeverity('error');
        setSnackOpen(true);
      });
  }

  const onGeneSnpChange = (e, value) => {
    console.log(e);
    console.log(value);
    if (value != null) {
      setGeneSnpId(value.CategoryGeneSnpsMappingId);
    }
  };

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
          Router.push({
            pathname: '/components/reportConfiguration'
          });
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

  return (
    <>
      <Head>
        <title>Add Genotype Configuration</title>
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
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
          style={{ marginTop: '8px' }}
        >
          <Grid item xs={12}>
            <Typography
              sx={{ marginLeft: '20px' }}
              variant="h3"
              component="h3"
              gutterBottom
            >
              Add Genotype Configuration
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Controller
              control={control}
              name="snp"
              rules={{ required: true }}
              render={() => (
                <Autocomplete
                  sx={{
                    display: 'inline-flex',
                    width: '55ch',
                    marginLeft: '8px'
                  }}
                  options={geneSnpResultData}
                  onChange={onGeneSnpChange}
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
                      {...register('snp')}
                      error={errors.snp ? true : false}
                      helperText={errors.snp?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>
          {parameterfields.map((item, index) => {
            return (
              <div key={item.id}>
                <Grid
                  container
                  spacing={2}
                  sx={{ marginLeft: '20px', marginTop: '10px' }}
                >
                  <Grid item xs={1}>
                    <Controller
                      name={`parameters.${index}.gtype`}
                      control={control}
                      render={({ field: { onChange } }) => (
                        <TextField
                          sx={{
                            display: 'inline-flex',
                            width: '15ch'
                          }}
                          required
                          id="genoType"
                          label="Geno Type"
                          variant="filled"
                          defaultValue={item.gtype}
                          onChange={onChange}
                          {...register(`parameters.${index}.gtype`)}
                          error={
                            errors.parameters?.[index]?.gtype ? true : false
                          }
                          helperText={
                            errors.parameters?.[index]?.gtype?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3} sx={{ marginLeft: '10px' }}>
                    <Controller
                      name={`parameters.${index}.rtext`}
                      control={control}
                      render={({ field: { onChange } }) => (
                        <TextField
                          sx={{
                            display: 'inline-flex',
                            width: '45ch'
                          }}
                          required
                          rows={4}
                          multiline
                          fullWidth
                          id="resultText"
                          label="Result Text"
                          variant="filled"
                          defaultValue={item.rtext}
                          onChange={onChange}
                          {...register(`parameters.${index}.rtext`)}
                          error={
                            errors.parameters?.[index]?.rtext ? true : false
                          }
                          helperText={
                            errors.parameters?.[index]?.rtext?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={2} sx={{ marginLeft: '10px' }}>
                    <Controller
                      name={`parameters.${index}.sname`}
                      control={control}
                      render={({ field: { onChange } }) => (
                        <TextField
                          sx={{
                            display: 'inline-flex',
                            width: '30ch'
                          }}
                          rows={4}
                          multiline
                          fullWidth
                          id="study-Name"
                          label="Study Name"
                          onChange={onChange}
                          defaultValue={item.sname}
                          {...register(`parameters.${index}.sname`)}
                          error={
                            errors.parameters?.[index]?.sname ? true : false
                          }
                          helperText={
                            errors.parameters?.[index]?.sname?.message
                          }
                          variant="filled"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={2} sx={{ marginLeft: '10px' }}>
                    <Controller
                      name={`parameters.${index}.studyDescription`}
                      control={control}
                      render={({ field: { onChange } }) => (
                        <TextField
                          sx={{
                            display: 'inline-flex',
                            width: '30ch'
                          }}
                          rows={4}
                          multiline
                          fullWidth
                          id="study-Description"
                          label="Study Description"
                          onChange={onChange}
                          defaultValue={item.studyDescription}
                          {...register(`parameters.${index}.studyDescription`)}
                          error={
                            errors.parameters?.[index]?.studyDescription
                              ? true
                              : false
                          }
                          helperText={
                            errors.parameters?.[index]?.studyDescription
                              ?.message
                          }
                          variant="filled"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={2} sx={{ marginLeft: '10px' }}>
                    <Controller
                      name={`parameters.${index}.referencelink`}
                      control={control}
                      render={({ field: { onChange } }) => (
                        <TextField
                          sx={{
                            display: 'inline-flex',
                            width: '30ch'
                          }}
                          rows={4}
                          multiline
                          fullWidth
                          id="reference-link"
                          label="Reference link"
                          defaultValue={item.referencelink}
                          {...register(`parameters.${index}.referencelink`)}
                          onChange={onChange}
                          error={
                            errors.parameters?.[index]?.referencelink
                              ? true
                              : false
                          }
                          helperText={
                            errors.parameters?.[index]?.referencelink?.message
                          }
                          variant="filled"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={1} sx={{ marginLeft: '10px' }}>
                    <Button
                      onClick={() => removeParameters(index)}
                      size="small"
                      variant="outlined"
                    >
                      Remove
                    </Button>
                  </Grid>
                </Grid>
              </div>
            );
          })}
        </Grid>
        <Grid container>
          <Button
            type="button"
            variant="contained"
            size="large"
            sx={{ marginTop: '16px', marginLeft: '15px' }}
            endIcon={<SendIcon />}
            onClick={() => {
              appendParameters({
                gtype: '',
                rtext: '',
                sname: '',
                studyDescription: '',
                referencelink: ''
              });
            }}
          >
            Add Row
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ marginTop: '16px', marginLeft: '15px' }}
            endIcon={<SendIcon />}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            size="large"
            color="error"
            sx={{ marginTop: '16px', marginLeft: '15px' }}
            onClick={goBack}
          >
            Cancel
          </Button>
          {/* <Button
            variant="contained"
            color="error"
            size="large"
            sx={{ marginTop: '16px', marginLeft: '15px' }}
          >
            Cancel
          </Button> */}
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
      </Box>
      <Footer />
    </>
  );
}

AddReportConfiguration.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default AddReportConfiguration;
