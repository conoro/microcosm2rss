var request = require('request'); // for fetching the feed

var RSS = require('rss');

module.exports.microcosm = (event, context, callback) => {
    /* lets create an rss feed */
    var feed = new RSS({
        title: 'Microcosm2RSS',
        description: 'Return latest posts in a Microcosm Forum as an RSS feed',
        feed_url: 'http://example.com/rss.xml',
        site_url: 'http://example.com',
        image_url: 'http://example.com/icon.png',
        docs: 'http://example.com/rss/docs.html',
        managingEditor: 'conor@conoroneill.com',
        webMaster: 'conor@conoroneill.com',
        copyright: '2017 Conor ONeill',
        language: 'en',
        pubDate: 'Nov 18, 2017 08:00:00 GMT',
        ttl: '60',
    });

    console.log(event);

    // e.g.  https://espruino.microco.sm/api/v1/microcosms/557

    siteURL = event.query.site;
    microcosmID = event.query.microcosm;
    console.log(siteURL);
    console.log(microcosmID);

    request(siteURL + "/api/v1/microcosms/" + microcosmID, { json: true }, function (error, response, body) {
        console.log('error:', error);

        for (var i = 0; i < body.data.items.items.length; i++) {
            var topic = body.data.items.items[i];
            feed.item({
                title: topic.item.title,
                description: topic.item.title,
                url: siteURL + "/conversations/" + topic.item.id, // link to the item
                author: topic.item.meta.createdBy.profileName + "@example.com", // optional - defaults to feed author property
                date: topic.item.meta.created // any format that js Date can parse.
            });

        }

        feed.title = body.data.title;
        feed.description = body.data.description;
        feed.site_url = process.env.MICROCOSM_URL;
        feed.image_url = body.data.logoUrl;

        var xml = feed.xml();
        context.succeed(xml);

    });
};