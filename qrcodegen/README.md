# Intro

This is a service to generate QRCode in SVG format.



# API Spec

Interactive OpenAPI explorer is available by http://<host>:<port>/explorer link

GET /ping - this method is just a stub to check the instance status.
GET /qrcode - returns SVG for reference string "www.google.com" basically for
  test purposes.

POST /qrcode - generates qrcode by the params provided




# Thanks

[LoopBack](http://loopback.io/)
[QRCode](https://github.com/soldair/node-qrcode)
