require("dotenv").config();

const jobClient =
    require("../clients/jobClient");

async function main() {

    try {

        const result =
            await jobClient.importRace({

                raceName: "Monaco GP"

            });

        console.log(result);

    } catch (err) {

        console.error(err.response?.data || err.message);

    }

}

main();