const pool = require('../config')

const initData = {
  appointmentData: [
    {
      month: '1',
      count: '0',
      sum: 0,
    },
    {
      month: '2',
      count: '0',
      sum: 0,
    },
    {
      month: '3',
      count: '1',
      sum: 0,
    },
    {
      month: '4',
      count: '2',
      sum: 0,
    },
    {
      month: '5',
      count: '3',
      sum: 0,
    },
  ],
  beautyData: [
    {
      month: '5',
      count: '5',
      sum: 500,
    },
  ],
  storageData: [
    {
      month: '5',
      count: '1',
      sum: 100,
    },
  ],
}

const getVisitCount = async () => {
  const { rows: visitCount } = await pool.query(`
    SELECT count(*)
    FROM public."log_login" 
    WHERE type_user = 'customer'
  `)
  return { visit: visitCount[0].count }
}

const getPaymentCount = async () => {
  const { rows: appointmentOrder } = await pool.query(`
    SELECT count(*), SUM(total)
    FROM public."appointment_orders" 
  `)
  const { rows: beautyOrder } = await pool.query(`
    SELECT count(*), SUM(total)
    FROM public."beauty_orders" 
  `)
  const { rows: storageOrder } = await pool.query(`
    SELECT count(*), SUM(total)
    FROM public."storage_orders" 
  `)
  const totalPayment =
    parseInt(appointmentOrder[0].count) +
    parseInt(beautyOrder[0].count) +
    parseInt(storageOrder[0].count)
  return {
    payment: totalPayment,
    service: {
      appointment: {
        total: appointmentOrder[0].sum,
        percent: (appointmentOrder[0].count / totalPayment) * 100,
        unit: 'vnđ',
      },
      beauty: {
        total: beautyOrder[0].sum,
        percent: (beautyOrder[0].count / totalPayment) * 100,
        unit: 'vnđ',
      },
      storage: {
        total: storageOrder[0].sum,
        percent: (storageOrder[0].count / totalPayment) * 100,
        unit: 'vnđ',
      },
    },
  }
}

const getRevenueByYear = async (year) => {
  let { rows: appointmentData } = await pool.query(
    `
    SELECT EXTRACT(MONTH FROM created_at) as month, count(*), SUM(total)
    FROM (SELECT * FROM public."appointment_orders" WHERE EXTRACT(YEAR FROM created_at) = $1) as appointment_orders
    GROUP BY EXTRACT(MONTH FROM created_at);
  `,
    [year],
  )
  let { rows: beautyData } = await pool.query(
    `
    SELECT EXTRACT(MONTH FROM create_at) as month, count(*), SUM(total)
    FROM (SELECT * FROM public."beauty_orders" WHERE EXTRACT(YEAR FROM create_at) = $1) as beauty_orders
    GROUP BY EXTRACT(MONTH FROM create_at);
  `,
    [year],
  )
  let { rows: storageData } = await pool.query(
    `
    SELECT EXTRACT(MONTH FROM create_at) as month, count(*), SUM(total)
    FROM (SELECT * FROM public."storage_orders" WHERE EXTRACT(YEAR FROM create_at) = $1) as storage_orders
    GROUP BY EXTRACT(MONTH FROM create_at);
  `,
    [year],
  )

  for (let i = 1; i <= 12; ++i) {
    let base = {
      month: String(i),
      count: '0',
      sum: 0,
    }
    if (!appointmentData.find((e) => e.month == i)) {
      appointmentData = [base, ...appointmentData]
    }
    if (!beautyData.find((e) => e.month == i)) {
      beautyData = [base, ...beautyData]
    }
    if (!storageData.find((e) => e.month == i)) {
      storageData = [base, ...storageData]
    }
  }

  appointmentData.sort((a, b) => parseInt(a.month) - parseInt(b.month))
  beautyData.sort((a, b) => parseInt(a.month) - parseInt(b.month))
  storageData.sort((a, b) => parseInt(a.month) - parseInt(b.month))

  return {
    year: year,
    unit: 'vnđ',
    appointmentData,
    beautyData,
    storageData,
  }
}
module.exports = {
  getVisitCount,
  getPaymentCount,
  getRevenueByYear,
}
