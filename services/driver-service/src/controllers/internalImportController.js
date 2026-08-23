const driverImportService =
    require("../services/driverImportService");

const importDrivers = async (
    req,
    res,
    next
) => {

    try {

        const season =
            Number(req.body.season) || 2026;

        const result =
            await driverImportService.importDrivers(
                season
            );

        res.status(200).json({

            success: true,

            message:
                "Drivers imported successfully",

            data: result

        });

    } catch (error) {

        next(error);

    }

};

module.exports = {
    importDrivers
};