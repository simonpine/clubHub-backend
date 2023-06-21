import { connect } from "../database"

const fs = require("fs");



export const getUsers = async (req, res) => {
    const connection = await connect()

    const [rows] = await connection.query('SELECT * FROM users')

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
// export const getTask = async(req, res) => {
//     // res.send(req.params.id)

//     const connection = await connect()

//     const [rows] = await connection.query('SELECT * FROM tasks WHERE id = ?', [req.params.id])

//     res.json(rows[0])
// }
// export const getTasksCount = async(req, res) => {
//     const connection = await connect()

//     const [rows] = await connection.query('SELECT COUNT(*) FROM tasks')

//     res.json(rows[0]['COUNT(*)'])
// }
export const saveUser = async (req, res) => {
    const connection = await connect()
    const [result] = await connection.query('INSERT INTO users (userName, clubs, pasword, question, answer) VALUES (?, ?, ?, ?, ?)',
        [req.body.userName, JSON.stringify(req.body.clubs), req.body.pasword, req.body.question, req.body.answer]
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


    result.affectedRows > 0 ? res.json('Se actualizo la tarea ' + req.params.id) : res.json('No se afecto nada')

}


// export const uploadPhoto = async (req, res) => {

//     const {file, body: {name}} = req
//     const re = file.originalname.split('.')
//     const fileName = name + '.' + re[re.length - 1]

//     await pipeline(
//         file.stream,
//         fs.createWriteStream(`${__dirname}/../public/images/${fileName}`)
//         )

//     // console.log()
//     // res.send("Yeap")
//     // console.log(req.body.name)


// }


export const uploadPhoto = async (req, res) => {

    // req.body.old !== 'null' & req.body.old !== req.file.filename && fs.unlinkSync('public/images/' + req.body.old);
    // console.log(req.body)
    const connection = await connect()
    const [result] = await connection.query('UPDATE users SET userImg = ? WHERE userName = ?', [
        req.file.filename
        , req.body.name])
}



export const createClub = async (req, res) => {

    const connection = await connect()

    const [result] = await connection.query('INSERT INTO clubs (id, title, gardes, clubBanner, members, clubOwner, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [req.body.id, req.body.title, req.body.grades, req.file.filename, req.body.members, req.body.clubOwner, req.body.description]
    )

    const a = await connection.query('UPDATE users SET clubs = ? WHERE userName = ?', [
        JSON.stringify([...req.body.currtentClubs,
        {
            clubId: req.body.id,
            clubDescription: req.body.description,
            own: true,
            clubTitle: req.body.title,
            clubBanner: req.file.filename,
        }
        ])
        , req.body.clubOwner])

    res.json({ ...req.body, id: result.insertId })
}


