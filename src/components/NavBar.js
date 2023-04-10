import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Icon } from "@iconify/react";
import { Stack, ThemeProvider } from "@mui/material";
import { themeOptions } from "../styles/themeOptions";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Cart from "../screens/Cart";

const pages = [
	{ link: "#home", name: "Home" },
	{ link: "#about", name: "About Us" },
	{ link: "#services", name: "Services" },
	{ link: "#menu", name: "Menu" },
	{ link: "#contact", name: "Contact Us" },
];

export default function NavBar() {
	const [anchorElNav, setAnchorElNav] = React.useState(null);
	const [anchorElUser, setAnchorElUser] = React.useState(null);

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const settings = [
		{ link: "/profile", name: "Profile" },
		{ link: "/account", name: "Account" },
		{ link: "/myOrder", name: "My Orders" },
	];

	localStorage.setItem("temp", "first");
	let navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("token");

		navigate("/login");
	};

	return (
		<ThemeProvider theme={themeOptions}>
			<AppBar
				position="fixed"
				/*sx={{
					background: "transparent",
					boxShadow: "none",
					backdropFilter: "blur(8px)",
				}}*/
			>
				<Container maxWidth="xl">
					<Toolbar disableGutters>
						<Box sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
							<Icon icon="ic:outline-delivery-dining" width={24} />
						</Box>
						<Typography
							variant="h6"
							noWrap
							component={RouterLink}
							to="/"
							sx={{
								mr: 2,
								display: { xs: "none", md: "flex" },
								fontFamily: "sans-serif",
								fontWeight: 700,
								letterSpacing: ".1rem",
								color: "inherit",
								textDecoration: "none",
							}}
						>
							Food To Go
						</Typography>
						<Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
							<IconButton
								size="large"
								aria-label="account of current user"
								aria-controls="menu-appbar"
								aria-haspopup="true"
								onClick={handleOpenNavMenu}
								color="inherit"
							>
								<Icon icon="ic:outline-menu" />
							</IconButton>
							<Menu
								id="menu-appbar"
								anchorEl={anchorElNav}
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "left",
								}}
								keepMounted
								transformOrigin={{
									vertical: "top",
									horizontal: "left",
								}}
								open={Boolean(anchorElNav)}
								onClose={handleCloseNavMenu}
								sx={{
									display: { xs: "block", md: "none" },
								}}
							>
								{pages.map((page) => (
									<MenuItem key={page.name} onClick={handleCloseNavMenu}>
										<Typography textAlign="center">{page.name}</Typography>
									</MenuItem>
								))}
							</Menu>
						</Box>
						<Box
							sx={{
								display: { xs: "flex", md: "none" },
								mr: 1,
								textOverflow: "ellipsis",
							}}
						>
							<Icon icon="ic:outline-delivery-dining" width={32} />
						</Box>

						<Typography
							variant="h5"
							noWrap
							component="a"
							href=""
							sx={{
								mr: 2,
								display: { xs: "flex", md: "none" },
								flexGrow: 1,
								fontFamily: "monospace",
								fontWeight: 700,
								letterSpacing: ".3rem",
								color: "inherit",
								textDecoration: "none",
							}}
						>
							Food To Go
						</Typography>
						<Box
							sx={{
								flexGrow: 1,
								display: { xs: "none", md: "flex" },
								ml: 2,
							}}
						></Box>
						<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
							{pages.map((page) => (
								<Button
									key={page.name}
									href={page.link}
									onClick={handleCloseNavMenu}
									sx={{ my: 2, color: "white", display: "block" }}
								>
									{page.name}
								</Button>
							))}
						</Box>

						{!localStorage.getItem("token") ? (
							<Stack direction="row" spacing={2}>
								<Button component={RouterLink} to="/login" variant="contained">
									Login
								</Button>
								<Button component={RouterLink} to="/signup" variant="contained">
									Sign Up
								</Button>
							</Stack>
						) : (
							<>
								<Box sx={{ flexGrow: 0 }}>
									<Cart />
								</Box>

								<Box sx={{ flexGrow: 0 }}>
									<Tooltip title="Open settings">
										<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
											<Avatar>
												<Icon icon="ic:round-person-outline" width={24} />
											</Avatar>
										</IconButton>
									</Tooltip>
									<Menu
										sx={{ mt: "45px" }}
										id="menu-appbar"
										anchorEl={anchorElUser}
										anchorOrigin={{
											vertical: "top",
											horizontal: "right",
										}}
										keepMounted
										transformOrigin={{
											vertical: "top",
											horizontal: "right",
										}}
										open={Boolean(anchorElUser)}
										onClose={handleCloseUserMenu}
									>
										{settings.map((setting) => (
											<Box
												component={RouterLink}
												to={setting.link}
												key={setting.name}
												sx={{ color: "inherit", textDecoration: "none" }}
											>
												<MenuItem onClick={handleCloseUserMenu}>
													<Typography textAlign="center">
														{setting.name}
													</Typography>
												</MenuItem>
											</Box>
										))}
										<MenuItem key="LogOut" onClick={handleLogout}>
											<Typography textAlign="center">Log Out</Typography>
										</MenuItem>
									</Menu>
								</Box>
							</>
						)}
					</Toolbar>
				</Container>
			</AppBar>
			<Toolbar />
		</ThemeProvider>
	);
}
