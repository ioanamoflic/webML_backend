const { Datastore } = require('@google-cloud/datastore');

const datastore = new Datastore({
    projectId: 'swift-reef-334312',
    keyFilename: 'datastore-credential.json'
});


/* path: https://us-central1-swift-reef-334312.cloudfunctions.net/createSchedule */

exports.createSchedule = async (req, res) => {
    try {
        const taskKey = datastore.key('Schedule');
        const entity = {
            key: taskKey,
            data: [
                {
                    name: 'start_date',
                    value: req.body.start_date
                },
                {
                    name: 'end_date',
                    value: req.body.end_date,
                },

            ],
        };

        await datastore.save(entity);
        res.status(200).send("Added");
    }
    catch (err) {
        res.status(500).send(err);
    }
}


/* path: https://us-central1-swift-reef-334312.cloudfunctions.net/getSchedule */

exports.getSchedule = async (req, res) => {
    try {
        const query = datastore.createQuery('Schedule');
        const [dates] = await datastore.runQuery(query);

        res.status(200).send(dates);
    } catch (err) {
        res.status(500).send(err);
    }
}
