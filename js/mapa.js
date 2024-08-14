function iniMapa() {
    var map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function () {
                var pos = {

                    lat: 10.022404748777202,
                    lng: -84.469136682531
                };
                

                L.marker(pos).addTo(map).bindPopup('Ubicación de la Tienda').openPopup();
                map.setView(pos, 13);
            },

            function (){
                handleLocationError(true, map.getCenter());
            }
        );

    }else{
        handleLocationError(false, map.getCenter());
    }

}


function handleLocationError(browserHasGeolocation, pos){
    var message = browserHasGeolocation ? "Error: El servicio de geolocalización falló."
    : "Error: Tu navegador no soporta geolocalización.";
    L.popup()
    .setLatLng(pos)
    .setContent(message)
    .openOn(map)
}
 
window.onload=iniMapa;