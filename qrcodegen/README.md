# Intro

This is a service to generate QRCode in SVG format.
Amount of parameters are reduced to the min, basic caching is in place.



# API Spec

Interactive OpenAPI explorer is available by http://<host>:<port>/explorer link

## Generate QRCode
POST /qrcode - generates qrcode by the params provided

QRCode spec object is passed in request body. Here are the fields:

| Field                | Required? | Samples            | Description                   |
| -------------------- | --------- | ------------------ | ----------------------------- |
| value                | y         | "www.google.com"   | Value to encode into QR       |
| errorCorrectionLevel | y         | 'L', 'M', 'Q', 'H' | QRCode capacity               |
| margin               | y         | 1                  | Quiet zone 1..4               |
| foreground           |           | '#000000'          | foreground color for the code |
| background           |           | '#ffffff'          | backround color for the code  |



# Thanks

[LoopBack](http://loopback.io/)
[QRCode](https://github.com/soldair/node-qrcode)
