const axios = require("axios");

const DRIVER_SERVICE_URL =
    process.env.DRIVER_SERVICE_URL;

const INTERNAL_SERVICE_KEY =
    process.env.INTERNAL_SERVICE_KEY;

async function importDrivers(payload) {

    const response = await axios.post(

        `${DRIVER_SERVICE_URL}/internal/drivers/import`,

        payload,

        {
            headers: {
                "X-Service-Key":
                    INTERNAL_SERVICE_KEY,
            },
        }

    );

    return response.data;

}

module.exports = {
    importDrivers,
};