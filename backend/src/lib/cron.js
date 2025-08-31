import cron from "cron";
import https from "https";


{/*cron structure: min, hour, day of the month, month,day of the week */}
const job = new cron.CronJob("*/14 * * * *", function() {
    https.get(process.env.API_URL , (res)=>{
        if(res.statusCode == 200) console.log("GET request sent successfully");
        else console.log("GET request failed", res.statusCode);
    }).on("error",(err) => console.log("Error while sending request",err));
});

export default job;