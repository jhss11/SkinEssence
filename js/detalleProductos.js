$(document).ready(function () {
  $("#addToCartBtn").hover(
    function () {
      $("#buttonText").hide();
      $("#cartIcon").show();
    }, function () {
      $("#cartIcon").hide();
      $("#buttonText").show();
    }
  );
});


$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  //"id" es el nombre exacto del parámetro que se estableción en el window.href
  const prodId = urlParams.get('id');

  if (prodId) {
    // Cargar datos del JSON
    fetch('json/products.json')
      .then(response => response.json())
      .then(data => {
        // Encontrar el producto en los datos cargados
        const prod = data.find((b) => b.id == prodId);
        //Validación si el libro no existe entonces que diga que no se encontró
        if (prod) {
          console.table(prod);
          $('#title').text(prod.nombre);
          $('#stock').html('<b>Cantidad: </b>' + prod.stock);
          $('#time').html('<b>Tiempos de entrega: </b>' + prod.tiempo_entrega);
          $('#delivery_cost').html('<b>Gastos de envío: </b> &cent;' + prod.gastos_envio);
          $('#delivery_type').html('<b>Opciones de entrega: </b>' + prod.opciones_entrega);
          $('#warranty').html('<b>Garantía del producto: </b>' + prod.garantia);
          $('#price').html('&cent;' + prod.precio);
          $('#description').text((prod.descripcion ? prod.descripcion : "No description"));
          $('#main_image').attr('src', prod.main_img);
          //faltan otras fotos
          $('#image2').attr('src', prod.imagenes[0]);
          $('#image3').attr('src', prod.imagenes[1]);

          $('#refund').html(`¿Deseas obtener información sobre algún cambio o devolución? Haz click <a href="${prod.cambios_devoluciones}">AQUI</a> `);
          $('#contact').html(`Si deseas ponerte en contacto con nosotros, haz click <a href="${prod.contacto_ayuda}">AQUI</a> `);

          $("#clientsReviews").html('')
          $("#clientsReviews").html('<div class="col-10"> <h2 class="mb-4" id="reseñas">Reseñas</h2> </div>')

          prod.reviews.forEach((review) => {
            const cardReviews = `<div class="col-10">
            <div class="card mb-4">
                        <div class="card-body rounded reviewer_name">
                            <h5 class="card-title fst-italic"> ${review.nombre}</h5>
                            <div class="fs-5 " >
                               <p > Valoración: ${review.estrellas}/5 </p>
                            </div>
                            <p class="card-text fs-6"> ${review.texto}</p>
                        </div>
                    </div>
                    </div>
                    `
            $("#clientsReviews").append(cardReviews)
          });


        } else {
          console.error('Producto no encontrado');
        }
      })
      .catch(error => console.error('Error al obtener los datos JSON:', error));
  }
});

function agregarAlCarrito() {
  // Obtiene los parámetros de la URL
  const params = new URLSearchParams(window.location.search);

  // Obtiene el valor del parámetro 'id'
  const productId = params.get('id');
  const cantidadSeleccionada = parseInt(document.getElementById('cantidad').value)

  guadarEnLocalStorage(productId, cantidadSeleccionada);
  mensajeConfirmacion()

}

function guadarEnLocalStorage(id, cantidad) {
  // Verifica si el producto ya está en el localStorage
  const cantidadExistente = parseInt(localStorage.getItem(id)) || 0;

  // Suma la cantidad seleccionada a la cantidad existente
  const nuevaCantidad = cantidadExistente + cantidad;

  // Guarda la nueva cantidad en el localStorage
  localStorage.setItem(id, nuevaCantidad);
}

function incrementaCantidad() {
  var input = document.getElementById('cantidad');
  var value = parseInt(input.value, 10);
  input.value = value + 1;
}

function disminuyeCantidad() {
  var input = document.getElementById('cantidad');
  var value = parseInt(input.value, 10);
  if (value > 1) {
    input.value = value - 1
  }
}


// Configuración de Toastr 
toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": true,
  "positionClass": "toast-top-center",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "100",
  "hideDuration": "100",
  "timeOut": "100",
  "extendedTimeOut": "100",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
};

// Función para mostrar el mensaje de confirmación
function mensajeConfirmacion() {
  toastr.success('Producto agregado al carrito', 'Éxito');
}