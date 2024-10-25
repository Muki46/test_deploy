import Box from '@mui/material/Box';
import { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss';
import Grid from '@mui/material/Grid';

export default function ReportColor(props) {
  const [open, setOpen] = useState(false);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [subHdisplayColor, setSubHdisplayColor] = useState(false);
  const [headingdisplayColor, setHeadingdisplayColor] = useState(false);
  const [bFontcolor, setBFontColor] = useState(false);
  const [hfontColor, setHFontColor] = useState(false);
  const [shfontColor, setSHFontcolor] = useState(false);

  const [bgcolor, setBgColor] = useState({
    r: props.captureColors?.BgColor.r,
    g: props.captureColors?.BgColor.g,
    b: props.captureColors?.BgColor.b,
    a: '1'
  });
  const [rheadingColor, setHeadingColor] = useState({
    r: props.captureColors?.HeadingColor.r,
    g: props.captureColors?.HeadingColor.g,
    b: props.captureColors?.HeadingColor.b,
    a: '1'
  });
  const [subHeadingColor, setSubHeadingColor] = useState({
    r: props.captureColors?.SubHeadingColor.r,
    g: props.captureColors?.SubHeadingColor.g,
    b: props.captureColors?.SubHeadingColor.b,
    a: '1'
  });
  const [backgroundFontColor, setbackgroundFontColor] = useState({
    r: props.captureColors?.BackgroundFontColor.r,
    g: props.captureColors?.BackgroundFontColor.g,
    b: props.captureColors?.BackgroundFontColor.b,
    a: '1'
  });
  const [headingFontColor, setHeadingFontColor] = useState({
    r: props.captureColors?.HeadingFontColor.r,
    g: props.captureColors?.HeadingFontColor.g,
    b: props.captureColors?.HeadingFontColor.b,
    a: '1'
  });
  const [subheadingFontColor, setSubHeadingFontColor] = useState({
    r: props.captureColors?.SubHeadingFontColor.r,
    g: props.captureColors?.SubHeadingFontColor.g,
    b: props.captureColors?.SubHeadingFontColor.b,
    a: '1'
  });

  const handleBgcolorClick = () => {
    setDisplayColorPicker(true);
  };

  const handleBgSkechClose = () => {
    setDisplayColorPicker(false);
  };

  const handleBgColorChange = (color) => {
    console.log(color);
    props.captureColors.BgColor = color.rgb;
    setBgColor(color.rgb);
  };

  const handleHeadingcolorClick = () => {
    setHeadingdisplayColor(true);
  };

  const handleHeadingSkechClose = () => {
    setHeadingdisplayColor(false);
  };

  const handleHeadingColorChange = (rheadingColor) => {
    console.log(rheadingColor);
    props.captureColors.HeadingColor = rheadingColor.rgb;
    setHeadingColor(rheadingColor.rgb);
  };

  const handleSubHcolorClick = () => {
    setSubHdisplayColor(true);
  };

  const handleSubHSkechClose = () => {
    setSubHdisplayColor(false);
  };

  const handleSubHColorChange = (subHeadingColor) => {
    console.log(subHeadingColor);
    props.captureColors.SubHeadingColor = subHeadingColor.rgb;
    setSubHeadingColor(subHeadingColor.rgb);
  };

  const handleRBgcolorClick = () => {
    setBFontColor(true);
  };

  const handleRBgSkechClose = () => {
    setBFontColor(false);
  };

  const handleRBgColorChange = (backgroundFontColor) => {
    console.log(backgroundFontColor);
    props.captureColors.BackgroundFontColor = backgroundFontColor.rgb;
    setbackgroundFontColor(backgroundFontColor.rgb);
  };

  const handleHFontcolorClick = () => {
    setHFontColor(true);
  };
  const handleHFontSkechClose = () => {
    setHFontColor(false);
  };

  const handleHFontColorChange = (headingFontColor) => {
    console.log(headingFontColor);
    props.captureColors.HeadingFontColor = headingFontColor.rgb;
    setHeadingFontColor(headingFontColor.rgb);
  };

  const handleSHFcolorClick = () => {
    setSHFontcolor(true);
  };

  const handleSHFSkechClose = () => {
    setSHFontcolor(false);
  };

  const handleSHFColorChange = (subheadingFontColor) => {
    console.log(subheadingFontColor);
    props.captureColors.SubHeadingFontColor = subheadingFontColor.rgb;
    setSubHeadingFontColor(subheadingFontColor.rgb);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const styles = reactCSS({
    default: {
      color: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: `rgba(${bgcolor.r}, ${bgcolor.g}, ${bgcolor.b}, ${bgcolor.a})`
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '50%',
        boxShadow: '1px 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer'
      },
      popover: {
        position: 'absolute',
        zIndex: '2'
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      }
    }
  });

  const Headingstyles = reactCSS({
    default: {
      color: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: `rgba(${rheadingColor.r}, ${rheadingColor.g}, ${rheadingColor.b}, ${rheadingColor.a})`
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '50%',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer'
      },
      popover: {
        position: 'absolute',
        zIndex: '2'
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      }
    }
  });

  const SubHeadingstyles = reactCSS({
    default: {
      color: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: `rgba(${subHeadingColor.r}, ${subHeadingColor.g}, ${subHeadingColor.b}, ${subHeadingColor.a})`
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '50%',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer'
      },
      popover: {
        position: 'absolute',
        zIndex: '2'
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      }
    }
  });

  const BgFontstyles = reactCSS({
    default: {
      color: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: `rgba(${backgroundFontColor.r}, ${backgroundFontColor.g}, ${backgroundFontColor.b}, ${backgroundFontColor.a})`
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '50%',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer'
      },
      popover: {
        position: 'absolute',
        zIndex: '2'
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      }
    }
  });

  const HeadingFontstyles = reactCSS({
    default: {
      color: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: `rgba(${headingFontColor.r}, ${headingFontColor.g}, ${headingFontColor.b}, ${headingFontColor.a})`
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '50%',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer'
      },
      popover: {
        position: 'absolute',
        zIndex: '2'
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      }
    }
  });

  const SubHeadingFontstyles = reactCSS({
    default: {
      color: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: `rgba(${subheadingFontColor.r}, ${subheadingFontColor.g}, ${subheadingFontColor.b}, ${subheadingFontColor.a})`
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '50%',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer'
      },
      popover: {
        position: 'absolute',
        zIndex: '2'
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      }
    }
  });

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ width: 420 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h5 style={{ padding: '6px', background: '#eee' }}>
              Report Content
            </h5>
          </Grid>
          <Grid
            item
            xs={6}
            style={{
              border: '1px solid #eee',
              textAlign: 'center',
              paddingBottom: '16px'
            }}
          >
            <h6 style={{ marginBottom: '6px' }}>Background</h6>
            <Box>
              <div style={styles.swatch} onClick={handleBgcolorClick}>
                <div style={styles.color} />
              </div>
              {displayColorPicker ? (
                <div style={styles.popover}>
                  <div style={styles.cover} onClick={handleBgSkechClose} />
                  <SketchPicker
                    color={bgcolor}
                    onChange={handleBgColorChange}
                  />
                </div>
              ) : null}
            </Box>
          </Grid>
          <Grid
            item
            xs={6}
            style={{
              border: '1px solid #eee',
              textAlign: 'center',
              paddingBottom: '16px'
            }}
          >
            <h6 style={{ marginBottom: '6px' }}>Font Color</h6>
            <Box>
              <div style={BgFontstyles.swatch} onClick={handleRBgcolorClick}>
                <div style={BgFontstyles.color} />
              </div>
              {bFontcolor ? (
                <div style={BgFontstyles.popover}>
                  <div
                    style={BgFontstyles.cover}
                    onClick={handleRBgSkechClose}
                  />
                  <SketchPicker
                    color={backgroundFontColor}
                    onChange={handleRBgColorChange}
                  />
                </div>
              ) : null}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <h5 style={{ padding: '6px', background: '#eee' }}>
              Report Heading
            </h5>
          </Grid>
          <Grid
            item
            xs={6}
            style={{
              border: '1px solid #eee',
              textAlign: 'center',
              paddingBottom: '16px'
            }}
          >
            <h6 style={{ marginBottom: '6px' }}>Background</h6>
            <Box>
              <div
                style={Headingstyles.swatch}
                onClick={handleHeadingcolorClick}
              >
                <div style={Headingstyles.color} />
              </div>
              {headingdisplayColor ? (
                <div style={Headingstyles.popover}>
                  <div
                    style={Headingstyles.cover}
                    onClick={handleHeadingSkechClose}
                  />
                  <SketchPicker
                    color={rheadingColor}
                    onChange={handleHeadingColorChange}
                  />
                </div>
              ) : null}
            </Box>
          </Grid>
          <Grid
            item
            xs={6}
            style={{
              border: '1px solid #eee',
              textAlign: 'center',
              paddingBottom: '16px'
            }}
          >
            <h6 style={{ marginBottom: '6px' }}>Font Color</h6>
            <Box>
              <div
                style={HeadingFontstyles.swatch}
                onClick={handleHFontcolorClick}
              >
                <div style={HeadingFontstyles.color} />
              </div>
              {hfontColor ? (
                <div style={HeadingFontstyles.popover}>
                  <div
                    style={HeadingFontstyles.cover}
                    onClick={handleHFontSkechClose}
                  />
                  <SketchPicker
                    color={headingFontColor}
                    onChange={handleHFontColorChange}
                  />
                </div>
              ) : null}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <h5 style={{ padding: '6px', background: '#eee' }}>
              Report Sub Heading
            </h5>
          </Grid>
          <Grid
            item
            xs={6}
            style={{
              border: '1px solid #eee',
              textAlign: 'center',
              paddingBottom: '16px'
            }}
          >
            <h6 style={{ marginBottom: '6px' }}>Background</h6>
            <Box>
              <div
                style={SubHeadingstyles.swatch}
                onClick={handleSubHcolorClick}
              >
                <div style={SubHeadingstyles.color} />
              </div>
              {subHdisplayColor ? (
                <div style={SubHeadingstyles.popover}>
                  <div
                    style={SubHeadingstyles.cover}
                    onClick={handleSubHSkechClose}
                  />
                  <SketchPicker
                    color={subHeadingColor}
                    onChange={handleSubHColorChange}
                  />
                </div>
              ) : null}
            </Box>
          </Grid>
          <Grid
            item
            xs={6}
            style={{
              border: '1px solid #eee',
              textAlign: 'center',
              paddingBottom: '16px'
            }}
          >
            <h6 style={{ marginBottom: '6px' }}>Font Color</h6>
            <Box>
              <div
                style={SubHeadingFontstyles.swatch}
                onClick={handleSHFcolorClick}
              >
                <div style={SubHeadingFontstyles.color} />
              </div>
              {shfontColor ? (
                <div style={SubHeadingFontstyles.popover}>
                  <div
                    style={SubHeadingFontstyles.cover}
                    onClick={handleSHFSkechClose}
                  />
                  <SketchPicker
                    color={subheadingFontColor}
                    onChange={handleSHFColorChange}
                  />
                </div>
              ) : null}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
