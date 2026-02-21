
import React from 'react';

// --- EXPLICIT LAZY LOADING FOR ALL TABS TO ENSURE CONSISTENCY ---

export const TasksTabLazy = React.lazy(() => 
  import('./components/TasksTab').then(module => ({ default: module.default }))
);

export const InspectionFormTabLazy = React.lazy(() => 
  import('./components/InspectionFormTab').then(module => ({ default: module.default }))
);

export const ExpensesTabLazy = React.lazy(() => 
  import('./components/ExpensesTab').then(module => ({ default: module.default }))
);

export const ProfileTabLazy = React.lazy(() => 
  import('./components/ProfileTab').then(module => ({ default: module.default }))
);
