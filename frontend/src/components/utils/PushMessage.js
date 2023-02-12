import * as PushAPI from "@pushprotocol/restapi";
import { providers } from "ethers";
import { arcanaProvider } from "../..";
import * as ethers from "ethers";

const PK = "0x22d9c869a875c9f0b7ef0f0fa1b47405e1c5a01fc9847587ce9f9903576a8085";

const sendNotification = async (recipient, title, body) => {
    // get the end user
    const signer = new ethers.Wallet(PK);
    try {
        const apiResponse = await PushAPI.payloads.sendNotification({
            signer,
            type: 3, // target
            identityType: 2, // direct payload
            notification: {
                title: title,
                body: body,
            },
            payload: {
                title: title,
                body: body,
            },
            recipients: `eip155:5:${recipient}`, // recipient address
            channel: "eip155:5:0x91B1b9CfeC94411863A2390d0a0aB3Dd1e6d0199", // your channel address
            env: "staging",
        });

        // apiResponse?.status === 204, if sent successfully!
        console.log("API repsonse: ", apiResponse);
    } catch (err) {
        console.error("Error: ", err);
    }
};
export default sendNotification;
