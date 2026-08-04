const jobService =
    require("../services/jobService");

const importRace = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await jobService.importRace(
                req.body
            );

        res.status(200).json(result);

    } catch (err) {

        next(err);

    }

};

module.exports = {

    importRace

};