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

const Key = "api key"; //your custom key

app.get("/prompt", async (req, res) => {
  const ipInfo = getIP(req);
  const ip = ipInfo.clientIp;
  const { apiKey } = req.query;
  if (!apiKey || apiKey !== Key) {
    res.status(401).json({ error: "Invalid API key" });
  } else {
    try {
      const { imageUrl } = req.query;
      if (!imageUrl) {
        return res.json({ error: "Provide an image URL" });
      }

      const output = await replicate.run(
        "methexis-inc/img2prompt:50adaf2d3ad20a6f911a8a9e3ccf777b263b8596fbd2c8fc26e8888f8a0edbb5",
        {
          input: {
            image: imageUrl,
          },
        }
      );

      return res.json(output);
    } catch (error) {
      console.log(`Error generating prompt:\n${error}`);
  res.status(500).json({ error: "Failed to generate prompt" });
    }
  }     
     });     
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
