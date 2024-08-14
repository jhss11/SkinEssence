function detalleProducto(id) {
    window.location.href = `detalleProductos.html?id=${id}`;
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('json/products.json')
        .then(response => response.json())
        .then(data => {
            displayProducts(data)
            displayBrands(data);
            displayFilter(data);
            console.log(products)
        })
        .catch(error => console.error('Error al obtener los datos JSON:', error));
});


function displayProducts(data) {
    $("#products").html('')
    data.forEach(product => {
        const colProd = document.createElement("div")
        colProd.classList.add("col")

        const cardProd = `<div class="col-md-4 mb-3">
                    <div class="card text-center mb-4 " id="card-products">
                        <img class="card-img-top" style="max-height:460px;" role="img"
                            src=${product.main_img ? product.main_img : 'img/image-not-foung.jpg'}"
                            class="card-img-top" alt="${product.name}">
                        <div class="card-body ">
                            <h5 class="card-title"> ${product.nombre}</h5>
                            <h1 class="card-text">&cent;${product.precio}</h1>
                            <p class="card-text">${product.descripcion_corta}</p>
                            <div class="d-grid gap-2">
                                <button type="button" class="btn btn-lg btn-warning" onclick="detalleProducto(${product.id})">Detalle</button>
                            </div>
                        </div>
                    </div>
                </div>`

        colProd.append(cardProd)
        $("#products").append(cardProd)
    });
}



// Función para mostrar las opciones de filtro por categoría
function displayBrands(products) {
    var select = $('#filter');
    var brands = [];

    products.forEach(product => {
        if (!brands.includes(product.marca)) {
            brands.push(product.marca);
            select.append(`<option value="${product.marca}">${product.marca}</option>`);
        }
    });
}

function displayFilter(products) {
    $('#filter').change(function () {
        var selectedBrand = $(this).val();
        var filteredProducts;

        if (selectedBrand === 'all') {
            filteredProducts = products;
        } else {
            filteredProducts = products.filter(product => product.marca === selectedBrand);
        }

        displayProducts(filteredProducts);
    });
}
