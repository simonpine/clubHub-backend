import { Router } from "express";
import multer from "multer";
import path from "path";

import { saveUser, deleteUser, getTask, getUsers, getTasksCount, updateUser, getUsersList, getUser, getUserName, uploadPhoto, createClub, getClubs } from '../controllers/users'

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
 *      summary: Get all usersNames
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