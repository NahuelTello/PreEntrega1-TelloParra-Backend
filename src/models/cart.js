import { promises as fs } from "fs";

class Cart {
    constructor(id){
        this.id = id
        this.products = []
    }

    addProduct(producId){
        const productIndexado = this.products.findIndex( prods => prods.product === producId )
        if (productIndexado === -1) {
            this.products.push({product: producId, quantity: 1})
        } else {
            this.products[productIndexado].quantity += 1
        }

    }
}

class ManagerCart{
    constructor (){
        this.path = './src/models/carts.json'
        this.nxtId = 0 
        this.carts = []
    }

    guardarArchivo = async() => {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2))
        } catch (error) {
            console.error ('Hubo un error al guardar los carritos: ', error)
        }
    }

    getAllCarts = async() => {
        try {
            const DATA = await fs.readFile(this.path, 'utf-8')
            if (DATA.length > 0 ) {
                this.carts = JSON.parse(DATA)
                const maxCart = this.carts.reduce((prev, curr) => (prev.id > curr.id) ? prev : curr)
                this.nxtId = maxCart.id + 1
            }
            return this.carts
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log('Archivo de carritos no encontrado, se creará uno nuevo.')
                return []
            } else {
                console.error('Error al leer el archivo de carritos: ',error)
            }
        }
    }

    createCart = async() => {
        await this.getAllCarts()
        const newCart = new Cart(this.nxtId)
        this.carts.push(newCart)
        this.guardarArchivo()
        return newCart
    }

    getCartById = async(id) => {
        await this.getAllCarts();
        const cart = this.carts.find(cart => Number(cart.id) === Number(id));
        if (cart) {
            return cart;
        } else {
            console.log('Carrito no encontrado');
        }
    }

    addProductToCart = async (cartId, productId) => {
        const cartData = await this.getCartById(cartId);
        if (!cartData) {
            throw new Error('Carrito no encontrado');
        } else {
            const cart = Object.assign(new Cart(), cartData);
            cart.addProduct(productId);
            await this.saveToFile();
        }
    }
}

export const cartManager = new ManagerCart();