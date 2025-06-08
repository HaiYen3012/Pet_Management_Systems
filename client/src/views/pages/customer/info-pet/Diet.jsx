import * as React from 'react'
import 'tailwindcss/tailwind.css'
import { useEffect, useState } from 'react'
import { Spin } from 'antd'
import diet from 'api/diet'
import { formatDateIsoString } from 'helpers/formartdate'
import { LoadingOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'

const formatTime = (data) => {
  switch (data) {
    case 'breakfast':
      return "Bữa sáng"
    case 'lunch':
      return "Bữa trưa"
    case 'dinner':
      return "Bữa tối"
    default:
      break;
  }
}

function categorizeFoodByTime(foodArray) {
  const meals = [
    {
      name: 'breakfast',
      items: []
    },
    {
      name: 'lunch',
      items: []
    },
    {
      name: 'dinner',
      items: []
    }
  ];

  foodArray.forEach(food => {
    const foodItem = {
      name: food.name,
      description: food.description,
      unit: food.unit,
      amount: food.amount
    };

    switch (food.time) {
      case 'breakfast':
        meals[0].items.push(foodItem);
        break;
      case 'lunch':
        meals[1].items.push(foodItem);
        break;
      case 'dinner':
        meals[2].items.push(foodItem);
        break;
      default:
        console.log(`Unknown time category: ${food.time}`);
    }
  });

  return meals;
}

function DietPlan({ selectedPet }) {
  const [plan, setPlan] = useState({})
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { slug } = useParams()

  useEffect(() => {
    const fetchDietData = async () => {
      try {
        const [foodRes, planRes] = await Promise.all([
          diet.getDietFood(slug),
          diet.getDietPlan(slug)
        ]);

        if (foodRes.data && foodRes.data.length > 0) {
          console.log(foodRes.data);
          setFoods(foodRes.data)
        }
        if (planRes.data && planRes.data.length > 0) {
          setPlan(planRes.data[0])
        }

        if (!(foodRes.data && foodRes.data.length > 0) && !(planRes.data && planRes.data.length > 0)) {
          setError(true);
        }
      } catch (error) {
        setError(true);
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchDietData();
  }, [slug])

  const dietPlan = {
    name: plan.name,
    description: plan.description,
    duration: `${formatDateIsoString(plan.date_start)} - ${formatDateIsoString(plan.date_end)}`,
    meals: categorizeFoodByTime(foods)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 flex justify-center items-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 40, color: '#f59e0b' }} spin />}
            style={{
              height: '100px',
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
            }}
          />
          <p className="text-amber-600 font-medium mt-4 text-center">Đang tải chế độ ăn...</p>
        </div>
      </div>
    )
  }

  if (error || !(plan.name)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 flex justify-center items-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Không có dữ liệu</h3>
          <p className="text-red-500 text-lg">Thú cưng hiện không có chế độ ăn</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-600 mb-2">
            {dietPlan.name}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto rounded-full"></div>
        </div>

        {/* Diet Plan Info Card */}
        <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden border border-yellow-100">
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-6">
            <h2 className="text-2xl font-bold text-white mb-2">Thông tin chế độ ăn</h2>
            <p className="text-yellow-100">Chi tiết về kế hoạch dinh dưỡng</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Mô tả chế độ ăn</p>
                  <p className="text-lg text-gray-800">{dietPlan.description}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m4 0V9a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0h-4m-4 0H8m8 0v2m-8-2v2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Thời gian áp dụng</p>
                  <p className="text-lg font-semibold text-amber-600">{dietPlan.duration}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meals Section */}
        <div className="space-y-8">
          {dietPlan.meals.map((meal, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-yellow-100">
              {/* Meal Header */}
              <div className="bg-gradient-to-r from-yellow-300 to-amber-400 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{formatTime(meal.name)}</h3>
                </div>
              </div>

              {/* Meal Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-yellow-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-amber-700 uppercase tracking-wider">
                        STT
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-amber-700 uppercase tracking-wider">
                        Tên thực phẩm
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-amber-700 uppercase tracking-wider">
                        Mô tả
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-amber-700 uppercase tracking-wider">
                        Số lượng
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-amber-700 uppercase tracking-wider">
                        Đơn vị tính
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-yellow-100">
                    {meal.items.map((item, itemIndex) => (
                      <tr key={itemIndex} className="hover:bg-yellow-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-white">{itemIndex + 1}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-base font-semibold text-gray-900">{item.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs">{item.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                            {item.amount}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                            {item.unit}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DietPlan