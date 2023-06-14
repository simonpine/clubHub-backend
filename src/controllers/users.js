import { connect } from "../database"

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

    res.json({...req.body, id: result.insertId})
}
// export const deleteTask = async(req, res) => {
//     const connection = await connect()

//     const [result] = await connection.query('DELETE FROM tasks WHERE id = ?', [req.params.id])

//     result.affectedRows > 0? res.json('Se elimino la tarea ' + req.params.id) : res.json('No se afecto nada')
// }
// export const updateTasks = async(req, res) => {
//     const connection = await connect()

//     const [result] = await connection.query('UPDATE tasks SET ? WHERE id = ?', [req.body, req.params.id])

//     result.affectedRows > 0? res.json('Se actualizo la tarea ' + req.params.id) : res.json('No se afecto nada')

// }
