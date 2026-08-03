const validateDriver = (
    req,
    res,
    next
) => {

    const {
        driverNumber,
        fullName,
        abbreviation,
        team
    } = req.body;

    if (
        !driverNumber ||
        !fullName ||
        !abbreviation ||
        !team
    ) {

        return res.status(400).json({
            success: false,
            message:
                "driverNumber, fullName, abbreviation and team are required"
        });

    }

    next();
};

module.exports = validateDriver;