const analysisService = require('../services/analysis.service')

const getData = async (req, res) => {
  const { year } = req.params
  const visitCount = await analysisService.getVisitCount()
  const paymentCount = await analysisService.getPaymentCount()
  const revenueData = await analysisService.getRevenueByYear(year)
  return res.status(200).json({
    visitCount,
    paymentCount,
    revenueData,
  })
}

module.exports = {
  getData,
}
