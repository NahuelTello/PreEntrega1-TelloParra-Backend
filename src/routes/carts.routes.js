import { ManagerCart } from "../models/cart.js";
import { Router } from 'express';

const cartsRouter = Router();

cartsRouter.post('/', async (req, res) => {
    await ManagerCart.createCart();
    res.send("Carrito creado");
})

cartsRouter.get('/', async (req, res) => {
    res.send(await ManagerCart.getAllCarts());
})

cartsRouter.get('/:id', async (req, res) => {
    res.send(await ManagerCart.getCartById(req.params.id));
})

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    res.send(await ManagerCart.addProductToCart(req.params.cid, req.params.pid));
})

export default cartsRouter