  
let app = require("express")();
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
mongoose.promise = global.Promise;
const mongooseDbOption = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
let url = "mongodb://localhost:27017/meanstack";
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.connect(url, mongooseDbOption);

let db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => {

    let CourseSchema = mongoose.Schema({
        _id : Number,
        name : String, 
        desc: String, 
        cost: Number
    });

    let Course = mongoose.model("", CourseSchema, "Course")

    app.get("/", (req, res) => {
        res.sendFile(__dirname + "/index.html");
    })
    
    app.get("/addCourse", (req, res) => {
        res.sendFile(__dirname + "/addCourses.html");
    })
    
    app.post("/addCourse", (req, res) => {
        let course = new Course(req.body);
        course.save((err, result) => {
            if(!err) {
                console.log("Record Inserted " + result);
            }
            else {
                console.log(err);
            }
        })
        res.sendFile(__dirname + "/addCourses.html");
    })

    app.get("/deleteCourse", (req, res) => {
        res.sendFile(__dirname + "/deleteCourse.html");
    })
    
    app.post("/deleteCourse", (req, res) => {
        console.log(req.body._id);
        Course.deleteOne({_id: req.body._id}, (err, result) => {
            if(!err) {
                if(result.deletedCount > 0) {
                    console.log(result)
                } else {
                    console.log("Record Not Found")
                }
            }
        })
        res.sendFile(__dirname + "/deleteCourse.html");
    })

    app.get("/updateCourse", (req, res) => {
        res.sendFile(__dirname + "/updateCourse.html");
    })
    
    app.post("/updateCourse", (req, res) => {
        Course.updateOne({_id: req.body._id}, {$set: {cost: req.body.cost}}, (err, result) => {
            if(!err) {
                if(result.nModified > 0) {
                    console.log("Record Updated")
                } else {
                    console.log("Record Not Found")
                }
            }
        })
        res.sendFile(__dirname + "/updateCourse.html");
    })

    app.get("/showCourses", (req, res) => {
        let docs = [];
        Course.find({}, (err, result) => {
            if(!err) {
                result.forEach(doc => {
                    docs.push(doc);
                })

                let body = `
                    <h2 style="text-align: center;">All of the courses available are listed below</h2>
                `;
                if(docs != []) {
                    body += printCourses(docs);
                }
                else {
                    body += `
                        <p style="text-align: center;"></p>
                        <a href="./"><input type="button" value="Back to Home"></a>
                    `;
                }

                res.send(body);
            }
        })
    })
})

function printCourses(docs) {
    let table = `
        <table border="1" style="margin-left: 40%;">
            <tr>
                <th>Course ID</th>
                <th>Course Name</th>
                <th>Course Description</th>
                <th>Course Cost</th>
            </tr>
    `;
    docs.forEach(doc => {
        table += `
            <tr>
                <th>${doc._id}</th>
                <th>${doc.name}</th>
                <th>${doc.desc}</th>
                <th>${doc.cost}</th>
            </tr>
        `;
    })

    table += `
        </table>
        <a href="./"><input type="button" value="Home"></a>
    `;

    return table;
}

app.listen(9090, () => console.log("Server running..."));