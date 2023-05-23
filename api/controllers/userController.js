var mongoose = require('mongoose');
var User = require('../userModel');
var url = 'mongodb://127.0.0.1:27017/test';
const port = 3005;
var allUsers = [];
const fs = require('fs');
const bodyParser = require('body-parser');


function getData(url) {
    mongoose.connect(url);
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'Connection Error: '));
    db.once('open', async () => {
        let dataPromise = new Promise(async (resolve, reject) => {
            allUsers = [...await User.find()];
            // console.log(allUsers);


            if (allUsers.length > 0) {
                resolve("Ok")
                db.close();

            }
            else {
                db.close();
                reject("Error");
            }
        });
        dataPromise.then(
            function (value) {
                // console.log(value);
            },
            function (error) {
                // console.log(error);
            }
        )
    });
}
getData(url);
const getAllData = async (req, res) => {
    try {

        // console.log(req.query.start);
        // console.log(req.query.count);
        return res.status(200).json(allUsers.slice(req.query.start, req.query.count));
    } catch (error) {
        // console.log(error);
        return res.status(500);
    }

};
const editUser = async (req, res) => {

    switch (req.files) {

        case null:
            // console.log('no updates')
            mongoose.connect(url);
            var db = mongoose.connection;

            db.on('error', console.error.bind(console, 'Connection Error: '));
            db.once('open', async () => {
                var id = req.body._id;
                var updatedDoc = await User.findOneAndUpdate({ _id: id }, {
                    bname: req.body.bname,
                    company: req.body.company,
                    taxNo: req.body.taxNo,
                    PPhone: req.body.PPhone,
                    Location: req.body.Location,
                    Images: req.body.Images.split(','),
                    Logo: req.body.Logo,
                    PName: req.body.Pname,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                }, { new: true });
                if (updatedDoc) {
                    db.close()
                    res.sendStatus(200);
                    getData(url);
                }
                else {
                    // console.log('wl3na');
                    db.close();
                    res.sendStatus(500);
                }
            });
            break;
        default:


            let temp_user = allUsers.find(o => o._id.toString() === req.body._id.toString())
            //check if there is a logo Update
            if (req.files.Logo) {
                // console.log("there is a logo Update")
                const LogoFile = req.files.Logo
                let filepath = './imageUpload/'.concat(temp_user._id.toString());
                //delete old Logo
                fs.unlink(temp_user.Logo, (err) => {
                    if (err) {
                        throw err
                    }
                    // console.log('Logo Deleted');
                });
                //save new Logo
                let LogoDir = filepath + '/' + LogoFile.name;
                LogoFile.mv(LogoDir);
                temp_user.Logo = LogoDir;


            }
            //check if there is updates for Images
            var files = [];
            var fileKeys = Object.keys(req.files);
            fileKeys.forEach((key) => {
                if (key !== "Logo") {
                    files.push(req.files[key]);

                }
            });
            let images_path = [];
            if (files.length !== 0) {

                let filepath = './imageUpload/'.concat(temp_user._id.toString())

                files.forEach((element) => {
                    let imagePath = filepath + '/' + element.name;
                    images_path.push(imagePath);
                    element.mv(imagePath);
                });

            }
            //check for changes in Old Images
            // console.log(req.body.Images)
            let newArray = req.body.Images.split(',');
            // console.log(newArray)
            let difference = temp_user.Images.filter(x => !newArray.includes(x));
            // console.log(difference);
            difference.forEach((item) => {
                fs.unlink(item, (err) => {
                    if (err) {
                        throw err
                    }

                });
            })
            temp_user.Images = temp_user.Images.filter(x => newArray.includes(x));
            // console.log(images_path);
            temp_user.Images = temp_user.Images.concat(images_path);
            // console.log(temp_user.Images);
            mongoose.connect(url);
            var db = mongoose.connection;

            db.on('error', console.error.bind(console, 'Connection Error: '));
            db.once('open', async () => {
                var id = temp_user.id;
                var updatedDoc = await User.findOneAndUpdate({ _id: id }, temp_user, { new: true });
                if (updatedDoc) {
                    db.close()
                    res.sendStatus(200);
                    getData(url);
                }
                else {
                    // console.log('wl3na');
                    db.close();
                    res.sendStatus(500);
                }
            });



            break;
    }

};
const dataRegister = async (req, res) => {
    //console.log(req);

    //To be added Error Handling Across this endpoint
    const file = req.files.Logo;
    var files = [];
    var fileKeys = Object.keys(req.files);
    fileKeys.forEach((key) => {
        if (key === "Logo") {
            //pass

        }
        else {
            files.push(req.files[key]);
        }

    })
    // console.log(files);

    // console.log(file.name);
    mongoose.connect(url);
    var db = mongoose.connection;
    //console.log(req.data.bname);
    db.on('error', console.error.bind(console, 'Connection Error: '));
    db.once('open', function () {
        // console.log("Connection Successful!");



        var user = new User({
            bname: req.body.bname,
            company: req.body.company,
            taxNo: req.body.taxNo,
            Pname: req.body.PName,
            PPhone: req.body.PPhone,
            Location: req.body.Location,
            StartDate: req.body.startDate,
            EndDate: req.body.EndDate

        });

        user.save().then(() => {

            // console.log("done")
            User.find(user).then(async (docs) => {
                var doc = docs[0];
                var id = docs[0]._id.toString();
                // console.log(docs[0]._id.toString());
                filepath = './imageUpload/'.concat(id.toString())
                fs.mkdir(filepath, async (err) => {
                    if (err) {
                        // console.log(err);
                        db.close();
                    }
                    else {
                        // console.log('new Directory Created');
                        LogoDir = filepath + '/' + file.name;
                        file.mv(LogoDir);
                        images_path = [];
                        files.forEach((element) => {
                            let imagePath = filepath + '/' + element.name;
                            images_path.push(imagePath);
                            element.mv(imagePath);
                        });


                        user.Logo = LogoDir;
                        user.Images = images_path;
                        await user.save();
                    }

                    db.close();
                    getData(url);
                })

            })

        }).catch(function (error) {
            // console.log(error);
            db.close();
        });
    });

    res.sendStatus(200);
};
const deleteUser = async (req, res) => {
    // console.log(req.body.id);
    mongoose.connect(url);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection Error: '));
    db.once('open', async () => {
        let id = req.body.id;
        const deletedDoc = await User.findByIdAndDelete({ _id: id })
        if (deletedDoc) {
            db.close()
            res.sendStatus(200);
            getData(url);
        }
        else {
            // console.log('wl3na');
            db.close();
            res.sendStatus(500);
        }



    })

};
const getUser = async (req, res) => {
    console.log(req.query.id);
    let temp_user = allUsers.find(o => o._id.toString() === req.query.id.toString());
    if (temp_user) {
        return res.status(200).json(temp_user);
    }

}
module.exports = {
    getAllData,
    editUser,
    deleteUser,
    dataRegister,
    getData,
    getUser
}