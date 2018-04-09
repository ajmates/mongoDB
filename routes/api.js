module.exports = (app, db, cheerio, request) => {
    app.get("/api/scrape", function(req, res) {
        request("https://www.reddit.com/r/FloridaMan", function(error, response, html) {

var $ = cheerio.load(html);
var result = {};

$("div.link").each(function(i, element){
    if (i > 1) {
        result.title = $(this)
        .find("a.title")
        .text();
        result.link = $(this)
        .children("a.thumbnail")
        .attr("href");
        result.thumbnail = $(this)
        .find("a.thumbnail img")
        .attr("src");

console.log(result);

db.Headline.create(result)
.then(function(dbHeadline) {
console.log(dbHeadline);
})
                    
.catch(function(err) {
    return res.json(err);
        });
    }
});

res.redirect('/');
     });
});

app.get("/api/saved", function(req, res) {
    db.Headline.find({ 'saved': true })
    .then(function(dbHeadline) {
        res.json(dbHeadline);
    })
    .catch(function(err) {
        res.json(err);
        });
    });

app.get("/api/headlines/:id", function(req, res){
    db.Note.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbHeadline){
        res.json(dbHeadline);
    }).catch(function(err){
        res.json(err);
    })
})

app.post("/api/headlines/:id", function(req, res){
    db.Note.create(req.body)
    .then(function(dbNote){
return db.Headline.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote } })
    .then(function(dbHeadline){
        res.json(dbHeadline);
});
    }).catch(function(err){
        res.json(err);
    })
});

app.post("/api/headlines/save/:id", function(req, res){
    db.Headline.findOneAndUpdate({ _id: req.params.id }, { saved: true })
    .then(function(dbReturn){
        res.redirect("/");
    });
});

app.post("/api/headlines/unsave/:id", function(req, res){
    db.Headline.findOneAndUpdate({ _id: req.params.id }, { saved: false })
    .then(function(dbReturn){
        res.redirect("/saved");
    });
});


}