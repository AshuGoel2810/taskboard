import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';


const TaskBoard = React.lazy(() => import('./components/TaskBoard'));
const TaskDetails = React.lazy(() => import('./components/TaskDetails'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<TaskBoard />} />
          <Route path="/task/:id" element={<TaskDetails />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
