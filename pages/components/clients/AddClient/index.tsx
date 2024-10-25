import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

import {
  Autocomplete,
  Grid,
  Box,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormControl,
  Drawer,
  StyledEngineProvider
} from '@mui/material';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useAxios } from 'pages/services';
import { useState, useEffect, Fragment, forwardRef } from 'react';
import moment from 'moment-timezone';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import '@wfp/ui/assets/css/styles.css';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { DNA } from 'react-loader-spinner';
import CircularProgress from '@mui/material/CircularProgress';
import { useDropzone } from 'react-dropzone';
import ReportColor from 'pages/components/ReportColor';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const thumbsContainer = {
  display: 'flex',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 150,
  height: 150,
  padding: 4
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img1 = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 150,
  height: 150,
  padding: 4
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

function AddClient(data, colorData) {
  const [axios] = useAxios();
  const [snackopen, setSnackOpen] = useState(false);
  const [severity, setSeverity] = useState('Success');
  const [zip, setZip] = useState<any>({ zip: '', state: '', city: '' });
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [dopen, setDialogOpen] = useState(false);
  const [buttonStatus, setButtonStatus] = useState('Submit');
  const loading = open && options.length === 0;
  const [base64URL, setBase64URL] = useState(null);
  const [clientReportMaster, setClientReportMaster] = useState([]);
  const [menpauseTemplateId, setMenpauseTemplateId] = useState();
  const [endoTemplateId, setEndoTemplateId] = useState();
  const [menoPauseDesignId, setMenoPauseDesignId] = useState();
  const [endoDesignId, setendoDesignId] = useState();
  const [clientReportTemplateData, setClientReportTemplateData] = useState([]);
  const [menopauseDesignTemplate, setMenopauseDesignTemplate] = useState([]);
  const [endoDNADesignTemplate, setEndoDNADesignTemplate] = useState([]);
  const [isEndoDNA, setIsEndoDNA] = useState(false);
  const [isMenopause, setIsMenopause] = useState(false);
  const [isClientUser, setIsClientUser] = useState(false);
  const [logo, setLogo] = useState('');
  const [clientId, setClientId] = useState(0);
  const [files, setFiles] = useState([]);
  const [catgValue, setCatgValue] = useState([]);
  const [dropen, setDrOpen] = useState(false);
  const [domainOpeningData, setDomainOpeningData] = useState([]);
  const [savedValue, setSavedValue] = useState([]);
  const [domainValue, setDomainValue] = useState([]);
  const [reportColorsUpdate, setReportColorsUpdate] = useState({
    BgColor: {
      r: '226',
      g: '16',
      b: '147',
      a: '1'
    },
    HeadingColor: {
      r: '18',
      g: '113',
      b: '230',
      a: '1'
    },
    SubHeadingColor: {
      r: '155',
      g: '155',
      b: '155',
      a: '1'
    },
    BackgroundFontColor: {
      r: '255',
      g: '255',
      b: '255',
      a: '1'
    },
    HeadingFontColor: {
      r: '255',
      g: '255',
      b: '255',
      a: '1'
    },
    SubHeadingFontColor: {
      r: '0',
      g: '0',
      b: '0',
      a: '1'
    }
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': []
    },
    noClick: isClientUser,
    onDrop: (acceptedFiles) => {
      setLogo('New Image');
      setBase64URL(acceptedFiles[0]);
      getBase64(acceptedFiles[0]);
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    }
  });

  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  const getBase64 = (file) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setBase64URL(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  };

  const validationSchema = Yup.object().shape(
    {
      cname: Yup.string().required('Client Name is required'),
      zip: Yup.string().nullable().notRequired(),
      city: Yup.string().nullable().notRequired(),
      state: Yup.string().nullable().notRequired(),
      address: Yup.string().nullable().notRequired(),
      fax: Yup.string().nullable().notRequired(),
      pname: Yup.string().nullable().notRequired(),
      pphone: Yup.string().notRequired(),
      catValue: Yup.array()
        .min(1, 'At least one Report Name is required')
        .required('Report Name is required'),

      EndoDnaRadio: Yup.array().required('Template selection is required'),
      domain: Yup.array()
        .min(1, 'At least one Domain is required')
        .required('Domain  is required'),
      status: Yup.string().notRequired(),
      pemail: Yup.string().notRequired(),
      tzone: Yup.string().notRequired(),
      mobNo: Yup.string()
        .nullable()
        .notRequired()
        .when('mobNo', {
          is: (value) => value?.length,
          then: (rule) => rule.min(10)
        })
    },
    [
      // Add Cyclic deps here because when require itself
      ['mobNo', 'mobNo'],
      ['address', 'address']
    ]
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
      cname: '',
      zip: '',
      city: '',
      state: '',
      address: '',
      pname: '',
      pemail: '',
      pphone: '',
      mobNo: '',
      domain: [],
      catValue: [],
      EndoDnaRadio: [],
      tzone: 'PDT',
      fax: ''
    },
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = (data) => {
    setIsUpdating(true);
    setDialogOpen(true);
    const domainData = [];
    console.log(domainValue);
    if (domainValue.length > 0) {
      for (var i = 0; i < domainValue.length; i++) {
        domainData.push({
          domain_master_id: domainValue[i].domain_master_id,
          domain_client_mapping_id: 0
        });
      }
    }

    const domainUpdateData = [];
    console.log(savedValue);
    console.log(domainValue);
    const a3 = domainValue.map((t1) => ({
      ...t1,
      ...savedValue.find((t2) => t2.domain_master_id === t1.domain_master_id)
    }));
    console.log(a3);
    if (domainValue.length > 0) {
      for (var i = 0; i < a3.length; i++) {
        domainUpdateData.push({
          domain_master_id: a3[i].domain_master_id,
          domain_client_mapping_id: a3[i].domain_client_mapping_id == undefined ? 0 :a3[i].domain_client_mapping_id 
        });
      }
    }
    console.log(domainUpdateData);

    console.log(endoDNADesignTemplate);
    console.log(endoDNADesignTemplate);
    const clientReportTemplaterelations = [];
    if (menopauseDesignTemplate.length > 0) {
      clientReportTemplaterelations.push({
        client_id: clientId,
        report_master_id: menopauseDesignTemplate[0].report_master_id,
        report_template_mapping_id: menpauseTemplateId,
        client_report_mapping_id: 0
      });
    }
    if (endoDNADesignTemplate.length > 0) {
      clientReportTemplaterelations.push({
        client_id: clientId,
        report_master_id: endoDNADesignTemplate[0].report_master_id,
        report_template_mapping_id: endoTemplateId,
        client_report_mapping_id: 0
      });
    }
    console.log(clientReportTemplaterelations);
    var postData = {
      ClientId: clientId,
      ClientName: data.cname,
      ClientLogo: base64URL === null ? logo : base64URL,
      Address: data.address,
      City: city,
      State: state,
      Zip: data.zip,
      Phone: data.mobNo,
      Fax: data.fax,
      ContactPersonName: data.pname,
      ContactPersonEmail: data.pemail,
      ContactPersonPhone: data.pphone,
      TimeZone: data.tzone,
      ClientDomainrelations: domainData,
      ClientReportTemplaterelations: clientReportTemplaterelations,
      Status: 1,
      CreatedBy: localStorage.getItem('UserId'),
      CreatedDate: moment(new Date()).format('MM-DD-YYYY'),
      ModifiedBy: localStorage.getItem('UserId'),
      ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
    };

    var postUpdateData = {
      ClientId: clientId,
      ClientName: data.cname,
      ClientLogo: base64URL === null ? logo : base64URL,
      Address: data.address,
      City: city,
      State: state,
      Zip: data.zip,
      Phone: data.mobNo,
      Fax: data.fax,
      ContactPersonName: data.pname,
      ContactPersonEmail: data.pemail,
      ContactPersonPhone: data.pphone,
      TimeZone: data.tzone,
      ClientDomainrelations: domainUpdateData,
      ClientReportTemplaterelations: clientReportTemplaterelations,
      Status: 1,
      CreatedBy: localStorage.getItem('UserId'),
      CreatedDate: moment(new Date()).format('MM-DD-YYYY'),
      ModifiedBy: localStorage.getItem('UserId'),
      ModifiedDate: moment(new Date()).format('MM-DD-YYYY')
    };
    buttonStatus === 'Submit'
      ? createClient(postData, colorData)
      : updateClient(postUpdateData);
  };

  const onZipChange = (event, value) => {
    console.log(event);
    setZip(value);
    setValue('zip', value);
    if (value == null) {
      setValue('city', '');
      setValue('state', '');
      setCity('');
      setState('');
    } else {
      setValue('city', value?.city);
      setValue('state', value?.state);
      setCity(value?.city);
      setState(value?.state);
    }
  };

  async function createClient(data, colorData) {
    console.log(severity);
    axios
      .post('Clients/CreateClients', data)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setIsUpdating(false);
          setDialogOpen(false);
          console.log(colorData);
          UpdateReportColorByClientId(reportColorsUpdate, res.data.Data, 1);
          postAduitLog(
            data.ClientName + ',' + ' has been created successfully'
          );
          setMessage('Client Created Successfully');
          setSnackOpen(true);
          setSeverity('success');
          setInterval(() => {
            window.location.reload();
          }, 2000);
        } else {
          setIsUpdating(false);
          postAduitLog(data.ClientName + ',' + 'creation failed');
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setMessage('Failed To Create Clients');
        setSnackOpen(true);
        setSeverity('error');
      });
  }

  async function UpdateReportColorByClientId(reportColorsUpdate, id, count) {
    setIsUpdating(true);
    setDialogOpen(true);
    const postData = {
      ClientId: id,
      ReportBgColor: `${reportColorsUpdate.BgColor.r},${reportColorsUpdate.BgColor.g},${reportColorsUpdate.BgColor.b}`,
      ReportHeadingColor: `${reportColorsUpdate.HeadingColor.r},${reportColorsUpdate.HeadingColor.g},${reportColorsUpdate.HeadingColor.b}`,
      ReportSubHeadingColor: `${reportColorsUpdate.SubHeadingColor.r},${reportColorsUpdate.SubHeadingColor.g},${reportColorsUpdate.SubHeadingColor.b}`,
      ReportBgFontColor: `${reportColorsUpdate.BackgroundFontColor.r},${reportColorsUpdate.BackgroundFontColor.g},${reportColorsUpdate.BackgroundFontColor.b}`,
      ReportHeadingFontColor: `${reportColorsUpdate.HeadingFontColor.r},${reportColorsUpdate.HeadingFontColor.g},${reportColorsUpdate.HeadingFontColor.b}`,
      ReportSubHeadingFontColor: `${reportColorsUpdate.SubHeadingFontColor.r},${reportColorsUpdate.SubHeadingFontColor.g},${reportColorsUpdate.SubHeadingFontColor.b}`
    };
    await axios
      .put(`Patients/UpdateReportColorByClientId`, postData)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          if (count === 1) {
            setSnackOpen(true);
            setMessage('Client created successfully');
          } else {
            setSnackOpen(true);
            setMessage('Client updated successfully');
          }
          setSeverity('success');
          setIsUpdating(false);
          setDialogOpen(false);
          setInterval(() => {
            window.location.reload();
          }, 2000);
        } else {
          setSnackOpen(true);
          setMessage(res.data.StatusMessage);
          setIsUpdating(false);
          setDialogOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setSnackOpen(true);
        setMessage('Failed to update');
        setIsUpdating(false);
        setDialogOpen(false);
      });
  }

  async function updateClient(data) {
    await axios
      .put('Clients/UpdateClient', data)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setIsUpdating(false);
          setSnackOpen(true);
          UpdateReportColorByClientId(reportColorsUpdate, res.data.Data, 2);
        } else {
          setIsUpdating(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setMessage('Failed To update Clients');
        setSnackOpen(true);
        setSeverity('error');
      });
  }

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  const onChangeHandle = async (value) => {
    // use the changed value to make request and then use the result. Which
    console.log(value);
    if (value.length >= 3) {
      const response = await axios.get(
        'Patients/ZIPSearch?searchText=' + value
      );
      const zip = await response.data;
      setOptions(zip);
    }
  };

  useEffect(() => {
    setIsUpdating(true);
    setDialogOpen(true);
    getClientOpeningData();
  }, []);

  const getDomainClientOpeningData = async (templateArray, reportArray) => {
    setDialogOpen(true);
    setIsUpdating(true);
    const id = data.props;
    await axios
      .get(`Users/GetDomainClientOpeningData`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setDomainOpeningData(res.data.Data.DomainData);
          if (data.props == 0) {
            setIsUpdating(false);
            setButtonStatus('Submit');
          } else {
            setButtonStatus('Update');
            setClientId(data.props);
            getClientById(
              id,
              templateArray,
              reportArray,
              res.data.Data.DomainData
            );
          }
          setDialogOpen(false);
          setIsUpdating(false);
        } else {
          setDialogOpen(false);
          setIsUpdating(false);
          setSnackOpen(true);
          setMessage(res.data.StatusMessage);
        }
      })
      .catch((err) => {
        console.log(err);
        setDialogOpen(false);
        setSnackOpen(true);
        setIsUpdating(false);
        setMessage('Failed to load ClientDomain opening data');
      });
  };

  async function getClientById(
    clientId,
    templateArray,
    reportArray,
    domainArray
  ) {
    const rName = localStorage.getItem('RoleName');
    await axios
      .get('Clients/GetClientById/' + clientId)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          const val = {
            city: 'Wake',
            state: 'VA',
            zip: res.data.Data.ClientMasters.zip
          };
          setZip(val);
          setValue('cname', res.data.Data.ClientMasters.client_name);
          setValue('address', res.data.Data.ClientMasters.address);
          setValue('zip', val.zip);
          setCity(res.data.Data.ClientMasters.city);
          setState(res.data.Data.ClientMasters.state);
          setValue('city', res.data.Data.ClientMasters.city);
          setValue('state', res.data.Data.ClientMasters.state);
          const getCategory = res.data.Data.ClientReportTemplateMasters;

          let categories = [];
          getCategory.forEach((entry) => {
            categories.push({
              report_master_id: entry.report_master_id,
              report_name: entry.report_master_id == 1 ? 'Menopause' : 'EndoDNA'
            });
            if (entry.report_master_id == 1) {
              setIsMenopause(true);
              setMenopauseDesignTemplate(
                templateArray.filter((item) => item.report_master_id == 1)
              );
              setMenoPauseDesignId(entry.report_template_mapping_id);
              setMenpauseTemplateId(entry.report_template_mapping_id);
            } else {
              setIsEndoDNA(true);
              setEndoDNADesignTemplate(
                templateArray.filter((item) => item.report_master_id == 2)
              );
              setendoDesignId(entry.report_template_mapping_id);
              setEndoTemplateId(entry.report_template_mapping_id);
            }
          });

          console.log(categories);
          console.log(reportArray);
          const found = reportArray.filter((item) =>
            categories.some(
              (itemToBeRemoved) =>
                itemToBeRemoved.report_master_id === item.report_master_id
            )
          );
          const result = Object.values(
            found.reduce((r, o) => {
              r[o.report_master_id] = o;
              return r;
            }, {})
          );
          console.log(result);
          if (rName === 'Client User') {
            setIsClientUser(true);
          }
          setCatgValue(result);
          setValue('catValue', result);
          setDomainValue(res.data.Data.DomainMasters);

          const selectedArray = [];
          for (let i = 0; i < res.data.Data.DomainMasters.length; i++) {
            selectedArray.push({
              domain_master_id: res.data.Data.DomainMasters[i].domain_master_id,
              domain_client_mapping_id:
                res.data.Data.DomainMasters[i].domain_client_mapping_id
            });
          }
          console.log(selectedArray);
          const unique = selectedArray.filter((obj, index) => {
            return (
              index ===
              selectedArray.findIndex(
                (o) => obj.domain_master_id === o.domain_master_id
              )
            );
          });
          console.log(unique);
          setSavedValue(unique);

          console.log(domainArray);
          let domainResult = domainArray.filter((item) =>
            res.data.Data.DomainMasters.some(
              (itemToBeSelected) =>
                itemToBeSelected.domain_master_id === item.domain_master_id
            )
          );
          console.log(domainResult);
          const domainresult = Object.values(
            domainResult.reduce((r, o) => {
              r[o.domain_master_id] = o;
              return r;
            }, {})
          );
          console.log(domainresult);
          setDomainValue(domainresult);
          setValue('domain', domainresult);
          setValue('mobNo', res.data.Data.ClientMasters.phone);
          setValue('fax', res.data.Data.ClientMasters.fax);
          setValue('pname', res.data.Data.ClientMasters.contact_person_name);
          setValue('pemail', res.data.Data.ClientMasters.contact_person_email);
          setValue('pphone', res.data.Data.ClientMasters.contact_person_phone);
          setValue('tzone', res.data.Data.ClientMasters.timezone);
          setLogo(res.data.Data.ClientMasters.client_logo);
          getReportColorByClientId(clientId, false);
          setIsUpdating(false);
        } else {
          setIsUpdating(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setMessage('Failed to fetch client details');
        setSeverity('error');
        setSnackOpen(true);
      });
  }
  async function getClientOpeningData() {
    await axios
      .get('Clients/GetClientOpeningData')
      .then((res) => {
        if (res.data.StatusCode == 200) {
          setClientReportMaster(res.data.Data.ClientReportMaster);
          getDomainClientOpeningData(
            res.data.Data.ClientReportTemplateMapping,
            res.data.Data.ClientReportMaster
          );
          setClientReportTemplateData(
            res.data.Data.ClientReportTemplateMapping
          );
          console.log(clientReportTemplateData);
        } else {
          setIsUpdating(false);
          setMessage(res.data.StatusMessage);
          setSeverity('error');
          setSnackOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setSeverity('error');
        setSnackOpen(true);
        setMessage('Failed to load Provider data');
      });
  }

  const onClearCategoryChange = () => {
    setCatgValue([]);
    setValue('catValue', []);
    setIsMenopause(false);
    setIsEndoDNA(false);
    setMenopauseDesignTemplate([]);
    setEndoDNADesignTemplate([]);
  };

  const onAddCategoryChange = (value) => {
    console.log(menoPauseDesignId);
    // setCatgValue([
    //   ...catgValue,
    //   ...value.filter((option) => catgValue.indexOf(option) === -1)
    // ]);
    // console.log(catgValue);
    // setValue('catValue', catgValue);
    clearErrors('catValue');

    const uniqueValues = value.filter(
      (option) =>
        !catgValue.some(
          (existingOption) =>
            existingOption.report_master_id === option.report_master_id
        )
    );
    setCatgValue([...catgValue, ...uniqueValues]);
    setValue('catValue', [...catgValue, ...uniqueValues]);
    const result = [...catgValue, ...uniqueValues];

    console.log(result);
    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        console.log(result[i].report_master_id);
        if (result[i].report_master_id == 1) {
          setIsMenopause(true);
          setMenoPauseDesignId(
            clientReportTemplateData[0].report_template_mapping_id
          );
          setMenpauseTemplateId(
            clientReportTemplateData[0].report_template_mapping_id
          );
          setMenopauseDesignTemplate(
            clientReportTemplateData.filter(
              (item) => item.report_master_id == result[i].report_master_id
            )
          );
        } else if (result[i].report_master_id == 2) {
          setIsEndoDNA(true);
          setendoDesignId(
            clientReportTemplateData[1].report_template_mapping_id
          );
          setEndoTemplateId(
            clientReportTemplateData[1].report_template_mapping_id
          );
          setEndoDNADesignTemplate(
            clientReportTemplateData.filter(
              (item) => item.report_master_id == result[i].report_master_id
            )
          );
        }
      }
    }
    console.log(menopauseDesignTemplate);
    console.log(endoDNADesignTemplate);
  };

  const onRemoveCategoryChange = (value) => {
    setCatgValue(value);
    setValue('catValue', value);
    if (value.length > 0) {
      for (let i = 0; i < value.length; i++) {
        console.log(value[i].report_master_id);
        if (value[i].report_master_id == 1) {
          setEndoDNADesignTemplate([]);
          setIsEndoDNA(false);
        } else if (value[i].report_master_id == 2) {
          setMenopauseDesignTemplate([]);
          setIsMenopause(false);
        }
      }
    } else {
      setIsMenopause(false);
      setIsEndoDNA(false);
      setEndoDNADesignTemplate([]);
      setMenopauseDesignTemplate([]);
    }
  };

  const handleMenopauseDesignChange = (e, val) => {
    console.log(e);
    setMenoPauseDesignId(val);
    setMenpauseTemplateId(val);
  };

  const handleEndoDNADesignChange = (e, val) => {
    console.log(e);
    setendoDesignId(val);
    console.log(val);
    setEndoTemplateId(val);
  };

  const onClearDomainChange = () => {
    setDomainValue([]);
    setValue('domain', []);
  };

  const onAddDomainChange = (value) => {
    console.log(value);
    console.log('add');
    clearErrors('domain');

    const uniqueValues = value.filter(
      (option) =>
        !domainValue.some(
          (existingOption) =>
            existingOption.domain_master_id === option.domain_master_id
        )
    );
    setValue('domain', [...domainValue, ...uniqueValues]);
    const result = [...domainValue, ...uniqueValues];
    console.log(result);
    setDomainValue(result);
  };

  const onRemoveDomainChange = (value) => {
    setDomainValue(value);
    setValue('domain', value);
    if (value.length > 0) {
      for (let i = 0; i < value.length; i++) {
        console.log(value[i].domain_master_id);
      }
    }
  };

  async function postAduitLog(message) {
    const postData = {
      UserId: 0,
      AuditCategoryMasterId: 6,
      AuditDate: moment(new Date())
        .tz('America/Los_Angeles')
        .format('MM-DD-YYYY HH:mm'),
      Activity: message,
      PatientId: 0,
      ProviderId: 0,
      ReportId: 0,
      AuditUserId: localStorage.getItem('UserId'),
      Status: 1
    };
    axios
      .post('Users/CreateAuditLog', postData)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          console.log(res);
          setIsUpdating(false);
          setSeverity('success');
          setSnackOpen(true);
          window.location.reload();
        } else {
          setIsUpdating(false);
          setSeverity('error');
          setMessage(res.data.StatusMessage);
          setSnackOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsUpdating(false);
        setSeverity('error');
      });
  }

  const toggleDrawer = (newOpen: boolean) => () => {
    console.log(newOpen);
    if (newOpen == true) {
      if (clientId != 0) {
        getReportColorByClientId(clientId, newOpen);
      } else {
        setDrOpen(newOpen);
      }
    } else {
      setDrOpen(newOpen);
    }
  };

  async function getReportColorByClientId(clientId, event) {
    setIsUpdating(true);
    setDialogOpen(true);
    await axios
      .get(`Patients/GetReportColorByClientId/${clientId}`)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          const bgcolor = res.data.Data.ReportBgColor;
          const bgArray = bgcolor.split(',', 3);
          const bgR = bgArray[0];
          const bgG = bgArray[1].replace(/ /g, '');
          const bgB = bgArray[2].replace(/ /g, '');

          console.log(bgR);
          console.log(bgG);
          console.log(bgB);

          const HeadingColor = res.data.Data.ReportHeadingColor;
          const hArray = HeadingColor.split(',', 3);
          const HR = hArray[0];
          const HG = hArray[1].replace(/ /g, '');
          const HB = hArray[2].replace(/ /g, '');

          const SubHeadingColor = res.data.Data.ReportSubHeadingColor;
          const shArray = SubHeadingColor.split(',', 3);
          const SHR = shArray[0];
          const SHG = shArray[1].replace(/ /g, '');
          const SHB = shArray[2].replace(/ /g, '');

          const BackgroundFontColor = res.data.Data.ReportBgFontColor;
          const bgfArray = BackgroundFontColor.split(',', 3);
          const BFR = bgfArray[0];
          const BFG = bgfArray[1].replace(/ /g, '');
          const BFB = bgfArray[2].replace(/ /g, '');

          const HeadingFontColor = res.data.Data.ReportHeadingFontColor;
          const hfArray = HeadingFontColor.split(',', 3);
          const HFR = hfArray[0];
          const HFG = hfArray[1].replace(/ /g, '');
          const HFB = hfArray[2].replace(/ /g, '');

          const SubHeadingFontColor = res.data.Data.ReportSubHeadingFontColor;
          const shfArray = SubHeadingFontColor.split(',', 3);
          const SHFR = shfArray[0];
          const SHFG = shfArray[1].replace(/ /g, '');
          const SHFB = shfArray[2].replace(/ /g, '');

          setReportColorsUpdate({
            BgColor: {
              r: bgR,
              g: bgG,
              b: bgB,
              a: '1'
            },
            HeadingColor: {
              r: HR,
              g: HG,
              b: HB,
              a: '1'
            },
            SubHeadingColor: {
              r: SHR,
              g: SHG,
              b: SHB,
              a: '1'
            },
            BackgroundFontColor: {
              r: BFR,
              g: BFG,
              b: BFB,
              a: '1'
            },
            HeadingFontColor: {
              r: HFR,
              g: HFG,
              b: HFB,
              a: '1'
            },
            SubHeadingFontColor: {
              r: SHFR,
              g: SHFG,
              b: SHFB,
              a: '1'
            }
          });
          setDrOpen(event);
          setIsUpdating(false);
          setDialogOpen(false);
        } else {
          setSnackOpen(true);
          setMessage(res.data.StatusMessage);
          setIsUpdating(false);
          setDialogOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setSnackOpen(true);
        setMessage('Failed to load');
        setIsUpdating(false);
        setDialogOpen(false);
      });
  }

  return (
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
      >
        <Grid container>
          <Grid item xs={3}>
            <Controller
              name="cname"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ width: '32ch' }}
                  {...field}
                  required
                  disabled={isClientUser}
                  id="cname"
                  label="Client Name"
                  variant="filled"
                  {...register('cname')}
                  error={errors.cname ? true : false}
                  helperText={errors.cname?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ width: '32ch' }}
                  {...field}
                  id="filled-multiline-flexible"
                  label="Address"
                  multiline
                  maxRows={2}
                  variant="filled"
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Autocomplete
              open={open}
              onOpen={() => {
                setOpen(true);
              }}
              onClose={() => {
                setOpen(false);
              }}
              getOptionLabel={(option) => option.zip}
              isOptionEqualToValue={(option, value) => option.zip === value.zip}
              options={options}
              value={zip}
              loading={loading}
              onChange={onZipChange}
              renderInput={(params) => (
                <TextField
                  sx={{ width: '32ch' }}
                  {...params}
                  label="Zip"
                  variant="filled"
                  {...register('zip')}
                  onChange={(ev) => {
                    if (ev.target.value !== '' || ev.target.value !== null) {
                      onChangeHandle(ev.target.value);
                    }
                  }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <Fragment>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </Fragment>
                    )
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ width: '32ch' }}
                  disabled
                  {...field}
                  id="city"
                  label="City"
                  {...register('city')}
                  variant="filled"
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ width: '32ch' }}
                  disabled
                  {...field}
                  id="state"
                  label="State"
                  {...register('state')}
                  variant="filled"
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              name="mobNo"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  sx={{ width: '32ch' }}
                  id="mobNo"
                  label="Mobile Number"
                  variant="filled"
                  {...register('mobNo')}
                  error={errors.mobNo ? true : false}
                  helperText={errors.mobNo?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              name="pname"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  sx={{ width: '32ch' }}
                  id="pname"
                  label="Contact Person Name"
                  variant="filled"
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              name="pphone"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ width: '32ch' }}
                  {...field}
                  id="pphone"
                  label="Contact Phone Number"
                  variant="filled"
                />
              )}
            />
          </Grid>
          <Grid item xs={2}>
            <Controller
              name="pemail"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ width: '20ch' }}
                  {...field}
                  id="pemail"
                  label="Contact Email-ID"
                  variant="filled"
                  {...register('pemail')}
                  error={errors.pemail ? true : false}
                  helperText={errors.pemail?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={2}>
            <Controller
              name="tzone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  sx={{ width: '20ch' }}
                  id="tzone"
                  disabled
                  label="Time Zone"
                  variant="filled"
                  {...register('tzone')}
                  error={errors.tzone ? true : false}
                  helperText={errors.tzone?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={2}>
            <Controller
              name="fax"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  sx={{ width: '20ch' }}
                  id="filled-multiline-Fax"
                  label="Fax"
                  multiline
                  maxRows={2}
                  variant="filled"
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              control={control}
              name="domain"
              rules={{ required: true }}
              render={() => (
                <Autocomplete
                  multiple
                  getOptionLabel={(option) => option.domain_name}
                  options={domainOpeningData}
                  value={domainValue}
                  disabled={isClientUser}
                  onChange={(event, item, situation) => {
                    console.log(event);
                    console.log(item);
                    if (situation === 'removeOption') {
                      onRemoveDomainChange(item);
                    } else if (situation === 'clear') {
                      onClearDomainChange();
                    } else {
                      onAddDomainChange(item);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      sx={{ width: '32ch' }}
                      {...params}
                      label="Domain Name"
                      variant="filled"
                      error={errors.domain ? true : false}
                      helperText={errors.domain?.message}
                      required
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              control={control}
              name="catValue"
              rules={{ required: true }}
              render={() => (
                <Autocomplete
                  multiple
                  disabled={isClientUser}
                  value={catgValue}
                  getOptionLabel={(option) => option.report_name}
                  options={clientReportMaster}
                  onChange={(event, item, situation) => {
                    console.log(event);
                    console.log(item);
                    if (situation === 'removeOption') {
                      onRemoveCategoryChange(item);
                    } else if (situation === 'clear') {
                      onClearCategoryChange();
                    } else {
                      onAddCategoryChange(item);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      sx={{ width: '32ch' }}
                      {...params}
                      label="Report Name"
                      variant="filled"
                      error={errors.catValue ? true : false}
                      helperText={errors.catValue?.message}
                      required
                    />
                  )}
                />
              )}
            />
          </Grid>

          {isMenopause ? (
            <Grid
              item
              xs={2}
              style={{ marginLeft: '20px', textAlign: 'center' }}
            >
              <FormControl>
                <FormLabel
                  style={{
                    fontWeight: '700',
                    paddingBottom: '10px'
                  }}
                >
                  Menopause Design
                </FormLabel>
                <RadioGroup
                  aria-label="Menopause-Radio"
                  name="MenopauseRadio"
                  onChange={handleMenopauseDesignChange}
                  value={menoPauseDesignId}
                  row
                >
                  {menopauseDesignTemplate.map((option) => (
                    <FormControlLabel
                      label={
                        <img
                          src={option.template_url}
                          alt="paypal"
                          style={{
                            width: '130px',
                            height: '190px',
                            border: '4px solid #eee'
                          }}
                        />
                      }
                      key={option.report_template_mapping_id}
                      disabled={isClientUser}
                      value={option.report_template_mapping_id}
                      control={<Radio color="primary" />}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>
          ) : (
            ''
          )}
          {isEndoDNA ? (
            <Grid item xs={4}>
              <FormControl>
                <FormLabel
                  style={{
                    fontWeight: '700',
                    paddingBottom: '10px',
                    textAlign: 'center'
                  }}
                >
                  EndoDNA Design
                </FormLabel>
                <RadioGroup
                  aria-label="EndoDna-Radio"
                  onChange={handleEndoDNADesignChange}
                  name="EndoDnaRadio"
                  value={endoDesignId}
                  row
                >
                  {endoDNADesignTemplate.map((option) => (
                    <FormControlLabel
                      label={
                        <img
                          src={option.template_url}
                          alt="paypal"
                          style={{
                            width: '130px',
                            height: '190px',
                            border: '4px solid #eee'
                          }}
                        />
                      }
                      key={option.report_template_mapping_id}
                      disabled={isClientUser}
                      value={option.report_template_mapping_id}
                      control={<Radio color="primary" />}
                    />
                  ))}
                </RadioGroup>
                {errors.EndoDnaRadio && (
                  <p
                    style={{
                      color: '#FF1943',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      marginLeft: '100px'
                    }}
                  >
                    {errors.EndoDnaRadio.message}
                  </p>
                )}
              </FormControl>
            </Grid>
          ) : (
            ''
          )}
          <Grid
            item
            xs={5}
            sx={{
              borderRadius: '10px',
              background: 'rgba(0, 0, 0, 0.06)',
              marginTop: '10px'
            }}
          >
            <section
              className="container"
              style={{
                width: '40ch',
                marginLeft: '20px',
                marginTop: '5px'
              }}
            >
              <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <CloudUploadIcon fontSize="large" />
                <div>Drop files or click here to upload Logo</div>
              </div>
              {logo == 'New Image' ? (
                <aside style={thumbsContainer}>{thumbs}</aside>
              ) : (
                <aside style={thumbsContainer}>
                  <img src={logo} style={img1} />
                </aside>
              )}
            </section>
            {/* <span style={{ color: 'red', fontWeight: 'bold' }}>
              ** IMAGE STANDARD SIZE WOULD BE 350*150 PX
            </span> */}
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ marginTop: '13px', marginLeft: '8px' }}
              endIcon={<SendIcon />}
            >
              {buttonStatus}
            </Button>

            <Button
              variant="outlined"
              color="success"
              size="large"
              sx={{ marginTop: '13px', marginLeft: '8px' }}
              startIcon={<AddIcon />}
              onClick={toggleDrawer(true)}
            >
              Customize Report Color
            </Button>
            <Drawer
              style={{ zIndex: '1399' }}
              open={dropen}
              anchor="right"
              onClose={toggleDrawer(false)}
            >
              <StyledEngineProvider injectFirst>
                <ReportColor captureColors={reportColorsUpdate} />
              </StyledEngineProvider>
            </Drawer>
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
                <Alert
                  onClose={handleClose}
                  severity="success"
                  sx={{ width: '100%' }}
                >
                  {message}
                </Alert>
              </Snackbar>
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
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AddClient;
