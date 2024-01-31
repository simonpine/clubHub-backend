import { connect } from "../database"
const fs = require('fs')

export const getUsers = async (req, res) => {
    const connection = await connect()

    const [rows] = await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
    userName VARCHAR(45) NOT NULL,
    clubs JSON NOT NULL,
    pasword VARCHAR(45) NOT NULL,
    userImg VARCHAR(255) DEFAULT NULL,
    question VARCHAR(45) NOT NULL,
    answer VARCHAR(45) NOT NULL,
    PRIMARY KEY (userName)
);

CREATE TABLE IF NOT EXISTS clubs (
    id VARCHAR(45) NOT NULL,
    title VARCHAR(45) NOT NULL,
    description TEXT NOT NULL,
    gardes JSON NOT NULL,
    clubBanner VARCHAR(255) NOT NULL,
    members JSON DEFAULT NULL,
    chat JSON DEFAULT NULL,
    events JSON DEFAULT NULL,
    clubOwner VARCHAR(45) NOT NULL,
    clubLeader VARCHAR(45) NOT NULL,
    existGrades BOOLEAN NOT NULL,
    existChat BOOLEAN NOT NULL,
    calendarEvents JSON DEFAULT NULL, 
    surveys JSON DEFAULT NULL, 
    PRIMARY KEY (id)
);

`)

    res.json(rows)
}
export const getUsersList = async (req, res) => {
    const connection = await connect()

    const [rows] = await connection.query('SELECT userName FROM users')

    res.json(rows)
}
export const getUser = async (req, res) => {
    const connection = await connect()

    const [rows] = await connection.query('SELECT * FROM users WHERE userName = ?', [req.params.id])

    res.json(rows)
}
export const getUserName = async (req, res) => {
    const connection = await connect()

    const [rows] = await connection.query('SELECT userName FROM users WHERE userName = ?', [req.params.id])

    res.json(rows)
}

export const saveUser = async (req, res) => {
    const connection = await connect()
    const [result] = await connection.query('INSERT INTO users (userName, clubs, pasword, question, answer, description) VALUES (?, ?, ?, ?, ?, ?)',
        [req.body.userName, JSON.stringify(req.body.clubs), req.body.pasword, req.body.question, req.body.answer, req.body.description]
    )

    res.json({ ...req.body, id: result.insertId })
}
export const deleteUser = async (req, res) => {
    const connection = await connect()

    const [result] = await connection.query('DELETE FROM users WHERE userName = ?', [req.params.id])

    result.affectedRows > 0 ? res.json('Se elimino la tarea ' + req.params.id) : res.json('No se afecto nada')
}

export const updateUser = async (req, res) => {



    const connection = await connect()

    const [result] = await connection.query('UPDATE users SET ? WHERE userName = ?', [
        req.body
        , req.params.id])


    async function changeClubs(it) {
        if (it.own) {
            await connection.query('UPDATE clubs SET clubOwner = ? WHERE id = ?', [
                req.body.userName
                , it.clubId])
        }

        else {

            const membersOfClub = await connection.query('SELECT * FROM clubs WHERE id = ?', [it.clubId])

            const newMemberArray = await membersOfClub[0][0].members.map(a => {
                if (a === req.params.id) {
                    return req.body.userName
                }
                return a
            })

            const newGradesArray = await membersOfClub[0][0].gardes.students.map(a => {
                if (a.studentName === req.params.id) {
                    return {
                        total: a.total,
                        gardes: a.gardes,
                        studentName: req.body.userName,
                    }
                }
                return a
            })
            const newObjGrades = await {
                students: newGradesArray,
                grades: membersOfClub[0][0].gardes.grades
            }

            // console.log(newGradesArray)
            await connection.query('UPDATE clubs SET members = ?, gardes = ? WHERE id = ?', [
                JSON.stringify(newMemberArray),
                JSON.stringify(newObjGrades)
                , it.clubId])


        }
    }
    if (req.body.userName !== req.params.id) {
        const arr = await JSON.parse(req.body.clubs)
        if (arr.length > 0) {
            await arr.map(item => {
                changeClubs(item)
            })
        }
    }


    result.affectedRows > 0 ? res.json('Se actualizo la tarea ' + req.params.id) : res.json('No se afecto nada')

}

export const uploadPhoto = async (req, res) => {


    const connection = await connect()
    await connection.query('UPDATE users SET userImg = ? WHERE userName = ?', [
        req.file.filename
        , req.body.name])
    res.json({ 'message': 'File uploaded successfully' });
}



export const createClub = async (req, res) => {

    const connection = await connect()

    await connection.query('INSERT INTO clubs (id, title, gardes, clubBanner, members, clubOwner, description, chat, events, calendarEvents, clubLeader, surveys, existChat, existGrades) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [req.body.id, req.body.title, req.body.grades, req.file.filename, req.body.members, req.body.clubOwner, req.body.description, req.body.chat, req.body.events, req.body.calendarEvents, req.body.clubLeader, req.body.surveys, JSON.parse(req.body.existChat), JSON.parse(req.body.existGrades)]
    )

    await connection.query('UPDATE users SET clubs = ? WHERE userName = ?', [
        req.body.clubsOfOwner, req.body.clubOwner])


    await res.json({ 'message': 'File uploaded successfully' });
}


export const getClubs = async (req, res) => {
    const connection = await connect()

    const [rows] = await connection.query('SELECT * FROM clubs')

    await res.json(rows)
}

export const getClub = async (req, res) => {
    const connection = await connect()

    const [rows] = await connection.query('SELECT * FROM clubs WHERE id = ?', [req.params.id])

    await res.json(rows)
}

export const joinClub = async (req, res) => {

    const connection = await connect()

    const a = await connection.query('SELECT gardes FROM clubs WHERE id = ?', [req.body.clubId])



    const newGradeStudent = await {
        studentName: req.body.newMember,
        gardes: [],
        total: 1,
    }
    for (let x = 0; a[0][0].gardes.grades.length > x; x++) {
        await newGradeStudent.gardes.push(1)
    }

    a[0][0].gardes.students.push(newGradeStudent)
    await connection.query('UPDATE clubs SET gardes = ? WHERE id = ?', [
        JSON.stringify(a[0][0].gardes), (req.body.clubId)])

    await connection.query('UPDATE clubs SET members = ? WHERE id = ?', [
        JSON.stringify(req.body.newMembers), (req.body.clubId)])

    await connection.query('UPDATE users SET clubs = ? WHERE userName = ?', [
        JSON.stringify(req.body.clubsOfMember), req.body.newMember])

    await res.json({ 'message': 'File uploaded successfully' });

}

export const exitClub = async (req, res) => {

    const connection = await connect()
    const [club] = await connection.query('SELECT * FROM clubs WHERE id = ?', [req.body.clubId])

    // const newArrGrades = await club[0].gardes.students.filter(item => item.studentName !== req.body.userName)

    club[0].gardes.students = await club[0].gardes.students.filter(item => item.studentName !== req.body.userName)

    const newArrMembers = await club[0].members.filter(item => item !== req.body.userName)

    await connection.query('UPDATE clubs SET members = ? WHERE id = ?', [
        JSON.stringify(newArrMembers), (req.body.clubId)])

    await connection.query('UPDATE clubs SET gardes = ? WHERE id = ?', [
        JSON.stringify(club[0].gardes), (req.body.clubId)])



    const newArrClubs = await req.body.userClubs.filter(item => item.clubId !== req.body.clubId)


    await connection.query('UPDATE users SET clubs = ? WHERE userName = ?', [
        JSON.stringify(newArrClubs), (req.body.userName)])

    await connection.query('UPDATE users SET clubs = ? WHERE userName = ?', [
        JSON.stringify(req.body.clubsOfMember), req.body.newMember])

    await res.json({ 'message': 'User clubs change successfully' });

}

export const deleteClub = async (req, res) => {

    const connection = await connect()


    async function changeUsers(it) {

        const user = await connection.query('SELECT * FROM users WHERE userName = ?', [it])

        const newClubsArray = await user[0][0].clubs.filter(item => item.clubId !== req.params.id)

        await connection.query('UPDATE users SET clubs = ? WHERE userName = ?', [
            JSON.stringify(newClubsArray)
            , it])


    }



    const [club] = await connection.query('SELECT * FROM clubs WHERE id = ?', [req.body.clubId])

    if (club[0].members.length > 0) {
        await club[0].members.map(item => {
            changeUsers(item)
        })
    }



    const newClubsArray = await req.body.clubsOfOwner.filter(item => item.clubId !== req.params.id)


    await connection.query('UPDATE users SET clubs = ? WHERE userName = ?', [
        JSON.stringify(newClubsArray), req.body.clubOwner])

    await connection.query('DELETE FROM clubs WHERE id = ?', [req.params.id])

    try {
        fs.unlinkSync('public/images/banners/' + req.params.id + '.jpeg')
    } catch (err) {
        try { fs.unlinkSync('public/images/banners/' + req.params.id + '.png') }
        catch (err) {
            return err;
        }
    }

    await res.json({ 'message': 'User clubs change successfully' });
    // console.log(req.body)
}

export const updateClub = async (req, res) => {

    const connection = await connect()


    async function changeUsers(it) {

        const user = await connection.query('SELECT * FROM users WHERE userName = ?', [it])

        const newClubsArray = await user[0][0].clubs.filter(item => item.clubId !== req.params.id)

        await newClubsArray.push(JSON.parse(req.body.clubResume))

        await connection.query('UPDATE users SET clubs = ? WHERE userName = ?', [
            JSON.stringify(newClubsArray)
            , it])
    }

    const arr = await JSON.parse(req.body.members)

    if (arr.length > 0) {
        await arr.map(item => {
            changeUsers(item)
        })
    }

    await connection.query('UPDATE users SET clubs = ? WHERE userName = ?', [
        (req.body.ownerClubs), req.body.ownerName])


    await connection.query('UPDATE clubs SET ? WHERE id = ?', [
        JSON.parse(req.body.changedClub), req.params.id])

    await res.json({ 'message': 'User clubs change successfully' });
}

export const saveGrades = async (req, res) => {

    const connection = await connect()
    await connection.query('UPDATE clubs SET gardes = ? WHERE id = ?', [
        JSON.stringify(req.body.grades)
        , req.body.clubId])

    await res.json({ 'message': 'File uploaded successfully' });
}

export const newEvent = async (req, res) => {
    const connection = await connect()

    const current = await connection.query('SELECT events FROM clubs WHERE id = ?', [req.body.idClub])


    current[0][0].events.unshift(req.body)

    await connection.query('UPDATE clubs SET events = ? WHERE id = ?', [
        JSON.stringify(current[0][0].events)
        , req.body.idClub])

    res.json({ 'message': 'File uploaded successfully' });

}

export const newChat = async (req, res) => {
    const connection = await connect()

    const current = await connection.query('SELECT chat FROM clubs WHERE id = ?', [req.body.idClub])


    current[0][0].chat.unshift(req.body)


    await connection.query('UPDATE clubs SET chat = ? WHERE id = ?', [
        JSON.stringify(current[0][0].chat)
        , req.body.idClub])

    await res.json({ 'message': 'File uploaded successfully' });

}

export const newCalendarEvt = async (req, res) => {
    const connection = await connect()

    await connection.query('UPDATE clubs SET calendarEvents = ? WHERE id = ?', [
        JSON.stringify(req.body.calendarEvts)
        , req.body.clubId])

    // console.log(req.body)
    await res.json({ 'message': 'File uploaded successfully' });

}

export const newPoll = async (req, res) => {
    const connection = await connect()

    await connection.query('UPDATE clubs SET surveys = ? WHERE id = ?', [
        (req.body.polls)
        , req.body.clubId])


    // console.log(req.body)
    await res.json({ 'message': 'File uploaded successfully' });

}

export const addRes = async (req, res) => {
    const connection = await connect()

    const response = await connection.query('SELECT surveys FROM clubs WHERE id = ?', [req.body.clubId])

    let survey = response[0][0].surveys

    survey = await survey.map(item => {
        if (item.id === req.body.pollId) {

            return {
                id: item.id,
                title: item.title,
                banner: item.banner,
                questionary: item.questionary,
                answers: req.body.newAnswers,
                whoAnswered: [...item.whoAnswered, req.body.userAns]
            }
        }
        else {
            return { ...item };
        }
    })
    await connection.query('UPDATE clubs SET surveys = ? WHERE id = ?', [
        JSON.stringify(survey)
        , req.body.clubId])

    await res.json({ 'message': 'File uploaded successfully' });

}

export const deleteSurvey = async (req, res) => {
    const connection = await connect()

    const response = await connection.query('SELECT surveys FROM clubs WHERE id = ?', [req.body.clubId])

    try {
        fs.unlinkSync('public/images/surveys/' + `${req.body.clubId}-survey-${req.body.pollId}` + '.jpeg')
    } catch (err) {
        try { fs.unlinkSync('public/images/surveys/' + `${req.body.clubId}-survey-${req.body.pollId}` + '.png') }
        catch (err) {
            return err;
        }
    }

    let survey = response[0][0].surveys

    survey = await survey.filter(item => item.id !== req.body.pollId)

    await connection.query('UPDATE clubs SET surveys = ? WHERE id = ?', [
        JSON.stringify(survey)
        , req.body.clubId])

    console.log(survey);

    await res.json({ 'message': 'File uploaded successfully' });

}

export const sortMemebers = async (req, res) => {
    const connection = await connect()

    await connection.query('UPDATE clubs SET members = ? WHERE id = ?', [
        JSON.stringify(req.body.newMembers)
        , req.body.clubId])

    await res.json({ 'message': 'Info uploaded successfully' });

}

export const changeExists = async (req, res) => {
    const connection = await connect()

    if(req.body.which === 'chat'){
        await connection.query('UPDATE clubs SET existChat = ? WHERE id = ?', [
            req.body.newData
            , req.body.clubId])
    }
    else if (req.body.which === 'private'){
        await connection.query('UPDATE clubs SET clubLeader = ? WHERE id = ?', [
            req.body.newData
            , req.body.clubId])
    }
    else{
        await connection.query('UPDATE clubs SET existGrades = ? WHERE id = ?', [
            req.body.newData
            , req.body.clubId])
    }

    await res.json({ 'message': 'Info uploaded successfully' });

}
