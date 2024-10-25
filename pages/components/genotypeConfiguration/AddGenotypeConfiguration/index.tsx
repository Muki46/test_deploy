import SidebarLayout from '@/layouts/SidebarLayout';
import Head from 'next/head';
import Footer from '@/components/Footer';
import { FormControl,InputLabel,Autocomplete, Box, TextField, MenuItem, Tooltip, IconButton, useTheme,
  Select } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
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
import { useRouter } from 'next/router';
import DialogContent from '@mui/material/DialogContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import UpdateGenptype from '../updateGenotype';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
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

function AddGenotypeConfiguration() {
  const validationSchema = Yup.object().shape({
    rname: Yup.string().required('Report Type is required'),
    cname: Yup.string().required('Category is required'),
    sname: Yup.string().required('Sub Category is required'),
    cndname: Yup.string().required('Condition Name is required'),
    graphName: Yup.string().required('Graph State Name is required'),
    clrname: Yup.string().required('Color is required'),
    status: Yup.string().notRequired(),
    parameters: Yup.array()
      .of(
        Yup.object().shape({
          snp: Yup.string().notRequired(),
          gtype: Yup.string().notRequired()
        })
      )
  });

  let genoArray = [];
  const router = useRouter();
  const { props } = router.query;
  const [axios] = useAxios();
  const [snackopen, setSnackOpen] = useState(false);
  const [dopen, setDialogOpen] = useState(false);
  const [severity, setSeverity] = useState('info');
  const [buttonStatus, setButtonStatus] = useState('Submit');
  const [message, setMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [geneSnpResultData, setGeneSnpResultData] = useState([]);
  const theme = useTheme();
  const [reportData, SetReportData] = useState([]);
  const [subCategoryData, SetSubCategoryData] = useState([]);
  const [conditionData, SetConditionData] = useState([]);
  const [graphData, SetGraphData] = useState([]);
  const [colorData, SetColorData] = useState([]);
  const [genetypeData, setGenetypeData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [conditionValue, setConditionValue] = useState([]);
  const [graphValue, setGraphValue] = useState([]);
  const [colorValue, setColorValue] = useState([]);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);

  const {
    control,
    register,
    clearErrors,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      rname: '',
      cname: '',
      sname: '',
      cndname: '',
      graphName: '',
      clrname: '',
      parameters: [
        {
          snp: '',
          gtype: ''
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
    console.log(conditionValue);
    console.log(graphValue);
    console.log(colorValue);
    setIsUpdating(true);
    setDialogOpen(true);
    console.log(severity);
    buttonStatus === 'Submit' ? createConditionGenotypeSnp(data) : updateConditionGenotypeSnp(data);
  };

  async function createConditionGenotypeSnp(data) {
    const postData1 = [];
    if (data.parameters.length > 0) {
      for (let i = 0; i < data.parameters.length; i++) {
        var gtype_remove = data.parameters[i].gtype.substring(0, data.parameters[i].gtype.length-1);;
        postData1.push({
          category_gene_snps_mapping_id: data.parameters[i].snp,
          genotype: gtype_remove
        });
      }
    }

    var postData = {
      SubcategoryId:data.sname,
      condition_master_id: data.cndname,
      graph_state_master_id: data.graphName,
      color_master_id: data.clrname,
      GeneConditions: postData1,
      CreatedBy: localStorage.getItem('UserId'),
      CreatedDate: moment(new Date()).format('MM-DD-YYYY'),
      ModifiedBy: localStorage.getItem('UserId'),
      ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
    };
    console.log(postData);
    axios
      .post('Category/CreateConditionGenotypeSnp', postData)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setIsUpdating(false);
          setMessage('Configuration Created Successfully');
          setSnackOpen(true);
          setDialogOpen(false);
          setSeverity('success');
          Router.push({
            pathname: '/components/genotypeConfiguration'
          });
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
        window.location.reload();
      });
  }

  async function updateConditionGenotypeSnp(data) {
    let postData1 = [];
    if (data.parameters.length > 0) {
      for (let i = 0; i < data.parameters.length; i++) {
        if(data.parameters[i].gtype.length === 0){
          postData1 = [];
        } else{
          var gtype_remove = data.parameters[i].gtype.substring(0, data.parameters[i].gtype.length-1);;
          postData1.push({
            category_gene_snps_mapping_id: data.parameters[i].snp,
            genotype: gtype_remove
          });
        }
       
      }
    }
    var postData = {
      SubCategoryConditionMappingId:props,
      SubcategoryId:data.sname,
      ConditionMasterId: data.cndname,
      GraphStateId: data.graphName,
      ColorId: data.clrname,
      GeneConditions: postData1,
      Status: data.status,
      ModifiedBy: localStorage.getItem('UserId'),
      ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
    };
    console.log(postData);
    axios
      .put('Category/UpdateConditionGenotypeBySubId', postData)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setIsUpdating(false);
          setMessage('Configuration updated Successfully');
          setSnackOpen(true);
          setDialogOpen(false);
          setSeverity('success');
          Router.push({
            pathname: '/components/genotypeConfiguration'
          });
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


  const goBack = () => {
    Router.push({
      pathname: '/components/genotypeConfiguration'
    });
  };

  useEffect(() => {
    console.log(props);
    if (props === undefined) {
      setButtonStatus('Submit');
    } else {
      setButtonStatus('Update');
    }
    GetSubConfigOpeningData();
  }, []);


  const handleDelete  = (id) => {
    console.log(id);
    setIsUpdating(true);
    setDialogOpen(true);
    const postData = [
      {
        Id: id,
        ModifiedBy: localStorage.getItem('UserId'),
        ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
      }
    ];

    axios
      .delete('Category/DeleteGenotypeByConditionId', { data: postData })
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
  };

  async function GetSubConfigOpeningData() {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get('Category/GetSubConfigOpeningData')
      .then((res) => {
        if (res.data.StatusCode == 200) {
          if (props !==  undefined) {
            getConditionGenotypeBySubId(props);
          }
          SetReportData(res.data.Data.ReportTypeMaster)
          SetConditionData(res.data.Data.ConditionMaster)
          SetGraphData(res.data.Data.GraphMaster)
          SetColorData(res.data.Data.ColorMaster)
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

  async function getConditionGenotypeBySubId(Id) {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get('Category/GetConditionGenotypeBySubId/' + Id)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setValue('rname', res.data.Data.ConditionGenotypeBasic[0].report_master_id);
          setValue('cndname', res.data.Data.ConditionGenotypeBasic[0].condition_master_id);
          setValue('graphName', res.data.Data.ConditionGenotypeBasic[0].graph_state_id);
          setValue('clrname', res.data.Data.ConditionGenotypeBasic[0].color_id);
          setValue('status', res.data.Data.ConditionGenotypeBasic[0].status);
          getCategoryByReportId(res.data.Data.ConditionGenotypeBasic[0].report_master_id,
            res.data.Data.ConditionGenotypeBasic[0].category_id,
            res.data.Data.ConditionGenotypeBasic[0].sub_category_id
          );
          for(let i=0;i<res.data.Data.ConditionSnpGenotype.length;i++){
            genoArray.push({
              CategoryGeneSnpsMappingId: res.data.Data.ConditionSnpGenotype[i].category_gene_snps_mapping_id
            });
          }
          
          setRows(res.data.Data.ConditionSnpGenotype);
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

  const onReportChange = (event) => {
    clearErrors('rname');
    getCategoryByReportId(event.target.value, 0, 0);
  };

  const onCategoryChange = (event) => {
    clearErrors('cname');
    getSubCategoryByReportId(event.target.value, 0);
   
  };

  const onSubCategoryChange = (event) => {
    clearErrors('sname');  
    getGeneSNPBySubCategoryId(event.target.value);
  };
  
  const onConditionChange = (event) => { 
    setConditionValue(event.target.value);
  };
  
  const onGraphStateChange = (event) => { 
    setGraphValue(event.target.value);
  };

  const onColorChange = (event) => { 
    setColorValue(event.target.value);
  };

  const onSnpChange = (value,index) => { 
    console.log(value?.CategoryGeneSnpsMappingId);
    setValue(`parameters.${index}.snp`, value?.CategoryGeneSnpsMappingId);
    getGenotypeBySNP(value?.CategoryGeneSnpsMappingId);
  };
  
  const onGenotypeChange = (value, index) => { 
    let str = ''
    value.forEach(function (arrayItem) {
      if(arrayItem.Genotype){
            str += arrayItem.Genotype + ',';
      }
    });
    setValue(`parameters.${index}.gtype`, str);
  };

  async function getCategoryByReportId(ReportId, cid, sid) {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get(`Category/GetCategoryByReportId/${ReportId}`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setCategoryData(res.data.Data);
          setValue('cname', cid);
          getSubCategoryByReportId(cid, sid);
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

  async function getSubCategoryByReportId(CategoryId,sid) {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get(`Category/GetSubCategoryByCategoryId/${CategoryId}`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          SetSubCategoryData(res.data.Data);
          setValue('sname', sid);
          getGeneSNPBySubCategoryId(sid);
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

  async function getGeneSNPBySubCategoryId(SubcategoryId) {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get(`Category/GetSNPGeneBySubCategoryId/${SubcategoryId}`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          console.log(genoArray);
          console.log(res.data.Data);
          const orderedProducts = res.data.Data.filter(product =>
            !genoArray.some(order => order.
              CategoryGeneSnpsMappingId
               === product.
              CategoryGeneSnpsMappingId
              )
        );
         console.log(orderedProducts);
          setGeneSnpResultData(orderedProducts);
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

  async function getGenotypeBySNP(Snp) {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get(`Category/GetGenotypeBySNPId/${Snp}`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setGenetypeData(res.data.Data);
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
          spacing={1}
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
          <Grid item xs={3}>
            <FormControl
              variant="filled"
              sx={{ marginTop: '8px', width: '42ch', m: 1 }}
            >
              <InputLabel required id="demo-simple-select-filled-label">
                Report Name
              </InputLabel>
              <Controller
                name="rname"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <Select
                    labelId="demo-simple-select-filled"
                    {...register('rname')}
                    id="demo-simple-select"
                    value={value}
                    label="Report Name"
                    onChange={(event) => {
                      onChange(event);
                      onReportChange(event);
                    }}
                  >
                    {reportData.map((c, i) => (
                      <MenuItem key={`c-${i}`} value={c.report_master_id}>
                        {c.report_name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.rname && (
                <p
                  style={{
                    color: '#FF1943',
                    fontSize: '13px',
                    fontWeight: 'bold'
                  }}
                >
                  {errors.rname.message}
                </p>
              )}
            </FormControl>
          </Grid>
           <Grid item xs={3}>
           <FormControl
              variant="filled"
              sx={{ marginTop: '8px', width: '42ch', m: 1 }}
            >
              <InputLabel required id="demo-simple-select-filled-label">
               Category Name
              </InputLabel>
              <Controller
                name="cname"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <Select
                    labelId="demo-simple-select-filled"
                    {...register('cname')}
                    id="demo-simple-select"
                    value={value}
                    label="Category Name"
                    onChange={(event) => {
                      onChange(event);
                      onCategoryChange(event);
                    }}
                  >
                    {categoryData.map((c, i) => (
                      <MenuItem key={`c-${i}`} value={c.CategoryId}>
                        {c.CategoryName}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.cname && (
                <p
                  style={{
                    color: '#FF1943',
                    fontSize: '13px',
                    fontWeight: 'bold'
                  }}
                >
                  {errors.cname.message}
                </p>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={3}>
          <FormControl
              variant="filled"
              sx={{ marginTop: '8px', width: '42ch', m: 1 }}
            >
              <InputLabel required id="demo-simple-select-filled-label">
               Sub Category Name
              </InputLabel>
              <Controller
                name="sname"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <Select
                    labelId="demo-simple-select-filled"
                    {...register('sname')}
                    id="demo-simple-select"
                    value={value}
                    label="Sub Category Name"
                    onChange={(event) => {
                      onChange(event);
                      onSubCategoryChange(event);
                    }}
                  >
                    {subCategoryData.map((c, i) => (
                      <MenuItem key={`c-${i}`} value={c.SubCategoryId}>
                        {c.SubCategoryName}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.sname && (
                <p
                  style={{
                    color: '#FF1943',
                    fontSize: '13px',
                    fontWeight: 'bold'
                  }}
                >
                  {errors.sname.message}
                </p>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={3}>
          <FormControl
              variant="filled"
              sx={{ marginTop: '8px', width: '42ch', m: 1 }}
            >
              <InputLabel required id="demo-simple-select-filled-label">
               Condition Name
              </InputLabel>
              <Controller
                name="cndname"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <Select
                    labelId="demo-simple-select-filled"
                    {...register('cndname')}
                    id="demo-simple-select"
                    value={value}
                    label="Condition Name"
                    onChange={(event) => {
                      onChange(event);
                      onConditionChange(event);
                    }}
                  >
                    {conditionData.map((c, i) => (
                      <MenuItem key={`c-${i}`} value={c.condition_master_id}>
                        {c.condition_name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.cndname && (
                <p
                  style={{
                    color: '#FF1943',
                    fontSize: '13px',
                    fontWeight: 'bold'
                  }}
                >
                  {errors.cndname.message}
                </p>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={3}>
          <FormControl
              variant="filled"
              sx={{ marginTop: '8px', width: '42ch', m: 1 }}
            >
              <InputLabel required id="demo-simple-select-filled-label">
               Graph State Name
              </InputLabel>
              <Controller
                name="graphName"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <Select
                    labelId="demo-simple-select-filled"
                    {...register('graphName')}
                    id="demo-simple-select"
                    value={value}
                    label="Graph State Name"
                    onChange={(event) => {
                      onChange(event);
                      onGraphStateChange(event);
                    }}
                  >
                    {graphData.map((c, i) => (
                      <MenuItem key={`c-${i}`} value={c.graph_state_id}>
                        {c.graph_state_name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.graphName && (
                <p
                  style={{
                    color: '#FF1943',
                    fontSize: '13px',
                    fontWeight: 'bold'
                  }}
                >
                  {errors.graphName.message}
                </p>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={3}>
          <FormControl
              variant="filled"
              sx={{ marginTop: '8px', width: '42ch', m: 1 }}
            >
              <InputLabel required id="demo-simple-select-filled-label">
               Color
              </InputLabel>
              <Controller
                name="clrname"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <Select
                    labelId="demo-simple-select-filled"
                    {...register('clrname')}
                    id="demo-simple-select"
                    value={value}
                    label="Color"
                    onChange={(event) => {
                      onChange(event);
                      onColorChange(event);
                    }}
                  >
                    {colorData.map((c, i) => (
                      <MenuItem key={`c-${i}`} value={c.color_id}>
                        {c.color_name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.clrname && (
                <p
                  style={{
                    color: '#FF1943',
                    fontSize: '13px',
                    fontWeight: 'bold'
                  }}
                >
                  {errors.clrname.message}
                </p>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={3}>{buttonStatus == 'Update' ? (
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
                  </Grid>
                ) : (
                  ''
                )}</Grid>
          <Grid item xs={3}>&nbsp;</Grid>
          {parameterfields.map((item, index) => {
                return (
                  <div key={item.id} style={{ width: '100%'}}>
                   <Grid container spacing={1} sx={{ marginTop:'8px' }}>
                   <Grid item xs={2} sx={{ marginLeft: '10px'}} >
                   <Controller
                        control={control}
                        name={`parameters.${index}.snp`}
                        rules={{ required: true }}
                        render={() => (
                      <Autocomplete
                            getOptionLabel={(option) =>
                              `${
                                option.SNP +
                                ' , ' +
                                option.Gene
                              }`
                            }
                            options={geneSnpResultData}
                            onChange={(event, item) => {
                              console.log(event);
                              console.log(item);
                              onSnpChange(item, index)
                              
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="SNP"
                                variant="filled"
                                error={
                                errors.parameters?.[index]?.snp ? true : false
                              }
                              helperText={
                                errors.parameters?.[index]?.snp?.message
                              }
                              />
                            )}
                            />
                            )}
                          />
                      </Grid>
                      <Grid item xs={3} sx={{ marginLeft: '10px' }}>
                      <Controller
                        control={control}
                      name={`parameters.${index}.gtype`}
                        rules={{ required: true }}
                        render={() => (
                          <Autocomplete
                            multiple
                            getOptionLabel={(option) => option.Genotype}
                            options={genetypeData}
                            onChange={(event, item) => {
                              console.log(event);
                              console.log(item);
                              onGenotypeChange(item, index)
                              
                            }}
                            renderInput={(params) => (
                              <TextField
                                sx={{ width: '42ch' }}
                                {...params}
                                label="Genotype"
                                variant="filled"
                                error={
                                      errors.parameters?.[index]?.gtype ? true : false
                                    }
                                    helperText={
                                      errors.parameters?.[index]?.gtype?.message
                                    }
                                required
                              />
                            )}
                          />
                        )}
                        />
                      </Grid>
                      
                      <Grid item xs={1} sx={{ marginLeft: '10px', marginTop: '10px' }}>
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
      <Grid item xs={12}>
      {buttonStatus == 'Update' ? ( <TableContainer >
      <Table sx={{ marginLeft: '0px', marginTop: '20px'}} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>SNP</TableCell>
            <TableCell align="center">Genotypes</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.snp}
              </TableCell>
              <TableCell align="center">{row.genotype}</TableCell>
              <TableCell align="center">{row.status == 1 ? 'Active' : 'InActive'}</TableCell>
              <TableCell align="center"> <>
              <Tooltip placement="top" title="View" arrow>
                <IconButton
                  onClick={() => {
                    setId(row
                      .condition_gene_mapping_id);
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
                    handleDelete(
                      row
                        .condition_gene_mapping_id
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
            </></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>) : ''}
        </Grid>
      <Grid item xs={12}>
      <Modal
              open={open}
              onClose={handleClose}
              arial-labelledby="modal-modal-title"
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
                  Add Genotype Configuration
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
                  <Box>
                    <UpdateGenptype props={id} />
                  </Box>
                </div>
              </Box>
            </Modal>
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
                snp:'',
                gtype: ''
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
            {buttonStatus}
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

AddGenotypeConfiguration.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default AddGenotypeConfiguration;
