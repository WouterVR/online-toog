window.location.href
//payment id halen uit url
//request maken voor payment status
//status in view aanpassen

let paymentReference = window.location.href.replace("http://online-toog.jhdebem.be/lookupOrder/","")
let url = "/getPaymentStatus/"+paymentReference
$.post(url,paymentReference,function (paymentStatus, httpStatus){
    if(httpStatus === "success"){
        let statusTextView =  $('#paymentStatus')
        statusTextView.empty()
        statusTextView.append(document.createTextNode("Status van je betaling: "+translatePaymentStatus(paymentStatus)))
    }else{
        console.error("Error occured while retrieving payment status")
    }
})