import { Restaurant, Product, RestaurantCategory, ProductCategory } from '../models/models.js'

const index = async function (req, res) {
  try {
    const restaurants = await Restaurant.findAll(
      {
        attributes: { exclude: ['userId','promoted'] },
        include:
      {
        model: RestaurantCategory,
        as: 'restaurantCategory'
      },
        order:[['promoted','DESC'], [[{ model: RestaurantCategory, as: 'restaurantCategory' }, 'name', 'ASC']]]
      }
    )
    res.json(restaurants)
  } catch (err) {
    res.status(500).send(err)
  }
}

const indexOwner = async function (req, res) {
  try {
    const restaurants = await Restaurant.findAll(
      {
        attributes: { exclude: ['userId'] },
        where: { userId: req.user.id },
        include: [{
          model: RestaurantCategory,
          as: 'restaurantCategory'
        }],
        order: [['promoted','DESC']]
      })
    res.json(restaurants)
  } catch (err) {
    res.status(500).send(err)
  }
}

const create = async function (req, res) {
  const newRestaurant = Restaurant.build(req.body)
  newRestaurant.userId = req.user.id // usuario actualmente autenticado
  try {
    const restaurant = await newRestaurant.save()
    res.json(restaurant)
  } catch (err) {
    res.status(500).send(err)
  }
}

const show = async function (req, res) {
  // Only returns PUBLIC information of restaurants
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId, {
      attributes: { exclude: ['userId'] },
      include: [{
        model: Product,
        as: 'products',
        include: { model: ProductCategory, as: 'productCategory' }
      },
      {
        model: RestaurantCategory,
        as: 'restaurantCategory'
      }],
      order: [[{ model: Product, as: 'products' }, 'order', 'ASC']]
    }
    )
    res.json(restaurant)
  } catch (err) {
    res.status(500).send(err)
  }
}

const update = async function (req, res) {
  try {
    await Restaurant.update(req.body, { where: { id: req.params.restaurantId } })
    const updatedRestaurant = await Restaurant.findByPk(req.params.restaurantId)
    res.json(updatedRestaurant)
  } catch (err) {
    res.status(500).send(err)
  }
}

const destroy = async function (req, res) {
  try {
    const result = await Restaurant.destroy({ where: { id: req.params.restaurantId } })
    let message = ''
    if (result === 1) {
      message = 'Sucessfuly deleted restaurant id.' + req.params.restaurantId
    } else {
      message = 'Could not delete restaurant.'
    }
    res.json(message)
  } catch (err) {
    res.status(500).send(err)
  }
}

const promoted = async function (req, res) {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId)
    if (!restaurant) {
      return res.status(404).send('Restaurant not found')
    }
    if (restaurant.promoted) {
      // Si ya está promocionado, se desactiva la promoción
      restaurant.promoted = false
      await restaurant.save()
    } else {
      // Si no está promocionado, se activa y se desactivan otros que estén activos
      restaurant.promoted = true
      const restaurantAlreadyPromoted = await Restaurant.findOne({ where: { promoted: true } })
      if (restaurantAlreadyPromoted) {
        restaurantAlreadyPromoted.promoted = false
        await restaurantAlreadyPromoted.save()
      }
      await restaurant.save()
    }
    res.json(restaurant)
  } catch (err) {
    res.status(500).send(err)
  }
}



const RestaurantController = {
  index,
  indexOwner,
  create,
  show,
  update,
  destroy,
  promoted
}
export default RestaurantController
