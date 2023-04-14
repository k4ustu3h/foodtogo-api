import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatchCart, useCart } from "./ContextReducer";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Collapse from "@mui/material/Collapse";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Icon } from "@iconify/react";
import { styled } from "@mui/material/";

const ExpandMore = styled((props) => {
	const { expand, ...other } = props;
	return (
		<Tooltip title="Show more options">
			<IconButton {...other} />
		</Tooltip>
	);
})(({ theme, expand }) => ({
	transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
	marginRight: "auto",
	transition: theme.transitions.create("transform", {
		duration: theme.transitions.duration.shortest,
	}),
}));

export default function FoodItems(props) {
	let data = useCart();

	let navigate = useNavigate();
	const [qty, setQty] = useState(1);
	const [size, setSize] = useState("");
	const [expanded, setExpanded] = React.useState(false);
	const priceRef = useRef();

	let options = props.options;
	let priceOptions = Object.keys(options);
	let foodItem = props.item;
	const dispatch = useDispatchCart();
	const handleClick = () => {
		if (!localStorage.getItem("token")) {
			navigate("/login");
		}
	};
	const handleQty = (e) => {
		setQty(e.target.value);
	};
	const handleOptions = (e) => {
		setSize(e.target.value);
	};
	const handleAddToCart = async () => {
		let food = [];
		for (const item of data) {
			if (item.id === foodItem._id) {
				food = item;

				break;
			}
		}
		console.log(food);
		console.log(new Date());
		if (food !== []) {
			if (food.size === size) {
				await dispatch({
					type: "UPDATE",
					id: foodItem._id,
					price: finalPrice,
					qty: qty,
				});
				return;
			} else if (food.size !== size) {
				await dispatch({
					type: "ADD",
					id: foodItem._id,
					name: foodItem.name,
					price: finalPrice,
					qty: qty,
					size: size,
					img: props.ImgSrc,
				});
				console.log("Size different so simply ADD one more to the list");
				return;
			}
			return;
		}

		await dispatch({
			type: "ADD",
			id: foodItem._id,
			name: foodItem.name,
			price: finalPrice,
			qty: qty,
			size: size,
		});
	};

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	useEffect(() => {
		setSize(priceRef.current.value);
	}, []);

	let finalPrice = qty * parseInt(options[size]);
	return (
		<React.Fragment>
			<Card sx={{ width: 258, borderRadius: 4 }}>
				<CardMedia
					sx={{ height: 176, borderRadius: 4 }}
					image={props.ImgSrc}
					title={props.foodName}
				/>

				<CardContent>
					<Typography gutterBottom variant="h6" component="div">
						{props.foodName}
					</Typography>
					<Typography variant="subtitle1" color="text.secondary" mt={1}>
						₹{finalPrice}/-
					</Typography>
				</CardContent>

				<CardActions>
					<ExpandMore
						expand={expanded}
						onClick={handleExpandClick}
						aria-expanded={expanded}
						aria-label="show more"
					>
						<Icon icon="ic:outline-expand-more" />
					</ExpandMore>
					<IconButton onClick={handleAddToCart} sx={{ ml: "auto" }}>
						<Icon icon="ic:outline-add-shopping-cart" />
					</IconButton>
				</CardActions>
				<Collapse in={expanded} timeout="auto" unmountOnExit>
					<CardContent>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
							{props.description}
						</Typography>
						<ButtonGroup sx={{ height: 34 }}>
							<Button
								aria-label="reduce"
								onClick={() => {
									setQty(Math.max(qty - 1, 1));
								}}
								onChange={handleQty}
								size="small"
							>
								<Icon icon="ic:outline-remove" width={18} />
							</Button>
							<Button value={qty} onChange={handleQty} size="small">
								{qty}
							</Button>
							<Button
								aria-label="increase"
								onClick={() => {
									setQty(qty + 1);
								}}
								onChange={handleQty}
								size="small"
							>
								<Icon icon="ic:outline-add" width={18} />
							</Button>
						</ButtonGroup>
						<FormControl sx={{ m: 1, minWidth: 92, top: -8 }} size="small">
							<InputLabel
								id="size-options"
								sx={{ fontSize: 12, color: "primary.main" }}
							>
								Size
							</InputLabel>
							<Select
								labelId="size-options"
								id="size-options"
								value={size}
								label="Size"
								sx={{ fontSize: 12, color: "primary.main" }}
								onClick={handleClick}
								onChange={handleOptions}
							>
								{priceOptions.map((i) => {
									return (
										<MenuItem sx={{ fontSize: 12 }} key={i} value={i}>
											{i}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
					</CardContent>
				</Collapse>
			</Card>
			<select style={{ display: "none" }} ref={priceRef}>
				{/* temporary ref fix */}
				{priceOptions.map((i) => {
					return (
						<option key={i} value={i}>
							{i}
						</option>
					);
				})}
			</select>
		</React.Fragment>
	);
}
//
