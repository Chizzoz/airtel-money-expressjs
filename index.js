const express = require("express")
const axios = require("axios")
const JSEncrypt = require("node-jsencrypt")

const PORT = process.env.PORT || 3000

// Airtel Money Developer API Credentials
const client_id = "*****************************"
const client_secret = "*****************************"
const collectionCallbackUrl = "https://backend.lupiya.com/airtel-callback"

// Generate Bearer Token URL: Authorization
const tokenUrl = "https://openapiuat.airtel.africa/auth/oauth2/token"

// Collection API Values
const collectionPaymentsUrl = "https://openapiuat.airtel.africa/merchant/v1/payments/"
const collectionRefundUrl = "https://openapiuat.airtel.africa/standard/v1/payments/refund"
const collectionTxnEnquiry = "https://openapiuat.airtel.africa/standard/v1/payments/"

// Collection API Values
const disbursementPaymentsUrl = "https://openapiuat.airtel.africa/standard/v1/disbursements/"
const disbursementRefundUrl = "https://openapiuat.airtel.africa/standard/v1/disbursements/refund"
const disbursementTxnEnquiry = "https://openapiuat.airtel.africa/standard/v1/disbursements/"

// Payload Presets
const country = "ZM"
const currency = "ZMW"

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Welcome to your Airtel Money API Client!")
})

// Airtel Money Collection Payment API
app.post("/airtel/collection", (req, res) => {
  if (!req.body.amount || !req.body.number || !req.body.reference) {
    res.json({ "message": "Please provide all required inputs (amount, number and reference)" })
  } else {
    var data = JSON.stringify({
      "client_id": client_id,
      "client_secret": client_secret,
      "grant_type": "client_credentials"
    });

    var config = {
      method: 'post',
      url: tokenUrl,
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data))
        // Generate Unique Reference
        let rightNow = new Date()
        let lupiyaRefNo = "LPY" + rightNow.getFullYear() + '-' + (rightNow.getMonth() + 1) + '-' + rightNow.getDate() + '-' + rightNow.getSeconds() + '-' + rightNow.getMilliseconds()
        // Make Payment Using Bearer Token
        var data = JSON.stringify({
          "reference": req.body.reference,
          "subscriber": {
            "country": country,
            "currency": currency,
            "msisdn": req.body.number
          },
          "transaction": {
            "amount": req.body.amount,
            "country": country,
            "currency": currency,
            "id": lupiyaRefNo
          }
        });

        var config = {
          method: 'post',
          url: collectionPaymentsUrl,
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'X-Country': country,
            'X-Currency': currency,
            'Authorization': `Bearer  ${response.data.access_token}`
          },
          data: data
        };

        axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
            res.json(response.data)
          })
          .catch(function (error) {
            console.log(error);
            res.json(error.response.data)
          });
      })
      .catch(function (error) {
        console.log(error)
        res.json(error.response.data)
      });
  }
})

// Airtel Money Collection Refund Using Airtel Money ID
app.post("/airtel/collection/refund/:airtelMoneyId", (req, res) => {
  var data = JSON.stringify({
    "client_id": client_id,
    "client_secret": client_secret,
    "grant_type": "client_credentials"
  });

  var config = {
    method: 'post',
    url: tokenUrl,
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*'
    },
    data: data
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data))
      // Collection Refund Request Using Bearer Token
      var data = JSON.stringify({
        "transaction": {
          "airtel_money_id": req.params.airtelMoneyId
        }
      });

      var config = {
        method: 'post',
        url: collectionRefundUrl,
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'X-Country': country,
          'X-Currency': currency,
          'Authorization': `Bearer  ${response.data.access_token}`
        },
        data: data
      };

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          res.json(response.data)
        })
        .catch(function (error) {
          console.log(error)
          res.json(error.response.data)
        });
    })
    .catch(function (error) {
      console.log(error)
      res.json(error.response.data)
    });
})

// Airtel Money Collection Payment Txn Enquiry Using Transaction ID
app.get("/airtel/collection/txnEnquiry/:transactionId", (req, res) => {
  var data = JSON.stringify({
    "client_id": client_id,
    "client_secret": client_secret,
    "grant_type": "client_credentials"
  });

  var config = {
    method: 'post',
    url: tokenUrl,
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*'
    },
    data: data
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data))
      // Collection Payment TxnEnquiry Request Using Bearer Token
      var config = {
        method: 'get',
        url: collectionTxnEnquiry + req.params.transactionId,
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'X-Country': country,
          'X-Currency': currency,
          'Authorization': `Bearer  ${response.data.access_token}`
        }
      };

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          res.json(response.data)
        })
        .catch(function (error) {
          console.log(error);
          res.json(error.response.data)
        });
    })
    .catch(function (error) {
      console.log(error)
      res.json(error.response.data)
    });
})

// Airtel Money Disbursement Payment API
app.post("/airtel/disbursement", (req, res) => {
  if (!req.body.amount || !req.body.number || !req.body.reference) {
    res.json({ "message": "Please provide all required inputs (amount, number and reference)" })
  } else {
    var data = JSON.stringify({
      "client_id": client_id,
      "client_secret": client_secret,
      "grant_type": "client_credentials"
    });

    var config = {
      method: 'post',
      url: tokenUrl,
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data))
        // Generate Unique Reference
        let rightNow = new Date()
        let lupiyaRefNo = "LPY" + rightNow.getFullYear() + '-' + (rightNow.getMonth() + 1) + '-' + rightNow.getDate() + '-' + rightNow.getSeconds() + '-' + rightNow.getMilliseconds()
        // PIN Encryption
        var fourDigitPIN = 1234
        var pubilc_key = `-----BEGIN PUBLIC KEY-----
        MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCkq3XbDI1s8Lu7SpUBP+bqOs/MC6PKWz
        6n/0UkqTiOZqKqaoZClI3BUDTrSIJsrN1Qx7ivBzsaAYfsB0CygSSWay4iyUcnMVEDrNVO
        JwtWvHxpyWJC5RfKBrweW9b8klFa/CfKRtkK730apy0Kxjg+7fF0tB4O3Ic9Gxuv4pFkbQ
        IDAQAB
        -----END PUBLIC KEY-----`
        // Encrypt with the public key
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(pubilc_key);
        var encryptedPIN = encrypt.encrypt(fourDigitPIN)
        console.log("encryptedPIN", encryptedPIN)

        // Make Disbursement Payment Using Bearer Token
        var data = JSON.stringify({
          "payee": {
            "msisdn": req.body.number
          },
          "reference": req.body.reference,
          "pin": encryptedPIN,
          "transaction": {
            "amount": req.body.amount,
            "id": lupiyaRefNo
          }
        });

        var config = {
          method: 'post',
          url: disbursementPaymentsUrl,
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'X-Country': country,
            'X-Currency': currency,
            'Authorization': `Bearer  ${response.data.access_token}`
          },
          data: data
        };

        axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
            res.json(response.data)
          })
          .catch(function (error) {
            console.log(error);
            res.json(error.response.data)
          });
      })
      .catch(function (error) {
        console.log(error)
        res.json(error.response.data)
      });
  }
})

// Airtel Money Disbursement Refund Using Airtel Money ID
app.post("/airtel/disbursement/refund/:airtelMoneyId", (req, res) => {
  var data = JSON.stringify({
    "client_id": client_id,
    "client_secret": client_secret,
    "grant_type": "client_credentials"
  });

  var config = {
    method: 'post',
    url: tokenUrl,
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*'
    },
    data: data
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data))
      // PIN Encryption
      var fourDigitPIN = 1234
      var pubilc_key = `-----BEGIN PUBLIC KEY-----
      MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCkq3XbDI1s8Lu7SpUBP+bqOs/MC6PKWz
      6n/0UkqTiOZqKqaoZClI3BUDTrSIJsrN1Qx7ivBzsaAYfsB0CygSSWay4iyUcnMVEDrNVO
      JwtWvHxpyWJC5RfKBrweW9b8klFa/CfKRtkK730apy0Kxjg+7fF0tB4O3Ic9Gxuv4pFkbQ
      IDAQAB
      -----END PUBLIC KEY-----`
      // Encrypt with the public key
      var encrypt = new JSEncrypt();
      encrypt.setPublicKey(pubilc_key);
      var encryptedPIN = encrypt.encrypt(fourDigitPIN)
      console.log("encryptedPIN", encryptedPIN)

      // Disbursement Refund Request Using Bearer Token
      var data = JSON.stringify({
        "transaction": {
          "airtel_money_id": req.params.airtelMoneyId
        },
        "pin": encryptedPIN
      });

      var config = {
        method: 'post',
        url: disbursementRefundUrl,
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'X-Country': country,
          'X-Currency': currency,
          'Authorization': `Bearer  ${response.data.access_token}`
        },
        data: data
      };

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data))
          res.json(response.data)
        })
        .catch(function (error) {
          console.log(error)
          res.json(error.response.data)
        });
    })
    .catch(function (error) {
      console.log(error)
      res.json(error.response.data)
    });
})

// Airtel Money Disbursement Payment Txn Enquiry Using Transaction ID
app.get("/airtel/disbursement/txnEnquiry/:transactionId", (req, res) => {
  var data = JSON.stringify({
    "client_id": client_id,
    "client_secret": client_secret,
    "grant_type": "client_credentials"
  });

  var config = {
    method: 'post',
    url: tokenUrl,
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*'
    },
    data: data
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data))
      // Disbursement Payment TxnEnquiry Request Using Bearer Token
      var config = {
        method: 'get',
        url: disbursementTxnEnquiry + req.params.transactionId,
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'X-Country': country,
          'X-Currency': currency,
          'Authorization': `Bearer  ${response.data.access_token}`
        }
      };

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          res.json(response.data)
        })
        .catch(function (error) {
          console.log(error);
          res.json(error.response.data)
        });
    })
    .catch(function (error) {
      console.log(error)
      res.json(error.response.data)
    });
})

app.listen(PORT, function () {
  console.log(`Express server listening on port ${PORT}`)
})