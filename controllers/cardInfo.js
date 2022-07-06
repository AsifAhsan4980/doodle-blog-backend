import CryptoJS from "crypto-js";
import {v1 as uuid} from "uuid";
import axios from "axios";

const key = "FeKZ4fYlF2UkpuzGqdO8As0GCHxtyeyS"; //API Key goes here
const secret = "SE2dnlQWi9dmbLJIVFEveORnnAI1n6sKBLMJNQqA4Sd"; //Secret goes here
const url = "https://prod.emea.api.fiservapps.com/sandbox/ipp/payments-gateway/v2/payment-tokens";
const time = new Date().getTime()

const encryption = (data, id) => {
    const requestBody = JSON.stringify(data);
console.log(requestBody)

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

const setCard = async (req, res) => {

    const body = {
        requestType: "PaymentCardPaymentTokenizationRequest",
        paymentCard: {
            number: '4005520000000129',
            expiryDate: {
                month: "10",
                year: "22"
            },
            securityCode: "002",
            cardFunction: "CREDIT"
        },
        billingAddress: {
            address1: "5565 Glenridge Conn",
            city: "Atlanta",
            postalCode: "30342",
            country: "USA"
        },
        createToken: {
            reusable: true,
            declineDuplicates: false
        },
        accountVerification: true
    }

    console.log(body)
    const ClientRequestId = uuid()
    let ed = encryption(body, ClientRequestId)

    console.log(ed)


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


const getCard = async (req, res) => {

    let orderId = req.params.id
    let body = {}
    const ClientRequestId = uuid()
    let ed = encryption(body, ClientRequestId)

    console.log(orderId)

    await axios.get(url+'/'+ orderId,  {
        headers: {
            "Content-Type": "application/json",
            "Client-Request-Id": ed.id,
            "Api-Key": key,
            "Timestamp": time.toString(),
            "Message-Signature": ed.hash,
            "token-id" : orderId
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
            console.log(error.response.data.error.details);
        } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
    });
}


const updateCard = async (req, res) => {

    let orderId = req.params.id
    const body = {
        requestType: "PaymentCardPaymentTokenUpdateRequest",
        "paymentTokens": [
            {
                "value": orderId,
                "reusable": true,
                "declineDuplicates": false,
                "paymentCard": {
                    "number": "4012000033330026",
                    "expiryDate": {
                        "month": "10",
                        "year": "22"
                    },
                    "securityCode": "123"
                }
            }
        ]
    }

    console.log(body)
    const ClientRequestId = uuid()
    let ed = encryption(body, ClientRequestId)

    console.log(ed)


    await axios.patch(url, JSON.stringify(body), {
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

const deleteCard = async (req, res) => {
    let orderId = req.params.id
    const body = {}

    console.log(body)
    const ClientRequestId = uuid()
    let ed = encryption(body, ClientRequestId)

    console.log(ed)
    await axios.delete(url + '/' + orderId, {
        headers: {
            "Content-Type": "application/json",
            "Client-Request-Id": ed.id,
            "Api-Key": key,
            "Timestamp": time.toString(),
            "Message-Signature": ed.hash,
            "token-id": orderId
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
            console.log(error.response.data.error.details);
        } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
    });
}


const Card = {
    setCard,
    getCard,
    updateCard,
    deleteCard
}

export default Card