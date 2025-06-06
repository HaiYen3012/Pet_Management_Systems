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

  // foods && foods.map((food) => {

  // })
  // console.log(plan, food)
  const meal = {

  }

  const dietPlan = {
    name: plan.name,
    description: plan.description,
    duration: `${formatDateIsoString(plan.date_start)} - ${formatDateIsoString(plan.date_end)}`,
    meals: categorizeFoodByTime(foods)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />}
          style={{
            height: '60vh',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
          }}
        />
      </div>
    )
  }

  if (error || !(plan.name)) {
    return (
      <div className="flex justify-center items-center text-red-500 text-xl">
        Thú cưng hiện không có chế độ ăn
      </div>
    )
  }

  return (
    <div className="flex flex-col px-5">
      <h1 className="w-full text-3xl font-medium leading-10 text-black text-opacity-80 max-md:max-w-full">
        {dietPlan.name}
      </h1>
      <section className="flex flex-col justify-center mt-11 w-full bg-white rounded-sm border border-solid border-zinc-100 max-md:mt-10 max-md:max-w-full">
        <div className="flex flex-col p-6 w-full max-md:px-5 max-md:max-w-full">
          <div className="flex gap-7 flex-row ">
            <p className="w-[130px] text-base font-medium leading-6 text-black text-opacity-80">
              Chế độ ăn
            </p>
            <p className="text-sm leading-5 text-black text-opacity-80">
              {dietPlan.description}
            </p>
          </div>
          <div className="flex gap-7 items-center mt-2 ">
            <p className="w-[130px] text-base font-medium leading-6 text-black text-opacity-80">
              Thời gian áp dụng
            </p>
            <p className="text-base font-medium leading-6 text-black text-opacity-80">
              {dietPlan.duration}
            </p>
          </div>
        </div>
      </section>
      <div className="overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {dietPlan.meals.map((meal, index) => (
          <React.Fragment key={index}>
            <h2 className="mt-7 w-full text-base font-medium leading-6 text-black text-opacity-80 max-md:max-w-full">
              {formatTime(meal.name)}
            </h2>
            <div className="">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên thực phẩm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mô tả
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số lượng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đơn vị tính
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {meal.items.map((item, itemIndex) => (
                    <tr key={itemIndex}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {itemIndex + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default DietPlan
