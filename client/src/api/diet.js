import API from "./axios.config";


const diet = {
  getDietPlan: (pet_id) => {
    const url = `/pets/${pet_id}/plan`
    return API.get(url)
  },
  getDietFood: (pet_id) => {
    const url = `/pets/${pet_id}/plan/food-item`
    return API.get(url)
  },
  updateDietPlan: (pet_id, body) => {
    const url = `/pets/${pet_id}/plan`
    return API.put(url, body)
  },
  updateDietFood: (pet_id, food_id, body) => {
    const url = `/pets/${pet_id}/plan/food-item/${food_id}`
    return API.put(url, body)
  },
  creatDietPlan: (pet_id, body) => {
    const url = `/pets/${pet_id}/add-plan/`
    return API.post(url, body)
  },
  creatDietFood: (pet_id, body) => {
    const url = `/pets/${pet_id}/plan/add-food-item/`
    return API.post(url, body)
  }
}

export default diet
