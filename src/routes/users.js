import { Router } from "express";
import multer from "multer";
// import path from "path";

import { saveUser, deleteUser, getClub, getUsers, joinClub, updateUser, getUsersList, getUser, getUserName, uploadPhoto, createClub, getClubs, exitClub, deleteClub, updateClub, saveGrades, newEvent, newChat, newCalendarEvt, newPoll, addRes, deleteSurvey, sortMemebers, changeExists } from '../controllers/users'

const router = Router()

/**
 * @swagger
 * /tasks:
 *  get:
 *      summary: Get all users
 */
router.get('/users', getUsers)
/**
 * @swagger
 * /tasks:
 *  get:
 *      summary: Get all usersNames
 */
router.get('/users/list', getUsersList)
/**
 * @swagger
 * /tasks:
 *  get:
 *      summary: Get user by name
 */
router.get('/user/:id', getUser)
/**
 * @swagger
 * /tasks:
 *  get:
 *      summary: Get all usersNames
 */
router.get('/userName/:id', getUserName)
// /**
//  * @swagger
//  * /tasks/count:
//  *  get:
//  *      summary: Get all task counter
//  */
// router.get('/tasks/count', getTasksCount)
// /**
//  * @swagger
//  * /task/:id:
//  *  get:
//  *      summary: Get a task by id
//  */
// router.get('/task/:id', getTask)
/**
 * @swagger
 * /tasks:
 *  post:
 *      summary: Create a new user
 */
router.post('/users', saveUser)
/**
 * @swagger
 * /users/:id:
 *  delete:
 *      summary: Delete a user by name
 */
router.delete('/users/:id', deleteUser)
/**
 * @swagger
 * /user/:id:
 *  put:
 *      summary: Update a user by id
 */
router.put('/user/:id', updateUser)



// const upload = multer()
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/usersImg')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: storage
})

/**
 * @swagger
 * /user/:id:
 *  post:
 *      summary: Add a user img
 */
router.post('/user/photo/upload', upload.single('image'), uploadPhoto)

const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/banners')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload2 = multer({
    storage: storage2
})

/**
 * @swagger
 * /clubs/upload:
 *  post:
 *      summary: Create new club
 */
router.post('/clubs/upload', upload2.single('image'), createClub)

export default router

/**
 * @swagger
 * /clubs:
 *  get:
 *      summary: Get all clubes
 */
router.get('/clubs', getClubs)

/**
 * @swagger
 * /tasks:
 *  get:
 *      summary: Get an spesific club
 */
router.get('/club/:id', getClub)

/**
 * @swagger
 * /user/:id:
 *  put:
 *      summary: Add a memebr to a club
 */
router.put('/clubs/join', joinClub)

/**
 * @swagger
 * /userExitClub:
 *  put:
 *      summary: delete a memeber from a club
 */
router.put('/userExitClub', exitClub)

/**
 * @swagger
 * /clubs/:id:
 *  delete:
 *      summary: delete a club and the info of it
 */
router.delete('/clubs/:id', deleteClub)

/**
 * @swagger
 * /club/:id:
 *  put:
 *      summary: Update the club info
 */
router.put('/club/:id', upload2.single('image'), updateClub)

/**
 * @swagger
 * /club/setgardes:
 *  put:
 *      summary: Save the changes of the grades
 */
// router.put('/club/setgardes', saveGrades)
router.post('/club/grades', saveGrades)


const storage3 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/chats')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload3 = multer({
    storage: storage3
})


/**
 * @swagger
 * /club/events:
 *  put:
 *      summary: Upload a new message to events section in clubs
 */
// router.put('/club/setgardes', saveGrades)
router.post('/club/events', upload3.single('file'), newEvent)

/**
 * @swagger
 * /club/chat:
 *  put:
 *      summary: Upload a new message to greup chat section in clubs
 */
// router.put('/club/setgardes', saveGrades)
router.post('/club/chat', upload3.single('file'), newChat)

/**
 * @swagger
 * /club/calendar:
 *  put:
 *      summary: Upload a new event to calendar section in clubs
 */
router.post('/club/calendar', newCalendarEvt)

const storage4 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/surveys')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload4 = multer({
    storage: storage4
})

/**
 * @swagger
 * /club/addSurvey:
 *  put:
 *      summary: Upload a new survey to a club
 */
router.post('/club/addSurvey', upload4.single('image'), newPoll);

/**
 * @swagger
 * /club/addRes:
 *  put:
 *      summary: Upload a new survey to a club
 */

router.post('/club/addRes', addRes);

/**
 * @swagger
 * /club/deleteSurvey:
 *  delete:
 *      summary: delete a survey of a club
 */
router.delete('/club/deleteSurvey', deleteSurvey);

/**
 * @swagger
 * /club/sortMembers:
 *  post:
 *      summary: resort the members of the leaderboard
 */
router.post('/club/sortMembers', sortMemebers);

/**
 * @swagger
 * /club/changeExists:
 *  post:
 *      summary: change the list of the club functions
 */
router.post('/club/changeExists', changeExists);