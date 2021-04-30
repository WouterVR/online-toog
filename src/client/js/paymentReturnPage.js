
//payment id halen uit url
//request maken voor payment status
//status in view aanpassen
function paymentStatusPageLoad() {
    let paymentReference = window.location.href.replace("http://online-toog.jhdebem.be/lookupOrder/", "")
    let url = "/getPaymentStatus/" + paymentReference
    $.post(url, paymentReference, function (paymentStatus, httpStatus) {
        if (httpStatus === "success") {
            let statusTextView = $('#paymentStatus')
            statusTextView.empty()
            statusTextView.append(document.createTextNode("Status van je betaling: " + translatePaymentStatusForReturnPage(paymentStatus)))
            if(paymentStatus !== '"SUCCEEDED"'){
                $('#extra-text').empty()
                let textDiv = $('#order-received-div')
                let text = "Herlaad de pagina om de status van de betaling te vernieuwen. Indien de betaling niet gelukt is, kan je gewoon cash betalen!"
                let p = document.createElement('span')
                p.setAttribute('id','extra-text')
                p.append(document.createTextNode(text))
                textDiv.append(p)
            }
        } else {
            alert("Error occured while retrieving payment status")
            console.error("Error occured while retrieving payment status")
        }
    })
}

function translatePaymentStatusForReturnPage(paymentStatus){
    switch (paymentStatus) {
        case '"SUCCEEDED"':
            return "Succesvol"
        case '"FAILED"':
            return "Mislukt"
        case '"PENDING"':
            return "In Afwachting"
        case '"IDENTIFIED"':
            return "(Nog) Niet In Orde"
        case '"AUTHORIZED"':
            return "(Nog) Niet In Orde"
        case '"AUTHORIZATION_FAILED"':
            return "Autorisatie mislukt"
        case '"CANCELLED"':
            return "Geannuleerd"
        case '"EXPIRED"':
            return "Verlopen"
        default:
            return "Geen Gegevens"
    }
}