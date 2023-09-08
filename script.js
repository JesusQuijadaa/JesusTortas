async function cargaFetch() {
    const urlLocal = "tortas.json";
    const resp = await fetch(urlLocal);
    const data = await resp.json();
    let tortas = data.tortas;
    insertarProductoEnHtml(tortas);
}
cargaFetch()



class Torta {
    constructor(torta) {
        this.id = torta.id;
        this.nombre = torta.nombre;
        this.precio = torta.precio;
        this.precioTotal = torta.precio;
        this.cantidad = 1;
    }

    agregarCarrito() {
        this.cantidad++;
    }

    quitarCarrito() {
        this.cantidad--;
    }


    precioFinalTotal() {
        this.precioTotal = this.precio * this.cantidad;
    }

}


//operador ternario para averiguar si hay contenido en el localStorage;
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];


let carritoHtml = document.getElementById("carrito");


//insertarProductoEnHtml(tortas);

function insertarProductoEnHtml(tortas) {
    let contenedor = document.getElementById("contenedor");
    for (const torta of tortas) {
        let card = document.createElement("div");
        card.innerHTML = `  
            <div class="col">
                <div id="card" class="card">
                <img src="${torta.img}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h2 class="card-title">${torta.nombre}</h2>
                    <p class="card-text precio">$${torta.precio}</p>
                    <p>Unidades disponibles: ${torta.stock == 0 ? "NO HAY STOCK" :  torta.stock}</p>
                    <div class="text-center">
                        <button id="Agregar${torta.id}" type="button" class="btn btn-dark"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart3" viewBox="0 0 16 16">
                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                      </svg> Añadir al carrito
                      </button>
                    </div>
                </div>
                </div>
            </div>
                        `;
        contenedor.appendChild(card);
    }
    //eventos
    tortas.forEach(Torta => {
        //Para cada boton
        document.getElementById(`Agregar${Torta.id}`).addEventListener(`click`, function() {
            agregarCarrito(Torta);
        });
    });
};
cargarCarrito();

function cargarCarrito() {
    carrito.map(items => {
            document.getElementById("tablabody").innerHTML += `
        <tr>
            <td>${items.id}</td>
            <td>${items.nombre}</td>
            <td id="${items.id}">${items.cantidad}</td>
            <td >${items.precio}</td>
             
        </tr>`
        })
        //se actualiza subtotal
    document.getElementById("subtotal").innerText = `Subtotal: $${subtotal()}`;
}
subtotal();

function subtotal() {
    let suma = 0;

    for (sumaItem of carrito) {
        suma = suma + (sumaItem.cantidad * sumaItem.precio);
    }
    return suma;
}

function agregarCarrito(torta) {
    let tortaEnCarrito = carrito.find((pastel) => pastel.id == torta.id);
    if (tortaEnCarrito == undefined) {
        let cargarCarrito = new Torta(torta);
        carrito.push(cargarCarrito);
        document.getElementById("tablabody").innerHTML += (`
        <tr>
            <td>${cargarCarrito.id}</td>
            <td>${cargarCarrito.nombre}</td>
            <td id="${cargarCarrito.id}">${cargarCarrito.cantidad}</td>
            <td >${cargarCarrito.precio}</td>
        </tr>`)
        localStorage.setItem("carrito", JSON.stringify(carrito));
        Swal.fire({
                title: `${torta.nombre}`,
                text: `Agregaste ${torta.nombre} al carrito`,
                imageUrl: `${torta.img}`,
                imageHeight: 200,
                imageAlt: 'Custom image',
            })
            //se actualiza subtotal
        document.getElementById("subtotal").innerText = `Subtotal: $${subtotal()}`;
        console.table(carrito);
    } else {
        let posicionDeTorta = carrito.findIndex((p) => p.id == torta.id);

        carrito[posicionDeTorta].cantidad += 1;
        carrito[posicionDeTorta].precioFinalTotal();
        Swal.fire({
            title: `${torta.nombre}`,
            text: `Se agrego otra unidad ${carrito[posicionDeTorta].nombre}`,
            Unidad: `${carrito[posicionDeTorta].cantidad}`,
            imageUrl: `${torta.img}`,
            imageHeight: 200,
            imageAlt: 'Custom image',
        })
        localStorage.setItem("carrito", JSON.stringify(carrito));
        document.getElementById(torta.id).innerText = carrito[posicionDeTorta].cantidad;
        //se actualiza subtotal
        document.getElementById("subtotal").innerText = `Subtotal: $${subtotal()}`;
    }
}





//evento para el boton FINALIZAR COMPRA
let finalizarCompra = document.getElementById("finalizarCompra");

finalizarCompra.onclick = () => {
    if (carrito <= 0) {
        carrito.length = 0;
        Swal.fire({
            title: `No  hay productos agregados en el carrito!!`,
            icon: 'error',
        })
    } else {
        imprimirFinDeCompra();
        carrito.length = 0;
        localStorage.clear();
        console.log(carrito);
        document.getElementById("subtotal").innerText = `Subtotal: $${subtotal()}`;

    }
}


function imprimirFinDeCompra() {
    Swal.fire({
        title: `Gracias por tu compra!!`,
        text: `El monto a pagar es:$ ${subtotal()}`,
        icon: 'success',
    })
    tablabody.innerHTML = "";
}

// Evento para el boton VACIAR
let vaciar = document.getElementById("vaciar");

vaciar.onclick = () => {
    if (carrito <= 0) {
        Swal.fire({
            title: `El carrito se encuentra vacio, no hay productos para eliminar!!`,
            icon: 'error',
        })
    } else {
        vaciarCarrito();
        localStorage.clear();
        carrito.length = 0; // Vacia el array de carrito
        console.log(carrito);
        document.getElementById("subtotal").innerText = `Subtotal: $${subtotal()}`;
    }
}

function vaciarCarrito() {

    tablabody.innerHTML = "";
    Swal.fire({
        text: `Carrito vacio!!`,
        icon: 'success',
    })
}