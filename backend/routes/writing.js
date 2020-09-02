var express = require('express');
var router = express.Router();

var pool = require('../config/dbConfig');

//모든글조회
router.get('/getWriting', function (req, res) {
    pool.getConnection((err, conn) => {
        if (err) { console.log(err); }
        else {
            var getWriting = `SELECT writingContents, writing.userId, writing.topicItemCode, topicItemName, topicItemState, topic.topicCode, topicName, topicCompletionState, topicRegisterDate from writing, topic, topicitem WHERE writing.topicItemCode=topicitem.topicItemCode AND topic.topicCode=topicitem.topicCode`
            conn.query(getWriting, (err, result) => {
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

//글 조회
router.get('/getWriting/:topicItemCode', function (req, res) {
    const topicItemCode = req.params.topicItemCode;
    pool.getConnection((err, conn) => {
        if (err) { console.log(err); }
        else {
            var getWriting = `SELECT writingContents, writing.userId, writing.topicItemCode, topicItemName, topicItemState, topic.topicCode, topicName, topicCompletionState, topicRegisterDate, (select count(*) as "pickCount" from writingpick where writingpick.userId=writing.userId AND writingpick.topicItemCode=?) as "pickCount" from writing, topic, topicitem WHERE writing.topicItemCode=? AND writing.topicItemCode=topicitem.topicItemCode AND topic.topicCode=topicitem.topicCode`
            conn.query(getWriting, [topicItemCode, topicItemCode], (err, result) => {
                conn.release();
                if (err) { console.log(err); }
                else {
                    res.send(result);
                }
            })
        }
    });
});

//글 상세조회
router.get('/getWritingDetail/:userId/:topicItemCode', function (req, res) {
    const userId = req.params.userId;
    const topicItemCode = req.params.topicItemCode;
    pool.getConnection((err, conn) => {
        if (err) { console.log(err); }
        else {
            var getWriting = `SELECT writingContents, writing.userId, writing.topicItemCode, topicItemName, topicItemState, topic.topicCode, topicName, topicCompletionState, topicRegisterDate, (select count(*) as "pickCount" from writingpick where writingpick.userId=? AND writingpick.topicItemCode=?) as "pickCount" from writing, topic, topicitem WHERE writing.userId = ? AND writing.topicItemCode=? AND writing.topicItemCode=topicitem.topicItemCode AND topic.topicCode=topicitem.topicCode`
            conn.query(getWriting, [userId, topicItemCode, userId, topicItemCode], (err, result) => {
                conn.release();
                if (err) { console.log(err); }
                else {
                    res.send(result);
                }
            })
        }
    });
});



//글등록
router.post('/registerWriting', function (req, res) {
    pool.getConnection((err, conn) => {
        if (err) { console.log(err); }
        else {
            var writingInsert = "INSERT INTO `writing`(`writingContents`, `userId`, `topicItemCode`) VALUES (?, ?, ?)"
            conn.query(writingInsert, [req.body.writingContents, req.body.userId, req.body.topicItemCode], (err, result) => {
                conn.release();
                if (err) { console.log(err); }
                else {
                    if (result.length === 0) { res.send({ result: false }); }
                    else {
                        res.send({ result: true });
                    }
                }
            })
        }
    });
});

//글수정
router.put('/updateWriting', function (req, res) {
    pool.getConnection((err, conn) => {
        if (err) { console.log(err); }
        else {
            var writingUpdate = "UPDATE `writing` SET writingContents=? WHERE topicItemCode=? AND userId=?"
            conn.query(writingUpdate, [req.body.writingContents, req.body.topicItemCode, req.body.userId], (err, result) => {
                conn.release();
                if (err) { console.log(err); }
                else {
                    if (result.length === 0) { res.send({ result: false }); }
                    else {
                        res.send({ result: true });
                    }
                }
            })
        }
    });
});

//글삭제
router.delete('/deleteWriting/:userId/:topicItemCode', function (req, res) {
    pool.getConnection((err, conn) => {
        if (err) { console.log(err); }
        else {
            var writingDelete = "DELETE FROM writing where userId=? AND topicItemCode=?"
            conn.query(writingDelete, [req.params.userId, req.params.topicItemCode], (err, result) => {
                conn.release();
                if (err) { console.log(err); }
                else {
                    if (result.length === 0) { res.send({ result: false }); }
                    else {
                        res.send({ result: true });
                    }
                }
            })
        }
    });
});

//글좋아요
router.post('/registerWritingPick', function (req, res) {
    pool.getConnection((err, conn) => {
        if (err) { console.log(err); }
        else {
            var writingPick = "INSERT INTO `writingpick` (`readerId`, `userId`, `topicItemCode`) VALUES (?, ?, ?)"

            conn.query(writingPick, [req.body.readerId, req.body.userId, req.body.topicItemCode], (err, result) => {
                conn.release();
                if (err) { console.log(err); }
                else {
                    if (result.length === 0) { res.send({ result: false }); }
                    else {
                        res.send({ result: true });
                    }
                }
            })
        }
    });
});

//글좋아요 조회
router.get('/getWritingPick/:userId/:topicItemCode/:readerId', function (req, res) {
    const readerId = req.params.readerId;
    const topicItemCode = req.params.topicItemCode;
    const userId = req.params.userId;
    pool.getConnection((err, conn) => {
        if (err) { console.log(err); }
        else {
            var writingPick = "SELECT * FROM writingpick WHERE readerId = ? AND topicItemCode = ? AND userId = ?"
            conn.query(writingPick, [readerId, topicItemCode, userId], (err, result) => {
                conn.release();
                if (err) { console.log(err); }
                else {
                    if (result.length == 0) { res.send({ result: true }); }
                    else {
                        res.send({ result: false });
                    }
                }
            })
        }
    });
});

//글좋아요 삭제
router.delete('/deleteWritingPick/:userId/:topicItemCode/:readerId', function (req, res) {
    const readerId = req.params.readerId;
    const topicItemCode = req.params.topicItemCode;
    const userId = req.params.userId;
    pool.getConnection((err, conn) => {
        if (err) { console.log(err); }
        else {
            var writingDelete = "DELETE FROM writingpick where readerId=? AND topicItemCode=? AND userId = ?"
            conn.query(writingDelete, [readerId, topicItemCode, userId], (err, result) => {
                conn.release();
                if (err) { console.log(err); }
                else {
                    if (result.length === 0) { res.send({ result: false }); }
                    else {
                        res.send({ result: true });
                    }
                }
            })
        }
    });
});

module.exports = router;