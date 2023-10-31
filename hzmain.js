const express = require("express");
const app = express();
const port = 8080;//you can choose any port
const axios = require("axios");
const fs = require("fs");
const getIP = require('ipware')().get_ip;
const Replicate = require("replicate");
const api_Key = process.env['REPLICATE_AUT_KEY']
 const replicate = new Replicate({
 auth: api_Key,
  });

  const Key = "api-key"; //your custom key

  const request = (query) => {
  return req.query[query];
  };

  const send = (data) => {
 return res.json(data);
  };

  const img2prompt = (url) => {
  try {
   const output = await replicate.run(
  "methexis-inc/img2prompt:50adaf2d3ad20a6f911a8a9e3ccf777b263b8596fbd2c8fc26e8888f8a0edbb5",
  {
  input: {
  image: url,
    },
  });

   return output;
  } catch (error) {
  console.log(`Error generating prompt:\n${error}`);
return { error: "Failed to generate prompt" };
  }
};

  app.get("/generate", async (req, res) => {
  const ipInfo = getIP(req);
  const ip = ipInfo.clientIp;
  const apiKey = request("apikey");
  if (!apiKey || apiKey !== Key) {
send({ error: "Invalid API key" });
  } else {
  try {
  const { imageUrl } = request("imageUrl");
    if (!imageUrl) {
    send({ error: "Provide an image URL" });
  }

const output = img2prompt(imageUrl);

send(output);
 } catch (error) {
send({ error: error });
  }
 }
});

  app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
