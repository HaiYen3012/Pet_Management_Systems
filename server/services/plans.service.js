const {
    createPlanDb,
    getPlansByUser_idDb,
    getPlanByPet_idDb,
    updatePlanDb,
    deletePlanDb
  } = require("../db/plans.db");
  const { ErrorHandler } = require("../helpers/error");
class PlanService {
    createPlan = async (planOfaPet) => {
      try {
        return await createPlanDb(planOfaPet);
      } catch (error) {
        throw new ErrorHandler(error.statusCode, error.message);
      }
    };
    getPlansByUser_id = async (user_id) => {
        try {
            const plans = await getPlansByUser_idDb(user_id);
            return plans;
        } catch (error) {
            throw new ErrorHandler(error.statusCode, error.message);
        }
    };
    getPlanByPet_id = async (pet_id) => {
        try {
            const plan = await getPlanByPet_idDb(pet_id);
            return plan;
        } catch (error) {
            throw new ErrorHandler(error.statusCode, error.message);
        }
    };
    updatePlan = async (plan) => {
        // const { name, description, date_start, date_end, pet_id } = plan;
        const errors = {};
        try {
            if (Object.keys(errors).length > 0) {
            throw new ErrorHandler(403, errors);
            }
            return await updatePlanDb(plan);
        } catch (error) {
            throw new ErrorHandler(error.statusCode, error.message);
        }
    };
    deletePlan = async (pet_id) => {
        try {
            return await deletePlanDb(pet_id);
        } catch (error) {
            throw new ErrorHandler(error.statusCode, error.message);
        }
    };

}


module.exports = new PlanService();