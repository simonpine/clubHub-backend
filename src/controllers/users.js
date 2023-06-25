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

            await connection.query('UPDATE clubs SET members = ? WHERE id = ?', [
                JSON.stringify(newMemberArray)
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

    await connection.query('INSERT INTO clubs (id, title, gardes, clubBanner, members, clubOwner, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [req.body.id, req.body.title, req.body.grades, req.file.filename, req.body.members, req.body.clubOwner, req.body.description]
    )

    await connection.query('UPDATE users SET clubs = ? WHERE userName = ?', [
        req.body.clubsOfOwner, req.body.clubOwner])

    res.json({ 'message': 'File uploaded successfully' });
}


export const getClubs = async (req, res) => {
    const connection = await connect()

    const [rows] = await connection.query('SELECT * FROM clubs')

    res.json(rows)
}

export const getClub = async (req, res) => {
    const connection = await connect()

    const [rows] = await connection.query('SELECT * FROM clubs WHERE id = ?', [req.params.id])

    res.json(rows)
}

export const joinClub = async (req, res) => {

    const connection = await connect()

    await connection.query('UPDATE clubs SET members = ? WHERE id = ?', [
        JSON.stringify(req.body.newMembers), (req.body.clubId)])

    await connection.query('UPDATE users SET clubs = ? WHERE userName = ?', [
        JSON.stringify(req.body.clubsOfMember), req.body.newMember])

    res.json({ 'message': 'File uploaded successfully' });

}

export const exitClub = async (req, res) => {

    const connection = await connect()
    const [club] = await connection.query('SELECT * FROM clubs WHERE id = ?', [req.body.clubId])

    const newArrMembers = await club[0].members.filter(item => item !== req.body.userName)

    await connection.query('UPDATE clubs SET members = ? WHERE id = ?', [
        JSON.stringify(newArrMembers), (req.body.clubId)])



    const newArrClubs = await req.body.userClubs.filter(item => item.clubId !== req.body.clubId)


    await connection.query('UPDATE users SET clubs = ? WHERE userName = ?', [
        JSON.stringify(newArrClubs), (req.body.userName)])

    await connection.query('UPDATE users SET clubs = ? WHERE userName = ?', [
        JSON.stringify(req.body.clubsOfMember), req.body.newMember])

    res.json({ 'message': 'User clubs change successfully' });

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

    // const arr = await JSON.parse(req.body.members)
    if (club[0].members.length > 0) {
        await club[0].members.map(item => {
            changeUsers(item)
        })
    }



    const newClubsArray = await req.body.clubsOfOwner.filter(item => item.clubId !== req.params.id)


    await connection.query('UPDATE users SET clubs = ? WHERE userName = ?', [
        JSON.stringify(newClubsArray), req.body.clubOwner])

    await connection.query('DELETE FROM clubs WHERE id = ?', [req.params.id])


    res.json({ 'message': 'User clubs change successfully' });
    // console.log(req.body)
}