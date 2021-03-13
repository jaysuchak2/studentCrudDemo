var express = require('express');
var router = express.Router();
const Multer = require('multer');
const Path = require('path');
const fs = require("fs");
const FsExtra = require('fs-extra');
const {
  v4: uuid_v4
} = require('uuid');


//set path and change file name for image upload
let storage = Multer.diskStorage({
  destination: function (req, file, callback) {
    FsExtra.mkdirsSync('./public/uploads/');
    FsExtra.mkdirsSync('./public/uploads/user-avatar/');
    callback(null, './public/uploads/user-avatar/');
  },
  filename: function (req, file, callback) {
    let userImage = uuid_v4();
    callback(null, userImage + Path.extname(file.originalname.toLocaleLowerCase()));
  }
});

// image upload config
let upload = Multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: function (req, file, cb) {
    let filetype = ['.jpeg', '.png', '.jpg'];
    if (filetype.indexOf(Path.extname(file.originalname).toLocaleLowerCase()) < '0') {
      return cb(new Error('File must be jpg, jpeg and png.'))
    }
    cb(null, true)
  }
}).single('profilePhoto');


/* GET users listing. */
router.get('/list', async function (req, res, next) {

  var perPage = 5;
  var page = req.query.page ? (req.query.page * 1) : 1;
  let count = await db.models.student.countDocuments();
  let students = await db.models.student.find().lean().skip((perPage * page) - perPage)
    .limit(perPage);

  return res.render('students/list', {
    pagination: {
      page,
      limit: perPage,
      totalRows: count
    },
    title: 'Student',
    students,
    layout: "default"
  });
});

// router.post('/list', async function (req, res, next) {
//   let students = await db.models.student.find().lean();
//   var perPage = 2;
//   var page = req.body.page || 1;
//   let count = await db.models.student.countDocuments();
//   console.log(page);
//   console.log(Math.ceil(count / perPage));
//   let students = await db.models.student.find().lean().skip((perPage * page) - perPage)
//     .limit(perPage);
//   return res.render('students/list', {
//     pagination: {
//       page,
//       limit: perPage,
//       totalRows: Math.ceil(count / perPage)
//     },
//     title: 'Student',
//     students,
//     layout: "default"
//   });
// });


/* GET users listing. */
router.get('/:id', async function (req, res, next) {
  try {

    let student = await db.models.student.findOne({
      _id: req.params.id
    }).lean();
    res.send({
      student
    });
  } catch (error) {
    res.send({
      success: false,
      error
    });
  }
});
/* Add users. */
router.post('/add', async function (req, res, next) {
  try {
    upload(req, res, async function (err) {
      if (err) {
        res.send({
          'type': "error",
          'message': err.message
        });
      } else {
        let userData = req.body;
        if (req.file && req.file.filename) {
          userData['profilePhoto'] = req.file.filename;
        }
        console.log(userData);
        // Update user profile details in the database
        await db.models.student.create(userData);
        // Update user session
        res.send({
          'type': "success",
          'message': "Student Added successfully"
        });
      }
    });
  } catch (error) {
    res.render('students/list', {
      title: 'Student',
      layout: "default"
    });
  }
});

/* Update users. */
router.put('/:id', async function (req, res, next) {
  try {
    upload(req, res, async function (err) {
      if (err) {
        console.error(err);
        res.send({
          'type': "error",
          'message': err.message
        });
      } else {
        let userData = req.body;
        console.log(req.file);
        if (req.file && req.file.filename) {
          userData['profilePhoto'] = req.file.filename;
        }
        console.log(userData);
        // Update user profile details in the database
        let student = await db.models.student.findOne({
          _id: req.params.id
        }).lean();
        await db.models.student.updateOne({
          _id: student._id
        }, userData);
        // Update user session
        res.send({
          'type': "success",
          student,
          message: "Student update successfully"
        });
      }
    });
  } catch (error) {
    res.render('students/list', {
      title: 'Student',
      layout: "default"
    });
  }
});


/* Delete users. */
router.delete('/deleteMany', async function (req, res, next) {
  try {
    // Update user profile details in the database
    let students = await db.models.student.find({
      _id: {
        $in: req.body
      }
    }).lean();
    for (const student of students) {
      if (student.profilePhoto)
        await fs.unlinkSync(Path.join(__dirname, "../public/uploads/user-avatar/", student.profilePhoto));
    }
    await db.models.student.deleteMany({
      _id: {
        $in: req.body
      }
    }).lean();

    // Update user session
    res.send({
      'type': "success",
      message: "Student Deleted Successfully"
    });
  } catch (error) {
    console.error(error);
    res.send({
      'type': "error",
      message: error.message
    });
  }
});


/* Delete user. */
router.delete('/:id', async function (req, res, next) {
  try {
    // Update user profile details in the database
    let student = await db.models.student.findOne({
      _id: req.params.id
    }).lean();
    if (student.profilePhoto)
      await fs.unlinkSync(Path.join(__dirname, "../public/uploads/user-avatar/", student.profilePhoto));
    await db.models.student.deleteOne({
      _id: req.params.id
    }).lean();

    // Update user session
    res.send({
      'type': "success",
      student,
      message: "Student Deleted Successfully"
    });
  } catch (error) {
    res.send({
      'type': "error",
      message: error.message
    });
  }
});

module.exports = router;