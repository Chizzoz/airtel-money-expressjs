# airtel-money-expressjs
Airtel Money Developer API ExpressJS Client

## Getting Started
After cloning or downloading this repo, run `npm install`.

Then `npm run start` to start the client API.

Visiting `http://localhost:3000/` should display; *Welcome to your Airtel Money API Client!*.

## Exposed Endpoints
1. Collection Payment
    POST - `http://localhost:3000/airtel/collection`

    Sample Payload
    ```
        {
            "amount": 1000,
            "number": 9999999999
            "reference": "Testing transaction"
        }
    ```
2. Collection Refund
    POST - `http://localhost:3000/airtel/collection/refund/{airtelMoneyId}`
3. Collection Payment Txn Enquiry
    GET - `http://localhost:3000/airtel/collection/txnEnquiry/{transactionId}`
4. Disbursement Payment
    POST - `http://localhost:3000/airtel/disbursement`

    Sample Payload
    ```
        {
            "amount": 1000,
            "number": 9999999999,
            "reference": "ABCD07026984141",
            "pin": 1234
        }
    ```
5. Collection Refund
    POST - `http://localhost:3000/airtel/disbursement/refund/{airtelMoneyId}`

    Sample Payload
    ```
        {
            "pin": 1234
        }
    ```
6. Collection Payment Txn Enquiry
    GET - `http://localhost:3000/airtel/collection/txnEnquiry/{transactionId}`