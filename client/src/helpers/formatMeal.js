export function formatTimeMealToVN(data){
  switch (data) {
    case 'breakfast':
      return "Bữa sáng"
    case 'lunch':
      return "Bữa trưa"
    case 'dinner':
      return "Bữa tối"
    default:
      return "Bữa trưa"
      break;
  }
}

export function formatTimeMealToE(data){
  switch (data.toLowerCase()) {
    case 'bữa sáng':
      return "breakfast"
    case 'bữa trưa':
      return "lunch"
    case 'bữa tối':
      return "dinner"
    default:
      return "lunch"
      break;
  }
}