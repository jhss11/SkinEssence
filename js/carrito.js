document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.getElementById('productos');
    const comprar = document.getElementById('comprar');
    var ids = Object.keys(localStorage);

    var productosGuardados = ids.filter(id => id !== 'totalCarrito');
    console.log(productosGuardados)

    // Verificar si hay productos guardados
    if (productosGuardados.length > 0) {
        console.log(productosGuardados.length)
        comprar.disabled = false;
        fetch("/json/products.json")
            .then(respuesta => respuesta.json())
            .then(productosJson => {

                productosGuardados.forEach(idLocal => {
                    var productoEncontrado = productosJson.find(producto => producto.id == idLocal);
                    var cantidad = parseInt(localStorage.getItem(idLocal));

                    const tr = document.createElement('tr');

                    tr.innerHTML = `
                        <td class="d-flex align-items-center flex-column" style="max-width: 100%;">
                            <img src="${productoEncontrado.main_img}" class="img-fluid mb-2" alt="" style="max-width: 120px;">
                            <div class="text-center mb-2">
                                <h6 class="title mb-0">${productoEncontrado.nombre}</h6>
                                <h6>${productoEncontrado.precio}</h6>
                            </div>
                            <button class="delete btn btn-danger btn-md" onclick="eliminarProducto('${idLocal}')">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                        
                        <td style="width: 20%;">
                            <div class="input-group input-group-sm">
                                <button class="btn btn-outline-secondary" type="button" onclick="disminuyeCantidad(this,${idLocal})">-</button>
                                <input type="number" class="form-control text-center" min="1" step="1" value="${cantidad}" style="max-width: 100px;">
                                <button class="btn btn-outline-secondary" type="button" onclick="incrementaCantidad(this,${idLocal})">+</button>
                            </div>
                        </td>
                        
                        <td style="width: 20%;">
                            <p class="mb-0 subtotal">${productoEncontrado.precio * cantidad}</p>
                        </td>
                    `;

                    // Añadir el elemento tr al cuerpo de la tabla
                    tbody.appendChild(tr);
                });
                actualizarTotal();
            })
            .catch(error => console.error('Error al cargar el archivo JSON:', error));
    } else {
        comprar.disabled = true;
      //  console.log(productosGuardados.length)
        console.log('No hay productos guardados en el carrito.');
    }
});

function manejoBotonComprar() {
    const comprar = document.getElementById('comprar');
    var ids = Object.keys(localStorage);
    var productosGuardados = ids.filter(id => id !== 'totalCarrito');
    productosGuardados.length > 0 ? comprar.disabled = false : comprar.disabled = true
}

function incrementaCantidad(button, idProduct) {
    var tr = button.closest('tr');
    var input = tr.querySelector('input');
    var subtotal = tr.querySelector('.subtotal');
    var cantidad = parseInt(input.value) || 0;
    var newCantidad = cantidad + 1;
    var precio = parseFloat(tr.querySelector('.title + h6').innerText);

    input.value = newCantidad;
    localStorage.setItem(idProduct, newCantidad);
    subtotal.textContent = (precio * newCantidad);
    actualizarTotal();
}

function disminuyeCantidad(button, idProduct) {
    var tr = button.closest('tr');
    var input = tr.querySelector('input');
    var subtotal = tr.querySelector('.subtotal');
    var cantidad = parseInt(input.value) || 0;
    var newCantidad = cantidad - 1;
    var precio = parseFloat(tr.querySelector('.title + h6').innerText);

    if (newCantidad == 0) {
        eliminarProducto(idProduct)
        manejoBotonComprar()
    } else {
        input.value = newCantidad;
        localStorage.setItem(idProduct, newCantidad);
        subtotal.textContent = (precio * newCantidad);
    }
    actualizarTotal();
}

function actualizarTotal() {
    const subtotales = document.querySelectorAll('.subtotal');
    let total = 0;
    subtotales.forEach(subtotal => {
        total += parseFloat(subtotal.textContent);
    });
    localStorage.setItem('totalCarrito', total);
    document.querySelector('.itemCart.Total').textContent = `Total: ${total}`;
}

function eliminarProducto(idProduct) {
    // console.log(Swal.fire)
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem(idProduct);
            document.querySelector(`button[onclick="eliminarProducto('${idProduct}')"]`).closest('tr').remove();
            manejoBotonComprar()
            actualizarTotal();
            Swal.fire(
                'Eliminado',
                'El producto ha sido eliminado.',
                'success'
            )
        }
    })
}