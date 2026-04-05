import { Routes, Route, Navigate } from 'react-router-dom';
import { useWeb3 } from './context/Web3Context';
import PortalSelector from './components/PortalSelector';
import Layout from './components/Layout';
// Import our soon-to-be-created views:
import Dashboard from './views/Dashboard';
import AllocationPanel from './views/AllocationPanel';
import ProjectViewer from './views/ProjectViewer';
import AdminPanel from './views/AdminPanel';
import PublicLayout from './components/PublicLayout';
import PublicLedger from './views/PublicLedger';

function App() {
  const { currentAccount, isAdmin, isOfficer } = useWeb3();

  if (!currentAccount) {
    return <PortalSelector />;
  }

  // Determine if it is a Public Viewer (neither Admin nor Officer)
  const isPublicViewer = !isAdmin && !isOfficer;

  return (
    <Routes>
      {isPublicViewer ? (
        // Public Viewer Route
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<PublicLedger />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      ) : (
        // Institutional / Officer / Admin Route
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="fund-allocation" element={<AllocationPanel />} />
          <Route path="history" element={<ProjectViewer />} />
          {isAdmin && <Route path="admin" element={<AdminPanel />} />}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;
