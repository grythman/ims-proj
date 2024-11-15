import { lazy } from 'react';

const Login = lazy(() => import('./components/auth/Login'));
const StudentDashboard = lazy(() => import('./components/dashboard/StudentDashboard'));
const TeacherDashboard = lazy(() => import('./components/dashboard/TeacherDashboard'));
const MentorDashboard = lazy(() => import('./components/dashboard/MentorDashboard'));
const AdminDashboard = lazy(() => import('./components/dashboard/AdminDashboard'));

export const publicRoutes = [
  {
    path: '/',
    component: Login,
  },
  {
    path: '/login',
    component: Login,
  },
];

export const privateRoutes = [
  {
    path: '/student-dashboard',
    component: StudentDashboard,
    role: 'student',
  },
  {
    path: '/teacher-dashboard',
    component: TeacherDashboard,
    role: 'teacher',
  },
  {
    path: '/mentor-dashboard',
    component: MentorDashboard,
    role: 'mentor',
  },
  {
    path: '/admin-dashboard',
    component: AdminDashboard,
    role: 'admin',
  },
]; 