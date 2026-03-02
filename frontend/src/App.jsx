import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ScrollToTop from './components/ScrollToTop'
import Landing from './pages/Landing'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import AuthCallback from './pages/AuthCallback'
import SelectRole from './pages/SelectRole'
import Dashboard from './pages/Dashboard'
import RULPrediction from './pages/RULPrediction'
import DataScientistIDE from './pages/DataScientistIDE'
import ClarifyingContext from './pages/ClarifyingContext'
import ClarificationQA from './pages/ClarificationQA'
import EnterpriseWorkbench from './pages/EnterpriseWorkbench'
import ExecutiveSummary from './pages/ExecutiveSummary'
import DataIntelligence from './pages/DataIntelligence'
import DetailedInsights from './pages/DetailedInsights'
import AnalysisMindmap from './pages/AnalysisMindmap'
import MarketingDashboard from './pages/MarketingDashboard'
import MarketingChat from './pages/MarketingChat'
import Profile from './pages/Profile'
import ProjectHealthMonitor from './pages/ProjectHealthMonitor'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/select-role" element={<SelectRole />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/data-scientist" element={<Dashboard />} />
          <Route path="/dashboard/ide" element={<DataScientistIDE />} />
          <Route path="/dashboard/rul-prediction" element={<RULPrediction />} />
          <Route path="/dashboard/clarifying-context" element={<ClarifyingContext />} />
          <Route path="/dashboard/clarification-qa" element={<ClarificationQA />} />
          <Route path="/dashboard/enterprise-workbench" element={<EnterpriseWorkbench />} />
          <Route path="/dashboard/executive-summary" element={<ExecutiveSummary />} />
          <Route path="/dashboard/data-intelligence" element={<DataIntelligence />} />
          <Route path="/dashboard/detailed-insights" element={<DetailedInsights />} />
          <Route path="/dashboard/analysis-mindmap" element={<AnalysisMindmap />} />
          <Route path="/dashboard/marketing-analytics" element={<MarketingDashboard />} />
          <Route path="/dashboard/marketing-chat" element={<MarketingChat />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/project-health" element={<ProjectHealthMonitor />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
