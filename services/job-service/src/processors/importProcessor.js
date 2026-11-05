
const jobPersistenceService =
    require("../services/jobPersistenceService");

const logger = require("../config/logger");

const driverClient =
    require("../clients/driverClient");

const {
    acquireLock,
    releaseLock,
    extendLock,
} = require("../utils/distributedLock");

const LOCK_TTL = 30000;
const LOCK_RENEWAL_INTERVAL = 10000;

async function processImport(job) {
    const season = Number(job.data.season) || 2026;

    const resource = `season-import:${season}`;

    const lock = await acquireLock(resource, LOCK_TTL);

    if (!lock) {
        throw new Error(
            `Season import already in progress: ${season}`
        );
    }

    logger.info(
        `Distributed lock acquired for season ${season}`
    );

    let renewalInProgress = false;
    let lockLost = false;
    let renewalError = null;

    const renewalTimer = setInterval(async () => {
        if (renewalInProgress || lockLost) return;

        renewalInProgress = true;

        try {
            const extended = await extendLock(lock);

            if (!extended) {
                lockLost = true;
                renewalError = new Error(
                    `Lost distributed lock for season ${season}`
                );

                logger.error(renewalError.message);
            }
        } catch (error) {
            lockLost = true;
            renewalError = error;

            logger.error(
                error,
                `Failed to renew lock for season ${season}`
            );
        } finally {
            renewalInProgress = false;
        }
    }, LOCK_RENEWAL_INTERVAL);

    renewalTimer.unref();

    let dbJob;

    try {
        dbJob = await jobPersistenceService.createJob(job);

        logger.info(`Processing Job ${job.id}`);

        await driverClient.importDrivers({
            ...job.data,
            season,
        });

        if (lockLost) {
            throw renewalError || new Error(
                `Distributed lock lost during season import: ${season}`
            );
        }

        await jobPersistenceService.markCompleted(dbJob);

    } catch (error) {
        if (dbJob) {
            await jobPersistenceService.markFailed(
                dbJob,
                error
            );
        }

        throw error;

    } finally {
        clearInterval(renewalTimer);

        while (renewalInProgress) {
            await new Promise(resolve =>
                setTimeout(resolve, 50)
            );
        }

        const released = await releaseLock(lock);

        if (released) {
            logger.info(
                `Distributed lock released for season ${season}`
            );
        } else {
            logger.warn(
                `Lock ownership lost or lock expired for season ${season}`
            );
        }
    }
}

module.exports = {
    processImport,
};

