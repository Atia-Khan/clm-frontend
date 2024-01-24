import React from 'react';
import { Navigate } from 'react-router-dom';
import SideNavbar from '../Sidebar/Sidebar';
import Header from '../Header/header';
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh', // Ensure that the container takes at least the full height of the viewport
  },
  content: {
    display: 'flex',
    flex: 1,
  },
};
export default function Privateroute({ children }) {
  const userData = localStorage.getItem('user');
  if (!userData) {
    return <Navigate to="/login" />;
  }
    return(
      <div style={styles.container}>
      <Header />
      <div style={styles.content}>
        <SideNavbar />
        {children}
      </div>
    </div>
    )
}