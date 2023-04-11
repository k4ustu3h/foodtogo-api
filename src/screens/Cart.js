import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { useCart, useDispatchCart } from "../components/ContextReducer";
import { Icon } from "@iconify/react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Badge, IconButton, Typography } from "@mui/material";
import Checkout from "../components/Checkout";

export default function Cart() {
	const [state, setState] = React.useState({
		right: false,
	});

	const toggleDrawer = (anchor, open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setState({ ...state, [anchor]: open });
	};

	let data = useCart();
	let dispatch = useDispatchCart();

	const handleRemove = (index) => {
		dispatch({ type: "REMOVE", index: index });
	};

	let totalPrice = data.reduce((total, food) => total + food.price, 0);

	return (
		<div>
			<React.Fragment key="anchor">
				<IconButton
					aria-label="Cart"
					onClick={toggleDrawer("right", true)}
					sx={{ mr: 2 }}
				>
					<Badge badgeContent={data.length} color="primary">
						<Icon icon="ic:outline-shopping-cart" width={24} />
					</Badge>
				</IconButton>
				<Drawer
					anchor="right"
					open={state["right"]}
					onClose={toggleDrawer("right", false)}
				>
					{data.length === 0 ? (
						<Box
							sx={{ width: 800 }}
							role="presentation"
							onKeyDown={toggleDrawer("right", false)}
						>
							<Typography variant="h4">The Cart is Empty!</Typography>
						</Box>
					) : (
						<Box
							sx={{ width: 800 }}
							role="presentation"
							onKeyDown={toggleDrawer("right", false)}
						>
							<TableContainer component={Paper}>
								<Table sx={{ minWidth: 650 }} aria-label="simple table">
									<TableHead>
										<TableRow>
											<TableCell>#</TableCell>
											<TableCell align="right">Name</TableCell>
											<TableCell align="right">Quantity</TableCell>
											<TableCell align="right">Option</TableCell>
											<TableCell align="right">Amount</TableCell>
											<TableCell align="right"></TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{data.map((food, index) => (
											<TableRow
												key={food.name}
												sx={{
													"&:last-child td, &:last-child th": { border: 0 },
												}}
											>
												<TableCell component="th" scope="row">
													{index + 1}
												</TableCell>
												<TableCell align="right">{food.name}</TableCell>
												<TableCell align="right">{food.qty}</TableCell>
												<TableCell align="right">{food.size}</TableCell>
												<TableCell align="right">{food.price}</TableCell>
												<TableCell align="right">
													<IconButton onClick={handleRemove}>
														<Icon icon="ic:outline-delete" />
													</IconButton>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
								<Typography variant="h6">
									Total Price: {totalPrice}/-
								</Typography>
							</TableContainer>
							<Checkout />
						</Box>
					)}
				</Drawer>
			</React.Fragment>
		</div>
	);
}
