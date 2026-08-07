const scanner = new Html5Qrcode("reader");

function onScanSuccess(decodedText){

    document.getElementById("scanResult").innerHTML =
        "Scanning...";

    window.location.href =
        `index.html?token=${encodeURIComponent(decodedText)}`;

}

scanner.start(

    { facingMode:"environment" },

    {

        fps:10,

        qrbox:250

    },

    onScanSuccess

);