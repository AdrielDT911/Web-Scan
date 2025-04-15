document.addEventListener("DOMContentLoaded", () => {
    // Obtener los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const appId = params.get('app_id');
    const appUser = params.get('app_user');
    const appPageId = params.get('app_page_id');

    // Mostrar los datos en el HTML
    document.querySelector('#app-info').textContent = `ID de la app: ${appId}, Usuario: ${appUser}, Página: ${appPageId}`;
    
    // Agregar funcionalidad al botón
    document.getElementById('openCameraButton').addEventListener('click', abrirCamara);
    document.getElementById('cancelButton').addEventListener('click', cerrarCamara);
});

// Función para abrir el modal y mostrar la cámara
function abrirCamara() {
    const modal = document.getElementById("cameraModal");
    const qrReader = document.getElementById("qr-reader");
    mostrarModal(modal);
    
    const html5QrCode = new Html5Qrcode("qr-reader"); 

    // Inicia el escáner de QR
    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 150, height: 150 } },
        (decodedText, decodedResult) => {
            console.log("QR detectado:", decodedText);
            procesarQr(decodedText, html5QrCode);
        },
        (errorMessage) => {
            console.log("Error en el escaneo: ", errorMessage);
        }
    ).catch((err) => {
        console.error("Error iniciando escáner:", err);
    });
}

// Función para mostrar el modal
function mostrarModal(modal) {
    modal.classList.add("show");
}

// Función para ocultar el modal
function cerrarCamara() {
    const modal = document.getElementById("cameraModal");
    modal.classList.remove("show");
}

// Función para procesar el QR
function procesarQr(decodedText, html5QrCode) {
    try {
        const qrUrl = new URL(decodedText);
        const cdcid = qrUrl.searchParams.get("Id");

        if (!cdcid) {
            alert("No se encontró un ID válido en el QR.");
            return;
        }

        alert("ID capturado: " + cdcid);

        fetch("http://192.168.5.48:8000/qr/guardar-cdc", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cdc_id: cdcid })
        })
        .then(res => res.json())
        .then(data => {
            alert("ID guardado y enviado correctamente.");
        })
        .catch(err => {
            alert("Error al enviar el ID: " + err.message);
        });

        html5QrCode.stop().then(() => {
            cerrarCamara();
        });
    } catch (e) {
        alert("Error al procesar el QR: " + e.message);
    }
}


