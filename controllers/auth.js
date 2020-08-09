const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const keys = require('../config/keys')



module.exports.login = async function(req, res) {
  const candidate = await User.findOne({email: req.body.email})

  if (candidate) {
    //Проверка пароля, пользователь существует
    const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
    if (passwordResult) {
      //генерация токена, пароли совпали
      const token = jwt.sign({
        email: candidate.email,
        userId: candidate._id
      }, keys.jwt, {expiresIn: 60 * 60})

      res.status(200).json({
        token: `Bearer ${token}`
      })
    } else {
      // Пароли не совпали
      res.status(401).json({
        message: 'пароли не совпадают! Попробуйте снова .'
      })
    }

  } else {
    //Пользователя нет , ошибка
    res.status(404).json({
      message: 'Пользователь с таким email не найден'
    })
  }
}


module.exports.register = async function(req, res) {
  //email password
  const candidate = await User.findOne({email: req.body.email})

  if(candidate) {
    //пользователь существует , нужно вернуть ошибку
    res.status(409).json({
      message: 'Такой email уже занят. Попробуйте другой'
    })
  } else {
    const salt = bcrypt.genSaltSync(10)
    const password = req.body.password
    //Нужно создать нового пользователя
    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(password, salt)
    })

    try {
      //Сохраняем полз. в БД
      await user.save()
      res.status(201).json(user)
    } catch(e) {
      // Оброботка ошибки
    }
  }
}