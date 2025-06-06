const {
  getVisitCount,
  getPaymentCount,
  getRevenueByYear,
} = require('../db/analysis.db')
const { ErrorHandler } = require('../helpers/error')

class AnalysisService {
  getVisitCount = async () => {
    try {
      return await getVisitCount()
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }
  getPaymentCount = async () => {
    try {
      return await getPaymentCount()
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }
  getRevenueByYear = async (year) => {
    try {
      return await getRevenueByYear(year)
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }
}

module.exports = new AnalysisService()
