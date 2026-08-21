const importDrivers = async (req, res, next) => {

    try {

        const { raceName } = req.body;

        if (!raceName) {

            return res.status(400).json({
                success: false,
                message: "raceName is required",
            });

        }

        // Temporary implementation.
        // Actual F1 data import will be added next.

        res.status(200).json({

            success: true,

            message: "Driver import processed",

            data: {
                raceName,
            },

        });

    } catch (error) {

        next(error);

    }

};

module.exports = {
    importDrivers,
};