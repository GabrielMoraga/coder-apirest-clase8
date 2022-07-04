const express = require('express');
const { Router } = require('express');

const app = express()


// Middlewares para leer el body con json()
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Middleware para acceder a archivos estáticos
app.use(express.static("public"));


let routerProductos = new Router();

let productos = [];

// Devuelve todos los productos
routerProductos.get('/', (req,res) => {
    res.json(productos)
});

// Devuelve un producto según id
routerProductos.get('/:id', (req, res) => {
    let {id} = req.params
    id_num = Number(id);
    // Utilizo findIndex
    const index = productos.findIndex((x) => x.id === id_num);
    let producto = productos[index]
    if (producto) {
        res.json(productos[index])
    } else {
        res.send(`Prodcuto ${id} no encontrado`)
    }
    
});

// Recibe y agrega un producto y lo devuelve con su id asignado
routerProductos.post('/', (req, res) => {
    let producto = req.body;
    //Utilizo este reduce para evitar duplicar un id - busca el mayor id en el array productos y crera un id mayor + 1
    const max = productos.reduce((a,b) => a.id > b.id ? a:b, {id:0})
    producto.id = max.id + 1;
    productos.push(producto);
    res.json(productos);
});

// Recibe y actualiza un producto según su id
routerProductos.put('/:id', (req, res) => {
    let producto = req.body;
    let { id } = req.params;
    id_num = Number(id);
    producto.id = id_num
    const index = productos.findIndex((x) => x.id === id_num);
    producto_old = productos[index];
    if (producto_old) {
        productos.splice(index,1, producto)
        res.json(producto);
    } else {
        res.send(`Prodcuto ${id} no existe`)
    }
});


// Elimina un producto según su id
routerProductos.delete('/:id', (req,res) => {
    let {id} = req.params;
    id_num = Number(id);
    const index = productos.findIndex((x) => x.id === id_num);
    let producto = productos[index]
    if (producto) {
        productos.splice(index,1)
        res.json(producto);
    } else {
        res.send(`Prodcuto ${id} no encontrado`)
    }

});


const PORT = 8080
app.listen(PORT, () => {
    console.log(`El servidor está escuchando en el puerto ${PORT}`);
})

//Enlazamos las rutas
app.use("/api/productos", routerProductos);

app.on("error", error => console.log(`Error en el servidor ${error}`));