import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import UserCreation from './Components/UserCreation/UserCreation';
import UserDashboard from './Components/UserDashboard/UserDashboard';
import UpdatePassword from './Components/UpdatePassword/UpdatePassword';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';
import TrainingModule from './Components/TrainingModule/TrainingModule';
import TrainingPlan from './Components/TrainingPlan/TrainingPlan';
import TrainingCategory from './Components/TrainingCategory/TrainingCategory';
import TrainingAmount from './Components/TrainingAmount/TrainingAmount';
import TrainingAssessmentmarks from './Components/Assessmentmarks/TrainingAssessmentMarks';
import UserTrainingProgress from './Components/UserTrainingProgress/UserTrainingProgress';
import UserReport from './Components/UserReport/UserReport';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/user-creation" element={<UserCreation />} />
        <Route path="/" element={<LoginSignup />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/update-pass" element={<UpdatePassword />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/training-module" element={<TrainingModule />} />
        <Route path="/training-plan" element={<TrainingPlan />} />
        <Route path="/assessment-marks" element={<TrainingAssessmentmarks />} />
        <Route path="/training-category" element={<TrainingCategory />} />
        <Route path="/training-amount" element={<TrainingAmount />} />
        <Route path="/training-progress" element={<UserTrainingProgress />} />
        <Route path="/assessment-report" element={<UserReport />} />
      </Routes>
    </Router>
  );
};

export default App;
