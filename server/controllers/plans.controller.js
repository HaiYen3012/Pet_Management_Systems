const petService = require("../services/pets.service");
const userService = require("../services/users.service");
const planService = require("../services/plans.service");
const { ErrorHandler } = require("../helpers/error");

const createPlan = async (req, res) => {
    const { name, description, date_start, date_end } = req.body;

    const { pet_id } = req.params;
    // console.log("pet_id: ", pet_id);
    const pet = await petService.getPetById(pet_id);
    // console.log("req.pet: ", pet)
    if (!pet) {
        throw new ErrorHandler(404, "Pet not found");
    }
    if (+pet_id === pet.pet_id || req.user.roles.includes("admin")) {
        const planOfaPet = await planService.createPlan({
            name, 
            description, 
            date_start, 
            date_end,
            pet_id
        });

        // await petService.updatePetPlanId(pet_id, plan.plan_id);

        res.status(201).json({
            status: "success",
            planOfaPet,
        });
    } else {
        throw new ErrorHandler(401, "Unauthorized");
    }
};

const getPlanList = async (req, res) => {
    const { user_id } = req.user;
  
    const plans = await planService.getPlansByUser_id(user_id);
  
    return res.status(200).json(plans);
};

const getPlanByPet_id = async (req, res) => {
    const { user_id } = req.user;
    const { pet_id } = req.params;
    const user = await userService.getUserById(user_id);
    const pet = await petService.getPetById(pet_id);
    if (!user) {
        throw new ErrorHandler(404, "User not found");
    }
    if (!pet) {
        throw new ErrorHandler(404, "Pet not found");
    }
    if (+user_id === req.user.user_id || req.user.roles.includes("admin")) {
        const plan = await planService.getPlanByPet_id(pet_id);
        return res.status(200).json(plan);
    } else {
        throw new ErrorHandler(401, "Unauthorized");
    }
  };

  const updatePlan = async (req, res) => {
    const { user_id } = req.user;
    const { pet_id } = req.params;
    const user = await userService.getUserById(user_id);
    const pet = await petService.getPetById(pet_id);

    const { name, description, date_start, date_end } = req.body;
    if (!user) {
        throw new ErrorHandler(404, "User not found");
    }
    if (!pet) {
        throw new ErrorHandler(404, "Pet not found");
    }
    if (+user_id === req.user.user_id || req.user.roles.includes("admin")) {
        const results = await planService.updatePlan({
            name, 
            description, 
            date_start, 
            date_end,
            pet_id
        });

        return res.status(201).json(results);
    } else {
        throw new ErrorHandler(401, "Unauthorized");
    }
  };

  const deletePlan = async (req, res) => {
    const { user_id } = req.user;
    const { pet_id } = req.params;
    const user = await userService.getUserById(user_id);
    const pet = await petService.getPetById(pet_id);
    if (!user) {
        throw new ErrorHandler(404, "User not found");
    }
    if (!pet) {
        throw new ErrorHandler(404, "Pet not found");
    }
    if (+user_id === req.user.user_id || req.user.roles.includes("admin")) {
        const result = await planService.deletePlan(pet_id);
        if (!result) {
            throw new ErrorHandler(404, "Plan not found");
        }
        res.status(200).json(result);
    } else {
        throw new ErrorHandler(401, "Unauthorized");
    }
  };

module.exports = {
    createPlan,
    getPlanList,
    getPlanByPet_id,
    updatePlan,
    deletePlan
};