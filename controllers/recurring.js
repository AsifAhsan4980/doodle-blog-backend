import CryptoJS from "crypto-js";
import {v1 as uuid} from "uuid";
import axios from "axios";


const key = "FeKZ4fYlF2UkpuzGqdO8As0GCHxtyeyS"; //API Key goes here
const secret = "SE2dnlQWi9dmbLJIVFEveORnnAI1n6sKBLMJNQqA4Sd"; //Secret goes here
const url = "https://prod.emea.api.fiservapps.com/sandbox/ipp/payments-gateway/v2/payment-schedules/";
const time = new Date().getTime()


const encryption = (data, id) => {
    const requestBody = JSON.stringify(data);

    let rawSignature = key + id + time + requestBody
    // if (data) {
    //     rawSignature = key + id + time + requestBody
    // }
    // else {
    //     rawSignature = key + id + time
    // }

    let computedHash = CryptoJS.algo.HMAC.create(
        CryptoJS.algo.SHA256,
        secret.toString()
    );

    computedHash.update(rawSignature);
    computedHash = computedHash.finalize();
    const computedHmac = CryptoJS.enc.Base64.stringify(computedHash);

    return {
        hash: computedHmac,
        id: id
    }
}
const recurringPost = async (req, res) => {

    const body = {
        "requestType": "PaymentMethodPaymentSchedulesRequest",
        "startDate": "2022-07-16",
        "numberOfPayments": 10,
        "maximumFailures": 1,
        "invoiceNumber": "96126098",
        "purchaseOrderNumber": "123055342",
        "transactionOrigin": "ECOM",
        "dynamicMerchantName": "MyWebsite",
        "frequency": {
            "every": 1,
            "unit": "MONTH"
        },
        "paymentMethod": {
            "paymentCard": {
                "number": '4005520000000129',
                "expiryDate": {
                    "month": "10",
                    "year": "22"
                },
                "securityCode": "002",
                "cardFunction": "CREDIT"
            }
        },
        "transactionAmount": {
            "total": "25.24",
            "currency": "GBP"
        },
        "clientLocale": {
            "language": "EN",
            "country": "USA"
        }
    }


    const ClientRequestId = uuid()
    let ed = encryption(body, ClientRequestId)

    await axios.post(url, JSON.stringify(body), {
        headers: {
            "Content-Type": "application/json",
            "Client-Request-Id": ed.id,
            "Api-Key": key,
            "Timestamp": time.toString(),
            "Message-Signature": ed.hash
        }
    }).then((r) => {
        console.log(r.data)
        // array.push({params: link, transactionId: r.data.ipgTransactionId})
        res.status(200).json(r.data)
    }).catch(function (error) {
        if (error.response) {
            // Request made and server responded
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.code);
        } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
    });
}


const getOrder = async (req, res) => {
    const orderId = req.params.id
    console.log('OrderId:::',orderId)
    let body = {}
    const ClientRequestId = uuid()
    let ed = encryption(body, ClientRequestId)

    await axios.get(url + orderId , {
        headers: {
            "Content-Type": "application/json",
            "Client-Request-Id": ed.id,
            "Api-Key": key,
            "Timestamp": time.toString(),
            "Message-Signature": ed.hash
        }
    }).then(r => {
            console.log(r.data)
            res.status(200).json(r.data)
        }
    ).catch(function (error) {
        if (error.response) {
            // Request made and server responded
            console.log('Error:::')
            console.log('1:::', error.response.data);
            console.log(error.response.data.error.details);
            console.log('2:::', error.response.status);
        } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }

    });
}

const patchOrder = async (req, res) => {
    const orderId = req.params.id
    let body = {
        "requestType": "PaymentMethodPaymentSchedulesRequest",
        "startDate": "2022-07-16",
        "numberOfPayments": 10,
        "maximumFailures": 1,
        "invoiceNumber": "96126098",
        "purchaseOrderNumber": "123055342",
        "transactionOrigin": "ECOM",
        "dynamicMerchantName": "MyWebsite",
        "frequency": {
            "every": 1,
            "unit": "MONTH"
        },
        "paymentMethod": {
            "paymentCard": {
                "number": '4005520000000129',
                "expiryDate": {
                    "month": "10",
                    "year": "22"
                },
                "securityCode": "002",
                "cardFunction": "CREDIT"
            }
        },
        "transactionAmount": {
            "total": "25.24",
            "currency": "GBP"
        },
        "clientLocale": {
            "language": "EN",
            "country": "USA"
        }
    }
    const ClientRequestId = uuid()
    let ed = encryption(body, ClientRequestId)
    await axios.patch(url + orderId, JSON.stringify(body), {
        headers: {
            "Content-Type": "application/json",
            "Client-Request-Id": ed.id,
            "Api-Key": key,
            "Timestamp": time.toString(),
            "Message-Signature": ed.hash
        }
    }).then(r => {
        console.log(r.data)
        res.status(200).json(r.data)
    }).catch(function (error) {
        if (error.response) {
            // Request made and server responded
            console.log('Error:::')
            console.log('1:::', error.response.data);
            console.log(error.response.data.error.details);
            console.log('2:::', error.response.status);
        } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }

    });
}

const deleteOrder = async (req, res) => {
    const orderId = req.params.id
    let body = {}
    const ClientRequestId = uuid()
    let ed = encryption(body, ClientRequestId)

    await axios.delete(url + orderId, {
        headers: {
            "Content-Type": "application/json",
            "Client-Request-Id": ed.id,
            "Api-Key": key,
            "Timestamp": time.toString(),
            "Message-Signature": ed.hash
        }
    }).then(r => {
            console.log(r.data)
            res.status(200).json(r.data)
        }
    ).catch(function (error) {
        if (error.response) {
            // Request made and server responded
            console.log('Error:::')
            console.log('1:::', error.response.data);
            console.log(error.response.data.error.details);
            console.log('2:::', error.response.status);
        } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }

    });
}

const Recurring = {
    recurringPost,
    getOrder,
    patchOrder,
    deleteOrder
}

export default Recurring