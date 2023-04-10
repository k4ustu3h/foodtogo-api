import { createTheme } from "@mui/material/styles";
import { brown, teal, tealA400, tealA700 } from "./palette";

export const themeOptions = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: brown[500],
			light: brown[300],
			dark: brown[700],
		},
		secondary: {
			main: tealA700,
			light: tealA400,
			dark: teal[700],
		},
		error: {
			main: "#D50000",
			light: "#FF1744",
			dark: "#D32F2F",
		},
		warning: {
			main: "#FF6D00",
			light: "#FF9100",
			dark: "#F57C00",
		},
		info: {
			main: "#2962FF",
			light: "#2979FF",
			dark: "#1976D2",
		},
		success: {
			main: "#00C853",
			light: "#00E676",
			dark: "#388E3C",
		},
	},
	typography: {
		fontFamily: "Plus Jakarta Sans",
	},
	props: {
		MuiAppBar: {
			color: "transparent",
		},
	},
});
