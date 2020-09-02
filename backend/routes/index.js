var express = require('express');
var router = express.Router();
var pool = require('../config/dbConfig');
var multer = require('multer');
const Schedule = require('node-schedule')

var _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: _storage });

// var date2 = new Date();
// // date.setDate(date.getDate());
// var hh = date2.getHours();
// var currentMM = date2.getMinutes();
// var nextMM = date.getMinutes() + 1;
// var dd = date.getDate();
// var mm = date.getMonth() + 1;
// var yyyy = date.getFullYear();
// var date = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + currentMM;
// var date_next = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + nextMM;


//메인화면
router.post('/main', function (req, res, next) {
  pool.getConnection((err, conn) => {
    if (err) {
      throw err;
    }
    var sql = "SELECT * FROM topic WHERE topicCompletionState = 0";
    conn.query(sql, (err, row) => {
      conn.release();
      if (err) {
        console.log(err);
      }
      if (row.length === 0) {
        res.send(300, {
          result: 0,
          msg: "failed"
        });
      } else {
        res.send(200, {
          result: 1,
          check: 0,
          data: row
        })
      }
    })
  })
});



// //주제목록불러오기
// router.get('/getTopicList', function (req, res) {
//   pool.getConnection((err, conn) => {
//     if (err) { console.log(err); }
//     else {
//       var getTopic = "SELECT * from topic WHERE topicCompletionState = 0"
//       conn.query(getTopic, (err, row) => {
//         if (err) { console.log(err); }
//         else {
//             res.send(row)
//         }
//       })
//     }
//   });
// });


//주제등록
router.post('/registerTopic', function (req, res) {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err); }
    else {
      var topicInsert = "INSERT INTO `topic`(`topicCode`, `topicName`, `topicCompletionState`, `userId`,`topicContents`) VALUES (?, ?, ?, ?,?)"
      conn.query(topicInsert, [req.body.topicCode, req.body.topicName, req.body.topicCompletionState, req.body.userId, req.body.topicContents], (err, result) => {
        conn.release()
        if (err) {
          throw err;
        } else {
          res.send(200, {
            result: 1
          })
        }
      })
    }
  });
});

//주제수정
router.post('/updateTopic/:topicCode', function (req, res, next) {
  var topicCode = req.params.topicCode;
  var postData = req.body;
  pool.getConnection((err, conn) => {
    if (err) {
      throw err;
    }
    var sql = `UPDATE topic SET topicName=?, topicCompletionState=?,topicContents = ? WHERE topicCode=?`;
    conn.query(sql, [postData.topicName, postData.topicCompletionState, postData.topicContents, topicCode], (err, row) => {
      conn.release();
      if (err) {
        throw err;
      }
      console.log(row);
      res.send(200, {
        result: 1
      })
    })
  })
})

//주제삭제
router.get('/deleteTopicItem/:topicCode', function (req, res, next) {
  var topicCode = req.params.topicCode;
  pool.getConnection((err, conn) => {
    if (err) {
      throw err;
    }
    var sql = "SELECT * FROM topic WHERE topicCode = ?";
    conn.query(sql, [topicCode], (err, row) => {
      if (err) {
        throw err;
      }
      var sql = "DELETE FROM topic WHERE topicCode = ?";
      conn.query(sql, [topicCode], function (err) {
        conn.release()
        if (err) {
          throw err;
        }
        res.send(200, {
          result: 1
        })
      });
    });
  })
});

//주제상세보기
router.get('/getTopicDetail/:topicCode', function (req, res, next) {
  var topicCode = req.params.topicCode;
  var data = {};
  pool.getConnection((err, conn) => {
    if (err) {
      throw err;
    }
    var sql = "SELECT * FROM topic,topicitem WHERE topic.topicCode = topicitem.topicCode AND topic.topicCode = ? order by topicItemCode asc";
    conn.query(sql, [topicCode], (err, row) => {
      conn.release();
      if (err) {
        throw err;
      }
      data = row;
      console.log(data);
      res.send(200, {
        result: 1,
        data: data
      })
    })
  })
})

//주제항목등록
router.post('/registerTopicItem', function (req, res) {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err); }
    else {
      var topicItemInsert = "INSERT INTO `topicitem` (`topicItemName`, `topicItemState`, `topicCode`,`topicItemDate`) VALUES (?, ?, ?, ?)"
      conn.query(topicItemInsert, [req.body.topicItemName, req.body.topicItemState, req.body.topicCode, req.body.topicItemDate], (err, result) => {
        conn.release()
        if (err) {
          throw err;
        } else {
          res.send(200, {
            result: 1
          })
        }
      })
    }
  });
});

//주제항목수정
router.post('/updateTopicItem/:topicItemCode', function (req, res, next) {
  var topicItemCode = req.params.topicItemCode;
  var postData = req.body;
  pool.getConnection((err, conn) => {
    if (err) {
      throw err;
    }
    var sql = `UPDATE topicitem SET topicItemName=?, topicItemState=? WHERE topicItemCode=?`;
    conn.query(sql, [postData.topicItemName, postData.topicItemState, topicItemCode], (err, row) => {
      conn.release();
      if (err) {
        throw err;
      }
      console.log(row);
      res.send(200, {
        result: 1
      })
    })
  })
})

//마이페이지(주제)
router.post('/mypage', function (req, res, next) {
  pool.getConnection((err, conn) => {
    if (err) {
      throw err;
    }
    var sql = "SELECT * FROM topic WHERE userId = ?";
    conn.query(sql, [req.body.userId], (err, row) => {
      conn.release();
      if (err) {
        bv
        throw err;
      }
      if (row.length === 0) {
        res.send(300, {
          result: 0,
          msg: "failed"
        });
      } else {
        res.send(200, {
          result: 1,
          check: 0,
          data: row
        })
      }
    })
  })
});

//마이페이지(글)
router.post('/mypage2', function (req, res, next) {
  pool.getConnection((err, conn) => {
    if (err) {
      throw err;
    }
    var sql = "SELECT * FROM topicitem,writing WHERE topicitem.topicItemCode = writing.topicItemCode AND writing.userId = ?";
    conn.query(sql, [req.body.userId], (err, row) => {
      conn.release();
      if (err) {
        bv
        throw err;
      }
      if (row.length === 0) {
        res.send(300, {
          result: 0,
          msg: "failed"
        });
      } else {
        res.send(200, {
          result: 1,
          check: 0,
          data: row
        })
      }
    })
  })
});

//주제 항목 글 목록
router.get('/writingList/:topicItemCode', function (req, res, next) {
  var topicItemCode = req.params.topicItemCode
  pool.getConnection((err, conn) => {
    if (err) {
      throw err;
    }
    var sql = "SELECT * FROM topicitem,writing WHERE topicitem.topicItemCode = writing.topicItemCode AND topicitem.topicItemCode = ?";
    conn.query(sql, [topicItemCode], (err, row) => {
      conn.release();
      if (err) {
        throw err;
      }
      if (row.length === 0) {
        res.send(300, {
          result: 0,
          msg: "failed"
        });
      } else {
        res.send(200, {
          result: 1,
          check: 0,
          data: row
        })
      }
    })
  })
});

// //주제 업데이트
// router.get('/autoUpdateTopicItem', function (req, res) {
//   pool.getConnection((err, conn) => {
//     var date = new Date();
//     // date.setDate(date.getDate());
//     var hh = date.getHours();
//     var currentMM = date.getMinutes();
// if (hh < 10) {
//   hh = '0' + hh
// }
// if (currentMM < 10) {
//   currentMM = '0' + currentMM
// }
//     var nextMM = date.getMinutes() + 1;
//     var dd = date.getDate();
//     var mm = date.getMonth() + 1;
//     var yyyy = date.getFullYear();
//     var date = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + currentMM;
//     var date_next = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + nextMM;
//     var time = 0;

//     if (err) { console.log(err); }
//     else {
//       var selectTopic = `select * from topicItem`
//       var autoUpdateTopic = `UPDATE topicItem SET topicItemState='1' WHERE topicItemDate='${yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + currentMM}'`
//       var changeState = `UPDATE topicItem SET topicItemState='0' WHERE topicItemState='1' AND topicItemDate<'${yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + currentMM + 5}'`
//       conn.query(selectTopic, (err, row) => {
//         if (err) { console.log(err); }
//         else {
//           if (row.length === 0) { res.send({ result: false }); }
//           else {
//             console.log("로우", row)
//             console.log("date", date)
//             // time= date[14]+date[15];
//             // time = time-3
//             // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", time);
//             // cm 5 4 3 2 1 5
//             // console.log("asdfowejfiowefj", parseInt(row[2].topicItemDate)+2);
//             if (row[0].topicItemDate <= yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + currentMM && yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + currentMM < row[1].topicItemDate) {
//               var update1 = `update topicItem set topicItemState = '0' where topicItemCode='${row[1].topicItemCode}' AND topicItemCode='${row[2].topicItemCode}'`
//               conn.query(update1, (err, row1) => {
//                 console.log("1번타임 바뀜")
//               })
//             } else if (row[1].topicItemDate <= yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + currentMM && yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + currentMM < row[2].topicItemDate) {
//               var update2 = `update topicItem set topicItemState = '0' where topicItemCode='${row[0].topicItemCode}' AND topicItemCode='${row[2].topicItemCode}'`
//               conn.query(update2, (err, row2) => {
//                 console.log("2번타임 바뀜")
//               })
//             } else if (row[2].topicItemDate <= yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + currentMM && yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + currentMM < row[3].topicItemDate) {
//               var update3 = `update topicItem set topicItemState = '0' where topicItemCode='${row[0].topicItemCode}' AND topicItemCode='${row[1].topicItemCode}'`
//               conn.query(update3, (err, row3) => {
//                 console.log("3번타임 바뀜")
//               })
//             } else if (row[3].topicItemDate <= yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + currentMM) {
//               var update4 = `update topicItem set topicItemState = '0'`
//               conn.query(update4, (err, row4) => {
//                 console.log("4번타임 바뀜")
//               })
//             }
//             conn.query(changeState, (err, result) => {

//               if (err) { console.log(err); }
//               else {
//                 if (result.length === 0) { res.send({ result: false }); }
//                 else {
//                   conn.query(autoUpdateTopic, (err, row2) => {
//                     if (err) { console.log(err); }
//                     else {
//                       if (row.length === 0) { res.send({ result: false }); }
//                       else {
//                         res.send({ result: true });
//                       }
//                     }
//                   })
//                 }
//               }
//             })
//           }
//         }
//       })
//     }
//   });
// });

//완결주제로변경
router.post('/completionTopic', function (req, res) {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err); }
    else {
      var completionTopicUpdate = "UPDATE `topic` SET topicCompletionState='1' WHERE topicCode=?"
      conn.query(completionTopicUpdate, [req.body.topicCode], (err, row) => {
        conn.release()
        if (err) { console.log(err); }
        else {
          if (row.length === 0) { res.send({ result: false }); }
          else {
            res.send(200, {
              result: 1,
              check: 0,
              data: row
            })
          }
        }
      })
    }
  });
});


//완결주제조회
router.get('/getCompletionTopic', function (req, res) {
  pool.getConnection((err, conn) => {
    if (err) { console.log(err); }
    else {
      var getCompletionTopic = "SELECT DISTINCT topic.topicCode,topic.topicName,topic.writingItem,topic.userId from topic, topicItem, writing WHERE topic.topicCode=topicItem.topicCode AND topicItem.topicItemCode=writing.topicItemCode AND topic.topicCompletionState='1'"
      conn.query(getCompletionTopic, (err, row) => {
        conn.release()
        if (err) { console.log(err); }
        else {
          if (row.length === 0) { res.send({ result: false }); }
          else {
            res.send(200, {
              result: 1,
              check: 0,
              data: row
            })
          }
        }
      })
    }
  });
});

//완결상세조회
router.get('/getCompletionTopicDetail/:topicCode', function (req, res) {
  var topicCode = req.params.topicCode;
  pool.getConnection((err, conn) => {
    if (err) { console.log(err); }
    else {
      var getCompletionTopic = "SELECT * from topic,topicitem WHERE topic.topicCode=topicItem.topicCode AND topic.topicCode=?"
      conn.query(getCompletionTopic, [topicCode], (err, row) => {
        conn.release()
        if (err) { console.log(err); }
        else {
          if (row.length === 0) { res.send({ result: false }); }
          else {
            res.send(200, {
              result: 1,
              check: 0,
              data: row
            })
          }
        }
      })
    }
  });
});

//로그인
router.post('/login', function (req, res, next) {
  var postData = req.body;
  pool.getConnection((err, conn) => {
    if (err) throw err;
    var sql = "SELECT * FROM users WHERE userId = ? AND userPassword = ?";
    conn.query(sql, [postData.userId, postData.userPassword], (err, row) => {
      conn.release()
      if (err) {
        res.send(300, {
          result: 0,
          msg: 'DB Error'
        });
      }
      if (row.length === 0) {
        res.send(300, {
          result: 0,
          msg: "failed"
        });
      } else {
        res.send(200, {
          result: 1,
          data: row[0]
        })
      }
    });
  })
});

//회원가입
router.post('/join', function (req, res, next) {
  pool.getConnection(function (err, conn) {
    if (err) throw err;
    var sql = "SELECT * FROM users WHERE userId=?"
    conn.query(sql, [req.body.userId], function (err, row) {
      if (err) throw err;
      if (row.length === 0) {
        var sql = "INSERT INTO users (userId,userPassword,userName) VALUES (?, ?, ?);"
        conn.query(sql, [req.body.userId, req.body.userPassword, req.body.userName], function (err, row) {
          conn.release()
          if (err) throw err;
          res.send(200, {
            result: 1
          })

        });
      } else {
        res.send("중복")
      }
    });
  })
})

//주제 업데이트
// router.get('/autoUpdateTopicItem', function (req, res) {
//   var time = currentMM + 5;
//   pool.getConnection((err, conn) => {
//     if (err) { console.log(err); }
//     else {
//       var selectTopic = `select * from topicItem WHERE topicItemState ='0'`
//       var autoUpdateTopic = `UPDATE topicItem SET topicItemState='1' WHERE topicItemDate='${date}' || topicItemDate<'${yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + currentMM + 5}'`
//       var changeState = `UPDATE topicItem SET topicItemState='0' WHERE topicItemState='1' AND topicItemDate>'${yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + currentMM + 5}'`
//       conn.query(selectTopic, (err, row) => {
//         if (err) { console.log(err); }
//         else {
//           if (row.length === 0) { res.send({ result: false }); }
//           else {

//             console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
//             // cm 5 4 3 2 1 5
//             conn.query(changeState, (err, result) => {

//               if (err) { console.log(err); }
//               else {
//                 if (result.length === 0) { res.send({ result: false }); }
//                 else {
//                   conn.query(autoUpdateTopic, (err, row2) => {
//                     if (err) { console.log(err); }
//                     else {
//                       if (row.length === 0) { res.send({ result: false }); }
//                       else {
//                         res.send({ result: true });
//                       }
//                     }
//                   })
//                 }
//               }
//             })
//           }
//         }
//       })
//     }
//   });
// });


// //주제 업데이트
// router.get('/autoUpdateTopicItems', function (req, res) {
//   pool.getConnection((err, conn) => {

//     var date = new Date();
//     // date.setDate(date.getDate());
//     var hh = date.getHours();
//     var currentMM = date.getMinutes();
//     if (hh < 10) {
//       hh = '0' + hh
//     }
//     if (currentMM < 10) {
//       currentMM = '0' + currentMM
//     }

//     var nextMM = date.getMinutes() + 1;
//     var dd = date.getDate();
//     var mm = date.getMonth() + 1;
//     var yyyy = date.getFullYear();
//     var date = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + currentMM;
//     var date_next = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + nextMM;
//     var time = 0;
//     // time= date[14]+date[15];
//     // time = time-3
//     // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", time);
//     // cm 5 4 3 2 1 5
//     // console.log("asdfowejfiowefj", parseInt(row[2].topicItemDate)+2);
//     if (err) { console.log(err); }
//     else {
//       var Topic = "select * from topic where topicCompletionState='0'"
//       // var Topic = "select last_insert_id() as topicCode"
//       var selectTopic = `select * from topicItem where topicCode=?`
//       var autoUpdateTopic = `UPDATE topicItem SET topicItemState='1' WHERE topicItemDate='${date}'`
//       // var changeState = `UPDATE topicItem SET topicItemState='0' WHERE topicItemState='1' AND topicItemDate<'${yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + currentMM+5}'`

//       conn.query(Topic, (err, topicCodeRow) => {
//         console.log("셀렉트토픽", topicCodeRow)
//         if (err) { console.log(err); res.send({ result: false }); }
//         else {
//           if (topicCodeRow.length === 0) { console.log("토픽셀렉트에러"); res.send({ result: false }); }
//           else {
//             conn.query(selectTopic, [topicCodeRow[0].topicCode], (err, row) => {
//               if (err) { console.log(err); }
//               else {
//                 if (row.length === 0) { res.send({ result: false }); }
//                 else {
//                   console.log("로우", row)
//                   console.log("date", date)
//                   var selectWriting = "select * from writing"
//                   // var pickMax = "SELECT *, count(*) as pickCount from writingpick group by userId, topicItemCode ORDER BY pickCount DESC"
//                   var pickMax = "SELECT *, count(*) as pickCount from writingpick, writing, topicItem where writingpick.topicItemCode=writing.topicItemCode AND writing.topicItemCode=topicItem.topicItemCode group by writingpick.topicItemCode, writingpick.topicItemCode ORDER BY pickCount DESC"
//                   conn.query(selectWriting, (err, writingSelect) => {
//                     conn.query(pickMax, (err, pickMaxSelect) => {
//                       console.log("pickMax 로그", pickMaxSelect)
//                       console.log("레전드...", writingSelect[0].writingContents)

//                       if (row[0].topicItemDate <= date && date < row[1].topicItemDate) {
//                         var update1 = `update topicItem set topicItemState = '0' where topicItemCode='${row[1].topicItemCode}' OR topicItemCode='${row[2].topicItemCode}'`
//                         conn.query(update1, (err, row1) => {
//                           var stateUpdate = `update topicItem set topicItemState='1' where topicItemCode='${row[0].topicItemCode}'`
//                           conn.query(stateUpdate, (err, stateUpdateRow) => {
//                             console.log("아이템 1번 스테이트1로변경")
//                             res.send({ result: true });
//                           })
//                           console.log("1번타임 바뀜")
//                         })
//                       } else if (row[1].topicItemDate <= date && date < row[2].topicItemDate) {
//                         var update2 = `update topicItem set topicItemState = '0' where topicItemCode='${row[0].topicItemCode}' OR topicItemCode='${row[2].topicItemCode}'`
//                         conn.query(update2, (err, row2) => {
//                           var writingUpdate1 = `update topic set writingItem='${pickMaxSelect[0].writingContents}' where topicCode='${pickMaxSelect[0].topicCode}'`
//                           conn.query(writingUpdate1, (err, wUpdate1) => {
//                             var stateUpdate = `update topicItem set topicItemState='1' where topicItemCode='${row[1].topicItemCode}'`
//                             conn.query(stateUpdate, (err, stateUpdateRow) => {
//                               console.log("아이템 2번 스테이트1로변경")
//                               res.send({ result: true });
//                             })
//                             console.log("글 업데이트 1번")
//                           })

//                           console.log("2번타임 바뀜")
//                         })
//                       } else if (row[2].topicItemDate <= date && date < row[3].topicItemDate) {
//                         var update3 = `update topicItem set topicItemState = '0' where topicItemCode='${row[0].topicItemCode}' OR topicItemCode='${row[1].topicItemCode}'`
//                         conn.query(update3, (err, row3) => {
//                           var writingUpdate2 = `update topic set writingItem='${pickMaxSelect[0].writingContents}' '\n' '${pickMaxSelect[1].writingContents}' where topicCode='${pickMaxSelect[0].topicCode}'`
//                           conn.query(writingUpdate2, (err, wUpdate2) => {
//                             var stateUpdate = `update topicItem set topicItemState='1' where topicItemCode='${row[2].topicItemCode}'`
//                             conn.query(stateUpdate, (err, stateUpdateRow) => {
//                               console.log("아이템 3번 스테이트1로변경")
//                               res.send({ result: true });
//                             })
//                             console.log("글 업데이트 2번")
//                           })

//                           console.log("3번타임 바뀜")
//                         })
//                       } //else if (row[3].topicItemDate >= date) 
//                       else {
//                         var update4 = `update topicItem set topicItemState = '0' where topicItemCode='${row[0].topicItemCode}' OR topicItemCode='${row[1].topicItemCode}' OR topicItemCode='${row[2].topicItemCode}'`
//                         var writingUpdate3 = `update topic set writingItem='${pickMaxSelect[0].writingContents}' '\n' '${pickMaxSelect[1].writingContents}' '\n' '${pickMaxSelect[2].writingContents}' where topicCode='${pickMaxSelect[0].topicCode}'`
//                         conn.query(writingUpdate3, (err, wUpdate3) => {
//                           if (err) { console.log("토픽셀렉트에러"); res.send({ result: false }); }
//                           // console.log("글 업데이트 3번")
//                           else {
//                             conn.query(update4, (err, row4) => {
//                               var completion = `update topic set topicCompletionState='1' where topicCode='${pickMaxSelect[0].topicCode}'`
//                               conn.query(completion, (err, row4) => {
//                                 console.log("토픽컴플리션스테이트 변경")
//                                 res.send({ result: true });
//                               })
//                               console.log("4번타임 바뀜")
//                             })
//                           }

//                         })

//                       }
//                       // conn.query(changeState, (err, result) => {

//                       //   if(err) { console.log(err); }
//                       //   else {
//                       //     if(result.length === 0){ res.send({ result: false }); }
//                       //     else{
//                       //       conn.query (autoUpdateTopic, (err, row2) => {
//                       //         if (err) { console.log(err); }
//                       //         else {
//                       //           if (row.length ===0) { res.send({result: false}); }
//                       //           else {
//                       //             res.send({ result: true });
//                       //           }
//                       //         }
//                       //       })
//                       //     }
//                       //   }
//                       // }) // 여기서부터 올림
//                     })
//                   })
//                 }
//               }
//             }) //여기
//           }
//         }
//       })
//     }
//   });
// });

// //주제 업데이트
// router.get('/sche', getTest);
// function getTest(req, res) {
//   let rule = new Schedule.RecurrenceRule();
//   rule.second = 0;
//   let job = Schedule.scheduleJob(rule, function () {
//     console.log('1분 지났당')
//     pool.getConnection((err, conn) => {
//       var date = new Date();
//       // date.setDate(date.getDate());
//       var hh = date.getHours();
//       var currentMM = date.getMinutes();
//       if (hh < 10) {
//         hh = '0' + hh
//       }
//       if (currentMM < 10) {
//         currentMM = '0' + currentMM
//       }
//       if (nextMM < 10) {
//         nextMM = '0' + nextMM
//       }

//       var nextMM = date.getMinutes() + 1;
//       var dd = date.getDate();
//       var mm = date.getMonth() + 1;
//       var yyyy = date.getFullYear();
//       var date = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + currentMM;
//       var date_next = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + nextMM;
//       var time = 0;
//       if (err) { console.log(err); console.log('1111111'); }
//       else {
//         console.log(date);
//         var getDoneTopic = `SELECT * from topicitem WHERE topicItemState='1' AND topicItemDate='${date}'`
//         var getDoTopic = `SELECT * from topicitem WHERE topicItemState='0' AND topicItemDate='${date}'`
//         conn.query(getDoneTopic, (err, row) => {
//           conn.release()
//           console.log(row);
//           console.log('222222222');
//           if (err) { console.log(err); console.log('333333333333'); }

//           else {
//             console.log('44444444444');
//             if (row.length === 0) { console.log('5555555555'); }
//             else {
//               console.log('66666666666');
//               row.forEach(function (e) {
//                 console.log('777777777777');
//                 console.log(e.topicItemCode)
//                 var getUpdate = `update topicItem set topicItemState = '0' `
//                 var selectWriting = "select * from writing"
//                 var picMax = `SELECT topic.topicCode, topic.topicCompletionState, topicItem.topicItemCode, topicitem.topicItemState, topicitem.topicItemDate, topicitem.topicItemName, writing.userId, writing.writingContents, writing.topicItemCode, writingpick.topicItemCode from topic, topicitem, writing, writingpick where topic.topicCode=topicitem.topicCode AND topicitem.topicItemCode=writing.topicItemCode AND topicItem.topicItemCode=writingpick.topicItemCode AND topicitem.topicItemCode=? GROUP BY writing.userId HAVING writing.userId=(select MAX(userId) from writingpick where topicItemCode=?)`
//                 conn.query(picMax, [e.topicItemCode, e.topicItemCode], (err, pickrow) => {
//                   if (pickrow.length === 0) { 
//                     var sql = `update topicItem set topicItemState = '0' WHERE topicCode = '${row[0].topicCode}'` 
//                     conn.query(sql, (err, result) => {
//                       if(err) {throw err}
//                       else{
//                         console.log("성공");
//                       }
//                     })
//                   }
//                   else {
//                     console.log(pickrow)
//                     console.log(e.topicItemCode)
//                     //console.log(pickrow[0].writingContents)
//                     var updateWriting = `update topicitem set writingItem = '${pickrow[0].writingContents}', topicItemState='0' WHERE topicitemCode='${pickrow[0].topicItemCode}'`
//                     conn.query(updateWriting, (err, writingrows) => {
//                       if (err) { console.log("hello world"); }
//                       else {
//                         console.log(date_next);
//                         var update = `update topicitem set topicItemState='1' where topicItemDate='${date_next}'`;
//                         conn.query(update, (err, updateRow) => {
//                           console.log("~~~~~~~~~~~~~~~~~~~~~~~~`")
//                         })
//                       }
//                       // res.send(200, {
//                       //   result: 1,
//                       // })
//                       // var sql = `SELECT * FROM topicItem WHERE topicItemState = 1 AND topicCode = '${row[0].topicCode}'`
//                       //   conn.query(sql, (err, result) => {
//                       //     console.log("o1");
//                       //     if(err) {console.log(err)}
//                       //     else{
//                       //       if(result.length === 0){
//                       //         console.log("o2");
//                       //         console.log(row[0].topicCode);
//                       //         var sql2 = `UPDATE topic SET topicCompletionState = 1 WHERE topicCode = '${row[0].topicCode}'`
//                       //         conn.query(sql2, (err, result) => {
//                       //         if(err){console.log(err)}
//                       //         else {
//                       //             console.log("완결!!");
//                       //         }
//                       //       })
//                       //     }
//                       //   }
//                       // })
//                     })
//                   }
//                   var sql = `SELECT * FROM topicItem WHERE topicItemState = 1 AND topicCode = '${e.topicCode}'`
//                         conn.query(sql, (err, result) => {
//                           console.log(result)
//                           console.log("o3");
//                           if(err) {console.log(err)}
//                           else{
//                             if(result.length === 0){
//                               console.log("o4");
//                               console.log(e.topicCode);
//                               var sql2 = `UPDATE topic SET topicCompletionState = 1 WHERE topicCode = '${e.topicCode}'`
//                               conn.query(sql2, (err, result) => {
//                               if(err){console.log(err)}
//                               else {
//                                   console.log("완결!!");
//                               }
//                             })
//                           }
//                         }
//                       })
//                 }
//                 )
//               })
//             }

//           }
//         })
//       }

//     });
//   })
//   res.send("quit, wait 1 minuates");
// }

//주제 업데이트
router.get('/sche', getTest);
function getTest(req, res) {
  let rule = new Schedule.RecurrenceRule();
  rule.second = 0;
  let job = Schedule.scheduleJob(rule, function () {
    console.log('1분 지났당')
    pool.getConnection((err, conn) => {
      var date = new Date();
      // date.setDate(date.getDate());
      var hh = date.getHours();
      var currentMM = date.getMinutes();
      

      var nextMM = date.getMinutes() + 1;
      var dd = date.getDate();
      var mm = date.getMonth() + 1;
      var yyyy = date.getFullYear();
      if (hh < 10) {
        hh = '0' + hh
      }
      if (currentMM < 10) {
        currentMM = '0' + currentMM
      }
      if (nextMM < 10) {
        nextMM = '0' + nextMM
      }
      var date = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + currentMM;
      var date_next = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + nextMM;
      var time = 0;

      
      if (err) { console.log(err); console.log('1111111'); }
      else {
        console.log(date);
        var getDoneTopic = `SELECT * from topicitem WHERE topicItemState='1' AND topicItemDate='${date}'`
        var getDoTopic = `SELECT * from topicitem WHERE topicItemState='0' AND topicItemDate='${date}'`
        var slt = "select * from writing where topicItemCode=?"
        conn.query(getDoneTopic, (err, row) => {
          conn.release();
          console.log(row);
          console.log('222222222');
          if (err) { console.log(err); console.log('333333333333'); }
          else {
            console.log('44444444444');
            if (row.length === 0) { 
              console.log(err)
            }
            else {
              console.log('66666666666');
              row.forEach(function (e) {
                conn.query (slt, [e.topicItemCode], (err, row2) => {
                  if (err) { console.log(err) }
                  else {
                    if (row2.length ==0 ) {
                      var asd = "delete from topic where topicCode=?"
                      conn.query(asd, [e.topicCode], (err, row3) => {
                        if (err) { console.log(err) }
                        else {
                          console.log("글 없을때 삭제 성공")
                        }
                      })
                    }
                    else {
                      console.log('777777777777');
                      console.log(e.topicItemCode)
                      var getUpdate = `update topicItem set topicItemState = '0' `
                      var selectWriting = "select * from writing"
                      var picMax = `SELECT topic.topicCode, topic.topicCompletionState, topicItem.topicItemCode, topicitem.topicItemState, topicitem.topicItemDate, topicitem.topicItemName, writing.userId, writing.writingContents, writing.topicItemCode, writingpick.topicItemCode from topic, topicitem, writing, writingpick where topic.topicCode=topicitem.topicCode AND topicitem.topicItemCode=writing.topicItemCode AND topicItem.topicItemCode=writingpick.topicItemCode AND topicitem.topicItemCode=? GROUP BY writing.userId HAVING writing.userId=(select MAX(userId) from writingpick where topicItemCode=?)`
                      conn.query(picMax, [e.topicItemCode, e.topicItemCode], (err, pickrow) => {
                        if (pickrow.length === 0) {
                          var del = "delete from topic where topicCode=?"
                          conn.query (del, [e.topicCode], (err, row) => {
                            if (err) {console.log(err) }
                            else {
                              console.log("삭제성공")
                            }
                          })
                        }
                        else {
                          console.log(pickrow)
                          console.log(e.topicItemCode)
                          //console.log(pickrow[0].writingContents)
                          var updateWriting = `update topicitem set writingItem = '${pickrow[0].writingContents}', topicItemState='0' WHERE topicitemCode='${e.topicItemCode}'`
                          conn.query(updateWriting, (err, writingrows) => {
                            if (err) { console.log("hello world"); }
                            else {
                              console.log(date_next);
                              var update = `update topicitem set topicItemState='1' where topicItemDate='${date_next}'`;
                              conn.query(update, (err, updateRow) => {
                                console.log("~~~~~~~~~~~~~~~~~~~~~~~~`")
                              })
                            }
                            // res.send(200, {
                            //   result: 1,
                            // })
      
      
      
                            var sql = `SELECT * FROM topicitem,topic WHERE topicitem.topicCode = topic.topicCode AND topicitem.topicCode = ?`
                            var sql2 = `UPDATE topic SET topicCompletionState = 1 WHERE topicCode = ?`
                            conn.query(sql, [e.topicCode], (err, list) => {
                              if (err) { console.log(err) }
                              if (list[0].topicItemState == 0 && list[1].topicItemState == 0 && list[2].topicItemState == 0 && list[3].topicItemState == 0) {
                                conn.query(sql2, [e.topicCode], (err, list2) => {
                                  if (err) { console.log(err) }
                                  console.log("완결!!");
                                })
                              }
                              // list.some(function (a) {
                              //   if (a.topicItemState == 1) {
                              //     return true;
                              //   }
                              //   else if (a.topicItemState == 0) {
                              //     return false;
                              //   }
                              // })
      
                            })
                          })
                        }
                      }
                      )
                      
                    }
                  }
                }) 
              
              }) // 포문 괄호
              
            }

          }

        })
      }

    });
  })
  res.send("quit, wait 1 minuates");
}

// router.get('/sche', getTest);
// function getTest(req, res) {
//   let rule = new Schedule.RecurrenceRule();
//   rule.second = 0;
//   let job = Schedule.scheduleJob(rule, function () {
//     console.log('1분 지났당')
//     pool.getConnection((err, conn) => {
//       var date = new Date();
//       // date.setDate(date.getDate());
//       var hh = date.getHours();
//       var currentMM = date.getMinutes();
//       if (hh < 10) {
//         hh = '0' + hh
//       }
//       if (currentMM < 10) {
//         currentMM = '0' + currentMM
//       }
//       if (nextMM < 10) {
//         nextMM = '0' + nextMM
//       }

//       var nextMM = date.getMinutes() + 1;
//       var dd = date.getDate();
//       var mm = date.getMonth() + 1;
//       var yyyy = date.getFullYear();
//       var date = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + currentMM;
//       var date_next = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + nextMM;
//       var time = 0;
//       if (err) { console.log(err); console.log('1111111'); }
//       else {
//         console.log(date);
//         var getDoneTopic = `SELECT * from topicitem WHERE topicItemState='1' AND topicItemDate='${date}'`
//         var getDoTopic = `SELECT * from topicitem WHERE topicItemState='0' AND topicItemDate='${date}'`
//         conn.query(getDoneTopic, (err, row) => {
//           conn.release()
//           console.log(row);
//           console.log('222222222');
//           if (err) { console.log(err); console.log('333333333333'); }
//           else {
//             console.log('44444444444');
//             if (row.length === 0) { console.log('5555555555'); }
//             else {
//               console.log('66666666666');
//               row.forEach(function (e) {
//                 console.log('777777777777');
//                 console.log(e.topicItemCode)
//                 var getUpdate = `update topicItem set topicItemState = '0' `
//                 var selectWriting = "select * from writing"
//                 var picMax = `SELECT topic.topicCode, topic.topicCompletionState, topicItem.topicItemCode, topicitem.topicItemState, topicitem.topicItemDate, topicitem.topicItemName, writing.userId, writing.writingContents, writing.topicItemCode, writingpick.topicItemCode from topic, topicitem, writing, writingpick where topic.topicCode=topicitem.topicCode AND topicitem.topicItemCode=writing.topicItemCode AND topicItem.topicItemCode=writingpick.topicItemCode AND topicitem.topicItemCode=? GROUP BY writing.userId HAVING writing.userId=(select MAX(userId) from writingpick where topicItemCode=?)`
//                 conn.query(picMax, [e.topicItemCode, e.topicItemCode], (err, pickrow) => {
//                   if (pickrow.length === 0) {
//                     var sql = `update topicItem set topicItemState = '0' WHERE topicCode = '${e.topicCode}'`
//                     conn.query(sql, (err, result) => {
//                       if (err) { throw err }
//                       else {
//                         console.log("성공");
//                       }
//                     })
//                   }
//                   else {
//                     console.log(pickrow)
//                     console.log(e.topicItemCode)
//                     //console.log(pickrow[0].writingContents)
//                     var updateWriting = `update topicitem set writingItem = '${pickrow[0].writingContents}', topicItemState='0' WHERE topicitemCode='${e.topicItemCode}'`
//                     conn.query(updateWriting, (err, writingrows) => {
//                       if (err) { console.log("hello world"); }
//                       else {
//                         console.log(date_next);
//                         var update = `update topicitem set topicItemState='1' where topicItemDate='${date_next}'`;
//                         conn.query(update, (err, updateRow) => {
//                           console.log("~~~~~~~~~~~~~~~~~~~~~~~~`")
//                         })
//                       }
//                       // res.send(200, {
//                       //   result: 1,
//                       // })

//                       var sql = `SELECT * FROM topicitem,topic WHERE topicitem.topicCode = topic.topicCode AND topicitem.topicCode = ?`
//                       var sql2 = `UPDATE topic SET topicCompletionState = 1 WHERE topicCode = ?`
//                       conn.query(sql, [e.topicCode], (err, list) => {
//                         if (err) { console.log(err) }
//                         if (list[0].topicItemState == 0 && list[1].topicItemState == 0 && list[2].topicItemState == 0 && list[3].topicItemState == 0) {
//                           conn.query(sql2, [e.topicCode], (err, list2) => {
//                             if (err) { console.log(err) }
//                             console.log("완결!!");
//                           })
//                         }
//                         // list.some(function (a) {
//                         //   if (a.topicItemState == 1) {
//                         //     return true;
//                         //   }
//                         //   else if (a.topicItemState == 0) {
//                         //     return false;
//                         //   }
//                         // })

//                       })
//                     })
//                   }
//                 }
//                 )
//               })
//             }

//           }

//         })
//       }

//     });
//   })
//   res.send("quit, wait 1 minuates");
// }

router.get('/getCompletionTopicList', function (req, res) {
  pool.getConnection((err, conn) => {
      if (err) { console.log(err); }
      else {
          var getCompletionTopic = "SELECT * from topic WHERE topicCompletionState = 1"
          conn.query(getCompletionTopic, (err, result) => {
            conn.release();
              if (err) { console.log(err); }
              else {
                  if (result.length === 0) { res.send({ result: false }); }
                  else {
                      res.send(result);
                  }
              }
          })
      }
  });
});

router.get('/getCompletionTopicDetail/:topicCode', function (req, res) {
  var topicCode = req.params.topicCode;
  pool.getConnection((err, conn) => {
      if (err) { console.log(err); }
      else {
          var getCompletionTopic = "SELECT * from topic, topicItem WHERE topic.topicCode = ?, topic.topicCode=topicItem.topicCode AND topic.topicCompletionState='1'"
          conn.query(getCompletionTopic, [topicCode], (err, result) => {
            conn.release();
              if (err) { console.log(err); }
              else {
                  if (result.length === 0) { res.send({ result: false }); }
                  else {
                      res.send({ result: result });
                  }
              }
          })
      }
  });
});

// 추천 주제
// router.get('/topTopic', function (req, res) {
//   pool.getConnection((err, conn) => {
//       if (err) { console.log(err); }
//       else {
//           var topTopic = "SELECT * FROM topic WHERE topicCompletionState = 0 limit 3"
//           conn.query(topTopic, (err, result) => {
//               if (err) { console.log(err); }
//               else {
//                   if (result.length === 0) { res.send({ result: false }); }
//                   else {
//                       res.send({ result: result });
//                   }
//               }
//           })
//       }
//   });
// });

//top3 작가
router.get('/topWriter', function (req, res) {
  pool.getConnection((err, conn) => {
      if (err) { console.log(err); }
      else {
          var writer = "select * from writing group by userId limit 3"
          conn.query(writer, (err, result) => {
            conn.release();
              if (err) { console.log(err); }
              else {
                  if (result.length === 0) { res.send({ result: false }); }
                  else {
                      res.send(result);
                  }
              }
          })
      }
  });
});


module.exports = router;
