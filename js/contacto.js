document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Validaciones sencillas
        const nombre = document.getElementById('nombre').value.trim();
        const primerApellido = document.getElementById('primer_apellido').value.trim();
        const segundoApellido = document.getElementById('segundo_apellido').value.trim();
        const email = document.getElementById('email').value.trim();
        const tel = document.getElementById('tel').value.trim();
        const observaciones = document.getElementById('observaciones').value.trim();

        // Validación del nombre
        const nombPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]{1,15}$/;
        if (!nombPattern.test(nombre)) {
            Swal.fire({
                icon: 'error',
                title: 'Nombre inválido',
                text: 'Por favor, ingrese un nombre válido.',
            });
            return;
        }

        // Validaciones de los apellidos
        const appell1Pattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]{1,15}$/;
        if (!appell1Pattern.test(primerApellido)) {
            Swal.fire({
                icon: 'error',
                title: 'Apellido inválido',
                text: 'Por favor, ingrese un apellido válido.',
            });
            return;
        }

        const appell2Pattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]{1,15}$/;
        if (!appell2Pattern.test(segundoApellido)) {
            Swal.fire({
                icon: 'error',
                title: 'Apellido inválido',
                text: 'Por favor, ingrese un apellido válido.',
            });
            return;
        }

        // Validación del correo electrónico
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Correo electrónico inválido',
                text: 'Por favor, ingrese un correo electrónico válido.',
            });
            return;
        }

        // Validación del teléfono
        const telPattern =  /^\d{8}$/;
        if (!telPattern.test(tel)) {
            Swal.fire({
                icon: 'error',
                title: 'Teléfono inválido',
                text: 'Por favor, ingrese un número de teléfono válido con el formato 80000000, sin guiones ni espacios.',
            });
            return;
        }

        // Validaciones complejas
        const fecha = document.getElementById('fecha').value;
        if (fecha) {
            const today = new Date();
            const birthDate = new Date(fecha);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 18) {
                Swal.fire({
                    icon: 'error',
                    title: 'Edad insuficiente',
                    text: 'Debe ser mayor de 18 años para enviar este formulario.',
                });
                return;
            }
        }

        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: '¡Formulario enviado exitosamente!',
        });

        form.reset();
    });
});