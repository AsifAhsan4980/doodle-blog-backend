import {v1 as uuid} from "uuid";
import CryptoJS from "crypto-js";
import axios from "axios";
import bodyParser from "body-parser";


const key = "FeKZ4fYlF2UkpuzGqdO8As0GCHxtyeyS"; //API Key goes here
const secret = "SE2dnlQWi9dmbLJIVFEveORnnAI1n6sKBLMJNQqA4Sd"; //Secret goes here
const url = "https://prod.emea.api.fiservapps.com/sandbox/ipp/payments-gateway/v2/payment-url";
const time = new Date().getTime()

const encryption = (data, id) => {
    const requestBody = JSON.stringify(data);
    console.log(requestBody)

    let rawSignature = key + id + time +requestBody
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

const post = async (req, res) => {

    let body = {
        "transactionAmount": {
            "total": "42.42",
            "currency": "USD"
        },
        "transactionType": "SALE",
        "transactionNotificationURL": "https://doodleinc.com",
        "expiration": "4102358400",
        "authenticateTransaction": true,
        "dynamicMerchantName": "MyWebsite",
        "invoiceNumber": "96126098",
        "purchaseOrderNumber": "123055342",
        "ip": "264.31.73.24"
    }

    console.log(body)
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
            console.log(error.response.data.error.details);
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

const get = async (req, res) => {

    const id = req.params.id
    let body = {}

    console.log(body)
    const ClientRequestId = uuid()
    let ed = encryption(body, ClientRequestId)
    await axios.get(url+`?fromDate=1102358400&toDate=2102358400&status=Used&orderId=${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Client-Request-Id": ed.id,
            "Api-Key": key,
            "Timestamp": time.toString(),
            "Message-Signature": ed.hash,
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
            // console.log(error.response.data.error.details);
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

const deletes = async (req, res) => {
    const id = req.params.id
    let body = {}
    console.log(body, id)
    const ClientRequestId = uuid()
    let ed = encryption(body, ClientRequestId)
    await axios.delete(url+`?orderId=${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Client-Request-Id": ed.id,
            "Api-Key": key,
            "Timestamp": time.toString(),
            "Message-Signature": ed.hash,
            "orderId": 'R-9ac6e871-2f49-401c-abd6-141d3d5d31a5',

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
            console.log(error.response.data.error.details);
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

const conversion = async (req, res) => {
    let body = {
        "requestType": "DCCExchangeRateRequest",
        "baseAmount": "12.32",
        "bin": "624000"
    }

    console.log(body)
    const ClientRequestId = uuid()
    let ed = encryption(body, ClientRequestId)
    await axios.post("https://prod.emea.api.fiservapps.com/sandbox/ipp/payments-gateway/v2/exchange-rates", JSON.stringify(body), {
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
            console.log(error.response.data.error.details);
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

const PaymentURL = {
    post, get, deletes, conversion
}

export default PaymentURL