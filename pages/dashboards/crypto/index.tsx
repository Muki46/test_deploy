import SidebarLayout from '@/layouts/SidebarLayout';
import Clients from 'pages/components/clients';
import Patients from 'pages/components/patients';
import { useEffect, useState } from 'react';

function DashboardCrypto() {
  const [roleName, setRoleName] = useState('');

  useEffect(() => {
    setRoleName(localStorage.getItem('RoleName'));
  }, []);

  return (
    <>
      {roleName == 'Client User' || roleName == 'Admin' ? (
        <Clients />
      ) : (
        <Patients />
      )}
    </>
  );
}

DashboardCrypto.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default DashboardCrypto;
