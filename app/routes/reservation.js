const fs = require('fs');

var db = require('../../config/db');

module.exports = {
  init: () => {},

  addStagePage: (req, res) => {
    res.render('add-stage.ejs', {
      title: 'Welcome to Fnoon | Add a new Reservation',
      message: '',
    });
  },

  addStage: (req, res) => {
    let position = req.body.position;
    let teachersQuery =
      "SELECT * FROM `teachers` WHERE `Stage` = '" +
      position +
      "' ORDER BY id ASC";

    // if (position === undefined) {
    // let Stage = req.body.Stage;
    // let teacher = req.body.teacher;
    // let year = req.body.year;
    // let type = req.body.type;
    // teachersQuery = "SELECT * FROM `groups` WHERE `stage` = '" + Stage + "' and `year` = '" + year + "' and `type` = '" + type + "' and `teacher_name` = '" + teacher + "' ORDER BY id ASC";

    // db.query(teachersQuery, (err, result) => {
    //     if (err) {
    //         res.redirect('/');
    //     }

    //     req.session.Stage = Stage;
    //     req.session.teacher = teacher;
    //     req.session.year = year;
    //     req.session.type = type;

    //     req.session.groups = result;

    //     // res.redirect("/reservation");
    //     res.render('add-reservation.ejs', {
    //         title: "Welcome to Fnoon | Add a new Reservation"
    //         , groups: result
    //         , message: ''
    //     });
    // });
    // } else {
    db.query(teachersQuery, (err, result) => {
      if (err) {
        res.redirect('/');
      }
      res.render('add-teacher.ejs', {
        title: 'Welcome to Fnoon | Add a new Reservation',
        position: position,
        teachers: result,
        message: '',
      });
    });
    // }
  },

  addTeacherPage: (req, res) => {
    res.render('add-teacher.ejs', {
      title: 'Welcome to Fnoon | Add a new Reservation',
      message: '',
    });
  },

  addTeacher: (req, res) => {
    let Stage = req.body.Stage;
    let teacher = req.body.teacher;
    let year = req.body.year;
    let type = req.body.type;
    teachersQuery =
      "SELECT * FROM `groups` WHERE `stage` = '" +
      Stage +
      "' and `year` = '" +
      year +
      "' and `type` = '" +
      type +
      "' and `teacher_name` = '" +
      teacher +
      "' ORDER BY id ASC";

    db.query(teachersQuery, (err, result) => {
      if (err) {
        res.redirect('/');
      }

      req.session.Stage = Stage;
      req.session.teacher = teacher;
      req.session.year = year;
      req.session.type = type;

      res.render('add-reservation.ejs', {
        title: 'Welcome to Fnoon | Add a new Reservation',
        groups: result,
        message: '',
      });
    });
  },

  addReservationPage: (req, res) => {
    res.render('add-reservation.ejs', {
      title: 'Welcome to Fnoon | Add a new Reservation',
      message: '',
    });
  },

  addReservation: (req, res) => {
    // if (!req.files) {
    //     return res.status(400).send("No files were uploaded.");
    // }

    let message = '';
    var Stage = req.session.Stage;
    var teacher = req.session.teacher;
    var year = req.session.year;
    var type = req.session.type;
    let name = req.body.name;
    let number = req.body.number;
    let group = req.body.group;

    let price;
    let maxNumberOfStudent;

    let isValid = true;

    let groupQuery =
      "SELECT * FROM `groups` WHERE `stage` = '" +
      Stage +
      "' and `year` = '" +
      year +
      "' and `type` = '" +
      type +
      "' and `teacher_name` = '" +
      teacher +
      "' and `group_name` = '" +
      group +
      "' ORDER BY id ASC";

    let reservationQuery =
      "SELECT COUNT(*) FROM `reservations` WHERE `Stage` = '" +
      Stage +
      "' and `year` = '" +
      year +
      "' and `type` = '" +
      type +
      "' and `Teacher_name` = '" +
      teacher +
      "' and `Group` = '" +
      group +
      "' ORDER BY id ASC";

    db.query(groupQuery, (err, result2) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (result2.length === 1) {
        price = result2[0].price;
        maxNumberOfStudent = result2[0].num_student;
      }

      db.query(reservationQuery, (err, result3) => {
        if (err) {
          return res.status(500).send(err);
        }

        if (result3[0]['COUNT(*)'] >= maxNumberOfStudent) {
          isValid = false;
          message = 'هذه المجموعة مكتملة';
          res.render('add-stage.ejs', {
            message,
            title: 'Welcome to Fnoon | Add a new Reservation',
          });
        }

        // if (result.length > 0) {
        //     message = 'Username already exists';
        //     res.render('add-player.ejs', {
        //         message,
        //         title: "Welcome to Socka | Add a new player"
        //     });
        // } else {

        if (isValid) {
          let query =
            "INSERT INTO `reservations` (`student_name`, `student_phone`, `Teacher_name`, `Stage`, `year`, `Group`, `type`, `Price`, `amount`, `confirm`) VALUES ('" +
            name +
            "', '" +
            number +
            "', '" +
            teacher +
            "', '" +
            Stage +
            "', '" +
            year +
            "', '" +
            group +
            "', '" +
            type +
            "', '" +
            price +
            "', '" +
            0 +
            "', '" +
            0 +
            "')";

          // let query = "INSERT INTO `reservations` (confirm, amount, Price, type, Group, year, Stage, Teacher_name, student_phone, student_name) VALUES ('" +
          // name + "', '" + number + "', '" + teacher + "', '" + Stage + "', '" + year + "', '" + group + "', '" + type + "', '" + 50 + "', '" + 0 + "', '" + 0 + "')";
          db.query(query, (err, result) => {
            if (err) {
              return res.status(500).send(err);
            }
            // res.redirect('/');
            message = 'تــم الحجز بنجاح';
            res.render('add-stage.ejs', {
              message,
              title: 'Welcome to Fnoon | Add a new Reservation',
            });
          });
        }
      });
    });

    // }
  },
  editReservationPage: (req, res) => {
    let reservationId = req.params.id;
    let query =
      "SELECT * FROM `reservations` WHERE id = '" + reservationId + "' ";
    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      var Stage = result[0].Stage;
      var year = result[0].year;
      var type = result[0].type;
      var teacher = result[0].Teacher_name;
      var group = result[0].Group;

      let groupQuery =
        "SELECT * FROM `groups` WHERE `stage` = '" +
        Stage +
        "' and `year` = '" +
        year +
        "' and `type` = '" +
        type +
        "' and `teacher_name` = '" +
        teacher +
        "' and `group_name` = '" +
        group +
        "' ORDER BY id ASC";

      db.query(groupQuery, (err, result2) => {
        if (err) {
          return res.status(500).send(err);
        }

        res.render('edit-reservation.ejs', {
          title: 'Edit  Reservation',
          reservation: result[0],
          groupInfo: result2[0],
          message: '',
        });
      });
    });
  },

  displayReservationPage: (req, res) => {
    let reservationId = req.params.id;
    let query =
      "SELECT * FROM `reservations` WHERE id = '" + reservationId + "' ";
    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      var Stage = result[0].Stage;
      var year = result[0].year;
      var type = result[0].type;
      var teacher = result[0].Teacher_name;
      var group = result[0].Group;

      let groupQuery =
        "SELECT * FROM `groups` WHERE `stage` = '" +
        Stage +
        "' and `year` = '" +
        year +
        "' and `type` = '" +
        type +
        "' and `teacher_name` = '" +
        teacher +
        "' and `group_name` = '" +
        group +
        "' ORDER BY id ASC";

      db.query(groupQuery, (err, result2) => {
        if (err) {
          return res.status(500).send(err);
        }

        res.render('display-reservation.ejs', {
          title: 'Reservation',
          reservation: result[0],
          groupInfo: result2[0],
          message: '',
        });
      });
    });
  },

  editReservation: (req, res) => {
    let reservationId = req.params.id;
    let student_name = req.body.student_name;
    let student_phone = req.body.student_phone;
    let amount = req.body.amount;
    let confirm = req.body.confirm;

    // let query = "UPDATE `reservations` SET `student_name` = '" + student_name + "', `student_phone` = '" + student_phone + "', `Teacher_name` = '" + Teacher_name + "', `number` = '" + number + "' WHERE `players`.`id` = '" + reservationId + "'";
    let query =
      "UPDATE `reservations` SET `student_name` = '" +
      student_name +
      "', `student_phone` = '" +
      student_phone +
      "', `amount` = '" +
      amount +
      "', `confirm` = '" +
      confirm +
      "' WHERE `reservations`.`id` = '" +
      reservationId +
      "'";

    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.redirect('/display/' + reservationId);

      // res.redirect('/home');
    });
  },
  deleteReservation: (req, res) => {
    let reservationId = req.params.id;
    let deleteUserQuery =
      'DELETE FROM reservations WHERE id = "' + reservationId + '"';

    db.query(deleteUserQuery, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.redirect('/profile');
    });
  },
};
