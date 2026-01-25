const { client, fromNumber } = require("../config/twilio");

const makeCall = async (to, patientName) => {
  try {
    await client.calls.create({
      to,
      from: fromNumber,
      twiml: `
        <Response>
          <Say voice="alice">
            Emergency from ICU.
            Attender of patient ${patientName},
            please come immediately.
          </Say>
        </Response>
      `
    });
    console.log("Calling:", to);
  } catch (err) {
    console.error("Call failed:", err.message);
  }
};

module.exports = makeCall;
