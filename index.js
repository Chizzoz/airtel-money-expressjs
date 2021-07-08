const express = require("express")
const axios = require("axios")

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
  if (!req.body.amount || !req.body.number || !req.body.payerMessage || !req.body.payeeNote) {
    res.json({ "message": "Please provide all required inputs (amount, number, payerMessage and payeeNote)" })
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
          "reference": "Testing transaction",
          "subscriber": {
            "country": country,
            "currency": currency,
            "msisdn": 977123456
          },
          "transaction": {
            "amount": 1000,
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
app.get("/airtel/collection/refund/:airtelMoneyId", (req, res) => {
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

app.listen(PORT, function () {
  console.log(`Express server listening on port ${PORT}`)
})