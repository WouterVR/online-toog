window.location.href
//payment id halen uit url
//request maken voor payment status
//status in view aanpassen

let paymentReference = window.location.href.replace("http://online-toog.jhdebem.be/lookupOrder/","")
let url = "/getPaymentStatus/"+paymentReference
alert('url is: ' + url)
$.post(url,paymentReference,function (paymentStatus, httpStatus){
    if(httpStatus === "success"){
        let statusTextView =  $('#paymentStatus')
        alert('Positieve reactie van server, paymentStatus is: '+ paymentStatus)
        statusTextView.empty()
        statusTextView.append(document.createTextNode("Status van je betaling: "+translatePaymentStatus(paymentStatus)))
    }else{
        alert("Error occured while retrieving payment status")
        console.error("Error occured while retrieving payment status")
    }
})