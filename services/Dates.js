function getMonthName(numberMonth){
    const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[numberMonth];
}

function getFirstDay(date){
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return firstDay;
}

function getLastDay(date){
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return lastDay;
}

module.exports = {
    getMonthName,
    getFirstDay,
    getLastDay
}