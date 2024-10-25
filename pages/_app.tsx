import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';
import '../styles/style.css';
import ThemeProvider from 'src/theme/ThemeProvider';
import { MsalProvider } from '@azure/msal-react';
import {
  PublicClientApplication,
  BrowserCacheLocation
} from '@azure/msal-browser';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from 'src/createEmotionCache';
import { SidebarProvider } from 'src/contexts/SidebarContext';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { ConfirmProvider } from 'material-ui-confirm';
const clientSideEmotionCache = createEmotionCache();

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface TokyoAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
}

function TokyoApp(props: TokyoAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const msalConfig = {
    auth: {
      clientId: '3ff12aa0-be4c-4e21-a64a-08ea5e0be7f4', // dummy Data, get this from ENV
      authority:
        'https://login.microsoftonline.com/adb0d3f7-91b1-4d2a-8ed3-5b81e24e7c20' // dummy Data, get this from ENV
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage
    }
  };
  const getLayout = Component.getLayout ?? ((page) => page);
  const msalInstance = new PublicClientApplication(msalConfig);
  Router.events.on('routeChangeStart', nProgress.start);
  Router.events.on('routeChangeError', nProgress.done);
  Router.events.on('routeChangeComplete', nProgress.done);

  return (
    <MsalProvider instance={msalInstance}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>Home - EndoDNA127</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
        </Head>
        <SidebarProvider>
          <ThemeProvider>
            <ConfirmProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <CssBaseline />
                {getLayout(<Component {...pageProps} />)}
              </LocalizationProvider>
            </ConfirmProvider>
          </ThemeProvider>
        </SidebarProvider>
      </CacheProvider>
    </MsalProvider>
  );
}

export default TokyoApp;
