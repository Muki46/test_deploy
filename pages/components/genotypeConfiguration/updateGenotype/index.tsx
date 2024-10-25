import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useAxios } from 'pages/services';
import { useState, useEffect, forwardRef } from 'react';
import moment from 'moment-timezone';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { DNA } from 'react-loader-spinner';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function UpdateGenotype(data) {
  const [axios] = useAxios();
  const [snackopen, setSnackOpen] = useState(false);
  const [dopen, setDialogOpen] = useState(false);
  const [severity, setSeverity] = useState('info');
  const [conditionMappingId, setConditionMappingId] = useState(0);
  const [message, setMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [genetypeData, setGenetypeData] = useState([]);
  const [genotypeValue, setGenotypeValue] = useState([]);

  const validationSchema = Yup.object().shape(
    {
      psnp: Yup.string().required('SNP is required'),
      gtype: Yup.array()
      .min(1, 'At least one Genotype is required')
      .required('Genotype  is required'),
      status: Yup.string().notRequired(),
    }
  );


  const {
    control,
    register,
    handleSubmit,
    clearErrors,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      psnp: '',
      gtype: []
    },
    resolver: yupResolver(validationSchema)
  });

 
  const handleClose = (reason) => {
    console.log(severity);
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  

  useEffect(() => {
    console.log(data.props);
    setConditionMappingId(data.props);
    GetConditionGeneMappingById(data.props);
  }, []);

  async function GetConditionGeneMappingById(conditionId) {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get(`Category/GetConditionGeneMappingById/${conditionId}`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          console.log(res.data.Data);
          getGenotypeBySNP(res.data.Data[0].CategoryGeneSnpsMappingId, res.data.Data[0].Genotype);
          setValue('psnp', res.data.Data[0].Snp);
          setValue('status', res.data.Data[0].Status);
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
        setMessage('Failed to fetch Data');
        setSeverity('error');
        setSnackOpen(true);
      });
  }

  async function getGenotypeBySNP(Snp, str) {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get(`Category/GetGenotypeBySNPId/${Snp}`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setGenetypeData(res.data.Data);
          let gtyperesult = []
          gtyperesult = str.split(',');
          const items = [];
          for (let i = 0; i < gtyperesult.length; i++) {
            let item = {Genotype : ''};
            item.Genotype = gtyperesult[i];
            items.push(item);
        }
        console.log(items);
          setGenotypeValue(items);
          setValue('gtype', items);
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
        setMessage('Failed to fetch Data');
        setSeverity('error');
        setSnackOpen(true);
      });
  }

  const onSubmit = (data) => {
    console.log(data);
     let str = ''
    data.gtype.forEach(function (arrayItem) {
      if(arrayItem.Genotype){
            str += arrayItem.Genotype + ',';
      }
    });
    let nstr = str.slice(0, -1);
    var postData = {
      ConditionMappingId:conditionMappingId,
      Genotype:nstr,
      Status: data.status,
      ModifiedBy: localStorage.getItem('UserId'),
      ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
    };
    console.log(postData);
    axios
      .put('Category/UpdateConditionGenotypeByConditionId', postData)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setIsUpdating(false);
          setMessage('Configuration updated Successfully');
          setSnackOpen(true);
          setDialogOpen(false);
          setSeverity('success');
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
        setMessage('Failed To Create ');
        setSnackOpen(true);
        setSeverity('error');
        setDialogOpen(false);
        //window.location.reload();
      });
  }

  const onClearGenotypeChange = () => {
    setGenotypeValue([]);
    setValue('gtype', []);
  };

  const onAddGenotypeChange = (value) => {
    console.log(value);
    console.log('add');
    clearErrors('gtype');

    const uniqueValues = value.filter(
      (option) =>
        !genotypeValue.some(
          (existingOption) =>
            existingOption.Genotype === option.Genotype
        )
    );
    setValue('gtype', [...genotypeValue, ...uniqueValues]);
    const result = [...genotypeValue, ...uniqueValues];
    console.log(result);
    setGenotypeValue(result);
  };

  const onRemoveGenotypeChange = (value) => {
    setGenotypeValue(value);
    setValue('gtype', value);
    if (value.length > 0) {
      for (let i = 0; i < value.length; i++) {
        console.log(value[i].domain_master_id);
      }
    }
  };

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '32ch' }
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
      >
        <Grid container>
          <Grid item xs={3}>
            <Controller
              name="psnp"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  id="psnp"
                  label="SNP"
                  variant="filled"
                  {...register('psnp')}
                  error={errors.psnp ? true : false}
                  helperText={errors.psnp?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              control={control}
              name="gtype"
              rules={{ required: true }}
              render={() => (
                <Autocomplete
                  multiple
                  getOptionLabel={(option) => option.Genotype}
                  options={genetypeData}
                  value={genotypeValue}
                  onChange={(event, item, situation) => {
                    console.log(event);
                    console.log(item);
                    if (situation === 'removeOption') {
                      onRemoveGenotypeChange(item);
                    } else if (situation === 'clear') {
                      onClearGenotypeChange();
                    } else {
                      onAddGenotypeChange(item);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      sx={{ width: '32ch' }}
                      {...params}
                      label="Geno Type"
                      variant="filled"
                      error={errors.gtype ? true : false}
                      helperText={errors.gtype?.message}
                      required
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
                  <Grid item xs={12} md={12} >
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
                  </Grid></Grid>
        </Grid>
        <Grid container>
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ marginTop: '13px', marginLeft: '8px' }}
            endIcon={<SendIcon />}
          >
            Update
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
      </Grid>
    </Box>
  );
}

export default UpdateGenotype;
