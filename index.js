import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
// import { error } from "console";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

async function fetchCryptoTicker() {
    const url = "https://blockchain.info/ticker";
    const response = await axios.get(url);
    return response.data;
}

app.get("/", (req, res) => {
    const currencies = ["USD", "GBP", "NGN", "EUR"];
    res.render("index.ejs", {currencies});
});

app.post("/price", async (req , res) =>{
    try{
        const currency = req.body.currency.toUpperCase();
        const ticker = await fetchCryptoTicker();
        // const response = await axios.get("https://blockchain.info/ticker");
        // const data = response.data;

        if(!ticker[currency]){
            return res.render("result", {
                error: `Currency "${currency}" is not supported.`,
                currency: null,
                data: null
            });
        }

        res.render("result", {
            error: null,
            currency,
            data: ticker[currency]
        });


    } catch (error) {
        console.error("Error fetching price:", error);
        res.render("result", {
            error:  "Failed to fetch data. Try again later.",
        currency: null,
        data: null
        });
    }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});