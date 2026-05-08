import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import "./App.css";

const drawerWidth = 260;

const navItems = [
  {
    label: "Customers",
    path: "/",
    icon: <GroupOutlinedIcon />,
  },
  {
    label: "Trainings",
    path: "/trainings",
    icon: <FitnessCenterOutlinedIcon />,
  },
];

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <Box className="app-shell">
      <AppBar position="fixed" className="top-bar">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="h1" sx={{ fontWeight: 700 }}>
            Personal Trainer
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
      >
        <Box
          className="drawer-content"
          sx={{ width: drawerWidth }}
          role="navigation"
        >
          <Typography variant="h6" className="drawer-title">
            Navigation
          </Typography>
          <List>
            {navItems.map((item) => (
              <ListItemButton
                key={item.path}
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" className="page-content">
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;
