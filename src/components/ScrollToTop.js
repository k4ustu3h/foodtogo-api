import * as React from "react";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Slide from "@mui/material/Slide";
import { Icon } from "@iconify/react";

export function ScrollToTop() {
	const trigger = useScrollTrigger({
		threshold: 100,
	});

	const handleClick = (event) => {
		const anchor = (event.target.ownerDocument || document).querySelector(
			"#back-to-top-anchor"
		);

		if (anchor) {
			anchor.scrollIntoView({
				block: "center",
			});
		}
	};

	return (
		<Slide direction="up" in={trigger} mountOnEnter unmountOnExit>
			<Box
				onClick={handleClick}
				role="presentation"
				sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 20 }}
			>
				<Fab
					aria-label="scroll back to top"
					color="secondary"
					sx={{ borderRadius: 4 }}
				>
					<Icon icon="mdi:chevron-up" width="24" />
				</Fab>
			</Box>
		</Slide>
	);
}
