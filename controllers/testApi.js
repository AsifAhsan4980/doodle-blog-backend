import crypto from "crypto"
import moment from "moment";
import axios from "axios";
import CryptoJS from "crypto-js"
import {v1 as uuid} from 'uuid'
import ErrorResponse from "../utils/errorResponse.js";

const key = "FeKZ4fYlF2UkpuzGqdO8As0GCHxtyeyS"; //API Key goes here
const secret = "SE2dnlQWi9dmbLJIVFEveORnnAI1n6sKBLMJNQqA4Sd"; //Secret goes here
const url = "https://prod.emea.api.fiservapps.com/sandbox/ipp/payments-gateway/v2/payments/";
const time = new Date().getTime()

const array = []


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


// const hash = crypto.createHash('sha256').update(secret.toString()).digest('base64');


const verifyUser = async (req, res, next) => {

    const link = Math.floor(Math.random() * 1000000);

    const body = {
        requestType: "PaymentCardSaleTransaction",
        transactionAmount: {total: "13", currency: "USD"},
        paymentMethod: {
            paymentCard: {
                number: req.body.cardNumber,
                securityCode: req.body.securityCode,
                expiryDate: {month: req.body.expiryMonth, year: req.body.expiryYear},
            },
        },
        authenticationRequest: {
            authenticationType: "Secure3D21AuthenticationRequest",
            termURL: `http://localhost:3001/test/fiserv/3ds/${link}`,
            challengeWindowSize: "04",
            challengeIndicator: "04", // This indicates what type of transaction we would like.
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
        array.push({params : link,transactionId: r.data.ipgTransactionId})
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

const TreeDS = async (req, res) => {
    try {
        console.log('body:::', req.body);
        console.log('Query:::', req.query, req.params);
        console.log("array1:::", array,req.body.cres)
        let d =  array.find(data => data.params.toString() === req.params.id)
        // array.filter(data => data.params.toString() !== req.params.id)


        console.log('aara',d)

        const ClientRequestId = uuid()
        let body = {authenticationType: "Secure3D21AuthenticationUpdateRequest",
            acsResponse: {cRes: req.body.cres},
            methodNotificationStatus: "RECEIVED",
            billingAddress: {
                "company": "Test Company",
                "address1": "5565 Glenridge Conn",
                "address2": "Suite 123",
                "city": "Atlanta",
                "region": "Georgia",
                "postalCode": "30342",
                "country": "USA"
            },
            "securityCode": "123",
        }
        let ed = encryption(body, ClientRequestId)

        await axios.patch(url + d.transactionId, JSON.stringify(body), {
            headers: {
                "Content-Type": "application/json",
                "Client-Request-Id": ClientRequestId,
                "Api-Key": key,
                "Timestamp": time.toString(),
                "Message-Signature": ed.hash
            }
        }).then(r => {
            console.log("Patch result 3DS:::", r.data)
            res.status(200).json(r.data)
        }).catch(function (error) {
            if (error.response) {
                // Request made and server responded
                console.log('Error 3DS:::')
                console.log('1 3DS:::', error.response.data);
                console.log(error.response.data.error.details);
                console.log('2 3DS:::', error.response.status);
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error 3DS', error.message);
            }

        });
    }catch (err){
        console.log('Confirm:::',err)
    }

}



const patchUser = async (req, res) => {
    const transactionId = req.params.TransactionId
    // const {cid} = req.body.data
    const body = {
        authenticationType: "Secure3D21AuthenticationUpdateRequest",
        methodNotificationStatus: "RECEIVED", // This is what we update,
        // authenticationRequest: {
        //     termURL: `http://localhost:3001/test/fiserv/3ds/${req.params.TransactionId}`,
        // }
    }

    let cid = uuid()
    let ed = encryption(body, cid)


    await axios.patch(url + transactionId, JSON.stringify(body), {
        headers: {
            "Content-Type": "application/json",
            "Client-Request-Id": cid,
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

const getData = async (req, res) => {
    const transactionId = req.params.TransactionId
    let body = null
    console.log(req.params, req.body)
    let cid = uuid()
    let ed = encryption(body, cid)

    console.log('scac', ed)

    await axios.get(url + transactionId, {
        headers: {
            "Content-Type": "application/json",
            "Client-Request-Id": cid,
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

const recurringPost = async (req, res, next) => {
    const body = {
        requestType: "PaymentMethodPaymentSchedulesRequest",
        startDate: "2022-11-16",
        numberOfPayments: 10,
        maximumFailures: 1,
        invoiceNumber: "96126098",
        purchaseOrderNumber: "123055342",
        transactionOrigin: "ECOM",
        dynamicMerchantName: "MyWebsite",
        frequency: {
            every: 1,
            unit: "MONTH"
        },
        paymentMethod: {
            paymentCard: {
                number: "5426064000424979",
                expiryDate: {
                    month: "12",
                    year: "22"
                },
                securityCode: "147",
                cardFunction: "CREDIT"
            }
        },
        transactionAmount: {
            total: "25.24",
            currency: "GBP"
        },
        clientLocale: {
            language: "EN",
            country: "USA"
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


let All = {
    verifyUser,
    patchUser,
    TreeDS,
    getData,
    recurringPost
}

export default All