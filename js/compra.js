$(document).ready(function () {
    // Inicialmente desactiva el botón de "Finalizar compra"
    $('#finalizar').prop('disabled', true);

    const minimo = 5;
    const maximo = 10;

    // Función para calcular el costo de envío según el tipo de envío y la cantidad total
    function calcularCostoEnvio() {
        let totalCantidad = 0;
        let totalCompra = parseFloat(localStorage.getItem('totalCarrito'));

        // Iterar sobre cada clave en localStorage para sumar la cantidad de productos
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key !== 'totalCarrito') {
                totalCantidad += parseInt(localStorage.getItem(key));
            }
        }

        const envioPostal = $('#envioPostal').is(':checked');
        let costoEnvio = envioPostal ? (totalCantidad <= minimo ? 2000 : totalCantidad <= maximo ? 3500 : 6000) : 0;

        // Actualizar el total de la compra incluyendo el costo de envío
        totalCompra += costoEnvio;

        $('#entrega').text(costoEnvio); // Actualiza el costo de envío en el DOM
        $('#total').text(`₡${totalCompra}`); // Actualiza el total en el DOM
    }

    // Función para verificar la tarjeta de crédito
    async function verificarTarjeta() {
        const numeroTarjeta = $('#numeroTarjeta').val().replace(/\s+/g, '');
    
        if (numeroTarjeta.length < 16) {
            $('#resultadoTarjeta').text('Por favor, ingrese los 16 dígitos de la tarjeta.');
            return '';
        }
    
        const bin = numeroTarjeta.substring(0, 6);
    
        try {
            const response = await fetch(`https://data.handyapi.com/bin/${bin}`);
            const data = await response.json();
    
            if (data && data.Scheme) {
                let marca = data.Scheme.toUpperCase();
                let logo = (marca === 'VISA') ? 'img/visa.webp' : 'img/masterCard.png';
                let tipo = (data.Type === 'DEBIT') ? 'Débito' : 'Crédito';
    
                $('#resultadoTarjeta').html(`<img src="${logo}" alt="${marca}" style="height: 80px;">`);
                $('#tipoTarjeta').html(`<p><b>Tipo de tarjeta:</b> ${tipo}</p>`);
    
                // Habilitar el botón de "Finalizar compra" si la tarjeta es válida
                $('#finalizar').prop('disabled', false);
                return tipo;
            } else {
                $('#resultadoTarjeta').text('Tarjeta no reconocida.');
                return '';
            }
        } catch (error) {
            $('#resultadoTarjeta').text('Error al verificar la tarjeta.');
            return '';
        }
    }
    
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++Finaliza Compra++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

    function obtenerProductosGuardados() {
        const ids = Object.keys(localStorage);
        return ids.filter(id => id !== 'totalCarrito');
    }

    function obtenerTotalCarrito() {
        return localStorage.getItem('totalCarrito');
    }

    // Función para generar el PDF de la factura
    function generarPDF(productosJson, productosGuardados, totalCarrito, tipoEnvio, medioPago) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFont("times", "bold");
        doc.setFontSize(14);
        doc.text("Factura de Compra", 14, 20);

        doc.setFont("courier", "normal");
        doc.setFontSize(12);
        doc.setTextColor(50);

        doc.text("Producto", 14, 30);
        doc.text("Cantidad", 90, 30);
        doc.text("Precio", 120, 30);
        doc.text("Subtotal", 150, 30);

        let y = 40;

        productosGuardados.forEach(idLocal => {
            const productoEncontrado = productosJson.find(producto => producto.id == idLocal);
            const cantidad = parseInt(localStorage.getItem(idLocal));
            const subtotal = cantidad * productoEncontrado.precio;

            doc.setFontSize(10);

            if (productoEncontrado.nombre.length > 30) {
                let nombre1 = productoEncontrado.nombre.substring(0, 30);
                let nombre2 = productoEncontrado.nombre.substring(30);
                doc.text(nombre1, 14, y);
                y += 10;
                doc.text(nombre2, 14, y);
            } else {
                doc.text(productoEncontrado.nombre, 14, y);
            }

            doc.setFontSize(12);
            doc.setTextColor(50);

            doc.text(cantidad.toString(), 98, y);
            doc.text(productoEncontrado.precio.toString(), 118, y);
            doc.text(subtotal.toString(), 148, y);

            y += 10;
        });

        y += 10;
        doc.setFont("times", "bold");
        doc.text("Total:", 100, y);
        doc.text(totalCarrito.toString(), 120, y);

        y += 10;
        doc.setFont("courier", "normal");
        doc.text("Tipo de Envío:", 14, y);
        doc.text(tipoEnvio, 55, y);

        y += 10;
        
        doc.text("Medio de Pago:", 14, y);
        doc.text(medioPago, 55, y);

        doc.output('dataurlnewwindow');
    }

    // Función principal que maneja el clic en el botón de "Finalizar compra"
    async function finalizarCompra() {
        const productosGuardados = obtenerProductosGuardados();
        const totalCarrito = obtenerTotalCarrito();
        const medioPago = await verificarTarjeta();
        if (productosGuardados.length > 0) {
            $.getJSON("/json/products.json", function (productosJson) {
                const tipoEnvio = document.querySelector('input[name="envio"]:checked').value;

                generarPDF(productosJson, productosGuardados, totalCarrito, tipoEnvio, medioPago);
            }).fail(function () {
                console.error('Error al cargar el archivo JSON.');
            });
        } else {
            console.log('No hay productos guardados en el carrito.');
        }
    }

    calcularCostoEnvio();

    $('input[name="envio"]').on('change', calcularCostoEnvio);

    $('#verificarTarjeta').on('click', verificarTarjeta);

    $('#finalizar').on('click', finalizarCompra);
});
