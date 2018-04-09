module.exports = (app, db) => {

app.get('/', (req,res) => {
    db.Headline.find({ saved: false }).populate("note")
        .exec(function(err, dbHeadline){
            if (err) return handleError(err);
            console.log(dbHeadline);
            res.render("home", {activeHome: true, headlines: dbHeadline });
    });
})

app.get('/saved', (req,res)=> {
    db.Headline.find({ saved: true }).populate("note")
        .exec(function(err, dbHeadline){
            if (err) return handleError(err);
            res.render("saved", {activeSaved: true, headlines: dbHeadline })
    });
})

}