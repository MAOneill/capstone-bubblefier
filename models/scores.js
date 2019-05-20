const db = require('./conn');  //requre the conn.js file

class UserScore {
    constructor (id, userID, score) {
        this.id = id;
        this.userID = userID;
        this.score = score;
    } 

    static getAllScores(id) {
        return db.any(`SELECT * from user_score WHERE id=${id}`)
            .then((scores)=> {
                const scoreArray = [];
                scores.map(score => {
                    const aScore = new UserScore(score.id, score.user_id, score.score)
                    scoreArray.push(aScore);
                })
                return scoreArray;
            })
            .catch((error)=> {
                console.log(error);
                return null;
            })
    }

    static addUserScore(id,score){
        return db.result(`INSERT into user_score
        (user_id, score)
        values ($1 $2)` , [id, score])
    }

    deleteScore(id) {
        return db.result(`DELETE from user_score where id=$1`, [id])
        .catch((error)=> {
            console.error(error);
        })
    }
}
module.exports = UserScore;
