const importService =
    require("../services/importService");

const importRace = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await importService.importRace(
                req.body
            );

        res.status(202).json(result);

    } catch (error) {

        next(error);

    }
};

module.exports = {
    importRace
};