function getMonthName(numberMonth){
    const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[numberMonth];
}

module.exports = {
    getMonthName
}