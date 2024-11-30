document.addEventListener("DOMContentLoaded", function () {

    const outputTextArea = document.getElementById("outputText");
    const errorText = document.getElementById("errorText");

    document.getElementById("processButton").addEventListener("click", async function () {

        let api = "https://script.google.com/macros/s/AKfycbw57QdQuEcQh9bWdhSiX1kYIDvHLSkazLFmGa_xy64l2zhsN0-I5J9aAC0Z3-1HS06HsQ/exec";
        let res = "data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAMsAAAAyCAIAAAB9BLi1AAAE20lEQVR42u2ce0gUURTGi94URi+JIHtoJZVp+U5TE2UjEqOEEKJM3axNK81SNOxNET2wJ2XR8z+RSMooNNQSX5lmmlZqbAZtmWVtVmZWR4LThWp35u6YOzMHPgZ355yz915/zP323pnt03/+IhLpX9K/MFhYoQ8NIonl6U8RYSQpeSLCSD3LExFG6nGkiDBSD/KkKMIk7AbxRIQRYfLgqTcJ4/tUE1lWTlhv/Ut6HSkizKoJa9S/kDVPRJi1E3YsM1vWPBFhVqchQaF1jXrsiH/cFlnzRIRZncJ37MNe2OviFYAUEWZGU8Kj4w6dyLiaU1ZT/7ipGYwRHOFveGdj+inH5VppZ9KF4yLw5XG3eUSYkglziVyXmVdodsiy8u64Ra+XxJlVdBTgWR9NYMfnDiJMsYRtO3NJ1MBBvOVm/7T3IAwOHmGnPLyIsG4NDgo9f+0WW+12aaV2X7pThG5gYAgEwHHmijVRew/fKr7Hhl3MyYVcbmPeqm+ZnpCMuVmP6okwZRJ2LDMb64DlithzwLQxhxiMj7ex5R76G8+mYlnn+K3NL18RYQokbMWuA1ikrlHvGbPRbHseFJS5pgXhO3smOvINfciEaCxyxNVbkXipnbAxIctqnjZhkaWpuwXaqcxqBzwLtLUZjGLH/WtbJ/sRd41FRJiUhEnSVsu7kXTiLGuqRDU11XY8xqd7+Ivty1EXL0wPtdMqFS9VEwb+vbKuAdNriytFNaak6D6WAsMuykVBsFPSJkzPaZpIhCmNsG5TX1mFL5dHbeBoz5JVv1fFnpRUC0+8UNuIiZ5bU5Tq8dXlw/7sOZhrPHtung/H2MHkyGfV2Rn2tPcgBePVy4SJJUMUYWZ7njZ6JAZfqXrMMXZZj+qxAlQTmPXj4xcfTSAmVnQUEGHWThjfFGyvi8dSne95tmuAFawgfNN6v7srZoVpI5WNlywJ+2vTOXrum6rBdD4n1KpvwQpzkoMFZk3SJWFWrsNMIqxnCRPVCBNNt7Dnlg+fV1CAkHj26wUg/ra5nQj7H4TxcSBHwrbYjMGUqP79FI+XqgmTdpaEambj2wxGABFTxK7AEWEyI2xyYgKm892YxTp9qGY2fruTO8avjFyjBrxUTRi7WsF354zY1QqgCuN3208nwuREGEcz2BXXoy5eHGN30sNP+Jrtg4Iy1rS1v3tPhCmcsCcl1RbuGi1eHYcVLpc/NB28vu9wDE4cNlQleKmaMHD37C2mlux8m91bNDz/xH6xaKioJcJkQJjlYjcWNaPGispl9xYz/AeYDr45zRmDHdZuVg9eaieszWCcnZaC9W88myow8XrDFHY1v6v9u+n4ZTFRGH/IcTYR9p9+e8ca+s9eXYAVIfNXdWENexf1did3VRFDhIkWu87uFxxgeh0BiGQdlVIfQSPCpFSrvoU1Vd0PFMXq4MoEXv6Xf4djaec9II9d0AKFTIgGC08MEWGCdMp3gKjGR8ztB2gSQESYuAWIUDvzP0sRpo0EK0boEGGcyv+Wf3CWZ9rokZMTE9iNavbqRdwQYVLqjb5lwdgYtuU7nT0IHSJMSn143cXem8p9az8RRoT9U3eNRewuk2+qpq64hAAiwqRUVX45uxg2Y9M2vkdIiDAizNR+kV9wACo8Vvfp1QfCiAgjEWEkIuxv+gn8+3YhnM9v6AAAAABJRU5ErkJggg==";
        let b64 = res.split("base64,")[1];

        // Static values for the file type and name
        let fileType = "image/jpg"; // The MIME type of the file
        let fileName = "example.jpg"; // The file name


        fetch(api, {
            method: "POST",
            body: JSON.stringify({
                file: b64,
                type: fileType,
                name: fileName
            })
        })
        .then(res => res.text())
        .then(data => {
            outputTextArea.innerHTML = data;
            errorText.innerHTML = ``;
        })
        .catch(error => {
            // Handle any errors that occur during the fetch request
            console.error("Error:", error);
            errorText.innerHTML = "An error occurred while processing the file.";
        });

    });

});


